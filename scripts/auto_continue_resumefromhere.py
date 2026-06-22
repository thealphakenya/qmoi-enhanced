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
import os
import tempfile

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
VALIDATE_MD_SCRIPT = ROOT / "scripts" / "validate_md.py"
VALIDATE_LINKS_SCRIPT = ROOT / "scripts" / "validate_links.py"
VALIDATE_APPS_SCRIPT = ROOT / "scripts" / "validate_apps.py"
VALIDATE_YML_SCRIPT = ROOT / "scripts" / "validate_yml.py"
VALIDATE_AND_SYNC_LINKS_SCRIPT = ROOT / "scripts" / "validate_and_sync_links.py"
VALIDATE_API_DOCS_SCRIPT = ROOT / "scripts" / "validate_api_documentation.py"
MD_STATUS_SCRIPT = ROOT / "scripts" / "generate_allmdrefs.py"
LEGACY_MD_GENERATOR = ROOT / "tools" / "regenerate_allmdrefs.py"
AUTO_UPDATE_ALLMDFILESREFS_SCRIPT = ROOT / "scripts" / "auto_update_allmdfilesrefs.py"
AUTO_UPDATE_MATCHES_UNDONE_SCRIPT = ROOT / "scripts" / "auto_update_matches_undone.py"
GENERATE_ALLDIRECTORIESMD_SCRIPT = ROOT / "scripts" / "generate_alldirectoriesmd.py"
CONSOLIDATE_API_ENDPOINTS_SCRIPT = ROOT / "scripts" / "consolidate_api_endpoints.py"
GENERATE_ENHANCED_ALLMDFILESREFS_SCRIPT = ROOT / "scripts" / "generate_allmdfilesrefs_enhanced.py"


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
    # If no explicit pending tasks found, try to synthesize from undone.txt and MATCHES.txt
    if not tasks:
        for p in (ROOT / 'undone.txt', ROOT / 'MATCHES.txt'):
            if p.exists():
                for l in p.read_text(encoding='utf-8', errors='ignore').splitlines():
                    s = l.strip()
                    if not s or s.startswith('#'):
                        continue
                    tasks.append(s)
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
        '- Generate and refresh ALLMDFILESREFS.md with per-file markdown production status annotations.',
        '- Ensure every markdown file in ALLMDFILESREFS.md is reviewed and marked production-ready, or tagged for follow-up fixes.',
        '- Keep `HOOKS.md`, `WEBHOOKS.md`, `ALLHOOKSWEBHOOKS.md`, and `TREE.md` aligned with every production update.',
        '- Update `API.md`, `APIs_1.md`, `ENDPOINTS.md`, `ROUTES.md`, and `ALLTESTSAUTOTESTS.md` as documentation changes occur.',
        '- Apply Q Lion validation blocks and metadata to all `.md` files in the repository while continuing in bulk.',
        '- Validate Markdown, links, YAML, app manifests, and API documentation in a single bulk run and record outputs under `.qmoi_validation/`.',
        '- Include Qstore and Qcamera platform/device coverage in the bulk task list and resume tracker.',
        '- Verify every Qstore app listing includes a custom icon, feature summary, and platform-aware download link.',
        '- Refresh `resumefromhere.txt` before and after each bulk run so the resume tracker is always current.',
    ]
    task_block_lines += [f'- {task}' for task in merged_tasks[:50]]
    if len(merged_tasks) > 50:
        task_block_lines.append(f'- ... and {len(merged_tasks) - 50} more tasks from 14.txt/resumefromhere.txt.')
    task_block_lines.append('')

    # Replace or insert the WORKFLOW TASKS block atomically
    marker_pat = re.compile(r'WORKFLOW TASKS:[\s\S]*?(?=\n\n|\Z)', flags=re.MULTILINE)
    if marker_pat.search(resume_content):
        resume_content = marker_pat.sub('\n'.join(task_block_lines), resume_content)
    else:
        if 'Resume point:' in resume_content:
            parts = resume_content.split('\n\n', 1)
            if len(parts) == 2:
                resume_content = parts[0] + '\n\n' + '\n'.join(task_block_lines) + parts[1]
            else:
                resume_content += '\n\n' + '\n'.join(task_block_lines)
        else:
            resume_content = '\n'.join(task_block_lines) + '\n' + resume_content

    # Write atomically to avoid partial updates when other processes read the file
    tmpfd, tmppath = tempfile.mkstemp(prefix='resumefromhere.', suffix='.tmp', dir=str(ROOT))
    try:
        with os.fdopen(tmpfd, 'w', encoding='utf-8') as fh:
            fh.write(resume_content)
        Path(tmppath).replace(RESUME_FILE)
    finally:
        if Path(tmppath).exists():
            try:
                Path(tmppath).unlink()
            except Exception:
                pass


def run_command(command: list[str], description: str) -> bool:
    print(f"Executing: {description} -> {' '.join(command)}")
    try:
        subprocess.run(command, cwd=ROOT, check=True)
        return True
    except FileNotFoundError as exc:
        print(f"{description} skipped: missing executable {command[0]} ({exc})")
        return False
    except subprocess.CalledProcessError as exc:
        print(f"{description} failed: {exc}")
        return False


DUPLICATE_FILE_AUDIT_SCRIPT = ROOT / "scripts" / "duplicate_file_audit.py"
MERGE_DISCOVERY_SCANNER_SCRIPT = ROOT / "scripts" / "merge_discovery_scanner.py"



def run_bulk_fixer() -> None:
    # Simple lock to avoid concurrent bulk runs
    lockfile = ROOT / '.resumefromhere.lock'
    lock_acquired = False
    try:
        fd = os.open(str(lockfile), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.write(fd, f"pid:{os.getpid()}\n".encode())
        os.close(fd)
        lock_acquired = True
    except FileExistsError:
        print(f"Another bulk run appears to be active (lock: {lockfile}); aborting this run.")
        return

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
    if VALIDATE_MD_SCRIPT.exists():
        run_command([sys.executable, str(VALIDATE_MD_SCRIPT), "--apply", "--out", str(ROOT / "docs" / "md_validation_summary.json")], 'validate Markdown files and write Q Lion validation reports')
    else:
        print(f"Info: {VALIDATE_MD_SCRIPT} not found; skipping Markdown validation step.")

    if VALIDATE_LINKS_SCRIPT.exists():
        run_command([sys.executable, str(VALIDATE_LINKS_SCRIPT)], 'validate repository links')
    else:
        print(f"Info: {VALIDATE_LINKS_SCRIPT} not found; skipping link validation step.")

    if VALIDATE_APPS_SCRIPT.exists():
        run_command([sys.executable, str(VALIDATE_APPS_SCRIPT)], 'validate discovered app manifests')
    else:
        print(f"Info: {VALIDATE_APPS_SCRIPT} not found; skipping app validation step.")

    if VALIDATE_YML_SCRIPT.exists():
        run_command([sys.executable, str(VALIDATE_YML_SCRIPT)], 'validate YAML files and manifest syntax')
    else:
        print(f"Info: {VALIDATE_YML_SCRIPT} not found; skipping YAML validation step.")

    if VALIDATE_AND_SYNC_LINKS_SCRIPT.exists():
        run_command([sys.executable, str(VALIDATE_AND_SYNC_LINKS_SCRIPT)], 'validate and sync workspace links')
    else:
        print(f"Info: {VALIDATE_AND_SYNC_LINKS_SCRIPT} not found; skipping link sync validation step.")

    if VALIDATE_API_DOCS_SCRIPT.exists():
        run_command([sys.executable, str(VALIDATE_API_DOCS_SCRIPT)], 'validate API documentation sources')
    else:
        print(f"Info: {VALIDATE_API_DOCS_SCRIPT} not found; skipping API documentation validation step.")
    
    # Directory metadata and documentation generation
    if GENERATE_ALLDIRECTORIESMD_SCRIPT.exists():
        run_command([sys.executable, str(GENERATE_ALLDIRECTORIESMD_SCRIPT)], 'generate ALLDIRECTORIESMD.md directory index')
    else:
        print(f"Info: {GENERATE_ALLDIRECTORIESMD_SCRIPT} not found; skipping ALLDIRECTORIESMD generation.")
    
    # API consolidation
    if CONSOLIDATE_API_ENDPOINTS_SCRIPT.exists():
        run_command([sys.executable, str(CONSOLIDATE_API_ENDPOINTS_SCRIPT)], 'consolidate API documentation')
    else:
        print(f"Info: {CONSOLIDATE_API_ENDPOINTS_SCRIPT} not found; skipping API consolidation.")
    
    # Merge discovery scan (identify duplicates for consolidation)
    if MERGE_DISCOVERY_SCANNER_SCRIPT.exists():
        run_command([sys.executable, str(MERGE_DISCOVERY_SCANNER_SCRIPT)], 'scan for duplicate files and entry points for merge phase')
    else:
        print(f"Info: {MERGE_DISCOVERY_SCANNER_SCRIPT} not found; skipping merge discovery scan.")

    
    # Enhanced ALLMDFILESREFS.md with tags and status
    if GENERATE_ENHANCED_ALLMDFILESREFS_SCRIPT.exists():
        run_command([sys.executable, str(GENERATE_ENHANCED_ALLMDFILESREFS_SCRIPT)], 'generate enhanced ALLMDFILESREFS.md with tags and production status')
    else:
        print(f"Info: {GENERATE_ENHANCED_ALLMDFILESREFS_SCRIPT} not found; skipping enhanced ALLMDFILESREFS generation.")
    
    qmoi_md_autoupdater = ROOT / "scripts" / "qmoi_md_autoupdater.py"
    if qmoi_md_autoupdater.exists():
        run_command([sys.executable, str(qmoi_md_autoupdater)], 'sync root documentation files')
    else:
        print(f"Warning: {qmoi_md_autoupdater} not found; skipping root documentation sync.")

    if MD_STATUS_SCRIPT.exists():
        run_command([sys.executable, str(MD_STATUS_SCRIPT), "--write"], 'generate ALLMDFILESREFS.md with markdown production status')
    elif LEGACY_MD_GENERATOR.exists():
        run_command([sys.executable, str(LEGACY_MD_GENERATOR)], 'regenerate ALLMDFILESREFS.md inventory')
    else:
        print(f"Warning: No markdown inventory generator found; skipping ALLMDFILESREFS.md refresh.")

    if LION_METADATA_SCRIPT.exists():
        run_command([sys.executable, str(LION_METADATA_SCRIPT), "--apply", "--out", str(ROOT / "docs" / "md_index.json")], 'apply Lion markdown validation metadata')
    else:
        print(f"Warning: {LION_METADATA_SCRIPT} not found; skipping Lion metadata tagging.")

    if AUTO_UPDATE_ALLMDFILESREFS_SCRIPT.exists():
        run_command([sys.executable, str(AUTO_UPDATE_ALLMDFILESREFS_SCRIPT)], 'auto update ALLMDFILESREFS docs')
    else:
        print(f"Info: {AUTO_UPDATE_ALLMDFILESREFS_SCRIPT} not found; skipping auto_update_allmdfilesrefs step.")

    if AUTO_UPDATE_MATCHES_UNDONE_SCRIPT.exists():
        run_command([sys.executable, str(AUTO_UPDATE_MATCHES_UNDONE_SCRIPT)], 'auto update matches and undone trackers')
    else:
        print(f"Info: {AUTO_UPDATE_MATCHES_UNDONE_SCRIPT} not found; skipping auto_update_matches_undone step.")

    if LION_SCAN_SCRIPT.exists():
        run_command([sys.executable, str(LION_SCAN_SCRIPT), "--out", str(ROOT / "docs" / "lion_usage_report.json")], 'scan Lion usage and extension docs')
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

    # Attempt to run the QM OI quantum integrator if present.
    QMOINTEGRATOR = ROOT / 'scripts' / 'qmoi_quantum_integrator.py'
    QM_CONFIG = ROOT / 'config' / 'quantum_devices.json'
    if QMOINTEGRATOR.exists():
        # If a config requests auto_run, process the queued jobs; otherwise run a safe dry-run status check.
        try:
            if QM_CONFIG.exists():
                import json
                cfg = json.loads(QM_CONFIG.read_text(encoding='utf-8'))
                if cfg.get('auto_run'):
                    run_command([sys.executable, str(QMOINTEGRATOR), '--process-queue'], 'run QM OI quantum integrator (process-queue)')
                else:
                    run_command([sys.executable, str(QMOINTEGRATOR), '--dry-run'], 'run QM OI quantum integrator (dry-run)')
            else:
                run_command([sys.executable, str(QMOINTEGRATOR), '--dry-run'], 'run QM OI quantum integrator (dry-run)')
        except Exception:
            run_command([sys.executable, str(QMOINTEGRATOR), '--dry-run'], 'run QM OI quantum integrator (dry-run)')
    else:
        print(f"Info: {QMOINTEGRATOR} not found; skipping quantum integrator run.")

    if not BULK_FIXER_SCRIPT.exists():
        print(f"Warning: {BULK_FIXER_SCRIPT} not found; bulk production fixer cannot be executed.")
        return

    try:
        subprocess.run([sys.executable, str(BULK_FIXER_SCRIPT)], cwd=ROOT, check=True)
        print("Bulk production fixer completed successfully.")
    except subprocess.CalledProcessError as exc:
        print(f"Bulk production fixer failed: {exc}")
    finally:
        if lock_acquired and lockfile.exists():
            try:
                lockfile.unlink()
            except Exception:
                pass


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
