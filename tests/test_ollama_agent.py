import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "ollama_autonomous_agent.py"

spec = importlib.util.spec_from_file_location("ollama_autonomous_agent", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def test_format_log_message_includes_timestamp_and_level():
    message = module.format_log_message("INFO", "agent started")
    assert "INFO" in message
    assert "agent started" in message
    assert "T" in message


def test_build_ollama_prompt_mentions_full_structure_inventory():
    full_structure_path = ROOT / "TREE_FULL_STRUCTURE.md"
    assert full_structure_path.exists()

    prompt = module.build_ollama_prompt(["inventory docs", "merge routes"])
    assert "TREE_FULL_STRUCTURE.md" in prompt
    assert "full repository structure" in prompt.lower()


def test_collect_preflight_checks_reports_known_files():
    present, missing = module.collect_preflight_checks()
    assert "TREE_FULL_STRUCTURE.md" in present
    assert isinstance(missing, list)


def test_build_merge_plan_summary_mentions_canonical_docs():
    summary = module.build_merge_plan_summary()
    assert "API.md" in summary
    assert "ROUTES.md" in summary
    assert "TREE_FULL_STRUCTURE.md" in summary


def test_build_execution_plan_mentions_canonical_docs_and_scripts():
    plan = module.build_execution_plan(["inventory docs", "merge routes"])
    assert "API.md" in plan
    assert "ROUTES.md" in plan
    assert "scripts/consolidate_api_endpoints.py" in plan
    assert "scripts/merge_executor.py" in plan
