#!/usr/bin/env python3
"""
QMOI Customized Error Handler
-----------------------------
Maps common operational failures to friendly diagnostics and suggested fixes.
Intended for reuse across apps/CLI.
"""

from __future__ import annotations

import json
import re
from typing import Dict


TEMPLATES: Dict[str, Dict[str, str]] = {
    "npm_missing": {
        "match": r"FileNotFoundError: npm|npm(\\.cmd)? is not recognized",
        "message": "Node/npm not available. Adding Node to PATH or installing Node.js resolves this.",
        "action": "Install Node.js (LTS) or enable portable Node in unified push; then retry.",
    },
    "permission": {
        "match": r"Permission denied|Access is denied",
        "message": "Permission issue encountered.",
        "action": "Close conflicting processes and re-run as admin or adjust file permissions.",
    },
    "network": {
        "match": r"ECONNRESET|ENOTFOUND|timed out|Network is unreachable",
        "message": "Network connectivity issue detected.",
        "action": "Check internet connection or retry with fallback endpoints (ngrok/alternate mirror).",
    },
    "git_conflict": {
        "match": r"CONFLICT .*|You are currently rebasing",
        "message": "Git conflict or rebase in progress.",
        "action": "Run 'git rebase --abort' or resolve conflicts, then commit and push.",
    },
}


def diagnose(log: str) -> Dict[str, str]:
    for key, tpl in TEMPLATES.items():
        if re.search(tpl["match"], log, flags=re.I | re.M):
            return {"type": key, "message": tpl["message"], "action": tpl["action"]}
    return {"type": "unknown", "message": "Unknown error.", "action": "Check logs for details and retry."}


def main():
    import sys
    content = sys.stdin.read()
    print(json.dumps(diagnose(content), indent=2))


if __name__ == "__main__":
    main()


