"""
=============================================================================
jnana.ai — Local In-Memory Semantic Vector Retrieval Service
=============================================================================

CORE RESPONSIBILITY:
Performs lightning-fast, zero-quota semantic vector retrieval across all 701
canonical Bhagavad Gita verses.

ARCHITECTURE & PERFORMANCE:
- Embedding Model: 'BAAI/bge-small-en-v1.5' via FastEmbed (ONNX Runtime CPU).
- Vector Dimension: 384 dimensions.
- Storage: 701 normalized vectors stored in a contiguous NumPy array in RAM.
- Query Embedding Latency: ~3-10 ms on standard CPU.
- Cosine Retrieval Latency: < 0.5 ms via NumPy matrix dot product:
    scores = matrix (701, 384) · query_vec (384,)
- Quota & Cost: 100% free, 0 external API calls, completely immune to 429 rate limits.
=============================================================================
"""

import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any
from fastembed import TextEmbedding

from app.config import EMBEDDED_DATA_PATH, EMBEDDING_MODEL, EMBEDDING_DIM

class RetrievalService:
    """
    In-memory semantic vector retrieval engine for canonical Bhagavad Gita verses.
    """

    def __init__(self):
        self.verses: List[Dict[str, Any]] = []
        self.matrix: np.ndarray = np.empty((0, EMBEDDING_DIM), dtype=np.float32)
        self.embed_model: TextEmbedding = None
        self._initialize()

    def _initialize(self):
        """Loads canonical embedded JSON into RAM and warms up the FastEmbed ONNX model."""
        if not Path(EMBEDDED_DATA_PATH).exists():
            raise FileNotFoundError(f"Embedded dataset not found at {EMBEDDED_DATA_PATH}!")
        
        with open(EMBEDDED_DATA_PATH, "r", encoding="utf-8") as f:
            self.verses = json.load(f)

        # Convert to float32 NumPy array and L2-normalize
        raw_vectors = np.array([v["embedding"] for v in self.verses], dtype=np.float32)
        norms = np.linalg.norm(raw_vectors, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        self.matrix = raw_vectors / norms

        # Initialize local FastEmbed model (384-dim ONNX CPU)
        self.embed_model = TextEmbedding(model_name=EMBEDDING_MODEL)

    def embed_query(self, query: str) -> np.ndarray:
        """
        Embeds the user's query locally into 384 dimensions using FastEmbed on CPU in ~3-10ms.
        Normalizes the output vector to unit length for cosine dot-product calculations.
        """
        embeddings = list(self.embed_model.embed([query]))
        q_vec = np.array(embeddings[0], dtype=np.float32)
        norm = np.linalg.norm(q_vec)
        if norm > 0:
            q_vec = q_vec / norm
        return q_vec

    def retrieve_with_vector(self, q_vec: np.ndarray, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieves top_k verses directly using a pre-computed normalized query vector.
        Executes in < 0.5ms on the in-memory matrix.
        """
        scores = np.dot(self.matrix, q_vec)
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            v = dict(self.verses[idx])
            v["similarity_score"] = float(scores[idx])
            v.pop("embedding", None)  # Omit raw vector to conserve bandwidth
            results.append(v)
        return results

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Convenience method: Embeds the query and retrieves the top_k most relevant verses.
        """
        q_vec = self.embed_query(query)
        return self.retrieve_with_vector(q_vec, top_k=top_k)

    def retrieve_multi_aspect(self, query: str, max_verses: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieves verses matching multiple clauses or sub-intents in complex queries.
        Filters out low-confidence secondary verses to avoid irrelevant second slokas.
        """
        import re
        delimiters = r'[,;.!?\n]|(?:(?<=\s)(?:and|but|yet|still|also)(?=\s))'
        raw_clauses = re.split(delimiters, query, flags=re.IGNORECASE)
        clauses = [c.strip() for c in raw_clauses if len(c.strip().split()) >= 3]

        # 1. Base candidates from the full query
        full_results = self.retrieve(query, top_k=3)
        seen = {}
        for v in full_results:
            key = (v["chapter"], v["verse"])
            seen[key] = v

        # 2. If multiple distinct clauses exist, retrieve top 1 for each clause
        if len(clauses) >= 2:
            for c in clauses[:4]:  # limit to first 4 major clauses
                sub_results = self.retrieve(c, top_k=1)
                for v in sub_results:
                    key = (v["chapter"], v["verse"])
                    if key not in seen or seen[key]["similarity_score"] < v["similarity_score"]:
                        seen[key] = v

        # Sort all candidates by similarity score descending
        candidates = sorted(seen.values(), key=lambda x: x["similarity_score"], reverse=True)
        if not candidates:
            return []

        # 3. Dynamic Relevance Filtering
        top_score = candidates[0]["similarity_score"]
        selected = [candidates[0]]

        for cand in candidates[1:]:
            if len(selected) >= max_verses:
                break
            # Only keep second verse if it represents high confidence and close relevance
            if cand["similarity_score"] >= max(0.48, top_score - 0.05):
                selected.append(cand)

        return selected

    def reload_data(self):
        """Reloads in-memory verses and matrix from disk."""
        self._initialize()

retrieval_service = RetrievalService()
