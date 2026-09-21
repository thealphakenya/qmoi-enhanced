#!/usr/bin/env python3
"""Inventory and stage complete repository histories before a merge.

The command treats Git history as input, not just the checked-out tree. It
records every reachable ref, the union of paths present in each ref, and the
materialized historical snapshot before allowing a merge plan to proceed.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

HISTORY_NAME = "qmoi-enhanced-history-14"
QMOI_NAME = "qmoi-enhanced"
ALPHA_NAME = "Alpha-Q-ai"


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


def git_path_records(repo: Path, ref: str) -> dict[str, set[str]]:
    """Return path-to-blob identities across a Git ref's reachable tree."""
    result = subprocess.run(
        ["git", "-C", str(repo), "ls-tree", "-r", ref],
        check=True,
        capture_output=True,
        text=True,
    )
    records: dict[str, set[str]] = {}
    for line in result.stdout.splitlines():
        metadata, path = line.split("\t", 1)
        records.setdefault(path, set()).add(metadata.split()[2])
    return records


def git_tree_metrics(
    repo: Path, ref: str, prefix: str | None = None
) -> dict[str, Any]:
    """Return complete metrics for one historical Git tree."""
    command = ["git", "-C", str(repo), "ls-tree", "-r", "-l", ref]
    if prefix:
        command.extend(["--", prefix])
    result = subprocess.run(
        command,
        check=True,
        capture_output=True,
        text=True,
    )
    files: set[str] = set()
    directories: set[str] = set()
    symlinks = 0
    executable_files = 0
    bytes_total = 0
    entries: list[dict[str, Any]] = []
    normalized_prefix = prefix.rstrip("/") + "/" if prefix else ""
    for line in result.stdout.splitlines():
        metadata, raw_path = line.split("\t", 1)
        path = raw_path.removeprefix(normalized_prefix)
        mode, _kind, object_id, size = metadata.split()
        files.add(path)
        parent = Path(path).parent
        while parent != Path("."):
            directories.add(parent.as_posix())
            parent = parent.parent
        if mode == "120000":
            symlinks += 1
        if mode == "100755":
            executable_files += 1
        if size != "-":
            bytes_total += int(size)
        entries.append({
            "path": path,
            "mode": mode,
            "object": object_id,
            "bytes": None if size == "-" else int(size),
        })
    return {
        "ref": ref,
        "files": len(files),
        "directories": len(directories),
        "symlinks": symlinks,
        "executable_files": executable_files,
        "bytes": bytes_total,
        "entries": entries,
    }


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


def filesystem_fingerprints(root: Path) -> dict[str, set[str]]:
    """Return SHA-256 content identities for files in a materialized source."""
    fingerprints: dict[str, set[str]] = {}
    if not root.exists():
        return fingerprints
    for path in root.rglob("*"):
        if path.is_file() and not path.is_symlink():
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            fingerprints.setdefault(path.relative_to(root).as_posix(), set()).add(digest)
    return fingerprints


def inventory_repository(name: str, repo: Path) -> dict[str, Any]:
    refs = run_git(repo, "for-each-ref", "--format=%(refname)", "refs/heads", "refs/remotes", "refs/tags")
    paths_by_ref = {ref: git_paths(repo, ref) for ref in refs}
    fingerprints: dict[str, set[str]] = {}
    for ref in refs:
        for path, identities in git_path_records(repo, ref).items():
            fingerprints.setdefault(path, set()).update(identities)
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
        "content_fingerprints": {path: sorted(values) for path, values in fingerprints.items()},
        "filesystem": filesystem_metrics(repo),
    }


def stage_sources(sources: dict[str, Path], history: Path, staging: Path) -> dict[str, Any]:
    before = {name: inventory_repository(name, repo) for name, repo in sources.items()}
    before[HISTORY_NAME] = {
        "name": HISTORY_NAME,
        "classification": "HISTORICAL",
        "filesystem": filesystem_metrics(history),
        "content_fingerprints": {
            path: sorted(values) for path, values in filesystem_fingerprints(history).items()
        },
    }
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


def projected_tree_metrics(paths: set[str]) -> dict[str, int]:
    """Return deterministic file and directory counts for a projected tree."""
    directories = {
        parent.as_posix()
        for path in paths
        for parent in Path(path).parents
        if parent != Path(".")
    }
    return {"files": len(paths), "directories": len(directories)}


def classify_duplicate_content(content_by_source: dict[str, dict[str, set[str]]]) -> dict[str, Any]:
    """Classify duplicate paths as identical, additive variants, or conflicts."""
    path_sources: dict[str, dict[str, set[str]]] = {}
    for source, records in content_by_source.items():
        for path, identities in records.items():
            path_sources.setdefault(path, {})[source] = identities
    duplicate_paths = {path: sources for path, sources in path_sources.items() if len(sources) > 1}
    identical = []
    variants = []
    for path, sources in duplicate_paths.items():
        identities = set().union(*sources.values())
        (identical if len(identities) == 1 else variants).append(path)
    return {
        "duplicate_path_count": len(duplicate_paths),
        "identical_duplicate_count": len(identical),
        "variant_duplicate_count": len(variants),
        "identical_paths": sorted(identical),
        "variant_paths": sorted(variants),
        "formula": "variant duplicates require feature extraction and additive merge review; identical duplicates may be deduplicated after provenance capture",
    }


def build_base_merge_plan(report: dict[str, Any]) -> dict[str, Any]:
    """Build a read-only, provenance-aware projection for both destination repos.

    The historical snapshot is the QMOI base and the current Alpha tree is the
    Alpha base. Every source contributes its discovered history paths to both
    projections; duplicate paths are retained as provenance records and are
    never silently overwritten by this planning step.
    """
    before = report["before_copy"]
    history_paths = set(before[HISTORY_NAME]["filesystem"]["paths"])
    source_paths = {
        name: set(data["unique_history_paths"])
        for name, data in before.items()
        if name in {QMOI_NAME, ALPHA_NAME}
    }
    current_paths = {
        name: set(data["filesystem"]["paths"])
        for name, data in before.items()
        if name in {QMOI_NAME, ALPHA_NAME}
    }
    all_sources = {
        HISTORY_NAME: history_paths,
        QMOI_NAME: source_paths[QMOI_NAME] | current_paths[QMOI_NAME],
        ALPHA_NAME: source_paths[ALPHA_NAME] | current_paths[ALPHA_NAME],
    }
    content_by_source = {
        source: before[source].get("content_fingerprints", {})
        for source in all_sources
    }
    provenance: dict[str, list[str]] = {}
    for source, paths in all_sources.items():
        for path in paths:
            provenance.setdefault(path, []).append(source)
    conflicts = sorted(path for path, owners in provenance.items() if len(owners) > 1)
    union = set(provenance)
    projections = {
        QMOI_NAME: {
            "base": HISTORY_NAME,
            "overlays": [QMOI_NAME, ALPHA_NAME],
            "metrics": projected_tree_metrics(union),
        },
        ALPHA_NAME: {
            "base": ALPHA_NAME,
            "overlays": [HISTORY_NAME, QMOI_NAME],
            "metrics": projected_tree_metrics(union),
        },
    }
    return {
        "policy": "history-base-for-qmoi-and-current-alpha-base",
        "source_order": [HISTORY_NAME, QMOI_NAME, ALPHA_NAME],
        "projections": projections,
        "unique_union": projected_tree_metrics(union),
        "source_metrics": {
            source: projected_tree_metrics(paths) for source, paths in all_sources.items()
        },
        "conflict_count": len(conflicts),
        "conflicting_paths": conflicts,
        "provenance": {path: sorted(owners) for path, owners in provenance.items()},
        "requires_review_before_apply": bool(conflicts),
        "duplicate_content": classify_duplicate_content(content_by_source),
        "apply_mode": "plan-only; no files are copied or overwritten",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--qmoi", type=Path, required=True)
    parser.add_argument("--alpha", type=Path, required=True)
    parser.add_argument("--history", type=Path, required=True)
    parser.add_argument("--staging", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--merged-qmoi", type=Path)
    parser.add_argument("--merged-alpha", type=Path)
    parser.add_argument(
        "--historical-ref",
        help="Record an additional complete Git-tree snapshot from --qmoi.",
    )
    parser.add_argument(
        "--historical-prefix",
        default="Alpha-Q-ai",
        help="Path prefix for --historical-ref (default: Alpha-Q-ai).",
    )
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
    if args.historical_ref:
        report["historical_snapshots"] = {
            ALPHA_NAME: git_tree_metrics(
                args.qmoi.resolve(), args.historical_ref, args.historical_prefix
            )
        }
    report["base_merge_plan"] = build_base_merge_plan(report)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"ready": report["ready"], "report": str(args.report), "staging": str(args.staging)}, sort_keys=True))
    return 0 if report["ready"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
