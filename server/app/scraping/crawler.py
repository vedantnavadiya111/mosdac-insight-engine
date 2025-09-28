import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0 Safari/537.36"
}


def is_valid_url(url: str, base_domain: str) -> bool:
    """
    Check if URL belongs to MOSDAC domain and is valid HTTP/HTTPS
    """
    parsed = urlparse(url)
    return parsed.scheme in ("http", "https") and base_domain in parsed.netloc


def crawl_website(base_url: str, max_pages: int = 100):
    """
    Crawl the MOSDAC website and return a list of unique URLs
    """
    visited = set()
    to_visit = [base_url]

    base_domain = urlparse(base_url).netloc

    while to_visit and len(visited) < max_pages:
        url = to_visit.pop(0)
        if url in visited:
            continue

        try:
            response = requests.get(url, headers=HEADERS, timeout=(5, 15))
            response.raise_for_status()
        except Exception as e:
            print(f"❌ Failed to fetch {url}: {e}")
            continue

        visited.add(url)
        soup = BeautifulSoup(response.text, "html.parser")

        for link in soup.find_all("a", href=True):
            new_url = urljoin(url, link["href"])
            if is_valid_url(new_url, base_domain) and new_url not in visited:
                to_visit.append(new_url)

    return list(visited)


if __name__ == "__main__":
    urls = crawl_website("https://www.mosdac.gov.in")
    print(f"✅ Found {len(urls)} URLs")
    for u in urls:
        print(u)
