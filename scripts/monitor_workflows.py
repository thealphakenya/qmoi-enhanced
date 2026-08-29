#!/usr/bin/env python3
"""
Real-Time GitHub Workflow Monitoring

Monitors all 8 GitHub workflows in real-time until completion.
Updates status dashboard and github.md with live progress.
"""

import json
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple

class GitHubWorkflowMonitor:
    """Monitor GitHub Actions workflows in real-time."""
    
    def __init__(self, repo: str = "thealphakenya/qmoi-enhanced"):
        self.repo = repo
        self.gh_token = os.getenv("GITHUB_TOKEN", "")
        self.workflows = [
            "ollama-pr-validation.yml",
            "ollama-master-orchestrator.yml",
            "ollama-autonomous-agent.yml",
            "ollama-autonomous-agent-realtime-monitor.yml",
            "branch-sync.yml",
            "auto-merge-automated-pr.yml",
            "pr-monitor.yml",
            "workflow-tracker.yml",
        ]
    
    def run_gh_command(self, args: List[str]) -> Tuple[int, str, str]:
        """Run a GitHub CLI command."""
        cmd = ["gh"] + args
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env={**os.environ, "GITHUB_TOKEN": self.gh_token}
        )
        return result.returncode, result.stdout, result.stderr
    
    def get_latest_runs(self, workflow: str, limit: int = 5) -> List[Dict]:
        """Get latest runs for a workflow."""
        returncode, stdout, stderr = self.run_gh_command([
            "run", "list",
            "-R", self.repo,
            "-w", workflow,
            "-L", str(limit),
            "--json", "number,status,conclusion,createdAt,name,headBranch,event"
        ])
        
        if returncode != 0:
            return []
        
        try:
            return json.loads(stdout)
        except json.JSONDecodeError:
            return []
    
    def get_run_details(self, run_id: str) -> Dict:
        """Get detailed information about a workflow run."""
        returncode, stdout, stderr = self.run_gh_command([
            "run", "view",
            str(run_id),
            "-R", self.repo,
            "--json", "number,name,status,conclusion,createdAt,updatedAt,jobs,headBranch,event,databaseId"
        ])
        
        if returncode != 0:
            return {}
        
        try:
            return json.loads(stdout)
        except json.JSONDecodeError:
            return {}
    
    def get_job_details(self, run_id: str, job_id: str) -> Dict:
        """Get job logs and status."""
        returncode, stdout, stderr = self.run_gh_command([
            "run", "view",
            str(run_id),
            "-R", self.repo,
            "--log-failed"
        ])
        
        return {"logs": stdout, "stderr": stderr}
    
    def monitor_workflow_run(self, run_id: str, timeout_minutes: int = 240) -> Dict:
        """Monitor a single workflow run until completion."""
        print(f"\n📊 Monitoring run {run_id}...")
        start_time = time.time()
        timeout_seconds = timeout_minutes * 60
        
        while True:
            run = self.get_run_details(run_id)
            
            if not run:
                print(f"❌ Could not fetch run details for {run_id}")
                return {"status": "failed", "reason": "Could not fetch run details"}
            
            status = run.get("status", "unknown")
            conclusion = run.get("conclusion", "unknown")
            
            # Print status
            if status == "in_progress":
                print(f"  ⏳ Status: IN PROGRESS ({time.strftime('%H:%M:%S')})")
                # Print job statuses
                jobs = run.get("jobs", [])
                for job in jobs:
                    job_status = job.get("status", "unknown")
                    job_conclusion = job.get("conclusion", "unknown")
                    job_name = job.get("name", "unknown")
                    
                    if job_status == "in_progress":
                        print(f"    ⚙️  {job_name}: IN PROGRESS")
                    elif job_conclusion == "success":
                        print(f"    ✅ {job_name}: SUCCESS")
                    elif job_conclusion == "failure":
                        print(f"    ❌ {job_name}: FAILED")
                    else:
                        print(f"    ⏳ {job_name}: {job_status}")
            
            elif status == "completed":
                if conclusion == "success":
                    print(f"  ✅ Run SUCCEEDED")
                    return {"status": "success", "run": run}
                else:
                    print(f"  ❌ Run FAILED ({conclusion})")
                    return {"status": "failed", "run": run}
            
            # Check timeout
            elapsed = time.time() - start_time
            if elapsed > timeout_seconds:
                print(f"  ⏱️  TIMEOUT after {timeout_minutes} minutes")
                return {"status": "timeout"}
            
            # Wait before next check
            time.sleep(30)
    
    def format_status_for_markdown(self, workflow: str, runs: List[Dict]) -> str:
        """Format workflow status for markdown."""
        if not runs:
            return f"| {workflow} | ❓ NO RUNS | - | - |\n"
        
        latest = runs[0]
        status = latest.get("status", "unknown").upper()
        conclusion = latest.get("conclusion", "unknown").upper()
        created = latest.get("createdAt", "unknown")
        
        # Emoji based on conclusion
        if conclusion == "SUCCESS":
            emoji = "✅"
        elif conclusion == "FAILURE":
            emoji = "❌"
        elif status == "IN_PROGRESS":
            emoji = "⏳"
        else:
            emoji = "❓"
        
        return f"| {workflow} | {emoji} {conclusion} | {status} | {created[:10]} |\n"
    
    def generate_status_report(self) -> str:
        """Generate a markdown status report for all workflows."""
        report = f"""# GitHub Workflows Real-Time Status Report

**Generated**: {datetime.now().isoformat()}  
**Repository**: thealphakenya/qmoi-enhanced  
**Branch**: main  

## Workflow Status

| Workflow | Result | Status | Updated |
|----------|--------|--------|---------|
"""
        
        for workflow in self.workflows:
            runs = self.get_latest_runs(workflow, limit=1)
            report += self.format_status_for_markdown(workflow, runs)
        
        return report
    
    def monitor_all_workflows(self) -> Dict:
        """Monitor all workflows until they complete."""
        print("\n" + "="*70)
        print("REAL-TIME GITHUB WORKFLOW MONITORING")
        print("="*70)
        
        results = {}
        
        for workflow in self.workflows:
            print(f"\n📋 Checking latest run for: {workflow}")
            runs = self.get_latest_runs(workflow, limit=1)
            
            if not runs:
                print(f"  ⚠️  No runs found for {workflow}")
                results[workflow] = {"status": "not-found"}
                continue
            
            latest = runs[0]
            run_number = latest.get("number", "?")
            status = latest.get("status", "unknown")
            conclusion = latest.get("conclusion", "unknown")
            
            print(f"  Run #{run_number}: {status} ({conclusion})")
            
            if status == "in_progress":
                # Monitor until completion
                result = self.monitor_workflow_run(str(run_number))
                results[workflow] = result
            else:
                # Already completed
                results[workflow] = {
                    "status": conclusion,
                    "run": latest
                }
        
        return results
    
    def generate_summary(self, results: Dict) -> None:
        """Generate and print summary of all workflow results."""
        print("\n" + "="*70)
        print("WORKFLOW EXECUTION SUMMARY")
        print("="*70)
        
        passed = 0
        failed = 0
        pending = 0
        
        for workflow, result in results.items():
            status = result.get("status", "unknown")
            
            if status == "success":
                print(f"✅ {workflow}: SUCCESS")
                passed += 1
            elif status == "failed":
                print(f"❌ {workflow}: FAILED")
                failed += 1
            else:
                print(f"⏳ {workflow}: {status.upper()}")
                pending += 1
        
        print(f"\nTotal: {passed} passed, {failed} failed, {pending} pending")
        
        if failed == 0 and pending == 0:
            print("\n🎉 ALL WORKFLOWS SUCCESSFUL!")
            return True
        else:
            print(f"\n⚠️  {failed} workflow(s) failed, {pending} pending")
            return False

def main():
    """Main monitoring routine."""
    monitor = GitHubWorkflowMonitor()
    
    # Check if we have GitHub token
    if not monitor.gh_token:
        print("⚠️  GITHUB_TOKEN not set. Set it to enable monitoring.")
        print("   export GITHUB_TOKEN=<your-token>")
        print("\n📖 For now, here's what to monitor:")
        print("   1. Go to: https://github.com/thealphakenya/qmoi-enhanced/actions")
        print("   2. Watch for these workflows:")
        for wf in monitor.workflows:
            print(f"      - {wf}")
        print("   3. Wait until all show ✅ green checkmarks")
        print("   4. Check OLLAMA_SUCCESS.json in run artifacts")
        return 0
    
    # Monitor all workflows
    results = monitor.monitor_all_workflows()
    
    # Generate and print summary
    all_success = monitor.generate_summary(results)
    
    return 0 if all_success else 1

if __name__ == "__main__":
    sys.exit(main())
