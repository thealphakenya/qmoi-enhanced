#!/usr/bin/env python3
"""
QMOI Master Monitor
Orchestrates all monitoring systems and provides unified monitoring dashboard.
Coordinates system health, performance, security, costs, and notifications.
"""

import os
import sys
import json
import time
import logging
import threading
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import requests
import psutil


class MasterMonitor:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.monitoring_active = False
        self.monitoring_threads = {}
        self.system_status = {}
        self.alert_history = []
        self.performance_metrics = {}

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/master_monitor.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def load_config(self) -> Dict[str, Any]:
        """Load master monitoring configuration"""
        config = {
            "monitoring_interval": 60,  # 1 minute
            "report_interval": 300,  # 5 minutes
            "monitoring_services": {
                "system_health": {
                    "script": "scripts/monitoring/system_health_monitor.py",
                    "enabled": True,
                    "interval": 60,
                },
                "performance": {
                    "script": "scripts/monitoring/performance_monitor.py",
                    "enabled": True,
                    "interval": 120,
                },
                "security": {
                    "script": "scripts/monitoring/security_monitor.py",
                    "enabled": True,
                    "interval": 300,
                },
                "revenue": {
                    "script": "scripts/monitoring/revenue_monitor.py",
                    "enabled": True,
                    "interval": 600,
                },
                "employment": {
                    "script": "scripts/monitoring/employment_monitor.py",
                    "enabled": True,
                    "interval": 1800,
                },
                "cloud_resources": {
                    "script": "scripts/monitoring/cloud_resources_monitor.py",
                    "enabled": True,
                    "interval": 900,
                },
                "api_endpoints": {
                    "script": "scripts/monitoring/api_endpoints_monitor.py",
                    "enabled": True,
                    "interval": 60,
                },
                "backup": {
                    "script": "scripts/monitoring/backup_monitor.py",
                    "enabled": True,
                    "interval": 3600,
                },
                "notifications": {
                    "script": "scripts/monitoring/notification_monitor.py",
                    "enabled": True,
                    "interval": 30,
                },
            },
            "alerts": {
                "critical_threshold": 3,
                "warning_threshold": 5,
                "cooldown_period": 300,
            },
            "dashboard": {"port": 8080, "host": "0.0.0.0", "refresh_interval": 30},
        }

        # Load from config file if exists
        config_file = "config/master_monitor_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")

        return config

    def start_monitoring_service(
        self, service_name: str, service_config: Dict[str, Any]
    ):
        """Start a monitoring service"""
        try:
            if not service_config["enabled"]:
                self.logger.info(f"Service {service_name} is disabled")
                return

            script_path = service_config["script"]

            if not os.path.exists(script_path):
                self.logger.error(f"Monitoring script not found: {script_path}")
                return

            # Start the monitoring script
            process = subprocess.Popen(
                [sys.executable, script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            self.monitoring_threads[service_name] = {
                "process": process,
                "config": service_config,
                "start_time": datetime.now(),
                "status": "running",
            }

            self.logger.info(f"Started monitoring service: {service_name}")

        except Exception as e:
            self.logger.error(f"Error starting monitoring service {service_name}: {e}")

    def stop_monitoring_service(self, service_name: str):
        """Stop a monitoring service"""
        try:
            if service_name in self.monitoring_threads:
                thread_info = self.monitoring_threads[service_name]
                process = thread_info["process"]

                # Terminate process
                process.terminate()
                process.wait(timeout=10)

                # Update status
                thread_info["status"] = "stopped"
                thread_info["stop_time"] = datetime.now()

                self.logger.info(f"Stopped monitoring service: {service_name}")

        except Exception as e:
            self.logger.error(f"Error stopping monitoring service {service_name}: {e}")

    def check_service_health(self, service_name: str) -> Dict[str, Any]:
        """Check health of a monitoring service"""
        try:
            if service_name not in self.monitoring_threads:
                return {"status": "not_started", "healthy": False}

            thread_info = self.monitoring_threads[service_name]
            process = thread_info["process"]

            # Check if process is still running
            if process.poll() is None:
                # Process is running
                uptime = datetime.now() - thread_info["start_time"]
                return {
                    "status": "running",
                    "healthy": True,
                    "uptime": str(uptime),
                    "pid": process.pid,
                }
            else:
                # Process has stopped
                return_code = process.returncode
                return {
                    "status": "stopped",
                    "healthy": False,
                    "return_code": return_code,
                    "error": "Process terminated unexpectedly",
                }

        except Exception as e:
            return {"status": "error", "healthy": False, "error": str(e)}

    def start_all_monitoring_services(self):
        """Start all monitoring services"""
        try:
            self.logger.info("Starting all monitoring services...")

            for service_name, service_config in self.config[
                "monitoring_services"
            ].items():
                self.start_monitoring_service(service_name, service_config)
                time.sleep(2)  # Small delay between starts

            self.logger.info(
                f"Started {len(self.monitoring_threads)} monitoring services"
            )

        except Exception as e:
            self.logger.error(f"Error starting monitoring services: {e}")

    def stop_all_monitoring_services(self):
        """Stop all monitoring services"""
        try:
            self.logger.info("Stopping all monitoring services...")

            for service_name in list(self.monitoring_threads.keys()):
                self.stop_monitoring_service(service_name)

            self.logger.info("All monitoring services stopped")

        except Exception as e:
            self.logger.error(f"Error stopping monitoring services: {e}")

    def collect_system_metrics(self) -> Dict[str, Any]:
        """Collect system-wide metrics"""
        try:
            metrics = {
                "timestamp": datetime.now().isoformat(),
                "system": {
                    "cpu_percent": psutil.cpu_percent(interval=1),
                    "memory_percent": psutil.virtual_memory().percent,
                    "disk_percent": psutil.disk_usage("/").percent,
                    "load_average": (
                        psutil.getloadavg() if hasattr(psutil, "getloadavg") else None
                    ),
                },
                "processes": {"total": len(psutil.pids()), "qmoi_processes": 0},
                "network": {
                    "connections": len(psutil.net_connections()),
                    "bytes_sent": psutil.net_io_counters().bytes_sent,
                    "bytes_recv": psutil.net_io_counters().bytes_recv,
                },
            }

            # Count QMOI processes
            for proc in psutil.process_iter(["pid", "name", "cmdline"]):
                try:
                    if "qmoi" in proc.info["name"].lower() or any(
                        "qmoi" in str(arg).lower() for arg in proc.info["cmdline"] or []
                    ):
                        metrics["processes"]["qmoi_processes"] += 1
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

            return metrics

        except Exception as e:
            self.logger.error(f"Error collecting system metrics: {e}")
            return {}

    def collect_monitoring_reports(self) -> Dict[str, Any]:
        """Collect reports from all monitoring services"""
        try:
            reports = {}

            # Check for latest reports from each service
            report_files = {
                "system_health": "logs/system_health_latest.json",
                "performance": "logs/performance_latest.json",
                "security": "logs/security_latest.json",
                "revenue": "logs/revenue_latest.json",
                "employment": "logs/employment_latest.json",
                "cloud_resources": "logs/cloud_resources_latest.json",
                "api_endpoints": "logs/api_endpoints_latest.json",
                "backup": "logs/backup_latest.json",
                "notifications": "logs/notification_latest.json",
            }

            for service_name, report_file in report_files.items():
                if os.path.exists(report_file):
                    try:
                        with open(report_file, "r") as f:
                            reports[service_name] = json.load(f)
                    except Exception as e:
                        self.logger.warning(
                            f"Error loading report for {service_name}: {e}"
                        )
                else:
                    reports[service_name] = {"status": "no_report_available"}

            return reports

        except Exception as e:
            self.logger.error(f"Error collecting monitoring reports: {e}")
            return {}

    def analyze_alerts(self, reports: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze reports and generate alerts"""
        try:
            alerts = []

            for service_name, report in reports.items():
                if not isinstance(report, dict):
                    continue

                # Check for critical issues
                if "alerts" in report:
                    for alert in report["alerts"]:
                        if alert.get("severity") == "critical":
                            alerts.append(
                                {
                                    "service": service_name,
                                    "type": "critical",
                                    "message": alert.get("message", "Critical alert"),
                                    "timestamp": datetime.now().isoformat(),
                                    "data": alert,
                                }
                            )

                # Check for high error rates
                if "summary" in report:
                    summary = report["summary"]

                    # Check error rates
                    if "error_rate" in summary and summary["error_rate"] > 10:
                        alerts.append(
                            {
                                "service": service_name,
                                "type": "warning",
                                "message": f"High error rate: {summary['error_rate']:.2f}%",
                                "timestamp": datetime.now().isoformat(),
                                "data": summary,
                            }
                        )

                    # Check availability
                    if "availability" in summary and summary["availability"] < 95:
                        alerts.append(
                            {
                                "service": service_name,
                                "type": "warning",
                                "message": f"Low availability: {summary['availability']:.2f}%",
                                "timestamp": datetime.now().isoformat(),
                                "data": summary,
                            }
                        )

            return alerts

        except Exception as e:
            self.logger.error(f"Error analyzing alerts: {e}")
            return []

    def update_system_status(self):
        """Update overall system status"""
        try:
            # Collect metrics and reports
            system_metrics = self.collect_system_metrics()
            monitoring_reports = self.collect_monitoring_reports()
            alerts = self.analyze_alerts(monitoring_reports)

            # Check service health
            service_health = {}
            for service_name in self.config["monitoring_services"]:
                service_health[service_name] = self.check_service_health(service_name)

            # Determine overall system status
            critical_alerts = [a for a in alerts if a["type"] == "critical"]
            warning_alerts = [a for a in alerts if a["type"] == "warning"]

            if critical_alerts:
                overall_status = "critical"
            elif warning_alerts:
                overall_status = "warning"
            else:
                overall_status = "healthy"

            # Update system status
            self.system_status = {
                "timestamp": datetime.now().isoformat(),
                "overall_status": overall_status,
                "system_metrics": system_metrics,
                "monitoring_reports": monitoring_reports,
                "service_health": service_health,
                "alerts": {
                    "critical": len(critical_alerts),
                    "warning": len(warning_alerts),
                    "total": len(alerts),
                    "recent": alerts[-10:],  # Last 10 alerts
                },
            }

            # Add to alert history
            if alerts:
                self.alert_history.extend(alerts)
                # Keep only last 100 alerts
                self.alert_history = self.alert_history[-100:]

            # Update performance metrics
            self.performance_metrics[datetime.now().isoformat()] = system_metrics

            # Keep only last 24 hours of performance data
            cutoff_time = datetime.now() - timedelta(hours=24)
            self.performance_metrics = {
                k: v
                for k, v in self.performance_metrics.items()
                if datetime.fromisoformat(k) > cutoff_time
            }

        except Exception as e:
            self.logger.error(f"Error updating system status: {e}")

    def generate_master_report(self) -> Dict[str, Any]:
        """Generate comprehensive master report"""
        try:
            report = {
                "timestamp": datetime.now().isoformat(),
                "system_status": self.system_status,
                "performance_trends": {
                    "cpu_usage": [],
                    "memory_usage": [],
                    "disk_usage": [],
                },
                "service_summary": {},
                "recommendations": [],
            }

            # Calculate performance trends
            if self.performance_metrics:
                for timestamp, metrics in self.performance_metrics.items():
                    if "system" in metrics:
                        system = metrics["system"]
                        report["performance_trends"]["cpu_usage"].append(
                            {
                                "timestamp": timestamp,
                                "value": system.get("cpu_percent", 0),
                            }
                        )
                        report["performance_trends"]["memory_usage"].append(
                            {
                                "timestamp": timestamp,
                                "value": system.get("memory_percent", 0),
                            }
                        )
                        report["performance_trends"]["disk_usage"].append(
                            {
                                "timestamp": timestamp,
                                "value": system.get("disk_percent", 0),
                            }
                        )

            # Generate service summary
            if "service_health" in self.system_status:
                for service_name, health in self.system_status[
                    "service_health"
                ].items():
                    report["service_summary"][service_name] = {
                        "status": health.get("status", "unknown"),
                        "healthy": health.get("healthy", False),
                        "uptime": health.get("uptime", "N/A"),
                    }

            # Generate recommendations
            if self.system_status.get("alerts", {}).get("critical", 0) > 0:
                report["recommendations"].append(
                    {
                        "priority": "critical",
                        "message": f"{self.system_status['alerts']['critical']} critical alerts detected. Immediate attention required.",
                    }
                )

            if self.system_status.get("alerts", {}).get("warning", 0) > 5:
                report["recommendations"].append(
                    {
                        "priority": "high",
                        "message": f"{self.system_status['alerts']['warning']} warning alerts detected. System review recommended.",
                    }
                )

            # Check system resources
            if "system_metrics" in self.system_status:
                system = self.system_status["system_metrics"].get("system", {})

                if system.get("cpu_percent", 0) > 80:
                    report["recommendations"].append(
                        {
                            "priority": "medium",
                            "message": f"High CPU usage: {system['cpu_percent']:.1f}%. Consider resource optimization.",
                        }
                    )

                if system.get("memory_percent", 0) > 85:
                    report["recommendations"].append(
                        {
                            "priority": "medium",
                            "message": f"High memory usage: {system['memory_percent']:.1f}%. Consider memory optimization.",
                        }
                    )

                if system.get("disk_percent", 0) > 90:
                    report["recommendations"].append(
                        {
                            "priority": "high",
                            "message": f"High disk usage: {system['disk_percent']:.1f}%. Storage cleanup required.",
                        }
                    )

            return report

        except Exception as e:
            self.logger.error(f"Error generating master report: {e}")
            return {}

    def save_report(self, report: Dict[str, Any]):
        """Save master report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"logs/master_report_{timestamp}.json"

            with open(report_file, "w") as f:
                json.dump(report, f, indent=2)

            # Save latest report
            with open("logs/master_latest.json", "w") as f:
                json.dump(report, f, indent=2)

            self.logger.info(f"Master report saved: {report_file}")

        except Exception as e:
            self.logger.error(f"Error saving report: {e}")

    def start_monitoring(self):
        """Start master monitoring"""
        try:
            self.monitoring_active = True
            self.logger.info("Starting QMOI Master Monitor")

            # Start all monitoring services
            self.start_all_monitoring_services()

            # Start status update thread
            status_thread = threading.Thread(target=self.status_update_loop)
            status_thread.daemon = True
            status_thread.start()

            self.logger.info("Master monitor started")

        except Exception as e:
            self.logger.error(f"Error starting master monitor: {e}")

    def stop_monitoring(self):
        """Stop master monitoring"""
        try:
            self.monitoring_active = False
            self.stop_all_monitoring_services()
            self.logger.info("Master monitor stopped")

        except Exception as e:
            self.logger.error(f"Error stopping master monitor: {e}")

    def status_update_loop(self):
        """Status update loop"""
        while self.monitoring_active:
            try:
                self.update_system_status()
                time.sleep(self.config["monitoring_interval"])

            except Exception as e:
                self.logger.error(f"Error in status update loop: {e}")
                time.sleep(10)

    def run(self):
        """Main monitoring loop"""
        try:
            self.logger.info("Starting QMOI Master Monitor")
            self.start_monitoring()

            # Generate reports periodically
            while self.monitoring_active:
                time.sleep(self.config["report_interval"])

                if self.monitoring_active:
                    report = self.generate_master_report()
                    self.save_report(report)

                    # Log summary
                    status = self.system_status.get("overall_status", "unknown")
                    alerts = self.system_status.get("alerts", {})
                    self.logger.info(
                        f"Master Status: {status}, "
                        f"Critical: {alerts.get('critical', 0)}, "
                        f"Warnings: {alerts.get('warning', 0)}"
                    )

        except KeyboardInterrupt:
            self.logger.info("Received interrupt signal")
        except Exception as e:
            self.logger.error(f"Error in main monitoring loop: {e}")
        finally:
            self.stop_monitoring()


def main():
    """Main function"""
    monitor = MasterMonitor()
    monitor.run()


if __name__ == "__main__":
    main()
