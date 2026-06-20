"""
Parser for schools using the frog.tw CMS.

List page:  /course/m_index.php
Detail page: /course/m_course_detail.php?u={32-char-hash}

Key HTML patterns confirmed from live pages:
  - Semester select: <select id="q_semester"> → <option value="{hash}">{label}</option>
  - Course cell: <td class="fixedcell_135"><a class="course_info_link" href="...?u={hash}" onmouseover='tooltip.show("...")'>
  - Tooltip text: "名稱<br>備注<br>開課日期：YYYY-MM-DD(週)<br>招生人數：N人<br>報名人數：N人<br>繳費人數：N人<br>地點..."
  - Credits + counts: <div style="font-size:10px">3學分。招生20，報名5，繳費5</div>
"""
from __future__ import annotations

import re
from typing import Optional
from bs4 import BeautifulSoup, Tag

from models import Course, WeeklyTopic


# ---------------------------------------------------------------------------
# Semester
# ---------------------------------------------------------------------------

def get_semester_options(html: str) -> list[tuple[str, str]]:
    """Return [(hash, label), ...] from the semester <select>."""
    soup = BeautifulSoup(html, "lxml")
    sel = soup.find("select", id="q_semester")
    if not sel:
        return []
    return [
        (opt["value"], opt.get_text(strip=True))
        for opt in sel.find_all("option")
        if opt.get("value")
    ]


def get_latest_semester(html: str) -> Optional[tuple[str, str]]:
    """Return the first (i.e. latest) (hash, label) pair."""
    opts = get_semester_options(html)
    return opts[0] if opts else None


# ---------------------------------------------------------------------------
# List page
# ---------------------------------------------------------------------------

_CREDITS_RE = re.compile(r"(\d+)學分")
_QUOTA_RE   = re.compile(r"招生(\d+)")
_ENROLL_RE  = re.compile(r"報名(\d+)")
_PAID_RE    = re.compile(r"繳費(\d+)")
_DATE_RE    = re.compile(r"開課日期：(\d{4}-\d{2}-\d{2})")
_HASH_RE    = re.compile(r"[?&]u=([a-f0-9]{32})", re.I)


def _parse_tooltip(tooltip: str) -> dict:
    """Extract structured fields from the onmouseover tooltip string."""
    parts = [p.strip() for p in re.split(r"<br\s*/?>", tooltip, flags=re.I)]
    out: dict = {}
    for part in parts:
        if m := _DATE_RE.search(part):
            out["start_date"] = m.group(1)
        elif "招生人數" in part:
            if m := re.search(r"(\d+)", part):
                out["quota"] = int(m.group(1))
        elif "報名人數" in part:
            if m := re.search(r"(\d+)", part):
                out["enrolled"] = int(m.group(1))
        elif "繳費人數" in part:
            if m := re.search(r"(\d+)", part):
                out["paid"] = int(m.group(1))
        elif part and "地點" not in part:
            # First two non-meta parts are course name and notes
            if "name" not in out and not any(c in part for c in ["日期", "人數"]):
                out.setdefault("tooltip_name", part)
    return out


def parse_list_page(html: str, school: str, semester_label: str) -> list[dict]:
    """
    Parse a frog.tw list page.
    Returns list of dicts with keys matching Course fields.
    Only quota/enrolled are guaranteed accurate here; detail fields are absent.
    """
    soup = BeautifulSoup(html, "lxml")
    results: list[dict] = []

    for cell in soup.find_all("td", class_="fixedcell_135"):
        link = cell.find("a", class_="course_info_link")
        if not link:
            continue

        href = link.get("href", "")
        m = _HASH_RE.search(href)
        if not m:
            continue
        u_hash = m.group(1)

        # --- course code and name from link text ---
        raw_text = link.get_text(separator="\n", strip=True)
        lines = [l for l in raw_text.splitlines() if l]
        code = lines[0] if lines else ""
        name = lines[1] if len(lines) > 1 else ""

        # --- teacher: text after girl.png img ---
        teacher = ""
        imgs = link.find_all("img")
        for img in imgs:
            src = img.get("src", "")
            if "girl" in src or "boy" in src or "person" in src.lower():
                # text node immediately after
                nxt = img.next_sibling
                if nxt and isinstance(nxt, str):
                    teacher = nxt.strip()
                break
        if not teacher:
            # fallback: last non-empty text node
            for nxt in reversed(list(link.strings)):
                s = nxt.strip()
                if s and not s.startswith("(") and s != code and s != name:
                    teacher = s
                    break

        # --- schedule and location ---
        schedule = ""
        location = ""
        br = link.find("br")
        if br:
            after_br = br.next_sibling
            if after_br:
                raw_sched = str(after_br).strip()
                # "(一)18:00~20:30 "
                sched_span = link.find("span", class_=lambda c: c != "week_memo" if c else True)
                if sched_span:
                    location = sched_span.get_text(strip=True)
                    raw_sched = raw_sched.replace(location, "").strip()
                schedule = raw_sched

        # --- credits, quota, enrolled from footer div ---
        footer = cell.find("div", style=re.compile(r"font-size"))
        credits = 0
        quota: Optional[int] = None
        enrolled: Optional[int] = None
        paid: Optional[int] = None
        if footer:
            ft = footer.get_text()
            if m2 := _CREDITS_RE.search(ft):
                credits = int(m2.group(1))
            if m2 := _QUOTA_RE.search(ft):
                quota = int(m2.group(1))
            if m2 := _ENROLL_RE.search(ft):
                enrolled = int(m2.group(1))
            if m2 := _PAID_RE.search(ft):
                paid = int(m2.group(1))

        # --- tooltip for start_date ---
        tip_attr = link.get("onmouseover", "")
        tip_match = re.search(r'tooltip\.show\("(.+?)"\)', tip_attr, re.DOTALL)
        tip_data = _parse_tooltip(tip_match.group(1)) if tip_match else {}

        # --- has_video flag ---
        has_video = any(
            "影音" in (img.get("alt") or "") for img in link.find_all("img")
        )

        results.append({
            "id": f"{school}_{u_hash}",
            "school": school,
            "u_hash": u_hash,
            "code": code,
            "name": name,
            "teacher": teacher,
            "credits": credits,
            "schedule": schedule,
            "location": location,
            "semester": semester_label,
            "quota": quota,
            "enrolled": enrolled,
            "paid": paid,
            "has_video": has_video,
            "start_date": tip_data.get("start_date"),
        })

    return results


# ---------------------------------------------------------------------------
# Detail page
# ---------------------------------------------------------------------------

def parse_detail_page(html: str) -> dict:
    """
    Parse a frog.tw course detail page.
    Returns dict with optional fields: description, target_audience,
    outline (list of WeeklyTopic dicts), teacher_bio, notes, category.
    """
    soup = BeautifulSoup(html, "lxml")
    out: dict = {}

    def _text_after_header(header_text: str) -> Optional[str]:
        """Find a section div by its text content, return the next gray text div."""
        for div in soup.find_all("div", class_="w3-margin-top"):
            if div.get_text(strip=True) == header_text:
                # Walk siblings until we find the content div
                for sib in div.next_siblings:
                    if not isinstance(sib, Tag):
                        continue
                    classes = sib.get("class") or []
                    if "w3-text-gray" in classes or "word-wrap" in classes:
                        return sib.get_text(strip=True) or None
                    # Stop at next section header
                    if "w3-margin-top" in classes and sib.get_text(strip=True):
                        break
        return None

    # --- 課前資訊 section ---
    pre_info_div = None
    for div in soup.find_all("div", class_="w3-margin-top"):
        if div.get_text(strip=True) == "課前資訊":
            pre_info_div = div
            break

    if pre_info_div:
        for sib in pre_info_div.next_siblings:
            if not isinstance(sib, Tag):
                continue
            text = sib.get_text(strip=True)
            # "這門課適合誰?" icon
            if sib.name == "i" and "適合誰" in text:
                content_div = sib.find_next_sibling("div")
                if content_div:
                    out["target_audience"] = content_div.get_text(strip=True) or None
            # generic gray div = course description (before outline section)
            elif "w3-text-gray" in (sib.get("class") or []) and "target_audience" not in out:
                out["description"] = text or None
            # stop at next section
            elif "w3-margin-top" in (sib.get("class") or []) and text in ("課程大綱", "講師介紹"):
                break

    # --- 課程大綱 section ---
    outline_div = None
    for div in soup.find_all("div", class_="w3-margin-top"):
        if div.get_text(strip=True) == "課程大綱":
            outline_div = div
            break

    if outline_div:
        table = None
        for sib in outline_div.next_siblings:
            if isinstance(sib, Tag):
                table = sib.find("table")
                if table:
                    break
        if table:
            topics: list[WeeklyTopic] = []
            for row in table.find_all("tr"):
                tds = row.find_all("td")
                if len(tds) >= 3:
                    # td[0] = "第N週" (hidden on mobile), td[1] = "N" (mobile), td[2] = topic, td[3] = content
                    week = tds[0].get_text(strip=True) or tds[1].get_text(strip=True)
                    topic = tds[2].get_text(strip=True)
                    content = tds[3].get_text(strip=True) if len(tds) > 3 else ""
                    if topic:
                        topics.append(WeeklyTopic(week=week, topic=topic, content=content))
            if topics:
                out["outline"] = [t.model_dump() for t in topics]

    # --- 講師介紹 section ---
    teacher_div = None
    for div in soup.find_all("div", class_="w3-margin-top"):
        if div.get_text(strip=True) == "講師介紹":
            teacher_div = div
            break

    if teacher_div:
        for sib in teacher_div.next_siblings:
            if not isinstance(sib, Tag):
                continue
            classes = sib.get("class") or []
            if "w3-text-gray" in classes and "w3-margin-bottom" in classes:
                bio = sib.get_text(strip=True)
                if bio:
                    out["teacher_bio"] = bio
                break

    # --- category from breadcrumb / page title ---
    breadcrumb = soup.find("div", class_="w3-breadcrumb") or soup.find("nav")
    if breadcrumb:
        items = [a.get_text(strip=True) for a in breadcrumb.find_all("a")]
        if len(items) >= 2:
            out["category"] = items[-2]  # typically the department/category

    return out
