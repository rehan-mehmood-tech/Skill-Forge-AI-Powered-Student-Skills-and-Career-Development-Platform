import os
import glob
import json
import uuid
from pathlib import Path
from dotenv import load_dotenv

import google.generativeai as genai
from fastembed import TextEmbedding
from supabase import create_client, Client
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

# Config
os.environ["HF_TOKEN"] = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DATA_DIR = Path(__file__).parent.parent.parent / "data" / "knowledge_base"

def parse_frontmatter(content: str):
    metadata = {}
    clean_content = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            clean_content = parts[2].strip()
            for line in frontmatter.strip().split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    metadata[k.strip()] = v.strip()
    return metadata, clean_content

def load_documents():
    docs = []
    
    if not DATA_DIR.exists():
        print(f"Data directory not found: {DATA_DIR}")
        return docs

    # Load MD files
    for filepath in glob.glob(str(DATA_DIR / "*.md")):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            metadata, clean_content = parse_frontmatter(content)
            metadata['source'] = os.path.basename(filepath)
            docs.append({"content": clean_content, "metadata": metadata})
            
    # Load JSON files
    for filepath in glob.glob(str(DATA_DIR / "*.json")):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Flatten or format JSON content
            content_str = json.dumps(data, indent=2)
            metadata = {'source': os.path.basename(filepath), 'domain': 'python', 'title': 'System Benchmarks'}
            docs.append({"content": content_str, "metadata": metadata})
            
    return docs

def process_documents():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Missing Supabase credentials in .env")
        return

    print("Initializing Supabase and fastembed embeddings...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    embedding_model = TextEmbedding(model_name="BAAI/bge-base-en-v1.5")
    
    def embed_text(text: str) -> list[float]:
        return next(embedding_model.embed([text])).tolist()

    docs = load_documents()
    print(f"Loaded {len(docs)} documents from {DATA_DIR.name}.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        length_function=len,
    )

    total_chunks = 0
    records_to_insert = []

    print("Chunking and generating 768-dimensional embeddings...")
    for doc in docs:
        content = doc["content"]
        metadata = doc["metadata"]
        domain = metadata.get("domain", "python")
        title = metadata.get("title", metadata.get("source"))

        chunks = splitter.split_text(content)
        
        for chunk in chunks:
            embedding = embed_text(chunk)

            record = {
                "id": str(uuid.uuid4()),
                "source_title": title,
                "source_type": "markdown",
                "domain": domain,
                "content": chunk,
                "embedding": embedding,
                "metadata": metadata
            }
            records_to_insert.append(record)
            total_chunks += 1

    if records_to_insert:
        print(f"Inserting {total_chunks} chunks into Supabase 'knowledge_base_chunks' table...")
        res = supabase.table("knowledge_base_chunks").insert(records_to_insert).execute()
        
        # Verify execution
        if hasattr(res, 'data') and len(res.data) > 0:
            print("Database insertion successful!")
        else:
            print("Warning: Insertion completed. (Please verify in Supabase dashboard).")
    else:
        print("No chunks generated.")

if __name__ == "__main__":
    process_documents()
