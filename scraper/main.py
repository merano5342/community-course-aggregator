"""
Async orchestrator for the community-course scraper.

Run:
  python scraper/main.py
  SCHOOL_LIST=nangang,songshan python scraper/main.py

Per-school flow:
  1. Fetch list page → get semester hash + all course stubs
  2. Load existing JSON → find new u_hashes
  3. Fetch detail pages for new courses (with DELAY between requests)
  4. Merge and save
"""
from __future__ import annotations

import asyncio
import sys
import os

# Allow running from repo root: python scraper/main.py
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

import aiohttp

from config import FROG_SCHOOLS, SCHOOL_LIST, DATA_DIR, DELAY
from fetcher import fetch, make_session
from parser.frog import get_latest_semester, parse_list_page, parse_detail_page
from output import load_existing, find_new_hashes, merge, save


async def scrape_school(session: aiohttp.ClientSession, school: str) -> None:
    base_url = FROG_SCHOOLS[school]
    print(f"\n[{school}] {base_url}")

    # --- 1. Fetch list page (semester selector page) ---
    index_url = f"{base_url}/course/m_index.php"
    try:
        index_html = await fetch(session, index_url)
    except RuntimeError as exc:
        print(f"  [error] cannot reach list page: {exc}")
        return

    semester = get_latest_semester(index_html)
    if not semester:
        print(f"  [error] no semester found on {index_url}")
        return
    sem_hash, sem_label = semester
    print(f"  semester: {sem_label} ({sem_hash[:8]}…)")

    # --- 2. Fetch semester-filtered list ---
    list_url = f"{base_url}/course/m_index.php?q_semester={sem_hash}"
    try:
        list_html = await fetch(session, list_url)
    except RuntimeError as exc:
        print(f"  [error] cannot fetch course list: {exc}")
        return

    list_items = parse_list_page(list_html, school, sem_label)
    print(f"  list page: {len(list_items)} courses found")
    if not list_items:
        return

    # --- 3. Incremental: find new u_hashes ---
    existing = load_existing(school, DATA_DIR)
    new_hashes = find_new_hashes(list_items, existing)
    print(f"  new courses needing detail scrape: {len(new_hashes)}")

    # --- 4. Fetch detail pages for new courses ---
    detail_map: dict[str, dict] = {}
    for i, u_hash in enumerate(new_hashes):
        detail_url = f"{base_url}/course/m_course_detail.php?u={u_hash}"
        try:
            detail_html = await fetch(session, detail_url, delay=DELAY if i > 0 else 0)
            detail_map[u_hash] = parse_detail_page(detail_html)
        except RuntimeError as exc:
            print(f"  [warn] detail fetch failed for {u_hash[:8]}: {exc}")

    # --- 5. Merge and save ---
    courses = merge(list_items, existing, detail_map)
    save(courses, school, DATA_DIR)


async def main() -> None:
    unknown = [s for s in SCHOOL_LIST if s not in FROG_SCHOOLS]
    if unknown:
        print(f"[warn] unknown schools (skipped): {unknown}")

    to_scrape = [s for s in SCHOOL_LIST if s in FROG_SCHOOLS]
    if not to_scrape:
        print("[error] no valid schools to scrape")
        return

    async with make_session() as session:
        # Run schools sequentially to be polite; parallelize within each school
        for school in to_scrape:
            await scrape_school(session, school)

    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
