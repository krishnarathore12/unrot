"""DuckDuckGo news scraping service."""

import logging
from duckduckgo_search import DDGS

logger = logging.getLogger("unrot.news")


def fetch_news(topics: list[str], max_results_per_topic: int = 3) -> list[dict]:
    """Fetch news articles from DuckDuckGo for given topics."""
    all_results = []
    ddgs = DDGS()

    for topic in topics:
        try:
            logger.info(f"Fetching news for topic: {topic}")
            results = list(ddgs.news(
                f"{topic} latest news",
                region="wt-wt",
                safesearch="moderate",
                max_results=max_results_per_topic,
            ))
            logger.info(f"Got {len(results)} results for {topic}")
            for r in results:
                all_results.append({
                    "title": r.get("title", ""),
                    "body": r.get("body", ""),
                    "source": r.get("source", ""),
                    "url": r.get("url", ""),
                    "image": r.get("image", ""),
                    "topic": topic,
                })
        except Exception as e:
            logger.error(f"Error fetching news for {topic}: {e}")
            continue

    logger.info(f"Total news items fetched: {len(all_results)}")
    return all_results
