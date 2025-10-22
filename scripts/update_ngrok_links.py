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


def load_source_url(source: str) -> str | None:
    p = Path(source)
    if p.exists():
        try:
            return p.read_text(encoding='utf-8').strip().splitlines()[0].strip()
        except Exception:
            return None
    return None


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true', help='Scan and report; do not modify files')
    ap.add_argument('--apply', action='store_true', help='Apply replacements to files (implies not dry-run)')
    ap.add_argument('--source', default=str(REPO_ROOT / 'live_qmoi_ngrok_url.txt'), help='Source file containing new URL')
    ap.add_argument('--new-url', help='Explicit new URL to use instead of --source')
    ap.add_argument('--root', default=str(REPO_ROOT), help='Repository root to scan')
    args = ap.parse_args(argv)

    root = Path(args.root)
    if args.new_url:
        new_url = args.new_url
    else:
        new_url = load_source_url(args.source)

    if not new_url:
        print('No new URL provided; use --new-url or ensure source file exists.', file=sys.stderr)
        return 2

    candidates = find_candidate_files(root)
    total_matches = 0
    replacements = []

    for p in candidates:
        matches = scan_file_for_ngrok(p)
        if not matches:
            continue
        total_matches += len(matches)
        print(f'Found {len(matches)} ngrok occurrences in {p.relative_to(root)}')
        for lineno, line in matches:
            print(f'  {lineno}: {line}')
        # find distinct existing urls in file
        text = p.read_text(encoding='utf-8')
        found_urls = set(NGROK_PATTERN.findall(text))
        for old in found_urls:
            if old == new_url:
                print(f'  Skipping replacement: already up-to-date in {p.relative_to(root)}')
                continue
            if args.apply:
                ok = replace_in_file(p, old, new_url)
                if ok:
                    print(f'  Rewrote {old} -> {new_url} in {p.relative_to(root)} (backup created)')
                    replacements.append((p, old, new_url))
            else:
                print(f'  DRY-RUN: would replace {old} -> {new_url} in {p.relative_to(root)}')

    print(f'-- Scan complete. Files scanned: {len(candidates)}. Occurrences found: {total_matches}. Replacements applied: {len(replacements)}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1:]))
