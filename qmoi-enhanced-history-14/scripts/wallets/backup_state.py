#!/usr/bin/env python3
"""Snapshot wallet state to backups directory with timestamps.

This provides a safe, read-only snapshot of `.qmoi_state/wallets.json` so
operators can inspect past states if needed.
"""
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[2]
STATE_FILE = ROOT / '.qmoi_state' / 'wallets.json'
BACKUP_DIR = ROOT / '.qmoi_state' / 'backups'
BACKUP_DIR.mkdir(parents=True, exist_ok=True)


def main():
    if not STATE_FILE.exists():
        print('No state file to backup')
        return 2
    with open(STATE_FILE, 'r', encoding='utf-8') as fh:
        data = json.load(fh)
    ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    out = BACKUP_DIR / f'wallets_{ts}.json'
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(data, fh, indent=2)
    print('Wrote backup:', out)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
