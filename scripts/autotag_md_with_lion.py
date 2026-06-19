#!/usr/bin/env python3
"""Apply Lion validation metadata blocks to Markdown files.

This script scans all Markdown files under the repository for existing
Lion validation marker blocks and refreshes the standard validation block
with the current UTC timestamp.

It can optionally apply changes in-place and write a summary JSON report.
"""

import argparse
import json
import logging
from datetime import datetime, timezone
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_START = '<!-- LION_VALIDATION_START -->'
VALIDATION_END = '<!-- LION_VALIDATION_END -->'
STANDARD_BLOCK_TEMPLATE = """<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by Quantum multi orchestra intelligence (QMOI) Lion

- validated: yes
- validator: Quantum multi orchestra intelligence (QMOI) Lion
- timestamp: {timestamp}
fully implemented
<!-- LION_VALIDATION_END -->"""


def build_standard_block(timestamp: str) -> str:
    return STANDARD_BLOCK_TEMPLATE.format(timestamp=timestamp)


def find_markdown_files(root: Path) -> list[Path]:
    return sorted(root.rglob('*.md'))


def normalize_content(content: str) -> str:
    return content.replace('\r\n', '\n')


def update_file(path: Path, apply: bool) -> dict:
    original = path.read_text(encoding='utf-8', errors='ignore')
    content = normalize_content(original)
    start_idx = content.find(VALIDATION_START)
    end_idx = content.find(VALIDATION_END, start_idx + len(VALIDATION_START))
    if start_idx == -1 or end_idx == -1:
        return {'path': str(path), 'updated': False, 'reason': 'no validation markers found'}

    end_idx = end_idx + len(VALIDATION_END)
    timestamp = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    standard_block = build_standard_block(timestamp)
    updated_content = content[:start_idx] + standard_block + content[end_idx:]

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
