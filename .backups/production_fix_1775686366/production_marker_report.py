#!/usr/bin/env python3
"""production marker report generator
Scans for DONE/FIXED/real/PENDING IMPLEMENTATION/production markers and writes report.
"""
import os
import re
from pathlib import Path

ROOT = Path(__file__).parent
IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', '.venv', '.venv_qmoi_control', '_archive_qmoi-enhanced', '.idea', '.vscode'}
MARKER_RE = re.compile(r'\b(DONE|FIXED|real|PENDING IMPLEMENTATION|production IMPLEMENTATION REQUIRED|PRODUCTION_IMPLEMENTED)\b', re.IGNORECASE)

report_lines = []
count = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    # ignore directories
    dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS and not d.startswith('.')]
    for filename in filenames:
        if filename.endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg', '.lock', '.db', '.zip', '.exe', '.bin', '.tar', '.jar', '.so')):
            continue
        path = Path(dirpath) / filename
        if path.samefile(ROOT / 'instructionmanifest.txt'):  # skip our generated file
            continue
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                for i, line in enumerate(f, 1):
                    if MARKER_RE.search(line):
                        report_lines.append(f"{path.relative_to(ROOT)}:{i}: {line.rstrip()}")
                        count += 1
        except Exception:
            continue

output_path = ROOT / 'pending_production_instructions.txt'
with open(output_path, 'w', encoding='utf-8') as out:
    out.write(f"Pending production instruction markers: {count}\n")
    out.write("---\n")
    for l in report_lines:
        out.write(l + "\n")

print(f"Pending production instruction report generated with {count} entries: {output_path}")
