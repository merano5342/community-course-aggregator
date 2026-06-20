"""
Handles reading existing JSON, computing the diff, and writing merged output.

Incremental strategy:
  1. Scrape list page every run → get {u_hash, quota, enrolled} for all courses
  2. Load old JSON to find which u_hashes already have detail data
  3. Only new u_hashes need detail page scraping
  4. Old courses keep their detail fields, get updated quota/enrolled
  5. Write merged result
"""
from __future__ import annotations

import json
import os
from typing import Optional

from models import Course

INDENT = 2


def load_existing(school: str, data_dir: str) -> dict[str, dict]:
    """Load existing JSON for a school. Returns dict keyed by u_hash (snake_case)."""
    path = os.path.join(data_dir, f"{school}.json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        raw: list[dict] = json.load(f)
    # JSON keys are camelCase (from model alias); convert back to snake_case for lookup
    result = {}
    for c in raw:
        converted = _camel_to_snake(c)
        u = converted.get("u_hash", "")
        if u:
            result[u] = converted
    return result


def find_new_hashes(list_items: list[dict], existing: dict[str, dict]) -> list[str]:
    """Return u_hashes not yet in JSON (no detail data scraped for them yet)."""
    return [
        item["u_hash"] for item in list_items
        if item["u_hash"] not in existing
        or existing[item["u_hash"]].get("code") is None  # detail not yet scraped
    ]


def merge(
    list_items: list[dict],
    existing: dict[str, dict],
    detail_map: dict[str, dict],
) -> list[Course]:
    """
    Merge list-page data, existing detail data, and freshly scraped detail data.

    Priority:
      - quota/enrolled/paid always taken from list_items (freshest)
      - detail fields (description, outline, etc.) taken from detail_map first,
        then fall back to existing JSON
    """
    merged: list[Course] = []
    for item in list_items:
        u = item["u_hash"]
        # Start from existing record (has detail fields) or bare list data
        # existing is already snake_case (converted in load_existing)
        base = dict(existing.get(u, {}))

        record = {**base, **item}

        # Overlay freshly scraped detail (only for new courses)
        if u in detail_map:
            record.update(detail_map[u])

        try:
            merged.append(Course(**record))
        except Exception as exc:
            print(f"  [warn] skipping malformed course {u}: {exc}")

    return merged


def save(courses: list[Course], school: str, data_dir: str) -> None:
    os.makedirs(data_dir, exist_ok=True)
    path = os.path.join(data_dir, f"{school}.json")
    data = [
        c.model_dump(by_alias=True, exclude_none=True)
        for c in courses
    ]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=INDENT)
    print(f"  saved {len(data)} courses → {path}")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _camel_to_snake(d: dict) -> dict:
    """Convert camelCase keys in a dict to snake_case (shallow)."""
    import re
    def to_snake(s: str) -> str:
        return re.sub(r"(?<!^)(?=[A-Z])", "_", s).lower()
    return {to_snake(k): v for k, v in d.items()}
