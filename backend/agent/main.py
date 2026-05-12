# main.py

from fastapi import FastAPI, Query
from pydantic import BaseModel
from datetime import datetime
import os

# Import your modules
from fetcher import fetch_rss_feed, download_image
from writer import write_article
from translator import translate_to_english

# -----------------------------
# FastAPI app instance
# -----------------------------
app = FastAPI(title="Top News AI Agent")

# -----------------------------
# Request models
# -----------------------------
class NewsRequest(BaseModel):
    text: str
    target_language: str = "en"  # "en" or "rw"

# -----------------------------
# Endpoints
# -----------------------------
@app.post("/generate")
def generate_news(req: NewsRequest):
    english_text = translate_to_english(req.text)
    article = write_article(english_text, output_language=req.target_language)
    return {
        "language": req.target_language,
        "article": article
    }

@app.post("/generate_rss")
def generate_from_rss(
    rss_url: str = Query(..., description="RSS feed URL"),
    target_language: str = "en",
    limit: int = 5
):
    articles = fetch_rss_feed(rss_url, limit=limit)
    generated = []

    IMAGE_DIR = "images"
    os.makedirs(IMAGE_DIR, exist_ok=True)

    for i, item in enumerate(articles):
        text = item.get("summary", "") or item.get("title", "")
        generated_article = write_article(text, output_language=target_language)

        image_file = None
        if item.get("image_url"):
            image_file = download_image(item["image_url"], f"{IMAGE_DIR}/article_{i+1}.jpg")

        generated.append({
            "title": item.get("title"),
            "link": item.get("link"),
            "article": generated_article,
            "image_file": image_file
        })

    return {"articles": generated}

@app.post("/run_rss_now")
def run_rss_now():
    fetch_and_generate_articles()
    return {"status": "RSS fetched and articles generated"}

# -----------------------------
# Scheduler setup
# -----------------------------
from apscheduler.schedulers.background import BackgroundScheduler

RSS_FEEDS = [
    "https://www.reuters.com/rssFeed/worldNews",
    # Add more feeds if needed
]
TARGET_LANGUAGE = "rw"
LIMIT = 3
IMAGE_DIR = "images"
os.makedirs(IMAGE_DIR, exist_ok=True)

scheduler = BackgroundScheduler()
scheduler.start()
scheduler.add_job(lambda: fetch_and_generate_articles(), 'interval', hours=1)

# -----------------------------
# Scheduled job function
# -----------------------------
def fetch_and_generate_articles():
    print(f"[{datetime.now()}] Starting scheduled RSS fetch...")

    for rss_url in RSS_FEEDS:
        articles = fetch_rss_feed(rss_url, limit=LIMIT)
        for i, item in enumerate(articles):
            text = item.get("summary", "") or item.get("title", "")
            article = write_article(text, output_language=TARGET_LANGUAGE)

            image_file = None
            if item.get("image_url"):
                image_file = download_image(item["image_url"], f"{IMAGE_DIR}/scheduled_{i+1}.jpg")

            print(f"Generated: {item.get('title')}")
            print(f"Image saved: {image_file}")
