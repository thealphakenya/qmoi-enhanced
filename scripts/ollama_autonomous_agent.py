#!/usr/bin/env python3
"""Autonomous agent prompt and self-healing guidance for QMOI and Ollama workflows."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESUME_FILE = ROOT / "resumefromhere.txt"


def generate_repo_context_summary() -> str:
    counts: dict[str, int] = {}
    markdown_count = 0
    source_count = 0
    total_files = 0

    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        total_files += 1
        ext = path.suffix.lower().lstrip(".") or "none"
        counts[ext] = counts.get(ext, 0) + 1
        if ext in {"md", "markdown"}:
            markdown_count += 1
        if ext in {"py", "ts", "tsx", "js", "jsx", "json", "yml", "yaml"}:
            source_count += 1

    return (
        "Repository file summary: "
        f"{total_files} total files, {source_count} source files, {markdown_count} markdown files. "
        "Use the repo docs, dependency manifests, and self-healing trackers as the source of truth. "
        "The autonomous agent is responsible for dependency repair, GitHub issue remediation, and independent QMOI operation."
    )


def build_ollama_prompt(tasks: list[str]) -> str:
    repo_summary = generate_repo_context_summary()
    security_directive = (
        "Security and dependency mandate: scan the full repository, all nested requirements files, any sibling Alpha-Q-ai repo, "
        "and the GitHub surfaces that typically expose problems (Dependabot alerts, security advisories, workflow failures, "
        "code-scanning findings, stale dependency floors, secret exposure warnings, stale branch manifests, and transitive "
        "dependency drift). Fix all vulnerable or stale dependency pins in requirements.txt and adjacent manifest files, "
        "then verify that QMOI and the autonomous agent can continue self-healing without manual intervention."
    )
    independence_directive = (
        "Independence mandate: ensure the QMOI runtime can bootstrap and operate without external platform dependence. "
        "Apply the operational guidance from INDEPENDENTQMOI.md, independent.md, and related self-sustaining docs so the "
        "system can repair itself, continue remote execution, and recover from GitHub-side issues without requiring manual steps."
    )

    if not tasks:
        return (
            "You are an autonomous Ollama agent. There are no explicit tasks extracted from resumefromhere.txt. "
            "Scan the repository and the backlog files 7.txt, 14.txt, undone.txt, and MATCHES.txt. "
            "Produce a clear plan, execute bulk improvements, update resumefromhere.txt, and verify readiness for production.\n\n"
            f"{security_directive}\n\n{independence_directive}\n\n"
            f"Repository context:\n{repo_summary}"
        )

    task_block = "\n".join([f"{i + 1}. {task}" for i, task in enumerate(tasks)])
    return (
        "You are a production-grade Ollama autonomous agent. Your mission is to complete everything listed in resumefromhere.txt "
        "and all referenced backlog files (7.txt, 14.txt, undone.txt, MATCHES.txt) for this repository. "
        "Treat resumefromhere.txt as the canonical tracker and update it with progress as you work. "
        "Use bulk, parallel, and merged execution when safe. Do not stop until every task is complete and verified. "
        "For each task, do the following:\n"
        "1) Confirm the task statement.\n"
        "2) Describe the action plan.\n"
        "3) Mark the task as [IN PROGRESS], then [DONE], then [VERIFY], and finally [CONFIRMED].\n"
        "4) If the task can be completed in parallel with others, explain how you are parallelizing it.\n"
        "5) At the end, output a final completion summary with a double-check for every task.\n"
        "6) Include a note describing the directory and file coverage for the work you did.\n"
        "If you cannot complete a task, explain why and what is required.\n\n"
        f"{security_directive}\n\n{independence_directive}\n\n"
        "TASK LIST:\n"
        f"{task_block}\n\n"
        "IMPORTANT: Verify completion by cross-checking file names, scripts, and markdown docs in this repo. "
        "Update resumefromhere.txt with progress blocks and new task markers. "
        "Ensure no directory or file is ignored: scan all folders and all files, including hidden and nested paths. "
        "Only finish when all tasks have been confirmed twice.\n\n"
        "When the work involves dependency drift or GitHub security surfaces, inspect requirements.txt and all nested requirements* files, "
        "pin safe minimums, then confirm the remediation with a final check.\n\n"
        f"Repository context:\n{repo_summary}"
    )


def main() -> None:
    tasks: list[str] = [
        "Scan GitHub Dependabot alerts and stale dependency floors",
        "Ensure QMOI can run independently without GitHub/Vercel dependencies",
        "Verify that the agent can repair broken manifests and continue working without human input",
    ]
    print(build_ollama_prompt(tasks))


if __name__ == "__main__":
    main()
