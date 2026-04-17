#!/usr/bin/env python3
"""Generate ALLHEALTHS.md from repository health-related artifacts."""

import re
from collections import defaultdict
from typing import Any
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IGNORE_DIRS = {
    '.git', '.github', 'node_modules', 'venv', '.venv', '.backups', 'backups', '.next', 'dist', 'build', '__pycache__', '.qmoi_validation'
}
TARGET_EXTENSIONS = {'.md', '.py', '.ts', '.tsx', '.js', '.json', '.sh', '.yaml', '.yml', '.txt', '.ini', '.conf'}
HEALTH_KEYWORDS = [
    'health', 'status', 'monitor', 'check', 'uptime', 'heartbeat', 'alert', 'recovery',
    'diagnostic', 'diagnostics', 'healthcheck', 'health-check', 'health endpoint', 'health status', 'system health',
    'domain health', 'device health', 'production health', 'autohealth', 'health monitor'
]

COMMAND_KEYWORDS = ['healthcheck', 'health-check', 'prod-healthcheck', 'dev-healthcheck', 'health_monitor', 'health-monitor', 'healthcheck.sh', 'health-check.sh']


def is_ignored(path: Path) -> bool:
    return any(part in IGNORE_DIRS for part in path.parts)


def scan_repo():
    found = []

    for path in ROOT.rglob('*'):
        if not path.is_file():
            continue
        if path.suffix.lower() not in TARGET_EXTENSIONS:
            continue
        if is_ignored(path):
            continue

        try:
            text = path.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue

        text_lower = text.lower()
        if not any(keyword in text_lower for keyword in HEALTH_KEYWORDS):
            continue

        matches = []
        for index, line in enumerate(text.splitlines(), start=1):
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in HEALTH_KEYWORDS):
                matches.append(f"{index}: {line.strip()}")
                if len(matches) >= 5:
                    break

        found.append({
            'path': path.relative_to(ROOT),
            'suffix': path.suffix.lower(),
            'matches': matches,
            'text': text,
        })

    return found


def categorize(path, suffix, text):
    p = str(path).lower()
    if suffix == '.md':
        return 'Documentation'
    if '/app/api/' in p or '/src/app/api/' in p or '/routes/api/' in p or '/api/' in p:
        return 'API & Endpoint Definitions'
    if '/src/components/' in p or '/components/' in p or '/src/plugins/' in p or '/hooks/' in p:
        return 'UI / Dashboard / Hooks'
    if '/tests/' in p or path.name.startswith('test_'):
        return 'Tests & Validation'
    if suffix in {'.py', '.sh', '.js'}:
        return 'Automation & Health Scripts'
    if suffix in {'.json'}:
        return 'Health Reports & Status Data'
    return 'Other Health Artifacts'


def extract_health_endpoints(found):
    endpoints = set()
    pattern = re.compile(r'/(api|health)[^\s"\)\]\']*health[^\s"\)\]\']*', re.IGNORECASE)
    for item in found:
        for line in item['matches']:
            for match in pattern.findall(line):
                endpoints.add(match)
    return sorted(endpoints)


def extract_health_commands(found):
    commands = set()
    for item in found:
        name = str(item['path'])
        if item['path'].suffix == '.sh':
            commands.add(f'bash {name}')
        elif item['path'].suffix == '.py':
            commands.add(f'python3 {name}')
        elif item['path'].suffix == '.js':
            commands.add(f'node {name}')
        elif 'health-check' in name or 'healthcheck' in name or 'prod-healthcheck' in name or 'dev-healthcheck' in name:
            commands.add(f'bash {name}')

    return sorted(commands)


def build_markdown(found):
    by_category = defaultdict(list)
    for item in found:
        by_category[categorize(item['path'], item['suffix'], item['text'])].append(item)

    health_endpoints = extract_health_endpoints(found)
    health_commands = extract_health_commands(found)
    generated_at = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')

    lines = [
        '# ALLHEALTHS.md',
        '',
        '## Summary',
        f'- Generated: {generated_at}',
        f'- Health artifacts discovered: {len(found)}',
        f'- Health documentation files: {len(by_category.get("Documentation", []))}',
        f'- Health automation scripts: {len(by_category.get("Automation & Health Scripts", []))}',
        f'- Health UI/dashboard components: {len(by_category.get("UI / Dashboard / Hooks", []))}',
        f'- Health API/endpoint definitions: {len(by_category.get("API & Endpoint Definitions", []))}',
        f'- Health test and validation files: {len(by_category.get("Tests & Validation", []))}',
        f'- Health reports and status datasets: {len(by_category.get("Health Reports & Status Data", []))}',
        '',
        '## Health Document Inventory',
        'These files contain system health, health check, health status, monitoring, or recovery information.',
        '',
    ]

    for item in sorted(by_category.get('Documentation', []), key=lambda x: str(x['path'])):
        lines.append(f'- `{item["path"]}`')
    if not by_category.get('Documentation'):
        lines.append('- _No health-related markdown files discovered._')

    lines.extend(['', '## Health Automation Scripts', ''])
    for item in sorted(by_category.get('Automation & Health Scripts', []), key=lambda x: str(x['path'])):
        lines.append(f'- `{item["path"]}`')
    if not by_category.get('Automation & Health Scripts'):
        lines.append('- _No health automation scripts discovered._')

    lines.extend(['', '## Health API & Endpoint Files', ''])
    for item in sorted(by_category.get('API & Endpoint Definitions', []), key=lambda x: str(x['path'])):
        lines.append(f'- `{item["path"]}`')
    if not by_category.get('API & Endpoint Definitions'):
        lines.append('- _No health API files discovered._')

    lines.extend(['', '## Health Dashboard / UI / Hooks', ''])
    for item in sorted(by_category.get('UI / Dashboard / Hooks', []), key=lambda x: str(x['path'])):
        lines.append(f'- `{item["path"]}`')
    if not by_category.get('UI / Dashboard / Hooks'):
        lines.append('- _No health UI or hook files discovered._')

    lines.extend(['', '## Health Test, Validation & Reporting Files', ''])
    for item in sorted(by_category.get('Tests & Validation', []), key=lambda x: str(x['path'])):
        lines.append(f'- `{item["path"]}`')
    if not by_category.get('Tests & Validation'):
        lines.append('- _No health tests discovered._')

    lines.extend(['', '## Health Reports & Status Datasets', ''])
    for item in sorted(by_category.get('Health Reports & Status Data', []), key=lambda x: str(x['path'])):
        lines.append(f'- `{item["path"]}`')
    if not by_category.get('Health Reports & Status Data'):
        lines.append('- _No health reports or status datasets discovered._')

    lines.extend(['', '## Health Commands and Check Scripts', ''])
    if health_commands:
        for cmd in health_commands:
            lines.append(f'- `{cmd}`')
    else:
        lines.append('- _No explicit health check commands discovered automatically._')

    if health_endpoints:
        lines.extend(['', '## Health Endpoints Discovered in Content', ''])
        for endpoint in health_endpoints:
            lines.append(f'- `{endpoint}`')

    lines.extend(['', '## Health System and 100% Health Plan', ''])
    lines.extend([
        '- Maintain a single authoritative health inventory in `ALLHEALTHS.md`.',
        '- Use automated scripts to verify health, then perform self-healing or escalation.',
        '- Enforce `100%` health targets with multi-layer checks: deployment, API, service, host, domain, UX, and data health.',
        '- Include `Q Lion` agent validation by sending health queries, tracking health trends, and using recovery actions.',
        '- Track health state with heartbeat, error rates, uptime, service availability, and confidence metrics.',
        '- Ensure all `.md` files related to health are scanned and included during every update cycle.',
        '- Use `scripts/ensure_all_healths.py` to coordinate health scans and document regeneration.',
    ])

    lines.extend(['', '## Refresh and Automation', ''])
    lines.extend([
        '- Run `python3 scripts/generate_allhealths.py` to refresh this file.',
        '- Run `python3 scripts/ensure_all_healths.py` to execute health checks and enforce health automation.',
        '- This file is part of the QMOI auto-update pipeline and should be regenerated after any health system change.',
    ])

    lines.extend(['', '#
    for item in sorted(found, key=lambda x: str(x['path']))[:20]:
        lines.append(f'### `{item["path"]}`')
        for snippet in item['matches']:
            lines.append(f'- `{snippet}`')
        lines.append('')

    return '\n'.join(lines).strip() + '\n'


def main():
    found = scan_repo()
    content = build_markdown(found)
    output_path = ROOT / 'ALLHEALTHS.md'
    output_path.write_text(content, encoding='utf-8')
    print(f'ALLHEALTHS.md generated with {len(found)} health artifacts.')


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    main()
