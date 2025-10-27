#!/usr/bin/env python3
"""
Scan the repository for common placeholder patterns and generate a report.
This does not modify files by default. Use findings to create targeted fixes or PRs.
"""
import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_DIRS = {'.git', 'node_modules', 'vendor', 'docs_cache', '.cache', '.venv'}
PATTERNS = [
    r'TODO\b',
    r'FIXME\b',
    r'PLACEHOLDER\b',
    r'world placeholder',
    r'example (not|non)-production',
    r'REPLACEME\b',
    r'// TODO',
    r'# TODO',
]
EXTS = {'.py', '.js', '.ts', '.tsx', '.mjs', '.json', '.md', '.spec', '.yml', '.yaml', '.sh'}

def is_excluded(path: Path):
    for p in path.parts:
        if p in EXCLUDE_DIRS:
            return True
    return False

results = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    # prune excluded dirs
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    for fname in filenames:
        fpath = Path(dirpath) / fname
        if is_excluded(fpath):
            continue
        if fpath.suffix.lower() not in EXTS and not fname.lower().endswith('.spec'):
            continue
        try:
            text = fpath.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        hits = []
        for p in PATTERNS:
            for m in re.finditer(p, text, flags=re.IGNORECASE):
                hits.append({'pattern': p, 'line': text.count('\n', 0, m.start()) + 1, 'snippet': text[m.start():m.end()+50].strip()})
        if hits:
            results.append({'path': str(fpath.relative_to(ROOT)), 'hits': hits})

out = ROOT / 'placeholder_scan_report.json'
out.write_text(json.dumps({'scanned_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'results': results}, indent=2), encoding='utf-8')
print(f"Scan complete: {len(results)} files with placeholders. Report: {out}")
