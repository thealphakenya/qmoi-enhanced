#!/usr/bin/env python3
"""Inventory and stage complete repository histories before a merge.

The command treats Git history as input, not just the checked-out tree. It
records every reachable ref, the union of paths present in each ref, and the
materialized historical snapshot before allowing a merge plan to proceed.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

HISTORY_NAME = "qmoi-enhanced-history-14"


def run_git(repo: Path, *args: str) -> list[str]:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return [line for line in result.stdout.splitlines() if line]


def git_paths(repo: Path, ref: str) -> list[str]:
    result = subprocess.run(
        ["git", "-C", str(repo), "ls-tree", "-r", "-z", ref],
        check=True,
        capture_output=True,
    )
    paths = []
    for entry in result.stdout.decode("utf-8", errors="surrogateescape").split("\0"):
        if not entry:
            continue
        paths.append(entry.split("\t", 1)[1])
    return sorted(set(paths))


def filesystem_metrics(root: Path) -> dict[str, Any]:
    files = directories = symlinks = 0
    paths: list[str] = []
    if root.exists():
        for path in sorted(root.rglob("*")):
            paths.append(path.relative_to(root).as_posix())
            if path.is_symlink():
                symlinks += 1
            elif path.is_dir():
                directories += 1
            elif path.is_file():
                files += 1
    return {
        "root": str(root),
        "files": files,
        "directories": directories,
        "symlinks": symlinks,
        "paths": paths,
    }


def inventory_repository(name: str, repo: Path) -> dict[str, Any]:
    refs = run_git(repo, "for-each-ref", "--format=%(refname)", "refs/heads", "refs/remotes", "refs/tags")
    paths_by_ref = {ref: git_paths(repo, ref) for ref in refs}
    union = sorted({path for paths in paths_by_ref.values() for path in paths})
    commits = run_git(repo, "rev-list", "--all")
    return {
        "name": name,
        "root": str(repo.resolve()),
        "refs": refs,
        "ref_count": len(refs),
        "reachable_commit_count": len(commits),
        "paths_by_ref": paths_by_ref,
        "unique_history_paths": union,
        "history_file_count": len(union),
        "history_directory_count": len({str(Path(path).parent) for path in union if Path(path).parent != Path(".")}),
        "filesystem": filesystem_metrics(repo),
    }


def stage_sources(sources: dict[str, Path], history: Path, staging: Path) -> dict[str, Any]:
    before = {name: inventory_repository(name, repo) for name, repo in sources.items()}
    before[HISTORY_NAME] = {"name": HISTORY_NAME, "classification": "HISTORICAL", "filesystem": filesystem_metrics(history)}
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)

    staged: dict[str, Path] = {}
    for name, repo in sources.items():
        destination = staging / name
        shutil.copytree(repo, destination, symlinks=True)
        staged[name] = destination
        subprocess.run(
            ["git", "-C", str(repo), "bundle", "create", str(staging / f"{name}.git.bundle"), "--all"],
            check=True,
            capture_output=True,
            text=True,
        )
    history_destination = staging / HISTORY_NAME
    shutil.copytree(history, history_destination, symlinks=True)
    staged[HISTORY_NAME] = history_destination

    after = {name: filesystem_metrics(repo) for name, repo in staged.items()}
    missing = {
        name: sorted(set(before[name]["filesystem"]["paths"]) - set(after[name]["paths"]))
        for name in before
        if set(before[name]["filesystem"]["paths"]) - set(after[name]["paths"])
    }
    return {
        "ready": not missing,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "sequence": ["inventory-before-copy", "copy-verified"],
        "before_copy": before,
        "staged_filesystem": after,
        "missing_paths": missing,
        "staging_root": str(staging),
    }


def add_after_merge_metrics(report: dict[str, Any], merged: dict[str, Path]) -> dict[str, Any]:
    """Append final-tree metrics without changing the pre-copy evidence."""
    after_merge = {
        name: filesystem_metrics(root)
        for name, root in merged.items()
    }
    report["after_merge"] = after_merge
    report["sequence"] = ["inventory-before-copy", "copy-verified", "after-merge"]
    report["status"] = "complete"
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--qmoi", type=Path, required=True)
    parser.add_argument("--alpha", type=Path, required=True)
    parser.add_argument("--history", type=Path, required=True)
    parser.add_argument("--staging", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--merged-qmoi", type=Path)
    parser.add_argument("--merged-alpha", type=Path)
    args = parser.parse_args()
    report = stage_sources(
        {"qmoi-enhanced": args.qmoi.resolve(), "Alpha-Q-ai": args.alpha.resolve()},
        args.history.resolve(),
        args.staging.resolve(),
    )
    if args.merged_qmoi and args.merged_alpha:
        add_after_merge_metrics(report, {
            "qmoi-enhanced": args.merged_qmoi.resolve(),
            "Alpha-Q-ai": args.merged_alpha.resolve(),
        })
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"ready": report["ready"], "report": str(args.report), "staging": str(args.staging)}, sort_keys=True))
    return 0 if report["ready"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
