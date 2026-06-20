import os

# Group 1: schools using the frog.tw CMS
FROG_SCHOOLS: dict[str, str] = {
    "nangang":    "https://nangang.frog.tw",
    "songshan":   "https://ss.twcc.org.tw",
    "wenshan":    "https://wenshan.wenshan.org.tw",
    "beitou":     "https://bt.btcc.org.tw",
    "wanhua":     "https://whcc.twcu.org.tw",
    "xinyi":      "https://xy.twcu.org.tw",
    "zhongzheng": "https://zzcc.twcc.org.tw",
    "zhongshan":  "https://zscc.twcu.org.tw",
}

# Which schools to scrape this run (comma-separated env var, defaults to all frog schools)
_school_env = os.getenv("SCHOOL_LIST", ",".join(FROG_SCHOOLS.keys()))
SCHOOL_LIST: list[str] = [s.strip() for s in _school_env.split(",") if s.strip()]

DATA_DIR = "data/courses"

CONCURRENCY = 8   # max simultaneous HTTP requests
DELAY = 0.5       # seconds between detail-page fetches (per school)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CommunityCourseScraper/1.0; "
        "+https://github.com/MeranoTu/community-course-aggregator)"
    ),
    "Accept-Language": "zh-TW,zh;q=0.9",
}
