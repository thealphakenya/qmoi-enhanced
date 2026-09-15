#!/usr/bin/env python3
"""Materialize a provenance-preserving merged QMOI repository workspace.

The command is intentionally fail-closed: it will not create the target until
an Alpha-Q-ai source is supplied and the source inventories are captured. The
result keeps active and historical trees in separate namespaces so conflicting
paths are never silently overwritten.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

HISTORY_DIR = "qmoi-enhanced-history-14"
TARGET_DIR = "qmoi-enhanced"
EXCLUDED = {".git", ".pytest_cache", ".ruff_cache", "__pycache__", ".venv", "venv", "node_modules"}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def run_git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def git_optional(repo: Path, *args: str) -> str | None:
    try:
        return run_git(repo, *args) or None
    except (OSError, subprocess.CalledProcessError):
        return None


def git_refs(repo: Path) -> list[str]:
    output = git_optional(repo, "for-each-ref", "--format=%(refname)", "refs/heads", "refs/remotes") or ""
    return [ref for ref in output.splitlines() if ref]


def safe_ref_name(ref: str) -> str:
    return ref.replace("refs/", "").replace("/", "__").replace("\\", "__")


def branch_markdown_records(repo: Path, source_name: str, history_root: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    source_root = history_root / source_name
    for ref in git_refs(repo):
        paths = git_optional(repo, "ls-tree", "-r", "--name-only", ref) or ""
        ref_root = source_root / safe_ref_name(ref)
        for path_text in paths.splitlines():
            relative = Path(path_text)
            if relative.suffix.lower() != ".md" or any(part in EXCLUDED for part in relative.parts):
                continue
            try:
                content = subprocess.run(
                    ["git", "-C", str(repo), "show", f"{ref}:{path_text}"],
                    check=True,
                    capture_output=True,
                ).stdout
            except (OSError, subprocess.CalledProcessError):
                continue
            destination = ref_root / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(content)
            records.append(
                {
                    "path": path_text,
                    "source": source_name,
                    "source_ref": ref,
                    "source_commit": git_optional(repo, "rev-parse", ref),
                    "created_at": git_optional(repo, "log", "--reverse", "-1", "--format=%aI", ref, "--", path_text),
                    "updated_at": git_optional(repo, "log", "-1", "--format=%cI", ref, "--", path_text),
                    "timestamp_basis": "Git ref author/committer metadata",
                    "sha256": hashlib.sha256(content).hexdigest(),
                    "snapshot": str(destination.relative_to(history_root)),
                }
            )
    return records


def copy_tree(
    source: Path,
    destination: Path,
    ignored_path: Path | None = None,
    ignored_names: set[str] | None = None,
) -> int:
    destination.mkdir(parents=True, exist_ok=True)
    copied = 0
    for item in sorted(source.iterdir()):
        if ignored_path is not None and item.resolve() == ignored_path.resolve():
            continue
        if item.name in EXCLUDED or (ignored_names and item.name in ignored_names):
            continue
        target = destination / item.name
        if item.is_symlink():
            target.parent.mkdir(parents=True, exist_ok=True)
            target.symlink_to(item.readlink())
        elif item.is_dir():
            copied += copy_tree(item, target, ignored_path, ignored_names)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)
            copied += 1
    return copied


def file_digest(path: Path) -> str | None:
    if not path.is_file():
        return None
    digest = hashlib.sha256()
    try:
        with path.open("rb") as stream:
            for block in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(block)
    except OSError:
        return None
    return digest.hexdigest()


def active_markdown_provenance(repo: Path, relative: Path) -> dict[str, Any]:
    path = relative.as_posix()
    created = git_optional(repo, "log", "--reverse", "-1", "--format=%aI", "--", path)
    updated = git_optional(repo, "log", "-1", "--format=%cI", "--", path)
    commit = git_optional(repo, "log", "-1", "--format=%H", "--", path)
    return {
        "path": path,
        "source": "qmoi-enhanced",
        "source_ref": git_optional(repo, "branch", "--show-current") or "working-tree",
        "source_commit": commit,
        "created_at": created,
        "updated_at": updated,
        "timestamp_basis": "git author/committer metadata",
        "sha256": file_digest(repo / relative),
    }


def snapshot_markdown_provenance(source: Path, relative: Path) -> dict[str, Any]:
    path = relative.as_posix()
    stat = source.stat()
    return {
        "path": path,
        "source": HISTORY_DIR,
        "source_ref": "materialized historical snapshot",
        "source_commit": None,
        "created_at": None,
        "updated_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat().replace("+00:00", "Z"),
        "timestamp_basis": "filesystem mtime; snapshot has no .git metadata",
        "sha256": file_digest(source),
    }


def markdown_manifest(root: Path, active_repo: Path, alpha_repo: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    active_root = root / "sources" / "qmoi-enhanced"
    history_root = root / "sources" / HISTORY_DIR
    for path in sorted(active_root.rglob("*.md")):
        if any(part in EXCLUDED for part in path.relative_to(active_root).parts):
            continue
        records.append(active_markdown_provenance(active_repo, path.relative_to(active_root)))
    for path in sorted(history_root.rglob("*.md")):
        if any(part in EXCLUDED for part in path.relative_to(history_root).parts):
            continue
        records.append(snapshot_markdown_provenance(path, path.relative_to(history_root)))
    alpha_root = root / "sources" / "Alpha-Q-ai"
    if alpha_root.exists():
        for path in sorted(alpha_root.rglob("*.md")):
            if any(part in EXCLUDED for part in path.relative_to(alpha_root).parts):
                continue
            record = active_markdown_provenance(alpha_repo, path.relative_to(alpha_root))
            record["source"] = "Alpha-Q-ai"
            records.append(record)
    return records


def write_markdown_reference(root: Path, records: list[dict[str, Any]], pending: list[str], history_records: list[dict[str, Any]]) -> None:
    lines = [
        "# ALLMDFILESREFS.md - Materialized Merge Provenance",
        "",
        f"Generated: {utc_now()}",
        "",
        "Every markdown file is listed with source, ref, commit, creation/update evidence, and SHA-256.",
        "Snapshot files without Git metadata explicitly retain null commit/creation values rather than inferred history.",
        f"MARKDOWN_HISTORY contains {len(history_records)} Markdown snapshots from all discovered repository refs.",
        "",
        "## Pending Sources",
        "",
    ]
    lines.extend(f"- {item}" for item in pending)
    lines.extend(["", "## Markdown Files", "", "| Path | Source | Ref | Commit | Created | Updated | SHA-256 |", "|---|---|---|---|---|---|---|"])
    for record in records:
        lines.append(
            "| {path} | {source} | {source_ref} | {source_commit} | {created_at} | {updated_at} | {sha256} |".format(
                **{key: value or "unknown" for key, value in record.items()}
            )
        )
    lines.extend(["", "## Markdown History Snapshots", "", "| Path | Source | Ref | Commit | Created | Updated | Snapshot | SHA-256 |", "|---|---|---|---|---|---|---|---|"])
    for record in history_records:
        lines.append(
            "| {path} | {source} | {source_ref} | {source_commit} | {created_at} | {updated_at} | {snapshot} | {sha256} |".format(
                **{key: value or "unknown" for key, value in record.items()}
            )
        )
    (root / "ALLMDFILESREFS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--alpha-repo", type=Path, required=True, help="Checked-out Alpha-Q-ai repository")
    parser.add_argument("--output", type=Path, default=None, help="Materialized directory; defaults to workspace/qmoi-enhanced")
    parser.add_argument("--allow-incomplete", action="store_true", help="Record missing/blocked sources without claiming complete merge")
    parser.add_argument("--refresh-existing", action="store_true", help="Replace a previously generated output after its status file is present")
    args = parser.parse_args()

    workspace = args.workspace.resolve()
    alpha_repo = args.alpha_repo.resolve()
    active_repo = workspace
    history = workspace / HISTORY_DIR
    output = (args.output or workspace / TARGET_DIR).resolve()
    pending: list[str] = []

    if not (active_repo / ".git").exists():
        raise SystemExit("Active qmoi-enhanced repository is not a Git checkout")
    if not alpha_repo.exists() or not (alpha_repo / ".git").exists():
        pending.append("Alpha-Q-ai checkout with .git metadata")
    if not history.is_dir():
        pending.append(HISTORY_DIR)
    if pending and not args.allow_incomplete:
        print("REFUSED: merge sources are incomplete; no output directory was created.", file=sys.stderr)
        for item in pending:
            print(f"- missing: {item}", file=sys.stderr)
        return 2
    if output.exists():
        status_path = output / "MATERIALIZATION_STATUS.json"
        if not args.refresh_existing or not status_path.exists():
            raise SystemExit(f"Refusing to overwrite existing output: {output}")
        shutil.rmtree(output)

    audit = {
        "generated": utc_now(),
        "complete": not pending,
        "pending_sources": pending,
        "sources": {
            "qmoi-enhanced": {
                "path": str(active_repo),
                "commit": git_optional(active_repo, "rev-parse", "HEAD"),
                "branches": git_optional(active_repo, "for-each-ref", "--format=%(refname:short)", "refs/heads", "refs/remotes"),
                "tracked_files": len(run_git(active_repo, "ls-files").splitlines()),
            },
            "Alpha-Q-ai": {
                "path": str(alpha_repo),
                "commit": git_optional(alpha_repo, "rev-parse", "HEAD"),
                "branches": git_optional(alpha_repo, "for-each-ref", "--format=%(refname:short)", "refs/heads", "refs/remotes"),
                "tracked_files": len((git_optional(alpha_repo, "ls-files") or "").splitlines()),
            },
            HISTORY_DIR: {"path": str(history), "git_metadata": (history / ".git").exists()},
        },
        "policy": "sources are preserved in separate namespaces; conflicts are not silently overwritten",
    }

    output.mkdir(parents=True)
    (output / "sources").mkdir()
    markdown_history = output / "MARKDOWN_HISTORY"
    markdown_history.mkdir()
    copy_tree(active_repo, output / "sources" / "qmoi-enhanced", output, {HISTORY_DIR})
    if history.is_dir():
        copy_tree(history, output / "sources" / HISTORY_DIR)
    if alpha_repo.exists() and (alpha_repo / ".git").exists():
        copy_tree(alpha_repo, output / "sources" / "Alpha-Q-ai")
    records = markdown_manifest(output, active_repo, alpha_repo)
    history_records = branch_markdown_records(active_repo, "qmoi-enhanced", markdown_history)
    if alpha_repo.exists() and (alpha_repo / ".git").exists():
        history_records.extend(branch_markdown_records(alpha_repo, "Alpha-Q-ai", markdown_history))
    (markdown_history / "manifest.jsonl").write_text(
        "".join(json.dumps(record, sort_keys=True) + "\n" for record in history_records),
        encoding="utf-8",
    )
    write_markdown_reference(output, records, pending, history_records)
    (output / "MERGE_AUDIT.json").write_text(json.dumps(audit, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (output / "MATERIALIZATION_STATUS.json").write_text(
        json.dumps(
            {
                "complete": not pending,
                "generated": audit["generated"],
                "markdown_files": len(records),
                "markdown_history_snapshots": len(history_records),
                "markdown_history_directory": "MARKDOWN_HISTORY",
                "pending_sources": pending,
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    print(
        json.dumps(
            {
                "output": str(output),
                "complete": not pending,
                "markdown_files": len(records),
                "markdown_history_snapshots": len(history_records),
                "pending_sources": pending,
            },
            indent=2,
        )
    )
    return 0 if not pending else 3


if __name__ == "__main__":
    raise SystemExit(main())
