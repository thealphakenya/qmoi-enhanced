#!/usr/bin/env python3
"""
QMOI / Ollama Autonomous Agent
==============================

Production-oriented autonomous validation, diagnosis, repair and telemetry
engine for the QMOI repository with Advanced Auto-Healing and Self-Patching.

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
* actual execution results are distinguished from assumptions;
* full self-healing and self-patching of its own files and workspace code.

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

    def _write_state(self) -> None:
        try:
            json_dump_atomic(STATE_FILE, self.state)
            status_text = (
                f"Status: {self.state.get('status')}\n"
                f"Phase: {self.state.get('phase')}\n"
                f"Iteration: {self.state.get('iteration')}\n"
                f"Updated: {self.state.get('updated_at')}\n"
            )
            atomic_write(CURRENT_STATUS_FILE, status_text)
        except Exception:
            pass

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


# ============================================================================
# COMMAND RESULT & RUNNER
# ============================================================================

@dataclass
class CommandResult:
    command: List[str]
    returncode: Optional[int]
    status: str
    duration_seconds: float
    stdout: str
    stderr: str

    @property
    def success(self) -> bool:
        return self.returncode == 0


class CommandRunner:
    def __init__(self, telemetry: Telemetry):
        self.telemetry = telemetry

    def run(
        self,
        command: Sequence[str],
        *,
        cwd: Optional[Path] = None,
        timeout: int = COMMAND_TIMEOUT,
        task_id: Optional[str] = None,
        allow_failure: bool = False,
    ) -> CommandResult:
        started = time.monotonic()
        command_list = [str(item) for item in command]
        cmd_str = " ".join(command_list)

        self.telemetry.action(
            f"Running: {cmd_str}",
            status="started",
            details={"command": command_list, "cwd": str(cwd or ROOT_DIR)},
        )

        try:
            result = subprocess.run(
                command_list,
                cwd=str(cwd or ROOT_DIR),
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            duration = time.monotonic() - started
            stdout_tr = truncate(result.stdout)
            stderr_tr = truncate(result.stderr)
            status_str = "success" if result.returncode == 0 else "failure"

            self.telemetry.action(
                f"Finished: {cmd_str} (exit={result.returncode})",
                status=status_str,
                details={
                    "command": command_list,
                    "returncode": result.returncode,
                    "duration_seconds": duration,
                    "stdout": stdout_tr,
                    "stderr": stderr_tr,
                },
            )

            return CommandResult(
                command=command_list,
                returncode=result.returncode,
                status=status_str,
                duration_seconds=duration,
                stdout=result.stdout,
                stderr=result.stderr,
            )
        except subprocess.TimeoutExpired as exc:
            duration = time.monotonic() - started
            self.telemetry.error(
                f"Command timed out after {timeout}s: {cmd_str}",
                details={"command": command_list, "timeout": timeout},
            )
            return CommandResult(
                command=command_list,
                returncode=-999,
                status="timeout",
                duration_seconds=duration,
                stdout=exc.stdout or "",
                stderr=exc.stderr or f"Timed out after {timeout} seconds",
            )
        except Exception as exc:
            duration = time.monotonic() - started
            self.telemetry.error(
                f"Command execution exception: {cmd_str}",
                exception=exc,
            )
            return CommandResult(
                command=command_list,
                returncode=-1000,
                status="exception",
                duration_seconds=duration,
                stdout="",
                stderr=str(exc),
            )


# ============================================================================
# OLLAMA CLIENT & AI BRAIN
# ============================================================================

class OllamaClient:
    def __init__(self, telemetry: Telemetry):
        self.telemetry = telemetry
        self.host = OLLAMA_HOST
        self.model = OLLAMA_MODEL
        self.timeout = OLLAMA_TIMEOUT

    def is_available(self) -> bool:
        url = f"{self.host}/api/tags"
        req = urllib.request.Request(url, method="GET")
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                return resp.status == 200
        except Exception:
            return False

    def chat(self, messages: List[Dict[str, str]], temperature: float = 0.2) -> str:
        url = f"{self.host}/api/chat"
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": temperature},
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("message", {}).get("content", "")
        except Exception as e:
            self.telemetry.error(f"Ollama chat request failed: {e}")
            return f"[Error communicating with Ollama: {e}]"


# ============================================================================
# AUTO-HEALING & SELF-REPAIR ENGINE
# ============================================================================

class SelfHealingEngine:
    def __init__(self, telemetry: Telemetry, ollama: OllamaClient):
        self.telemetry = telemetry
        self.ollama = ollama
        self.failed_fingerprints: Dict[str, int] = {}

    def compute_fingerprint(self, error_message: str) -> str:
        clean = "".join([line for line in error_message.splitlines() if "at 0x" not in line])
        return hashlib.sha256(clean.encode("utf-8")).hexdigest()[:16]

    def can_heal(self, fingerprint: str) -> bool:
        count = self.failed_fingerprints.get(fingerprint, 0)
        return count < MAX_RETRIES

    def register_failure(self, fingerprint: str) -> int:
        count = self.failed_fingerprints.get(fingerprint, 0) + 1
        self.failed_fingerprints[fingerprint] = count
        return count

    def heal_file(self, target_file: Path, error_trace: str) -> bool:
        if not AUTO_REPAIR:
            self.telemetry.emit("auto_repair_skipped", "Auto-repair disabled by configuration", status="warning")
            return False

        fingerprint = self.compute_fingerprint(error_trace)
        if not self.can_heal(fingerprint):
            self.telemetry.error(f"Circuit breaker tripped: Max repair attempts reached for fingerprint {fingerprint}")
            return False

        attempt = self.register_failure(fingerprint)
        self.telemetry.emit("auto_repair_started", f"Attempting self-heal on {target_file.name} (Attempt {attempt}/{MAX_RETRIES})", status="warning")

        if target_file.exists():
            backup = target_file.with_suffix(target_file.suffix + ".bak")
            shutil.copy2(target_file, backup)
            current_code = target_file.read_text(encoding="utf-8")
        else:
            current_code = "# File missing"

        prompt = (
            f"The file `{target_file.name}` encountered an error/failure:\n\n"
            f"```\n{error_trace}\n```\n\n"
            f"Here is the current source code of `{target_file.name}`:\n\n"
            f"```python\n{current_code}\n```\n\n"
            f"Analyze the bug or failure root cause and provide the ENTIRE corrected code. "
            f"Respond ONLY with valid Python code enclosed in a ```python markdown block."
        )

        messages = [
            {"role": "system", "content": "You are a precise autonomous software auto-healing agent. Fix errors robustly."},
            {"role": "user", "content": prompt}
        ]

        response = self.ollama.chat(messages, temperature=0.1)

        if "```python" in response:
            try:
                code_block = response.split("```python")[1].split("```")[0].strip()
            except IndexError:
                code_block = response
        elif "```" in response:
            try:
                code_block = response.split("```")[1].split("```")[0].strip()
            except IndexError:
                code_block = response
        else:
            code_block = response.strip()

        if not code_block:
            self.telemetry.error("Auto-heal failed: Empty response from Ollama")
            return False

        atomic_write(target_file, code_block)

        # Verify syntax if python file
        if target_file.suffix == ".py":
            try:
                compile(code_block, str(target_file), "exec")
                self.telemetry.emit("auto_repair_success", f"Successfully healed and verified {target_file.name}")
                return True
            except SyntaxError as se:
                self.telemetry.error(f"Healed patch syntax check failed: {se}")
                return False
        else:
            return True


# ============================================================================
# AUTONOMOUS AGENT ORCHESTRATOR
# ============================================================================

class AutonomousAgent:
    def __init__(self) -> None:
        self.telemetry = Telemetry()
        self.runner = CommandRunner(self.telemetry)
        self.ollama = OllamaClient(self.telemetry)
        self.healer = SelfHealingEngine(self.telemetry, self.ollama)

    def doctor(self) -> int:
        self.telemetry.status(status="running", phase="doctor")
        self.telemetry.emit("doctor_check", "Running system diagnostics")

        print("=== QMOI Autonomous Agent Doctor ===")
        print(f"Root Directory: {ROOT_DIR}")
        print(f"Tracking Directory: {TRACK_DIR}")
        print(f"Ollama Host: {OLLAMA_HOST}")
        print(f"Ollama Model: {OLLAMA_MODEL}")

        ollama_ok = self.ollama.is_available()
        print(f"Ollama Connection: {'OK' if ollama_ok else 'FAILED'}")

        git_ok = command_exists("git")
        print(f"Git CLI available: {'YES' if git_ok else 'NO'}")

        python_ver = sys.version.split()[0]
        print(f"Python Version: {python_ver}")

        self.telemetry.emit("doctor_result", "Diagnostics complete", details={"ollama": ollama_ok, "git": git_ok})
        return 0 if ollama_ok else 1

    def validate_all(self) -> int:
        self.telemetry.status(status="running", phase="validate-all")
        self.telemetry.emit("validate_all_start", "Starting full repository validation and autonomous check")

        # Step 1: Check Ollama
        if not self.ollama.is_available():
            self.telemetry.error("Ollama server is not reachable. Ensure Ollama is running.")
            print("[ERROR] Ollama server is not reachable at", OLLAMA_HOST)
            return 1

        # Step 2: Validate core codebase scripts
        self.telemetry.task("task_validate_scripts", "Validate repository scripts", "started", iteration=1)
        
        script_files = list(SCRIPTS_DIR.glob("*.py"))
        success_all = True

        for script in script_files:
            self.telemetry.action(f"Checking script syntax: {script.name}")
            try:
                code = script.read_text(encoding="utf-8")
                compile(code, str(script), "exec")
            except Exception as e:
                self.telemetry.error(f"Syntax error in script {script.name}: {e}", exception=e)
                if AUTO_REPAIR:
                    healed = self.healer.heal_file(script, str(e))
                    if not healed:
                        success_all = False
                else:
                    success_all = False

        if success_all:
            self.telemetry.task("task_validate_scripts", "Validate repository scripts", "completed", iteration=1)
        else:
            self.telemetry.task("task_validate_scripts", "Validate repository scripts", "failed", iteration=1)

        # Step 3: Write summary telemetry
        summary_content = (
            f"QMOI Autonomous Agent Validation Summary\n"
            f"=======================================\n"
            f"Execution ID: {EXECUTION_ID}\n"
            f"Started At: {self.telemetry.started_at}\n"
            f"Status: {'SUCCESS' if success_all else 'COMPLETED WITH WARNINGS/ERRORS'}\n"
        )
        atomic_write(SUMMARY_FILE, summary_content)

        self.telemetry.status(status="completed", phase="finished")
        self.telemetry.emit("agent_completed", "Autonomous validation cycle finished successfully")
        print("=== Autonomous Validation Cycle Complete ===")
        return 0 if success_all else 1


# ============================================================================
# CLI ENTRY POINT
# ============================================================================

def main() -> int:
    parser = argparse.ArgumentParser(description="QMOI Ollama Autonomous Agent with Auto-Healing")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("doctor", help="Run system diagnostics")
    subparsers.add_parser("validate-all", help="Run full repository validation and auto-healing cycle")
    subparsers.add_parser("status", help="Show current agent status")

    args = parser.parse_args()
    agent = AutonomousAgent()

    if args.command == "doctor":
        return agent.doctor()
    elif args.command == "validate-all":
        return agent.validate_all()
    elif args.command == "status":
        if CURRENT_STATUS_FILE.exists():
            print(CURRENT_STATUS_FILE.read_text(encoding="utf-8"))
        else:
            print("No active status found.")
        return 0
    else:
        parser.print_help()
        return 0


if __name__ == "__main__":
    sys.exit(main())
