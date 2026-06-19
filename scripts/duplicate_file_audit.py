#!/usr/bin/env python3
"""Repo-wide duplicate file audit for source files, components, and docs."""
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / 'duplicate_file_audit_report.md'
JSON_PATH = ROOT / 'duplicate_file_audit.json'
EXTENSIONS = {'.tsx', '.ts', '.js', '.json', '.md'}
EXCLUDE_DIRS = {'node_modules', '.git', '.venv', '__pycache__', '.pytest_cache', '.npm', 'dist', 'build'}
PREFERRED_DIRS = ['app/api', 'app', 'src/app', 'src/components', 'components', 'src', 'lib']


def is_excluded(path: Path) -> bool:
    if any(part in EXCLUDE_DIRS for part in path.parts):
        return True
    if path.name.startswith('.'):
        return True
    return False


def path_priority(path: Path) -> int:
    path_str = str(path).replace('\\', '/')
    for index, marker in enumerate(PREFERRED_DIRS):
        if f'/{marker}/' in path_str or path_str.startswith(marker + '/'):
            return index
    return len(PREFERRED_DIRS)


def walk_files() -> list[Path]:
    for path in ROOT.rglob('*'):
        if not path.is_file():
            continue
        if is_excluded(path):
            continue
        if path.suffix.lower() not in EXTENSIONS:
            continue
        yield path


def build_duplicate_map(files: list[Path]) -> dict[str, list[str]]:
    duplicates = defaultdict(list)
    for path in files:
        key = f'{path.name.lower()}'
        duplicates[key].append(str(path.relative_to(ROOT)))
    return {key: sorted(values, key=lambda p: (path_priority(Path(p)), p)) for key, values in duplicates.items() if len(values) > 1}


def render_report(duplicate_map: dict[str, list[str]], total_files: int) -> str:
    lines = [
        '# Duplicate File Audit Report',
        '',
        f'Generated: {datetime.utcnow().isoformat()}Z',
        '',
        f'Total files scanned: {total_files}',
        f'Total duplicate file titles found: {len(duplicate_map)}',
        '',
    ]
    if duplicate_map:
        lines.append('## Duplicate Files by Filename')
        lines.append('')
        for filename, paths in sorted(duplicate_map.items(), key=lambda item: (-len(item[1]), item[0])):
            lines.append(f'### `{filename}` ({len(paths)} copies)')
            for path in paths:
                lines.append(f'- `{path}`')
            lines.append('')
            lines.append(f'**Recommended canonical source:** `{paths[0]}`')
            lines.append('')
    else:
        lines.append('No duplicate filenames were detected for the selected extensions.')
    return '\n'.join(lines)


def save_results(report_text: str, duplicate_map: dict[str, list[str]]) -> None:
    REPORT_PATH.write_text(report_text + '\n', encoding='utf-8')
    json_data = {
        'generated': datetime.now(timezone.utc).isoformat(),
        'total_files_scanned': len({path for paths in duplicate_map.values() for path in paths}),
        'duplicate_groups': duplicate_map,
    }
    JSON_PATH.write_text(json.dumps(json_data, indent=2), encoding='utf-8')


def main() -> None:
    files = list(walk_files())
    duplicate_map = build_duplicate_map(files)
    report_text = render_report(duplicate_map, len(files))
    save_results(report_text, duplicate_map)
    print(f'Wrote duplicate file audit report: {REPORT_PATH}')
    print(f'Wrote duplicate file audit JSON: {JSON_PATH}')


if __name__ == '__main__':
    main()
