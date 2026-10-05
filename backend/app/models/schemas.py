from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's query or emotional dilemma")
    session_id: Optional[str] = Field(None, description="Optional session tracking ID")

class VerseMetadata(BaseModel):
    chapter: int
    verse: int
    speaker: str
    sanskrit: str
    transliteration: str
    translation: str
    scene_title: str
    scene_story: str
    similarity_score: float

class CrisisResponse(BaseModel):
    is_crisis: bool = True
    message: str
    helplines: List[dict]

class HealthResponse(BaseModel):
    status: str
    total_verses_loaded: int
    vector_dim: int
