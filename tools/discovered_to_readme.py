#!/usr/bin/env python3
"""
Simple helper: read `discovered_assets.json` and print README table rows for releases.
Run locally or in CI after artifact discovery to generate a releases table snippet.
"""
import json
import sys
from pathlib import Path


def main(path='discovered_assets.json'):
    p = Path(path)
    if not p.exists():
        print(f'No {path} found', file=sys.stderr)
        return 1
    data = json.loads(p.read_text())
    assets = data.get('assets', [])
    # Group basic by platform inferred from filename
    groups = {}
    for a in assets:
        name = a['name']
        lname = name.lower()
        if '.exe' in lname or 'windows' in lname:
            k='Windows'
        elif '.dmg' in lname or 'mac' in lname:
            k='macOS'
        elif any(x in lname for x in ('.deb','.appimage','.rpm','linux')):
            k='Linux'
        elif '.apk' in lname:
            k='Android'
        elif '.ipa' in lname:
            k='iOS'
        elif '.zip' in lname or 'pwa' in lname:
            k='PWA'
        else:
            k='Other'
        groups.setdefault(k,[]).append(a)

    # Print markdown rows
    for k, items in groups.items():
        print(f"### {k}\n")
        for a in items:
            size = Path(a['path']).stat().st_size if Path(a['path']).exists() else 0
            print(f"- **{a['name']}** — {size//1024} KB — `{a['path']}`")
        print('\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())
