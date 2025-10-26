#!/usr/bin/env python3
"""Check GitHub Releases for expected artifacts listed in the build report.

This script queries the GitHub Releases API and verifies that each platform
artifact declared in `qcity-artifacts/qmoi_build_report.json` is present as a
release asset for a matching tag/version.

Usage:
  GITHUB_TOKEN=<token> python3 scripts/check_github_releases.py --repo thealphakenya/qmoi-enhanced --out docs/github_release_report.json

Notes:
- This script requires a GitHub token with `repo` scope to access release assets for private repos.
- If no token is provided the script will skip and write a note in the report.
"""
import argparse
import json
import os
import sys
from pathlib import Path

try:
    import requests
except Exception:
    requests = None

ROOT = Path(__file__).resolve().parents[1]

def load_build_report(root: Path):
    candidates = [root / 'qcity-artifacts' / 'qmoi_build_report.json', root / 'qmoi-enhanced' / 'qcity-artifacts' / 'qmoi_build_report.json']
    for p in candidates:
        if p.exists():
            return json.loads(p.read_text(encoding='utf8'))
    return None

def check_releases(repo: str, token: str, build_report: dict):
    headers = {'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}
    base = 'https://api.github.com'
    out = {'repo': repo, 'checked_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'releases': []}
    # list releases
    r = requests.get(f'{base}/repos/{repo}/releases', headers=headers)
    if r.status_code != 200:
        out['error'] = f'failed to list releases: {r.status_code} {r.text[:200]}'
        return out
    releases = r.json()
    # flatten expected artifacts
    expected = {}
    for name, v in (build_report.get('platforms') or {}).items():
        art = v.get('artifact')
        if art:
            expected.setdefault(art.split('/')[-1], []).append(name)

    for rel in releases:
        rel_entry = {'tag_name': rel.get('tag_name'), 'name': rel.get('name'), 'assets': []}
        assets = rel.get('assets', [])
        for a in assets:
            asset_name = a.get('name')
            found_platforms = expected.get(asset_name, [])
            rel_entry['assets'].append({'name': asset_name, 'platforms': found_platforms, 'size': a.get('size')})
        out['releases'].append(rel_entry)

    # mark expected that are missing across all releases
    present = set()
    for rel in out['releases']:
        for a in rel['assets']:
            present.add(a['name'])
    missing = [k for k in expected.keys() if k not in present]
    out['missing_expected_assets'] = missing
    return out

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--repo', required=True, help='owner/repo for GitHub API')
    p.add_argument('--out', default=str(ROOT / 'docs' / 'github_release_report.json'))
    args = p.parse_args()

    build_report = load_build_report(ROOT)
    report = {'note': 'skipped - requests not installed or no token provided'}
    token = os.environ.get('GITHUB_TOKEN')
    if requests is None:
        report = {'error': 'requests library not installed; please pip install requests'}
    elif not token:
        report = {'error': 'GITHUB_TOKEN not found in environment; cannot query releases securely.'}
    else:
        report = check_releases(args.repo, token, build_report or {})

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf8')
    print('Wrote', out_path)

if __name__ == '__main__':
    main()
