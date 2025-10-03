import requests
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
import warnings
from io import BytesIO
from pdfminer.high_level import extract_text as pdf_extract_text

# Suppress XML warnings from BeautifulSoup
warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)


def extract_text_from_url(url: str):
    try:
        response = requests.get(
            url, timeout=15, headers={"User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)"}
        )
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to fetch {url}: {e}")
        return None

    content_type = response.headers.get("Content-Type", "").lower()

    # Handle PDFs
    if "application/pdf" in content_type or url.endswith(".pdf"):
        try:
            text = pdf_extract_text(BytesIO(response.content))
            return {
                "url": url,
                "title": url.split("/")[-1],
                "content": text.strip() if text else "No text extracted",
            }
        except Exception as e:
            print(f"❌ Failed to extract PDF {url}: {e}")
            return None

    # Handle XML (RSS feeds, sitemaps, etc.)
    elif "xml" in content_type or url.endswith(".xml") or url.endswith(".rss"):
        try:
            soup = BeautifulSoup(response.text, "xml")
        except Exception:
            print(f"⚠️ Falling back to HTML parser for {url}")
            soup = BeautifulSoup(response.text, "html.parser")

        title = (
            soup.title.string.strip()
            if soup.title and soup.title.string
            else "No Title"
        )
        text = soup.get_text(separator=" ", strip=True)
        return {"url": url, "title": title, "content": text}

    # Handle HTML
    elif "text/html" in content_type:
        soup = BeautifulSoup(response.text, "html.parser")

        title = (
            soup.title.string.strip()
            if soup.title and soup.title.string
            else "No Title"
        )

        for script in soup(["script", "style", "noscript"]):
            script.extract()

        text = soup.get_text(separator=" ", strip=True)
        if not text or len(text) < 50:  # skip junk pages
            return None

        return {"url": url, "title": title, "content": text}

    else:
        # Unknown/binary content (images, zip, etc.)
        print(f"⚠️ Skipping unsupported content type: {content_type} ({url})")
        return None
