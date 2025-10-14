import os
import logging
import json
import traceback
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from dataclasses import dataclass, asdict
import hashlib


@dataclass
class ErrorReport:
    timestamp: str
    error_type: str
    message: str
    stack_trace: str
    context: Dict[str, Any]
    severity: str
    error_id: str
    source: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None


class ErrorTracker:
    def __init__(self, config_path: Optional[str] = None):
        self.logger = self._setup_logger()
        self.config = self._load_config(config_path)
        self.error_dir = Path(self.config["error_dir"])
        self.error_dir.mkdir(exist_ok=True)
        self.error_history: List[ErrorReport] = []
        self.error_counts: Dict[str, int] = {}
        self.alert_threshold = self.config.get("alert_threshold", 5)

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger("ErrorTracker")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("error_tracker.log")
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
        """Load error tracking configuration from file or use defaults."""
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, "r") as f:
                    return json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading config: {str(e)}")
                return self._get_default_config()
        return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """Get default error tracking configuration."""
        return {
            "error_dir": "errors",
            "alert_threshold": 5,
            "email_alerts": {
                "enabled": False,
                "smtp_server": "smtp.gmail.com",
                "smtp_port": 587,
                "sender_email": "",
                "sender_password": "",
                "recipient_emails": [],
            },
            "slack_alerts": {"enabled": False, "webhook_url": ""},
            "error_retention_days": 30,
        }

    def track_error(
        self,
        error: Exception,
        context: Dict[str, Any] = None,
        severity: str = "error",
        source: str = "application",
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> str:
        """Track an error and create an error report."""
        try:
            # Generate error ID
            error_id = self._generate_error_id(error, context)

            # Create error report
            report = ErrorReport(
                timestamp=datetime.now().isoformat(),
                error_type=type(error).__name__,
                message=str(error),
                stack_trace=traceback.format_exc(),
                context=context or {},
                severity=severity,
                error_id=error_id,
                source=source,
                user_id=user_id,
                session_id=session_id,
            )

            # Add to history
            self.error_history.append(report)

            # Update error counts
            self.error_counts[error_id] = self.error_counts.get(error_id, 0) + 1

            # Save error report
            self._save_error_report(report)

            # Check if alert threshold is reached
            if self.error_counts[error_id] >= self.alert_threshold:
                self._send_alerts(report)

            self.logger.info(f"Error tracked: {error_id}")
            return error_id
        except Exception as e:
            self.logger.error(f"Error tracking failed: {str(e)}")
            raise

    def _generate_error_id(
        self, error: Exception, context: Dict[str, Any] = None
    ) -> str:
        """Generate a unique error ID based on error type and context."""
        error_info = f"{type(error).__name__}:{str(error)}"
        if context:
            error_info += f":{json.dumps(context, sort_keys=True)}"
        return hashlib.md5(error_info.encode()).hexdigest()

    def _save_error_report(self, report: ErrorReport) -> None:
        """Save error report to file."""
        try:
            # Create error file
            error_file = self.error_dir / f"error_{report.error_id}.json"

            # Convert report to dictionary
            report_dict = asdict(report)

            # Save to file
            with open(error_file, "w") as f:
                json.dump(report_dict, f, indent=2)

            self.logger.info(f"Error report saved: {error_file}")
        except Exception as e:
            self.logger.error(f"Error saving report: {str(e)}")
            raise

    def _send_alerts(self, report: ErrorReport) -> None:
        """Send alerts for critical errors."""
        try:
            # Send email alerts
            if self.config["email_alerts"]["enabled"]:
                self._send_email_alert(report)

            # Send Slack alerts
            if self.config["slack_alerts"]["enabled"]:
                self._send_slack_alert(report)

            self.logger.info(f"Alerts sent for error: {report.error_id}")
        except Exception as e:
            self.logger.error(f"Error sending alerts: {str(e)}")

    def _send_email_alert(self, report: ErrorReport) -> None:
        """Send email alert for critical error."""
        try:
            msg = MIMEMultipart()
            msg["From"] = self.config["email_alerts"]["sender_email"]
            msg["To"] = ", ".join(self.config["email_alerts"]["recipient_emails"])
            msg["Subject"] = f"Error Alert: {report.error_type} - {report.error_id}"

            # Create email body
            body = f"""
            Error Alert
            -----------
            Error ID: {report.error_id}
            Type: {report.error_type}
            Message: {report.message}
            Severity: {report.severity}
            Source: {report.source}
            Timestamp: {report.timestamp}
            
            Stack Trace:
            {report.stack_trace}
            
            Context:
            {json.dumps(report.context, indent=2)}
            """

            msg.attach(MIMEText(body, "plain"))

            # Send email
            with smtplib.SMTP(
                self.config["email_alerts"]["smtp_server"],
                self.config["email_alerts"]["smtp_port"],
            ) as server:
                server.starttls()
                server.login(
                    self.config["email_alerts"]["sender_email"],
                    self.config["email_alerts"]["sender_password"],
                )
                server.send_message(msg)

            self.logger.info(f"Email alert sent for error: {report.error_id}")
        except Exception as e:
            self.logger.error(f"Error sending email alert: {str(e)}")

    def _send_slack_alert(self, report: ErrorReport) -> None:
        """Send Slack alert for critical error."""
        try:
            # Create Slack message
            message = {
                "text": f"*Error Alert*\n"
                f"Error ID: `{report.error_id}`\n"
                f"Type: `{report.error_type}`\n"
                f"Message: {report.message}\n"
                f"Severity: {report.severity}\n"
                f"Source: {report.source}\n"
                f"Timestamp: {report.timestamp}\n\n"
                f"*Stack Trace:*\n```{report.stack_trace}```\n"
                f"*Context:*\n```{json.dumps(report.context, indent=2)}```"
            }

            # Send to Slack
            response = requests.post(
                self.config["slack_alerts"]["webhook_url"], json=message
            )
            response.raise_for_status()

            self.logger.info(f"Slack alert sent for error: {report.error_id}")
        except Exception as e:
            self.logger.error(f"Error sending Slack alert: {str(e)}")

    def get_error_history(self, limit: Optional[int] = None) -> List[ErrorReport]:
        """Get error history, optionally limited to recent errors."""
        if limit:
            return self.error_history[-limit:]
        return self.error_history

    def get_error_counts(self) -> Dict[str, int]:
        """Get counts of each error type."""
        return self.error_counts

    def get_error_report(self, error_id: str) -> Optional[ErrorReport]:
        """Get detailed report for a specific error."""
        try:
            error_file = self.error_dir / f"error_{error_id}.json"
            if error_file.exists():
                with open(error_file, "r") as f:
                    report_dict = json.load(f)
                return ErrorReport(**report_dict)
            return None
        except Exception as e:
            self.logger.error(f"Error getting report: {str(e)}")
            return None

    def cleanup_old_errors(self) -> None:
        """Remove error reports older than retention period."""
        try:
            retention_date = datetime.now() - timedelta(
                days=self.config["error_retention_days"]
            )

            for error_file in self.error_dir.glob("error_*.json"):
                try:
                    with open(error_file, "r") as f:
                        report_dict = json.load(f)

                    error_date = datetime.fromisoformat(report_dict["timestamp"])
                    if error_date < retention_date:
                        error_file.unlink()
                        self.logger.info(f"Removed old error report: {error_file}")
                except Exception as e:
                    self.logger.warning(f"Error processing {error_file}: {str(e)}")
        except Exception as e:
            self.logger.error(f"Error cleaning up old errors: {str(e)}")


def main():
    # Example usage
    error_tracker = ErrorTracker()

    try:
        # Simulate an error
        try:
            raise ValueError("Example error")
        except Exception as e:
            error_id = error_tracker.track_error(
                error=e,
                context={"user_action": "test", "page": "home"},
                severity="error",
                source="test_script",
            )
            print(f"Error tracked with ID: {error_id}")

        # Get error history
        history = error_tracker.get_error_history(limit=5)
        print("\nRecent Errors:")
        for report in history:
            print(f"- {report.error_id}: {report.error_type} - {report.message}")

        # Get error counts
        counts = error_tracker.get_error_counts()
        print("\nError Counts:")
        for error_id, count in counts.items():
            print(f"- {error_id}: {count}")

        # Cleanup old errors
        error_tracker.cleanup_old_errors()
        print("\nCleaned up old errors")

    except Exception as e:
        print(f"Error: {str(e)}")


if __name__ == "__main__":
    main()
