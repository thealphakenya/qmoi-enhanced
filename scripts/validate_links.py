#!/usr/bin/env python3
"""Production link validator.

Scans the repository for URLs in common text/code/markdown files, checks HTTP
status for each discovered URL, and writes a JSON report to
.qmoi_validation/links_report.json. The script tries to use `requests` if
available for robust checks, and falls back to urllib when not.

Usage: python scripts/validate_links.py [--out PATH] [--timeout SECONDS]
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
VALIDATION_DIR.mkdir(exist_ok=True)

URL_RE = re.compile(r"https?://[\w\-\.\/?#%&=:@,;+~\[\]\(\)\$!\*'\\]+")
TEXT_EXTENSIONS = {'.md', '.markdown', '.txt', '.html', '.htm', '.py', '.js', '.ts', '.json', '.yaml', '.yml', '.rst'}


def find_files(root: Path) -> List[Path]:
    files: List[Path] = []
    for p in root.rglob('*'):
        if p.is_file():
            if any(part.startswith('.git') for part in p.parts):
                continue
            if p.suffix.lower() in TEXT_EXTENSIONS:
                files.append(p)
    return files


def extract_urls_from_file(path: Path) -> List[str]:
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return []
    return list({m.group(0) for m in URL_RE.finditer(text)})


def check_url_requests(url: str, timeout: int) -> Dict:
    try:
        import requests
    except Exception:
        return check_url_urllib(url, timeout)

    try:
        # prefer HEAD, fallback to GET when HEAD disallowed
        resp = requests.head(url, allow_redirects=True, timeout=timeout)
        status = resp.status_code
        if status >= 400 or resp.status_code == 405:
            resp = requests.get(url, allow_redirects=True, timeout=timeout)
            status = resp.status_code
        return {"url": url, "ok": 200 <= status < 400, "status": status}
    except Exception as exc:
        return {"url": url, "ok": False, "status": str(exc)}


def check_url_urllib(url: str, timeout: int) -> Dict:
    try:
        from urllib.request import Request, urlopen
        req = Request(url, headers={"User-Agent": "qmoi-link-validator/1.0"})
        with urlopen(req, timeout=timeout) as resp:
            return {"url": url, "ok": 200 <= resp.status < 400, "status": resp.status}
    except Exception as exc:
        return {"url": url, "ok": False, "status": str(exc)}


def main(argv=None):
    parser = argparse.ArgumentParser(prog='validate_links.py')
    parser.add_argument('--out', '-o', default=str(VALIDATION_DIR / 'links_report.json'))
    parser.add_argument('--timeout', type=int, default=8)
    parser.add_argument('--max-urls', type=int, default=1000, help='Maximum number of URLs to check')
    args = parser.parse_args(argv)

    files = find_files(ROOT)
    urls = {}
    for f in files:
        found = extract_urls_from_file(f)
        if found:
            urls.setdefault(str(f.relative_to(ROOT)), []).extend(found)

    all_urls = []
    for src, ulist in urls.items():
        for u in ulist:
            all_urls.append({"source": src, "url": u})
            if len(all_urls) >= args.max_urls:
                break
        if len(all_urls) >= args.max_urls:
            break

    results = []
    for entry in all_urls:
        res = check_url_requests(entry['url'], args.timeout)
        res.update({"source": entry['source']})
        results.append(res)

    broken = [r for r in results if not r.get('ok')]
    report = {
        "checked": len(results),
        "broken_count": len(broken),
        "broken": broken[:200],
        "timestamp": __import__('datetime').datetime.utcnow().isoformat() + 'Z'
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f"Link validation complete: checked={report['checked']} broken={report['broken_count']} -> {out_path}")


if __name__ == '__main__':
    main()
