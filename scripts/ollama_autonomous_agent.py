#!/usr/bin/env python3
"""
QMOI / Ollama Autonomous Agent
==============================

Production-oriented autonomous validation, diagnosis, repair and telemetry
engine for the QMOI repository.

This implementation is deliberately conservative:

    DISCOVER
       |
       v
    PLAN
       |
       v
    EXECUTE
       |
       +----> TELEMETRY
       |
       v
    VERIFY
       |
       +---- failure --> DIAGNOSE
       |                    |
       |                    v
       |                  REPAIR
       |                    |
       |                    v
       +---------------- VERIFY
       |
       v
    CHECKPOINT
       |
       v
    COMPLETE / STOP

IMPORTANT
---------
This program cannot guarantee that external builds, services, credentials,
toolchains or repository code will always succeed.

Instead it guarantees that:

* failures are observable;
* failures are not silently converted into success;
* progress is persisted;
* every significant operation emits telemetry;
* checkpoints survive process termination;
* retries are bounded;
* infinite/stagnant loops are prevented;
* PR/workflow metadata is captured when available;
* monitoring data is stored under ./ollamatracks;
* actual execution results are distinguished from assumptions.

The companion GitHub Actions monitoring workflow can periodically reconcile
the GitHub-side workflow/job/PR state with this local agent telemetry.

Usage
-----

    python scripts/ollama_autonomous_agent.py validate-all

Optional:

    python scripts/ollama_autonomous_agent.py validate-all --max-iterations 20
    python scripts/ollama_autonomous_agent.py validate-all --max-runtime 3600
    python scripts/ollama_autonomous_agent.py status
    python scripts/ollama_autonomous_agent.py doctor

Environment
-----------

    OLLAMA_HOST
        Default: http://127.0.0.1:11434

    OLLAMA_MODEL
        Default: qwen2.5-coder:3b

    OLLAMA_TIMEOUT
        Default: 120 seconds

    QMOI_MAX_ITERATIONS
        Default: 20

    QMOI_MAX_RUNTIME
        Default: 21600 seconds (6 hours)

    QMOI_MAX_STAGNANT_ITERATIONS
        Default: 3

    QMOI_RETRIES
        Default: 2

    QMOI_AUTO_REPAIR
        Default: true

    QMOI_TELEMETRY
        Default: true

    QMOI_MAX_OUTPUT
        Default: 12000 characters
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
import platform as host_platform
import re
import shutil
import socket
import subprocess
import sys
import time
import traceback
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


# ============================================================================
# PATHS
# ============================================================================

ROOT_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = ROOT_DIR / "scripts"

TRACK_DIR = ROOT_DIR / "ollamatracks"

CURRENT_STATUS_FILE = TRACK_DIR / "CURRENT_STATUS.txt"
STATE_FILE = TRACK_DIR / "STATE.txt"
INDEX_FILE = TRACK_DIR / "TRACKING_INDEX.txt"
EVENTS_FILE = TRACK_DIR / "EVENTS.txt"
ERRORS_FILE = TRACK_DIR / "ERRORS.txt"
ACTIONS_FILE = TRACK_DIR / "ACTIONS.txt"
TASKS_FILE = TRACK_DIR / "TASKS.txt"
ITERATIONS_FILE = TRACK_DIR / "ITERATIONS.txt"
PR_STATUS_FILE = TRACK_DIR / "PR_STATUS.txt"
SUMMARY_FILE = TRACK_DIR / "SUMMARY.txt"

JSONL_FILE = TRACK_DIR / "telemetry.jsonl"
CHECKPOINT_FILE = TRACK_DIR / "CHECKPOINT.json"
AGENT_LOG_FILE = TRACK_DIR / "agent.log"

BUILD_DIR = ROOT_DIR / "build"
DIST_DIR = ROOT_DIR / "dist"
TESTS_DIR = ROOT_DIR / "tests"
APPS_DIR = ROOT_DIR / "apps"

RESUME_FILE = ROOT_DIR / "resumefromhere.txt"


# ============================================================================
# CONFIGURATION
# ============================================================================

TARGET_WORKFLOW = "Ollama PR Validation - 293+ Platform Features"

OLLAMA_HOST = os.getenv(
    "OLLAMA_HOST",
    "http://127.0.0.1:11434",
).rstrip("/")

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen2.5-coder:3b",
)

OLLAMA_TIMEOUT = int(
    os.getenv("OLLAMA_TIMEOUT", "120")
)

MAX_ITERATIONS = int(
    os.getenv("QMOI_MAX_ITERATIONS", "20")
)

MAX_RUNTIME = int(
    os.getenv("QMOI_MAX_RUNTIME", "21600")
)

MAX_STAGNANT_ITERATIONS = int(
    os.getenv("QMOI_MAX_STAGNANT_ITERATIONS", "3")
)

MAX_RETRIES = int(
    os.getenv("QMOI_RETRIES", "2")
)

AUTO_REPAIR = os.getenv(
    "QMOI_AUTO_REPAIR",
    "true",
).lower() in {"1", "true", "yes", "on"}

TELEMETRY_ENABLED = os.getenv(
    "QMOI_TELEMETRY",
    "true",
).lower() in {"1", "true", "yes", "on"}

MAX_COMMAND_OUTPUT = int(
    os.getenv("QMOI_MAX_OUTPUT", "12000")
)

COMMAND_TIMEOUT = int(
    os.getenv("QMOI_COMMAND_TIMEOUT", "600")
)

PLATFORMS = [
    "windows",
    "macos",
    "linux",
    "ios",
    "android",
    "web",
]

QMOI_APPS = {
    "qmoiaiui": "Conversational AI Interface",
    "qmoi-space": "Media Player",
    "qcity": "File Manager",
    "qalpha": "IDE",
}

ALPHA_Q_AI_REPO = "thealphakenya/Alpha-Q-ai"
ALPHA_Q_AI_REPO_NAME = "Alpha-Q-ai"


# ============================================================================
# LOGGING
# ============================================================================

TRACK_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(AGENT_LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)

logger = logging.getLogger("qmoi-agent")


# ============================================================================
# GENERAL UTILITIES
# ============================================================================

def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_iso() -> str:
    """
    Precise UTC timestamp.

    Example:
        2026-08-15T03:42:18.123Z
    """
    now = utc_now()
    return now.strftime("%Y-%m-%dT%H:%M:%S.") + \
        f"{now.microsecond // 1000:03d}Z"


def file_timestamp() -> str:
    now = utc_now()
    return now.strftime("%Y%m%d_%H%M%S_") + \
        f"{now.microsecond // 1000:03d}"


def safe_name(value: Any, fallback: str = "unknown") -> str:
    value = str(value if value is not None else fallback)
    value = re.sub(r"[^A-Za-z0-9._-]+", "-", value)
    value = re.sub(r"-+", "-", value)
    value = value.strip("-._")
    return value or fallback


def sha256_text(value: str) -> str:
    return hashlib.sha256(
        value.encode("utf-8", errors="replace")
    ).hexdigest()


def truncate(value: Any, limit: int = MAX_COMMAND_OUTPUT) -> str:
    text = str(value or "")

    if len(text) <= limit:
        return text

    return (
        text[:limit]
        + "\n\n[OUTPUT TRUNCATED BY QMOI AGENT]\n"
    )


def atomic_write(path: Path, content: str) -> None:
    """
    Write important tracking state atomically.

    A temporary file is written first and then replaced so a partially written
    CURRENT_STATUS or STATE file is much less likely if the process terminates.
    """
    path.parent.mkdir(parents=True, exist_ok=True)

    temporary = path.with_name(
        f".{path.name}.{os.getpid()}.tmp"
    )

    temporary.write_text(
        content,
        encoding="utf-8",
    )

    temporary.replace(path)


def append_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open(
        "a",
        encoding="utf-8",
    ) as handle:
        handle.write(content)


def json_dump_atomic(path: Path, value: Any) -> None:
    content = json.dumps(
        value,
        indent=2,
        sort_keys=True,
        ensure_ascii=False,
    )

    atomic_write(path, content + "\n")


def redact(value: str) -> str:
    """
    Remove common secret/token patterns from telemetry.

    Telemetry must never become a place where GitHub tokens, API keys or
    passwords are accidentally persisted.
    """
    if not value:
        return ""

    text = str(value)

    patterns = [
        r"(?i)(ghp_[A-Za-z0-9_]+)",
        r"(?i)(github_pat_[A-Za-z0-9_]+)",
        r"(?i)(sk-[A-Za-z0-9_-]+)",
        r"(?i)(Bearer\s+)[A-Za-z0-9._-]+",
        r"(?i)(token\s*[=:]\s*)[^\s]+",
        r"(?i)(password\s*[=:]\s*)[^\s]+",
        r"(?i)(secret\s*[=:]\s*)[^\s]+",
    ]

    for pattern in patterns:
        text = re.sub(
            pattern,
            lambda match: (
                match.group(1)
                if match.lastindex
                else ""
            ) + "[REDACTED]",
            text,
        )

    return text


def command_exists(command: str) -> bool:
    return shutil.which(command) is not None


# ============================================================================
# EXECUTION ID
# ============================================================================

EXECUTION_ID = (
    f"{utc_now().strftime('%Y%m%dT%H%M%S')}-"
    f"{os.getpid()}-"
    f"{os.urandom(4).hex()}"
)


# ============================================================================
# TELEMETRY
# ============================================================================

class Telemetry:
    """
    Central telemetry protocol.

    Every important agent action passes through this class.

    Files:

        EVENTS.txt
            Human-readable chronological event stream.

        telemetry.jsonl
            Machine-readable event stream.

        ACTIONS.txt
            Actual operations performed.

        TASKS.txt
            Task-level lifecycle.

        ITERATIONS.txt
            Autonomous iteration lifecycle.

        ERRORS.txt
            Errors and exceptions.

        CURRENT_STATUS.txt
            Current live-ish status.

        STATE.txt
            Latest compact state.

        TRACKING_INDEX.txt
            Index of historical event files.

        CHECKPOINT.json
            Resume information.
    """

    def __init__(self) -> None:
        self.sequence = self._load_sequence()
        self.started_at = utc_iso()
        self.execution_id = EXECUTION_ID

        self.state: Dict[str, Any] = {
            "execution_id": self.execution_id,
            "agent": "QMOI Ollama Autonomous Agent",
            "version": "3.0",
            "started_at": self.started_at,
            "updated_at": self.started_at,
            "status": "starting",
            "phase": "initialization",
            "iteration": 0,
            "current_task": None,
            "completed_tasks": 0,
            "failed_tasks": 0,
            "skipped_tasks": 0,
            "active_task": None,
            "last_event_id": None,
            "last_event_type": None,
            "host": socket.gethostname(),
            "platform": host_platform.platform(),
            "python": sys.version.split()[0],
            "github": self._github_context(),
        }

        self._ensure_files()
        self.emit(
            "agent_started",
            "Agent execution started",
            details={
                "execution_id": self.execution_id,
                "command": " ".join(sys.argv),
            },
        )

    def _ensure_files(self) -> None:
        TRACK_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        for path in [
            CURRENT_STATUS_FILE,
            STATE_FILE,
            INDEX_FILE,
            EVENTS_FILE,
            ERRORS_FILE,
            ACTIONS_FILE,
            TASKS_FILE,
            ITERATIONS_FILE,
            PR_STATUS_FILE,
            SUMMARY_FILE,
            JSONL_FILE,
        ]:
            path.touch(exist_ok=True)

    def _load_sequence(self) -> int:
        """
        Recover the last event sequence from STATE/CHECKPOINT where possible.
        """
        try:
            if CHECKPOINT_FILE.exists():
                checkpoint = json.loads(
                    CHECKPOINT_FILE.read_text(
                        encoding="utf-8"
                    )
                )
                return int(
                    checkpoint.get("sequence", 0)
                )
        except Exception:
            pass

        return 0

    @staticmethod
    def _github_context() -> Dict[str, Any]:
        event = os.getenv("GITHUB_EVENT_NAME")

        return {
            "server": os.getenv("GITHUB_SERVER_URL"),
            "repository": os.getenv("GITHUB_REPOSITORY"),
            "run_id": os.getenv("GITHUB_RUN_ID"),
            "run_attempt": os.getenv("GITHUB_RUN_ATTEMPT"),
            "workflow": os.getenv("GITHUB_WORKFLOW"),
            "event": event,
            "sha": os.getenv("GITHUB_SHA"),
            "ref": os.getenv("GITHUB_REF"),
            "ref_name": os.getenv("GITHUB_REF_NAME"),
            "actor": os.getenv("GITHUB_ACTOR"),
            "job": os.getenv("GITHUB_JOB"),
        }

    def _next_event_id(self) -> str:
        self.sequence += 1

        return (
            f"{utc_now().strftime('%Y%m%d%H%M%S')}-"
            f"{self.sequence:08d}"
        )

    def emit(
        self,
        event_type: str,
        message: str,
        *,
        status: str = "info",
        phase: Optional[str] = None,
        iteration: Optional[int] = None,
        task_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> str:
        if not TELEMETRY_ENABLED:
            return ""

        event_id = self._next_event_id()
        timestamp = utc_iso()

        event = {
            "event_id": event_id,
            "execution_id": self.execution_id,
            "timestamp_utc": timestamp,
            "event_type": event_type,
            "status": status,
            "phase": phase or self.state.get("phase"),
            "iteration": iteration,
            "task_id": task_id,
            "message": redact(message),
            "details": details or {},
        }

        self.state["updated_at"] = timestamp
        self.state["last_event_id"] = event_id
        self.state["last_event_type"] = event_type

        if phase:
            self.state["phase"] = phase

        if iteration is not None:
            self.state["iteration"] = iteration

        json_line = json.dumps(
            event,
            ensure_ascii=False,
            sort_keys=True,
        )

        append_text(
            JSONL_FILE,
            json_line + "\n",
        )

        readable = (
            f"[{timestamp}] "
            f"[{event_id}] "
            f"[{status.upper()}] "
            f"[{event_type}] "
            f"{redact(message)}\n"
        )

        if details:
            readable += (
                json.dumps(
                    details,
                    ensure_ascii=False,
                    sort_keys=True,
                )
                + "\n"
            )

        append_text(
            EVENTS_FILE,
            readable + "\n",
        )

        self._update_index(
            event_id,
            timestamp,
            event_type,
            message,
        )

        self._write_state()

        logger.info(
            "[%s] %s",
            event_type,
            redact(message),
        )

        return event_id

    def _update_index(
        self,
        event_id: str,
        timestamp: str,
        event_type: str,
        message: str,
    ) -> None:
        append_text(
            INDEX_FILE,
            (
                f"{event_id} | "
                f"{timestamp} | "
                f"{event_type} | "
                f"{redact(message)}\n"
            ),
        )

    def action(
        self,
        action: str,
        *,
        status: str = "started",
        details: Optional[Dict[str, Any]] = None,
    ) -> str:
        event_id = self.emit(
            "action",
            action,
            status=status,
            phase="execution",
            details=details,
        )

        append_text(
            ACTIONS_FILE,
            (
                f"[{utc_iso()}] "
                f"{event_id} | "
                f"{status.upper()} | "
                f"{redact(action)}\n"
            ),
        )

        return event_id

    def task(
        self,
        task_id: str,
        name: str,
        status: str,
        *,
        iteration: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> str:
        if status == "started":
            self.state["current_task"] = name
            self.state["active_task"] = task_id

        elif status in {
            "completed",
            "failed",
            "skipped",
        }:
            self.state["current_task"] = None
            self.state["active_task"] = None

            if status == "completed":
                self.state["completed_tasks"] += 1

            elif status == "failed":
                self.state["failed_tasks"] += 1

            elif status == "skipped":
                self.state["skipped_tasks"] += 1

        event_id = self.emit(
            "task",
            f"{name}: {status}",
            status=status,
            phase="task",
            iteration=iteration,
            task_id=task_id,
            details=details,
        )

        append_text(
            TASKS_FILE,
            (
                f"[{utc_iso()}] "
                f"{event_id} | "
                f"iteration={iteration} | "
                f"task={task_id} | "
                f"{status.upper()} | "
                f"{redact(name)}\n"
            ),
        )

        return event_id

    def iteration(
        self,
        number: int,
        status: str,
        message: str,
        *,
        details: Optional[Dict[str, Any]] = None,
    ) -> str:
        event_id = self.emit(
            "iteration",
            message,
            status=status,
            phase="iteration",
            iteration=number,
            details=details,
        )

        append_text(
            ITERATIONS_FILE,
            (
                f"[{utc_iso()}] "
                f"{event_id} | "
                f"iteration={number} | "
                f"{status.upper()} | "
                f"{redact(message)}\n"
            ),
        )

        return event_id

    def error(
        self,
        message: str,
        *,
        exception: Optional[BaseException] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> str:
        if exception:
            details = dict(details or {})
            details["exception_type"] = type(
                exception
            ).__name__
            details["exception"] = str(exception)

        event_id = self.emit(
            "error",
            message,
            status="failure",
            phase="error",
            details=details,
        )

        append_text(
            ERRORS_FILE,
            (
                f"[{utc_iso()}] "
                f"{event_id} | "
                f"{redact(message)}\n"
                f"{json.dumps(details or {}, ensure_ascii=False)}\n\n"
            ),
        )

        return event_id

    def pr(
        self,
        data: Dict[str, Any],
    ) -> None:
        content = [
            "QMOI PR REALTIME STATUS",
            "=" * 80,
            f"Recorded UTC: {utc_iso()}",
            "",
        ]

        for key, value in data.items():
            content.append(
                f"{key}: {value}"
            )

        content.append("")

        atomic_write(
            PR_STATUS_FILE,
            "\n".join(content),
        )

        self.emit(
            "pr_status",
            "PR status updated",
            status="info",
            phase="pr-monitoring",
            details=data,
        )

    def status(
        self,
        *,
        status: Optional[str] = None,
        phase: Optional[str] = None,
    ) -> None:
        if status:
            self.state["status"] = status

        if phase:
            self.state["phase"] = phase

        self.state["updated_at"] = utc_iso()

        self._write_state()

    def _write_state(self) -> None:
        json_dump_atomic(
            CHECKPOINT_FILE,
            {
                **self.state,
                "sequence": self.sequence,
            },
        )

        lines = [
            "QMOI / OLLAMA AUTONOMOUS AGENT STATE",
            "=" * 80,
            f"Execution ID: {self.state['execution_id']}",
            f"Status:       {self.state['status']}",
            f"Phase:        {self.state['phase']}",
            f"Iteration:    {self.state['iteration']}",
            f"Started:      {self.state['started_at']}",
            f"Updated:      {self.state['updated_at']}",
            "",
            f"Current task: {self.state['current_task']}",
            f"Completed:    {self.state['completed_tasks']}",
            f"Failed:       {self.state['failed_tasks']}",
            f"Skipped:      {self.state['skipped_tasks']}",
            "",
            f"Last event:   {self.state['last_event_id']}",
            f"Last type:    {self.state['last_event_type']}",
            "",
            "GitHub context:",
        ]

        for key, value in self.state["github"].items():
            lines.append(
                f"  {key}: {value}"
            )

        atomic_write(
            STATE_FILE,
            "\n".join(lines) + "\n",
        )

        self._write_current_status()

    def _write_current_status(self) -> None:
        lines = [
            "QMOI / OLLAMA AUTONOMOUS AGENT",
            "REALTIME CURRENT STATUS",
            "=" * 80,
            f"Execution: {self.state['execution_id']}",
            f"UTC:       {utc_iso()}",
            f"Status:    {self.state['status']}",
            f"Phase:     {self.state['phase']}",
            f"Iteration: {self.state['iteration']}",
            "",
            "CURRENT ACTIVITY",
            "-" * 80,
            str(
                self.state["current_task"]
                or "No active task"
            ),
            "",
            "TASK COUNTS",
            "-" * 80,
            f"Completed: {self.state['completed_tasks']}",
            f"Failed:    {self.state['failed_tasks']}",
            f"Skipped:   {self.state['skipped_tasks']}",
            "",
            "GITHUB",
            "-" * 80,
        ]

        for key, value in self.state["github"].items():
            lines.append(
                f"{key}: {value}"
            )

        lines.extend([
            "",
            "LAST EVENT",
            "-" * 80,
            f"ID:   {self.state['last_event_id']}",
            f"Type: {self.state['last_event_type']}",
            "",
        ])

        atomic_write(
            CURRENT_STATUS_FILE,
            "\n".join(lines),
        )

    def summary(
        self,
        result: str,
        *,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        content = [
            "QMOI AUTONOMOUS AGENT EXECUTION SUMMARY",
            "=" * 80,
            f"Execution ID: {self.execution_id}",
            f"Started:      {self.state['started_at']}",
            f"Finished:     {utc_iso()}",
            f"Result:       {result}",
            f"Iterations:   {self.state['iteration']}",
            f"Completed:    {self.state['completed_tasks']}",
            f"Failed:       {self.state['failed_tasks']}",
            f"Skipped:      {self.state['skipped_tasks']}",
            "",
        ]

        if details:
            content.append(
                json.dumps(
                    details,
                    indent=2,
                    ensure_ascii=False,
                )
            )

        atomic_write(
            SUMMARY_FILE,
            "\n".join(content) + "\n",
        )


# ============================================================================
# COMMAND EXECUTION
# ============================================================================

@dataclass
class CommandResult:
    command: List[str]
    returncode: Optional[int]
    status: str
    duration_seconds: float
    stdout: str
    stderr: str
    timed_out: bool = False

    @property
    def success(self) -> bool:
        return (
            self.status == "success"
            and self.returncode == 0
        )


class CommandRunner:
    """
    Safe subprocess wrapper.

    All command execution is observable and bounded.
    """

    def __init__(self, telemetry: Telemetry):
        self.telemetry = telemetry

    def run(
        self,
        command: Sequence[str],
        *,
        cwd: Optional[Path] = None,
        timeout: int = COMMAND_TIMEOUT,
        env: Optional[Dict[str, str]] = None,
        task_id: Optional[str] = None,
        allow_failure: bool = False,
    ) -> CommandResult:

        command_list = [
            str(item)
            for item in command
        ]

        display_command = " ".join(
            safe_name(item, "")
            if (
                item.startswith("-")
                or "/" not in item
                and "\\" not in item
            )
            else item
            for item in command_list
        )

        self.telemetry.action(
            f"Executing command: {display_command}",
            details={
                "command": command_list,
                "cwd": str(cwd or ROOT_DIR),
                "timeout": timeout,
                "task_id": task_id,
            },
        )

        started = time.monotonic()

        merged_env = os.environ.copy()

        if env:
            merged_env.update(env)

        try:
            process = subprocess.run(
                command_list,
                cwd=str(cwd or ROOT_DIR),
                env=merged_env,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
                check=False,
            )

            duration = time.monotonic() - started

            stdout = redact(
                truncate(process.stdout)
            )

            stderr = redact(
                truncate(process.stderr)
            )

            result = CommandResult(
                command=command_list,
                returncode=process.returncode,
                status=(
                    "success"
                    if process.returncode == 0
                    else "failure"
                ),
                duration_seconds=round(
                    duration,
                    3,
                ),
                stdout=stdout,
                stderr=stderr,
            )

        except subprocess.TimeoutExpired as exc:
            duration = time.monotonic() - started

            result = CommandResult(
                command=command_list,
                returncode=None,
                status="timeout",
                duration_seconds=round(
                    duration,
                    3,
                ),
                stdout=redact(
                    truncate(
                        exc.stdout or ""
                    )
                ),
                stderr=redact(
                    truncate(
                        exc.stderr or ""
                    )
                ),
                timed_out=True,
            )

        except Exception as exc:
            duration = time.monotonic() - started

            result = CommandResult(
                command=command_list,
                returncode=None,
                status="exception",
                duration_seconds=round(
                    duration,
                    3,
                ),
                stdout="",
                stderr=redact(str(exc)),
            )

        event_details = asdict(result)

        if result.success:
            self.telemetry.action(
                f"Command completed successfully: {display_command}",
                status="completed",
                details=event_details,
            )
        else:
            self.telemetry.action(
                f"Command did not succeed: {display_command}",
                status=(
                    "timeout"
                    if result.timed_out
                    else "failed"
                ),
                details=event_details,
            )

            if not allow_failure:
                self.telemetry.error(
                    f"Command failed: {display_command}",
                    details=event_details,
                )

        return result


# ============================================================================
# RETRY
# ============================================================================

def retry_operation(
    operation,
    *,
    telemetry: Telemetry,
    name: str,
    retries: int = MAX_RETRIES,
    iteration: Optional[int] = None,
):
    """
    Bounded exponential retry.

    Deliberately finite so temporary failures do not become infinite loops.
    """

    attempts = max(1, retries + 1)

    for attempt in range(1, attempts + 1):
        telemetry.emit(
            "retry_attempt",
            f"{name} attempt {attempt}/{attempts}",
            status="started",
            iteration=iteration,
            details={
                "attempt": attempt,
                "max_attempts": attempts,
            },
        )

        try:
            result = operation()

            if result:
                telemetry.emit(
                    "retry_success",
                    f"{name} succeeded on attempt {attempt}",
                    status="completed",
                    iteration=iteration,
                    details={
                        "attempt": attempt,
                    },
                )
                return result

            telemetry.emit(
                "retry_unsuccessful",
                f"{name} did not succeed on attempt {attempt}",
                status="failed",
                iteration=iteration,
                details={
                    "attempt": attempt,
                },
            )

        except Exception as exc:
            telemetry.error(
                f"{name} raised an exception",
                exception=exc,
                details={
                    "attempt": attempt,
                },
            )

        if attempt < attempts:
            delay = min(
                2 ** (attempt - 1),
                30,
            )

            telemetry.emit(
                "retry_wait",
                f"Waiting {delay}s before retrying {name}",
                status="waiting",
                iteration=iteration,
                details={
                    "delay_seconds": delay,
                },
            )

            time.sleep(delay)

    return False


# ============================================================================
# OLLAMA CLIENT
# ============================================================================

class OllamaClient:
    """
    Minimal Ollama HTTP client using only Python's standard library.

    Ollama is optional. The autonomous validation framework continues to work
    when Ollama is unavailable, but telemetry records that fact explicitly.
    """

    def __init__(
        self,
        telemetry: Telemetry,
    ):
        self.telemetry = telemetry
        self.host = OLLAMA_HOST
        self.model = OLLAMA_MODEL
        self.timeout = OLLAMA_TIMEOUT

    def health(self) -> bool:
        url = f"{self.host}/api/tags"

        self.telemetry.action(
            "Checking Ollama availability",
            details={
                "url": url,
                "model": self.model,
            },
        )

        try:
            request = urllib.request.Request(
                url,
                method="GET",
            )

            with urllib.request.urlopen(
                request,
                timeout=self.timeout,
            ) as response:
                response.read()
                healthy = (
                    200 <= response.status < 300
                )

            if healthy:
                self.telemetry.emit(
                    "ollama_available",
                    "Ollama API is reachable",
                    status="completed",
                    details={
                        "host": self.host,
                        "model": self.model,
                    },
                )

            return healthy

        except Exception as exc:
            self.telemetry.emit(
                "ollama_unavailable",
                "Ollama API is not currently reachable",
                status="warning",
                details={
                    "host": self.host,
                    "error": str(exc),
                },
            )

            return False

    def generate(
        self,
        prompt: str,
        *,
        system: Optional[str] = None,
        iteration: Optional[int] = None,
    ) -> Optional[str]:

        payload: Dict[str, Any] = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        if system:
            payload["system"] = system

        data = json.dumps(
            payload
        ).encode("utf-8")

        request = urllib.request.Request(
            f"{self.host}/api/generate",
            data=data,
            method="POST",
            headers={
                "Content-Type": "application/json",
            },
        )

        self.telemetry.emit(
            "ollama_request_started",
            "Sending autonomous reasoning request to Ollama",
            status="started",
            phase="reasoning",
            iteration=iteration,
            details={
                "model": self.model,
                "prompt_sha256": sha256_text(prompt),
                "prompt_length": len(prompt),
            },
        )

        started = time.monotonic()

        try:
            with urllib.request.urlopen(
                request,
                timeout=self.timeout,
            ) as response:

                body = response.read()

            result = json.loads(
                body.decode(
                    "utf-8",
                    errors="replace",
                )
            )

            generated = result.get(
                "response"
            )

            duration = round(
                time.monotonic() - started,
                3,
            )

            if not generated:
                self.telemetry.error(
                    "Ollama returned no generated response",
                    details={
                        "duration_seconds": duration,
                    },
                )
                return None

            self.telemetry.emit(
                "ollama_request_completed",
                "Ollama reasoning request completed",
                status="completed",
                phase="reasoning",
                iteration=iteration,
                details={
                    "duration_seconds": duration,
                    "response_length": len(generated),
                    "response_sha256": sha256_text(
                        generated
                    ),
                },
            )

            return generated

        except Exception as exc:
            self.telemetry.error(
                "Ollama reasoning request failed",
                exception=exc,
                details={
                    "duration_seconds": round(
                        time.monotonic() - started,
                        3,
                    ),
                },
            )

            return None


# ============================================================================
# PLATFORM VALIDATION
# ============================================================================

class PlatformValidator:
    """
    Platform-aware validation.

    A platform is never declared successful merely because its toolchain is
    unavailable. It is explicitly marked unavailable/skipped.
    """

    def __init__(
        self,
        platform_name: str,
        telemetry: Telemetry,
        runner: CommandRunner,
    ):
        self.platform = platform_name
        self.telemetry = telemetry
        self.runner = runner

    def app_dir(
        self,
        app_name: str,
    ) -> Path:
        return APPS_DIR / (
            f"{app_name}-{self.platform}"
        )

    def validate_code_compiles(
        self,
        app_name: str,
        iteration: Optional[int] = None,
    ) -> Optional[bool]:

        task_id = (
            f"compile-{self.platform}-"
            f"{safe_name(app_name)}"
        )

        app_dir = self.app_dir(app_name)

        self.telemetry.task(
            task_id,
            f"Compile {app_name} for {self.platform}",
            "started",
            iteration=iteration,
        )

        if not app_dir.exists():
            self.telemetry.task(
                task_id,
                f"Compile {app_name} for {self.platform}",
                "skipped",
                iteration=iteration,
                details={
                    "reason": "application directory missing",
                    "path": str(app_dir),
                },
            )
            return None

        command: Optional[List[str]] = None
        timeout = COMMAND_TIMEOUT

        if self.platform == "windows":
            if command_exists("dotnet"):
                command = [
                    "dotnet",
                    "build",
                    "--configuration",
                    "Release",
                ]
                timeout = 600

        elif self.platform in {"macos", "ios"}:
            if command_exists("xcodebuild"):
                command = [
                    "xcodebuild",
                    "build",
                    "-configuration",
                    "Release",
                ]
                timeout = 900

        elif self.platform == "linux":
            if (
                command_exists("npm")
                and (
                    app_dir / "package.json"
                ).exists()
            ):
                command = [
                    "npm",
                    "run",
                    "build:linux",
                ]
                timeout = 600

        elif self.platform == "android":
            gradlew = (
                app_dir / "gradlew"
            )

            if gradlew.exists():
                command = [
                    str(gradlew),
                    "build",
                    "-PbuildType=release",
                ]
                timeout = 1200
            elif command_exists("gradle"):
                command = [
                    "gradle",
                    "build",
                ]
                timeout = 1200

        elif self.platform == "web":
            if (
                command_exists("npm")
                and (
                    app_dir / "package.json"
                ).exists()
            ):
                command = [
                    "npm",
                    "run",
                    "build",
                ]
                timeout = 600

        if command is None:
            self.telemetry.task(
                task_id,
                f"Compile {app_name} for {self.platform}",
                "skipped",
                iteration=iteration,
                details={
                    "reason": "required platform toolchain unavailable"
                },
            )
            return None

        result = self.runner.run(
            command,
            cwd=app_dir,
            timeout=timeout,
            task_id=task_id,
        )

        if result.success:
            self.telemetry.task(
                task_id,
                f"Compile {app_name} for {self.platform}",
                "completed",
                iteration=iteration,
                details={
                    "duration_seconds":
                        result.duration_seconds,
                    "returncode":
                        result.returncode,
                },
            )
            return True

        self.telemetry.task(
            task_id,
            f"Compile {app_name} for {self.platform}",
            "failed",
            iteration=iteration,
            details={
                "returncode":
                    result.returncode,
                "status":
                    result.status,
                "stderr":
                    result.stderr,
            },
        )

        return False

    def validate_dependencies_resolve(
        self,
        app_name: str,
        iteration: Optional[int] = None,
    ) -> Optional[bool]:

        task_id = (
            f"dependencies-{self.platform}-"
            f"{safe_name(app_name)}"
        )

        app_dir = self.app_dir(app_name)

        self.telemetry.task(
            task_id,
            f"Resolve dependencies for {app_name}/{self.platform}",
            "started",
            iteration=iteration,
        )

        if not app_dir.exists():
            self.telemetry.task(
                task_id,
                f"Resolve dependencies for {app_name}/{self.platform}",
                "skipped",
                iteration=iteration,
                details={
                    "reason": "application directory missing",
                },
            )
            return None

        command: Optional[List[str]] = None

        if self.platform in {
            "windows",
            "linux",
            "web",
        }:
            package_json = (
                app_dir / "package.json"
            )

            if (
                package_json.exists()
                and command_exists("npm")
            ):
                command = [
                    "npm",
                    "ci",
                    "--ignore-scripts",
                ]

        elif self.platform in {
            "ios",
            "macos",
        }:
            if (
                (
                    app_dir / "Podfile"
                ).exists()
                and command_exists("pod")
            ):
                command = [
                    "pod",
                    "install",
                    "--no-repo-update",
                ]

        elif self.platform == "android":
            # Gradle dependency resolution occurs as part of build.
            self.telemetry.task(
                task_id,
                f"Resolve dependencies for {app_name}/{self.platform}",
                "skipped",
                iteration=iteration,
                details={
                    "reason":
                        "delegated to Gradle build",
                },
            )
            return None

        if command is None:
            self.telemetry.task(
                task_id,
                f"Resolve dependencies for {app_name}/{self.platform}",
                "skipped",
                iteration=iteration,
                details={
                    "reason":
                        "dependency manager unavailable or configuration absent",
                },
            )
            return None

        result = self.runner.run(
            command,
            cwd=app_dir,
            timeout=600,
            task_id=task_id,
        )

        if result.success:
            self.telemetry.task(
                task_id,
                f"Resolve dependencies for {app_name}/{self.platform}",
                "completed",
                iteration=iteration,
                details={
                    "duration_seconds":
                        result.duration_seconds,
                },
            )
            return True

        self.telemetry.task(
            task_id,
            f"Resolve dependencies for {app_name}/{self.platform}",
            "failed",
            iteration=iteration,
            details={
                "stderr": result.stderr,
            },
        )

        return False

    def validate_manifests_present(
        self,
        app_name: str,
        iteration: Optional[int] = None,
    ) -> bool:

        task_id = (
            f"manifests-{self.platform}-"
            f"{safe_name(app_name)}"
        )

        self.telemetry.task(
            task_id,
            f"Validate manifests for {app_name}/{self.platform}",
            "started",
            iteration=iteration,
        )

        required_files = {
            "windows": [
                "app.manifest",
                "version.rc",
            ],
            "macos": [
                "Info.plist",
                "Entitlements.plist",
            ],
            "linux": [
                f"{app_name}.desktop",
                "AppImageBuilder.yml",
            ],
            "ios": [
                "Info.plist",
                "Entitlements.plist",
            ],
            "android": [
                "AndroidManifest.xml",
                "build.gradle",
            ],
            "web": [
                "public/manifest.webmanifest",
                "public/index.html",
            ],
        }

        app_dir = self.app_dir(app_name)

        if not app_dir.exists():
            self.telemetry.task(
                task_id,
                f"Validate manifests for {app_name}/{self.platform}",
                "failed",
                iteration=iteration,
                details={
                    "reason": "application directory missing",
                },
            )
            return False

        missing = []

        for filename in required_files.get(
            self.platform,
            [],
        ):
            if not (
                app_dir / filename
            ).exists():
                missing.append(filename)

        if missing:
            self.telemetry.task(
                task_id,
                f"Validate manifests for {app_name}/{self.platform}",
                "failed",
                iteration=iteration,
                details={
                    "missing": missing,
                },
            )
            return False

        self.telemetry.task(
            task_id,
            f"Validate manifests for {app_name}/{self.platform}",
            "completed",
            iteration=iteration,
        )

        return True

    def validate_signatures(
        self,
        app_name: str,
        iteration: Optional[int] = None,
    ) -> Optional[bool]:

        task_id = (
            f"signatures-{self.platform}-"
            f"{safe_name(app_name)}"
        )

        self.telemetry.task(
            task_id,
            f"Validate signatures for {app_name}/{self.platform}",
            "started",
            iteration=iteration,
        )

        command: Optional[List[str]] = None

        if self.platform == "windows":
            dist_file = (
                DIST_DIR /
                f"{app_name}-1.2.3.exe"
            )

            if (
                dist_file.exists()
                and command_exists("signtool")
            ):
                command = [
                    "signtool",
                    "verify",
                    "/pa",
                    str(dist_file),
                ]

        elif self.platform == "macos":
            bundle = (
                DIST_DIR /
                f"{app_name}.app"
            )

            if (
                bundle.exists()
                and command_exists("codesign")
            ):
                command = [
                    "codesign",
                    "--verify",
                    str(bundle),
                ]

        elif self.platform == "linux":
            signature = (
                DIST_DIR /
                f"{app_name}-1.2.3.AppImage.asc"
            )

            app_file = (
                DIST_DIR /
                f"{app_name}-1.2.3.AppImage"
            )

            if (
                signature.exists()
                and app_file.exists()
                and command_exists("gpg")
            ):
                command = [
                    "gpg",
                    "--verify",
                    str(signature),
                    str(app_file),
                ]

        if command is None:
            self.telemetry.task(
                task_id,
                f"Validate signatures for {app_name}/{self.platform}",
                "skipped",
                iteration=iteration,
                details={
                    "reason":
                        "signature artifact/tool unavailable",
                },
            )
            return None

        result = self.runner.run(
            command,
            timeout=120,
            task_id=task_id,
        )

        if result.success:
            self.telemetry.task(
                task_id,
                f"Validate signatures for {app_name}/{self.platform}",
                "completed",
                iteration=iteration,
            )
            return True

        self.telemetry.task(
            task_id,
            f"Validate signatures for {app_name}/{self.platform}",
            "failed",
            iteration=iteration,
            details={
                "stderr": result.stderr,
            },
        )

        return False


# ============================================================================
# FEATURE TESTING
# ============================================================================

class FeatureTester:
    """
    Feature testing registry.

    The previous implementation returned True for many placeholder methods.
    That is unsafe for a production validation system.

    This implementation records unavailable/unimplemented tests explicitly
    instead of fabricating successful results.
    """

    FEATURE_REGISTRY = {
        "qmoiaiui": [
            "conversation_creation",
            "message_history",
            "model_selector",
            "parameter_tuning",
            "export_functionality",
            "voice_input",
            "voice_output",
            "memory_persistence",
            "accessibility_features",
            "platform_specific_styling",
        ],
        "qcity": [
            "folder_tree_navigation",
            "view_modes",
            "search_functionality",
            "batch_operations",
            "duplicate_finder",
            "smart_tags",
            "auto_organization",
            "cloud_storage_integration",
            "voice_commands",
            "gesture_controls",
            "file_preview",
        ],
        "qmoi-space": [
            "playback_controls",
            "volume_control",
            "quality_selection",
            "subtitle_switching",
            "audio_track_switching",
            "playlist_management",
            "picture_in_picture",
            "media_library",
            "voice_control",
            "gesture_control",
            "keyboard_shortcuts",
            "eye_tracking",
        ],
        "qalpha": [
            "code_editing",
            "syntax_highlighting",
            "code_completion",
            "debugger",
            "terminal_integration",
            "git_integration",
            "file_explorer",
            "theme_support",
            "keyboard_shortcuts",
            "extensions",
        ],
    }

    def __init__(
        self,
        telemetry: Telemetry,
    ):
        self.telemetry = telemetry

    def discover_real_tests(
        self,
        app_name: str,
    ) -> List[Path]:

        candidates: List[Path] = []

        if not TESTS_DIR.exists():
            return candidates

        for pattern in [
            f"*{app_name}*.py",
            f"*{app_name}*.js",
            f"*{app_name}*.ts",
        ]:
            candidates.extend(
                TESTS_DIR.rglob(pattern)
            )

        return sorted(
            set(candidates)
        )

    def test_app(
        self,
        app_name: str,
        platform_name: str,
        *,
        iteration: Optional[int] = None,
    ) -> Dict[str, Any]:

        task_id = (
            f"features-{safe_name(app_name)}-"
            f"{safe_name(platform_name)}"
        )

        self.telemetry.task(
            task_id,
            (
                f"Feature validation for "
                f"{app_name}/{platform_name}"
            ),
            "started",
            iteration=iteration,
        )

        feature_names = self.FEATURE_REGISTRY.get(
            app_name,
            [],
        )

        tests = self.discover_real_tests(
            app_name
        )

        results: Dict[str, Any] = {
            "app": app_name,
            "platform": platform_name,
            "features": {},
            "real_test_files": [
                str(path.relative_to(ROOT_DIR))
                for path in tests
            ],
        }

        if tests:
            results["test_status"] = (
                "test_files_discovered"
            )
        else:
            results["test_status"] = (
                "no_dedicated_feature_test_files_found"
            )

        for feature in feature_names:
            results["features"][feature] = {
                "status": "not_individually_verified",
                "reason":
                    "No implementation-specific feature test "
                    "was provided to the agent.",
            }

            self.telemetry.emit(
                "feature_observed",
                (
                    f"Feature requires explicit verification: "
                    f"{app_name}/{feature}"
                ),
                status="warning",
                phase="feature-validation",
                iteration=iteration,
                task_id=task_id,
                details={
                    "app": app_name,
                    "platform": platform_name,
                    "feature": feature,
                    "verified": False,
                },
            )

        self.telemetry.task(
            task_id,
            (
                f"Feature validation for "
                f"{app_name}/{platform_name}"
            ),
            "completed",
            iteration=iteration,
            details={
                "features_registered": len(feature_names),
                "feature_tests_verified": 0,
                "feature_tests_not_implemented": len(
                    feature_names
                ),
            },
        )

        return results


# ============================================================================
# FILE HANDLER VALIDATION
# ============================================================================

class FileHandlerValidator:
    FILE_TYPE_MAPPING = {
        ".pdf": "qcity",
        ".docx": "qcity",
        ".doc": "qcity",
        ".txt": "qcity",
        ".md": "qcity",
        ".odt": "qcity",
        ".mp3": "qmoi-space",
        ".m4a": "qmoi-space",
        ".flac": "qmoi-space",
        ".wav": "qmoi-space",
        ".aac": "qmoi-space",
        ".mp4": "qmoi-space",
        ".mkv": "qmoi-space",
        ".avi": "qmoi-space",
        ".mov": "qmoi-space",
        ".webm": "qmoi-space",
        ".zip": "qcity",
        ".tar": "qcity",
        ".gz": "qcity",
        ".rar": "qcity",
        ".7z": "qcity",
        ".py": "qalpha",
        ".js": "qalpha",
        ".ts": "qalpha",
        ".tsx": "qalpha",
        ".jsx": "qalpha",
        ".java": "qalpha",
        ".cpp": "qalpha",
        ".cs": "qalpha",
        ".go": "qalpha",
        ".rs": "qalpha",
        ".xlsx": "qcity",
        ".csv": "qcity",
        ".ods": "qcity",
        ".pptx": "qcity",
        ".odp": "qcity",
        ".jpg": "qcity",
        ".png": "qcity",
        ".gif": "qcity",
        ".webp": "qcity",
        ".svg": "qcity",
    }

    MIME_MAP = {
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".pdf": "application/pdf",
        ".txt": "text/plain",
        ".zip": "application/zip",
        ".py": "text/x-python",
        ".json": "application/json",
    }

    def __init__(
        self,
        telemetry: Telemetry,
        runner: CommandRunner,
    ):
        self.telemetry = telemetry
        self.runner = runner

    def validate(
        self,
        platform_name: str,
        *,
        iteration: Optional[int] = None,
    ) -> Dict[str, Any]:

        task_id = (
            f"file-handlers-{safe_name(platform_name)}"
        )

        self.telemetry.task(
            task_id,
            f"Validate file handlers on {platform_name}",
            "started",
            iteration=iteration,
        )

        results: Dict[str, Any] = {}

        if platform_name == "windows":
            if not command_exists("reg"):
                self.telemetry.task(
                    task_id,
                    f"Validate file handlers on {platform_name}",
                    "skipped",
                    iteration=iteration,
                    details={
                        "reason":
                            "Windows registry command unavailable",
                    },
                )
                return results

            for ext in self.FILE_TYPE_MAPPING:
                result = self.runner.run(
                    [
                        "reg",
                        "query",
                        f"HKEY_CLASSES_ROOT\\{ext}",
                    ],
                    timeout=10,
                    task_id=task_id,
                    allow_failure=True,
                )

                results[ext] = (
                    result.returncode == 0
                )

        elif platform_name == "linux":
            if not command_exists("xdg-mime"):
                self.telemetry.task(
                    task_id,
                    f"Validate file handlers on {platform_name}",
                    "skipped",
                    iteration=iteration,
                    details={
                        "reason":
                            "xdg-mime unavailable",
                    },
                )
                return results

            for ext in self.FILE_TYPE_MAPPING:
                mime = self.MIME_MAP.get(
                    ext,
                    "application/octet-stream",
                )

                result = self.runner.run(
                    [
                        "xdg-mime",
                        "query",
                        "default",
                        mime,
                    ],
                    timeout=10,
                    task_id=task_id,
                    allow_failure=True,
                )

                results[ext] = (
                    result.returncode == 0
                    and bool(result.stdout.strip())
                )

        elif platform_name == "macos":
            if not command_exists("duti"):
                self.telemetry.task(
                    task_id,
                    f"Validate file handlers on {platform_name}",
                    "skipped",
                    iteration=iteration,
                    details={
                        "reason": "duti unavailable",
                    },
                )
                return results

            for ext in self.FILE_TYPE_MAPPING:
                result = self.runner.run(
                    [
                        "duti",
                        "-d",
                        ext,
                    ],
                    timeout=10,
                    task_id=task_id,
                    allow_failure=True,
                )

                results[ext] = (
                    result.returncode == 0
                )

        else:
            results["all_types"] = {
                "status": "not_automatically_verified",
                "reason":
                    "Platform uses application-specific registration.",
            }

        self.telemetry.task(
            task_id,
            f"Validate file handlers on {platform_name}",
            "completed",
            iteration=iteration,
            details={
                "items_checked": len(results),
            },
        )

        return results


# ============================================================================
# MEMORY INDEX
# ============================================================================

class MemoryIndexGenerator:
    """
    Generates the repository memory index without replacing the historical
    telemetry protocol.
    """

    def __init__(
        self,
        root_dir: Path,
        telemetry: Telemetry,
    ):
        self.root_dir = root_dir
        self.telemetry = telemetry

        self.index_path = (
            root_dir /
            "QMOI_REALTIME_MEMORY_INDEX.md"
        )

        self.json_path = (
            root_dir /
            ".qmoi_memory_index.json"
        )

    def generate_index(self) -> None:
        task_id = "memory-index"

        self.telemetry.task(
            task_id,
            "Generate QMOI realtime memory index",
            "started",
        )

        patterns = [
            "*.md",
            "*.yml",
            "*.yaml",
            "*.json",
            "*.py",
            "*.ts",
            "*.tsx",
            "*.js",
            "*.jsx",
        ]

        files: List[Path] = []

        for pattern in patterns:
            files.extend(
                self.root_dir.rglob(pattern)
            )

        excluded_parts = {
            ".git",
            "node_modules",
            ".venv",
            "venv",
            "__pycache__",
            "dist",
            "build",
        }

        filtered = []

        for path in files:
            if any(
                part in excluded_parts
                for part in path.parts
            ):
                continue

            filtered.append(path)

        filtered = sorted(
            set(filtered)
        )

        records = []

        for path in filtered:
            try:
                stat = path.stat()

                records.append({
                    "path": str(
                        path.relative_to(
                            self.root_dir
                        )
                    ),
                    "size": stat.st_size,
                    "modified_utc":
                        datetime.fromtimestamp(
                            stat.st_mtime,
                            timezone.utc,
                        ).isoformat(),
                })

            except OSError:
                continue

        markdown = [
            "# QMOI Realtime Memory Index",
            "",
            f"Generated: {utc_iso()}",
            "",
            f"Tracked files: {len(records)}",
            "",
            "## Files",
            "",
        ]

        for record in records:
            markdown.append(
                "- `{path}` — {size} bytes — {modified}".format(
                    path=record["path"],
                    size=record["size"],
                    modified=record["modified_utc"],
                )
            )

        atomic_write(
            self.index_path,
            "\n".join(markdown) + "\n",
        )

        json_dump_atomic(
            self.json_path,
            {
                "generated_utc": utc_iso(),
                "count": len(records),
                "files": records,
            },
        )

        self.telemetry.task(
            task_id,
            "Generate QMOI realtime memory index",
            "completed",
            details={
                "files": len(records),
            },
        )


# ============================================================================
# GITHUB / PR CONTEXT
# ============================================================================

class GitHubContextCollector:
    """
    Collects local GitHub Actions context.

    This intentionally does not require a GitHub token or network request.
    The companion monitoring workflow is responsible for richer GitHub REST
    reconciliation.
    """

    def __init__(
        self,
        telemetry: Telemetry,
    ):
        self.telemetry = telemetry

    def collect(
        self,
        *,
        iteration: Optional[int] = None,
    ) -> Dict[str, Any]:

        task_id = "github-context"

        self.telemetry.task(
            task_id,
            "Collect GitHub and PR execution context",
            "started",
            iteration=iteration,
        )

        context = {
            "repository":
                os.getenv("GITHUB_REPOSITORY"),
            "workflow":
                os.getenv("GITHUB_WORKFLOW"),
            "workflow_ref":
                os.getenv("GITHUB_WORKFLOW_REF"),
            "run_id":
                os.getenv("GITHUB_RUN_ID"),
            "run_attempt":
                os.getenv("GITHUB_RUN_ATTEMPT"),
            "event":
                os.getenv("GITHUB_EVENT_NAME"),
            "sha":
                os.getenv("GITHUB_SHA"),
            "ref":
                os.getenv("GITHUB_REF"),
            "ref_name":
                os.getenv("GITHUB_REF_NAME"),
            "actor":
                os.getenv("GITHUB_ACTOR"),
            "job":
                os.getenv("GITHUB_JOB"),
            "server":
                os.getenv("GITHUB_SERVER_URL"),
            "workspace":
                os.getenv("GITHUB_WORKSPACE"),
        }

        event_path = os.getenv(
            "GITHUB_EVENT_PATH"
        )

        if event_path:
            try:
                event_file = Path(event_path)

                if event_file.exists():
                    event = json.loads(
                        event_file.read_text(
                            encoding="utf-8"
                        )
                    )

                    context["pull_requests"] = [
                        {
                            "number":
                                pr.get("number"),
                            "title":
                                pr.get("title"),
                            "url":
                                pr.get("html_url"),
                            "head_sha":
                                (
                                    pr.get("head", {})
                                    .get("sha")
                                ),
                            "head_ref":
                                (
                                    pr.get("head", {})
                                    .get("ref")
                                ),
                            "base_ref":
                                (
                                    pr.get("base", {})
                                    .get("ref")
                                ),
                        }
                        for pr in (
                            event.get(
                                "pull_request",
                            )
                            and [
                                {
                                    **event["pull_request"],
                                    "number":
                                        event.get(
                                            "number"
                                        ),
                                }
                            ]
                            or event.get(
                                "pull_requests",
                                [],
                            )
                        )
                    ]

                    workflow_run = event.get(
                        "workflow_run"
                    )

                    if workflow_run:
                        context["workflow_run"] = {
                            "id":
                                workflow_run.get("id"),
                            "name":
                                workflow_run.get("name"),
                            "status":
                                workflow_run.get("status"),
                            "conclusion":
                                workflow_run.get(
                                    "conclusion"
                                ),
                            "head_branch":
                                workflow_run.get(
                                    "head_branch"
                                ),
                            "head_sha":
                                workflow_run.get(
                                    "head_sha"
                                ),
                            "html_url":
                                workflow_run.get(
                                    "html_url"
                                ),
                        }

            except Exception as exc:
                self.telemetry.error(
                    "Could not parse GitHub event payload",
                    exception=exc,
                )

        self.telemetry.task(
            task_id,
            "Collect GitHub and PR execution context",
            "completed",
            iteration=iteration,
            details=context,
        )

        return context


# ============================================================================
# VALIDATION RESULT
# ============================================================================

@dataclass
class ValidationResult:
    name: str
    status: str
    passed: int = 0
    failed: int = 0
    skipped: int = 0
    warnings: int = 0
    details: Dict[str, Any] = field(
        default_factory=dict
    )

    @property
    def successful(self) -> bool:
        return (
            self.status == "success"
            and self.failed == 0
        )


# ============================================================================
# AUTONOMOUS AGENT
# ============================================================================

class AutonomousAgent:
    """
    Main autonomous orchestration engine.
    """

    def __init__(
        self,
        *,
        max_iterations: int = MAX_ITERATIONS,
        max_runtime: int = MAX_RUNTIME,
    ):
        self.telemetry = Telemetry()

        self.runner = CommandRunner(
            self.telemetry
        )

        self.ollama = OllamaClient(
            self.telemetry
        )

        self.max_iterations = max(
            1,
            max_iterations,
        )

        self.max_runtime = max(
            60,
            max_runtime,
        )

        self.platform_results: Dict[
            str,
            Any,
        ] = {}

        self.iteration_fingerprints: List[
            str
        ] = []

        self.started_monotonic = time.monotonic()

        self.validator_objects = {
            platform_name:
                PlatformValidator(
                    platform_name,
                    self.telemetry,
                    self.runner,
                )
            for platform_name in PLATFORMS
        }

        self.feature_tester = FeatureTester(
            self.telemetry
        )

        self.file_handler_validator = (
            FileHandlerValidator(
                self.telemetry,
                self.runner,
            )
        )

        self.memory_index = MemoryIndexGenerator(
            ROOT_DIR,
            self.telemetry,
        )

        self.github_context = (
            GitHubContextCollector(
                self.telemetry
            )
        )

    # ------------------------------------------------------------------------
    # RUNTIME LIMITS
    # ------------------------------------------------------------------------

    def runtime_expired(self) -> bool:
        elapsed = (
            time.monotonic()
            - self.started_monotonic
        )

        return elapsed >= self.max_runtime

    def remaining_runtime(self) -> float:
        elapsed = (
            time.monotonic()
            - self.started_monotonic
        )

        return max(
            0.0,
            self.max_runtime - elapsed,
        )

    # ------------------------------------------------------------------------
    # DOCTOR
    # ------------------------------------------------------------------------

    def doctor(self) -> Dict[str, Any]:
        self.telemetry.status(
            status="running",
            phase="doctor",
        )

        results = {
            "python": sys.version,
            "platform": host_platform.platform(),
            "hostname": socket.gethostname(),
            "root": str(ROOT_DIR),
            "tracking_directory":
                str(TRACK_DIR),
            "ollama_host":
                OLLAMA_HOST,
            "ollama_model":
                OLLAMA_MODEL,
            "commands": {},
        }

        commands = [
            "git",
            "python",
            "npm",
            "node",
            "dotnet",
            "gradle",
            "pod",
            "xcodebuild",
            "ollama",
        ]

        for command in commands:
            results["commands"][command] = (
                shutil.which(command)
            )

        ollama_available = self.ollama.health()

        results["ollama_available"] = (
            ollama_available
        )

        self.telemetry.emit(
            "doctor_completed",
            "Environment doctor completed",
            status="completed",
            details=results,
        )

        self.telemetry.status(
            status="completed",
            phase="doctor",
        )

        self.telemetry.summary(
            "doctor_completed",
            details=results,
        )

        return results

    # ------------------------------------------------------------------------
    # VALIDATION
    # ------------------------------------------------------------------------

    def validate_platform(
        self,
        platform_name: str,
        iteration: int,
    ) -> ValidationResult:

        task_name = (
            f"Validate platform: "
            f"{platform_name}"
        )

        self.telemetry.task(
            f"platform-{platform_name}",
            task_name,
            "started",
            iteration=iteration,
        )

        passed = 0
        failed = 0
        skipped = 0
        warnings = 0

        platform_validator = (
            self.validator_objects[
                platform_name
            ]
        )

        platform_details: Dict[
            str,
            Any,
        ] = {}

        for app_name in QMOI_APPS:
            if self.runtime_expired():
                self.telemetry.task(
                    f"platform-{platform_name}",
                    task_name,
                    "skipped",
                    iteration=iteration,
                    details={
                        "reason":
                            "maximum runtime reached",
                    },
                )

                return ValidationResult(
                    name=platform_name,
                    status="timeout",
                    passed=passed,
                    failed=failed,
                    skipped=skipped + 1,
                    warnings=warnings,
                )

            compilation = (
                platform_validator
                .validate_code_compiles(
                    app_name,
                    iteration,
                )
            )

            if compilation is True:
                passed += 1
            elif compilation is False:
                failed += 1
            else:
                skipped += 1

            manifests = (
                platform_validator
                .validate_manifests_present(
                    app_name,
                    iteration,
                )
            )

            if manifests:
                passed += 1
            else:
                failed += 1

            dependencies = (
                platform_validator
                .validate_dependencies_resolve(
                    app_name,
                    iteration,
                )
            )

            if dependencies is True:
                passed += 1
            elif dependencies is False:
                failed += 1
            else:
                skipped += 1

            signatures = (
                platform_validator
                .validate_signatures(
                    app_name,
                    iteration,
                )
            )

            if signatures is True:
                passed += 1
            elif signatures is False:
                failed += 1
            else:
                skipped += 1

            features = (
                self.feature_tester.test_app(
                    app_name,
                    platform_name,
                    iteration=iteration,
                )
            )

            platform_details[
                app_name
            ] = {
                "compilation": compilation,
                "manifests": manifests,
                "dependencies": dependencies,
                "signatures": signatures,
                "features": features,
            }

        handlers = (
            self.file_handler_validator.validate(
                platform_name,
                iteration=iteration,
            )
        )

        handler_failures = sum(
            1
            for value in handlers.values()
            if value is False
        )

        failed += handler_failures

        if not handlers:
            skipped += 1

        platform_details[
            "file_handlers"
        ] = handlers

        if failed:
            status = "failure"
        elif skipped and not passed:
            status = "skipped"
        else:
            status = "success"

        result = ValidationResult(
            name=platform_name,
            status=status,
            passed=passed,
            failed=failed,
            skipped=skipped,
            warnings=warnings,
            details=platform_details,
        )

        self.telemetry.task(
            f"platform-{platform_name}",
            task_name,
            (
                "completed"
                if status == "success"
                else (
                    "failed"
                    if status == "failure"
                    else "skipped"
                )
            ),
            iteration=iteration,
            details={
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
                "warnings": warnings,
            },
        )

        return result

    # ------------------------------------------------------------------------
    # REPOSITORY CHECKS
    # ------------------------------------------------------------------------

    def repository_checks(
        self,
        iteration: int,
    ) -> ValidationResult:

        task_id = "repository-integrity"

        self.telemetry.task(
            task_id,
            "Repository integrity checks",
            "started",
            iteration=iteration,
        )

        passed = 0
        failed = 0
        skipped = 0

        required = [
            ROOT_DIR / ".github" / "workflows",
            SCRIPTS_DIR,
        ]

        for path in required:
            if path.exists():
                passed += 1

                self.telemetry.emit(
                    "repository_check",
                    f"Repository path exists: {path}",
                    status="completed",
                    iteration=iteration,
                    task_id=task_id,
                    details={
                        "path": str(path),
                    },
                )
            else:
                failed += 1

                self.telemetry.error(
                    f"Required repository path missing: {path}",
                    details={
                        "path": str(path),
                    },
                )

        # Basic Git state.
        result = self.runner.run(
            [
                "git",
                "status",
                "--short",
            ],
            timeout=30,
            task_id=task_id,
            allow_failure=True,
        )

        if result.returncode == 0:
            passed += 1

            self.telemetry.emit(
                "git_status",
                "Git working tree inspected",
                status="completed",
                iteration=iteration,
                task_id=task_id,
                details={
                    "status": result.stdout,
                },
            )
        else:
            failed += 1

        status = (
            "failure"
            if failed
            else "success"
        )

        self.telemetry.task(
            task_id,
            "Repository integrity checks",
            (
                "completed"
                if status == "success"
                else "failed"
            ),
            iteration=iteration,
            details={
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
            },
        )

        return ValidationResult(
            name="repository",
            status=status,
            passed=passed,
            failed=failed,
            skipped=skipped,
        )

    # ------------------------------------------------------------------------
    # CHECKPOINT
    # ------------------------------------------------------------------------

    def checkpoint(
        self,
        *,
        iteration: int,
        status: str,
        reason: str,
    ) -> None:

        payload = {
            "execution_id":
                self.telemetry.execution_id,
            "sequence":
                self.telemetry.sequence,
            "iteration":
                iteration,
            "status":
                status,
            "reason":
                reason,
            "updated_at":
                utc_iso(),
            "platform_results":
                self.platform_results,
            "github":
                self.github_context.collect(
                    iteration=iteration
                ),
        }

        json_dump_atomic(
            CHECKPOINT_FILE,
            {
                **self.telemetry.state,
                **payload,
            },
        )

        self.telemetry.emit(
            "checkpoint_saved",
            f"Checkpoint saved: {reason}",
            status="completed",
            iteration=iteration,
            details={
                "checkpoint":
                    str(CHECKPOINT_FILE),
            },
        )

    # ------------------------------------------------------------------------
    # CHANGE FINGERPRINT
    # ------------------------------------------------------------------------

    def repository_fingerprint(self) -> str:
        """
        Obtain a stable fingerprint of the current Git state.

        This helps detect stagnant repair iterations.
        """

        parts = []

        result = self.runner.run(
            [
                "git",
                "rev-parse",
                "HEAD",
            ],
            timeout=30,
            allow_failure=True,
        )

        if result.returncode == 0:
            parts.append(
                result.stdout.strip()
            )

        status = self.runner.run(
            [
                "git",
                "status",
                "--porcelain",
            ],
            timeout=30,
            allow_failure=True,
        )

        if status.returncode == 0:
            parts.append(
                status.stdout
            )

        return sha256_text(
            "\n".join(parts)
        )

    # ------------------------------------------------------------------------
    # DIAGNOSIS
    # ------------------------------------------------------------------------

    def diagnose(
        self,
        failures: List[Dict[str, Any]],
        iteration: int,
    ) -> Dict[str, Any]:

        self.telemetry.task(
            "diagnosis",
            "Analyze validation failures",
            "started",
            iteration=iteration,
            details={
                "failure_count":
                    len(failures),
            },
        )

        diagnosis: Dict[str, Any] = {
            "failure_count": len(failures),
            "categories": [],
            "safe_actions": [],
        }

        for failure in failures:
            text = json.dumps(
                failure,
                ensure_ascii=False,
            ).lower()

            category = "unknown"

            if (
                "module not found" in text
                or "cannot find module" in text
            ):
                category = "dependency"

            elif (
                "syntaxerror" in text
                or "parse error" in text
            ):
                category = "syntax"

            elif (
                "test failed" in text
                or "assertionerror" in text
            ):
                category = "test"

            elif (
                "command not found" in text
                or "not recognized" in text
            ):
                category = "environment"

            elif (
                "timeout" in text
                or "timed out" in text
            ):
                category = "timeout"

            if category not in diagnosis[
                "categories"
            ]:
                diagnosis[
                    "categories"
                ].append(category)

        self.telemetry.emit(
            "diagnosis_completed",
            "Failure diagnosis completed",
            status="completed",
            phase="diagnosis",
            iteration=iteration,
            details=diagnosis,
        )

        self.telemetry.task(
            "diagnosis",
            "Analyze validation failures",
            "completed",
            iteration=iteration,
            details=diagnosis,
        )

        return diagnosis

    # ------------------------------------------------------------------------
    # SAFE REPAIR
    # ------------------------------------------------------------------------

    def safe_repair(
        self,
        diagnosis: Dict[str, Any],
        iteration: int,
    ) -> bool:

        if not AUTO_REPAIR:
            self.telemetry.emit(
                "repair_disabled",
                "Automatic repair is disabled",
                status="skipped",
                iteration=iteration,
            )
            return False

        categories = set(
            diagnosis.get(
                "categories",
                [],
            )
        )

        if not categories:
            self.telemetry.emit(
                "repair_not_required",
                "No actionable failure category identified",
                status="skipped",
                iteration=iteration,
            )
            return False

        self.telemetry.task(
            "repair",
            "Perform bounded safe automatic repairs",
            "started",
            iteration=iteration,
            details={
                "categories":
                    sorted(categories),
            },
        )

        changed = False

        # --------------------------------------------------------------------
        # DEPENDENCY REPAIR
        # --------------------------------------------------------------------

        if "dependency" in categories:
            self.telemetry.action(
                "Attempting dependency repair",
                details={
                    "strategy":
                        "install existing lockfile dependencies",
                },
            )

            if command_exists("npm"):
                package_files = list(
                    ROOT_DIR.rglob(
                        "package-lock.json"
                    )
                )

                for lockfile in package_files[:10]:
                    package_dir = lockfile.parent

                    result = self.runner.run(
                        [
                            "npm",
                            "ci",
                            "--ignore-scripts",
                        ],
                        cwd=package_dir,
                        timeout=600,
                        task_id="repair-dependencies",
                        allow_failure=True,
                    )

                    if result.success:
                        changed = True

        # --------------------------------------------------------------------
        # FORMAT / STATIC CHECK REPAIR
        # --------------------------------------------------------------------

        if "syntax" in categories:
            self.telemetry.emit(
                "syntax_repair_policy",
                (
                    "Syntax repair requires implementation-specific "
                    "editing rules; no blind source rewrite was performed."
                ),
                status="warning",
                iteration=iteration,
            )

        # --------------------------------------------------------------------
        # ENVIRONMENT
        # --------------------------------------------------------------------

        if "environment" in categories:
            self.telemetry.emit(
                "environment_repair_policy",
                (
                    "Environment failure detected. "
                    "The agent will not blindly install arbitrary software "
                    "or alter system configuration."
                ),
                status="warning",
                iteration=iteration,
            )

        # --------------------------------------------------------------------
        # TIMEOUT
        # --------------------------------------------------------------------

        if "timeout" in categories:
            self.telemetry.emit(
                "timeout_repair_policy",
                (
                    "Timeout detected. The agent will re-run only through "
                    "bounded validation attempts."
                ),
                status="warning",
                iteration=iteration,
            )

        self.telemetry.task(
            "repair",
            "Perform bounded safe automatic repairs",
            (
                "completed"
                if changed
                else "skipped"
            ),
            iteration=iteration,
            details={
                "changed": changed,
            },
        )

        return changed

    # ------------------------------------------------------------------------
    # ONE ITERATION
    # ------------------------------------------------------------------------

    def run_iteration(
        self,
        iteration: int,
    ) -> Tuple[bool, List[Dict[str, Any]]]:

        self.telemetry.iteration(
            iteration,
            "started",
            f"Autonomous iteration {iteration} started",
        )

        self.telemetry.status(
            status="running",
            phase="iteration",
        )

        failures: List[
            Dict[str, Any]
        ] = []

        results: List[
            ValidationResult
        ] = []

        # Repository checks first.
        repository = self.repository_checks(
            iteration
        )

        results.append(repository)

        if repository.failed:
            failures.append(
                asdict(repository)
            )

        # Platform validation.
        for platform_name in PLATFORMS:
            if self.runtime_expired():
                break

            result = self.validate_platform(
                platform_name,
                iteration,
            )

            results.append(result)

            self.platform_results[
                platform_name
            ] = asdict(result)

            if result.failed:
                failures.append(
                    asdict(result)
                )

        # Memory/index maintenance.
        if not self.runtime_expired():
            try:
                self.memory_index.generate_index()
            except Exception as exc:
                self.telemetry.error(
                    "Memory index generation failed",
                    exception=exc,
                )

        # GitHub/PR context.
        if not self.runtime_expired():
            context = (
                self.github_context.collect(
                    iteration=iteration
                )
            )

            prs = context.get(
                "pull_requests",
                [],
            )

            if prs:
                self.telemetry.pr(
                    {
                        "recorded_utc":
                            utc_iso(),
                        "repository":
                            context.get(
                                "repository"
                            ),
                        "workflow":
                            context.get(
                                "workflow"
                            ),
                        "run_id":
                            context.get(
                                "run_id"
                            ),
                        "sha":
                            context.get(
                                "sha"
                            ),
                        "pull_requests":
                            prs,
                    }
                )

        success = len(
            failures
        ) == 0

        fingerprint = (
            self.repository_fingerprint()
        )

        previous = (
            self.iteration_fingerprints[-1]
            if self.iteration_fingerprints
            else None
        )

        changed = (
            previous is None
            or fingerprint != previous
        )

        self.iteration_fingerprints.append(
            fingerprint
        )

        self.telemetry.emit(
            "iteration_analysis",
            (
                f"Iteration {iteration} analysis complete"
            ),
            status=(
                "success"
                if success
                else "failure"
            ),
            iteration=iteration,
            details={
                "success": success,
                "failure_count": len(failures),
                "repository_changed":
                    changed,
                "results": [
                    asdict(result)
                    for result in results
                ],
            },
        )

        self.telemetry.iteration(
            iteration,
            (
                "completed"
                if success
                else "failed"
            ),
            (
                f"Autonomous iteration {iteration} "
                f"{'completed successfully' if success else 'found failures'}"
            ),
            details={
                "failure_count":
                    len(failures),
                "repository_changed":
                    changed,
            },
        )

        self.checkpoint(
            iteration=iteration,
            status=(
                "success"
                if success
                else "failure"
            ),
            reason=(
                "iteration completed"
            ),
        )

        return success, failures

    # ------------------------------------------------------------------------
    # MAIN AUTONOMOUS LOOP
    # ------------------------------------------------------------------------

    def validate_all(self) -> int:

        self.telemetry.status(
            status="running",
            phase="planning",
        )

        self.telemetry.emit(
            "validation_started",
            "Full autonomous validation started",
            status="started",
            phase="planning",
            details={
                "max_iterations":
                    self.max_iterations,
                "max_runtime_seconds":
                    self.max_runtime,
                "auto_repair":
                    AUTO_REPAIR,
                "platforms":
                    PLATFORMS,
                "apps":
                    list(QMOI_APPS.keys()),
            },
        )

        github_context = (
            self.github_context.collect()
        )

        self.telemetry.pr(
            {
                "recorded_utc":
                    utc_iso(),
                "repository":
                    github_context.get(
                        "repository"
                    ),
                "workflow":
                    github_context.get(
                        "workflow"
                    ),
                "event":
                    github_context.get(
                        "event"
                    ),
                "run_id":
                    github_context.get(
                        "run_id"
                    ),
                "sha":
                    github_context.get(
                        "sha"
                    ),
                "pull_requests":
                    github_context.get(
                        "pull_requests",
                        [],
                    ),
            }
        )

        ollama_available = self.ollama.health()

        self.telemetry.emit(
            "planning_completed",
            "Autonomous validation plan established",
            status="completed",
            phase="planning",
            details={
                "ollama_available":
                    ollama_available,
            },
        )

        stagnant_iterations = 0
        last_failure_signature = None

        for iteration in range(
            1,
            self.max_iterations + 1,
        ):

            if self.runtime_expired():
                self.telemetry.emit(
                    "runtime_limit_reached",
                    "Maximum autonomous runtime reached",
                    status="stopped",
                    iteration=iteration,
                )
                break

            success, failures = (
                self.run_iteration(
                    iteration
                )
            )

            if success:
                self.telemetry.status(
                    status="success",
                    phase="verification",
                )

                self.telemetry.emit(
                    "validation_success",
                    "Autonomous validation completed successfully",
                    status="completed",
                    iteration=iteration,
                )

                self.telemetry.summary(
                    "success",
                    details={
                        "iteration":
                            iteration,
                        "reason":
                            "all executable validation checks completed "
                            "without detected failures",
                    },
                )

                return 0

            failure_signature = sha256_text(
                json.dumps(
                    failures,
                    sort_keys=True,
                    default=str,
                )
            )

            if (
                failure_signature
                == last_failure_signature
            ):
                stagnant_iterations += 1
            else:
                stagnant_iterations = 0

            last_failure_signature = (
                failure_signature
            )

            self.telemetry.emit(
                "stagnation_analysis",
                (
                    f"Stagnation counter: "
                    f"{stagnant_iterations}/"
                    f"{MAX_STAGNANT_ITERATIONS}"
                ),
                status=(
                    "warning"
                    if stagnant_iterations
                    else "info"
                ),
                iteration=iteration,
                details={
                    "stagnant_iterations":
                        stagnant_iterations,
                },
            )

            if (
                stagnant_iterations
                >= MAX_STAGNANT_ITERATIONS
            ):
                self.telemetry.emit(
                    "stagnation_stop",
                    (
                        "Stopping because repeated iterations "
                        "produced the same failure signature."
                    ),
                    status="stopped",
                    iteration=iteration,
                )

                self.telemetry.summary(
                    "stopped_stagnation",
                    details={
                        "iteration":
                            iteration,
                        "stagnant_iterations":
                            stagnant_iterations,
                    },
                )

                return 1

            diagnosis = self.diagnose(
                failures,
                iteration,
            )

            repaired = self.safe_repair(
                diagnosis,
                iteration,
            )

            if not repaired:
                self.telemetry.emit(
                    "no_repair_performed",
                    (
                        "No safe automatic repair was performed "
                        "for the current failure set."
                    ),
                    status="warning",
                    iteration=iteration,
                )

                # If there is nothing safe to change, continuing forever
                # would be counterproductive.
                if iteration >= self.max_iterations:
                    break

        self.telemetry.status(
            status="failure",
            phase="completion",
        )

        self.telemetry.emit(
            "validation_incomplete",
            (
                "Autonomous validation stopped before "
                "achieving a clean validation result."
            ),
            status="failure",
            details={
                "max_iterations":
                    self.max_iterations,
                "max_runtime":
                    self.max_runtime,
            },
        )

        self.telemetry.summary(
            "failure",
            details={
                "reason":
                    "iteration or runtime safety boundary reached",
            },
        )

        return 1


# ============================================================================
# STATUS COMMAND
# ============================================================================

def show_status() -> int:
    print("=" * 80)
    print("QMOI / OLLAMA AUTONOMOUS AGENT STATUS")
    print("=" * 80)

    if CURRENT_STATUS_FILE.exists():
        print(
            CURRENT_STATUS_FILE.read_text(
                encoding="utf-8"
            )
        )
    else:
        print(
            "No current status file exists yet."
        )

    return 0


# ============================================================================
# ARGUMENT PARSER
# ============================================================================

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "QMOI Ollama Autonomous Agent "
            "with persistent realtime telemetry"
        )
    )

    subparsers = parser.add_subparsers(
        dest="command",
        required=True,
    )

    validate = subparsers.add_parser(
        "validate-all",
        help="Run autonomous validation",
    )

    validate.add_argument(
        "--max-iterations",
        type=int,
        default=MAX_ITERATIONS,
        help=(
            "Maximum autonomous iterations "
            f"(default: {MAX_ITERATIONS})"
        ),
    )

    validate.add_argument(
        "--max-runtime",
        type=int,
        default=MAX_RUNTIME,
        help=(
            "Maximum runtime in seconds "
            f"(default: {MAX_RUNTIME})"
        ),
    )

    subparsers.add_parser(
        "status",
        help="Show current persisted status",
    )

    subparsers.add_parser(
        "doctor",
        help="Inspect the execution environment",
    )

    return parser


# ============================================================================
# MAIN
# ============================================================================

def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "status":
        return show_status()

    if args.command == "doctor":
        agent = AutonomousAgent()
        results = agent.doctor()

        print(
            json.dumps(
                results,
                indent=2,
                ensure_ascii=False,
            )
        )

        return 0

    if args.command == "validate-all":
        agent = AutonomousAgent(
            max_iterations=args.max_iterations,
            max_runtime=args.max_runtime,
        )

        try:
            return agent.validate_all()

        except KeyboardInterrupt:
            agent.telemetry.emit(
                "agent_interrupted",
                "Agent execution interrupted by operator",
                status="stopped",
            )

            agent.telemetry.status(
                status="interrupted",
                phase="completion",
            )

            agent.telemetry.summary(
                "interrupted"
            )

            return 130

        except Exception as exc:
            agent.telemetry.error(
                "Fatal autonomous agent exception",
                exception=exc,
                details={
                    "traceback":
                        traceback.format_exc(),
                },
            )

            agent.telemetry.status(
                status="fatal_error",
                phase="completion",
            )

            agent.telemetry.summary(
                "fatal_error",
                details={
                    "exception":
                        str(exc),
                    "traceback":
                        traceback.format_exc(),
                },
            )

            logger.exception(
                "Fatal autonomous agent exception"
            )

            return 1

    parser.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())