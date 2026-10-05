"""
jnana.ai — Stage 2: Supabase pgvector Ingestion Pipeline
Generates 768-dimensional embeddings using Google Gemini models/gemini-embedding-001
with checkpoint caching, rate-limit resilience, and automatic resume.
"""

import json
import os
import sys
import time
import re
from google import genai
from google.genai import types

sys.stdout.reconfigure(encoding='utf-8')

# Paths
DATA_PATH = r"D:\productive\jnana.ai\data\canonical\jnana_gita_complete.json"
CACHE_PATH = r"D:\productive\jnana.ai\data\canonical\embeddings_checkpoint_768.json"
ENV_PATH = r"D:\productive\jnana.ai\backend\.env"
SQL_OUTPUT_PATH = r"D:\productive\jnana.ai\data\canonical\seed_verses_768.sql"
JSON_EMB_PATH = r"D:\productive\jnana.ai\data\canonical\jnana_gita_embedded_768.json"

def load_env(path):
    env_vars = {}
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    return env_vars

env = load_env(ENV_PATH)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or env.get("GEMINI_API_KEY")

print("=" * 70)
print("jnana.ai — STAGE 2: SUPABASE VECTOR INGESTION PIPELINE")
print("=" * 70)

if not GEMINI_API_KEY:
    print("\n[ERROR] GEMINI_API_KEY is not set in backend/.env!")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

def make_semantic_chunk(v):
    return (
        f"[{v['scene_title']} — Chapter {v['chapter']}, Verse {v['verse']}]\n"
        f"Speaker: {v['speaker']}\n"
        f"Battlefield Context & Narrative Story: {v['scene_story']}\n"
        f"Sacred Teaching: {v['translation']}\n"
        f"Sanskrit Shloka: {v['sanskrit']}\n"
        f"Transliteration: {v['transliteration']}"
    )

def main():
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found!")
        sys.exit(1)

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        verses = json.load(f)

    print(f"Loaded {len(verses)} verses from {DATA_PATH}")

    # Load existing checkpoint if available
    checkpoint = {}
    if os.path.exists(CACHE_PATH):
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                checkpoint = json.load(f)
            print(f"Found existing checkpoint with {len(checkpoint)} cached embeddings.")
        except Exception:
            checkpoint = {}

    chunks = [make_semantic_chunk(v) for v in verses]
    
    # Process un-embedded verses
    BATCH_SIZE = 25
    total_embedded = len(checkpoint)
    
    for i in range(0, len(verses), BATCH_SIZE):
        batch_indices = [idx for idx in range(i, min(i + BATCH_SIZE, len(verses))) if str(idx) not in checkpoint]
        if not batch_indices:
            continue
            
        batch_chunks = [chunks[idx] for idx in batch_indices]
        print(f"   Embedding items {batch_indices[0] + 1} to {batch_indices[-1] + 1} (Total cached: {len(checkpoint)} / {len(verses)})...")
        
        for attempt in range(5):
            try:
                res = client.models.embed_content(
                    model="models/gemini-embedding-001",
                    contents=batch_chunks,
                    config=types.EmbedContentConfig(output_dimensionality=768)
                )
                for local_i, idx in enumerate(batch_indices):
                    checkpoint[str(idx)] = res.embeddings[local_i].values
                
                # Save incremental checkpoint
                with open(CACHE_PATH, "w", encoding="utf-8") as f:
                    json.dump(checkpoint, f)
                break
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    wait_sec = 60
                    m = re.search(r'retry in (\d+)', err_str)
                    if m:
                        wait_sec = int(m.group(1)) + 5
                    print(f"   [Rate Limit Encountered] Cooling down for {wait_sec}s before resuming...")
                    time.sleep(wait_sec)
                else:
                    print(f"   [Error on attempt {attempt+1}] {e}")
                    time.sleep(5)
        else:
            print("Failed to embed batch after 5 attempts. Progress has been saved in checkpoint.")
            sys.exit(1)
            
        time.sleep(1.0) # Smooth pacing

    print(f"\nSUCCESS: All {len(checkpoint)} / {len(verses)} embeddings successfully generated and cached!")

    # Attach embeddings to verses
    for idx, v in enumerate(verses):
        v["embedding"] = checkpoint[str(idx)]
        v["embedding_chunk_text"] = chunks[idx]

    # 1. Save complete embedded JSON
    print(f"\n1. Saving complete embedded JSON dataset...")
    with open(JSON_EMB_PATH, "w", encoding="utf-8") as f:
        json.dump(verses, f, ensure_ascii=False)
    print(f"   -> {JSON_EMB_PATH} ({os.path.getsize(JSON_EMB_PATH) / 1024 / 1024:.2f} MB)")

    # 2. Save self-contained SQL file
    print(f"\n2. Generating self-contained Supabase seed SQL file...")
    with open(SQL_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("-- jnana.ai Supabase pgvector Seed File\n")
        f.write("CREATE EXTENSION IF NOT EXISTS vector;\n\n")
        f.write("""
CREATE TABLE IF NOT EXISTS verses (
    id SERIAL PRIMARY KEY,
    chapter INT NOT NULL,
    verse INT NOT NULL,
    verse_id INT NOT NULL UNIQUE,
    speaker VARCHAR(50) NOT NULL,
    sanskrit TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    word_meanings TEXT,
    translation TEXT NOT NULL,
    scene_title VARCHAR(255) NOT NULL,
    scene_story TEXT NOT NULL,
    embedding_chunk_text TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    search_tsv tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(translation, '') || ' ' || 
            coalesce(scene_title, '') || ' ' || 
            coalesce(scene_story, '') || ' ' || 
            coalesce(transliteration, '')
        )
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_verses_chapter_verse ON verses (chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verses_search_tsv ON verses USING GIN (search_tsv);
CREATE INDEX IF NOT EXISTS idx_verses_embedding_hnsw ON verses USING hnsw (embedding vector_ip_ops) WITH (m = 16, ef_construction = 64);
\n""")
        for v in verses:
            def esc(s):
                if s is None: return "NULL"
                return "'" + str(s).replace("'", "''") + "'"

            vec_str = "'[" + ",".join(map(str, v["embedding"])) + "]'"
            f.write(
                f"INSERT INTO verses (chapter, verse, verse_id, speaker, sanskrit, transliteration, word_meanings, translation, scene_title, scene_story, embedding_chunk_text, embedding)\n"
                f"VALUES ({v['chapter']}, {v['verse']}, {v['verse_id']}, {esc(v['speaker'])}, {esc(v['sanskrit'])}, {esc(v['transliteration'])}, {esc(v.get('word_meanings'))}, {esc(v['translation'])}, {esc(v['scene_title'])}, {esc(v['scene_story'])}, {esc(v['embedding_chunk_text'])}, {vec_str})\n"
                f"ON CONFLICT (verse_id) DO UPDATE SET embedding = EXCLUDED.embedding, scene_story = EXCLUDED.scene_story;\n"
            )

    print(f"   -> {SQL_OUTPUT_PATH} ({os.path.getsize(SQL_OUTPUT_PATH) / 1024 / 1024:.2f} MB)")

    print("\n" + "=" * 70)
    print("STAGE 2 EMBEDDING GENERATION AND SEED SQL CREATION COMPLETE!")
    print(f"Total Verses: {len(verses)}")
    print(f"Embedding Dimension: 768")
    print("=" * 70)

if __name__ == "__main__":
    main()
