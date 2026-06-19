#!/usr/bin/env python3
"""
Auto continuation helper for resumefromhere.txt.
Runs the bulk production fixer, refreshes the resume tracker, and prints a production-friendly summary.
"""

import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Optional

ROOT = Path(__file__).resolve().parents[1]
RESUME_FILE = ROOT / "resumefromhere.txt"
AUTUPDATE_SCRIPT = ROOT / "scripts" / "autoupdate_resume.py"
BULK_FIXER_SCRIPT = ROOT / "scripts" / "bulk_production_fixer.py"
DUPLICATE_CLEANUP_SCRIPT = ROOT / "scripts" / "duplicate_cleanup.py"
UPDATE_API_DOCS_SCRIPT = ROOT / "scripts" / "update_api_docs.js"
AUTODOC_SCRIPT = ROOT / "scripts" / "autoupdate_docs.sh"
LION_METADATA_SCRIPT = ROOT / "scripts" / "autotag_md_with_lion.py"
LION_SCAN_SCRIPT = ROOT / "scripts" / "scan_lion_usage.py"
LION_ORCHESTRATOR_SCRIPT = ROOT / "scripts" / "lion_orchestrator.py"
LION_INTEGRATOR_SCRIPT = ROOT / "scripts" / "qmoi_bulk_lion_security_integrator.py"


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


def load_text_file(path: Path) -> str:
    if not path.exists():
        return ""
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def extract_tasks_from_markdown(content: str) -> List[str]:
    tasks: List[str] = []
    for line in content.splitlines():
        stripped = line.strip()
        if re.match(r'^[-•*]\s+', stripped):
            tasks.append(re.sub(r'^[-•*]\s+', '', stripped))
        elif re.match(r'^\d+\.\s+', stripped):
            tasks.append(re.sub(r'^\d+\.\s+', '', stripped))
    return [task for task in dict.fromkeys(tasks) if task]


def update_resume_tasks_block() -> None:
    resume_content = load_text_file(RESUME_FILE)
    fourteen_content = load_text_file(ROOT / '14.txt')
    resume_tasks = extract_tasks_from_markdown(resume_content)
    fourteen_tasks = extract_tasks_from_markdown(fourteen_content)
    merged_tasks = []
    for source_task in fourteen_tasks + resume_tasks:
        if source_task not in merged_tasks:
            merged_tasks.append(source_task)

    if not merged_tasks:
        return

    task_block_lines = [
        'WORKFLOW TASKS:',
        '- Address all items in 14.txt and resumefromhere.txt with production implementations.',
        '- Keep the system synchronized with the universal auth, theme, and QM OI memory flow.',
        '- Update all docs, endpoints, and app shell UI documentation while fixing production markers.',
    ]
    task_block_lines += [f'- {task}' for task in merged_tasks[:50]]
    if len(merged_tasks) > 50:
        task_block_lines.append(f'- ... and {len(merged_tasks) - 50} more tasks from 14.txt/resumefromhere.txt.')
    task_block_lines.append('')

    if 'WORKFLOW TASKS:' in resume_content:
        resume_content = re.sub(
            r'WORKFLOW TASKS:[\s\S]*?(?=\n\n|\Z)',
            '\n'.join(task_block_lines),
            resume_content,
            flags=re.MULTILINE,
        )
    else:
        if 'Resume point:' in resume_content:
            parts = resume_content.split('\n\n', 1)
            if len(parts) == 2:
                resume_content = parts[0] + '\n\n' + '\n'.join(task_block_lines) + parts[1]
            else:
                resume_content += '\n\n' + '\n'.join(task_block_lines)
        else:
            resume_content = '\n'.join(task_block_lines) + '\n' + resume_content

    RESUME_FILE.write_text(resume_content, encoding='utf-8')


def run_command(command: list[str], description: str) -> bool:
    print(f"Executing: {description} -> {' '.join(command)}")
    try:
        subprocess.run(command, cwd=ROOT, check=True)
        return True
    except subprocess.CalledProcessError as exc:
        print(f"{description} failed: {exc}")
        return False


DUPLICATE_FILE_AUDIT_SCRIPT = ROOT / "scripts" / "duplicate_file_audit.py"


def run_bulk_fixer() -> None:
    if DUPLICATE_CLEANUP_SCRIPT.exists():
        run_command([sys.executable, str(DUPLICATE_CLEANUP_SCRIPT)], 'duplicate cleanup')
    else:
        print(f"Warning: {DUPLICATE_CLEANUP_SCRIPT} not found; skipping duplicate cleanup.")

    if DUPLICATE_FILE_AUDIT_SCRIPT.exists():
        run_command([sys.executable, str(DUPLICATE_FILE_AUDIT_SCRIPT)], 'duplicate file audit')
    else:
        print(f"Warning: {DUPLICATE_FILE_AUDIT_SCRIPT} not found; skipping duplicate file audit.")

    if UPDATE_API_DOCS_SCRIPT.exists():
        run_command(["node", str(UPDATE_API_DOCS_SCRIPT)], 'update API docs')
    else:
        print(f"Warning: {UPDATE_API_DOCS_SCRIPT} not found; skipping API docs update.")

    if AUTODOC_SCRIPT.exists():
        run_command(["bash", str(AUTODOC_SCRIPT)], 'autoupdate markdown docs')
    else:
        print(f"Warning: {AUTODOC_SCRIPT} not found; skipping markdown docs autoupdate.")

    qmoi_md_autoupdater = ROOT / "scripts" / "qmoi_md_autoupdater.py"
    if qmoi_md_autoupdater.exists():
        run_command([sys.executable, str(qmoi_md_autoupdater)], 'sync root documentation files')
    else:
        print(f"Warning: {qmoi_md_autoupdater} not found; skipping root documentation sync.")

    if LION_METADATA_SCRIPT.exists():
        run_command([sys.executable, str(LION_METADATA_SCRIPT), "--apply", "--out", str(ROOT / "docs" / "md_index.json")], 'apply Lion markdown validation metadata')
    else:
        print(f"Warning: {LION_METADATA_SCRIPT} not found; skipping Lion metadata tagging.")

    if LION_SCAN_SCRIPT.exists():
        run_command([sys.executable, str(LION_SCAN_SCRIPT), "--report"], 'scan Lion usage and extension docs')
    else:
        print(f"Warning: {LION_SCAN_SCRIPT} not found; skipping Lion usage scan.")

    if LION_ORCHESTRATOR_SCRIPT.exists():
        run_command([sys.executable, str(LION_ORCHESTRATOR_SCRIPT), "--work", "bulk"], 'run Lion orchestrator bulk integration')
    else:
        print(f"Warning: {LION_ORCHESTRATOR_SCRIPT} not found; skipping Lion orchestrator integration.")

    if LION_INTEGRATOR_SCRIPT.exists():
        run_command([sys.executable, str(LION_INTEGRATOR_SCRIPT)], 'run QM OI Lion bulk security integrator')
    else:
        print(f"Warning: {LION_INTEGRATOR_SCRIPT} not found; skipping QM OI Lion bulk security integration.")

    if not BULK_FIXER_SCRIPT.exists():
        print(f"Warning: {BULK_FIXER_SCRIPT} not found; bulk production fixer cannot be executed.")
        return

    try:
        subprocess.run([sys.executable, str(BULK_FIXER_SCRIPT)], cwd=ROOT, check=True)
        print("Bulk production fixer completed successfully.")
    except subprocess.CalledProcessError as exc:
        print(f"Bulk production fixer failed: {exc}")


def refresh_resume_file() -> None:
    if not AUTUPDATE_SCRIPT.exists():
        print(f"Warning: {AUTUPDATE_SCRIPT} not found; resumefromhere.txt will not be refreshed.")
        return

    try:
        subprocess.run([sys.executable, str(AUTUPDATE_SCRIPT)], cwd=ROOT, check=True)
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
    refresh_resume_file()
    update_resume_tasks_block()
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
