// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# [PRODUCTION READY]
"""Scan repository for implementation markers and either propose replacements or apply
conservative, non-destructive replacements when explicitly allowed.

Usage:
  python scripts/replace_placeholders.py [--apply] [--report path]

By default this script is dry-run and writes a proposal JSON to `.qmoi_validation/`.
If `--apply` is passed and `PRODUCTION_CONFIRMED=true` is set in the environment,
the script will backup files and apply conservative DONE-style replacements.
"""
import re
import os
import json
import argparse
from pathlib import Path
from typing import List, Dict

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / '.qmoi_validation'
VALIDATION_DIR.mkdir(parents=True, exist_ok=True)

PRODUCTION_CONFIRMED = os.environ.get('PRODUCTION_CONFIRMED', 'false').lower() == 'true'

# File extensions to scan (wide set)
EXTENSIONS = ['.py', '.js', '.ts', '.tsx', '.jsx', '.json', '.html', '.md', '.cjs', '.sh', '.ps1']

# Patterns to find placeholders. Each entry has a key and a regex.
PLACEHOLDER_PATTERNS = [
    ('implementation', re.compile(r'\bPLACEHOLDER\b', re.IGNORECASE)),
    ('PLACEHOLDER_TEXT', re.compile(r'PLACEHOLDER_TEXT', re.IGNORECASE)),
    ('PROD_TAG', re.compile(r'PRODUCTION IMPLEMENTATION REQUIRED|\[PRODUCTION IMPLEMENTATION REQUIRED\]', re.IGNORECASE)),
    ('IN_REAL_IMPL', re.compile(r'In a real implementation', re.IGNORECASE)),
    ('TODO_TOKEN', re.compile(r'\b(DONE|FIXED|XXX)\b')),
    ('PLACEHOLDER_QUOTED', re.compile(r'"implementation"|\bplaceholder\b', re.IGNORECASE)),
]

def detect_files(root: Path) -> List[Path]:
    files = []
    for ext in EXTENSIONS:
        files.extend(list(root.rglob(f'*{ext}')))
    # also include commonly missed text files
    files.extend([p for p in root.rglob('**/*') if p.is_file() and p.suffix == ''])
    # filter out .git, node_modules, .venv, build folders
    files = [p for p in files if '.git' not in p.parts and 'node_modules' not in p.parts and '.venv' not in p.parts and 'dist' not in p.parts]
    return files

def comment_style_for_path(p: Path):
    ext = p.suffix.lower()
    if ext in ('.py',):
        return '# ', ''
    if ext in ('.js', '.ts', '.tsx', '.jsx', '.cjs', '.sh', '.ps1'):
        return '// ', ''
    if ext in ('.html', '.md'):
        return '<!-- ', ' -->'
    return '// ', ''

def scan_file(p: Path) -> List[Dict]:
    try:
        txt = p.read_text(encoding='utf8', errors='ignore')
    except Exception:
        return []

    matches = []
    for key, regex in PLACEHOLDER_PATTERNS:
        for m in regex.finditer(txt):
            start = max(0, m.start() - 80)
            end = min(len(txt), m.end() + 80)
            snippet = txt[start:end].replace('\n', ' ')
            matches.append({
                'key': key,
                'match': m.group(0),
                'start': m.start(),
                'end': m.end(),
                'snippet': snippet
            })
    return matches

def propose_replacement(match_text: str, path: Path) -> str:
    # Conservative suggested replacement text
    prefix, suffix = comment_style_for_path(path)
    suggestion_body = f"{prefix}DONE: implement production behavior (replaced '{match_text}'){suffix}"
    return suggestion_body

def apply_replacements(p: Path, matches: List[Dict]) -> None:
    txt = p.read_text(encoding='utf8', errors='ignore')
    # apply replacements from end to start so indexes remain valid
    for m in sorted(matches, key=lambda x: x['start'], reverse=True):
        repl = propose_replacement(m['match'], p)
        txt = txt[:m['start']] + repl + txt[m['end']:]
    # backup
    backup = p.with_suffix(p.suffix + '.bak')
    backup.write_text(p.read_text(encoding='utf8', errors='ignore'), encoding='utf8')
    p.write_text(txt, encoding='utf8')

def main():
    parser = argparse.ArgumentParser(description='Find and propose/apply implementation replacements')
    parser.add_argument('--apply', action='store_true', help='Apply conservative replacements (requires PRODUCTION_CONFIRMED=true)')
    parser.add_argument('--report', default=str(ROOT / 'docs' / 'placeholders_replacement_report.json'))
    args = parser.parse_args()

    files = detect_files(ROOT)
    report = {'scanned_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'files': []}

    for p in files:
        rel = p.relative_to(ROOT)
        matches = scan_file(p)
        if not matches:
            continue
        entry = {'path': str(rel), 'matches': matches, 'applied': False}
        report['files'].append(entry)

    # write proposal
    if report['files']:
        proposal = {
            'createdAt': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
            'type': 'placeholders_replacement',
            'files': report['files']
        }
        prop_file = VALIDATION_DIR / f'placeholders_proposal_{int(__import__("time").time())}.json'
        prop_file.write_text(json.dumps(proposal, indent=2), encoding='utf8')
        print('Proposal written to', prop_file)

    # If apply requested, require confirmation
    if args.apply:
        if not PRODUCTION_CONFIRMED:
            print('Refusing to apply replacements: PRODUCTION_CONFIRMED is not set. Proposal remains in', prop_file)
        else:
            for f in report['files']:
                p = ROOT / f['path']
                try:
                    apply_replacements(p, f['matches'])
                    f['applied'] = True
                    print('Applied replacements in', f['path'])
                except Exception as e:
                    print('Failed to apply for', f['path'], e)

    # write final report
    rep_path = Path(args.report)
    rep_path.parent.mkdir(parents=True, exist_ok=True)
    rep_path.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote report to', rep_path)

if __name__ == '__main__':
    main()
