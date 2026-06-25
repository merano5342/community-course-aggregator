"""
Async orchestrator for the frog.tw community university scraper.

Per-school flow:
  1. GET m_course_list.php → semester options
  2. GET m_course_list.php?s={hash} → parse all course stubs (name, teacher, day, etc.)
  3. Load existing JSON → find new u_hashes
  4. GET m_course_detail.php?u={hash} for each new course → parse full data
  5. Merge old + new and save to public/data/courses/{school}.json

Run:
  python scraper/main.py
  SCHOOL_LIST=nangang,songshan python scraper/main.py
"""
from __future__ import annotations

import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

import aiohttp

from config import FROG_SCHOOLS, SCHOOL_LIST, DATA_DIR, DELAY
from fetcher import fetch, make_session
from parser.frog import get_semester_options, parse_list_page, parse_detail_page
from output import load_existing, find_new_hashes, merge, save, save_list


async def scrape_school(session: aiohttp.ClientSession, school: str) -> None:
    base_url = FROG_SCHOOLS[school]
    print(f'\n[{school}] {base_url}')

    # ── 1. Fetch course list page (to get semester hash) ────────────────────
    list_base_url = f'{base_url}/course/m_course_list.php'
    try:
        index_html = await fetch(session, list_base_url)
    except RuntimeError as exc:
        print(f'  [error] cannot reach list page: {exc}')
        return

    semesters = get_semester_options(index_html)
    if not semesters:
        print(f'  [error] no semester found on {list_base_url}')
        return
    print(f'  semesters: {[label for _, label in semesters]}')

    # ── 2. Fetch all semesters' course lists ─────────────────────────────────
    all_list_items: list[dict] = []
    for i, (sem_hash, sem_label) in enumerate(semesters):
        list_url = f'{list_base_url}?s={sem_hash}'
        try:
            list_html = await fetch(session, list_url, delay=DELAY if i > 0 else 0)
            items = parse_list_page(list_html, school, sem_label)
            print(f'  [{sem_label}] {len(items)} courses')
            all_list_items.extend(items)
        except RuntimeError as exc:
            print(f'  [error] cannot fetch semester {sem_label}: {exc}')

    list_items = all_list_items
    print(f'  total: {len(list_items)} courses across {len(semesters)} semesters')
    if not list_items:
        return

    # ── 3. Find new courses (not yet in JSON) ────────────────────────────────
    existing = load_existing(school, DATA_DIR)
    new_hashes = find_new_hashes(list_items, existing)
    print(f'  new courses to scrape: {len(new_hashes)} / {len(list_items)}')

    # ── 4. Scrape detail pages for new courses ───────────────────────────────
    detail_map: dict[str, dict] = {}
    for i, u_hash in enumerate(new_hashes):
        detail_url = f'{base_url}/course/m_course_detail.php?u={u_hash}'
        try:
            detail_html = await fetch(session, detail_url, delay=DELAY if i > 0 else 0)
            detail_map[u_hash] = parse_detail_page(detail_html)
        except RuntimeError as exc:
            print(f'  [warn] detail failed for {u_hash[:8]}…: {exc}')

    # ── 5. Merge and save ────────────────────────────────────────────────────
    courses = merge(list_items, existing, detail_map)
    save(courses, school, DATA_DIR)
    save_list(courses, school, DATA_DIR)


async def main() -> None:
    unknown = [s for s in SCHOOL_LIST if s not in FROG_SCHOOLS]
    if unknown:
        print(f'[warn] unknown schools (skipped): {unknown}')

    to_scrape = [s for s in SCHOOL_LIST if s in FROG_SCHOOLS]
    if not to_scrape:
        print('[error] no valid schools to scrape')
        return

    async with make_session() as session:
        for school in to_scrape:
            await scrape_school(session, school)

    print('\nDone.')


if __name__ == '__main__':
    asyncio.run(main())
