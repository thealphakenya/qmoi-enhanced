#!/usr/bin/env python3
"""
Wallet audit: scans the repository for wallet-related config files and validates minimal structure.
Writes docs/wallet_audit_report.json.

This is a conservative, read-only audit helper intended to help prepare wallets for production.
"""
import os
import json
from datetime import datetime

SEARCH_PATTERNS = [
    "cashon",
    "wallet",
    "keystore",
    "mpesa",
    "binance",
    "apple_cert",
]


def scan_files(root="."):
    matches = []
    for dirpath, dirs, files in os.walk(root):
        # skip node_modules and .git
        if "node_modules" in dirpath.split(os.sep) or ".git" in dirpath.split(os.sep):
            continue
        for fn in files:
            lname = fn.lower()
            for pat in SEARCH_PATTERNS:
                if pat in lname:
                    matches.append(os.path.join(dirpath, fn))
                    break
    return matches


def try_parse_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def summarize_match(path):
    info = {"path": path}
    if path.lower().endswith('.json'):
        parsed = try_parse_json(path)
        if parsed is not None:
            info['json_keys'] = list(parsed.keys())[:20]
            info['json_preview'] = json.dumps(parsed if isinstance(parsed, dict) else parsed[:10], ensure_ascii=False)[:200]
        else:
            info['note'] = 'not-json-or-parse-failed'
    else:
        info['size_bytes'] = os.path.getsize(path)
    return info


def main():
    found = scan_files()
    report = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'generated_by': 'wallet_audit.py',
        'found_count': len(found),
        'items': [summarize_match(p) for p in found]
    }
    os.makedirs('docs', exist_ok=True)
    with open('docs/wallet_audit_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"Wrote docs/wallet_audit_report.json (found={len(found)})")


if __name__ == '__main__':
    main()
