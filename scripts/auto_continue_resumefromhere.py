#!/usr/bin/env python3
"""
Auto continuation helper for resumefromhere.txt.
Runs the bulk production fixer, refreshes the resume tracker, and prints a production-friendly summary.
"""

import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Optional
import os
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
RESUME_FILE = ROOT / "resumefromhere.txt"
AUTUPDATE_SCRIPT = ROOT / "scripts" / "autoupdate_resume.py"
BULK_FIXER_SCRIPT = ROOT / "scripts" / "bulk_production_fixer.py"
MERGE_EXECUTOR_SCRIPT = ROOT / "scripts" / "merge_executor.py"
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
    seven_content = load_text_file(ROOT / '7.txt')
    resume_tasks = extract_tasks_from_markdown(resume_content)
    fourteen_tasks = extract_tasks_from_markdown(fourteen_content)
    seven_tasks = extract_tasks_from_markdown(seven_content)
    merged_tasks = []
    for source_task in fourteen_tasks + seven_tasks + resume_tasks:
        if source_task not in merged_tasks:
            merged_tasks.append(source_task)

    if not merged_tasks:
        return

    task_block_lines = [
        'WORKFLOW TASKS:',
        '- Work on everything in bulk, in the required order, without skipping any backlog item from 7.txt, 14.txt, undone.txt, MATCHES.txt, or resumefromhere.txt.',
        '- Keep the system synchronized with the universal auth, theme, QM OI memory flow, finance/trading logic, wallet/balance/account inventory, and route documentation across all apps and portals.',
        '- Implement and verify universal login/logout/register/forgot-password/forgot-email/reset-password/email-verification/session-refresh/biometric flows everywhere.',
        '- Make the /universal portal the canonical entry point and auto-channel users back to their target app after auth.',
        '- Process the trading, finance, Bitget/Binance, revenue, and global-finance backlog from 7.txt in bulk with production-ready modules, routes, docs, and validation.',
        '- Work through the 7.txt backlog in bulk for spot trading, futures, options, grid, arbitrage, market making, liquidity provision, copy trading, signal selling, portfolio management, asset allocation, yield optimization, staking, lending, borrowing strategy, funding rate strategies, launchpool/launchpad participation, token research, on-chain analytics, sentiment analysis, news trading, risk management, tax recording, fraud detection, cross-exchange optimization, stablecoin management, auto-reinvestment, performance analytics, and AI self-improvement.',
        '- Prioritize canonical finance and trading routes before adding new UI shells or duplicate implementations.',
        '- Inventory every wallet, balance, account, exchange, platform, and related markdown file, then keep docs and route inventories aligned with the real implementation.',
        '- Consolidate all API, endpoint, route, and directory documentation into canonical files: API.md, ENDPOINTS.md, ROUTES.md, and TREE.md.',
        '- Merge all markdown files related to API, endpoints, routes, wallets, balances, accounts, and directories into the canonical documentation set, including files with those terms in their names or contents.',
        '- Ensure API.md contains all APIs discovered in APIs_1.md, APIs_v1.md, API*.md, and every other relevant .md or source file across the repository.',
        '- Ensure ENDPOINTS.md contains every endpoint discovered in all .md files, code, and route definitions across the repository.',
        '- Ensure ROUTES.md contains every route discovered in all .md files, code, and app entry points across the repository.',
        '- Update MERGE.md to describe the merge strategy for API files, endpoint files, route files, directories, and all source files across .js, .jsx, .ts, .tsx, .json, .py, .yml, and other file types.',
        '- Update TREE.md to reflect the canonical tree, merged directories, and the current bulk consolidation plan.',
        '- Update all docs, endpoints, app shell UI documentation, and cross-references while fixing production markers.',
        '- Generate and refresh ALLMDFILESREFS.md with per-file markdown production status annotations.',
        '- Ensure every markdown file in ALLMDFILESREFS.md is reviewed and marked production-ready, or tagged for follow-up fixes.',
        '- Keep HOOKS.md, WEBHOOKS.md, ALLHOOKSWEBHOOKS.md, TREE.md, API.md, APIs_1.md, ENDPOINTS.md, ROUTES.md, STYLES.md, UNIVERSAL.md, QMOIAIUI.md, QMOISPACEUI.md, QCITYUI.md, QVILLAGEUI.md, QALPHAUI.md, FINANCIALMANAGER.md, QMOIMODEL.md, MERGE.md, and all other relevant .md files synchronized.',
        '- Apply Q Lion validation blocks and metadata to all .md files in the repository while continuing in bulk.',
        '- Validate Markdown, links, YAML, app manifests, and API documentation in a single bulk run and record outputs under .qmoi_validation/.',
        '- Include Qstore and Qcamera platform/device coverage in the bulk task list and resume tracker.',
        '- Verify every Qstore app listing includes a custom icon, feature summary, and platform-aware download link.',
        '- Refresh resumefromhere.txt before and after each bulk run so the resume tracker is always current.',
        '- Run scripts/merge_executor.py during bulk continuation to keep merge consolidation planning active and synced.',
        '- Keep merge phase statuses visible in resumefromhere.txt using merge execution summaries.',
        '- Merge duplicate API endpoints and route implementations only after copying unique logic into canonical sources.',
        '- Verify duplicate app entry points, legacy PWA HTML fallbacks, and stale route handlers are cleaned in sync with docs.',
        '- Keep MERGE.md updated whenever merge discovery, canonical app changes, or bulk consolidation work occurs.',
        '- Always update API.md, ENDPOINTS.md, ROUTES.md, TREE.md, and MERGE.md after any route, app entry point, wallet, balance, account, or merge change.',
        '- Use scripts/consolidate_api_endpoints.py to regenerate API, endpoint, and route docs whenever routes or APIs change.',
        '- Preserve every backlog item from 14.txt, undone.txt, MATCHES.txt, and resumefromhere.txt while working in bulk.',
        '- Never skip a new task that appears during a bulk run; add it to this file and the live task list immediately.',
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


def create_resume_backup() -> None:
    """Create a timestamped backup of resumefromhere.txt before bulk operations."""
    try:
        backup_dir = ROOT / 'var' / 'backups'
        backup_dir.mkdir(parents=True, exist_ok=True)

        if RESUME_FILE.exists():
            resume_content = RESUME_FILE.read_text(encoding='utf-8')
        else:
            resume_content = ''
            latest_backup = None
            backups = sorted(backup_dir.glob('resumefromhere.*.bak'), key=lambda p: p.stat().st_mtime, reverse=True)
            if backups:
                latest_backup = backups[0]
                try:
                    resume_content = latest_backup.read_text(encoding='utf-8')
                except Exception:
                    resume_content = ''

        ts = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
        backup_path = backup_dir / f'resumefromhere.{ts}.bak'
        backup_path.write_text(resume_content, encoding='utf-8')

        if not RESUME_FILE.exists() and resume_content:
            RESUME_FILE.write_text(resume_content, encoding='utf-8')

        print(f"✓ Created resumefromhere backup: {backup_path}")
    except Exception as exc:
        print(f"Warning: could not create resumefromhere backup: {exc}")


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


def update_merge_execution_summary() -> None:
    report_path = ROOT / ".qmoi_validation" / "merge_execution_report.json"
    if not report_path.exists():
        return

    try:
        report = json.loads(report_path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"Warning: failed to read merge execution report ({exc})")
        return

    phase_statuses = report.get("phases", {})
    if not phase_statuses:
        return

    lines = ["MERGE EXECUTION SUMMARY:"]
    for phase_key, phase_info in phase_statuses.items():
        status = phase_info.get("status", "UNKNOWN")
        description = phase_info.get("description", "")
        if description:
            lines.append(f"- {phase_key}: {status} ({description})")
        else:
            lines.append(f"- {phase_key}: {status}")

    stats = report.get("statistics", {})
    if stats:
        lines.append("")
        lines.append("MERGE EXECUTION STATISTICS:")
        for metric, value in stats.items():
            lines.append(f"- {metric.replace('_', ' ').title()}: {value}")

    new_block = "\n".join(lines) + "\n"
    resume_content = load_text_file(RESUME_FILE)
    if "MERGE EXECUTION SUMMARY:" in resume_content:
        resume_content = re.sub(r"MERGE EXECUTION SUMMARY:[\s\S]*?(?=\n\n[A-Z]|\Z)", new_block, resume_content, flags=re.MULTILINE)
    else:
        resume_content = resume_content.strip() + "\n\n" + new_block

    RESUME_FILE.write_text(resume_content, encoding="utf-8")
    print("✓ Updated resumefromhere.txt with the latest merge execution summary")


def write_merge_md_from_report() -> None:
    """If a merge execution report exists, write or update MERGE.md with an ordered plan
    so resumefromhere and MERGE.md stay synchronized."""
    report_path = ROOT / ".qmoi_validation" / "merge_execution_report.json"
    merge_md = ROOT / "MERGE.md"
    if not report_path.exists():
        return

    try:
        report = json.loads(report_path.read_text(encoding="utf-8"))
    except Exception:
        return

    lines = ["# MERGE Plan (auto-generated)", "\n"]
    phases = report.get("phases", {})
    order = report.get("phase_order", []) or list(phases.keys())
    lines.append("## Ordered Merge Phases")
    for i, phase in enumerate(order, start=1):
        info = phases.get(phase, {})
        status = info.get("status", "PENDING")
        desc = info.get("description", "")
        lines.append(f"{i}. **{phase}** — {status} {('- ' + desc) if desc else ''}")

    stats = report.get("statistics", {})
    if stats:
        lines.append('\n')
        lines.append('## Statistics')
        for k, v in stats.items():
            lines.append(f"- {k}: {v}")

    merge_md.write_text('\n'.join(lines), encoding='utf-8')
    print("✓ Wrote MERGE.md from merge execution report")


DUPLICATE_FILE_AUDIT_SCRIPT = ROOT / "scripts" / "duplicate_file_audit.py"
MERGE_DISCOVERY_SCANNER_SCRIPT = ROOT / "scripts" / "merge_discovery_scanner.py"


def run_merge_orchestration() -> bool:
    """Run the merge executor and return True if execution appears successful.
    This allows the bulk fixer to only run production replacements after merges finish."""
    if not MERGE_EXECUTOR_SCRIPT.exists():
        print(f"Info: {MERGE_EXECUTOR_SCRIPT} not found; skipping merge execution orchestrator.")
        return False

    # Try merge execution with retries to ensure merge phase completes before post-merge work
    max_attempts = 5
    for attempt in range(1, max_attempts + 1):
        print(f"Merge orchestrator attempt {attempt}/{max_attempts}")
        ok = run_command([sys.executable, str(MERGE_EXECUTOR_SCRIPT)], 'run merge execution orchestrator')
        update_merge_execution_summary()
        try:
            write_merge_md_from_report()
        except Exception:
            pass
        if ok:
            print("Merge orchestration completed successfully.")
            return True
        else:
            print(f"Merge orchestration attempt {attempt} failed; retrying in 10s...")
            time.sleep(10)

    print("Merge orchestration did not complete after retries; marking as failed for now.")
    return False



def run_bulk_fixer() -> None:
    """Execute a single high-impact bulk production pass across docs, automation, and validation workflows."""
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

    # Merge-first execution: discovery, merge orchestration, canonical documentation, then cleanup
    if MERGE_DISCOVERY_SCANNER_SCRIPT.exists():
        run_command([sys.executable, str(MERGE_DISCOVERY_SCANNER_SCRIPT)], 'scan for duplicate files and entry points for merge phase')
    else:
        print(f"Info: {MERGE_DISCOVERY_SCANNER_SCRIPT} not found; skipping merge discovery scan.")

    merge_ok = run_merge_orchestration()

    if CONSOLIDATE_API_ENDPOINTS_SCRIPT.exists():
        run_command([sys.executable, str(CONSOLIDATE_API_ENDPOINTS_SCRIPT)], 'consolidate API documentation')
    else:
        print(f"Info: {CONSOLIDATE_API_ENDPOINTS_SCRIPT} not found; skipping API consolidation.")

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

    # Only run the bulk production fixer (replacements to production code) after merge phase
    # completes successfully. This avoids applying production migrations to files that will
    # be removed/merged during consolidation.
    if merge_ok:
        if BULK_FIXER_SCRIPT.exists():
            run_command([sys.executable, str(BULK_FIXER_SCRIPT), "--scan"], 'run the bulk production workflow generator')
        else:
            print(f"Warning: {BULK_FIXER_SCRIPT} not found; skipping bulk workflow generation.")
    else:
        print("Info: Merge phase did not complete or was skipped — delaying bulk production replacements until merges are complete.")

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
    
    # Ensure MERGE.md and route documentation are updated if merge discovery produces new findings
    if MERGE_EXECUTOR_SCRIPT.exists() and MERGE_DISCOVERY_SCANNER_SCRIPT.exists():
        print('Ensuring merge plan and documentation remain current after merge discovery scans.')
    
    # Enhanced documentation synchronization
    if UPDATE_API_DOCS_SCRIPT.exists():
        run_command([sys.executable, str(UPDATE_API_DOCS_SCRIPT)], 'update API docs')
    else:
        print(f"Warning: {UPDATE_API_DOCS_SCRIPT} not found; skipping API docs update.")

    
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


def write_ordered_resume_plan() -> None:
    """Ensure resumefromhere.txt includes a clear, numbered ORDERED WORK PLAN that
    prioritizes merges first and documents script commands to run in bulk."""
    plan_block = []
    plan_block.append('ORDERED WORK PLAN (ENFORCED):')
    plan_block.append('1) MERGE PHASE (FIRST PRIORITY)')
    plan_block.append('   1.1 Run merge discovery: `python3 scripts/merge_discovery_scanner.py`')
    plan_block.append('   1.2 Run merge executor: `python3 scripts/merge_executor.py`')
    plan_block.append('   1.3 Produce merge report: .qmoi_validation/merge_execution_report.json')
    plan_block.append('   1.4 Update MERGE.md and resumefromhere.txt with ordered merge phases')
    plan_block.append('   1.5 Copy unique logic from duplicates into canonical sources (do not delete yet)')
    plan_block.append('')
    plan_block.append('2) PRE-MERGE VALIDATION & SAFE BACKUPS')
    plan_block.append('   2.1 Create atomic backup: var/backups/')
    plan_block.append('   2.2 Generate file tree hashes and duplicate matrix')
    plan_block.append('')
    plan_block.append('3) POST-MERGE IMPLEMENTATION (ONLY AFTER MERGE VERIFICATION PASSES)')
    plan_block.append('   3.1 Consolidate components to lib/components/ and update imports')
    plan_block.append('   3.2 Consolidate API routes: scripts/consolidate_api_endpoints.py')
    plan_block.append('   3.3 Run bulk production fixer (dry-run first): scripts/bulk_production_fixer.py --dry-run')
    plan_block.append('   3.4 Implement revenue and trading backlog from 7.txt: spot, futures, options, grid, arbitrage, market making, liquidity, staking, and lending flows')
    plan_block.append('   3.5 Route finance and trading updates through canonical API and UI shells, including Bitget/Binance and global finance modules')
    plan_block.append('   3.6 Sync FINANCIALMANAGER.md, QMOIMODEL.md, API.md, ENDPOINTS.md, and ROUTES.md with every finance/trading change')
    plan_block.append('')
    plan_block.append('4) DOCUMENTATION SYNC (RUN AS PART OF POST-MERGE)')
    plan_block.append('   4.1 Update API.md, ENDPOINTS.md, ROUTES.md, ALLMDFILESREFS.md')
    plan_block.append('')
    plan_block.append('5) FINALIZATION & VERIFICATION')
    plan_block.append('   5.1 Run end-to-end tests and smoke checks for each canonical app')
    plan_block.append('   5.2 Archive verification artifacts under .qmoi_validation/')
    plan_block.append('')

    # Also include tasks from continues.txt when present
    continues_tasks = load_continues_tasks()
    if continues_tasks:
        plan_block.append('\nCONTINUES.TXT TASKS:')
        for i, t in enumerate(continues_tasks, start=1):
            plan_block.append(f'   C{i}. {t} [PENDING]')

    # Load existing resume content and replace or insert ordered plan atomically
    content = load_text_file(RESUME_FILE)
    if content is None:
        return

    marker = 'ORDERED WORK PLAN (ENFORCED):'
    if marker in content:
        content = re.sub(r'ORDERED WORK PLAN \(ENFORCED\):[\s\S]*?(?=\n\n[A-Z0-9\s]|\Z)', '\n'.join(plan_block) + '\n\n', content, flags=re.MULTILINE)
    else:
        content = content.strip() + '\n\n' + '\n'.join(plan_block) + '\n'

    # atomic write
    tmpfd, tmppath = tempfile.mkstemp(prefix='resumefromhere.plan.', suffix='.tmp', dir=str(ROOT))
    try:
        with os.fdopen(tmpfd, 'w', encoding='utf-8') as fh:
            fh.write(content)
        Path(tmppath).replace(RESUME_FILE)
        print('✓ Wrote ordered work plan to resumefromhere.txt')
    finally:
        if Path(tmppath).exists():
            try:
                Path(tmppath).unlink()
            except Exception:
                pass


def load_continues_tasks() -> list:
    """Read `continues.txt` and return unchecked tasks as a list of strings."""
    p = ROOT / 'continues.txt'
    if not p.exists():
        return []
    tasks = []
    for line in p.read_text(encoding='utf-8', errors='ignore').splitlines():
        s = line.strip()
        # capture lines like '- [ ] task' or '- task' but prefer unchecked checklist
        m = None
        if s.startswith('- [ ]'):
            m = s[5:].strip()
        elif s.startswith('-') and '[x]' not in s:
            m = s.lstrip('-').strip()
        if m:
            tasks.append(m)
    # dedupe
    return list(dict.fromkeys(tasks))


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
    # Ensure resumefromhere.txt is backed up and refreshed before any bulk work
    create_resume_backup()
    refresh_resume_file()
    update_resume_tasks_block()
    # Ensure resumefromhere.txt contains the enforced ordered work plan before proceeding
    write_ordered_resume_plan()
    # snapshot resume state after task merge and before bulk run
    create_resume_backup()
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
