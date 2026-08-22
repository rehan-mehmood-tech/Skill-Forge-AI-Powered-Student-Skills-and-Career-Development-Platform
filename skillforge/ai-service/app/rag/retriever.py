import os
from typing import List, Dict, Optional
from supabase import create_client, Client
import google.generativeai as genai

class KnowledgeBaseRetriever:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        os.environ["HF_TOKEN"] = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase credentials are required in environment.")
            
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self._embedding_model = None

    @property
    def embedding_model(self):
        if self._embedding_model is None:
            from fastembed import TextEmbedding
            self._embedding_model = TextEmbedding(model_name="BAAI/bge-base-en-v1.5")
        return self._embedding_model

    def embed_query(self, query_text: str) -> List[float]:
        """Converts query text into a 768-dimensional float vector."""
        return next(self.embedding_model.embed([query_text])).tolist()

    def retrieve_relevant_chunks(self, query_text: str, domain: Optional[str] = None, top_k: int = 4, similarity_threshold: float = 0.1) -> List[Dict]:
        """Queries Supabase knowledge_base_chunks using the match_knowledge_chunks RPC."""
        query_embedding = self.embed_query(query_text)
        
        # Prepare parameters for the pgvector Postgres function (RPC)
        rpc_params = {
            'query_embedding': query_embedding,
            'match_threshold': similarity_threshold,
            'match_count': top_k
        }
        
        # Assuming the RPC accepts an optional filter_domain parameter
        if domain:
            rpc_params['filter_domain'] = domain
            
        try:
            # We call an assumed Supabase RPC here to perform the vector Cosine `<=>` distance check
            res = self.supabase.rpc('match_knowledge_chunks', rpc_params).execute()
            matches = res.data
        except Exception as e:
            print(f"Retriever RPC call failed, falling back to local filter: {e}")
            q = self.supabase.table('knowledge_base_chunks').select('*')
            if domain:
                q = q.eq('domain', domain)
            res = q.execute()
            
            def cosine_sim(v1, v2):
                import math
                dot = sum(a*b for a,b in zip(v1, v2))
                mag1 = math.sqrt(sum(a*a for a in v1))
                mag2 = math.sqrt(sum(b*b for b in v2))
                return dot / (mag1*mag2) if mag1*mag2 else 0

            matches = []
            for row in res.data:
                emb = row.get('embedding')
                if emb:
                    if isinstance(emb, str):
                        import json
                        try:
                            emb = json.loads(emb)
                        except Exception:
                            continue
                    sim = cosine_sim(query_embedding, emb)
                    # print(f"DEBUG sim: {sim}")
                    if sim >= similarity_threshold:
                        row['similarity'] = sim
                        matches.append(row)
            matches = sorted(matches, key=lambda x: x.get('similarity', 0), reverse=True)[:top_k]
            
        structured_matches = []
        for match in matches:
            structured_matches.append({
                'title': match.get('source_title', match.get('metadata', {}).get('title', 'Untitled')),
                'content': match.get('content'),
                'similarity_score': round(match.get('similarity', 0.0), 3),
                'domain': match.get('domain'),
                'source': match.get('metadata', {}).get('source', 'Unknown')
            })
            
        return structured_matches

    def format_context_for_llm(self, chunks: List[Dict]) -> str:
        """Formats retrieved documents into clean, structured XML/Markdown blocks for the LLM context window."""
        if not chunks:
            return "<context>\nNo relevant knowledge base documents found.\n</context>"
            
        context_blocks = ["<context>"]
        
        for idx, chunk in enumerate(chunks, 1):
            title = chunk.get('title', 'Untitled')
            domain = chunk.get('domain', 'general')
            source = chunk.get('source', 'Unknown')
            content = chunk.get('content', '')
            
            block = f"""<document index="{idx}">
<metadata>
  <title>{title}</title>
  <domain>{domain}</domain>
  <source>{source}</source>
</metadata>
<content>
{content}
</content>
</document>"""
            context_blocks.append(block)
            
        context_blocks.append("</context>")
        return "\n\n".join(context_blocks)
