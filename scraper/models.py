from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class WeeklyTopic(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    week: str
    topic: str
    content: str = ""


class Course(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    # Required fields (present on list page)
    id: str                       # "{school}_{u_hash}"
    school: str                   # e.g. "nangang"
    code: str                     # e.g. "1152C2311"
    name: str
    teacher: str
    credits: int
    schedule: str                 # e.g. "(一)18:00~20:30"
    location: str
    semester: str                 # e.g. "115-秋季班"
    u_hash: str                   # 32-char hash from m_course_detail.php?u=

    # Updated on every run from list page tooltip
    quota: Optional[int] = None
    enrolled: Optional[int] = None
    paid: Optional[int] = None

    # Fetched once from detail page (only for new courses)
    description: Optional[str] = None
    target_audience: Optional[str] = None
    outline: Optional[list[WeeklyTopic]] = None
    teacher_bio: Optional[str] = None
    notes: Optional[str] = None
    has_video: bool = False
    category: Optional[str] = None
    start_date: Optional[str] = None  # "2026-08-31"
