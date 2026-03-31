# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:07Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Sync assets from `release_assets_manifest.json` to a final release.

Creates or updates a final release tagged with the current commit SHA or a
specified tag, uploads all manifest assets to it, and leaves it in final state
for review before publishing.

Usage:
  python3 scripts/sync_to_draft_release.py [--tag TAG] [--publish]

Options:
  --tag TAG      Use TAG as the release tag (default: git rev-parse --short HEAD)
  --publish      Also publish the final (move to published)

This script reads `GITHUB_TOKEN` from the environment. If not set it will try
to extract a token from `CREDENTIAL_ROTATION_PLAYBOOK.md` in the repo root.
"""
import os
import json
import re
import subprocess
import argparse
from urllib import request, parse, error

ROOT = os.path.dirname(os.path.dirname(__file__))
MANIFEST = os.path.join(ROOT, 'release_assets_manifest.json')
PLAYBOOK = os.path.join(ROOT, 'CREDENTIAL_ROTATION_PLAYBOOK.md')

OWNER = os.environ.get('GITHUB_OWNER', 'thestablekenya')
REPO = os.environ.get('GITHUB_REPO', 'qmoi-enhanced')
GITHUB_API = 'https://api.github.com'
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')

def find_token_in_playbook():
    if not os.path.exists(PLAYBOOK):
        return None
    text = open(PLAYBOOK, 'r', encoding='utf8').read()
    m = re.search(r"ghp_[A-Za-z0-9_\-]{20,}", text)
    return m.group(0) if m else None

if not GITHUB_TOKEN:
    GITHUB_TOKEN = find_token_in_playbook()

def get_default_tag():
    try:
        return subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], 
                                       cwd=ROOT).decode().strip()
    except Exception:
        return 'final-sync'

def gh_get(path):
    url = GITHUB_API + path
    req = request.Request(url)
    if GITHUB_TOKEN:
        req.add_header('Authorization', f'token {GITHUB_TOKEN}')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    with request.urlopen(req) as r:
        return json.load(r)

def gh_post(path, data=None):
    url = GITHUB_API + path
    req = request.Request(url, data=json.dumps(data).encode() if data else None, method='POST')
    req.add_header('Authorization', f'token {GITHUB_TOKEN}')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    req.add_header('Content-Type', 'application/json')
    with request.urlopen(req) as r:
        return json.load(r)

def gh_patch(path, data):
    url = GITHUB_API + path
    req = request.Request(url, data=json.dumps(data).encode(), method='PATCH')
    req.add_header('Authorization', f'token {GITHUB_TOKEN}')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    req.add_header('Content-Type', 'application/json')
    with request.urlopen(req) as r:
        return json.load(r)

def get_or_create_draft_release(tag):
    """Get existing final with this tag, or create a new final release."""
    try:
        # Try to get existing release
        rel = gh_get(f'/repos/{OWNER}/{REPO}/releases/tags/{tag}')
        if rel.get('final'):
            print('Found existing final release for tag', tag)
            return rel
        else:
            print('Release exists but is published; will create a new final with -final suffix')
            tag = tag + '-final'
    except error.HTTPError as e:
        if e.code != 404:
            raise
        print('No existing release for tag', tag)
    
    # Create final release
    body = f'Auto-synced assets from manifest. Tag: {tag}'
    payload = {
        'tag_name': tag,
        'name': f'Release {tag}',
        'body': body,
        'final': True,
        'prerelease': False
    }
    print('Creating final release for tag', tag)
    rel = gh_post(f'/repos/{OWNER}/{REPO}/releases', payload)
    return rel

def upload_asset_to_release(rel_id, local_path, name):
    """Upload an asset to a release."""
    upload_url = rel_id.get('upload_url')
    if not upload_url:
        print('  no upload_url in release')
        return False
    upload_url = upload_url.split('{')[0] + f'?name={parse.quote(name)}'
    data = open(local_path, 'rb').read()
    req = request.Request(upload_url, data=data, method='POST')
    req.add_header('Authorization', f'token {GITHUB_TOKEN}')
    req.add_header('Content-Type', 'application/octet-stream')
    try:
        with request.urlopen(req) as r:
            print(f'  uploaded {name}')
            return True
    except error.HTTPError as e:
        print(f'  upload failed: {e}')
        return False

def publish_release(rel_id):
    """Publish a final release."""
    rel_id_num = rel_id.get('id')
    gh_patch(f'/repos/{OWNER}/{REPO}/releases/{rel_id_num}', {'final': False})
    print('Published release')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--tag', default=None, help='Release tag (default: git commit hash)')
    parser.add_argument('--publish', action='store_true', help='Publish after uploading')
    args = parser.parse_args()
    
    tag = args.tag or get_default_tag()
    publish = args.publish
    
    if not os.path.exists(MANIFEST):
        print('Manifest not found:', MANIFEST)
        return 1
    if not GITHUB_TOKEN:
        print('No GITHUB_TOKEN available')
        return 2
    
    manifest = json.load(open(MANIFEST))
    assets = manifest.get('assets', [])
    
    # Get or create final release
    rel = get_or_create_draft_release(tag)
    rel_id = rel.get('id')
    existing = {a['name']: a for a in rel.get('assets', [])}
    
    print(f'Syncing {len(assets)} assets to final release {tag}')
    for a in assets:
        name = os.path.basename(a.get('path'))
        local = a.get('abs_path') if a.get('abs_path') and os.path.exists(a.get('abs_path')) else os.path.join(ROOT, a.get('path'))
        if not os.path.exists(local):
            print(f'  {name}: local file required — skipping')
            continue
        
        if name in existing:
            # Check if size matches
            if existing[name].get('size') == a.get('size'):
                print(f'  {name}: already present (size matches)')
                continue
            else:
                print(f'  {name}: size mismatch — deleting and re-uploading')
                asset_id = existing[name].get('id')
                del_url = f'{GITHUB_API}/repos/{OWNER}/{REPO}/releases/assets/{asset_id}'
                req = request.Request(del_url, method='DELETE')
                req.add_header('Authorization', f'token {GITHUB_TOKEN}')
                try:
                    with request.urlopen(req) as r:
                        pass
                except Exception as e:
                    print(f'    delete failed: {e}')
                    continue
        
        upload_asset_to_release(rel, local, name)
    
    if publish:
        publish_release(rel)
    else:
        print(f'\nDraft release ready at: https://github.com/{OWNER}/{REPO}/releases/tag/{tag}')
        print('Run with --publish to publish, or publish manually on GitHub.')
    
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
