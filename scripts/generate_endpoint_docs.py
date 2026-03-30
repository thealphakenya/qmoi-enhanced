#!/usr/bin/env python3
"""Generate endpoint docs for all route.ts API files"""

import os
from pathlib import Path

ROOT = Path.cwd()
API_DIRS = [ROOT / 'app' / 'api', ROOT / 'src' / 'app' / 'api']


def collect_endpoints():
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


def write_endpoints(entries):
    end_file = ROOT / 'ENDPOINTS.md'
    header = '# API Endpoints\n\n'
    body = '\n'.join(f'- {endpoint} -> {path}' for endpoint, path in entries)

    if end_file.exists():
        text = end_file.read_text(encoding='utf-8')
        start = text.find('<!-- ENDPOINTS_AUTOGEN_START -->')
        end = text.find('<!-- ENDPOINTS_AUTOGEN_END -->')
        if start != -1 and end != -1 and end > start:
            before = text[:start + len('<!-- ENDPOINTS_AUTOGEN_START -->')]
            after = text[end:]
            text = before + '\n\n' + body + '\n\n' + after
        else:
            text = header + '\n'.join([f'- {endpoint} -> {path}' for endpoint, path in entries])
        end_file.write_text(text, encoding='utf-8')
    else:
        end_file.write_text(header + body, encoding='utf-8')


def update_api_docs(entries):
    for doc in ['API.md', 'APIs_v1.md', 'APIs_1.md']:
        doc_path = ROOT / doc
        if not doc_path.exists():
            continue
        content = doc_path.read_text(encoding='utf-8')
        marker = '## AUTO-GENERATED ENDPOINTS'
        summary = '\n## AUTO-GENERATED ENDPOINTS\n\n' + '\n'.join([f'- {endpoint}' for endpoint, _ in entries]) + '\n'
        if marker in content:
            start = content.find(marker)
            end = content.find('## ', start + len(marker))
            if end == -1:
                content = content[:start] + summary
            else:
                content = content[:start] + summary + content[end:]
        else:
            content += '\n' + summary
        doc_path.write_text(content, encoding='utf-8')


if __name__ == '__main__':
    entries = collect_endpoints()
    write_endpoints(entries)
    update_api_docs(entries)
    print(f'Generated {len(entries)} endpoints and updated ENDPOINTS.md/API.md/APIs_v1.md/APIs_1.md')
