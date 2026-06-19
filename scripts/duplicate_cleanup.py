#!/usr/bin/env python3
"""Duplicate API endpoint cleanup and reporting for QMOI Enhanced."""
import logging
from collections import defaultdict
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

ROOT = Path(__file__).resolve().parent.parent
ROUTE_DIRS = [ROOT / 'app' / 'api', ROOT / 'src' / 'app' / 'api']
REPORT_PATH = ROOT / 'duplicate_api_endpoints_report.md'
JSON_PATH = ROOT / 'duplicate_api_endpoints.json'


def is_route_file(path: Path) -> bool:
    return path.name in {'route.ts', 'route.js'}


def normalize_endpoint(route_file: Path, base_dir: Path) -> str:
    rel = route_file.relative_to(base_dir)
    rel = rel.parent if is_route_file(route_file) else rel
    segments = []
    for segment in rel.parts:
        if segment.startswith('[') and segment.endswith(']'):
            segment = '{' + segment[1:-1] + '}'
        segments.append(segment)
    endpoint = '/api/' + '/'.join([s for s in segments if s])
    endpoint = endpoint.replace('//', '/')
    if endpoint != '/api/' and endpoint.endswith('/'):
        endpoint = endpoint[:-1]
    return endpoint


def walk_route_files() -> list[Path]:
    files = []
    for base in ROUTE_DIRS:
        if not base.exists():
            continue
        for path in base.rglob('*'):
            if path.is_file() and is_route_file(path):
                files.append(path)
    return sorted(files)


def preferred_source(path: Path) -> int:
    if str(path).startswith(str(ROOT / 'app' / 'api')):
        return 0
    return 1


def build_endpoint_map(route_files: list[Path]) -> dict[str, list[str]]:
    endpoint_map = defaultdict(list)
    for route_file in route_files:
        base = ROOT / 'src' / 'app' / 'api' if 'src/app/api' in str(route_file) else ROOT / 'app' / 'api'
        endpoint = normalize_endpoint(route_file, base)
        endpoint_map[endpoint].append(str(route_file.relative_to(ROOT)))
    return endpoint_map


def render_report(endpoint_map: dict[str, list[str]]) -> str:
    duplicates = {k: sorted(v, key=lambda p: (preferred_source(Path(p)), p)) for k, v in endpoint_map.items() if len(v) > 1}
    lines = [
        '# Duplicate API Endpoint Report',
        '',
        f'Generated: {datetime.utcnow().isoformat()}Z',
        '',
        f'Total route files scanned: {sum(len(paths) for paths in endpoint_map.values())}',
        f'Total unique endpoints: {len(endpoint_map)}',
        f'Duplicate endpoint groups: {len(duplicates)}',
        '',
    ]
    if duplicates:
        lines.append('## Duplicates by Endpoint')
        lines.append('')
        for endpoint, files in sorted(duplicates.items(), key=lambda item: (-len(item[1]), item[0])):
            lines.append(f'### `{endpoint}` ({len(files)} handlers)')
            for path in files:
                lines.append(f'- `{path}`')
            lines.append('')
            canonical = files[0]
            lines.append(f'**Recommended canonical source:** `{canonical}`')
            lines.append('')
    else:
        lines.append('No duplicate API endpoints were detected.')
    return '\n'.join(lines)


def save_files(report_text: str, endpoint_map: dict[str, list[str]]) -> None:
    REPORT_PATH.write_text(report_text + '\n', encoding='utf-8')
    json_data = {
        'generated': datetime.utcnow().isoformat() + 'Z',
        'route_count': sum(len(paths) for paths in endpoint_map.values()),
        'unique_endpoints': len(endpoint_map),
        'duplicate_groups': {k: v for k, v in endpoint_map.items() if len(v) > 1},
    }
    JSON_PATH.write_text(__import__('json').dumps(json_data, indent=2), encoding='utf-8')


def main() -> None:
    route_files = walk_route_files()
    if not route_files:
        logger.warning('No route files found under app/api or src/app/api')
    endpoint_map = build_endpoint_map(route_files)
    report_text = render_report(endpoint_map)
    save_files(report_text, endpoint_map)
    logger.info('Duplicate API endpoint report written to %s', REPORT_PATH)
    logger.info('Duplicate API endpoint JSON written to %s', JSON_PATH)


if __name__ == '__main__':
    main()
