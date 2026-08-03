#!/usr/bin/env python3
"""
Scan repository for common build scripts and manifest files.
Writes .qmoi_validation/build_scripts_found.json with discovered items.

Usage:
  python3 scripts/collect_build_scripts.py
  python3 scripts/collect_build_scripts.py --root /path --out .qmoi_validation/build_scripts_found.json
"""
import argparse
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = REPO_ROOT / ".qmoi_validation"
OUT_DIR.mkdir(exist_ok=True)

COMMON_PATTERNS = [
    'build*.sh', 'build.sh', 'build.py', 'build-*.sh',
    'package.json', 'pyproject.toml', 'setup.py', 'pom.xml', 'build.gradle',
    'Dockerfile', 'Dockerfile.*', 'Makefile', 'gradlew', 'gradlew.bat',
    '*.xcodeproj', '*.xcworkspace', 'android/**/build.gradle'
]


def scan(root: Path):
    found = []
    # scan for specific filenames
    for p in root.rglob('*'):
        if p.is_file():
            name = p.name.lower()
            if name in ('build.sh', 'build.py', 'setup.py', 'package.json', 'pyproject.toml', 'makefile', 'pom.xml', 'build.gradle', 'dockerfile'):
                found.append(str(p.relative_to(root)))
            elif p.name.startswith('build-') and p.suffix in ('.sh', '.py'):
                found.append(str(p.relative_to(root)))
            # detect npm/pnpm/yarn projects by package.json
            elif p.name == 'package.json':
                found.append(str(p.relative_to(root)))
    # try common directories with build outputs
    for candidate in ('dist', 'build', 'out', 'release'):
        p = root / candidate
        if p.exists():
            found.append(str(p.relative_to(root)))

    found = sorted(set(found))
    return found


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default=str(REPO_ROOT))
    ap.add_argument('--out', default=str(OUT_DIR / 'build_scripts_found.json'))
    args = ap.parse_args()
    root = Path(args.root)
    found = scan(root)
    data = {'root': str(root), 'count': len(found), 'items': found}
    Path(args.out).write_text(json.dumps(data, indent=2), encoding='utf-8')
    print(f"Found {len(found)} build-related items. Wrote {args.out}")


if __name__ == '__main__':
    main()
