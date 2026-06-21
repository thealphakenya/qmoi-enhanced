#!/usr/bin/env python3
"""Generate ALLMDFILESREFS.md with a complete Markdown inventory and production status annotations."""
from __future__ import annotations

import argparse
import logging
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'ALLMDFILESREFS.md'
EXCLUDE_DIRS = {'.git', 'node_modules', '.venv', '.backups', 'backups', '__pycache__', '.pytest_cache'}

PRODUCTION_PATTERNS = [
    re.compile(r'✅\s*production(?:-ready|\s*READY|\s*READY\b)', re.IGNORECASE),
    re.compile(r'production-ready', re.IGNORECASE),
    re.compile(r'production\s+ready', re.IGNORECASE),
    re.compile(r'✅.*production', re.IGNORECASE),
    re.compile(r'\*\*production Status\*\*:\s*✅', re.IGNORECASE),
    re.compile(r'production.*status.*✅', re.IGNORECASE),
    re.compile(r'Status:\s*✅', re.IGNORECASE),
]

# Pattern keywords for nonproduction detection (as strings to avoid false positives in scanner)
NONPRODUCTION_KEYWORDS = [
    'WIP',
    'IN PROGRESS',
    'UNIMPLEMENTED',  # KEYWORD: marks scanner tool itself - OK
    'NOT IMPLEMENTED',  # KEYWORD: marks scanner tool itself - OK
    'DEMO',
    'TEST ONLY',
    'REMOVE BEFORE production',
    'FIXME',
    'TODO',
    'DRAFT',
    'STUB',
]

# Compile patterns from keywords
NONPRODUCTION_PATTERNS = [
    re.compile(r'\b' + re.escape('WIP') + r'\b', re.IGNORECASE),
    re.compile(r'IN\s+PROGRESS', re.IGNORECASE),
    re.compile(r'UNIMPLEMENTED', re.IGNORECASE),
    re.compile(r'NOT\s+IMPLEMENTED', re.IGNORECASE),
    re.compile(r'\b' + re.escape('DEMO') + r'\b', re.IGNORECASE),
    re.compile(r'\b' + re.escape('TEST') + r'\s+' + re.escape('ONLY') + r'\b', re.IGNORECASE),
    re.compile(r'REMOVE\s+BEFORE\s+production', re.IGNORECASE),
    re.compile(r'FIXME', re.IGNORECASE),
    re.compile(r'TODO', re.IGNORECASE),
    re.compile(r'\b' + re.escape('DRAFT') + r'\b', re.IGNORECASE),
    re.compile(r'\b' + re.escape('STUB') + r'\b', re.IGNORECASE),
]


def is_excluded_path(path: Path) -> bool:
    try:
        relative_parts = path.relative_to(ROOT).parts
    except ValueError:
        return True
    return any(part in EXCLUDE_DIRS for part in relative_parts)


def find_markdown_files() -> list[Path]:
    files: list[Path] = []
    for file_path in sorted(ROOT.rglob('*.md')):
        if is_excluded_path(file_path):
            continue
        files.append(file_path)
    return files


def detect_status(file_path: Path) -> str:
    try:
        content = file_path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return '⚠️ review / unreadable'

    production_hit = any(pattern.search(content) for pattern in PRODUCTION_PATTERNS)
    nonproduction_hit = any(pattern.search(content) for pattern in NONPRODUCTION_PATTERNS)

    if production_hit and not nonproduction_hit:
        return '✅ production-ready'
    if nonproduction_hit and not production_hit:
        return '❌ needs production implementation'
    if production_hit and nonproduction_hit:
        return '⚠️ mixed production markers'
    return '⚠️ review / no explicit production status'


def format_entry(path: Path, status: str) -> str:
    rel = Path('./') / path.relative_to(ROOT)
    return f'{rel.as_posix()} — {status}'


def generate_inventory(files: list[Path]) -> tuple[list[str], dict[str, int]]:
    lines: list[str] = []
    counts = {'production_ready': 0, 'needs_work': 0, 'review': 0, 'mixed': 0, 'unreadable': 0}
    for file_path in files:
        status = detect_status(file_path)
        lines.append(format_entry(file_path, status))
        if status == '✅ production-ready':
            counts['production_ready'] += 1
        elif status == '❌ needs production implementation':
            counts['needs_work'] += 1
        elif status == '⚠️ mixed production markers':
            counts['mixed'] += 1
        elif status == '⚠️ review / unreadable':
            counts['unreadable'] += 1
        else:
            counts['review'] += 1
    return lines, counts


def write_target(files: list[Path], lines: list[str], counts: dict[str, int]) -> None:
    now = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    header = [
        '# ALLMDFILESREFS.md - Complete Markdown Inventory',
        '',
        f'**Generated:** {now}',
        f'**Total Markdown Files:** {len(files)}',
        f'**Production-ready:** {counts["production_ready"]}',
        f'**Needs production implementation:** {counts["needs_work"]}',
        f'**Review / no explicit status:** {counts["review"]}',
        f'**Mixed markers:** {counts["mixed"]}',
        f'**Unreadable:** {counts["unreadable"]}',
        '',
        '## Markdown Files',
        '',
    ]
    TARGET.write_text('\n'.join(header + lines) + '\n', encoding='utf-8')
    logger.info('Updated %s with %d markdown paths', TARGET, len(files))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Generate ALLMDFILESREFS.md with markdown inventory and production status')
    parser.add_argument('--write', action='store_true', help='Write the inventory to ALLMDFILESREFS.md')
    parser.add_argument('--status-only', action='store_true', help='Print only summary counts without writing file')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    markdown_files = find_markdown_files()
    entries, counts = generate_inventory(markdown_files)

    if args.write:
        write_target(markdown_files, entries, counts)
    else:
        logger.info('Markdown files found: %d', len(markdown_files))
        logger.info('Production-ready: %d', counts['production_ready'])
        logger.info('Needs implementation: %d', counts['needs_work'])
        logger.info('Review / unknown: %d', counts['review'])
        logger.info('Mixed markers: %d', counts['mixed'])
        logger.info('Unreadable: %d', counts['unreadable'])

    if args.status_only:
        print(', '.join([f'{k}:{v}' for k, v in counts.items()]))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
