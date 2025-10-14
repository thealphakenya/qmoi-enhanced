#!/usr/bin/env python3
"""
QMOI Enhanced Notification System
Comprehensive multi-channel notification system for all QMOI activities
"""

import os
import sys
import json
import smtplib
import requests
import logging
from datetime import datetime
from typing import Dict, List, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("qmoi-notifications.log"), logging.StreamHandler()],
)


class QMOIEnhancedNotifications:
    def __init__(self):
        self.master_emails = os.getenv(
            "MASTER_EMAILS", "rovicviccy@gmail.com,thealphakenya@gmail.com"
        ).split(",")
        self.notification_history = []
        self.active_channels = {
            "email": True,
            "whatsapp": True,
            "slack": True,
            "telegram": True,
            "discord": True,
            "sms": True,
            "push": True,
        }

        # Load configuration
        self.load_config()

    def load_config(self):
        """Load notification configuration"""
        try:
            with open("qmoi-notification-config.json", "r") as f:
                config = json.load(f)
                self.active_channels.update(config.get("channels", {}))
        except FileNotFoundError:
            # Create default config
            self.save_config()

    def save_config(self):
        """Save notification configuration"""
        config = {
            "channels": self.active_channels,
            "master_emails": self.master_emails,
            "last_updated": datetime.now().isoformat(),
        }
        with open("qmoi-notification-config.json", "w") as f:
            json.dump(config, f, indent=2)

    def send_email_notification(
        self, subject: str, message: str, priority: str = "normal"
    ) -> bool:
        """Send email notification to master emails."""
        try:
            # Email configuration
            smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            email_user = os.getenv("EMAIL_USER", "qmoi@alphakenya.com")
            email_password = os.getenv("EMAIL_PASSWORD", "")

            # Create message
            msg = MIMEMultipart()
            msg["From"] = email_user
            msg["To"] = ", ".join(self.master_emails)
            msg["Subject"] = f"QMOI Notification: {subject}"

            # Add priority header
            if priority == "high":
                msg["X-Priority"] = "1"
                msg["X-MSMail-Priority"] = "High"

            # Create HTML content
            html_content = f"""
            <html>
            <body>
                <h2>QMOI Enhanced Notification System</h2>
                <p><strong>Subject:</strong> {subject}</p>
                <p><strong>Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <p><strong>Priority:</strong> {priority.upper()}</p>
                <hr>
                <div style="white-space: pre-wrap;">{message}</div>
                <hr>
                <p><em>This is an automated notification from QMOI Enhanced Notification System.</em></p>
            </body>
            </html>
            """

            msg.attach(MIMEText(html_content, "html"))

            # Send email
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)
            server.quit()

            logging.info(f"Email notification sent: {subject}")
            return True
        except Exception as e:
            logging.error(f"Failed to send email notification: {e}")
            return False

    def send_whatsapp_notification(
        self, message: str, priority: str = "normal"
    ) -> bool:
        """Send WhatsApp notification via Twilio."""
        try:
            # Twilio configuration
            account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
            auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
            from_number = os.getenv("TWILIO_FROM_NUMBER", "")
            to_numbers = os.getenv("MASTER_WHATSAPP_NUMBERS", "").split(",")

            if not all([account_sid, auth_token, from_number, to_numbers]):
                logging.warning(
                    "WhatsApp notification skipped - missing Twilio configuration"
                )
                return False

            # Send to each number
            for to_number in to_numbers:
                if to_number.strip():
                    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
                    data = {
                        "From": f"whatsapp:{from_number}",
                        "To": f"whatsapp:{to_number.strip()}",
                        "Body": f"QMOI Notification ({priority.upper()}):\n\n{message}",
                    }

                    response = requests.post(
                        url, data=data, auth=(account_sid, auth_token)
                    )

                    if response.status_code == 201:
                        logging.info(f"WhatsApp notification sent to {to_number}")
                    else:
                        logging.error(
                            f"Failed to send WhatsApp notification to {to_number}: {response.text}"
                        )

            return True
        except Exception as e:
            logging.error(f"Failed to send WhatsApp notification: {e}")
            return False

    def send_slack_notification(self, message: str, priority: str = "normal") -> bool:
        """Send Slack notification."""
        try:
            webhook_url = os.getenv("SLACK_WEBHOOK_URL", "")
            if not webhook_url:
                logging.warning("Slack notification skipped - missing webhook URL")
                return False

            # Create Slack message
            slack_message = {
                "text": f"🔔 QMOI Notification ({priority.upper()})",
                "attachments": [
                    {
                        "color": "danger" if priority == "high" else "good",
                        "text": message,
                        "footer": "QMOI Enhanced Notification System",
                        "ts": int(time.time()),
                    }
                ],
            }

            response = requests.post(webhook_url, json=slack_message)

            if response.status_code == 200:
                logging.info("Slack notification sent")
                return True
            else:
                logging.error(f"Failed to send Slack notification: {response.text}")
                return False

        except Exception as e:
            logging.error(f"Failed to send Slack notification: {e}")
            return False

    def send_telegram_notification(
        self, message: str, priority: str = "normal"
    ) -> bool:
        """Send Telegram notification."""
        try:
            bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
            chat_ids = os.getenv("TELEGRAM_CHAT_IDS", "").split(",")

            if not bot_token or not chat_ids:
                logging.warning("Telegram notification skipped - missing configuration")
                return False

            for chat_id in chat_ids:
                if chat_id.strip():
                    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                    data = {
                        "chat_id": chat_id.strip(),
                        "text": f"🔔 QMOI Notification ({priority.upper()}):\n\n{message}",
                        "parse_mode": "HTML",
                    }

                    response = requests.post(url, data=data)

                    if response.status_code == 200:
                        logging.info(f"Telegram notification sent to {chat_id}")
                    else:
                        logging.error(
                            f"Failed to send Telegram notification to {chat_id}: {response.text}"
                        )

            return True
        except Exception as e:
            logging.error(f"Failed to send Telegram notification: {e}")
            return False

    def send_discord_notification(self, message: str, priority: str = "normal") -> bool:
        """Send Discord notification."""
        try:
            webhook_url = os.getenv("DISCORD_WEBHOOK_URL", "")
            if not webhook_url:
                logging.warning("Discord notification skipped - missing webhook URL")
                return False

            # Create Discord embed
            discord_message = {
                "embeds": [
                    {
                        "title": f"🔔 QMOI Notification ({priority.upper()})",
                        "description": message,
                        "color": 0xFF0000 if priority == "high" else 0x00FF00,
                        "timestamp": datetime.now().isoformat(),
                        "footer": {"text": "QMOI Enhanced Notification System"},
                    }
                ]
            }

            response = requests.post(webhook_url, json=discord_message)

            if response.status_code == 204:
                logging.info("Discord notification sent")
                return True
            else:
                logging.error(f"Failed to send Discord notification: {response.text}")
                return False

        except Exception as e:
            logging.error(f"Failed to send Discord notification: {e}")
            return False

    def send_sms_notification(self, message: str, priority: str = "normal") -> bool:
        """Send SMS notification via Twilio."""
        try:
            # Twilio configuration
            account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
            auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
            from_number = os.getenv("TWILIO_SMS_FROM_NUMBER", "")
            to_numbers = os.getenv("MASTER_SMS_NUMBERS", "").split(",")

            if not all([account_sid, auth_token, from_number, to_numbers]):
                logging.warning(
                    "SMS notification skipped - missing Twilio configuration"
                )
                return False

            # Send to each number
            for to_number in to_numbers:
                if to_number.strip():
                    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
                    data = {
                        "From": from_number,
                        "To": to_number.strip(),
                        "Body": f"QMOI ({priority.upper()}):\n\n{message[:140]}",  # SMS length limit
                    }

                    response = requests.post(
                        url, data=data, auth=(account_sid, auth_token)
                    )

                    if response.status_code == 201:
                        logging.info(f"SMS notification sent to {to_number}")
                    else:
                        logging.error(
                            f"Failed to send SMS notification to {to_number}: {response.text}"
                        )

            return True
        except Exception as e:
            logging.error(f"Failed to send SMS notification: {e}")
            return False

    def send_push_notification(
        self, title: str, message: str, priority: str = "normal"
    ) -> bool:
        """Send push notification."""
        try:
            # This would integrate with a push notification service
            # For now, we'll log it
            logging.info(f"Push notification: {title} - {message}")
            return True
        except Exception as e:
            logging.error(f"Failed to send push notification: {e}")
            return False

    def send_comprehensive_notification(
        self,
        subject: str,
        message: str,
        priority: str = "normal",
        channels: List[str] = None,
    ) -> Dict:
        """Send notification to all active channels"""
        if channels is None:
            channels = list(self.active_channels.keys())

        results = {
            "timestamp": datetime.now().isoformat(),
            "subject": subject,
            "message": message,
            "priority": priority,
            "channels": {},
        }

        # Send to each channel
        for channel in channels:
            if channel in self.active_channels and self.active_channels[channel]:
                success = False

                if channel == "email":
                    success = self.send_email_notification(subject, message, priority)
                elif channel == "whatsapp":
                    success = self.send_whatsapp_notification(message, priority)
                elif channel == "slack":
                    success = self.send_slack_notification(message, priority)
                elif channel == "telegram":
                    success = self.send_telegram_notification(message, priority)
                elif channel == "discord":
                    success = self.send_discord_notification(message, priority)
                elif channel == "sms":
                    success = self.send_sms_notification(message, priority)
                elif channel == "push":
                    success = self.send_push_notification(subject, message, priority)

                results["channels"][channel] = success
                if success:
                    results["success_count"] += 1
        # Log notification
        self.notification_history.append(results)

        # Save notification history
        self.save_notification_history()

        logging.info(
            f"Comprehensive notification sent: {results['success_count']}/{results['total_channels']} channels successful"
        )
        return results

    def save_notification_history(self):
        """Save notification history to file"""
        try:
            with open("qmoi-notification-history.json", "w") as f:
                json.dump(self.notification_history, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to save notification history: {e}")

    def send_automation_notification(
        self, automation_type: str, status: str, details: str = ""
    ) -> Dict:
        """Automation-specific notification"""
        subject = f"QMOI Automation: {automation_type}"
        message = f"""
Automation Type: {automation_type}
Status: {status}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Details:
{details}

This is an automated notification from QMOI Enhanced Notification System.
"""

        priority = "high" if status in ["failed", "error", "critical"] else "normal"
        return self.send_comprehensive_notification(subject, message, priority)

    def send_health_check_notification(self, health_status: str, details: Dict) -> Dict:
        """Send healthcheck notification"""
        subject = f"QMOI Health Check: {health_status}"
        message = f"""
Health Check Status: {health_status}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Health Check Details:
{json.dumps(details, indent=2)}

This is an automated health check notification from QMOI Enhanced Notification System.
"""

        priority = (
            "high"
            if health_status in ["issues_detected", "failed", "ror"]
            else "normal"
        )
        return self.send_comprehensive_notification(subject, message, priority)

    def send_git_operation_notification(
        self, operation: str, status: str, details: str = ""
    ) -> Dict:
        """Send Git operation notification"""
        subject = f"QMOI Git Operation: {operation}"
        message = f"""
Git Operation: {operation}
Status: {status}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Details:
{details}

This is an automated Git operation notification from QMOI Enhanced Notification System.
"""

        priority = "high" if status in ["failed", "error", "conflict"] else "normal"
        return self.send_comprehensive_notification(subject, message, priority)

    def start_continuous_monitoring(self):
        """Start continuous monitoring and notification"""

        def monitoring_loop():
            while True:
                try:
                    # Check for new notifications
                    self.check_for_notifications()

                    # Send heartbeat notification every hour
                    if datetime.now().minute == 0:
                        self.send_comprehensive_notification(
                            "QMOI System Heartbeat",
                            "QMOI Enhanced Notification System is running normally.",
                            "normal",
                            ["email"],  # Only email for heartbeat
                        )

                    time.sleep(60)  # Check every minute

                except Exception as e:
                    logging.error(f"Error in monitoring loop: {e}")
                    time.sleep(60)

        # Start monitoring in background thread
        monitoring_thread = threading.Thread(target=monitoring_loop, daemon=True)
        monitoring_thread.start()

        logging.info("Continuous monitoring started")


def main():
    """Main function to run notification system"""
    notifications = QMOIEnhancedNotifications()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "--test":
            # Test all notification channels
            result = notifications.send_comprehensive_notification(
                "QMOI Notification System Test",
                "This is a test notification from QMOI Enhanced Notification System.",
                "normal",
            )
            print(json.dumps(result, indent=2))

        elif command == "--automation":
            # Send automation notification
            automation_type = sys.argv[2] if len(sys.argv) > 2 else "unknown"
            status = sys.argv[3] if len(sys.argv) > 3 else "completed"
            details = sys.argv[4] if len(sys.argv) > 4 else ""

            result = notifications.send_automation_notification(
                automation_type, status, details
            )
            print(json.dumps(result, indent=2))

        elif command == "--health-check":
            # Send health check notification
            health_status = sys.argv[2] if len(sys.argv) > 2 else "healthy"
            details = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}

            result = notifications.send_health_check_notification(
                health_status, details
            )
            print(json.dumps(result, indent=2))

        elif command == "--git-operation":
            # Send Git operation notification
            operation = sys.argv[2] if len(sys.argv) > 2 else "unknown"
            status = sys.argv[3] if len(sys.argv) > 3 else "completed"
            details = sys.argv[4] if len(sys.argv) > 4 else ""

            result = notifications.send_git_operation_notification(
                operation, status, details
            )
            print(json.dumps(result, indent=2))

        elif command == "--continuous":
            # Start continuous monitoring
            notifications.start_continuous_monitoring()

            # Keep main thread alive
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                logging.info("Continuous monitoring stopped by user")
        else:
            print("Usage:")
            print("  python qmoi-enhanced-notifications.py --test")
            print(
                "  python qmoi-enhanced-notifications.py --automation <type> <status> [details]"
            )
            print(
                "  python qmoi-enhanced-notifications.py --health-check <status> [details]"
            )
            print(
                "  python qmoi-enhanced-notifications.py --git-operation <operation> <status> [details]"
            )
            print("  python qmoi-enhanced-notifications.py --continuous")
    else:
        # Send default notification
        result = notifications.send_comprehensive_notification(
            "QMOI Enhanced Notification System",
            "QMOI Enhanced Notification System is now active and monitoring all activities.",
            "normal",
        )
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
