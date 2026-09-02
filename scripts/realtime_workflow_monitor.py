#!/usr/bin/env python3
"""
🔴 REALTIME GITHUB WORKFLOW MONITOR
=====================================
Monitors the Ollama Autonomous Agent workflow execution in GitHub in real-time.
Tracks job status, agent behavior, test results, quality metrics, and performance.
"""

import os
import sys
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import re

# Color codes for terminal output
class Colors:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    
    # Status colors
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    MAGENTA = '\033[95m'
    WHITE = '\033[97m'
    
    # Background
    BG_GREEN = '\033[102m'
    BG_YELLOW = '\033[103m'
    BG_RED = '\033[101m'
    BG_BLUE = '\033[104m'

class JobStatus(Enum):
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SUCCESS = "success"
    FAILURE = "failure"
    SKIPPED = "skipped"
    CANCELLED = "cancelled"

@dataclass
class MetricSnapshot:
    """Captures a single moment in time of workflow metrics"""
    timestamp: str
    elapsed_seconds: int
    jobs_total: int
    jobs_completed: int
    jobs_in_progress: int
    jobs_passed: int
    jobs_failed: int
    completion_percent: float
    overall_status: str
    
class WorkflowMonitor:
    """
    Real-time monitor for Ollama PR Validation workflow running in GitHub.
    
    Features:
    - Live job status tracking
    - Test result aggregation
    - Performance metrics collection
    - Quality/reliability scoring
    - Automatic alerts on failures
    - Detailed logging
    """
    
    def __init__(self, run_id: str, repo: str = "thealphakenya/qmoi-enhanced", 
                 token: Optional[str] = None, update_interval: int = 10):
        self.run_id = run_id
        self.repo = repo
        self.token = token or self._resolve_token()
        self.update_interval = update_interval
        self.track_dir = Path(__file__).resolve().parent.parent / "ollamatracks"
        self.track_dir.mkdir(parents=True, exist_ok=True)
        
        self.start_time = None
        self.end_time = None
        self.job_history: Dict[str, List[Dict[str, Any]]] = {}
        self.metrics_history: List[MetricSnapshot] = []
        self.current_status = None
        self.current_conclusion = None
        self.jobs_snapshot = []
        
        self._setup_gh_token()
        self._write_tracker_snapshot("monitor_initialized", "Realtime workflow monitor initialized", "initializing", "startup", {})
    
    def _resolve_token(self) -> str:
        """Resolve GitHub token from environment with priority order"""
        precedence = ['MY_CUSTOM_TOKEN', 'MY_CUTOM_TOKEN', 'GITHUB_TOKEN', 'GH_TOKEN']
        for env_var in precedence:
            token = os.environ.get(env_var)
            if token:
                return token
        raise ValueError("No GitHub token found in environment")
    
    def _setup_gh_token(self):
        """Configure gh CLI with the token"""
        if not self.token:
            return
        os.environ['GH_TOKEN'] = self.token
        os.environ['MY_CUSTOM_TOKEN'] = self.token
    
    def _run_gh_command(self, cmd: str) -> Dict[str, Any]:
        """Execute gh CLI command and return parsed JSON with retry/backoff for transient failures."""
        last_error = None
        for attempt in range(1, 4):
            try:
                full_cmd = f"GH_PAGER=cat gh {cmd}"
                result = subprocess.run(
                    full_cmd,
                    shell=True,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                if result.returncode == 0 and result.stdout.strip():
                    try:
                        return json.loads(result.stdout)
                    except json.JSONDecodeError:
                        last_error = f"JSON decode failed on attempt {attempt}: {result.stdout[:200]}"
                else:
                    last_error = f"gh command returned code {result.returncode}: {result.stderr.strip() or result.stdout.strip()}"
            except Exception as e:
                last_error = f"Error running gh command: {e}"

            if attempt < 3:
                time.sleep(2 * attempt)

        if last_error:
            print(f"{Colors.YELLOW}⚠️ {last_error}{Colors.RESET}")
        return {}
    
    def get_run_status(self) -> Dict[str, Any]:
        """Fetch current run status from GitHub."""
        # gh run view supports fields like number, status, conclusion, jobs, etc.
        # runNumber is not a valid field name for gh JSON output; using it causes the
        # GitHub CLI to exit with code 1 and triggers the monitor's "Failed to fetch run status" path.
        cmd = f"run view {self.run_id} --repo {self.repo} --json " \
              f"databaseId,displayTitle,status,conclusion,headBranch,createdAt," \
              f"updatedAt,startedAt,url,headSha,number,event,jobs,name"
        data = self._run_gh_command(cmd)
        if not isinstance(data, dict):
            return {}
        return data

    def get_repository_run_overview(self, limit: int = 20) -> Dict[str, Any]:
        """Return the repository-wide status snapshot across active and recent GitHub runs."""
        cmd = (
            f"run list --repo {self.repo} --limit {limit} --json "
            "databaseId,displayTitle,status,conclusion,headBranch,createdAt,updatedAt,"
            "startedAt,url,workflowName,event,name,number"
        )
        data = self._run_gh_command(cmd)
        if not isinstance(data, list):
            return {"runs": [], "active_runs": [], "summary": {"total": 0, "active": 0, "success": 0, "failure": 0}}

        active = [run for run in data if str(run.get("status", "")).lower() in {"queued", "in_progress", "requested", "waiting", "pending"}]
        summary = {
            "total": len(data),
            "active": len(active),
            "success": sum(1 for run in data if str(run.get("conclusion", "")).lower() == "success"),
            "failure": sum(1 for run in data if str(run.get("conclusion", "")).lower() == "failure"),
            "queued": sum(1 for run in data if str(run.get("status", "")).lower() == "queued"),
            "in_progress": sum(1 for run in data if str(run.get("status", "")).lower() == "in_progress"),
        }
        return {"runs": data, "active_runs": active, "summary": summary}

    def monitor_repository_once(self, limit: int = 20) -> Dict[str, Any]:
        """Capture a repository-wide GitHub health summary and persist it to the tracker state."""
        overview = self.get_repository_run_overview(limit=limit)
        summary = overview.get("summary", {})
        self._write_tracker_snapshot(
            "repository_monitor_snapshot",
            "Repository-wide GitHub run monitoring snapshot captured.",
            "monitoring",
            "github_repo",
            {
                "runs_total": summary.get("total", 0),
                "active_runs": summary.get("active", 0),
                "success_runs": summary.get("success", 0),
                "failure_runs": summary.get("failure", 0),
                "queued_runs": summary.get("queued", 0),
                "in_progress_runs": summary.get("in_progress", 0),
            },
        )
        return overview
    
    def get_job_logs(self, job_id: str) -> str:
        """Fetch logs for a specific job"""
        try:
            cmd = f"run view {self.run_id} --repo {self.repo} --log-failed"
            result = subprocess.run(
                f"GH_PAGER=cat gh {cmd}",
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.stdout if result.returncode == 0 else ""
        except Exception as e:
            return f"Error fetching logs: {e}"
    
    def calculate_metrics(self) -> MetricSnapshot:
        """Calculate and return current metrics snapshot"""
        if not self.start_time:
            self.start_time = datetime.now()
        
        elapsed = (datetime.now() - self.start_time).total_seconds()
        
        jobs_total = len(self.jobs_snapshot)
        jobs_completed = sum(1 for j in self.jobs_snapshot if j.get('status') == 'completed')
        active_states = {'in_progress', 'queued', 'requested', 'waiting', 'pending'}
        jobs_in_progress = sum(1 for j in self.jobs_snapshot if j.get('status') in active_states)
        jobs_passed = sum(1 for j in self.jobs_snapshot if j.get('conclusion') == 'success')
        jobs_failed = sum(1 for j in self.jobs_snapshot if j.get('conclusion') == 'failure')
        
        completion_percent = (jobs_completed / jobs_total * 100) if jobs_total > 0 else 0
        
        overall_status = "🔴 Running"
        if self.current_status == 'completed':
            if self.current_conclusion == 'success':
                overall_status = "🟢 Success"
            elif self.current_conclusion == 'failure':
                overall_status = "🔴 Failed"
            else:
                overall_status = "🟡 Cancelled"
        elif self.current_status == 'in_progress':
            overall_status = "🟡 In Progress"
        
        snapshot = MetricSnapshot(
            timestamp=datetime.now().isoformat(),
            elapsed_seconds=int(elapsed),
            jobs_total=jobs_total,
            jobs_completed=jobs_completed,
            jobs_in_progress=jobs_in_progress,
            jobs_passed=jobs_passed,
            jobs_failed=jobs_failed,
            completion_percent=completion_percent,
            overall_status=overall_status
        )
        
        self.metrics_history.append(snapshot)
        return snapshot
    
    def format_duration(self, seconds: int) -> str:
        """Format seconds to human-readable duration"""
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        secs = seconds % 60
        
        if hours > 0:
            return f"{hours}h {minutes}m {secs}s"
        elif minutes > 0:
            return f"{minutes}m {secs}s"
        else:
            return f"{secs}s"
    
    def build_health_summary(self) -> Dict[str, Any]:
        """Build a structured health summary from the current job snapshot."""
        jobs = self.jobs_snapshot or []
        jobs_total = len(jobs)
        jobs_passed = sum(1 for j in jobs if j.get('conclusion') == 'success')
        jobs_failed = sum(1 for j in jobs if j.get('conclusion') == 'failure')
        active_states = {'in_progress', 'queued', 'requested', 'waiting', 'pending'}
        jobs_in_progress = sum(1 for j in jobs if j.get('status') in active_states)
        failed_jobs = [j.get('name') for j in jobs if j.get('conclusion') == 'failure']
        test_jobs = [j for j in jobs if 'test' in (j.get('name', '')).lower() or 'pytest' in (j.get('name', '')).lower()]
        test_summary = {
            "total_test_jobs": len(test_jobs),
            "completed_test_jobs": sum(1 for j in test_jobs if j.get('status') == 'completed'),
            "passing_test_jobs": sum(1 for j in test_jobs if j.get('conclusion') == 'success'),
            "failing_test_jobs": sum(1 for j in test_jobs if j.get('conclusion') == 'failure'),
            "test_job_names": [j.get('name') for j in test_jobs],
        }

        pass_rate = (jobs_passed / jobs_total * 100.0) if jobs_total else 0.0
        reliability_score = max(0.0, min(100.0, pass_rate))

        return {
            "jobs_total": jobs_total,
            "jobs_passed": jobs_passed,
            "jobs_failed": jobs_failed,
            "jobs_in_progress": jobs_in_progress,
            "pass_rate": pass_rate,
            "reliability_score": reliability_score,
            "failed_jobs": failed_jobs,
            "status": self.current_status,
            "conclusion": self.current_conclusion,
            "test_summary": test_summary,
        }

    def get_alerts(self) -> List[str]:
        """Return human-readable alerts for any failed or blocked jobs."""
        alerts: List[str] = []
        for job in self.jobs_snapshot or []:
            if job.get('conclusion') == 'failure':
                alerts.append(f"{job.get('name', 'Unknown job')} failed during validation")
            elif job.get('status') == 'in_progress' and job.get('conclusion') is None:
                alerts.append(f"{job.get('name', 'Unknown job')} is still in progress")
        return alerts

    def build_validation_summary(self) -> Dict[str, Any]:
        """Return a structured view of validation jobs, pass/fail counts, and failed job names."""
        jobs = self.jobs_snapshot or []
        validation_jobs = [
            job for job in jobs
            if 'validate' in (job.get('name', '')).lower() or 'validation' in (job.get('name', '')).lower() or 'test' in (job.get('name', '')).lower()
        ]

        failed_jobs = [job.get('name') for job in validation_jobs if job.get('conclusion') == 'failure']
        successful_jobs = [job.get('name') for job in validation_jobs if job.get('conclusion') == 'success']

        return {
            "validation_jobs_total": len(validation_jobs),
            "validation_jobs_completed": sum(1 for job in validation_jobs if job.get('status') == 'completed'),
            "validation_jobs_failed": len(failed_jobs),
            "validation_jobs_passed": len(successful_jobs),
            "failed_jobs": failed_jobs,
            "successful_jobs": successful_jobs,
            "status": self.current_status,
        }

    def build_recovery_plan(self) -> List[str]:
        """Return actionable remediation guidance for failed validation jobs."""
        alerts: List[str] = []
        validation = self.build_validation_summary()

        if validation["validation_jobs_failed"]:
            alerts.append("Investigate failed validation jobs before retrying the workflow.")
            alerts.append("Retry only after fixing the root cause in the specific failing platform or test stage.")
            alerts.append("Re-run the GitHub validation workflow and monitor the final validation status until all jobs pass.")
        else:
            alerts.append("Validation is stable; continue monitoring for the autonomous agent trigger.")

        if not self.jobs_snapshot:
            alerts.append("No job data loaded yet; wait for the next GitHub status refresh.")

        return alerts

    def get_phase_summary(self) -> Dict[str, Any]:
        """Return the current live phase: tests still running or autonomous agent triggered."""
        jobs = self.jobs_snapshot or []
        active_jobs = [j.get('name') for j in jobs if j.get('status') in {'in_progress', 'queued'}]
        agent_jobs = [j for j in jobs if 'agent' in (j.get('name', '')).lower() or 'trigger' in (j.get('name', '')).lower()]
        test_jobs = [j for j in jobs if 'test' in (j.get('name', '')).lower() or 'validate' in (j.get('name', '')).lower()]

        if agent_jobs:
            agent = agent_jobs[0]
            phase = "autonomous_agent_running"
            if agent.get('status') == 'queued':
                phase = "autonomous_agent_ready"
            return {
                "phase": phase,
                "active_jobs": active_jobs,
                "agent_status": agent.get('status', 'unknown'),
                "tests_status": "active" if test_jobs else "idle",
                "message": "The PR Ollama autonomous agent has started or is queued after successful validation tests.",
            }

        if test_jobs:
            return {
                "phase": "tests_running",
                "active_jobs": active_jobs,
                "agent_status": "not_started",
                "tests_status": "active",
                "message": "GitHub is still in the automated test and validation stage.",
            }

        return {
            "phase": "idle",
            "active_jobs": active_jobs,
            "agent_status": "not_started",
            "tests_status": "idle",
            "message": "No active test or agent jobs are currently running.",
        }

    def build_test_monitor_summary(self) -> Dict[str, Any]:
        """Return a focused summary for GitHub-hosted PR test execution."""
        jobs = self.jobs_snapshot or []
        def is_test_or_validation_job(job_name: str) -> bool:
            name = (job_name or '').lower()
            return 'test' in name or 'pytest' in name or 'validate' in name or 'validation' in name

        test_jobs = [j for j in jobs if is_test_or_validation_job(j.get('name', ''))]
        test_summary = {
            "total_test_jobs": len(test_jobs),
            "completed_test_jobs": sum(1 for j in test_jobs if j.get('status') == 'completed'),
            "passing_test_jobs": sum(1 for j in test_jobs if j.get('conclusion') == 'success'),
            "failing_test_jobs": sum(1 for j in test_jobs if j.get('conclusion') == 'failure'),
            "job_names": [j.get('name') for j in test_jobs],
        }
        return test_summary

    def print_header(self):
        """Print monitor header"""
        print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}")
        print(f"🔴 OLLAMA PR VALIDATION REALTIME MONITOR{Colors.RESET}")
        print(f"{Colors.CYAN}{'='*70}{Colors.RESET}\n")
        print(f"Run ID:     {Colors.BOLD}{self.run_id}{Colors.RESET}")
        print(f"Repository: {Colors.BOLD}{self.repo}{Colors.RESET}")
        print(f"Started:    {datetime.now().isoformat()}")
        print(f"\n{Colors.DIM}Monitoring live workflow execution in GitHub...{Colors.RESET}\n")
    
    def print_job_status(self, jobs: List[Dict[str, Any]]):
        """Print formatted job status table"""
        print(f"{Colors.BOLD}📊 JOB STATUS:{Colors.RESET}\n")
        
        print(f"{'Job Name':<45} {'Status':<15} {'Conclusion':<12}")
        print(f"{'-'*72}")
        
        for job in jobs:
            name = job.get('name', 'Unknown')[:42]
            status = job.get('status', 'unknown')
            conclusion = job.get('conclusion', '-') or '-'
            
            # Color code by status
            if status == 'completed':
                status_color = Colors.GREEN if conclusion == 'success' else Colors.RED
                status_str = f"{status_color}✅ {status}{Colors.RESET}"
            elif status == 'in_progress':
                status_str = f"{Colors.YELLOW}⏳ {status}{Colors.RESET}"
            else:
                status_str = f"{Colors.BLUE}⏸️  {status}{Colors.RESET}"
            
            conclusion_display = f"{Colors.GREEN}✓ {conclusion}{Colors.RESET}" if conclusion == 'success' else \
                                f"{Colors.RED}✗ {conclusion}{Colors.RESET}" if conclusion == 'failure' else \
                                f"{Colors.YELLOW}-{Colors.RESET}"
            
            print(f"{name:<45} {status_str:<30} {conclusion_display:<12}")
        
        print()
    
    def print_metrics(self, metrics: MetricSnapshot):
        """Print formatted metrics"""
        print(f"{Colors.BOLD}📈 METRICS:{Colors.RESET}\n")
        
        print(f"Overall Status:     {metrics.overall_status}")
        print(f"Elapsed Time:       {Colors.BOLD}{self.format_duration(metrics.elapsed_seconds)}{Colors.RESET}")
        print(f"Completion:         {Colors.BOLD}{metrics.completion_percent:.1f}%{Colors.RESET} " \
              f"({metrics.jobs_completed}/{metrics.jobs_total} jobs)")
        print(f"Jobs Passed:        {Colors.GREEN}{metrics.jobs_passed}{Colors.RESET}")
        print(f"Jobs Failed:        {Colors.RED}{metrics.jobs_failed}{Colors.RESET}")
        print(f"Jobs In Progress:   {Colors.YELLOW}{metrics.jobs_in_progress}{Colors.RESET}")
        print()
    
    def print_quality_report(self, metrics: MetricSnapshot):
        """Print quality and reliability metrics"""
        print(f"{Colors.BOLD}⭐ QUALITY METRICS:{Colors.RESET}\n")
        
        # Calculate pass rate
        total_jobs = metrics.jobs_total
        passed = metrics.jobs_passed
        pass_rate = (passed / total_jobs * 100) if total_jobs > 0 else 0
        
        # Calculate speed (jobs per minute)
        elapsed_minutes = metrics.elapsed_seconds / 60.0
        speed = (metrics.jobs_completed / elapsed_minutes) if elapsed_minutes > 0 else 0
        
        # Reliability score (0-100)
        reliability = (passed / total_jobs * 100) if total_jobs > 0 else 0
        
        print(f"Pass Rate:          {Colors.GREEN if pass_rate >= 90 else Colors.YELLOW}" \
              f"{pass_rate:.1f}%{Colors.RESET}")
        print(f"Reliability Score:  {Colors.GREEN if reliability >= 90 else Colors.YELLOW}" \
              f"{reliability:.1f}/100{Colors.RESET}")
        print(f"Processing Speed:   {Colors.BOLD}{speed:.2f} jobs/min{Colors.RESET}")
        
        if elapsed_minutes > 0:
            avg_job_time = metrics.elapsed_seconds / metrics.jobs_completed if metrics.jobs_completed > 0 else 0
            print(f"Avg Job Duration:   {Colors.BOLD}{self.format_duration(int(avg_job_time))}{Colors.RESET}")

        test_summary = self.build_test_monitor_summary()
        print(f"Test Jobs:          {Colors.BOLD}{test_summary['total_test_jobs']}{Colors.RESET}")
        print(f"Passing Test Jobs:  {Colors.GREEN}{test_summary['passing_test_jobs']}{Colors.RESET}")
        print(f"Failing Test Jobs:  {Colors.RED}{test_summary['failing_test_jobs']}{Colors.RESET}")
        print(f"Active Test Jobs:   {Colors.YELLOW}{sum(1 for j in test_summary['job_names'] if j and j.lower())}{Colors.RESET}")

        print()
    
    def print_alerts(self):
        """Print any alerts or warnings"""
        if not self.jobs_snapshot:
            return
        
        failed_jobs = [j for j in self.jobs_snapshot if j.get('conclusion') == 'failure']
        
        if failed_jobs:
            print(f"{Colors.BOLD}{Colors.RED}⚠️ ALERTS:{Colors.RESET}\n")
            for job in failed_jobs:
                print(f"{Colors.RED}✗ {job.get('name')} FAILED{Colors.RESET}")
            print()
    
    def monitor_once(self) -> bool:
        """
        Perform one monitoring cycle and return True if still running, False if complete.
        """
        data = self.get_run_status()

        if not data:
            print(f"{Colors.RED}Failed to fetch run status from GitHub API. The run may still be starting or the CLI response may be temporarily empty.{Colors.RESET}")
            return True

        self.current_status = data.get('status', 'unknown')
        self.current_conclusion = data.get('conclusion', '')
        self.jobs_snapshot = data.get('jobs', []) or []
        self._write_tracker_snapshot(
            'workflow_status_snapshot',
            f"GitHub workflow run is {self.current_status}",
            self.current_status,
            'monitoring',
            {'jobs': len(self.jobs_snapshot), 'conclusion': self.current_conclusion},
        )
        
        # Clear screen and print update
        os.system('clear' if os.name != 'nt' else 'cls')
        
        self.print_header()
        self.print_job_status(self.jobs_snapshot)

        phase = self.get_phase_summary()
        print(f"{Colors.BOLD}📡 LIVE PHASE:{Colors.RESET} {phase['phase']}")
        print(f"{Colors.DIM}{phase['message']}{Colors.RESET}")
        if phase.get('active_jobs'):
            print(f"Active jobs: {', '.join(phase['active_jobs'])}")
        print()
        
        metrics = self.calculate_metrics()
        self.print_metrics(metrics)
        self.print_quality_report(metrics)

        validation_summary = self.build_validation_summary()
        print(f"{Colors.BOLD}✅ VALIDATION SUMMARY:{Colors.RESET}")
        print(f"Total validation jobs: {validation_summary['validation_jobs_total']}")
        print(f"Passed: {validation_summary['validation_jobs_passed']}")
        print(f"Failed: {validation_summary['validation_jobs_failed']}")
        if validation_summary["failed_jobs"]:
            print(f"Failed jobs: {', '.join(validation_summary['failed_jobs'])}")
        print()

        recovery_plan = self.build_recovery_plan()
        print(f"{Colors.BOLD}🛠️ RECOVERY PLAN:{Colors.RESET}")
        for item in recovery_plan:
            print(f"- {item}")
        print()

        self.print_alerts()
        
        # Footer
        print(f"{Colors.DIM}Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Updating every {self.update_interval} seconds (Ctrl+C to stop){Colors.RESET}\n")
        
        # GitHub workflow runs commonly sit in queued/requested/waiting states
        # before they move to in_progress. Treat all active states as still running.
        active_statuses = {'queued', 'in_progress', 'requested', 'waiting', 'pending'}
        return self.current_status in active_statuses
    
    def run_continuous(self, max_duration: int = 3600):
        """
        Continuously monitor the workflow until it completes or timeout.
        
        Args:
            max_duration: Maximum monitoring duration in seconds (default 1 hour)
        """
        self.print_header()
        
        start_monitor_time = time.time()
        last_status = None
        status_change_count = 0
        
        try:
            while True:
                elapsed_total = time.time() - start_monitor_time
                
                # Check timeout
                if elapsed_total > max_duration:
                    print(f"{Colors.YELLOW}⏱️ Monitoring timeout reached ({self.format_duration(int(max_duration))})"\
                          f"{Colors.RESET}")
                    break
                
                is_running = self.monitor_once()
                
                # Track status changes
                if self.current_status != last_status:
                    status_change_count += 1
                    last_status = self.current_status
                
                if not is_running:
                    print(f"\n{Colors.GREEN}{Colors.BOLD}✅ Workflow execution COMPLETE{Colors.RESET}\n")
                    print(f"Final Status: {self.current_status}")
                    print(f"Conclusion: {self.current_conclusion or 'N/A'}")
                    break
                
                time.sleep(self.update_interval)
        
        except KeyboardInterrupt:
            print(f"\n{Colors.YELLOW}Monitoring stopped by user{Colors.RESET}\n")
        
        # Final report
        self._print_final_report(status_change_count)
    
    def _print_final_report(self, status_changes: int):
        """Print final monitoring report"""
        print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}")
        print(f"📋 FINAL MONITORING REPORT{Colors.RESET}")
        print(f"{Colors.CYAN}{'='*70}{Colors.RESET}\n")
        
        if self.metrics_history:
            final_metrics = self.metrics_history[-1]
            
            print(f"Total Monitoring Duration: {Colors.BOLD}{self.format_duration(final_metrics.elapsed_seconds)}{Colors.RESET}")
            print(f"Status Changes Observed:   {Colors.BOLD}{status_changes}{Colors.RESET}")
            print(f"Final Status:              {final_metrics.overall_status}")
            print(f"Jobs Completed:            {Colors.BOLD}{final_metrics.jobs_completed}/{final_metrics.jobs_total}{Colors.RESET}")
            print(f"Jobs Passed:               {Colors.GREEN}{final_metrics.jobs_passed}{Colors.RESET}")
            print(f"Jobs Failed:               {Colors.RED}{final_metrics.jobs_failed}{Colors.RESET}")
            
            if final_metrics.jobs_total > 0:
                pass_rate = (final_metrics.jobs_passed / final_metrics.jobs_total) * 100
                print(f"Pass Rate:                 {Colors.GREEN if pass_rate == 100 else Colors.YELLOW}" \
                      f"{pass_rate:.1f}%{Colors.RESET}")
            
            print()
        
        # Save report to file
        self._save_report()
    
    def _write_tracker_snapshot(self, event: str, description: str, status: str, phase: str, details: Dict[str, Any]) -> None:
        """Persist the live workflow monitor state into the ollamatracks directory."""
        timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        self.track_dir.mkdir(parents=True, exist_ok=True)
        (self.track_dir / 'CURRENT_STATUS.txt').write_text(
            "OLLAMA AUTONOMOUS AGENT - CURRENT STATUS\n"
            "=========================================\n\n"
            f"Timestamp UTC: {timestamp}\n\n"
            f"Repository: {self.repo}\n"
            f"Run ID: {self.run_id}\n"
            f"Current status: {status}\n"
            f"Phase: {phase}\n"
            f"Latest event: {event}\n"
            f"Description: {description}\n\n"
            "This is a mutable current-state projection.\n",
            encoding='utf-8',
        )
        (self.track_dir / 'LATEST_ACTIVITY.txt').write_text(
            "OLLAMA AUTONOMOUS AGENT - LATEST ACTIVITY\n"
            "==========================================\n\n"
            f"Timestamp UTC: {timestamp}\n"
            f"Event: {event}\n"
            f"Description: {description}\n"
            f"Repository: {self.repo}\n"
            f"Tracker run: {self.run_id}\n"
            f"Status: {status}\n"
            f"Phase: {phase}\n\n"
            "This is a mutable current-state projection.\n",
            encoding='utf-8',
        )
        (self.track_dir / 'STATE.txt').write_text(
            f"status: {status}\nphase: {phase}\nevent: {event}\ndescription: {description}\nlast_updated_utc: {timestamp}\n",
            encoding='utf-8',
        )
        (self.track_dir / 'PR_STATUS.txt').write_text(
            f"PR Status: {status}\nPhase: {phase}\nEvent: {event}\nRun ID: {self.run_id}\nLast update UTC: {timestamp}\n",
            encoding='utf-8',
        )
        (self.track_dir / 'LAST_RECONCILIATION.txt').write_text(
            f"{timestamp} | {event} | {status} | {phase} | {description}\n",
            encoding='utf-8',
        )
        telemetry_line = {
            'timestamp_utc': timestamp,
            'event': event,
            'status': status,
            'phase': phase,
            'description': description,
            'details': details,
            'run_id': self.run_id,
            'repository': self.repo,
        }
        with (self.track_dir / 'telemetry.jsonl').open('a', encoding='utf-8') as handle:
            handle.write(json.dumps(telemetry_line, default=str, sort_keys=True) + '\n')

    def _save_report(self):
        """Save monitoring report to JSON file"""
        try:
            report = {
                'run_id': self.run_id,
                'repository': self.repo,
                'started_at': self.start_time.isoformat() if self.start_time else None,
                'monitoring_samples': len(self.metrics_history),
                'metrics_history': [asdict(m) for m in self.metrics_history],
                'final_jobs': self.jobs_snapshot,
                'final_status': self.current_status,
                'final_conclusion': self.current_conclusion,
            }
            
            report_file = f'/tmp/workflow_monitor_{self.run_id}.json'
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            
            self._write_tracker_snapshot(
                'monitor_report_saved',
                'Monitoring report persisted to JSON and tracker state files',
                self.current_status or 'completed',
                'report',
                {'report_file': report_file, 'jobs_total': len(self.jobs_snapshot)},
            )
            print(f"{Colors.GREEN}✅ Report saved to: {report_file}{Colors.RESET}\n")
        except Exception as e:
            print(f"{Colors.YELLOW}⚠️ Failed to save report: {e}{Colors.RESET}\n")

def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='🔴 Real-time GitHub Workflow Monitor for Ollama PR Validation',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s 31834413057
  %(prog)s 31834413057 --interval 5 --duration 1800
  %(prog)s 31834413057 --repo owner/repo --token YOUR_TOKEN
        """
    )
    
    parser.add_argument('run_id', help='GitHub workflow run ID to monitor')
    parser.add_argument('--repo', default='thealphakenya/qmoi-enhanced',
                        help='Repository in format owner/repo')
    parser.add_argument('--interval', type=int, default=10,
                        help='Update interval in seconds (default: 10)')
    parser.add_argument('--duration', type=int, default=3600,
                        help='Maximum monitoring duration in seconds (default: 3600)')
    parser.add_argument('--token', help='GitHub token (auto-resolved if not provided)')
    parser.add_argument('--all', action='store_true',
                        help='Monitor the repository-wide GitHub activity instead of a single run')
    
    args = parser.parse_args()

    if args.all:
        monitor = WorkflowMonitor(
            run_id="repo-wide-monitor",
            repo=args.repo,
            token=args.token,
            update_interval=args.interval,
        )
        print(json.dumps(monitor.monitor_repository_once(limit=20), indent=2))
        raise SystemExit(0)
    
    monitor = WorkflowMonitor(
        run_id=args.run_id,
        repo=args.repo,
        token=args.token,
        update_interval=args.interval
    )
    
    monitor.run_continuous(max_duration=args.duration)

if __name__ == '__main__':
    main()
