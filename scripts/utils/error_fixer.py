import os
import json
import logging
import subprocess
import re
from typing import Dict, List, Optional, Tuple
import sys
import traceback
from datetime import datetime


class ErrorFixer:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.errors = []
        self.fixes = []
        self.error_log_path = "logs/errors.log"
        self.error_readme_path = "ERRORSREADME.md"

        # Create logs directory if it doesn't exist
        os.makedirs("logs", exist_ok=True)

        # Setup logging
        self.setup_logging()

    def setup_logging(self):
        """Setup logging configuration."""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(self.error_log_path),
                logging.StreamHandler(sys.stdout),
            ],
        )

    def scan_for_errors(self):
        """Scan the codebase for errors."""
        self.logger.info("Starting error scan...")

        # Check Python files
        self.scan_python_files()

        # Check configuration files
        self.scan_config_files()

        # Check network connectivity
        self.check_network_connectivity()

        # Check system resources
        self.check_system_resources()

        # Check file permissions
        self.check_file_permissions()

        self.logger.info(f"Found {len(self.errors)} errors")
        return self.errors

    def scan_python_files(self):
        """Scan Python files for errors."""
        for root, _, files in os.walk("."):
            for file in files:
                if file.endswith(".py"):
                    file_path = os.path.join(root, file)
                    try:
                        # Check syntax
                        with open(file_path, "r") as f:
                            compile(f.read(), file_path, "exec")

                        # Run pylint
                        result = subprocess.run(
                            ["pylint", file_path], capture_output=True, text=True
                        )

                        if result.returncode != 0:
                            self.errors.append(
                                {
                                    "type": "pylint",
                                    "file": file_path,
                                    "message": result.stdout,
                                    "severity": "warning",
                                }
                            )

                    except SyntaxError as e:
                        self.errors.append(
                            {
                                "type": "syntax",
                                "file": file_path,
                                "message": str(e),
                                "severity": "error",
                            }
                        )

    def scan_config_files(self):
        """Scan configuration files for errors."""
        config_files = ["config/qcity_config.json", "config/saved_networks.json"]

        for config_file in config_files:
            if os.path.exists(config_file):
                try:
                    with open(config_file, "r") as f:
                        json.load(f)
                except json.JSONDecodeError as e:
                    self.errors.append(
                        {
                            "type": "config",
                            "file": config_file,
                            "message": f"Invalid JSON: {str(e)}",
                            "severity": "error",
                        }
                    )

    def check_network_connectivity(self):
        """Check network connectivity."""
        try:
            # Check internet connection
            subprocess.run(
                ["ping", "8.8.8.8", "-n", "1"], check=True, capture_output=True
            )
        except subprocess.CalledProcessError:
            self.errors.append(
                {
                    "type": "network",
                    "message": "No internet connection",
                    "severity": "error",
                }
            )

        # Check WiFi connectivity
        try:
            result = subprocess.run(
                ["netsh", "wlan", "show", "interfaces"],
                capture_output=True,
                text=True,
                check=True,
            )

            if "State" in result.stdout and "disconnected" in result.stdout.lower():
                self.errors.append(
                    {
                        "type": "network",
                        "message": "WiFi is disconnected",
                        "severity": "warning",
                    }
                )

        except subprocess.CalledProcessError:
            self.errors.append(
                {
                    "type": "network",
                    "message": "Error checking WiFi status",
                    "severity": "error",
                }
            )

    def check_system_resources(self):
        """Check system resources."""
        import psutil

        # Check CPU usage
        cpu_percent = psutil.cpu_percent()
        if cpu_percent > 90:
            self.errors.append(
                {
                    "type": "system",
                    "message": f"High CPU usage: {cpu_percent}%",
                    "severity": "warning",
                }
            )

        # Check memory usage
        memory = psutil.virtual_memory()
        if memory.percent > 90:
            self.errors.append(
                {
                    "type": "system",
                    "message": f"High memory usage: {memory.percent}%",
                    "severity": "warning",
                }
            )

        # Check disk usage
        disk = psutil.disk_usage("/")
        if disk.percent > 90:
            self.errors.append(
                {
                    "type": "system",
                    "message": f"High disk usage: {disk.percent}%",
                    "severity": "warning",
                }
            )

    def check_file_permissions(self):
        """Check file permissions."""
        required_files = [
            "config/qcity_config.json",
            "config/saved_networks.json",
            "logs/errors.log",
        ]

        for file_path in required_files:
            if os.path.exists(file_path):
                if not os.access(file_path, os.R_OK | os.W_OK):
                    self.errors.append(
                        {
                            "type": "permission",
                            "file": file_path,
                            "message": "Insufficient file permissions",
                            "severity": "error",
                        }
                    )

    def fix_errors(self):
        """Attempt to fix detected errors."""
        self.logger.info("Starting error fixes...")

        for error in self.errors:
            try:
                if error["type"] == "syntax":
                    self.fix_syntax_error(error)
                elif error["type"] == "config":
                    self.fix_config_error(error)
                elif error["type"] == "network":
                    self.fix_network_error(error)
                elif error["type"] == "permission":
                    self.fix_permission_error(error)

                self.fixes.append(
                    {
                        "error": error,
                        "status": "fixed",
                        "timestamp": datetime.now().isoformat(),
                    }
                )

            except Exception as e:
                self.logger.error(f"Failed to fix error: {e}")
                self.fixes.append(
                    {
                        "error": error,
                        "status": "failed",
                        "message": str(e),
                        "timestamp": datetime.now().isoformat(),
                    }
                )

    def fix_syntax_error(self, error: Dict):
        """Fix syntax errors in Python files."""
        file_path = error["file"]

        # Backup the file
        backup_path = f"{file_path}.bak"
        with open(file_path, "r") as src, open(backup_path, "w") as dst:
            dst.write(src.read())

        try:
            # Try to fix common syntax errors
            with open(file_path, "r") as f:
                content = f.read()

            # Fix missing colons
            content = re.sub(r"(\w+)\s*=\s*[^:]+$", r"\1 = value:", content)

            # Fix missing parentheses
            content = re.sub(r"print\s+[^(].*$", r"print()", content)

            # Write fixed content
            with open(file_path, "w") as f:
                f.write(content)

            # Verify fix
            with open(file_path, "r") as f:
                compile(f.read(), file_path, "exec")

            # Remove backup if fix successful
            os.remove(backup_path)

        except Exception as e:
            # Restore from backup if fix failed
            with open(backup_path, "r") as src, open(file_path, "w") as dst:
                dst.write(src.read())
            os.remove(backup_path)
            raise e

    def fix_config_error(self, error: Dict):
        """Fix configuration file errors."""
        file_path = error["file"]

        # Backup the file
        backup_path = f"{file_path}.bak"
        with open(file_path, "r") as src, open(backup_path, "w") as dst:
            dst.write(src.read())

        try:
            # Try to fix JSON syntax
            with open(file_path, "r") as f:
                content = f.read()

            # Fix common JSON issues
            content = re.sub(r",\s*}", "}", content)  # Remove trailing commas
            content = re.sub(r",\s*]", "]", content)  # Remove trailing commas in arrays
            content = re.sub(
                r"'", '"', content
            )  # Replace single quotes with double quotes

            # Write fixed content
            with open(file_path, "w") as f:
                f.write(content)

            # Verify fix
            with open(file_path, "r") as f:
                json.load(f)

            # Remove backup if fix successful
            os.remove(backup_path)

        except Exception as e:
            # Restore from backup if fix failed
            with open(backup_path, "r") as src, open(file_path, "w") as dst:
                dst.write(src.read())
            os.remove(backup_path)
            raise e

    def fix_network_error(self, error: Dict):
        """Fix network connectivity issues."""
        if "No internet connection" in error["message"]:
            # Try to reset network adapter
            subprocess.run(
                ["netsh", "interface", "set", "interface", "Wi-Fi", "disable"],
                check=True,
            )
            subprocess.run(
                ["netsh", "interface", "set", "interface", "Wi-Fi", "enable"],
                check=True,
            )

        elif "WiFi is disconnected" in error["message"]:
            # Try to reconnect to saved networks
            from scripts.network.wifi_manager import WiFiManager

            wifi_manager = WiFiManager()
            wifi_manager._try_saved_networks()

    def fix_permission_error(self, error: Dict):
        """Fix file permission issues."""
        file_path = error["file"]

        # Try to fix permissions
        if os.name == "nt":  # Windows
            subprocess.run(["icacls", file_path, "/grant", "Everyone:F"], check=True)
        else:  # Unix-like
            os.chmod(file_path, 0o666)

    def generate_error_report(self):
        """Generate error report in markdown format."""
        report = "# Q-City Error Report\n\n"
        report += f"Generated on: {datetime.now().isoformat()}\n\n"

        # Summary
        report += "## Summary\n\n"
        report += f"- Total errors found: {len(self.errors)}\n"
        report += f"- Fixed errors: {len([f for f in self.fixes if f['status'] == 'fixed'])}\n"
        report += f"- Failed fixes: {len([f for f in self.fixes if f['status'] == 'failed'])}\n\n"

        # Error details
        report += "## Error Details\n\n"
        for error in self.errors:
            report += f"### {error['type'].title()} Error\n\n"
            report += f"- File: {error.get('file', 'N/A')}\n"
            report += f"- Message: {error['message']}\n"
            report += f"- Severity: {error['severity']}\n\n"

        # Fix results
        report += "## Fix Results\n\n"
        for fix in self.fixes:
            report += f"### {fix['error']['type'].title()} Fix\n\n"
            report += f"- Status: {fix['status']}\n"
            if fix["status"] == "failed":
                report += f"- Error: {fix['message']}\n"
            report += f"- Timestamp: {fix['timestamp']}\n\n"

        # Write report
        with open(self.error_readme_path, "w") as f:
            f.write(report)

        self.logger.info(f"Error report generated: {self.error_readme_path}")


def main():
    fixer = ErrorFixer()

    # Scan for errors
    errors = fixer.scan_for_errors()

    if errors:
        # Attempt to fix errors
        fixer.fix_errors()

        # Generate report
        fixer.generate_error_report()

        print(
            f"\nFound {len(errors)} errors. Check {fixer.error_readme_path} for details."
        )
    else:
        print("No errors found.")


if __name__ == "__main__":
    main()
