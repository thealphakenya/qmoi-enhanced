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
import re
import shutil
import subprocess
import sys
import tarfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

HISTORY_DIR = "qmoi-enhanced-history-14"
TARGET_DIR = "qmoi-enhanced"
EXCLUDED = {".git", ".pytest_cache", ".ruff_cache", "__pycache__", ".venv", "venv", "node_modules"}
GENERATED_ARTIFACT_PREFIXES = ("qmoi-enhanced-incomplete-",)
NONPRODUCTION_PATTERN = re.compile(
    r"\b(?:TODO|FIXME|PLACEHOLDER|STUB|MOCK|NOT IMPLEMENTED|NOT IMPLEMENTED YET|IN PRODUCTION,? (?:IMPLEMENT|USE))\b",
    re.IGNORECASE,
)


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


def dated_commits(repo: Path) -> list[dict[str, str]]:
    output = git_optional(repo, "log", "--all", "--date=iso-strict", "--format=%H%x09%aI%x09%an%x09%ae") or ""
    commits = []
    seen = set()
    for line in output.splitlines():
        commit, timestamp, author, email = (line.split("\t", 3) + [""] * 4)[:4]
        if commit in seen:
            continue
        seen.add(commit)
        commits.append({"commit": commit, "timestamp": timestamp, "publisher": author, "publisher_email": email})
    return sorted(commits, key=lambda item: item["timestamp"])


def git_history_manifest(repo: Path, source_name: str) -> dict[str, Any]:
    commits = dated_commits(repo)
    return {
        "source": source_name,
        "refs": git_refs(repo),
        "commits": commits,
        "commit_count": len(commits),
        "history_scope": "all reachable local and remote refs",
    }


def select_period_snapshots(repo: Path) -> list[dict[str, str]]:
    commits = dated_commits(repo)
    if not commits:
        return []
    first = datetime.fromisoformat(commits[0]["timestamp"].replace("Z", "+00:00"))
    last = datetime.fromisoformat(commits[-1]["timestamp"].replace("Z", "+00:00"))
    targets = [first, first.replace(year=first.year + 1), last]
    snapshots = []
    for target in targets:
        candidate = min(
            commits,
            key=lambda item: abs(
                datetime.fromisoformat(item["timestamp"].replace("Z", "+00:00")) - target
            ),
        )
        if not snapshots or candidate["commit"] != snapshots[-1]["commit"]:
            snapshots.append(candidate)
    if snapshots[-1]["commit"] != commits[-1]["commit"]:
        snapshots.append(commits[-1])
    return snapshots[:4]


def materialize_period_snapshots(repo: Path, source_name: str, output: Path) -> list[dict[str, Any]]:
    records = []
    snapshots_root = output / source_name
    for index, item in enumerate(select_period_snapshots(repo), start=1):
        timestamp = item["timestamp"].replace(":", "").replace("+00:00", "Z").replace("-", "")
        directory = snapshots_root / f"{index:02d}_{timestamp}"
        directory.mkdir(parents=True, exist_ok=True)
        process = subprocess.Popen(
            ["git", "-C", str(repo), "archive", "--format=tar", item["commit"]],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        skipped_links = 0
        with tarfile.open(fileobj=process.stdout, mode="r|") as tar:
            def safe_filter(member: tarfile.TarInfo, _destination: str) -> tarfile.TarInfo | None:
                nonlocal skipped_links
                if member.issym() or member.islnk():
                    link = member.linkname
                    if link.startswith("/") or ".." in Path(link).parts:
                        skipped_links += 1
                        return None
                return member

            tar.extractall(directory, filter=safe_filter)
        process.stdout.close()
        process.wait()
        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, process.args)
        records.append(
            {
                "directory": str(directory.relative_to(output)),
                "source": source_name,
                "commit": item["commit"],
                "exact_timestamp": item["timestamp"],
                "publisher": item["publisher"],
                "publisher_email": item["publisher_email"],
                "minimum_gap": "at least six months between planned periods; actual commit dates are authoritative",
                "unsafe_links_skipped": skipped_links,
            }
        )
    return records


def safe_ref_name(ref: str) -> str:
    return ref.replace("refs/", "").replace("/", "__").replace("\\", "__")


def branch_file_dates(repo: Path, ref: str, expected_paths: set[str]) -> dict[str, dict[str, str | None]]:
    """Collect file creation/update dates with one Git history scan per ref."""
    result = {path: {"created_at": None, "updated_at": None} for path in expected_paths}
    output = git_optional(repo, "log", ref, "--format=%H%x09%aI%x09%cI", "--name-only") or ""
    current: tuple[str, str, str] | None = None
    for line in output.splitlines():
        if "\t" in line:
            parts = line.split("\t", 2)
            if len(parts) == 3:
                current = (parts[0], parts[1], parts[2])
            continue
        path = line.strip()
        if not path or path not in result or current is None:
            continue
        _commit, author_date, commit_date = current
        if result[path]["updated_at"] is None:
            result[path]["updated_at"] = commit_date
        result[path]["created_at"] = author_date
    return result


def branch_markdown_records(repo: Path, source_name: str, history_root: Path) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    source_root = history_root / source_name
    for ref in git_refs(repo):
        paths = git_optional(repo, "ls-tree", "-r", "--name-only", ref) or ""
        ref_root = source_root / safe_ref_name(ref)
        expected_paths = {
            path_text
            for path_text in paths.splitlines()
            if path_text.lower().endswith(".md")
            and not any(part in EXCLUDED for part in Path(path_text).parts)
        }
        if not expected_paths:
            continue
        dates = branch_file_dates(repo, ref, expected_paths)
        process = subprocess.Popen(
            ["git", "-C", str(repo), "archive", "--format=tar", ref],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        try:
            with tarfile.open(fileobj=process.stdout, mode="r|") as tar:
                for member in tar:
                    path_text = member.name
                    if path_text not in expected_paths or not member.isfile():
                        continue
                    extracted = tar.extractfile(member)
                    if extracted is None:
                        continue
                    content = extracted.read()
                    destination = ref_root / Path(path_text)
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    destination.write_bytes(content)
                    records.append(
                        {
                            "path": path_text,
                            "source": source_name,
                            "source_ref": ref,
                            "source_commit": git_optional(repo, "rev-parse", ref),
                            "created_at": dates[path_text]["created_at"],
                            "updated_at": dates[path_text]["updated_at"],
                            "timestamp_basis": "Git ref author/committer metadata",
                            "sha256": hashlib.sha256(content).hexdigest(),
                            "snapshot": str(destination.relative_to(history_root)),
                        }
                    )
        finally:
            process.stdout.close()
            process.wait()
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
        if (
            item.name in EXCLUDED
            or item.name.startswith(GENERATED_ARTIFACT_PREFIXES)
            or (ignored_names and item.name in ignored_names)
        ):
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


def production_readiness_inventory(root: Path) -> list[dict[str, Any]]:
    """Record actionable nonproduction markers without mutating source files."""
    findings: list[dict[str, Any]] = []
    source_roots = [root / "sources", root / "MARKDOWN_HISTORY"]
    seen: set[Path] = set()
    for source_root in source_roots:
        if not source_root.exists():
            continue
        for path in sorted(source_root.rglob("*")):
            if not path.is_file() or path in seen or any(part in EXCLUDED for part in path.relative_to(root).parts):
                continue
            seen.add(path)
            try:
                text = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            matches = list(NONPRODUCTION_PATTERN.finditer(text))
            if not matches:
                continue
            findings.append(
                {
                    "path": str(path.relative_to(root)),
                    "markers": sorted({match.group(0).upper() for match in matches}),
                    "occurrences": len(matches),
                    "status": "requires_production_review",
                    "action": "replace_with_tested_implementation_or_document_verified_exception",
                }
            )
    return findings


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


def period_markdown_manifest(root: Path, period_snapshots: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Index Markdown files inside every dated full-tree snapshot."""
    records: list[dict[str, Any]] = []
    for snapshot in period_snapshots:
        snapshot_root = root / snapshot["directory"]
        if not snapshot_root.exists():
            continue
        for path in sorted(snapshot_root.rglob("*.md")):
            relative = path.relative_to(snapshot_root)
            records.append(
                {
                    "path": str(relative),
                    "source": snapshot["source"],
                    "source_ref": snapshot["commit"],
                    "source_commit": snapshot["commit"],
                    "created_at": snapshot["exact_timestamp"],
                    "updated_at": snapshot["exact_timestamp"],
                    "timestamp_basis": "dated full-tree snapshot commit metadata",
                    "sha256": file_digest(path),
                    "snapshot": str(path.relative_to(root)),
                }
            )
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


def write_all_histories(
    root: Path,
    git_history: list[dict[str, Any]],
    period_snapshots: list[dict[str, Any]],
    markdown_count: int,
    production_findings: int,
) -> None:
    history_dir = root / "History"
    history_dir.mkdir(parents=True, exist_ok=True)
    lines = [
        "# ALLHOSTORIES.md - Complete Repository History Evidence",
        "",
        f"Generated: {utc_now()}",
        "",
        "This manifest is generated after repository audit and materialization. It records all reachable refs and commits available in each supplied repository, selected full-tree period snapshots, branch Markdown history, and production-readiness findings.",
        "No unavailable history is inferred or silently omitted.",
        "",
        "## Repository History",
        "",
    ]
    for source in git_history:
        lines.extend(
            [
                f"### {source['source']}",
                f"- Reachable refs: {len(source['refs'])}",
                f"- Reachable commits: {source['commit_count']}",
                f"- Scope: {source['history_scope']}",
                "",
                "| Commit | Exact timestamp | Publisher | Publisher email |",
                "|---|---|---|---|",
            ]
        )
        lines.extend(
            f"| {commit['commit']} | {commit['timestamp']} | {commit['publisher']} | {commit['publisher_email']} |"
            for commit in source["commits"]
        )
        lines.append("")
    lines.extend(["## Dated Full-Tree Snapshots", "", "| Directory | Source | Commit | Exact timestamp | Publisher | Unsafe links skipped |", "|---|---|---|---|---|---|"])
    lines.extend(
        f"| {item['directory']} | {item['source']} | {item['commit']} | {item['exact_timestamp']} | {item['publisher']} | {item['unsafe_links_skipped']} |"
        for item in period_snapshots
    )
    lines.extend(
        [
            "",
            "## Coverage Summary",
            "",
            f"- Current and historical Markdown provenance records: {markdown_count}",
            f"- Dated full-tree snapshots: {len(period_snapshots)}",
            f"- Production-readiness findings requiring implementation/review: {production_findings}",
            "- Branch Markdown snapshots: MARKDOWN_HISTORY/manifest.jsonl",
            "- Commit/ref machine manifest: GIT_HISTORY_MANIFEST.json",
            "- Period snapshot machine manifest: PERIOD_SNAPSHOT_MANIFEST.json",
            "",
        ]
    )
    (history_dir / "ALLHOSTORIES.md").write_text("\n".join(lines), encoding="utf-8")


def styles_universals_status(root: Path) -> dict[str, Any]:
    status: dict[str, Any] = {}
    for name in ("STYLES.md", "UNIVERSALS.md"):
        path = root / "sources" / "qmoi-enhanced" / name
        text = path.read_text(encoding="utf-8", errors="ignore") if path.exists() else ""
        status[name] = {
            "present": path.exists(),
            "bytes": path.stat().st_size if path.exists() else 0,
            "sha256": file_digest(path),
            "has_content": bool(text.strip()),
            "status": "healthy" if path.exists() and text.strip() else "review_required",
        }
    return status


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
    period_snapshots = materialize_period_snapshots(active_repo, "qmoi-enhanced-history-14", output)
    if alpha_repo.exists() and (alpha_repo / ".git").exists():
        period_snapshots.extend(materialize_period_snapshots(alpha_repo, "Alpha-Q-ai-history-14", output))
    (output / "PERIOD_SNAPSHOT_MANIFEST.json").write_text(
        json.dumps(
            {
                "generated": utc_now(),
                "policy": "four real commit snapshots per repository when history permits; no dates are invented",
                "snapshots": period_snapshots,
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    git_history = [git_history_manifest(active_repo, "qmoi-enhanced")]
    if alpha_repo.exists() and (alpha_repo / ".git").exists():
        git_history.append(git_history_manifest(alpha_repo, "Alpha-Q-ai"))
    (output / "GIT_HISTORY_MANIFEST.json").write_text(
        json.dumps(
            {
                "generated": utc_now(),
                "sources": git_history,
                "total_commits": sum(item["commit_count"] for item in git_history),
                "total_refs": sum(len(item["refs"]) for item in git_history),
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    records = markdown_manifest(output, active_repo, alpha_repo)
    period_markdown_records = period_markdown_manifest(output, period_snapshots)
    records.extend(period_markdown_records)
    styles_status = styles_universals_status(output)
    (output / "STYLES_UNIVERSALS_STATUS.json").write_text(
        json.dumps({"generated": utc_now(), "documents": styles_status}, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    history_records = branch_markdown_records(active_repo, "qmoi-enhanced", markdown_history)
    if alpha_repo.exists() and (alpha_repo / ".git").exists():
        history_records.extend(branch_markdown_records(alpha_repo, "Alpha-Q-ai", markdown_history))
    (markdown_history / "manifest.jsonl").write_text(
        "".join(json.dumps(record, sort_keys=True) + "\n" for record in history_records),
        encoding="utf-8",
    )
    write_markdown_reference(output, records, pending, history_records)
    production_findings = production_readiness_inventory(output)
    (output / "PRODUCTION_READINESS.json").write_text(
        json.dumps(
            {
                "generated": utc_now(),
                "status": "review_required" if production_findings else "production_markers_clear",
                "source_preservation": "all source trees and branch Markdown snapshots are retained",
                "findings": production_findings,
                "finding_count": len(production_findings),
                "automatic_replacement": False,
                "reason": "Production behavior cannot be safely inferred from marker text; each finding requires implementation and validation evidence.",
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    write_all_histories(output, git_history, period_snapshots, len(records), len(production_findings))
    (output / "MERGE_AUDIT.json").write_text(json.dumps(audit, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    (output / "MATERIALIZATION_STATUS.json").write_text(
        json.dumps(
            {
                "complete": not pending,
                "generated": audit["generated"],
                "markdown_files": len(records),
                "markdown_history_snapshots": len(history_records),
                "markdown_history_directory": "MARKDOWN_HISTORY",
                "production_readiness": "PRODUCTION_READINESS.json",
                "production_findings": len(production_findings),
                "period_snapshots": len(period_snapshots),
                "period_snapshot_manifest": "PERIOD_SNAPSHOT_MANIFEST.json",
                "period_markdown_files": len(period_markdown_records),
                "styles_universals_status": "STYLES_UNIVERSALS_STATUS.json",
                "git_history_manifest": "GIT_HISTORY_MANIFEST.json",
                "git_commit_count": sum(item["commit_count"] for item in git_history),
                "git_ref_count": sum(len(item["refs"]) for item in git_history),
                "history_directory": "History",
                "all_histories_manifest": "History/ALLHOSTORIES.md",
                "pending_sources": pending,
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    oe2_path = workspace / "oe2.txt"
    existing_oe2 = oe2_path.read_text(encoding="utf-8", errors="ignore") if oe2_path.exists() else ""
    oe2_update = (
        f"\n\nMaterialized merge update: {audit['generated']}\n"
        f"- Output: {output}\n"
        f"- Complete: {not pending}\n"
        f"- Markdown history snapshots: {len(history_records)}\n"
        f"- Markdown provenance records: {len(records)}\n"
        f"- Production readiness findings: {len(production_findings)}\n"
        "- Source trees: qmoi-enhanced, Alpha-Q-ai, qmoi-enhanced-history-14\n"
        f"- Git history manifest: {sum(item['commit_count'] for item in git_history)} commits across {sum(len(item['refs']) for item in git_history)} refs.\n"
        f"- All histories manifest: History/ALLHOSTORIES.md.\n"
        "- All source paths remain preserved under separate namespaces; conflicts are not silently overwritten.\n"
    )
    oe2_path.write_text(existing_oe2.rstrip() + oe2_update, encoding="utf-8")
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
