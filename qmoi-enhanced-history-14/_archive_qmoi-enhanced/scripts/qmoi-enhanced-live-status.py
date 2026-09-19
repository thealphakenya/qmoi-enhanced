#!/usr/bin/env python3
"""
QMOI Enhanced Live Status & Report Streamer
Enhanced real-time status reporting with detailed automation outcomes, success/failure tracking,
and comprehensive notification system integration.
"""
import os
import sys
import time
import json
import threading
import datetime
import subprocess
from pathlib import Path
import signal
import requests
from typing import Dict, List, Any, Optional

# Configuration
LOG_FILE = Path(__file__).parent.parent / "logs" / "qmoi-master-automation.log"
REPORT_FILE = Path(__file__).parent.parent / "logs" / "master-automation-report.json"
ENHANCED_REPORT_FILE = Path(__file__).parent.parent / "logs" / "enhanced-automation-report.json"
RUNNER_STATUS_FILE = Path(__file__).parent.parent / "logs" / "qcity-runners-status.json"
AUTOMATION_STATUS_FILE = Path(__file__).parent.parent / "logs" / "automation-status.json"

# Email configuration
MASTER_EMAILS = ["rovicviccy@gmail.com", "thealphakenya@gmail.com"]

should_run = True

class EnhancedStatusReporter:
    def __init__(self):
        self.status_data = {
            "timestamp": datetime.datetime.now().isoformat(),
            "automation_status": {},
            "runners_status": {},
            "platform_status": {},
            "error_summary": [],
            "success_summary": [],
            "overall_status": "running"
        }
        self.last_notification = None
        self.notification_interval = 300  # 5 minutes

    def update_automation_status(self, component: str, status: str, details: Dict[str, Any] = None):
        """Update status for a specific automation component."""
        self.status_data["automation_status"][component] = {
            "status": status,
            "timestamp": datetime.datetime.now().isoformat(),
            "details": details or {}
        }
        self._save_status()

    def update_runner_status(self, runner_name: str, status: str, details: Dict[str, Any] = None):
        """Update status for a specific QCity runner."""
        self.status_data["runners_status"][runner_name] = {
            "status": status,
            "timestamp": datetime.datetime.now().isoformat(),
            "details": details or {}
        }
        self._save_status()

    def update_platform_status(self, platform: str, status: str, details: Dict[str, Any] = None):
        """Update status for a specific platform (GitHub, GitLab, etc.)."""
        self.status_data["platform_status"][platform] = {
            "status": status,
            "timestamp": datetime.datetime.now().isoformat(),
            "details": details or {}
        }
        self._save_status()

    def add_error(self, component: str, error: str, details: Dict[str, Any] = None):
        """Add an error to the summary."""
        error_entry = {
            "component": component,
            "error": error,
            "timestamp": datetime.datetime.now().isoformat(),
            "details": details or {}
        }
        self.status_data["error_summary"].append(error_entry)
        self._save_status()

    def add_success(self, component: str, success: str, details: Dict[str, Any] = None):
        """Add a success to the summary."""
        success_entry = {
            "component": component,
            "success": success,
            "timestamp": datetime.datetime.now().isoformat(),
            "details": details or {}
        }
        self.status_data["success_summary"].append(success_entry)
        self._save_status()

    def _save_status(self):
        """Save current status to file."""
        try:
            with open(ENHANCED_REPORT_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.status_data, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving status: {e}")

    def get_status_summary(self) -> str:
        """Generate a comprehensive status summary."""
        total_automation = len(self.status_data["automation_status"])
        successful_automation = len([s for s in self.status_data["automation_status"].values() if s["status"] == "success"])
        
        total_runners = len(self.status_data["runners_status"])
        successful_runners = len([s for s in self.status_data["runners_status"].values() if s["status"] == "success"])
        
        total_platforms = len(self.status_data["platform_status"])
        successful_platforms = len([s for s in self.status_data["platform_status"].values() if s["status"] == "success"])
        
        total_errors = len(self.status_data["error_summary"])
        total_successes = len(self.status_data["success_summary"])
        
        return f"Automation: {successful_automation}/{total_automation} | Runners: {successful_runners}/{total_runners} | Platforms: {successful_platforms}/{total_platforms} | Errors: {total_errors} | Successes: {total_successes}"

    def should_send_notification(self) -> bool:
        """Check if we should send a notification based on time interval."""
        if self.last_notification is None:
            return True
        time_since_last = (datetime.datetime.now() - self.last_notification).total_seconds()
        return time_since_last >= self.notification_interval

    def send_email_notification(self, subject: str, message: str):
        """Send email notification to master emails."""
        try:
            from scripts.qmoi_notification_manager import QmoiNotificationManager
            notifier = QmoiNotificationManager()
            notifier.send_gmail(subject, message)
            self.last_notification = datetime.datetime.now()
            print(f"Email notification sent: {subject}")
        except Exception as e:
            print(f"Error sending email notification: {e}")

    def send_whatsapp_notification(self, message: str):
        """Send WhatsApp notification."""
        try:
            from scripts.qmoi_notification_manager import QmoiNotificationManager
            notifier = QmoiNotificationManager()
            notifier.send_whatsapp(message)
            print("WhatsApp notification sent")
        except Exception as e:
            print(f"Error sending WhatsApp notification: {e}")

class QMOIEnhancedLiveStatus:
    def __init__(self):
        self.reporter = EnhancedStatusReporter()
        self.last_summary = None
        self.monitored_components = [
            "qmoi-master-automation",
            "qmoi-auto-fix",
            "qmoi-auto-evolution",
            "qmoi-platform-optimizer",
            "qmoi-error-handler",
            "qmoi-notification-manager",
            "qmoi-qcity-automatic",
            "qmoi-real-time-monitor"
        ]
        self.monitored_runners = [
            "github-runner",
            "gitlab-runner", 
            "vercel-runner",
            "netlify-runner",
            "gitpod-runner",
            "huggingface-runner",
            "quantum-runner",
            "colab-runner",
            "dagshub-runner"
        ]
        self.monitored_platforms = [
            "github",
            "gitlab",
            "vercel", 
            "netlify",
            "gitpod",
            "huggingface",
            "quantum",
            "colab",
            "dagshub"
        ]

    def monitor_log_file(self):
        """Monitor the main log file for automation events."""
        def handle_log_line(line):
            line = line.strip()
            if not line:
                return
            
            # Parse automation events
            if "SUCCESS" in line.upper():
                component = self._extract_component(line)
                self.reporter.add_success(component, line)
                self.reporter.update_automation_status(component, "success", {"log_line": line})
            elif "ERROR" in line.upper() or "FAIL" in line.upper():
                component = self._extract_component(line)
                self.reporter.add_error(component, line)
                self.reporter.update_automation_status(component, "error", {"log_line": line})
            elif "RUNNER" in line.upper():
                self._parse_runner_status(line)
            elif "PLATFORM" in line.upper():
                self._parse_platform_status(line)

        self._tail_file(LOG_FILE, handle_log_line)

    def _extract_component(self, line: str) -> str:
        """Extract component name from log line."""
        for component in self.monitored_components:
            if component.replace("-", "").lower() in line.lower():
                return component
        return "unknown"

    def _parse_runner_status(self, line: str):
        """Parse runner status from log line."""
        for runner in self.monitored_runners:
            if runner.replace("-", "").lower() in line.lower():
                status = "success" if "SUCCESS" in line.upper() else "error" if "ERROR" in line.upper() else "running"
                self.reporter.update_runner_status(runner, status, {"log_line": line})
                break

    def _parse_platform_status(self, line: str):
        """Parse platform status from log line."""
        for platform in self.monitored_platforms:
            if platform.lower() in line.lower():
                status = "success" if "SUCCESS" in line.upper() else "error" if "ERROR" in line.upper() else "running"
                self.reporter.update_platform_status(platform, status, {"log_line": line})
                break

    def monitor_enhanced_report(self):
        """Monitor and display enhanced report updates."""
        while should_run:
            if ENHANCED_REPORT_FILE.exists():
                try:
                    with open(ENHANCED_REPORT_FILE, 'r', encoding='utf-8') as f:
                        report = json.load(f)
                    
                    summary = self.reporter.get_status_summary()
                    if summary != self.last_summary:
                        print(f"\n[ENHANCED REPORT] {summary}")
                        print(f"[TIMESTAMP] {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                        
                        # Show detailed status
                        self._print_detailed_status(report)
                        
                        # Send notifications if needed
                        if self.reporter.should_send_notification():
                            self._send_status_notifications(summary, report)
                        
                        self.last_summary = summary
                except Exception as e:
                    print(f"[ENHANCED REPORT] Error reading report: {e}")
            time.sleep(10)

    def _print_detailed_status(self, report: Dict[str, Any]):
        """Print detailed status information."""
        print("\n--- DETAILED STATUS ---")
        
        # Automation Status
        print("\n🤖 AUTOMATION COMPONENTS:")
        for component, status in report.get("automation_status", {}).items():
            emoji = "✅" if status["status"] == "success" else "❌" if status["status"] == "error" else "🔄"
            print(f"  {emoji} {component}: {status['status']}")
        
        # Runner Status
        print("\n🏃 QCity RUNNERS:")
        for runner, status in report.get("runners_status", {}).items():
            emoji = "✅" if status["status"] == "success" else "❌" if status["status"] == "error" else "🔄"
            print(f"  {emoji} {runner}: {status['status']}")
        
        # Platform Status
        print("\n🌐 PLATFORMS:")
        for platform, status in report.get("platform_status", {}).items():
            emoji = "✅" if status["status"] == "success" else "❌" if status["status"] == "error" else "🔄"
            print(f"  {emoji} {platform}: {status['status']}")
        
        # Recent Errors
        recent_errors = report.get("error_summary", [])[-5:]  # Last 5 errors
        if recent_errors:
            print("\n❌ RECENT ERRORS:")
            for error in recent_errors:
                print(f"  {error['component']}: {error['error'][:100]}...")
        
        # Recent Successes
        recent_successes = report.get("success_summary", [])[-5:]  # Last 5 successes
        if recent_successes:
            print("\n✅ RECENT SUCCESSES:")
            for success in recent_successes:
                print(f"  {success['component']}: {success['success'][:100]}...")

    def _send_status_notifications(self, summary: str, report: Dict[str, Any]):
        """Send status notifications via email and WhatsApp."""
        # Email notification
        subject = f"QMOI Status Report - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        message = f"""
QMOI Enhanced Status Report

{summary}

Detailed Status:
- Automation Components: {len(report.get('automation_status', {}))} monitored
- QCity Runners: {len(report.get('runners_status', {}))} monitored  
- Platforms: {len(report.get('platform_status', {}))} monitored
- Total Errors: {len(report.get('error_summary', []))}
- Total Successes: {len(report.get('success_summary', []))}

Full report available in logs/enhanced-automation-report.json
        """
        self.reporter.send_email_notification(subject, message.strip())
        
        # WhatsApp notification (shorter version)
        whatsapp_msg = f"QMOI Status: {summary}"
        self.reporter.send_whatsapp_notification(whatsapp_msg)

    def _tail_file(self, filepath: Path, callback, sleep: float = 1):
        """Tail a file and call callback(line) for each new line."""
        try:
            with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
                f.seek(0, os.SEEK_END)
                while should_run:
                    line = f.readline()
                    if not line:
                        time.sleep(sleep)
                        continue
                    callback(line)
        except FileNotFoundError:
            print(f"Log file not found: {filepath}")
            while should_run:
                time.sleep(sleep)

    def start_monitoring(self):
        """Start all monitoring threads."""
        print("🚀 QMOI Enhanced Live Status & Report Streamer")
        print(f"📊 Monitoring log: {LOG_FILE}")
        print(f"📈 Enhanced report: {ENHANCED_REPORT_FILE}")
        print("📧 Notifications: Email + WhatsApp")
        print("⏰ Status updates every 10 seconds")
        print("📱 Notifications every 5 minutes")
        print("\n" + "="*60)
        
        # Start monitoring threads
        log_thread = threading.Thread(target=self.monitor_log_file, daemon=True)
        report_thread = threading.Thread(target=self.monitor_enhanced_report, daemon=True)
        
        log_thread.start()
        report_thread.start()
        
        # Main loop
        while should_run:
            time.sleep(1)

def handle_exit(signum, frame):
    global should_run
    should_run = False
    print("\n[QMOI Enhanced Live Status] Exiting and printing final summary...")
    if ENHANCED_REPORT_FILE.exists():
        with open(ENHANCED_REPORT_FILE, 'r', encoding='utf-8') as f:
            report = json.load(f)
        print("\nFinal Enhanced Report:")
        print(json.dumps(report, indent=2, default=str))
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

def main():
    monitor = QMOIEnhancedLiveStatus()
    monitor.start_monitoring()

if __name__ == "__main__":
    main() 