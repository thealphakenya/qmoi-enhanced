import subprocess
from pathlib import Path

from scripts.merge_inventory import (
    add_after_merge_metrics,
    build_base_merge_plan,
    classify_duplicate_content,
    inventory_repository,
    projected_tree_metrics,
    stage_sources,
)


def init_repo(root: Path, name: str) -> Path:
    repo = root / name
    repo.mkdir()
    subprocess.run(["git", "-C", str(repo), "init", "-q"], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "user.name", "Test"], check=True)
    subprocess.run(["git", "-C", str(repo), "config", "user.email", "test@example.com"], check=True)
    (repo / "src").mkdir()
    (repo / "src" / f"{name}.txt").write_text(name, encoding="utf-8")
    subprocess.run(["git", "-C", str(repo), "add", "."], check=True)
    subprocess.run(["git", "-C", str(repo), "commit", "-qm", "initial"], check=True)
    subprocess.run(["git", "-C", str(repo), "branch", "-M", "main"], check=True)
    subprocess.run(["git", "-C", str(repo), "branch", "history"], check=True)
    return repo


def test_inventory_counts_all_refs_and_unique_history_paths(tmp_path):
    repo = init_repo(tmp_path, "qmoi-enhanced")
    report = inventory_repository("qmoi-enhanced", repo)
    assert report["ref_count"] >= 2
    assert report["reachable_commit_count"] == 1
    assert "refs/heads/main" in report["refs"]
    assert "src/qmoi-enhanced.txt" in report["unique_history_paths"]
    assert report["history_file_count"] == 1


def test_stage_requires_complete_tree_and_records_history(tmp_path):
    qmoi = init_repo(tmp_path, "qmoi-enhanced")
    alpha = init_repo(tmp_path, "Alpha-Q-ai")
    history = tmp_path / "qmoi-enhanced-history-14"
    history.mkdir()
    (history / "legacy.txt").write_text("legacy", encoding="utf-8")

    report = stage_sources(
        {"qmoi-enhanced": qmoi, "Alpha-Q-ai": alpha},
        history,
        tmp_path / "staging",
    )

    assert report["ready"] is True
    assert report["sequence"] == ["inventory-before-copy", "copy-verified"]
    assert report["before_copy"]["qmoi-enhanced"]["ref_count"] >= 2
    assert report["before_copy"]["Alpha-Q-ai"]["history_file_count"] == 1
    assert report["before_copy"]["qmoi-enhanced-history-14"]["filesystem"]["files"] == 1
    assert (tmp_path / "staging" / "qmoi-enhanced.git.bundle").exists()


def test_after_merge_metrics_preserve_phases(tmp_path):
    report = {"sequence": ["inventory-before-copy"]}
    merged = tmp_path / "merged"
    merged.mkdir()
    (merged / "result.txt").write_text("done", encoding="utf-8")
    add_after_merge_metrics(report, {"qmoi-enhanced": merged})
    assert report["status"] == "complete"
    assert report["sequence"][-1] == "after-merge"
    assert report["after_merge"]["qmoi-enhanced"]["files"] == 1


def test_projected_tree_metrics_counts_parent_directories():
    metrics = projected_tree_metrics({"README.md", "docs/guide.md", "src/app/main.py"})

    assert metrics == {"files": 3, "directories": 3}


def test_base_merge_plan_uses_history_and_alpha_bases_with_provenance():
    report = {
        "before_copy": {
            "qmoi-enhanced-history-14": {
                "filesystem": {"paths": ["README.md", "docs/history.md"]}
            },
            "qmoi-enhanced": {
                "unique_history_paths": ["README.md", "src/qmoi.py"],
                "filesystem": {"paths": ["README.md", "src/qmoi.py"]},
            },
            "Alpha-Q-ai": {
                "unique_history_paths": ["README.md", "alpha/app.ts"],
                "filesystem": {"paths": ["README.md", "alpha/app.ts"]},
            },
        }
    }

    plan = build_base_merge_plan(report)

    assert plan["source_order"] == ["qmoi-enhanced-history-14", "qmoi-enhanced", "Alpha-Q-ai"]
    assert plan["projections"]["qmoi-enhanced"]["base"] == "qmoi-enhanced-history-14"
    assert plan["projections"]["Alpha-Q-ai"]["base"] == "Alpha-Q-ai"
    assert plan["unique_union"] == {"files": 4, "directories": 3}
    assert plan["conflict_count"] == 1
    assert plan["provenance"]["README.md"] == ["Alpha-Q-ai", "qmoi-enhanced", "qmoi-enhanced-history-14"]
    assert plan["requires_review_before_apply"] is True
    assert "plan-only" in plan["apply_mode"]


def test_duplicate_content_classification_preserves_variant_features():
    result = classify_duplicate_content(
        {
            "history": {"same.md": ["hash-a"], "variant.md": ["hash-a"]},
            "qmoi": {"same.md": ["hash-a"], "variant.md": ["hash-b"]},
        }
    )

    assert result["duplicate_path_count"] == 2
    assert result["identical_duplicate_count"] == 1
    assert result["variant_duplicate_count"] == 1
    assert result["identical_paths"] == ["same.md"]
    assert result["variant_paths"] == ["variant.md"]
