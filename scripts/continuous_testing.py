#!/usr/bin/env python3
"""
Continuous Testing System for Alpha-Q AI
Runs tests automatically and monitors system health
"""

import asyncio
import time
import json
import logging
import subprocess
import signal
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
import psutil
import threading
import smtplib
import requests

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))


class ContinuousTestingSystem:
    def __init__(self, config_path: str = None):
        self.config = self.load_config(config_path)
        self.setup_logging()
        self.running = False
        self.test_interval = self.config.get("test_interval", 300)  # 5 minutes
        self.last_test_time = None
        self.test_history = []
        self.system_metrics = []
        self.logger = logging.getLogger(__name__)

    def load_config(self, config_path: str = None) -> Dict[str, Any]:
        """Load configuration"""
        if config_path:
            config_file = Path(config_path)
        else:
            config_file = project_root / "config" / "test_config.json"

        if config_file.exists():
            with open(config_file, "r") as f:
                return json.load(f)
        return {}

    def setup_logging(self):
        """Setup logging for continuous testing"""
        log_dir = project_root / "tests" / "reports"
        log_dir.mkdir(exist_ok=True)

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(log_dir / "continuous_testing.log"),
                logging.StreamHandler(),
            ],
        )

    async def start(self):
        """Start continuous testing"""
        self.running = True
        self.logger.info("Starting Continuous Testing System...")

        # Setup signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)

        # Start monitoring threads
        monitoring_thread = threading.Thread(target=self.monitor_system_metrics)
        monitoring_thread.daemon = True
        monitoring_thread.start()

        # Main testing loop
        while self.running:
            try:
                await self.run_test_cycle()
                await asyncio.sleep(self.test_interval)
            except Exception as e:
                self.logger.error(f"Error in test cycle: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying

    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        self.logger.info(f"Received signal {signum}, shutting down...")
        self.running = False

    async def run_test_cycle(self):
        """Run a complete test cycle"""
        self.logger.info("Starting test cycle...")
        start_time = time.time()

        # Check system health
        if not self.check_system_health():
            self.logger.warning("System health check failed, skipping tests")
            return

        # Run tests
        test_results = await self.run_tests()

        # Analyze results
        analysis = self.analyze_test_results(test_results)

        # Take action based on results
        await self.handle_test_results(analysis)

        # Update history
        cycle_info = {
            "timestamp": datetime.now().isoformat(),
            "duration": time.time() - start_time,
            "results": test_results,
            "analysis": analysis,
        }
        self.test_history.append(cycle_info)

        # Cleanup old history
        self.cleanup_old_history()

        self.logger.info(
            f"Test cycle completed in {time.time() - start_time:.2f} seconds"
        )

    def check_system_health(self) -> bool:
        """Check if system is healthy enough to run tests"""
        try:
            # Check CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            if cpu_percent > 95:
                self.logger.warning(f"High CPU usage: {cpu_percent}%")
                return False

            # Check memory usage
            memory = psutil.virtual_memory()
            if memory.percent > 90:
                self.logger.warning(f"High memory usage: {memory.percent}%")
                return False

            # Check disk space
            disk_usage = psutil.disk_usage(project_root)
            free_space_gb = disk_usage.free / (1024**3)
            if free_space_gb < 1:
                self.logger.error(
                    f"Insufficient disk space: {free_space_gb:.2f}GB free"
                )
                return False

            return True
        except Exception as e:
            self.logger.error(f"Health check failed: {e}")
            return False

    async def run_tests(self) -> Dict[str, Any]:
        """Run all configured tests"""
        test_results = {}

        # Run different test categories
        test_categories = self.config.get("test_categories", {})

        for category, config in test_categories.items():
            if config.get("enabled", True):
                try:
                    self.logger.info(f"Running {category} tests...")
                    result = await self.run_test_category(category, config)
                    test_results[category] = result
                except Exception as e:
                    self.logger.error(f"Failed to run {category} tests: {e}")
                    test_results[category] = {"error": str(e)}

        return test_results

    async def run_test_category(
        self, category: str, config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Run tests for a specific category"""
        timeout = config.get("timeout", 300)
        retries = config.get("retries", 1)

        for attempt in range(retries + 1):
            try:
                if category == "unit_tests":
                    result = await self.run_unit_tests(config)
                elif category == "integration_tests":
                    result = await self.run_integration_tests(config)
                elif category == "e2e_tests":
                    result = await self.run_e2e_tests(config)
                elif category == "performance_tests":
                    result = await self.run_performance_tests(config)
                else:
                    result = {"error": f"Unknown test category: {category}"}

                return result

            except Exception as e:
                if attempt < retries:
                    self.logger.warning(
                        f"Attempt {attempt + 1} failed for {category}: {e}"
                    )
                    await asyncio.sleep(5)
                else:
                    raise e

    async def run_unit_tests(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run unit tests"""
        try:
            result = subprocess.run(
                [sys.executable, "tests/unit/test_error_fixing.py"],
                capture_output=True,
                text=True,
                timeout=config.get("timeout", 60),
            )

            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "return_code": result.returncode,
            }
        except subprocess.TimeoutExpired:
            return {"error": "Test timeout exceeded"}
        except Exception as e:
            return {"error": str(e)}

    async def run_integration_tests(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run integration tests"""
        try:
            result = subprocess.run(
                [sys.executable, "tests/integration/test_error_fixing_integration.py"],
                capture_output=True,
                text=True,
                timeout=config.get("timeout", 120),
            )

            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "return_code": result.returncode,
            }
        except subprocess.TimeoutExpired:
            return {"error": "Test timeout exceeded"}
        except Exception as e:
            return {"error": str(e)}

    async def run_e2e_tests(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run end-to-end tests"""
        try:
            result = subprocess.run(
                [sys.executable, "tests/e2e/test_full_workflow.py"],
                capture_output=True,
                text=True,
                timeout=config.get("timeout", 300),
            )

            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "return_code": result.returncode,
            }
        except subprocess.TimeoutExpired:
            return {"error": "Test timeout exceeded"}
        except Exception as e:
            return {"error": str(e)}

    async def run_performance_tests(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run performance tests"""
        try:
            result = subprocess.run(
                [sys.executable, "tests/e2e/test_performance.py"],
                capture_output=True,
                text=True,
                timeout=config.get("timeout", 600),
            )

            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "return_code": result.returncode,
            }
        except subprocess.TimeoutExpired:
            return {"error": "Test timeout exceeded"}
        except Exception as e:
            return {"error": str(e)}

    def analyze_test_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze test results and determine actions needed"""
        analysis = {
            "overall_success": True,
            "failed_categories": [],
            "performance_issues": [],
            "recommendations": [],
            "critical_issues": [],
        }

        for category, result in results.items():
            if isinstance(result, dict):
                if not result.get("success", True):
                    analysis["overall_success"] = False
                    analysis["failed_categories"].append(category)

                    if "error" in result:
                        analysis["critical_issues"].append(
                            {"category": category, "error": result["error"]}
                        )

        # Check for performance issues
        if self.system_metrics:
            latest_metrics = self.system_metrics[-1]
            if latest_metrics.get("cpu_percent", 0) > 80:
                analysis["performance_issues"].append("High CPU usage")
            if latest_metrics.get("memory_percent", 0) > 80:
                analysis["performance_issues"].append("High memory usage")

        # Generate recommendations
        if not analysis["overall_success"]:
            analysis["recommendations"].append("Investigate failed test categories")
        if analysis["performance_issues"]:
            analysis["recommendations"].append("Optimize system performance")
        if analysis["critical_issues"]:
            analysis["recommendations"].append("Address critical issues immediately")

        return analysis

    async def handle_test_results(self, analysis: Dict[str, Any]):
        """Handle test results and take appropriate actions"""
        if not analysis["overall_success"]:
            self.logger.error("Test failures detected!")

            # Log detailed failure information
            for issue in analysis["critical_issues"]:
                self.logger.error(
                    f"Critical issue in {issue['category']}: {issue['error']}"
                )

            # Send notifications
            await self.send_notifications(analysis)

            # Attempt auto-fix for certain issues
            await self.attempt_auto_fix(analysis)

        if analysis["performance_issues"]:
            self.logger.warning("Performance issues detected")
            await self.handle_performance_issues(analysis["performance_issues"])

        # Log recommendations
        for recommendation in analysis["recommendations"]:
            self.logger.info(f"Recommendation: {recommendation}")

    async def send_notifications(self, analysis: Dict[str, Any]):
        """Send notifications about test results"""
        notification_config = self.config.get("notifications", {})

        # Email notifications
        if notification_config.get("email", {}).get("enabled", False):
            await self.send_email_notification(analysis)

        # Slack notifications
        if notification_config.get("slack", {}).get("enabled", False):
            await self.send_slack_notification(analysis)

        # Discord notifications
        if notification_config.get("discord", {}).get("enabled", False):
            await self.send_discord_notification(analysis)

    async def send_email_notification(self, analysis: Dict[str, Any]):
        """Send email notification"""
        notification_config = self.config.get("notifications", {}).get("email", {})
        if not notification_config.get("enabled", False):
            self.logger.info("Email notification is disabled in config.")
            return
        smtp_server = notification_config.get("smtp_server")
        smtp_port = notification_config.get("smtp_port", 587)
        sender_email = notification_config.get("sender_email")
        sender_password = notification_config.get("sender_password")
        recipient_emails = notification_config.get("recipient_emails", [])
        if not (smtp_server and sender_email and sender_password and recipient_emails):
            self.logger.warning("Email notification credentials are missing in config.")
            return
        subject = "[QMOI] Test Results Notification"
        body = f"Test Results:\n{analysis}"
        message = f"Subject: {subject}\n\n{body}"
        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                for recipient in recipient_emails:
                    server.sendmail(sender_email, recipient, message)
            self.logger.info("Email notification sent to recipients.")
        except Exception as e:
            self.logger.error(f"Failed to send email notification: {e}")

    async def send_slack_notification(self, analysis: Dict[str, Any]):
        """Send Slack notification"""
        notification_config = self.config.get("notifications", {}).get("slack", {})
        if not notification_config.get("enabled", False):
            self.logger.info("Slack notification is disabled in config.")
            return
        webhook_url = notification_config.get("webhook_url")
        if not webhook_url:
            self.logger.warning("Slack webhook URL is missing in config.")
            return
        message = {"text": f"[QMOI] Test Results Notification:\n{analysis}"}
        try:
            response = requests.post(webhook_url, json=message)
            if response.status_code == 200:
                self.logger.info("Slack notification sent successfully.")
            else:
                self.logger.error(f"Failed to send Slack notification: {response.text}")
        except Exception as e:
            self.logger.error(f"Failed to send Slack notification: {e}")

    async def send_discord_notification(self, analysis: Dict[str, Any]):
        """Send Discord notification"""
        # Implementation would depend on Discord webhook
        self.logger.info("Discord notification would be sent here")

    async def attempt_auto_fix(self, analysis: Dict[str, Any]):
        """Attempt to automatically fix detected issues"""
        self.logger.info("Attempting auto-fix for detected issues...")

        for issue in analysis["critical_issues"]:
            if "error_fixing" in issue["category"]:
                await self.fix_error_fixing_issues(issue)
            elif "performance" in issue["category"]:
                await self.fix_performance_issues(issue)

    async def fix_error_fixing_issues(self, issue: Dict[str, Any]):
        """Fix error fixing related issues"""
        self.logger.info(f"Attempting to fix error fixing issues: {issue['error']}")

        # Run error fixing service
        try:
            result = subprocess.run(
                [sys.executable, "scripts/error/error_fixer.py"],
                capture_output=True,
                text=True,
                timeout=60,
            )

            if result.returncode == 0:
                self.logger.info("Error fixing issues resolved")
            else:
                self.logger.warning(
                    "Error fixing issues could not be resolved automatically"
                )
        except Exception as e:
            self.logger.error(f"Error during auto-fix: {e}")

    async def fix_performance_issues(self, issue: Dict[str, Any]):
        """Fix performance related issues"""
        self.logger.info(f"Attempting to fix performance issues: {issue['error']}")

        # Run performance optimization
        try:
            result = subprocess.run(
                [sys.executable, "scripts/optimization/optimize_performance.py"],
                capture_output=True,
                text=True,
                timeout=120,
            )

            if result.returncode == 0:
                self.logger.info("Performance issues resolved")
            else:
                self.logger.warning(
                    "Performance issues could not be resolved automatically"
                )
        except Exception as e:
            self.logger.error(f"Error during performance fix: {e}")

    async def handle_performance_issues(self, issues: List[str]):
        """Handle performance issues"""
        for issue in issues:
            self.logger.warning(f"Performance issue: {issue}")

            if "High CPU usage" in issue:
                await self.optimize_cpu_usage()
            elif "High memory usage" in issue:
                await self.optimize_memory_usage()

    async def optimize_cpu_usage(self):
        """Optimize CPU usage"""
        self.logger.info("Optimizing CPU usage...")
        # Implementation would include CPU optimization strategies

    async def optimize_memory_usage(self):
        """Optimize memory usage"""
        self.logger.info("Optimizing memory usage...")
        # Implementation would include memory optimization strategies

    def monitor_system_metrics(self):
        """Monitor system metrics in background thread"""
        while self.running:
            try:
                metrics = {
                    "timestamp": datetime.now().isoformat(),
                    "cpu_percent": psutil.cpu_percent(interval=1),
                    "memory_percent": psutil.virtual_memory().percent,
                    "disk_usage_percent": psutil.disk_usage(project_root).percent,
                }

                self.system_metrics.append(metrics)

                # Keep only last 1000 metrics
                if len(self.system_metrics) > 1000:
                    self.system_metrics = self.system_metrics[-1000:]

                time.sleep(30)  # Update every 30 seconds

            except Exception as e:
                self.logger.error(f"Error monitoring system metrics: {e}")
                time.sleep(60)

    def cleanup_old_history(self):
        """Clean up old test history"""
        max_history_age = timedelta(days=7)
        cutoff_time = datetime.now() - max_history_age

        self.test_history = [
            entry
            for entry in self.test_history
            if datetime.fromisoformat(entry["timestamp"]) > cutoff_time
        ]

    def get_status_report(self) -> Dict[str, Any]:
        """Get current status report"""
        return {
            "running": self.running,
            "last_test_time": self.last_test_time,
            "test_history_count": len(self.test_history),
            "system_metrics_count": len(self.system_metrics),
            "current_metrics": self.system_metrics[-1] if self.system_metrics else None,
        }


async def main():
    """Main function"""
    import argparse

    parser = argparse.ArgumentParser(description="Continuous Testing System")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    parser.add_argument(
        "--interval", type=int, default=300, help="Test interval in seconds"
    )
    parser.add_argument("--daemon", action="store_true", help="Run as daemon")

    args = parser.parse_args()

    # Create and start continuous testing system
    cts = ContinuousTestingSystem(args.config)
    cts.test_interval = args.interval

    if args.daemon:
        # Run as daemon
        import daemon

        with daemon.DaemonContext():
            await cts.start()
    else:
        # Run in foreground
        await cts.start()


if __name__ == "__main__":
    asyncio.run(main())
