#!/usr/bin/env python3
"""Scan Markdown files for Lion validation coverage and production readiness metadata."""

import argparse
import json
import logging
import re
from datetime import datetime, timezone
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_START = '<!-- LION_VALIDATION_START -->'
VALIDATION_END = '<!-- LION_VALIDATION_END -->'
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
NONPRODUCTION_PATTERNS = [
    re.compile(r'\bWIP\b', re.IGNORECASE),
    re.compile(r'IN\s+PROGRESS', re.IGNORECASE),
    re.compile(r'UNIMPLEMENTED', re.IGNORECASE),
    re.compile(r'NOT\s+IMPLEMENTED', re.IGNORECASE),
    re.compile(r'\bDEMO\b', re.IGNORECASE),
    re.compile(r'\bTEST\s+ONLY\b', re.IGNORECASE),
    re.compile(r'REMOVE\s+BEFORE\s+production', re.IGNORECASE),
    re.compile(r'FIXME', re.IGNORECASE),
    re.compile(r'TODO', re.IGNORECASE),
    re.compile(r'\bDRAFT\b', re.IGNORECASE),
    re.compile(r'\bSTUB\b', re.IGNORECASE),
]


def is_excluded_path(path: Path) -> bool:
    try:
        relative_parts = path.relative_to(ROOT).parts
    except ValueError:
        return True
    return any(part in EXCLUDE_DIRS for part in relative_parts)


def find_markdown_files(root: Path) -> list[Path]:
    files = []
    for path in sorted(root.rglob('*.md')):
        if is_excluded_path(path):
            continue
        files.append(path)
    return files


def normalize_content(content: str) -> str:
    return content.replace('\r\n', '\n')


def compute_stats(content: str) -> dict[str, int]:
    lines = content.count('\n') + (0 if content.endswith('\n') or content == '' else 1)
    words = len(re.findall(r'\S+', content))
    headings = len(re.findall(r'^\s*#+\s+', content, flags=re.MULTILINE))
    links = len(re.findall(r'\[[^\]]+\]\([^\)]+\)', content))
    images = len(re.findall(r'!\[[^\]]*\]\([^\)]+\)', content))
    tables = len(re.findall(r'^\s*\|.+\|\s*$', content, flags=re.MULTILINE))
    return {'lines': lines, 'words': words, 'headings': headings, 'links': links, 'images': images, 'tables': tables}


def detect_status(content: str) -> str:
    production_hit = any(pattern.search(content) for pattern in PRODUCTION_PATTERNS)
    nonproduction_hit = any(pattern.search(content) for pattern in NONPRODUCTION_PATTERNS)
    if production_hit and not nonproduction_hit:
        return 'production-ready'
    if nonproduction_hit and not production_hit:
        return 'needs-production'
    if production_hit and nonproduction_hit:
        return 'mixed'
    return 'review'


def scan_file(path: Path) -> dict:
    original = path.read_text(encoding='utf-8', errors='ignore')
    content = normalize_content(original)
    start_idx = content.find(VALIDATION_START)
    end_idx = content.find(VALIDATION_END, start_idx + len(VALIDATION_START)) if start_idx != -1 else -1
    has_lion_block = start_idx != -1 and end_idx != -1
    status = detect_status(content)
    tags = []
    if has_lion_block:
        tags.append('lion-block')
    if status == 'production-ready':
        tags.append('production-ready')
    if status == 'needs-production':
        tags.append('needs-production')
    if status == 'mixed':
        tags.extend(['mixed', 'review'])
    if status == 'review':
        tags.append('review')

    return {
        'path': str(path.relative_to(ROOT)),
        'lion_block': has_lion_block,
        'production_status': status,
        'tags': sorted(set(tags)),
        'stats': compute_stats(content),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Scan QMOI Lion validation coverage for Markdown files')
    parser.add_argument('--out', type=Path, default=ROOT / 'docs' / 'lion_usage_report.json', help='Output JSON summary file path')
    parser.add_argument('--report', action='store_true', help='Alias for --out default report path')
    parser.add_argument('--root', type=Path, default=ROOT, help='Repository root to scan')
    args = parser.parse_args()
    if args.report:
        args.out = ROOT / 'docs' / 'lion_usage_report.json'
    return args


def main() -> int:
    args = parse_args()
    md_files = find_markdown_files(args.root)
    results = [scan_file(path) for path in md_files]
    summary = {'production-ready': 0, 'needs-production': 0, 'mixed': 0, 'review': 0, 'lion-block': 0}
    for item in results:
        summary[item['production_status']] += 1
        if item['lion_block']:
            summary['lion-block'] += 1

    report = {
        'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        'root': str(args.root),
        'total_files_scanned': len(md_files),
        'summary': summary,
        'files': results,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    logger.info('Wrote Lion usage report to %s', args.out)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
