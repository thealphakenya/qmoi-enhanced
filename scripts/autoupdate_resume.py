#!/usr/bin/env python3
"""
Simple helper to update resumefromhere.txt with current timestamp, git commit, and branch.
Run locally in the repo to refresh progress notes without duplicating an existing header.
"""
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

    if lines[0].startswith("Resume point:"):
        idx = 0
        for idx, line in enumerate(lines):
            if line.strip() == "":
                break
        return "\n".join(lines[idx + 1 :]).lstrip('\n')

    return existing


def main():
    commit, branch, status = git_summary()
    now = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    content = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
    clean_content = normalize_content(content)
    header = f"Resume point: {now}\nGit commit: {commit}\nGit branch: {branch}\nRepository status: {'clean' if status == '' else 'dirty'}\n\n"
    OUT.write_text(header + clean_content, encoding="utf-8")
    print(f"Updated {OUT} with commit {commit} on branch {branch}")


if __name__ == '__main__':
    main()
