#!/usr/bin/env python3
"""Generate the checked-in Alpha-Q-ai historical tree manifest."""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path


def git_tree(repo: Path, ref: str, prefix: str) -> list[dict[str, str | int]]:
    result = subprocess.run(
        ["git", "-C", str(repo), "ls-tree", "-r", "-l", ref, "--", prefix],
        check=True,
        capture_output=True,
        text=True,
    )
    entries = []
    for line in result.stdout.splitlines():
        metadata, full_path = line.split("\t", 1)
        mode, _kind, object_id, size = metadata.split()
        path = full_path.removeprefix(prefix + "/")
        entries.append({
            "path": path,
            "mode": mode,
            "object": object_id,
            "bytes": int(size) if size != "-" else 0,
        })
    return entries


def directories(entries: list[dict[str, str | int]]) -> list[str]:
    found: set[str] = set()
    for entry in entries:
        parent = Path(str(entry["path"])).parent
        while parent != Path("."):
            found.add(parent.as_posix())
            parent = parent.parent
    return sorted(found)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--ref", required=True)
    parser.add_argument("--prefix", default="Alpha-Q-ai")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    entries = git_tree(args.repo.resolve(), args.ref, args.prefix)
    dirs = directories(entries)
    total_bytes = sum(int(entry["bytes"]) for entry in entries)
    symlinks = sum(entry["mode"] == "120000" for entry in entries)
    executables = sum(entry["mode"] == "100755" for entry in entries)
    lines = [
        "# FULLTREE-ALPHA-Q-AI-14",
        "",
        "## Source and Scope",
        "",
        "- Source repository: `thealphakenya/Alpha-Q-ai` materialized in `qmoi-enhanced`.",
        f"- Source ref: `{args.ref}`; path prefix: `{args.prefix}/`.",
        "- This is the complete Git-tracked Alpha-Q-ai tree available in the local merge source.",
        "- The standalone Alpha-Q-ai remote has no reachable commit on or before 2026-04-20; its oldest fetched commit is 2026-08-13. Therefore this manifest does not mislabel a later materialization as an April snapshot.",
        "",
        "## Metrics",
        "",
        "| Metric | Value |",
        "| --- | ---: |",
        f"| Files | {len(entries):,} |",
        f"| Directories | {len(dirs):,} |",
        f"| Symlinks | {symlinks:,} |",
        f"| Executable files | {executables:,} |",
        f"| Git blob bytes | {total_bytes:,} |",
        "",
        "## Directories",
        "",
        "```text",
        *dirs,
        "```",
        "",
        "## Files",
        "",
        "| Path | Mode | Blob | Bytes |",
        "| --- | --- | --- | ---: |",
    ]
    lines.extend(
        f"| `{entry['path']}` | `{entry['mode']}` | `{entry['object']}` | {entry['bytes']:,} |"
        for entry in entries
    )
    args.output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())