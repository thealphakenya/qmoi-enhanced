#!/usr/bin/env python3
"""Scan repository markdown files for currency/amount patterns and produce a JSON report."""
import re
import os
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
pattern = re.compile(r"(\$\s?[0-9]+(?:[\,\d]*)(?:\.\d+)?)")

report = {}
for dirpath, dirnames, filenames in os.walk(ROOT):
    for fn in filenames:
        if not fn.endswith('.md'):
            continue
        path = os.path.join(dirpath, fn)
        rel = os.path.relpath(path, ROOT)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except Exception:
            continue
        matches = []
        for i, line in enumerate(lines, start=1):
            for m in pattern.finditer(line):
                matches.append({'line': i, 'text': m.group(1), 'context': line.strip()})
        if matches:
            report[rel] = matches

out_dir = os.path.join(ROOT, 'reports')
os.makedirs(out_dir, exist_ok=True)
with open(os.path.join(out_dir, 'balance_matches.json'), 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2)
with open(os.path.join(out_dir, 'balance_report.md'), 'w', encoding='utf-8') as f:
    f.write('# Balance scan report\n\n')
    for k, v in sorted(report.items()):
        f.write(f'## {k}\n')
        for m in v:
            f.write(f'- Line {m["line"]}: `{m["text"]}` — {m["context"]}\n')
        f.write('\n')

print('Wrote reports to reports/balance_matches.json and reports/balance_report.md')
