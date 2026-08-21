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
    model_name="openai/gpt-oss-20b",
    temperature=0.2,
    api_key=os.getenv("GROQ_API_KEY")
)
llm_with_tools = llm.bind_tools(tools)

def agent_node(state: AgentState):
    messages = state["messages"]
    
    if not any(isinstance(m, SystemMessage) for m in messages):
        sys_msg = SystemMessage(content="You are a helpful AI Career Coach for students. Use tools to analyze skills, find gaps, and generate roadmaps.")
        messages = [sys_msg] + messages
        
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> Literal["tools", "__end__"]:
    messages = state["messages"]
    last_message = messages[-1]
    
    if last_message.tool_calls:
        return "tools"
    return "__end__"

workflow = StateGraph(AgentState)

workflow.add_node("agent", agent_node)
workflow.add_node("tools", tool_node)

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

app_graph = workflow.compile()
