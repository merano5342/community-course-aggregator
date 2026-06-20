from __future__ import annotations
import asyncio
import aiohttp
from config import CONCURRENCY, DELAY, HEADERS

_semaphore = asyncio.Semaphore(CONCURRENCY)


async def fetch(session: aiohttp.ClientSession, url: str, *, delay: float = 0.0) -> str:
    """Fetch a URL with semaphore-limited concurrency and simple retry."""
    async with _semaphore:
        if delay:
            await asyncio.sleep(delay)
        for attempt in range(3):
            try:
                async with session.get(url, headers=HEADERS, timeout=aiohttp.ClientTimeout(total=20)) as resp:
                    resp.raise_for_status()
                    return await resp.text(encoding="utf-8", errors="replace")
            except (aiohttp.ClientError, asyncio.TimeoutError) as exc:
                if attempt == 2:
                    raise RuntimeError(f"Failed to fetch {url} after 3 attempts: {exc}") from exc
                await asyncio.sleep(2 ** attempt)
    return ""  # unreachable


def make_session() -> aiohttp.ClientSession:
    connector = aiohttp.TCPConnector(ssl=False, limit=CONCURRENCY)
    return aiohttp.ClientSession(connector=connector)
