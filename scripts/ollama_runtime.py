"""Bounded, observable Ollama runtime used by the QMOI agent."""

from __future__ import annotations

import json
import os
import re
import subprocess
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Mapping, Optional

import requests

DEFAULT_OLLAMA_HOST = "http://127.0.0.1:11434"
DEFAULT_OLLAMA_MODEL = "qwen2.5-coder:3b"
HEALTH_SENTINEL = "OLLAMA_QMOI_HEALTH_OK"
_SAFE_RELATIVE_PATH = re.compile(r"^[^/\\][^:]*$")
_FORBIDDEN_PATCH_TEXT = (".github/workflows", "secrets.", "GITHUB_TOKEN", "GH_TOKEN")


class OllamaRuntimeError(RuntimeError):
    """Raised when an Ollama prerequisite or inference contract fails."""


@dataclass
class OllamaBootstrap:
    """Bounded local Ollama process bootstrap state."""

    client: "OllamaClient"
    startup_timeout: float = 90.0
    process: Optional[subprocess.Popen[str]] = field(default=None, init=False)

    def ensure_server(self) -> bool:
        """Reuse a healthy server or start the installed Ollama binary."""
        try:
            self.client._request("GET", "/api/tags")
            return True
        except (OllamaRuntimeError, requests.RequestException, OSError):
            pass

        binary = self._find_binary()
        if binary is None:
            binary = self._install_binary()
        if binary is None:
            raise OllamaRuntimeError(
                "Ollama is not installed and automatic installation is unavailable; "
                "install Ollama before running the autonomous workflow."
            )

        environment = os.environ.copy()
        environment["OLLAMA_HOST"] = self.client.host
        try:
            self.process = subprocess.Popen(
                [binary, "serve"],
                env=environment,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True,
            )
        except OSError as exc:
            raise OllamaRuntimeError(f"Unable to start Ollama: {exc}") from exc

        deadline = time.monotonic() + self.startup_timeout
        while time.monotonic() < deadline:
            try:
                self.client._request("GET", "/api/tags")
                return True
            except (OllamaRuntimeError, requests.RequestException, OSError):
                if self.process.poll() is not None:
                    diagnostics = ""
                    if self.process.stderr is not None:
                        diagnostics = self.process.stderr.read().strip()[-500:]
                    raise OllamaRuntimeError(
                        f"Ollama exited during startup: {diagnostics or 'no diagnostics'}"
                    )
                time.sleep(1)
        raise OllamaRuntimeError(
            f"Ollama did not become healthy within {self.startup_timeout:.0f} seconds"
        )

    @staticmethod
    def _install_binary() -> Optional[str]:
        install_script = os.getenv("OLLAMA_INSTALL_SCRIPT")
        if install_script and Path(install_script).is_file():
            install_cmd = ["bash", install_script]
        else:
            install_cmd = ["bash", "-lc", "curl --fail --silent --show-error --location https://ollama.com/install.sh | sh"]

        try:
            subprocess.run(install_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        except (OSError, subprocess.CalledProcessError):
            return None

        binary = OllamaBootstrap._find_binary()
        return binary

    @staticmethod
    def _find_binary() -> Optional[str]:
        configured = os.getenv("OLLAMA_BINARY")
        if configured and Path(configured).is_file():
            return configured
        for candidate in ("ollama", "/usr/local/bin/ollama"):
            if subprocess.call(["which", candidate], stdout=subprocess.DEVNULL,
                               stderr=subprocess.DEVNULL) == 0:
                return candidate
        return None


@dataclass
class OllamaHealth:
    host: str
    model: str
    ollama_started: bool = False
    ollama_healthy: bool = False
    ollama_version: Optional[str] = None
    model_available: bool = False
    inference_verified: bool = False
    inference_latency: Optional[float] = None
    error: Optional[str] = None

    def as_dict(self) -> Dict[str, Any]:
        return {
            "ollama_host": self.host,
            "model": self.model,
            "ollama_started": self.ollama_started,
            "ollama_healthy": self.ollama_healthy,
            "ollama_version": self.ollama_version,
            "model_available": self.model_available,
            "inference_verified": self.inference_verified,
            "inference_latency": self.inference_latency,
            "health_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "error": self.error,
        }


class OllamaClient:
    """Small HTTP client with bounded retries and no shell execution."""

    def __init__(
        self,
        host: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[float] = None,
        retries: Optional[int] = None,
        session: Optional[Any] = None,
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        self.host = (host or os.getenv("OLLAMA_HOST", DEFAULT_OLLAMA_HOST)).rstrip("/")
        self.model = model or os.getenv("OLLAMA_MODEL", DEFAULT_OLLAMA_MODEL)
        self.timeout = float(timeout if timeout is not None else os.getenv("OLLAMA_TIMEOUT_SECONDS", "60"))
        self.retries = max(1, int(retries if retries is not None else os.getenv("OLLAMA_RETRY_COUNT", "3")))
        self.session = session or requests.Session()
        self.sleep = sleep

    def _request(self, method: str, path: str, **kwargs: Any) -> requests.Response:
        last_error: Optional[Exception] = None
        for attempt in range(self.retries):
            try:
                response = self.session.request(
                    method,
                    f"{self.host}{path}",
                    timeout=self.timeout,
                    **kwargs,
                )
                response.raise_for_status()
                return response
            except (requests.RequestException, ValueError) as exc:
                last_error = exc
                if attempt + 1 < self.retries:
                    self.sleep(min(2 ** attempt, 8))
        raise OllamaRuntimeError(f"Ollama request failed: {last_error}")

    def version(self) -> str:
        data = self._request("GET", "/api/version").json()
        return str(data.get("version", "unknown"))

    def tags(self) -> List[Mapping[str, Any]]:
        data = self._request("GET", "/api/tags").json()
        models = data.get("models", [])
        if not isinstance(models, list):
            raise OllamaRuntimeError("Ollama /api/tags returned an invalid model list")
        return [item for item in models if isinstance(item, Mapping)]

    def model_available(self) -> bool:
        return any(str(item.get("name", "")) == self.model for item in self.tags())

    def pull_model(self) -> None:
        self._request("POST", "/api/pull", json={"name": self.model, "stream": False})

    def generate(self, prompt: str) -> str:
        data = self._request(
            "POST",
            "/api/generate",
            json={"model": self.model, "prompt": prompt, "stream": False},
        ).json()
        response = data.get("response")
        if not isinstance(response, str) or not response.strip():
            raise OllamaRuntimeError("Ollama returned no generated response")
        return response.strip()

    def verify(self, bootstrap: Optional[OllamaBootstrap] = None) -> OllamaHealth:
        health = OllamaHealth(self.host, self.model)
        try:
            if bootstrap is not None:
                health.ollama_started = bootstrap.ensure_server()
            else:
                self._request("GET", "/api/tags")
                health.ollama_started = True
            health.ollama_healthy = True
            health.ollama_version = self.version()
            health.model_available = self.model_available()
            if not health.model_available:
                self.pull_model()
                health.model_available = self.model_available()
            if not health.model_available:
                raise OllamaRuntimeError(f"Configured model is unavailable: {self.model}")
            started = time.monotonic()
            response = self.generate(f"{HEALTH_SENTINEL}\nReturn exactly: {HEALTH_SENTINEL}")
            health.inference_latency = round(time.monotonic() - started, 3)
            health.inference_verified = response == HEALTH_SENTINEL or HEALTH_SENTINEL in response
            if not health.inference_verified:
                raise OllamaRuntimeError("Ollama inference returned an unexpected response")
            return health
        except OllamaRuntimeError as exc:
            health.error = str(exc)
            raise


def validate_repair_paths(root: Path | str, paths: Iterable[str]) -> List[Path]:
    """Resolve model-proposed paths while rejecting traversal and secrets."""
    base = Path(root).resolve()
    resolved: List[Path] = []
    for raw_path in paths:
        value = str(raw_path)
        if not _SAFE_RELATIVE_PATH.fullmatch(value) or value.startswith(("/", "\\")):
            raise OllamaRuntimeError(f"Unsafe repair path: {value}")
        candidate = (base / value).resolve()
        if candidate != base and base not in candidate.parents:
            raise OllamaRuntimeError(f"Repair path escapes repository: {value}")
        if any(part.lower() in {".git", ".github"} for part in candidate.relative_to(base).parts):
            raise OllamaRuntimeError(f"Protected repair path: {value}")
        resolved.append(candidate)
    return resolved


def parse_repair_plan(response: str, root: Path | str) -> Dict[str, Any]:
    """Accept only JSON plans with bounded, non-sensitive file operations."""
    try:
        plan = json.loads(response)
    except json.JSONDecodeError as exc:
        raise OllamaRuntimeError(f"Malformed LLM repair response: {exc}") from exc
    if not isinstance(plan, Mapping) or not isinstance(plan.get("changes", []), list):
        raise OllamaRuntimeError("LLM repair response must contain a changes list")
    changes = plan["changes"]
    if len(changes) > 10:
        raise OllamaRuntimeError("Repair plan exceeds the maximum of 10 changes")
    paths = [item.get("path") for item in changes if isinstance(item, Mapping)]
    if len(paths) != len(changes) or any(not isinstance(path, str) for path in paths):
        raise OllamaRuntimeError("Each repair change must contain a string path")
    validate_repair_paths(root, paths)
    serialized = json.dumps(plan)
    if any(marker.lower() in serialized.lower() for marker in _FORBIDDEN_PATCH_TEXT):
        raise OllamaRuntimeError("Repair plan references protected credentials or workflows")
    return dict(plan)


def build_success_contract(
    root: Path | str,
    health: OllamaHealth | Mapping[str, Any],
    **fields: Any,
) -> Dict[str, Any]:
    """Build a truthful contract; callers must set validation fields explicitly."""
    health_data = health.as_dict() if isinstance(health, OllamaHealth) else dict(health)
    contract: Dict[str, Any] = {
        "workflow_run_id": os.getenv("GITHUB_RUN_ID"),
        "repository": os.getenv("GITHUB_REPOSITORY"),
        "commit": os.getenv("GITHUB_SHA"),
        "agent_started": True,
        **health_data,
        "llm_coding_started": bool(fields.get("llm_coding_started", False)),
        "llm_iterations": int(fields.get("llm_iterations", 0)),
        "files_analyzed": list(fields.get("files_analyzed", [])),
        "files_modified": list(fields.get("files_modified", [])),
        "tests_before": fields.get("tests_before"),
        "tests_after": fields.get("tests_after"),
        "validation_passed": bool(fields.get("validation_passed", False)),
        "checkpoint_created": bool(fields.get("checkpoint_created", False)),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    required = (
        contract["agent_started"], contract["ollama_started"], contract["ollama_healthy"],
        contract["model_available"], contract["inference_verified"], contract["llm_coding_started"],
        contract["validation_passed"], contract["checkpoint_created"],
    )
    contract["final_status"] = "SUCCESS" if all(required) else "FAILED"
    return contract
