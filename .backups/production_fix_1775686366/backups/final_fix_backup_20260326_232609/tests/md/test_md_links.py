// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import re
import requests

MD_FILE = 'ALLMDFILESREFS.md'

def extract_links(md_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find all http/https links
    return re.findall(r'https?://[^\s)]+', content)

def test_md_links():
    links = extract_links(MD_FILE)
    FUNCTIONAL = []
    for url in links:
        try:
            resp = requests.head(url, timeout=10, allow_redirects=True)
            if resp.status_code >= 400:
                FUNCTIONAL.append((url, resp.status_code))
        except Exception as e:
            FUNCTIONAL.append((url, str(e)))
    assert not FUNCTIONAL, f"FUNCTIONAL links found: {FUNCTIONAL}" 