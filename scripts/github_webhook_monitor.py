#!/usr/bin/env python3
"""GitHub Webhook Monitor for Ollama Autonomous Agent

Monitors GitHub Actions workflows, PR status, issues, and commits in real-time.
Provides webhook handlers and status tracking for agent execution.
"""
from __future__ import annotations

import json
import os
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
import hashlib
import hmac

# Configure logging
logger = logging.getLogger("github-webhook-monitor")
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('[%(asctime)s] %(levelname)s: %(message)s'))
logger.addHandler(handler)
logger.setLevel(logging.INFO)

ROOT = Path(__file__).resolve().parents[1]


class GitHubWebhookMonitor:
    """Monitor GitHub events related to Ollama agent execution."""

    def __init__(self, workspace: Path = ROOT):
        self.workspace = Path(workspace)
        self.activity_log = self.workspace / "GITHUB_WEBHOOK_LOG.md"
        self.status_file = self.workspace / "GITHUB_AGENT_STATUS.json"
        self.webhook_secret = os.environ.get("GITHUB_WEBHOOK_SECRET", "")
        self.ensure_status_file()

    def ensure_status_file(self):
        """Ensure status tracking file exists."""
        if not self.status_file.exists():
            status = {
                "created": datetime.utcnow().isoformat() + "Z",
                "last_workflow_run": None,
                "workflow_runs": [],
                "pr_events": [],
                "commit_events": [],
                "agent_state": "idle",
                "monitoring_enabled": True
            }
            self.status_file.write_text(json.dumps(status, indent=2), encoding="utf-8")
            logger.info("Created GitHub status tracking file")

    def load_status(self) -> Dict[str, Any]:
        """Load current GitHub status."""
        try:
            return json.loads(self.status_file.read_text(encoding="utf-8"))
        except Exception as e:
            logger.warning(f"Failed to load status file: {e}")
            return {}

    def save_status(self, status: Dict[str, Any]):
        """Save GitHub status."""
        try:
            self.status_file.write_text(json.dumps(status, indent=2), encoding="utf-8")
        except Exception as e:
            logger.error(f"Failed to save status file: {e}")

    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify GitHub webhook signature for security."""
        if not self.webhook_secret:
            logger.warning("No webhook secret configured; skipping signature verification")
            return True

        expected_sig = "sha256=" + hmac.new(
            self.webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(signature, expected_sig)

    def handle_workflow_event(self, event: Dict[str, Any]) -> None:
        """Handle GitHub Actions workflow event."""
        workflow = event.get("workflow_run", {})
        name = workflow.get("name", "unknown")
        status = workflow.get("status", "unknown")
        conclusion = workflow.get("conclusion", "unknown")
        run_number = workflow.get("run_number", 0)

        status_data = self.load_status()
        status_data["last_workflow_run"] = {
            "name": name,
            "status": status,
            "conclusion": conclusion,
            "run_number": run_number,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        # Track workflow runs
        if "workflow_runs" not in status_data:
            status_data["workflow_runs"] = []
        status_data["workflow_runs"].append(status_data["last_workflow_run"])

        self.save_status(status_data)
        self.append_activity_log(
            f"**Workflow {name}**: {status} ({conclusion})",
            level="workflow"
        )
        logger.info(f"Workflow event: {name} - {status} ({conclusion})")

    def handle_push_event(self, event: Dict[str, Any]) -> None:
        """Handle GitHub push event."""
        ref = event.get("ref", "unknown")
        branch = ref.split("/")[-1] if "/" in ref else ref
        commits = event.get("commits", [])

        status_data = self.load_status()
        status_data["commit_events"].append({
            "branch": branch,
            "commit_count": len(commits),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
        self.save_status(status_data)

        self.append_activity_log(
            f"**Push to {branch}**: {len(commits)} commit(s)",
            level="push"
        )
        logger.info(f"Push event on {branch}: {len(commits)} commits")

    def handle_pull_request_event(self, event: Dict[str, Any]) -> None:
        """Handle GitHub pull request event."""
        action = event.get("action", "unknown")
        pr = event.get("pull_request", {})
        number = pr.get("number", 0)
        title = pr.get("title", "unknown")
        state = pr.get("state", "unknown")

        status_data = self.load_status()
        status_data["pr_events"].append({
            "number": number,
            "action": action,
            "state": state,
            "title": title,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        })
        self.save_status(status_data)

        self.append_activity_log(
            f"**PR #{number}**: {action} ({state}) - {title}",
            level="pr"
        )
        logger.info(f"PR event: #{number} {action} ({state})")

    def handle_issue_event(self, event: Dict[str, Any]) -> None:
        """Handle GitHub issue event."""
        action = event.get("action", "unknown")
        issue = event.get("issue", {})
        number = issue.get("number", 0)
        title = issue.get("title", "unknown")

        self.append_activity_log(
            f"**Issue #{number}**: {action} - {title}",
            level="issue"
        )
        logger.info(f"Issue event: #{number} {action}")

    def append_activity_log(self, message: str, level: str = "info") -> None:
        """Append to GitHub webhook activity log."""
        timestamp = datetime.utcnow().isoformat() + "Z"
        log_entry = f"- [{timestamp}] [{level.upper()}] {message}\n"

        try:
            with open(self.activity_log, "a", encoding="utf-8") as f:
                f.write(log_entry)
        except Exception as e:
            logger.error(f"Failed to write activity log: {e}")

    def get_agent_status_summary(self) -> str:
        """Get current agent status summary."""
        status_data = self.load_status()

        workflow_runs = len(status_data.get("workflow_runs", []))
        pr_events = len(status_data.get("pr_events", []))
        commit_events = len(status_data.get("commit_events", []))
        agent_state = status_data.get("agent_state", "idle")

        last_run = status_data.get("last_workflow_run")
        if last_run:
            last_run_info = f"Last workflow: {last_run.get('name')} ({last_run.get('conclusion')})"
        else:
            last_run_info = "No workflow runs yet"

        summary = f"""
## GitHub Agent Status

- **Agent State**: {agent_state}
- **Workflow Runs**: {workflow_runs}
- **PR Events**: {pr_events}
- **Commit Events**: {commit_events}
- {last_run_info}
- **Last Updated**: {datetime.utcnow().isoformat()}Z
"""
        return summary.strip()

    def trigger_github_check(self, commit_sha: str, status: str, description: str) -> None:
        """Trigger a GitHub check for a specific commit."""
        self.append_activity_log(
            f"**Check triggered** for {commit_sha[:7]}: {status} - {description}",
            level="check"
        )
        logger.info(f"Check triggered: {commit_sha[:7]} - {status}")


class AgentExecutionMonitor:
    """Monitor Ollama agent execution and GitHub integration."""

    def __init__(self, workspace: Path = ROOT):
        self.workspace = Path(workspace)
        self.webhook_monitor = GitHubWebhookMonitor(workspace)
        self.execution_log = workspace / "AGENT_EXECUTION_MONITOR.md"
        self.ensure_monitoring_enabled()

    def ensure_monitoring_enabled(self):
        """Ensure monitoring is enabled."""
        if not self.execution_log.exists():
            header = """# Agent Execution Monitor

Real-time tracking of Ollama autonomous agent execution status and GitHub integration.

## Status Timeline
"""
            self.execution_log.write_text(header, encoding="utf-8")

    def log_execution_stage(self, stage: str, status: str, details: str = "") -> None:
        """Log agent execution stage."""
        timestamp = datetime.utcnow().isoformat() + "Z"
        entry = f"\n### {timestamp} - {stage}\n"
        entry += f"- Status: {status}\n"
        if details:
            entry += f"- Details: {details}\n"

        try:
            with open(self.execution_log, "a", encoding="utf-8") as f:
                f.write(entry)
            self.webhook_monitor.append_activity_log(
                f"**Execution**: {stage} - {status}",
                level="execution"
            )
        except Exception as e:
            logger.error(f"Failed to log execution stage: {e}")

    def get_execution_summary(self) -> str:
        """Get agent execution summary."""
        try:
            if not self.execution_log.exists():
                return "No execution data available"

            content = self.execution_log.read_text(encoding="utf-8")
            return content[-1000:] if len(content) > 1000 else content
        except Exception as e:
            logger.error(f"Failed to get execution summary: {e}")
            return "Error retrieving execution summary"

    def create_status_badge(self) -> str:
        """Create a GitHub status badge markdown."""
        status_data = self.webhook_monitor.load_status()
        agent_state = status_data.get("agent_state", "idle")

        badge_map = {
            "running": "🟠 Running",
            "completed": "🟢 Completed",
            "error": "🔴 Error",
            "idle": "⚫ Idle"
        }

        return f"![Ollama Agent Status]({badge_map.get(agent_state, '⚫ Unknown')})"


def main():
    """Main monitoring entry point."""
    logger.info("GitHub Webhook Monitor starting...")

    monitor = GitHubWebhookMonitor()
    exec_monitor = AgentExecutionMonitor()

    # Log startup
    exec_monitor.log_execution_stage(
        "Monitoring Initialization",
        "started",
        "GitHub webhook and agent execution monitoring enabled"
    )

    # Output status summary
    summary = monitor.get_agent_status_summary()
    logger.info(f"Current status:\n{summary}")

    print(summary)


if __name__ == "__main__":
    main()
