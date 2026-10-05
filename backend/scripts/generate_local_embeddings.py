"""
jnana.ai — Local CPU FastEmbed Dataset Generator (384-dim)
Generates 100% quota-free, rate-limit-free embeddings for:
1. All 701 Gita verses
2. Semantic Crisis & Philosophical Anchors
Execution takes ~12 seconds on standard CPU.
"""

import json
import time
import numpy as np
from pathlib import Path
from fastembed import TextEmbedding

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR.parent / "data" / "canonical"

COMPLETE_JSON = DATA_DIR / "jnana_gita_complete.json"
OUTPUT_JSON = DATA_DIR / "jnana_gita_embedded_384.json"
CRISIS_ANCHORS_JSON = DATA_DIR / "crisis_anchors_384.json"

MODEL_NAME = "BAAI/bge-small-en-v1.5"
DIM = 384

CRISIS_ANCHORS = [
    "I feel like dying and I want to end my life.",
    "I want to commit suicide and kill myself.",
    "I do not want to live anymore, I wish I was dead.",
    "I do not like this life, I want to end it all and find permanent peace in death.",
    "Thoughts of self harm, hurting myself, and ending it all.",
    "I cannot go on living, life is not worth living and I want to die.",
    "I want to end my existence and cease to exist forever."
]

PHILOSOPHICAL_ANCHORS = [
    "I am seeking wisdom and spiritual guidance from the Bhagavad Gita.",
    "Coping with grief, sadness, loss of a family member, and mourning.",
    "Struggling with stress, duty, career, anxiety, and moral dilemmas in life.",
    "What does Krishna teach about death, rebirth, and the eternal soul?",
    "Feeling hopeless about work, finances, and looking for peace of mind."
]

def make_chunk_text(v):
    return (
        f"[{v['scene_title']} — Chapter {v['chapter']}, Verse {v['verse']}]\n"
        f"Speaker: {v['speaker']}\n"
        f"Battlefield Context & Narrative Story: {v['scene_story']}\n"
        f"Sacred Teaching: {v['translation']}\n"
        f"Sanskrit Shloka: {v['sanskrit']}\n"
        f"Transliteration: {v['transliteration']}"
    )

def main():
    print(f"Loading local embedding model: {MODEL_NAME}...")
    model = TextEmbedding(model_name=MODEL_NAME)
    
    # 1. Embed Crisis & Philosophical Anchors
    print("\n[1/2] Embedding Semantic Crisis & Philosophical Anchors...")
    crisis_embeddings = [emb.tolist() for emb in model.embed(CRISIS_ANCHORS)]
    philo_embeddings = [emb.tolist() for emb in model.embed(PHILOSOPHICAL_ANCHORS)]
    
    anchors_payload = {
        "model": MODEL_NAME,
        "dim": DIM,
        "crisis_anchors": [
            {"text": t, "embedding": emb} for t, emb in zip(CRISIS_ANCHORS, crisis_embeddings)
        ],
        "philosophical_anchors": [
            {"text": t, "embedding": emb} for t, emb in zip(PHILOSOPHICAL_ANCHORS, philo_embeddings)
        ]
    }
    with open(CRISIS_ANCHORS_JSON, "w", encoding="utf-8") as f:
        json.dump(anchors_payload, f, ensure_ascii=False, indent=2)
    print(f"Saved anchors to {CRISIS_ANCHORS_JSON}")

    # 2. Embed 701 Verses
    print("\n[2/2] Embedding 701 Gita verses locally...")
    with open(COMPLETE_JSON, "r", encoding="utf-8") as f:
        verses = json.load(f)

    chunks = [make_chunk_text(v) for v in verses]
    t0 = time.time()
    embeddings = list(model.embed(chunks, batch_size=64))
    elapsed = time.time() - t0
    print(f"Embedded 701 verses in {elapsed:.2f} seconds!")

    embedded_verses = []
    for v, chunk_text, emb in zip(verses, chunks, embeddings):
        v_copy = dict(v)
        v_copy["embedding_chunk_text"] = chunk_text
        v_copy["embedding"] = emb.tolist()
        embedded_verses.append(v_copy)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(embedded_verses, f, ensure_ascii=False)
    print(f"Saved complete embedded dataset to {OUTPUT_JSON} (Count: {len(embedded_verses)})")

if __name__ == "__main__":
    main()
