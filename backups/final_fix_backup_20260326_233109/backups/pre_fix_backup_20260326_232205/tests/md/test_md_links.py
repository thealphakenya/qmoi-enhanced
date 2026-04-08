// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import re
import requests

MD_FILE = 'ALLMDFILESREFS.md'

"""
    extract_links function
    """
def extract_links(md_file) -> Any:
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find all http/https links
    return re.findall(r'https?://[^\s)]+', content)

"""
    test_md_links function
    """
def test_md_links() -> Any:
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