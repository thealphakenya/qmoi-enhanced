// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""
Scan `Qmoi_downloaded_apps/` and produce `release_assets_manifest.json` containing
entries {path, sha256, size, app, platform} to be used by release automation.
"""
import hashlib
import json
import os
from pathlib import Path

ROOT = Path(__file__).parent
SRC = (ROOT / "../Qmoi_downloaded_apps").resolve()
OUT = (ROOT / "../release_assets_manifest.json").resolve()

APPS_MAP = {
    'windows': 'Windows',
    'mac': 'macOS',
    'linux': 'Linux',
    'android': 'Android',
    'ios': 'iOS',
    'smarttv': 'SmartTV',
    'chromebook': 'Chromebook',
    'qcity': 'QCity'
}

def sha256_of(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def discover():
    if not SRC.exists():
        print("Source directory not found:", SRC)
        return 1
    assets = []
    for root, dirs, files in os.walk(SRC):
        for f in files:
            p = Path(root) / f
            rel = p.relative_to(SRC)
            parts = rel.parts
            platform = parts[0] if len(parts) > 0 else 'unknown'
            asset = {
                'path': str(rel).replace('\\', '/'),
                'abs_path': str(p),
                'size': p.stat().st_size,
                'sha256': sha256_of(p),
                'platform': APPS_MAP.get(platform, platform),
            }
            assets.append(asset)
    with open(OUT, 'w') as o:
        json.dump({'assets': assets}, o, indent=2)
    print(f"Wrote manifest to {OUT} with {len(assets)} assets")
    return 0

if __name__ == '__main__':
    raise SystemExit(discover())
