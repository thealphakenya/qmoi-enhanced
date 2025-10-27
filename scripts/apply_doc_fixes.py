#!/usr/bin/env python3
"""
Apply safe automatic replacements to documentation and config files.

Rules (safe, non-code):
- Replace PLACEHOLDER/REPLACEME with a short 'TBD (auto-filled)'.
- Replace 'world placeholder' with 'world'.
- For JSON config values equal to 'PLACEHOLDER' or 'REPLACEME' set them to "TBD (auto-filled)".
- For missing image links in markdown, point them to vendor/placeholder.svg (created).

This script only edits files with extensions in SAFE_EXTS and skips code files.
It writes a small unified-diff report to docs/auto_fix_report.json and exits with 0.
"""
import json
import re
import sys
import shutil
from pathlib import Path
import difflib
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
REPORT = ROOT / 'docs' / 'auto_fix_report.json'
REPORT.parent.mkdir(parents=True, exist_ok=True)

SAFE_EXTS = {'.md', '.markdown', '.me', '.txt', '.json', '.yml', '.yaml'}

PLACEHOLDER_PATTERNS = [
    (re.compile(r"\bPLACEHOLDER\b", flags=re.IGNORECASE), 'TBD (auto-filled)'),
    (re.compile(r"\bREPLACEME\b", flags=re.IGNORECASE), 'TBD (auto-filled)'),
    (re.compile(r"world placeholder", flags=re.IGNORECASE), 'world'),
    (re.compile(r"example (not|non)-production", flags=re.IGNORECASE), 'example (non-production) — see production guide')
]

IMG_LINK_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")

changes = []

def fix_text(path: Path, text: str) -> str:
    orig = text
    for pat, repl in PLACEHOLDER_PATTERNS:
        text = pat.sub(repl, text)

    # fix image links pointing to missing local files (relative paths)
    def _img_repl(m):
        url = m.group(1)
        # ignore http(s) links
        if url.startswith('http://') or url.startswith('https://'):
            return m.group(0)
        # resolve path
        candidate = (path.parent / url).resolve()
        if not candidate.exists():
            # replace with vendor placeholder (relative)
            rel = Path('vendor/placeholder.svg')
            return f"![placeholder]({rel.as_posix()})"
        return m.group(0)

    text = IMG_LINK_RE.sub(_img_repl, text)
    return text

def fix_json(path: Path, text: str) -> str:
    # parse & replace simple string values equal to placeholder tokens
    try:
        data = json.loads(text)
    except Exception:
        return text

    def walk(o):
        if isinstance(o, dict):
            for k, v in list(o.items()):
                if isinstance(v, str) and v.strip().upper() in ('PLACEHOLDER', 'REPLACEME'):
                    o[k] = 'TBD (auto-filled)'
                else:
                    walk(v)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                if isinstance(v, str) and v.strip().upper() in ('PLACEHOLDER', 'REPLACEME'):
                    o[i] = 'TBD (auto-filled)'
                else:
                    walk(v)

    walk(data)
    return json.dumps(data, indent=2, ensure_ascii=False) + '\n'

for p in sorted(ROOT.rglob('*')):
    if not p.is_file():
        continue
    if p.match('**/.git/**'):
        continue
    if p.suffix.lower() not in SAFE_EXTS:
        continue
    rel = p.relative_to(ROOT)
    try:
        text = p.read_text(encoding='utf-8')
    except Exception:
        continue

    new_text = text
    if p.suffix.lower() == '.json':
        new_text = fix_json(p, text)
    else:
        new_text = fix_text(p, text)

    if new_text != text:
        diff = ''.join(difflib.unified_diff(text.splitlines(keepends=True), new_text.splitlines(keepends=True), fromfile=str(rel), tofile=str(rel)+'.fixed'))
        changes.append({'file': str(rel), 'diff': diff})
        # create a timestamped backup before overwriting
        try:
            bak_name = f"{p}.{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.bak"
            shutil.copy(p.as_posix(), bak_name)
        except Exception:
            # backup failed; continue but warn
            print('Warning: unable to create backup for', rel)
        p.write_text(new_text, encoding='utf-8')
        print('Fixed:', rel)

REPORT.write_text(json.dumps({'fixed_count': len(changes), 'changes': changes}, indent=2), encoding='utf-8')
print('Auto-fix complete. Report at', REPORT)
