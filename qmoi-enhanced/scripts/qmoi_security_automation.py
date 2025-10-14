#!/usr/bin/env python3
"""
QMOI Security Automation Script
Fetches GitHub security alerts, runs npm audit fix and snyk wizard, and creates a report.
Integrates with master automation.
"""
import os
import sys
import json
import subprocess
from datetime import datetime
import requests

GITHUB_REPO = os.environ.get("GITHUB_REPO", "thealphakenya/Alpha-Q-ai")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
REPORT_PATH = "reports/security_automation_report.json"


def fetch_github_alerts():
    headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
    url = f"https://api.github.com/repos/{GITHUB_REPO}/dependabot/alerts"
    try:
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            return resp.json()
        else:
            return []
    except Exception as e:
        print(f"[SecurityAutomation] Failed to fetch GitHub alerts: {e}")
        return []


def run_npm_audit_fix():
    try:
        result = subprocess.run(
            ["npm", "audit", "fix", "--force"],
            capture_output=True,
            text=True,
            timeout=300,
        )
        return {
            "success": result.returncode == 0,
            "output": result.stdout + result.stderr,
        }
    except Exception as e:
        return {"success": False, "output": str(e)}


def run_snyk_wizard():
    try:
        result = subprocess.run(
            ["snyk", "wizard", "--all-projects", "--quiet"],
            capture_output=True,
            text=True,
            timeout=600,
        )
        return {
            "success": result.returncode == 0,
            "output": result.stdout + result.stderr,
        }
    except Exception as e:
        return {"success": False, "output": str(e)}


def main():
    report = {
        "timestamp": datetime.now().isoformat(),
        "github_alerts": [],
        "npm_audit_fix": {},
        "snyk_wizard": {},
        "summary": "",
    }
    print("[SecurityAutomation] Fetching GitHub security alerts...")
    alerts = fetch_github_alerts()
    report["github_alerts"] = alerts
    print(f"[SecurityAutomation] {len(alerts)} alerts fetched.")

    print("[SecurityAutomation] Running npm audit fix...")
    audit_result = run_npm_audit_fix()
    report["npm_audit_fix"] = audit_result
    print(f"[SecurityAutomation] npm audit fix success: {audit_result['success']}")

    print("[SecurityAutomation] Running snyk wizard...")
    snyk_result = run_snyk_wizard()
    report["snyk_wizard"] = snyk_result
    print(f"[SecurityAutomation] snyk wizard success: {snyk_result['success']}")

    unresolved = [a for a in alerts if a.get("state") != "fixed"]
    if unresolved:
        report["summary"] = (
            f"{len(unresolved)} unresolved vulnerabilities remain. Manual review recommended."
        )
    else:
        report["summary"] = "All known vulnerabilities addressed."

    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    with open(REPORT_PATH, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[SecurityAutomation] Report written to {REPORT_PATH}")


if __name__ == "__main__":
    main()
