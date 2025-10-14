#!/usr/bin/env python3
"""
QMOI Enhancement Notification Script
Handles sending notifications about system enhancements and updates
"""

import os
import sys
import json
import logging
import argparse
import smtplib
import requests
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/notify_enhancement.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


class QMOIEnhancementNotifier:
    def __init__(self, notification_type: str = "enhancement"):
        self.notification_type = notification_type
        self.root_dir = Path(__file__).parent.parent.parent
        self.config_dir = self.root_dir / "config"
        self.logs_dir = self.root_dir / "logs"

        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)

        # Load notification configuration
        self.config = self.load_notification_config()

        # Notification history
        self.notification_history = []

    def load_notification_config(self) -> Dict[str, Any]:
        """Load notification configuration"""
        config_path = self.config_dir / "notification_config.json"
        if config_path.exists():
            try:
                with open(config_path, "r") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading notification config: {e}")

        # Default configuration
        return {
            "email": {
                "enabled": False,
                "smtp_server": "smtp.gmail.com",
                "smtp_port": 587,
                "username": os.environ.get("EMAIL_USERNAME", ""),
                "password": os.environ.get("EMAIL_PASSWORD", ""),
                "from_address": os.environ.get("EMAIL_FROM", ""),
                "to_addresses": [],
            },
            "slack": {
                "enabled": False,
                "webhook_url": os.environ.get("SLACK_WEBHOOK_URL", ""),
                "channel": "#qmoi-updates",
            },
            "discord": {
                "enabled": False,
                "webhook_url": os.environ.get("DISCORD_WEBHOOK_URL", ""),
                "username": "QMOI Enhancement Bot",
            },
            "telegram": {
                "enabled": False,
                "bot_token": os.environ.get("TELEGRAM_BOT_TOKEN", ""),
                "chat_id": os.environ.get("TELEGRAM_CHAT_ID", ""),
            },
            "whatsapp": {
                "enabled": False,
                "api_key": os.environ.get("WHATSAPP_API_KEY", ""),
                "phone_number": os.environ.get("WHATSAPP_PHONE", ""),
            },
            "notification_templates": {
                "enhancement_success": {
                    "subject": "QMOI Enhancement Completed Successfully",
                    "body": "QMOI system enhancement has been completed successfully. Models updated: {models_updated}. Duration: {duration}.",
                },
                "enhancement_failure": {
                    "subject": "QMOI Enhancement Failed",
                    "body": "QMOI system enhancement has failed. Error: {error}. Please check the logs for details.",
                },
                "deployment_success": {
                    "subject": "QMOI Deployment Completed",
                    "body": "QMOI deployment to {environment} has been completed successfully. Duration: {duration}.",
                },
                "deployment_failure": {
                    "subject": "QMOI Deployment Failed",
                    "body": "QMOI deployment to {environment} has failed. Error: {error}. Please check the logs for details.",
                },
                "performance_alert": {
                    "subject": "QMOI Performance Alert",
                    "body": "Performance alert: {message}. Current usage: {usage}%. Threshold: {threshold}%.",
                },
                "system_optimization": {
                    "subject": "QMOI System Optimization",
                    "body": "System optimization completed. Space freed: {space_freed} MB. Optimizations: {optimizations}.",
                },
            },
        }

    def send_email_notification(
        self, subject: str, body: str, recipients: Optional[List[str]] = None
    ) -> bool:
        """Send email notification"""
        if not self.config["email"]["enabled"]:
            logger.info("Email notifications are disabled")
            return False

        try:
            # Prepare email
            msg = MIMEMultipart()
            msg["From"] = self.config["email"]["from_address"]
            msg["To"] = ", ".join(recipients or self.config["email"]["to_addresses"])
            msg["Subject"] = subject

            # Add body
            msg.attach(MIMEText(body, "plain"))

            # Send email
            server = smtplib.SMTP(
                self.config["email"]["smtp_server"], self.config["email"]["smtp_port"]
            )
            server.starttls()
            server.login(
                self.config["email"]["username"], self.config["email"]["password"]
            )
            server.send_message(msg)
            server.quit()

            logger.info(
                f"Email notification sent to {len(recipients or self.config['email']['to_addresses'])} recipients"
            )
            return True

        except Exception as e:
            logger.error(f"Error sending email notification: {e}")
            return False

    def send_slack_notification(
        self, message: str, channel: Optional[str] = None
    ) -> bool:
        """Send Slack notification"""
        if not self.config["slack"]["enabled"]:
            logger.info("Slack notifications are disabled")
            return False

        try:
            payload = {
                "text": message,
                "channel": channel or self.config["slack"]["channel"],
            }

            response = requests.post(
                self.config["slack"]["webhook_url"], json=payload, timeout=10
            )

            if response.status_code == 200:
                logger.info("Slack notification sent successfully")
                return True
            else:
                logger.error(
                    f"Slack notification failed: {response.status_code} - {response.text}"
                )
                return False

        except Exception as e:
            logger.error(f"Error sending Slack notification: {e}")
            return False

    def send_discord_notification(
        self, message: str, username: Optional[str] = None
    ) -> bool:
        """Send Discord notification"""
        if not self.config["discord"]["enabled"]:
            logger.info("Discord notifications are disabled")
            return False

        try:
            payload = {
                "content": message,
                "username": username or self.config["discord"]["username"],
            }

            response = requests.post(
                self.config["discord"]["webhook_url"], json=payload, timeout=10
            )

            if response.status_code == 204:
                logger.info("Discord notification sent successfully")
                return True
            else:
                logger.error(
                    f"Discord notification failed: {response.status_code} - {response.text}"
                )
                return False

        except Exception as e:
            logger.error(f"Error sending Discord notification: {e}")
            return False

    def send_telegram_notification(self, message: str) -> bool:
        """Send Telegram notification"""
        if not self.config["telegram"]["enabled"]:
            logger.info("Telegram notifications are disabled")
            return False

        try:
            url = f"https://api.telegram.org/bot{self.config['telegram']['bot_token']}/sendMessage"
            payload = {
                "chat_id": self.config["telegram"]["chat_id"],
                "text": message,
                "parse_mode": "HTML",
            }

            response = requests.post(url, json=payload, timeout=10)

            if response.status_code == 200:
                logger.info("Telegram notification sent successfully")
                return True
            else:
                logger.error(
                    f"Telegram notification failed: {response.status_code} - {response.text}"
                )
                return False

        except Exception as e:
            logger.error(f"Error sending Telegram notification: {e}")
            return False

    def send_whatsapp_notification(self, message: str) -> bool:
        """Send WhatsApp notification"""
        if not self.config["whatsapp"]["enabled"]:
            logger.info("WhatsApp notifications are disabled")
            return False

        try:
            # This is a placeholder for WhatsApp Business API
            # You would need to implement the actual WhatsApp API integration
            logger.info(f"WhatsApp notification (placeholder): {message}")
            return True

        except Exception as e:
            logger.error(f"Error sending WhatsApp notification: {e}")
            return False

    def send_notification(self, notification_type: str, **kwargs) -> bool:
        """Send notification through all enabled channels"""
        logger.info(f"Sending {notification_type} notification...")

        # Get template
        template = self.config["notification_templates"].get(notification_type, {})
        if not template:
            logger.error(
                f"No template found for notification type: {notification_type}"
            )
            return False

        # Format message
        try:
            subject = template["subject"].format(**kwargs)
            body = template["body"].format(**kwargs)
        except KeyError as e:
            logger.error(f"Missing template variable: {e}")
            return False

        # Send through all enabled channels
        success_count = 0
        total_channels = 0

        # Email
        if self.config["email"]["enabled"]:
            total_channels += 1
            if self.send_email_notification(subject, body):
                success_count += 1

        # Slack
        if self.config["slack"]["enabled"]:
            total_channels += 1
            if self.send_slack_notification(f"*{subject}*\n{body}"):
                success_count += 1

        # Discord
        if self.config["discord"]["enabled"]:
            total_channels += 1
            if self.send_discord_notification(f"**{subject}**\n{body}"):
                success_count += 1

        # Telegram
        if self.config["telegram"]["enabled"]:
            total_channels += 1
            if self.send_telegram_notification(f"<b>{subject}</b>\n{body}"):
                success_count += 1

        # WhatsApp
        if self.config["whatsapp"]["enabled"]:
            total_channels += 1
            if self.send_whatsapp_notification(f"{subject}\n{body}"):
                success_count += 1

        # Log results
        if total_channels > 0:
            logger.info(
                f"Notifications sent: {success_count}/{total_channels} channels successful"
            )
            return success_count > 0
        else:
            logger.warning("No notification channels are enabled")
            return False

    def notify_enhancement_success(
        self, models_updated: List[str], duration: float
    ) -> bool:
        """Notify about successful enhancement"""
        return self.send_notification(
            "enhancement_success",
            models_updated=", ".join(models_updated),
            duration=f"{duration:.2f} seconds",
        )

    def notify_enhancement_failure(self, error: str) -> bool:
        """Notify about enhancement failure"""
        return self.send_notification("enhancement_failure", error=error)

    def notify_deployment_success(self, environment: str, duration: float) -> bool:
        """Notify about successful deployment"""
        return self.send_notification(
            "deployment_success",
            environment=environment,
            duration=f"{duration:.2f} seconds",
        )

    def notify_deployment_failure(self, environment: str, error: str) -> bool:
        """Notify about deployment failure"""
        return self.send_notification(
            "deployment_failure", environment=environment, error=error
        )

    def notify_performance_alert(
        self, message: str, usage: float, threshold: float
    ) -> bool:
        """Notify about performance alert"""
        return self.send_notification(
            "performance_alert",
            message=message,
            usage=f"{usage:.1f}",
            threshold=f"{threshold:.1f}",
        )

    def notify_system_optimization(
        self, space_freed: float, optimizations: List[str]
    ) -> bool:
        """Notify about system optimization"""
        return self.send_notification(
            "system_optimization",
            space_freed=f"{space_freed:.2f}",
            optimizations=", ".join(optimizations),
        )

    def save_notification_history(self) -> None:
        """Save notification history to file"""
        try:
            history_file = self.logs_dir / "notification_history.json"

            # Load existing history
            existing_history = []
            if history_file.exists():
                with open(history_file, "r") as f:
                    existing_history = json.load(f)

            # Add current notifications
            existing_history.extend(self.notification_history)

            # Keep only last 100 notifications
            if len(existing_history) > 100:
                existing_history = existing_history[-100:]

            # Save updated history
            with open(history_file, "w") as f:
                json.dump(existing_history, f, indent=2, default=str)

        except Exception as e:
            logger.error(f"Error saving notification history: {e}")

    def test_notifications(self) -> Dict[str, bool]:
        """Test all notification channels"""
        logger.info("Testing notification channels...")

        test_results = {}

        # Test message
        test_message = f"QMOI notification test at {datetime.now().isoformat()}"

        # Test each channel
        if self.config["email"]["enabled"]:
            test_results["email"] = self.send_email_notification(
                "QMOI Notification Test", test_message
            )

        if self.config["slack"]["enabled"]:
            test_results["slack"] = self.send_slack_notification(test_message)

        if self.config["discord"]["enabled"]:
            test_results["discord"] = self.send_discord_notification(test_message)

        if self.config["telegram"]["enabled"]:
            test_results["telegram"] = self.send_telegram_notification(test_message)

        if self.config["whatsapp"]["enabled"]:
            test_results["whatsapp"] = self.send_whatsapp_notification(test_message)

        # Log results
        for channel, success in test_results.items():
            status = "SUCCESS" if success else "FAILED"
            logger.info(f"Test {channel}: {status}")

        return test_results


def main():
    parser = argparse.ArgumentParser(description="QMOI Enhancement Notification Script")
    parser.add_argument(
        "--status",
        "-s",
        choices=["success", "failure"],
        required=True,
        help="Enhancement status",
    )
    parser.add_argument(
        "--models-updated",
        "-m",
        default="",
        help="Comma-separated list of updated models",
    )
    parser.add_argument(
        "--duration",
        "-d",
        type=float,
        default=0.0,
        help="Enhancement duration in seconds",
    )
    parser.add_argument(
        "--error", "-e", default="", help="Error message (for failures)"
    )
    parser.add_argument(
        "--test", "-t", action="store_true", help="Test notification channels"
    )
    parser.add_argument(
        "--type",
        "-y",
        choices=["enhancement", "deployment", "performance", "optimization"],
        default="enhancement",
        help="Notification type",
    )

    args = parser.parse_args()

    notifier = QMOIEnhancementNotifier(notification_type=args.type)

    try:
        if args.test:
            # Test notifications
            results = notifier.test_notifications()
            print(json.dumps(results, indent=2))
        else:
            # Send notification
            if args.status == "success":
                models_updated = (
                    args.models_updated.split(",") if args.models_updated else []
                )
                success = notifier.notify_enhancement_success(
                    models_updated, args.duration
                )
            else:
                success = notifier.notify_enhancement_failure(args.error)

            if success:
                logger.info("Notification sent successfully")
            else:
                logger.error("Failed to send notification")
                sys.exit(1)

        # Save notification history
        notifier.save_notification_history()

    except Exception as e:
        logger.error(f"Notification error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
