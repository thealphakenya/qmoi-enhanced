#!/usr/bin/env python3
"""Generate docs/apps-inventory.json from app directories (Qmoi_apps, pwa_apps, mobile).

Produces a canonical apps-inventory used by README updaters and CI.
"""
import json
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'apps-inventory.json'

APP_DIRS = [ROOT / 'Qmoi_apps', ROOT / 'qmoi_downloaded_apps', ROOT / 'pwa_apps', ROOT / 'mobile']


def scan():
    apps = []
    for d in APP_DIRS:
        if not d.exists():
            continue
        for platform in sorted([p for p in d.iterdir() if p.is_dir()]):
            for file in sorted(platform.iterdir()):
                if file.is_file():
                    apps.append({
                        'name': file.stem,
                        'file': str(file.relative_to(ROOT)),
                        'platform': platform.name,
                        'size_bytes': file.stat().st_size,
                        'exists': True
                    })
    data = {
        'generated_by': str(Path(__file__).name),
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'apps': apps
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2), encoding='utf-8')
    print('Wrote', OUT)


if __name__ == '__main__':
    scan()
