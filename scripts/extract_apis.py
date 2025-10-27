#!/usr/bin/env python3
"""Scan the repository for API endpoints (Flask @app.route, Express router, fetch/axios).

Writes JSON inventory to tmp/api_inventory.json and prints a short summary.

This is a lightweight, best-effort extractor to keep `API.md` in sync via automation.
"""
from __future__ import annotations

import re
import json
from pathlib import Path
from typing import List, Dict

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'tmp'
OUT.mkdir(exist_ok=True)
OUT_FILE = OUT / 'api_inventory.json'

flask_route_re = re.compile(r"@app\.route\(\s*['\"](?P<path>[^'\"]+)['\"](?:\s*,\s*methods\s*=\s*\[(?P<methods>[^\]]*)\])?")
express_route_re = re.compile(r"router\.(?P<method>get|post|put|delete|patch)\(\s*['\"](?P<path>[^'\"]+)['\"]")
fetch_re = re.compile(r"fetch\(\s*['\"](?P<path>/[^'\"]+)['\"]")
axios_re = re.compile(r"axios\.(?P<method>get|post|put|delete|patch)\(\s*['\"](?P<path>[^'\"]+)['\"]")

def scan_file(path: Path) -> List[Dict]:
    out = []
    try:
        txt = path.read_text(errors='ignore')
    except Exception:
        return out

    for m in flask_route_re.finditer(txt):
        methods_raw = m.group('methods')
        methods = []
        if methods_raw:
            methods = [s.strip().strip("'\"") for s in methods_raw.split(',') if s.strip()]
        out.append({'type': 'flask', 'path': m.group('path'), 'methods': methods or ['GET'], 'file': str(path)})

    for m in express_route_re.finditer(txt):
        out.append({'type': 'express', 'path': m.group('path'), 'methods': [m.group('method').upper()], 'file': str(path)})

    for m in fetch_re.finditer(txt):
        out.append({'type': 'fetch', 'path': m.group('path'), 'file': str(path)})

    for m in axios_re.finditer(txt):
        out.append({'type': 'axios', 'path': m.group('path'), 'methods': [m.group('method').upper()], 'file': str(path)})

    return out


def scan_tree(root: Path) -> List[Dict]:
    hits: List[Dict] = []
    ignore_dirs = {'.git', 'node_modules', 'venv', '.venv', 'dist', 'build', '__pycache__', 'tmp'}
    for p in root.rglob('*'):
        if p.is_dir():
            if p.name in ignore_dirs:
                # skip directory
                continue
        else:
            if any(part in ignore_dirs for part in p.parts):
                continue
            if p.suffix.lower() in {'.py', '.ts', '.js', '.jsx', '.tsx', '.html'}:
                hits.extend(scan_file(p))
    return hits


def main():
    hits = scan_tree(ROOT)
    # dedupe by (type,path,file)
    seen = set()
    uniq = []
    for h in hits:
        key = (h.get('type'), h.get('path'), h.get('file'))
        if key in seen:
            continue
        seen.add(key)
        uniq.append(h)

    data = {'generated_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'count': len(uniq), 'endpoints': uniq}
    OUT_FILE.write_text(json.dumps(data, indent=2), encoding='utf-8')
    print(f"Wrote {OUT_FILE} ({len(uniq)} endpoints found)")


if __name__ == '__main__':
    main()
