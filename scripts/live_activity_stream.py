#!/usr/bin/env python3
"""Dual-source live activity stream for QMOI and the Ollama autonomous agent.

This utility emits a source-labeled stream that can be surfaced in GitHub Actions,
local terminal monitoring, and the repository tracker directory. Each entry contains
source, status, timestamp, and a human-readable message so the live stream is
unambiguous about whether the event belongs to QMOI or the Ollama agent.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
TRACK_DIR = ROOT / "ollamatracks"


def utc_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def safe_write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True, default=str) + "\n", encoding="utf-8")


def safe_write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def run_command(command: list[str]) -> str:
    try:
        result = subprocess.run(command, cwd=str(ROOT), capture_output=True, text=True, check=False)
        combined = (result.stdout + "\n" + result.stderr).strip()
        return combined
    except Exception:
        return ""


def get_github_auth_status() -> dict[str, Any]:
    output = run_command(["gh", "auth", "status", "-h", "github.com"])
    lower = output.lower()
    invalid_markers = [
        "failed to log in",
        "bad credentials",
        "http 401",
        "token is invalid",
        "try authenticating with",
    ]
    if any(marker in lower for marker in invalid_markers):
        return {"valid": False, "message": "GitHub auth is invalid; remote workflow data is unavailable."}
    if "active account" in lower or "logged in" in lower:
        return {"valid": True, "message": "GitHub auth is valid."}
    return {"valid": None, "message": "GitHub auth status is unknown."}


def get_git_status() -> dict[str, Any]:
    output = run_command(["git", "-C", str(ROOT), "status", "--short", "--branch"])
    branch = "unknown"
    if output:
        for line in output.splitlines():
            if line.startswith("## "):
                branch = line[3:].split("...")[0].strip() or "unknown"
                break

    dirty = bool(output and any(line.strip() and line.strip()[0] in {"?", "M", "A", "D", "U", "R", "C"} for line in output.splitlines()))
    behind = "behind" in output.lower() or "diverged" in output.lower()
    return {
        "branch": branch,
        "dirty": dirty,
        "behind": behind,
        "raw": output,
        "status": "healthy" if not dirty and not behind else "warning",
    }


def get_recent_ollama_runs() -> list[dict[str, Any]]:
    gh_token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not gh_token:
        return []

    auth_status = get_github_auth_status()
    if auth_status.get("valid") is False:
        return []

    command = [
        "gh",
        "run",
        "list",
        "-R",
        "thealphakenya/qmoi-enhanced",
        "-w",
        "ollama-autonomous-agent.yml",
        "-L",
        "5",
        "--json",
        "status,conclusion,displayTitle,headBranch,createdAt,updatedAt,url",
    ]
    output = run_command(command)
    if not output:
        return []

    auth_error = any(marker in output.lower() for marker in [
        "failed to log in",
        "bad credentials",
        "http 401",
        "token is invalid",
        "try authenticating with",
    ])
    if auth_error:
        return []

    try:
        runs = json.loads(output)
        return runs if isinstance(runs, list) else []
    except json.JSONDecodeError:
        return []


def build_entry(source: str, entity: str, event: str, status: str, message: str, details: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "source": source,
        "entity": entity,
        "event": event,
        "status": status,
        "message": message,
        "timestamp_utc": utc_iso(),
        "details": details or {},
    }


def build_dual_stream() -> list[dict[str, Any]]:
    git_state = get_git_status()
    qmoi_status = git_state["status"]
    stream: list[dict[str, Any]] = [
        build_entry(
            "qmoi",
            "qmoi",
            "repo_health",
            qmoi_status,
            f"QMOI repo health on {git_state['branch']} is {qmoi_status}.",
            {
                "branch": git_state["branch"],
                "dirty": git_state["dirty"],
                "behind": git_state["behind"],
                "raw_status": git_state["raw"],
            },
        )
    ]

    runs = get_recent_ollama_runs()
    if runs:
        for run in runs[:3]:
            status_raw = str(run.get("status", "unknown")).lower()
            conclusion = str(run.get("conclusion") or "running").lower()
            if status_raw in {"in_progress", "queued", "requested", "waiting", "pending"}:
                display_status = "running"
            elif conclusion == "success":
                display_status = "success"
            elif conclusion == "failure":
                display_status = "failure"
            else:
                display_status = status_raw

            stream.append(
                build_entry(
                    "ollama_autonomous_agent",
                    "ollama-autonomous-agent",
                    "workflow_run",
                    display_status,
                    f"Ollama autonomous agent workflow status is {status_raw}.",
                    {
                        "workflow": run.get("displayTitle") or "ollama-autonomous-agent.yml",
                        "status": status_raw,
                        "conclusion": run.get("conclusion") or "running",
                        "branch": run.get("headBranch"),
                        "url": run.get("url"),
                    },
                )
            )
    elif get_github_auth_status().get("valid") is False:
        stream.append(
            build_entry(
                "ollama_autonomous_agent",
                "ollama-autonomous-agent",
                "github_auth_status",
                "warning",
                "GitHub auth is invalid; remote Ollama workflow data is unavailable. Local tracker heartbeat is active.",
                {"source": "local_tracker", "auth_status": "invalid"},
            )
        )
    else:
        stream.append(
            build_entry(
                "ollama_autonomous_agent",
                "ollama-autonomous-agent",
                "tracker_heartbeat",
                "idle",
                "No recent Ollama run was available from GitHub, so the tracker heartbeat is being monitored locally.",
                {"source": "local_tracker"},
            )
        )

    return stream


def write_stream_payload(stream: list[dict[str, Any]], source: str | None = None) -> dict[str, Any]:
    TRACK_DIR.mkdir(parents=True, exist_ok=True)
    if source is None:
        payload_path = TRACK_DIR / "live_activity_stream.json"
        safe_write_json(payload_path, {"stream": stream, "source": "combined"})
        return {"stream": stream, "source": "combined"}

    payload_path = TRACK_DIR / f"{source}_live_activity.json"
    safe_write_json(payload_path, {"stream": [entry for entry in stream if entry["source"] == source], "source": source})
    return {"stream": [entry for entry in stream if entry["source"] == source], "source": source}


def persist_latest_activity(stream: list[dict[str, Any]]) -> None:
    latest = stream[-1] if stream else {
        "source": "qmoi",
        "entity": "qmoi",
        "event": "idle",
        "status": "healthy",
        "message": "No activity records available.",
        "timestamp_utc": utc_iso(),
        "details": {},
    }
    safe_write_text(TRACK_DIR / "LATEST_ACTIVITY.txt", f"SOURCE: {latest['source']}\nEVENT: {latest['event']}\nSTATUS: {latest['status']}\nMESSAGE: {latest['message']}\nTIMESTAMP_UTC: {latest['timestamp_utc']}\n")
    safe_write_text(TRACK_DIR / "CURRENT_STATUS.txt", f"STATUS: {latest['status']}\nSOURCE: {latest['source']}\nPHASE: live_activity_stream\nTIMESTAMP_UTC: {latest['timestamp_utc']}\n")
    safe_write_text(TRACK_DIR / "STATE.txt", f"STATE: active\nSOURCE: {latest['source']}\nPHASE: live_activity_stream\nTIMESTAMP_UTC: {latest['timestamp_utc']}\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate the dual-source live activity stream for QMOI and the Ollama agent.")
    parser.add_argument("--source", choices=["qmoi", "ollama_autonomous_agent", "combined"], default="combined")
    args = parser.parse_args()

    stream = build_dual_stream()
    write_stream_payload(stream, None if args.source == "combined" else args.source)
    if args.source == "combined":
        write_stream_payload(stream, "qmoi")
        write_stream_payload(stream, "ollama_autonomous_agent")
    persist_latest_activity(stream)

    print(json.dumps({"source": args.source, "entries": len(stream), "stream": stream}, indent=2, default=str))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
