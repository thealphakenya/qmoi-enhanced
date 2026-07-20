import importlib.util
from pathlib import Path


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


def test_write_live_notification_summary_creates_feed(tmp_path):
    module = load_module()

    path = module.write_live_notification_summary(tmp_path, "hello from ollama", branch="branch/test")

    assert path.exists()
    assert "hello from ollama" in path.read_text(encoding="utf-8")
    assert "Ollama activity feed" in path.read_text(encoding="utf-8")
