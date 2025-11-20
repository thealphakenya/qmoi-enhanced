#!/usr/bin/env python3
"""Auto-replace placeholders using resilient network logic (v2).

This script is a clean, single-file implementation that uses
`tools/network_utils.py` for DNS resolution and resilient downloads.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import sys
import time
from typing import List, Optional

import importlib.util
# Ensure tools package path is importable
TOOLS_DIR = os.path.abspath(os.path.dirname(__file__))
if TOOLS_DIR not in sys.path:
    sys.path.insert(0, TOOLS_DIR)
try:
    import network_utils
except Exception:
    # fallback: try to load by filepath
    spec = importlib.util.spec_from_file_location('network_utils', os.path.join(TOOLS_DIR, 'network_utils.py'))
    network_utils = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(network_utils)


def sha256_of_file(path: str, chunk_size: int = 8192) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()


def candidate_files(root: str = "."):
    for dirpath, dirs, files in os.walk(root):
        if any(x in dirpath.split(os.sep) for x in ('.git', '.venv', 'node_modules', '.qmoi_validation')):
            continue
        for fn in files:
            path = os.path.join(dirpath, fn)
            try:
                size = os.path.getsize(path)
            except Exception:
                continue
            if size < 1024:
                yield path
            else:
                try:
                    with open(path, 'r', errors='ignore') as f:
                        c = f.read(2048)
                        if 'QMOI placeholder' in c or 'qmoi placeholder' in c or 'PLACEHOLDER' in c.upper():
                            yield path
                except Exception:
                    continue


def build_candidate_urls(name: str, base: str, tag: Optional[str] = None) -> List[str]:
    base = base.rstrip('/')
    c = [f"{base}/{name}", f"{base}/downloads/{name}"]
    if tag:
        c.append(f"{base}/releases/{tag}/{name}")
    return c


def try_replace(path: str, bases: List[str], tag: Optional[str], host_ip: Optional[str], dry_run: bool) -> bool:
    name = os.path.basename(path)
    print(f"Trying to replace {path} (name={name}) from bases={bases} host_ip={host_ip}")
    tmp = path + '.new'
    for base in bases:
        urls = build_candidate_urls(name, base, tag)
        for url in urls:
            print('  Trying', url)
            use_host_ip = host_ip
            try:
                parsed_host = url.split('://', 1)[1].split('/', 1)[0]
            except Exception:
                parsed_host = None
            if not use_host_ip and parsed_host:
                resolved = network_utils.resolve_host(parsed_host)
                if resolved:
                    use_host_ip = resolved

            dest_tmp = tmp
            ok = network_utils.download_with_retries(url, dest_tmp, fallback_hosts=bases[1:] if len(bases) > 1 else None, host_override=(parsed_host if use_host_ip else None))
            if not ok:
                if os.path.exists(dest_tmp):
                    try:
                        os.remove(dest_tmp)
                    except Exception:
                        pass
                continue

            # Check for checksum and verify
            cs_url = url + '.sha256'
            cs_tmp = dest_tmp + '.sha256'
            cs_ok = network_utils.download_with_retries(cs_url, cs_tmp, fallback_hosts=bases[1:] if len(bases) > 1 else None, host_override=(parsed_host if use_host_ip else None))
            if cs_ok and os.path.exists(cs_tmp):
                try:
                    with open(cs_tmp, 'r') as f:
                        expected = f.read().strip().split()[0]
                except Exception:
                    expected = None
                got = sha256_of_file(dest_tmp)
                try:
                    os.remove(cs_tmp)
                except Exception:
                    pass
                if expected and expected != got:
                    print(f"  Checksum mismatch for {name}: expected {expected}, got {got}")
                    try:
                        os.remove(dest_tmp)
                    except Exception:
                        pass
                    continue
                else:
                    print(f"  Checksum ok for {name}")

            if dry_run:
                print("  DRY-RUN: would replace", path)
                try:
                    os.remove(dest_tmp)
                except Exception:
                    pass
                return True

            bak = path + '.bak'
            try:
                if os.path.exists(bak):
                    rot = bak + '.' + str(int(time.time()))
                    os.replace(bak, rot)
                os.replace(path, bak)
                os.replace(dest_tmp, path)
                print('  Replaced', path, '(backup at', bak, ')')
                return True
            except Exception as e:
                print('  Failed to replace file:', e)
                if os.path.exists(dest_tmp):
                    try:
                        os.remove(dest_tmp)
                    except Exception:
                        pass
                return False

    return False


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--download-base', help='Primary download base URL')
    p.add_argument('--fallback-bases', help='Comma-separated fallback base URLs')
    p.add_argument('--host-ip', help='Connect to this IP and use original Host header')
    p.add_argument('--tag', help='Release tag used when building candidate URLs', default=None)
    p.add_argument('--dry-run', action='store_true')
    return p.parse_args()


def main():
    args = parse_args()
    base = args.download_base or os.environ.get('DOWNLOAD_BASE_URL')
    if not base:
        print('No download base provided. Set --download-base or DOWNLOAD_BASE_URL env var')
        return 2
    bases = [base]
    fallback_env = os.environ.get('DOWNLOAD_FALLBACK_BASES')
    if args.fallback_bases:
        bases += [x for x in [b.strip() for b in args.fallback_bases.split(',')] if x]
    elif fallback_env:
        bases += [x for x in [b.strip() for b in fallback_env.split(',')] if x]

    replaced = 0
    for p in candidate_files('.'):
        try:
            ok = try_replace(p, bases, args.tag, args.host_ip or os.environ.get('DOWNLOAD_HOST_IP'), dry_run=args.dry_run)
            if ok:
                replaced += 1
        except Exception as e:
            print('Error processing', p, e)

    print(f'Done. Replaced {replaced} files (dry-run={args.dry_run})')
    return 0


if __name__ == '__main__':
    sys.exit(main())
