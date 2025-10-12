import os
import requests
import time
import subprocess
import json

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "thealphakenya/qmoi-enhanced"
API_URL = f"https://api.github.com/repos/{REPO}"
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}

def get_failed_workflows():
    resp = requests.get(f"{API_URL}/actions/runs?status=failure", headers=HEADERS)
    if resp.status_code == 200:
        return resp.json().get("workflow_runs", [])
    return []

def get_all_workflows():
    resp = requests.get(f"{API_URL}/actions/workflows", headers=HEADERS)
    if resp.status_code == 200:
        return resp.json().get("workflows", [])
    return []

def get_run_logs(run_id):
    resp = requests.get(f"{API_URL}/actions/runs/{run_id}/logs", headers=HEADERS)
    if resp.status_code == 200:
        log_file = f"workflow_log_{run_id}.zip"
        with open(log_file, "wb") as f:
            f.write(resp.content)
        return log_file
    return None

def fix_workflow_file(workflow_path):
    # Use auto_lint_fix.py to auto-fix YAML and logic errors
    subprocess.call(["python3", "scripts/auto_lint_fix.py", workflow_path, "--autofix"])

def re_run_workflow(run_id):
    resp = requests.post(f"{API_URL}/actions/runs/{run_id}/rerun", headers=HEADERS)
    return resp.status_code == 201

def main():
    print("🔄 QMOI Workflow AutoFix: Scanning for failed workflows...")
    failed = get_failed_workflows()
    if not failed:
        print("✅ No failed workflows detected.")
        return
    for run in failed:
        name = run['name']
        run_id = run['id']
        workflow_id = run['workflow_id']
        print(f"❌ Workflow failed: {name} (run_id={run_id})")
        # Download and analyze logs (future: use LLM for deeper analysis)
        log_file = get_run_logs(run_id)
        # Find workflow file
        workflows = get_all_workflows()
        wf_file = None
        for wf in workflows:
            if wf['id'] == workflow_id:
                wf_file = wf['path']
                break
        if wf_file:
            print(f"🔧 Attempting to auto-fix: {wf_file}")
            fix_workflow_file(wf_file)
        else:
            print("⚠️ Could not determine workflow file for run.")
        # Re-run workflow
        print(f"🔁 Re-running workflow run_id={run_id}")
        if re_run_workflow(run_id):
            print("✅ Workflow re-run triggered.")
        else:
            print("❌ Failed to re-trigger workflow.")
        time.sleep(5)
    print("🧠 QMOI will learn from fixes and improve next time.")

if __name__ == "__main__":
    main()