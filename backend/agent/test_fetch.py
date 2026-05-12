"""
TopNews AI Agent – Fetcher Test (PRODUCTION SAFE)
- Fetches RSS feeds safely (no blocking)
- Extracts article text + image
- Sends content to writer.py
- Confirms DB insert
"""

import time
import feedparser
import requests
from bs4 import BeautifulSoup

from config import RSS_FEEDS, LIMIT
from writer import write_article


# --------------------------------------------------
# Browser-like headers (avoid bot blocking)
# --------------------------------------------------
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
    "Connection": "keep-alive",
}


# --------------------------------------------------
# Fetch RSS safely with retries
# --------------------------------------------------
def fetch_rss_safe(url: str, retries: int = 3):
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=15)
            response.raise_for_status()

            return feedparser.parse(response.content)

        except Exception as e:
            print(f"⚠️ RSS retry {attempt + 1}/{retries} failed → {e}")
            time.sleep(2)

    print(f"❌ RSS permanently failed: {url}")
    return None


# --------------------------------------------------
# Extract article content safely
# --------------------------------------------------
def extract_article_text(url: str) -> tuple[str, str | None]:
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove junk elements
        for tag in soup(["script", "style", "noscript", "header", "footer", "nav"]):
            tag.decompose()

        paragraphs = []
        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if len(text) > 40:
                paragraphs.append(text)

        article_text = "\n\n".join(paragraphs)

        # Extract main image (best effort)
        image_url = None
        og_img = soup.find("meta", property="og:image")
        if og_img and og_img.get("content"):
            image_url = og_img["content"]

        return article_text.strip(), image_url

    except Exception as e:
        print(f"❌ Failed to extract article from {url}: {e}")
        return "", None


# --------------------------------------------------
# Main runner
# --------------------------------------------------
def run_test(limit_per_feed: int = LIMIT):
    print("\n🚀 Starting TopNews AI Agent Fetch Test\n")

    for category, feeds in RSS_FEEDS.items():
        print(f"📂 Category: {category}")

        for feed_url in feeds:
            print(f"🔍 RSS: {feed_url}")

            feed = fetch_rss_safe(feed_url)
            if not feed:
                continue

            if not feed.entries:
                print(" ⚠️ No entries found")
                continue

            for entry in feed.entries[:limit_per_feed]:
                title = entry.get("title", "No title")
                link = entry.get("link")

                if not link:
                    continue

                print(f" → Processing: {title}")

                text, image_url = extract_article_text(link)

                # Quality filter
                if not text or len(text) < 500:
                    print(" ⚠️ Skipped (content too short)")
                    continue

                try:
                    write_article(
                        source_text=text,
                        source_name=feed.feed.get("title", "Unknown Source"),
                        source_url=link,
                        image_url=image_url,
                        category=category,
                    )
                    print(" ✅ Article written")

                except Exception as e:
                    print(f" ❌ Failed to write article → {e}")

                # Rate limiting (VERY IMPORTANT)
                time.sleep(3)

        print()

    print("✅ Fetch test completed. Check database for results.\n")


# --------------------------------------------------
# Entry
# --------------------------------------------------
if __name__ == "__main__":
    run_test()