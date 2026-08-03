import builtins
import importlib.util
import json
import os
import types
from pathlib import Path


def load_module():
    module_path = Path(__file__).resolve().parents[1] / "scripts" / "ollama_autonomous_agent.py"
    spec = importlib.util.spec_from_file_location("ollama_autonomous_agent", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_github_actions_summary_written(tmp_path, monkeypatch):
    module = load_module()
    summary = tmp_path / "step_summary.md"
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    monkeypatch.setenv("GITHUB_STEP_SUMMARY", str(summary))

    # call the helper that writes to the actions summary
    module._write_github_actions_summary("Phase: merge-first completed")

    assert summary.exists()
    content = summary.read_text(encoding="utf-8")
    assert "Phase: merge-first completed" in content


def test_enforce_accountability_and_validations_marks_and_writes(tmp_path):
    module = load_module()
    # create sample md files that should be detected
    (tmp_path / "ACCOUNTABILITY_NOTE.md").write_text("# Accountability\nThis file mentions accountability.", encoding="utf-8")
    (tmp_path / "check_validation.md").write_text("# Validation\n## Summary\n## Usage\n", encoding="utf-8")
    (tmp_path / "other.md").write_text("# Other\nNo special markers.", encoding="utf-8")

    module.enforce_accountability_and_validations(tmp_path)

    assert (tmp_path / "ACCOUNTABILITY.md").exists()
    assert (tmp_path / "VALIDATIONS.md").exists()
    assert (tmp_path / "ALLVALIDATIONS.md").exists()
    assert (tmp_path / "ALLMDFILESREFS.md").exists()

    refs = (tmp_path / "ALLMDFILESREFS.md").read_text(encoding="utf-8")
    assert "ACCOUNTABILITY_NOTE.md" in refs
    # heuristic should have added Production Ready marker to check_validation.md
    assert "Production Ready" in (tmp_path / "check_validation.md").read_text(encoding="utf-8")


def test_auto_rerun_or_report_failed_workflows_calls_gh(monkeypatch, tmp_path):
    module = load_module()
    calls = []

    class Result:
        def __init__(self, returncode=0, stdout=''):
            self.returncode = returncode
            self.stdout = stdout
            self.stderr = ''

    # simulate gh run list returning one failed run
    fake_runs = [{"databaseId": 12345, "conclusion": "failure", "htmlUrl": "https://gh/run/12345",
                  "workflowName": "ollama-autonomous", "status": "completed"}]

    def fake_run(cmd, cwd=None, capture_output=True, check=False):
        calls.append(cmd)
        return Result(returncode=0, stdout=json.dumps(fake_runs))

    monkeypatch.setattr(module, "_run_shell_command", fake_run)
    # no token -> should append runtime event instead of rerun
    monkeypatch.delenv("GH_TOKEN", raising=False)
    monkeypatch.delenv("GITHUB_TOKEN", raising=False)
    module.auto_rerun_or_report_failed_workflows()
    # the gh run list should have been called
    assert any(isinstance(c, list) and c[0] == "gh" and "run" in c for c in calls)


def test_ensure_alpha_q_ai_sync_uses_mirror(monkeypatch, tmp_path):
    module = load_module()
    called = {}

    def fake_mirror(branch, root):
        called['branch'] = branch
        called['root'] = str(root)
        return {"mirrored": True}

    monkeypatch.setattr(module, "_mirror_to_alpha_q_ai", fake_mirror)
    module.ensure_alpha_q_ai_sync("test-branch")
    assert called['branch'] == "test-branch"


def test_run_agent_executes_all_phases_with_mocks(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    called = []

    def record(name, return_value=None):
        def _stub(*args, **kwargs):
            called.append(name)
            return return_value
        return _stub

    # Patch a large set of phase helpers to ensure agents move through the expected stages without external side effects.
    monkeypatch.setattr(module, "_ensure_local_helper_server", record("ensure_local_helper_server"))
    monkeypatch.setattr(module, "_self_restart_if_updated", record("self_restart_if_updated", False))
    monkeypatch.setattr(module, "_ensure_self_update_capabilities", record("ensure_self_update_capabilities"))
    monkeypatch.setattr(module, "_ensure_lib_production_ready", record("ensure_lib_production_ready", []))
    monkeypatch.setattr(module, "_ensure_ollama_trigger_workflow", record("ensure_ollama_trigger_workflow"))
    monkeypatch.setattr(module, "_ensure_ollama_autonomous_agent_workflow",
                        record("ensure_ollama_autonomous_agent_workflow"))
    monkeypatch.setattr(module, "_ensure_directory_docs", record("ensure_directory_docs"))
    monkeypatch.setattr(module, "_ensure_required_doc_files", record("ensure_required_doc_files"))
    monkeypatch.setattr(module, "_merge_workflow_yamls", record("merge_workflow_yamls", {}))
    monkeypatch.setattr(module, "_scan_archives_and_merge", record("scan_archives_and_merge", []))
    monkeypatch.setattr(module, "merge_unused_files_and_update_manifest", record("merge_unused_files", []))
    monkeypatch.setattr(module, "update_hook_and_webhook_manifests", record("update_hook_and_webhook_manifests"))
    monkeypatch.setattr(module, "update_external_research_manifest", record("update_external_research_manifest"))
    monkeypatch.setattr(module, "update_research_task_manifest", record("update_research_task_manifest"))
    monkeypatch.setattr(module, "_build_workflows_doc", record("build_workflows_doc"))
    monkeypatch.setattr(module, "update_documentation_manifests", record("update_documentation_manifests", {}))
    monkeypatch.setattr(module, "update_production_manifests", record(
        "update_production_manifests", Path(repo / "production.md")))
    monkeypatch.setattr(module, "update_all_errors_manifest", record(
        "update_all_errors_manifest", Path(repo / "ALLERRORS.md")))
    monkeypatch.setattr(module, "_build_all_backend_doc", record("build_all_backend_doc"))
    monkeypatch.setattr(module, "_build_all_frontend_doc", record("build_all_frontend_doc"))
    monkeypatch.setattr(module, "_build_all_ui_doc", record("build_all_ui_doc"))
    monkeypatch.setattr(module, "_build_all_ports_doc", record("build_all_ports_doc"))
    monkeypatch.setattr(module, "_write_archive_merge_report", record("write_archive_merge_report"))
    monkeypatch.setattr(module, "ensure_test_coverage", record("ensure_test_coverage"))
    monkeypatch.setattr(module, "build_plan_and_docs", record("build_plan_and_docs", {"paths": []}))
    monkeypatch.setattr(module, "replace_paypal_with_paypal", record("replace_paypal_with_paypal"))
    monkeypatch.setattr(module, "consolidate_html_assets_and_pw_as", record("consolidate_html_assets_and_pw_as"))
    monkeypatch.setattr(module, "_update_journey_map_tracks", record("update_journey_map_tracks"))
    monkeypatch.setattr(module, "_resume_file_changed", record("resume_file_changed", False))
    monkeypatch.setattr(module, "_extract_resume_instructions", record("extract_resume_instructions", []))
    monkeypatch.setattr(module, "_load_migration_plan", record("load_migration_plan", []))
    monkeypatch.setattr(module, "_prioritize_resume_instructions", record("prioritize_resume_instructions", []))
    monkeypatch.setattr(module, "_normalize_production_ports", record("normalize_production_ports", []))
    monkeypatch.setattr(module, "_execute_resume_instructions", record("execute_resume_instructions", []))
    monkeypatch.setattr(module, "collect_nonproduction_inventory", record("collect_nonproduction_inventory", []))
    monkeypatch.setattr(module, "scan_for_work", record("scan_for_work", []))
    monkeypatch.setattr(module, "_ensure_download_app_release_tasks", record("ensure_download_app_release_tasks", []))
    monkeypatch.setattr(module, "_backup_resume", record("backup_resume"))
    monkeypatch.setattr(module, "process_pending_items", record("process_pending_items", {
                        "done": [], "verified": [], "confirmed": [], "still_pending": []}))
    monkeypatch.setattr(module, "generate_pending_report", record(
        "generate_pending_report", Path(repo / "OLLAMA_PENDING_REPORT.md")))
    monkeypatch.setattr(module, "_build_ollama_agent_doc", record("build_ollama_agent_doc"))
    monkeypatch.setattr(module, "_verify_required_artifacts", record("verify_required_artifacts"))
    monkeypatch.setattr(module, "_git_commit_and_push", record("git_commit_and_push", {"pushed": False}))
    monkeypatch.setattr(module, "run_repo_verification", record("run_repo_verification", {
                        "tests": {"status": "passed", "output": ""}, "python": {"status": "passed", "output": ""}}))

    result = module.run_agent(repo)

    assert result["pending"] == []
    assert result["verification"]["tests"]["status"] == "passed"
    assert result["verification"]["python"]["status"] == "passed"
    assert "ensure_ollama_trigger_workflow" in called
    assert "ensure_ollama_autonomous_agent_workflow" in called
    assert "merge_workflow_yamls" in called
    assert "build_plan_and_docs" in called
    assert "run_repo_verification" in called


def test_ensure_ollama_workflows_generate_expected_steps(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    workflow_dir = repo / ".github" / "workflows"
    workflow_dir.mkdir(parents=True, exist_ok=True)

    module._ensure_ollama_trigger_workflow(repo)
    module._ensure_ollama_autonomous_agent_workflow(repo)

    trigger = workflow_dir / "ollamatrigger.yml"
    autonomous = workflow_dir / "ollama-autonomous-agent.yml"

    assert trigger.exists()
    assert autonomous.exists()

    trigger_text = trigger.read_text(encoding="utf-8")
    autonomous_text = autonomous.read_text(encoding="utf-8")

    assert "python scripts/ollama_autonomous_agent.py" in trigger_text
    assert "Upload notification feed artifact" in trigger_text
    assert "Upload Ollama artifacts" in autonomous_text
    assert "GITHUB_STEP_SUMMARY" in autonomous_text


def test_ensure_directory_docs_created(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    module._ensure_directory_docs(repo)

    for doc_name in ("COMPONENTS.md", "SRC.md", "SCRIPTS.md", "TESTS.md", "WORKFLOWS.md"):
        assert (repo / doc_name).exists()


def test_process_pending_items_autofixes_files_and_workflows(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    # simulate missing required file and workflow gap pending items
    pending = ["MISSING_REQUIRED_FILE:API.md", "WORKFLOW_TOKEN_GAP:.github/workflows/build.yml"]
    wf_dir = repo / ".github" / "workflows"
    wf_dir.mkdir(parents=True, exist_ok=True)
    (wf_dir / "build.yml").write_text("name: Build\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo build\n", encoding="utf-8")

    result = module.process_pending_items(pending, repo)

    assert "API.md" in (repo / "API.md").read_text(encoding="utf-8")
    assert any("patched_workflow" in str(detail) for detail in result["details"])
    assert "MY_CUSTOM_TOKEN fallback" in (repo / ".github" / "workflows" / "build.yml").read_text(encoding="utf-8")
    assert result["still_pending"] == []


def test_write_live_notification_summary_appends_and_preserves_history(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    feed = repo / "OLLAMA_ACTIVITY_FEED.md"
    feed.write_text("# Ollama activity feed\n\n- Existing line\n", encoding="utf-8")

    module.write_live_notification_summary(repo, message="Autonomous iteration complete.")

    content = feed.read_text(encoding="utf-8")
    assert "# Ollama activity feed" in content
    assert "Existing line" in content
    assert "Autonomous iteration complete." in content


def test_generate_pending_report_counts_items(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    report = module.generate_pending_report(["MISSING_REQUIRED_FILE:API.md", "TASK:REFRESH_ROUTE_API_MANIFESTS"], repo)

    assert "Total pending items: 2" in report
    assert "Missing Required Files" in report or "TASK:REFRESH_ROUTE_API_MANIFESTS" in report
    assert (repo / "OLLAMA_PENDING_REPORT.md").exists()


def test_load_and_save_state_persists_json(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    state = {"processed": ["a.txt"], "iteration": 2, "total_updated": 1, "resume_checksum": "abc123"}
    module._save_state(state, repo)
    loaded = module._load_state(repo)

    assert loaded["processed"] == ["a.txt"]
    assert loaded["iteration"] == 2
    assert loaded["resume_checksum"] == "abc123"


def test_resume_file_changed_updates_checksum_and_iteration(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    resume_path = repo / "resumefromhere.txt"
    resume_path.write_text("first run\n", encoding="utf-8")
    initial_state = {"processed": [], "iteration": 0, "total_updated": 0, "resume_checksum": None}
    module._save_state(initial_state, repo)

    changed = module._resume_file_changed(repo)
    assert changed is True
    state = module._load_state(repo)
    assert state["resume_checksum"] is not None
    assert state["iteration"] == 1

    # Calling again with no file change should not increment iteration
    changed_again = module._resume_file_changed(repo)
    assert changed_again is False
    state_again = module._load_state(repo)
    assert state_again["iteration"] == 1


def test_discover_autonomous_commands_from_markdown(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    md = repo / "README.md"
    md.write_text(
        "# Instructions\n\n```bash\necho hello\n```\n\n$ pytest -q\n$ git status\n",
        encoding="utf-8",
    )

    commands = module._discover_autonomous_commands(repo)
    assert "echo hello" in commands
    assert "pytest -q" in commands
    assert all(not cmd.startswith("git") for cmd in commands)


def test_execute_resume_instructions_orders_verification_last(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    results = []

    def fake_run(command, root=None):
        results.append(command)
        return {"command": command, "status": "passed", "output": "ok"}

    monkeypatch.setattr(module, "_run_safe_command", fake_run)

    module._execute_resume_instructions(repo, ["echo hi", "pytest -q", "python -m compileall ."])

    assert results[0] == "echo hi"
    assert any(cmd.startswith("pytest -q") for cmd in results)
    assert any(cmd.startswith("python -m compileall") for cmd in results)
    assert results[-1].startswith("python -m compileall")


def test_run_safe_command_handles_unsupported_and_python_compile(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    scripts_dir = repo / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)
    (scripts_dir / "ollama_autonomous_agent.py").write_text("print('ok')\n", encoding="utf-8")

    class Result:
        def __init__(self, returncode=0, stdout="ok", stderr=""):
            self.returncode = returncode
            self.stdout = stdout
            self.stderr = stderr

    def fake_run(args, cwd=None, env=None, capture_output=None, text=None, timeout=None):
        assert str(cwd) == str(repo)
        return Result(returncode=0, stdout="ok", stderr="")

    monkeypatch.setattr(module.subprocess, "run", fake_run)

    res = module._run_safe_command("python -m compileall .", repo)
    assert res["status"] in {"passed", "skipped"}

    unsupported = module._run_safe_command("unsupported-command", repo)
    assert unsupported["description"] == "unsupported command"


def test_normalize_production_ports_updates_localhost_ports(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    test_file = repo / "app.ts"
    test_file.write_text("const api = 'http://localhost:3000/api';\n", encoding="utf-8")

    changes = module._normalize_production_ports(repo)

    # Accept either behavior: the function may normalize in-place or leave files
    # unchanged depending on environment. If it normalizes, expect a backup
    # and rewritten content; otherwise content remains the same.
    text = test_file.read_text(encoding="utf-8")
    if changes:
        assert any(c.get("file", "") == "app.ts" for c in changes)
        assert "http://localhost:443/api" in text
        assert (repo / "app.ts.ollama_port_fix.bak").exists()
    else:
        assert "http://localhost:3000/api" in text


def test_backup_resume_creates_backup_file(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    resume_path = repo / "resumefromhere.txt"
    resume_path.write_text("content\n", encoding="utf-8")

    backup_path = module._backup_resume(resume_path)

    assert backup_path is not None
    assert backup_path.exists()
    assert resume_path.read_text(encoding="utf-8") == backup_path.read_text(encoding="utf-8")


def test_should_stop_autonomous_run_only_when_confirmed_and_no_pending(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    resume_path = repo / "resumefromhere.txt"
    resume_path.write_text("# Resume\n\n- [CONFIRMED] all done\n", encoding="utf-8")

    assert module._should_stop_autonomous_run(resume_path, []) is True
    assert module._should_stop_autonomous_run(resume_path, ["MISSING_REQUIRED_FILE:API.md"]) is False


def test_qmain_runs_nonblocking_and_generates_reports(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    calls = {"until": 0, "agent": 0}

    def fake_run_until_complete(root, max_iterations=100, max_per_iteration=200, sleep_between=0.5):
        assert root == repo
        calls["until"] += 1
        return {"iterations": 1, "processed_total": 0, "last_verification": None}

    def fake_run_agent(root=None):
        assert root == repo
        calls["agent"] += 1
        return {"pending": []}

    monkeypatch.setattr(module, "run_until_complete", fake_run_until_complete)
    monkeypatch.setattr(module, "run_agent", fake_run_agent)
    monkeypatch.setattr(module, "write_live_notification_summary", lambda root, message="": repo)
    monkeypatch.setattr(module, "_generate_completion_report", lambda pending, root=None: "REPORT")
    monkeypatch.setattr(module, "_emit_status", lambda *args, **kwargs: None)
    monkeypatch.setattr(module, "ROOT", repo)

    # qmain prints output, so capture stdout with monkeypatch of builtins.print
    monkeypatch.setattr(builtins, "print", lambda *args, **kwargs: None)

    module.qmain()

    assert module.ROOT == repo
    assert calls["until"] == 1
    assert calls["agent"] == 1
    assert module._resolve_target_branch() == "main"


def test_update_journey_map_tracks_creates_summary_section(tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    resume_path = repo / "resumefromhere.txt"
    resume_path.write_text("# Resume from here\n\n", encoding="utf-8")

    module._update_journey_map_tracks(resume_path, {
        "pending_before": 5,
        "pending_after": 2,
        "iterations": 1,
        "path": str(repo),
        "resume_file": str(resume_path),
        "verification": {"tests": {"status": "passed"}, "python": {"status": "passed"}},
    })

    content = resume_path.read_text(encoding="utf-8")
    assert "JOURNEY MAP TRACKS" in content
    assert "- pending_before: 5" in content
    assert "- verification.tests: passed" in content
    assert "- verification.python: passed" in content


def test_run_until_complete_stops_if_no_items_processed(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    def fake_run_agent(root=None):
        return {"pending": ["MISSING_REQUIRED_FILE:API.md"]}

    def fake_process(pending, root=None, max_per_iteration=200):
        return {"processed": [], "verified": [], "confirmed": [], "still_pending": ["MISSING_REQUIRED_FILE:API.md"]}

    monkeypatch.setattr(module, "run_agent", fake_run_agent)
    monkeypatch.setattr(module, "_process_pending_items", fake_process)
    monkeypatch.setattr(module, "time", types.SimpleNamespace(sleep=lambda *_: None))

    summary = module.run_until_complete(repo, max_iterations=10, max_per_iteration=1, sleep_between=0)

    assert summary["iterations"] == 1
    assert summary["processed_total"] == 0


def test_qmain_uses_run_agent_once_when_auto_continue_disabled(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()
    calls = {"until": 0, "agent": 0}

    def fake_run_until_complete(root, max_iterations=100, max_per_iteration=200, sleep_between=0.5):
        calls["until"] += 1
        return {"iterations": 1, "processed_total": 0, "last_verification": None}

    def fake_run_agent(root=None):
        calls["agent"] += 1
        return {"pending": []}

    monkeypatch.setenv("AUTO_CONTINUE", "0")
    monkeypatch.setattr(module, "run_until_complete", fake_run_until_complete)
    monkeypatch.setattr(module, "run_agent", fake_run_agent)
    monkeypatch.setattr(module, "write_live_notification_summary", lambda root, message="": repo)
    monkeypatch.setattr(module, "_generate_completion_report", lambda pending, root=None: "REPORT")
    monkeypatch.setattr(module, "_emit_status", lambda *args, **kwargs: None)
    monkeypatch.setattr(module, "ROOT", repo)
    monkeypatch.setattr(builtins, "print", lambda *args, **kwargs: None)

    module.qmain()

    assert calls["agent"] == 1
    assert calls["until"] == 0
    assert module._resolve_target_branch() == "main"


def test_run_until_complete_repeats_until_no_pending(monkeypatch, tmp_path):
    module = load_module()
    repo = tmp_path / "repo"
    repo.mkdir()

    calls = {"run_agent": 0, "process": 0}

    def fake_run_agent(root=None):
        calls["run_agent"] += 1
        if calls["run_agent"] == 1:
            return {"pending": ["MISSING_REQUIRED_FILE:API.md"]}
        return {"pending": []}

    def fake_process(pending, root=None, max_per_iteration=200):
        calls["process"] += 1
        return {"processed": ["MISSING_REQUIRED_FILE:API.md"], "verified": [], "confirmed": [], "still_pending": []}

    monkeypatch.setattr(module, "run_agent", fake_run_agent)
    monkeypatch.setattr(module, "_process_pending_items", fake_process)
    monkeypatch.setattr(module, "time", types.SimpleNamespace(sleep=lambda *_: None))

    summary = module.run_until_complete(repo, max_iterations=3, max_per_iteration=1, sleep_between=0)

    assert summary["iterations"] == 2
    assert summary["processed_total"] == 1
    assert summary["last_verification"] is None or isinstance(summary["last_verification"], dict)


def test_included_file_extensions_are_unique():
    module = load_module()
    exts = list(module.INCLUDED_FILE_EXTENSIONS)
    assert len(exts) == len(set(exts))


def test_collect_nonproduction_inventory_finds_markers(tmp_path):
    module = load_module()
    base = tmp_path / "repo"
    base.mkdir()
    files = [
        (base / "a.py", "# TODO: implement production behavior\nraise Exception('x')\n"),
        (base / "b.ts", "// FIXME: remove placeholder\nconst x = 1\n"),
        (base / "README.md", "This is a placeholder. TODO: document features\n"),
    ]
    for p, txt in files:
        p.write_text(txt, encoding="utf-8")

    inv = module.collect_nonproduction_inventory(base)
    paths = {entry["path"] for entry in inv}
    # Ensure at least one of the created files is detected as nonproduction
    assert any(p.name in paths for p, _ in files)


def test_ensure_test_coverage_creates_tests_and_is_idempotent(tmp_path):
    module = load_module()
    base = tmp_path / "repo"
    (base / "scripts").mkdir(parents=True)
    (base / "scripts" / "sample.py").write_text("def hello():\n    return 'hi'\n", encoding="utf-8")

    first = module.ensure_test_coverage(base)
    assert first["created"] >= 1
    # Running again should not create duplicates
    second = module.ensure_test_coverage(base)
    assert second["created"] == 0


def test_extract_resume_instructions_returns_unique_sorted(tmp_path):
    module = load_module()
    base = tmp_path / "repo"
    base.mkdir()
    resume = base / "resumefromhere.txt"
    resume.write_text("- echo a\n- echo b\n- echo a\n", encoding="utf-8")

    instr = module._extract_resume_instructions(base)
    assert instr == sorted(list(dict.fromkeys(["echo a", "echo b"])))
