#!/usr/bin/env python3
"""
Poll PR #94 check-runs; if all checks succeed, merge the PR.
If checks completed with failures, download failing job logs, extract common errors
and run the conservative autofix tool `tools/auto_fix_build.py --log tools/build.log --apply`.
"""
from __future__ import annotations
import json
import os
import sys
import time
import urllib.request
import urllib.error
import subprocess

REPO = "thealphakenya/qmoi-enhanced"
PR = 94
SHA = "ca504564ce765a3d278b4ea14d07164a566d3432"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    print("GITHUB_TOKEN env required")
    sys.exit(1)

HEADERS = {"Accept": "application/vnd.github+json", "Authorization": f"token {GITHUB_TOKEN}"}

API_BASE = f"https://api.github.com/repos/{REPO}"


def api_get(path: str):
    req = urllib.request.Request(f"{API_BASE}{path}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def api_put(path: str, data: dict | None = None):
    data_bytes = None
    if data is not None:
        data_bytes = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(f"{API_BASE}{path}", data=data_bytes, headers={**HEADERS, "Content-Type": "application/json"}, method="PUT")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def api_post(path: str, data: dict):
    data_bytes = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(f"{API_BASE}{path}", data=data_bytes, headers={**HEADERS, "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def poll_check_runs(sha: str, polls: int = 12, delay: int = 10):
    last = None
    for i in range(polls):
        print(f"poll {i+1}/{polls}: {time.ctime()}")
        runs = api_get(f"/commits/{sha}/check-runs")
        last = runs
        conclusions = [r.get("conclusion") for r in runs.get("check_runs", [])]
        statuses = [r.get("status") for r in runs.get("check_runs", [])]
        all_success = bool(conclusions) and all(c == "success" for c in conclusions)
        any_failure = any(c == "failure" for c in conclusions)
        all_completed = bool(statuses) and all(s == "completed" for s in statuses)
        print(f"  all_success={all_success} any_failure={any_failure} all_completed={all_completed}")
        if all_success:
            return "success", runs
        if any_failure and all_completed:
            return "failed", runs
        time.sleep(delay)
    return "timeout", last


def download_job_logs(job_id: int, out_path: str):
    url = f"https://api.github.com/repos/{REPO}/actions/jobs/{job_id}/logs"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        # save as file
        with open(out_path, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print("Failed to download logs for", job_id, e)
        return False


def extract_errors_from_log_file(path: str) -> list[str]:
    patterns = ["ModuleNotFoundError", "No module named", "Cannot find module", "Can't resolve", "Process completed with exit code", "The server is busy"]
    found = []
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for ln in f:
                for p in patterns:
                    if p in ln:
                        found.append(ln.rstrip())
    except Exception as e:
        print("Error reading log", path, e)
    return found


def main():
    status, runs = poll_check_runs(SHA, polls=12, delay=10)
    if status == "success":
        print("All checks success — merging PR")
        try:
            resp = api_put(f"/pulls/{PR}/merge", {"commit_title": "chore: merge auto/vercel-fix (automerge)", "merge_method": "merge"})
            print("Merge response:", resp)
        except urllib.error.HTTPError as e:
            print("Merge failed:", e.read())
        return
    if status == "timeout":
        print("Timeout waiting for checks; exiting")
        return
    # failed
    print("Checks failed; gathering logs for failing check-runs")
    os.makedirs("tools/job_logs", exist_ok=True)
    found_any = False
    for cr in runs.get("check_runs", []):
        if cr.get("conclusion") != "failure":
            continue
        job_id = cr.get("id")
        out = f"tools/job_logs/job_{job_id}.log"
        ok = download_job_logs(job_id, out)
        if not ok:
            continue
        # logs may be compressed .zip or text; try to read as text
        # if it's binary (zip), still try to find plaintext patterns by reading
        errs = extract_errors_from_log_file(out)
        if errs:
            found_any = True
            with open("tools/build.log", "a", encoding="utf-8") as bf:
                bf.write(f"\n===== job {job_id} annotations =====\n")
                for e in errs:
                    bf.write(e + "\n")
    if not found_any:
        print("No actionable patterns found in job logs; exiting")
        return
    # run autofix tool
    print("Running tools/auto_fix_build.py --log tools/build.log --apply")
    try:
        subprocess.run([sys.executable, "tools/auto_fix_build.py", "--log", "tools/build.log", "--apply"], check=False)
    except Exception as e:
        print("Autofix run failed:", e)

    # if a branch exists starting with auto/vercel-fix, push and open PR
    try:
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"]).decode().strip()
    except Exception:
        branch = ""
    if branch.startswith("auto/vercel-fix"):
        print("Autofix branch detected:", branch)
        try:
            subprocess.check_call(["git", "push", "-u", "origin", branch])
        except Exception as e:
            print("Failed to push branch:", e)
        # create PR
        title = "chore: attempt vercel build fix - from logs"
        body = "Automated attempt to fix build failures detected in CI logs. See tools/build.log for details."
        try:
            resp = api_post("/pulls", {"title": title, "head": branch, "base": "autosync-backup-20250926-232440", "body": body})
            print("Created PR:", resp.get("html_url"))
        except Exception as e:
            print("Failed to create PR:", e)
    else:
        print("No autofix branch created by tool; nothing to push/create PR for.")


if __name__ == "__main__":
    main()
