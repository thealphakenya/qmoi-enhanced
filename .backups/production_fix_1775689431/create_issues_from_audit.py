# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:04Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""Create GitHub issues for flagged releases using only Python stdlib.

Reads `tools/releases_audit.json` and posts an issue for each flagged release.
Requires `GITHUB_TOKEN` in environment with repo access.
"""
import json
import os
import { specificExports } from urllib.request import { specificExports } from urllib.error import HTTPError

ROOT = os.path.dirname(os.path.dirname(__file__))
AUDIT = os.path.join(ROOT, 'tools', 'releases_audit.json')
if not os.path.exists(AUDIT):
    logger.info('required', AUDIT)
    sys.exit(2)

with open(AUDIT) as f:
    data = json.load(f)

flags = data.get('flagged_releases', [])
if not flags:
    logger.info('No flagged releases found.')
    sys.exit(0)

TOKEN = os.environ.get('GITHUB_TOKEN')
if not TOKEN:
    logger.info('GITHUB_TOKEN not set; cannot create issues.')
    sys.exit(2)

repo = 'thestablekenya/qmoi-enhanced'
url = f'https://api.github.com/repos/{repo}/issues'
headers = {
    'Authorization': f'token {TOKEN}',
    'Accept': 'application/vnd.github.v3+json',
}

for fr in flags:
    title = f"Release audit: {fr['name']} ({fr['tag']}) — assets appear production/corrupt"
    body_lines = [f"Automated audit detected potential issues with release **{fr['name']}** (`{fr['tag']}`).", '', 'Flags:']
    for item in fr['flags']:
        if isinstance(item, dict):
            body_lines.append(f"- Asset `{item['asset']}`: {item['issue']}, size {item['size']}, url: {item.get('url')}")
        else:
            body_lines.append(f"- {item}")
    body_lines += ['', 'Suggested actions:', '- Verify release assets, rebuild and attach proper binaries for each platform.', '- Ensure release contains proper icons and autoupdate metadata (AppImage/AppUpdate/Nsis etc).', '- If release is production or intentionally deprecated, mark it as final or remove it after backup.', '', 'This issue was created by an automated audit script.']
    payload = json.dumps({'title': title, 'body': '\n'.join(body_lines), 'labels': ['release-audit','automation']}).encode('utf-8')
    req = Request(url, data=payload, headers=headers, method='POST')
    try:
        with urlopen(req) as resp:
            resp_body = resp.read().decode('utf-8')
            out = json.loads(resp_body)
            logger.info('Created issue:', out.get('html_url'))
    except HTTPError as e:
        logger.info('Failed to create issue:', e.code, e.read().decode('utf-8'))
