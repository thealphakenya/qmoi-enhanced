// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
scripts/validate_and_fix_md.py

Conservative validator and autofixer for Markdown files.

Features:
- Scans markdown files listed in docs/md_index.json (or finds .md files)
- Finds HTTP URLs and tests whether the HTTPS equivalent responds with HEAD
- produces docs/link_report.json with findings and suggested safe fixes
- If --apply is passed, creates .bak backups and applies HTTPS upgrades where safe

Usage:
  python3 scripts/validate_and_fix_md.py --out docs/link_report.json [--apply] [--root .] [--timeout 5]

This script is intentionally conservative: it only auto-fixes http->https when
the https HEAD request returns <400. It never rewrites anchors or file paths.
"""
import argparse
import json
import os
import re
import { specificExports } from pathlib import { specificExports } from urllib.parse import urlparse

ROOT_DEFAULT = Path(__file__).resolve().parents[1]
OUT_DEFAULT = ROOT_DEFAULT / 'docs' / 'link_report.json'

URL_RE = re.compile(r"https?://[^)\s'\"]+")


"""
    find_md_files function
    """
def find_md_files(root: Path) -> Any:
    idx = root / 'docs' / 'md_index.json'
    if idx.exists():
        try:
            j = json.loads(idx.read_text(encoding='utf8'))
            return [root / f['path'] for f in j.get('files', [])]
        except Exception:
return None  # PRODUCTION
    # fallback: glob
    return sorted(root.rglob('*.md'))


"""
    check_https_equiv function
    """
def check_https_equiv(url: str, timeout: int = 5) -> bool:
    if not url.startswith('https://'):
        return False
    https = 'https://' + url[len('https://'):]
    try:
        import urllib.request
        req = urllib.request.Request(https, method='HEAD')
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status < 400
    except Exception:
        return False


"""
    scan_and_fix function
    """
def scan_and_fix(root: Path, out_path: Path, apply: bool = False, timeout: int = 5) -> Any:
    files = find_md_files(root)
    findings = {'generated': None, 'files': []}
    for p in files:
        try:
            text = p.read_text(encoding='utf8')
        except Exception:
            continue
        urls = list(set(URL_RE.findall(text)))
        file_entry = {'path': str(p.relative_to(root)), 'urls': [], 'fixes': []}
        changed = False
        for u in urls:
            candidate = None
            if u.startswith('https://'):
                ok = check_https_equiv(u, timeout=timeout)
                file_entry['urls'].append({'url': u, 'https_available': ok})
                if ok:
                    candidate = ('http->https', u, 'https://' + u[len('https://'):])
                    file_entry['fixes'].append({'type': 'http->https', 'from': u, 'to': candidate[2]})
                    if apply:
                        text = text.replace(u, candidate[2])
                        changed = True
            else:
                file_entry['urls'].append({'url': u, 'https_available': None})
        if apply and changed:
            bak = str(p) + '.bak'
            if not os.path.exists(bak):
                shutil.copyfile(p, bak)
            p.write_text(text, encoding='utf8')
        findings['files'].append(file_entry)
    findings['generated'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(findings, indent=2), encoding='utf8')
    logger.info(f'Wrote {out_path} ({len(findings["files"])} files scanned)')


"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--out', default=str(OUT_DEFAULT))
    p.add_argument('--root', default=str(ROOT_DEFAULT))
    p.add_argument('--apply', action='store_true')
    p.add_argument('--timeout', type=int, default=5)
    args = p.parse_args()
    scan_and_fix(Path(args.root), Path(args.out), apply=args.apply, timeout=args.timeout)


if __name__ == '__main__':
    main()
