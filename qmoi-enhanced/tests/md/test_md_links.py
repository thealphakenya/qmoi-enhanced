import re
import requests

MD_FILE = "ALLMDFILESREFS.md"


def extract_links(md_file):
    with open(md_file, "r", encoding="utf-8") as f:
        content = f.read()
    # Find all http/https links
    return re.findall(r"https?://[^\s)]+", content)


def test_md_links():
    links = extract_links(MD_FILE)
    broken = []
    for url in links:
        try:
            resp = requests.head(url, timeout=10, allow_redirects=True)
            if resp.status_code >= 400:
                broken.append((url, resp.status_code))
        except Exception as e:
            broken.append((url, str(e)))
    assert not broken, f"Broken links found: {broken}"
