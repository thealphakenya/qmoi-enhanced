#!/usr/bin/env python3
"""Apply Lion validation metadata blocks to Markdown files.

This script scans all Markdown files under the repository, refreshes or inserts
QMOI Lion validation blocks, and writes a summary report that includes
production readiness metadata and file stats for each Markdown document.
"""

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
    characters = len(content)
    headings = len(re.findall(r'^\s*#+\s+', content, flags=re.MULTILINE))
    links = len(re.findall(r'\[[^\]]+\]\([^\)]+\)', content))
    images = len(re.findall(r'!\[[^\]]*\]\([^\)]+\)', content))
    tables = len(re.findall(r'^\s*\|.+\|\s*$', content, flags=re.MULTILINE))
    return {
        'lines': lines,
        'words': words,
        'characters': characters,
        'headings': headings,
        'links': links,
        'images': images,
        'tables': tables,
    }


def detect_production_status(content: str) -> tuple[str, list[str]]:
    production_hit = any(pattern.search(content) for pattern in PRODUCTION_PATTERNS)
    nonproduction_hit = any(pattern.search(content) for pattern in NONPRODUCTION_PATTERNS)
    tags = []

    if production_hit and not nonproduction_hit:
        status = '✅ production-ready'
        tags.append('production-ready')
    elif nonproduction_hit and not production_hit:
        status = '❌ needs production implementation'
        tags.append('needs-production')
    elif production_hit and nonproduction_hit:
        status = '⚠️ mixed production markers'
        tags.extend(['mixed', 'review'])
    else:
        status = '⚠️ review / no explicit production status'
        tags.append('review')

    if production_hit:
        tags.append('production')
    if nonproduction_hit:
        tags.append('nonproduction')

    return status, sorted(set(tags))


def build_standard_block(timestamp: str, status: str, tags: list[str], stats: dict[str, int], lion_validated: bool) -> str:
    tag_list = ', '.join(tags)
    lion_state = 'present' if lion_validated else 'inserted'
    return f"""<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: {timestamp}
- production status: {status}
- status tags: {tag_list}
- lines: {stats['lines']}
- words: {stats['words']}
- characters: {stats['characters']}
- headings: {stats['headings']}
- links: {stats['links']}
- images: {stats['images']}
- tables: {stats['tables']}
- lion validation block: {lion_state}
<!-- LION_VALIDATION_END -->"""


def update_file(path: Path, apply: bool) -> dict:
    original = path.read_text(encoding='utf-8', errors='ignore')
    content = normalize_content(original)
    stats = compute_stats(content)
    status, tags = detect_production_status(content)
    start_idx = content.find(VALIDATION_START)
    end_idx = content.find(VALIDATION_END, start_idx + len(VALIDATION_START)) if start_idx != -1 else -1
    timestamp = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    standard_block = build_standard_block(timestamp, status, tags, stats, lion_validated=(start_idx != -1 and end_idx != -1))

    if start_idx != -1 and end_idx != -1:
        end_idx += len(VALIDATION_END)
        updated_content = content[:start_idx] + standard_block + content[end_idx:]
    else:
        if content and not content.endswith('\n'):
            content += '\n'
        updated_content = content + '\n' + standard_block + '\n'

    if updated_content == content:
        return {'path': str(path), 'updated': False, 'reason': 'already current'}

    if apply:
        backup = path.with_suffix(path.suffix + '.bak')
        backup.write_text(original, encoding='utf-8')
        path.write_text(updated_content, encoding='utf-8')
        return {'path': str(path), 'updated': True, 'reason': 'applied', 'backup': str(backup)}

    return {'path': str(path), 'updated': True, 'reason': 'dry-run'}


def write_report(report: dict, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    logger.info('Wrote Lion metadata summary to %s', out_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Auto-tag Markdown files with QMOI Lion validation metadata')
    parser.add_argument('--apply', action='store_true', help='Write updates to Markdown files in-place')
    parser.add_argument('--out', type=Path, default=ROOT / 'docs' / 'md_index.json', help='Output JSON summary file path')
    parser.add_argument('--root', type=Path, default=ROOT, help='Repository root to scan for Markdown files')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    md_files = find_markdown_files(args.root)
    results = []
    applied_files = 0

    logger.info('Scanning %d Markdown files for Lion validation blocks...', len(md_files))
    for path in md_files:
        result = update_file(path, apply=args.apply)
        if result['updated']:
            applied_files += 1
        results.append(result)

    report = {
        'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        'root': str(args.root),
        'apply': args.apply,
        'total_files_scanned': len(md_files),
        'updated_files': applied_files,
        'results': results,
    }

    write_report(report, args.out)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
