#!/usr/bin/env python3
"""Basic static validation for UI components (TSX files).

Produces `docs/ui_validation_report.json` summarizing placeholders, TODO/FIXME markers,
and files that may need manual review.

This is intentionally lightweight: it finds likely issues to triage, not full linting.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'ui_validation_report.json'

TSX_GLOB = ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js']

PLACEHOLDER_PAT = re.compile(r'PLACEHOLDER|PLACEHOLDER_TEXT|"placeholder"|\bplaceholder\b', re.IGNORECASE)
TODO_PAT = re.compile(r'\b(TODO|FIXME|XXX)\b')

def scan_ui(root: Path):
    report = {'root': str(root), 'checked_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'files': []}
    for pattern in TSX_GLOB:
        for path in root.glob(pattern):
            if path.is_file():
                try:
                    text = path.read_text(encoding='utf8', errors='ignore')
                except Exception:
                    continue
                issues = []
                if PLACEHOLDER_PAT.search(text):
                    issues.append('placeholder-token')
                if TODO_PAT.search(text):
                    issues.append('todo-fixme-comment')
                # quick heuristic: very long files may need split
                if len(text) > 20000:
                    issues.append('large-file')
                if issues:
                    report['files'].append({'path': str(path), 'issues': issues, 'snippet': _grab_snippet(text)})
    return report

def _grab_snippet(text, max_len=200):
    return text[:max_len].replace('\n', ' ')

def main():
    report = scan_ui(ROOT)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', OUT)

if __name__ == '__main__':
    main()
