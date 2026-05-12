import sys
import feedparser
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import re

# Fix Windows CP1252 encoding — must be before any print()
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# =========================
# RSS FEEDS
# =========================
RSS_FEEDS = [
    "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    "https://feeds.bbci.co.uk/news/rss.xml",
    "https://www.reuters.com/rssFeed/worldNews",
    "https://www.theguardian.com/world/rss",
    "https://www.cnn.com/rss/edition.rss",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://www.france24.com/en/rss",
    "https://www.npr.org/rss/rss.php?id=1001",
    "https://www.wsj.com/xml/rss/3_7085.xml",
    "https://www.igihe.com/rss"
]

# =========================
# CATEGORY MAP
# =========================
CATEGORY_KEYWORDS = {
    "Showbiz":    ["music", "artist", "song", "album", "celebrity", "entertainment"],
    "Sports":     ["football", "match", "goal", "league", "fifa", "afcon"],
    "Politics":   ["government", "election", "president", "minister", "policy"],
    "Business":   ["market", "economy", "trade", "company", "finance"],
    "Technology": ["technology", "ai", "software", "internet", "startup"],
}

# =========================
# CATEGORY DETECTION
# =========================
def detect_category(text: str) -> str:
    text = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        for k in keywords:
            if k in text:
                return category
    return "World"

# =========================
# SANITIZATION
# =========================
def sanitize_text_full(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"[\x00-\x1F\x7F]", "", text)
    text = text.replace('\u201c', '"').replace('\u201d', '"').replace('\u2019', "'")
    text = ''.join(c for c in text if c.isprintable() or c.isspace())
    text = re.sub(r'\n+', '\n', text).strip()
    return text

# =========================
# IMAGE EXTRACTION
# =========================
def extract_image(entry):
    if "media_content" in entry:
        return entry.media_content[0].get("url")
    if "media_thumbnail" in entry:
        return entry.media_thumbnail[0].get("url")
    try:
        r = requests.get(entry.link, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")
        og = soup.find("meta", property="og:image")
        if og:
            return og["content"]
    except Exception:
        pass
    return None

# =========================
# FETCH RSS
# =========================
def fetch_rss_feed(rss_url: str, limit: int = 5) -> list:
    feed = feedparser.parse(rss_url)
    results = []

    for entry in feed.entries[:limit]:
        title = entry.get("title", "")
        summary = BeautifulSoup(entry.get("summary", ""), "html.parser").get_text()
        summary = sanitize_text_full(summary)
        source_name = urlparse(entry.link).netloc.replace("www.", "").upper()
        image_url = extract_image(entry)
        category = detect_category(title + " " + summary)

        results.append({
            "title":       title,
            "summary":     summary,
            "link":        entry.link,
            "source_name": source_name,
            "category":    category,
            "image_url":   image_url
        })

    return results

# =========================
# RUN TEST
# =========================
def run_test():
    print("\nFetching articles from all RSS feeds...\n", flush=True)
    all_articles = []

    for feed_url in RSS_FEEDS:
        try:
            articles = fetch_rss_feed(feed_url, limit=5)
            all_articles.extend(articles)
            print(f"OK {feed_url} -> {len(articles)} articles", flush=True)
        except Exception as e:
            print(f"FAIL {feed_url} -> {e}", flush=True)

    print(f"\nTotal fetched: {len(all_articles)} articles", flush=True)
    return all_articles

# =========================
# ENTRY POINT
# =========================
if __name__ == "__main__":
    run_test()