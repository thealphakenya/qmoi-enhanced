#!/usr/bin/env python3
"""
QMOI Master Notifications System
Comprehensive notification handling for QMOI automation
"""

import os
import sys
import json
import time
import requests
import smtplib
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
import threading
import queue
import asyncio
import aiohttp
import websockets

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/qmoi-notifications.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


class QMOIMasterNotifications:
    def __init__(self):
        self.config = self.load_config()
        self.notification_queue = queue.Queue()
        self.notification_thread = None
        self.is_running = True
        self.stats = {
            "notifications_sent": 0,
            "successful_notifications": 0,
            "failed_notifications": 0,
            "platform_notifications": 0,
            "error_notifications": 0,
            "success_notifications": 0,
        }

    def load_config(self) -> Dict[str, Any]:
        """Load notification configuration"""
        config = {
            "enable_email": True,
            "enable_webhook": True,
            "enable_websocket": True,
            "enable_console": True,
            "enable_file_logging": True,
            "notification_interval": 5,
            "max_retries": 3,
            "retry_delay": 10,
            "platforms": {
                "gitlab": True,
                "github": True,
                "vercel": True,
                "gitpod": True,
                "qcity": True,
            },
        }

        # Load from config file
        config_file = "config/qmoi_notifications_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                logger.warning(f"Could not load {config_file}: {e}")

        return config

    def start_notification_system(self):
        """Start the notification system"""
        logger.info("Starting QMOI Master Notifications System...")

        # Start notification processing thread
        self.notification_thread = threading.Thread(
            target=self._notification_loop, daemon=True
        )
        self.notification_thread.start()

        logger.info("Notification system started successfully")

    def _notification_loop(self):
        """Main notification processing loop"""
        while self.is_running:
            try:
                if not self.notification_queue.empty():
                    notification = self.notification_queue.get_nowait()
                    self.process_notification(notification)

                time.sleep(self.config.get("notification_interval", 5))

            except Exception as e:
                logger.error(f"Notification loop error: {e}")
                time.sleep(10)

    def send_notification(
        self, notification_type: str, message: str, data: Dict[str, Any] = None
    ):
        """Send a notification"""
        notification = {
            "timestamp": datetime.now().isoformat(),
            "type": notification_type,
            "message": message,
            "data": data or {},
            "id": f"{notification_type}_{int(time.time())}",
        }

        self.notification_queue.put(notification)
        self.stats["notifications_sent"] += 1

    def process_notification(self, notification: Dict[str, Any]):
        """Process a single notification"""
        try:
            notification_type = notification["type"]
            message = notification["message"]
            data = notification.get("data", {})

            logger.info(f"Processing notification: {notification_type} - {message}")

            # Send to all enabled platforms
            success_count = 0
            total_attempts = 0

            # Console notification
            if self.config.get("enable_console", True):
                if self.send_console_notification(notification):
                    success_count += 1
                total_attempts += 1

            # File logging
            if self.config.get("enable_file_logging", True):
                if self.send_file_notification(notification):
                    success_count += 1
                total_attempts += 1

            # WebSocket notification
            if self.config.get("enable_websocket", True):
                if self.send_websocket_notification(notification):
                    success_count += 1
                total_attempts += 1

            # Platform-specific notifications
            for platform, enabled in self.config.get("platforms", {}).items():
                if enabled:
                    if self.send_platform_notification(platform, notification):
                        success_count += 1
                        self.stats["platform_notifications"] += 1
                    total_attempts += 1

            # Update stats
            if success_count > 0:
                self.stats["successful_notifications"] += 1
            else:
                self.stats["failed_notifications"] += 1

            # Log result
            logger.info(
                f"Notification processed: {success_count}/{total_attempts} successful"
            )

        except Exception as e:
            logger.error(f"Could not process notification: {e}")
            self.stats["failed_notifications"] += 1

    def send_console_notification(self, notification: Dict[str, Any]) -> bool:
        """Send notification to console"""
        try:
            notification_type = notification["type"]
            message = notification["message"]
            timestamp = notification["timestamp"]

            # Color coding based on type
            colors = {
                "error": "\033[91m",  # Red
                "warning": "\033[93m",  # Yellow
                "success": "\033[92m",  # Green
                "info": "\033[94m",  # Blue
                "debug": "\033[90m",  # Gray
            }

            color = colors.get(notification_type, "\033[0m")
            reset = "\033[0m"

            print(f"{color}[{timestamp}] {notification_type.upper()}: {message}{reset}")

            return True

        except Exception as e:
            logger.error(f"Console notification failed: {e}")
            return False

    def send_file_notification(self, notification: Dict[str, Any]) -> bool:
        """Send notification to file"""
        try:
            # Ensure logs directory exists
            logs_dir = Path("logs")
            logs_dir.mkdir(exist_ok=True)

            # Write to notification log
            notification_file = logs_dir / "notifications.log"
            with open(notification_file, "a") as f:
                f.write(json.dumps(notification) + "\n")

            # Write to type-specific log
            notification_type = notification["type"]
            type_file = logs_dir / f"{notification_type}-notifications.log"
            with open(type_file, "a") as f:
                f.write(json.dumps(notification) + "\n")

            return True

        except Exception as e:
            logger.error(f"File notification failed: {e}")
            return False

    def send_websocket_notification(self, notification: Dict[str, Any]) -> bool:
        """Send notification via WebSocket"""
        try:
            # This would typically connect to a WebSocket server
            # For now, we'll just log that it would be sent
            logger.info(f"WebSocket notification would be sent: {notification['type']}")
            return True

        except Exception as e:
            logger.error(f"WebSocket notification failed: {e}")
            return False

    def send_platform_notification(
        self, platform: str, notification: Dict[str, Any]
    ) -> bool:
        """Send platform-specific notification"""
        try:
            if platform == "gitlab":
                return self.send_gitlab_notification(notification)
            elif platform == "github":
                return self.send_github_notification(notification)
            elif platform == "vercel":
                return self.send_vercel_notification(notification)
            elif platform == "gitpod":
                return self.send_gitpod_notification(notification)
            elif platform == "qcity":
                return self.send_qcity_notification(notification)
            else:
                logger.warning(f"Unknown platform: {platform}")
                return False

        except Exception as e:
            logger.error(f"Platform notification failed for {platform}: {e}")
            return False

    def send_gitlab_notification(self, notification: Dict[str, Any]) -> bool:
        """Send GitLab notification"""
        try:
            # GitLab API notification
            gitlab_token = os.getenv("GITLAB_TOKEN")
            gitlab_project_id = os.getenv("GITLAB_PROJECT_ID")

            if gitlab_token and gitlab_project_id:
                url = f"https://gitlab.com/api/v4/projects/{gitlab_project_id}/issues"

                issue_data = {
                    "title": f"QMOI Notification: {notification['type']}",
                    "description": f"""
**QMOI Notification**

**Type:** {notification['type']}
**Message:** {notification['message']}
**Timestamp:** {notification['timestamp']}
**Data:** {json.dumps(notification.get('data', {}), indent=2)}
                    """.strip(),
                    "labels": f"qmoi,{notification['type']}",
                }

                response = requests.post(
                    url,
                    headers={"Authorization": f"Bearer {gitlab_token}"},
                    json=issue_data,
                    timeout=30,
                )

                if response.status_code == 201:
                    logger.info("GitLab notification sent successfully")
                    return True
                else:
                    logger.warning(
                        f"GitLab notification failed: {response.status_code}"
                    )
                    return False
            else:
                logger.warning("GitLab credentials not configured")
                return False

        except Exception as e:
            logger.error(f"GitLab notification error: {e}")
            return False

    def send_github_notification(self, notification: Dict[str, Any]) -> bool:
        """Send GitHub notification"""
        try:
            # GitHub API notification
            github_token = os.getenv("GITHUB_TOKEN")
            github_repo = os.getenv("GITHUB_REPOSITORY")

            if github_token and github_repo:
                url = f"https://api.github.com/repos/{github_repo}/issues"

                issue_data = {
                    "title": f"QMOI Notification: {notification['type']}",
                    "body": f"""
**QMOI Notification**

**Type:** {notification['type']}
**Message:** {notification['message']}
**Timestamp:** {notification['timestamp']}
**Data:** {json.dumps(notification.get('data', {}), indent=2)}
                    """.strip(),
                    "labels": ["qmoi", notification["type"]],
                }

                response = requests.post(
                    url,
                    headers={
                        "Authorization": f"token {github_token}",
                        "Accept": "application/vnd.github.v3+json",
                    },
                    json=issue_data,
                    timeout=30,
                )

                if response.status_code == 201:
                    logger.info("GitHub notification sent successfully")
                    return True
                else:
                    logger.warning(
                        f"GitHub notification failed: {response.status_code}"
                    )
                    return False
            else:
                logger.warning("GitHub credentials not configured")
                return False

        except Exception as e:
            logger.error(f"GitHub notification error: {e}")
            return False

    def send_vercel_notification(self, notification: Dict[str, Any]) -> bool:
        """Send Vercel notification"""
        try:
            # Vercel deployment notification
            vercel_token = os.getenv("VERCEL_TOKEN")

            if vercel_token:
                # This would typically send to Vercel's webhook or API
                logger.info(
                    f"Vercel notification would be sent: {notification['type']}"
                )
                return True
            else:
                logger.warning("Vercel credentials not configured")
                return False

        except Exception as e:
            logger.error(f"Vercel notification error: {e}")
            return False

    def send_gitpod_notification(self, notification: Dict[str, Any]) -> bool:
        """Send Gitpod notification"""
        try:
            # Gitpod workspace notification
            gitpod_token = os.getenv("GITPOD_API_TOKEN")

            if gitpod_token:
                # This would typically send to Gitpod's API
                logger.info(
                    f"Gitpod notification would be sent: {notification['type']}"
                )
                return True
            else:
                logger.warning("Gitpod credentials not configured")
                return False

        except Exception as e:
            logger.error(f"Gitpod notification error: {e}")
            return False

    def send_qcity_notification(self, notification: Dict[str, Any]) -> bool:
        """Send QCity notification"""
        try:
            # QCity-specific notification
            qcity_webhook = os.getenv("QCITY_WEBHOOK_URL")

            if qcity_webhook:
                notification_data = {
                    "source": "qmoi",
                    "type": notification["type"],
                    "message": notification["message"],
                    "timestamp": notification["timestamp"],
                    "data": notification.get("data", {}),
                }

                response = requests.post(
                    qcity_webhook, json=notification_data, timeout=30
                )

                if response.status_code == 200:
                    logger.info("QCity notification sent successfully")
                    return True
                else:
                    logger.warning(f"QCity notification failed: {response.status_code}")
                    return False
            else:
                logger.warning("QCity webhook not configured")
                return False

        except Exception as e:
            logger.error(f"QCity notification error: {e}")
            return False

    def send_error_notification(self, error: str, context: Dict[str, Any] = None):
        """Send error notification"""
        self.send_notification("error", error, context or {})
        self.stats["error_notifications"] += 1

    def send_success_notification(self, message: str, data: Dict[str, Any] = None):
        """Send success notification"""
        self.send_notification("success", message, data or {})
        self.stats["success_notifications"] += 1

    def send_info_notification(self, message: str, data: Dict[str, Any] = None):
        """Send info notification"""
        self.send_notification("info", message, data or {})

    def send_warning_notification(self, message: str, data: Dict[str, Any] = None):
        """Send warning notification"""
        self.send_notification("warning", message, data or {})

    def send_debug_notification(self, message: str, data: Dict[str, Any] = None):
        """Send debug notification"""
        self.send_notification("debug", message, data or {})

    def get_notification_stats(self) -> Dict[str, Any]:
        """Get notification statistics"""
        return {
            "timestamp": datetime.now().isoformat(),
            "stats": self.stats.copy(),
            "config": self.config,
            "queue_size": self.notification_queue.qsize(),
        }

    def save_notification_stats(self):
        """Save notification statistics"""
        try:
            stats = self.get_notification_stats()
            stats_file = "logs/notification-stats.json"

            with open(stats_file, "w") as f:
                json.dump(stats, f, indent=2, default=str)

        except Exception as e:
            logger.error(f"Could not save notification stats: {e}")

    def run(self):
        """Run the notification system"""
        try:
            logger.info("Starting QMOI Master Notifications System...")

            # Start notification system
            self.start_notification_system()

            # Send startup notification
            self.send_info_notification("QMOI Master Notifications System started")

            # Keep running
            while self.is_running:
                time.sleep(1)

                # Save stats periodically
                if int(time.time()) % 60 == 0:  # Every minute
                    self.save_notification_stats()

        except KeyboardInterrupt:
            logger.info("Notification system interrupted by user")
        except Exception as e:
            logger.error(f"Notification system failed: {e}")
        finally:
            self.cleanup()

    def cleanup(self):
        """Cleanup notification system"""
        logger.info("Cleaning up notification system...")

        # Send shutdown notification
        self.send_info_notification("QMOI Master Notifications System shutting down")

        # Wait for notifications to be processed
        time.sleep(5)

        # Save final stats
        self.save_notification_stats()

        logger.info("Notification system cleanup completed")


def main():
    """Main function"""
    notifications = QMOIMasterNotifications()
    notifications.run()


if __name__ == "__main__":
    main()
