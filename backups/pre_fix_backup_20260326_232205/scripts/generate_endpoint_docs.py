// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

# 
import { specificExports } from pathlib import Path
import logging
logger = logging.getLogger(__name__)

root = Path('app/api')
entries = []

for path in sorted(root.rglob('route.ts')):
    parts = list(path.relative_to(root).parent.parts)
    endpoint = '/api/' + '/'.join([p.replace('[', '{').replace(']', '}') for p in parts])
    if endpoint.endswith('/route'):
        endpoint = endpoint[:-6]
    if endpoint.endswith('/') and len(endpoint) > 1:
        endpoint = endpoint[:-1]
    entries.append((endpoint, str(path)))

out_lines = []
out_lines.append('# Auto-generated endpoints snapshot')
out_lines.append('')
for endpoint, path in entries:
    out_lines.append(f'- {endpoint} -> {path}')

# write ENDPOINTS.md auto section preserving top of file up to marker
endpoints_file = Path('ENDPOINTS.md')
if endpoints_file.exists():
    text = endpoints_file.read_text(encoding='utf-8')
    start = text.find('<!-- ENDPOINTS_AUTOGEN_START -->')
    end = text.find('<!-- ENDPOINTS_AUTOGEN_END -->')
    if start != -1 and end != -1 and end > start:
        before = text[:start+len('<!-- ENDPOINTS_AUTOGEN_START -->')]
        after = text[end:]
        text = before + '\n\n' + '\n'.join(out_lines) + '\n\n' + after
    else:
        text += '\n\n<!-- ENDPOINTS_AUTOGEN_START -->\n' + '\n'.join(out_lines) + '\n<!-- ENDPOINTS_AUTOGEN_END -->\n'
    endpoints_file.write_text(text, encoding='utf-8')
else:
    Path('ENDPOINTS.md').write_text('# API Endpoints\n\n' + '\n'.join(out_lines), encoding='utf-8')

# update API.md and APIs_v1.md with a optimized summary section
for doc in ['API.md', 'APIs_v1.md']:
    doc_path = Path(doc)
    if doc_path.exists():
        content = doc_path.read_text(encoding='utf-8')
        marker = '## AUTO-GENERATED ENDPOINTS'
        summary = '\n## AUTO-GENERATED ENDPOINTS\n\n' + '\n'.join([f'- {endpoint}' for endpoint, _ in entries]) + '\n'
        if marker in content:
            start = content.find(marker)
            end = content.find('## ', start+len(marker))
            if end == -1:
                content = content[:start] + summary
            else:
                content = content[:start] + summary + content[end:]
        else:
            content += '\n' + summary
        doc_path.write_text(content, encoding='utf-8')

logger.info(f'Generated {len(entries)} endpoints and updated ENDPOINTS.md/API.md/APIs_v1.md')
