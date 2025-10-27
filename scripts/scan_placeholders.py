#!/usr/bin/env python3
"""
Scan the repository for common placeholder tokens and developer secrets left in code.

Writes a JSON report to tmp/placeholders_report.json and prints a short summary.

Usage:
  python3 scripts/scan_placeholders.py

This script is safe (read-only) and intended to help prioritize secret/placeholder remediation.
"""
#!/usr/bin/env python3
"""
Scan the repository for common placeholder tokens and developer secrets left in code.

Writes a JSON report to tmp/placeholders_report.json and prints a short summary.

Usage:
  python3 scripts/scan_placeholders.py

This script is safe (read-only) and intended to help prioritize secret/placeholder remediation.
"""
import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "tmp"
OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT_FILE = OUT_DIR / "placeholders_report.json"

PATTERNS = {
    "TODO": re.compile(r"\bTODO\b", re.I),
    "FIXME": re.compile(r"\bFIXME\b", re.I),
    "PLACEHOLDER_TOKEN": re.compile(r"your-token|dev-token|example-token|REPLACE_ME|CHANGE_ME|<API_KEY>|<SECRET>", re.I),
    "CREDENTIAL_LIKE": re.compile(r"(api_key|apiKey|secret|password|passwd)\s*[=:]\s*[\"']?[A-Za-z0-9\-_=]+[\"']?", re.I),
    "HARDCODED_URLS_LOCAL": re.compile(r"http://localhost:\\d+", re.I),
}

IGNORED_DIRS = {".git", "node_modules", "venv", "env", "dist", "build", "__pycache__", "tmp"}


def scan_file(path: Path):
    findings = []
    try:
        text = path.read_text(errors='ignore')
    except Exception:
        return findings

    for name, pat in PATTERNS.items():
        for m in pat.finditer(text):
            # capture a small context around the match
            start = max(0, m.start() - 40)
            end = min(len(text), m.end() + 40)
            context = text[start:end].replace('\n', ' ')[:300]
            findings.append({
                "pattern": name,
                "match": m.group(0),
                "context": context,
                "pos": m.start(),
            })

    return findings


def run():
    report = {"scanned_at": None, "root": str(ROOT), "files": {}}
    from datetime import datetime
    report["scanned_at"] = datetime.utcnow().isoformat() + "Z"

    total = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # filter ignored dirs
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS]
        for fname in filenames:
            if not fname.lower().endswith((".py", ".js", ".ts", ".tsx", ".jsx", ".html", ".md", ".json")):
                continue
            total += 1
            p = Path(dirpath) / fname
            rel = p.relative_to(ROOT).as_posix()
            findings = scan_file(p)
            if findings:
                report["files"][rel] = findings

    report["summary"] = {"files_scanned": total, "files_with_findings": len(report["files"]) }
    OUT_FILE.write_text(json.dumps(report, indent=2))
    print(f"Scanned {total} files, {len(report['files'])} files had findings. Report: {OUT_FILE}")


if __name__ == '__main__':
    run()
