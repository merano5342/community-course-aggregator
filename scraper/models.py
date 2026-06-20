from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class WeeklyTopic(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    week: str
    topic: str
    content: str = ''


class Course(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    # Core identity
    id: str                              # "{school}_{u_hash}"
    school: str
    u_hash: str

    # From list page (always present)
    name: str
    teacher: str = ''
    semester: str                        # e.g. "115-秋季班"
    area: str = ''                       # general location area e.g. "成德"
    start_date: Optional[str] = None
    day_of_week: int = 0                 # 0=Sun 1=Mon … 6=Sat
    time_slot: str = 'evening'           # 'morning' | 'afternoon' | 'evening'
    has_video: bool = False
    is_mixed: bool = False
    status: str = 'open'                 # 'open' | 'full'
    image_url: str = ''

    # From detail page (after first scrape)
    code: Optional[str] = None           # course code e.g. "1152A1001"
    credits: Optional[int] = None
    fee: Optional[int] = None            # tuition fee in NTD
    weeks: Optional[int] = None
    quota: Optional[int] = None
    enrolled: Optional[int] = None
    paid: Optional[int] = None
    schedule: Optional[str] = None      # "每星期一 下午 2點0分~5點0分"
    location: Optional[str] = None      # specific location

    # Rich content (from detail page, scraped once)
    description: Optional[str] = None
    target_audience: Optional[str] = None
    outline: Optional[list[WeeklyTopic]] = None
    teacher_bio: Optional[str] = None
