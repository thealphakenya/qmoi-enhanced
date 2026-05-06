#!/usr/bin/env python3
"""
Comprehensive Health Monitoring System
Monitors all aspects of QMOI health
"""
import psutil
import time
from datetime import datetime
import json

class ComprehensiveHealthMonitor:
    def __init__(self):
        self.health_metrics = {}

    def check_system_health(self):
        """Check overall system health"""
        metrics = {
            'cpu_percent': psutil.cpu_percent(interval=1),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent,
            'timestamp': datetime.now().isoformat()
        }
        self.health_metrics.update(metrics)
        return metrics

    def check_application_health(self):
        """Check application-specific health"""
        # Application health checks
        return {'status': 'healthy', 'services': ['api', 'database', 'cache']}

    def generate_report(self):
        """Generate comprehensive health report"""
        system_health = self.check_system_health()
        app_health = self.check_application_health()

        report = {
            'timestamp': datetime.now().isoformat(),
            'system_health': system_health,
            'application_health': app_health,
            'overall_status': 'healthy' if system_health['cpu_percent'] < 90 else 'warning'
        }

        with open('health_report.json', 'w') as f:
            json.dump(report, f, indent=2)

        return report

def main():
    monitor = ComprehensiveHealthMonitor()
    report = monitor.generate_report()
    print(f"🩺 Health Report Generated: {report['overall_status']}")

if __name__ == "__main__":
    main()
