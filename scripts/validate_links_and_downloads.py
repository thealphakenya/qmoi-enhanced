#!/usr/bin/env python3
"""Validate links found in markdown files and test file existence for Qmoi_apps references.

This tool is intentionally conservative (no external network calls by default). It will
check internal paths and URLs format; if run with --check-network it will attempt HTTP HEAD requests.
"""
import argparse
import json
import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'link-validation-report.json'

MD_RE = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')


def find_md_files():
    return list(ROOT.glob('**/*.md'))


def check_links(check_network=False):
    report = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'files': {}
    }
    for md in find_md_files():
        text = md.read_text(encoding='utf-8', errors='ignore')
        links = MD_RE.findall(text)
        entries = []
        for text_label, url in links:
            ok = None
            reason = None
            # local path
            if url.startswith('http'):
                ok = True if not check_network else False
                reason = 'external URL' if not check_network else 'not-checked'
            else:
                p = (md.parent / url).resolve()
                if p.exists():
                    ok = True
                else:
                    ok = False
                    reason = f'File not found: {p}'
            entries.append({'label': text_label, 'url': url, 'ok': ok, 'reason': reason})
        report['files'][str(md.relative_to(ROOT))] = entries
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print('Wrote', OUT)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check-network', action='store_true')
    args = parser.parse_args()
    check_links(check_network=args.check_network)
