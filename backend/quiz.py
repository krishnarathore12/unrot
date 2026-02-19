"""Quiz API routes."""

import logging
import concurrent.futures
from fastapi import APIRouter, HTTPException
from models import QuizResponse
from store import get_user_by_token
from news_service import fetch_news
from quiz_service import generate_quiz

logger = logging.getLogger("unrot.quiz")

router = APIRouter(prefix="/api", tags=["quiz"])

NEWS_TIMEOUT = 10
QUIZ_TIMEOUT = 30


@router.get("/quiz", response_model=QuizResponse)
def get_quiz(token: str):
    """Generate a quiz based on user's interests."""
    user = get_user_by_token(token)
    if not user:
        logger.warning(f"Invalid token: {token[:8]}...")
        raise HTTPException(status_code=401, detail="Invalid token")

    logger.info(f"Generating quiz for user={user.name}, interests={user.interests}")

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Step 1: Fetch news
            logger.info("Step 1: Fetching news...")
            news_future = executor.submit(fetch_news, user.interests, 3)
            try:
                news_items = news_future.result(timeout=NEWS_TIMEOUT)
                logger.info(f"Fetched {len(news_items)} news items")
            except concurrent.futures.TimeoutError:
                logger.warning("News fetch timed out, generating quiz without news")
                news_items = []

            # Step 2: Generate quiz with Gemini
            logger.info("Step 2: Generating quiz with Gemini...")
            quiz_future = executor.submit(
                generate_quiz, news_items, user.interests, user.gemini_api_key
            )
            cards = quiz_future.result(timeout=QUIZ_TIMEOUT)
            logger.info(f"Generated {len(cards)} quiz cards")

    except concurrent.futures.TimeoutError:
        logger.error("Quiz generation timed out")
        raise HTTPException(
            status_code=504,
            detail="Quiz generation timed out. Please try again."
        )
    except Exception as e:
        logger.error(f"Error generating quiz: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate quiz: {str(e)}"
        )

    # Collect all available images from news items
    all_images = [n["image"] for n in news_items if n.get("image")]
    # Assign unique images to cards in round-robin
    img_idx = 0
    for card in cards:
        if not card.image_url and all_images:
            card.image_url = all_images[img_idx % len(all_images)]
            img_idx += 1

    logger.info(f"Quiz ready — {len(cards)} cards returned")
    return QuizResponse(cards=cards)
