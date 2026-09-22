#!/usr/bin/env python3
"""Audit and synchronize the Alpha-Q-ai and qmoi-enhanced repositories.

The default operation is read-only. Apply mode updates the target autosync branch
first and only promotes to main when --promote is explicitly supplied. The
script never force-pushes and treats qmoi-enhanced as the policy/master source
for the default direction.
"""

from __future__ import annotations

import argparse
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

QMOI_NAME = "qmoi-enhanced"
ALPHA_NAME = "Alpha-Q-ai"
DEFAULT_BACKUP_BRANCH = "autosync-backup"


def run_git(repo: Path, *args: str, check: bool = True) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=check,
        capture_output=True,
        text=True,
    )
    if check:
        return result.stdout.strip()
    return result.stdout.strip()


def branch_sha(repo: Path, branch: str) -> str | None:
    value = run_git(repo, "rev-parse", f"refs/remotes/origin/{branch}", check=False)
    return value or None


def repo_metrics(repo: Path, branch: str) -> dict[str, Any]:
    sha = run_git(repo, "rev-parse", f"origin/{branch}", check=False) or None
    files = run_git(repo, "ls-tree", "-r", "--name-only", f"origin/{branch}", check=False)
    paths = [line for line in files.splitlines() if line]
    directories = {str(Path(path).parent) for path in paths if Path(path).parent != Path(".")}
    return {"branch": branch, "sha": sha, "files": len(paths), "directories": len(directories)}


def cross_repo_ancestry(
    source_repo: Path,
    source_branch: str,
    target_repo: Path,
    target_branch: str,
) -> dict[str, Any]:
    source = branch_sha(source_repo, source_branch)
    target = branch_sha(target_repo, target_branch)
    if not source or not target:
        return {"source": source, "target": target, "ahead": None, "behind": None, "same_commit": False, "fast_forward_possible": False}
    if source == target:
        return {"source": source, "target": target, "ahead": 0, "behind": 0, "same_commit": True, "fast_forward_possible": True}
    target_in_source = subprocess.run(
        ["git", "-C", str(source_repo), "cat-file", "-e", f"{target}^{{commit}}"],
        check=False,
    ).returncode == 0
    fast_forward = target_in_source and subprocess.run(
        ["git", "-C", str(source_repo), "merge-base", "--is-ancestor", target, source],
        check=False,
    ).returncode == 0
    return {"source": source, "target": target, "ahead": None, "behind": None, "same_commit": False, "target_object_available_in_source": target_in_source, "fast_forward_possible": fast_forward}


def audit(qmoi: Path, alpha: Path, backup_branch: str) -> dict[str, Any]:
    for repo in (qmoi, alpha):
        run_git(repo, "fetch", "origin", "--prune")
    return {
        "captured_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "master": QMOI_NAME,
        "repositories": {
            QMOI_NAME: {
                "root": str(qmoi),
                "main": repo_metrics(qmoi, "main"),
                "backup": repo_metrics(qmoi, backup_branch),
            },
            ALPHA_NAME: {
                "root": str(alpha),
                "main": repo_metrics(alpha, "main"),
                "backup": repo_metrics(alpha, backup_branch),
            },
        },
        "directions": {
            "qmoi-to-alpha": cross_repo_ancestry(qmoi, "main", alpha, "main"),
            "alpha-to-qmoi": cross_repo_ancestry(alpha, "main", qmoi, "main"),
        },
    }


def push_fast_forward(target: Path, source: Path, target_branch: str, source_branch: str) -> None:
    source_sha = run_git(source, "rev-parse", f"origin/{source_branch}")
    target_ref = f"refs/remotes/origin/{target_branch}"
    target_sha = run_git(target, "rev-parse", target_ref, check=False)
    if target_sha and target_sha != source_sha:
        target_in_source = subprocess.run(
            ["git", "-C", str(source), "cat-file", "-e", f"{target_sha}^{{commit}}"],
            check=False,
        ).returncode == 0
        is_ancestor = target_in_source and subprocess.run(
            ["git", "-C", str(source), "merge-base", "--is-ancestor", target_sha, source_sha],
            check=False,
        ).returncode == 0
        if not is_ancestor:
            raise RuntimeError(f"Refusing non-fast-forward update of {target_branch}: review conflict first")
    run_git(target, "push", "origin", f"{source_sha}:refs/heads/{target_branch}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--qmoi", type=Path, required=True, help="Local qmoi-enhanced checkout")
    parser.add_argument("--alpha", type=Path, required=True, help="Local Alpha-Q-ai checkout")
    parser.add_argument("--direction", choices=("audit", "qmoi-to-alpha", "alpha-to-qmoi"), default="audit")
    parser.add_argument("--backup-branch", default=DEFAULT_BACKUP_BRANCH)
    parser.add_argument("--apply", action="store_true", help="Push the source main commit to the target backup branch")
    parser.add_argument("--promote", action="store_true", help="After backup sync, also promote to target main")
    parser.add_argument("--report", type=Path, help="Write the audit JSON report")
    args = parser.parse_args()

    qmoi = args.qmoi.resolve()
    alpha = args.alpha.resolve()
    report = audit(qmoi, alpha, args.backup_branch)
    report["requested_direction"] = args.direction
    report["apply"] = args.apply
    report["promote"] = args.promote

    if args.apply and args.direction == "audit":
        parser.error("--apply requires --direction qmoi-to-alpha or alpha-to-qmoi")
    if args.promote and not args.apply:
        parser.error("--promote requires --apply")

    if args.apply:
        source, target = (qmoi, alpha) if args.direction == "qmoi-to-alpha" else (alpha, qmoi)
        push_fast_forward(target, source, args.backup_branch, "main")
        if args.promote:
            push_fast_forward(target, source, "main", "main")
        report["applied"] = {"source": str(source), "target": str(target), "backup_branch": args.backup_branch, "promoted": args.promote}

    payload = json.dumps(report, indent=2, sort_keys=True)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(payload + "\n", encoding="utf-8")
    print(payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
