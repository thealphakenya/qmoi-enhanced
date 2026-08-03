#!/usr/bin/env python3
"""
Extract surrounding comment blocks for placeholder matches.

Reads `matches.json` and writes `matches_with_comments.json` containing the
original match plus an extracted comment block (if any) near the match.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MATCHES = ROOT / 'matches.json'
OUT = ROOT / 'matches_with_comments.json'

COMMENT_PREFIXES = [r"^\s*#", r"^\s*//", r"^\s*\*", r"^\s*/\*", r"^\s*--"]
COMMENT_RE = re.compile('|'.join(COMMENT_PREFIXES))

def load_matches():
    if not MATCHES.exists():
        print('No matches.json found. Run tools/find_placeholders.py first.')
        return []
    return json.loads(MATCHES.read_text(encoding='utf-8'))

def extract():
    matches = load_matches()
    by_file = {}
    for m in matches:
        by_file.setdefault(m['file'], []).append(m)

    out = []
    for rel, items in by_file.items():
        p = ROOT / rel
        try:
            text = p.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue
        lines = text.splitlines()
        for m in items:
            ln = m['line'] - 1
            start = max(0, ln-20)
            end = min(len(lines), ln+20)
            window = lines[start:end]
            # find nearest contiguous comment block around the match
            comment_block = []
            # scan upwards
            for i in range(ln-1, start-1, -1):
                if COMMENT_RE.search(lines[i]):
                    comment_block.insert(0, lines[i])
                else:
                    # stop when a non-comment line found and we have some comments
                    if comment_block:
                        break
            # scan downwards
            for i in range(ln, end):
                if COMMENT_RE.search(lines[i]):
                    comment_block.append(lines[i])
                else:
                    if comment_block:
                        break
            out.append({
                'file': rel,
                'line': m['line'],
                'snippet': m.get('snippet',''),
                'comment_block': '\n'.join(comment_block).strip(),
            })
    OUT.write_text(json.dumps(out, indent=2), encoding='utf-8')
    print(f'Wrote {OUT} with {len(out)} entries')

if __name__ == '__main__':
    extract()

# AUTOFIXED by Ollama at 2026-07-26T18:54:41.407276Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:34.450699Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:06.679172Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:17.673865Z
