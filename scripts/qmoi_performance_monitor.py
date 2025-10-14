#!/usr/bin/env python3
"""
QMOI Performance Monitor
Monitors system performance and generates reports
"""

import os
import sys
import json
import time
import psutil
import logging
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

# Add project root to path
sys.path.append(str(Path(__file__).parent.parent))


class QMOIPerformanceMonitor:
    def __init__(self):
        self.logger = self._setup_logging()
        self.performance_report = {
            "timestamp": datetime.now().isoformat(),
            "system_performance": "unknown",
            "metrics": {},
            "bottlenecks": [],
            "recommendations": [],
            "historical_data": [],
        }
        self.metrics_history = []

    def _setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/performance_monitor.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def collect_system_metrics(self):
        """Collect system performance metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()

            # Memory metrics
            memory = psutil.virtual_memory()
            swap = psutil.swap_memory()

            # Disk metrics
            disk = psutil.disk_usage("/")
            disk_io = psutil.disk_io_counters()

            # Network metrics
            network = psutil.net_io_counters()

            # Process metrics
            processes = len(psutil.pids())

            self.performance_report["metrics"] = {
                "cpu": {
                    "usage_percent": cpu_percent,
                    "count": cpu_count,
                    "frequency_mhz": cpu_freq.current if cpu_freq else None,
                    "load_average": self._get_load_average(),
                },
                "memory": {
                    "total_gb": memory.total / (1024**3),
                    "available_gb": memory.available / (1024**3),
                    "used_gb": memory.used / (1024**3),
                    "usage_percent": memory.percent,
                    "swap_used_gb": swap.used / (1024**3) if swap else 0,
                },
                "disk": {
                    "total_gb": disk.total / (1024**3),
                    "used_gb": disk.used / (1024**3),
                    "free_gb": disk.free / (1024**3),
                    "usage_percent": disk.percent,
                    "read_bytes": disk_io.read_bytes if disk_io else 0,
                    "write_bytes": disk_io.write_bytes if disk_io else 0,
                },
                "network": {
                    "bytes_sent": network.bytes_sent,
                    "bytes_recv": network.bytes_recv,
                    "packets_sent": network.packets_sent,
                    "packets_recv": network.packets_recv,
                },
                "processes": {
                    "total_count": processes,
                    "qmoi_processes": self._count_qmoi_processes(),
                },
            }

        except Exception as e:
            self.logger.error(f"Failed to collect system metrics: {str(e)}")

    def _get_load_average(self):
        """Get system load average"""
        try:
            if hasattr(psutil, "getloadavg"):
                return psutil.getloadavg()
            else:
                # Windows doesn't have load average
                return None
        except:
            return None

    def _count_qmoi_processes(self):
        """Count QMOI-related processes"""
        count = 0
        for proc in psutil.process_iter(["pid", "name", "cmdline"]):
            try:
                cmdline = " ".join(proc.info["cmdline"] or [])
                if "qmoi" in cmdline.lower():
                    count += 1
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return count

    def analyze_performance(self):
        """Analyze performance and identify bottlenecks"""
        metrics = self.performance_report["metrics"]
        bottlenecks = []
        recommendations = []

        # CPU analysis
        cpu_usage = metrics["cpu"]["usage_percent"]
        if cpu_usage > 90:
            bottlenecks.append("High CPU usage")
            recommendations.append("Consider scaling CPU resources or optimizing code")
        elif cpu_usage > 70:
            bottlenecks.append("Moderate CPU usage")
            recommendations.append("Monitor CPU usage and consider optimization")

        # Memory analysis
        memory_usage = metrics["memory"]["usage_percent"]
        if memory_usage > 90:
            bottlenecks.append("High memory usage")
            recommendations.append(
                "Consider increasing memory or optimizing memory usage"
            )
        elif memory_usage > 80:
            bottlenecks.append("Moderate memory usage")
            recommendations.append("Monitor memory usage closely")

        # Disk analysis
        disk_usage = metrics["disk"]["usage_percent"]
        if disk_usage > 95:
            bottlenecks.append("Critical disk usage")
            recommendations.append("Immediate disk cleanup required")
        elif disk_usage > 85:
            bottlenecks.append("High disk usage")
            recommendations.append("Consider disk cleanup or expansion")

        # Process analysis
        qmoi_processes = metrics["processes"]["qmoi_processes"]
        if qmoi_processes == 0:
            bottlenecks.append("No QMOI processes running")
            recommendations.append("Start QMOI services")
        elif qmoi_processes < 3:
            bottlenecks.append("Insufficient QMOI processes")
            recommendations.append("Start additional QMOI services")

        self.performance_report["bottlenecks"] = bottlenecks
        self.performance_report["recommendations"] = recommendations

    def calculate_performance_score(self):
        """Calculate overall performance score"""
        metrics = self.performance_report["metrics"]
        score = 100

        # CPU scoring
        cpu_usage = metrics["cpu"]["usage_percent"]
        if cpu_usage > 90:
            score -= 30
        elif cpu_usage > 70:
            score -= 15
        elif cpu_usage > 50:
            score -= 5

        # Memory scoring
        memory_usage = metrics["memory"]["usage_percent"]
        if memory_usage > 90:
            score -= 25
        elif memory_usage > 80:
            score -= 10
        elif memory_usage > 60:
            score -= 5

        # Disk scoring
        disk_usage = metrics["disk"]["usage_percent"]
        if disk_usage > 95:
            score -= 20
        elif disk_usage > 85:
            score -= 10
        elif disk_usage > 70:
            score -= 5

        # Process scoring
        qmoi_processes = metrics["processes"]["qmoi_processes"]
        if qmoi_processes == 0:
            score -= 25
        elif qmoi_processes < 3:
            score -= 10

        # Ensure score doesn't go below 0
        score = max(0, score)

        self.performance_report["performance_score"] = score

        # Set performance status
        if score >= 90:
            self.performance_report["system_performance"] = "excellent"
        elif score >= 75:
            self.performance_report["system_performance"] = "good"
        elif score >= 50:
            self.performance_report["system_performance"] = "fair"
        else:
            self.performance_report["system_performance"] = "poor"

    def collect_historical_data(self):
        """Collect and store historical performance data"""
        try:
            # Load existing historical data
            history_file = Path("logs/performance_history.json")
            if history_file.exists():
                with open(history_file, "r") as f:
                    self.performance_report["historical_data"] = json.load(f)

            # Add current metrics to history
            current_data = {
                "timestamp": self.performance_report["timestamp"],
                "performance_score": self.performance_report.get(
                    "performance_score", 0
                ),
                "cpu_usage": self.performance_report["metrics"]["cpu"]["usage_percent"],
                "memory_usage": self.performance_report["metrics"]["memory"][
                    "usage_percent"
                ],
                "disk_usage": self.performance_report["metrics"]["disk"][
                    "usage_percent"
                ],
            }

            self.performance_report["historical_data"].append(current_data)

            # Keep only last 1000 entries
            if len(self.performance_report["historical_data"]) > 1000:
                self.performance_report["historical_data"] = self.performance_report[
                    "historical_data"
                ][-1000:]

        except Exception as e:
            self.logger.error(f"Failed to collect historical data: {str(e)}")

    def generate_trends(self):
        """Generate performance trends"""
        try:
            historical_data = self.performance_report["historical_data"]
            if len(historical_data) < 2:
                return

            # Calculate trends for last 10 data points
            recent_data = historical_data[-10:]

            # CPU trend
            cpu_values = [d["cpu_usage"] for d in recent_data]
            cpu_trend = "increasing" if cpu_values[-1] > cpu_values[0] else "decreasing"

            # Memory trend
            memory_values = [d["memory_usage"] for d in recent_data]
            memory_trend = (
                "increasing" if memory_values[-1] > memory_values[0] else "decreasing"
            )

            # Performance score trend
            score_values = [d["performance_score"] for d in recent_data]
            score_trend = (
                "improving" if score_values[-1] > score_values[0] else "declining"
            )

            self.performance_report["trends"] = {
                "cpu_trend": cpu_trend,
                "memory_trend": memory_trend,
                "performance_trend": score_trend,
                "data_points": len(recent_data),
            }

        except Exception as e:
            self.logger.error(f"Failed to generate trends: {str(e)}")

    def save_performance_report(self):
        """Save performance report to file"""
        try:
            # Ensure logs directory exists
            Path("logs").mkdir(exist_ok=True)

            # Save detailed report
            with open("logs/performance_report.json", "w") as f:
                json.dump(self.performance_report, f, indent=2)

            # Save historical data
            with open("logs/performance_history.json", "w") as f:
                json.dump(self.performance_report["historical_data"], f, indent=2)

            # Save summary report
            summary = {
                "timestamp": self.performance_report["timestamp"],
                "system_performance": self.performance_report["system_performance"],
                "performance_score": self.performance_report.get(
                    "performance_score", 0
                ),
                "bottlenecks_count": len(self.performance_report["bottlenecks"]),
                "recommendations_count": len(
                    self.performance_report["recommendations"]
                ),
            }

            with open("logs/performance_summary.json", "w") as f:
                json.dump(summary, f, indent=2)

            self.logger.info(
                f"Performance report saved. Score: {self.performance_report.get('performance_score', 0)}"
            )

        except Exception as e:
            self.logger.error(f"Failed to save performance report: {str(e)}")

    def run_performance_check(self):
        """Run complete performance check"""
        self.logger.info("Starting QMOI performance check...")

        try:
            # Collect metrics
            self.collect_system_metrics()

            # Analyze performance
            self.analyze_performance()

            # Calculate score
            self.calculate_performance_score()

            # Collect historical data
            self.collect_historical_data()

            # Generate trends
            self.generate_trends()

            # Save report
            self.save_performance_report()

            # Log results
            self.logger.info(
                f"Performance check completed. Status: {self.performance_report['system_performance']}"
            )
            self.logger.info(
                f"Performance score: {self.performance_report.get('performance_score', 0)}"
            )

            if self.performance_report["bottlenecks"]:
                self.logger.warning(
                    f"Bottlenecks found: {len(self.performance_report['bottlenecks'])}"
                )
            if self.performance_report["recommendations"]:
                self.logger.info(
                    f"Recommendations: {len(self.performance_report['recommendations'])}"
                )

            return self.performance_report

        except Exception as e:
            self.logger.error(f"Performance check failed: {str(e)}")
            return None


def main():
    """Main function"""
    monitor = QMOIPerformanceMonitor()
    report = monitor.run_performance_check()

    if report:
        # Exit with error code if performance is poor
        if report["system_performance"] == "poor":
            sys.exit(1)
        elif report["system_performance"] == "fair":
            sys.exit(2)
        else:
            sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
