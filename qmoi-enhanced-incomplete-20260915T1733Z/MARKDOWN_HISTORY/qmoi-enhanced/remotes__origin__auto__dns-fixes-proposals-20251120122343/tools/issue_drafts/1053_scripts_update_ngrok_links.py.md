---
title: "Issue draft for scripts/update_ngrok_links.py"
generated: 2025-11-08T16:06:38.994468Z
---

# Review needed: scripts/update_ngrok_links.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""
scripts/update_ngrok_links.py

Idempotent utility to scan the repository for occurrences of known ngrok/tunnel URLs and optionally rewrite them
to a new URL supplied via --new-url or taken from live_qmoi_ngrok_url.txt. Designed to be safe: supports --dry-run and
--apply modes, creates .bak timestamped backups for files it will modify.

Usage examples:
  python3 scripts/update_ngrok_links.py --dry-run --source live_qmoi_ngrok_url.txt
  python3 scripts/update_ngrok_links.py --apply --new-url https://3cf7294944e8.ngrok-free.app

This script intentionally avoids network calls and git pushes; a thin wrapper in the orchestrator can commit/push
if allowed.
"""
from __future__ import annotations

import argparse
import re
import sys
import os
import time
from pathlib import Path
from typing import List, Tuple

REPO_ROOT = Path(__file__).resolve().parents[1]
NGROK_PATTERN = re.compile(r"https?://[0-9a-zA-Z\-]+\.ngrok(?:-free)?\.app")


def find_candidate_files(root: Path) -> List[Path]:
    exts = {'.md', '.txt', '.py', '.js', '.json', '.html', '.webmanifest'}
    candidates: List[Path] = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in exts:
            candidates.append(p)
    return candidates


def scan_file_for_ngrok(path: Path) -> List[Tuple[int, str]]:
    matches: List[Tuple[int, str]] = []
    try:
        text = path.read_text(encoding='utf-8')
    except Exception:
        return matches
    for i, line in enumerate(text.splitlines(), start=1):
        if NGROK_PATTERN.search(line):
            matches.append((i, line.strip()))
    return matches


def replace_in_file(path: Path, old: str, new: str) -> bool:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        return False
    # backup
    ts = time.strftime('%Y%m%dT%H%M%S')
    bak = path.with_suffix(path.suffix + f'.bak.{ts}')
    bak.write_text(text, encoding='utf-8')
    new_text = text.replace(old, new)
    path.write_text(new_text, encoding='utf-8')
    return True


def load
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
