#!/usr/bin/env python3
"""Release helper: upload files to a GitHub Release or fallback to `gh` CLI.

This script attempts to upload one or more artifact files to a GitHub Release tag.
It supports using `GITHUB_TOKEN` or `GH_TOKEN` environment variable. If not present,
it will try to call the `gh` CLI (must be authenticated).

Usage:
  python3 tools/release_helper.py --tag v1.2.3 artifact1.zip artifact2.dmg

Note: prefer to store release artifacts in Releases (not in git history).
"""

import argparse
import os
import sys
import json
import requests


def upload_with_api(owner, repo, tag, token, files):
    # Find release id by tag
    headers = {'Authorization': f'token {token}'}
    r = requests.get(f'https://api.github.com/repos/{owner}/{repo}/releases/tags/{tag}', headers=headers, timeout=20)
    if r.status_code == 404:
        print('Release not found for tag', tag)
        return 2
    r.raise_for_status()
    rel = r.json()
    upload_url = rel['upload_url'].split('{')[0]
    for f in files:
        name = os.path.basename(f)
        with open(f, 'rb') as fh:
            params = {'name': name}
            print('Uploading', name)
            rr = requests.post(upload_url, headers={'Authorization': f'token {token}'}, params=params, data=fh)
            if rr.status_code not in (200,201):
                print('Upload failed for', name, rr.status_code, rr.text)
                return 3
    return 0


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--repo', default=None, help='owner/repo, default from git remote origin')
    p.add_argument('--tag', required=True)
    p.add_argument('files', nargs='+')
    args = p.parse_args()

    repo = args.repo
    if not repo:
        # Try to read from git remote
        try:
            import subprocess
            url = subprocess.check_output(['git', 'remote', 'get-url', 'origin']).decode().strip()
            if url.endswith('.git'):
                url = url[:-4]
            if url.startswith('git@github.com:'):
                repo = url.split(':', 1)[1]
            elif url.startswith('https://github.com/'):
                repo = url.split('https://github.com/', 1)[1]
        except Exception:
            print('Cannot determine repo from git; use --repo owner/repo')
            return 2

    owner, repo_name = repo.split('/', 1)
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN') or os.environ.get('QMOI_GH_TOKEN')
    if token:
        return upload_with_api(owner, repo_name, args.tag, token, args.files)

    # Fallback: try gh CLI
    try:
        import subprocess
        for f in args.files:
            subprocess.check_call(['gh', 'release', 'upload', args.tag, f])
        return 0
    except Exception as e:
        print('Failed to upload artifacts: need GH_TOKEN or gh CLI authenticated. Error:', e)
        return 4


if __name__ == '__main__':
    sys.exit(main())
