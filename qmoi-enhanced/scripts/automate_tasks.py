"""
Automation script for scheduling optimization and monitoring tasks.
This script uses Windows Task Scheduler (schtasks) and cron (crontab) to schedule tasks.
"""

import os
import subprocess
import sys
import platform
from pathlib import Path

def run_lint_and_error_checks():
    """Run linting and error checks on the codebase."""
    print("Running linting and error checks...")
    # Run ESLint for JavaScript/TypeScript files
    subprocess.run(['npx', 'eslint', '.'], check=True)
    # Run Pylint for Python files
    subprocess.run(['pylint', 'scripts/'], check=True)
    print("Linting and error checks completed.")

def schedule_windows_task(task_name, script_path, interval_minutes=60):
    """Schedule a task using Windows Task Scheduler."""
    cmd = f'schtasks /create /tn "{task_name}" /tr "{script_path}" /sc minute /mo {interval_minutes}'
    subprocess.run(cmd, shell=True, check=True)

def schedule_cron_task(script_path, interval_minutes=60):
    """Schedule a task using cron (crontab)."""
    cron_cmd = f"*/{interval_minutes} * * * * {script_path}"
    cmd = f'(crontab -l 2>/dev/null; echo "{cron_cmd}") | crontab -'
    subprocess.run(cmd, shell=True, check=True)

def schedule_tasks():
    """Schedule optimization and monitoring tasks."""
    system = platform.system()
    if system == 'Windows':
        # Use Windows Task Scheduler
        subprocess.run(['schtasks', '/create', '/tn', 'optimize_cpu', '/tr', 'python scripts/optimize_cpu.py', '/sc', 'daily'], check=True)
        subprocess.run(['schtasks', '/create', '/tn', 'optimize_memory', '/tr', 'python scripts/optimize_memory.py', '/sc', 'daily'], check=True)
        subprocess.run(['schtasks', '/create', '/tn', 'optimize_storage', '/tr', 'python scripts/optimize_storage.py', '/sc', 'daily'], check=True)
        subprocess.run(['schtasks', '/create', '/tn', 'optimize_ai', '/tr', 'python scripts/optimize_ai.py', '/sc', 'daily'], check=True)
        subprocess.run(['schtasks', '/create', '/tn', 'monitor_errors', '/tr', 'python scripts/monitoring/error_tracking.py', '/sc', 'daily'], check=True)
    else:
        # Use cron for Linux/macOS
        subprocess.run(['crontab', '-l'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        subprocess.run(['echo', '0 0 * * * python scripts/optimize_cpu.py', '>>', '/tmp/crontab'], check=True)
        subprocess.run(['echo', '0 0 * * * python scripts/optimize_memory.py', '>>', '/tmp/crontab'], check=True)
        subprocess.run(['echo', '0 0 * * * python scripts/optimize_storage.py', '>>', '/tmp/crontab'], check=True)
        subprocess.run(['echo', '0 0 * * * python scripts/optimize_ai.py', '>>', '/tmp/crontab'], check=True)
        subprocess.run(['echo', '0 0 * * * python scripts/monitoring/error_tracking.py', '>>', '/tmp/crontab'], check=True)
        subprocess.run(['crontab', '/tmp/crontab'], check=True)

def main():
    # Define the scripts to schedule
    scripts = {
        "optimize_memory": "scripts/optimize_memory.py",
        "optimize_cpu": "scripts/optimize_cpu.py",
        "optimize_storage": "scripts/optimize_storage.py",
        "enhance_ai": "scripts/enhance_ai.py"
    }
    
    # Schedule each script
    for task_name, script_path in scripts.items():
        script_path = Path(script_path).resolve()
        if not script_path.exists():
            print(f"Script not found: {script_path}")
            continue
        if os.name == 'nt':
            schedule_windows_task(task_name, str(script_path))
        else:
            schedule_cron_task(str(script_path))
        print(f"Scheduled {task_name} using {script_path}")

if __name__ == '__main__':
    run_lint_and_error_checks()
    schedule_tasks()
    print("Tasks scheduled successfully.") 