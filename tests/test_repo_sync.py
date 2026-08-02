import importlib.util
import types
from pathlib import Path


def load_module():
    module_path = Path(__file__).resolve().parents[1] / "scripts" / "repo_sync.py"
    spec = importlib.util.spec_from_file_location("repo_sync", module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_resolve_target_repo_uses_configured_repo(monkeypatch):
    module = load_module()
    monkeypatch.setenv("QMOI_SYNC_TARGET_REPO", "thealphakenya/Alpha_Q_running")

    assert module.resolve_target_repo() == "thealphakenya/Alpha_Q_running"


def test_resolve_target_branch_defaults_to_main_for_main_branch():
    module = load_module()

    assert module.resolve_target_branch("main") == "main"


def test_resolve_target_branch_uses_autosync_branch_name(monkeypatch):
    module = load_module()
    monkeypatch.setenv("QMOI_SYNC_TARGET_BRANCH", "autosync-backup-20250926-232440")

    assert module.resolve_target_branch("autosync-backup-20250926-232440") == "autosync-backup-20250926-232440"


def test_build_sync_command_uses_authenticated_github_url(monkeypatch):
    module = load_module()
    monkeypatch.setenv("GH_TOKEN", "secret-token")
    monkeypatch.setenv("QMOI_SYNC_TARGET_REPO", "thealphakenya/Alpha_Q_running")

    command = module.build_sync_command()

    assert command[0:2] == ["git", "push"]
    assert command[2] == "https://x-access-token:secret-token@github.com/thealphakenya/Alpha_Q_running.git"
    assert command[3] == "HEAD:main"


def test_main_executes_build_sync_command(monkeypatch):
    module = load_module()
    monkeypatch.setenv("GH_TOKEN", "secret-token")
    monkeypatch.setenv("QMOI_SYNC_TARGET_REPO", "thealphakenya/Alpha_Q_running")
    monkeypatch.setenv("QMOI_SYNC_TARGET_BRANCH", "main")

    calls = []

    def fake_run(command, check=False):
        calls.append((command, check))
        return types.SimpleNamespace(returncode=0)

    monkeypatch.setattr(module.subprocess, "run", fake_run)

    assert module.main() == 0
    assert calls[0][0] == [
        "git",
        "push",
        "https://x-access-token:secret-token@github.com/thealphakenya/Alpha_Q_running.git",
        "HEAD:main",
    ]
