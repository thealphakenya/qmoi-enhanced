import json
from pathlib import Path

from scripts.qmoi_autonomous_remediator import QMOIAutonomousRemediator


def test_dry_run_discovers_lockfiles_and_validates_tracked_files(tmp_path: Path):
    (tmp_path / ".git").mkdir()
    import subprocess

    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    (tmp_path / "package-lock.json").write_text('{"name":"test","lockfileVersion":3}\n', encoding="utf-8")
    (tmp_path / "valid.py").write_text("value = 1\n", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=tmp_path, check=True)

    report = QMOIAutonomousRemediator(tmp_path).run()

    assert report.package_managers[0]["status"] == "dry_run"
    assert report.validation["json_checked"] == 1
    assert report.validation["python_checked"] == 1
    assert report.unresolved == []


def test_invalid_json_is_reported_without_destructive_rewrite(tmp_path: Path):
    import subprocess

    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    invalid = tmp_path / "broken.json"
    invalid.write_text('{"broken":}\n', encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=tmp_path, check=True)

    report = QMOIAutonomousRemediator(tmp_path).run()

    assert report.unresolved
    assert invalid.read_text(encoding="utf-8") == '{"broken":}\n'


def test_apply_updates_stale_python_dependency_floors(tmp_path: Path):
    import subprocess

    subprocess.run(["git", "init", "-q"], cwd=tmp_path, check=True)
    requirements = tmp_path / "requirements.txt"
    requirements.write_text("requests>=2.31.0\nPyYAML>=6.0.0\n", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=tmp_path, check=True)

    report = QMOIAutonomousRemediator(tmp_path, apply=True).run()

    assert report.unresolved == []
    assert requirements.read_text(encoding="utf-8") == "requests>=2.32.4\nPyYAML>=6.0.2\n"