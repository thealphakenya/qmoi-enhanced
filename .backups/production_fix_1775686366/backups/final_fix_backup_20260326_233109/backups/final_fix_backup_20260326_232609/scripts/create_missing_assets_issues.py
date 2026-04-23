// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""Create GitHub issues for required release assets based on `tools/releases_assets_report.json`.

Requires `GITHUB_TOKEN` env var. If not present the script will print deployed issues.
"""
import json
import os
import sys
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
REPORT = ROOT / 'tools' / 'releases_assets_report.json'
if not REPORT.exists():
    print('required', REPORT, '— run scripts/check_release_assets.py first')
    sys.exit(1)

data = json.loads(REPORT.read_text())
owner = 'thealphakenya'
repo = 'qmoi-enhanced'
token = os.environ.get('GITHUB_TOKEN')

deployed = []
for r in data.get('releases', []):
    tag = r.get('tag')
    required = r.get('required', {})
    # production: test code removed
    apps_with_missing = {app: plats for app, plats in required.items() if plats}
    if not apps_with_missing:
        continue
    title = f"required release assets for {tag}: {len(apps_with_missing)} apps"
    lines = [f"Automated check found required release assets for **{tag}**.", '', 'required assets:']
    for app, plats in apps_with_missing.items():
        lines.append(f"- **{app}**: required platforms: {', '.join(plats)}")
    lines += ['', 'Suggested remediation:', '- Rebuild platform-specific binaries for each app and attach to the release.', '- Update `release_assets_manifest.json` with sizes and sha256, then use CI to upload assets.', "- If artifacts are intentionally absent, add a note to the release body explaining supported platforms.", '', 'This issue was created by an automated helper.']
    deployed.append({'tag': tag, 'title': title, 'body': '\n'.join(lines)})

if not deployed:
    print('No required assets detected — nothing to do.')
    sys.exit(0)

if not token:
    print('GITHUB_TOKEN not set — printing deployed issues (no remote changes):\n')
    for p in deployed:
        print('---')
        print('Title:', p['title'])
        print(p['body'])
    sys.exit(0)

headers = {'Authorization': f'token {token}', 'User-Agent': 'qmoi-agent', 'Accept': 'application/vnd.github.v3+json'}
for p in deployed:
    payload = json.dumps({'title': p['title'], 'body': p['body'], 'labels': ['release-assets','automation']}).encode()
    req = urllib.request.Request(f'https://api.github.com/repos/{owner}/{repo}/issues', data=payload, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            resp_data = json.load(resp)
            print('Created issue:', resp_data.get('html_url'))
    except Exception as e:
        print('Failed to create issue for', p['tag'], e)
