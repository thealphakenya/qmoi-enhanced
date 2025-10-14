"""
Error tracking module for Q-city application.
"""

from typing import Dict, List, Optional, Union
from dataclasses import dataclass
from datetime import datetime
import json
from pathlib import Path
import smtplib
from email.mime.text import MIMEText
import requests


@dataclass
class ErrorConfig:
    """Configuration for error tracking."""

    tracking_enabled: bool = True
    log_level: str = "INFO"
    max_history: int = 1000
    alert_threshold: int = 5
    notification_channels: List[str] = None
    email_config: Dict[str, str] = None
    slack_webhook_url: str = None


class ErrorTracker:
    """Tracks and manages application errors."""

    def __init__(self, config: ErrorConfig):
        self.config = config
        self.error_history: List[Dict] = []
        self.current_state: Dict = {}
        self.notification_channels = config.notification_channels or []

    def track_error(self, error: Dict) -> None:
        """Track a new error."""
        if not self.config.tracking_enabled:
            return

        error_entry = {
            "timestamp": datetime.now().isoformat(),
            "error": error,
            "status": "new",
        }

        self.error_history.append(error_entry)
        self._check_alert_threshold()
        self._save_error_history()

    def get_error_history(self) -> List[Dict]:
        """Get the error history."""
        return self.error_history

    def get_active_errors(self) -> List[Dict]:
        """Get currently active errors."""
        return [e for e in self.error_history if e["status"] == "new"]

    def resolve_error(self, error_id: str) -> bool:
        """Mark an error as resolved."""
        for error in self.error_history:
            if error["error"].get("id") == error_id:
                error["status"] = "resolved"
                error["resolved_at"] = datetime.now().isoformat()
                self._save_error_history()
                return True
        return False

    def _check_alert_threshold(self) -> None:
        """Check if error count exceeds alert threshold."""
        active_errors = self.get_active_errors()
        if len(active_errors) >= self.config.alert_threshold:
            self._send_alerts(active_errors)

    def _send_alerts(self, errors: List[Dict]) -> None:
        """Send alerts through configured channels."""
        for channel in self.notification_channels:
            if channel == "email" and self.config.email_config:
                self._send_email_alert(errors)
            elif channel == "slack" and self.config.slack_webhook_url:
                self._send_slack_alert(errors)

    def _send_email_alert(self, errors: List[Dict]) -> None:
        """Send an email alert."""
        email_config = self.config.email_config
        msg = MIMEText(f"Active errors: {json.dumps(errors, indent=2)}")
        msg["Subject"] = "Q-city Error Alert"
        msg["From"] = email_config["from"]
        msg["To"] = email_config["to"]
        with smtplib.SMTP(
            email_config["smtp_server"], email_config["smtp_port"]
        ) as server:
            server.starttls()
            server.login(email_config["username"], email_config["password"])
            server.send_message(msg)

    def _send_slack_alert(self, errors: List[Dict]) -> None:
        """Send a Slack alert."""
        payload = {"text": f"Active errors: {json.dumps(errors, indent=2)}"}
        requests.post(self.config.slack_webhook_url, json=payload)

    def _save_error_history(self) -> None:
        """Save error history to disk."""
        if len(self.error_history) > self.config.max_history:
            self.error_history = self.error_history[-self.config.max_history :]

        history_path = Path("logs/error_history.json")
        history_path.parent.mkdir(parents=True, exist_ok=True)

        with open(history_path, "w") as f:
            json.dump(self.error_history, f, indent=2)

    def load_error_history(self) -> None:
        """Load error history from disk."""
        history_path = Path("logs/error_history.json")
        if history_path.exists():
            with open(history_path, "r") as f:
                self.error_history = json.load(f)

    def reset_error_history(self) -> None:
        """Reset the error history."""
        self.error_history = []
        self._save_error_history()


def create_error_tracker(config: ErrorConfig) -> ErrorTracker:
    """Factory function to create an error tracker instance."""
    return ErrorTracker(config)
