#!/usr/bin/env python3
"""
Improved sync orchestrator for GitHub Actions.

Features:
- safer HTTP handling with timeouts
- detailed debug output files (/tmp/sync_orchestrator_*.json)
- retries with exponential backoff
- clearer exit codes and messages

Usage: python3 scripts/sync_orchestrator.py <public_owner> <branch> <sha>
Environment: UPSTREAM_PAT must be set to a token that can create PRs on the upstream repo
"""
import json
import sys
import time
import urllib.request
import urllib.error
import os


TIMEOUT = 15


def http_post(url, token, payload):
    data = payload.encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'token {token}')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            body = resp.read().decode('utf-8')
            return resp.getcode(), body
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8')
        except Exception:
            body = ''
        return e.code, body
    except Exception as e:
        return None, str(e)


def http_get(url, token):
    req = urllib.request.Request(url, method='GET')
    req.add_header('Authorization', f'token {token}')
    req.add_header('Accept', 'application/vnd.github.v3+json')
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            body = resp.read().decode('utf-8')
            return resp.getcode(), body
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8')
        except Exception:
            body = ''
        return e.code, body
    except Exception as e:
        return None, str(e)


def save_json(path, data):
    try:
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f'Warning: failed to write {path}: {e}', file=sys.stderr)


def main():
    if len(sys.argv) < 4:
        print('usage: sync_orchestrator.py <public_owner> <branch> <sha>', file=sys.stderr)
        sys.exit(2)

    public_owner = sys.argv[1]
    branch = sys.argv[2]
    sha = sys.argv[3]

    token = os.environ.get('UPSTREAM_PAT')
    debug_dir = '/tmp'
    result_path = os.path.join(debug_dir, 'sync_orchestrator_result.json')
    full_path = os.path.join(debug_dir, 'sync_orchestrator_full.json')

    result = {
        'public_owner': public_owner,
        'branch': branch,
        'sha': sha,
        'attempts': [],
        'created_pr_url': None,
        'existing_prs': [],
        'errors': [],
    }

    if not token:
        err = 'UPSTREAM_PAT not set in environment'
        print(err, file=sys.stderr)
        result['errors'].append(err)
        save_json(result_path, result)
        sys.exit(1)

    upstream_api = 'https://api.github.com/repos/thealphakenya/qmoi-enhanced'

    # list open PRs
    list_url = f"{upstream_api}/pulls?state=open&per_page=100"
    code, body = http_get(list_url, token)
    result['list_prs_http_code'] = code
    try:
        prs = json.loads(body) if body else []
    except Exception:
        prs = []
        result['errors'].append('Failed parsing PR list')

    for p in prs:
        head_label = p.get('head', {}).get('label')
        if head_label == f"{public_owner}:{branch}":
            result['existing_prs'].append(p.get('html_url'))

    # write a snapshot of the list response
    save_json(full_path, {'list_prs_http_code': code, 'list_prs_body': prs})

    if result['existing_prs']:
        result['message'] = 'Existing PR(s) found'
        save_json(result_path, result)
        print('Existing PR found:', result['existing_prs'])
        sys.exit(0)

    # create PR
    create_url = f"{upstream_api}/pulls"
    payload_obj = {
        'title': f'Sync from public repo: {sha}',
        'head': f'{public_owner}:{branch}',
        'base': 'main',
        'body': f'Automated sync from public repo {public_owner}/{branch} ({sha}).'
    }
    payload = json.dumps(payload_obj)

    max_attempts = 4
    sleep = 2
    for attempt in range(1, max_attempts + 1):
        code, body = http_post(create_url, token, payload)
        entry = {'attempt': attempt, 'http_code': code, 'response': None}
        try:
            entry['response'] = json.loads(body) if body else None
        except Exception:
            entry['response'] = body
        result['attempts'].append(entry)

        # capture latest full response to file
        save_json(full_path, result)

        if code == 201:
            result['created_pr_url'] = entry['response'].get('html_url') if isinstance(entry['response'], dict) else None
            save_json(result_path, result)
            print('PR created:', result['created_pr_url'])
            sys.exit(0)

        # If 422 with a message indicating an existing PR or similar, treat as success
        if code == 422 and isinstance(entry['response'], dict):
            # examples: "Validation Failed" with errors
            save_json(result_path, result)
            print('422 response from API; check response body for details')
            sys.exit(0)

        # collect error details
        result['errors'].append({'attempt': attempt, 'http_code': code, 'response': entry['response']})

        if attempt < max_attempts:
            time.sleep(sleep)
            sleep *= 2

    # all attempts exhausted
    save_json(result_path, result)
    print(f'Failed to create PR after {max_attempts} attempts; see {result_path}', file=sys.stderr)
    sys.exit(1)


if __name__ == '__main__':
    main()
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
