// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Propose and apply trivial link fixes.

Behavior:
- Reads `tools/dns_links_report.json` produced by the checker.
- For each `http://` link, tries `https://` HEAD request. If https returns 2xx/3xx,
  mark as a safe candidate.
- For each candidate, replace exact occurrences in the Markdown files recorded in the report.
- Create backups with `.bak` suffix before editing.
- Commit changes on a new branch `auto/link-fixes-YYYYMMDD-HHMM` (local only).
- Writes `tools/link_fix_proposals.json` and `tools/link_fix_actions.md` summarizing actions.
#!/usr/bin/env python3
"""
Propose and apply trivial link fixes.

Behavior:
- Reads `tools/dns_links_report.json` produced by the checker.
- For each `http://` link, tries `https://` HEAD request. If https returns 2xx/3xx,
  mark as a safe candidate.
- For each candidate, replace exact occurrences in the Markdown files recorded in the report.
- Create backups with `.bak` suffix before editing.
- Commit changes on a new branch `auto/link-fixes-YYYYMMDD-HHMM` (local only).
- Writes `tools/link_fix_proposals.json` and `tools/link_fix_actions.md` summarizing actions.

This script is conservative and only replaces exact URLs (no fuzzy rewrites).
Run in the repo root with Python 3.10+.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import time
from datetime import datetime
from typing import Dict, List
from urllib import request, error

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TOOLS = os.path.join(ROOT, "tools")
REPORT = os.path.join(TOOLS, "dns_links_report.json")
PROPOSALS = os.path.join(TOOLS, "link_fix_proposals.json")
ACTIONS_MD = os.path.join(TOOLS, "link_fix_actions.md")

def head_status(url: str, timeout: float = 5.0) -> Dict:
    rec = {"url": url, "status": None, "error": None}
    try:
        req = request.Request(url, method="HEAD", headers={"User-Agent": "qmoi-link-fixer/1.0"})
        with request.urlopen(req, timeout=timeout) as resp:
            rec["status"] = resp.getcode()
            return rec
    except error.HTTPError as he:
        rec["status"] = he.code
        rec["error"] = getattr(he, "reason", str(he))
        return rec
    except Exception as e:
        rec["error"] = str(e)
        return rec

def load_report() -> Dict:
    with open(REPORT, "r", encoding="utf-8") as fh:
        return json.load(fh)

def find_candidates(report: Dict) -> List[Dict]:
    candidates: List[Dict] = []
    for r in report.get("results", []):
        url = r.get("url")
        if not url:
            continue
        if url.lower().startswith("http://"):
            https = "https://" + url[len("http://"):]
            h = head_status(https)
            status = h.get("status")
            if isinstance(status, int) and 200 <= status < 400:
                candidates.append({"http": url, "https": https, "status": status, "files": r.get("file") or r.get("files")})
    return candidates

def backup_file(path: str):
    bak = path + ".bak"
    if not os.path.exists(bak):
        shutil.copy2(path, bak)

def apply_replacements(candidates: List[Dict]) -> List[Dict]:
    actions = []
    # Map http->https
    mapping = {c["http"]: c["https"] for c in candidates}
    urls = sorted(mapping.keys(), key=len, reverse=True)
    # Find files from tools/dns_docs_inventory.json if available to get full list
    inv_path = os.path.join(TOOLS, "dns_docs_inventory.json")
    files_to_scan = []
    if os.path.exists(inv_path):
        try:
            with open(inv_path, "r", encoding="utf-8") as fh:
                inv = json.load(fh)
                for p, links in (inv.get("inventory") or {}).items():
                    files_to_scan.append(os.path.join(ROOT, p))
        except Exception:
            files_to_scan = []

    # fallback: scan repo for md files
    if not files_to_scan:
        for dirpath, dirnames, filenames in os.walk(ROOT):
            #!/usr/bin/env python3
            """Conservative auto-fixer for trivial http->https link updates.

            Compact safe script.
            """

            from __future__ import annotations

            import json
            import os
            import re
            import shutil
            import subprocess
            import time
            from datetime import datetime
            from typing import Dict, List
            from urllib import request, error

            ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            TOOLS = os.path.join(ROOT, "tools")
            REPORT = os.path.join(TOOLS, "dns_links_report.json")
            PROPOSALS = os.path.join(TOOLS, "link_fix_proposals.json")
            ACTIONS_MD = os.path.join(TOOLS, "link_fix_actions.md")

            def head_status(url: str, timeout: float = 5.0) -> Dict:
                rec = {"url": url, "status": None, "error": None}
                try:
                    req = request.Request(url, method="HEAD", headers={"User-Agent": "qmoi-link-fixer/1.0"})
                    with request.urlopen(req, timeout=timeout) as resp:
                        rec["status"] = resp.getcode()
                        return rec
                except error.HTTPError as he:
                    rec["status"] = he.code
                    rec["error"] = getattr(he, "reason", str(he))
                    return rec
                except Exception as e:
                    rec["error"] = str(e)
                    return rec

            def load_report() -> Dict:
                with open(REPORT, "r", encoding="utf-8") as fh:
                    return json.load(fh)

            def find_candidates(report: Dict) -> List[Dict]:
                candidates: List[Dict] = []
                for r in report.get("results", []):
                    url = r.get("url")
                    if not url:
                        continue
                    if url.lower().startswith("http://"):
                        https = "https://" + url[len("http://") :]
                        h = head_status(https)
                        status = h.get("status")
                        if isinstance(status, int) and 200 <= status < 400:
                            candidates.append({"http": url, "https": https, "status": status, "files": r.get("file") or r.get("files")})
                return candidates

            def backup_file(path: str):
                bak = path + ".bak"
                if not os.path.exists(bak):
                    shutil.copy2(path, bak)

            def apply_replacements(candidates: List[Dict]) -> List[Dict]:
                actions = []
                mapping = {c["http"]: c["https"] for c in candidates}
                urls = sorted(mapping.keys(), key=len, reverse=True)
                inv_path = os.path.join(TOOLS, "dns_docs_inventory.json")
                files_to_scan: List[str] = []
                if os.path.exists(inv_path):
                    try:
                        with open(inv_path, "r", encoding="utf-8") as fh:
                            inv = json.load(fh)
                            for p in (inv.get("inventory") or {}).keys():
                                files_to_scan.append(os.path.join(ROOT, p))
                    except Exception:
                        files_to_scan = []

                if not files_to_scan:
                    for dirpath, dirnames, filenames in os.walk(ROOT):
                        if any(x in dirpath for x in ("/.git", "/node_modules", "/.venv")):
                            continue
                        for fn in filenames:
                            if fn.lower().endswith(".md"):
                                files_to_scan.append(os.path.join(dirpath, fn))

                if not urls:
                    return actions

                url_re = re.compile(r"(" + "|".join(re.escape(u) for u in urls) + r")")

                for path in files_to_scan:
                    try:
                        with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                            txt = fh.read()
                    except Exception:
                        continue
                    if not url_re.search(txt):
                        continue
                    new_txt = txt
                    changed = False
                    for http_url, https_url in mapping.items():
                        if http_url in new_txt:
                            new_txt = new_txt.replace(http_url, https_url)
                            changed = True
                    if changed:
                        backup_file(path)
                        with open(path, "w", encoding="utf-8") as fh:
                            fh.write(new_txt)
                        actions.append({"file": os.path.relpath(path, ROOT), "changed": True})

                return actions

            def git_commit_branch(branch_name: str, message: str) -> bool:
                try:
                    subprocess.check_call(["git", "checkout", "-b", branch_name])
                except subprocess.CalledProcessError:
                    try:
                        subprocess.check_call(["git", "checkout", branch_name])
                    except subprocess.CalledProcessError:
                        return False
                try:
                    subprocess.check_call(["git", "add", "-A"])
                    subprocess.check_call(["git", "commit", "-m", message])
                    return True
                except subprocess.CalledProcessError:
                    return False

            def main():
                if not os.path.exists(REPORT):
                    print("Report not found at", REPORT)
                    raise SystemExit(1)
                report = load_report()
                candidates = find_candidates(report)
                summary = {"generated_at": time.time(), "candidates": candidates}
                with open(PROPOSALS, "w", encoding="utf-8") as fh:
                    json.dump(summary, fh, indent=2)

                if not candidates:
                    md = f"# Link Fix Actions\n\nNo trivial http->https candidates found. Generated: {datetime.utcnow().isoformat()}Z\n"
                    with open(ACTIONS_MD, "w", encoding="utf-8") as fh:
                        fh.write(md)
                    print("No candidates found; wrote proposals file.")
                    return

                actions = apply_replacements(candidates)
                branch = "auto/link-fixes-" + datetime.utcnow().strftime("%Y%m%d-%H%M%S")
                committed = git_commit_branch(branch, "Auto: apply trivial http->https link fixes")

                md_lines = ["# Link Fix Actions\n", f"Generated: {datetime.utcnow().isoformat()}Z\n", "\n", "## Candidates\n"]
                for c in candidates:
                    md_lines.append(f"- {c['http']} -> {c['https']} status={c['status']} files={c.get('files')}\n")
                md_lines.append("\n## Applied changes\n")
                if actions:
                    for a in actions:
                        md_lines.append(f"- Updated `{a['file']}`\n")
                else:
                    md_lines.append("- No files changed\n")
                md_lines.append(f"\nBranch created: {branch} committed: {committed}\n")

                with open(ACTIONS_MD, "w", encoding="utf-8") as fh:
                    fh.writelines(md_lines)

                print("Wrote proposals:", PROPOSALS)
                print("Wrote actions:", ACTIONS_MD)
                if committed:
                    print("Committed changes on branch", branch)
                else:
                    print("No commit created (no changes or git failure). Check working tree.")

            if __name__ == "__main__":
                main()

