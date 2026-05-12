"""
TopNews AI Agent – Scheduler
- Runs automatically when server starts
- Fetches and generates news every 30 minutes
"""

import time
import schedule
import sys
import os

# Fix imports when spawned by Node.js from backend root
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetcher import run_test

INTERVAL_MINUTES = 30


def run_agent():
    print("\n🤖 TopNews AI Agent starting fetch cycle...")
    try:
        run_test()
    except Exception as e:
        print(f"❌ Agent cycle failed: {e}")
    print(f"⏳ Next fetch in {INTERVAL_MINUTES} minutes...\n")


if __name__ == "__main__":
    print("🚀 TopNews AI Agent started — runs every 30 minutes")
    print("=" * 50)

    # Run immediately on startup
    run_agent()

    # Then schedule every 30 minutes
    schedule.every(INTERVAL_MINUTES).minutes.do(run_agent)

    while True:
        schedule.run_pending()
        time.sleep(60)