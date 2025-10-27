#!/usr/bin/env python3
"""Generate/update API.md from the JSON inventory produced by extract_apis.py.

This replaces the block under '## Discovered API Endpoints (Auto-Extracted)' code fence
with a fresh list (method/path and source file). It preserves the rest of the file and
writes a backup `.bak` before modifying.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import List

ROOT = Path(__file__).resolve().parent.parent
INVENTORY = ROOT / 'tmp' / 'api_inventory.json'
API_MD = ROOT / 'API.md'


def format_endpoint(e: dict) -> str:
    t = e.get('type')
    path = e.get('path')
    methods = e.get('methods') or []
    file = e.get('file') or ''
    if methods:
        m = ','.join(methods)
    else:
        m = ''
    return f"{m:6} {path}    — {file}"


def generate_section(endpoints: List[dict]) -> str:
    lines = ['```', 'Discovered endpoints (auto-generated):', '']
    # sort by path
    endpoints_sorted = sorted(endpoints, key=lambda x: (x.get('path',''), x.get('type','')))
    for e in endpoints_sorted:
        lines.append(format_endpoint(e))
    lines.append('```')
    return '\n'.join(lines)


def main():
    if not INVENTORY.exists():
        print('Inventory not found at', INVENTORY)
        return
    data = json.loads(INVENTORY.read_text(encoding='utf-8'))
    endpoints = data.get('endpoints', [])

    if not API_MD.exists():
        print('API.md not present; creating a new file with the generated section')
        API_MD.write_text('# API\n\n' + generate_section(endpoints), encoding='utf-8')
        print('Wrote', API_MD)
        return

    txt = API_MD.read_text(encoding='utf-8')
    start_marker = '## Discovered API Endpoints (Auto-Extracted)'
    if start_marker in txt:
        idx = txt.index(start_marker)
        # find the following code fence ``` after the marker and then close fence
        pre = txt[:idx]
        post = txt[idx:]
        # find first ``` after marker
        first_fence = post.find('```')
        if first_fence != -1:
            # find closing fence after that
            closing = post.find('```', first_fence+3)
            if closing != -1:
                # closing is index of closing fence; preserve text after it
                after = post[closing+3:]
                new_section = start_marker + '\n\n' + generate_section(endpoints) + '\n\n'
                new_txt = pre + new_section + after
                backup = API_MD.with_suffix(API_MD.suffix + '.bak')
                backup.write_text(txt, encoding='utf-8')
                API_MD.write_text(new_txt, encoding='utf-8')
                print('Updated', API_MD, ' (backup at', backup, ')')
                return

    # fallback: append
    API_MD.write_text(txt + '\n\n' + '## Discovered API Endpoints (Auto-Extracted)' + '\n\n' + generate_section(endpoints), encoding='utf-8')
    print('Appended discovered endpoints to', API_MD)


if __name__ == '__main__':
    main()
