#!/usr/bin/env python3
"""
QMOI Notification Monitor
Comprehensive notification system for all QMOI monitoring alerts and system communications.
Handles email, Slack, Discord, webhooks, and other notification channels.
"""

import os
import sys
import json
import time
import logging
import threading
import smtplib
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import queue

class NotificationMonitor:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.notification_queue = queue.Queue()
        self.notification_history = []
        self.active_notifications = {}
        self.channel_status = {}
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('logs/notification_monitor.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def load_config(self) -> Dict[str, Any]:
        """Load notification configuration"""
        config = {
            'channels': {
                'email': {
                    'enabled': True,
                    'smtp_server': 'smtp.gmail.com',
                    'smtp_port': 587,
                    'username': os.getenv('EMAIL_USERNAME', ''),
                    'password': os.getenv('EMAIL_PASSWORD', ''),
                    'from_address': os.getenv('EMAIL_FROM', 'qmoi@alpha-q.ai'),
                    'to_addresses': ['admin@alpha-q.ai', 'support@alpha-q.ai']
                },
                'slack': {
                    'enabled': True,
                    'webhook_url': os.getenv('SLACK_WEBHOOK_URL', ''),
                    'channel': '#qmoi-alerts',
                    'username': 'QMOI Monitor'
                },
                'discord': {
                    'enabled': True,
                    'webhook_url': os.getenv('DISCORD_WEBHOOK_URL', ''),
                    'username': 'QMOI Monitor'
                },
                'webhook': {
                    'enabled': True,
                    'urls': [
                        os.getenv('WEBHOOK_URL_1', ''),
                        os.getenv('WEBHOOK_URL_2', '')
                    ]
                },
                'telegram': {
                    'enabled': True,
                    'bot_token': os.getenv('TELEGRAM_BOT_TOKEN', ''),
                    'chat_id': os.getenv('TELEGRAM_CHAT_ID', '')
                }
            },
            'notification_rules': {
                'system_health': {
                    'channels': ['email', 'slack'],
                    'priority': 'high',
                    'cooldown': 300  # 5 minutes
                },
                'security_alert': {
                    'channels': ['email', 'slack', 'discord'],
                    'priority': 'critical',
                    'cooldown': 60   # 1 minute
                },
                'performance_issue': {
                    'channels': ['slack'],
                    'priority': 'medium',
                    'cooldown': 600  # 10 minutes
                },
                'cost_alert': {
                    'channels': ['email', 'slack'],
                    'priority': 'high',
                    'cooldown': 1800  # 30 minutes
                },
                'backup_status': {
                    'channels': ['email'],
                    'priority': 'low',
                    'cooldown': 3600  # 1 hour
                }
            },
            'templates': {
                'system_health': {
                    'subject': 'QMOI System Health Alert',
                    'template': '''
🚨 QMOI System Health Alert

**System:** {system_name}
**Status:** {status}
**Severity:** {severity}
**Time:** {timestamp}
**Details:** {details}

**Actions Required:**
{actions}

---
QMOI AI System Monitor
                    '''
                },
                'security_alert': {
                    'subject': '🚨 QMOI Security Alert - IMMEDIATE ACTION REQUIRED',
                    'template': '''
🚨 CRITICAL SECURITY ALERT

**Threat Type:** {threat_type}
**Severity:** {severity}
**Time:** {timestamp}
**Affected System:** {system_name}
**Details:** {details}

**IMMEDIATE ACTIONS:**
{actions}

**Status:** {status}

---
QMOI Security Monitor
                    '''
                },
                'performance_issue': {
                    'subject': 'QMOI Performance Issue Detected',
                    'template': '''
⚠️ Performance Issue Detected

**Component:** {component}
**Issue:** {issue}
**Impact:** {impact}
**Time:** {timestamp}
**Metrics:** {metrics}

**Recommendations:**
{recommendations}

---
QMOI Performance Monitor
                    '''
                },
                'cost_alert': {
                    'subject': '💰 QMOI Cost Alert',
                    'template': '''
💰 Cost Alert

**Current Cost:** ${current_cost}
**Threshold:** ${threshold}
**Period:** {period}
**Time:** {timestamp}

**Cost Breakdown:**
{cost_breakdown}

**Recommendations:**
{recommendations}

---
QMOI Cost Monitor
                    '''
                },
                'backup_status': {
                    'subject': '💾 QMOI Backup Status Report',
                    'template': '''
💾 Backup Status Report

**Status:** {status}
**Last Backup:** {last_backup}
**Next Backup:** {next_backup}
**Size:** {size}
**Duration:** {duration}

**Details:**
{details}

---
QMOI Backup Monitor
                    '''
                }
            }
        }
        
        # Load from config file if exists
        config_file = 'config/notification_config.json'
        if os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")
        
        return config
    
    def send_email_notification(self, notification: Dict[str, Any]) -> bool:
        """Send email notification"""
        try:
            if not self.config['channels']['email']['enabled']:
                return False
            
            email_config = self.config['channels']['email']
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = email_config['from_address']
            msg['To'] = ', '.join(email_config['to_addresses'])
            msg['Subject'] = notification['subject']
            
            # Create HTML body
            html_body = notification['body']
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            server = smtplib.SMTP(email_config['smtp_server'], email_config['smtp_port'])
            server.starttls()
            server.login(email_config['username'], email_config['password'])
            server.send_message(msg)
            server.quit()
            
            self.logger.info(f"Email notification sent: {notification['id']}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error sending email notification: {e}")
            return False
    
    def send_slack_notification(self, notification: Dict[str, Any]) -> bool:
        """Send Slack notification"""
        try:
            if not self.config['channels']['slack']['enabled']:
                return False
            
            slack_config = self.config['channels']['slack']
            
            # Prepare payload
            payload = {
                'channel': slack_config['channel'],
                'username': slack_config['username'],
                'text': notification['body'],
                'icon_emoji': ':robot_face:'
            }
            
            # Send to webhook
            response = requests.post(slack_config['webhook_url'], json=payload, timeout=10)
            
            if response.status_code == 200:
                self.logger.info(f"Slack notification sent: {notification['id']}")
                return True
            else:
                self.logger.error(f"Slack notification failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending Slack notification: {e}")
            return False
    
    def send_discord_notification(self, notification: Dict[str, Any]) -> bool:
        """Send Discord notification"""
        try:
            if not self.config['channels']['discord']['enabled']:
                return False
            
            discord_config = self.config['channels']['discord']
            
            # Prepare payload
            payload = {
                'username': discord_config['username'],
                'content': notification['body']
            }
            
            # Send to webhook
            response = requests.post(discord_config['webhook_url'], json=payload, timeout=10)
            
            if response.status_code == 204:
                self.logger.info(f"Discord notification sent: {notification['id']}")
                return True
            else:
                self.logger.error(f"Discord notification failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending Discord notification: {e}")
            return False
    
    def send_webhook_notification(self, notification: Dict[str, Any]) -> bool:
        """Send webhook notification"""
        try:
            if not self.config['channels']['webhook']['enabled']:
                return False
            
            webhook_config = self.config['channels']['webhook']
            success_count = 0
            
            for url in webhook_config['urls']:
                if not url:
                    continue
                
                try:
                    payload = {
                        'notification_id': notification['id'],
                        'type': notification['type'],
                        'priority': notification['priority'],
                        'timestamp': notification['timestamp'],
                        'subject': notification['subject'],
                        'body': notification['body'],
                        'data': notification.get('data', {})
                    }
                    
                    response = requests.post(url, json=payload, timeout=10)
                    
                    if response.status_code in [200, 201, 202]:
                        success_count += 1
                        self.logger.info(f"Webhook notification sent to {url}")
                    else:
                        self.logger.warning(f"Webhook notification failed for {url}: {response.status_code}")
                        
                except Exception as e:
                    self.logger.error(f"Error sending webhook to {url}: {e}")
            
            return success_count > 0
            
        except Exception as e:
            self.logger.error(f"Error sending webhook notifications: {e}")
            return False
    
    def send_telegram_notification(self, notification: Dict[str, Any]) -> bool:
        """Send Telegram notification"""
        try:
            if not self.config['channels']['telegram']['enabled']:
                return False
            
            telegram_config = self.config['channels']['telegram']
            
            # Prepare message
            message = f"*{notification['subject']}*\n\n{notification['body']}"
            
            # Send via Telegram Bot API
            url = f"https://api.telegram.org/bot{telegram_config['bot_token']}/sendMessage"
            payload = {
                'chat_id': telegram_config['chat_id'],
                'text': message,
                'parse_mode': 'Markdown'
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                self.logger.info(f"Telegram notification sent: {notification['id']}")
                return True
            else:
                self.logger.error(f"Telegram notification failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending Telegram notification: {e}")
            return False
    
    def create_notification(self, notification_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a notification"""
        try:
            # Get notification rule
            rule = self.config['notification_rules'].get(notification_type, {})
            template = self.config['templates'].get(notification_type, {})
            
            # Generate notification ID
            notification_id = f"{notification_type}_{int(time.time())}"
            
            # Format template
            subject = template.get('subject', f'QMOI {notification_type.title()} Alert')
            body_template = template.get('template', '**{notification_type}**\n\n{details}')
            
            # Format body
            body = body_template.format(**data)
            
            notification = {
                'id': notification_id,
                'type': notification_type,
                'priority': rule.get('priority', 'medium'),
                'channels': rule.get('channels', ['email']),
                'cooldown': rule.get('cooldown', 300),
                'subject': subject,
                'body': body,
                'data': data,
                'timestamp': datetime.now().isoformat(),
                'status': 'pending'
            }
            
            return notification
            
        except Exception as e:
            self.logger.error(f"Error creating notification: {e}")
            return {}
    
    def should_send_notification(self, notification: Dict[str, Any]) -> bool:
        """Check if notification should be sent based on cooldown"""
        try:
            notification_id = notification['id']
            cooldown = notification['cooldown']
            
            # Check if notification was recently sent
            if notification_id in self.active_notifications:
                last_sent = self.active_notifications[notification_id]['last_sent']
                if datetime.now() - last_sent < timedelta(seconds=cooldown):
                    return False
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error checking notification cooldown: {e}")
            return True
    
    def send_notification(self, notification: Dict[str, Any]) -> bool:
        """Send notification through all configured channels"""
        try:
            success = False
            
            # Send to each configured channel
            for channel in notification['channels']:
                channel_success = False
                
                if channel == 'email':
                    channel_success = self.send_email_notification(notification)
                elif channel == 'slack':
                    channel_success = self.send_slack_notification(notification)
                elif channel == 'discord':
                    channel_success = self.send_discord_notification(notification)
                elif channel == 'webhook':
                    channel_success = self.send_webhook_notification(notification)
                elif channel == 'telegram':
                    channel_success = self.send_telegram_notification(notification)
                
                if channel_success:
                    success = True
                    self.logger.info(f"Notification sent via {channel}: {notification['id']}")
                else:
                    self.logger.warning(f"Failed to send notification via {channel}: {notification['id']}")
            
            # Update notification status
            notification['status'] = 'sent' if success else 'failed'
            notification['sent_at'] = datetime.now().isoformat()
            
            # Update active notifications
            self.active_notifications[notification['id']] = {
                'last_sent': datetime.now(),
                'status': notification['status']
            }
            
            # Add to history
            self.notification_history.append(notification)
            
            # Keep only last 1000 notifications in history
            if len(self.notification_history) > 1000:
                self.notification_history = self.notification_history[-1000:]
            
            return success
            
        except Exception as e:
            self.logger.error(f"Error sending notification: {e}")
            return False
    
    def process_notification_queue(self):
        """Process notification queue"""
        while True:
            try:
                # Get notification from queue
                notification = self.notification_queue.get(timeout=1)
                
                # Check if should send
                if self.should_send_notification(notification):
                    self.send_notification(notification)
                else:
                    self.logger.info(f"Notification skipped due to cooldown: {notification['id']}")
                
                # Mark task as done
                self.notification_queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                self.logger.error(f"Error processing notification queue: {e}")
    
    def add_notification(self, notification_type: str, data: Dict[str, Any]):
        """Add notification to queue"""
        try:
            notification = self.create_notification(notification_type, data)
            if notification:
                self.notification_queue.put(notification)
                self.logger.info(f"Notification queued: {notification['id']}")
            
        except Exception as e:
            self.logger.error(f"Error adding notification: {e}")
    
    def start_monitoring(self):
        """Start notification monitoring"""
        try:
            self.logger.info("Starting QMOI Notification Monitor")
            
            # Start notification processor thread
            processor_thread = threading.Thread(target=self.process_notification_queue)
            processor_thread.daemon = True
            processor_thread.start()
            
            self.logger.info("Notification monitor started")
            
        except Exception as e:
            self.logger.error(f"Error starting notification monitor: {e}")
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate notification report"""
        try:
            # Calculate statistics
            total_notifications = len(self.notification_history)
            successful_notifications = len([n for n in self.notification_history if n['status'] == 'sent'])
            failed_notifications = len([n for n in self.notification_history if n['status'] == 'failed'])
            
            # Group by type
            notifications_by_type = {}
            for notification in self.notification_history:
                notification_type = notification['type']
                if notification_type not in notifications_by_type:
                    notifications_by_type[notification_type] = []
                notifications_by_type[notification_type].append(notification)
            
            # Group by priority
            notifications_by_priority = {}
            for notification in self.notification_history:
                priority = notification['priority']
                if priority not in notifications_by_priority:
                    notifications_by_priority[priority] = []
                notifications_by_priority[priority].append(notification)
            
            report = {
                'timestamp': datetime.now().isoformat(),
                'summary': {
                    'total_notifications': total_notifications,
                    'successful_notifications': successful_notifications,
                    'failed_notifications': failed_notifications,
                    'success_rate': (successful_notifications / total_notifications * 100) if total_notifications > 0 else 0,
                    'active_notifications': len(self.active_notifications)
                },
                'by_type': {
                    notification_type: {
                        'count': len(notifications),
                        'success_rate': len([n for n in notifications if n['status'] == 'sent']) / len(notifications) * 100
                    }
                    for notification_type, notifications in notifications_by_type.items()
                },
                'by_priority': {
                    priority: {
                        'count': len(notifications),
                        'types': list(set(n['type'] for n in notifications))
                    }
                    for priority, notifications in notifications_by_priority.items()
                },
                'channel_status': self.channel_status,
                'recent_notifications': self.notification_history[-10:]  # Last 10 notifications
            }
            
            return report
            
        except Exception as e:
            self.logger.error(f"Error generating report: {e}")
            return {}
    
    def save_report(self, report: Dict[str, Any]):
        """Save notification report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            report_file = f'logs/notification_report_{timestamp}.json'
            
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            
            # Save latest report
            with open('logs/notification_latest.json', 'w') as f:
                json.dump(report, f, indent=2)
            
            self.logger.info(f"Notification report saved: {report_file}")
            
        except Exception as e:
            self.logger.error(f"Error saving report: {e}")
    
    def run(self):
        """Main notification loop"""
        try:
            self.logger.info("Starting QMOI Notification Monitor")
            self.start_monitoring()
            
            # Generate reports periodically
            while True:
                time.sleep(3600)  # Generate report every hour
                
                report = self.generate_report()
                self.save_report(report)
                
                # Log summary
                summary = report.get('summary', {})
                self.logger.info(f"Notification Status: {summary.get('successful_notifications', 0)}/{summary.get('total_notifications', 0)} "
                               f"successful ({summary.get('success_rate', 0):.1f}% success rate)")
                
        except KeyboardInterrupt:
            self.logger.info("Received interrupt signal")
        except Exception as e:
            self.logger.error(f"Error in main notification loop: {e}")

def main():
    """Main function"""
    monitor = NotificationMonitor()
    monitor.run()

if __name__ == "__main__":
    main() 