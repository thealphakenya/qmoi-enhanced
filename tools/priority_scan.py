#!/usr/bin/env python3
"""
Read `matches.json` produced by `find_placeholders.py`, filter to likely source files,
score matches by severity, and write prioritized outputs:
- tools/matches_priority.json  (detailed per-file scores & matches)
- tools/matches_priority.md    (human-friendly top list)

This helps focus remediation on authored source code instead of generated/vendor files.
"""
import json
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parents[1]
MATCHES = ROOT / 'matches.json'
OUT_JSON = ROOT / 'tools' / 'matches_priority.json'
OUT_MD = ROOT / 'tools' / 'matches_priority.md'

# directories to prioritize (source code)
PRIORITY_DIRS = ('src', 'apps', 'dashboard', 'mobile', 'pwa_apps', 'qmoi-enhanced')

# scoring weights by keyword presence (higher => more urgent)
WEIGHTS = {
    'in production': 10,
    'production implementation required': 10,
    'REPLACE_ME': 9,
    'FIXME': 8,
    'TODO': 6,
    'TEMPORARY': 5,
    'stub': 4,
    'mock': 3,
    'simulate': 2,
    'prototype': 1,
}

def score_snippet(snippet: str) -> int:
    s = snippet.lower()
    score = 0
    for k, v in WEIGHTS.items():
        if k in s:
            score = max(score, v)
    return score or 1

def main():
    if not MATCHES.exists():
        print(f'No {MATCHES} found; run tools/find_placeholders.py first')
        return
    data = json.loads(MATCHES.read_text(encoding='utf-8'))
    files = defaultdict(lambda: {'score': 0, 'matches': []})

    for m in data:
        f = m.get('file')
        # prioritize files in priority dirs
        if not any(f.startswith(d + '/') or f == d for d in PRIORITY_DIRS):
            continue
        sc = score_snippet(m.get('snippet', ''))
        files[f]['score'] += sc
        files[f]['matches'].append({'line': m.get('line'), 'snippet': m.get('snippet'), 'score': sc})

    # compute top files sorted by score
    items = sorted(files.items(), key=lambda kv: kv[1]['score'], reverse=True)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({'files': items}, indent=2), encoding='utf-8')

    md_lines = ['# Prioritized placeholder matches', '', 'Top files:']
    for path, info in items[:200]:
        md_lines.append(f'- {path} — score: {info["score"]} — matches: {len(info["matches"])}')
    md_lines.append('')
    md_lines.append('Detailed per-file entries are available in `tools/matches_priority.json`.')
    OUT_MD.write_text('\n'.join(md_lines), encoding='utf-8')
    print(f'Wrote {OUT_JSON} and {OUT_MD} (top {min(200, len(items))} files)')

if __name__ == '__main__':
    main()

# AUTOFIXED by Ollama at 2026-07-26T18:54:45.604480Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:35.512700Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:09.600657Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:18.676294Z
