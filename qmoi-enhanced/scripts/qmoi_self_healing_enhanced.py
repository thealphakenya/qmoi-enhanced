#!/usr/bin/env python3
"""
QMOI Self-Healing Enhanced System
Monitors logs, detects errors, and automatically applies fixes or triggers deeper diagnostics and self-repair routines.
"""
import os
import sys
import json
import time
import logging
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

LOG_PATH = "logs/qmoi_self_healing.log"
ERROR_LOGS = [
    "logs/qcity_device_manager.log",
    "logs/qcity_unlimited_installer.log",
    "logs/github_actions_autofix.log",
    "logs/qmoi_automation.log",
    "logs/qmoi_evolution.log",
]
REPORT_PATH = "reports/self_healing_report.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(LOG_PATH), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class QMOISelfHealing:
    def __init__(self):
        self.error_patterns = [
            "Traceback (most recent call last):",
            "ERROR",
            "Exception",
            "failed",
            "not found",
            "timeout",
            "dependency",
            "permission denied",
            "unresolved",
            "critical",
            "fatal",
            "requires pip",
            "pip is too old",
            "peer dependency",
            "peeroptional",
            "overriding peer dependency",
            "npm error code etarget",
            "no matching version found",
            "could not resolve dependency",
        ]
        self.fixes_applied = []
        self.errors_detected = []
        self.diagnostics_run = []
        self.start_time = datetime.now().isoformat()

    def scan_logs(self) -> List[Dict]:
        """Scan logs for error patterns"""
        errors = []
        for log_file in ERROR_LOGS:
            if not os.path.exists(log_file):
                continue
            with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
                for i, line in enumerate(lines):
                    for pattern in self.error_patterns:
                        if pattern.lower() in line.lower():
                            errors.append(
                                {
                                    "file": log_file,
                                    "line": i + 1,
                                    "content": line.strip(),
                                    "pattern": pattern,
                                }
                            )
        return errors

    def apply_fixes(self, errors: List[Dict]) -> List[Dict]:
        """Apply automated fixes for detected errors"""
        fixes = []
        for error in errors:
            fix = None
            content = error["content"].lower()
            if (
                "dependency" in content
                or "not found" in content
                or "peer dependency" in content
                or "peeroptional" in content
                or "overriding peer dependency" in content
                or "npm error code etarget" in content
                or "no matching version found" in content
                or "could not resolve dependency" in content
            ):
                fix = self.fix_npm_dependencies(error)
            elif "requires pip" in content or "pip is too old" in content:
                fix = self.upgrade_pip(error)
            elif "permission denied" in content:
                fix = self.fix_permissions(error)
            elif "timeout" in content:
                fix = self.fix_timeout(error)
            elif "fatal" in content or "critical" in content:
                fix = self.trigger_deep_diagnostics(error)
            elif "exception" in content or "traceback" in content:
                fix = self.trigger_deep_diagnostics(error)
            if fix:
                fixes.append(fix)
        return fixes

    def fix_dependencies(self, error: Dict) -> Dict:
        logger.info(
            f"Attempting to auto-fix dependency issue in {error['file']} (line {error['line']})"
        )
        # Try running pip install -r requirements.txt
        try:
            result = subprocess.run(
                [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
                capture_output=True,
                text=True,
                timeout=300,
            )
            status = "success" if result.returncode == 0 else "failed"
            return {
                "type": "dependency_fix",
                "file": error["file"],
                "line": error["line"],
                "status": status,
                "output": result.stdout + result.stderr,
            }
        except Exception as e:
            return {
                "type": "dependency_fix",
                "file": error["file"],
                "line": error["line"],
                "status": "failed",
                "output": str(e),
            }

    def fix_npm_dependencies(self, error: Dict) -> Dict:
        logger.info(
            f"Attempting to auto-fix npm dependency issue in {error['file']} (line {error['line']})"
        )
        try:
            result = subprocess.run(
                ["npm", "install", "--legacy-peer-deps"],
                capture_output=True,
                text=True,
                timeout=600,
            )
            status = "success" if result.returncode == 0 else "failed"
            return {
                "type": "npm_dependency_fix",
                "file": error["file"],
                "line": error["line"],
                "status": status,
                "output": result.stdout + result.stderr,
            }
        except Exception as e:
            return {
                "type": "npm_dependency_fix",
                "file": error["file"],
                "line": error["line"],
                "status": "failed",
                "output": str(e),
            }

    def upgrade_pip(self, error: Dict) -> Dict:
        logger.info(
            f"Attempting to auto-upgrade pip due to version issue in {error['file']} (line {error['line']})"
        )
        try:
            result = subprocess.run(
                [sys.executable, "-m", "pip", "install", "--upgrade", "pip"],
                capture_output=True,
                text=True,
                timeout=300,
            )
            status = "success" if result.returncode == 0 else "failed"
            return {
                "type": "pip_upgrade",
                "file": error["file"],
                "line": error["line"],
                "status": status,
                "output": result.stdout + result.stderr,
            }
        except Exception as e:
            return {
                "type": "pip_upgrade",
                "file": error["file"],
                "line": error["line"],
                "status": "failed",
                "output": str(e),
            }

    def fix_permissions(self, error: Dict) -> Dict:
        logger.info(
            f"Attempting to auto-fix permission issue in {error['file']} (line {error['line']})"
        )
        # Try chmod 755 on the file
        try:
            file_path = error["file"]
            os.chmod(file_path, 0o755)
            return {
                "type": "permission_fix",
                "file": file_path,
                "line": error["line"],
                "status": "success",
            }
        except Exception as e:
            return {
                "type": "permission_fix",
                "file": error["file"],
                "line": error["line"],
                "status": "failed",
                "output": str(e),
            }

    def fix_timeout(self, error: Dict) -> Dict:
        logger.info(
            f"Attempting to auto-fix timeout issue in {error['file']} (line {error['line']})"
        )
        # Try rerunning the last failed command (if possible)
        # For now, just log and suggest increasing timeout
        return {
            "type": "timeout_fix",
            "file": error["file"],
            "line": error["line"],
            "status": "suggested",
            "suggestion": "Increase timeout or check network connectivity.",
        }

    def trigger_deep_diagnostics(self, error: Dict) -> Dict:
        logger.info(
            f"Triggering deep diagnostics for {error['file']} (line {error['line']})"
        )
        # Run diagnostics script if available
        diagnostics_script = "scripts/qcity_device_manager.py"
        if os.path.exists(diagnostics_script):
            try:
                result = subprocess.run(
                    [sys.executable, diagnostics_script, "--diagnostics"],
                    capture_output=True,
                    text=True,
                    timeout=600,
                )
                self.diagnostics_run.append(diagnostics_script)
                return {
                    "type": "deep_diagnostics",
                    "file": error["file"],
                    "line": error["line"],
                    "status": "completed",
                    "output": result.stdout + result.stderr,
                }
            except Exception as e:
                return {
                    "type": "deep_diagnostics",
                    "file": error["file"],
                    "line": error["line"],
                    "status": "failed",
                    "output": str(e),
                }
        else:
            return {
                "type": "deep_diagnostics",
                "file": error["file"],
                "line": error["line"],
                "status": "skipped",
                "output": "No diagnostics script found.",
            }

    def generate_report(self, errors: List[Dict], fixes: List[Dict]) -> Dict:
        report = {
            "timestamp": datetime.now().isoformat(),
            "errors_detected": errors,
            "fixes_applied": fixes,
            "diagnostics_run": self.diagnostics_run,
            "summary": self.summarize(errors, fixes),
        }
        with open(REPORT_PATH, "w") as f:
            json.dump(report, f, indent=2)
        return report

    def summarize(self, errors, fixes) -> str:
        if not errors:
            return "No errors detected. System healthy."
        return f"Detected {len(errors)} errors, applied {len(fixes)} fixes. See report for details."

    def run(self):
        logger.info("Starting QMOI Self-Healing Automation")
        errors = self.scan_logs()
        self.errors_detected = errors
        fixes = self.apply_fixes(errors)
        self.fixes_applied = fixes
        report = self.generate_report(errors, fixes)
        logger.info(report["summary"])
        print("\nQMOI Self-Healing Report:")
        print(json.dumps(report, indent=2))
        logger.info("QMOI Self-Healing Automation completed.")


if __name__ == "__main__":
    QMOISelfHealing().run()
