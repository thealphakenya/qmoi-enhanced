// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Rerun workflow runs for PR #94 head SHA, then poll check-runs and attempt merge or autofix.
"""
from __future__ import annotations
import json, os, sys, time, urllib.request, urllib.error, subprocess

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

def api_post(path: str, data=None):
    data_bytes = None
    if data is not None:
        data_bytes = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(f"{API_BASE}{path}", data=data_bytes, headers={**HEADERS, "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors='ignore')
        print(f"HTTPError POST {path}: {e.code} {e.reason} - {body}")
        return None

def get_workflow_runs_for_sha(sha: str):
    # search recent workflow runs by head_sha
    runs = api_get(f"/actions/runs?per_page=50&head_sha={sha}")
    return runs.get("workflow_runs", [])

def rerun_workflow_run(run_id: int):
    print(f"Requesting rerun for workflow run {run_id}")
    resp = api_post(f"/actions/runs/{run_id}/rerun")
    if resp is None:
        print(f"Rerun request for {run_id} may have failed or returned non-JSON response")
    else:
        print(f"Rerun response for {run_id}: {resp}")

def poll_check_runs(sha: str, polls=36, delay=10):
    for i in range(polls):
        print(f"poll {i+1}/{polls}: {time.ctime()}")
        runs = api_get(f"/commits/{sha}/check-runs")
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
    return "timeout", runs

def download_job_logs(job_id: int, out_path: str):
    url = f"https://api.github.com/repos/{REPO}/actions/jobs/{job_id}/logs"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        with open(out_path, "wb") as f:
            f.write(data)
        return True
    except urllib.error.HTTPError as e:
        print(f"Failed downloading logs for {job_id}: {e.code} {e.reason} - {e.read().decode(errors='ignore')}")
        return False
    except Exception as e:
        print("Failed downloading logs for", job_id, e)
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

def run_autofix_on_build_log():
    print("Running tools/auto_fix_build.py --log tools/build.log --apply")
    subprocess.run([sys.executable, "tools/auto_fix_build.py", "--log", "tools/build.log", "--apply"], check=False)

def main():
    runs = get_workflow_runs_for_sha(SHA)
    if not runs:
        print("No workflow runs found for SHA. Exiting.")
        return
    print(f"Found {len(runs)} workflow runs for SHA")
    for wr in runs:
        rid = wr.get("id")
        status = wr.get("status")
        conclusion = wr.get("conclusion")
        print(f"  run id={rid} status={status} conclusion={conclusion}")
        try:
            rerun_workflow_run(rid)
        except Exception as e:
            print("Rerun request failed for", rid, e)
    print("Waiting 10s before polling check-runs...")
    time.sleep(10)
    status, runs = poll_check_runs(SHA, polls=36, delay=10)
    if status == "success":
        print("All checks success — merging PR")
        try:
            merge_resp = api_post(f"/pulls/{PR}/merge", data={"commit_title": "chore: merge auto/vercel-fix (automerge)", "merge_method": "merge"})
            print("Merge response:", merge_resp)
        except Exception as e:
            print("Merge failed:", e)
        return
    if status == "timeout":
        print("Timeout waiting for checks; exiting")
        return
    # failed: download logs
    print("Checks failed; downloading failing job logs")
    os.makedirs("tools/job_logs", exist_ok=True)
    open("tools/build.log", "w").close()
    found_any = False
    for cr in runs.get("check_runs", []):
        if cr.get("conclusion") != "failure":
            continue
        job_id = cr.get("id")
        out = f"tools/job_logs/job_{job_id}.log"
        ok = download_job_logs(job_id, out)
        if not ok:
            continue
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
    run_autofix_on_build_log()
    # attempt to find and push branch if created
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
        title = "chore: attempt vercel build fix - from rerun logs"
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
