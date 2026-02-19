"""Authentication routes."""

import uuid
from fastapi import APIRouter, HTTPException
from models import RegisterRequest, User, AuthResponse
from store import save_user, get_user_by_token, get_user_by_email

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    # Check if user already exists
    existing = get_user_by_email(req.email)
    if existing:
        return AuthResponse(token=existing.token, name=existing.name, email=existing.email)

    # Create new user
    token = str(uuid.uuid4())
    user = User(
        name=req.name,
        email=req.email,
        interests=req.interests,
        gemini_api_key=req.gemini_api_key,
        token=token,
    )
    save_user(user)
    return AuthResponse(token=token, name=user.name, email=user.email)


@router.get("/me")
def get_me(token: str):
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"name": user.name, "email": user.email, "interests": user.interests}
