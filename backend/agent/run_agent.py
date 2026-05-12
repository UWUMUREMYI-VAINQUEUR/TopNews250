"""
run_agent.py — called by Node.js (adminRoutes.js + server.js auto-run)
Fetches articles via fetcher.py and writes them to the database via writer.py
"""
import sys
import os

# Fix Windows CP1252 encoding error — emojis in print() crash without this
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Make sure imports resolve correctly when called from Node
sys.path.insert(0, os.path.dirname(__file__))

from fetcher import run_test
from writer import write_article

def main():
    print("TopNews AI Agent starting...", flush=True)

    articles = run_test()

    if not articles:
        print("No articles fetched. Exiting.", flush=True)
        sys.exit(0)

    print(f"\nWriting {len(articles)} articles to database...\n", flush=True)

    written = 0
    skipped = 0
    failed  = 0

    for article in articles:
        try:
            source_text = f"{article['title']}\n\n{article['summary']}"

            result = write_article(
                source_text=source_text,
                source_name=article["source_name"],
                source_url=article["link"],
                image_url=article.get("image_url"),
                category=article["category"],
            )

            if result:
                print(f" OK: {article['title'][:70]}", flush=True)
                written += 1
            else:
                print(f" SKIP (duplicate): {article['title'][:70]}", flush=True)
                skipped += 1

        except Exception as e:
            print(f" FAIL: {article['title'][:70]} -> {e}", flush=True)
            failed += 1

    print(f"\nDone -- {written} written, {skipped} skipped, {failed} failed", flush=True)

if __name__ == "__main__":
    main()