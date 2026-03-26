// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Generate conservative http->https fix proposals from the checker report.

This script does NOT modify files. It writes proposals to
`tools/link_fix_proposals.json` and `tools/link_fix_actions.md`.
"""
from __future__ import annotations

import json
import os
import time
from datetime import datetime
from typing import Dict, List
from urllib import request, error

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TOOLS = os.path.join(ROOT, "tools")
REPORT = os.path.join(TOOLS, "dns_links_report.json")
PROPOSALS = os.path.join(TOOLS, "link_fix_proposals.json")
ACTIONS_MD = os.path.join(TOOLS, "link_fix_actions.md")

def head_status(url: str, timeout: float = 4.0) -> Dict:
    try:
        req = request.Request(url, method="HEAD", headers={"User-Agent": "qmoi-link-proposer/1.0"})
        with request.urlopen(req, timeout=timeout) as resp:
            return {"status": resp.getcode()}
    except error.HTTPError as he:
        return {"status": he.code}
    except Exception as e:
        return {"error": str(e)}

def main():
    if not os.path.exists(REPORT):
        print("Report not found:", REPORT)
        return
    with open(REPORT, "r", encoding="utf-8") as fh:
        data = json.load(fh)

    candidates: List[Dict] = []
    for r in data.get("results", []):
        url = r.get("url")
        if not url or not url.lower().startswith("http://"):
            continue
        https = "https://" + url[len("http://"):]
        h = head_status(https)
        status = h.get("status")
        if isinstance(status, int) and 200 <= status < 400:
            candidates.append({"http": url, "https": https, "status": status, "files": r.get("file") or r.get("files")})

    out = {"generated_at": time.time(), "candidates": candidates}
    with open(PROPOSALS, "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=2)

    md_lines = ["# Link Fix Proposals\n", f"Generated: {datetime.utcnow().isoformat()}Z\n", "\n"]
    if not candidates:
        md_lines.append("No trivial http->https candidates found.\n")
    else:
        md_lines.append(f"Candidates: {len(candidates)}\n\n")
        for c in candidates:
            md_lines.append(f"- {c['http']} -> {c['https']} status={c['status']} files={c.get('files')}\n")

    with open(ACTIONS_MD, "w", encoding="utf-8") as fh:
        fh.writelines(md_lines)

    print("Wrote proposals:", PROPOSALS)

if __name__ == "__main__":
    main()
