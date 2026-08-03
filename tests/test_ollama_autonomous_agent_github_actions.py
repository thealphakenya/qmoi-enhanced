import os
import json
import tempfile
from pathlib import Path
import subprocess

import pytest

from scripts import ollama_autonomous_agent as agent


def test_write_github_actions_summary_and_resume_updates(tmp_path, monkeypatch):
    """Verify that when running under GitHub Actions env the agent writes to GITHUB_STEP_SUMMARY
    and updates resumefromhere.txt with journey map entries and progress ledger."""
    # Setup fake repo root
    repo = tmp_path / "repo"
    repo.mkdir()
    (repo / "resumefromhere.txt").write_text("# Resume from here\n\n")

    # Prepare environment for GitHub Actions summary
    summary = tmp_path / "step_summary.md"
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    monkeypatch.setenv("GITHUB_STEP_SUMMARY", str(summary))

    # Run a controlled update_resume_progress call
    resume_path = repo / "resumefromhere.txt"
    done = ["file1.md"]
    verified = []
    confirmed = []
    pending = ["file2.md", "file3.md"]

    # Call the function under test
    agent._update_resume_progress(resume_path, done=done, verified=verified, confirmed=confirmed, pending=pending)

    # Assert the resume file was updated and contains Journey map
    text = resume_path.read_text(encoding="utf-8")
    # Confirm the progress ledger and status summary are present
    assert "## Progress Ledger" in text
    assert "[PENDING] file2.md" in text
    assert "[DONE] file1.md" in text

    # Check that GitHub summary got written
    assert summary.exists()
    s = summary.read_text(encoding="utf-8")
    # The summary should contain the update status or the resume file path
    assert "Updated resumefromhere progress" in s or str(resume_path) in s


def test_git_commit_and_push_dryrun(tmp_path, monkeypatch):
    """Dry-run the commit and push logic by mocking git commands to ensure inflight behavior."""
    repo = tmp_path / "repo"
    repo.mkdir()
    # create dummy files to commit
    (repo / "a.txt").write_text("hello")

    # monkeypatch git commands to a no-op script
    calls = []

    def fake_run(args, cwd=None, text=True, capture_output=True, check=False):
        calls.append(args)

        class R:
            returncode = 0
            stdout = ""
            stderr = ""

        r = R()
        # Simulate staged diff when git diff --cached --name-only is invoked
        try:
            if isinstance(args, (list, tuple)) and "diff" in args and "--name-only" in args:
                r.stdout = "a.txt\n"
        except Exception:
            pass
        return r

    monkeypatch.setattr(agent, "_run_shell_command", lambda args, cwd=None, capture_output=True,
                        check=False: fake_run(args, cwd, capture_output=capture_output, check=check))

    # Ensure AUTO_PUSH=1 so push is attempted
    monkeypatch.setenv("AUTO_PUSH", "1")
    # Set TARGET_BRANCH to a test branch
    monkeypatch.setenv("TARGET_BRANCH", "autosync-test")

    res = agent._git_commit_and_push(iteration=1, processed=["a.txt"], updated_count=1, root=repo)
    # Since we faked commands to succeed, the result should include committed/pushed False/True based on logic
    assert isinstance(res, dict)
    # We expect attempts to add and push
    has_add = any(cmd[0] == "git" and "add" in cmd for cmd in calls)
    has_push = any(cmd[0] == "git" and "push" in cmd for cmd in calls)
    assert has_add
    assert has_push


def test_resume_file_change_triggers_state_increment(tmp_path):
    repo = tmp_path / "repo"
    repo.mkdir()
    rf = repo / "resumefromhere.txt"
    rf.write_text("initial\n")
    prev = agent._load_state(repo)
    # ensure checksum differs
    rf.write_text("changed\n")
    changed = agent._resume_file_changed(repo)
    assert changed is True
    state = agent._load_state(repo)
    assert state.get("iteration", 0) >= 1
