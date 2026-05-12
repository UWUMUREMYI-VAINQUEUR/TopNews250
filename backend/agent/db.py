# db.py
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError
from config import DATABASE_URL, AUTHOR_NAME, AI_USER_ID

engine = create_engine(DATABASE_URL, future=True)


def get_category_id(category_name: str):
    with engine.begin() as conn:
        res = conn.execute(
            text("SELECT id FROM categories WHERE LOWER(name)=:name"),
            {"name": category_name.lower()}
        ).fetchone()

        if res:
            return res[0]

        res = conn.execute(
            text("INSERT INTO categories(name) VALUES(:name) RETURNING id"),
            {"name": category_name}
        ).fetchone()

        return res[0]


def insert_ai_post(data: dict):
    """
    Safe insert for AI-generated or fallback articles.
    Always inserts with is_ai=true and status='approved'
    so posts appear immediately without admin approval.
    """

    with engine.begin() as conn:
        # Duplicate protection
        exists = conn.execute(
            text("""
                SELECT 1 FROM posts
                WHERE source_url = :url OR hash = :hash
            """),
            {
                "url": data["source_url"],
                "hash": data["hash"]
            }
        ).fetchone()

        if exists:
            print("⚠️ Duplicate skipped:", data["title"])
            return None

        post = conn.execute(
            text("""
                INSERT INTO posts (
                    user_id,
                    title,
                    snippet,
                    body,
                    image_url,
                    source_name,
                    source_url,
                    category_id,
                    language,
                    hash,
                    is_ai,
                    status
                )
                VALUES (
                    :user_id,
                    :title,
                    :snippet,
                    :body,
                    :image_url,
                    :source_name,
                    :source_url,
                    :category_id,
                    :language,
                    :hash,
                    true,
                    'approved'
                )
                RETURNING id
            """),
            {
                "user_id": AI_USER_ID,
                "title": data["title"],
                "snippet": data["snippet"],
                "body": data["body"],
                "image_url": data.get("image_url"),
                "source_name": data["source_name"],
                "source_url": data["source_url"],
                "category_id": get_category_id(data.get("category", "General")),
                "language": data.get("language", "rw"),
                "hash": data["hash"]
            }
        )

        post_id = post.fetchone()[0]
        print("✅ Saved post ID:", post_id)
        return post_id