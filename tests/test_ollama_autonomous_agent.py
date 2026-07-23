import importlib.util
from pathlib import Path

import pytest


def load_module():
    module_path = Path(__file__).resolve().parents[1] / "scripts" / "ollama_autonomous_agent.py"
    spec = importlib.util.spec_from_file_location("ollama_autonomous_agent", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_build_plan_and_docs_creates_required_files(tmp_path):
    module = load_module()
    result = module.build_plan_and_docs(tmp_path)

    assert result["resumefromhere"].exists()
    assert result["trade"].exists()
    assert result["ollama"].exists()
    assert result["qmoi_model"].exists()
    assert result["qmoi_model_tests"].exists()
    assert result["all_tests"].exists()
    assert result["all_hooks"].exists()
    assert result["matches"].exists()


def test_scan_for_work_covers_repo_files(tmp_path):
    module = load_module()
    sample_file = tmp_path / "sample.md"
    sample_file.write_text("TODO: replace placeholder with production implementation", encoding="utf-8")
    pending = module.scan_for_work(tmp_path)

    assert str(sample_file.relative_to(tmp_path)) in pending


def test_run_agent_refreshes_resume_with_pending_inventory(tmp_path):
    module = load_module()
    sample_file = tmp_path / "sample.md"
    sample_file.write_text("TODO: replace placeholder with production implementation", encoding="utf-8")

    result = module.run_agent(tmp_path)
    resume_text = (tmp_path / "resumefromhere.txt").read_text(encoding="utf-8")

    assert "## Repository Scan Inventory" in resume_text
    assert str(sample_file.relative_to(tmp_path)) in resume_text


def test_collect_route_inventory_finds_api_routes(tmp_path):
    module = load_module()
    route_file = tmp_path / "app" / "api" / "alpha" / "route.ts"
    route_file.parent.mkdir(parents=True, exist_ok=True)
    route_file.write_text("export async function GET() { return Response.json({ ok: true }); }\n", encoding="utf-8")

    inventory = module.collect_route_inventory(tmp_path)

    assert any(item["route"] == "/api/alpha" for item in inventory)
    assert any("GET" in item["methods"] for item in inventory)


def test_update_documentation_manifests_writes_required_docs(tmp_path):
    module = load_module()
    route_file = tmp_path / "app" / "api" / "alpha" / "route.ts"
    route_file.parent.mkdir(parents=True, exist_ok=True)
    route_file.write_text("export async function GET() { return Response.json({ ok: true }); }\n", encoding="utf-8")

    inventory = module.collect_route_inventory(tmp_path)
    docs = module.update_documentation_manifests(
        tmp_path, inventory, [{"path": "/api/alpha", "methods": "GET"}], [{"path": "/api/alpha", "methods": "GET"}], "branch/test")

    assert (tmp_path / "API.md").exists()
    assert (tmp_path / "ENDPOINTS.md").exists()
    assert (tmp_path / "ROUTES.md").exists()
    assert (tmp_path / "MERGE.md").exists()
    assert "api/alpha" in (tmp_path / "ROUTES.md").read_text(encoding="utf-8")
    assert docs["merge"].exists()


def test_ensure_ollama_client_detects_available_binary(monkeypatch):
    module = load_module()

    monkeypatch.setattr(module.shutil, "which", lambda name: "/usr/bin/ollama" if name == "ollama" else None)

    assert module._ensure_ollama_client() is True


def test_emit_status_prints_to_terminal_and_logs(capsys):
    module = load_module()

    module._emit_status("live progress message", level="info")

    captured = capsys.readouterr()
    assert "live progress message" in captured.out


def test_update_resume_progress_writes_double_marks(tmp_path):
    module = load_module()
    resume_path = tmp_path / "resumefromhere.txt"
    resume_path.write_text("# Resume\n\n## Repository Scan Inventory\n- pending item\n", encoding="utf-8")

    module._update_resume_progress(
        resume_path,
        done=["alpha.py"],
        verified=["alpha.py"],
        confirmed=["alpha.py"],
        pending=["beta.py"],
    )

    text = resume_path.read_text(encoding="utf-8")
    assert "[DONE] alpha.py" in text
    assert "[CONFIRMED] alpha.py" in text
    assert "[PENDING] beta.py" in text


def test_update_resume_progress_includes_counts_and_stats(tmp_path):
    module = load_module()
    resume_path = tmp_path / "resumefromhere.txt"
    resume_path.write_text("# Resume\n", encoding="utf-8")

    module._update_resume_progress(
        resume_path,
        done=["alpha.py"],
        verified=["beta.py"],
        confirmed=["gamma.py"],
        pending=["delta.py", "epsilon.py"],
    )

    text = resume_path.read_text(encoding="utf-8")
    assert "Pending items: 2" in text
    assert "Verified items: 1" in text
    assert "Confirmed items: 1" in text
    assert "Completion ratio" in text
    assert "Other items" in text


def test_update_production_manifests_writes_docs_and_reports(tmp_path):
    module = load_module()
    doc_dir = tmp_path / "docs"
    doc_dir.mkdir(parents=True, exist_ok=True)
    (doc_dir / "guide.md").write_text("# Guide\n\nThis is the docs index source.\n", encoding="utf-8")
    (tmp_path / "src").mkdir(parents=True, exist_ok=True)
    (tmp_path / "src" / "service.py").write_text("TODO: replace placeholder with production implementation\n", encoding="utf-8")

    docs = module.update_production_manifests(tmp_path)

    assert (tmp_path / "DOCS.md").exists()
    assert (tmp_path / "production.md").exists()
    assert (tmp_path / "productionenhanced.md").exists()
    assert "guide.md" in (tmp_path / "DOCS.md").read_text(encoding="utf-8")
    assert "service.py" in (tmp_path / "production.md").read_text(encoding="utf-8")


def test_should_stop_only_when_resume_is_confirmed(tmp_path):
    module = load_module()
    resume_path = tmp_path / "resumefromhere.txt"
    resume_path.write_text(
        "# Resume\n\n## Progress Ledger\n- [DONE] alpha.py\n- [VERIFY] alpha.py\n- [CONFIRMED] alpha.py\n- [PENDING] None\n",
        encoding="utf-8",
    )

    assert module._should_stop_autonomous_run(resume_path, pending=[])
    assert not module._should_stop_autonomous_run(resume_path, pending=["beta.py"])


def test_discover_autonomous_commands_reads_repo_docs(tmp_path):
    module = load_module()
    readme = tmp_path / "README.md"
    readme.write_text("# Example\n\n```bash\npytest -q tests\n```\n", encoding="utf-8")

    commands = module._discover_autonomous_commands(tmp_path)

    assert any("pytest -q tests" in command for command in commands)


def test_discover_autonomous_commands_adds_default_verification_steps(tmp_path):
    module = load_module()
    (tmp_path / "tests").mkdir()
    (tmp_path / "pyproject.toml").write_text("[tool.pytest.ini_options]\n", encoding="utf-8")

    commands = module._discover_autonomous_commands(tmp_path)

    assert any("pytest -q tests" in command for command in commands)
    assert any("compileall" in command for command in commands)


def test_scan_for_work_includes_spec_and_config_files(tmp_path):
    module = load_module()
    spec_file = tmp_path / "service.spec"
    spec_file.write_text("TODO: implement spec", encoding="utf-8")
    config_file = tmp_path / "settings.ini"
    config_file.write_text("[DEFAULT]\nTODO=fix", encoding="utf-8")

    pending = module.scan_for_work(tmp_path)

    assert str(spec_file.relative_to(tmp_path)) in pending
    assert str(config_file.relative_to(tmp_path)) in pending


def test_scan_for_work_reports_missing_required_docs_and_workflow_gaps(tmp_path):
    module = load_module()
    workflow_dir = tmp_path / ".github" / "workflows"
    workflow_dir.mkdir(parents=True, exist_ok=True)
    (workflow_dir / "example.yml").write_text(
        "name: Example\nsteps:\n  - run: echo hi\n  - uses: actions/github-script@v6\n    with:\n      token: ${{ secrets.GITHUB_TOKEN }}\n",
        encoding="utf-8",
    )

    pending = module.scan_for_work(tmp_path)

    assert any("MISSING_REQUIRED_FILE" in item and "ALLHOOKSWEBHOOKS.md" in item for item in pending)
    assert any("WORKFLOW_TOKEN_GAP" in item and "example.yml" in item for item in pending)


def test_collect_merge_inventory_groups_similar_names(tmp_path):
    module = load_module()
    first = tmp_path / "module.spec.ts"
    second = tmp_path / "module.ts"
    first.write_text("TODO: impl", encoding="utf-8")
    second.write_text("TODO: impl", encoding="utf-8")

    inventory = module.collect_merge_inventory(tmp_path)

    assert inventory
    assert any(group["paths"] for group in inventory)


def test_write_live_notification_summary_creates_feed(tmp_path):
    module = load_module()

    path = module.write_live_notification_summary(tmp_path, "hello from ollama", branch="branch/test")

    assert path.exists()
    assert "hello from ollama" in path.read_text(encoding="utf-8")
    assert "Ollama activity feed" in path.read_text(encoding="utf-8")
