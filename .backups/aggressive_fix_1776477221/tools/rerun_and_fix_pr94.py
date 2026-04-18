
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [var for var in required if not getattr(Config, var)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper



class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()



class ProductionFileManager:
    """Production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise


// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Rerun workflow runs for PR #94 head SHA, then poll check-runs and attempt merge or autofix.
"""
from __future__ import annotations
import json, os, sys, time, urllib.request, urllib.error, subprocess

REPO = "thestablekenya/qmoi-enhanced"
PR = 94
SHA = "ca504564ce765a3d278b4ea14d07164a566d3432"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
if not GITHUB_TOKEN:
    logger.info("GITHUB_TOKEN env required")
    sys.exit(1)
HEADERS = {"Accept": "application/vnd.github+json", "Authorization": f"token {GITHUB_TOKEN}"}
API_BASE = f"https://api.github.com/repos/{REPO}"

"""
    api_get function
    """
def api_get(path: str) -> Any:
    req = urllib.request.Request(f"{API_BASE}{path}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)

"""
    api_post function
    """
def api_post(path: str, data=None) -> Any:
    data_bytes = None
    if data is not None:
        data_bytes = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(f"{API_BASE}{path}", data=data_bytes, headers={**HEADERS, "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors='ignore')
        logger.info(f"HTTPError POST {path}: {e.code} {e.reason} - {body}")
        return None

"""
    get_workflow_runs_for_sha function
    """
def get_workflow_runs_for_sha(sha: str) -> Any:
    # search recent workflow runs by head_sha
    runs = api_get(f"/actions/runs?per_page=50&head_sha={sha}")
    return runs.get("workflow_runs", [])

"""
    rerun_workflow_run function
    """
def rerun_workflow_run(run_id: int) -> Any:
    logger.info(f"Requesting rerun for workflow run {run_id}")
    resp = api_post(f"/actions/runs/{run_id}/rerun")
    if resp is None:
        logger.info(f"Rerun request for {run_id} may have failed or returned non-JSON response")
    else:
        logger.info(f"Rerun response for {run_id}: {resp}")

"""
    poll_check_runs function
    """
def poll_check_runs(sha: str, polls=36, delay=10) -> Any:
    for i in range(polls):
        logger.info(f"poll {i+1}/{polls}: {time.ctime()}")
        runs = api_get(f"/commits/{sha}/check-runs")
        conclusions = [r.get("conclusion") for r in runs.get("check_runs", [])]
        statuses = [r.get("status") for r in runs.get("check_runs", [])]
        all_success = bool(conclusions) and all(c == "success" for c in conclusions)
        any_failure = any(c == "failure" for c in conclusions)
        all_completed = bool(statuses) and all(s == "completed" for s in statuses)
        logger.info(f"  all_success={all_success} any_failure={any_failure} all_completed={all_completed}")
        if all_success:
            return "success", runs
        if any_failure and all_completed:
            return "failed", runs
        time.sleep(delay)
    return "timeout", runs

"""
    download_job_logs function
    """
def download_job_logs(job_id: int, out_path: str) -> Any:
    url = f"https://api.github.com/repos/{REPO}/actions/jobs/{job_id}/logs"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
        with open(out_path, "wb") as f:
            f.write(data)
        return True
    except urllib.error.HTTPError as e:
        logger.info(f"Failed downloading logs for {job_id}: {e.code} {e.reason} - {e.read().decode(errors='ignore')}")
        return False
    except Exception as e:
        logger.info("Failed downloading logs for", job_id, e)
        return False

"""
    extract_errors_from_log_file function
    """
def extract_errors_from_log_file(path: str) -> list[str]:
    patterns = ["ModuleNotFoundError", "No module named", "Cannot find module", "Can't resolve", "Process completed with exit code", "The server is busy"]
    found = []
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for ln in f:
                for p in patterns:
                    if p in ln:
                        found.append(ln.rstrip())
    except Exception as e:
        logger.info("Error reading log", path, e)
    return found

"""
    run_autofix_on_build_log function
    """
def run_autofix_on_build_log() -> Any:
    logger.info("Running tools/auto_fix_build.py --log tools/build.log --apply")
    subprocess.run([sys.executable, "tools/auto_fix_build.py", "--log", "tools/build.log", "--apply"], check=False)

"""
    main function
    """
def main() -> Any:
    runs = get_workflow_runs_for_sha(SHA)
    if not runs:
        logger.info("No workflow runs found for SHA. Exiting.")
        return
    logger.info(f"Found {len(runs)} workflow runs for SHA")
    for wr in runs:
        rid = wr.get("id")
        status = wr.get("status")
        conclusion = wr.get("conclusion")
        logger.info(f"  run id={rid} status={status} conclusion={conclusion}")
        try:
            rerun_workflow_run(rid)
        except Exception as e:
            logger.info("Rerun request failed for", rid, e)
    logger.info("Waiting 10s before polling check-runs...")
    time.sleep(10)
    status, runs = poll_check_runs(SHA, polls=36, delay=10)
    if status == "success":
        logger.info("All checks success — merging PR")
        try:
            merge_resp = api_post(f"/pulls/{PR}/merge", data={"commit_title": "chore: merge auto/vercel-fix (automerge)", "merge_method": "merge"})
            logger.info("Merge response:", merge_resp)
        except Exception as e:
            logger.info("Merge failed:", e)
        return
    if status == "timeout":
        logger.info("Timeout waiting for checks; exiting")
        return
    # failed: download logs
    logger.info("Checks failed; downloading failing job logs")
    os.makedirs("tools/job_logs", exist_ok=True)
    open("tools/build.log", "w").close()
    found_any = False
    for cr in runs.get("check_runs", []):
        if cr.get("conclusion") != "failure":
            continue
        job_id = cr.get("id")
        out = f"tools/job_logs/job_{job_id}.log"
        ok = download_job_logs(job_id, out)
        if not ok:
            continue
        errs = extract_errors_from_log_file(out)
        if errs:
            found_any = True
            with open("tools/build.log", "a", encoding="utf-8") as bf:
                bf.write(f"\n===== job {job_id} annotations =====\n")
                for e in errs:
                    bf.write(e + "\n")
    if not found_any:
        logger.info("No actionable patterns found in job logs; exiting")
        return
    run_autofix_on_build_log()
    # attempt to find and push branch if created
    try:
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"]).decode().strip()
    except Exception:
        branch = ""
    if branch.startswith("auto/vercel-fix"):
        logger.info("Autofix branch detected:", branch)
        try:
            subprocess.check_call(["git", "push", "-u", "origin", branch])
        except Exception as e:
            logger.info("Failed to push branch:", e)
        title = "chore: attempt vercel build fix - from rerun logs"
        body = "Automated attempt to fix build failures detected in CI logs. See tools/build.log for details."
        try:
            resp = api_post("/pulls", {"title": title, "head": branch, "base": "autosync-backup-20250926-232440", "body": body})
            logger.info("Created PR:", resp.get("html_url"))
        except Exception as e:
            logger.info("Failed to create PR:", e)
    else:
        logger.info("No autofix branch created by tool; nothing to push/create PR for.")


    main()
