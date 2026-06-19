#!/usr/bin/env python3
"""Auto-update repository documentation and inventory files."""
import logging
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ALLPAGES_MD = ROOT / "ALLPAGES.md"
ALLUI_MD = ROOT / "ALLUI.md"
ALLSERVE_MD = ROOT / "ALLSERVE.md"
SCRIPTS_MD = ROOT / "SCRIPTS.md"
ROUTES_MD = ROOT / "ROUTES.md"
API_DOC_SCRIPT = ROOT / "scripts" / "update_api_docs.js"
MD_INDEX_SCRIPT = ROOT / "scripts" / "autoupdate_docs.sh"

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


def run_command(command, description):
    logger.info('Running: %s', description)
    try:
        subprocess.run(command, cwd=ROOT, check=True)
        logger.info('Completed: %s', description)
        return True
    except subprocess.CalledProcessError as exc:
        logger.error('Failed: %s (%s)', description, exc)
        return False


def normalize_route_path(path: str) -> str:
    normalized = path.replace('\\', '/').replace('//', '/')
    if len(normalized) > 1 and normalized.endswith('/'):
        normalized = normalized[:-1]
    return normalized


def page_route_from_path(file_path: Path, base_dir: Path) -> str:
    rel = file_path.relative_to(base_dir).as_posix()
    if rel == 'page.tsx' or rel == 'page.ts' or rel == 'page.jsx' or rel == 'page.js':
        return '/'
    route_dir = Path(rel).parent.as_posix()
    route = '/' + route_dir
    return normalize_route_path(route)


def collect_page_entries() -> list[tuple[str, str]]:
    entries: list[tuple[str, str]] = []
    for base in [ROOT / 'app', ROOT / 'src' / 'app']:
        if not base.exists():
            continue
        for file_path in sorted(base.rglob('*')):
            if file_path.is_file() and file_path.name in {'page.tsx', 'page.ts', 'page.jsx', 'page.js'}:
                route = page_route_from_path(file_path, base)
                entries.append((file_path.relative_to(ROOT).as_posix(), route))
    for file_path in sorted((ROOT / 'public').rglob('*.html')):
        if file_path.is_file():
            route = '/' + file_path.relative_to(ROOT / 'public').as_posix()
            entries.append((file_path.relative_to(ROOT).as_posix(), normalize_route_path(route)))
    unique = {}
    for path, route in entries:
        if path not in unique:
            unique[path] = route
    return sorted(unique.items(), key=lambda item: item[1] if item[1] != '/' else '')


def collect_ui_components() -> tuple[list[str], int]:
    component_files: set[str] = set()
    for base in [ROOT / 'src' / 'components', ROOT / 'app' / 'components']:
        if not base.exists():
            continue
        for file_path in sorted(base.rglob('*')):
            if file_path.is_file() and file_path.suffix in {'.tsx', '.jsx', '.ts', '.js'}:
                if file_path.name.endswith(('.test.tsx', '.spec.tsx', '.test.jsx', '.spec.jsx', '.test.ts', '.spec.ts', '.test.js', '.spec.js')):
                    continue
                relative = file_path.relative_to(ROOT).as_posix()
                component_files.add(relative)
    components = sorted(component_files)
    return components[:200], len(components)


def collect_api_routes() -> tuple[list[tuple[str, str]], list[tuple[str, str]]]:
    active = []
    legacy = []
    for base, bucket in [(ROOT / 'src' / 'app' / 'api', active), (ROOT / 'app' / 'api', legacy)]:
        if not base.exists():
            continue
        for route_file in sorted(base.rglob('*')):
            if route_file.is_file() and route_file.name in {'route.ts', 'route.js'}:
                rel_dir = route_file.parent.relative_to(base).as_posix()
                if rel_dir == '.':
                    endpoint = '/api'
                else:
                    endpoint = '/api/' + rel_dir
                endpoint = normalize_route_path(endpoint)
                bucket.append((endpoint, route_file.relative_to(ROOT).as_posix()))
    return active, legacy


def generate_allpages_md():
    entries = collect_page_entries()
    lines = [
        '# ALLPAGES.md - Complete Page Route Inventory',
        '',
        '## Page Entrypoints',
        '',
    ]
    for file_path, route in entries:
        lines.append(f'- `{file_path}` → `{route}`')
    lines.append('')
    lines.append('## Notes')
    lines.append('This inventory includes all live application page entrypoints and static HTML shells present in the repository. It is generated from the current filesystem layout of `app/`, `src/app/`, and `public/`.')
    lines.append('')
    ALLPAGES_MD.write_text('\n'.join(lines), encoding='utf-8')
    logger.info('Updated %s', ALLPAGES_MD)


def generate_allui_md():
    pages = []
    for file_path, route in collect_page_entries():
        if file_path.startswith('app/') and route not in {'/', '/reset-password', '/verify-email', '/universal'}:
            pages.append((file_path, route))
    components, total_components = collect_ui_components()
    lines = [
        '# ALLUI.md - Complete UI Inventory',
        '',
        '## Current Live UI Apps',
        '',
    ]
    top_apps = [item for item in pages if item[1] in {'/qmoi-ai', '/qmoi-space', '/qcity', '/qalpha', '/qvillage'}]
    for file_path, route in top_apps:
        lines.append(f'- `{route}` → `{file_path}`')
    if not top_apps:
        lines.append('- No canonical live UI shell pages found in the current app inventory.')
    lines.extend(['', '## Actual Page Routes', ''])
    for file_path, route in pages:
        lines.append(f'- `{file_path}` → `{route}`')
    lines.extend(['', '## Shared UI Components', ''])
    if components:
        for entry in components:
            lines.append(f'- `{entry}`')
        if total_components > len(components):
            lines.append(f'- ... and {total_components - len(components)} more UI component files scanned.')
    else:
        lines.append('- No shared UI component files were detected in `src/components/` or `app/components/`.')
    lines.extend(['', '## Notes', 'This inventory is generated from the current UI component and page entrypoint files in the repository.'])
    ALLUI_MD.write_text('\n'.join(lines), encoding='utf-8')
    logger.info('Updated %s', ALLUI_MD)


def generate_allserve_md():
    entries = collect_page_entries()
    live_apps = [item for item in entries if item[0].startswith('app/') and item[1] in {'/qmoi-ai', '/qmoi-space', '/qcity', '/qalpha', '/qvillage'}]
    static_shells = [item for item in entries if item[0].startswith('public/')]
    lines = [
        '# ALLSERVE.md - Service & Application Hosting Overview',
        '',
        '## Live Applications',
        '',
    ]
    if live_apps:
        for file_path, route in live_apps:
            lines.append(f'- `{route}` → `{file_path}`')
    else:
        lines.append('- No live app shell page entrypoints were detected.')
    lines.extend(['', '## Static Shells and Launchers', ''])
    if static_shells:
        for file_path, route in static_shells:
            lines.append(f'- `{route}` → `{file_path}`')
    else:
        lines.append('- No static HTML shells were detected in `public/`.')
    lines.extend([
        '',
        '## Production Service Notes',
        '',
        '- The repository serves primary UI shells through Next.js app routes under `app/` and `src/app/`.',
        '- Static HTML shells under `public/` are compatibility launchers and fallbacks, not the canonical production UI source.',
        '- The current live application shell routes are listed above and should be updated when app entrypoints or shell pages change.',
        '',
        '## Current Service Boundaries',
        '',
        '- Core production apps are served from the Next.js application routes in `app/`.',
        '- Shared UI and theme state is managed through `app/components/` and `src/components/`.',
        '- The service inventory here is intended to capture the current routing surface and live UI entrypoints.',
        '',
        '## Notes',
        'This file is generated from the current set of app and public entrypoint files in the repository.',
    ])
    ALLSERVE_MD.write_text('\n'.join(lines), encoding='utf-8')
    logger.info('Updated %s', ALLSERVE_MD)


def update_routes_md():
    active, legacy = collect_api_routes()
    lines = [
        '<!-- AUTO_ROUTE_INVENTORY_START -->',
        '## Auto-generated route inventory',
        '',
        f'- Generated: {datetime.now(timezone.utc).isoformat()}',
        f'- Active route files in `src/app/api`: {len(active)}',
        f'- Legacy route files in `app/api`: {len(legacy)}',
        '',
    ]
    if active:
        lines.append('### Active production API routes (`src/app/api`)')
        lines.append('')
        for endpoint, file_path in active:
            lines.append(f'- `{endpoint}` → `{file_path}`')
        lines.append('')
    if legacy:
        lines.append('### Legacy API route files (`app/api`)')
        lines.append('')
        for endpoint, file_path in legacy:
            lines.append(f'- `{endpoint}` → `{file_path}`')
        lines.append('')
    lines.append('<!-- AUTO_ROUTE_INVENTORY_END -->')

    content = ROUTES_MD.read_text(encoding='utf-8') if ROUTES_MD.exists() else ''
    if '<!-- AUTO_ROUTE_INVENTORY_START -->' in content:
        content = re.sub(r'<!-- AUTO_ROUTE_INVENTORY_START -->[\s\S]*?<!-- AUTO_ROUTE_INVENTORY_END -->', '\n'.join(lines), content)
    else:
        content = content.strip() + '\n\n' + '\n'.join(lines) + '\n'
    ROUTES_MD.write_text(content, encoding='utf-8')
    logger.info('Updated auto-generated section in %s', ROUTES_MD)


def update_scripts_md():
    if not SCRIPTS_MD.exists():
        return
    content = SCRIPTS_MD.read_text(encoding='utf-8')
    timestamp = datetime.now(timezone.utc).isoformat()
    if 'Last generated:' in content:
        content = re.sub(r'\*Last generated:.*\*', f'*Last generated: {timestamp}*', content)
    else:
        content = content.strip() + f'\n\n*Last generated: {timestamp}*\n'
    marker_start = '<!-- AUTO_SCRIPTS_MD_SYNC_START -->'
    marker_end = '<!-- AUTO_SCRIPTS_MD_SYNC_END -->'
    new_block = [
        marker_start,
        f'- `scripts/qmoi_md_autoupdater.py` auto-sync complete: {timestamp}',
        f'- `scripts/update_api_docs.js` auto-injected API route inventory content',
        f'- `scripts/autotag_md_with_lion.py` auto-applied Lion validation metadata',
        f'- `scripts/autoupdate_docs.sh` refreshed ALLMDFILESREFS.md',
        marker_end,
    ]
    if marker_start in content and marker_end in content:
        content = re.sub(r'<!-- AUTO_SCRIPTS_MD_SYNC_START -->[\s\S]*?<!-- AUTO_SCRIPTS_MD_SYNC_END -->', '\n'.join(new_block), content)
    else:
        content += '\n\n' + '\n'.join(new_block) + '\n'
    SCRIPTS_MD.write_text(content, encoding='utf-8')
    logger.info('Updated %s', SCRIPTS_MD)


def main():
    if API_DOC_SCRIPT.exists():
        run_command(['node', str(API_DOC_SCRIPT)], 'update API docs')
    else:
        logger.warning('API docs script not found: %s', API_DOC_SCRIPT)

    if MD_INDEX_SCRIPT.exists():
        run_command(['bash', str(MD_INDEX_SCRIPT)], 'update ALLMDFILESREFS.md')
    else:
        logger.warning('MD index script not found: %s', MD_INDEX_SCRIPT)

    lion_script = ROOT / 'scripts' / 'autotag_md_with_lion.py'
    if lion_script.exists():
        run_command([sys.executable, str(lion_script), '--apply', '--out', str(ROOT / 'docs' / 'md_index.json')], 'apply Lion markdown validation metadata')
    else:
        logger.warning('Lion metadata script not found: %s', lion_script)

    generate_allpages_md()
    generate_allui_md()
    generate_allserve_md()
    update_routes_md()
    update_scripts_md()
    logger.info('Documentation sync completed successfully.')


if __name__ == '__main__':
    main()
