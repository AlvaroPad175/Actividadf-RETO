"""
scraper.py — Rate-limited HTTP client for Transfermarkt.
Handles retries, 429 rate-limiting, and optional Selenium fallback.
"""
import time
import random
import logging
import requests
from typing import Optional
from bs4 import BeautifulSoup
from rich.logging import RichHandler
from .constants import HEADERS, REQUEST_DELAY, MAX_RETRIES, TM_BASE

logger = logging.getLogger(__name__)


class Scraper:
    """Rate-limited HTTP client for Transfermarkt."""

    def __init__(self, delay: float = REQUEST_DELAY, use_selenium: bool = False):
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.delay = delay
        self.use_selenium = use_selenium
        self._driver = None

    def _wait(self):
        """Add jittered delay to avoid rate limiting."""
        jitter = random.uniform(0.5, 1.5)
        time.sleep(self.delay + jitter)

    def get_html(self, url: str) -> Optional[str]:
        """Fetch a URL with retry logic. Returns raw HTML or None on failure."""
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                self._wait()
                resp = self.session.get(url, timeout=15)
                if resp.status_code == 200:
                    logger.info(f"GET {url} -> 200")
                    return resp.text
                elif resp.status_code == 429:
                    wait = 30 * attempt
                    logger.warning(f"Rate limited (429). Waiting {wait}s...")
                    time.sleep(wait)
                elif resp.status_code == 403:
                    logger.warning(f"Blocked (403) on {url}. Switching to Selenium if available.")
                    if self.use_selenium:
                        return self._get_with_selenium(url)
                    return None
                else:
                    logger.warning(f"GET {url} -> {resp.status_code} (attempt {attempt})")
            except requests.RequestException as e:
                logger.error(f"Request error on {url}: {e} (attempt {attempt})")
            if attempt < MAX_RETRIES:
                time.sleep(5 * attempt)
        logger.error(f"All {MAX_RETRIES} attempts failed for {url}")
        return None

    def get_soup(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch URL and return BeautifulSoup object."""
        html = self.get_html(url)
        if html:
            return BeautifulSoup(html, "lxml")
        return None

    def _get_with_selenium(self, url: str) -> Optional[str]:
        """Fallback: use Selenium WebDriver for JS-rendered pages."""
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            from selenium.webdriver.chrome.service import Service
            from webdriver_manager.chrome import ChromeDriverManager

            if not self._driver:
                opts = Options()
                opts.add_argument("--headless")
                opts.add_argument("--no-sandbox")
                opts.add_argument("--disable-dev-shm-usage")
                opts.add_argument(f"user-agent={HEADERS['User-Agent']}")
                service = Service(ChromeDriverManager().install())
                self._driver = webdriver.Chrome(service=service, options=opts)

            self._driver.get(url)
            time.sleep(3)
            html = self._driver.page_source
            logger.info(f"Selenium GET {url} -> OK")
            return html
        except Exception as e:
            logger.error(f"Selenium error: {e}")
            return None

    def close(self):
        """Clean up Selenium driver if open."""
        if self._driver:
            self._driver.quit()
            self._driver = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


def fetch_champions_history(scraper: Scraper) -> Optional[BeautifulSoup]:
    """Get Liga MX champions history page from Transfermarkt."""
    from .constants import TM_LIGA_MX_HISTORY
    return scraper.get_soup(TM_LIGA_MX_HISTORY)


def fetch_team_squad(scraper: Scraper, tm_slug: str, tm_id: int, year: int) -> Optional[BeautifulSoup]:
    """Get a team's squad page for a specific season."""
    from .constants import TM_TEAM_SQUAD
    url = TM_TEAM_SQUAD.format(slug=tm_slug, tm_id=tm_id, year=year)
    return scraper.get_soup(url)


def fetch_match(scraper: Scraper, match_tm_id: int) -> Optional[BeautifulSoup]:
    """Get lineup data from a specific match page."""
    from .constants import TM_MATCH
    url = TM_MATCH.format(match_id=match_tm_id)
    return scraper.get_soup(url)
