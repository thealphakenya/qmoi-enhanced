#!/usr/bin/env python3
"""
Auto continuation helper for resumefromhere.txt.
Runs the bulk production fixer, refreshes the resume tracker, and prints a production-friendly summary.
"""

import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import List, Optional

ROOT = Path(__file__).resolve().parents[1]
RESUME_FILE = ROOT / "resumefromhere.txt"
AUTUPDATE_SCRIPT = ROOT / "scripts" / "autoupdate_resume.py"
BULK_FIXER_SCRIPT = ROOT / "scripts" / "bulk_production_fixer.py"


def git_summary() -> tuple[str, str, str]:
    try:
        commit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT).decode().strip()
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=ROOT).decode().strip()
        status = subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT).decode().strip()
        return commit, branch, status
    except Exception as exc:
        return "(no-git)", "(no-branch)", str(exc)


def extract_latest_resume_block(content: str) -> str:
    match = re.search(r'^(Resume update:.*?)(?=^(?:Resume update:|Resume point:)|\Z)', content, flags=re.MULTILINE | re.DOTALL)
    if match:
        return match.group(1).strip()

    markers = re.split(r'^(?=Resume point:)', content, flags=re.MULTILINE)
    if markers and markers[0].strip():
        return markers[0].strip()

    return content.strip()


def extract_pending_tasks(block: str) -> List[str]:
    lines = block.splitlines()
    tasks: List[str] = []
    capture = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("Next steps:"):
            capture = True
            continue

        if not capture:
            continue

        if not stripped:
            continue

        if stripped.startswith("-") or stripped.startswith("•"):
            tasks.append(stripped.lstrip("-• ").strip())
        elif stripped.startswith("Action:") or stripped.startswith("Details:") or stripped.startswith("Recorder:"):
            continue
        else:
            tasks.append(stripped)

    if not tasks:
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("-") or stripped.startswith("•"):
                tasks.append(stripped.lstrip("-• ").strip())
    return tasks


def run_bulk_fixer() -> None:
    if not BULK_FIXER_SCRIPT.exists():
        print(f"Warning: {BULK_FIXER_SCRIPT} not found; bulk production fixer cannot be executed.")
        return

    try:
        subprocess.run(["python3", str(BULK_FIXER_SCRIPT)], cwd=ROOT, check=True)
        print("Bulk production fixer completed successfully.")
    except subprocess.CalledProcessError as exc:
        print(f"Bulk production fixer failed: {exc}")


def refresh_resume_file() -> None:
    if not AUTUPDATE_SCRIPT.exists():
        print(f"Warning: {AUTUPDATE_SCRIPT} not found; resumefromhere.txt will not be refreshed.")
        return

    try:
        subprocess.run(["python3", str(AUTUPDATE_SCRIPT)], cwd=ROOT, check=True)
        print("resumefromhere.txt refreshed with current git metadata.")
    except subprocess.CalledProcessError as exc:
        print(f"Failed to refresh resumefromhere.txt: {exc}")


def print_task_summary(tasks: List[str], commit: str, branch: str, status: str) -> None:
    print("\n=== resumefromhere.txt Auto-Continue Summary ===")
    print(f"Git commit: {commit}")
    print(f"Git branch: {branch}")
    print(f"Repository status: {'clean' if status == '' else 'dirty'}")
    print(f"Pending tasks: {len(tasks)}")
    if tasks:
        for index, task in enumerate(tasks, start=1):
            print(f"  {index}. {task}")
    else:
        print("  No pending tasks were found in the latest resume block.")
    print("=== End of summary ===\n")


def load_resume_content() -> Optional[str]:
    if not RESUME_FILE.exists():
        print(f"resumefromhere.txt not found at {RESUME_FILE}")
        return None
    return RESUME_FILE.read_text(encoding="utf-8")


def main() -> None:
    run_bulk_fixer()
    refresh_resume_file()

    content = load_resume_content()
    if content is None:
        return

    commit, branch, status = git_summary()
    latest_block = extract_latest_resume_block(content)
    tasks = extract_pending_tasks(latest_block)
    print_task_summary(tasks, commit, branch, status)


if __name__ == '__main__':
    main()
