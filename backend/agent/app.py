# writer.py
import hashlib
import openai
from config import GROQ_API_KEY, TARGET_LANGUAGE
from db import insert_ai_post

openai.api_key = GROQ_API_KEY

def generate_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def write_article(source_text: str, source_name: str, source_url: str, image_url: str = None, category: str = "General") -> dict:
    """
    Generate an AI article from source text.
    """
    prompt = f"""
    Rewrite this news article to be highly engaging, curiosity-driven,
    so the reader must finish it. Keep the meaning.
    Language: {TARGET_LANGUAGE}
    Source: {source_name}

    Text:
    {source_text}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        content = response.choices[0].message.content.strip()

        # Create structured output
        title = content.split("\n")[0][:150]
        snippet = content[:250]
        body = content

        # Simple tagging from words in title
        tags = [word for word in title.split() if len(word) > 4][:5]

        article_data = {
            "title": title,
            "snippet": snippet,
            "body": body,
            "category": category,
            "tags": tags,
            "source_name": source_name,
            "source_url": source_url,
            "image_url": image_url,
            "language": TARGET_LANGUAGE,
            "hash": generate_hash(source_text)
        }

        # Insert into DB with duplicate prevention
        inserted_id = insert_ai_post(article_data)
        if inserted_id:
            print(f"✅ Article saved: {title}")
        else:
            print(f"⚠️ Duplicate skipped: {title}")

        return article_data

    except Exception as e:
        print(f"❌ AI error: {e}")
        # fallback to original text
        return {
            "title": "Inkuru nshya",
            "snippet": source_text[:200],
            "body": source_text,
            "category": category,
            "tags": [],
            "source_name": source_name,
            "source_url": source_url,
            "image_url": image_url,
            "language": TARGET_LANGUAGE,
            "hash": generate_hash(source_text)
        }
