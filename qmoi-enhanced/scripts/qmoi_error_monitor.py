#!/usr/bin/env python3
"""
QMOI Error Monitor
Monitors system errors and generates reports
"""

import os
import sys
import json
import time
import logging
import traceback
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))


class QMOIErrorMonitor:
    def __init__(self):
        self.logger = self._setup_logging()
        self.error_report = {
            "timestamp": datetime.now().isoformat(),
            "error_status": "unknown",
            "total_errors": 0,
            "critical_errors": 0,
            "warning_errors": 0,
            "error_categories": {},
            "recent_errors": [],
            "error_trends": {},
            "alerts": [],
            "recommendations": [],
        }

    def _setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/error_monitor.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def scan_log_files(self):
        """Scan log files for errors"""
        try:
            log_directory = Path("logs")
            if not log_directory.exists():
                return

            error_patterns = [
                "ERROR",
                "CRITICAL",
                "FATAL",
                "Exception",
                "Traceback",
                "failed",
                "failure",
                "timeout",
                "connection refused",
            ]

            all_errors = []

            for log_file in log_directory.glob("*.log"):
                try:
                    with open(log_file, "r", encoding="utf-8") as f:
                        lines = f.readlines()

                    for line_num, line in enumerate(lines, 1):
                        for pattern in error_patterns:
                            if pattern.lower() in line.lower():
                                error_info = {
                                    "file": log_file.name,
                                    "line": line_num,
                                    "timestamp": self._extract_timestamp(line),
                                    "message": line.strip(),
                                    "pattern": pattern,
                                }
                                all_errors.append(error_info)
                                break

                except Exception as e:
                    self.logger.warning(f"Failed to scan log file {log_file}: {str(e)}")

            # Sort errors by timestamp
            all_errors.sort(key=lambda x: x.get("timestamp", ""), reverse=True)

            # Get recent errors (last 24 hours)
            cutoff_time = datetime.now() - timedelta(hours=24)
            recent_errors = [
                error
                for error in all_errors
                if error.get("timestamp")
                and datetime.fromisoformat(error["timestamp"]) > cutoff_time
            ]

            self.error_report["recent_errors"] = recent_errors[
                :100
            ]  # Limit to 100 most recent
            self.error_report["total_errors"] = len(all_errors)

        except Exception as e:
            self.logger.error(f"Failed to scan log files: {str(e)}")

    def _extract_timestamp(self, line):
        """Extract timestamp from log line"""
        try:
            # Common timestamp formats
            import re

            timestamp_patterns = [
                r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}",
                r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}",
                r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}",
            ]

            for pattern in timestamp_patterns:
                match = re.search(pattern, line)
                if match:
                    return match.group()

            return datetime.now().isoformat()
        except:
            return datetime.now().isoformat()

    def categorize_errors(self):
        """Categorize errors by type"""
        error_categories = defaultdict(list)

        for error in self.error_report["recent_errors"]:
            message = error.get("message", "").lower()

            # Categorize based on error patterns
            if "connection" in message or "network" in message:
                category = "network"
            elif "database" in message or "sql" in message:
                category = "database"
            elif "api" in message or "http" in message:
                category = "api"
            elif "memory" in message or "out of memory" in message:
                category = "memory"
            elif "timeout" in message:
                category = "timeout"
            elif "permission" in message or "access denied" in message:
                category = "permission"
            elif "file" in message or "io" in message:
                category = "file_io"
            else:
                category = "general"

            error_categories[category].append(error)

        # Convert to regular dict and add counts
        categorized_errors = {}
        for category, errors in error_categories.items():
            categorized_errors[category] = {
                "count": len(errors),
                "errors": errors[:10],  # Limit to 10 examples per category
            }

        self.error_report["error_categories"] = categorized_errors

    def analyze_error_severity(self):
        """Analyze error severity levels"""
        critical_count = 0
        warning_count = 0

        for error in self.error_report["recent_errors"]:
            message = error.get("message", "").lower()

            # Determine severity
            if any(term in message for term in ["fatal", "critical", "emergency"]):
                critical_count += 1
            elif any(term in message for term in ["warning", "warn"]):
                warning_count += 1

        self.error_report["critical_errors"] = critical_count
        self.error_report["warning_errors"] = warning_count

        # Generate alerts for critical errors
        if critical_count > 0:
            self.error_report["alerts"].append(
                f"Critical errors detected: {critical_count}"
            )
            self.error_report["recommendations"].append(
                "Immediate attention required for critical errors"
            )

        if warning_count > 10:
            self.error_report["alerts"].append(
                f"High number of warnings: {warning_count}"
            )
            self.error_report["recommendations"].append("Investigate warning patterns")

    def check_error_trends(self):
        """Check error trends over time"""
        try:
            # Load historical error data
            history_file = Path("logs/error_history.json")
            if history_file.exists():
                with open(history_file, "r") as f:
                    historical_data = json.load(f)

                if len(historical_data) >= 2:
                    # Calculate trends
                    recent_data = historical_data[-5:]  # Last 5 data points
                    error_counts = [d.get("total_errors", 0) for d in recent_data]

                    if len(error_counts) >= 2:
                        trend = (
                            "increasing"
                            if error_counts[-1] > error_counts[0]
                            else "decreasing"
                        )
                        change_rate = (
                            ((error_counts[-1] - error_counts[0]) / error_counts[0])
                            * 100
                            if error_counts[0] > 0
                            else 0
                        )

                        self.error_report["error_trends"] = {
                            "trend": trend,
                            "change_rate": change_rate,
                            "current_count": error_counts[-1],
                            "previous_count": error_counts[0],
                        }

                        # Alert for increasing errors
                        if trend == "increasing" and change_rate > 50:
                            self.error_report["alerts"].append(
                                f"Error rate increasing: {change_rate:.1f}% increase"
                            )
                            self.error_report["recommendations"].append(
                                "Investigate root cause of increasing errors"
                            )

        except Exception as e:
            self.logger.error(f"Error trend analysis failed: {str(e)}")

    def check_system_health(self):
        """Check system health based on errors"""
        total_errors = self.error_report["total_errors"]
        critical_errors = self.error_report["critical_errors"]
        recent_errors = len(self.error_report["recent_errors"])

        if critical_errors > 0:
            self.error_report["error_status"] = "critical"
        elif recent_errors > 50:
            self.error_report["error_status"] = "high"
        elif recent_errors > 20:
            self.error_report["error_status"] = "moderate"
        elif recent_errors > 5:
            self.error_report["error_status"] = "low"
        else:
            self.error_report["error_status"] = "healthy"

        # Generate status-specific recommendations
        if self.error_report["error_status"] == "critical":
            self.error_report["recommendations"].append(
                "System requires immediate intervention"
            )
        elif self.error_report["error_status"] == "high":
            self.error_report["recommendations"].append(
                "Investigate error patterns and implement fixes"
            )
        elif self.error_report["error_status"] == "moderate":
            self.error_report["recommendations"].append(
                "Monitor error patterns closely"
            )

    def generate_error_score(self):
        """Generate overall error health score"""
        score = 100

        # Deduct points for errors
        recent_errors = len(self.error_report["recent_errors"])
        score -= recent_errors * 2

        # Deduct points for critical errors
        critical_errors = self.error_report["critical_errors"]
        score -= critical_errors * 10

        # Deduct points for alerts
        score -= len(self.error_report["alerts"]) * 5

        # Ensure score doesn't go below 0
        score = max(0, score)

        self.error_report["error_score"] = score

        # Set error status based on score
        if score >= 90:
            self.error_report["error_status"] = "excellent"
        elif score >= 75:
            self.error_report["error_status"] = "good"
        elif score >= 50:
            self.error_report["error_status"] = "fair"
        else:
            self.error_report["error_status"] = "poor"

    def save_error_report(self):
        """Save error report to file"""
        try:
            # Ensure logs directory exists
            Path("logs").mkdir(exist_ok=True)

            # Save detailed report
            with open("logs/error_report.json", "w") as f:
                json.dump(self.error_report, f, indent=2)

            # Save to history
            history_file = Path("logs/error_history.json")
            historical_data = []

            if history_file.exists():
                with open(history_file, "r") as f:
                    historical_data = json.load(f)

            # Add current data to history
            current_data = {
                "timestamp": self.error_report["timestamp"],
                "total_errors": self.error_report["total_errors"],
                "critical_errors": self.error_report["critical_errors"],
                "recent_errors": len(self.error_report["recent_errors"]),
                "error_score": self.error_report.get("error_score", 0),
            }

            historical_data.append(current_data)

            # Keep only last 1000 entries
            if len(historical_data) > 1000:
                historical_data = historical_data[-1000:]

            with open(history_file, "w") as f:
                json.dump(historical_data, f, indent=2)

            # Save summary report
            summary = {
                "timestamp": self.error_report["timestamp"],
                "error_status": self.error_report["error_status"],
                "total_errors": self.error_report["total_errors"],
                "critical_errors": self.error_report["critical_errors"],
                "recent_errors": len(self.error_report["recent_errors"]),
                "error_score": self.error_report.get("error_score", 0),
                "alerts_count": len(self.error_report["alerts"]),
                "recommendations_count": len(self.error_report["recommendations"]),
            }

            with open("logs/error_summary.json", "w") as f:
                json.dump(summary, f, indent=2)

            self.logger.info(
                f"Error report saved. Score: {self.error_report.get('error_score', 0)}"
            )

        except Exception as e:
            self.logger.error(f"Failed to save error report: {str(e)}")

    def run_error_check(self):
        """Run complete error check"""
        self.logger.info("Starting QMOI error check...")

        try:
            # Scan log files
            self.scan_log_files()

            # Categorize errors
            self.categorize_errors()

            # Analyze error severity
            self.analyze_error_severity()

            # Check error trends
            self.check_error_trends()

            # Check system health
            self.check_system_health()

            # Generate error score
            self.generate_error_score()

            # Save report
            self.save_error_report()

            # Log results
            self.logger.info(
                f"Error check completed. Status: {self.error_report['error_status']}"
            )
            self.logger.info(f"Total errors: {self.error_report['total_errors']}")
            self.logger.info(f"Critical errors: {self.error_report['critical_errors']}")
            self.logger.info(
                f"Recent errors: {len(self.error_report['recent_errors'])}"
            )
            self.logger.info(f"Error score: {self.error_report.get('error_score', 0)}")

            if self.error_report["alerts"]:
                self.logger.warning(f"Error alerts: {len(self.error_report['alerts'])}")
            if self.error_report["recommendations"]:
                self.logger.info(
                    f"Error recommendations: {len(self.error_report['recommendations'])}"
                )

            return self.error_report

        except Exception as e:
            self.logger.error(f"Error check failed: {str(e)}")
            self.error_report["alerts"].append(f"Error check failed: {str(e)}")
            self.save_error_report()
            return self.error_report


def main():
    """Main function"""
    monitor = QMOIErrorMonitor()
    report = monitor.run_error_check()

    # Exit with error code if error status is poor
    if report["error_status"] == "poor":
        sys.exit(1)
    elif report["error_status"] == "fair":
        sys.exit(2)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
