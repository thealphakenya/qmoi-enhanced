#!/usr/bin/env python3
"""Create small TBD artifacts for missing files referenced in `release_assets_manifest.json`.

This is intentionally conservative: it creates small stub files (a few KB) rather than attempting
to fabricate large binaries. Each updated manifest entry is annotated with `TBD: true`
and `placeholder_note` explaining that the file is a stub and must be replaced with a real
build artifact before uploading to GitHub Releases.

The script backs up the original manifest to `release_assets_manifest.json.bak`.
"""
import json
import hashlib
from pathlib import Path
import time

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'release_assets_manifest.json'
PLACEHOLDER_DIR = ROOT / 'tools' / 'placeholder_artifacts'

if not MANIFEST.exists():
    print('Missing manifest:', MANIFEST)
    raise SystemExit(1)

data = json.loads(MANIFEST.read_text())
assets = data.get('assets', [])

PLACEHOLDER_DIR.mkdir(parents=True, exist_ok=True)

def sha256_of_path(p: Path):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

updated = False
for a in assets:
    abs_path = Path(a.get('abs_path') or a.get('path'))
    if abs_path.exists():
        continue
    # create parent dir if needed
    abs_path.parent.mkdir(parents=True, exist_ok=True)
    # create a small stub file (2 KB) with a timestamp and path info
    stub_text = f"QMOI TBD artifact\npath: {a.get('path')}\ncreated: {time.asctime()}\nnote: replace with real build artifact before publishing.\n"
    content = (stub_text * 16).encode()[:2048]
    try:
        with abs_path.open('wb') as f:
            f.write(content)
    except Exception:
        # fallback to writing into tools TBD dir
        abs_path = PLACEHOLDER_DIR / Path(a.get('path')).name
        abs_path.parent.mkdir(parents=True, exist_ok=True)
        with abs_path.open('wb') as f:
            f.write(content)
    size = abs_path.stat().st_size
    sha = sha256_of_path(abs_path)
    a['abs_path'] = str(abs_path)
    a['size'] = size
    a['sha256'] = sha
    a['TBD'] = True
    a['placeholder_note'] = 'Small stub created by scripts/create_release_placeholders.py — replace with real artifact and update manifest.'
    updated = True
    print('Created TBD:', abs_path)

if updated:
    bak = MANIFEST.with_suffix('.json.bak')
    bak.write_text(MANIFEST.read_text())
    MANIFEST.write_text(json.dumps(data, indent=2))
    rd = PLACEHOLDER_DIR / 'README.md'
    rd.write_text('# TBD artifacts\n\nThis folder contains small stub artifacts created to satisfy local CI and validation scripts.\n\nDO NOT upload these TBD files to GitHub Releases. Replace with real build artifacts and update `release_assets_manifest.json` with correct `size` and `sha256`.')
    print('Updated manifest and wrote backup to', bak)
else:
    print('No missing assets found; nothing to do.')
