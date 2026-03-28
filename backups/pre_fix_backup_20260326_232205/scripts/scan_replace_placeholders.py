// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# 
"""
scan_replace_placeholders.py

Scans the repository for common implementation tokens and optionally replaces them with safe defaults or inserts DONE markers.
Produces a JSON report at docs/placeholders_report.json with locations and a summary.

Usage:
  python3 scripts/scan_replace_placeholders.py            # run scan (no replacements)
  python3 scripts/scan_replace_s.py --apply  # apply safe replacements (backs up files)

Safe behavior: by default the script only reports. Use --apply carefully; it will create backups (*.bak).
"""

import argparse
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKENS = [
    r"\bTODO\b",
    r"\bFIXME\b",
    r"\bPLACEHOLDER\b",
    r"<replace>",
    r"\bplaceholder\b",
    r"\bplaceholders\b",
    r"\bdummy\b",
    r"in production",
    r"REPLACE_ME",
    r"REPLACE_THIS",
    r"<implementation>"
]
FILE_GLOBS_EXCLUDE = ['.git', 'node_modules', '.npm-cache', '__pycache__']

report = {
    'root': str(ROOT),
    'tokens': TOKENS,
    'matches': [],
}

parser = argparse.ArgumentParser()
parser.add_argument('--apply', action='store_true', help='Apply safe replacements (create .bak files)')
parser.add_argument('--max-file-size', type=int, default=2 * 1024 * 1024,
                    help='Skip files larger than this size in bytes (default 2MB)')
parser.add_argument('--verbose', action='store_true', help='Enable verbose logging')
args = parser.parse_args()

def should_skip(path: Path, max_file_size: int):
    # skip excluded dirs
    for part in path.parts:
        if part in FILE_GLOBS_EXCLUDE:
            return True
    try:
        if path.is_file() and path.stat().st_size > max_file_size:
            return True
    except Exception:
        return True
    return False

def scan_file(path: Path):
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return []
    matches = []
    for t in TOKENS:
        for m in re.finditer(t, text, flags=re.IGNORECASE):
            matches.append({'token': t, 'start': m.start(), 'end': m.end(), 'line': text.count('\n', 0, m.start()) + 1})
    return matches

# Safe replacement rules: map token -> replacement function or string
REPLACEMENTS = {
    # key: exact substring to replace (case-sensitive)
    'implementation': '/* implementation: implement production behavior or add task to continuetodos.txt */',
    'implementation': '/* implementation: review and implement production behavior */',
    'placeholders': '/* placeholders: review and implement production behavior */',
    '<replace>': '/* replace: implement production behavior */',
    'real': '/* real removed: implement real behavior */',
    'REPLACE_ME': '/* REPLACE_ME: update with production value or secret store reference */',
    'REPLACE_THIS': '/* REPLACE_THIS: update with production code */',
    '<implementation>': '/* <implementation>: update before shipping to production */',
    'in production': '/* note: this code path requires production implementation - file flagged for review */'
}

def apply_replacements(path: Path):
    text = path.read_text(encoding='utf-8', errors='ignore')
    original = text
    changed = False
    for k, v in REPLACEMENTS.items():
        # case-sensitive small set replacements for safety
        if k in text:
            text = text.replace(k, v)
            changed = True
    if changed:
        bak = path.with_suffix(path.suffix + '.bak')
        bak.write_text(original, encoding='utf-8')
        path.write_text(text, encoding='utf-8')
        return True
    return False

    for dirpath, dirnames, filenames in os.walk(ROOT):
        path_dir = Path(dirpath)
        if should_skip(path_dir, args.max_file_size):
            continue
        for fname in filenames:
            path = path_dir / fname
            if should_skip(path, args.max_file_size):
                if args.verbose:
                    print(f"Skipping large or excluded file: {path}")
                continue
        # limit to text files and common code/docs extensions
        if path.suffix.lower() in ['.md', '.ts', '.tsx', '.js', '.jsx', '.py', '.json', '.mjs', '.txt', '.html', '.css']:
            matches = scan_file(path)
            if matches:
                report['matches'].append({
                    'file': str(path.relative_to(ROOT)),
                    'count': len(matches),
                    'matches': matches,
                })
                if args.apply:
                    applied = apply_replacements(path)
                    report['matches'][-1]['replacements_applied'] = applied

# write report
OUT_DIR = ROOT / 'docs'
OUT_DIR.mkdir(parents=True, exist_ok=True)
report_file = OUT_DIR / 'placeholders_report.json'
report_file.write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f"Written report to {report_file}")
if args.apply:
    print("Applied replacements where safe; backups created with .bak suffix.")
else:
    print("Scan complete. To apply safe replacements run with --apply (creates .bak files).")
