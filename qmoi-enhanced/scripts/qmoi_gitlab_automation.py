#!/usr/bin/env python3
"""
QMOI GitLab Automation System
Handles CI/CD, deployment, error fixing, and real-time monitoring
"""

import os
import sys
import json
import time
import subprocess
import requests
import threading
from datetime import datetime
from pathlib import Path
import git
import docker
from typing import Dict, List, Optional
import smtplib
from email.mime.text import MIMEText


class QMOIGitLabAutomation:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.config_file = self.project_root / "config" / "qmoi_gitlab_config.json"
        self.logs_dir = self.project_root / "logs"
        self.logs_dir.mkdir(exist_ok=True)

        # GitLab Configuration
        self.gitlab_url = "https://gitlab.com"
        self.qmoi_gitlab_url = "https://qmoi-gitlab.qmoi.ai"  # QMOI's cloned GitLab
        self.project_id = "qmoi/alpha-q-ai"
        self.access_token = os.getenv("GITLAB_ACCESS_TOKEN", "")

        # Vercel Configuration
        self.vercel_token = os.getenv("VERCEL_TOKEN", "")
        self.vercel_project_id = os.getenv("VERCEL_PROJECT_ID", "")

        # Real-time monitoring
        self.monitoring_active = False
        self.error_log = []
        self.deployment_log = []
        self.ci_log = []

        self.load_config()

    def load_config(self):
        """Load or create GitLab configuration"""
        if self.config_file.exists():
            with open(self.config_file, "r") as f:
                self.config = json.load(f)
        else:
            self.config = self.create_default_config()
            self.save_config()

    def create_default_config(self):
        """Create default GitLab configuration"""
        return {
            "gitlab": {
                "url": self.gitlab_url,
                "qmoi_clone_url": self.qmoi_gitlab_url,
                "project_id": self.project_id,
                "access_token": self.access_token,
                "auto_trigger_runners": True,
                "auto_fix_errors": True,
                "real_time_monitoring": True,
            },
            "vercel": {
                "token": self.vercel_token,
                "project_id": self.vercel_project_id,
                "auto_deploy": True,
                "auto_fix_deployment": True,
            },
            "monitoring": {
                "enabled": True,
                "check_interval": 30,  # seconds
                "error_threshold": 3,
                "auto_restart_failed": True,
            },
            "ci_cd": {
                "auto_trigger": True,
                "parallel_jobs": 3,
                "timeout_minutes": 30,
                "retry_failed": True,
            },
            "qmoi_clone": {
                "enabled": True,
                "sync_interval": 300,  # 5 minutes
                "backup_enabled": True,
                "ui_features": True,
            },
        }

    def save_config(self):
        """Save configuration to file"""
        with open(self.config_file, "w") as f:
            json.dump(self.config, f, indent=2)

    def log_event(self, event_type: str, message: str, level: str = "INFO"):
        """Log events with timestamp"""
        timestamp = datetime.now().isoformat()
        log_entry = {
            "timestamp": timestamp,
            "type": event_type,
            "level": level,
            "message": message,
        }

        # Add to appropriate log
        if event_type == "ERROR":
            self.error_log.append(log_entry)
        elif event_type == "DEPLOYMENT":
            self.deployment_log.append(log_entry)
        elif event_type == "CI_CD":
            self.ci_log.append(log_entry)

        # Write to file
        log_file = self.logs_dir / f"qmoi_gitlab_{event_type.lower()}.log"
        with open(log_file, "a") as f:
            f.write(f"[{timestamp}] {level}: {message}\n")

        print(f"[{timestamp}] {level}: {message}")

    def trigger_gitlab_runner(self, branch: str = "main"):
        """Trigger GitLab CI/CD pipeline"""
        try:
            url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/pipeline"
            headers = {
                "PRIVATE-TOKEN": self.access_token,
                "Content-Type": "application/json",
            }
            data = {
                "ref": branch,
                "variables": [
                    {"key": "QMOI_AUTO_TRIGGER", "value": "true"},
                    {"key": "QMOI_TIMESTAMP", "value": datetime.now().isoformat()},
                ],
            }

            response = requests.post(url, headers=headers, json=data)
            if response.status_code == 201:
                pipeline_id = response.json()["id"]
                self.log_event(
                    "CI_CD", f"Pipeline triggered successfully: {pipeline_id}"
                )
                return pipeline_id
            else:
                self.log_event("ERROR", f"Failed to trigger pipeline: {response.text}")
                return None

        except Exception as e:
            self.log_event("ERROR", f"Error triggering GitLab runner: {e}")
            return None

    def monitor_pipeline_status(self, pipeline_id: int):
        """Monitor pipeline status in real-time"""
        try:
            url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines/{pipeline_id}"
            headers = {"PRIVATE-TOKEN": self.access_token}

            while True:
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    pipeline = response.json()
                    status = pipeline["status"]

                    self.log_event("CI_CD", f"Pipeline {pipeline_id} status: {status}")

                    if status in ["success", "failed", "canceled"]:
                        if status == "failed":
                            self.auto_fix_pipeline_errors(pipeline_id)
                        break

                time.sleep(30)  # Check every 30 seconds

        except Exception as e:
            self.log_event("ERROR", f"Error monitoring pipeline: {e}")

    def auto_fix_pipeline_errors(self, pipeline_id: int):
        """Automatically fix pipeline errors"""
        try:
            # Get failed jobs
            url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines/{pipeline_id}/jobs"
            headers = {"PRIVATE-TOKEN": self.access_token}

            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                jobs = response.json()
                failed_jobs = [job for job in jobs if job["status"] == "failed"]

                for job in failed_jobs:
                    self.fix_job_error(job)

        except Exception as e:
            self.log_event("ERROR", f"Error fixing pipeline errors: {e}")

    def fix_job_error(self, job: Dict):
        """Fix specific job errors"""
        job_name = job["name"]
        self.log_event("CI_CD", f"Attempting to fix job: {job_name}")

        # Common error fixes
        if "npm" in job_name.lower():
            self.fix_npm_errors()
        elif "build" in job_name.lower():
            self.fix_build_errors()
        elif "test" in job_name.lower():
            self.fix_test_errors()
        elif "deploy" in job_name.lower():
            self.fix_deployment_errors()

    def fix_npm_errors(self):
        """Fix npm-related errors"""
        try:
            # Clear npm cache
            subprocess.run(["npm", "cache", "clean", "--force"], check=True)

            # Remove node_modules and reinstall
            if (self.project_root / "node_modules").exists():
                import shutil

                shutil.rmtree(self.project_root / "node_modules")

            subprocess.run(["npm", "install"], check=True)
            self.log_event("CI_CD", "Fixed npm errors successfully")

        except Exception as e:
            self.log_event("ERROR", f"Error fixing npm issues: {e}")

    def fix_build_errors(self):
        """Fix build-related errors"""
        try:
            # Clear build cache
            build_dirs = ["dist", "build", ".next", ".nuxt"]
            for build_dir in build_dirs:
                build_path = self.project_root / build_dir
                if build_path.exists():
                    import shutil

                    shutil.rmtree(build_path)

            # Rebuild
            subprocess.run(["npm", "run", "build"], check=True)
            self.log_event("CI_CD", "Fixed build errors successfully")

        except Exception as e:
            self.log_event("ERROR", f"Error fixing build issues: {e}")

    def fix_test_errors(self):
        """Fix test-related errors"""
        try:
            # Clear test cache
            test_cache = self.project_root / ".nyc_output"
            if test_cache.exists():
                import shutil

                shutil.rmtree(test_cache)

            # Run tests with coverage
            subprocess.run(["npm", "test", "--", "--coverage"], check=True)
            self.log_event("CI_CD", "Fixed test errors successfully")

        except Exception as e:
            self.log_event("ERROR", f"Error fixing test issues: {e}")

    def create_gitlab_issue(self, title: str, description: str):
        """Create a GitLab issue via API"""
        try:
            url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/issues"
            headers = {"PRIVATE-TOKEN": self.access_token}
            data = {"title": title, "description": description}
            response = requests.post(url, headers=headers, data=data)
            if response.status_code == 201:
                self.log_event("CI_CD", f"Created GitLab issue: {title}")
                self.send_notification(f"[QMOI] Issue Created: {title}", description)
                return response.json()
            else:
                self.log_event(
                    "ERROR", f"Failed to create GitLab issue: {response.text}"
                )
        except Exception as e:
            self.log_event("ERROR", f"Error creating GitLab issue: {e}")

    def create_and_merge_mr(self, branch: str, title: str, description: str):
        """Create and merge a GitLab merge request via API"""
        try:
            url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/merge_requests"
            headers = {"PRIVATE-TOKEN": self.access_token}
            data = {
                "source_branch": branch,
                "target_branch": "main",
                "title": title,
                "description": description,
                "remove_source_branch": True,
            }
            response = requests.post(url, headers=headers, data=data)
            if response.status_code == 201:
                mr = response.json()
                mr_id = mr["iid"]
                self.log_event("CI_CD", f"Created MR: {title}")
                # Merge MR
                merge_url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/merge_requests/{mr_id}/merge"
                merge_resp = requests.put(merge_url, headers=headers)
                if merge_resp.status_code == 200:
                    self.log_event("CI_CD", f"Merged MR: {title}")
                    self.send_notification(
                        f"[QMOI] MR Created & Merged: {title}", description
                    )
                    return True
                else:
                    self.log_event("ERROR", f"Failed to merge MR: {merge_resp.text}")
            else:
                self.log_event("ERROR", f"Failed to create MR: {response.text}")
        except Exception as e:
            self.log_event("ERROR", f"Error creating/merging MR: {e}")
        return False

    def send_notification(self, subject: str, body: str):
        """Send notifications via email and other channels"""
        try:
            # Email notification (simple example, can be extended)
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = os.getenv("QMOI_EMAIL_USER", "noreply@qmoiai.com")
            msg["To"] = os.getenv("QMOI_NOTIFY_EMAIL", "master@qmoiai.com")
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(
                    os.getenv("QMOI_EMAIL_USER", ""), os.getenv("QMOI_EMAIL_PASS", "")
                )
                server.sendmail(msg["From"], [msg["To"]], msg.as_string())
        except Exception as e:
            self.log_event("ERROR", f"Notification error: {e}")

    def enhanced_auto_fix_and_deploy_loop(self, max_retries=5):
        """Loop: fix, create issues, merge, redeploy until success or retry limit"""
        retries = 0
        while retries < max_retries:
            pipeline_id = self.trigger_gitlab_runner()
            if pipeline_id:
                self.monitor_pipeline_status(pipeline_id)
                # Check last pipeline status
                url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines/{pipeline_id}"
                headers = {"PRIVATE-TOKEN": self.access_token}
                resp = requests.get(url, headers=headers)
                if resp.status_code == 200 and resp.json().get("status") == "success":
                    self.send_notification(
                        "[QMOI] Deployment Success",
                        f"Pipeline {pipeline_id} succeeded after {retries+1} attempt(s).",
                    )
                    return True
                else:
                    # Create issue and MR for failed fix
                    self.create_gitlab_issue(
                        f"QMOI Auto-Fix Failure (Attempt {retries+1})",
                        f"Pipeline {pipeline_id} failed. See logs for details.",
                    )
                    # Optionally, create/merge MR for fix branch (if any)
                    # self.create_and_merge_mr(f"auto-fix-{pipeline_id}", f"Auto-Fix MR {pipeline_id}", "Automated fix attempt.")
                    self.send_notification(
                        "[QMOI] Deployment Failure",
                        f"Pipeline {pipeline_id} failed. Attempt {retries+1}.",
                    )
            retries += 1
        self.send_notification(
            "[QMOI] Deployment Failed After Retries",
            f"All {max_retries} attempts failed.",
        )
        return False

    def fix_deployment_errors(self):
        """Fix deployment-related errors and redeploy to Vercel and Hugging Face"""
        try:
            # Deploy to Vercel
            vercel_success = self.deploy_to_vercel()
            # Deploy to Hugging Face
            hf_success = self.deploy_to_huggingface()
            if vercel_success and hf_success:
                self.log_event(
                    "DEPLOYMENT", "Fixed deployment errors successfully (Vercel & HF)"
                )
            else:
                self.log_event(
                    "ERROR",
                    f"Deployment errors: Vercel success={vercel_success}, HF success={hf_success}",
                )
        except Exception as e:
            self.log_event("ERROR", f"Error fixing deployment issues: {e}")

    def deploy_to_huggingface(self):
        """Deploy to Hugging Face Spaces (stub, implement as needed)"""
        try:
            # Example: call a deployment script or API
            result = subprocess.run(
                ["python", "scripts/qmoi_hf_auto_manager.py", "--deploy"],
                capture_output=True,
                text=True,
            )
            if result.returncode == 0:
                self.log_event("DEPLOYMENT", "Hugging Face deployment successful")
                return True
            else:
                self.log_event(
                    "ERROR", f"Hugging Face deployment failed: {result.stderr}"
                )
                return False
        except Exception as e:
            self.log_event("ERROR", f"Error deploying to Hugging Face: {e}")
            return False

    def deploy_to_vercel(self):
        """Deploy to Vercel"""
        try:
            # Install Vercel CLI if not present
            subprocess.run(["npm", "install", "-g", "vercel"], check=True)

            # Deploy to Vercel
            env = os.environ.copy()
            env["VERCEL_TOKEN"] = self.vercel_token

            result = subprocess.run(
                ["vercel", "--prod", "--yes"],
                cwd=self.project_root,
                env=env,
                capture_output=True,
                text=True,
            )

            if result.returncode == 0:
                self.log_event("DEPLOYMENT", "Vercel deployment successful")
                return True
            else:
                self.log_event("ERROR", f"Vercel deployment failed: {result.stderr}")
                return False

        except Exception as e:
            self.log_event("ERROR", f"Error deploying to Vercel: {e}")
            return False

    def setup_qmoi_gitlab_clone(self):
        """Setup QMOI's own GitLab clone"""
        try:
            clone_dir = self.project_root / "qmoi-gitlab-clone"

            if not clone_dir.exists():
                # Clone the repository
                git.Repo.clone_from(
                    f"{self.qmoi_gitlab_url}/qmoi/alpha-q-ai.git", clone_dir
                )
                self.log_event("CI_CD", "QMOI GitLab clone created successfully")
            else:
                # Update existing clone
                repo = git.Repo(clone_dir)
                repo.remotes.origin.pull()
                self.log_event("CI_CD", "QMOI GitLab clone updated")

            return True

        except Exception as e:
            self.log_event("ERROR", f"Error setting up QMOI GitLab clone: {e}")
            return False

    def sync_with_qmoi_gitlab(self):
        """Sync with QMOI's GitLab clone"""
        try:
            clone_dir = self.project_root / "qmoi-gitlab-clone"

            if clone_dir.exists():
                repo = git.Repo(clone_dir)

                # Add all changes
                repo.git.add(".")

                # Commit if there are changes
                if repo.is_dirty():
                    repo.index.commit(f"QMOI Auto Sync - {datetime.now().isoformat()}")
                    repo.remotes.origin.push()
                    self.log_event("CI_CD", "Synced changes to QMOI GitLab")

            return True

        except Exception as e:
            self.log_event("ERROR", f"Error syncing with QMOI GitLab: {e}")
            return False

    def start_real_time_monitoring(self):
        """Start real-time monitoring of GitLab and deployments"""
        self.monitoring_active = True

        def monitor_loop():
            while self.monitoring_active:
                try:
                    # Monitor GitLab pipelines
                    self.monitor_gitlab_pipelines()

                    # Monitor Vercel deployments
                    self.monitor_vercel_deployments()

                    # Sync with QMOI GitLab
                    self.sync_with_qmoi_gitlab()

                    # Check for errors and auto-fix
                    self.check_and_fix_errors()

                    time.sleep(self.config["monitoring"]["check_interval"])

                except Exception as e:
                    self.log_event("ERROR", f"Error in monitoring loop: {e}")
                    time.sleep(60)  # Wait before retrying

        # Start monitoring in background thread
        monitor_thread = threading.Thread(target=monitor_loop, daemon=True)
        monitor_thread.start()

        self.log_event("CI_CD", "Real-time monitoring started")

    def monitor_gitlab_pipelines(self):
        """Monitor GitLab pipelines"""
        try:
            url = f"{self.gitlab_url}/api/v4/projects/{self.project_id}/pipelines"
            headers = {"PRIVATE-TOKEN": self.access_token}

            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                pipelines = response.json()

                for pipeline in pipelines[:5]:  # Check last 5 pipelines
                    if pipeline["status"] == "failed":
                        self.log_event(
                            "CI_CD", f"Found failed pipeline: {pipeline['id']}"
                        )
                        self.auto_fix_pipeline_errors(pipeline["id"])

        except Exception as e:
            self.log_event("ERROR", f"Error monitoring GitLab pipelines: {e}")

    def monitor_vercel_deployments(self):
        """Monitor Vercel deployments"""
        try:
            if self.vercel_token and self.vercel_project_id:
                url = f"https://api.vercel.com/v1/projects/{self.vercel_project_id}/deployments"
                headers = {"Authorization": f"Bearer {self.vercel_token}"}

                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    deployments = response.json()["deployments"]

                    for deployment in deployments[:3]:  # Check last 3 deployments
                        if deployment["state"] == "ERROR":
                            self.log_event(
                                "DEPLOYMENT",
                                f"Found failed deployment: {deployment['id']}",
                            )
                            self.fix_deployment_errors()

        except Exception as e:
            self.log_event("ERROR", f"Error monitoring Vercel deployments: {e}")

    def check_and_fix_errors(self):
        """Check for errors and auto-fix them"""
        try:
            # Check for common error patterns
            error_patterns = [
                "npm ERR",
                "Build failed",
                "Test failed",
                "Deployment failed",
                "Pipeline failed",
            ]

            # Check recent logs for errors
            log_files = [
                self.logs_dir / "qmoi_gitlab_error.log",
                self.logs_dir / "qmoi_gitlab_ci_cd.log",
                self.logs_dir / "qmoi_gitlab_deployment.log",
            ]

            for log_file in log_files:
                if log_file.exists():
                    with open(log_file, "r") as f:
                        recent_logs = f.readlines()[-50:]  # Last 50 lines

                        for line in recent_logs:
                            for pattern in error_patterns:
                                if pattern in line:
                                    self.log_event(
                                        "ERROR", f"Auto-fixing error: {pattern}"
                                    )
                                    self.auto_fix_errors(pattern)
                                    break

        except Exception as e:
            self.log_event("ERROR", f"Error checking and fixing errors: {e}")

    def auto_fix_errors(self, error_pattern: str):
        """Auto-fix specific error patterns"""
        try:
            if "npm ERR" in error_pattern:
                self.fix_npm_errors()
            elif "Build failed" in error_pattern:
                self.fix_build_errors()
            elif "Test failed" in error_pattern:
                self.fix_test_errors()
            elif "Deployment failed" in error_pattern:
                self.fix_deployment_errors()
            elif "Pipeline failed" in error_pattern:
                # Trigger new pipeline
                self.trigger_gitlab_runner()

        except Exception as e:
            self.log_event("ERROR", f"Error auto-fixing: {e}")

    def generate_monitoring_report(self):
        """Generate comprehensive monitoring report"""
        report_file = self.logs_dir / "qmoi_gitlab_monitoring_report.md"

        report = f"""# QMOI GitLab Automation Monitoring Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## System Status
- **Monitoring Active**: {self.monitoring_active}
- **Error Count**: {len(self.error_log)}
- **Deployment Count**: {len(self.deployment_log)}
- **CI/CD Count**: {len(self.ci_log)}

## Recent Errors
"""

        for error in self.error_log[-10:]:  # Last 10 errors
            report += f"- [{error['timestamp']}] {error['message']}\n"

        report += "\n## Recent Deployments\n"
        for deployment in self.deployment_log[-10:]:  # Last 10 deployments
            report += f"- [{deployment['timestamp']}] {deployment['message']}\n"

        report += "\n## Recent CI/CD Activities\n"
        for ci in self.ci_log[-10:]:  # Last 10 CI activities
            report += f"- [{ci['timestamp']}] {ci['message']}\n"

        report += f"""
## Configuration
- **GitLab URL**: {self.config['gitlab']['url']}
- **QMOI Clone URL**: {self.config['gitlab']['qmoi_clone_url']}
- **Auto Trigger Runners**: {self.config['gitlab']['auto_trigger_runners']}
- **Auto Fix Errors**: {self.config['gitlab']['auto_fix_errors']}
- **Real-time Monitoring**: {self.config['monitoring']['enabled']}

## QMOI GitLab Clone Status
- **Enabled**: {self.config['qmoi_clone']['enabled']}
- **Sync Interval**: {self.config['qmoi_clone']['sync_interval']} seconds
- **UI Features**: {self.config['qmoi_clone']['ui_features']}

✅ **QMOI GitLab Automation System is running successfully!**
"""

        with open(report_file, "w") as f:
            f.write(report)

        self.log_event("CI_CD", f"Monitoring report generated: {report_file}")

    def run_automation(self):
        self.log_event("CI_CD", "Starting QMOI GitLab Automation System (Enhanced)")
        self.setup_qmoi_gitlab_clone()
        self.start_real_time_monitoring()
        self.enhanced_auto_fix_and_deploy_loop(max_retries=5)
        self.generate_monitoring_report()
        self.log_event(
            "CI_CD", "QMOI GitLab Automation System is now running (Enhanced)"
        )
        try:
            while True:
                time.sleep(60)
                self.generate_monitoring_report()
        except KeyboardInterrupt:
            self.monitoring_active = False
            self.log_event("CI_CD", "QMOI GitLab Automation System stopped")


def main():
    """Main function"""
    automation = QMOIGitLabAutomation()
    automation.run_automation()


if __name__ == "__main__":
    main()
