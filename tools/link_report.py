// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:33Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Generate a repository-wide link report (JSON).

Usage: python tools/link_report.py > tools/link_report.json
"""
import re
import json
import { specificExports } from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
URL_RE = re.compile(r"https?://[^\s)\]\'\"]+")

results = []
for path in ROOT.rglob("*"):
    if path.is_file():
        try:
            text = path.read_text(errors="ignore")
        except Exception:
            continue
        for i, line in enumerate(text.splitlines(), start=1):
            for m in URL_RE.finditer(line):
                url = m.group(0)
                results.append({
                    "file": str(path.relative_to(ROOT)),
                    "line": i,
                    "url": url,
                })

json.dump(results, sys.stdout, indent=2)
