#!/usr/bin/env python3
"""
Generate a missing builds / artifacts report from docs/apps-inventory.json.
Writes docs/missing_builds_report.json.
"""
import argparse
import json
import os
from datetime import datetime


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='infile', default='docs/apps-inventory.json')
    p.add_argument('--out', dest='outfile', default='docs/missing_builds_report.json')
    args = p.parse_args()

    infile = args.infile
    outfile = args.outfile
    if not os.path.exists(infile):
        print(f"Input file not found: {infile}")
        raise SystemExit(2)

    with open(infile, 'r', encoding='utf-8') as f:
        data = json.load(f)

    missing = []
    for item in data.get('apps', []):
        file = item.get('file')
        exists = item.get('exists', False)
        size = item.get('size_bytes', None)
        reason = None
        if not exists:
            reason = 'missing'
        elif size is None or size == 0:
            reason = 'zero_size'
        if reason:
            missing.append({
                'file': file,
                'platform': item.get('platform'),
                'name': item.get('name'),
                'reason': reason,
                'reported_size': size,
            })

    report = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'generated_by': 'generate_missing_artifacts_report.py',
        'input': infile,
        'missing_count': len(missing),
        'missing': missing,
    }

    os.makedirs(os.path.dirname(outfile), exist_ok=True)
    with open(outfile, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"Wrote {outfile} ({len(missing)} missing entries)")


if __name__ == '__main__':
    main()
