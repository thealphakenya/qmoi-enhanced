#!/usr/bin/env python3
"""
QMOI Monitoring System Startup Script
Launches all monitoring components and ensures the entire QMOI monitoring system is running properly.
Coordinates system health, performance, security, backup, cloud resources, API endpoints, and notifications.
"""

import os
import sys
import json
import time
import logging
import subprocess
import threading
from datetime import datetime
from typing import Dict, List, Any, Optional


class MonitoringSystemStartup:
    def __init__(self):
        self.logger = self.setup_logging()
        self.config = self.load_config()
        self.monitoring_processes = {}
        self.startup_status = {}

    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("logs/monitoring_startup.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def load_config(self) -> Dict[str, Any]:
        """Load startup configuration"""
        config = {
            "monitoring_components": [
                {
                    "name": "master_monitor",
                    "script": "scripts/monitoring/master_monitor.py",
                    "priority": "critical",
                    "auto_restart": True,
                    "delay": 0,
                },
                {
                    "name": "system_health_monitor",
                    "script": "scripts/monitoring/system_health_monitor.py",
                    "priority": "high",
                    "auto_restart": True,
                    "delay": 5,
                },
                {
                    "name": "performance_monitor",
                    "script": "scripts/monitoring/performance_monitor.py",
                    "priority": "high",
                    "auto_restart": True,
                    "delay": 10,
                },
                {
                    "name": "security_monitor",
                    "script": "scripts/qmoi_security_monitor.py",
                    "priority": "critical",
                    "auto_restart": True,
                    "delay": 15,
                },
                {
                    "name": "backup_monitor",
                    "script": "scripts/monitoring/backup_monitor.py",
                    "priority": "medium",
                    "auto_restart": True,
                    "delay": 20,
                },
                {
                    "name": "cloud_resources_monitor",
                    "script": "scripts/monitoring/cloud_resources_monitor.py",
                    "priority": "medium",
                    "auto_restart": True,
                    "delay": 25,
                },
                {
                    "name": "api_endpoints_monitor",
                    "script": "scripts/monitoring/api_endpoints_monitor.py",
                    "priority": "high",
                    "auto_restart": True,
                    "delay": 30,
                },
                {
                    "name": "notification_monitor",
                    "script": "scripts/monitoring/notification_monitor.py",
                    "priority": "critical",
                    "auto_restart": True,
                    "delay": 35,
                },
            ],
            "startup_checks": {
                "max_startup_time": 300,  # 5 minutes
                "health_check_interval": 30,
                "max_retries": 3,
            },
            "dependencies": [
                "requests",
                "psutil",
                "boto3",
                "azure-mgmt-compute",
                "google-cloud-compute",
                "flask",
            ],
        }

        # Load from config file if exists
        config_file = "config/monitoring_startup_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")

        return config

    def check_dependencies(self) -> bool:
        """Check if all required dependencies are installed"""
        try:
            self.logger.info("Checking dependencies...")

            missing_deps = []
            for dep in self.config["dependencies"]:
                try:
                    __import__(dep.replace("-", "_"))
                except ImportError:
                    missing_deps.append(dep)

            if missing_deps:
                self.logger.warning(f"Missing dependencies: {', '.join(missing_deps)}")
                self.logger.info("Installing missing dependencies...")

                for dep in missing_deps:
                    try:
                        subprocess.check_call(
                            [sys.executable, "-m", "pip", "install", dep]
                        )
                        self.logger.info(f"Installed: {dep}")
                    except subprocess.CalledProcessError as e:
                        self.logger.error(f"Failed to install {dep}: {e}")
                        return False

            self.logger.info("All dependencies satisfied")
            return True

        except Exception as e:
            self.logger.error(f"Error checking dependencies: {e}")
            return False

    def create_directories(self):
        """Create necessary directories"""
        try:
            directories = ["logs", "logs/monitoring", "config", "reports", "backups"]

            for directory in directories:
                os.makedirs(directory, exist_ok=True)

            self.logger.info("Directories created")

        except Exception as e:
            self.logger.error(f"Error creating directories: {e}")

    def start_component(self, component: Dict[str, Any]) -> bool:
        """Start a monitoring component"""
        try:
            name = component["name"]
            script = component["script"]
            delay = component.get("delay", 0)

            # Wait for delay
            if delay > 0:
                self.logger.info(f"Waiting {delay} seconds before starting {name}...")
                time.sleep(delay)

            # Check if script exists
            if not os.path.exists(script):
                self.logger.error(f"Script not found: {script}")
                return False

            # Start the component
            self.logger.info(f"Starting {name}...")

            process = subprocess.Popen(
                [sys.executable, script], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )

            self.monitoring_processes[name] = {
                "process": process,
                "component": component,
                "start_time": datetime.now(),
                "status": "starting",
            }

            # Wait a moment to see if it starts successfully
            time.sleep(2)

            if process.poll() is None:
                self.monitoring_processes[name]["status"] = "running"
                self.logger.info(f"Successfully started {name}")
                return True
            else:
                self.monitoring_processes[name]["status"] = "failed"
                self.logger.error(f"Failed to start {name}")
                return False

        except Exception as e:
            self.logger.error(f"Error starting component {name}: {e}")
            return False

    def start_all_components(self) -> bool:
        """Start all monitoring components"""
        try:
            self.logger.info("Starting all monitoring components...")

            success_count = 0
            total_count = len(self.config["monitoring_components"])

            for component in self.config["monitoring_components"]:
                if self.start_component(component):
                    success_count += 1

            self.logger.info(
                f"Started {success_count}/{total_count} components successfully"
            )

            # Check if critical components are running
            critical_components = [
                comp
                for comp in self.config["monitoring_components"]
                if comp["priority"] == "critical"
            ]

            critical_running = 0
            for comp in critical_components:
                if comp["name"] in self.monitoring_processes:
                    if self.monitoring_processes[comp["name"]]["status"] == "running":
                        critical_running += 1

            if critical_running < len(critical_components):
                self.logger.error("Not all critical components are running")
                return False

            return success_count >= total_count * 0.8  # 80% success rate

        except Exception as e:
            self.logger.error(f"Error starting components: {e}")
            return False

    def monitor_components(self):
        """Monitor running components"""
        try:
            self.logger.info("Monitoring component health...")

            while True:
                for name, process_info in self.monitoring_processes.items():
                    process = process_info["process"]

                    # Check if process is still running
                    if process.poll() is None:
                        if process_info["status"] != "running":
                            process_info["status"] = "running"
                            self.logger.info(f"Component {name} is now running")
                    else:
                        if process_info["status"] == "running":
                            process_info["status"] = "stopped"
                            self.logger.warning(
                                f"Component {name} stopped unexpectedly"
                            )

                            # Auto-restart if enabled
                            component = process_info["component"]
                            if component.get("auto_restart", False):
                                self.logger.info(f"Auto-restarting {name}...")
                                self.start_component(component)

                time.sleep(30)  # Check every 30 seconds

        except KeyboardInterrupt:
            self.logger.info("Monitoring interrupted")
        except Exception as e:
            self.logger.error(f"Error monitoring components: {e}")

    def health_check(self) -> Dict[str, Any]:
        """Perform health check of all components"""
        try:
            health_status = {
                "timestamp": datetime.now().isoformat(),
                "overall_status": "healthy",
                "components": {},
                "summary": {
                    "total": len(self.monitoring_processes),
                    "running": 0,
                    "stopped": 0,
                    "failed": 0,
                },
            }

            for name, process_info in self.monitoring_processes.items():
                process = process_info["process"]
                status = process_info["status"]

                health_status["components"][name] = {
                    "status": status,
                    "start_time": process_info["start_time"].isoformat(),
                    "uptime": str(datetime.now() - process_info["start_time"]),
                    "priority": process_info["component"]["priority"],
                }

                if status == "running":
                    health_status["summary"]["running"] += 1
                elif status == "stopped":
                    health_status["summary"]["stopped"] += 1
                elif status == "failed":
                    health_status["summary"]["failed"] += 1

            # Determine overall status
            if health_status["summary"]["failed"] > 0:
                health_status["overall_status"] = "critical"
            elif health_status["summary"]["stopped"] > 0:
                health_status["overall_status"] = "warning"
            else:
                health_status["overall_status"] = "healthy"

            return health_status

        except Exception as e:
            self.logger.error(f"Error performing health check: {e}")
            return {}

    def save_startup_report(self, success: bool):
        """Save startup report"""
        try:
            report = {
                "timestamp": datetime.now().isoformat(),
                "success": success,
                "components": {},
                "health_status": self.health_check(),
            }

            # Add component details
            for name, process_info in self.monitoring_processes.items():
                report["components"][name] = {
                    "status": process_info["status"],
                    "start_time": process_info["start_time"].isoformat(),
                    "priority": process_info["component"]["priority"],
                    "auto_restart": process_info["component"].get(
                        "auto_restart", False
                    ),
                }

            # Save report
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"logs/monitoring_startup_report_{timestamp}.json"

            with open(report_file, "w") as f:
                json.dump(report, f, indent=2)

            # Save latest report
            with open("logs/monitoring_startup_latest.json", "w") as f:
                json.dump(report, f, indent=2)

            self.logger.info(f"Startup report saved: {report_file}")

        except Exception as e:
            self.logger.error(f"Error saving startup report: {e}")

    def print_status(self):
        """Print current status"""
        try:
            print("\n" + "=" * 60)
            print("QMOI MONITORING SYSTEM STATUS")
            print("=" * 60)

            health_status = self.health_check()

            print(f"Overall Status: {health_status.get('overall_status', 'unknown')}")
            print(f"Timestamp: {health_status.get('timestamp', 'unknown')}")
            print()

            summary = health_status.get("summary", {})
            print(f"Components: {summary.get('total', 0)} total")
            print(f"  Running: {summary.get('running', 0)}")
            print(f"  Stopped: {summary.get('stopped', 0)}")
            print(f"  Failed: {summary.get('failed', 0)}")
            print()

            print("Component Details:")
            print("-" * 40)

            for name, details in health_status.get("components", {}).items():
                status = details.get("status", "unknown")
                priority = details.get("priority", "unknown")
                uptime = details.get("uptime", "unknown")

                status_icon = (
                    "🟢"
                    if status == "running"
                    else "🔴" if status == "failed" else "🟡"
                )

                print(f"{status_icon} {name:<20} {status:<10} {priority:<10} {uptime}")

            print("=" * 60)

        except Exception as e:
            self.logger.error(f"Error printing status: {e}")

    def run(self):
        """Main startup process"""
        try:
            self.logger.info("Starting QMOI Monitoring System")

            # Step 1: Create directories
            self.create_directories()

            # Step 2: Check dependencies
            if not self.check_dependencies():
                self.logger.error("Dependency check failed")
                return False

            # Step 3: Start all components
            if not self.start_all_components():
                self.logger.error("Failed to start all components")
                self.save_startup_report(False)
                return False

            # Step 4: Save startup report
            self.save_startup_report(True)

            # Step 5: Print status
            self.print_status()

            # Step 6: Start monitoring thread
            monitor_thread = threading.Thread(target=self.monitor_components)
            monitor_thread.daemon = True
            monitor_thread.start()

            self.logger.info("QMOI Monitoring System started successfully")

            # Step 7: Keep running and provide status updates
            try:
                while True:
                    time.sleep(300)  # Update every 5 minutes
                    self.print_status()

            except KeyboardInterrupt:
                self.logger.info("Received interrupt signal")

        except Exception as e:
            self.logger.error(f"Error in startup process: {e}")
            return False

        return True


def main():
    """Main function"""
    startup = MonitoringSystemStartup()
    success = startup.run()

    if success:
        print("\n✅ QMOI Monitoring System started successfully!")
        print("📊 Dashboard available at: http://localhost:8080")
        print("📝 Logs available in: logs/")
        print("🔄 System will auto-restart failed components")
    else:
        print("\n❌ QMOI Monitoring System startup failed!")
        print("📝 Check logs for details: logs/monitoring_startup.log")

    return success


if __name__ == "__main__":
    main()
