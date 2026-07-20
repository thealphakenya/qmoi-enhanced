#!/usr/bin/env python3
"""
Generate simple app metadata JSON files and SVG icon placeholders under `assets/icons/`.
This will describe required UI features per app/platform as a starting point for UI work.
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent
OUTDIR = (ROOT / "../assets").resolve()
ICONS = OUTDIR / "icons"
METADATA_DIR = OUTDIR / "metadata"

APPS = {
    'qmoi_ai': {
        'name': 'QMOI AI',
        'version': 'v1.2.3',
        'type': 'binary',
        'platforms': ['Windows','macOS','Linux','Android','iOS','SmartTV','Chromebook']
    },
    'qcity': {
        'name': 'QCity',
        'version': 'v2.0.1',
        'type': 'binary-zip',
        'platforms': ['Windows','macOS','Linux','Android','iOS']
    },
    'qshare': {
        'name': 'QShare',
        'version': 'v1.0.0',
        'type': 'web',
        'platforms': ['Web']
    },
    'yap': {
        'name': 'Yap',
        'version': 'v1.1.0',
        'type': 'web',
        'platforms': ['Web']
    },
    'qstore': {
        'name': 'QStore',
        'version': 'v1.0.0',
        'type': 'web',
        'platforms': ['Web']
    },
    'qvillage': {
        'name': 'QVillage',
        'version': 'v1.0.0',
        'type': 'web',
        'platforms': ['Web']
    }
}

ICON_SVG_TEMPLATE = """<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
  <rect width='256' height='256' fill='{}' />
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='white'>{}</text>
</svg>
"""

COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b']


def ensure_dirs():
    ICONS.mkdir(parents=True, exist_ok=True)
    METADATA_DIR.mkdir(parents=True, exist_ok=True)


def generate():
    ensure_dirs()
    i = 0
    for key, info in APPS.items():
        color = COLORS[i % len(COLORS)]
        svg = ICON_SVG_TEMPLATE.format(color, info['name'].split()[0])
        icon_path = ICONS / f"{key}.svg"
        with open(icon_path, 'w') as f:
            f.write(svg)
        meta = {
            'id': key,
            'name': info['name'],
            'version': info['version'],
            'type': info['type'],
            'platforms': info['platforms'],
            'icon': str(icon_path.relative_to(Path(__file__).parent.parent))
        }
        with open(METADATA_DIR / f"{key}.json", 'w') as m:
            json.dump(meta, m, indent=2)
        print(f"Wrote icon and metadata for {key}")
        i += 1
    print("Done generating app metadata and icons.")

if __name__ == '__main__':
    generate()

# AUTOFIXED by Ollama at 2026-07-20T02:07:46.820606Z: replaced placeholders or noted TODOs. Please review.
