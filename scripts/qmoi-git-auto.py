#!/usr/bin/env python3
"""
QMOI Git Automation System
Comprehensive Git operations automation with conflict resolution and synchronization
"""

import os
import sys
import json
import subprocess
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
import git
from git import Repo, GitCommandError
logger = logging.getLogger("qmoi_git_auto")
logger.setLevel(logging.INFO)
if not logger.handlers:
    fh = logging.FileHandler("qmoi-git-auto.log")
    sh = logging.StreamHandler()
    fmt = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    fh.setFormatter(fmt)
    sh.setFormatter(fmt)
    logger.addHandler(fh)
    logger.addHandler(sh)


class QMOIGitAuto:
    """A small helper around GitPython for automated workflows.

    Methods intentionally keep behavior conservative: they log errors and
    return dictionaries describing the outcome so callers (scripts/CI)
    can make decisions, retry, or surface diagnostics.
    """

    def __init__(self, workspace_path: Optional[str] = None):
        self.workspace_path = workspace_path or os.getcwd()
        self.repo: Optional[Repo] = None
        self.git_operations: List[Dict[str, Any]] = []

        try:
            self.repo = Repo(self.workspace_path)
            logger.info("Git repository initialized successfully")
        except Exception as exc:  # keep broad to surface environment issues
            logger.error("Failed to initialize Git repository: %s", exc)

    def _has_head(self) -> bool:
        try:
            # Accessing head may raise if repository has no commits yet
            _ = self.repo.head.commit  # type: ignore
            return True
        except Exception:
            return False

    def add_all_files(self) -> Dict[str, Any]:
        """Stage all changes (equivalent to 'git add --all')."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "add_all", "status": "error", "error": msg}

        try:
            # Use GitPython low-level git interface to add all
            self.repo.git.add("--all")

            # List staged files relative to HEAD when possible
            staged = []
            if self._has_head():
                staged = [d.a_path for d in self.repo.index.diff("HEAD")]
            else:
                staged = list(self.repo.index.entries.keys())

            op = {
                "operation": "add_all",
                "status": "success",
                "files_staged": len(staged),
                "staged_files": staged,
                "timestamp": datetime.now().isoformat(),
            }
            self.git_operations.append(op)
            logger.info("Staged %d files", len(staged))
            return op
        except GitCommandError as exc:
            msg = f"git add failed: {exc}"
            logger.error(msg)
            return {"operation": "add_all", "status": "error", "error": msg}

    def commit_changes(self, message: Optional[str] = None) -> Dict[str, Any]:
        """Commit staged changes. If no message provided, generate a short one."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "commit", "status": "error", "error": msg}

        try:
            # Determine whether there is anything staged to commit
            has_changes = False
            if self._has_head():
                has_changes = len(self.repo.index.diff("HEAD")) > 0
            else:
                # If there's no HEAD, committing is allowed when there are entries
                has_changes = len(self.repo.index.entries) > 0

            if not has_changes:
                return {
                    "operation": "commit",
                    "status": "skipped",
                    "message": "No changes to commit",
                    "timestamp": datetime.now().isoformat(),
                }

            if not message:
                message = self.generate_commit_message()

            commit = self.repo.index.commit(message)

            op = {
                "operation": "commit",
                "status": "success",
                "commit_hash": commit.hexsha,
                "commit_message": message,
                "timestamp": datetime.now().isoformat(),
            }
            self.git_operations.append(op)
            logger.info("Committed changes: %s", message)
            return op
        except Exception as exc:
            msg = f"commit failed: {exc}"
            logger.error(msg)
            return {"operation": "commit", "status": "error", "error": msg}

    def generate_commit_message(self) -> str:
        """Create a short commit message summarizing staged file types."""
        try:
            staged = []
            if self._has_head():
                staged = [d.a_path for d in self.repo.index.diff("HEAD")]
            else:
                staged = list(self.repo.index.entries.keys())

            counts: Dict[str, int] = {}
            for path in staged:
                _, ext = os.path.splitext(path)
                if not ext:
                    ext = ".unknown"
                counts[ext] = counts.get(ext, 0) + 1

            msg = f"QMOI Auto-Update: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            if counts:
                msg += "\nChanges:\n"
                for ext, cnt in counts.items():
                    msg += f"- {cnt} {ext} file(s)\n"
            msg += "\nAutomated by QMOI Git Automation System"
            return msg
        except Exception:
            return f"QMOI Auto-Update: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"

    def push_changes(self, remote: str = "origin", branch: Optional[str] = None) -> Dict[str, Any]:
        """Push current branch (or provided branch) to the given remote."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "push", "status": "error", "error": msg}

        try:
            if not branch:
                branch = self.repo.active_branch.name

            push_info = self.repo.remotes[remote].push(branch)

            op = {
                "operation": "push",
                "status": "success",
                "remote": remote,
                "branch": branch,
                "push_info": [str(p) for p in push_info],
                "timestamp": datetime.now().isoformat(),
            }
            self.git_operations.append(op)
            logger.info("Pushed changes to %s/%s", remote, branch)
            return op
        except Exception as exc:
            msg = f"push failed: {exc}"
            logger.error(msg)
            return {"operation": "push", "status": "error", "error": msg}

    def pull_latest(self, remote: str = "origin", branch: Optional[str] = None) -> Dict[str, Any]:
        """Pull latest changes from remote into the current branch."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "pull", "status": "error", "error": msg}

        try:
            if not branch:
                branch = self.repo.active_branch.name

            pull_info = self.repo.remotes[remote].pull(branch)
            op = {
                "operation": "pull",
                "status": "success",
                "remote": remote,
                "branch": branch,
                "pull_info": [str(p) for p in pull_info],
                "timestamp": datetime.now().isoformat(),
            }
            self.git_operations.append(op)
            logger.info("Pulled latest changes from %s/%s", remote, branch)
            return op
        except Exception as exc:
            msg = f"pull failed: {exc}"
            logger.error(msg)
            return {"operation": "pull", "status": "error", "error": msg}

    def resolve_conflicts(self) -> Dict[str, Any]:
        """Attempt a conservative automatic conflict resolution.

        Strategy: for each unmerged file we choose 'ours' and stage the file.
        This is a conservative approach for automation; callers should review
        the results before merging into protected branches.
        """
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "resolve_conflicts", "status": "error", "error": msg}

        try:
            unmerged = self.repo.index.unmerged_blobs()
            if not unmerged:
                return {"operation": "resolve_conflicts", "status": "skipped", "message": "No conflicts to resolve", "timestamp": datetime.now().isoformat()}

            resolved = []
            for path in unmerged.keys():
                # checkout 'ours' version, stage file
                try:
                    self.repo.git.checkout("--ours", "--", path)
                    self.repo.index.add([path])
                    resolved.append(path)
                except Exception as exc:
                    logger.error("Failed resolving %s: %s", path, exc)

            op = {
                "operation": "resolve_conflicts",
                "status": "success",
                "resolved_files": resolved,
                "timestamp": datetime.now().isoformat(),
            }
            self.git_operations.append(op)
            logger.info("Resolved conflicts for %d files", len(resolved))
            return op
        except Exception as exc:
            msg = f"resolve_conflicts failed: {exc}"
            logger.error(msg)
            return {"operation": "resolve_conflicts", "status": "error", "error": msg}

    def sync_repositories(self) -> Dict[str, Any]:
        """Fetch & pull from each remote, then push any local changes."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "sync_repositories", "status": "error", "error": msg}

        sync_results: List[Dict[str, Any]] = []
        try:
            for remote in self.repo.remotes:
                try:
                    remote.fetch()
                    pull_result = self.pull_latest(remote.name)
                    sync_results.append(pull_result)
                    if self.repo.is_dirty():
                        push_result = self.push_changes(remote.name)
                        sync_results.append(push_result)
                except Exception as exc:
                    sync_results.append({"remote": remote.name, "status": "error", "error": str(exc)})

            op = {"operation": "sync_repositories", "status": "success", "sync_results": sync_results, "timestamp": datetime.now().isoformat()}
            self.git_operations.append(op)
            logger.info("Synchronized with %d remotes", len(self.repo.remotes))
            return op
        except Exception as exc:
            msg = f"sync_repositories failed: {exc}"
            logger.error(msg)
            return {"operation": "sync_repositories", "status": "error", "error": msg}

    def create_backup_branch(self, branch_name: Optional[str] = None) -> Dict[str, Any]:
        """Create a backup branch before major operations."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "create_backup_branch", "status": "error", "error": msg}

        try:
            if not branch_name:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                branch_name = f"qmoi-backup-{timestamp}"

            new_branch = self.repo.create_head(branch_name)
            new_branch.checkout()

            op = {"operation": "create_backup_branch", "status": "success", "branch_name": branch_name, "timestamp": datetime.now().isoformat()}
            self.git_operations.append(op)
            logger.info("Created backup branch: %s", branch_name)
            return op
        except Exception as exc:
            msg = f"create_backup_branch failed: {exc}"
            logger.error(msg)
            return {"operation": "create_backup_branch", "status": "error", "error": msg}

    def run_comprehensive_git_operations(self) -> Dict[str, Any]:
        """Run a conservative sequence of Git operations and save a JSON report."""
        logger.info("Starting comprehensive Git operations...")
        results: Dict[str, Any] = {"timestamp": datetime.now().isoformat(), "operations": []}

        results["operations"].append(self.create_backup_branch())
        results["operations"].append(self.add_all_files())
        results["operations"].append(self.commit_changes())
        results["operations"].append(self.pull_latest())
        results["operations"].append(self.resolve_conflicts())
        results["operations"].append(self.push_changes())
        results["operations"].append(self.sync_repositories())

        try:
            with open("qmoi-git-operations-results.json", "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2)
        except Exception as exc:
            logger.warning("Failed to write results file: %s", exc)

        logger.info("Comprehensive Git operations completed")
        return results

    def get_git_status(self) -> Dict[str, Any]:
        """Return a compact status summary for the repository."""
        if not self.repo:
            msg = "Git repository not initialized"
            logger.error(msg)
            return {"operation": "get_git_status", "status": "error", "error": msg}

        try:
            status = {
                "active_branch": self.repo.active_branch.name,
                "is_dirty": self.repo.is_dirty(),
                "untracked_files": len(self.repo.untracked_files),
                "staged_files": len(self.repo.index.diff("HEAD")) if self._has_head() else len(self.repo.index.entries),
                "remotes": [remote.name for remote in self.repo.remotes],
                "last_commit_hash": self.repo.head.commit.hexsha if self._has_head() else None,
                "last_commit_message": self.repo.head.commit.message if self._has_head() else None,
                "operation_history": self.git_operations[-10:],
            }
            return status
        except Exception as exc:
            return {"operation": "get_git_status", "status": "error", "error": str(exc)}


def main() -> None:
    git_auto = QMOIGitAuto()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "--add-all":
            result = git_auto.add_all_files()
            print(json.dumps(result, indent=2))

        elif command == "--commit-all":
            message = sys.argv[2] if len(sys.argv) > 2 else None
            result = git_auto.commit_changes(message)
            print(json.dumps(result, indent=2))

        elif command == "--push-all":
            remote = sys.argv[2] if len(sys.argv) > 2 else "origin"
            branch = sys.argv[3] if len(sys.argv) > 3 else None
            result = git_auto.push_changes(remote, branch)
            print(json.dumps(result, indent=2))

        elif command == "--pull-latest":
            remote = sys.argv[2] if len(sys.argv) > 2 else "origin"
            branch = sys.argv[3] if len(sys.argv) > 3 else None
            result = git_auto.pull_latest(remote, branch)
            print(json.dumps(result, indent=2))

        elif command == "--resolve-conflicts":
            result = git_auto.resolve_conflicts()
            print(json.dumps(result, indent=2))

        elif command == "--sync-repositories":
            result = git_auto.sync_repositories()
            print(json.dumps(result, indent=2))

        elif command == "--comprehensive":
            result = git_auto.run_comprehensive_git_operations()
            print(json.dumps(result, indent=2))

        elif command == "--status":
            result = git_auto.get_git_status()
            print(json.dumps(result, indent=2))

        else:
            print("Usage:")
            print("  python qmoi-git-auto.py --add-all")
            print("  python qmoi-git-auto.py --commit-all [message]")
            print("  python qmoi-git-auto.py --push-all [remote] [branch]")
            print("  python qmoi-git-auto.py --pull-latest [remote] [branch]")
            print("  python qmoi-git-auto.py --resolve-conflicts")
            print("  python qmoi-git-auto.py --sync-repositories")
            print("  python qmoi-git-auto.py --comprehensive")
            print("  python qmoi-git-auto.py --status")
    else:
        # Run comprehensive operations by default
        result = git_auto.run_comprehensive_git_operations()
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
