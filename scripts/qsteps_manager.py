#!/usr/bin/env python3
"""Durable, bounded step lifecycle adapter for GitHub Actions workflows."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict


SCHEMA_VERSION = "qsteps-v1"
DEFAULT_MAX_RECORDS = 2000


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def tracker_path() -> Path:
    return Path(os.environ.get("QSTEPS_TRACK_DIR", "ollamatracks"))


def classify_error(error: str) -> str:
    text = (error or "").lower()
    if any(token in text for token in ("no such file", "not found", "missing")):
        return "missing-file"
    if any(token in text for token in ("timeout", "temporarily", "connection", "i/o")):
        return "transient-io"
    if any(token in text for token in ("assert", "contract", "schema", "validation")):
        return "validation-contract"
    if any(token in text for token in ("dependency", "import", "module")):
        return "source-dependency"
    return "manual-review" if error else ""


def event_identity(event: str, step: str, status: str) -> str:
    run = os.environ.get("GITHUB_RUN_ID", "local")
    job = os.environ.get("GITHUB_JOB", "local")
    attempt = os.environ.get("GITHUB_RUN_ATTEMPT", "1")
    raw = "|".join((run, job, attempt, event, step, status))
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def _attempt_budget() -> int:
    try:
        return max(1, int(os.environ.get("QSTEPS_MAX_ATTEMPTS", "3")))
    except ValueError:
        return 3


def _run_metadata() -> Dict[str, Any]:
    return {
        "repository": os.environ.get("GITHUB_REPOSITORY", "local"),
        "ref": os.environ.get("GITHUB_REF", "local"),
        "sha": os.environ.get("GITHUB_SHA", "local"),
        "actor": os.environ.get("GITHUB_ACTOR", "local"),
    }


def _read_records(path: Path) -> list[Dict[str, Any]]:
    if not path.exists():
        return []
    records = []
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            value = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(value, dict):
            records.append(value)
    return records


def _append_record(path: Path, record: Dict[str, Any]) -> None:
    records = _read_records(path)
    records.append(record)
    try:
        limit = max(100, int(os.environ.get("QSTEPS_MAX_RECORDS", str(DEFAULT_MAX_RECORDS))))
    except ValueError:
        limit = DEFAULT_MAX_RECORDS
    content = "".join(json.dumps(item, sort_keys=True) + "\n" for item in records[-limit:])
    _atomic_write(path, content)


def _atomic_write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent,
                                     delete=False) as stream:
        stream.write(content)
        temporary = Path(stream.name)
    temporary.replace(path)


def write_checkpoint(step: str, status: str, **details: Any) -> Dict[str, Any]:
    checkpoint = {
        "schema": SCHEMA_VERSION,
        "step": step,
        "status": status,
        "timestamp_utc": utc_now(),
        "run_id": os.environ.get("GITHUB_RUN_ID", "local"),
        "details": details,
    }
    _atomic_write(
        tracker_path() / "QSTEPS_CHECKPOINT.json",
        json.dumps(checkpoint, indent=2, sort_keys=True) + "\n",
    )
    return checkpoint


def emit(event: str, step: str, status: str, **details: Any) -> Dict[str, Any]:
    error = str(details.get("error") or "")
    details.setdefault("error_category", classify_error(error))
    details.setdefault("attempt_budget", _attempt_budget())
    if details.get("attempt") is not None and int(details["attempt"]) > details["attempt_budget"]:
        raise ValueError(f"attempt exceeds budget ({details['attempt_budget']})")
    record = {
        "schema": SCHEMA_VERSION,
        "event": event,
        "step": step,
        "status": status,
        "timestamp_utc": utc_now(),
        "run_id": os.environ.get("GITHUB_RUN_ID", "local"),
        "workflow": os.environ.get("GITHUB_WORKFLOW", "local"),
        "job": os.environ.get("GITHUB_JOB", "local"),
        "attempt": os.environ.get("GITHUB_RUN_ATTEMPT", "1"),
        "event_id": event_identity(event, step, status),
        "run_metadata": _run_metadata(),
        **details,
    }
    directory = tracker_path()
    directory.mkdir(parents=True, exist_ok=True)
    telemetry = directory / "qsteps.jsonl"
    existing_ids = {item.get("event_id") for item in _read_records(telemetry)}
    if record["event_id"] not in existing_ids:
        _append_record(telemetry, record)
    _atomic_write(directory / "QSTEPS_STATUS.json",
                  json.dumps(record, indent=2, sort_keys=True) + "\n")
    records = _read_records(telemetry)
    step_records = [item for item in records if item.get("step") == step]
    _atomic_write(directory / "QSTEPS_SUMMARY.json", json.dumps({
        "schema": SCHEMA_VERSION,
        "updated_at_utc": record["timestamp_utc"],
        "workflow": record["workflow"],
        "job": record["job"],
        "current_step": step,
        "status": status,
        "error_category": record["error_category"],
        "evidence": details.get("evidence"),
        "events_total": len(records),
        "step_events": len(step_records),
        "last_event": step_records[-1].get("event") if step_records else event,
    }, indent=2, sort_keys=True) + "\n")
    write_checkpoint(step, status, event_id=record["event_id"])
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a", encoding="utf-8") as stream:
            stream.write(f"- `{step}`: **{status}** ({record['timestamp_utc']})\n")
    return record


def validate_all(root: Path, run_tests: bool = True) -> Dict[str, Any]:
    """Validate every local workflow and Python source through one command."""
    workflow_dir = root / ".github" / "workflows"
    scripts_dir = root / "scripts"
    workflows = sorted(workflow_dir.glob("*.y*ml"))
    scripts = sorted(scripts_dir.glob("*.py"))
    report: Dict[str, Any] = {
        "schema": SCHEMA_VERSION,
        "timestamp_utc": utc_now(),
        "workflow_count": len(workflows),
        "script_count": len(scripts),
        "tests_requested": run_tests,
        "errors": [],
    }
    try:
        import yaml
        for workflow in workflows:
            try:
                document = yaml.safe_load(workflow.read_text(encoding="utf-8")) or {}
                if document.get("env", {}).get("QSTEPS_MANAGER") != SCHEMA_VERSION:
                    report["errors"].append(f"{workflow}: missing {SCHEMA_VERSION}")
                if not document.get("jobs"):
                    report["errors"].append(f"{workflow}: no jobs")
            except (OSError, yaml.YAMLError) as error:
                report["errors"].append(f"{workflow}: {error}")
    except ImportError as error:
        report["errors"].append(f"workflow parser unavailable: {error}")
    compile_result = subprocess.run(
        [sys.executable, "-m", "py_compile", *(str(path) for path in scripts)],
        cwd=root, check=False, capture_output=True, text=True,
    )
    report["python_compile"] = compile_result.returncode == 0
    if compile_result.returncode:
        report["errors"].append(compile_result.stderr.strip() or "Python compilation failed")
    if run_tests:
        test_result = subprocess.run(
            [sys.executable, "-m", "pytest", "tests", "-q"],
            cwd=root, check=False, capture_output=True, text=True,
        )
        report["tests_passed"] = test_result.returncode == 0
        report["test_output"] = (test_result.stdout + test_result.stderr)[-4000:]
        if test_result.returncode:
            report["errors"].append("test suite failed")
    report["ready"] = not report["errors"]
    _atomic_write(
        tracker_path() / "QSTEPS_VALIDATION.json",
        json.dumps(report, indent=2, sort_keys=True) + "\n",
    )
    return report


def main() -> int:
    raw_arguments = sys.argv[1:]
    command: list[str] = []
    if "--" in raw_arguments:
        separator = raw_arguments.index("--")
        command = raw_arguments[separator + 1:]
        raw_arguments = raw_arguments[:separator]
    parser = argparse.ArgumentParser(description="QMOI workflow step manager")
    parser.add_argument(
        "action",
        choices=["start", "heartbeat", "complete", "fail", "run", "validate-all"],
    )
    parser.add_argument("--step", default="repository")
    parser.add_argument("--error", default="")
    parser.add_argument("--evidence", default="")
    parser.add_argument("--duration-seconds", type=float, default=None)
    parser.add_argument("--attempt", type=int, default=None)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--skip-tests", action="store_true")
    args = parser.parse_args(raw_arguments)
    if args.action == "validate-all":
        report = validate_all(args.root.resolve(), run_tests=not args.skip_tests)
        emit("validate-all", "repository", "completed" if report["ready"] else "failed",
             evidence=str(tracker_path() / "QSTEPS_VALIDATION.json"),
             error="; ".join(report["errors"]) if report["errors"] else None)
        print(json.dumps(report, indent=2, sort_keys=True))
        return 0 if report["ready"] else 1
    if args.step == "repository":
        parser.error("the following arguments are required: --step")
    if args.action == "run":
        if not command:
            parser.error("run requires a command after --")
        started = time.monotonic()
        start_details = {} if args.attempt is None else {"attempt": args.attempt}
        emit("start", args.step, "running", **start_details)
        try:
            result = subprocess.run(command, check=False)
        except OSError as error:
            details = {"error": str(error), "duration_seconds": time.monotonic() - started}
            if args.attempt is not None:
                details["attempt"] = args.attempt
            emit("fail", args.step, "failed", **details)
            return 127
        duration = time.monotonic() - started
        details = {"duration_seconds": duration, "evidence": args.evidence or None}
        if args.attempt is not None:
            details["attempt"] = args.attempt
        if result.returncode == 0:
            emit("complete", args.step, "completed", **details)
        else:
            details["error"] = f"command exited {result.returncode}"
            emit("fail", args.step, "failed", **details)
        return result.returncode
    status = {
        "start": "running",
        "heartbeat": "running",
        "complete": "completed",
        "fail": "failed",
    }[args.action]
    details: Dict[str, Any] = {"error": args.error or None}
    if args.evidence:
        details["evidence"] = args.evidence
    if args.duration_seconds is not None:
        details["duration_seconds"] = args.duration_seconds
    if args.attempt is not None:
        details["attempt"] = args.attempt
    emit(args.action, args.step, status, **details)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
