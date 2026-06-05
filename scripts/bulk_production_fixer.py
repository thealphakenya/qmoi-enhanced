#!/usr/bin/env python3
"""
Bulk production fixer for qmoi-enhanced.
Scans repository files for remaining stub implementations, placeholder markers, and nonproduction scaffolding,
then updates resumefromhere.txt with a production-quality progress summary and next-step checklist.
"""

import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Pattern, Tuple

ROOT = Path(__file__).resolve().parents[1]
RESUME_FILE = ROOT / "resumefromhere.txt"
SCRIPTS_DIR = ROOT / "scripts"
EXCLUDED_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}
SOURCE_EXTENSIONS = {".py", ".js", ".ts", ".cjs", ".mjs", ".tsx", ".jsx"}
BATCH_SIZE = 40

STUB_PATTERNS: List[Pattern[str]] = [
    re.compile(r'"""Stub file for scripts/.*?"""', re.IGNORECASE),
    re.compile(r"'''Stub file for scripts/.*?'''", re.IGNORECASE),
    re.compile(r"logger\.info\('Stubbed file: .*?'\)", re.IGNORECASE),
    re.compile(r'logger\.info\("Stubbed file: .*?"\)', re.IGNORECASE),
]
PLACEHOLDER_PATTERNS: List[Pattern[str]] = [
    re.compile(r'\bTODO\b', re.IGNORECASE),
    re.compile(r'\bFIXME\b', re.IGNORECASE),
    re.compile(r'nonproduction|dev-only|mock|stubbed|stub file|placeholder', re.IGNORECASE),
]


def git_summary() -> Tuple[str, str, str]:
    try:
        commit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT).decode().strip()
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=ROOT).decode().strip()
        status = subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT).decode().strip()
        return commit, branch, status
    except Exception as exc:
        return "(no-git)", "(no-branch)", str(exc)


def is_excluded(path: Path) -> bool:
    return any(part in EXCLUDED_DIRS for part in path.parts)


def scan_files(patterns: List[Pattern[str]], directories: List[Path]) -> Dict[Path, List[str]]:
    results: Dict[Path, List[str]] = {}
    for directory in directories:
        if not directory.exists():
            continue
        for path in directory.rglob("*"):
            if path.is_dir() or is_excluded(path):
                continue
            if path.suffix.lower() not in SOURCE_EXTENSIONS:
                continue
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue

            matched: List[str] = []
            for pattern in patterns:
                if pattern.search(content):
                    matched.append(pattern.pattern)
            if matched:
                results[path.relative_to(ROOT)] = matched
    return results


def build_resume_entry(
    commit: str,
    branch: str,
    status: str,
    stubs: Dict[Path, List[str]],
    placeholders: Dict[Path, List[str]],
) -> str:
    now = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    summary_lines = [
        f"Resume update: {now}",
        "Action: Scanned repository for remaining production stub implementations and placeholders.",
        "Details:",
        f"- Found {len(stubs)} script(s) with stubbed automation markers.",
        f"- Found {len(placeholders)} file(s) containing placeholder or nonproduction patterns.",
        f"- Git commit: {commit}",
        f"- Git branch: {branch}",
        f"- Repository status: {'clean' if status == '' else 'dirty'}",
        "Next steps:",
    ]

    remaining_tasks = []
    if stubs:
        remaining_tasks.append(
            f"Replace the next {min(BATCH_SIZE, len(stubs))} stubbed script file(s) with production-ready implementations."
        )
    if placeholders:
        remaining_tasks.append(
            f"Review placeholder and dev-marker files and remove nonproduction scaffolding from {min(BATCH_SIZE, len(placeholders))} files."
        )
    if not remaining_tasks:
        remaining_tasks.append("Confirm production readiness for all script and source files, then mark the resume tracker complete.")

    remaining_tasks.extend([
        "Run scripts/bulk_production_fixer.py or scripts/auto_continue_resumefromhere.py after each batch.",
        "Keep resumefromhere.txt updated with completed items, next steps, and verified production fixes.",
        "When Node/npm become available, run `npm run type-check` and validate updated routes and components.",
    ])

    for task in remaining_tasks:
        summary_lines.append(f"- {task}")

    if stubs:
        sample_stubs = list(stubs.keys())[:min(12, len(stubs))]
        summary_lines.append("- Sample stub scripts:")
        for path in sample_stubs:
            summary_lines.append(f"  - {path}")

    if placeholders:
        sample_placeholders = list(placeholders.keys())[:min(12, len(placeholders))]
        summary_lines.append("- Sample placeholder files:")
        for path in sample_placeholders:
            summary_lines.append(f"  - {path}")

    return "\n".join(summary_lines) + "\n"


def update_resume_file(entry: str) -> None:
    content = RESUME_FILE.read_text(encoding="utf-8") if RESUME_FILE.exists() else ""
    RESUME_FILE.write_text(entry + "\n" + content, encoding="utf-8")


def main() -> None:
    commit, branch, status = git_summary()
    stub_files = scan_files(STUB_PATTERNS, [SCRIPTS_DIR])
    placeholder_files = scan_files(PLACEHOLDER_PATTERNS, [ROOT])

    entry = build_resume_entry(commit, branch, status, stub_files, placeholder_files)
    update_resume_file(entry)

    stub_count = len(stub_files)
    placeholder_count = len(placeholder_files)
    print(f"Bulk production fixer completed: {stub_count} stub file(s) detected, {placeholder_count} placeholder file(s) detected.")
    if stub_count:
        print("Run this script again after replacing stubbed script files to update progress.")
    if placeholder_count:
        print("Review listed placeholder files and convert them to production-grade implementation.")


if __name__ == '__main__':
    main()
