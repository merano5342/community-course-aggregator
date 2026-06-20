"""
Parser for schools using the frog.tw CMS.

Correct URLs (verified against live pages):
  List:   /course/m_course_list.php                   → semester <select name="q_semester">
  List:   /course/m_course_list.php?s={hash}          → course cards in div.content_box
  Detail: /course/m_course_detail.php?u={32-char-hash}

List page course structure (per course):
  <a href='m_course_detail.php?u={hash}'
     onmouseover='tooltip.show("{full_name}<br>開課日期：YYYY-MM-DD(星期X)<br>")' />
  <div class="content_box">
    <img src="images_course/.../thumb/{hash}.jpeg" />
    <h1><b>{truncated_name}</b> [icon_video] [span.icon_course_status 滿]</h1>
    <div class="w3-text-red">混成課程。</div>   ← only if mixed
    <h2>開課日期：YYYY-MM-DD&nbsp;(X)上午/下午/晚上</h2>
    <h2>{area}&nbsp;{semester}&nbsp;<img src=".../girl.png"/>老師名</h2>
  </div>

Detail page key elements:
  <title>115-秋季班 1152A1001-課程名-校名</title>
  <div class="w3-card-2 w3-row ...">
    招生人數：N人 / 報名人數：N人 / 繳費人數：N人
    上課日期：YYYY-MM-DD (第一週)，(共N週)
    上課時間：每星期X 上午/下午/晚上 Hh~Hh
    上課地點：地點
  </div>
  <div class="city">
    課前資訊 / 這門課適合誰? / 需要準備... / 課程大綱 table / 講師介紹 / 學分費...
  </div>
"""
from __future__ import annotations

import re
from typing import Optional
from bs4 import BeautifulSoup, Tag, NavigableString

# ── day-of-week mapping ──────────────────────────────────────────────────────
_DAY_MAP = {'日': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6}

# ── regex helpers ────────────────────────────────────────────────────────────
_HASH_RE    = re.compile(r'\?u=([a-f0-9]{32})', re.I)
_NUMBER_RE  = re.compile(r'(\d+)')
_DATE_RE    = re.compile(r'(\d{4}-\d{2}-\d{2})')
_WEEKS_RE   = re.compile(r'共(\d+)週')
_FEE_RE     = re.compile(r'(\d[\d,]+)\s*元')


# ── semester ─────────────────────────────────────────────────────────────────

def get_semester_options(html: str) -> list[tuple[str, str]]:
    """Return [(hash, label), …] from the semester <select> on m_course_list.php."""
    soup = BeautifulSoup(html, 'lxml')
    # m_course_list.php uses id="q_semester"; m_index.php uses name="q_semester"
    sel = soup.find('select', id='q_semester') or soup.find('select', attrs={'name': 'q_semester'})
    if not sel:
        return []
    return [
        (opt['value'], opt.get_text(strip=True))
        for opt in sel.find_all('option')
        if opt.get('value')
    ]


def get_latest_semester(html: str) -> Optional[tuple[str, str]]:
    opts = get_semester_options(html)
    return opts[0] if opts else None


# ── list page ─────────────────────────────────────────────────────────────────

def _parse_day_slot(text: str) -> tuple[int, str]:
    """'(一)下午' → (1, 'afternoon');  '(六)早上' → (6, 'morning')."""
    m = re.search(r'[（(]([日一二三四五六])[）)]', text)
    day = _DAY_MAP.get(m.group(1), 0) if m else 0
    if any(k in text for k in ('早上', '上午')):
        slot = 'morning'
    elif '下午' in text:
        slot = 'afternoon'
    else:
        slot = 'evening'
    return day, slot


def parse_list_page(html: str, school: str, semester_label: str) -> list[dict]:
    """
    Parse m_course_list.php?s={hash}.
    Returns one dict per course with fields that can be filled from the list page.
    Heavier fields (quota, schedule_time, fee, description…) come from the detail page.
    """
    soup = BeautifulSoup(html, 'lxml')
    results: list[dict] = []

    for link in soup.find_all('a', href=_HASH_RE):
        href = link.get('href', '')
        m = _HASH_RE.search(href)
        if not m:
            continue
        u_hash = m.group(1)

        # content_box is a sibling immediately after the <a/>
        box: Optional[Tag] = None
        nxt = link.next_sibling
        while nxt and not isinstance(nxt, Tag):
            nxt = nxt.next_sibling
        if isinstance(nxt, Tag) and 'content_box' in (nxt.get('class') or []):
            box = nxt

        if not box:
            continue

        # ── name from tooltip (full) or h1 (truncated) ──────────────────────
        tip_raw = link.get('onmouseover', '')
        tip_m = re.search(r'tooltip\.show\("(.+?)"\)', tip_raw, re.DOTALL)
        name = ''
        if tip_m:
            tip_parts = re.split(r'<br\s*/?>', tip_m.group(1), flags=re.I)
            name = tip_parts[0].strip()
        if not name:
            h1 = box.find('h1')
            name = h1.get_text(strip=True) if h1 else ''

        # ── flags from h1 ────────────────────────────────────────────────────
        h1 = box.find('h1')
        has_video = bool(h1 and h1.find('img', attrs={'alt': re.compile(r'影音')}))
        status_span = h1.find('span', class_='icon_course_status') if h1 else None
        is_full = bool(status_span and '滿' in status_span.get_text())

        # ── mixed course flag ─────────────────────────────────────────────────
        red_div = box.find('div', class_='w3-text-red')
        is_mixed = bool(red_div and '混成' in red_div.get_text())

        # ── h2 rows ───────────────────────────────────────────────────────────
        h2s = box.find_all('h2')
        day_of_week, time_slot, start_date = 0, 'evening', ''
        area, teacher, semester = '', '', semester_label

        if h2s:
            h2a = h2s[0].get_text(strip=True)
            # "開課日期：2026-08-31 (一)下午"
            dm = _DATE_RE.search(h2a)
            if dm:
                start_date = dm.group(1)
            day_of_week, time_slot = _parse_day_slot(h2a)

        if len(h2s) >= 2:
            h2b = h2s[1]
            # Collect text nodes (area + semester) and teacher after img
            parts: list[str] = []
            after_img = False
            for child in h2b.children:
                if isinstance(child, NavigableString):
                    text = child.strip()
                    if text:
                        if after_img:
                            teacher = text
                        else:
                            parts.extend(t.strip() for t in text.split('\xa0') if t.strip())
                elif isinstance(child, Tag) and child.name == 'img':
                    after_img = True
            # parts might be ["成德", "115-秋季班"]
            for p in parts:
                if re.search(r'\d+-', p):
                    semester = p
                else:
                    area = p

        # ── image url ────────────────────────────────────────────────────────
        img = box.find('img')
        image_url = img.get('src', '') if img else ''

        results.append({
            'id': f'{school}_{u_hash}',
            'school': school,
            'u_hash': u_hash,
            'name': name,
            'semester': semester,
            'area': area,
            'teacher': teacher,
            'start_date': start_date,
            'day_of_week': day_of_week,
            'time_slot': time_slot,
            'has_video': has_video,
            'is_mixed': is_mixed,
            'status': 'full' if is_full else 'open',
            'image_url': image_url,
        })

    return results


# ── detail page ───────────────────────────────────────────────────────────────

def _int_after_label(text: str, label: str) -> Optional[int]:
    pattern = re.escape(label) + r'[^\d]*(\d+)'
    m = re.search(pattern, text)
    return int(m.group(1)) if m else None


def parse_detail_page(html: str) -> dict:
    """
    Parse m_course_detail.php?u={hash}.
    Returns dict with all available fields; caller merges into the list-page dict.
    """
    soup = BeautifulSoup(html, 'lxml')
    out: dict = {}

    # ── title: "115-秋季班 1152A1001-課程名-校名" ────────────────────────────
    title_tag = soup.find('title')
    if title_tag:
        title_text = title_tag.get_text(strip=True)
        # Extract code + name: "1152A1001-用畫筆走讀城市風景"
        m = re.search(r'(\d+[A-Za-z]\d+)-([^-]+)', title_text)
        if m:
            out['code'] = m.group(1)
            out['name'] = m.group(2).strip()

    # ── w3-card-2: quota, schedule, location ─────────────────────────────────
    card = soup.find('div', class_=lambda c: c and 'w3-card-2' in c)
    if card:
        card_text = card.get_text(separator='\n', strip=True)
        q  = _int_after_label(card_text, '招生人數：')
        en = _int_after_label(card_text, '報名人數：')
        pa = _int_after_label(card_text, '繳費人數：')
        if q  is not None: out['quota']    = q
        if en is not None: out['enrolled'] = en
        if pa is not None: out['paid']     = pa

        dm = _DATE_RE.search(card_text)
        if dm: out['start_date'] = dm.group(1)

        wm = _WEEKS_RE.search(card_text)
        if wm: out['weeks'] = int(wm.group(1))

        # 上課時間：每星期一 下午 2點0分~5點0分
        time_m = re.search(r'上課時間：(.+?)(?:\n|上課地點)', card_text, re.DOTALL)
        if time_m:
            schedule_raw = time_m.group(1).strip()
            out['schedule'] = schedule_raw
            # Derive day_of_week from 星期X
            dm2 = re.search(r'星期([日一二三四五六])', schedule_raw)
            if dm2:
                out['day_of_week'] = _DAY_MAP.get(dm2.group(1), 0)
            out['time_slot'] = _parse_day_slot(schedule_raw)[1]

        loc_m = re.search(r'上課地點：(.+?)(?:\n|$)', card_text)
        if loc_m: out['location'] = loc_m.group(1).strip()

    # ── city div: description, fee, outline, teacher bio ─────────────────────
    city = soup.find('div', class_='city')
    if city:
        city_text = city.get_text(separator='\n', strip=True)

        # Fee: "學分費 N 學分，XXXX元"
        fee_m = re.search(r'學分費[^\n]*\n([^\n]+)', city_text)
        if fee_m:
            fee_line = fee_m.group(1)
            credits_m = re.search(r'(\d+)\s*學分', fee_line)
            fee_val_m = _FEE_RE.search(fee_line.replace(',', ''))
            if credits_m: out['credits'] = int(credits_m.group(1))
            if fee_val_m: out['fee'] = int(fee_val_m.group(1).replace(',', ''))

        # 這門課適合誰?
        ta_m = re.search(r'這門課適合誰\??\n(.+?)(?:\n[^\n]*\?|\n課程)', city_text, re.DOTALL)
        if ta_m:
            out['target_audience'] = ta_m.group(1).strip()

        # 課程大綱 (if table exists)
        outline_table = city.find('table')
        if outline_table:
            rows: list[dict] = []
            last_week = ''
            for tr in outline_table.find_all('tr'):
                # Skip header rows (th only)
                tds = tr.find_all('td')
                if not tds:
                    continue
                if len(tds) >= 3:
                    # Normal row: week | topic | content
                    week = tds[0].get_text(strip=True) or last_week
                    topic = tds[1].get_text(strip=True)
                    content = tds[2].get_text(strip=True)
                    if week:
                        last_week = week
                elif len(tds) == 2:
                    # Continuation row: week cell has rowspan, only topic | content
                    week = last_week
                    topic = tds[0].get_text(strip=True)
                    content = tds[1].get_text(strip=True)
                else:
                    continue
                if topic:
                    rows.append({'week': week, 'topic': topic, 'content': content})
            if rows:
                out['outline'] = rows

        # 講師介紹
        teacher_m = re.search(r'講師介紹\n(.+?)(?:\n課程|\Z)', city_text, re.DOTALL)
        if teacher_m:
            bio = teacher_m.group(1).strip()
            if bio and '圖片' not in bio:
                out['teacher_bio'] = bio[:500]

        # 課程理念 / 課程目標 → description
        desc_parts = []
        for label in ('課程理念', '課程目標', '課程簡介'):
            dm = re.search(re.escape(label) + r'\n(.+?)(?:\n[^\n]{0,20}\n|\Z)', city_text, re.DOTALL)
            if dm:
                text = dm.group(1).strip()
                if text and len(text) > 10:
                    desc_parts.append(text[:300])
        if desc_parts:
            out['description'] = '\n'.join(desc_parts)

    return out
