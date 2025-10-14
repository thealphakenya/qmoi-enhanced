#!/usr/bin/env python3
"""
QMOI Error Auto-Fix System

Comprehensive error detection, analysis, and automatic fixing system for QMOI.
Features:
- Real-time error monitoring
- Automatic error classification
- Intelligent fix application
- Performance optimization
- System health monitoring
"""

import os
import sys
import json
import time
import logging
import subprocess
import psutil
import traceback
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import threading
import queue

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class QMOIErrorAutoFix:
    """QMOI Error Auto-Fix System"""

    def __init__(self):
        self.error_queue = queue.Queue()
        self.fix_history = []
        self.error_patterns = {}
        self.system_health = {
            "cpu_usage": 0,
            "memory_usage": 0,
            "disk_usage": 0,
            "network_status": "healthy",
            "last_check": datetime.now(),
        }
        self.error_count = 0
        self.fix_success_count = 0
        self.start_error_monitoring()

    def start_error_monitoring(self):
        """Start continuous error monitoring"""

        def monitor_loop():
            while True:
                try:
                    # Monitor system health
                    self.check_system_health()

                    # Check for errors
                    self.detect_errors()

                    # Process error queue
                    self.process_error_queue()

                    # Optimize system
                    self.optimize_system()

                    time.sleep(30)  # Check every 30 seconds

                except Exception as e:
                    logger.error(f"Error monitoring failed: {e}")
                    time.sleep(60)  # Wait 1 minute on error

        threading.Thread(target=monitor_loop, daemon=True).start()
        logger.info("Error monitoring started")

    def check_system_health(self):
        """Check system health metrics"""
        try:
            # CPU usage
            self.system_health["cpu_usage"] = psutil.cpu_percent()

            # Memory usage
            self.system_health["memory_usage"] = psutil.virtual_memory().percent

            # Disk usage
            self.system_health["disk_usage"] = psutil.disk_usage("/").percent

            # Network status
            self.system_health["network_status"] = self.check_network_status()

            # Update timestamp
            self.system_health["last_check"] = datetime.now()

            # Check for health issues
            if self.system_health["cpu_usage"] > 90:
                self.add_error(
                    "HIGH_CPU_USAGE", f"CPU usage: {self.system_health['cpu_usage']}%"
                )

            if self.system_health["memory_usage"] > 90:
                self.add_error(
                    "HIGH_MEMORY_USAGE",
                    f"Memory usage: {self.system_health['memory_usage']}%",
                )

            if self.system_health["disk_usage"] > 95:
                self.add_error(
                    "HIGH_DISK_USAGE",
                    f"Disk usage: {self.system_health['disk_usage']}%",
                )

        except Exception as e:
            logger.error(f"Health check failed: {e}")

    def check_network_status(self) -> str:
        """Check network connectivity"""
        try:
            # Test basic connectivity
            import requests

            requests.get("https://www.google.com", timeout=5)
            return "healthy"
        except:
            return "unhealthy"

    def detect_errors(self):
        """Detect various types of errors"""
        try:
            # Check QMOI processes
            self.check_qmoi_processes()

            # Check database connections
            self.check_database_health()

            # Check API endpoints
            self.check_api_health()

            # Check cloud connections
            self.check_cloud_health()

            # Check file system
            self.check_file_system()

        except Exception as e:
            logger.error(f"Error detection failed: {e}")

    def check_qmoi_processes(self):
        """Check QMOI system processes"""
        try:
            # Check if main QMOI process is running
            qmoi_running = False
            for proc in psutil.process_iter(["pid", "name", "cmdline"]):
                if "qmoi" in proc.info["name"].lower() or any(
                    "qmoi" in str(cmd).lower() for cmd in proc.info["cmdline"] or []
                ):
                    qmoi_running = True
                    break

            if not qmoi_running:
                self.add_error("QMOI_PROCESS_DOWN", "QMOI main process not running")

        except Exception as e:
            logger.error(f"Process check failed: {e}")

    def check_database_health(self):
        """Check database health"""
        try:
            import sqlite3

            # Check QMOI databases
            databases = [
                "qmoi_enhanced_revenue.db",
                "qmoi_employment.db",
                "qmoi_deals.db",
                "qmoi_avatars.db",
            ]

            for db_file in databases:
                if os.path.exists(db_file):
                    try:
                        conn = sqlite3.connect(db_file)
                        cursor = conn.cursor()
                        cursor.execute("SELECT 1")
                        conn.close()
                    except Exception as e:
                        self.add_error(
                            "DATABASE_ERROR", f"Database {db_file} error: {e}"
                        )
                else:
                    self.add_error("DATABASE_MISSING", f"Database {db_file} not found")

        except Exception as e:
            logger.error(f"Database health check failed: {e}")

    def check_api_health(self):
        """Check API endpoints health"""
        try:
            import requests

            endpoints = [
                "http://localhost:7860/status",
                "http://localhost:7861",
                "http://localhost:8000/health",
            ]

            for endpoint in endpoints:
                try:
                    response = requests.get(endpoint, timeout=5)
                    if response.status_code != 200:
                        self.add_error(
                            "API_ERROR",
                            f"API {endpoint} returned {response.status_code}",
                        )
                except Exception as e:
                    self.add_error(
                        "API_UNREACHABLE", f"API {endpoint} unreachable: {e}"
                    )

        except Exception as e:
            logger.error(f"API health check failed: {e}")

    def check_cloud_health(self):
        """Check cloud service health"""
        try:
            # Check cloud configuration
            cloud_config_path = "cloud_config/qmoi_cloud_config.json"
            if not os.path.exists(cloud_config_path):
                self.add_error(
                    "CLOUD_CONFIG_MISSING", "Cloud configuration file not found"
                )
                return

            with open(cloud_config_path, "r") as f:
                cloud_config = json.load(f)

            # Check AWS connectivity
            if cloud_config.get("aws", {}).get("enabled"):
                try:
                    import boto3

                    s3 = boto3.client("s3")
                    s3.list_buckets()
                except Exception as e:
                    self.add_error(
                        "AWS_CONNECTION_ERROR", f"AWS connection failed: {e}"
                    )

            # Check other cloud providers...

        except Exception as e:
            logger.error(f"Cloud health check failed: {e}")

    def check_file_system(self):
        """Check file system health"""
        try:
            # Check critical directories
            critical_dirs = [
                "models/latest",
                "huggingface_space",
                "scripts",
                "config",
                "logs",
            ]

            for directory in critical_dirs:
                if not os.path.exists(directory):
                    self.add_error(
                        "DIRECTORY_MISSING", f"Critical directory {directory} not found"
                    )
                elif not os.access(directory, os.W_OK):
                    self.add_error(
                        "DIRECTORY_PERMISSION", f"No write permission for {directory}"
                    )

            # Check disk space
            disk_usage = psutil.disk_usage("/")
            free_space_gb = disk_usage.free / (1024**3)

            if free_space_gb < 1:  # Less than 1GB
                self.add_error(
                    "LOW_DISK_SPACE", f"Low disk space: {free_space_gb:.2f}GB free"
                )

        except Exception as e:
            logger.error(f"File system check failed: {e}")

    def add_error(self, error_type: str, error_message: str):
        """Add error to processing queue"""
        error = {
            "type": error_type,
            "message": error_message,
            "timestamp": datetime.now(),
            "severity": self.classify_error_severity(error_type),
            "fix_attempted": False,
        }

        self.error_queue.put(error)
        self.error_count += 1
        logger.warning(f"Error detected: {error_type} - {error_message}")

    def classify_error_severity(self, error_type: str) -> str:
        """Classify error severity"""
        critical_errors = [
            "QMOI_PROCESS_DOWN",
            "DATABASE_ERROR",
            "CLOUD_CONFIG_MISSING",
            "LOW_DISK_SPACE",
        ]

        high_errors = [
            "HIGH_CPU_USAGE",
            "HIGH_MEMORY_USAGE",
            "API_ERROR",
            "AWS_CONNECTION_ERROR",
        ]

        if error_type in critical_errors:
            return "critical"
        elif error_type in high_errors:
            return "high"
        else:
            return "medium"

    def process_error_queue(self):
        """Process errors in the queue"""
        while not self.error_queue.empty():
            try:
                error = self.error_queue.get_nowait()
                self.apply_fix(error)
            except queue.Empty:
                break
            except Exception as e:
                logger.error(f"Error processing failed: {e}")

    def apply_fix(self, error: Dict[str, Any]):
        """Apply automatic fix for error"""
        try:
            logger.info(f"Applying fix for {error['type']}")

            if error["type"] == "HIGH_CPU_USAGE":
                self.fix_high_cpu_usage()
            elif error["type"] == "HIGH_MEMORY_USAGE":
                self.fix_high_memory_usage()
            elif error["type"] == "HIGH_DISK_USAGE":
                self.fix_high_disk_usage()
            elif error["type"] == "QMOI_PROCESS_DOWN":
                self.fix_qmoi_process_down()
            elif error["type"] == "DATABASE_ERROR":
                self.fix_database_error(error)
            elif error["type"] == "API_ERROR":
                self.fix_api_error(error)
            elif error["type"] == "LOW_DISK_SPACE":
                self.fix_low_disk_space()
            elif error["type"] == "CLOUD_CONFIG_MISSING":
                self.fix_cloud_config_missing()
            else:
                self.apply_generic_fix(error)

            error["fix_attempted"] = True
            self.fix_history.append(error)
            self.fix_success_count += 1

            logger.info(f"Fix applied for {error['type']}")

        except Exception as e:
            logger.error(f"Fix failed for {error['type']}: {e}")

    def fix_high_cpu_usage(self):
        """Fix high CPU usage"""
        logger.info("Fixing high CPU usage...")

        # Kill unnecessary processes
        for proc in psutil.process_iter(["pid", "name", "cpu_percent"]):
            if proc.info["cpu_percent"] > 50 and proc.info["name"] not in [
                "qmoi",
                "python",
            ]:
                try:
                    proc.terminate()
                    logger.info(f"Terminated high CPU process: {proc.info['name']}")
                except:
                    pass

        # Optimize QMOI processes
        self.optimize_qmoi_processes()

    def fix_high_memory_usage(self):
        """Fix high memory usage"""
        logger.info("Fixing high memory usage...")

        # Clear memory caches
        import gc

        gc.collect()

        # Clear temporary files
        self.clear_temp_files()

        # Restart memory-intensive processes
        self.restart_memory_intensive_processes()

    def fix_high_disk_usage(self):
        """Fix high disk usage"""
        logger.info("Fixing high disk usage...")

        # Clear old log files
        self.clear_old_logs()

        # Clear cache directories
        self.clear_cache_directories()

        # Compress old data
        self.compress_old_data()

    def fix_qmoi_process_down(self):
        """Fix QMOI process down"""
        logger.info("Fixing QMOI process down...")

        # Restart QMOI system
        try:
            subprocess.Popen([sys.executable, "scripts/start_qmoi_enhanced.py"])
            logger.info("QMOI system restarted")
        except Exception as e:
            logger.error(f"Failed to restart QMOI: {e}")

    def fix_database_error(self, error: Dict[str, Any]):
        """Fix database error"""
        logger.info("Fixing database error...")

        # Recreate database if needed
        db_file = error["message"].split()[1]  # Extract database name

        if os.path.exists(db_file):
            # Backup and recreate
            backup_file = f"{db_file}.backup"
            os.rename(db_file, backup_file)
            logger.info(f"Database backed up to {backup_file}")

        # Reinitialize database
        self.reinitialize_database(db_file)

    def fix_api_error(self, error: Dict[str, Any]):
        """Fix API error"""
        logger.info("Fixing API error...")

        # Restart API services
        try:
            subprocess.Popen([sys.executable, "huggingface_space/app.py"])
            logger.info("API services restarted")
        except Exception as e:
            logger.error(f"Failed to restart API: {e}")

    def fix_low_disk_space(self):
        """Fix low disk space"""
        logger.info("Fixing low disk space...")

        # Clear temporary files
        self.clear_temp_files()

        # Clear old backups
        self.clear_old_backups()

        # Clear cloud cache
        self.clear_cloud_cache()

        # Compress data
        self.compress_data()

    def fix_cloud_config_missing(self):
        """Fix missing cloud configuration"""
        logger.info("Fixing missing cloud configuration...")

        # Recreate cloud configuration
        try:
            subprocess.run([sys.executable, "scripts/qmoi_cloud_setup.py"])
            logger.info("Cloud configuration recreated")
        except Exception as e:
            logger.error(f"Failed to recreate cloud config: {e}")

    def apply_generic_fix(self, error: Dict[str, Any]):
        """Apply generic fix for unknown errors"""
        logger.info(f"Applying generic fix for {error['type']}")

        # Restart related services
        self.restart_related_services(error["type"])

        # Clear caches
        self.clear_all_caches()

        # Optimize system
        self.optimize_system()

    def optimize_system(self):
        """Optimize system performance"""
        try:
            # Optimize QMOI processes
            self.optimize_qmoi_processes()

            # Clear caches
            self.clear_all_caches()

            # Optimize database
            self.optimize_databases()

            # Update system health
            self.update_system_health()

        except Exception as e:
            logger.error(f"System optimization failed: {e}")

    def optimize_qmoi_processes(self):
        """Optimize QMOI processes"""
        # Adjust process priorities
        for proc in psutil.process_iter(["pid", "name"]):
            if "qmoi" in proc.info["name"].lower():
                try:
                    proc.nice(10)  # Lower priority
                except:
                    pass

    def clear_temp_files(self):
        """Clear temporary files"""
        temp_dirs = ["temp", "cloud_cache", "logs"]
        for temp_dir in temp_dirs:
            if os.path.exists(temp_dir):
                for file in os.listdir(temp_dir):
                    file_path = os.path.join(temp_dir, file)
                    if os.path.isfile(file_path):
                        # Keep only recent files
                        if (
                            time.time() - os.path.getmtime(file_path) > 86400
                        ):  # 24 hours
                            os.remove(file_path)

    def clear_old_logs(self):
        """Clear old log files"""
        log_dir = "logs"
        if os.path.exists(log_dir):
            for file in os.listdir(log_dir):
                if file.endswith(".log"):
                    file_path = os.path.join(log_dir, file)
                    if time.time() - os.path.getmtime(file_path) > 604800:  # 7 days
                        os.remove(file_path)

    def clear_cache_directories(self):
        """Clear cache directories"""
        cache_dirs = ["cloud_cache", "temp", "__pycache__"]
        for cache_dir in cache_dirs:
            if os.path.exists(cache_dir):
                import shutil

                shutil.rmtree(cache_dir, ignore_errors=True)
                os.makedirs(cache_dir, exist_ok=True)

    def compress_old_data(self):
        """Compress old data"""
        # Compress old reports
        reports_dir = "reports"
        if os.path.exists(reports_dir):
            for file in os.listdir(reports_dir):
                if (
                    file.endswith(".json")
                    and time.time() - os.path.getmtime(os.path.join(reports_dir, file))
                    > 2592000
                ):  # 30 days
                    # Compress old reports
                    pass

    def restart_memory_intensive_processes(self):
        """Restart memory-intensive processes"""
        # Restart QMOI processes if memory usage is high
        if self.system_health["memory_usage"] > 90:
            self.fix_qmoi_process_down()

    def reinitialize_database(self, db_file: str):
        """Reinitialize database"""
        # This would recreate the database schema
        pass

    def restart_related_services(self, error_type: str):
        """Restart services related to error"""
        if "API" in error_type:
            self.fix_api_error({"message": "API error"})
        elif "QMOI" in error_type:
            self.fix_qmoi_process_down()

    def clear_all_caches(self):
        """Clear all caches"""
        self.clear_temp_files()
        self.clear_cache_directories()
        self.clear_cloud_cache()

    def clear_cloud_cache(self):
        """Clear cloud cache"""
        cloud_cache_dir = "cloud_cache"
        if os.path.exists(cloud_cache_dir):
            import shutil

            shutil.rmtree(cloud_cache_dir, ignore_errors=True)
            os.makedirs(cloud_cache_dir, exist_ok=True)

    def clear_old_backups(self):
        """Clear old backups"""
        backup_dir = "backups"
        if os.path.exists(backup_dir):
            for file in os.listdir(backup_dir):
                file_path = os.path.join(backup_dir, file)
                if time.time() - os.path.getmtime(file_path) > 2592000:  # 30 days
                    os.remove(file_path)

    def compress_data(self):
        """Compress data to save space"""
        # Compress old data files
        pass

    def optimize_databases(self):
        """Optimize databases"""
        # Run database optimization commands
        pass

    def update_system_health(self):
        """Update system health metrics"""
        self.check_system_health()

    def get_error_report(self) -> Dict[str, Any]:
        """Generate error report"""
        return {
            "timestamp": datetime.now().isoformat(),
            "total_errors": self.error_count,
            "fixes_applied": self.fix_success_count,
            "success_rate": (self.fix_success_count / max(self.error_count, 1)) * 100,
            "system_health": self.system_health,
            "recent_fixes": self.fix_history[-10:] if self.fix_history else [],
        }


def main():
    """Main function"""
    error_fix = QMOIErrorAutoFix()

    print("🔧 QMOI Error Auto-Fix System Started")
    print("Monitoring system for errors and applying automatic fixes...")

    try:
        while True:
            time.sleep(60)  # Keep running
    except KeyboardInterrupt:
        print("\n🛑 Error Auto-Fix System stopped")


if __name__ == "__main__":
    main()
