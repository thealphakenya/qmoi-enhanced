import importlib.util
import os
from pathlib import Path

import pytest


def load_module():
    module_path = Path(__file__).resolve().parents[1] / "scripts" / "ollama_autonomous_agent.py"
    spec = importlib.util.spec_from_file_location("ollama_autonomous_agent", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def load_validator_module():
    module_path = Path(__file__).resolve().parents[1] / "scripts" / "validate_all_credentials.py"
    spec = importlib.util.spec_from_file_location("validate_all_credentials", module_path)
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
    assert (tmp_path / "ALLPORTS.md").exists()


def test_build_plan_and_docs_creates_extended_docs_inventory(tmp_path):
    module = load_module()
    module.build_plan_and_docs(tmp_path)

    for filename in ["ALLAUTO.md", "ALLMDFILES.md", "WORKFLOWS.md", "FINANCIALMANAGER.md", "STANDARD1.md", "ALLLINKS.md", "QMOI_MEMORY_AWARENESS_SYSTEM.md", "EXTERNAL_RESEARCH_RESOURCES.md"]:
        assert (tmp_path / filename).exists()


def test_build_plan_and_docs_creates_workflows_doc(tmp_path):
    module = load_module()
    result = module.build_plan_and_docs(tmp_path)

    assert (tmp_path / "WORKFLOWS.md").exists()
    assert "Workflow inventory" in (tmp_path / "WORKFLOWS.md").read_text(encoding="utf-8")
    assert result["workflows"].exists()


def test_build_plan_and_docs_creates_memory_awareness_doc(tmp_path):
    module = load_module()
    result = module.build_plan_and_docs(tmp_path)

    assert (tmp_path / "QMOI_MEMORY_AWARENESS_SYSTEM.md").exists()
    assert "Autonomous execution surface" in (tmp_path / "QMOI_MEMORY_AWARENESS_SYSTEM.md").read_text(encoding="utf-8")
    assert result["memory_awareness"].exists()


def test_build_plan_and_docs_creates_app_specific_docs(tmp_path):
    module = load_module()
    module.build_plan_and_docs(tmp_path)

    for filename in ["QMOIAIUI.md", "QMOISPACEUI.md", "QCITYUI.md", "QALPHAUI.md"]:
        assert (tmp_path / filename).exists()
        assert (tmp_path / filename).read_text(encoding="utf-8").startswith(f"# {filename}")


def test_build_plan_and_docs_creates_universal_and_styles_docs(tmp_path):
    module = load_module()
    module.build_plan_and_docs(tmp_path)

    for filename in ["UNIVERSALS.md", "STYLES.md"]:
        assert (tmp_path / filename).exists()
        assert (tmp_path / filename).read_text(encoding="utf-8").startswith(f"# {filename}")


def test_collect_finance_and_credential_inventory_detects_bitget_env_vars(tmp_path):
    module = load_module()
    sample_file = tmp_path / "app" / "api" / "qi-trading.ts"
    sample_file.parent.mkdir(parents=True, exist_ok=True)
    sample_file.write_text(
        "const BITGET_API_KEY = process.env.BITGET_API_KEY;\n"
        "const BITGET_SECRET_KEY = process.env.BITGET_SECRET_KEY;\n"
        "const BITGET_API_PASSPHRASE = process.env.BITGET_API_PASSPHRASE;\n",
        encoding="utf-8",
    )

    inventory = module.collect_finance_and_credential_inventory(tmp_path)
    bitget = next((item for item in inventory if item["provider"] == "Bitget"), None)

    assert bitget is not None
    assert "BITGET_API_KEY" in bitget["env_vars"]
    assert "BITGET_SECRET_KEY" in bitget["env_vars"]
    assert "BITGET_API_PASSPHRASE" in bitget["env_vars"] or "BITGET_PASSPHRASE" in bitget["env_vars"]
    assert bitget["requires_master_auth"] is True


def test_update_finance_and_credential_manifests_includes_bitget(tmp_path):
    module = load_module()
    manifest_file = tmp_path / "FINANCE_CREDENTIALS.md"
    sample_file = tmp_path / "app" / "api" / "qi-trading.ts"
    sample_file.parent.mkdir(parents=True, exist_ok=True)
    sample_file.write_text(
        "const BITGET_API_KEY = process.env.BITGET_API_KEY;\n"
        "const BITGET_SECRET_KEY = process.env.BITGET_SECRET_KEY;\n"
        "const BITGET_API_PASSPHRASE = process.env.BITGET_API_PASSPHRASE;\n",
        encoding="utf-8",
    )

    module.update_finance_and_credential_manifests(tmp_path, require_master_auth=True)
    manifest_text = manifest_file.read_text(encoding="utf-8")

    assert "Bitget" in manifest_text
    assert "BITGET_API_KEY" in manifest_text
    assert "BITGET_SECRET_KEY" in manifest_text
    assert "BITGET_API_PASSPHRASE" in manifest_text or "BITGET_PASSPHRASE" in manifest_text
    assert "master authorization required" in manifest_text


def test_update_deployment_verification_manifest_writes_guidance(tmp_path):
    module = load_module()
    (tmp_path / "vercel.json").write_text("{\"version\": 2}", encoding="utf-8")

    manifest_path = module.update_deployment_verification_manifest(tmp_path)
    manifest_text = manifest_path.read_text(encoding="utf-8")

    assert manifest_path.exists()
    assert "Deployment verification manifest" in manifest_text
    assert "Vercel" in manifest_text


def test_update_feature_and_percentage_manifest_writes_inventory(tmp_path):
    module = load_module()
    (tmp_path / "app").mkdir(parents=True, exist_ok=True)
    (tmp_path / "app" / "feature.ts").write_text("const confidence = 0.85; const percent = 85%;", encoding="utf-8")

    manifest_path = module.update_feature_and_percentage_manifest(tmp_path)
    manifest_text = manifest_path.read_text(encoding="utf-8")

    assert manifest_path.exists()
    assert "Features and percentages manifest" in manifest_text
    assert "percentages" in manifest_text.lower()


def test_write_bitget_credential_guide_creates_reference_doc(tmp_path):
    module = load_module()

    guide_path = module._write_bitget_credential_guide(tmp_path)
    guide_text = guide_path.read_text(encoding="utf-8")

    assert guide_path.exists()
    assert "BITGET_API_SECRET or BITGET_SECRET_KEY" in guide_text
    assert ".qmoi_validation/credentials.enc" in guide_text


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
    assert (tmp_path / "API.md").exists()
    assert (tmp_path / "ENDPOINTS.md").exists()
    assert (tmp_path / "ROUTES.md").exists()
    assert (tmp_path / "ALLPORTS.md").exists()


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
        tmp_path,
        inventory,
        [{"path": "/api/alpha", "methods": "GET"}],
        [{"path": "/api/alpha", "methods": "GET"}],
        "branch/test"
    )

    assert (tmp_path / "API.md").exists()
    assert (tmp_path / "ENDPOINTS.md").exists()
    assert (tmp_path / "ROUTES.md").exists()
    assert (tmp_path / "ALLPORTS.md").exists()
    assert (tmp_path / "MERGE.md").exists()
    assert "api/alpha" in (tmp_path / "ROUTES.md").read_text(encoding="utf-8")
    assert docs["merge"].exists()


def test_generate_allports_doc_includes_discovered_ports(tmp_path):
    module = load_module()
    service_file = tmp_path / "service" / "server.py"
    service_file.parent.mkdir(parents=True, exist_ok=True)
    service_file.write_text(
        "import os\nPORT = 3000\nprint('listening on port 3000')\n",
        encoding="utf-8",
    )
    docs = module._build_all_ports_doc(tmp_path)

    assert docs.exists()
    content = docs.read_text(encoding="utf-8")
    assert "## Port 3000" in content
    assert "service/server.py" in content


def test_run_agent_refreshes_resume_with_pending_inventory_and_required_docs(tmp_path):
    module = load_module()
    sample_file = tmp_path / "sample.md"
    sample_file.write_text("TODO: replace placeholder with production implementation", encoding="utf-8")

    result = module.run_agent(tmp_path)
    resume_text = (tmp_path / "resumefromhere.txt").read_text(encoding="utf-8")

    assert "## Repository Scan Inventory" in resume_text
    assert str(sample_file.relative_to(tmp_path)) in resume_text
    assert (tmp_path / "API.md").exists()
    assert (tmp_path / "ENDPOINTS.md").exists()
    assert (tmp_path / "ROUTES.md").exists()
    assert (tmp_path / "ALLPORTS.md").exists()


def test_build_plan_and_docs_also_creates_merge_manifest(tmp_path):
    module = load_module()
    result = module.build_plan_and_docs(tmp_path)

    assert (tmp_path / "MERGE.md").exists()
    assert "Merge-first policy" in (tmp_path / "MERGE.md").read_text(encoding="utf-8")
    assert result["merge"].exists()


def test_run_agent_merges_duplicate_workflows_before_processing(tmp_path):
    module = load_module()
    workflow_dir = tmp_path / ".github" / "workflows"
    workflow_dir.mkdir(parents=True, exist_ok=True)
    first = workflow_dir / "build.yml"
    second = workflow_dir / "build.yaml"
    first.write_text(
        "name: Build\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo first\n",
        encoding="utf-8",
    )
    second.write_text(
        "name: Build\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo second\n      - run: echo extra\n",
        encoding="utf-8",
    )
    archive_path = tmp_path / "archive" / "legacy-backup.txt"
    archive_path.parent.mkdir(parents=True, exist_ok=True)
    archive_path.write_text("legacy content that is no longer referenced\n", encoding="utf-8")

    result = module.run_agent(tmp_path)

    workflows = [p.name for p in workflow_dir.iterdir() if p.is_file()]
    build_workflows = [name for name in workflows if name.startswith("build.")]
    assert len(build_workflows) == 1
    assert (tmp_path / "MERGE.md").exists()
    assert "Merge-first policy" in (tmp_path / "MERGE.md").read_text(encoding="utf-8")
    assert "legacy-backup.txt" in (tmp_path / "MERGE.md").read_text(encoding="utf-8")
    assert result["pending"] is not None


def test_prioritize_pending_items_orders_merge_and_task_items_first(tmp_path):
    module = load_module()
    pending = [
        "MINIMAL_IMPLEMENTATION:scripts/example.py",
        "MISSING_TESTS:scripts/example.py",
        "TASK:WIFI_FEATURES_AUTOMATION",
        "MERGE_REQUIRED:module",
        "WORKFLOW_TOKEN_GAP:.github/workflows/example.yml",
        "MISSING_REQUIRED_FILE:API.md",
        "pytest -q",
    ]

    ordered = module._prioritize_pending_items(pending)
    assert ordered[0].startswith("MISSING_REQUIRED_FILE:"), "Missing required files should be highest priority"
    assert ordered[1].startswith("WORKFLOW_TOKEN_GAP:"), "Workflow token gaps should follow missing files"
    assert ordered[2].startswith("MERGE_REQUIRED:"), "Merge required items should come before tasks"
    assert ordered[3].startswith("TASK:"), "Task items should come before tests and implementations"
    assert ordered[4].startswith("MISSING_TESTS:"), "Missing tests should come before minimal implementations"
    assert ordered[5].startswith("MINIMAL_IMPLEMENTATION:"), "Minimal implementations should run after missing tests"
    assert ordered[-1].startswith("pytest"), "Resume commands should be lowest priority"
    assert "ALLPORTS.md" not in ordered or all(isinstance(item, str) for item in ordered)


def test_prioritize_resume_instructions_orders_plan_and_resume_commands():
    module = load_module()
    instructions = [
        "pytest -q",
        "TASK:REFRESH_ROUTE_API_MANIFESTS",
        "MERGE_REQUIRED:cache",
        "MISSING_REQUIRED_FILE:ROUTES.md",
        "python -m compileall .",
    ]

    ordered = module._prioritize_resume_instructions(instructions)
    assert ordered[0].startswith("MISSING_REQUIRED_FILE:"), "Resume instructions should prioritize missing files"
    assert ordered[1].startswith("MERGE_REQUIRED:"), "Merge instructions should follow missing file remediation"
    assert ordered[2].startswith("TASK:"), "Task instructions should run before verification commands"
    assert ordered[-1].startswith("python -m compileall"), "Verification-like commands should be last"


def test_ensure_ollama_client_detects_available_binary(monkeypatch):
    module = load_module()

    monkeypatch.setattr(module.shutil, "which", lambda name: "/usr/bin/ollama" if name == "ollama" else None)

    assert module._ensure_ollama_client() is True


def test_emit_status_prints_to_terminal_and_logs(capsys):
    module = load_module()

    module._emit_status("live progress message", level="info")

    captured = capsys.readouterr()
    assert "live progress message" in captured.out


def test_resolve_target_branch_defaults_to_main(monkeypatch):
    module = load_module()
    monkeypatch.delenv("TARGET_BRANCH", raising=False)
    monkeypatch.delenv("GITHUB_REF_NAME", raising=False)

    assert module._resolve_target_branch() == "main"


def test_mirror_to_alpha_q_ai_uses_configured_target(monkeypatch, tmp_path):
    module = load_module()
    monkeypatch.setenv("GH_TOKEN", "secret-token")
    monkeypatch.setenv("QMOI_SYNC_TARGET_REPO", "thealphakenya/Alpha-Q-ai")

    calls = []

    def fake_run(command, cwd=None, capture_output=True, check=False):
        calls.append((command, cwd))
        return type("Result", (), {"returncode": 0, "stdout": "", "stderr": ""})()

    monkeypatch.setattr(module, "_run_shell_command", fake_run)

    result = module._mirror_to_alpha_q_ai("main", tmp_path)

    assert result["mirrored"] is True
    assert calls[0][0][0:3] == ["git", "push", "--force-with-lease"]
    assert calls[0][0][3] == "https://x-access-token:secret-token@github.com/thealphakenya/Alpha-Q-ai.git"
    assert calls[0][0][4] == "HEAD:main"


def test_resolve_target_branch_uses_git_head_when_env_missing(monkeypatch):
    module = load_module()
    monkeypatch.delenv("TARGET_BRANCH", raising=False)
    monkeypatch.delenv("GITHUB_REF_NAME", raising=False)
    monkeypatch.delenv("GITHUB_HEAD_REF", raising=False)

    def fake_run(command, cwd=None, capture_output=True, check=False):
        if command == ["git", "rev-parse", "--abbrev-ref", "HEAD"]:
            return type("Result", (), {"returncode": 0, "stdout": "feature/codespace\n", "stderr": ""})()
        return type("Result", (), {"returncode": 0, "stdout": "", "stderr": ""})()

    monkeypatch.setattr(module, "_run_shell_command", fake_run)

    assert module._resolve_target_branch() == "feature/codespace"


def test_save_and_load_state_persists_agent_state(tmp_path):
    module = load_module()
    state = {"processed": ["task1"], "iteration": 5, "resume_checksum": "abc123"}

    module._save_state(state, tmp_path)
    loaded = module._load_state(tmp_path)

    assert loaded["processed"] == ["task1"]
    assert loaded["iteration"] == 5
    assert loaded["resume_checksum"] == "abc123"


def test_resume_file_changed_updates_checksum_and_iteration(tmp_path):
    module = load_module()
    resume_path = tmp_path / "resumefromhere.txt"
    resume_path.write_text("# Resume from here\n\n- TASK:do something\n", encoding="utf-8")
    module._save_state({"processed": [], "iteration": 1, "resume_checksum": None}, tmp_path)

    changed = module._resume_file_changed(tmp_path)
    state = module._load_state(tmp_path)

    assert changed is True
    assert state["resume_checksum"] is not None
    assert state["iteration"] == 2


def test_write_github_actions_summary_appends_when_in_github_actions(monkeypatch, tmp_path):
    module = load_module()
    summary_path = tmp_path / "GITHUB_STEP_SUMMARY"
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    monkeypatch.setenv("GITHUB_STEP_SUMMARY", str(summary_path))

    module._write_github_actions_summary("Test summary line")

    assert summary_path.exists()
    assert "Test summary line" in summary_path.read_text(encoding="utf-8")


def test_git_commit_and_push_automatically_syncs_autosync_into_main(monkeypatch, tmp_path):
    module = load_module()
    monkeypatch.setenv("AUTO_PUSH", "1")
    monkeypatch.setenv("TARGET_BRANCH", "autosync")

    commands = []

    def fake_run(command, cwd=None, capture_output=True, check=False):
        commands.append(command)
        if command[:3] == ["git", "diff", "--cached"]:
            return type("Result", (), {"returncode": 0, "stdout": "file.py\n", "stderr": ""})()
        return type("Result", (), {"returncode": 0, "stdout": "", "stderr": ""})()

    monkeypatch.setattr(module, "_run_shell_command", fake_run)
    monkeypatch.setattr(module, "_load_state", lambda target: {})
    monkeypatch.setattr(module, "_save_state", lambda state, target: None)

    result = module._git_commit_and_push(iteration=1, processed=["file.py"], updated_count=1, root=tmp_path)

    assert result["pushed"] is True
    assert result.get("pushed_main") is True
    assert any(cmd[0:3] == ["git", "push", "origin"] and cmd[3] == "HEAD:autosync" for cmd in commands)
    assert any(cmd[0:3] == ["git", "push", "origin"] and cmd[3] == "HEAD:main" for cmd in commands)


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


def test_emit_status_writes_activity_feed_for_target(tmp_path):
    module = load_module()

    module._emit_status("workflow sync message", level="info", root=tmp_path)

    feed_path = tmp_path / "OLLAMA_ACTIVITY_FEED.md"
    assert feed_path.exists()
    assert "workflow sync message" in feed_path.read_text(encoding="utf-8")


def test_workflows_run_the_real_agent_entrypoint_and_resume_artifacts():
    repo_root = Path(__file__).resolve().parents[1]
    workflow_files = [repo_root / ".github" / "workflows" / "ollamatrigger.yml",
                      repo_root / ".github" / "workflows" / "ollama-autonomous-agent.yml"]

    for workflow_path in workflow_files:
        content = workflow_path.read_text(encoding="utf-8")
        assert "python scripts/ollama_autonomous_agent.py" in content
        assert "Creating enhanced autonomous agent script" not in content
        assert "OLLAMA_COMPLETION_REPORT.md" in content
        assert "resumefromhere.txt" in content


def test_ensure_ollama_autonomous_agent_workflow_is_generated(tmp_path):
    module = load_module()
    module._ensure_ollama_autonomous_agent_workflow(tmp_path)
    workflow_file = tmp_path / ".github" / "workflows" / "ollama-autonomous-agent.yml"

    assert workflow_file.exists()
    content = workflow_file.read_text(encoding="utf-8")
    assert "name: Ollama autonomous agent" in content
    assert "python scripts/ollama_autonomous_agent.py" in content
    assert "OLLAMA_ACTIVITY_FEED.md" in content


def test_build_all_auto_doc_reports_missing_automations_and_sync_entries(tmp_path):
    module = load_module()
    # No workflows exist, but repo sync references are present.
    (tmp_path / "README.md").write_text("This repo sync automation uses upstream mirrors.", encoding="utf-8")

    path = module._build_all_auto_doc(tmp_path)
    contents = path.read_text(encoding="utf-8")

    assert path.exists()
    assert "No workflow automation files detected." in contents
    assert "repo sync" in contents.lower()
    assert "branch automation" in contents.lower()
    assert "[MISSING] .github/workflows directory" in contents


def test_scan_for_work_detects_missing_tests_and_minimal_implementations(tmp_path):
    module = load_module()
    scripts_dir = tmp_path / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)
    source = scripts_dir / "service.py"
    source.write_text("def placeholder():\n    pass\n", encoding="utf-8")

    pending = module.scan_for_work(tmp_path)

    assert any(item.startswith("MISSING_TESTS:") and "scripts/service.py" in item for item in pending)
    assert any(item.startswith("MINIMAL_IMPLEMENTATION:") and "scripts/service.py" in item for item in pending)


def test_process_pending_items_creates_test_stub_and_notes_merge_group(tmp_path):
    module = load_module()
    scripts_dir = tmp_path / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)
    source = scripts_dir / "tool.py"
    source.write_text("def run():\n    return 1\n", encoding="utf-8")
    first = tmp_path / "module.spec.ts"
    second = tmp_path / "module.ts"
    first.write_text("TODO: impl", encoding="utf-8")
    second.write_text("TODO: impl", encoding="utf-8")

    result = module.process_pending_items(["MISSING_TESTS:scripts/tool.py", "MERGE_REQUIRED:module"], tmp_path)
    assert any(item == "MISSING_TESTS:scripts/tool.py" for item in result.get("done", []))
    assert (tmp_path / "tests" / "test_tool.py").exists()
    assert "MERGE_REQUIRED:module" in result.get("done", [])
    assert "MERGE REQUIRED GROUP: module" in (tmp_path / "MERGE.md").read_text(encoding="utf-8")


def test_prioritize_pending_items_orders_merge_and_task_work_first():
    module = load_module()
    pending = [
        "file1.md",
        "MINIMAL_IMPLEMENTATION:scripts/foo.py",
        "MISSING_REQUIRED_FILE:API.md",
        "WORKFLOW_TOKEN_GAP:.github/workflows/ci.yml",
        "MERGE_REQUIRED:module",
        "TASK:REFRESH_ROUTE_API_MANIFESTS",
        "MISSING_TESTS:scripts/foo.py",
    ]

    prioritized = module._prioritize_pending_items(pending)

    assert prioritized.index("MISSING_REQUIRED_FILE:API.md") < prioritized.index(
        "WORKFLOW_TOKEN_GAP:.github/workflows/ci.yml")
    assert prioritized.index("WORKFLOW_TOKEN_GAP:.github/workflows/ci.yml") < prioritized.index("MERGE_REQUIRED:module")
    assert prioritized.index("MERGE_REQUIRED:module") < prioritized.index("TASK:REFRESH_ROUTE_API_MANIFESTS")
    assert prioritized.index("TASK:REFRESH_ROUTE_API_MANIFESTS") < prioritized.index("MISSING_TESTS:scripts/foo.py")
    assert prioritized.index(
        "MISSING_TESTS:scripts/foo.py") < prioritized.index("MINIMAL_IMPLEMENTATION:scripts/foo.py")
    assert prioritized[-1] == "file1.md"


def test_prioritize_resume_instructions_executes_merge_and_task_items_before_verification():
    module = load_module()
    instructions = [
        "python -m pytest",
        "MINIMAL_IMPLEMENTATION:scripts/foo.py",
        "TASK:REFRESH_ROUTE_API_MANIFESTS",
        "MERGE_REQUIRED:module",
        "MISSING_REQUIRED_FILE:API.md",
    ]

    prioritized = module._prioritize_resume_instructions(instructions)

    assert prioritized.index("MISSING_REQUIRED_FILE:API.md") < prioritized.index("MERGE_REQUIRED:module")
    assert prioritized.index("MERGE_REQUIRED:module") < prioritized.index("TASK:REFRESH_ROUTE_API_MANIFESTS")
    assert prioritized.index("TASK:REFRESH_ROUTE_API_MANIFESTS") < prioritized.index(
        "MINIMAL_IMPLEMENTATION:scripts/foo.py")
    assert prioritized[-1] == "python -m pytest"


def test_merge_workflow_yamls_removes_duplicate_workflows(tmp_path):
    module = load_module()
    workflow_dir = tmp_path / ".github" / "workflows"
    workflow_dir.mkdir(parents=True, exist_ok=True)
    first = workflow_dir / "build.yml"
    second = workflow_dir / "build.yaml"
    first.write_text(
        "name: Build\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo first\n",
        encoding="utf-8",
    )
    second.write_text(
        "name: Build\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo second\n      - run: echo extra\n",
        encoding="utf-8",
    )

    result = module._merge_workflow_yamls(tmp_path)

    assert result["merged"] == 1
    assert result["deleted"] == 1
    remaining = [p.name for p in workflow_dir.iterdir() if p.is_file()]
    assert len(remaining) == 1
    assert remaining[0] in {"build.yml", "build.yaml"}
    assert "diverged" not in result["report"][0].lower()


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


def test_update_hook_and_webhook_manifests_records_discord_integration(tmp_path):
    module = load_module()
    workflow_dir = tmp_path / ".github" / "workflows"
    workflow_dir.mkdir(parents=True, exist_ok=True)
    (workflow_dir / "ollamatrigger.yml").write_text(
        "name: Ollama trigger\nsteps:\n  - run: echo hi\n",
        encoding="utf-8",
    )

    result = module.update_hook_and_webhook_manifests(tmp_path)

    assert (tmp_path / "ALLHOOKSWEBHOOKS.md").exists()
    assert (tmp_path / "WEBHOOKS.md").exists()
    assert "Discord" in (tmp_path / "ALLHOOKSWEBHOOKS.md").read_text(encoding="utf-8")
    assert result["all_hooks"].exists()
    assert result["webhooks"].exists()


def test_collect_official_deployment_references_adds_known_sources(tmp_path):
    module = load_module()

    references = module.collect_official_deployment_references(tmp_path)

    assert references
    assert any(ref["platform"].lower() == "vercel" for ref in references)


def test_merge_unused_files_logs_deletions_in_merge_manifest(tmp_path):
    module = load_module()
    backup_path = tmp_path / "archive" / "legacy-backup.txt"
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    backup_path.write_text("legacy content that is no longer referenced\n", encoding="utf-8")

    result = module.merge_unused_files_and_update_manifest(tmp_path)

    assert not backup_path.exists()
    assert (tmp_path / "MERGE.md").exists()
    assert any(entry["path"].endswith("legacy-backup.txt") for entry in result)
    assert "## DELS" in (tmp_path / "MERGE.md").read_text(encoding="utf-8")


def test_collect_finance_and_credential_inventory_finds_provider_config(tmp_path):
    module = load_module()
    (tmp_path / "app" / "api").mkdir(parents=True, exist_ok=True)
    (tmp_path / "app" / "api" / "qi-trading.ts").write_text(
        "const BITGET_API_KEY = process.env.BITGET_API_KEY;\n"
        "const BITGET_API_SECRET = process.env.BITGET_API_SECRET;\n",
        encoding="utf-8",
    )
    (tmp_path / ".env.example").write_text(
        "PAYPAL_CLIENT_ID=\nPAYPAL_CLIENT_SECRET=\nPAYPAL_CLIENT_ID=\n",
        encoding="utf-8",
    )

    inventory = module.collect_finance_and_credential_inventory(tmp_path)

    assert any(item["provider"] == "Bitget" for item in inventory)
    assert any("BITGET_API_KEY" in item["env_vars"] for item in inventory)
    assert any(item["provider"] == "PayPal" for item in inventory)


def test_update_finance_and_credential_manifests_writes_secure_plan(tmp_path):
    module = load_module()
    (tmp_path / "app" / "api").mkdir(parents=True, exist_ok=True)
    (tmp_path / "app" / "api" / "wallet.ts").write_text(
        "const BINANCE_API_KEY = process.env.BINANCE_API_KEY;\n"
        "const BINANCE_SECRET_KEY = process.env.BINANCE_SECRET_KEY;\n",
        encoding="utf-8",
    )

    docs = module.update_finance_and_credential_manifests(tmp_path, require_master_auth=False)

    manifest_path = docs["manifest"]
    assert manifest_path.exists()
    text = manifest_path.read_text(encoding="utf-8")
    assert "Binance" in text
    assert "Secure provisioning" in text
    assert "BINANCE_API_KEY" in text


def test_replace_paypal_with_paypal_rewrites_validator_and_docs(tmp_path):
    module = load_module()
    validator_path = tmp_path / "scripts" / "validate_all_credentials.py"
    validator_path.parent.mkdir(parents=True, exist_ok=True)
    validator_path.write_text(
        "PAYPAL_CLIENT_ID=\nPAYPAL_CLIENT_SECRET=\n"
        "# PayPal config should be used instead of plaintext credentials\n",
        encoding="utf-8",
    )
    readme_path = tmp_path / "README.md"
    readme_path.write_text("This repo uses PayPal for payments.\n", encoding="utf-8")

    updated = module.replace_paypal_with_paypal(tmp_path)

    assert validator_path.exists()
    assert updated["files_updated"] >= 2
    validator_text = validator_path.read_text(encoding="utf-8")
    assert "PAYPAL_CLIENT_ID" in validator_text
    assert "PAYPAL_CLIENT_SECRET" in validator_text
    assert "PayPal config should be used instead of plaintext credentials" not in validator_text
    assert "PayPal configuration should be used instead of plaintext credentials" in validator_text
    readme_text = readme_path.read_text(encoding="utf-8")
    assert "PayPal" in readme_text
    assert "PayPal config" not in readme_text
    assert "PayPal" not in readme_text.replace("PayPal", "")


def test_validate_all_credentials_uses_paypal_env_vars(monkeypatch):
    validator_module = load_validator_module()
    monkeypatch.setenv("PAYPAL_CLIENT_ID", "PayPal-id")
    monkeypatch.setenv("PAYPAL_CLIENT_SECRET", "PayPal-secret")
    monkeypatch.setenv("PAYPAL_MODE", "sandbox")

    validator = validator_module.CredentialValidator()

    assert validator.paypal_config["client_id"] == "PayPal-id"
    assert validator.paypal_config["client_secret"] == "PayPal-secret"
    assert validator.paypal_config["mode"] == "sandbox"


def test_replace_paypal_with_paypal_renames_paypal_named_files(tmp_path):
    module = load_module()
    target_dir = tmp_path / "docs"
    target_dir.mkdir(parents=True, exist_ok=True)
    legacy_path = target_dir / "paypal-helper.txt"
    legacy_path.write_text("legacy", encoding="utf-8")

    result = module.replace_paypal_with_paypal(tmp_path)

    assert not legacy_path.exists()
    assert (target_dir / "PayPal-helper.txt").exists()
    assert result["files_updated"] >= 1


def test_collect_nonproduction_inventory_scans_all_directories(tmp_path):
    module = load_module()
    nested_dir = tmp_path / "nested" / "deep"
    nested_dir.mkdir(parents=True, exist_ok=True)
    (nested_dir / "legacy.ts").write_text("TODO: remove later\n", encoding="utf-8")

    inventory = module.collect_nonproduction_inventory(tmp_path)

    assert any(item["path"].endswith("legacy.ts") for item in inventory)


def test_ensure_test_coverage_creates_test_stubs_for_source_files(tmp_path):
    module = load_module()
    scripts_dir = tmp_path / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)
    (scripts_dir / "sample_tool.py").write_text("def run():\n    return 1\n", encoding="utf-8")
    (tmp_path / "tests").mkdir(parents=True, exist_ok=True)

    result = module.ensure_test_coverage(tmp_path)

    assert (tmp_path / "tests" / "test_sample_tool.py").exists()
    assert result["created"] >= 1


def test_consolidate_html_assets_and_pw_as_moves_pwa_and_removes_duplicates(tmp_path):
    module = load_module()
    app_dir = tmp_path / "apps" / "demo"
    app_dir.mkdir(parents=True, exist_ok=True)
    pwa_html = app_dir / "index.html"
    pwa_html.write_text(
        "<!doctype html><html><head><link rel='manifest' href='manifest.webmanifest' /></head></html>", encoding="utf-8")
    duplicate_html = tmp_path / "duplicate.html"
    duplicate_html.write_text(pwa_html.read_text(encoding="utf-8"), encoding="utf-8")
    unused_html = tmp_path / "unused.html"
    unused_html.write_text("<html><body>unused</body></html>", encoding="utf-8")

    result = module.consolidate_html_assets_and_pw_as(tmp_path)

    canonical = tmp_path / "pwa_apps" / "demo" / "index.html"
    assert canonical.exists()
    assert not duplicate_html.exists()
    assert not unused_html.exists()
    assert (tmp_path / "pwa_apps" / "demo" / "manifest.webmanifest").exists()
    assert (tmp_path / "pwa_apps" / "demo" / "sw.js").exists()
    assert result["moved"] >= 1
    assert result["removed"] >= 1


def test_detect_unused_files_and_directories_identifies_obsolete_assets(tmp_path):
    module = load_module()
    (tmp_path / "project" / "src").mkdir(parents=True, exist_ok=True)
    (tmp_path / "project" / "src" / "main.py").write_text("print('active')", encoding="utf-8")
    (tmp_path / "project" / "old" / "legacy.py.bak").mkdir(parents=True, exist_ok=True)
    (tmp_path / "project" / "old" / "legacy.py.bak" / "file.py").write_text("# old", encoding="utf-8")
    empty_dir = tmp_path / "project" / "empty"
    empty_dir.mkdir(parents=True, exist_ok=True)

    result = module._detect_unused_files_and_directories(tmp_path)

    assert len(result["unused_files"]) > 0 or len(result["empty_directories"]) > 0
    assert isinstance(result["unused_files"], list)
    assert isinstance(result["empty_directories"], list)


def test_perform_full_app_consolidation_updates_app_specific_docs(tmp_path):
    module = load_module()
    qmoi_dir = tmp_path / "qmoi-ai"
    qmoi_dir.mkdir(parents=True, exist_ok=True)
    (qmoi_dir / "index.tsx").write_text("export default App;", encoding="utf-8")
    (qmoi_dir / "styles.css").write_text("body { color: blue; }", encoding="utf-8")

    result = module._perform_full_app_consolidation(tmp_path)

    assert (tmp_path / "QMOIAI.md").exists()
    assert (tmp_path / "QMOIAIUI.md").exists()
    qmoiai_text = (tmp_path / "QMOIAI.md").read_text(encoding="utf-8")
    assert "qmoi-ai" in qmoiai_text or "QMOIAI" in qmoiai_text


def test_perform_full_app_consolidation_refreshes_universals_and_styles(tmp_path):
    module = load_module()
    app_dir = tmp_path / "apps" / "qmoi-ai"
    app_dir.mkdir(parents=True, exist_ok=True)
    (app_dir / "app.tsx").write_text("export App", encoding="utf-8")
    (app_dir / "theme.css").write_text(".primary { color: blue; }", encoding="utf-8")

    result = module._perform_full_app_consolidation(tmp_path)

    assert (tmp_path / "UNIVERSALS.md").exists()
    assert (tmp_path / "STYLES.md").exists()
    universals_text = (tmp_path / "UNIVERSALS.md").read_text(encoding="utf-8")
    styles_text = (tmp_path / "STYLES.md").read_text(encoding="utf-8")
    assert "UNIVERSALS" in universals_text
    assert "STYLES" in styles_text


def test_refresh_app_docs_for_consolidated_app_creates_app_inventory(tmp_path):
    module = load_module()
    app_dir = tmp_path / "qmoi-space"
    app_dir.mkdir(parents=True, exist_ok=True)
    (app_dir / "components" / "view.tsx").parent.mkdir(parents=True, exist_ok=True)
    (app_dir / "components" / "view.tsx").write_text("export View", encoding="utf-8")
    (app_dir / "styles" / "layout.css").parent.mkdir(parents=True, exist_ok=True)
    (app_dir / "styles" / "layout.css").write_text(".layout { }", encoding="utf-8")

    module._refresh_app_docs_for_consolidated_app(tmp_path, "qmoi-space", app_dir)

    assert (tmp_path / "QMOISPACE.md").exists()
    assert (tmp_path / "QMOISPACEUI.md").exists()
    space_text = (tmp_path / "QMOISPACE.md").read_text(encoding="utf-8")
    space_ui_text = (tmp_path / "QMOISPACEUI.md").read_text(encoding="utf-8")
    assert "qmoi-space" in space_text or "view.tsx" in space_text
    assert "UI" in space_ui_text or "layout.css" in space_ui_text


def test_build_plan_and_docs_includes_allports(tmp_path):
    module = load_module()

    result = module.build_plan_and_docs(tmp_path)

    assert "all_ports" in result
    assert result["all_ports"].exists()
    assert (tmp_path / "ALLPORTS.md").exists()


# AUTOFIXED by Ollama at 2026-07-26T18:54:41.380965Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:34.420989Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:06.638624Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:17.640896Z
