#!/usr/bin/env python3
"""
QMOI All Monitors Startup Script
Launches all monitoring systems in the correct order with proper error handling.
Ensures all monitoring services are running and healthy.
"""

import os
import sys
import json
import time
import logging
import subprocess
import threading
from datetime import datetime
from typing import Dict, List, Any


class AllMonitorsStarter:
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
                logging.FileHandler("logs/all_monitors_startup.log"),
                logging.StreamHandler(),
            ],
        )
        return logging.getLogger(__name__)

    def load_config(self) -> Dict[str, Any]:
        """Load startup configuration"""
        config = {
            "startup_order": [
                "notifications",
                "system_health",
                "performance",
                "security",
                "api_endpoints",
                "cloud_resources",
                "revenue",
                "employment",
                "backup",
            ],
            "startup_delay": 5,  # seconds between service starts
            "health_check_delay": 10,  # seconds to wait before health check
            "max_retries": 3,
            "monitoring_scripts": {
                "notifications": "scripts/monitoring/notification_monitor.py",
                "system_health": "scripts/monitoring/system_health_monitor.py",
                "performance": "scripts/monitoring/performance_monitor.py",
                "security": "scripts/monitoring/security_monitor.py",
                "revenue": "scripts/monitoring/revenue_monitor.py",
                "employment": "scripts/monitoring/employment_monitor.py",
                "cloud_resources": "scripts/monitoring/cloud_resources_monitor.py",
                "api_endpoints": "scripts/monitoring/api_endpoints_monitor.py",
                "backup": "scripts/monitoring/backup_monitor.py",
            },
        }

        # Load from config file if exists
        config_file = "config/all_monitors_config.json"
        if os.path.exists(config_file):
            try:
                with open(config_file, "r") as f:
                    file_config = json.load(f)
                    config.update(file_config)
            except Exception as e:
                self.logger.error(f"Error loading config: {e}")

        return config

    def check_dependencies(self) -> bool:
        """Check if all required dependencies are available"""
        try:
            self.logger.info("Checking dependencies...")

            required_packages = [
                "requests",
                "psutil",
                "boto3",
                "azure.mgmt.compute",
                "google.cloud",
                "aiohttp",
                "schedule",
            ]

            missing_packages = []
            for package in required_packages:
                try:
                    __import__(package)
                except ImportError:
                    missing_packages.append(package)

            if missing_packages:
                self.logger.error(f"Missing packages: {missing_packages}")
                self.logger.info("Installing missing packages...")

                for package in missing_packages:
                    try:
                        subprocess.check_call(
                            [sys.executable, "-m", "pip", "install", package]
                        )
                        self.logger.info(f"Installed {package}")
                    except subprocess.CalledProcessError as e:
                        self.logger.error(f"Failed to install {package}: {e}")
                        return False

            # Check if monitoring directory exists
            if not os.path.exists("scripts/monitoring"):
                self.logger.error("Monitoring directory not found")
                return False

            # Check if logs directory exists
            if not os.path.exists("logs"):
                os.makedirs("logs")
                self.logger.info("Created logs directory")

            self.logger.info("All dependencies satisfied")
            return True

        except Exception as e:
            self.logger.error(f"Error checking dependencies: {e}")
            return False

    def start_monitoring_service(self, service_name: str) -> bool:
        """Start a single monitoring service"""
        try:
            script_path = self.config["monitoring_scripts"].get(service_name)
            if not script_path:
                self.logger.error(f"No script path configured for {service_name}")
                return False

            if not os.path.exists(script_path):
                self.logger.error(f"Script not found: {script_path}")
                return False

            self.logger.info(f"Starting {service_name} monitoring service...")

            # Start the process
            process = subprocess.Popen(
                [sys.executable, script_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            # Store process info
            self.monitoring_processes[service_name] = {
                "process": process,
                "start_time": datetime.now(),
                "status": "starting",
                "retries": 0,
            }

            # Wait a bit for startup
            time.sleep(2)

            # Check if process is still running
            if process.poll() is None:
                self.monitoring_processes[service_name]["status"] = "running"
                self.logger.info(f"Successfully started {service_name}")
                return True
            else:
                # Process failed to start
                stdout, stderr = process.communicate()
                self.logger.error(f"Failed to start {service_name}: {stderr.decode()}")
                self.monitoring_processes[service_name]["status"] = "failed"
                return False

        except Exception as e:
            self.logger.error(f"Error starting {service_name}: {e}")
            return False

    def check_service_health(self, service_name: str) -> bool:
        """Check if a service is healthy"""
        try:
            if service_name not in self.monitoring_processes:
                return False

            process_info = self.monitoring_processes[service_name]
            process = process_info["process"]

            # Check if process is still running
            if process.poll() is None:
                # Check for recent log activity
                log_file = f"logs/{service_name}_monitor.log"
                if os.path.exists(log_file):
                    # Check if log file was updated recently
                    stat = os.stat(log_file)
                    if time.time() - stat.st_mtime < 300:  # 5 minutes
                        return True

            return False

        except Exception as e:
            self.logger.error(f"Error checking health of {service_name}: {e}")
            return False

    def restart_service(self, service_name: str) -> bool:
        """Restart a failed service"""
        try:
            self.logger.info(f"Restarting {service_name}...")

            # Stop existing process
            if service_name in self.monitoring_processes:
                process_info = self.monitoring_processes[service_name]
                process = process_info["process"]

                try:
                    process.terminate()
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()

            # Start new process
            return self.start_monitoring_service(service_name)

        except Exception as e:
            self.logger.error(f"Error restarting {service_name}: {e}")
            return False

    def start_all_services(self) -> Dict[str, bool]:
        """Start all monitoring services in order"""
        try:
            self.logger.info("Starting all monitoring services...")

            startup_results = {}

            for service_name in self.config["startup_order"]:
                self.logger.info(f"Starting {service_name}...")

                # Try to start the service
                success = False
                for attempt in range(self.config["max_retries"]):
                    if self.start_monitoring_service(service_name):
                        success = True
                        break
                    else:
                        self.logger.warning(
                            f"Attempt {attempt + 1} failed for {service_name}"
                        )
                        if attempt < self.config["max_retries"] - 1:
                            time.sleep(5)

                startup_results[service_name] = success

                if success:
                    self.logger.info(f"✓ {service_name} started successfully")
                else:
                    self.logger.error(
                        f"✗ Failed to start {service_name} after {self.config['max_retries']} attempts"
                    )

                # Wait before starting next service
                time.sleep(self.config["startup_delay"])

            return startup_results

        except Exception as e:
            self.logger.error(f"Error starting services: {e}")
            return {}

    def monitor_services(self):
        """Monitor running services and restart failed ones"""
        try:
            self.logger.info("Starting service monitoring...")

            while True:
                for service_name in self.monitoring_processes:
                    if not self.check_service_health(service_name):
                        self.logger.warning(
                            f"Service {service_name} appears to be unhealthy"
                        )

                        process_info = self.monitoring_processes[service_name]
                        if process_info["retries"] < self.config["max_retries"]:
                            self.logger.info(f"Attempting to restart {service_name}...")
                            if self.restart_service(service_name):
                                process_info["retries"] = 0
                                self.logger.info(
                                    f"Successfully restarted {service_name}"
                                )
                            else:
                                process_info["retries"] += 1
                                self.logger.error(
                                    f"Failed to restart {service_name} (attempt {process_info['retries']})"
                                )
                        else:
                            self.logger.error(
                                f"Service {service_name} failed too many times, giving up"
                            )

                time.sleep(60)  # Check every minute

        except KeyboardInterrupt:
            self.logger.info("Service monitoring interrupted")
        except Exception as e:
            self.logger.error(f"Error in service monitoring: {e}")

    def generate_startup_report(self) -> Dict[str, Any]:
        """Generate startup report"""
        try:
            report = {
                "timestamp": datetime.now().isoformat(),
                "startup_summary": {
                    "total_services": len(self.config["startup_order"]),
                    "successful_starts": 0,
                    "failed_starts": 0,
                },
                "service_status": {},
                "recommendations": [],
            }

            # Count successful and failed starts
            for service_name, process_info in self.monitoring_processes.items():
                status = process_info["status"]
                if status == "running":
                    report["startup_summary"]["successful_starts"] += 1
                else:
                    report["startup_summary"]["failed_starts"] += 1

                report["service_status"][service_name] = {
                    "status": status,
                    "start_time": process_info["start_time"].isoformat(),
                    "retries": process_info["retries"],
                    "healthy": self.check_service_health(service_name),
                }

            # Generate recommendations
            if report["startup_summary"]["failed_starts"] > 0:
                report["recommendations"].append(
                    {
                        "priority": "high",
                        "message": f"{report['startup_summary']['failed_starts']} services failed to start. Check logs for details.",
                    }
                )

            if report["startup_summary"]["successful_starts"] == 0:
                report["recommendations"].append(
                    {
                        "priority": "critical",
                        "message": "No monitoring services started successfully. System monitoring is not available.",
                    }
                )

            return report

        except Exception as e:
            self.logger.error(f"Error generating startup report: {e}")
            return {}

    def save_report(self, report: Dict[str, Any]):
        """Save startup report"""
        try:
            # Save to logs directory
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            report_file = f"logs/startup_report_{timestamp}.json"

            with open(report_file, "w") as f:
                json.dump(report, f, indent=2)

            # Save latest report
            with open("logs/startup_latest.json", "w") as f:
                json.dump(report, f, indent=2)

            self.logger.info(f"Startup report saved: {report_file}")

        except Exception as e:
            self.logger.error(f"Error saving report: {e}")

    def run(self):
        """Main startup process"""
        try:
            self.logger.info("Starting QMOI All Monitors Startup")

            # Check dependencies
            if not self.check_dependencies():
                self.logger.error("Dependency check failed")
                return

            # Start all services
            startup_results = self.start_all_services()

            # Wait for services to stabilize
            self.logger.info("Waiting for services to stabilize...")
            time.sleep(self.config["health_check_delay"])

            # Generate startup report
            report = self.generate_startup_report()
            self.save_report(report)

            # Log summary
            summary = report.get("startup_summary", {})
            self.logger.info(
                f"Startup Summary: {summary.get('successful_starts', 0)}/{summary.get('total_services', 0)} "
                f"services started successfully"
            )

            # Start service monitoring in background
            monitor_thread = threading.Thread(target=self.monitor_services)
            monitor_thread.daemon = True
            monitor_thread.start()

            self.logger.info(
                "All monitors startup completed. Service monitoring active."
            )

            # Keep main thread alive
            try:
                while True:
                    time.sleep(60)
                    # Generate periodic reports
                    report = self.generate_startup_report()
                    self.save_report(report)
            except KeyboardInterrupt:
                self.logger.info("Received interrupt signal")

        except Exception as e:
            self.logger.error(f"Error in startup process: {e}")
        finally:
            self.logger.info("Shutting down all monitors...")
            # Stop all processes
            for service_name, process_info in self.monitoring_processes.items():
                try:
                    process_info["process"].terminate()
                except:
                    pass


def main():
    """Main function"""
    starter = AllMonitorsStarter()
    starter.run()


if __name__ == "__main__":
    main()
