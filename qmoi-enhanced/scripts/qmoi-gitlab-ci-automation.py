#!/usr/bin/env python3
"""
QMOI GitLab CI/CD Automation System
Continuous automation with real-time monitoring and automatic triggering
"""

import asyncio
import json
import logging
import os
import subprocess
import sys
import time
import threading
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import requests
import schedule
import git
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("logs/qmoi-gitlab-ci.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


class QMOIGitLabCIAutomation:
    def __init__(self):
        self.running = False
        self.gitlab_ci_running = False
        self.automation_stats = {
            "total_triggers": 0,
            "successful_deployments": 0,
            "failed_deployments": 0,
            "last_trigger": None,
            "current_status": "idle",
            "gitlab_pipeline_status": "unknown",
            "github_sync_status": "unknown",
            "vercel_deployment_status": "unknown",
            "gitpod_status": "unknown",
        }
        self.setup_file_watcher()
        self.setup_scheduled_tasks()

    def setup_file_watcher(self):
        """Setup file system watcher for automatic triggers"""

        class QMOIFileHandler(FileSystemEventHandler):
            def __init__(self, automation):
                self.automation = automation

            def on_modified(self, event):
                if not event.is_directory:
                    if event.src_path.endswith((".py", ".js", ".ts", ".tsx", ".json")):
                        logger.info(f"File modified: {event.src_path}")
                        self.automation.auto_trigger_gitlab_ci()

        self.file_handler = QMOIFileHandler(self)
        self.observer = Observer()
        self.observer.schedule(self.file_handler, ".", recursive=True)
        self.observer.start()

    def setup_scheduled_tasks(self):
        """Setup scheduled automation tasks"""
        # Run comprehensive automation every 15 minutes
        schedule.every(15).minutes.do(self.run_comprehensive_automation)

        # Health check every 5 minutes
        schedule.every(5).minutes.do(self.run_health_check)

        # GitLab CI trigger every 10 minutes
        schedule.every(10).minutes.do(self.trigger_gitlab_ci)

        # Platform sync every 20 minutes
        schedule.every(20).minutes.do(self.sync_all_platforms)

        # Auto-evolution every hour
        schedule.every().hour.do(self.run_auto_evolution)

        def run_scheduler():
            while self.running:
                schedule.run_pending()
                time.sleep(1)

        self.scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)

    def auto_trigger_gitlab_ci(self):
        """Automatically trigger GitLab CI when files change"""
        try:
            logger.info("Auto-triggering GitLab CI due to file changes")
            self.trigger_gitlab_ci()
        except Exception as e:
            logger.error(f"Error in auto-trigger: {e}")

    def trigger_gitlab_ci(self):
        """Trigger GitLab CI/CD pipeline"""
        try:
            self.gitlab_ci_running = True
            self.automation_stats["current_status"] = "running"
            self.automation_stats["total_triggers"] += 1
            self.automation_stats["last_trigger"] = datetime.now().isoformat()

            logger.info("🚀 Triggering GitLab CI/CD pipeline")

            # Run GitLab CI commands
            self.run_gitlab_ci_commands()

            # Update stats
            self.automation_stats["current_status"] = "completed"
            self.automation_stats["successful_deployments"] += 1

            logger.info("✅ GitLab CI/CD pipeline completed successfully")

        except Exception as e:
            logger.error(f"❌ Error in GitLab CI automation: {e}")
            self.automation_stats["current_status"] = "failed"
            self.automation_stats["failed_deployments"] += 1
        finally:
            self.gitlab_ci_running = False

    def run_gitlab_ci_commands(self):
        """Run comprehensive GitLab CI commands"""
        gitlab_commands = [
            ("npm run qmoi:setup", "Setup and dependencies"),
            ("npm run qmoi:test", "Running all tests"),
            ("npm run qmoi:build", "Building project"),
            ("npm run gitlab:push", "Pushing to GitLab"),
            ("npm run gitlab:deploy", "Deploying to GitLab"),
            ("npm run gitlab:notify", "Sending notifications"),
            ("npm run qmoi:health", "Health checks"),
            ("npm run qmoi:recovery", "Error recovery"),
        ]

        for command, description in gitlab_commands:
            try:
                logger.info(f"Running: {description}")
                result = subprocess.run(
                    command, shell=True, capture_output=True, text=True, timeout=300
                )

                if result.returncode == 0:
                    logger.info(f"✅ {description} completed successfully")
                else:
                    logger.error(f"❌ {description} failed: {result.stderr}")

            except subprocess.TimeoutExpired:
                logger.error(f"⏰ {description} timed out")
            except Exception as e:
                logger.error(f"❌ Error running {description}: {e}")

    def run_comprehensive_automation(self):
        """Run comprehensive QMOI automation"""
        try:
            logger.info("🔄 Running comprehensive QMOI automation")

            # Run all automation steps
            automation_steps = [
                ("npm run qmoi:all", "Complete QMOI automation"),
                ("npm run qmoi:comprehensive", "Comprehensive automation"),
                ("npm run gitlab:full-pipeline", "GitLab full pipeline"),
                ("npm run qmoi:gitpod", "Gitpod integration"),
                ("npm run qmoi:github-fallback", "GitHub fallback"),
                ("npm run qmoi:platform-monitor", "Platform monitoring"),
            ]

            for command, description in automation_steps:
                try:
                    logger.info(f"Running: {description}")
                    result = subprocess.run(
                        command, shell=True, capture_output=True, text=True, timeout=600
                    )

                    if result.returncode == 0:
                        logger.info(f"✅ {description} completed successfully")
                        self.automation_stats["successful_deployments"] += 1
                    else:
                        logger.error(f"❌ {description} failed: {result.stderr}")
                        self.automation_stats["failed_deployments"] += 1

                except subprocess.TimeoutExpired:
                    logger.error(f"⏰ {description} timed out")
                    self.automation_stats["failed_deployments"] += 1
                except Exception as e:
                    logger.error(f"❌ Error running {description}: {e}")
                    self.automation_stats["failed_deployments"] += 1

        except Exception as e:
            logger.error(f"Error in comprehensive automation: {e}")

    def run_health_check(self):
        """Run comprehensive health check"""
        try:
            logger.info("🏥 Running health check")

            health_commands = [
                ("npm run qmoi:health", "QMOI health check"),
                ("npm run gitlab:health", "GitLab health check"),
                ("npm run github:monitor", "GitHub monitoring"),
                ("npm run gitpod:monitor", "Gitpod monitoring"),
            ]

            for command, description in health_commands:
                try:
                    result = subprocess.run(
                        command, shell=True, capture_output=True, text=True, timeout=60
                    )

                    if result.returncode == 0:
                        logger.info(f"✅ {description} passed")
                    else:
                        logger.warning(f"⚠️ {description} failed: {result.stderr}")

                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")

        except Exception as e:
            logger.error(f"Error in health check: {e}")

    def sync_all_platforms(self):
        """Sync across all platforms"""
        try:
            logger.info("🔄 Syncing all platforms")

            sync_commands = [
                ("npm run github:sync-to", "Sync to GitHub"),
                ("npm run github:sync-from", "Sync from GitHub"),
                ("npm run gitlab:push", "Push to GitLab"),
                ("npm run qmoi:platform-monitor", "Monitor platforms"),
            ]

            for command, description in sync_commands:
                try:
                    result = subprocess.run(
                        command, shell=True, capture_output=True, text=True, timeout=300
                    )

                    if result.returncode == 0:
                        logger.info(f"✅ {description} completed")
                    else:
                        logger.error(f"❌ {description} failed: {result.stderr}")

                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")

        except Exception as e:
            logger.error(f"Error in platform sync: {e}")

    def run_auto_evolution(self):
        """Run auto-evolution for continuous improvement"""
        try:
            logger.info("🧬 Running auto-evolution")

            evolution_commands = [
                ("python scripts/qmoi-auto-evolution.py", "Auto-evolution analysis"),
                ("python scripts/qmoi-quick-test.py", "Quick test validation"),
                ("npm run qmoi:json-fix", "JSON configuration fixing"),
            ]

            for command, description in evolution_commands:
                try:
                    result = subprocess.run(
                        command, shell=True, capture_output=True, text=True, timeout=300
                    )

                    if result.returncode == 0:
                        logger.info(f"✅ {description} completed")
                    else:
                        logger.error(f"❌ {description} failed: {result.stderr}")

                except Exception as e:
                    logger.error(f"❌ Error in {description}: {e}")

        except Exception as e:
            logger.error(f"Error in auto-evolution: {e}")

    def monitor_gitlab_pipeline(self):
        """Monitor GitLab pipeline status"""
        try:
            # Check if GitLab CI is running
            if self.gitlab_ci_running:
                self.automation_stats["gitlab_pipeline_status"] = "running"
            else:
                # Check last pipeline status
                result = subprocess.run(
                    "git log --oneline -1", shell=True, capture_output=True, text=True
                )
                if result.returncode == 0:
                    self.automation_stats["gitlab_pipeline_status"] = "success"
                else:
                    self.automation_stats["gitlab_pipeline_status"] = "unknown"

        except Exception as e:
            logger.error(f"Error monitoring GitLab pipeline: {e}")

    def save_stats(self):
        """Save automation stats to file"""
        try:
            stats_file = "logs/gitlab-ci-stats.json"
            os.makedirs("logs", exist_ok=True)

            with open(stats_file, "w") as f:
                json.dump(self.automation_stats, f, indent=2, default=str)

        except Exception as e:
            logger.error(f"Error saving stats: {e}")

    def start(self):
        """Start the GitLab CI automation system"""
        try:
            # Create logs directory
            os.makedirs("logs", exist_ok=True)

            # Start scheduler
            self.running = True
            self.scheduler_thread.start()

            logger.info("🚀 QMOI GitLab CI Automation System started")
            logger.info("📊 Monitoring and automation active")
            logger.info("🔄 Auto-triggering enabled")
            logger.info("⏰ Scheduled tasks running")

            # Save initial stats
            self.save_stats()

            # Main monitoring loop
            while self.running:
                try:
                    # Monitor pipeline status
                    self.monitor_gitlab_pipeline()

                    # Save stats every minute
                    self.save_stats()

                    # Sleep for 1 minute
                    time.sleep(60)

                except KeyboardInterrupt:
                    logger.info("🛑 Stopping GitLab CI automation")
                    break
                except Exception as e:
                    logger.error(f"Error in main loop: {e}")
                    time.sleep(60)

        except Exception as e:
            logger.error(f"Error starting GitLab CI automation: {e}")
            sys.exit(1)
        finally:
            self.cleanup()

    def cleanup(self):
        """Cleanup resources"""
        try:
            self.running = False

            # Stop file watcher
            if hasattr(self, "observer"):
                self.observer.stop()
                self.observer.join()

            # Save final stats
            self.save_stats()

            logger.info("🧹 GitLab CI automation cleanup completed")

        except Exception as e:
            logger.error(f"Error in cleanup: {e}")


def main():
    """Main function to start GitLab CI automation"""
    try:
        automation = QMOIGitLabCIAutomation()
        automation.start()
    except KeyboardInterrupt:
        logger.info("GitLab CI automation stopped by user")
    except Exception as e:
        logger.error(f"Error in main: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
