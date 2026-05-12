# test_env.py
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DATABASE_URL:", os.getenv("DATABASE_URL"))
print(".env path:", Path(__file__).resolve().parent.parent / ".env")