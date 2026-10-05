"""
=============================================================================
jnana.ai — Application Configuration & Environment Settings
=============================================================================

CORE RESPONSIBILITY:
Centralized management of environment variables, dataset file paths,
embedding dimensions, and model configurations for the jnana.ai backend.

ARCHITECTURE:
- Embedding Engine: Local FastEmbed (CPU ONNX) using 'BAAI/bge-small-en-v1.5' (384-dim).
  Provides zero-latency, 100% rate-limit-free and quota-free vector generation.
- LLM Engine: Google Gemini 3.1 Flash-Lite (via google-genai SDK).
  Provides high-throughput, compassionate Krishna voice generation with sub-second TTFT.
- Data Layer: Pre-embedded in-memory canonical dataset of 701 Bhagavad Gita verses.
=============================================================================
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve project directory structure
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# API Keys & Database Secrets
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL: str = os.getenv("DATABASE_URL", "")

# Canonical Data File Paths (robust for monorepo and standalone backend deployment)
if (BASE_DIR / "data" / "canonical").exists():
    DATA_DIR = BASE_DIR / "data" / "canonical"
else:
    DATA_DIR = BASE_DIR.parent / "data" / "canonical"

EMBEDDED_DATA_PATH = DATA_DIR / "jnana_gita_embedded_384.json"
COMPLETE_DATA_PATH = DATA_DIR / "jnana_gita_complete.json"
CRISIS_ANCHORS_PATH = DATA_DIR / "crisis_anchors_384.json"


# Embedding & LLM Specifications
EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
EMBEDDING_DIM: int = 384
LLM_MODEL: str = "gemini-3.1-flash-lite"
