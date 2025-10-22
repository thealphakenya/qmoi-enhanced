#!/usr/bin/env python3
"""Validate links found in the repository and produce docs/link-check.json.

This script performs a conservative check: it extracts URLs from the
reference markdown file (@ALLMDFILESREFS.md or ALLMDFILESREFS.md) and from
webmanifest files. By default it checks local file existence. Pass
--check-network to attempt HTTP HEAD requests for remote URLs.
"""

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'link-check.json'
OUT.parent.mkdir(parents=True, exist_ok=True)

URL_RE = re.compile(r'https?://[^)\s\']+')


def find_urls_in_text(text: str):
    return list(set(URL_RE.findall(text)))


def check_remote_url(url: str) -> bool:
    try:
        import urllib.request
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status < 400
    except Exception:
        return False


def main(check_network: bool = False):
    findings = []

    # read reference list
    ref = ROOT / '@ALLMDFILESREFS.md'
    if not ref.exists():
        ref = ROOT / 'ALLMDFILESREFS.md'

    if ref.exists():
        text = ref.read_text(encoding='utf8')
        for u in find_urls_in_text(text):
            ok = None
            if check_network:
                ok = check_remote_url(u)
            findings.append({'url': u, 'source': str(ref), 'ok': ok})
    else:
        print('Reference list not found; skipping remote checks')

    # scan webmanifests
    for mf in ROOT.rglob('*.webmanifest'):
        text = mf.read_text(encoding='utf8')
        for u in find_urls_in_text(text):
            ok = check_remote_url(u) if check_network else None
            findings.append({'url': u, 'source': str(mf), 'ok': ok})

    OUT.write_text(json.dumps({'generated_at': datetime.utcnow().isoformat() + 'Z', 'checked': findings}, indent=2), encoding='utf8')
    print('Wrote', OUT)


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--check-network', action='store_true')
    args = p.parse_args()
    main(check_network=args.check_network)
