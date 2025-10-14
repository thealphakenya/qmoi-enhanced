#!/usr/bin/env python3
"""
QMOI API Endpoints Monitor
Comprehensive monitoring of all QMOI API endpoints for availability, performance, and error tracking.
Tracks response times, status codes, error rates, and endpoint health.
"""

import os
import sys
import json
import time
import logging
import threading
import requests
import statistics
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from urllib.parse import urljoin
import asyncio
import aiohttp


class APIEndpointsMonitor:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.monitoring_active = False
        self.endpoints_data = {}
        self.response_times = {}
        self.error_counts = {}
        self.availability_data = {}
        self.session = requests.Session()

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/api_endpoints_monitor.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def load_config(self) -> Dict[str, Any]:
        """Load monitoring configuration"""
        config = {
            "base_url": "http://localhost:3000",
            "monitoring_interval": 60,  # 1 minute
            "timeout": 30,
            "retries": 3,
            "endpoints": [
                # Authentication endpoints
                {"path": "/api/auth/login", "method": "POST", "name": "Login"},
                {"path": "/api/auth/logout", "method": "POST", "name": "Logout"},
                {"path": "/api/auth/me", "method": "GET", "name": "User Profile"},
                # QMOI endpoints
                {"path": "/api/qmoi/status", "method": "GET", "name": "QMOI Status"},
                {"path": "/api/qmoi/backup", "method": "POST", "name": "QMOI Backup"},
                {"path": "/api/qmoi/fix", "method": "POST", "name": "QMOI Fix"},
                # QCity endpoints
                {"path": "/api/qcity/status", "method": "GET", "name": "QCity Status"},
                {
                    "path": "/api/qcity/metrics",
                    "method": "GET",
                    "name": "QCity Metrics",
                },
                {
                    "path": "/api/qcity/devices",
                    "method": "GET",
                    "name": "QCity Devices",
                },
                # Trading endpoints
                {
                    "path": "/api/trading/status",
                    "method": "GET",
                    "name": "Trading Status",
                },
                {
                    "path": "/api/trading/start",
                    "method": "POST",
                    "name": "Start Trading",
                },
                {"path": "/api/trading/stop", "method": "POST", "name": "Stop Trading"},
                # Financial endpoints
                {
                    "path": "/api/financial/transactions",
                    "method": "GET",
                    "name": "Financial Transactions",
                },
                {
                    "path": "/api/financial/audit",
                    "method": "GET",
                    "name": "Financial Audit",
                },
                # Employment endpoints
                {
                    "path": "/api/employment/revenue",
                    "method": "GET",
                    "name": "Employment Revenue",
                },
                {
                    "path": "/api/employment/payment",
                    "method": "POST",
                    "name": "Employment Payment",
                },
                # AI endpoints
                {"path": "/api/ai/health", "method": "GET", "name": "AI Health"},
                {"path": "/api/ai/scan", "method": "POST", "name": "AI Scan"},
                {
                    "path": "/api/ai/self-diagnostics",
                    "method": "GET",
                    "name": "AI Self Diagnostics",
                },
                # Automation endpoints
                {
                    "path": "/api/automation/status",
                    "method": "GET",
                    "name": "Automation Status",
                },
                {"path": "/api/auto-fix", "method": "POST", "name": "Auto Fix"},
                # Media endpoints
                {
                    "path": "/api/media/generate",
                    "method": "POST",
                    "name": "Media Generation",
                },
                {"path": "/api/media/status", "method": "GET", "name": "Media Status"},
                # Deployment endpoints
                {
                    "path": "/api/deploy/status",
                    "method": "GET",
                    "name": "Deployment Status",
                },
                {
                    "path": "/api/deploy/auto-redeploy",
                    "method": "POST",
                    "name": "Auto Redeploy",
                },
                # Monitoring endpoints
                {
                    "path": "/api/monitor/status",
                    "method": "GET",
                    "name": "Monitor Status",
                },
                # Version endpoints
                {"path": "/api/version", "method": "GET", "name": "Version Info"},
            ],
            "alerts": {
                "response_time_threshold": 5000,  # ms
                "error_rate_threshold": 5,  # %
                "availability_threshold": 99.5,  # %
            },
            "headers": {
                "User-Agent": "QMOI-API-Monitor/1.0",
                "Content-Type": "application/json",
            },
        }

        # Load from config file if exists
        config_file = "config/api_monitoring_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")

        return config

    def start_monitoring(self):
        """Start API endpoints monitoring"""
        try:
            self.monitoring_active = True
            self.logger.info("Starting QMOI API Endpoints Monitor")

            # Initialize data structures
            for endpoint in self.config["endpoints"]:
                path = endpoint["path"]
                self.response_times[path] = []
                self.error_counts[path] = 0
                self.availability_data[path] = {
                    "total_checks": 0,
                    "successful_checks": 0,
                    "last_check": None,
                    "last_status": None,
                }

            # Start monitoring thread
            monitor_thread = threading.Thread(target=self.monitoring_loop)
            monitor_thread.daemon = True
            monitor_thread.start()

            self.logger.info(
                f"API monitoring started for {len(self.config['endpoints'])} endpoints"
            )

        except Exception as e:
            self.logger.error(f"Error starting API monitoring: {e}")

    def stop_monitoring(self):
        """Stop API endpoints monitoring"""
        self.monitoring_active = False
        self.logger.info("API endpoints monitoring stopped")

    def check_endpoint(self, endpoint: Dict[str, str]) -> Dict[str, Any]:
        """Check a single endpoint"""
        path = endpoint["path"]
        method = endpoint["method"]
        name = endpoint["name"]

        url = urljoin(self.config["base_url"], path)
        start_time = time.time()

        try:
            # Prepare request
            if method == "GET":
                response = self.session.get(
                    url, headers=self.config["headers"], timeout=self.config["timeout"]
                )
            elif method == "POST":
                response = self.session.post(
                    url,
                    headers=self.config["headers"],
                    json={},  # Empty payload for health checks
                    timeout=self.config["timeout"],
                )
            else:
                response = self.session.request(
                    method,
                    url,
                    headers=self.config["headers"],
                    timeout=self.config["timeout"],
                )

            response_time = (time.time() - start_time) * 1000  # Convert to milliseconds

            # Update availability data
            self.availability_data[path]["total_checks"] += 1
            self.availability_data[path]["last_check"] = datetime.now().isoformat()

            if response.status_code < 400:
                self.availability_data[path]["successful_checks"] += 1
                self.availability_data[path]["last_status"] = "success"

                # Store response time
                self.response_times[path].append(response_time)
                if len(self.response_times[path]) > 100:  # Keep last 100 measurements
                    self.response_times[path].pop(0)

                return {
                    "endpoint": name,
                    "path": path,
                    "method": method,
                    "status_code": response.status_code,
                    "response_time": response_time,
                    "success": True,
                    "timestamp": datetime.now().isoformat(),
                }
            else:
                self.availability_data[path]["last_status"] = "error"
                self.error_counts[path] += 1

                return {
                    "endpoint": name,
                    "path": path,
                    "method": method,
                    "status_code": response.status_code,
                    "response_time": response_time,
                    "success": False,
                    "error": f"HTTP {response.status_code}",
                    "timestamp": datetime.now().isoformat(),
                }

        except requests.exceptions.Timeout:
            self.availability_data[path]["last_status"] = "timeout"
            self.error_counts[path] += 1

            return {
                "endpoint": name,
                "path": path,
                "method": method,
                "status_code": None,
                "response_time": None,
                "success": False,
                "error": "Timeout",
                "timestamp": datetime.now().isoformat(),
            }

        except requests.exceptions.ConnectionError:
            self.availability_data[path]["last_status"] = "connection_error"
            self.error_counts[path] += 1

            return {
                "endpoint": name,
                "path": path,
                "method": method,
                "status_code": None,
                "response_time": None,
                "success": False,
                "error": "Connection Error",
                "timestamp": datetime.now().isoformat(),
            }

        except Exception as e:
            self.availability_data[path]["last_status"] = "exception"
            self.error_counts[path] += 1

            return {
                "endpoint": name,
                "path": path,
                "method": method,
                "status_code": None,
                "response_time": None,
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
            }

    def monitoring_loop(self):
        """Main monitoring loop"""
        while self.monitoring_active:
            try:
                batch_results = []

                # Check all endpoints
                for endpoint in self.config["endpoints"]:
                    result = self.check_endpoint(endpoint)
                    batch_results.append(result)

                    # Log errors immediately
                    if not result["success"]:
                        self.logger.warning(
                            f"Endpoint {result['endpoint']} ({result['path']}) failed: {result.get('error', 'Unknown error')}"
                        )

                    # Check response time threshold
                    if (
                        result["response_time"]
                        and result["response_time"]
                        > self.config["alerts"]["response_time_threshold"]
                    ):
                        self.logger.warning(
                            f"Endpoint {result['endpoint']} ({result['path']}) slow response: {result['response_time']:.2f}ms"
                        )

                # Store batch results
                timestamp = datetime.now().isoformat()
                self.endpoints_data[timestamp] = batch_results

                # Keep only last 24 hours of data
                cutoff_time = datetime.now() - timedelta(hours=24)
                self.endpoints_data = {
                    k: v
                    for k, v in self.endpoints_data.items()
                    if datetime.fromisoformat(k) > cutoff_time
                }

            except Exception as e:
                self.logger.error(f"Error in monitoring loop: {e}")

            time.sleep(self.config["monitoring_interval"])

    def calculate_metrics(self) -> Dict[str, Any]:
        """Calculate monitoring metrics"""
        metrics = {
            "timestamp": datetime.now().isoformat(),
            "endpoints": {},
            "overall": {
                "total_endpoints": len(self.config["endpoints"]),
                "available_endpoints": 0,
                "error_rate": 0,
                "avg_response_time": 0,
            },
        }

        total_errors = 0
        total_checks = 0
        all_response_times = []

        for endpoint in self.config["endpoints"]:
            path = endpoint["path"]
            name = endpoint["name"]

            availability = self.availability_data[path]
            error_count = self.error_counts[path]
            response_times = self.response_times[path]

            # Calculate availability percentage
            if availability["total_checks"] > 0:
                availability_pct = (
                    availability["successful_checks"] / availability["total_checks"]
                ) * 100
            else:
                availability_pct = 0

            # Calculate average response time
            avg_response_time = statistics.mean(response_times) if response_times else 0

            # Calculate error rate
            error_rate = (
                (error_count / availability["total_checks"]) * 100
                if availability["total_checks"] > 0
                else 0
            )

            metrics["endpoints"][path] = {
                "name": name,
                "availability_percentage": availability_pct,
                "error_rate": error_rate,
                "avg_response_time": avg_response_time,
                "total_checks": availability["total_checks"],
                "successful_checks": availability["successful_checks"],
                "error_count": error_count,
                "last_check": availability["last_check"],
                "last_status": availability["last_status"],
            }

            # Update overall metrics
            if availability_pct >= self.config["alerts"]["availability_threshold"]:
                metrics["overall"]["available_endpoints"] += 1

            total_errors += error_count
            total_checks += availability["total_checks"]
            all_response_times.extend(response_times)

        # Calculate overall metrics
        if total_checks > 0:
            metrics["overall"]["error_rate"] = (total_errors / total_checks) * 100

        if all_response_times:
            metrics["overall"]["avg_response_time"] = statistics.mean(
                all_response_times
            )

        return metrics

    def check_alerts(self, metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check for alerts based on metrics"""
        alerts = []

        for path, endpoint_metrics in metrics["endpoints"].items():
            # Check response time threshold
            if (
                endpoint_metrics["avg_response_time"]
                > self.config["alerts"]["response_time_threshold"]
            ):
                alerts.append(
                    {
                        "type": "slow_response",
                        "endpoint": endpoint_metrics["name"],
                        "path": path,
                        "severity": "warning",
                        "message": f"Average response time ({endpoint_metrics['avg_response_time']:.2f}ms) exceeds threshold",
                        "value": endpoint_metrics["avg_response_time"],
                        "threshold": self.config["alerts"]["response_time_threshold"],
                    }
                )

            # Check error rate threshold
            if (
                endpoint_metrics["error_rate"]
                > self.config["alerts"]["error_rate_threshold"]
            ):
                alerts.append(
                    {
                        "type": "high_error_rate",
                        "endpoint": endpoint_metrics["name"],
                        "path": path,
                        "severity": "error",
                        "message": f"Error rate ({endpoint_metrics['error_rate']:.2f}%) exceeds threshold",
                        "value": endpoint_metrics["error_rate"],
                        "threshold": self.config["alerts"]["error_rate_threshold"],
                    }
                )

            # Check availability threshold
            if (
                endpoint_metrics["availability_percentage"]
                < self.config["alerts"]["availability_threshold"]
            ):
                alerts.append(
                    {
                        "type": "low_availability",
                        "endpoint": endpoint_metrics["name"],
                        "path": path,
                        "severity": "critical",
                        "message": f"Availability ({endpoint_metrics['availability_percentage']:.2f}%) below threshold",
                        "value": endpoint_metrics["availability_percentage"],
                        "threshold": self.config["alerts"]["availability_threshold"],
                    }
                )

        return alerts

    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive API monitoring report"""
        try:
            metrics = self.calculate_metrics()
            alerts = self.check_alerts(metrics)

            report = {
                "timestamp": datetime.now().isoformat(),
                "summary": {
                    "total_endpoints": metrics["overall"]["total_endpoints"],
                    "available_endpoints": metrics["overall"]["available_endpoints"],
                    "overall_availability": (
                        metrics["overall"]["available_endpoints"]
                        / metrics["overall"]["total_endpoints"]
                    )
                    * 100,
                    "overall_error_rate": metrics["overall"]["error_rate"],
                    "overall_avg_response_time": metrics["overall"][
                        "avg_response_time"
                    ],
                    "alerts_count": len(alerts),
                },
                "endpoints": metrics["endpoints"],
                "alerts": alerts,
                "recommendations": [],
            }

            # Generate recommendations
            if metrics["overall"]["error_rate"] > 5:
                report["recommendations"].append(
                    {
                        "type": "error_handling",
                        "priority": "high",
                        "message": f"High overall error rate ({metrics['overall']['error_rate']:.2f}%). Review error handling and system stability.",
                    }
                )

            if metrics["overall"]["avg_response_time"] > 2000:
                report["recommendations"].append(
                    {
                        "type": "performance",
                        "priority": "medium",
                        "message": f"High average response time ({metrics['overall']['avg_response_time']:.2f}ms). Consider performance optimization.",
                    }
                )

            if len(alerts) > 5:
                report["recommendations"].append(
                    {
                        "type": "system_health",
                        "priority": "high",
                        "message": f"Multiple alerts ({len(alerts)}) detected. System health review recommended.",
                    }
                )

            return report

        except Exception as e:
            self.logger.error(f"Error generating report: {e}")
            return {}

    def save_report(self, report: Dict[str, Any]):
        """Save monitoring report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"logs/api_endpoints_report_{timestamp}.json"

            with open(report_file, "w") as f:
                json.dump(report, f, indent=2)

            # Save latest report
            with open("logs/api_endpoints_latest.json", "w") as f:
                json.dump(report, f, indent=2)

            self.logger.info(f"API endpoints report saved: {report_file}")

        except Exception as e:
            self.logger.error(f"Error saving report: {e}")

    def run(self):
        """Main monitoring loop"""
        try:
            self.logger.info("Starting QMOI API Endpoints Monitor")
            self.start_monitoring()

            # Generate reports periodically
            while self.monitoring_active:
                time.sleep(300)  # Generate report every 5 minutes

                if self.monitoring_active:
                    report = self.generate_report()
                    self.save_report(report)

                    # Log summary
                    summary = report.get("summary", {})
                    self.logger.info(
                        f"API Status: {summary.get('available_endpoints', 0)}/{summary.get('total_endpoints', 0)} endpoints available, "
                        f"Error rate: {summary.get('overall_error_rate', 0):.2f}%, "
                        f"Avg response: {summary.get('overall_avg_response_time', 0):.2f}ms"
                    )

        except KeyboardInterrupt:
            self.logger.info("Received interrupt signal")
        except Exception as e:
            self.logger.error(f"Error in main monitoring loop: {e}")
        finally:
            self.stop_monitoring()


def main():
    """Main function"""
    monitor = APIEndpointsMonitor()
    monitor.run()


if __name__ == "__main__":
    main()
