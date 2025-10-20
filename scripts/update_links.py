#!/usr/bin/env python3
"""Replace webhook/ngrok placeholders in Markdown files with the current ngrok URL.

Usage:
  1. Start ngrok (or otherwise obtain a public URL) and ensure scripts/ngrok_manager.py wrote the URL to `.qmoi/ngrok_url`.
  2. Run: python3 scripts/update_links.py --apply

This script is intentionally conservative: it makes a backup of each file it modifies and only
replaces known placeholders such as '<your-ngrok-subdomain>' and '<your-ngrok-id>' and markers like
'__NGROK_URL__' or '<ngrok_url>' with the discovered ngrok URL. It does not change production hostnames.
"""
from pathlib import Path
import re
import argparse

ROOT = Path('.').resolve()
NGROK_FILE = ROOT / '.qmoi' / 'ngrok_url'
PLACEHOLDERS = [r'<your-ngrok-subdomain>', r'<your-ngrok-id>', r'<ngrok_url>', r'__NGROK_URL__']

def discover_ngrok():
    if not NGROK_FILE.exists():
        return None
    return NGROK_FILE.read_text(encoding='utf-8').strip()

def find_md_files():
    for p in ROOT.rglob('*.md'):
        if '.git' in p.parts or 'node_modules' in p.parts:
            continue
        yield p

def backup(path: Path):
    bak = path.with_suffix(path.suffix + '.bak')
    if not bak.exists():
        bak.write_text(path.read_text(encoding='utf-8'), encoding='utf-8')
    return bak

def replace_placeholders_in_text(text: str, ngrok_url: str) -> (str, int):
    count = 0
    for ph in PLACEHOLDERS:
        new_text, n = re.subn(re.escape(ph), ngrok_url, text)
        if n:
            text = new_text
            count += n
    # also replace common template markers
    new_text, n = re.subn(r'https?://<your-ngrok-subdomain>\.ngrok\.io', ngrok_url, text)
    if n:
        text = new_text
        count += n
    return text, count

def main(apply: bool):
    ngrok = discover_ngrok()
    if not ngrok:
        print('No ngrok URL found in', NGROK_FILE, ' — run ngrok_manager.py start first or create the file with the URL.')
        return 2
    total_changed = 0
    for p in find_md_files():
        try:
            text = p.read_text(encoding='utf-8')
        except Exception:
            continue
        new_text, n = replace_placeholders_in_text(text, ngrok)
        if n > 0:
            print(f'Would replace {n} placeholders in {p}')
            total_changed += n
            if apply:
                backup(p)
                p.write_text(new_text, encoding='utf-8')
                print('Updated', p)
    print('Done. Total replacements:', total_changed)
    return 0

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='Apply changes (otherwise just show replacements)')
    args = parser.parse_args()
    raise SystemExit(main(args.apply))
