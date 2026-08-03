---
title: "Issue draft for scripts/validate_and_fix_md.py"
generated: 2025-11-08T16:06:38.996663Z
---

# Review needed: scripts/validate_and_fix_md.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.151922Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.151922Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.151922Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""
scripts/validate_and_fix_md.py

Conservative validator and autofixer for Markdown files.

Features:
- Scans markdown files listed in docs/md_index.json (or finds .md files)
- Finds HTTP URLs and tests whether the HTTPS equivalent responds with HEAD
- Produces docs/link_report.json with findings and suggested safe fixes
- If --apply is passed, creates .bak backups and applies HTTPS upgrades where safe

Usage:
  python3 scripts/validate_and_fix_md.py --out docs/link_report.json [--apply] [--root .] [--timeout 5]

This script is intentionally conservative: it only auto-fixes http->https when
the https HEAD request returns <400. It never rewrites anchors or file paths.
"""
import argparse
import json
import os
import re
import shutil
from pathlib import Path
from urllib.parse import urlparse

ROOT_DEFAULT = Path(__file__).resolve().parents[1]
OUT_DEFAULT = ROOT_DEFAULT / 'docs' / 'link_report.json'

URL_RE = re.compile(r"https?://[^)\s'\"]+")


def find_md_files(root: Path):
    idx = root / 'docs' / 'md_index.json'
    if idx.exists():
        try:
            j = json.loads(idx.read_text(encoding='utf8'))
            return [root / f['path'] for f in j.get('files', [])]
        except Exception:
            pass
    # fallback: glob
    return sorted(root.rglob('*.md'))


def check_https_equiv(url: str, timeout: int = 5) -> bool:
    if not url.startswith('http://'):
        return False
    https = 'https://' + url[len('http://'):]
    try:
        import urllib.request
        req = urllib.request.Request(https, method='HEAD')
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status < 400
    except Exception:
        return False


def scan_and_fix(root: Path, out_path: Path, apply: bool = False, timeout: int = 5):
    files = find_md_files(root)
    findings = {'generated': None, 'files': []}
    for p in files:
        try:
            text = p.read_text(encoding='utf8')
        except Exception:
            continue
        urls = list(set(UR
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
