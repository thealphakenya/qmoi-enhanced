#!/usr/bin/env python3
"""Guardrails for repository monitoring outputs.

This module enforces the approved small tracker output set and blocks oversized or
unexpected generated files from being added to Git or pushed in the repository.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

MAX_TRACKER_FILE_BYTES = 10 * 1024 * 1024  # 10 MiB; keep stream artifacts small and browser-safe
ALLOWED_TRACKER_FILES = {
    "CURRENT_STATUS.txt",
    "LATEST_ACTIVITY.txt",
    "STATE.txt",
    "live_activity_stream.json",
    "qmoi_live_activity.json",
    "ollama_autonomous_agent_live_activity.json",
}


def validate_tracker_outputs(track_dir: str | Path) -> dict[str, Any]:
    root = Path(track_dir)
    issues: list[str] = []
    approved = set(ALLOWED_TRACKER_FILES)

    if not root.exists():
        return {"ok": False, "issues": [f"Tracker directory does not exist: {root}"]}

    found = {path.name for path in root.iterdir() if path.is_file()}
    unexpected = sorted(found - approved)
    for name in unexpected:
        issues.append(f"Unapproved tracker file: {name}")

    for name in sorted(approved):
        path = root / name
        if not path.exists():
            continue
        size = path.stat().st_size
        if size > MAX_TRACKER_FILE_BYTES:
            issues.append(f"Oversized tracker file: {name} ({size} bytes > {MAX_TRACKER_FILE_BYTES})")
        if path.suffix.lower() == ".json":
            try:
                with path.open("r", encoding="utf-8") as fh:
                    json.load(fh)
            except Exception as exc:  # pragma: no cover - runtime validation path
                issues.append(f"Invalid JSON tracker file: {name} ({exc})")

    return {"ok": not issues, "issues": issues, "approved": sorted(approved), "seen": sorted(found)}


def enforce_tracker_guard(track_dir: str | Path) -> None:
    result = validate_tracker_outputs(track_dir)
    if not result["ok"]:
        raise ValueError("Tracker validation failed: " + "; ".join(result["issues"]))


if __name__ == "__main__":
    enforce_tracker_guard(Path(__file__).resolve().parent / "ollamatracks")
    print("tracker guard ok")
