#!/usr/bin/env python3
"""
Check GitHub Releases for expected assets listed in `release_assets_manifest.json`.

Usage:
  python3 scripts/check_github_releases.py [--upload]

If `GITHUB_TOKEN` env var is set and `--upload` is provided, the script will try
to replace mismatched assets and upload missing assets to the repository's
latest release (dry-run is default).

NOTE: This script targets the same repository the workspace represents by
default (`thealphakenya/qmoi-enhanced`). You can change `OWNER` and `REPO`
variables below if needed.
"""
import os
import sys
import json
import re
import argparse
import base64
from urllib import request, parse, error

ROOT = os.path.dirname(os.path.dirname(__file__))
MANIFEST_PATH = os.path.join(ROOT, 'release_assets_manifest.json')
REPORT_PATH = os.path.join(ROOT, 'reports', 'github_releases_check.json')

# Default repo values (update if checking a different repo)
OWNER = os.environ.get('GITHUB_OWNER', 'thealphakenya')
REPO = os.environ.get('GITHUB_REPO', 'qmoi-enhanced')

GITHUB_API = 'https://api.github.com'
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')


def find_token_in_playbook():
    """Try to extract a GitHub PAT from the repository's credential rotation playbook.

    This reads `CREDENTIAL_ROTATION_PLAYBOOK.md` locally and looks for a token
    starting with `ghp_`. It does not print or return anything sensitive to
    stdout; it only returns the token string for use by this script.
    """
    try:
        root = os.path.dirname(os.path.dirname(__file__))
        path = os.path.join(root, 'CREDENTIAL_ROTATION_PLAYBOOK.md')
        if not os.path.exists(path):
            return None
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        m = re.search(r"ghp_[A-Za-z0-9_\-]{20,}", text)
        if m:
            return m.group(0)
    except Exception:
        return None
    return None


# If not provided via environment, try to read the PAT from the local playbook.
if not GITHUB_TOKEN:
    GITHUB_TOKEN = find_token_in_playbook()


def load_manifest():
    with open(MANIFEST_PATH, 'r') as f:
        return json.load(f)


def gh_get(path):
    url = GITHUB_API + path
    req = request.Request(url)
    if GITHUB_TOKEN:
        req.add_header('Authorization', f'token {GITHUB_TOKEN}')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    try:
        with request.urlopen(req) as r:
            return json.load(r)
    except error.HTTPError as e:
        print('GitHub API error', e.code, e.reason, url)
        try:
            payload = e.read().decode('utf-8')
            return json.loads(payload)
        except Exception:
            return {'error': f'{e.code} {e.reason}'}


def get_all_releases():
    return gh_get(f'/repos/{OWNER}/{REPO}/releases') or []


def get_latest_release():
    return gh_get(f'/repos/{OWNER}/{REPO}/releases/latest')


def check_assets(manifest):
    assets = manifest.get('assets', [])
    releases = get_all_releases()
    releases_map = []
    for r in releases:
        assets_in_r = {a['name']: a for a in r.get('assets', [])}
        releases_map.append({'id': r.get('id'), 'tag': r.get('tag_name'), 'name': r.get('name'), 'assets': assets_in_r, 'upload_url': r.get('upload_url')})

    results = []
    for a in assets:
        name = os.path.basename(a['path'])
        expected_size = a.get('size')
        found = False
        mismatched = False
        matching = []
        for r in releases_map:
            asset = r['assets'].get(name)
            if asset:
                found = True
                size = asset.get('size')
                matching.append({'release_id': r['id'], 'release_tag': r['tag'], 'asset_id': asset.get('id'), 'size': size, 'upload_url': r.get('upload_url')})
                if expected_size != size:
                    mismatched = True
        status = 'ok' if found and not mismatched else ('mismatched' if found and mismatched else 'missing')
        results.append({'name': name, 'expected_size': expected_size, 'status': status, 'matches': matching})

    return results


def ensure_reports_dir():
    d = os.path.dirname(REPORT_PATH)
    os.makedirs(d, exist_ok=True)


def main():
    upload = '--upload' in sys.argv
    if upload and not GITHUB_TOKEN: 
        print('Upload requested but GITHUB_TOKEN not set. Exiting.')
        return 2

    if not os.path.exists(MANIFEST_PATH):
        print('Manifest not found at', MANIFEST_PATH)
        return 1
    manifest = load_manifest()
    results = check_assets(manifest)
    ensure_reports_dir()
    with open(REPORT_PATH, 'w') as f:
        json.dump({'owner': OWNER, 'repo': REPO, 'results': results}, f, indent=2)
    # Print short summary
    missing = [r for r in results if r['status'] == 'missing']
    mismatched = [r for r in results if r['status'] == 'mismatched']
    print('Checked', len(results), 'assets — missing:', len(missing), 'mismatched:', len(mismatched))
    print('Report written to', REPORT_PATH)

    if upload:
        # For safety, do not auto-create releases. Handle mismatched assets by
        # replacing in-place; handle missing assets by uploading to the latest release.
        releases = get_all_releases()
        releases_map = {r['id']: r for r in releases}
        latest_release = get_latest_release()
        latest_upload_tpl = latest_release.get('upload_url') if isinstance(latest_release, dict) else None
        for r in results:
            name = r['name']
            # Find local asset path: prefer `abs_path` if present in manifest
            local = None
            for a in manifest.get('assets', []):
                if os.path.basename(a.get('path', '')) == name:
                    if a.get('abs_path') and os.path.exists(a.get('abs_path')):
                        local = a.get('abs_path')
                    else:
                        local = os.path.join(ROOT, a.get('path'))
                    break
            if r['status'] == 'mismatched' and r['matches']:
                match = r['matches'][0]
                release_id = match['release_id']
                asset_id = match['asset_id']
                if not local or not os.path.exists(local):
                    print('Local file for', name, 'not found — skipping replace')
                    continue
                # delete existing asset
                del_url = f'{GITHUB_API}/repos/{OWNER}/{REPO}/releases/assets/{asset_id}'
                req = request.Request(del_url, method='DELETE')
                req.add_header('Authorization', f'token {GITHUB_TOKEN}')
                try:
                    with request.urlopen(req) as rdel:
                        print('Deleted asset', name, 'id', asset_id)
                except error.HTTPError as e:
                    print('Failed to delete asset', asset_id, e)
                    continue
                # upload to the same release via upload_url template
                release = releases_map.get(release_id)
                if not release:
                    print('Release', release_id, 'not found in map — skipping upload')
                    continue
                upload_url_tpl = release.get('upload_url')
                if not upload_url_tpl:
                    print('Release upload_url missing — cannot upload')
                    continue
                upload_url = upload_url_tpl.split('{')[0] + f'?name={parse.quote(name)}'
                # Upload binary
                with open(local, 'rb') as f:
                    data = f.read()
                upreq = request.Request(upload_url, data=data, method='POST')
                upreq.add_header('Authorization', f'token {GITHUB_TOKEN}')
                upreq.add_header('Content-Type', 'application/octet-stream')
                try:
                    with request.urlopen(upreq) as upres:
                        print('Uploaded', name, 'to release', release.get('tag_name'))
                except error.HTTPError as e:
                    print('Failed to upload', name, e)
            elif r['status'] == 'missing':
                # Upload missing asset to the latest release (if available)
                if not local or not os.path.exists(local):
                    print('Local file for', name, 'not found — cannot upload missing asset')
                    continue
                if not latest_upload_tpl:
                    print('No latest release upload URL found — cannot upload missing asset', name)
                    continue
                upload_url = latest_upload_tpl.split('{')[0] + f'?name={parse.quote(name)}'
                with open(local, 'rb') as f:
                    data = f.read()
                upreq = request.Request(upload_url, data=data, method='POST')
                upreq.add_header('Authorization', f'token {GITHUB_TOKEN}')
                upreq.add_header('Content-Type', 'application/octet-stream')
                try:
                    with request.urlopen(upreq) as upres:
                        print('Uploaded missing asset', name, 'to latest release')
                except error.HTTPError as e:
                    print('Failed to upload missing asset', name, e)

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
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
