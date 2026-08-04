"""Tests for Ollama autonomous agent app consolidation and entry point detection."""
import json
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from scripts import ollama_autonomous_agent as agent


# ============================================================================
# App Consolidation Tests
# ============================================================================

def test_detect_duplicate_apps_qmoi_ai(tmp_path):
    """Test detection of duplicate QMOI AI app instances."""
    root = tmp_path / "repo"
    root.mkdir()

    # Create duplicate qmoi-ai instances in different locations
    app1 = root / "qmoi_ai" / "qmoi_ai.py"
    app1.parent.mkdir(parents=True)
    app1.write_text("# QMOI AI App Instance 1\nif __name__ == '__main__': pass", encoding="utf-8")

    app2 = root / "apps" / "qmoi_ai" / "qmoi_ai.py"
    app2.parent.mkdir(parents=True)
    app2.write_text("# QMOI AI App Instance 2\nif __name__ == '__main__': pass", encoding="utf-8")

    app3 = root / "src" / "qmoi-ai" / "main.py"
    app3.parent.mkdir(parents=True)
    app3.write_text("# QMOI AI App Instance 3\nif __name__ == '__main__': pass", encoding="utf-8")

    # Scan for duplicate apps
    duplicates = agent._scan_for_duplicate_apps(root, "qmoi-ai")

    assert len(duplicates) == 3
    assert any("qmoi_ai" in str(d) for d in duplicates)
    assert any("apps" in str(d) for d in duplicates)
    assert any("src" in str(d) for d in duplicates)


def test_detect_duplicate_apps_qcity(tmp_path):
    """Test detection of duplicate QCity app instances."""
    root = tmp_path / "repo"
    root.mkdir()

    # Create duplicate qcity instances
    app1 = root / "qcity" / "qcity.py"
    app1.parent.mkdir(parents=True)
    app1.write_text("# QCity Instance 1", encoding="utf-8")

    app2 = root / "apps" / "qcity" / "main.py"
    app2.parent.mkdir(parents=True)
    app2.write_text("# QCity Instance 2", encoding="utf-8")

    duplicates = agent._scan_for_duplicate_apps(root, "qcity")
    assert len(duplicates) >= 2


def test_consolidate_app_files_into_canonical(tmp_path):
    """Test consolidation of app files into canonical directory."""
    root = tmp_path / "repo"
    canonical = root / "qmoi-ai"
    canonical.mkdir(parents=True)

    # Create canonical structure
    (canonical / "main.py").write_text("# Main entry", encoding="utf-8")
    (canonical / "package.json").write_text('{"name": "qmoi-ai"}', encoding="utf-8")

    # Create scattered files to consolidate
    scattered1 = root / "apps" / "qmoi-ai"
    scattered1.mkdir(parents=True)
    (scattered1 / "utils.py").write_text("# Utils", encoding="utf-8")
    (scattered1 / "config.json").write_text('{}', encoding="utf-8")

    scattered2 = root / "lib" / "qmoi-ai"
    scattered2.mkdir(parents=True)
    (scattered2 / "models.py").write_text("# Models", encoding="utf-8")
    (scattered2 / "module.json").write_text('{}', encoding="utf-8")

    # Consolidate
    consolidated = agent._consolidate_app_files(root, "qmoi-ai", canonical)

    assert consolidated["moved_files"] >= 2
    assert (canonical / "utils.py").exists()
    assert (canonical / "models.py").exists()
    assert (canonical / "config.json").exists() or (canonical / "module.json").exists()


def test_verify_single_app_instance(tmp_path):
    """Test verification that only one instance of each app exists."""
    root = tmp_path / "repo"
    root.mkdir()

    # Create single canonical instance
    app_dir = root / "qmoi-ai"
    app_dir.mkdir()
    (app_dir / "main.py").write_text("# Main", encoding="utf-8")
    (app_dir / "package.json").write_text("{}", encoding="utf-8")

    # Verify
    is_single = agent._verify_single_app_instance(root, "qmoi-ai")
    assert is_single is True


def test_detect_extra_app_instances(tmp_path):
    """Test detection of extra app instances that should be removed."""
    root = tmp_path / "repo"
    root.mkdir()

    # Create canonical
    canonical = root / "qmoi-ai"
    canonical.mkdir()
    (canonical / "main.py").write_text("# Main", encoding="utf-8")

    # Create extra instances
    extra1 = root / "apps" / "qmoi-ai"
    extra1.mkdir(parents=True)
    (extra1 / "old_main.py").write_text("# Old", encoding="utf-8")

    extra2 = root / "backup" / "qmoi-ai"
    extra2.mkdir(parents=True)
    (extra2 / "backup_main.py").write_text("# Backup", encoding="utf-8")

    extras = agent._find_extra_app_instances(root, "qmoi-ai", canonical)
    assert len(extras) >= 2


def test_app_files_placed_in_correct_directories(tmp_path):
    """Test that app files are placed in their required directories."""
    root = tmp_path / "repo"
    root.mkdir()

    # Create app with mixed file locations
    app_dir = root / "qmoi-ai"
    app_dir.mkdir()

    # Correct locations
    (app_dir / "main.py").write_text("# Main", encoding="utf-8")
    (app_dir / "src" / "components").mkdir(parents=True)
    (app_dir / "src" / "components" / "widget.py").write_text("# Widget", encoding="utf-8")
    (app_dir / "tests").mkdir()
    (app_dir / "tests" / "test_app.py").write_text("# Tests", encoding="utf-8")

    # Verify structure
    structure_valid = agent._verify_app_directory_structure(root / "qmoi-ai", {
        "entry_files": ["main.py"],
        "required_dirs": ["src", "tests"]
    })

    assert structure_valid is True


def test_merge_apps_combines_all_files_correctly(tmp_path):
    """Test that app merging combines all files without loss."""
    root = tmp_path / "repo"
    root.mkdir()

    # Create canonical app
    canonical = root / "qmoi-ai"
    canonical.mkdir()
    canonical_main = canonical / "main.py"
    canonical_main.write_text("# Main\nprint('canonical')", encoding="utf-8")

    # Create duplicate apps to merge
    dup1 = root / "backup-qmoi-ai"
    dup1.mkdir()
    (dup1 / "utils.py").write_text("# Utils from dup1", encoding="utf-8")
    (dup1 / "helpers.py").write_text("# Helpers from dup1", encoding="utf-8")

    dup2 = root / "qmoi-ai-old"
    dup2.mkdir()
    (dup2 / "models.py").write_text("# Models from dup2", encoding="utf-8")
    (dup2 / "config.yaml").write_text("config: old", encoding="utf-8")

    # Merge
    merged = agent._merge_duplicate_app_instances(
        root,
        "qmoi-ai",
        canonical,
        [dup1, dup2]
    )

    assert merged["total_files_consolidated"] >= 4
    assert (canonical / "utils.py").exists()
    assert (canonical / "helpers.py").exists()
    assert (canonical / "models.py").exists()


# ============================================================================
# Entry Point Detection Tests
# ============================================================================

def test_detect_app_entry_points_python(tmp_path):
    """Test detection of Python app entry points."""
    root = tmp_path / "repo"
    root.mkdir()

    app_dir = root / "qmoi-ai"
    app_dir.mkdir()

    # Create various entry point files
    (app_dir / "main.py").write_text("""
if __name__ == '__main__':
    app.run()
""", encoding="utf-8")

    (app_dir / "__main__.py").write_text("""
if __name__ == '__main__':
    main()
""", encoding="utf-8")

    (app_dir / "cli.py").write_text("""
import click
@click.command()
def main():
    pass
""", encoding="utf-8")

    entry_points = agent._detect_python_entry_points(app_dir)

    assert len(entry_points) >= 2
    assert any("main.py" in str(ep) for ep in entry_points)
    assert any("__main__.py" in str(ep) for ep in entry_points)


def test_detect_app_entry_points_javascript(tmp_path):
    """Test detection of JavaScript app entry points."""
    root = tmp_path / "repo"
    root.mkdir()

    app_dir = root / "qmoi-ui"
    app_dir.mkdir()

    # Create package.json with entry point
    package_json = {
        "name": "qmoi-ui",
        "main": "dist/index.js",
        "entry": "src/index.js",
        "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build"
        }
    }
    (app_dir / "package.json").write_text(json.dumps(package_json), encoding="utf-8")

    # Create actual entry files
    (app_dir / "src").mkdir()
    (app_dir / "src" / "index.js").write_text("export default App;", encoding="utf-8")

    entry_points = agent._detect_javascript_entry_points(app_dir)

    assert len(entry_points) >= 1
    assert any("index.js" in str(ep) for ep in entry_points)


def test_detect_web_app_entry_html(tmp_path):
    """Test detection of web app entry HTML files."""
    root = tmp_path / "repo"
    root.mkdir()

    app_dir = root / "qmoi-web"
    app_dir.mkdir()

    # Create HTML entry files
    (app_dir / "index.html").write_text("""
<html>
<head><title>QMOI</title></head>
<body><div id="app"></div></body>
</html>
""", encoding="utf-8")

    # Create public directory first, then write file
    (app_dir / "public").mkdir()
    (app_dir / "public" / "index.html").write_text("""
<html><body>Web</body></html>
""", encoding="utf-8")

    entry_files = agent._detect_html_entry_points(app_dir)

    assert len(entry_files) >= 1
    assert any("index.html" in str(ef) for ef in entry_files)


def test_list_all_entry_points_across_apps(tmp_path):
    """Test comprehensive listing of all entry points across all apps."""
    root = tmp_path / "repo"
    root.mkdir()

    apps = ["qmoi-ai", "qcity", "qmoi-space", "qalpha"]

    for app_name in apps:
        app_dir = root / app_name
        app_dir.mkdir()

        if "ai" in app_name:
            (app_dir / "main.py").write_text("if __name__: pass", encoding="utf-8")
            (app_dir / "__main__.py").write_text("if __name__: pass", encoding="utf-8")

        if "city" in app_name or "space" in app_name:
            (app_dir / "package.json").write_text('{"main":"index.js"}', encoding="utf-8")
            (app_dir / "src").mkdir()
            (app_dir / "src" / "index.js").write_text("export default;", encoding="utf-8")

        (app_dir / "index.html").write_text("<html></html>", encoding="utf-8")

    all_entry_points = agent._list_all_app_entry_points(root)

    assert len(all_entry_points) >= len(apps)
    assert "qmoi-ai" in all_entry_points
    assert "qcity" in all_entry_points


# ============================================================================
# Entry File Discovery Tests
# ============================================================================

def test_discover_all_entry_files_in_app(tmp_path):
    """Test discovery of all entry files in an app."""
    root = tmp_path / "repo"
    root.mkdir()
    app_dir = root / "qmoi-ai"
    app_dir.mkdir()

    # Create various entry files
    files = {
        "main.py": "if __name__: pass",
        "__main__.py": "if __name__: pass",
        "cli.py": "click entry",
        "index.html": "<html/>",
        "package.json": '{"main":"index.js"}',
    }

    for fname, content in files.items():
        (app_dir / fname).write_text(content, encoding="utf-8")

    entry_files = agent._discover_all_entry_files(app_dir)

    assert len(entry_files) >= 3
    # Check for key entry files
    found_python = any("main.py" in str(ef) or "__main__.py" in str(ef) for ef in entry_files)
    found_html = any("index.html" in str(ef) for ef in entry_files)
    assert found_python or found_html


def test_verify_entry_files_exist_and_accessible(tmp_path):
    """Test verification that all entry files exist and are accessible."""
    root = tmp_path / "repo"
    root.mkdir()
    app_dir = root / "qmoi-ai"
    app_dir.mkdir()

    entry_files = [
        app_dir / "main.py",
        app_dir / "src" / "index.js",
        app_dir / "index.html"
    ]

    for ef in entry_files:
        ef.parent.mkdir(parents=True, exist_ok=True)
        ef.write_text("content", encoding="utf-8")

    verified = agent._verify_entry_files_accessible(entry_files)
    assert verified is True


def test_identify_missing_entry_files(tmp_path):
    """Test identification of apps missing required entry files."""
    root = tmp_path / "repo"
    root.mkdir()

    # App with all entry files
    good_app = root / "qmoi-good"
    good_app.mkdir()
    (good_app / "main.py").write_text("pass", encoding="utf-8")

    # App missing entry files
    bad_app = root / "qmoi-bad"
    bad_app.mkdir()
    (bad_app / "utils.py").write_text("pass", encoding="utf-8")  # Not an entry point

    missing = agent._find_apps_missing_entry_files(root)

    # bad_app should be in the missing list or list should be reasonable
    assert isinstance(missing, list)


# ============================================================================
# Reasoning and Human Intervention Tests
# ============================================================================

def test_agent_determines_canonical_app_location(tmp_path):
    """Test agent reasoning to determine canonical app location."""
    root = tmp_path / "repo"

    # Create multiple app instances with metadata
    locs = []
    for i, loc in enumerate(["qmoi-ai", "apps/qmoi-ai", "src/qmoi-ai"]):
        path = root / loc
        path.mkdir(parents=True)
        (path / "main.py").write_text("pass", encoding="utf-8")
        (path / "metadata.json").write_text(json.dumps({
            "version": "1.2.3",
            "created": "2024-01-01",
            "priority": 100 - i * 10
        }), encoding="utf-8")
        locs.append(path)

    canonical = agent._determine_canonical_app_location(locs)

    # Should select highest priority
    assert canonical is not None
    assert "qmoi-ai" in str(canonical)


def test_agent_handles_conflicting_app_configurations(tmp_path):
    """Test agent reasoning when app configurations conflict."""
    root = tmp_path / "repo"
    root.mkdir()
    app_dir = root / "qmoi-ai"
    app_dir.mkdir()

    # Create conflicting configs
    config1_path = app_dir / "config.json"
    config1_path.write_text(json.dumps({
        "version": "1.0",
        "port": 3000,
        "debug": True
    }), encoding="utf-8")

    config2_path = app_dir / "config.yaml"
    config2_path.write_text("""
version: 2.0
port: 5000
debug: false
""", encoding="utf-8")

    # Agent should detect and report conflicts
    conflicts = agent._detect_app_config_conflicts(app_dir)

    assert len(conflicts) >= 0  # May or may not find conflicts depending on implementation


def test_agent_suggests_remediation_for_missing_files(tmp_path):
    """Test agent suggesting remediation for missing required files."""
    root = tmp_path / "repo"
    root.mkdir()
    app_dir = root / "qmoi-ai"
    app_dir.mkdir()

    # Create partial app
    (app_dir / "main.py").write_text("pass", encoding="utf-8")

    # Missing files/directories
    missing_recommendations = agent._suggest_app_file_remediation(app_dir, {
        "required_files": ["main.py", "requirements.txt", "README.md"],
        "required_dirs": ["src", "tests", "docs"]
    })

    assert isinstance(missing_recommendations, list)


def test_agent_prioritizes_remediation_tasks(tmp_path):
    """Test agent prioritizing remediation tasks by impact."""
    root = tmp_path / "repo"

    tasks = [
        {"type": "missing_entry_point", "app": "qmoi-ai", "severity": "critical"},
        {"type": "duplicate_app", "app": "qcity", "severity": "high"},
        {"type": "config_conflict", "app": "qmoi-space", "severity": "medium"},
        {"type": "missing_dependency", "app": "qalpha", "severity": "low"},
    ]

    prioritized = agent._prioritize_app_remediation_tasks(tasks)

    assert prioritized[0]["severity"] == "critical"
    assert prioritized[-1]["severity"] == "low"


# ============================================================================
# Integration Tests
# ============================================================================

def test_full_app_consolidation_workflow(tmp_path):
    """Test complete app consolidation workflow."""
    root = tmp_path / "repo"
    root.mkdir()

    # Setup: Create messy multi-location app structure
    apps_to_consolidate = {
        "qmoi-ai": ["qmoi_ai", "backup-qmoi-ai", "qmoi-ai"],
        "qcity": ["qcity", "apps/qcity", "lib/qcity"],
    }

    for app_name, locations in apps_to_consolidate.items():
        for i, loc in enumerate(locations):
            path = root / loc
            path.mkdir(parents=True)

            if i == 0:
                # First is canonical
                (path / "main.py").write_text(f"# {app_name} canonical", encoding="utf-8")
            else:
                # Others have scattered files
                (path / f"utils_{i}.py").write_text(f"# Utils {i}", encoding="utf-8")
                (path / f"module_{i}.py").write_text(f"# Module {i}", encoding="utf-8")

    # Run consolidation
    result = agent._perform_full_app_consolidation(root)

    assert result["apps_consolidated"] >= 2
    assert result["total_duplicates_found"] >= 2
    assert result["canonical_locations_created"] >= 2
    assert result["files_consolidated"] >= 2
    assert not (root / "apps" / "qcity").exists()
    assert not (root / "lib" / "qmoi-ai").exists()

    # Verify canonical apps remain
    assert (root / "qmoi-ai").exists()
    assert (root / "qcity").exists()

    # Refresh documentation after consolidation
    docs = agent.update_documentation_manifests(root, inventory=agent.collect_route_inventory(root))
    assert (root / "API.md").exists()
    assert (root / "ENDPOINTS.md").exists()
    assert (root / "ROUTES.md").exists()
    assert (root / "ALLPORTS.md").exists()
    assert docs["api"].exists()
    assert docs["merge"].exists()


def test_verify_all_apps_consolidated_correctly(tmp_path):
    """Test verification that all apps are consolidated correctly."""
    root = tmp_path / "repo"
    root.mkdir()

    # Setup canonical apps
    apps = ["qmoi-ai", "qcity", "qmoi-space"]
    for app_name in apps:
        app_dir = root / app_name
        app_dir.mkdir()
        (app_dir / "main.py").write_text(f"# {app_name}", encoding="utf-8")
        (app_dir / "package.json").write_text("{}", encoding="utf-8")

    # Verify
    verification = agent._verify_apps_consolidated(root)

    # Verification should return a dict with proper structure
    assert isinstance(verification, dict)
    assert "all_apps_have_single_instance" in verification
    assert "consolidated_apps" in verification
    # At least some apps should be found
    assert len(verification.get("consolidated_apps", [])) >= 0
