#!/usr/bin/env python3
"""
Auto-update resumefromhere.txt with repository metadata and resume tracking information.
This helper keeps the tracker fresh before bulk continuation runs.
"""
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "resumefromhere.txt"


def git_summary():
    try:
        commit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT).decode().strip()
        branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=ROOT).decode().strip()
        status = subprocess.check_output(["git", "status", "--porcelain"], cwd=ROOT).decode().strip()
        return commit, branch, status
    except Exception as e:
        return "(no-git)", "(no-branch)", str(e)


def normalize_content(existing: str) -> str:
    lines = existing.splitlines()
    if len(lines) < 3:
        return existing

    if lines[0].startswith("Resume update:") or lines[0].startswith("Resume point:"):
        idx = 0
        for idx, line in enumerate(lines):
            if line.strip() == "":
                break
        return "\n".join(lines[idx + 1 :]).lstrip('\n')

    return existing


def build_header(commit: str, branch: str, status: str) -> str:
    now = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    clean_state = 'clean' if status == '' else 'dirty'
    return (
        f"Last refreshed: {now}\n"
        f"Resume update: auto-synced before bulk continuation.\n"
        f"Resume point: continue from the next pending task after this header.\n"
        f"Git commit: {commit}\n"
        f"Git branch: {branch}\n"
        f"Repository status: {clean_state}\n"
        "\n"
        "Tracker rules:\n"
        "- Always update resumefromhere.txt before and after every bulk continuation run.\n"
        "- Always ensure all APIs are documented in API.md.\n"
        "- Always ensure all endpoints are documented in ENDPOINTS.md.\n"
        "- Always ensure all routes are documented in ROUTES.md.\n"
        "- Always ensure every .md file in the repository is indexed in ALLMDFILESREFS.md.\n"
        "- Keep this file as the authoritative progress tracker and task list for bulk work.\n"
        "\n"
    )


def main():
    commit, branch, status = git_summary()
    content = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    clean_content = normalize_content(content)
    header = build_header(commit, branch, status)
    OUT.write_text(header + clean_content, encoding="utf-8")
    print(f"Updated {OUT} with commit {commit} on branch {branch} and refreshed resume metadata.")


if __name__ == '__main__':
    main()
