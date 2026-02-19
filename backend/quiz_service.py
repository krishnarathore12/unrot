"""Gemini-powered quiz generation service."""

import json
import logging
import re
from google import genai
from models import QuizCard

logger = logging.getLogger("unrot.quiz_service")


QUIZ_PROMPT = """You are a quiz generator for a news app called "Unrot". Generate multiple-choice quiz questions based on the provided news articles and the user's interests.

Each question should have:
1. A topic label (e.g., "TECHNOLOGY", "POLITICS", "SCIENCE")
2. A clear question
3. Exactly 4 answer options (A, B, C, D)
4. The index of the correct answer (0 for A, 1 for B, 2 for C, 3 for D)
5. A brief explanation of why the correct answer is right (1-2 sentences)
6. Source name and URL if based on a specific article

Generate a MIX of:
- Current affairs questions based on the provided news articles
- General knowledge questions related to the user's topics of interest

Here are the news articles:
{news_json}

The user is interested in: {topics}

Return a JSON array of exactly 8 quiz questions. Each must have this EXACT structure:
{{
  "topic": "TOPIC_LABEL",
  "question": "What is the question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": 0,
  "explanation": "Brief explanation of the correct answer.",
  "source_name": "Source Name",
  "source_url": "https://example.com"
}}

IMPORTANT:
- "options" must always have exactly 4 items
- "correct_answer" must be an integer 0-3
- "source_name" and "source_url" must be strings (use "" if unknown)
- Make questions challenging but fair
- Vary the position of the correct answer (don't always use 0)
- Return ONLY the JSON array, no other text
"""


def generate_quiz(news_items: list[dict], topics: list[str], api_key: str) -> list[QuizCard]:
    """Generate quiz cards using Gemini API."""
    logger.info(f"Generating quiz for topics: {topics}")
    logger.info(f"News items provided: {len(news_items)}")

    client = genai.Client(api_key=api_key)

    prompt = QUIZ_PROMPT.format(
        news_json=json.dumps(news_items[:12], indent=2),
        topics=", ".join(topics),
    )

    logger.info("Sending request to Gemini...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    # Parse the response
    text = response.text.strip()
    logger.info(f"Gemini response length: {len(text)} chars")
    logger.debug(f"Raw Gemini response: {text[:500]}")

    # Remove markdown code fences if present
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    text = text.strip()

    try:
        cards_data = json.loads(text)
        logger.info(f"Parsed {len(cards_data)} cards from JSON")
    except json.JSONDecodeError as e:
        logger.warning(f"JSON parse failed: {e}, trying regex extraction")
        # Try to find JSON array in the response
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if match:
            cards_data = json.loads(match.group())
            logger.info(f"Regex extracted {len(cards_data)} cards")
        else:
            logger.error(f"Could not parse quiz response: {text[:200]}")
            raise ValueError(f"Could not parse quiz response from Gemini")

    quiz_cards = []
    for i, card in enumerate(cards_data):
        options = card.get("options", [])
        # Ensure exactly 4 options
        while len(options) < 4:
            options.append(f"Option {len(options) + 1}")
        options = options[:4]

        correct = card.get("correct_answer", 0)
        if not isinstance(correct, int) or correct < 0 or correct > 3:
            logger.warning(f"Card {i}: invalid correct_answer={correct}, defaulting to 0")
            correct = 0

        try:
            quiz_card = QuizCard(
                id=i,
                topic=card.get("topic", "GENERAL"),
                question=card.get("question", ""),
                options=options,
                correct_answer=correct,
                explanation=card.get("explanation", ""),
                source_name=card.get("source_name") or "",
                source_url=card.get("source_url") or "",
                image_url=card.get("image_url"),
            )
            quiz_cards.append(quiz_card)
            logger.debug(f"Card {i}: {quiz_card.question[:60]}...")
        except Exception as e:
            logger.error(f"Card {i} failed validation: {e}, data: {card}")
            continue

    logger.info(f"Successfully created {len(quiz_cards)} quiz cards")
    return quiz_cards
