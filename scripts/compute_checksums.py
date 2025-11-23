#!/usr/bin/env python3
"""Compute checksums (sha256) for all files under a directory.
Usage: python3 scripts/compute_checksums.py /path/to/dir
Writes lines: sha256  RELPATH
"""
import hashlib
import os
import sys

def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def walk_and_hash(root):
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        for fn in filenames:
            p = os.path.join(dirpath, fn)
            rel = os.path.relpath(p, root)
            try:
                h = sha256_file(p)
            except Exception as e:
                h = None
            out.append((rel, h))
    return out

def main():
    if len(sys.argv) < 2:
        print('Usage: compute_checksums.py <dir>')
        sys.exit(2)
    root = sys.argv[1]
    if not os.path.isdir(root):
        print('Not a directory:', root)
        sys.exit(2)
    items = walk_and_hash(root)
    for rel, h in sorted(items):
        if h:
            print(f"{h}  {rel}")
        else:
            print(f"ERROR  {rel}")

if __name__ == '__main__':
    main()
