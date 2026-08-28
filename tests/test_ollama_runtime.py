import json
from pathlib import Path

import pytest

from scripts.ollama_runtime import (
    HEALTH_SENTINEL,
    OllamaBootstrap,
    OllamaClient,
    OllamaRuntimeError,
    build_success_contract,
    parse_repair_plan,
    validate_repair_paths,
)


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def raise_for_status(self):
        return None

    def json(self):
        return self.payload


class FakeSession:
    def __init__(self, responses):
        self.responses = list(responses)
        self.calls = []

    def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        response = self.responses.pop(0)
        if isinstance(response, Exception):
            raise response
        return FakeResponse(response)


def test_verify_proves_model_and_inference():
    session = FakeSession([
        {"models": [{"name": "qwen2.5-coder:3b"}]},
        {"version": "0.1.0"},
        {"models": [{"name": "qwen2.5-coder:3b"}]},
        {"response": HEALTH_SENTINEL},
    ])
    health = OllamaClient(session=session, retries=1).verify()
    assert health.ollama_started is True
    assert health.ollama_healthy is True
    assert health.model_available is True
    assert health.inference_verified is True
    assert health.ollama_version == "0.1.0"


def test_bootstrap_reuses_healthy_server():
    session = FakeSession([{"models": []}])
    client = OllamaClient(session=session, retries=1)
    assert OllamaBootstrap(client).ensure_server() is False


def test_bootstrap_reports_missing_binary(monkeypatch):
    session = FakeSession([ConnectionError("offline")])
    client = OllamaClient(session=session, retries=1)
    monkeypatch.setattr(OllamaBootstrap, "_find_binary", staticmethod(lambda: None))
    with pytest.raises(OllamaRuntimeError, match="not installed"):
        OllamaBootstrap(client).ensure_server()


def test_verify_fails_when_server_is_unavailable():
    session = FakeSession([OllamaRuntimeError("offline")])
    with pytest.raises(OllamaRuntimeError):
        OllamaClient(session=session, retries=1).verify()


def test_verify_pulls_missing_model_then_infers():
    session = FakeSession([
        {"models": []},
        {"version": "0.1.0"},
        {"models": []},
        {"status": "success"},
        {"models": [{"name": "qwen2.5-coder:3b"}]},
        {"response": HEALTH_SENTINEL},
    ])
    health = OllamaClient(session=session, retries=1).verify()
    assert health.model_available is True
    assert any(call[0] == "POST" and call[1].endswith("/api/pull") for call in session.calls)


def test_repair_plan_rejects_malformed_and_unsafe_content(tmp_path: Path):
    with pytest.raises(OllamaRuntimeError):
        parse_repair_plan("not-json", tmp_path)
    with pytest.raises(OllamaRuntimeError):
        parse_repair_plan(json.dumps({"changes": [{"path": "../secret", "content": "x"}]}), tmp_path)
    with pytest.raises(OllamaRuntimeError):
        parse_repair_plan(json.dumps({"changes": [{"path": "safe.py", "content": "GITHUB_TOKEN"}]}), tmp_path)


def test_validate_repair_paths_rejects_protected_paths(tmp_path: Path):
    with pytest.raises(OllamaRuntimeError):
        validate_repair_paths(tmp_path, [".github/workflows/job.yml"])
    with pytest.raises(OllamaRuntimeError):
        validate_repair_paths(tmp_path, ["/etc/passwd"])


def test_success_contract_cannot_report_success_without_validation(tmp_path: Path):
    session = FakeSession([
        {"models": [{"name": "qwen2.5-coder:3b"}]},
        {"version": "0.1.0"},
        {"models": [{"name": "qwen2.5-coder:3b"}]},
        {"response": HEALTH_SENTINEL},
    ])
    health = OllamaClient(session=session, retries=1).verify()
    contract = build_success_contract(
        tmp_path,
        health,
        llm_coding_started=True,
        validation_passed=False,
        checkpoint_created=True,
    )
    assert contract["final_status"] == "FAILED"
