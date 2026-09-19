import json
import os
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


def test_generate_restarts_server_before_retrying_when_connection_is_down(monkeypatch):
    session = FakeSession([
        ConnectionError("offline"),
        {"response": HEALTH_SENTINEL},
    ])
    client = OllamaClient(session=session, retries=1)
    bootstrap = object()
    ensure_calls = {"count": 0}

    def fake_ensure():
        ensure_calls["count"] += 1
        return True

    monkeypatch.setattr(client, "_request", lambda method, path, **kwargs: (session.request(method, path, **kwargs)))
    monkeypatch.setattr(OllamaBootstrap, "ensure_server", lambda self: fake_ensure())

    response = client.generate("ping")
    assert response == HEALTH_SENTINEL
    assert ensure_calls["count"] == 1


def test_bootstrap_reuses_healthy_server():
    session = FakeSession([{"models": []}])
    client = OllamaClient(session=session, retries=1)
    assert OllamaBootstrap(client).ensure_server() is True


def test_bootstrap_reports_missing_binary(monkeypatch):
    session = FakeSession([ConnectionError("offline")])
    client = OllamaClient(session=session, retries=1)
    monkeypatch.setattr(OllamaBootstrap, "_find_binary", staticmethod(lambda: None))
    with pytest.raises(OllamaRuntimeError, match="not installed"):
        OllamaBootstrap(client).ensure_server()


def test_bootstrap_installs_missing_binary(monkeypatch):
    session = FakeSession([ConnectionError("offline"), {"models": []}])
    client = OllamaClient(session=session, retries=1)

    class StubProcess:
        stderr = None

        def poll(self):
            return None

    monkeypatch.setattr(OllamaBootstrap, "_find_binary", staticmethod(lambda: None))
    monkeypatch.setattr(OllamaBootstrap, "_install_binary", staticmethod(lambda: "/usr/local/bin/ollama"))
    monkeypatch.setattr("scripts.ollama_runtime.subprocess.Popen", lambda *args, **kwargs: StubProcess())

    assert OllamaBootstrap(client).ensure_server() is True


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


def test_success_contract_accepts_agent_health_mapping(tmp_path: Path):
    health = {
        "ollama_started": True,
        "ollama_healthy": True,
        "model_available": True,
        "inference_verified": True,
    }
    contract = build_success_contract(
        tmp_path,
        health,
        llm_coding_started=True,
        validation_passed=True,
        checkpoint_created=True,
    )
    assert contract["final_status"] == "SUCCESS"


def test_build_github_proof_contract_marks_valid_registry_ready(monkeypatch, tmp_path: Path):
    from scripts.ollama_autonomous_agent import OllamaAutonomousAgent, PLATFORMS, QMOI_APPS

    agent = OllamaAutonomousAgent(tmp_path)

    monkeypatch.setattr(
        agent,
        "validate_all_platforms",
        lambda: {platform: {"passed": True} for platform in PLATFORMS},
    )
    monkeypatch.setattr(
        agent,
        "validate_all_platform_features",
        lambda: {
            platform: {app: {"feature_1": True} for app in QMOI_APPS}
            for platform in PLATFORMS
        },
    )
    monkeypatch.setattr(
        agent,
        "validate_file_handlers",
        lambda: {platform: {"registered": True} for platform in PLATFORMS},
    )
    monkeypatch.setattr(
        agent.cross_repo_manager,
        "build_autonomy_plan",
        lambda: {"alpha_q_ai_included": True},
    )
    monkeypatch.setattr(
        "scripts.ollama_autonomous_agent.BranchSyncManager.build_sync_plan",
        lambda: {"status": "ready"},
    )

    contract = agent.build_github_proof_contract()
    assert contract["status"] == "ready_for_github"


def test_run_autonomous_loop_recovers_from_transient_model_500(monkeypatch, tmp_path: Path):
    from scripts.ollama_autonomous_agent import OllamaAutonomousAgent

    agent = OllamaAutonomousAgent(tmp_path)
    attempts = {"count": 0}

    monkeypatch.setattr(
        agent,
        "verify_ollama",
        lambda: {
            "ollama_host": "http://127.0.0.1:11434",
            "model": "qwen2.5-coder:3b",
            "ollama_started": True,
            "ollama_healthy": True,
            "ollama_version": "0.34.2",
            "model_available": True,
            "inference_verified": True,
            "inference_latency": 0.1,
            "health_timestamp": "2026-09-18T00:00:00Z",
            "error": None,
        },
    )
    monkeypatch.setattr(agent, "_repository_context", lambda: ["README.md"])
    monkeypatch.setattr(agent, "run_lint_suite", lambda: True)
    monkeypatch.setattr(agent, "run_full_validation_suite", lambda: True)
    monkeypatch.setattr(agent, "record_tracker_event", lambda *args, **kwargs: None)

    def fake_checkpoint(*args, **kwargs):
        checkpoint_path = tmp_path / "checkpoint.json"
        checkpoint_path.write_text("{}", encoding="utf-8")
        return checkpoint_path

    monkeypatch.setattr(agent, "update_resume_checkpoint", fake_checkpoint)

    def fake_generate(prompt):
        attempts["count"] += 1
        if attempts["count"] == 1:
            raise OllamaRuntimeError("Ollama request failed: 500 Server Error")
        return json.dumps({"summary": "ok", "changes": []})

    monkeypatch.setattr(agent.ollama, "generate", fake_generate)

    result = agent.run_autonomous_loop()
    assert result["final_status"] == "SUCCESS"
    assert attempts["count"] >= 2


def test_agent_rejects_non_github_hosted_runtime(monkeypatch, tmp_path):
    monkeypatch.setenv("QMOI_RUNTIME_MODE", "github-hosted")
    monkeypatch.setenv("QMOI_GITHUB_HOSTED", "true")
    monkeypatch.setenv("QMOI_REQUIRE_GITHUB_HOSTED", "true")
    monkeypatch.setenv("GITHUB_ACTIONS", "false")

    from scripts.ollama_autonomous_agent import OllamaAutonomousAgent

    agent = OllamaAutonomousAgent(tmp_path)
    with pytest.raises(RuntimeError, match="GitHub-hosted"):
        agent.enforce_github_runtime()


def test_validate_release_assets_handles_full_release_list(monkeypatch):
    captured = []

    def fake_run(*args, **kwargs):
        return type("Result", (), {"stdout": '{"tag_name":"v1.2.5","assets":["https://example.com/app.zip"]}', "returncode": 0})()

    monkeypatch.setattr("scripts.link_validator.subprocess.run", fake_run)
    monkeypatch.setattr(
        "scripts.link_validator.LinkValidator.add_checked",
        lambda self, url, source, link_type: captured.append((url, source, link_type)),
    )

    LinkValidator = __import__("scripts.link_validator", fromlist=["LinkValidator"]).LinkValidator
    validator = LinkValidator()
    validator.validate_release_assets()

    assert captured == [("https://example.com/app.zip", "release:v1.2.5", "release_asset")]


def test_validate_rendered_page_detects_expected_markers(monkeypatch):
    LinkValidator = __import__("scripts.link_validator", fromlist=["LinkValidator"]).LinkValidator
    validator = LinkValidator()

    monkeypatch.setattr(validator, "check_url", lambda url: (True, 200, None))
    monkeypatch.setattr(
        validator,
        "fetch_rendered_html",
        lambda url: "<html><head><title>QMOI AI</title></head><body><h1>QMOI AI</h1></body></html>",
    )

    result = validator.validate_rendered_page("https://qmoi.com", ("QMOI", "AI"))

    assert result.accessible is True
    assert result.status_code == 200
    assert result.rendered_ok is True


def test_validate_rendered_page_flags_missing_content(monkeypatch):
    LinkValidator = __import__("scripts.link_validator", fromlist=["LinkValidator"]).LinkValidator
    validator = LinkValidator()

    monkeypatch.setattr(validator, "check_url", lambda url: (True, 200, None))
    monkeypatch.setattr(
        validator,
        "fetch_rendered_html",
        lambda url: "<html><body><h1>Something else</h1></body></html>",
    )

    result = validator.validate_rendered_page("https://qmoi.com", ("QMOI", "AI"))

    assert result.accessible is True
    assert result.rendered_ok is False
    assert "QMOI" in (result.error or "")
