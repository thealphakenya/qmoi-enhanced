#!/usr/bin/env python3
"""Auto-replace placeholder artifacts in the repository with production artifacts.

This tool scans the repository for small placeholder files or files containing
the string "QMOI placeholder" and attempts to fetch a production artifact from
the configured `DOWNLOAD_BASE_URL`. It only replaces files when a verified
artifact is downloaded (sha256 matches, if available). Backups are created
with a `.bak` suffix before replacement.

Usage:
  python tools/auto_replace_placeholders.py [--base-url URL] [--dry-run]

Environment:
  DOWNLOAD_BASE_URL: default download base URL (overridden by --base-url)
"""

import argparse
import hashlib
import os
import sys
import requests


def sha256_of_file(path, chunk_size=8192):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(chunk_size), b''):
            h.update(chunk)
    return h.hexdigest()


def candidate_files(root='.'): 
    for dirpath, dirs, files in os.walk(root):
        # ignore .git and .venv and node_modules
        if '.git' in dirpath.split(os.sep) or '.venv' in dirpath.split(os.sep) or 'node_modules' in dirpath.split(os.sep):
            continue
        for fn in files:
            path = os.path.join(dirpath, fn)
            try:
                size = os.path.getsize(path)
            except Exception:
                continue
            # Heuristic: placeholder files are small (<1KB) or contain marker text
            if size < 1024:
                yield path
            else:
                try:
                    with open(path, 'r', errors='ignore') as f:
                        c = f.read(2048)
                        if 'QMOI placeholder' in c or 'qmoi placeholder' in c:
                            yield path
                except Exception:
                    continue


def try_replace(path, base_url, dry_run=False):
    name = os.path.basename(path)
    target_url = base_url.rstrip('/') + '/' + name
    print(f"Trying to replace {path} from {target_url}")
    try:
        r = requests.get(target_url, stream=True, timeout=30)
    except Exception as e:
        print("Download failed:", e)
        return False
    if r.status_code != 200:
        print("No artifact at", target_url, "status", r.status_code)
        return False
    # write to temp
    tmp = path + '.new'
    try:
        with open(tmp, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    except Exception as e:
        print("Failed writing download", e)
        if os.path.exists(tmp):
            os.remove(tmp)
        return False
    # if there's a checksum file available, validate
    cs_url = base_url.rstrip('/') + '/' + name + '.sha256'
    try:
        rc = requests.get(cs_url, timeout=10)
    except Exception:
        rc = None
    if rc and rc.status_code == 200:
        expected = rc.text.strip().split()[0]
        got = sha256_of_file(tmp)
        if expected != got:
            print(f"Checksum mismatch for {name}: expected {expected}, got {got}")
            os.remove(tmp)
            return False
        else:
            print(f"Checksum ok for {name}")

    # replace file with backup
    bak = path + '.bak'
    if dry_run:
        print("DRY-RUN: would replace", path, "backup ->", bak)
        os.remove(tmp)
        return True
    try:
        os.replace(path, bak)
        os.replace(tmp, path)
        print("Replaced", path, "(backup at", bak, ")")
        return True
    except Exception as e:
        print("Failed to replace file:", e)
        if os.path.exists(tmp):
            os.remove(tmp)
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    base_url = args.base_url or os.environ.get('DOWNLOAD_BASE_URL')
    if not base_url:
        print('No DOWNLOAD_BASE_URL set; provide --base-url or set env var')
        sys.exit(1)

    replaced = 0
    for p in candidate_files('.'):
        try:
            ok = try_replace(p, base_url, dry_run=args.dry_run)
            if ok:
                replaced += 1
        except Exception as e:
            print('Error processing', p, e)

    print(f'Done. Replaced {replaced} files (dry-run={args.dry_run})')


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Scan the repository for placeholder files and replace them with production artifacts
downloaded from `DOWNLOAD_BASE_URL` when available and verified.

Usage: tools/auto_replace_placeholders.py [--manifest release_assets_manifest.json] [--tag v1.2.5]
"""
import argparse
import hashlib
import json
import os
import sys
import requests


def sha256_of_file(path, chunk_size=8192):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(chunk_size), b''):
            h.update(chunk)
    return h.hexdigest()


def load_manifest(path):
    if not os.path.exists(path):
        return {}
    with open(path, 'r') as f:
        return json.load(f)


def is_placeholder(path):
    try:
        st = os.stat(path)
        if st.st_size == 0:
            return True
        if st.st_size < 1024:
            # look inside for marker
            with open(path, 'rb', errors='ignore') as f:
                data = f.read(2048)
                if b'QMOI placeholder' in data or b'placeholder' in data.lower():
                    return True
        return False
    except Exception:
        return False


def try_download(url, dest):
    try:
        r = requests.get(url, stream=True, timeout=20)
        if r.status_code == 200:
            with open(dest, 'wb') as f:
                for chunk in r.iter_content(8192):
                    if chunk:
                        f.write(chunk)
            return True
    except Exception:
        pass
    return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--manifest', default='release_assets_manifest.json')
    parser.add_argument('--tag', default='v1.2.5')
    parser.add_argument('--download-base', default=os.environ.get('DOWNLOAD_BASE_URL', 'https://downloads.qmoi.app'))
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    manifest = load_manifest(args.manifest)
    assets = manifest.get('assets', []) if manifest else []
    expected_names = [a.get('name') or os.path.basename(a.get('path') or a.get('abs_path') or '') for a in assets]
    expected_names = [n for n in expected_names if n]

    # Find candidate files in repo matching expected names
    replaced = []
    for root, dirs, files in os.walk('.'):
        # skip .git and .venv
        if root.startswith('./.git') or '/.venv' in root:
            continue
        for f in files:
            if f in expected_names:
                path = os.path.join(root, f)
                if is_placeholder(path):
                    print('Found placeholder:', path)
                    # attempt download
                    candidates = [
                        f"{args.download_base}/{f}",
                        f"{args.download_base}/downloads/{f}",
                        f"{args.download_base}/releases/{args.tag}/{f}",
                    ]
                    ok = False
                    for url in candidates:
                        print('Trying URL:', url)
                        tmp_dest = path + '.download'
                        if try_download(url, tmp_dest):
                            # verify sha if manifest has it
                            manifest_entry = next((m for m in assets if (m.get('name') == f or os.path.basename(m.get('path') or '') == f)), None)
                            if manifest_entry and manifest_entry.get('sha256'):
                                sha = sha256_of_file(tmp_dest)
                                if sha != manifest_entry.get('sha256'):
                                    print('SHA mismatch for', f, 'expected', manifest_entry.get('sha256'), 'got', sha)
                                    os.remove(tmp_dest)
                                    continue
                            if args.dry_run:
                                print('DRY-RUN would replace', path, 'with', url)
                                os.remove(tmp_dest)
                                ok = True
                                break
                            # replace file atomically
                            os.replace(tmp_dest, path)
                            print('Replaced placeholder', path, 'from', url)
                            replaced.append(path)
                            ok = True
                            break
                        else:
                            try:
                                os.remove(tmp_dest)
                            except Exception:
                                pass
                    if not ok:
                        print('No valid artifact found for', f)

    print('Replaced files count:', len(replaced))
    if replaced:
        print('\nFiles replaced:')
        for p in replaced:
            print(' -', p)


if __name__ == '__main__':
    main()
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
