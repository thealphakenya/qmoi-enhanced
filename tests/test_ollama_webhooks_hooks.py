"""Tests for Ollama autonomous agent webhook and hook features."""
import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from scripts import ollama_autonomous_agent as agent


def test_trigger_webhook_success_with_requests(tmp_path, monkeypatch):
    """Test successful webhook delivery with mocked requests."""
    repo = tmp_path / "repo"
    repo.mkdir()

    mock_response = MagicMock()
    mock_response.status_code = 200

    mock_post = MagicMock(return_value=mock_response)
    monkeypatch.setattr(agent, "requests", MagicMock(post=mock_post))

    result = agent._trigger_webhook(
        "https://example.com/webhook",
        "phase.start",
        {"phase": "test", "status": "started"},
        root=repo,
    )

    assert result is True
    mock_post.assert_called_once()
    call_args = mock_post.call_args
    assert call_args[0][0] == "https://example.com/webhook"
    assert call_args[1]["json"]["event_type"] == "phase.start"


def test_trigger_webhook_failure_status_code(tmp_path, monkeypatch):
    """Test webhook delivery fails with non-success status code."""
    repo = tmp_path / "repo"
    repo.mkdir()

    mock_response = MagicMock()
    mock_response.status_code = 500

    mock_post = MagicMock(return_value=mock_response)
    monkeypatch.setattr(agent, "requests", MagicMock(post=mock_post))
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    result = agent._trigger_webhook(
        "https://example.com/webhook",
        "phase.start",
        {"phase": "test"},
        root=repo,
    )

    assert result is False


def test_trigger_webhook_exception_handling(tmp_path, monkeypatch):
    """Test webhook delivery handles exceptions gracefully."""
    repo = tmp_path / "repo"
    repo.mkdir()

    mock_post = MagicMock(side_effect=Exception("Connection timeout"))
    monkeypatch.setattr(agent, "requests", MagicMock(post=mock_post))
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    result = agent._trigger_webhook(
        "https://example.com/webhook",
        "phase.start",
        {"phase": "test"},
        root=repo,
    )

    assert result is False


def test_trigger_webhook_no_requests_module(tmp_path, monkeypatch):
    """Test webhook gracefully fails when requests module not available."""
    repo = tmp_path / "repo"
    repo.mkdir()

    monkeypatch.setattr(agent, "requests", None)

    result = agent._trigger_webhook(
        "https://example.com/webhook",
        "phase.start",
        {"phase": "test"},
        root=repo,
    )

    assert result is False


def test_invoke_hook_success(tmp_path, monkeypatch):
    """Test successful local hook invocation."""
    repo = tmp_path / "repo"
    hooks_dir = repo / ".ollama_hooks"
    hooks_dir.mkdir(parents=True)

    hook_script = hooks_dir / "test_hook.sh"
    hook_script.write_text("#!/bin/bash\nexit 0\n", encoding="utf-8")
    hook_script.chmod(0o755)

    mock_run = MagicMock()
    mock_run.return_value.returncode = 0
    mock_run.return_value.stdout = "Hook executed"
    mock_run.return_value.stderr = ""

    monkeypatch.setattr(agent.subprocess, "run", mock_run)
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    result = agent._invoke_hook("test_hook", {"event": "test"}, root=repo)

    assert result is True
    mock_run.assert_called_once()


def test_invoke_hook_failure(tmp_path, monkeypatch):
    """Test failed hook invocation returns False."""
    repo = tmp_path / "repo"
    hooks_dir = repo / ".ollama_hooks"
    hooks_dir.mkdir(parents=True)

    hook_script = hooks_dir / "test_hook.sh"
    hook_script.write_text("#!/bin/bash\nexit 1\n", encoding="utf-8")
    hook_script.chmod(0o755)

    mock_run = MagicMock()
    mock_run.return_value.returncode = 1
    mock_run.return_value.stdout = ""
    mock_run.return_value.stderr = "Hook failed"

    monkeypatch.setattr(agent.subprocess, "run", mock_run)
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    result = agent._invoke_hook("test_hook", {"event": "test"}, root=repo)

    assert result is False


def test_invoke_hook_not_found(tmp_path):
    """Test hook invocation when hook script doesn't exist."""
    repo = tmp_path / "repo"
    repo.mkdir()

    result = agent._invoke_hook("nonexistent_hook", {"event": "test"}, root=repo)

    assert result is False


def test_load_webhooks_config_valid(tmp_path):
    """Test loading valid webhooks configuration."""
    repo = tmp_path / "repo"
    repo.mkdir()

    config_path = repo / ".ollama_webhooks.json"
    config = {
        "phase_started": ["https://example.com/start"],
        "phase_completed": ["https://example.com/complete"],
    }
    config_path.write_text(json.dumps(config), encoding="utf-8")

    result = agent._load_webhooks_config(repo)

    assert result == config
    assert len(result["phase_started"]) == 1


def test_load_webhooks_config_not_found(tmp_path):
    """Test loading webhooks when config file doesn't exist."""
    repo = tmp_path / "repo"
    repo.mkdir()

    result = agent._load_webhooks_config(repo)

    assert result == {}


def test_load_webhooks_config_invalid_json(tmp_path):
    """Test loading webhooks with invalid JSON."""
    repo = tmp_path / "repo"
    repo.mkdir()

    config_path = repo / ".ollama_webhooks.json"
    config_path.write_text("{ invalid json", encoding="utf-8")

    result = agent._load_webhooks_config(repo)

    assert result == {}


def test_notify_phase_start_triggers_webhooks(tmp_path, monkeypatch):
    """Test phase start notification triggers webhooks."""
    repo = tmp_path / "repo"
    repo.mkdir()

    # Setup webhooks config
    config_path = repo / ".ollama_webhooks.json"
    config = {"phase_started": ["https://example.com/start"]}
    config_path.write_text(json.dumps(config), encoding="utf-8")

    triggered = []

    def mock_trigger(url, event_type, payload, root=None):
        triggered.append((url, event_type))
        return True

    def mock_invoke(hook_name, event_data, root=None):
        return True

    monkeypatch.setattr(agent, "_trigger_webhook", mock_trigger)
    monkeypatch.setattr(agent, "_invoke_hook", mock_invoke)
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    agent._notify_phase_start("merge-first", {"step": "init"}, root=repo)

    assert len(triggered) == 1
    assert triggered[0][0] == "https://example.com/start"
    assert "merge-first" in triggered[0][1]


def test_notify_phase_complete_triggers_webhooks(tmp_path, monkeypatch):
    """Test phase completion notification triggers webhooks."""
    repo = tmp_path / "repo"
    repo.mkdir()

    # Setup webhooks config
    config_path = repo / ".ollama_webhooks.json"
    config = {"phase_completed": ["https://example.com/complete"]}
    config_path.write_text(json.dumps(config), encoding="utf-8")

    triggered = []

    def mock_trigger(url, event_type, payload, root=None):
        triggered.append((url, event_type))
        return True

    def mock_invoke(hook_name, event_data, root=None):
        return True

    monkeypatch.setattr(agent, "_trigger_webhook", mock_trigger)
    monkeypatch.setattr(agent, "_invoke_hook", mock_invoke)
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    agent._notify_phase_complete("merge-first", {"items": 5}, root=repo)

    assert len(triggered) == 1
    assert triggered[0][0] == "https://example.com/complete"


def test_log_phase_debug_creates_jsonl(tmp_path, monkeypatch):
    """Test phase debug logging writes to JSONL file."""
    repo = tmp_path / "repo"
    repo.mkdir()

    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    agent._log_phase_debug(
        "merge-first",
        "workflow_merge",
        "Merged 3 workflow files",
        {"merged": 3, "deleted": 1},
        root=repo,
    )

    debug_log = repo / "OLLAMA_PHASE_DEBUG.jsonl"
    assert debug_log.exists()

    # Read and validate JSONL
    content = debug_log.read_text(encoding="utf-8")
    lines = content.strip().split("\n")
    assert len(lines) == 1

    entry = json.loads(lines[0])
    assert entry["phase"] == "merge-first"
    assert entry["step"] == "workflow_merge"
    assert entry["message"] == "Merged 3 workflow files"
    assert entry["data"]["merged"] == 3


def test_log_phase_debug_append_mode(tmp_path, monkeypatch):
    """Test phase debug logging appends to existing file."""
    repo = tmp_path / "repo"
    repo.mkdir()

    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    # Log first entry
    agent._log_phase_debug("phase1", "step1", "First entry", root=repo)

    # Log second entry
    agent._log_phase_debug("phase2", "step2", "Second entry", root=repo)

    debug_log = repo / "OLLAMA_PHASE_DEBUG.jsonl"
    content = debug_log.read_text(encoding="utf-8")
    lines = content.strip().split("\n")

    assert len(lines) == 2
    first = json.loads(lines[0])
    second = json.loads(lines[1])
    assert first["phase"] == "phase1"
    assert second["phase"] == "phase2"


def test_webhook_includes_environment_info(tmp_path, monkeypatch):
    """Test webhooks include environment information."""
    repo = tmp_path / "repo"
    repo.mkdir()

    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    monkeypatch.setenv("GITHUB_HEAD_REF", "feature-branch")
    monkeypatch.setenv("GITHUB_RUN_ID", "999")

    captured_data = {}

    def mock_post(url, json=None, **kwargs):
        captured_data["json"] = json
        response = MagicMock()
        response.status_code = 200
        return response

    mock_requests = MagicMock()
    mock_requests.post = mock_post
    monkeypatch.setattr(agent, "requests", mock_requests)
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    agent._trigger_webhook(
        "https://example.com/hook",
        "test.event",
        {"data": "test"},
        root=repo,
    )

    assert "environment" in captured_data["json"]
    env = captured_data["json"]["environment"]
    assert env["github_actions"] == "true"
    assert env["branch"] == "feature-branch"
    assert env["ci_build_id"] == "999"


def test_webhook_payload_structure(tmp_path, monkeypatch):
    """Test webhook payload has correct structure."""
    repo = tmp_path / "repo"
    repo.mkdir()

    captured_data = {}

    def mock_post(url, json=None, **kwargs):
        captured_data["json"] = json
        response = MagicMock()
        response.status_code = 200
        return response

    mock_requests = MagicMock()
    mock_requests.post = mock_post
    monkeypatch.setattr(agent, "requests", mock_requests)
    monkeypatch.setattr(agent, "_emit_status", lambda *args, **kwargs: None)

    agent._trigger_webhook(
        "https://example.com/hook",
        "phase.test.started",
        {"phase": "test", "status": "started"},
        root=repo,
    )

    payload = captured_data["json"]
    assert "event_type" in payload
    assert "timestamp" in payload
    assert "environment" in payload
    assert "payload" in payload
    assert payload["event_type"] == "phase.test.started"
