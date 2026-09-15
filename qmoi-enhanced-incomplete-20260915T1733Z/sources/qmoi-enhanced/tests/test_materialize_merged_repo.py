from __future__ import annotations

import json
import subprocess
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "materialize_merged_repo.py"


def git(repo: Path, *args: str) -> None:
    subprocess.run(["git", "-C", str(repo), *args], check=True, capture_output=True)


def test_materializer_refuses_missing_alpha_without_output(tmp_path):
    active = tmp_path / "active"
    active.mkdir()
    git(active, "init", "-q")
    (active / "README.md").write_text("# active\n", encoding="utf-8")
    git(active, "add", "README.md")
    git(active, "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-qm", "initial")
    (active / "qmoi-enhanced-history-14").mkdir()

    result = subprocess.run(
        ["python3", str(SCRIPT), "--workspace", str(active), "--alpha-repo", str(tmp_path / "missing")],
        capture_output=True,
        check=False,
        text=True,
    )

    assert result.returncode == 2
    assert not (active / "qmoi-enhanced").exists()


def test_materializer_preserves_sources_and_markdown_provenance(tmp_path):
    active = tmp_path / "active"
    alpha = tmp_path / "alpha"
    history = active / "qmoi-enhanced-history-14"
    for repo, title in ((active, "active"), (alpha, "alpha")):
        repo.mkdir()
        git(repo, "init", "-q")
        (repo / f"{title}.md").write_text(f"# {title}\n", encoding="utf-8")
        git(repo, "add", ".")
        git(repo, "-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-qm", "initial")
    history.mkdir()
    (history / "history.md").write_text("# history\n", encoding="utf-8")

    result = subprocess.run(
        ["python3", str(SCRIPT), "--workspace", str(active), "--alpha-repo", str(alpha)],
        capture_output=True,
        check=False,
        text=True,
    )

    assert result.returncode == 0, result.stderr
    output = active / "qmoi-enhanced"
    assert (output / "sources" / "qmoi-enhanced" / "active.md").exists()
    assert (output / "sources" / "Alpha-Q-ai" / "alpha.md").exists()
    assert (output / "sources" / "qmoi-enhanced-history-14" / "history.md").exists()
    assert (output / "MARKDOWN_HISTORY" / "manifest.jsonl").exists()
    status = json.loads((output / "MATERIALIZATION_STATUS.json").read_text())
    assert status["complete"] is True
    assert status["markdown_files"] == 3
    assert status["markdown_history_snapshots"] == 2
    assert "qmoi-enhanced" in (output / "ALLMDFILESREFS.md").read_text()