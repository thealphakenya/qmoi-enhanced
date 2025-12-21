#!/usr/bin/env python3
"""Scan repository for TODO_PROD occurrences and produce report JSON and a brief summary.
Skips large files and known generated reports to avoid false positives.
"""
import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE_DIRS = {"node_modules", ".git", ".next", "dist", "coverage", "reports", "_archive_qmoi-enhanced"}
SKIP_FILES = {"link_report.md", "reports/suggestions.json"}
SAFE_EXT = {'.md', '.txt', '.rst', '.py', '.js', '.ts', '.json'}
MAX_SAFE_SIZE = 300 * 1024

report = {
    "scanned_files": 0,
    "files_with_matches": [],
    "total_matches": 0,
}

for dirpath, dirnames, filenames in os.walk(ROOT):
    # prune excluded dirs
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    for fname in filenames:
        if fname in SKIP_FILES:
            continue
        fpath = Path(dirpath) / fname
        ext = fpath.suffix.lower()
        if ext not in SAFE_EXT:
            continue
        try:
            size = fpath.stat().st_size
        except Exception:
            continue
        if size == 0 or size > MAX_SAFE_SIZE:
            continue
        report["scanned_files"] += 1
        try:
            txt = fpath.read_text(encoding='utf-8')
        except Exception:
            continue
        count = txt.count('TODO_PROD')
        if count:
            report['files_with_matches'].append({
                'file': str(fpath.relative_to(ROOT)),
                'matches': count,
            })
            report['total_matches'] += count

report['files_with_matches'].sort(key=lambda x: -x['matches'])

out_json = ROOT / 'TODO_PROD_CHECK_REPORT.json'
out_txt = ROOT / 'TODO_PROD_FILE_COUNTS.txt'

out_json.write_text(json.dumps(report, indent=2), encoding='utf-8')
with open(out_txt, 'w', encoding='utf-8') as fh:
    fh.write(f"Scanned files: {report['scanned_files']}\n")
    fh.write(f"Total matches: {report['total_matches']}\n\n")
    fh.write('Top files with matches:\n')
    for f in report['files_with_matches'][:50]:
        fh.write(f"{f['file']}: {f['matches']}\n")

print('Wrote', out_json, out_txt)
print(f"Scanned files: {report['scanned_files']}, total matches: {report['total_matches']}")
