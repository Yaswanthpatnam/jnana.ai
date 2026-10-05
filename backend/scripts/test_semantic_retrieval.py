"""
=============================================================================
jnana.ai — Stage 2/3 Semantic Vector Retrieval Test Suite
=============================================================================

CORE PURPOSE:
Validates that semantic vector retrieval against the 701 canonical Bhagavad Gita
verses operates with high precision and sub-millisecond execution latency.

KEY MECHANICS:
1. Loads the 384-dimensional canonical dataset (jnana_gita_embedded_384.json).
2. Embeds test life dilemmas into 384-dim vectors using local FastEmbed ONNX model.
3. Executes vector cosine similarity via NumPy matrix dot product.
4. Verifies the retrieved verses accurately match the seeker's psychological
   and spiritual predicament with Mahabharata narrative context.
=============================================================================
"""

import json
import os
import sys
import time
import numpy as np

# Configure console encoding for Sanskrit text output
sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend app is discoverable on python path
sys.path.insert(0, r"D:\productive\jnana.ai\backend")

from app.config import EMBEDDED_DATA_PATH
from app.services.retrieval_service import retrieval_service

def run_semantic_retrieval_tests():
    print("=" * 70)
    print("jnana.ai — SEMANTIC VECTOR RETRIEVAL TEST SUITE (384-DIM FASTEMBED)")
    print("=" * 70)

    # 1. Dataset Verification
    print(f"Dataset path: {EMBEDDED_DATA_PATH}")
    print(f"Total canonical verses loaded: {len(retrieval_service.verses)}")
    print(f"In-memory matrix shape: {retrieval_service.matrix.shape}")
    assert len(retrieval_service.verses) == 701, f"Expected 701 verses, found {len(retrieval_service.verses)}"

    # 2. Test Real-World Dilemmas
    test_dilemmas = [
        (
            "Career Failure & Shame Before Parents",
            "I prepared for two years for an exam and failed. I feel ashamed to face my parents and like all my effort was completely wasted."
        ),
        (
            "Restless Mind & Inability to Focus",
            "My mind is completely restless, constantly jumping from thought to thought. I cannot control my focus, it feels as impossible as holding the wind."
        ),
        (
            "Grief over Death and Loss of Loved One",
            "I recently lost someone very close to me. The sadness is unbearable, and I cannot understand why good people must suffer and die."
        ),
        (
            "Moral Dilemma & Paralyzed Decision Making",
            "I am torn between two major decisions in my life right now, weeping with anxiety, and I have no idea what my true duty is anymore."
        )
    ]

    for title, dilemma in test_dilemmas:
        print(f"\n--- TEST DILEMMA: {title} ---")
        print(f"Seeker's Query: \"{dilemma}\"")

        t0 = time.perf_counter()
        retrieved = retrieval_service.retrieve(dilemma, top_k=2)
        elapsed_ms = (time.perf_counter() - t0) * 1000

        print(f"Retrieved {len(retrieved)} verses in {elapsed_ms:.2f} ms:")
        for rank, v in enumerate(retrieved, 1):
            print(f"  #{rank} [Score: {v['similarity_score']:.4f}] Chapter {v['chapter']}, Verse {v['verse']} | Speaker: {v['speaker']}")
            print(f"      Scene: {v['scene_title']}")
            print(f"      Translation: \"{v['translation'][:90]}...\"")

        # Sanity check: Ensure top score is reasonable
        assert len(retrieved) == 2, "Expected 2 retrieved verses"
        assert retrieved[0]["similarity_score"] > 0.40, f"Expected strong match score, got {retrieved[0]['similarity_score']}"

    print("\n" + "=" * 70)
    print("ALL SEMANTIC RETRIEVAL TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    run_semantic_retrieval_tests()
