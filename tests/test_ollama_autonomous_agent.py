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


def test_build_plan_and_docs_creates_extended_docs_inventory(tmp_path):
    module = load_module()
    module.build_plan_and_docs(tmp_path)

    for filename in ["ALLAUTO.md", "ALLMDFILES.md", "FINANCIALMANAGER.md", "STANDARD1.md", "ALLLINKS.md", "QMOI_MEMORY_AWARENESS_SYSTEM.md"]:
        assert (tmp_path / filename).exists()


def test_build_plan_and_docs_creates_memory_awareness_doc(tmp_path):
    module = load_module()
    result = module.build_plan_and_docs(tmp_path)

    assert (tmp_path / "QMOI_MEMORY_AWARENESS_SYSTEM.md").exists()
    assert "Autonomous execution surface" in (tmp_path / "QMOI_MEMORY_AWARENESS_SYSTEM.md").read_text(encoding="utf-8")
    assert result["memory_awareness"].exists()


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
        "PAYPAL_CLIENT_ID=\nPAYPAL_CLIENT_SECRET=\nPESAPAL_CONSUMER_KEY=\n",
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


def test_replace_pesapal_with_paypal_rewrites_validator_and_docs(tmp_path):
    module = load_module()
    validator_path = tmp_path / "scripts" / "validate_all_credentials.py"
    validator_path.parent.mkdir(parents=True, exist_ok=True)
    validator_path.write_text(
        "PESAPAL_CONSUMER_KEY=\nPESAPAL_CONSUMER_SECRET=\n"
        "# Pesapal credentials should be replaced by PayPal config\n",
        encoding="utf-8",
    )
    readme_path = tmp_path / "README.md"
    readme_path.write_text("This repo uses Pesapal for payments.\n", encoding="utf-8")

    updated = module.replace_pesapal_with_paypal(tmp_path)

    assert validator_path.exists()
    assert updated["files_updated"] >= 2
    validator_text = validator_path.read_text(encoding="utf-8")
    assert "PAYPAL_CLIENT_ID" in validator_text
    assert "PAYPAL_CLIENT_SECRET" in validator_text
    assert "PESAPAL_CONSUMER_KEY" not in validator_text
    assert "Pesapal credentials" not in validator_text
    readme_text = readme_path.read_text(encoding="utf-8")
    assert "PayPal" in readme_text
    assert "Pesapal" not in readme_text


def test_validate_all_credentials_uses_paypal_env_vars(monkeypatch):
    validator_module = load_validator_module()
    monkeypatch.setenv("PAYPAL_CLIENT_ID", "paypal-id")
    monkeypatch.setenv("PAYPAL_CLIENT_SECRET", "paypal-secret")
    monkeypatch.setenv("PAYPAL_MODE", "sandbox")

    validator = validator_module.CredentialValidator()

    assert validator.paypal_config["client_id"] == "paypal-id"
    assert validator.paypal_config["client_secret"] == "paypal-secret"
    assert validator.paypal_config["mode"] == "sandbox"


def test_replace_pesapal_with_paypal_renames_paypal_named_files(tmp_path):
    module = load_module()
    target_dir = tmp_path / "docs"
    target_dir.mkdir(parents=True, exist_ok=True)
    legacy_path = target_dir / "paypal-helper.txt"
    legacy_path.write_text("legacy", encoding="utf-8")

    result = module.replace_pesapal_with_paypal(tmp_path)

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

# AUTOFIXED by Ollama at 2026-07-26T18:54:41.380965Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:34.420989Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:06.638624Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:17.640896Z
