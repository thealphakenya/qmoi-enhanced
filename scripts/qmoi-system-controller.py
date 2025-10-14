#!/usr/bin/env python3
"""
QMOI AI System Controller
Central AI system that controls and manages all automated processes
"""

import json
import os
import sys
import asyncio
import logging
import argparse
import subprocess
import time
from typing import Dict, List, Any, Optional
from datetime import datetime
from pathlib import Path
import threading
import queue
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("qmoi_system_controller.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

PERMISSION_AUDIT_LOG = os.path.join(
    os.path.dirname(__file__), "../logs/qmoi_permission_audit.log"
)
QMOI_CRITICAL_FILES = [
    "qmoi-system-controller.py",
    "qmoi-enhanced-controller.py",
    "qmoi_enhanced_ai.py",
    "qmoi_model_enhancer.py",
    "qmoi_earning_daemon.py",
    "qmoi_earning_enhanced.py",
    "qmoi_self_evolve.py",
    "qmoi_auto_evolution.py",
]


class QMOISystemController:
    """QMOI AI System Controller - Central management system"""

    def __init__(self, project_root: str = None):
        self.project_root = project_root or os.getcwd()
        self.logs_dir = os.path.join(self.project_root, "logs")
        self.config_dir = os.path.join(self.project_root, "config")
        self.ensure_dirs()

        # System state
        self.system_state = {
            "active": True,
            "consciousness_level": 0.95,
            "learning_enabled": True,
            "auto_evolution": True,
            "last_activity": datetime.now().isoformat(),
            "startup_time": datetime.now().isoformat(),
            "tasks_completed": 0,
            "errors_fixed": 0,
            "files_processed": 0,
            "system_health": 1.0,
        }

        # Task queue for background processing
        self.task_queue = queue.Queue()
        self.background_thread = None
        self.running = True

        # Load configurations
        self.qmoi_config = self.load_qmoi_config()
        self.lint_config = self.load_lint_config()

        self.check_and_fix_own_permissions()

        self.periodic_permission_check()

        self.dashboard_process = None
        self.ensure_dashboard_running()

        self.dashboard_last_up = time.time()
        self.dashboard_down_since = None
        self.dashboard_health_check_thread = threading.Thread(
            target=self.dashboard_health_check_loop, daemon=True
        )
        self.dashboard_health_check_thread.start()

        logger.info("QMOI AI System Controller initialized")

    def ensure_dirs(self):
        """Ensure required directories exist"""
        for dir_path in [self.logs_dir, self.config_dir]:
            os.makedirs(dir_path, exist_ok=True)

    def load_qmoi_config(self) -> Dict[str, Any]:
        """Load QMOI AI configuration"""
        config_path = os.path.join(self.config_dir, "qmoi_config.json")
        try:
            with open(config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"QMOI config not found, creating default")
            config = self.get_default_qmoi_config()
            self.save_qmoi_config(config)
            return config

    def load_lint_config(self) -> Dict[str, Any]:
        """Load linting configuration"""
        config_path = os.path.join(self.config_dir, "lint_config.json")
        try:
            with open(config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Lint config not found, creating default")
            config = self.get_default_lint_config()
            self.save_lint_config(config)
            return config

    def get_default_qmoi_config(self) -> Dict[str, Any]:
        """Get default QMOI AI configuration"""
        return {
            "ai_model": "qmoi-system-controller-v1",
            "system_capabilities": {
                "lint_automation": True,
                "file_monitoring": True,
                "error_analysis": True,
                "auto_fixing": True,
                "reporting": True,
                "notifications": True,
                "learning": True,
                "evolution": True,
            },
            "performance_settings": {
                "max_concurrent_tasks": 5,
                "task_timeout": 300,
                "memory_limit": "2GB",
                "cpu_limit": 0.8,
            },
            "consciousness_settings": {
                "base_level": 0.9,
                "learning_rate": 0.1,
                "evolution_threshold": 0.8,
                "adaptation_speed": 0.05,
            },
            "notification_settings": {
                "desktop_notifications": True,
                "whatsapp_notifications": True,
                "email_notifications": False,
                "critical_only": False,
            },
            "permission_self_check_interval": 600,
        }

    def get_default_lint_config(self) -> Dict[str, Any]:
        """Get default linting configuration"""
        return {
            "auto_fix_enabled": True,
            "smart_fixes_enabled": True,
            "ai_analysis_enabled": True,
            "file_watching_enabled": True,
            "reporting_enabled": True,
            "notification_enabled": True,
            "fix_strategies": {
                "unused_imports": True,
                "missing_semicolons": True,
                "quote_standardization": True,
                "trailing_spaces": True,
                "indentation": True,
                "console_removal": True,
                "const_conversion": True,
            },
            "file_patterns": {
                "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
                "exclude": ["node_modules/**", "dist/**", "build/**", ".git/**"],
            },
        }

    def save_qmoi_config(self, config: Dict[str, Any]):
        """Save QMOI AI configuration"""
        config_path = os.path.join(self.config_dir, "qmoi_config.json")
        with open(config_path, "w") as f:
            json.dump(config, f, indent=2)

    def save_lint_config(self, config: Dict[str, Any]):
        """Save linting configuration"""
        config_path = os.path.join(self.config_dir, "lint_config.json")
        with open(config_path, "w") as f:
            json.dump(config, f, indent=2)

    async def start_background_processing(self):
        """Start background task processing"""
        self.background_thread = threading.Thread(
            target=self._background_worker, daemon=True
        )
        self.background_thread.start()
        logger.info("Background processing started")

    def _background_worker(self):
        """Background worker for processing tasks"""
        while self.running:
            try:
                task = self.task_queue.get(timeout=1)
                asyncio.run(self._process_task(task))
                self.task_queue.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                logger.error(f"Error in background worker: {e}")

    async def _process_task(self, task: Dict[str, Any]):
        """Process a background task"""
        task_type = task.get("type")
        task_data = task.get("data", {})

        try:
            if task_type == "lint_check":
                await self.run_lint_check()
            elif task_type == "file_watch":
                await self.process_file_change(task_data)
            elif task_type == "error_analysis":
                await self.analyze_errors(task_data)
            elif task_type == "auto_fix":
                await self.apply_auto_fixes(task_data)
            elif task_type == "generate_report":
                await self.generate_report()
            elif task_type == "send_notification":
                await self.send_notification(task_data)
            else:
                logger.warning(f"Unknown task type: {task_type}")

        except Exception as e:
            logger.error(f"Error processing task {task_type}: {e}")
            self.system_state["system_health"] = max(
                0.1, self.system_state["system_health"] - 0.1
            )

    async def run_lint_check(self) -> Dict[str, Any]:
        """Run comprehensive lint check"""
        logger.info("🔍 Running comprehensive lint check...")

        try:
            # Run ESLint
            result = subprocess.run(
                ["yarn", "lint"],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=300,
            )

            if result.returncode == 0:
                logger.info("✅ No linting errors found!")
                return {"status": "clean", "errors": 0}

            # Parse errors
            errors = self.parse_eslint_output(result.stdout + result.stderr)
            logger.info(f"Found {len(errors)} linting issues")

            # Analyze and fix errors
            analysis_results = await self.analyze_and_fix_errors(errors)

            # Update system state
            self.system_state["errors_fixed"] += analysis_results.get(
                "ai_fixes_applied", 0
            )
            self.system_state["files_processed"] += analysis_results.get(
                "files_processed", 0
            )
            self.system_state["tasks_completed"] += 1

            return analysis_results

        except Exception as e:
            logger.error(f"Error in lint check: {e}")
            return {"status": "error", "message": str(e)}

    def parse_eslint_output(self, output: str) -> List[Dict[str, Any]]:
        """Parse ESLint output"""
        errors = []
        lines = output.split("\n")
        current_file = ""

        for line in lines:
            # Extract file path
            if "✖" in line and "problems" in line:
                continue

            file_match = re.match(r"^(.+?)\s+✖", line)
            if file_match:
                current_file = file_match.group(1).strip()
                continue

            # Parse error details
            error_match = re.match(
                r"^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+(.+)$", line
            )
            if error_match:
                errors.append(
                    {
                        "file": current_file,
                        "line": int(error_match.group(1)),
                        "column": int(error_match.group(2)),
                        "severity": error_match.group(3),
                        "rule": error_match.group(4),
                        "message": error_match.group(5).strip(),
                        "timestamp": datetime.now().isoformat(),
                    }
                )

        return errors

    async def analyze_and_fix_errors(
        self, errors: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze and fix errors using AI intelligence"""

        results = {
            "total_errors": len(errors),
            "ai_fixes_applied": 0,
            "manual_fixes_needed": 0,
            "files_processed": 0,
            "processing_time": 0,
        }

        start_time = time.time()
        processed_files = set()

        for error in errors:
            # Analyze error
            analysis = await self.analyze_error(error)

            # Apply fix if possible
            file_path = os.path.join(self.project_root, error.get("file", ""))
            if file_path not in processed_files:
                processed_files.add(file_path)
                results["files_processed"] += 1

            fix_applied = await self.apply_intelligent_fix(file_path, error, analysis)

            if fix_applied:
                results["ai_fixes_applied"] += 1
            else:
                results["manual_fixes_needed"] += 1

        results["processing_time"] = time.time() - start_time

        # Queue notification if there are remaining errors
        if results["manual_fixes_needed"] > 0:
            self.task_queue.put(
                {
                    "type": "send_notification",
                    "data": {
                        "message": f"Manual fixes needed: {results['manual_fixes_needed']} errors",
                        "priority": "medium",
                    },
                }
            )

        return results

    async def analyze_error(self, error: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a single error using AI intelligence"""

        rule = error.get("rule", "")
        message = error.get("message", "")

        analysis = {
            "error_type": self.classify_error_type(rule, message),
            "severity": self.assess_severity(rule, message),
            "fix_strategy": self.determine_fix_strategy(rule, message),
            "confidence": self.calculate_confidence(rule, message),
            "suggested_fix": self.generate_fix_suggestion(rule, message),
            "ai_reasoning": self.generate_ai_reasoning(rule, message),
        }

        return analysis

    def classify_error_type(self, rule: str, message: str) -> str:
        """Classify error type"""
        rule_lower = rule.lower()
        message_lower = message.lower()

        if "no-undef" in rule_lower:
            if "require" in message_lower:
                return "module_import_issue"
            elif "process" in message_lower:
                return "node_global_issue"
            else:
                return "undefined_variable"

        elif "no-unused-vars" in rule_lower:
            return "unused_variable"

        elif "import/no-unresolved" in rule_lower:
            return "import_resolution"

        elif "no-console" in rule_lower:
            return "debugging_code"

        elif "prefer-const" in rule_lower:
            return "variable_declaration"

        else:
            return "general_linting"

    def assess_severity(self, rule: str, message: str) -> str:
        """Assess error severity"""
        critical_rules = ["no-undef", "import/no-unresolved"]
        high_rules = ["no-unused-vars", "no-console", "no-debugger"]

        if any(critical in rule for critical in critical_rules):
            return "critical"
        elif any(high in rule for high in high_rules):
            return "high"
        else:
            return "medium"

    def determine_fix_strategy(self, rule: str, message: str) -> str:
        """Determine fix strategy"""
        rule_lower = rule.lower()

        if "no-console" in rule_lower:
            return "remove_debug_code"
        elif "prefer-const" in rule_lower:
            return "convert_to_const"
        elif "no-unused-vars" in rule_lower:
            return "remove_or_prefix_variable"
        elif "quotes" in rule_lower:
            return "standardize_quotes"
        elif "semi" in rule_lower:
            return "add_semicolon"
        else:
            return "manual_review"

    def calculate_confidence(self, rule: str, message: str) -> float:
        """Calculate fix confidence"""
        high_confidence_rules = ["no-console", "prefer-const", "quotes", "semi"]
        medium_confidence_rules = ["no-unused-vars", "no-trailing-spaces"]

        if any(rule in rule for rule in high_confidence_rules):
            return 0.9
        elif any(rule in rule for rule in medium_confidence_rules):
            return 0.7
        else:
            return 0.5

    def generate_fix_suggestion(self, rule: str, message: str) -> str:
        """Generate fix suggestion"""
        rule_lower = rule.lower()

        if "no-console" in rule_lower:
            return "Remove console statement"
        elif "prefer-const" in rule_lower:
            return "Change 'let' to 'const'"
        elif "no-unused-vars" in rule_lower:
            return "Remove unused variable or prefix with underscore"
        elif "quotes" in rule_lower:
            return "Standardize quote usage"
        elif "semi" in rule_lower:
            return "Add missing semicolon"
        else:
            return "Review and fix manually"

    def generate_ai_reasoning(self, rule: str, message: str) -> str:
        """Generate AI reasoning"""
        rule_lower = rule.lower()

        if "no-console" in rule_lower:
            return "Console statements should be removed in production"
        elif "prefer-const" in rule_lower:
            return "Use const for variables that are not reassigned"
        elif "no-unused-vars" in rule_lower:
            return "Unused variables should be removed or used"
        else:
            return "General linting rule violation"

    async def apply_intelligent_fix(
        self, file_path: str, error: Dict[str, Any], analysis: Dict[str, Any]
    ) -> bool:
        """Apply intelligent fix to a file"""

        try:
            if not os.path.exists(file_path):
                return False

            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            lines = content.split("\n")
            line_index = error.get("line", 1) - 1

            if line_index < 0 or line_index >= len(lines):
                return False

            original_line = lines[line_index]
            modified = False

            fix_strategy = analysis.get("fix_strategy", "")
            confidence = analysis.get("confidence", 0.0)

            # Only apply high-confidence fixes
            if confidence < 0.7:
                return False

            if fix_strategy == "remove_debug_code":
                if "console." in original_line:
                    lines.pop(line_index)
                    modified = True

            elif fix_strategy == "convert_to_const":
                if "let " in original_line and "=" in original_line:
                    new_line = original_line.replace("let ", "const ")
                    lines[line_index] = new_line
                    modified = True

            elif fix_strategy == "remove_or_prefix_variable":
                if re.match(r"^\s*(const|let|var)\s+\w+\s*=", original_line):
                    lines.pop(line_index)
                    modified = True

            if modified:
                new_content = "\n".join(lines)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)

                logger.info(f"Applied fix to {file_path}: {fix_strategy}")
                return True

            return False

        except Exception as e:
            logger.error(f"Error applying fix to {file_path}: {e}")
            return False

    async def process_file_change(self, file_data: Dict[str, Any]):
        """Process file change event"""
        file_path = file_data.get("file")
        change_type = file_data.get("type", "modified")

        logger.info(f"Processing file change: {file_path} ({change_type})")

        # Queue lint check for the changed file
        self.task_queue.put({"type": "lint_check", "data": {"file": file_path}})

    async def generate_report(self):
        """Generate comprehensive system report"""
        logger.info("📊 Generating system report...")

        report = {
            "timestamp": datetime.now().isoformat(),
            "system_state": self.system_state,
            "qmoi_config": self.qmoi_config,
            "lint_config": self.lint_config,
            "performance_metrics": {
                "tasks_completed": self.system_state["tasks_completed"],
                "errors_fixed": self.system_state["errors_fixed"],
                "files_processed": self.system_state["files_processed"],
                "system_health": self.system_state["system_health"],
                "uptime": (
                    datetime.now()
                    - datetime.fromisoformat(self.system_state["startup_time"])
                ).total_seconds(),
            },
        }

        # Save report
        report_path = os.path.join(self.logs_dir, "qmoi_system_report.json")
        with open(report_path, "w") as f:
            json.dump(report, f, indent=2, default=str)

        logger.info(f"Report saved to {report_path}")
        return report

    async def send_notification(self, notification_data: Dict[str, Any]):
        """Send notification"""
        message = notification_data.get("message", "")
        priority = notification_data.get("priority", "info")

        logger.info(f"📢 Sending notification: {message} ({priority})")

        # Desktop notification
        if self.qmoi_config.get("notification_settings", {}).get(
            "desktop_notifications"
        ):
            await self.send_desktop_notification(message, priority)

        # WhatsApp notification for critical issues
        if priority == "critical" and self.qmoi_config.get(
            "notification_settings", {}
        ).get("whatsapp_notifications"):
            await self.send_whatsapp_notification(message)

    async def send_desktop_notification(self, message: str, priority: str):
        """Send desktop notification"""
        try:
            if os.name == "nt":  # Windows
                subprocess.run(
                    [
                        "powershell",
                        "-Command",
                        f'New-BurntToastNotification -Text "QMOI AI", "{message}"',
                    ],
                    capture_output=True,
                )
            elif sys.platform == "darwin":  # macOS
                subprocess.run(
                    [
                        "osascript",
                        "-e",
                        f'display notification "{message}" with title "QMOI AI"',
                    ],
                    capture_output=True,
                )
            else:  # Linux
                subprocess.run(["notify-send", "QMOI AI", message], capture_output=True)
        except Exception as e:
            logger.error(f"Error sending desktop notification: {e}")

    async def send_whatsapp_notification(self, message: str):
        """Send WhatsApp notification"""
        try:
            whatsapp_script = os.path.join(
                self.project_root, "whatsapp-qmoi-bot", "index.js"
            )
            if os.path.exists(whatsapp_script):
                subprocess.run(
                    ["node", whatsapp_script, "--notify", message],
                    cwd=self.project_root,
                    capture_output=True,
                )
        except Exception as e:
            logger.error(f"Error sending WhatsApp notification: {e}")

    async def start_file_watcher(self):
        """Start file watching system"""
        logger.info("👀 Starting file watcher...")

        # This would integrate with the existing file watcher
        # For now, we'll simulate file watching
        self.task_queue.put({"type": "file_watch", "data": {"enabled": True}})

    async def start_continuous_monitoring(self):
        """Start continuous system monitoring"""
        logger.info("🔄 Starting continuous monitoring...")

        while self.running:
            try:
                # Run periodic lint check
                await self.run_lint_check()

                # Generate periodic report
                await self.generate_report()

                # Wait before next cycle
                await asyncio.sleep(300)  # 5 minutes

            except Exception as e:
                logger.error(f"Error in continuous monitoring: {e}")
                await asyncio.sleep(60)  # Wait 1 minute on error

    def get_system_status(self) -> Dict[str, Any]:
        """Get current system status"""
        return {
            "system_state": self.system_state,
            "qmoi_config": self.qmoi_config,
            "lint_config": self.lint_config,
            "queue_size": self.task_queue.qsize(),
            "background_thread_active": self.background_thread
            and self.background_thread.is_alive(),
            "timestamp": datetime.now().isoformat(),
        }

    async def shutdown(self):
        """Gracefully shutdown the system"""
        logger.info("🛑 Shutting down QMOI AI System Controller...")

        self.running = False

        # Wait for background tasks to complete
        if self.background_thread:
            self.background_thread.join(timeout=10)

        # Generate final report
        await self.generate_report()

        logger.info("✅ QMOI AI System Controller shutdown complete")

    def check_and_fix_own_permissions(self):
        """Check and attempt to fix write permissions for this controller file. If it fails, run the permission fix utility and notify master."""
        controller_path = os.path.abspath(__file__)
        try:
            # Check if file is writable
            if not os.access(controller_path, os.W_OK):
                logger.warning(
                    f"Controller file {controller_path} is not writable. Attempting to fix permissions..."
                )
                try:
                    os.chmod(controller_path, 0o666)  # rw-rw-rw-
                    if os.access(controller_path, os.W_OK):
                        logger.info(f"Permissions fixed for {controller_path}.")
                    else:
                        logger.error(
                            f"Failed to fix permissions for {controller_path}."
                        )
                        self.run_permission_fix_utility(controller_path)
                except Exception as e:
                    logger.error(f"Error fixing permissions: {e}")
                    self.run_permission_fix_utility(controller_path)
            else:
                logger.info(f"Controller file {controller_path} is writable.")
        except Exception as e:
            logger.error(f"Error checking permissions: {e}")
            self.run_permission_fix_utility(controller_path)

    def run_permission_fix_utility(self, file_path):
        """Run the external permission fix utility and notify master if still not writable."""
        try:
            logger.info("Running qmoi_permission_fix.py utility...")
            result = subprocess.run(
                [
                    sys.executable,
                    os.path.join(os.path.dirname(__file__), "qmoi_permission_fix.py"),
                ],
                capture_output=True,
                text=True,
            )
            logger.info(f"Permission fix utility output: {result.stdout}")
            if not os.access(file_path, os.W_OK):
                self.notify_permission_issue(
                    file_path, result.stdout + "\n" + result.stderr
                )
            else:
                logger.info(f"Permissions fixed for {file_path} after running utility.")
        except Exception as e:
            logger.error(f"Failed to run permission fix utility: {e}")
            self.notify_permission_issue(file_path, str(e))

    def log_permission_audit(self, message):
        with open(PERMISSION_AUDIT_LOG, "a") as f:
            f.write(f"{datetime.now().isoformat()} | {message}\n")
        logger.info(f"[PERMISSION AUDIT] {message}")

    def periodic_permission_check(self):
        interval = self.qmoi_config.get("permission_self_check_interval", 600)

        def check_loop():
            fail_counts = {}
            while self.running:
                for fname in QMOI_CRITICAL_FILES:
                    fpath = os.path.join(os.path.dirname(__file__), fname)
                    if not os.path.exists(fpath):
                        self.log_permission_audit(f"File missing: {fpath}")
                        self.automated_recovery(fpath)
                        continue
                    if not os.access(fpath, os.W_OK):
                        self.log_permission_audit(f"File not writable: {fpath}")
                        self.run_permission_fix_utility(fpath)
                        fail_counts[fpath] = fail_counts.get(fpath, 0) + 1
                        if fail_counts[fpath] >= 3:
                            self.escalate_permission_issue(fpath)
                time.sleep(interval)

        t = threading.Thread(target=check_loop, daemon=True)
        t.start()
        logger.info("Started periodic permission self-check thread.")

    def escalate_permission_issue(self, file_path):
        message = f"[ESCALATION] QMOI cannot fix permissions for {file_path} after multiple attempts. Immediate intervention required."
        self.log_permission_audit(message)
        # Escalate via all available channels
        config = self.qmoi_config
        contacts = config.get("escalation_contacts", {})
        # Email
        for email in contacts.get("secondary_emails", []):
            try:
                self.send_email_notification(message, override_recipients=[email])
            except Exception as e:
                logger.error(f"Escalation email failed: {e}")
        # WhatsApp (stub)
        for number in contacts.get("secondary_whatsapp", []):
            logger.info(f"Would send WhatsApp escalation to {number}: {message}")
        # Slack (stub)
        for channel in contacts.get("slack_channels", []):
            logger.info(f"Would send Slack escalation to {channel}: {message}")
        # Add more as needed

    def notify_permission_issue(self, file_path, details=None):
        message = f"QMOI System Controller cannot write to {file_path}. Manual intervention required."
        if details:
            message += f"\nDetails: {details}"
        logger.error(message)
        self.log_permission_audit(message)
        # Send notifications via all enabled channels
        try:
            self.send_critical_notifications(message)
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")

    def send_critical_notifications(self, message):
        config = self.qmoi_config.get("notification_settings", {})
        # Desktop notification
        if config.get("desktop_notifications", True):
            try:
                asyncio.run(self.send_desktop_notification(message, "critical"))
            except Exception as e:
                logger.error(f"Desktop notification failed: {e}")
        # WhatsApp notification
        if config.get("whatsapp_notifications", True):
            try:
                asyncio.run(self.send_whatsapp_notification(message))
            except Exception as e:
                logger.error(f"WhatsApp notification failed: {e}")
        # Email notification
        if config.get("email_notifications", True):
            try:
                self.send_email_notification(message)
            except Exception as e:
                logger.error(f"Email notification failed: {e}")
        # Slack notification
        if config.get("slack_notifications", False):
            try:
                self.send_slack_notification(message)
            except Exception as e:
                logger.error(f"Slack notification failed: {e}")
        # Telegram notification
        if config.get("telegram_notifications", False):
            try:
                self.send_telegram_notification(message)
            except Exception as e:
                logger.error(f"Telegram notification failed: {e}")
        # Discord notification
        if config.get("discord_notifications", False):
            try:
                self.send_discord_notification(message)
            except Exception as e:
                logger.error(f"Discord notification failed: {e}")

    def send_email_notification(self, message, override_recipients=None):
        config = self.qmoi_config.get("email_settings", {})
        if not config.get("enabled", False):
            return
        try:
            smtp_server = config.get("smtp_server")
            smtp_port = config.get("smtp_port", 587)
            sender_email = config.get("sender_email")
            sender_password = config.get("sender_password")
            recipient_emails = override_recipients or config.get("recipient_emails", [])
            if not (
                smtp_server and sender_email and sender_password and recipient_emails
            ):
                logger.warning("Email notification credentials are missing in config.")
                return
            msg = MIMEMultipart()
            msg["From"] = sender_email
            msg["To"] = ", ".join(recipient_emails)
            msg["Subject"] = "[QMOI AI] Permission Issue Notification"
            msg.attach(MIMEText(message, "plain"))
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)
            logger.info("Email notification sent to recipients.")
        except Exception as e:
            logger.error(f"Failed to send email notification: {e}")

    def send_slack_notification(self, message):
        config = self.qmoi_config.get("slack_settings", {})
        if not config.get("enabled", False):
            return
        try:
            webhook_url = config.get("webhook_url")
            if not webhook_url:
                logger.warning("Slack webhook URL missing in config.")
                return
            payload = {"text": message}
            requests.post(webhook_url, json=payload)
            logger.info("Slack notification sent.")
        except Exception as e:
            logger.error(f"Failed to send Slack notification: {e}")

    def send_telegram_notification(self, message):
        config = self.qmoi_config.get("telegram_settings", {})
        if not config.get("enabled", False):
            return
        try:
            bot_token = config.get("bot_token")
            chat_id = config.get("chat_id")
            if not (bot_token and chat_id):
                logger.warning("Telegram bot token or chat_id missing in config.")
                return
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {"chat_id": chat_id, "text": message}
            requests.post(url, json=payload)
            logger.info("Telegram notification sent.")
        except Exception as e:
            logger.error(f"Failed to send Telegram notification: {e}")

    def send_discord_notification(self, message):
        config = self.qmoi_config.get("discord_settings", {})
        if not config.get("enabled", False):
            return
        try:
            webhook_url = config.get("webhook_url")
            if not webhook_url:
                logger.warning("Discord webhook URL missing in config.")
                return
            payload = {"content": message}
            requests.post(webhook_url, json=payload)
            logger.info("Discord notification sent.")
        except Exception as e:
            logger.error(f"Failed to send Discord notification: {e}")

    def automated_recovery(self, file_path):
        # Attempt to restore missing file from backup or git
        logger.info(f"Attempting automated recovery for missing file: {file_path}")
        # Example: try to restore from git
        try:
            if os.path.exists(".git"):
                import subprocess

                subprocess.run(["git", "checkout", "--", file_path], check=True)
                logger.info(f"Restored {file_path} from git.")
                self.log_permission_audit(f"Restored {file_path} from git.")
            else:
                logger.warning(f"No git repo found for recovery of {file_path}.")
        except Exception as e:
            logger.error(f"Automated recovery failed for {file_path}: {e}")
            self.log_permission_audit(f"Automated recovery failed for {file_path}: {e}")

    def get_system_health(self):
        # Returns a dict with CPU, memory, disk, and permission status for dashboard
        health = {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage("/").percent,
            "permission_status": {},
        }
        for fname in QMOI_CRITICAL_FILES:
            fpath = os.path.join(os.path.dirname(__file__), fname)
            health["permission_status"][fname] = (
                os.access(fpath, os.W_OK) if os.path.exists(fpath) else "missing"
            )
        return health

    def ensure_dashboard_running(self):
        """Ensure the dashboard is always running in the background. Restart if it dies."""
        dashboard_path = os.path.join(os.path.dirname(__file__), "qmoi_dashboard.py")

        def run_dashboard():
            while True:
                try:
                    logger.info("Starting QMOI dashboard...")
                    proc = subprocess.Popen([sys.executable, dashboard_path])
                    self.dashboard_process = proc
                    proc.wait()
                    logger.warning(
                        "QMOI dashboard process exited. Restarting in 5 seconds..."
                    )
                    time.sleep(5)
                except Exception as e:
                    logger.error(f"Failed to start dashboard: {e}")
                    time.sleep(10)

        t = threading.Thread(target=run_dashboard, daemon=True)
        t.start()

    def dashboard_health_check_loop(self):
        config = self.qmoi_config
        db_settings = config.get("dashboard_settings", {})
        host = db_settings.get("host", "127.0.0.1")
        port = db_settings.get("port", 5000)
        health_check_interval = config.get("dashboard_health_check_interval", 60)
        downtime_notify_threshold = config.get(
            "dashboard_downtime_notify_threshold", 180
        )
        url = f"http://{host}:{port}/"
        while self.running:
            try:
                r = requests.get(url, timeout=5)
                if r.status_code == 200:
                    if self.dashboard_down_since:
                        logger.info("QMOI dashboard is back up.")
                        self.log_permission_audit("Dashboard back up.")
                        self.dashboard_down_since = None
                    self.dashboard_last_up = time.time()
                else:
                    raise Exception(f"Unexpected status: {r.status_code}")
            except Exception as e:
                if not self.dashboard_down_since:
                    self.dashboard_down_since = time.time()
                    logger.warning("QMOI dashboard is DOWN. Attempting restart...")
                    self.log_permission_audit("Dashboard down. Attempting restart.")
                    self.restart_dashboard()
                elif (
                    time.time() - self.dashboard_down_since > downtime_notify_threshold
                ):
                    logger.error(
                        "QMOI dashboard has been down for too long! Notifying master."
                    )
                    self.log_permission_audit(
                        "Dashboard down for extended period. Notifying master."
                    )
                    self.send_critical_notifications(
                        "QMOI dashboard has been down for over {} seconds!".format(
                            downtime_notify_threshold
                        )
                    )
            time.sleep(health_check_interval)

    def restart_dashboard(self):
        try:
            if self.dashboard_process:
                self.dashboard_process.terminate()
                logger.info("Terminated old dashboard process.")
            self.ensure_dashboard_running()
            logger.info("Restarted dashboard process.")
        except Exception as e:
            logger.error(f"Failed to restart dashboard: {e}")


# --- EarnVaultsManager and extensibility stubs ---
class EarnVaultsManager:
    def __init__(self, controller):
        self.controller = controller
        self.accounts = []
        self.earning_strategies = []
        self.resource_mode = "auto"

    def register_account(self, account):
        self.accounts.append(account)
        logger.info(f"[EarnVaults] Registered account: {account}")

    def register_strategy(self, strategy_func):
        self.earning_strategies.append(strategy_func)
        logger.info(f"[EarnVaults] Registered strategy: {strategy_func.__name__}")

    async def run_all_vaults(self):
        logger.info("[EarnVaults] Starting all vaults...")
        tasks = [self.run_vault(account) for account in self.accounts]
        await asyncio.gather(*tasks)

    async def run_vault(self, account):
        logger.info(f"[EarnVaults] Running vault for {account}")
        for strategy in self.earning_strategies:
            try:
                await strategy(account)
            except Exception as e:
                logger.error(
                    f"[EarnVaults] Error in strategy {strategy.__name__} for {account}: {e}"
                )

    def set_resource_mode(self, mode):
        self.resource_mode = mode
        logger.info(f"[EarnVaults] Resource mode set to: {mode}")


# Creative earning stubs
async def ai_movie_maker(account):
    logger.info(f"[Creative] AI movie making for {account}")
    await asyncio.sleep(2)


async def ai_music_maker(account):
    logger.info(f"[Creative] AI music making for {account}")
    await asyncio.sleep(2)


# Project/task automation stub
async def auto_project_manager(project):
    logger.info(f"[Project] Auto-managing project: {project}")
    await asyncio.sleep(1)


async def main():
    """Main function for QMOI AI System Controller"""
    parser = argparse.ArgumentParser(description="QMOI AI System Controller")
    parser.add_argument(
        "--start", action="store_true", help="Start the system controller"
    )
    parser.add_argument("--status", action="store_true", help="Get system status")
    parser.add_argument("--lint-check", action="store_true", help="Run lint check")
    parser.add_argument(
        "--generate-report", action="store_true", help="Generate report"
    )
    parser.add_argument("--project-root", type=str, help="Project root directory")

    args = parser.parse_args()

    controller = QMOISystemController(args.project_root)

    if args.status:
        status = controller.get_system_status()
        print(json.dumps(status, indent=2))
        return

    if args.lint_check:
        results = await controller.run_lint_check()
        print(json.dumps(results, indent=2))
        return

    if args.generate_report:
        report = await controller.generate_report()
        print(json.dumps(report, indent=2))
        return

    if args.start:
        # Start the system controller
        await controller.start_background_processing()
        await controller.start_file_watcher()

        # Start continuous monitoring
        try:
            await controller.start_continuous_monitoring()
        except KeyboardInterrupt:
            logger.info("Received shutdown signal")
        finally:
            await controller.shutdown()

    # Default: show status
    status = controller.get_system_status()
    print(json.dumps(status, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
