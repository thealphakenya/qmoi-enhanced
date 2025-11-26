#!/usr/bin/env python3
"""Process `allrefs.txt`, classify files and generate conservative draft patches.

Produces:
 - tools/allrefs.status.json  (classification)
 - tools/patches/*.patch      (one per auto-file)

This tool is conservative: it only emits draft patches for trivial, high-confidence patterns and
does NOT apply any changes to the repository. Review patches before applying.
"""
import json
from pathlib import Path
import re
import os
import hashlib
import argparse

ROOT = Path(__file__).resolve().parents[1]
ALLREFS = ROOT / 'allrefs.txt'
OUT_STATUS = ROOT / 'tools' / 'allrefs.status.json'
PATCH_DIR = ROOT / 'tools' / 'patches'

PLACEHOLDER_PATTERNS = [
    re.compile(r'REPLACE_ME', re.I),
    re.compile(r'NOT FOR PRODUCTION', re.I),
    re.compile(r'//\s*TODO', re.I),
    re.compile(r'#\s*TODO', re.I),
    re.compile(r'FIXME', re.I),
]

def is_text_file(p: Path):
    try:
        _ = p.read_text(encoding='utf-8')
        return True
    except Exception:
        return False

def classify_file(p: Path):
    if not p.exists():
        return 'missing'
    if p.suffix.lower() in ('.md', '.txt'):
        # md/text files are safe to auto-draft small TBD replacements
        text = p.read_text(encoding='utf-8', errors='ignore')
        for pat in PLACEHOLDER_PATTERNS:
            if pat.search(text):
                return 'auto'
        return 'skip'
    if p.suffix.lower() in ('.py',):
        text = p.read_text(encoding='utf-8', errors='ignore')
        # safe auto-case: 'pass' with an adjacent TODO comment
        if re.search(r"pass\s*#.*TODO|#.*TODO.*pass", text, re.I):
            return 'auto'
        # other placeholders
        for pat in PLACEHOLDER_PATTERNS:
            if pat.search(text):
                return 'manual'
        return 'skip'
    # for other file types, flag manual if placeholders present
    if is_text_file(p):
        text = p.read_text(encoding='utf-8', errors='ignore')
        for pat in PLACEHOLDER_PATTERNS:
            if pat.search(text):
                return 'manual'
    return 'skip'

def make_patch_for(path: Path):
    """Create a conservative draft patch file under tools/patches/. Returns patch path."""
    PATCH_DIR.mkdir(parents=True, exist_ok=True)
    rel = path.relative_to(ROOT).as_posix()
    content = path.read_text(encoding='utf-8', errors='ignore')
    lines = content.splitlines()
    new_lines = list(lines)
    changed = False
    if path.suffix.lower() in ('.md', '.txt'):
        for i, l in enumerate(lines):
            if 'REPLACE_ME' in l or 'NOT FOR PRODUCTION' in l.upper():
                new_lines[i] = l.replace('REPLACE_ME', '[REQUIRES PRODUCTION IMPLEMENTATION]').replace('NOT FOR PRODUCTION', '[NOT PRODUCTION: REVIEW]')
                changed = True
    elif path.suffix.lower() in ('.py',):
        for i, l in enumerate(lines):
            if re.search(r"pass\s*#.*TODO|#.*TODO.*pass", l, re.I):
                indent = re.match(r"^(\s*)", l).group(1)
                new_lines[i] = indent + "raise NotImplementedError('Auto-draft: implement production logic')"
                changed = True

    if not changed:
        return None

    patch_name = hashlib.sha1(rel.encode('utf-8')).hexdigest() + '.patch'
    patch_path = PATCH_DIR / patch_name
    with patch_path.open('w', encoding='utf-8') as fh:
        fh.write('# Draft patch for: ' + rel + '\n')
        fh.write('# Review carefully before applying. This file is not applied automatically.\n\n')
        fh.write('--- original file: ' + rel + '\n\n')
        fh.write('\n'.join(new_lines))
    return patch_path

def main():
    if not ALLREFS.exists():
        print('allrefs.txt not found at', ALLREFS)
        return
    status = {}
    for raw in ALLREFS.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line:
            continue
        # handle possible "path --info" lines
        path_str = line.split()[0]
        p = ROOT / path_str
        cat = classify_file(p)
        status[path_str] = {'category': cat}
        if cat == 'auto':
            patch = make_patch_for(p)
            if patch:
                status[path_str]['patch'] = str(patch.relative_to(ROOT))

    OUT_STATUS.parent.mkdir(parents=True, exist_ok=True)
    with OUT_STATUS.open('w', encoding='utf-8') as fh:
        json.dump(status, fh, indent=2)
    print('Wrote', OUT_STATUS)

if __name__ == '__main__':
    main()
