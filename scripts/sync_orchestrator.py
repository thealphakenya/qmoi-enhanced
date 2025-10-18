#!/usr/bin/env python3
"""
Lightweight sync orchestrator used by the GitHub Action.
"""
import os
import sys
import time
import json
import requests

UPSTREAM_OWNER = "thealphakenya"
UPSTREAM_REPO = "qmoi-enhanced"

UPSTREAM_PAT = os.environ.get("UPSTREAM_PAT")
GITHUB_REPOSITORY = os.environ.get("GITHUB_REPOSITORY")
GITHUB_REPOSITORY_OWNER = os.environ.get("GITHUB_REPOSITORY_OWNER")
GITHUB_SHA = os.environ.get("GITHUB_SHA")

if not UPSTREAM_PAT:
    print("ERROR: UPSTREAM_PAT not provided", file=sys.stderr)
    sys.exit(2)

SYNC_BRANCH = os.environ.get("SYNC_BRANCH") or f"sync-from-public-{(GITHUB_SHA or 'unknown')[:8]}"

API_URL = f"https://api.github.com/repos/{UPSTREAM_OWNER}/{UPSTREAM_REPO}/pulls"
HEAD_REF = f"{GITHUB_REPOSITORY_OWNER}:{SYNC_BRANCH}"
TITLE = f"Sync from public repo: {GITHUB_SHA or 'unknown'}"
BODY = f"Automated sync from public repo {GITHUB_REPOSITORY} ({GITHUB_SHA})."

session = requests.Session()
session.headers.update({
    "Authorization": f"token {UPSTREAM_PAT}",
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "qmoi-sync-orchestrator"
})

result = {"attempts": []}

max_attempts = int(os.environ.get("SYNC_MAX_ATTEMPTS", "4"))
wait = int(os.environ.get("SYNC_WAIT_SECONDS", "2"))

for attempt in range(1, max_attempts + 1):
    try:
        resp = session.post(API_URL, json={"title": TITLE, "head": HEAD_REF, "base": "main", "body": BODY}, timeout=30)
        result["attempts"].append({"attempt": attempt, "status_code": resp.status_code, "body": resp.text})
        if resp.status_code == 201:
            print("PR created:", resp.json().get("html_url"))
            result["created"] = resp.json()
            break
        else:
            print(f"Attempt {attempt} failed: HTTP {resp.status_code}")
    except Exception as e:
        result["attempts"].append({"attempt": attempt, "error": str(e)})
        print(f"Attempt {attempt} raised exception: {e}")
    time.sleep(wait)
    wait *= 2

# Dump result to file for workflow artifact upload
out_path = "/tmp/sync_orchestrator_result.json"
with open(out_path, "w") as f:
    json.dump(result, f, indent=2)

print("Wrote debug summary to", out_path)

if not result.get("created"):
    print("PR not created after attempts", file=sys.stderr)
    sys.exit(1)

print("Success")
