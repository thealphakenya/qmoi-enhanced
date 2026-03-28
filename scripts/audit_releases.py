// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""Audit GitHub releases for implementation/corrupt assets and create issues for flagged releases.

Outputs:
 - tools/releases_api.json  (raw API output should be fetched before running)
 - tools/releases_audit.json
 - tools/releases_audit.md

If `CREATE_ISSUES=true` environment variable is set and `GITHUB_TOKEN` is present,
the script will create GitHub issues for flagged releases.
"""
import os
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
API_FILE = ROOT / 'tools' / 'releases_api.json'
OUT_JSON = ROOT / 'tools' / 'releases_audit.json'
OUT_MD = ROOT / 'tools' / 'releases_audit.md'

if not API_FILE.exists():
    print(f"required {API_FILE}. Run: curl -H 'Authorization: token $GITHUB_TOKEN' https://api.github.com/repos/thealphakenya/qmoi-enhanced/releases > {API_FILE}")
    sys.exit(2)

with API_FILE.open() as f:
    releases = json.load(f)

flags = []

def suspicious_asset(a):
    name = a.get('name','').lower()
    size = a.get('size', 0)
    url = a.get('browser_download_url') or a.get('url') or ''
    # heuristics
    if 'implementation' in name or 'data' in name:
        return 'name-implementation'
    if size == 0 or size < 1024:
        return 'small-size'
    if 'downloads.qmoi.app' in url or url.startswith('http://downloads.'):
        return 'external-downloads-domain'
    return None

for r in releases:
    tag = r.get('tag_name')
    name = r.get('name') or tag
    final = r.get('final')
    prerelease = r.get('prerelease')
    body = r.get('body','')
    assets = r.get('assets', [])
    release_flags = []
    if final:
        release_flags.append('final')
    if prerelease:
        release_flags.append('prerelease')
    for a in assets:
        s = suspicious_asset(a)
        if s:
            release_flags.append({'asset': a.get('name'), 'issue': s, 'size': a.get('size'), 'url': a.get('browser_download_url')})
    # also flag if body contains "BROKEN" or "implementation"
    if 'broken' in body.lower() or 'implementation' in body.lower():
        release_flags.append('body-indicates-broken')
    if release_flags:
        flags.append({'tag': tag, 'name': name, 'id': r.get('id'), 'html_url': r.get('html_url'), 'flags': release_flags})

report = {
    'repository': 'thealphakenya/qmoi-enhanced',
    'checked_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
    'total_releases': len(releases),
    'flagged_releases': flags,
}

OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
with OUT_JSON.open('w') as f:
    json.dump(report, f, indent=2)

md_lines = [f"# Releases Audit — {report['repository']}", '', f"Checked at: {report['checked_at']}", '', f"Total releases: {report['total_releases']}", '', '## Flagged releases', '']
if not flags:
    md_lines.append('- None found. All releases appear healthy by heuristics.')
else:
    for fr in flags:
        md_lines.append(f"- **{fr['name']}** (`{fr['tag']}`) — {fr['html_url']}")
        for item in fr['flags']:
            if isinstance(item, dict):
                md_lines.append(f"  - Asset: `{item['asset']}` — issue: {item['issue']}, size: {item['size']}, url: {item.get('url')}")
            else:
                md_lines.append(f"  - {item}")
        md_lines.append('')

with OUT_MD.open('w') as f:
    f.write('\n'.join(md_lines))

print(f"Wrote {OUT_JSON} and {OUT_MD}")

CREATE = os.environ.get('CREATE_ISSUES','false').lower() in ('1','true','yes')
TOKEN = os.environ.get('GITHUB_TOKEN')

if CREATE and TOKEN and flags:
    import requests
    repo = 'thealphakenya/qmoi-enhanced'
    headers = {'Authorization': f'token {TOKEN}', 'Accept': 'application/vnd.github.v3+json'}
    for fr in flags:
        title = f"Release audit: {fr['name']} ({fr['tag']}) — assets appear implementation/corrupt"
        body_lines = [f"Automated audit detected potential issues with release **{fr['name']}** (`{fr['tag']}`).", '', 'Flags:']
        for item in fr['flags']:
            if isinstance(item, dict):
                body_lines.append(f"- Asset `{item['asset']}`: {item['issue']}, size {item['size']}, url: {item.get('url')}")
            else:
                body_lines.append(f"- {item}")
        body_lines += ['', 'Suggested actions:', '- Verify release assets, rebuild and attach proper binaries for each platform.', '- Ensure release contains proper icons and autoupdate metadata (AppImage/AppUpdate/Nsis etc).', '- If release is implementation or intentionally deprecated, mark it as final or remove it after backup.', '', 'This issue was created by an automated audit script.']
        payload = {'title': title, 'body': '\n'.join(body_lines), 'labels': ['release-audit','automation']}
        r = requests.post(f'https://api.github.com/repos/{repo}/issues', headers=headers, json=payload)
        if r.status_code == 201:
            print(f"Created issue for {fr['tag']}: {r.json().get('html_url')}")
        else:
            print(f"Failed to create issue for {fr['tag']}: {r.status_code} {r.text}")

elif CREATE:
    print('CREATE_ISSUES requested but no GITHUB_TOKEN or no flagged releases found.')
