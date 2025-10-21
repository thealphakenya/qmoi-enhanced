#!/usr/bin/env python3
"""Generate docs/md-inventory.json from ALLMDFILESREFS.md

This is a lightweight scanner that reads ALLMDFILESREFS.md and writes
docs/md-inventory.json with file names and last-verified timestamps.
"""
import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / 'ALLMDFILESREFS.md'
OUT = ROOT / 'docs' / 'md-inventory.json'


def parse_refs(text):
    lines = [l.strip() for l in text.splitlines() if l.strip().startswith('- [')]
    files = []
    for l in lines:
        # format: - [FILENAME] - **TITLE** -- ...
        try:
            name = l.split(']')[0][3:]
            files.append(name)
        except Exception:
            continue
    return files


def main():
    if not REF.exists():
        print('ALLMDFILESREFS.md not found')
        return
    text = REF.read_text(encoding='utf-8')
    files = parse_refs(text)
    data = {
        'generated_by': str(Path(__file__).name),
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'files': []
    }
    for f in files:
        p = (ROOT / f).resolve() if (ROOT / f).exists() else None
        data['files'].append({
            'name': f,
            'path': str(p) if p else None,
            'last_verified': None
        })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2), encoding='utf-8')
    print('Wrote', OUT)


if __name__ == '__main__':
    main()
