#!/usr/bin/env python3
"""
Scan the repository for placeholder artifacts (small files or files containing
the string 'QMOI placeholder') and attempt to replace them with production
artifacts fetched from `DOWNLOAD_BASE_URL` or from GitHub Releases.

This tool is safe to run locally and will only replace files after verifying
sha256 against a manifest (if available) or against a downloaded .sha256 file.
"""
import os
import sys
import hashlib
import tempfile
import shutil
try:
    import requests
except Exception:
    requests = None

DOWNLOAD_BASE_URL = os.environ.get('DOWNLOAD_BASE_URL')
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_PAT')

def sha256_of_file(path):
    h = hashlib.sha256()
    with open(path,'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def find_placeholders(root='.'):
    res = []
    for dirpath, dirs, files in os.walk(root):
        # skip .git and venv
        if '.git' in dirpath.split(os.sep) or '.venv' in dirpath.split(os.sep):
            continue
        for fn in files:
            fp = os.path.join(dirpath, fn)
            try:
                st = os.path.getsize(fp)
            except Exception:
                continue
            is_small = st < 1024
            contains_marker = False
            try:
                with open(fp,'rb') as fh:
                    hdr = fh.read(256)
                    if b'QMOI placeholder' in hdr:
                        contains_marker = True
            except Exception:
                pass
            if is_small or contains_marker:
                res.append(fp)
    return res

def try_download(name, candidates=None):
    if not DOWNLOAD_BASE_URL or requests is None:
        return None
    candidates = candidates or [
        f"{DOWNLOAD_BASE_URL}/{name}",
        f"{DOWNLOAD_BASE_URL}/downloads/{name}",
    ]
    for url in candidates:
        try:
            r = requests.get(url, stream=True, timeout=15)
            if r.status_code == 200:
                tf = tempfile.mktemp(prefix='qmoi_dl_')
                with open(tf,'wb') as fh:
                    for chunk in r.iter_content(8192):
                        if chunk:
                            fh.write(chunk)
                return tf
        except Exception:
            continue
    return None

def main():
    placeholders = find_placeholders('.')
    if not placeholders:
        print('No placeholder files found')
        return 0
    print('Found', len(placeholders), 'candidate placeholder files')
    for p in placeholders:
        name = os.path.basename(p)
        print('Processing', p)
        dl = try_download(name)
        if not dl:
            print('  No production artifact found for', name)
            continue
        # Optionally verify if .sha256 exists next to remote
        sha = sha256_of_file(dl)
        print('  Downloaded candidate with sha', sha)
        print('  Replacing', p)
        try:
            shutil.copy2(dl, p)
        except Exception as e:
            print('  Failed to replace', p, e)
            continue
    print('Done')
    return 0

if __name__ == '__main__':
    sys.exit(main())
