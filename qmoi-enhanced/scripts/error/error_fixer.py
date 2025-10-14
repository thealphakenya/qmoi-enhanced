import os
import sys
import json
import logging
import subprocess
import psutil
import shutil
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import winreg
import ctypes
from pathlib import Path


class ErrorFixer:
    def __init__(self, config_path: str = "config/error_config.json"):
        self.config_path = config_path
        self.config = self.load_config()
        self.logger = self.setup_logger()
        self.error_history = []
        self.fix_history = []
        self.backup_dir = "backups"
        self.max_backups = 5

        # Initialize backup directory
        os.makedirs(self.backup_dir, exist_ok=True)

    def setup_logger(self) -> logging.Logger:
        """Setup logging configuration."""
        logger = logging.getLogger("ErrorFixer")
        logger.setLevel(logging.INFO)

        # Create handlers
        file_handler = logging.FileHandler("logs/error_fixer.log")
        console_handler = logging.StreamHandler()

        # Create formatters
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        # Add handlers
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger

    def load_config(self) -> Dict:
        """Load error configuration."""
        try:
            with open(self.config_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            self.logger.warning(f"Config file not found: {self.config_path}")
            return {
                "scan_interval": 300,  # 5 minutes
                "error_threshold": 3,
                "auto_fix": True,
                "backup_before_fix": True,
                "notify_on_error": True,
                "error_categories": {
                    "system": True,
                    "network": True,
                    "disk": True,
                    "memory": True,
                    "registry": True,
                },
            }

    def save_config(self) -> None:
        """Save error configuration."""
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, "w") as f:
            json.dump(self.config, f, indent=4)

    def scan_for_errors(self) -> List[Dict]:
        """Scan system for errors."""
        errors = []

        # Check system errors
        if self.config["error_categories"]["system"]:
            errors.extend(self._scan_system_errors())

        # Check network errors
        if self.config["error_categories"]["network"]:
            errors.extend(self._scan_network_errors())

        # Check disk errors
        if self.config["error_categories"]["disk"]:
            errors.extend(self._scan_disk_errors())

        # Check memory errors
        if self.config["error_categories"]["memory"]:
            errors.extend(self._scan_memory_errors())

        # Check registry errors
        if self.config["error_categories"]["registry"]:
            errors.extend(self._scan_registry_errors())

        # Update error history
        self.error_history.extend(errors)

        # Keep only last 1000 error entries
        if len(self.error_history) > 1000:
            self.error_history = self.error_history[-1000:]

        return errors

    def _scan_system_errors(self) -> List[Dict]:
        """Scan for system-related errors."""
        errors = []

        try:
            # Check system files
            sfc_result = subprocess.run(
                ["sfc", "/verifyonly"], capture_output=True, text=True
            )

            if "Windows Resource Protection found corrupt files" in sfc_result.stdout:
                errors.append(
                    {
                        "type": "system",
                        "category": "corrupt_files",
                        "severity": "high",
                        "description": "Corrupt system files detected",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

            # Check system services
            for service in psutil.win_service_iter():
                try:
                    service_info = service.as_dict()
                    if (
                        service_info["status"] == "stopped"
                        and service_info["start_type"] == "auto"
                    ):
                        errors.append(
                            {
                                "type": "system",
                                "category": "service",
                                "severity": "medium",
                                "description": f"Service {service_info['name']} is stopped but should be running",
                                "timestamp": datetime.now().isoformat(),
                            }
                        )
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

            # Check system resources
            cpu_percent = psutil.cpu_percent(interval=1)
            if cpu_percent > 90:
                errors.append(
                    {
                        "type": "system",
                        "category": "resource",
                        "severity": "high",
                        "description": f"High CPU usage: {cpu_percent}%",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

        except Exception as e:
            self.logger.error(f"Error scanning system: {e}")

        return errors

    def _scan_network_errors(self) -> List[Dict]:
        """Scan for network-related errors."""
        errors = []

        try:
            # Check network connectivity
            ping_result = subprocess.run(
                ["ping", "8.8.8.8", "-n", "1"], capture_output=True, text=True
            )

            if "Request timed out" in ping_result.stdout:
                errors.append(
                    {
                        "type": "network",
                        "category": "connectivity",
                        "severity": "high",
                        "description": "No internet connectivity",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

            # Check DNS resolution
            nslookup_result = subprocess.run(
                ["nslookup", "google.com"], capture_output=True, text=True
            )

            if "can't find" in nslookup_result.stdout:
                errors.append(
                    {
                        "type": "network",
                        "category": "dns",
                        "severity": "medium",
                        "description": "DNS resolution issues",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

        except Exception as e:
            self.logger.error(f"Error scanning network: {e}")

        return errors

    def _scan_disk_errors(self) -> List[Dict]:
        """Scan for disk-related errors."""
        errors = []

        try:
            # Check disk space
            for partition in psutil.disk_partitions():
                try:
                    usage = psutil.disk_usage(partition.mountpoint)
                    if usage.percent > 90:
                        errors.append(
                            {
                                "type": "disk",
                                "category": "space",
                                "severity": "high",
                                "description": f"Low disk space on {partition.mountpoint}: {usage.percent}% used",
                                "timestamp": datetime.now().isoformat(),
                            }
                        )
                except (PermissionError, FileNotFoundError):
                    continue

            # Check disk health
            for partition in psutil.disk_partitions():
                try:
                    chkdsk_result = subprocess.run(
                        ["chkdsk", partition.device, "/f"],
                        capture_output=True,
                        text=True,
                    )

                    if "errors found" in chkdsk_result.stdout:
                        errors.append(
                            {
                                "type": "disk",
                                "category": "health",
                                "severity": "high",
                                "description": f"Disk errors found on {partition.device}",
                                "timestamp": datetime.now().isoformat(),
                            }
                        )
                except subprocess.CalledProcessError:
                    continue

        except Exception as e:
            self.logger.error(f"Error scanning disk: {e}")

        return errors

    def _scan_memory_errors(self) -> List[Dict]:
        """Scan for memory-related errors."""
        errors = []

        try:
            # Check memory usage
            memory = psutil.virtual_memory()
            if memory.percent > 90:
                errors.append(
                    {
                        "type": "memory",
                        "category": "usage",
                        "severity": "high",
                        "description": f"High memory usage: {memory.percent}%",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

            # Check page file
            if memory.swap:
                if memory.swap.percent > 90:
                    errors.append(
                        {
                            "type": "memory",
                            "category": "page_file",
                            "severity": "high",
                            "description": f"High page file usage: {memory.swap.percent}%",
                            "timestamp": datetime.now().isoformat(),
                        }
                    )

        except Exception as e:
            self.logger.error(f"Error scanning memory: {e}")

        return errors

    def _scan_registry_errors(self) -> List[Dict]:
        """Scan for registry-related errors."""
        errors = []

        try:
            # Check registry permissions
            key_paths = [
                r"SOFTWARE\Microsoft\Windows\CurrentVersion",
                r"SYSTEM\CurrentControlSet\Services",
            ]

            for key_path in key_paths:
                try:
                    key = winreg.OpenKey(
                        winreg.HKEY_LOCAL_MACHINE, key_path, 0, winreg.KEY_READ
                    )
                    winreg.CloseKey(key)
                except WindowsError as e:
                    errors.append(
                        {
                            "type": "registry",
                            "category": "permission",
                            "severity": "medium",
                            "description": f"Registry access error for {key_path}: {str(e)}",
                            "timestamp": datetime.now().isoformat(),
                        }
                    )

        except Exception as e:
            self.logger.error(f"Error scanning registry: {e}")

        return errors

    def fix_errors(self, errors: List[Dict]) -> List[Dict]:
        """Fix detected errors."""
        fixed_errors = []

        for error in errors:
            try:
                if self.config["backup_before_fix"]:
                    self._create_backup()

                if self._fix_error(error):
                    fixed_errors.append(error)
                    self.fix_history.append(
                        {
                            "error": error,
                            "timestamp": datetime.now().isoformat(),
                            "success": True,
                        }
                    )
                else:
                    self.fix_history.append(
                        {
                            "error": error,
                            "timestamp": datetime.now().isoformat(),
                            "success": False,
                        }
                    )

            except Exception as e:
                self.logger.error(f"Error fixing {error['type']} error: {e}")
                self.fix_history.append(
                    {
                        "error": error,
                        "timestamp": datetime.now().isoformat(),
                        "success": False,
                        "error_message": str(e),
                    }
                )

        return fixed_errors

    def _fix_error(self, error: Dict) -> bool:
        """Fix a specific error."""
        try:
            if error["type"] == "system":
                return self._fix_system_error(error)
            elif error["type"] == "network":
                return self._fix_network_error(error)
            elif error["type"] == "disk":
                return self._fix_disk_error(error)
            elif error["type"] == "memory":
                return self._fix_memory_error(error)
            elif error["type"] == "registry":
                return self._fix_registry_error(error)
            return False
        except Exception as e:
            self.logger.error(f"Error in _fix_error: {e}")
            return False

    def _fix_system_error(self, error: Dict) -> bool:
        """Fix system-related errors."""
        try:
            if error["category"] == "corrupt_files":
                # Run SFC to repair system files
                subprocess.run(["sfc", "/scannow"], check=True)
                return True

            elif error["category"] == "service":
                # Restart the service
                service_name = error["description"].split("Service ")[1].split(" is")[0]
                subprocess.run(["net", "start", service_name], check=True)
                return True

            elif error["category"] == "resource":
                # Kill unnecessary processes
                for proc in psutil.process_iter(["pid", "name", "cpu_percent"]):
                    if proc.info["cpu_percent"] > 50:
                        try:
                            proc.kill()
                        except (psutil.NoSuchProcess, psutil.AccessDenied):
                            continue
                return True

        except Exception as e:
            self.logger.error(f"Error fixing system error: {e}")
            return False

    def _fix_network_error(self, error: Dict) -> bool:
        """Fix network-related errors."""
        try:
            if error["category"] == "connectivity":
                # Reset network adapter
                subprocess.run(
                    ["netsh", "interface", "set", "interface", "Wi-Fi", "disable"],
                    check=True,
                )
                subprocess.run(
                    ["netsh", "interface", "set", "interface", "Wi-Fi", "enable"],
                    check=True,
                )
                return True

            elif error["category"] == "dns":
                # Flush DNS cache
                subprocess.run(["ipconfig", "/flushdns"], check=True)
                return True

        except Exception as e:
            self.logger.error(f"Error fixing network error: {e}")
            return False

    def _fix_disk_error(self, error: Dict) -> bool:
        """Fix disk-related errors."""
        try:
            if error["category"] == "space":
                # Clean up temporary files
                temp_dirs = [
                    os.environ.get("TEMP"),
                    os.environ.get("TMP"),
                    os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Temp"),
                ]

                for temp_dir in temp_dirs:
                    if temp_dir and os.path.exists(temp_dir):
                        for item in os.listdir(temp_dir):
                            try:
                                item_path = os.path.join(temp_dir, item)
                                if os.path.isfile(item_path):
                                    os.remove(item_path)
                                elif os.path.isdir(item_path):
                                    shutil.rmtree(item_path)
                            except Exception:
                                continue
                return True

            elif error["category"] == "health":
                # Run chkdsk to fix disk errors
                drive = error["description"].split("on ")[1]
                subprocess.run(["chkdsk", drive, "/f", "/r"], check=True)
                return True

        except Exception as e:
            self.logger.error(f"Error fixing disk error: {e}")
            return False

    def _fix_memory_error(self, error: Dict) -> bool:
        """Fix memory-related errors."""
        try:
            if error["category"] in ["usage", "page_file"]:
                # Clear memory cache
                ctypes.windll.psapi.EmptyWorkingSet(ctypes.c_int(-1))

                # Increase page file size
                if error["category"] == "page_file":
                    subprocess.run(
                        [
                            "wmic",
                            "computersystem",
                            "set",
                            "AutomaticManagedPagefile=False",
                        ],
                        check=True,
                    )
                    subprocess.run(
                        [
                            "wmic",
                            "pagefileset",
                            "create",
                            "name=C:\\pagefile.sys,initialsize=2048,maximumsize=4096",
                        ],
                        check=True,
                    )
                return True

        except Exception as e:
            self.logger.error(f"Error fixing memory error: {e}")
            return False

    def _fix_registry_error(self, error: Dict) -> bool:
        """Fix registry-related errors."""
        try:
            if error["category"] == "permission":
                # Reset registry permissions
                key_path = error["description"].split("for ")[1].split(":")[0]
                subprocess.run(["reg", "restore", key_path, "backup.reg"], check=True)
                return True

        except Exception as e:
            self.logger.error(f"Error fixing registry error: {e}")
            return False

    def _create_backup(self) -> None:
        """Create a system backup."""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = os.path.join(self.backup_dir, f"backup_{timestamp}")

            # Create backup directory
            os.makedirs(backup_path, exist_ok=True)

            # Backup system files
            system_files = [
                "C:\\Windows\\System32\\config\\SYSTEM",
                "C:\\Windows\\System32\\config\\SOFTWARE",
                "C:\\Windows\\System32\\config\\SAM",
                "C:\\Windows\\System32\\config\\SECURITY",
            ]

            for file in system_files:
                if os.path.exists(file):
                    shutil.copy2(file, backup_path)

            # Backup registry
            subprocess.run(
                ["reg", "export", "HKLM", os.path.join(backup_path, "registry.reg")],
                check=True,
            )

            # Clean up old backups
            self._cleanup_old_backups()

            self.logger.info(f"Created backup at: {backup_path}")

        except Exception as e:
            self.logger.error(f"Error creating backup: {e}")

    def _cleanup_old_backups(self) -> None:
        """Clean up old backup files."""
        try:
            backups = sorted(
                [os.path.join(self.backup_dir, d) for d in os.listdir(self.backup_dir)],
                key=os.path.getmtime,
            )

            while len(backups) > self.max_backups:
                old_backup = backups.pop(0)
                shutil.rmtree(old_backup)
                self.logger.info(f"Removed old backup: {old_backup}")

        except Exception as e:
            self.logger.error(f"Error cleaning up old backups: {e}")

    def get_error_statistics(self) -> Dict:
        """Get error statistics."""
        return {
            "total_errors": len(self.error_history),
            "fixed_errors": len(self.fix_history),
            "error_types": self._count_error_types(),
            "recent_errors": self.error_history[-10:],
            "recent_fixes": self.fix_history[-10:],
        }

    def _count_error_types(self) -> Dict:
        """Count errors by type and category."""
        counts = {}
        for error in self.error_history:
            error_type = error["type"]
            category = error["category"]

            if error_type not in counts:
                counts[error_type] = {}
            if category not in counts[error_type]:
                counts[error_type][category] = 0

            counts[error_type][category] += 1

        return counts

    def cleanup(self) -> None:
        """Cleanup resources."""
        self.save_config()
        self.logger.info("Error Fixer cleanup completed")
