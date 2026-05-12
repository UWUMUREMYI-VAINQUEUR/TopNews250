# db.py

from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.pool import QueuePool

from config import (
    DATABASE_URL,
    AUTHOR_NAME,
    AI_USER_ID
)

# ==========================================
# DATABASE ENGINE
# ==========================================
# Production-ready PostgreSQL connection
# for Render + SQLAlchemy
# ==========================================

engine = create_engine(
    DATABASE_URL,
    future=True,

    # Connection pool
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,

    # Auto-reconnect dead connections
    pool_pre_ping=True,

    # Better stability
    pool_recycle=300,

    # Render PostgreSQL SSL
    connect_args={
        "sslmode": "require"
    }
)

# ==========================================
# GET CATEGORY ID
# ==========================================

def get_category_id(category_name: str):
    """
    Returns category ID.
    Creates category if missing.
    """

    category_name = category_name.strip()

    with engine.begin() as conn:

        # Check existing category
        res = conn.execute(
            text("""
                SELECT id
                FROM categories
                WHERE LOWER(name) = :name
            """),
            {
                "name": category_name.lower()
            }
        ).fetchone()

        if res:
            return res[0]

        # Create category if not found
        res = conn.execute(
            text("""
                INSERT INTO categories(name)
                VALUES(:name)
                RETURNING id
            """),
            {
                "name": category_name
            }
        ).fetchone()

        print(f"✅ Created category: {category_name}")

        return res[0]


# ==========================================
# INSERT AI POST
# ==========================================

def insert_ai_post(data: dict):
    """
    Inserts AI-generated article safely.

    Features:
    - Duplicate protection
    - Auto-approved AI posts
    - Safe transactions
    - Production-ready
    """

    try:

        with engine.begin() as conn:

            # ==========================================
            # DUPLICATE CHECK
            # ==========================================

            exists = conn.execute(
                text("""
                    SELECT id
                    FROM posts
                    WHERE source_url = :url
                    OR hash = :hash
                    LIMIT 1
                """),
                {
                    "url": data["source_url"],
                    "hash": data["hash"]
                }
            ).fetchone()

            if exists:
                print(f"⚠️ Duplicate skipped: {data['title']}")
                return None

            # ==========================================
            # INSERT POST
            # ==========================================

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

                    "category_id": get_category_id(
                        data.get("category", "General")
                    ),

                    "language": data.get("language", "rw"),

                    "hash": data["hash"]
                }
            )

            post_id = post.fetchone()[0]

            print(f"✅ Saved AI post ID: {post_id}")

            return post_id

    except IntegrityError as e:

        print("⚠️ IntegrityError:", str(e))

        return None

    except Exception as e:

        print("❌ Database insert failed:", str(e))

        return None