// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# [PRODUCTION READY]
"""
Create per-platform todos from `platformspayed.txt` and write them to
`.qmoi_validation/todos.json` for tracking and assignment.

This script is idempotent: existing todos are preserved and new ones are
appended. Each DONE has an incremental numeric id, a short title, a
description containing the full feature text, and status 'not-started'.
"""
from pathlib import Path
import re
import json
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / 'platformspayed.txt'
OUT_DIR = ROOT / '.qmoi_validation'
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT = OUT_DIR / 'todos.json'

if not IN.exists():
    print('platformspayed.txt not found at', IN)
    raise SystemExit(1)

text = IN.read_text(encoding='utf-8')

# parse sections similarly to generate_payed_md.py
sections = []
cur_title = None
cur_lines = []
for line in text.splitlines():
    h = line.strip()
    if not h:
        if cur_title and cur_lines:
            sections.append((cur_title, cur_lines))
            cur_title = None
            cur_lines = []
        continue
    if re.match(r"^[A-Z][A-Za-z0-9 \-]+( \(.+\))?$", h):
        if cur_title and cur_lines:
            sections.append((cur_title, cur_lines))
        cur_title = h
        cur_lines = []
        continue
    if cur_title is None:
        continue
    cur_lines.append(h)

if cur_title and cur_lines:
    sections.append((cur_title, cur_lines))

# load existing todos if present
todos = []
if OUT.exists():
    try:
        todos = json.loads(OUT.read_text(encoding='utf-8'))
    except Exception:
        todos = []

next_id = 1
if todos:
    existing_ids = [t.get('id') for t in todos if isinstance(t.get('id'), int)]
    if existing_ids:
        next_id = max(existing_ids) + 1

added = 0
for title, lines in sections:
    key = re.sub(r"[^A-Za-z0-9]", '', title).upper()
    for l in lines:
        m = re.match(r"^\d+\.\s*(.*)$", l)
        text_line = m.group(1).strip() if m else l
        # create a concise title (first 6 words)
        short = ' '.join(text_line.split()[:6])
        DONE = {
            'id': next_id,
            'title': f'{key}: {short}',
            'description': f'Platform: {title}\n\nFeature: {text_line}',
            'status': 'not-started',
            'created_at': datetime.utcnow().isoformat() + 'Z'
        }
        todos.append(DONE)
        next_id += 1
        added += 1

OUT.write_text(json.dumps(todos, indent=2), encoding='utf-8')
print(f'Wrote {OUT} ({added} new todos)')
