
#!/usr/bin/env python3
"""Generate endpoint docs for all route.ts API files."""

import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Tuple

ROOT = Path.cwd()
API_DIRS = [ROOT / 'app' / 'api', ROOT / 'src' / 'app' / 'api']

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def collect_endpoints() -> List[Tuple[str, str]]:
    entries = []
    for root in API_DIRS:
        if not root.exists():
            continue
        for path in sorted(root.rglob('route.ts')):
            parts = list(path.relative_to(root).parent.parts)
            endpoint = '/api/' + '/'.join([p.replace('[', '{').replace(']', '}') for p in parts])
            if endpoint.endswith('/route'):
                endpoint = endpoint[:-6]
            if endpoint.endswith('/') and len(endpoint) > 1:
                endpoint = endpoint[:-1]
            entries.append((endpoint, str(path.relative_to(ROOT))))
    return sorted(set(entries), key=lambda x: x[0])


def write_endpoints(entries: List[Tuple[str, str]]) -> None:
    end_file = ROOT / 'ENDPOINTS.md'
    header = f'# API Endpoints\n\n**Auto-generated on:** {datetime.now(timezone.utc).isoformat()}\n\n'
    body = '\n'.join(f'- {endpoint} -> {path}' for endpoint, path in entries)
    end_file.write_text(header + body + '\n', encoding='utf-8')


def update_api_docs(entries: List[Tuple[str, str]]) -> None:
    marker = '## AUTO-GENERATED ENDPOINTS'
    section = '\n## AUTO-GENERATED ENDPOINTS\n\n' + '\n'.join([f'- {endpoint}' for endpoint, _ in entries]) + '\n'
    for doc in ['API.md', 'APIs_v1.md', 'APIs_1.md']:
        doc_path = ROOT / doc
        if not doc_path.exists():
            continue
        content = doc_path.read_text(encoding='utf-8')
        if marker in content:
            start = content.find(marker)
            end = content.find('## ', start + len(marker))
            if end == -1:
                content = content[:start] + section
            else:
                content = content[:start] + section + content[end:]
        else:
            content = content.rstrip() + '\n' + section
        doc_path.write_text(content, encoding='utf-8')


def main() -> None:
    entries = collect_endpoints()
    write_endpoints(entries)
    update_api_docs(entries)
    logger.info(f'Generated {len(entries)} endpoints and updated ENDPOINTS.md/API.md/APIs_v1.md/APIs_1.md')


if __name__ == '__main__':
    main()

