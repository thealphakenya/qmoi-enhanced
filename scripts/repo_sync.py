#!/usr/bin/env python3
"""Helpers for keeping qmoi-enhanced aligned with the Alpha Q AI repository."""
from __future__ import annotations

import os
import subprocess
from typing import Optional


def resolve_target_repo(default: Optional[str] = None) -> str:
    """Resolve the repository to sync with, preferring an explicit env override."""
    candidate = os.environ.get("QMOI_SYNC_TARGET_REPO") or default or "thealphakenya/Alpha_Q_running"
    return candidate.strip() or (default or "thealphakenya/Alpha_Q_running")


def resolve_target_branch(branch_name: Optional[str] = None) -> str:
    """Resolve the branch to sync to, defaulting to main for main branch work."""
    candidate = branch_name or os.environ.get("QMOI_SYNC_TARGET_BRANCH") or os.environ.get("GITHUB_REF_NAME") or "main"
    return candidate.strip() or "main"


def build_sync_command(repo: Optional[str] = None, branch: Optional[str] = None) -> list[str]:
    """Build the git command used to mirror the current branch to a target repo."""
    target_repo = resolve_target_repo(repo)
    target_branch = resolve_target_branch(branch)
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        return ["git", "push", f"https://x-access-token:{token}@github.com/{target_repo}.git", f"HEAD:{target_branch}"]
    return ["git", "push", f"https://github.com/{target_repo}.git", f"HEAD:{target_branch}"]


def main() -> int:
    """Execute the sync command for the current repository state."""
    command = build_sync_command()
    result = subprocess.run(command, check=False)
    return int(result.returncode)


if __name__ == "__main__":
    raise SystemExit(main())
