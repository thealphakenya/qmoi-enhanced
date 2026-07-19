#!/usr/bin/env python3
"""Validate Markdown files and apply Q Lion validation metadata.

This helper scans all repository Markdown files, computes per-file stats,
extracts production readiness markers, writes per-file JSON reports under
.qmoi_validation/validation_reports/, and optionally inserts or updates the
Q Lion metadata block in each Markdown document.
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
OUTPUT_DIR = ROOT / '.qmoi_validation'
REPORTS_DIR = OUTPUT_DIR / 'validation_reports'
SUMMARY_PATH = OUTPUT_DIR / 'validation_summary.json'
MD_FILES_FOUND_PATH = OUTPUT_DIR / 'md_files_found.json'
PRODUCTION_PATTERNS = [
    re.compile(r'✅\s*production(?:-ready|\s*READY|\s*READY\b)', re.IGNORECASE),
    re.compile(r'production-ready', re.IGNORECASE),
    re.compile(r'production\s+ready', re.IGNORECASE),
    re.compile(r'✅.*production', re.IGNORECASE),
    re.compile(r'\*\*production Status\*\*: \s*✅', re.IGNORECASE),
    re.compile(r'production.*status.*✅', re.IGNORECASE),
    re.compile(r'Status:\s*✅', re.IGNORECASE),
]
NONPRODUCTION_PATTERNS = [
    re.compile(r'\bPENDING\b', re.IGNORECASE),
    re.compile(r'\bREVIEW\b', re.IGNORECASE),
    re.compile(r'\bNOT\s+YET\s+IMPLEMENTED\b', re.IGNORECASE),
    re.compile(r'\bPROTOTYPE\b', re.IGNORECASE),
    re.compile(r'\bPLACEHOLDER\b', re.IGNORECASE),
    re.compile(r'\bSKELETON\b', re.IGNORECASE),
]


def is_excluded_path(path: Path) -> bool:
    try:
        relative_parts = path.relative_to(ROOT).parts
    except ValueError:
        return True
    return any(part in EXCLUDE_DIRS for part in relative_parts)


def find_markdown_files(root: Path) -> list[Path]:
    files: list[Path] = []
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
    links = len(re.findall(r'\[[^\]]+\]\((?:[^)]+)\)', content))
    images = len(re.findall(r'!\[[^\]]*\]\((?:[^)]+)\)', content))
    tables = len(re.findall(r'^\s*\|.+\|\s*$', content, flags=re.MULTILINE))
    code_blocks = len(re.findall(r'```', content)) // 2
    inline_code = len(re.findall(r'`[^`]+`', content))
    front_matter = 1 if re.match(r'^---\s*\n', content) else 0
    toc_present = 1 if re.search(r'(^|\n)##?\s*Table of Contents', content, flags=re.IGNORECASE) else 0
    reading_minutes = round(words / 200, 2) if words else 0
    automation_mentions = len(re.findall(r'\b(auto|autoupdate|automation|autonat|autonation|workflow|github actions|action)\b', content, flags=re.IGNORECASE))
    script_links = len(re.findall(r'\b(?:scripts|bin)/[\w\-/.]+', content))
    percent_numbers = [float(x) for x in re.findall(r'([0-9]{1,3}(?:\.[0-9]+)?)\s*%',' ' + content) if 0 <= float(x) <= 100]
    avg_percentage = round(sum(percent_numbers)/len(percent_numbers),2) if percent_numbers else None
    bullet_count = len(re.findall(r'^\s*[-*•]\s+', content, flags=re.MULTILINE))
    checklist_count = len(re.findall(r'^\s*[-*•]\s*\[[ xX]\]', content, flags=re.MULTILINE))

    return {
        'lines': lines,
        'words': words,
        'characters': characters,
        'headings': headings,
        'links': links,
        'images': images,
        'tables': tables,
        'code_blocks': code_blocks,
        'inline_code': inline_code,
        'front_matter': front_matter,
        'toc_present': toc_present,
        'reading_minutes': reading_minutes,
        'automation_mentions': automation_mentions,
        'script_links': script_links,
        'avg_percentage_mentioned': avg_percentage,
        'bullet_count': bullet_count,
        'checklist_count': checklist_count,
    }


def detect_production_status(content: str) -> tuple[str, list[str]]:
    production_hit = any(pattern.search(content) for pattern in PRODUCTION_PATTERNS)
    nonproduction_hit = any(pattern.search(content) for pattern in NONPRODUCTION_PATTERNS)
    tags: list[str] = []

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


def build_validation_block(timestamp: str, status: str, tags: list[str], stats: dict[str, int], lion_validated: bool) -> str:
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
    standard_block = build_validation_block(timestamp, status, tags, stats, lion_validated=(start_idx != -1 and end_idx != -1))

    if start_idx != -1 and end_idx != -1:
        end_idx += len(VALIDATION_END)
        updated_content = content[:start_idx] + standard_block + content[end_idx:]
    else:
        if content and not content.endswith('\n'):
            content += '\n'
        updated_content = content + '\n' + standard_block + '\n'

    changed = updated_content != content
    result = {
        'path': str(path),
        'relative_path': str(path.relative_to(ROOT)),
        'production_status': status,
        'tags': tags,
        'lion_block': start_idx != -1 and end_idx != -1,
        'stats': stats,
        'updated': changed,
    }

    if not changed:
        result['reason'] = 'already current'
        return result

    result['reason'] = 'applied' if apply else 'dry-run'
    if apply:
        backup = path.with_suffix(path.suffix + '.bak')
        backup.write_text(original, encoding='utf-8')
        path.write_text(updated_content, encoding='utf-8')
        result['backup'] = str(backup)

    return result


def write_report(report: dict, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    logger.info('Wrote Markdown validation summary to %s', out_path)


def write_per_file_reports(results: list[dict], report_dir: Path) -> None:
    for result in results:
        report_path = report_dir / Path(result['relative_path']).with_suffix('.json')
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding='utf-8')


def write_allauto(results: list[dict], root: Path, apply: bool) -> None:
    """Aggregate files that reference automations/scripts and write ALLAUTO.md"""
    entries = []
    for r in results:
        if r['stats'].get('automation_mentions', 0) or r['stats'].get('script_links', 0):
            entries.append((r['relative_path'], r['stats'].get('automation_mentions', 0), r['stats'].get('script_links', 0)))

    alla = root / 'ALLAUTO.md'
    lines = [
        '# ALLAUTO.md - Automation references inventory',
        '',
        f'**Generated:** {datetime.now(timezone.utc).isoformat().replace("+00:00","Z")}',
        f'**Total entries:** {len(entries)}',
        '',
    ]
    for path, mentions, scripts in sorted(entries):
        lines.append(f'- {path} — automation_mentions: {mentions} — script_links: {scripts}')

    if apply:
        alla.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        logger.info('Wrote ALLAUTO.md with %d entries', len(entries))
    else:
        logger.info('DRY RUN: would write ALLAUTO.md with %d entries', len(entries))


def write_allpercentages(results: list[dict], root: Path, apply: bool) -> None:
    """Aggregate percentage metrics and write ALLPERCENTAGES.md and ALLPERCENTAGES JSON"""
    entries = []
    perc_values = []
    for r in results:
        v = r['stats'].get('avg_percentage_mentioned')
        if v is not None:
            entries.append({'path': r['relative_path'], 'avg_percentage': v})
            perc_values.append(v)

    allp = root / 'ALLPERCENTAGES.md'
    jsonp = root / '.qmoi_validation' / 'allpercentages.json'
    lines = [
        '# ALLPERCENTAGES.md - Aggregated percentage mentions',
        '',
        f'**Generated:** {datetime.now(timezone.utc).isoformat().replace("+00:00","Z")}',
        f'**Files with percentage mentions:** {len(entries)}',
        f'**Average of averages:** {round(sum(perc_values)/len(perc_values),2) if perc_values else "N/A"}',
        '',
    ]
    for e in sorted(entries, key=lambda x: x['path']):
        lines.append(f'- {e["path"]} — avg_percentage_mentioned: {e["avg_percentage"]}%')

    if apply:
        allp.write_text('\n'.join(lines) + '\n', encoding='utf-8')
        jsonp.parent.mkdir(parents=True, exist_ok=True)
        jsonp.write_text(json.dumps({'generated': datetime.now(timezone.utc).isoformat().replace('+00:00','Z'), 'entries': entries}, indent=2, ensure_ascii=False), encoding='utf-8')
        logger.info('Wrote ALLPERCENTAGES.md and JSON report with %d entries', len(entries))
    else:
        logger.info('DRY RUN: would write ALLPERCENTAGES.md with %d entries', len(entries))


def write_md_files_found(results: list[dict], path: Path) -> None:
    entries = [
        {
            'path': result['relative_path'],
            'production_status': result['production_status'],
            'tags': result['tags'],
            'stats': result['stats'],
            'updated': result['updated'],
            'reason': result.get('reason'),
        }
        for result in results
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'), 'files': entries}, indent=2, ensure_ascii=False), encoding='utf-8')
    logger.info('Wrote markdown inventory metadata to %s', path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Validate Markdown files and apply Q Lion metadata')
    parser.add_argument('--apply', action='store_true', help='Write updates to Markdown files in-place')
    parser.add_argument('--out', type=Path, default=SUMMARY_PATH, help='Output JSON summary file path')
    parser.add_argument('--root', type=Path, default=ROOT, help='Repository root to scan for Markdown files')
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    md_files = find_markdown_files(args.root)
    results = []
    applied_files = 0

    logger.info('Scanning %d Markdown files for validation metadata...', len(md_files))
    for path in md_files:
        result = update_file(path, apply=args.apply)
        if result['updated'] and result['reason'] == 'applied':
            applied_files += 1
        results.append(result)

    counts = {
        'production_ready': sum(1 for item in results if item['production_status'] == '✅ production-ready'),
        'needs_production': sum(1 for item in results if item['production_status'] == '❌ needs production implementation'),
        'mixed': sum(1 for item in results if item['production_status'] == '⚠️ mixed production markers'),
        'review': sum(1 for item in results if item['production_status'] == '⚠️ review / no explicit production status'),
        'unreadable': sum(1 for item in results if 'unreadable' in item['tags']),
    }

    report = {
        'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        'root': str(args.root),
        'apply': args.apply,
        'total_files_scanned': len(md_files),
        'updated_files': applied_files,
        'counts': counts,
        'results': results,
    }

    write_report(report, args.out)
    write_per_file_reports(results, REPORTS_DIR)
    write_md_files_found(results, MD_FILES_FOUND_PATH)
    # Auto-update automation inventory and percentage summaries
    try:
        write_allauto(results, args.root, args.apply)
    except Exception as exc:
        logger.info('Failed to write ALLAUTO.md: %s', exc)
    try:
        write_allpercentages(results, args.root, args.apply)
    except Exception as exc:
        logger.info('Failed to write ALLPERCENTAGES.md: %s', exc)
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
