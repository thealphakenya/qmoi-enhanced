import json
from pathlib import Path

from scripts.qmoi_release_autofix import QMOIReleaseAutofix


def test_release_guard_reports_version_and_ready_status(tmp_path: Path):
    (tmp_path / "README.md").write_text("# QMOI\n", encoding="utf-8")
    (tmp_path / "BUILD.md").write_text("Build\n", encoding="utf-8")
    (tmp_path / "INSTALL.md").write_text("Install\n", encoding="utf-8")
    (tmp_path / "DOWNLOAD.md").write_text("Download\n", encoding="utf-8")
    (tmp_path / "requirements.txt").write_text("pytest\n", encoding="utf-8")
    (tmp_path / "package.json").write_text(json.dumps({"name": "qmoi", "version": "1.2.5"}), encoding="utf-8")

    report = QMOIReleaseAutofix(tmp_path).build_release_report()

    assert report["version"] == "1.2.5"
    assert report["required_files"]["status"] == "ok"
    assert report["status"] in {"healthy", "needs-review"}


def test_release_guard_creates_vercel_if_missing(tmp_path: Path):
    (tmp_path / "README.md").write_text("# QMOI\n", encoding="utf-8")
    (tmp_path / "BUILD.md").write_text("Build\n", encoding="utf-8")
    (tmp_path / "INSTALL.md").write_text("Install\n", encoding="utf-8")
    (tmp_path / "DOWNLOAD.md").write_text("Download\n", encoding="utf-8")
    (tmp_path / "requirements.txt").write_text("pytest\n", encoding="utf-8")
    (tmp_path / "package.json").write_text(json.dumps({"name": "qmoi", "version": "1.2.5"}), encoding="utf-8")

    result = QMOIReleaseAutofix(tmp_path).ensure_vercel_configuration(create_if_missing=True)

    assert result["created"] is True
    assert (tmp_path / "vercel.json").exists()


def test_release_guard_flags_placeholder_tokens(tmp_path: Path):
    (tmp_path / "README.md").write_text("A placeholder token YOUR_GITHUB_TOKEN is not valid\n", encoding="utf-8")
    (tmp_path / "BUILD.md").write_text("Build\n", encoding="utf-8")
    (tmp_path / "INSTALL.md").write_text("Install\n", encoding="utf-8")
    (tmp_path / "DOWNLOAD.md").write_text("Download\n", encoding="utf-8")
    (tmp_path / "requirements.txt").write_text("pytest\n", encoding="utf-8")
    (tmp_path / "package.json").write_text(json.dumps({"name": "qmoi", "version": "1.2.5"}), encoding="utf-8")

    issues = QMOIReleaseAutofix(tmp_path).scan_for_vulnerabilities()

    assert any("YOUR_GITHUB_TOKEN" in issue for issue in issues)


def test_release_guard_auto_fix_adds_package_scripts(tmp_path: Path):
    (tmp_path / "README.md").write_text("# QMOI\n", encoding="utf-8")
    (tmp_path / "BUILD.md").write_text("Build\n", encoding="utf-8")
    (tmp_path / "INSTALL.md").write_text("Install\n", encoding="utf-8")
    (tmp_path / "DOWNLOAD.md").write_text("Download\n", encoding="utf-8")
    (tmp_path / "requirements.txt").write_text("pytest\n", encoding="utf-8")
    (tmp_path / "package.json").write_text(json.dumps({"name": "qmoi", "version": "1.2.5"}), encoding="utf-8")

    result = QMOIReleaseAutofix(tmp_path).auto_fix_repo()

    assert "release:check" in json.loads((tmp_path / "package.json").read_text(encoding="utf-8"))["scripts"]
    assert "deploy:vercel" in json.loads((tmp_path / "package.json").read_text(encoding="utf-8"))["scripts"]
    assert "created vercel.json" in " ".join(result["fixes"])


def test_security_autofix_uplifts_known_vulnerable_python_deps(tmp_path: Path):
    req = tmp_path / "requirements.txt"
    req.write_text(
        "requests==2.31.0\nurllib3==1.26.0\npytest==8.0.0\n",
        encoding="utf-8",
    )

    from scripts.qmoi_security_autofix import QMOISecurityAutofix

    fix = QMOISecurityAutofix(root=tmp_path)
    updated = fix.bump_known_vulnerable_packages(req.read_text(encoding="utf-8"))

    assert "requests>=2.32.4" in updated
    assert "urllib3>=2.8.0" in updated


def test_security_autofix_emits_report_for_auto_healing(tmp_path: Path):
    req = tmp_path / "requirements.txt"
    req.write_text(
        "requests==2.31.0\nurllib3==1.26.0\nPyYAML==5.4.1\n",
        encoding="utf-8",
    )

    from scripts.qmoi_security_autofix import QMOISecurityAutofix

    fix = QMOISecurityAutofix(root=tmp_path)
    result = fix.run_security_fix_cycle()

    assert result["status"] in {"healthy", "updated"}
    assert "requirements.txt" in str(result["report_path"])
    assert "summary" in result
