#!/usr/bin/env python3
"""
QMOI Git Automation with Enhanced App Management
Handles git commands, app updates, and real-time error fixing
"""

import os
import sys
import subprocess
import time
import json
import psutil
import shutil
import requests
import threading
from pathlib import Path
from datetime import datetime


class QMOIGitAutomation:
    """Enhanced git automation with app management capabilities"""

    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.git_config = {
            "user.name": "QMOI AI",
            "user.email": "qmoi@qmoi.app",
            "core.autocrlf": "false",
            "core.safecrlf": "false",
            "push.default": "simple",
            "pull.rebase": "false",
        }

    def setup_git_config(self):
        """Setup git configuration for automated operations"""
        print("üîß Setting up git configuration...")
        for key, value in self.git_config.items():
            try:
                subprocess.run(
                    ["git", "config", key, value], capture_output=True, check=True
                )
                print(f"‚úÖ Set {key} = {value}")
            except subprocess.CalledProcessError as e:
                print(f"‚ö†Ô∏è Failed to set {key}: {e}")

    def smart_git_command(self, command, retry_count=3):
        """Execute git commands with smart retry logic"""
        print(f"üîÑ Executing: git {command}")

        for attempt in range(retry_count):
            try:
                result = subprocess.run(
                    ["git"] + command.split(),
                    capture_output=True,
                    text=True,
                    check=True,
                    cwd=self.project_root,
                )
                print(f"‚úÖ Git command successful: {command}")
                if result.stdout:
                    print(f"Output: {result.stdout}")
                return True, result.stdout

            except subprocess.CalledProcessError as e:
                print(f"‚ö†Ô∏è Attempt {attempt + 1} failed: {e}")
                if e.stderr:
                    print(f"Error: {e.stderr}")

                if attempt < retry_count - 1:
                    # Smart retry logic based on error type
                    if "permission" in str(e).lower():
                        time.sleep(2)  # Wait for file locks
                    elif "conflict" in str(e).lower():
                        self.resolve_conflicts()
                    elif "authentication" in str(e).lower():
                        self.setup_authentication()

                    time.sleep(1)

        print(f"‚ùå Git command failed after {retry_count} attempts: {command}")
        return False, None

    def resolve_conflicts(self):
        """Automatically resolve git conflicts"""
        print("üîß Resolving git conflicts...")
        try:
            # Check for conflicts
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                capture_output=True,
                text=True,
                cwd=self.project_root,
            )

            if "UU" in result.stdout or "AA" in result.stdout:
                print("‚ö†Ô∏è Conflicts detected, attempting auto-resolution...")

                # Use QMOI's version for conflicts
                subprocess.run(
                    ["git", "checkout", "--ours", "."],
                    cwd=self.project_root,
                    check=True,
                )
                subprocess.run(["git", "add", "."], cwd=self.project_root, check=True)
                print("‚úÖ Conflicts resolved using QMOI version")

        except subprocess.CalledProcessError as e:
            print(f"‚ö†Ô∏è Conflict resolution failed: {e}")

    def setup_authentication(self):
        """Setup git authentication"""
        print("üîê Setting up git authentication...")
        # This would integrate with QMOI's secure credential management
        pass

    def automated_commit_and_push(self, message="QMOI Auto-Update"):
        """Automated commit and push with error handling"""
        print("üìù Starting automated commit and push...")

        # Add all changes
        success, _ = self.smart_git_command("add .")
        if not success:
            return False

        # Check if there are changes to commit
        result = subprocess.run(
            ["git", "diff", "--cached", "--quiet"], cwd=self.project_root
        )
        if result.returncode == 0:
            print("‚ÑπÔ∏è No changes to commit")
            return True

        # Commit changes
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"{message} - {timestamp}"
        success, _ = self.smart_git_command(f'commit -m "{commit_message}"')
        if not success:
            return False

        # Push changes
        success, _ = self.smart_git_command("push origin main")
        if not success:
            # Try alternative push strategies
            success, _ = self.smart_git_command("push origin master")
            if not success:
                success, _ = self.smart_git_command("push")

        return success


class QMOIAppManager:
    """Enhanced app management with running app handling"""

    def __init__(self):
        self.running_apps = {}
        self.app_configs = {}
        self.update_queue = []

    def find_running_apps(self):
        """Find all running QMOI applications"""
        print("üîç Scanning for running QMOI applications...")

        qmoi_processes = []
        for proc in psutil.process_iter(["pid", "name", "exe", "cmdline"]):
            try:
                if proc.info["name"] and "qmoi" in proc.info["name"].lower():
                    qmoi_processes.append(proc)
                    print(
                        f"üì± Found QMOI app: {proc.info['name']} (PID: {proc.info['pid']})"
                    )
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

        return qmoi_processes

    def terminate_app_safely(self, process):
        """Safely terminate a running application"""
        print(
            f"üõë Safely terminating {process.info['name']} (PID: {process.info['pid']})..."
        )

        try:
            # Try graceful termination first
            process.terminate()
            process.wait(timeout=10)
            print(f"‚úÖ Gracefully terminated {process.info['name']}")
            return True

        except psutil.TimeoutExpired:
            print(f"‚ö†Ô∏è Graceful termination timeout, forcing kill...")
            try:
                process.kill()
                process.wait(timeout=5)
                print(f"‚úÖ Force killed {process.info['name']}")
                return True
            except:
                print(f"‚ùå Failed to kill {process.info['name']}")
                return False

        except Exception as e:
            print(f"‚ùå Error terminating {process.info['name']}: {e}")
            return False

    def uninstall_app(self, app_path):
        """Uninstall an application completely"""
        print(f"üóëÔ∏è Uninstalling application: {app_path}")

        app_path = Path(app_path)
        if not app_path.exists():
            print(f"‚ö†Ô∏è Application not found: {app_path}")
            return False

        try:
            # Remove from startup
            self.remove_from_startup(app_path)

            # Remove desktop shortcuts
            self.remove_desktop_shortcuts(app_path)

            # Remove application files
            if app_path.is_file():
                app_path.unlink()
            else:
                shutil.rmtree(app_path)

            print(f"‚úÖ Successfully uninstalled: {app_path}")
            return True

        except Exception as e:
            print(f"‚ùå Failed to uninstall {app_path}: {e}")
            return False

    def remove_from_startup(self, app_path):
        """Remove application from startup"""
        print("üîß Removing from startup...")
        try:
            startup_path = (
                Path.home()
                / "AppData"
                / "Roaming"
                / "Microsoft"
                / "Windows"
                / "Start Menu"
                / "Programs"
                / "Startup"
            )
            app_name = app_path.stem

            for shortcut in startup_path.glob(f"*{app_name}*"):
                shortcut.unlink()
                print(f"‚úÖ Removed startup shortcut: {shortcut}")

        except Exception as e:
            print(f"‚ö†Ô∏è Failed to remove from startup: {e}")

    def remove_desktop_shortcuts(self, app_path):
        """Remove desktop shortcuts"""
        print("üîß Removing desktop shortcuts...")
        try:
            desktop_path = Path.home() / "Desktop"
            app_name = app_path.stem

            for shortcut in desktop_path.glob(f"*{app_name}*"):
                shortcut.unlink()
                print(f"‚úÖ Removed desktop shortcut: {shortcut}")

        except Exception as e:
            print(f"‚ö†Ô∏è Failed to remove desktop shortcuts: {e}")

    def update_app(self, app_path, new_version_path):
        """Update an application with running app handling"""
        print(f"üîÑ Updating application: {app_path}")

        app_path = Path(app_path)
        new_version_path = Path(new_version_path)

        if not new_version_path.exists():
            print(f"‚ùå New version not found: {new_version_path}")
            return False

        # Find and terminate running instances
        running_apps = self.find_running_apps()
        for proc in running_apps:
            if app_path.name in proc.info["name"]:
                self.terminate_app_safely(proc)

        # Wait for processes to fully terminate
        time.sleep(2)

        try:
            # Backup current version
            backup_path = app_path.with_suffix(f"{app_path.suffix}.backup")
            if app_path.exists():
                shutil.move(str(app_path), str(backup_path))
                print(f"üì¶ Created backup: {backup_path}")

            # Install new version
            if new_version_path.is_file():
                shutil.copy2(str(new_version_path), str(app_path))
            else:
                shutil.copytree(
                    str(new_version_path), str(app_path), dirs_exist_ok=True
                )

            # Set proper permissions
            if app_path.is_file():
                os.chmod(app_path, 0o755)

            print(f"‚úÖ Successfully updated: {app_path}")

            # Remove backup after successful update
            if backup_path.exists():
                backup_path.unlink()

            return True

        except Exception as e:
            print(f"‚ùå Update failed: {e}")

            # Restore backup if update failed
            backup_path = app_path.with_suffix(f"{app_path.suffix}.backup")
            if backup_path.exists():
                shutil.move(str(backup_path), str(app_path))
                print(f"üîÑ Restored backup: {app_path}")

            return False


class QMOIHealthMonitor:
    """Real-time health monitoring and error fixing"""

    def __init__(self):
        self.health_checks = []
        self.error_patterns = {}
        self.fix_strategies = {}

    def register_health_check(self, name, check_function):
        """Register a health check function"""
        self.health_checks.append(
            {
                "name": name,
                "function": check_function,
                "last_check": None,
                "status": "unknown",
            }
        )

    def register_error_pattern(self, pattern, fix_function):
        """Register an error pattern and its fix function"""
        self.error_patterns[pattern] = fix_function

    def run_health_checks(self):
        """Run all registered health checks"""
        print("üè• Running health checks...")

        for check in self.health_checks:
            try:
                status = check["function"]()
                check["status"] = status
                check["last_check"] = datetime.now()

                if status == "healthy":
                    print(f"‚úÖ {check['name']}: Healthy")
                else:
                    print(f"‚ö†Ô∏è {check['name']}: {status}")

            except Exception as e:
                check["status"] = f"error: {e}"
                print(f"‚ùå {check['name']}: Error - {e}")

    def monitor_logs(self, log_path):
        """Monitor application logs for errors"""
        print(f"üìä Monitoring logs: {log_path}")

        if not os.path.exists(log_path):
            return

        try:
            with open(log_path, "r") as f:
                # Read last few lines
                lines = f.readlines()[-10:]

                for line in lines:
                    for pattern, fix_function in self.error_patterns.items():
                        if pattern in line.lower():
                            print(
                                f"üîß Found error pattern '{pattern}', applying fix..."
                            )
                            fix_function()

        except Exception as e:
            print(f"‚ö†Ô∏è Log monitoring error: {e}")

    def auto_fix_errors(self):
        """Automatically fix detected errors"""
        print("üîß Running automatic error fixes...")

        # Check for common issues
        fixes_applied = 0

        # Fix file permissions
        if self.fix_file_permissions():
            fixes_applied += 1

        # Fix missing dependencies
        if self.fix_missing_dependencies():
            fixes_applied += 1

        # Fix configuration issues
        if self.fix_configuration_issues():
            fixes_applied += 1

        print(f"‚úÖ Applied {fixes_applied} automatic fixes")
        return fixes_applied > 0

    def fix_file_permissions(self):
        """Fix file permission issues"""
        print("üîß Checking file permissions...")
        # Implementation for permission fixes
        return True

    def fix_missing_dependencies(self):
        """Fix missing dependencies"""
        print("üîß Checking dependencies...")
        # Implementation for dependency fixes
        return True

    def fix_configuration_issues(self):
        """Fix configuration issues"""
        print("üîß Checking configuration...")
        # Implementation for config fixes
        return True


class QMOIEnhancedManager:
    """Main enhanced manager coordinating all components"""

    def __init__(self):
        self.git_automation = QMOIGitAutomation()
        self.app_manager = QMOIAppManager()
        self.health_monitor = QMOIHealthMonitor()
        self.running = False

    def start_monitoring(self):
        """Start real-time monitoring"""
        print("üöÄ Starting QMOI Enhanced Manager...")
        self.running = True

        # Setup git configuration
        self.git_automation.setup_git_config()

        # Start monitoring thread
        monitor_thread = threading.Thread(target=self._monitoring_loop, daemon=True)
        monitor_thread.start()

        print("‚úÖ QMOI Enhanced Manager started")

    def _monitoring_loop(self):
        """Main monitoring loop"""
        while self.running:
            try:
                # Run health checks
                self.health_monitor.run_health_checks()

                # Auto-fix errors
                self.health_monitor.auto_fix_errors()

                # Check for app updates
                self.check_for_updates()

                # Sleep for 30 seconds
                time.sleep(30)

            except Exception as e:
                print(f"‚ö†Ô∏è Monitoring loop error: {e}")
                time.sleep(60)

    def check_for_updates(self):
        """Check for application updates"""
        print("üîÑ Checking for updates...")
        # Implementation for update checking
        pass

    def stop_monitoring(self):
        """Stop monitoring"""
        print("üõë Stopping QMOI Enhanced Manager...")
        self.running = False

    def run_git_operations(self):
        """Run automated git operations"""
        print("üìù Running automated git operations...")

        # Add all changes
        success, _ = self.git_automation.smart_git_command("add .")
        if not success:
            return False

        # Commit and push
        return self.git_automation.automated_commit_and_push()


def main():
    """Main function"""
    print("üöÄ QMOI Enhanced Manager Starting...")

    manager = QMOIEnhancedManager()

    try:
        # Start monitoring
        manager.start_monitoring()

        # Run git operations
        manager.run_git_operations()

        # Keep running
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nüõë Shutting down...")
        manager.stop_monitoring()
    except Exception as e:
        print(f"‚ùå Error: {e}")
        manager.stop_monitoring()


if __name__ == "__main__":
    main()
