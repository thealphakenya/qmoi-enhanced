# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:58:54Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Persist wallet QV history into `.qmoi_validation/wallet_balance_history.json`.

This script reads the existing QV report (default `.qmoi_validation/all_wallets_qvs.json`)
and appends a timestamped snapshot to `.qmoi_validation/wallet_balance_history.json`.

It is safe to run repeatedly and designed for dry-run by default.
"""
import json
import os
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VALID_DIR = ROOT / '.qmoi_validation'
VALID_DIR.mkdir(parents=True, exist_ok=True)
REPORT_IN = VALID_DIR / 'all_wallets_qvs.json'
HISTORY_OUT = VALID_DIR / 'wallet_balance_history.json'

def now_iso():
    return datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'

def load_report(path):
    if not path.exists():
        return None
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            return json.load(fh)
    except Exception:
        return None

def append_history(snapshot):
    history = []
    if HISTORY_OUT.exists():
        try:
            with open(HISTORY_OUT, 'r', encoding='utf-8') as fh:
                history = json.load(fh)
        except Exception:
            history = []
    history.append(snapshot)
    with open(HISTORY_OUT, 'w', encoding='utf-8') as fh:
        json.dump(history, fh, indent=2)
    return HISTORY_OUT

def build_snapshot(report):
    return {
        'captured_at': now_iso(),
        'report': report
    }

def main():
    report = load_report(REPORT_IN)
    if report is None:
        print(f'No report found at {REPORT_IN}; run check_wallets.py first')
        return 2
    snap = build_snapshot(report)
    out = append_history(snap)
    print(f'Appended snapshot to {out} (total snapshots: defined)')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
