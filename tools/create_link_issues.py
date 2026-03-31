// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Create GitHub issues for top link-check failures.

Reads tools/dns_links_report.json, groups failures by file, and opens an issue
per file listing the failing URLs. Uses GITHUB_TOKEN from the environment.

Be conservative: creates up to --max-files issues (default 20) and labels them
with `auto/link-check` for easy filtering.
"""
from __future__ import annotations
import json, os, sys, time
from urllib import request, parse

REPO = os.environ.get("GITHUB_REPOSITORY", "thestablekenya/qmoi-enhanced")
TOKEN = os.environ.get("GITHUB_TOKEN")

def load_report(path="tools/dns_links_report.json"):
    if not os.path.exists(path):
        print("Report not found:", path); sys.exit(1)
    return json.load(open(path, "r", encoding="utf-8"))

def group_failures(report):
    groups = {}
    for r in report.get("results", []):
        file = r.get("file") or "(root)"
        status = r.get("status")
        err = r.get("error")
        resolved = r.get("resolved_ips")
        is_fail = (err is not None) or (isinstance(status, int) and status >= 400) or (not resolved)
        if not is_fail:
            continue
        groups.setdefault(file, []).append(r)
    # sort by number of failures desc
    items = sorted(groups.items(), key=lambda kv: -len(kv[1]))
    return items

def issue_exists(title):
    # list open issues and check for identical title (paginated optimized)
    url = f"https://api.github.com/repos/{REPO}/issues?state=open&per_page=100"
    req = request.Request(url, headers={"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github+json"})
    try:
        with request.urlopen(req, timeout=10) as resp:
            data = json.load(resp)
    except Exception:
        return False
    for i in data:
        if i.get("title") == title:
            return True
    return False

def create_issue(title, body, labels=["auto/link-check"]):
    url = f"https://api.github.com/repos/{REPO}/issues"
    payload = json.dumps({"title": title, "body": body, "labels": labels}).encode("utf-8")
    req = request.Request(url, data=payload, method="POST", headers={"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github+json", "Content-Type": "application/json"})
    try:
        with request.urlopen(req, timeout=10) as resp:
            return json.load(resp)
    except Exception as e:
        print("Failed to create issue:", e)
        return None

def main(max_files=20):
    if not TOKEN:
        print("GITHUB_TOKEN not found in environment. Cannot create issues.")
        sys.exit(1)
    report = load_report()
    groups = group_failures(report)
    if not groups:
        print("No failures found. Nothing to do.")
        return
    created = []
    for file, failures in groups[:max_files]:
        title = f"Link-check: {len(failures)} failing link(s) in {file}"
        if issue_exists(title):
            print("Issue already exists, skipping:", title)
            continue
        lines = [f"Automated report generated: {time.ctime(report.get('generated_at', time.time()))}", "", f"File: `{file}`", "", "Failing links:", ""]
        for f in failures:
            lines.append(f"- {f.get('url')}  — status: {f.get('status')}  error: {f.get('error')}  resolved: {f.get('resolved_ips')}")
        body = "\n".join(lines)
        resp = create_issue(title, body)
        if resp and resp.get("html_url"):
            print("Created issue:", resp.get("html_url"))
            created.append(resp.get("html_url"))
        else:
            print("Failed to create issue for", file)
    print(f"Done. Created {len(created)} issues.")

if __name__ == "__main__":
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--max-files", type=int, default=20)
    args = p.parse_args()
    main(max_files=args.max_files)
