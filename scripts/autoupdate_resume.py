#!/usr/bin/env python3
"""
Simple helper to update resumefromhere.txt with current timestamp and git status.
Run locally in the repo to refresh progress notes.
"""
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "resumefromhere.txt"

def git_summary():
    try:
        commit = subprocess.check_output(["git","rev-parse","--short","HEAD"], cwd=ROOT).decode().strip()
        status = subprocess.check_output(["git","status","--porcelain"], cwd=ROOT).decode().strip()
        return commit, status
    except Exception as e:
        return "(no-git)", str(e)

def main():
    commit, status = git_summary()
    now = datetime.utcnow().isoformat() + "Z"
    content = OUT.read_text() if OUT.exists() else ""
    header = f"Resume point: {now}\nGit commit: {commit}\n\n"
    new = header + content
    OUT.write_text(new)
    print(f"Updated {OUT} with commit {commit}")

if __name__ == '__main__':
    main()
