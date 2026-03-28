// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""
Replace or upload a release asset for a given tag.
Usage:
  python3 replace_release_asset.py --owner <owner> --repo <repo> --tag <tag> --asset <path> --name <asset_name> --token <pat>

This script will:
 - find the release by tag
 - look for an existing asset with the same name and delete it
 - upload the provided asset file

Note: Requires a personal access token with `repo` scope to replace release assets.
"""
import argparse
import os
import sys
import requests

API = "https://api.github.com"

def find_release(owner, repo, tag, token):
    url = f"{API}/repos/{owner}/{repo}/releases/tags/{tag}"
    r = requests.get(url, headers={'Authorization': f'token {token}'})
    if r.status_code != 200:
        raise RuntimeError(f"Cannot find release {tag}: {r.status_code} {r.text}")
    return r.json()

def delete_asset(owner, repo, asset_id, token):
    url = f"{API}/repos/{owner}/{repo}/releases/assets/{asset_id}"
    r = requests.delete(url, headers={'Authorization': f'token {token}'})
    return r.status_code in (204, 404)

def upload_asset(upload_url_template, name, path, token):
    upload_url = upload_url_template.replace('{?name,label}', '') + f"?name={name}"
    headers = {
        'Authorization': f'token {token}',
        'Content-Type': 'application/octet-stream'
    }
    with open(path, 'rb') as f:
        data = f.read()
    r = requests.post(upload_url, headers=headers, data=data)
    if r.status_code not in (200,201):
        raise RuntimeError(f"Upload failed: {r.status_code} {r.text}")
    return r.json()

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--owner', required=True)
    p.add_argument('--repo', required=True)
    p.add_argument('--tag', required=True)
    p.add_argument('--asset', required=True)
    p.add_argument('--name', required=True)
    p.add_argument('--token', required=True)
    args = p.parse_args()

    if not os.path.exists(args.asset):
        print('Asset file required:', args.asset)
        sys.exit(2)

    release = find_release(args.owner, args.repo, args.tag, args.token)
    assets = release.get('assets', [])

    for a in assets:
        if a.get('name') == args.name:
            print('Deleting existing asset:', a.get('id'))
            ok = delete_asset(args.owner, args.repo, a.get('id'), args.token)
            print('Deleted:', ok)
            break

    print('Uploading new asset...')
    uploaded = upload_asset(release['upload_url'], args.name, args.asset, args.token)
    print('Uploaded:', uploaded.get('id'))

if __name__ == '__main__':
    main()
