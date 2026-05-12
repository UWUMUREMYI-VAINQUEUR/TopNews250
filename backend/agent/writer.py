import sys
import hashlib
import json
import re
from groq import Groq
from config import GROQ_API_KEY
from db import insert_ai_post, get_category_id
from language import detect_language

# Fix Windows CP1252 encoding — must be before any print()
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# ========= CONSTANTS =========
TOPNEWS_AVATAR_URL = "http://localhost:5000/images/tn.png"
TOPNEWS_AUTHOR = "TopNewsAgent"

client = Groq(api_key=GROQ_API_KEY)


# --------------------------------------------------
# Utils
# --------------------------------------------------
def generate_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()


def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"[\x00-\x1f\x7f]", "", text).strip()


def extract_json_safe(text: str) -> dict:
    text = clean_text(text)

    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON found in AI output")

    return json.loads(match.group())


def validate_article(data: dict) -> bool:
    """
    Ensure the article meets minimum quality standards
    before inserting into the database.
    Returns True if valid, False if it should be skipped.
    """
    title = data.get("title", "").strip()
    body  = data.get("body", "").strip()

    if len(title) < 10:
        print("[SKIP] Title too short", flush=True)
        return False

    if len(body) < 400:
        print(f"[SKIP] Body too short ({len(body)} chars)", flush=True)
        return False

    return True


# --------------------------------------------------
# Main writer
# --------------------------------------------------
def write_article(
    source_text: str,
    source_name: str,
    source_url: str,
    image_url: str | None = None,
    category: str = "World",
):
    detected_language = detect_language(source_text)
    article_hash      = generate_hash(source_url)
    clean_source_text = clean_text(source_text)

    try:
        category_id = get_category_id(category)
    except Exception:
        category_id = get_category_id("General")

    # --------------------------------------------------
    # Prompt — AdSense-safe, journalist style, 500+ words
    # --------------------------------------------------
    prompt = f"""
You are a professional independent journalist writing for a reputable global news website.

=== STRICT RULES (never break these) ===
1. NEVER copy sentences, phrases, or structure from the source text.
2. NEVER paraphrase line-by-line — completely reimagine the story.
3. Facts must remain accurate — do not invent statistics or names.
4. Do NOT translate — write entirely in this language: {detected_language}
5. No plagiarism. No copy-paste. No summarizing.
6. Content must be 100% original and suitable for Google AdSense approval:
   - No hate speech, no violence, no adult content
   - No misleading or sensational clickbait
   - Factual, balanced, and professionally written
   - Suitable for a general international audience

=== WRITING STYLE ===
- Write like a seasoned journalist for an international newspaper
- Open with a strong, gripping first sentence that hooks the reader
- Use the inverted pyramid: most important facts first, context second, background last
- Include at least one realistic illustrative quote (clearly framed as context, not direct attribution)
- Vary sentence length for rhythm — short punchy sentences mixed with longer analytical ones
- Add analysis, context, and broader implications — not just what happened, but why it matters
- End with a strong concluding paragraph that gives the reader something to think about

=== LENGTH & STRUCTURE (mandatory) ===
- Title: compelling, specific, 8-14 words, no clickbait
- Snippet: 1-2 sharp sentences summarizing the story (max 40 words)
- Body: MINIMUM 500 words, MINIMUM 5 paragraphs
  * Paragraph 1: Strong news lead (who, what, when, where)
  * Paragraph 2: Key details and immediate context
  * Paragraph 3: Background, history, or broader context
  * Paragraph 4: Impact, reactions, or expert perspective
  * Paragraph 5+: Analysis, implications, what happens next
  * Final paragraph: Conclusion — significance of the story

=== OUTPUT FORMAT (STRICT JSON ONLY — no extra text, no markdown) ===
{{
  "title": "...",
  "snippet": "...",
  "body": "..."
}}

=== SOURCE (for facts only — do NOT copy) ===
Source name: {source_name}
Source content:
{clean_source_text}
"""

    # --------------------------------------------------
    # Call Groq API
    # --------------------------------------------------
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.75,   # slightly creative but grounded
            max_tokens=2048,    # enough room for 500+ word articles
        )

        raw_output = response.choices[0].message.content
        data = extract_json_safe(raw_output)

        article_data = {
            "title":             clean_text(data.get("title", ""))[:160] or "Breaking News",
            "snippet":           clean_text(data.get("snippet", ""))[:300],
            "body":              clean_text(data.get("body", "")),
            "category":          category,
            "category_id":       category_id,
            "source_name":       source_name,
            "source_url":        source_url,
            "image_url":         image_url,
            "author":            TOPNEWS_AUTHOR,
            "author_avatar_url": TOPNEWS_AVATAR_URL,
            "language":          detected_language,
            "hash":              article_hash,
            "is_ai":             True,
        }

        # Quality gate — skip low-quality output
        if not validate_article(article_data):
            print(f"[WARN] Article quality too low, skipping: {source_url}", flush=True)
            return None

        insert_ai_post(article_data)
        print(f"[OK] Article written ({len(article_data['body'])} chars): {article_data['title']}", flush=True)
        return article_data

    # --------------------------------------------------
    # Fallback — only used if Groq completely fails
    # --------------------------------------------------
    except Exception as e:
        print(f"[ERROR] Groq failed -> {e}", flush=True)

        # Only use fallback if source text is long enough to be useful
        if len(clean_source_text) < 100:
            print("[SKIP] Source too short for fallback, skipping article.", flush=True)
            return None

        fallback_title = (
            clean_source_text.split(".")[0][:120]
            if clean_source_text
            else "Breaking News Update"
        )

        article_data = {
            "title":             fallback_title,
            "snippet":           clean_source_text[:300],
            "body":              clean_source_text,
            "category":          category,
            "category_id":       category_id,
            "source_name":       source_name,
            "source_url":        source_url,
            "image_url":         image_url,
            "author":            TOPNEWS_AUTHOR,
            "author_avatar_url": TOPNEWS_AVATAR_URL,
            "language":          detected_language,
            "hash":              article_hash,
            "is_ai":             True,
        }

        # Do not insert garbage fallback articles
        if not validate_article(article_data):
            print(f"[SKIP] Fallback also too short, skipping: {source_url}", flush=True)
            return None

        insert_ai_post(article_data)
        print(f"[FALLBACK] Inserted raw source as article: {fallback_title}", flush=True)
        return article_data