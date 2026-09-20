#!/usr/bin/env python3
"""Automation for multiple verified continuation cycles.

This runner repeatedly performs the established live loop:
1) check repo state,
2) run the targeted autonomous-agent regression suite,
3) append a cycle record to oe2.txt,
4) commit the ledger update,
5) push the branch.

It stops after the configured number of cycles or on the first failed validation.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OE2_PATH = REPO_ROOT / "oe2.txt"
PYTEST_TARGET = "tests/test_ollama_autonomous_agent.py"


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=str(REPO_ROOT), text=True, capture_output=True, check=check)


def status() -> str:
    result = run(["git", "--no-pager", "status", "--short", "--branch"], check=False)
    return result.stdout.strip() or "(no status output)"


def append_cycle_note(cycle: int) -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with OE2_PATH.open("a", encoding="utf-8") as handle:
        handle.write(f"\n- Cycle {cycle} completed at {ts}: pytest passed and the repo stayed push-ready.\n")


def commit_and_push(cycle: int) -> None:
    add = run(["git", "add", "oe2.txt"], check=False)
    if add.returncode != 0:
        raise RuntimeError(f"git add failed for cycle {cycle}: {add.stderr.strip()}")

    commit = run(["git", "commit", "-m", f"chore: continuation cycle {cycle}"], check=False)
    if commit.returncode != 0:
        if "nothing to commit" not in (commit.stderr or "").lower():
            raise RuntimeError(f"git commit failed for cycle {cycle}: {commit.stderr.strip() or commit.stdout.strip()}")
        print(f"Cycle {cycle}: nothing to commit; continuing.")
        return

    push = run(["git", "push", "origin", "HEAD"], check=False)
    if push.returncode != 0:
        raise RuntimeError(f"git push failed for cycle {cycle}: {push.stderr.strip() or push.stdout.strip()}")

    print(push.stdout.strip() or push.stderr.strip())


def run_cycle(cycle: int) -> None:
    print(f"\n=== CONTINUATION CYCLE {cycle} ===")
    print(status())
    pytest = run(["python3", "-m", "pytest", "-q", PYTEST_TARGET, "-q"], check=False)
    if pytest.returncode != 0:
        print(pytest.stdout)
        print(pytest.stderr)
        raise RuntimeError(f"Validation failed for cycle {cycle}")
    print(pytest.stdout)
    append_cycle_note(cycle)
    commit_and_push(cycle)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run multiple continuation cycles automatically.")
    parser.add_argument("--cycles", type=int, default=10, help="How many continuation cycles to complete.")
    args = parser.parse_args()

    if args.cycles <= 0:
        print("--cycles must be a positive integer.")
        return 2

    for cycle in range(1, args.cycles + 1):
        try:
            run_cycle(cycle)
        except Exception as exc:  # pragma: no cover - keeps the loop explicit and observable
            print(f"AUTOMATION STOPPED on cycle {cycle}: {exc}")
            return 1

    print(f"\nCompleted {args.cycles} continuation cycles successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
