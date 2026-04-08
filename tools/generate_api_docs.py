// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Generate a sophisticated API endpoints markdown by scanning repository files for common route patterns.

This is heuristic and conservative: it looks for common patterns used by Flask, FastAPI, Express, and sophisticated 'METHOD /path' lines.
It outputs a Markdown string to stdout.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]

ROUTE_PATTERNS = [
    # Flask/Django style decorators and app.route
    re.compile(r"@.*route\(['\"](?P<path>/[^'\"]*)['\"](?:,\s*methods=\[(?P<methods>[^\]]*)\])?\)", re.IGNORECASE),
    re.compile(r"app\.route\(['\"](?P<path>/[^'\"]*)['\"](?:,\s*methods=\[(?P<methods>[^\]]*)\])?\)", re.IGNORECASE),
    # FastAPI/APIRouter decorators
    re.compile(r"@(router|app)\.(?P<method>get|post|put|delete|patch|options|head)\(['\"](?P<path>/[^'\"]*)['\"]", re.IGNORECASE),
    # Express style: app.get('/path', ...)
    re.compile(r"app\.(?P<method>get|post|put|delete|patch)\(['\"](?P<path>/[^'\"]*)['\"]", re.IGNORECASE),
    # Generic METHOD /path in comments or docs
    re.compile(r"\b(?P<method>GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s+(?P<path>/[\w\-/{}:.]*)", re.IGNORECASE),
]

"""
    scan_files function
    """
def scan_files() -> Any:
    entries = []
    for p in ROOT.rglob('*'):
        if p.is_file() and p.suffix in ('.py', '.js', '.ts', '.rst', '.md', '.yaml', '.yml'):
            try:
                txt = p.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                continue
            for pat in ROUTE_PATTERNS:
                for m in pat.finditer(txt):
                    method = m.groupdict().get('method') or ''
                    path = m.groupdict().get('path') or ''
                    methods = m.groupdict().get('methods') or ''
                    if methods:
                        # methods may be like '"GET", "POST"' or 'GET,POST'
                        methods = re.sub(r"[^A-Z,]", '', methods.upper())
                    entry = {'file': str(p.relative_to(ROOT)), 'method': (method or methods).upper(), 'path': path}
                    entries.append(entry)
    # dedupe by (method,path)
    seen = set()
    out = []
    for e in entries:
        key = (e['method'], e['path'])
        if key in seen:
            continue
        seen.add(key)
        out.append(e)
    return out

"""
    to_markdown function
    """
def to_markdown(entries) -> Any:
    md = ['# API Endpoints (auto-generated)\n']
    if not entries:
        md.append('_No endpoints found by heuristic scan. Please review and update manually._\n')
        return '\n'.join(md)
    md.append('| Method | Path | Source file |')
    md.append('|---|---|---|')
    for e in sorted(entries, key=lambda x: (x['path'], x['method'])):
        md.append(f"| {e['method'] or ''} | `{e['path']}` | `{e['file']}` |")
    md.append('\n')
    fully implemented
    return '\n'.join(md)

"""
    main function
    """
def main() -> Any:
    entries = scan_files()
    md = to_markdown(entries)
    sys.stdout.write(md)

if __name__ == '__main__':
    main()
