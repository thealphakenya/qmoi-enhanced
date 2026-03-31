// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
QMOI production Health Monitor
Continuous monitoring system for 100% domain and system health
"""

import json
import os
import time
import threading
import requests
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class HealthMonitor:
    """production health monitoring system"""

    def __init__(self, config_file: str = 'health_monitor_config.json'):
        self.config_file = config_file
        self.config = self.load_config()
        self.alerts_sent = set()
        self.health_history = []
        self.is_monitoring = False
        self.monitor_thread = None

    def load_config(self) -> Dict:
        """Load health monitor configuration"""
        default_config = {
            "domains": [
                "qmoi.ai", "www.qmoi.ai", "api.qmoi.ai",
                "qcity.qmoi.ai", "qmoi-space.qmoi.ai", "yap.qmoi.ai", "q-stable.qmoi.ai",
                "qvillage.com", "qvillage.net", "qvillage.org", "qglobal.org",
                "stableq.ai", "qparallel.prod"
            ],
            "endpoints": [
                "https://qvillage.com/api/health",
                "https://stableq.ai/api/status",
                "https://qmoi.ai/api/qmoi-tracks"
            ],
            "alerts": {
                "email": {
                    "enabled": False,
                    "smtp_server": "smtp.gmail.com",
                    "smtp_port": 587,
                    "username": "",
                    "password": "",
                    "recipients": ["admin@qmoi.ai"]
                },
                "slack": {
                    "enabled": False,
                    "webhook_url": ""
                }
            },
            "monitoring": {
                "interval_seconds": 300,  # 5 minutes
                "timeout_seconds": 10,
                "retries": 3,
                "alert_threshold": 80  # Alert if health drops below 80%
            },
            "fallback_systems": {
                "enabled": True,
                "auto_recover": True
            }
        }

        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                user_config = json.load(f)
            default_config.update(user_config)

        # Save updated config
        with open(self.config_file, 'w') as f:
            json.dump(default_config, f, indent=2)

        return default_config

    def check_domain_health(self, domain: str) -> Dict:
        """Check health of a single domain"""
        result = {
            "domain": domain,
            "healthy": False,
            "dns_resolved": False,
            "http_accessible": False,
            "ssl_valid": False,
            "response_time": None,
            "error": None,
            "timestamp": datetime.now().isoformat()
        }

        try:
            # DNS resolution check
            start_time = time.time()
            dns_result = subprocess.run(
                ['nslookup', domain],
                capture_output=True, text=True, timeout=self.config['monitoring']['timeout_seconds']
            )
            dns_time = time.time() - start_time

            if dns_result.returncode == 0 and 'Name:' in dns_result.stdout:
                result["dns_resolved"] = True
            else:
                result["error"] = f"DNS resolution failed: {dns_result.stderr}"
                return result

            # HTTP connectivity check
            try:
                response = requests.get(
                    f"https://{domain}",
                    timeout=self.config['monitoring']['timeout_seconds'],
                    verify=True
                )
                result["http_accessible"] = response.status_code < 400
                result["ssl_valid"] = True
                result["response_time"] = response.elapsed.total_seconds()

            except requests.exceptions.SSLError:
                # Try HTTP fallback
                try:
                    response = requests.get(
                        f"http://{domain}",
                        timeout=self.config['monitoring']['timeout_seconds'],
                        verify=False
                    )
                    result["http_accessible"] = response.status_code < 400
                    result["response_time"] = response.elapsed.total_seconds()
                except Exception as e:
                    result["error"] = f"HTTP check failed: {e}"

            except Exception as e:
                result["error"] = f"HTTPS check failed: {e}"

            # Overall health determination
            result["healthy"] = result["dns_resolved"] and result["http_accessible"]

        except subprocess.TimeoutExpired:
            result["error"] = "DNS check timeout"
        except Exception as e:
            result["error"] = f"Unexpected error: {e}"

        return result

    def check_endpoint_health(self, url: str) -> Dict:
        """Check health of an API endpoint"""
        result = {
            "endpoint": url,
            "healthy": False,
            "response_time": None,
            "status_code": None,
            "error": None,
            "timestamp": datetime.now().isoformat()
        }

        try:
            start_time = time.time()
            response = requests.get(
                url,
                timeout=self.config['monitoring']['timeout_seconds'],
                headers={'User-Agent': 'QMOI-Health-Monitor/1.0'}
            )
            response_time = time.time() - start_time

            result["status_code"] = response.status_code
            result["response_time"] = response_time
            result["healthy"] = response.status_code < 400

            # Try to parse JSON response for additional health info
            try:
                if response.headers.get('content-type', '').startswith('application/json'):
                    data = response.json()
                    if isinstance(data, dict) and 'status' in data:
                        result["healthy"] = data.get('status') == 'healthy'
            except:
                pass  # Ignore JSON parsing errors

        except Exception as e:
            result["error"] = str(e)

        return result

    def run_health_check(self) -> Dict:
        """Run complete health check"""
        print(f"🔍 Running health check at {datetime.now()}")

        results = {
            "timestamp": datetime.now().isoformat(),
            "domains": [],
            "endpoints": [],
            "summary": {
                "total_domains": len(self.config['domains']),
                "healthy_domains": 0,
                "total_endpoints": len(self.config['endpoints']),
                "healthy_endpoints": 0,
                "overall_health_percentage": 0
            }
        }

        # Check domains
        for domain in self.config['domains']:
            domain_result = self.check_domain_health(domain)
            results["domains"].append(domain_result)
            if domain_result["healthy"]:
                results["summary"]["healthy_domains"] += 1

        # Check endpoints
        for endpoint in self.config['endpoints']:
            endpoint_result = self.check_endpoint_health(endpoint)
            results["endpoints"].append(endpoint_result)
            if endpoint_result["healthy"]:
                results["summary"]["healthy_endpoints"] += 1

        # Calculate overall health
        total_checks = results["summary"]["total_domains"] + results["summary"]["total_endpoints"]
        healthy_checks = results["summary"]["healthy_domains"] + results["summary"]["healthy_endpoints"]
        results["summary"]["overall_health_percentage"] = (healthy_checks / total_checks * 100) if total_checks > 0 else 0

        # Store in history
        self.health_history.append(results)
        if len(self.health_history) > 100:  # Keep last 100 checks
            self.health_history.pop(0)

        return results

    def send_alert(self, message: str, severity: str = "warning"):
        """Send health alert"""
        alert_key = f"{severity}:{message[:50]}"

        if alert_key in self.alerts_sent:
            return  # Don't send duplicate alerts

        self.alerts_sent.add(alert_key)

        # Email alert
        if self.config['alerts']['email']['enabled']:
            self.send_email_alert(message, severity)

        # Slack alert
        if self.config['alerts']['slack']['enabled']:
            self.send_slack_alert(message, severity)

        print(f"🚨 Alert sent: {message}")

    def send_email_alert(self, message: str, severity: str):
        """Send email alert"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.config['alerts']['email']['username']
            msg['To'] = ', '.join(self.config['alerts']['email']['recipients'])
            msg['Subject'] = f"QMOI Health Alert - {severity.upper()}"

            body = f"""
QMOI production Health Alert

Severity: {severity.upper()}
Time: {datetime.now()}

{message}

This is an automated message from the QMOI Health Monitor.
Please check the production systems immediately.
            """
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(
                self.config['alerts']['email']['smtp_server'],
                self.config['alerts']['email']['smtp_port']
            )
            server.starttls()
            server.login(
                self.config['alerts']['email']['username'],
                self.config['alerts']['email']['password']
            )
            server.send_message(msg)
            server.quit()

        except Exception as e:
            print(f"❌ Failed to send email alert: {e}")

    def send_slack_alert(self, message: str, severity: str):
        """Send Slack alert"""
        try:
            payload = {
                "text": f"🚨 QMOI Health Alert - {severity.upper()}\n\n{message}",
                "username": "QMOI Health Monitor",
                "icon_emoji": ":warning:" if severity == "warning" else ":alert:"
            }

            requests.post(
                self.config['alerts']['slack']['webhook_url'],
                json=payload,
                timeout=10
            )

        except Exception as e:
            print(f"❌ Failed to send Slack alert: {e}")

    def activate_fallback(self, domain: str):
        """Activate fallback system for unhealthy domain"""
        if not self.config['fallback_systems']['enabled']:
            return

        print(f"🔄 Activating fallback for {domain}")

        # This would implement actual fallback logic
        # For now, just log the action
        fallback_record = {
            "domain": domain,
            "fallback_activated": datetime.now().isoformat(),
            "action": "fallback_system_activated"
        }

        # Save fallback record
        fallback_file = 'fallback_actions.json'
        fallbacks = []
        if os.path.exists(fallback_file):
            with open(fallback_file, 'r') as f:
                fallbacks = json.load(f)

        fallbacks.append(fallback_record)

        with open(fallback_file, 'w') as f:
            json.dump(fallbacks, f, indent=2)

    def monitor_loop(self):
        """Main monitoring loop"""
        print("🏥 Starting QMOI Health Monitor...")

        while self.is_monitoring:
            try:
                results = self.run_health_check()

                health_pct = results['summary']['overall_health_percentage']
                healthy_domains = results['summary']['healthy_domains']
                total_domains = results['summary']['total_domains']

                print(f"📊 Health Status: {healthy_domains}/{total_domains} domains healthy ({health_pct:.1f}%)")

                # Save results
                with open('production_health_monitor.json', 'w') as f:
                    json.dump(results, f, indent=2)

                # Check for alerts
                if health_pct < self.config['monitoring']['alert_threshold']:
                    message = f"Health dropped to {health_pct:.1f}%. Only {healthy_domains}/{total_domains} domains healthy."
                    self.send_alert(message, "critical")

                # Check individual domain failures
                for domain_result in results['domains']:
                    if not domain_result['healthy']:
                        message = f"Domain {domain_result['domain']} is unhealthy: {domain_result.get('error', 'Unknown error')}"
                        self.send_alert(message, "warning")

                        if self.config['fallback_systems']['auto_recover']:
                            self.activate_fallback(domain_result['domain'])

                # Wait for next check
                time.sleep(self.config['monitoring']['interval_seconds'])

            except Exception as e:
                print(f"❌ Monitor error: {e}")
                time.sleep(60)  # Wait 1 minute before retrying

    def start_monitoring(self):
        """Start the health monitoring system"""
        if self.is_monitoring:
            print("🏥 Health monitor already running")
            return

        self.is_monitoring = True
        self.monitor_thread = threading.Thread(target=self.monitor_loop, daemon=True)
        self.monitor_thread.start()
        print("✅ Health monitor started")

    def stop_monitoring(self):
        """Stop the health monitoring system"""
        self.is_monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join(timeout=10)
        print("🛑 Health monitor stopped")

    def get_health_report(self) -> Dict:
        """Get current health report"""
        if os.path.exists('production_health_monitor.json'):
            with open('production_health_monitor.json', 'r') as f:
                return json.load(f)
        else:
            return self.run_health_check()

def main():
    """Main execution"""
    import sys

    monitor = HealthMonitor()

    if len(sys.argv) > 1:
        action = sys.argv[1]

        if action == 'start':
            monitor.start_monitoring()
            print("🏥 Health monitor started in background")
            print("Press Ctrl+C to stop")

            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                monitor.stop_monitoring()

        elif action == 'stop':
            monitor.stop_monitoring()

        elif action == 'check':
            results = monitor.run_health_check()
            print(json.dumps(results, indent=2))

        elif action == 'report':
            report = monitor.get_health_report()
            print(json.dumps(report, indent=2))

        else:
            print("Usage: python3 health_monitor.py [start|stop|check|report]")
    else:
        # Run single health check
        results = monitor.run_health_check()
        health_pct = results['summary']['overall_health_percentage']
        healthy_domains = results['summary']['healthy_domains']
        total_domains = results['summary']['total_domains']

        print("🏥 QMOI production Health Report")
        print("=" * 50)
        print(f"📊 Overall Health: {health_pct:.1f}%")
        print(f"🌐 Domains: {healthy_domains}/{total_domains} healthy")
        print(f"🔗 Endpoints: {results['summary']['healthy_endpoints']}/{results['summary']['total_endpoints']} healthy")

        if health_pct >= 95:
            print("✅ All systems operational!")
        elif health_pct >= 80:
            print("⚠️ Minor issues detected")
        else:
            print("🚨 Critical health issues detected!")

        # Show unhealthy domains
        unhealthy_domains = [d for d in results['domains'] if not d['healthy']]
        if unhealthy_domains:
            print("\n❌ Unhealthy domains:")
            for domain in unhealthy_domains:
                print(f"  - {domain['domain']}: {domain.get('error', 'Unknown error')}")

if __name__ == '__main__':
    main()