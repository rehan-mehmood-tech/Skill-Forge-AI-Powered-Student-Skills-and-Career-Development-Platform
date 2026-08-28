import os
from typing import Literal
from dotenv import load_dotenv

from langchain_core.messages import BaseMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from app.agent.state import AgentState
from app.agent.tools import (
    analyze_student_skills,
    calculate_gap,
    search_knowledge_base,
    generate_roadmap
)

load_dotenv()

tools = [analyze_student_skills, calculate_gap, search_knowledge_base, generate_roadmap]
tool_node = ToolNode(tools)

# Initialize Groq LLM
llm = ChatGroq(
    model_name=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
    temperature=0.2,
    api_key=os.getenv("GROQ_API_KEY")
)
llm_with_tools = llm.bind_tools(tools)

def agent_node(state: AgentState):
    # Keep only the last 10 messages to prevent token overflow
    messages = state["messages"][-10:] if len(state["messages"]) > 10 else state["messages"]
    target_role = state.get("target_role", "Software Engineer")
    
    # Ensure recursion_count exists
    recursion_count = state.get("recursion_count", 0)
    
    if not any(isinstance(m, SystemMessage) for m in messages):
        sys_msg_text = f"""You are the SkillForge AI Career Copilot, an elite technical mentor and career strategist for software engineering students.

RULES:
1. ONLY answer questions related to software engineering, career roadmaps, tech stacks, coding, cloud/devops, system design, and technical interview preparation.
2. If the user asks about non-technical topics, politely refuse.
3. Listen strictly to the user's current intent, do NOT force every response to {target_role} unless explicitly asked:
   - If user asks about Android Development: Provide an Android specific roadmap (Kotlin, Jetpack Compose, Coroutines, Gradle, Clean Architecture).
   - If user asks about AI Engineering: Provide an AI specific roadmap (Python, PyTorch, LangGraph, Vector DBs, RAG pipelines).
   - Only reference {target_role} if the user explicitly asks "What should I learn next for my current track?".
4. For all technical roadmaps:
   - Provide a direct, structured 3-phase action path (Core Fundamentals, Frameworks/Tools, Production Deployment).
   - Ground your recommendations in 2026 industry standards.
   - Keep answers clear, concise, and actionable."""
        sys_msg = SystemMessage(content=sys_msg_text)
        messages = [sys_msg] + messages
        
    response = llm_with_tools.invoke(messages)
    return {"messages": [response], "recursion_count": recursion_count + 1}

def should_continue(state: AgentState) -> Literal["tools", "__end__"]:
    messages = state["messages"]
    last_message = messages[-1]
    recursion_count = state.get("recursion_count", 0)
    
    # Hard stop after 5 tool iterations to prevent infinite loops
    if last_message.tool_calls and recursion_count < 5:
        return "tools"
    return "__end__"

workflow = StateGraph(AgentState)

workflow.add_node("agent", agent_node)
workflow.add_node("tools", tool_node)

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

app_graph = workflow.compile()
