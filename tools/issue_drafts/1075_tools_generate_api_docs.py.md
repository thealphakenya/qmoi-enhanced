---
title: "Issue draft for tools/generate_api_docs.py"
generated: 2025-11-08T16:06:39.011025Z
---

# Review needed: tools/generate_api_docs.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Generate a simple API endpoints markdown by scanning repository files for common route patterns.

This is heuristic and conservative: it looks for common patterns used by Flask, FastAPI, Express, and simple 'METHOD /path' lines.
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

def scan_files():
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
      
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.

<!-- AUTOMATED-CHECK: 2025-11-11 11:36:36 UTC -->
