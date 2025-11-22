#!/usr/bin/env python3
"""Generate a .qmoi/runner_manifest.json for QCity runners by scanning repo docs.

This script heuristically scans markdown filenames and file contents to derive
runner capabilities and produces a manifest that the orchestrator uses to decide
which tasks to run on a runner.

Usage:
  python deploy/qcity/generate_runner_manifest.py --runner-id qcity-001 --apply
  python deploy/qcity/generate_runner_manifest.py --dry-run
"""
import argparse
import json
import re
from pathlib import Path
import socket


CAPABILITY_MAP = [
    (re.compile(r'build', re.I), 'build'),
    (re.compile(r'build.*platform|BUILDAPPSFORALLPLATFORMS', re.I), 'build-all-platforms'),
    (re.compile(r'qcity', re.I), 'qcity'),
    (re.compile(r'runner|runners|runnersengine', re.I), 'runner-engine'),
    (re.compile(r'android|apk|play', re.I), 'android-build'),
    (re.compile(r'ios|ipa|xcode', re.I), 'ios-build'),
    (re.compile(r'mac|dmg|pkg', re.I), 'macos-build'),
    (re.compile(r'windows|nsis|exe', re.I), 'windows-build'),
    (re.compile(r'linux|deb|appimage', re.I), 'linux-build'),
    (re.compile(r'electron', re.I), 'electron-build'),
    (re.compile(r'video|media', re.I), 'media-processing'),
    (re.compile(r'gpu|cuda', re.I), 'gpu'),
]


def scan_files(root: Path):
    files = list(root.rglob('*.md'))
    files += list(root.rglob('*.yml'))
    files += list(root.rglob('*.yaml'))
    return files


def detect_capabilities(files):
    caps = set()
    for p in files:
        name = p.name
        text = ''
        try:
            text = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        hay = name + "\n" + text[:4000]
        for pattern, cap in CAPABILITY_MAP:
            if pattern.search(hay):
                caps.add(cap)
    return sorted(caps)


def build_manifest(runner_id: str, tags=None, caps=None):
    if tags is None:
        tags = []
    manifest = {
        'runner_id': runner_id,
        'hostname': socket.gethostname(),
        'capabilities': caps or [],
        'tags': tags,
        'generated_at': int(__import__('time').time())
    }
    return manifest


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--runner-id', default=None)
    p.add_argument('--tags', default='', help='Comma-separated tags')
    p.add_argument('--apply', action='store_true', help='Write manifest to .qmoi/runner_manifest.json')
    p.add_argument('--root', default='.', help='Repo root')
    args = p.parse_args()

    root = Path(args.root).resolve()
    files = scan_files(root)
    caps = detect_capabilities(files)

    runner_id = args.runner_id or f"{socket.gethostname()}"
    tags = [t.strip() for t in args.tags.split(',') if t.strip()]

    manifest = build_manifest(runner_id, tags=tags, caps=caps)

    print('Discovered capabilities:', caps)
    if args.apply:
        qmoi = root / '.qmoi'
        qmoi.mkdir(parents=True, exist_ok=True)
        out = qmoi / 'runner_manifest.json'
        out.write_text(json.dumps(manifest, indent=2))
        print('Wrote manifest to', out)
    else:
        print(json.dumps(manifest, indent=2))


if __name__ == '__main__':
    main()
