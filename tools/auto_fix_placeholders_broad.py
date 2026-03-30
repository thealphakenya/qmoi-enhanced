// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""Safe implementation auto-fixer (broad).

- Dry-run mode: reports counts and data lines, does not modify files.
- Apply mode: updates only text files, skips generated/report folders, and makes conservative changes:
  * Replace `TODO_prod` with `TODO_prod [production: review and implement]` in text files.
  * Replace quoted defaults like 'TODO_prod-key' or "TODO_prod-key" with '<SET_VIA_ENV>'.
  * Replace 'TODO_prod-key' occurrences in JSON-like values with '<SET_VIA_ENV>'.

It writes a report to `tools/placeholder_fix_report.json` and backs up each modified file to `.bak`.
"""

import argparse
import json
import os
import re
from pathlib import Path

SKIP_DIRS = {".git", "node_modules", "tools/.qmoi_validation", "tools/placeholder_scan.json", "tools", "reports", "docs", ".qmoi_validation", "_archive_qmoi-enhanced", "pwa_apps"}
TEXT_EXT = {".md", ".txt", ".json", ".py", ".js", ".ts", ".tsx", ".jsx", ".html", ".sh", ".yml", ".yaml", ".env", ""}

TODO_PAT = re.compile(r"TODO_prod")
KEY_QUOTED_PAT = re.compile(r"(['\"])TODO_prod-key\1")
KEY_PLAIN_PAT = re.compile(r"TODO_prod-key")

report = {"modified": [], "dry_run_matches": [], "errors": []}

def is_skipped(path: Path):
    for part in path.parts:
        if part in SKIP_DIRS:
            return True
        if part.startswith('.venv'):
            return True
    return False

def process_file(path: Path, apply: bool):
    try:
        if is_skipped(path):
            return
        if path.is_dir():
            return
        if path.suffix.lower() not in TEXT_EXT and not path.name in {".env", "Dockerfile"}:
            return
        text = path.read_text(encoding="utf-8")
        original = text
        matches = []
        # Replace quoted TODO_prod-key -> '<SET_VIA_ENV>' keeping quotes
        def repl_key_quoted(m):
            q = m.group(1)
            matches.append((path.as_posix(), 'TODO_prod-key (quoted)', m.group(0)))
            return q + '<SET_VIA_ENV>' + q
        text, n1 = KEY_QUOTED_PAT.subn(repl_key_quoted, text)
        # Replace unquoted TODO_prod-key
        if n1 == 0:
            text, n2 = KEY_PLAIN_PAT.subn('<SET_VIA_ENV>', text)
            if n2:
                matches.append((path.as_posix(), 'TODO_prod-key (plain)', f'{n2} replacements'))
        # Annotate TODO_prod
        def repl_todo(m):
            matches.append((path.as_posix(), 'TODO_prod', m.group(0)))
            return m.group(0) + ' [production: review and implement]'
        text, n3 = TODO_PAT.subn(repl_todo, text)
        if matches:
            report['dry_run_matches'].append({"file": path.as_posix(), "matches": matches})
        if apply and text != original:
            bak = path.with_suffix(path.suffix + '.bak')
            bak.write_text(original, encoding='utf-8')
            path.write_text(text, encoding='utf-8')
            report['modified'].append(path.as_posix())
        return
    except Exception as e:
        report['errors'].append({"file": path.as_posix(), "error": str(e)})

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--apply', action='store_true', help='Apply changes')
    p.add_argument('--limit', type=int, default=0, help='Limit number of files to process (0 means all)')
    args = p.parse_args()

    files = []
    for root, dirs, filenames in os.walk('.'):
        # prune traversal
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith('.venv')]
        for fn in filenames:
            fp = Path(root) / fn
            files.append(fp)
    count = 0
    for fp in files:
        process_file(fp, args.apply)
        count += 1
        if args.limit and count >= args.limit:
            break

    out = Path('tools/placeholder_fix_report.json')
    out.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f"Dry-run completed. Files scanned: {count}. Matches: {len(report['dry_run_matches'])}. Modified (if apply): {len(report['modified'])}.")