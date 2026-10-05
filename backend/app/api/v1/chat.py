"""
=============================================================================
jnana.ai — Streaming Chat Router (Server-Sent Events)
=============================================================================

CORE RESPONSIBILITY:
Handles real-time conversational streaming between the seeker and Lord Krishna.
Enforces the safety pipeline and coordinates vector retrieval and generation.

PIPELINE STAGES:
1. Embed Query: Converts seeker message into a 384-dimensional semantic vector
   using local FastEmbed CPU model (< 10ms, zero external API quota).
2. Crisis Evaluation: Evaluates semantic cosine similarity against crisis anchor
   vectors (< 0.05ms). If acute self-harm/crisis is detected, immediate helpline
   support is emitted, terminating the stream with ZERO scriptural quotes.
3. Vector Retrieval: Queries the in-memory 701-verse canonical matrix using the
   pre-computed query vector (< 0.5ms). Returns top-K matched verses.
4. Metadata Event: Emits 'event: metadata' containing the retrieved verse(s),
   enabling the frontend to display authentic Sanskrit, translation, and chapter.
5. Stream Guidance: Calls Gemini 3.1 Flash-Lite to stream Krishna's voice
   token-by-token using 'event: token'.
6. Stream Completion: Emits 'event: done' signaling completion.
=============================================================================
"""

import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import ChatRequest
from app.services.safety_service import safety_service
from app.services.retrieval_service import retrieval_service
from app.services.llm_service import llm_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    Real-Time Server-Sent Events (SSE) Streaming Endpoint.
    Consumes a ChatRequest and yields SSE events:
    - event: error    (if an exception occurs at any stage)
    - event: crisis   (if acute despair / suicidal ideation is detected)
    - event: metadata (retrieved verses, chapter, context, scores)
    - event: token    (real-time tokens of Krishna's compassionate words)
    - event: done     (stream finalization status)
    """
    async def event_generator():
        user_text = request.message.strip()

        # Step 1: Semantic Vector Generation (Embed once locally)
        try:
            q_vec = retrieval_service.embed_query(user_text)
        except Exception as e:
            err_payload = {"error": f"Local embedding generation failed: {str(e)}"}
            yield f"event: error\ndata: {json.dumps(err_payload)}\n\n"
            return

        # Step 2: Semantic Vector Crisis Evaluation (< 0.05ms)
        crisis_data = safety_service.check_crisis_vector(q_vec)
        if crisis_data:
            yield f"event: crisis\ndata: {json.dumps(crisis_data, ensure_ascii=False)}\n\n"
            yield f"event: done\ndata: {json.dumps({'status': 'crisis_handled'})}\n\n"
            return

        # Step 3: Semantic Multi-Aspect Vector Retrieval (< 5ms)
        try:
            retrieved_verses = retrieval_service.retrieve_multi_aspect(user_text, max_verses=2)
        except Exception as e:
            err_payload = {"error": f"Vector retrieval failed: {str(e)}"}
            yield f"event: error\ndata: {json.dumps(err_payload)}\n\n"
            return

        # Step 4: Emit Metadata Event (for interactive Verse Cards in frontend UI)
        metadata_payload = {
            "retrieved_verses": retrieved_verses
        }
        yield f"event: metadata\ndata: {json.dumps(metadata_payload, ensure_ascii=False)}\n\n"

        # Step 5: Stream Krishna's Enlightening Response (token-by-token)
        try:
            async for token in llm_service.stream_response(user_text, retrieved_verses):
                token_payload = {"text": token}
                yield f"event: token\ndata: {json.dumps(token_payload, ensure_ascii=False)}\n\n"
        except Exception as e:
            err_payload = {"error": f"LLM generation failed: {str(e)}"}
            yield f"event: error\ndata: {json.dumps(err_payload)}\n\n"
            return

        # Step 6: Completion Event
        yield f"event: done\ndata: {json.dumps({'status': 'complete'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
