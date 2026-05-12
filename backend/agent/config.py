# config.py

import os
from dotenv import load_dotenv

# Load .env from backend folder
load_dotenv()

# ========= AI TOKENS =========
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ========= DATABASE (PostgreSQL) =========
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD") 
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = os.getenv("DATABASE_URL")

# ========= CLOUDINARY =========
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

# ========= MEDIA =========
IMAGE_DIR = "images"
os.makedirs(IMAGE_DIR, exist_ok=True)

# ========= AUTHOR =========
AUTHOR_NAME = os.getenv("AUTHOR_NAME", "TopNewsAgent")
AI_USER_ID = int(os.getenv("AI_USER_ID", 6))

# ========= FETCH LIMIT =========
LIMIT = int(os.getenv("LIMIT", 5))

# ========= RSS FEEDS =========
RSS_FEEDS = {
    "World": [
        "https://feeds.bbci.co.uk/news/world/rss.xml",
        "https://www.reuters.com/world/rss",
        "https://rss.cnn.com/rss/edition_world.rss",
        "https://www.aljazeera.com/xml/rss/all.xml",
        "https://apnews.com/rss",
    ],
    "Rwanda": [
        "https://www.newtimes.co.rw/rss",
        "https://www.ktpress.rw/feed/",
        "https://www.igihe.com/rss",
        "https://www.rba.co.rw/feed/",
    ],
}

# ========= CATEGORIES =========
CATEGORIES = [
    "World",
    "Africa",
    "Rwanda",
    "Politics",
    "Business",
    "Technology",
    "Health",
    "Sports",
    "General",
]