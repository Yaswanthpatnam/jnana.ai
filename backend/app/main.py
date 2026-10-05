"""
=============================================================================
jnana.ai — FastAPI Application Entrypoint
=============================================================================

CORE RESPONSIBILITY:
Initializes the FastAPI application, manages startup/shutdown lifecycle hooks
to warm the in-memory vector database, configures CORS middleware for frontend
communication, and exposes the /health and /chat endpoints.

ENDPOINTS:
- GET  /api/v1/health       -> System health status, loaded verse count, vector dim
- POST /api/v1/chat/stream  -> Real-time Server-Sent Events (SSE) chat stream
=============================================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.v1.chat import router as chat_router
from app.models.schemas import HealthResponse
from app.services.retrieval_service import retrieval_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan Context Manager:
    Ensures canonical vector embeddings and the FastEmbed model are loaded into
    RAM on startup, enabling sub-millisecond query responses from frame 1.
    """
    print(f"[jnana.ai] Backend initialized successfully with {len(retrieval_service.verses)} verses in RAM.")
    yield
    print("[jnana.ai] Backend shutting down.")

app = FastAPI(
    title="jnana.ai API",
    description="Conversational Bhagavad Gita Wisdom Companion API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend (localhost:3000 and production domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open in dev, configure for specific production domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(chat_router, prefix="/api/v1")

@app.get("/api/v1/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Returns the operational status of the vector database and loaded verse counts."""
    return HealthResponse(
        status="healthy",
        total_verses_loaded=len(retrieval_service.verses),
        vector_dim=retrieval_service.matrix.shape[1] if len(retrieval_service.matrix) > 0 else 0
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
