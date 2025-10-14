#!/usr/bin/env python3
"""
QMOI System Status Monitor
Comprehensive monitoring of all QMOI system components and their health
"""

import os
import sys
import json
import time
import logging
import subprocess
import threading
from pathlib import Path
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import argparse
import psutil
import requests
import asyncio
import aiohttp

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/system_status_monitor.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


class QMOISystemStatusMonitor:
    def __init__(self, continuous: bool = False, interval: int = 60):
        self.continuous = continuous
        self.interval = interval
        self.root_dir = Path(__file__).parent.parent.parent
        self.logs_dir = self.root_dir / "logs"
        self.reports_dir = self.root_dir / "reports"

        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)

        # System status history
        self.status_history = []
        self.max_history_size = 100

        # Component status
        self.component_status = {}

        # Monitoring configuration
        self.monitoring_config = {
            "components": {
                "qmoi_core": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/health",
                    "timeout": 10,
                    "critical": True,
                },
                "qcity_device": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/qcity/status",
                    "timeout": 15,
                    "critical": True,
                },
                "database": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/database/health",
                    "timeout": 10,
                    "critical": True,
                },
                "trading_engine": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/trading/status",
                    "timeout": 10,
                    "critical": False,
                },
                "ai_models": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/ai/health",
                    "timeout": 15,
                    "critical": False,
                },
                "voice_system": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/qmoi/voice-profiles",
                    "timeout": 10,
                    "critical": False,
                },
                "avatar_system": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/qmoi/avatars",
                    "timeout": 10,
                    "critical": False,
                },
                "automation_engine": {
                    "enabled": True,
                    "health_check_url": "http://localhost:3000/api/automation/status",
                    "timeout": 10,
                    "critical": False,
                },
            },
            "thresholds": {
                "cpu_usage": 80.0,
                "memory_usage": 85.0,
                "disk_usage": 90.0,
                "response_time": 5.0,
                "error_rate": 5.0,
            },
        }

    def get_system_overview(self) -> Dict[str, Any]:
        """Get system overview information"""
        try:
            # Basic system info
            system_info = {
                "hostname": os.uname().nodename if hasattr(os, "uname") else "unknown",
                "platform": sys.platform,
                "python_version": sys.version,
                "uptime": self.get_system_uptime(),
                "timestamp": datetime.now().isoformat(),
            }

            # Resource usage
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage("/")

            resource_info = {
                "cpu": {
                    "usage_percent": cpu_percent,
                    "count": psutil.cpu_count(),
                    "frequency": (
                        psutil.cpu_freq().current if psutil.cpu_freq() else None
                    ),
                },
                "memory": {
                    "total_gb": memory.total / (1024**3),
                    "used_gb": memory.used / (1024**3),
                    "available_gb": memory.available / (1024**3),
                    "usage_percent": memory.percent,
                },
                "disk": {
                    "total_gb": disk.total / (1024**3),
                    "used_gb": disk.used / (1024**3),
                    "free_gb": disk.free / (1024**3),
                    "usage_percent": (disk.used / disk.total) * 100,
                },
            }

            # Network info
            network = psutil.net_io_counters()
            network_info = {
                "bytes_sent": network.bytes_sent,
                "bytes_recv": network.bytes_recv,
                "packets_sent": network.packets_sent,
                "packets_recv": network.packets_recv,
            }

            return {
                "system": system_info,
                "resources": resource_info,
                "network": network_info,
            }

        except Exception as e:
            logger.error(f"Error getting system overview: {e}")
            return {}

    def get_system_uptime(self) -> str:
        """Get system uptime"""
        try:
            uptime_seconds = time.time() - psutil.boot_time()
            uptime = timedelta(seconds=uptime_seconds)
            return str(uptime)
        except Exception:
            return "unknown"

    def check_component_health(
        self, component_name: str, config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Check health of a specific component"""
        if not config["enabled"]:
            return {
                "component": component_name,
                "status": "disabled",
                "enabled": False,
                "timestamp": datetime.now().isoformat(),
            }

        try:
            start_time = time.time()

            # Make health check request
            response = requests.get(
                config["health_check_url"], timeout=config["timeout"]
            )

            response_time = time.time() - start_time

            if response.status_code == 200:
                try:
                    health_data = response.json()
                    status = "healthy"
                except json.JSONDecodeError:
                    health_data = {"message": response.text}
                    status = "healthy"
            else:
                health_data = {"error": f"HTTP {response.status_code}"}
                status = "unhealthy"

            return {
                "component": component_name,
                "status": status,
                "enabled": True,
                "response_time": response_time,
                "response_code": response.status_code,
                "health_data": health_data,
                "critical": config["critical"],
                "timestamp": datetime.now().isoformat(),
            }

        except requests.exceptions.Timeout:
            return {
                "component": component_name,
                "status": "timeout",
                "enabled": True,
                "response_time": config["timeout"],
                "response_code": None,
                "health_data": {"error": "Request timeout"},
                "critical": config["critical"],
                "timestamp": datetime.now().isoformat(),
            }
        except requests.exceptions.ConnectionError:
            return {
                "component": component_name,
                "status": "unreachable",
                "enabled": True,
                "response_time": None,
                "response_code": None,
                "health_data": {"error": "Connection error"},
                "critical": config["critical"],
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            return {
                "component": component_name,
                "status": "error",
                "enabled": True,
                "response_time": None,
                "response_code": None,
                "health_data": {"error": str(e)},
                "critical": config["critical"],
                "timestamp": datetime.now().isoformat(),
            }

    def check_all_components(self) -> Dict[str, Any]:
        """Check health of all components"""
        logger.info("Checking all system components...")

        component_results = {}
        overall_status = "healthy"
        critical_failures = []

        for component_name, config in self.monitoring_config["components"].items():
            logger.info(f"Checking component: {component_name}")
            result = self.check_component_health(component_name, config)
            component_results[component_name] = result

            # Track critical failures
            if config["critical"] and result["status"] not in ["healthy", "disabled"]:
                critical_failures.append(component_name)
                overall_status = "critical"
            elif (
                result["status"] not in ["healthy", "disabled"]
                and overall_status == "healthy"
            ):
                overall_status = "warning"

        return {
            "overall_status": overall_status,
            "components": component_results,
            "critical_failures": critical_failures,
            "timestamp": datetime.now().isoformat(),
        }

    def check_process_health(self) -> Dict[str, Any]:
        """Check health of important processes"""
        logger.info("Checking process health...")

        important_processes = ["node", "python", "npm", "git", "nginx", "pm2"]

        process_results = {}

        for proc_name in important_processes:
            try:
                # Find processes by name
                processes = []
                for proc in psutil.process_iter(
                    ["pid", "name", "cpu_percent", "memory_percent"]
                ):
                    try:
                        if proc.info["name"] and proc_name in proc.info["name"].lower():
                            processes.append(
                                {
                                    "pid": proc.info["pid"],
                                    "name": proc.info["name"],
                                    "cpu_percent": proc.info["cpu_percent"],
                                    "memory_percent": proc.info["memory_percent"],
                                }
                            )
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        continue

                process_results[proc_name] = {
                    "count": len(processes),
                    "processes": processes,
                    "status": "running" if processes else "not_found",
                }

            except Exception as e:
                logger.error(f"Error checking process {proc_name}: {e}")
                process_results[proc_name] = {
                    "count": 0,
                    "processes": [],
                    "status": "error",
                    "error": str(e),
                }

        return process_results

    def check_file_system_health(self) -> Dict[str, Any]:
        """Check file system health"""
        logger.info("Checking file system health...")

        fs_results = {}

        try:
            # Check important directories
            important_dirs = [
                self.root_dir,
                self.root_dir / "logs",
                self.root_dir / "reports",
                self.root_dir / "models",
                self.root_dir / "config",
            ]

            for dir_path in important_dirs:
                try:
                    if dir_path.exists():
                        # Check directory size
                        total_size = sum(
                            f.stat().st_size for f in dir_path.rglob("*") if f.is_file()
                        )
                        file_count = sum(1 for f in dir_path.rglob("*") if f.is_file())

                        fs_results[str(dir_path.name)] = {
                            "exists": True,
                            "size_mb": total_size / (1024**2),
                            "file_count": file_count,
                            "status": "healthy",
                        }
                    else:
                        fs_results[str(dir_path.name)] = {
                            "exists": False,
                            "size_mb": 0,
                            "file_count": 0,
                            "status": "missing",
                        }
                except Exception as e:
                    fs_results[str(dir_path.name)] = {
                        "exists": False,
                        "size_mb": 0,
                        "file_count": 0,
                        "status": "error",
                        "error": str(e),
                    }

            # Check disk space
            disk = psutil.disk_usage("/")
            fs_results["disk_space"] = {
                "total_gb": disk.total / (1024**3),
                "used_gb": disk.used / (1024**3),
                "free_gb": disk.free / (1024**3),
                "usage_percent": (disk.used / disk.total) * 100,
                "status": (
                    "healthy" if (disk.used / disk.total) * 100 < 90 else "warning"
                ),
            }

        except Exception as e:
            logger.error(f"Error checking file system health: {e}")
            fs_results["error"] = str(e)

        return fs_results

    def check_network_connectivity(self) -> Dict[str, Any]:
        """Check network connectivity"""
        logger.info("Checking network connectivity...")

        network_results = {}

        # Test external connectivity
        external_urls = [
            "https://www.google.com",
            "https://api.github.com",
            "https://huggingface.co",
        ]

        for url in external_urls:
            try:
                start_time = time.time()
                response = requests.get(url, timeout=10)
                response_time = time.time() - start_time

                network_results[url] = {
                    "status": "reachable",
                    "response_time": response_time,
                    "status_code": response.status_code,
                }
            except Exception as e:
                network_results[url] = {
                    "status": "unreachable",
                    "response_time": None,
                    "status_code": None,
                    "error": str(e),
                }

        # Check local network interfaces
        try:
            interfaces = psutil.net_if_addrs()
            network_results["interfaces"] = {
                name: {
                    "addresses": [
                        addr.address for addr in addrs if addr.family == 2
                    ]  # IPv4
                }
                for name, addrs in interfaces.items()
            }
        except Exception as e:
            network_results["interfaces"] = {"error": str(e)}

        return network_results

    def generate_system_status_report(self) -> Dict[str, Any]:
        """Generate comprehensive system status report"""
        logger.info("Generating system status report...")

        try:
            # Gather all status information
            system_overview = self.get_system_overview()
            component_health = self.check_all_components()
            process_health = self.check_process_health()
            filesystem_health = self.check_file_system_health()
            network_health = self.check_network_connectivity()

            # Calculate overall system health
            overall_health = self.calculate_overall_health(
                system_overview,
                component_health,
                process_health,
                filesystem_health,
                network_health,
            )

            # Generate report
            report = {
                "timestamp": datetime.now().isoformat(),
                "overall_health": overall_health,
                "system_overview": system_overview,
                "component_health": component_health,
                "process_health": process_health,
                "filesystem_health": filesystem_health,
                "network_health": network_health,
                "alerts": self.generate_alerts(
                    system_overview,
                    component_health,
                    process_health,
                    filesystem_health,
                    network_health,
                ),
                "recommendations": self.generate_recommendations(
                    system_overview,
                    component_health,
                    process_health,
                    filesystem_health,
                    network_health,
                ),
            }

            return report

        except Exception as e:
            logger.error(f"Error generating system status report: {e}")
            return {
                "timestamp": datetime.now().isoformat(),
                "error": str(e),
                "overall_health": "error",
            }

    def calculate_overall_health(
        self,
        system_overview: Dict,
        component_health: Dict,
        process_health: Dict,
        filesystem_health: Dict,
        network_health: Dict,
    ) -> str:
        """Calculate overall system health"""
        health_scores = []

        # Component health score
        if component_health.get("overall_status") == "healthy":
            health_scores.append(100)
        elif component_health.get("overall_status") == "warning":
            health_scores.append(70)
        elif component_health.get("overall_status") == "critical":
            health_scores.append(30)
        else:
            health_scores.append(0)

        # Resource health score
        resources = system_overview.get("resources", {})
        if resources:
            cpu_usage = resources.get("cpu", {}).get("usage_percent", 0)
            memory_usage = resources.get("memory", {}).get("usage_percent", 0)
            disk_usage = resources.get("disk", {}).get("usage_percent", 0)

            # Calculate resource score (lower usage = higher score)
            resource_score = 100 - max(cpu_usage, memory_usage, disk_usage)
            health_scores.append(max(0, resource_score))

        # Network health score
        network_reachable = sum(
            1
            for url, status in network_health.items()
            if isinstance(status, dict) and status.get("status") == "reachable"
        )
        network_score = (
            network_reachable
            / len([k for k in network_health.keys() if k != "interfaces"])
        ) * 100
        health_scores.append(network_score)

        # Calculate average health score
        if health_scores:
            avg_score = sum(health_scores) / len(health_scores)

            if avg_score >= 90:
                return "excellent"
            elif avg_score >= 75:
                return "good"
            elif avg_score >= 50:
                return "fair"
            else:
                return "poor"

        return "unknown"

    def generate_alerts(
        self,
        system_overview: Dict,
        component_health: Dict,
        process_health: Dict,
        filesystem_health: Dict,
        network_health: Dict,
    ) -> List[Dict]:
        """Generate alerts based on system status"""
        alerts = []

        try:
            # Resource alerts
            resources = system_overview.get("resources", {})
            if resources:
                cpu_usage = resources.get("cpu", {}).get("usage_percent", 0)
                memory_usage = resources.get("memory", {}).get("usage_percent", 0)
                disk_usage = resources.get("disk", {}).get("usage_percent", 0)

                if cpu_usage > self.monitoring_config["thresholds"]["cpu_usage"]:
                    alerts.append(
                        {
                            "type": "high_cpu",
                            "severity": "warning",
                            "message": f"High CPU usage: {cpu_usage:.1f}%",
                            "value": cpu_usage,
                            "threshold": self.monitoring_config["thresholds"][
                                "cpu_usage"
                            ],
                        }
                    )

                if memory_usage > self.monitoring_config["thresholds"]["memory_usage"]:
                    alerts.append(
                        {
                            "type": "high_memory",
                            "severity": "warning",
                            "message": f"High memory usage: {memory_usage:.1f}%",
                            "value": memory_usage,
                            "threshold": self.monitoring_config["thresholds"][
                                "memory_usage"
                            ],
                        }
                    )

                if disk_usage > self.monitoring_config["thresholds"]["disk_usage"]:
                    alerts.append(
                        {
                            "type": "high_disk",
                            "severity": "critical",
                            "message": f"High disk usage: {disk_usage:.1f}%",
                            "value": disk_usage,
                            "threshold": self.monitoring_config["thresholds"][
                                "disk_usage"
                            ],
                        }
                    )

            # Component alerts
            for component_name, component_status in component_health.get(
                "components", {}
            ).items():
                if component_status.get("status") not in ["healthy", "disabled"]:
                    alerts.append(
                        {
                            "type": "component_unhealthy",
                            "severity": (
                                "critical"
                                if component_status.get("critical")
                                else "warning"
                            ),
                            "message": f"Component {component_name} is {component_status.get('status')}",
                            "component": component_name,
                            "status": component_status.get("status"),
                        }
                    )

            # Network alerts
            unreachable_count = sum(
                1
                for url, status in network_health.items()
                if isinstance(status, dict) and status.get("status") == "unreachable"
            )
            if unreachable_count > 0:
                alerts.append(
                    {
                        "type": "network_issues",
                        "severity": "warning",
                        "message": f"{unreachable_count} external URLs are unreachable",
                        "count": unreachable_count,
                    }
                )

        except Exception as e:
            logger.error(f"Error generating alerts: {e}")

        return alerts

    def generate_recommendations(
        self,
        system_overview: Dict,
        component_health: Dict,
        process_health: Dict,
        filesystem_health: Dict,
        network_health: Dict,
    ) -> List[Dict]:
        """Generate recommendations based on system status"""
        recommendations = []

        try:
            # Resource recommendations
            resources = system_overview.get("resources", {})
            if resources:
                cpu_usage = resources.get("cpu", {}).get("usage_percent", 0)
                memory_usage = resources.get("memory", {}).get("usage_percent", 0)
                disk_usage = resources.get("disk", {}).get("usage_percent", 0)

                if cpu_usage > 70:
                    recommendations.append(
                        {
                            "category": "performance",
                            "priority": "medium",
                            "title": "Optimize CPU Usage",
                            "description": "Consider optimizing CPU-intensive processes",
                            "actions": [
                                "Review high-CPU processes",
                                "Consider process optimization",
                            ],
                        }
                    )

                if memory_usage > 80:
                    recommendations.append(
                        {
                            "category": "performance",
                            "priority": "high",
                            "title": "Optimize Memory Usage",
                            "description": "Memory usage is high",
                            "actions": [
                                "Review memory-intensive processes",
                                "Consider memory optimization",
                            ],
                        }
                    )

                if disk_usage > 85:
                    recommendations.append(
                        {
                            "category": "storage",
                            "priority": "critical",
                            "title": "Free Up Disk Space",
                            "description": "Disk space is critically low",
                            "actions": [
                                "Clean up temporary files",
                                "Remove unused files",
                                "Consider disk expansion",
                            ],
                        }
                    )

            # Component recommendations
            unhealthy_components = [
                name
                for name, status in component_health.get("components", {}).items()
                if status.get("status") not in ["healthy", "disabled"]
            ]

            if unhealthy_components:
                recommendations.append(
                    {
                        "category": "components",
                        "priority": "high",
                        "title": "Fix Unhealthy Components",
                        "description": f"Components {', '.join(unhealthy_components)} need attention",
                        "actions": [
                            "Check component logs",
                            "Restart failed components",
                            "Review configuration",
                        ],
                    }
                )

        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")

        return recommendations

    def save_status_report(self, report: Dict[str, Any]) -> None:
        """Save status report to file"""
        try:
            report_file = (
                self.reports_dir
                / f'system_status_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            )
            with open(report_file, "w") as f:
                json.dump(report, f, indent=2, default=str)
            logger.info(f"System status report saved to {report_file}")
        except Exception as e:
            logger.error(f"Error saving status report: {e}")

    def monitor_once(self) -> Dict[str, Any]:
        """Perform one monitoring cycle"""
        logger.info("Performing system status monitoring cycle...")

        report = self.generate_system_status_report()

        # Save report
        self.save_status_report(report)

        # Add to history
        self.status_history.append(report)
        if len(self.status_history) > self.max_history_size:
            self.status_history.pop(0)

        # Log summary
        overall_health = report.get("overall_health", "unknown")
        alerts_count = len(report.get("alerts", []))
        recommendations_count = len(report.get("recommendations", []))

        logger.info(
            f"Monitoring cycle complete. Health: {overall_health}, Alerts: {alerts_count}, Recommendations: {recommendations_count}"
        )

        return report

    def start_continuous_monitoring(self) -> None:
        """Start continuous monitoring"""
        logger.info(
            f"Starting continuous system status monitoring (interval: {self.interval}s)"
        )

        try:
            while True:
                self.monitor_once()
                time.sleep(self.interval)
        except KeyboardInterrupt:
            logger.info("Continuous monitoring stopped by user")
        except Exception as e:
            logger.error(f"Continuous monitoring error: {e}")


def main():
    parser = argparse.ArgumentParser(description="QMOI System Status Monitor")
    parser.add_argument(
        "--continuous", "-c", action="store_true", help="Run continuous monitoring"
    )
    parser.add_argument(
        "--interval",
        "-i",
        type=int,
        default=60,
        help="Monitoring interval in seconds (default: 60)",
    )
    parser.add_argument(
        "--once", "-o", action="store_true", help="Run monitoring once and exit"
    )
    parser.add_argument(
        "--output",
        "-out",
        choices=["json", "summary"],
        default="summary",
        help="Output format (default: summary)",
    )

    args = parser.parse_args()

    monitor = QMOISystemStatusMonitor(
        continuous=args.continuous, interval=args.interval
    )

    try:
        if args.once:
            # Run once
            report = monitor.monitor_once()
            if args.output == "json":
                print(json.dumps(report, indent=2, default=str))
            else:
                # Print summary
                health = report.get("overall_health", "unknown")
                alerts = len(report.get("alerts", []))
                recommendations = len(report.get("recommendations", []))
                print(f"System Health: {health}")
                print(f"Alerts: {alerts}")
                print(f"Recommendations: {recommendations}")
        elif args.continuous:
            # Run continuously
            monitor.start_continuous_monitoring()
        else:
            # Run once by default
            report = monitor.monitor_once()
            if args.output == "json":
                print(json.dumps(report, indent=2, default=str))
            else:
                # Print summary
                health = report.get("overall_health", "unknown")
                alerts = len(report.get("alerts", []))
                recommendations = len(report.get("recommendations", []))
                print(f"System Health: {health}")
                print(f"Alerts: {alerts}")
                print(f"Recommendations: {recommendations}")

    except KeyboardInterrupt:
        logger.info("Monitoring stopped by user")
    except Exception as e:
        logger.error(f"Monitoring error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
