import os
import sys
import logging
import json
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path
import pytest
import coverage
import xmlrunner
import requests
from dataclasses import dataclass, asdict
import concurrent.futures
import time


@dataclass
class TestResult:
    test_id: str
    name: str
    status: str
    duration: float
    error_message: Optional[str] = None
    error_traceback: Optional[str] = None
    coverage: Optional[Dict[str, float]] = None


class TestRunner:
    def __init__(self, config_path: Optional[str] = None):
        self.logger = self._setup_logger()
        self.config = self._load_config(config_path)
        self.test_dir = Path(self.config["test_dir"])
        self.report_dir = Path(self.config["report_dir"])
        self.report_dir.mkdir(exist_ok=True)
        self.test_results: List[TestResult] = []
        self.coverage_data = None

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger("TestRunner")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("test_runner.log")
        console_handler = logging.StreamHandler()

        # Create formatters and add it to handlers
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers to the logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def _load_config(self, config_path: Optional[str]) -> Dict:
        """Load test configuration from file or use defaults."""
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, "r") as f:
                    return json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading config: {str(e)}")
                return self._get_default_config()
        return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """Get default test configuration."""
        return {
            "test_dir": "tests",
            "report_dir": "test_reports",
            "coverage": {
                "enabled": True,
                "source": ".",
                "omit": ["tests/*", "venv/*", "*/__pycache__/*"],
                "branch": True,
            },
            "parallel": {"enabled": True, "max_workers": 4},
            "notifications": {
                "slack": {"enabled": False, "webhook_url": ""},
                "email": {
                    "enabled": False,
                    "smtp_server": "",
                    "smtp_port": 587,
                    "sender_email": "",
                    "sender_password": "",
                    "recipient_emails": [],
                },
            },
            "test_categories": {
                "unit": "tests/unit",
                "integration": "tests/integration",
                "e2e": "tests/e2e",
            },
        }

    def _run_test_with_coverage(self, test_path: str) -> TestResult:
        """Run a single test with coverage tracking."""
        try:
            # Start coverage
            cov = coverage.Coverage(
                source=[self.config["coverage"]["source"]],
                omit=self.config["coverage"]["omit"],
                branch=self.config["coverage"]["branch"],
            )
            cov.start()

            # Run test
            start_time = time.time()
            result = pytest.main([test_path, "-v"])
            duration = time.time() - start_time

            # Stop coverage
            cov.stop()
            cov.save()

            # Get coverage data
            coverage_data = {
                "statements": cov.report(show_missing=False),
                "branches": cov.report(branch=True, show_missing=False),
            }

            # Create test result
            test_result = TestResult(
                test_id=hashlib.md5(test_path.encode()).hexdigest(),
                name=test_path,
                status="passed" if result == 0 else "failed",
                duration=duration,
                coverage=coverage_data,
            )

            return test_result
        except Exception as e:
            return TestResult(
                test_id=hashlib.md5(test_path.encode()).hexdigest(),
                name=test_path,
                status="error",
                duration=0,
                error_message=str(e),
                error_traceback=traceback.format_exc(),
            )

    def _run_tests_parallel(self, test_paths: List[str]) -> List[TestResult]:
        """Run tests in parallel."""
        results = []
        with concurrent.futures.ThreadPoolExecutor(
            max_workers=self.config["parallel"]["max_workers"]
        ) as executor:
            future_to_test = {
                executor.submit(self._run_test_with_coverage, test_path): test_path
                for test_path in test_paths
            }

            for future in concurrent.futures.as_completed(future_to_test):
                test_path = future_to_test[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    self.logger.error(f"Error running test {test_path}: {str(e)}")
                    results.append(
                        TestResult(
                            test_id=hashlib.md5(test_path.encode()).hexdigest(),
                            name=test_path,
                            status="error",
                            duration=0,
                            error_message=str(e),
                            error_traceback=traceback.format_exc(),
                        )
                    )

        return results

    def _generate_test_report(self, results: List[TestResult]) -> Dict:
        """Generate test report from results."""
        try:
            report = {
                "timestamp": datetime.now().isoformat(),
                "total_tests": len(results),
                "passed_tests": len([r for r in results if r.status == "passed"]),
                "failed_tests": len([r for r in results if r.status == "failed"]),
                "error_tests": len([r for r in results if r.status == "error"]),
                "total_duration": sum(r.duration for r in results),
                "results": [asdict(r) for r in results],
            }

            # Calculate coverage
            if self.config["coverage"]["enabled"]:
                coverage_data = {}
                for result in results:
                    if result.coverage:
                        for key, value in result.coverage.items():
                            if key not in coverage_data:
                                coverage_data[key] = []
                            coverage_data[key].append(value)

                report["coverage"] = {
                    key: sum(values) / len(values)
                    for key, values in coverage_data.items()
                }

            return report
        except Exception as e:
            self.logger.error(f"Error generating test report: {str(e)}")
            raise

    def _save_test_report(self, report: Dict) -> None:
        """Save test report to file."""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = self.report_dir / f"test_report_{timestamp}.json"

            with open(report_file, "w") as f:
                json.dump(report, f, indent=2)

            self.logger.info(f"Test report saved: {report_file}")
        except Exception as e:
            self.logger.error(f"Error saving test report: {str(e)}")
            raise

    def _send_notifications(self, report: Dict) -> None:
        """Send test result notifications."""
        try:
            # Send Slack notification
            if self.config["notifications"]["slack"]["enabled"]:
                self._send_slack_notification(report)

            # Send email notification
            if self.config["notifications"]["email"]["enabled"]:
                self._send_email_notification(report)

            self.logger.info("Notifications sent")
        except Exception as e:
            self.logger.error(f"Error sending notifications: {str(e)}")

    def _send_slack_notification(self, report: Dict) -> None:
        """Send Slack notification with test results."""
        try:
            message = {
                "text": f"*Test Results*\n"
                f"Total Tests: {report['total_tests']}\n"
                f"Passed: {report['passed_tests']}\n"
                f"Failed: {report['failed_tests']}\n"
                f"Errors: {report['error_tests']}\n"
                f"Duration: {report['total_duration']:.2f}s\n\n"
                f"*Coverage:*\n"
                f"Statements: {report['coverage']['statements']:.1f}%\n"
                f"Branches: {report['coverage']['branches']:.1f}%"
            }

            response = requests.post(
                self.config["notifications"]["slack"]["webhook_url"], json=message
            )
            response.raise_for_status()

            self.logger.info("Slack notification sent")
        except Exception as e:
            self.logger.error(f"Error sending Slack notification: {str(e)}")

    def _send_email_notification(self, report: Dict) -> None:
        """Send email notification with test results."""
        try:
            msg = MIMEMultipart()
            msg["From"] = self.config["notifications"]["email"]["sender_email"]
            msg["To"] = ", ".join(
                self.config["notifications"]["email"]["recipient_emails"]
            )
            msg["Subject"] = (
                f"Test Results - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
            )

            # Create email body
            body = f"""
            Test Results
            ------------
            Total Tests: {report['total_tests']}
            Passed: {report['passed_tests']}
            Failed: {report['failed_tests']}
            Errors: {report['error_tests']}
            Duration: {report['total_duration']:.2f}s
            
            Coverage:
            - Statements: {report['coverage']['statements']:.1f}%
            - Branches: {report['coverage']['branches']:.1f}%
            
            Failed Tests:
            {chr(10).join(f"- {r['name']}: {r['error_message']}" for r in report['results'] if r['status'] != 'passed')}
            """

            msg.attach(MIMEText(body, "plain"))

            # Send email
            with smtplib.SMTP(
                self.config["notifications"]["email"]["smtp_server"],
                self.config["notifications"]["email"]["smtp_port"],
            ) as server:
                server.starttls()
                server.login(
                    self.config["notifications"]["email"]["sender_email"],
                    self.config["notifications"]["email"]["sender_password"],
                )
                server.send_message(msg)

            self.logger.info("Email notification sent")
        except Exception as e:
            self.logger.error(f"Error sending email notification: {str(e)}")

    def run_tests(self, category: Optional[str] = None) -> Dict:
        """Run tests, optionally filtered by category."""
        try:
            # Get test paths
            if category:
                if category not in self.config["test_categories"]:
                    raise ValueError(f"Invalid test category: {category}")
                test_dir = Path(self.config["test_categories"][category])
            else:
                test_dir = self.test_dir

            test_paths = []
            for path in test_dir.rglob("test_*.py"):
                test_paths.append(str(path))

            if not test_paths:
                self.logger.warning(f"No tests found in {test_dir}")
                return {}

            self.logger.info(f"Running {len(test_paths)} tests")

            # Run tests
            if self.config["parallel"]["enabled"]:
                results = self._run_tests_parallel(test_paths)
            else:
                results = [self._run_test_with_coverage(path) for path in test_paths]

            # Generate and save report
            report = self._generate_test_report(results)
            self._save_test_report(report)

            # Send notifications
            self._send_notifications(report)

            self.logger.info("Test run completed")
            return report
        except Exception as e:
            self.logger.error(f"Error running tests: {str(e)}")
            raise

    def get_test_history(self, limit: Optional[int] = None) -> List[Dict]:
        """Get test history, optionally limited to recent runs."""
        try:
            reports = []
            for report_file in sorted(self.report_dir.glob("test_report_*.json")):
                try:
                    with open(report_file, "r") as f:
                        report = json.load(f)
                    reports.append(report)
                except Exception as e:
                    self.logger.warning(f"Error reading report {report_file}: {str(e)}")

            if limit:
                reports = reports[-limit:]

            return reports
        except Exception as e:
            self.logger.error(f"Error getting test history: {str(e)}")
            return []


def main():
    # Example usage
    test_runner = TestRunner()

    try:
        # Run all tests
        report = test_runner.run_tests()
        print("\nTest Results:")
        print(f"Total Tests: {report['total_tests']}")
        print(f"Passed: {report['passed_tests']}")
        print(f"Failed: {report['failed_tests']}")
        print(f"Errors: {report['error_tests']}")
        print(f"Duration: {report['total_duration']:.2f}s")

        # Get test history
        history = test_runner.get_test_history(limit=5)
        print("\nRecent Test Runs:")
        for report in history:
            print(
                f"- {report['timestamp']}: {report['passed_tests']}/{report['total_tests']} passed"
            )

    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    main()
