#!/usr/bin/env python3
"""Validate HTTP(S) links found in Markdown files and report failures.

Writes results to ALLERRORS.txt and ALLERRORS.md. Skips known vendor directories.
"""
from pathlib import Path
import re
import requests
import time

ROOT = Path('.')
IGNORED = ['node_modules', '.git', 'qmoi-enhanced/mobile/node_mod']
LINK_RE = re.compile(r"https?://[^")\]\s]+")
# The regex above had a character class issue in some shells; use a safer approach
LINK_RE = re.compile(r"https?://[^\s)\]]+")

def find_md_links(root: Path):
    results = []
    for p in sorted(root.rglob('*.md')):
        if any(ig in p.parts for ig in IGNORED):
            continue
        try:
            txt = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        for m in LINK_RE.finditer(txt):
            url = m.group(0).rstrip(')')
            results.append((p, url))
    return results

def check_url(url):
    headers = {'User-Agent': 'QMOI-LinkValidator/1.0'}
    try:
        resp = requests.head(url, headers=headers, timeout=6, allow_redirects=True)
        if resp.status_code >= 400:
            # try GET for sites that don't allow HEAD
            resp = requests.get(url, headers=headers, timeout=8, allow_redirects=True)
        return resp.status_code, resp.url
    except Exception as e:
        return None, str(e)

def main():
    links = find_md_links(ROOT)
    failures = []
    for p, url in links:
        status, info = check_url(url)
        if status is None or status >= 400:
            failures.append(f"{p}:{url} -> {info} (status={status})")
        time.sleep(0.1)

    txt = Path('ALLERRORS.txt')
    md = Path('ALLERRORS.md')
    txt.write_text('\n'.join(failures) + '\n')
    with md.open('w', encoding='utf-8') as f:
        f.write('# ALLERRORS\n\n')
        if not failures:
            f.write('No link failures found.\n')
        else:
            for fr in failures:
                f.write(f'- `{fr}`\n')
    print('Link validation complete. Failures:', len(failures))

if __name__ == '__main__':
    main()
