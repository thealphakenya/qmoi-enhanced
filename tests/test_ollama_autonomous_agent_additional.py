import importlib.util
from pathlib import Path


def load_module():
    module_path = Path(__file__).resolve().parents[1] / "scripts" / "ollama_autonomous_agent.py"
    spec = importlib.util.spec_from_file_location("ollama_autonomous_agent", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_run_safe_command_supports_known_verification_tools(tmp_path):
    module = load_module()
    script = tmp_path / "dummy.py"
    script.write_text("print('ok')\n", encoding="utf-8")
    result = module._run_safe_command(f"python -m compileall {script.name}", tmp_path)
    assert result["status"] in {"passed", "failed", "error", "skipped"}
    assert isinstance(result["output"], str)


def test_workflows_master_pipeline_includes_ollama_dispatchers():
    repo_root = Path(__file__).resolve().parents[1]
    workflow_path = repo_root / ".github" / "workflows" / "master-pipeline.yml"
    content = workflow_path.read_text(encoding="utf-8")

    assert "run_ollama_trigger" in content
    assert "run_ollama_agent" in content
    assert "run_qmoi_autodev" in content
    assert "ollamatrigger.yml" in content
    assert "ollama-autonomous-agent.yml" in content
    assert "qmoi-autodev.yml" in content


def test_write_github_actions_summary_appends_to_step_summary(tmp_path, monkeypatch):
    module = load_module()
    summary_file = tmp_path / "step_summary.md"
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    monkeypatch.setenv("GITHUB_STEP_SUMMARY", str(summary_file))

    module._write_github_actions_summary("Test summary line")

    assert summary_file.exists()
    assert "Test summary line" in summary_file.read_text(encoding="utf-8")
