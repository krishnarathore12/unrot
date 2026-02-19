from pydantic import BaseModel, field_validator
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: str
    interests: list[str]
    gemini_api_key: str


class User(BaseModel):
    name: str
    email: str
    interests: list[str]
    gemini_api_key: str
    token: str


class QuizCard(BaseModel):
    id: int
    topic: str
    question: str
    options: list[str]          # 4 answer choices
    correct_answer: int         # index (0-3) of the correct option
    explanation: str = ""       # why the answer is correct
    source_name: str = ""
    source_url: str = ""
    image_url: Optional[str] = None

    @field_validator("source_name", "source_url", "explanation", mode="before")
    @classmethod
    def none_to_empty_string(cls, v):
        """Coerce None to empty string for string fields."""
        if v is None:
            return ""
        return v


class QuizResponse(BaseModel):
    cards: list[QuizCard]


class AuthResponse(BaseModel):
    token: str
    name: str
    email: str
