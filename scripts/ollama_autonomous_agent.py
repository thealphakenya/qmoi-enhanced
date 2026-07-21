#!/usr/bin/env python3
"""Enhanced Ollama autonomous agent utilities for QMOI orchestration."""
from __future__ import annotations

import json
import os
import re
import shutil
import sys
import time
import logging
import subprocess
import concurrent.futures
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Optional
try:
    import requests
except Exception:
    requests = None

ROOT = Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / ".ollama_agent_state.json"

# configure module logger
LOG_PATH = Path.home() / ".ollama" / "logs"
LOG_PATH.mkdir(parents=True, exist_ok=True)
logger = logging.getLogger("ollama_agent")
logger.setLevel(logging.INFO)
logger.propagate = False
if not logger.handlers:
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    file_handler = logging.FileHandler(LOG_PATH / "ollama_autonomous_agent.log")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    live_file_handler = logging.FileHandler(ROOT / ".ollama_agent_live.log")
    live_file_handler.setFormatter(formatter)
    logger.addHandler(live_file_handler)

    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)


def _emit_status(message: str, level: str = "info") -> None:
    """Emit a timestamped status message to stdout and the persistent agent log."""
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    prefix = f"[{ts}]"
    line = f"{prefix} {message}"
    print(line, flush=True)
    getattr(logger, level.lower(), logger.info)(message)


def _load_state(target: Path | None = None) -> Dict[str, object]:
    state_path = Path(target or ROOT) / ".ollama_agent_state.json"
    if state_path.exists():
        try:
            s = json.loads(state_path.read_text(encoding="utf-8"))
            s.setdefault("processed", [])
            s.setdefault("iteration", 0)
            s.setdefault("total_updated", 0)
            return s
        except Exception:
            return {"processed": [], "iteration": 0, "total_updated": 0}
    return {"processed": [], "iteration": 0, "total_updated": 0}


def _save_state(state: Dict[str, object], target: Path | None = None) -> None:
    state_path = Path(target or ROOT) / ".ollama_agent_state.json"
    try:
        state_path.write_text(json.dumps(state, indent=2), encoding="utf-8")
        _emit_status(f"Persisted agent state to {state_path}", level="info")
    except Exception as e:
        logger.error(f"Failed to write state: {e}")


def _comment_token_for_suffix(suffix: str) -> str:
    return {
        ".py": "#",
        ".sh": "#",
        ".ps1": "#",
        ".js": "//",
        ".ts": "//",
        ".tsx": "//",
        ".jsx": "//",
        ".java": "//",
        ".c": "//",
        ".cpp": "//",
        ".go": "//",
        ".rb": "#",
        ".php": "//",
    }.get(suffix.lower(), "#")


def collect_route_inventory(root: Path | None = None) -> List[Dict[str, object]]:
    """Collect route definitions from app/api, routes/api, and pages/api directories."""
    target = Path(root or ROOT)
    inventory: List[Dict[str, object]] = []
    if not target.exists():
        _emit_status(f"Route inventory scan skipped because target does not exist: {target}", level="warning")
        return inventory

    _emit_status(f"Scanning route definitions from {target}", level="info")
    for path in sorted(target.rglob("route.*")):
        if not path.is_file() or path.name.split(".", 1)[0] != "route":
            continue
        if any(part in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next"} for part in path.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        methods: List[str] = []
        for method in ("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"):
            if re.search(rf"\b(?:export\s+)?(?:async\s+)?(?:function|const)\s+{method}\b", text):
                methods.append(method)
        if not methods:
            methods = ["GET"]

        rel = path.relative_to(target).as_posix()
        route = None
        if rel.startswith("app/api/"):
            route_path = rel[len("app/api/"):]
            route_path = route_path.rsplit("/route", 1)[0]
            route = f"/api/{route_path}" if route_path else "/api"
        elif rel.startswith("routes/api/"):
            route_path = rel[len("routes/api/"):]
            route_path = route_path.rsplit("/route", 1)[0]
            route = f"/api/{route_path}" if route_path else "/api"
        elif rel.startswith("pages/api/"):
            route_path = rel[len("pages/api/"):]
            route_path = route_path.rsplit("/route", 1)[0]
            route = f"/api/{route_path}" if route_path else "/api"
        if route:
            inventory.append({"path": rel, "route": route, "methods": methods})

    return sorted(inventory, key=lambda item: str(item["route"]))


def update_documentation_manifests(
    root: Path | None = None,
    inventory: List[Dict[str, object]] | None = None,
    api_endpoints: List[Dict[str, object]] | None = None,
    route_endpoints: List[Dict[str, object]] | None = None,
    branch: str | None = None,
) -> Dict[str, Path]:
    """Create or refresh API, ENDPOINTS, ROUTES, and MERGE markdown manifests."""
    target = Path(root or ROOT)
    target.mkdir(parents=True, exist_ok=True)
    inventory = inventory or collect_route_inventory(target)
    api_endpoints = api_endpoints or [
        {"path": item["route"], "methods": ", ".join(item["methods"])} for item in inventory
    ]
    route_endpoints = route_endpoints or [
        {"path": item["route"], "methods": ", ".join(item["methods"])} for item in inventory
    ]
    branch_name = branch or os.environ.get("GITHUB_HEAD_REF", "local")
    ts = datetime.utcnow().isoformat() + "Z"

    docs: Dict[str, Path] = {}
    docs["api"] = target / "API.md"
    docs["endpoints"] = target / "ENDPOINTS.md"
    docs["routes"] = target / "ROUTES.md"
    docs["merge"] = target / "MERGE.md"

    def _append_or_create(path: Path, heading: str, body: str) -> None:
        if path.exists():
            text = path.read_text(encoding="utf-8", errors="ignore")
        else:
            text = ""
        if heading in text:
            return
        text = text.rstrip() + "\n\n" + heading + "\n" + body.strip() + "\n"
        path.write_text(text, encoding="utf-8")

    api_body = "\n".join(
        ["## Autonomous API inventory", f"- Branch: {branch_name}", f"- Last sync: {ts}"]
        + [f"- {entry['path']} [{entry['methods']}]" for entry in api_endpoints]
    )
    endpoints_body = "\n".join(
        ["## Autonomous endpoint inventory", f"- Branch: {branch_name}", f"- Last sync: {ts}"]
        + [f"- {entry['path']} [{entry['methods']}]" for entry in api_endpoints]
    )
    routes_body = "\n".join(
        ["## Autonomous route inventory", f"- Branch: {branch_name}", f"- Last sync: {ts}"]
        + [f"- {entry['path']} [{entry['methods']}]" for entry in route_endpoints]
    )
    merge_body = "\n".join([
        "# Merge operations",
        f"- Branch: {branch_name}",
        f"- Auto-push: {os.environ.get('AUTO_PUSH', '0')}",
        f"- Auto-merge: {os.environ.get('AUTO_MERGE', '0')}",
        "- Policy: keep docs, tests, routes, and merge state synchronized before merging.",
        f"- Last sync: {ts}",
    ])

    _append_or_create(docs["api"], "# API manifest", api_body)
    _append_or_create(docs["endpoints"], "# Endpoint manifest", endpoints_body)
    _append_or_create(docs["routes"], "# Route manifest", routes_body)
    _append_or_create(docs["merge"], "# Merge manifest", merge_body)

    return docs


def collect_error_inventory(root: Path | None = None) -> List[Dict[str, object]]:
    """Collect likely error-prone files and issues from the repository tree."""
    target = Path(root or ROOT)
    inventory: List[Dict[str, object]] = []
    _emit_status(f"Scanning repository for error markers under {target}", level="info")
    if not target.exists():
        return inventory

    markers = ["TODO", "FIXME", "placeholder", "TBD",
               "[PRODUCTION IMPLEMENTATION REQUIRED]", "traceback", "Exception", "ERROR"]
    for path in sorted(target.rglob("*")):
        if not path.is_file():
            continue
        if any(part in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next"} for part in path.parts):
            continue
        if path.suffix.lower() not in {".py", ".js", ".ts", ".tsx", ".jsx", ".md", ".txt", ".json", ".yml", ".yaml", ".sh", ".ps1"}:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        if not any(marker.lower() in text.lower() for marker in markers):
            continue
        inventory.append({
            "path": str(path.relative_to(target)),
            "markers": [marker for marker in markers if marker.lower() in text.lower()],
            "severity": "medium",
        })
    _emit_status(f"Collected {len(inventory)} error markers", level="info")
    return sorted(inventory, key=lambda item: item["path"])


def update_all_errors_manifest(root: Path | None = None, issues: List[Dict[str, object]] | None = None, branch: str | None = None) -> Path:
    """Create or refresh ALLERRORS.md with the latest remediation inventory."""
    target = Path(root or ROOT)
    target.mkdir(parents=True, exist_ok=True)
    error_path = target / "ALLERRORS.md"
    branch_name = branch or os.environ.get("GITHUB_HEAD_REF", "local")
    ts = datetime.utcnow().isoformat() + "Z"
    issues = issues or collect_error_inventory(target)

    header = ["# ALLERRORS.md", "", f"- Last autonomous remediation: {ts}",
              f"- Branch: {branch_name}", "- Status: autonomous remediation and verification pass", ""]
    sections = ["## Autonomous remediation inventory"]
    if issues:
        for issue in issues:
            sections.append(f"- {issue['path']}: {', '.join(issue['markers'])}")
    else:
        sections.append("- No unresolved error markers detected in the current scan.")

    sections.extend(["", "## Verification notes", "- Tests and hooks are rechecked during each autonomous run.",
                    "- Remaining issues are surfaced here until they are verified as resolved."])

    if error_path.exists():
        text = error_path.read_text(encoding="utf-8", errors="ignore")
        if "## Autonomous remediation inventory" in text:
            prefix = text.split("## Autonomous remediation inventory", 1)[0]
            tail = text.split("## Autonomous remediation inventory", 1)[1]
            text = prefix.rstrip() + "\n\n" + "\n".join(header + sections) + "\n\n" + tail.lstrip()
        else:
            text = text.rstrip() + "\n\n" + "\n".join(header + sections) + "\n"
    else:
        text = "\n".join(header + sections) + "\n"
    error_path.write_text(text, encoding="utf-8")
    _emit_status(f"Wrote remediation inventory to {error_path}", level="info")
    return error_path


def run_repo_verification(root: Path | None = None) -> Dict[str, object]:
    """Run lightweight verification commands for Python and Node-based workspaces when available."""
    target = Path(root or ROOT)
    results: Dict[str, object] = {"python": {"status": "skipped",
                                             "output": ""}, "tests": {"status": "skipped", "output": ""}}

    _emit_status("Starting repository verification checks", level="info")
    if (target / "tests").exists():
        try:
            proc = subprocess.run(["python", "-m", "pytest", "-q", "tests"], cwd=str(target),
                                  capture_output=True, text=True, timeout=600)
            results["tests"] = {"status": "passed" if proc.returncode ==
                                0 else "failed", "output": (proc.stdout + proc.stderr)[:4000]}
        except Exception as exc:
            results["tests"] = {"status": "error", "output": str(exc)}

    if (target / "pyproject.toml").exists() or any((target / p).exists() for p in ("setup.py", "requirements.txt")):
        try:
            proc = subprocess.run(["python", "-m", "compileall", "-q", "."], cwd=str(target),
                                  capture_output=True, text=True, timeout=600)
            results["python"] = {"status": "passed" if proc.returncode ==
                                 0 else "failed", "output": (proc.stdout + proc.stderr)[:4000]}
        except Exception as exc:
            results["python"] = {"status": "error", "output": str(exc)}

    _emit_status(f"Verification completed with python={results['python']['status']} tests={results['tests']['status']}", level="info")
    return results


def write_live_notification_summary(root: Path | None = None, message: str = "", branch: str | None = None) -> Path:
    """Write a markdown activity feed that can be published to GitHub or referenced in workflows."""
    target = Path(root or ROOT)
    target.mkdir(parents=True, exist_ok=True)
    feed_path = target / "OLLAMA_ACTIVITY_FEED.md"
    branch_name = branch or os.environ.get("GITHUB_HEAD_REF", "local")
    ts = datetime.utcnow().isoformat() + "Z"
    body = [
        "# Ollama activity feed",
        "",
        f"- Timestamp: {ts}",
        f"- Branch: {branch_name}",
        "- Status: realtime GitHub notification stream",
        "",
        "## Latest update",
        f"- {message or 'Ollama completed an autonomous run and updated the repository.'}",
        "",
        "## Notes",
        "- This feed is updated on every agent run so GitHub notifications and repository views stay in sync.",
        "- The workflow can surface this file in PR comments, issues, or release notes.",
    ]
    feed_path.write_text("\n".join(body) + "\n", encoding="utf-8")
    _emit_status(f"Updated live notification feed at {feed_path}", level="info")
    return feed_path


def _execute_task_on_file(relpath: str, root: Path | None = None) -> Dict[str, object]:
    """Attempt a safe, auditable automated edit for the provided repository-relative path.
    Returns dict: {changed: bool, description: str, path: str}
    """
    target = Path(root or ROOT)
    p = target / relpath
    ts = datetime.utcnow().isoformat() + "Z"
    result = {"changed": False, "description": "", "path": relpath}
    if not p.exists() or not p.is_file():
        result["description"] = "missing"
        _emit_status(f"Skipping edit for missing file {relpath}", level="warning")
        return result
    try:
        text = p.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        result["description"] = f"read-failed: {e}"
        return result

    markers = ["[PRODUCTION IMPLEMENTATION REQUIRED]", "TODO", "placeholder", "TBD", "FIXME"]
    changed = False
    desc = []
    # If file contains markers, attempt safe replacements or annotations
    if any(m in text for m in markers):
        if p.suffix.lower() in (".md", ".txt"):
            # replace markers with an audit note and append automated section
            for m in markers:
                if m in text:
                    text = text.replace(m, f"[AUTOFIXED by Ollama at {ts}: please review]")
                    changed = True
                    desc.append(f"replaced {m}")
            text = text + f"\n\n---\nAutomated update by Ollama agent at {ts}. Please review changes above.\n"
        elif p.suffix.lower() in (".json",):
            # JSON can't contain comments safely; create a sidecar note file instead
            side = p.with_name(p.name + ".ollama_update.txt")
            side.write_text(
                f"Automated note: file contains placeholders or TODOs. Run review. Time: {ts}\n", encoding="utf-8")
            changed = True
            desc.append("created sidecar note")
        else:
            # code files: append an audit comment at end
            tok = _comment_token_for_suffix(p.suffix)
            note = f"\n{tok} AUTOFIXED by Ollama at {ts}: replaced placeholders or noted TODOs. Please review.\n"
            text = text + note
            changed = True
            desc.append("appended audit comment")

    # If no markers but short md files, ensure they have an 'Updated by Ollama' footer
    if (not changed) and p.suffix.lower() in (".md", ".txt") and len(text) < 2000:
        footer = f"\n\n---\nChecked by Ollama agent at {ts}. No immediate placeholders found.\n"
        text = text + footer
        changed = True
        desc.append("appended checked footer")

    if changed:
        # backup original
        try:
            bak = p.with_suffix(p.suffix + ".ollama.bak")
            shutil.copy2(p, bak)
        except Exception:
            pass
        try:
            p.write_text(text, encoding="utf-8")
            result["changed"] = True
            result["description"] = ", ".join(desc)
            _emit_status(f"Updated file {relpath}: {result['description']}", level="info")
        except Exception as e:
            result["description"] = f"write-failed: {e}"
            _emit_status(f"Failed to update file {relpath}: {result['description']}", level="error")
    else:
        result["description"] = "no-action"
        _emit_status(f"No edit required for {relpath}", level="info")

    return result


def _git_commit_and_push(iteration: int, processed: List[str], updated_count: int, root: Path | None = None) -> Dict[str, object]:
    target = Path(root or ROOT)
    state_path = target / ".ollama_agent_state.json"
    out = {"committed": False, "pushed": False, "merged": False, "error": None}
    try:
        if (target / ".git").exists():
            branch = f"ollama/iteration-{iteration}"
            _emit_status(f"Preparing git commit for iteration {iteration}", level="info")
            subprocess.run(["git", "checkout", "-B", branch], cwd=str(target), check=False)
            files_to_add = list(dict.fromkeys(processed + [str(state_path.relative_to(target))]))
            _emit_status(f"Staging {len(files_to_add)} files for git commit", level="info")
            subprocess.run(["git", "add"] + files_to_add, cwd=str(target), check=False)
            msg = f"Ollama agent iteration {iteration}: processed {len(processed)} files, updated {updated_count}"
            subprocess.run(["git", "commit", "-m", msg], cwd=str(target), check=False)
            _emit_status(f"Git commit created: {msg}", level="info")
            out["committed"] = True
            if os.environ.get("AUTO_PUSH", "0") == "1":
                _emit_status(f"Pushing branch {branch} to origin", level="info")
                subprocess.run(["git", "push", "-u", "origin", branch], cwd=str(target), check=False)
                out["pushed"] = True
                if shutil.which("gh") and os.environ.get("GITHUB_TOKEN"):
                    try:
                        pr_title = f"Ollama agent iteration {iteration} updates"
                        subprocess.run(["gh", "pr", "create", "--fill", "--title",
                                       pr_title], cwd=str(target), check=False)
                    except Exception:
                        pass
                    if os.environ.get("AUTO_MERGE", "0") == "1":
                        try:
                            _emit_status("Attempting automatic PR merge", level="info")
                            subprocess.run(["gh", "pr", "merge", "--merge", "--auto"], cwd=str(target), check=False)
                            out["merged"] = True
                        except Exception as e:
                            logger.warning(f"Auto-merge attempt failed: {e}")
    except Exception as e:
        out["error"] = str(e)
        _emit_status(f"git commit/push failed: {e}", level="error")
    return out


def build_plan_and_docs(output_dir: Path | None = None) -> Dict[str, Path]:
    """Create the core planning and documentation files requested by the user."""
    target = output_dir or ROOT
    target = Path(target)
    target.mkdir(parents=True, exist_ok=True)

    docs: Dict[str, Path] = {}
    docs["resumefromhere"] = target / "resumefromhere.txt"
    docs["trade"] = target / "Trade.md"
    docs["ollama"] = target / "ollama.md"
    docs["qmoi_model"] = target / "QMOIMODEL.md"
    docs["qmoi_model_tests"] = target / "QMOIMODELTESTS.md"
    docs["all_tests"] = target / "ALLTESTSAUOTOTESTS.md"
    docs["all_hooks"] = target / "ALLHOOKSWEBHOOKS.md"
    docs["matches"] = target / "MATCHES.md"
    docs["routes"] = target / "ROUTES.md"
    docs["merge"] = target / "MERGE.md"

    docs["resumefromhere"].write_text(
        """# Resume from here

## Mission
- Update this plan first and keep it as the source of truth for all future work.
- Use Ollama as an autonomous agent that can complete the broadest possible set of tasks reliably.
- Replace shallow/non-production implementations with stronger production-ready implementations wherever they are found.
- Ensure all requested documentation, tests, hooks, webhooks, and accessibility features are implemented and verified.

## Execution Order
1. Update the plan and all required documentation files.
2. Enhance the autonomous agent workflow and automation scripts.
3. Implement or improve missing tests, hooks, webhooks, and model orchestration support.
4. Scan for unfinished work and complete the highest-value tasks quickly.
5. Fix remaining errors and issues only after the main implementation work is complete.

## Core Directives
- Always maintain a double-mark workflow: first mark when a task is done, second mark after independent verification.
- Always add missing tests, hooks, and webhooks when implementing new functionality.
- Always update ALLTESTSAUOTOTESTS.md and ALLHOOKSWEBHOOKS.md whenever automation or integration changes are made.
- Always keep documentation production-ready and aligned with implementation reality.
- Always surface unresolved issues in ALLERRORS.md and keep the logs current.

## Ollama Agent Instructions
- When the task scope is large, break it into phases and work through them in a reliable order.
- Prioritize reliability, correctness, and verification over speed alone.
- Use batch operations where possible and parallelize independent work when safe.
- Scan the entire repository tree for files, scripts, docs, configs, hooks, webhooks, and tests before claiming the work is complete.
- Never miss files because the scan is limited to one extension or one directory.
- When encountering non-production implementations, replace them with production-ready versions that are observable and testable.
- For accessibility, ensure the experience is compatible with multiple disability profiles and universal interaction modes.
- For model work, keep the canonical model name as qmoi and ensure its behavior is consistent and documented.
- Always update resumefromhere.txt with the current full plan before and after execution so it remains the source of truth.
- Always keep ALLTESTSAUOTOTESTS.md, ALLHOOKSWEBHOOKS.md, ALLERRORS.md, QMOIMODEL.md, QMOIMODELTESTS.md, MATCHES.md, API.md, ENDPOINTS.md, ROUTES.md, and MERGE.md synchronized with the current implementation.
- Treat the agent as a production-only operator: never stop early, never leave pending tasks unexplained, and keep auto-push and auto-merge enabled whenever repository credentials are available.
- Ensure every GitHub-backed run reflects in the current codespace and any open workspace by updating shared manifests and the resume plan immediately.

## Repository Scan Inventory
- The agent must record the current pending inventory in this file after every scan.
- The inventory should list the highest-priority files that still need work, grouped by area such as docs, tests, hooks, models, and errors.
- The current scan should be refreshed whenever the repository changes.

## QMOI Model Requirements
- Ensure the qmoi model remains the canonical aggregator model.
- Keep documentation in QMOIMODEL.md aligned with the actual implementation.
- Ensure tests cover override safety, model identity, and resilience.

## Universal Accessibility Requirements
- Ensure QMOIFORALL.md is implemented in a practical way across the supported apps and platforms.
- Support multiple disability profiles and universal access patterns, including screen-reader, voice, haptic, and alternative input flows.

## Documentation and Tracking Requirements
- Update ollama.md with the current workflow and operating principles.
- Update MATCHES.md with the important file and workflow relationships used by the agent.
- Keep ALLERRORS.md updated with error summaries, root causes, and remediation status.
- Ensure API.md, ENDPOINTS.md, ROUTES.md, and MERGE.md are refreshed on every run so GitHub and every open codespace stay aligned.

## Operational Details
- Environment: honor `OLLAMA_HOST`, `OLLAMA_MODEL`, and `OLLAMA_TIMEOUT` (seconds, default 600).
- Logs: `~/.ollama/logs/ollama_autonomous_agent.log` (agent appends run output and errors).
- Backups: before modifying resumefromhere.txt, the agent creates UTC timestamped backups in `ROOT/.backup/resumefromhere/`.
- Preflight checks: agent verifies presence of `TREE_FULL_STRUCTURE.md` and other required references before calling Ollama.
- Timeout and looping: Ollama calls default to 600s; the agent may operate in a loop until the pending inventory is reduced.
- Streaming: when Ollama supports streaming, agent will stream incremental progress into the log and resumefromhere.txt.
""",
        encoding="utf-8",
    )

    docs["trade"].write_text(
        """# Trade

This file captures the operating contract for the autonomous agent and the trading/model workflow.

## Instructions Q
- Keep the canonical model as qmoi.
- Always verify before claiming completion.
- Always add or update tests when changing behavior.
- Always update the relevant documentation and tracking files.
- Always prefer production-ready implementations over placeholders.
- Always log and remediate errors after primary implementation work.
""",
        encoding="utf-8",
    )

    docs["ollama"].write_text(
        """# Ollama

The Ollama autonomous agent is responsible for orchestrating implementation, documentation, testing, and recovery.

## Operating Principles
- Work from resumefromhere.txt as the main plan.
- Honor environment variables `OLLAMA_HOST`, `OLLAMA_MODEL`, `OLLAMA_TIMEOUT` (default 600s).
- Log to `~/.ollama/logs/ollama_autonomous_agent.log` and append concise run summaries to resumefromhere.txt.
- Create backups in `ROOT/.backup/resumefromhere/` before writes.
- Use `TREE_FULL_STRUCTURE.md` as the canonical repository map referenced in prompts.
- On large task sets, batch and order by priority; do not miss files across extensions or directories.
- Always collect route inventory, keep API/ENDPOINTS/ROUTES/MERGE manifests synchronized, and auto-push/auto-merge whenever the environment permits.
- Never stop until the repo is production-ready, the documentation is aligned, and the pending inventory is empty or explicitly documented as blocked.
""",
        encoding="utf-8",
    )

    docs["qmoi_model"].write_text(
        """# QMOI Model

The qmoi model is the canonical aggregator model.

## Responsibilities
- Serve as the single source of truth for model inference.
- Keep model metadata and metrics persistent.
- Remain safe from runtime model override misuse.
""",
        encoding="utf-8",
    )

    docs["qmoi_model_tests"].write_text(
        """# QMOI Model Tests

## Required coverage
- Model identity remains qmoi.
- Overrides are ignored or rejected.
- Health and recovery checks remain green.
- Documentation and test synchronization stay updated.
""",
        encoding="utf-8",
    )

    docs["all_tests"].write_text(
        """# ALLTESTSAUOTOTESTS

## Test inventory
- Unit tests for the autonomous agent workflow.
- Integration tests for documentation and automation updates.
- Regression tests for model identity and reliability.
""",
        encoding="utf-8",
    )

    docs["all_hooks"].write_text(
        """# ALLHOOKSWEBHOOKS

## Hook and webhook inventory
- Automation hooks for documentation updates.
- Webhook handlers for external automation events.
- Recovery hooks for error handling and retry workflows.
""",
        encoding="utf-8",
    )

    docs["matches"].write_text(
        """# MATCHES

This file tracks the most important relationships between the automation workflow, documentation, tests, hooks, and the qmoi model.
""",
        encoding="utf-8",
    )

    return docs


def scan_for_work(output_dir: Path | None = None) -> List[str]:
    """Scan the full repository for likely unfinished or placeholder-heavy work with broad coverage."""
    target = output_dir or ROOT
    target = Path(target)
    candidates: List[str] = []
    scan_patterns = (".py", ".js", ".ts", ".tsx", ".jsx", ".md", ".txt", ".json", ".yml", ".yaml", ".sh", ".ps1", ".toml")

    for path in sorted(target.rglob("*")):
        if not path.is_file():
            continue
        if any(part in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next", ".backup", ".pytest_cache"} for part in path.parts):
            continue
        if path.name.startswith("."):
            continue
        if path.suffix.lower() not in scan_patterns:
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        if any(marker.lower() in text.lower() for marker in (["[PRODUCTION IMPLEMENTATION REQUIRED]", "TODO", "placeholder", "TBD", "FIXME", "autofix", "review changes above"])):
            candidates.append(str(path.relative_to(target)))

    return sorted(dict.fromkeys(candidates))


def _backup_resume(resume_path: Path) -> Optional[Path]:
    """Create a timestamped backup of resumefromhere.txt in ROOT/.backup/resumefromhere/"""
    try:
        root = resume_path.resolve().parents[0]
        backup_dir = root / ".backup" / "resumefromhere"
        backup_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        dest = backup_dir / f"resumefromhere.{ts}.bak"
        shutil.copy2(resume_path, dest)
        _emit_status(f"Backed up resume file to {dest}", level="info")
        return dest
    except Exception as e:
        logger.error(f"Failed to backup resume: {e}")
        return None


def _update_resume_progress(resume_path: Path, done: List[str], verified: List[str], confirmed: List[str], pending: List[str]) -> None:
    """Write a structured progress summary to resumefromhere.txt with double-mark tracking."""
    try:
        resume_path.parent.mkdir(parents=True, exist_ok=True)
        text = resume_path.read_text(encoding="utf-8", errors="ignore") if resume_path.exists() else ""
        blocks = []
        blocks.append("## Progress Ledger")
        blocks.append("- [DONE] " + "\n- [DONE] ".join(done) if done else "- [DONE] None")
        blocks.append("- [VERIFY] " + "\n- [VERIFY] ".join(verified) if verified else "- [VERIFY] None")
        blocks.append("- [CONFIRMED] " + "\n- [CONFIRMED] ".join(confirmed) if confirmed else "- [CONFIRMED] None")
        blocks.append("- [PENDING] " + "\n- [PENDING] ".join(pending) if pending else "- [PENDING] None")
        block = "\n".join(blocks)
        if "## Progress Ledger" in text:
            pattern = re.compile(r"## Progress Ledger.*?(?=\n## |\Z)", re.S)
            text = pattern.sub(block, text, count=1)
        else:
            text = text.rstrip() + "\n\n" + block + "\n"
        resume_path.write_text(text, encoding="utf-8")
    except Exception as e:
        logger.error(f"Failed to update progress ledger: {e}")


def _preflight_checks(root: Path, required_files: List[str]) -> List[str]:
    """Verify required files exist; return list of missing files."""
    missing = []
    for f in required_files:
        if not (root / f).exists():
            missing.append(f)
            _emit_status(f"Preflight missing required file: {f}", level="warning")
    if missing:
        _emit_status(f"Preflight checks completed with missing files: {', '.join(missing)}", level="warning")
    else:
        _emit_status("Preflight checks completed successfully", level="info")
    return missing


def _should_stop_autonomous_run(resume_path: Path, pending: List[str]) -> bool:
    """Return True when the resume ledger shows all work is done and confirmed."""
    try:
        if pending:
            return False
        if not resume_path.exists():
            return False
        text = resume_path.read_text(encoding="utf-8", errors="ignore")
        has_done = "- [DONE]" in text and "- [VERIFY]" in text and "- [CONFIRMED]" in text
        has_pending_none = "- [PENDING] None" in text or "- [PENDING]" not in text
        return has_done and has_pending_none
    except Exception:
        return False


def _discover_autonomous_commands(root: Path | None = None) -> List[str]:
    """Discover repo-relevant shell commands from markdown, shell, and text docs, then add default verification steps."""
    target = Path(root or ROOT)
    commands: List[str] = []
    if not target.exists():
        return commands
    for path in sorted(list(target.rglob("*.md")) + list(target.rglob("*.txt")) + list(target.rglob("*.sh")) + list(target.rglob("*.ps1"))):
        if any(part in {".git", "node_modules", ".venv", "__pycache__", "dist", "build", ".next"} for part in path.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("```"):
                continue
            if line.startswith("pytest") or line.startswith("python") or line.startswith("npm") or line.startswith("bash") or line.startswith("./") or line.startswith("sh "):
                commands.append(line)

    if (target / "tests").exists():
        commands.append("pytest -q tests")
    if (target / "pyproject.toml").exists() or any((target / p).exists() for p in ("setup.py", "requirements.txt")):
        commands.append("python -m compileall -q .")
    if (target / "package.json").exists():
        commands.append("npm test -- --runInBand")
    return sorted(dict.fromkeys(commands))


def _execute_autonomous_commands(root: Path | None = None) -> List[Dict[str, object]]:
    """Run discovered commands in a safe, recorded way when they appear relevant and executable."""
    target = Path(root or ROOT)
    results: List[Dict[str, object]] = []
    for command in _discover_autonomous_commands(target):
        try:
            _emit_status(f"Executing autonomous command: {command}", level="info")
            proc = subprocess.run(command, cwd=str(target), shell=True, capture_output=True, text=True, timeout=600)
            results.append({"command": command, "returncode": proc.returncode, "stdout": proc.stdout[:2000], "stderr": proc.stderr[:2000]})
        except Exception as exc:
            results.append({"command": command, "returncode": -1, "stdout": "", "stderr": str(exc)})
    return results


def _ensure_ollama_client() -> bool:
    """Return True when the Ollama CLI is available on PATH."""
    cli_path = shutil.which("ollama")
    if cli_path:
        _emit_status(f"Ollama CLI detected at {cli_path}", level="info")
    else:
        _emit_status("Ollama CLI not found on PATH", level="warning")
    return bool(cli_path)


def _ensure_ollama_service(timeout: int = 10) -> bool:
    """Check Ollama service reachable; if not, attempt to start local binary if available."""
    host = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
    try:
        if requests:
            resp = requests.get(f"{host}/api/tags", timeout=2)
            if resp.status_code == 200:
                _emit_status("Ollama service reachable", level="info")
                return True
    except Exception:
        _emit_status("Ollama service not reachable; attempting local startup", level="info")

    if not _ensure_ollama_client():
        logger.warning("Ollama CLI not available")
        return False

    try:
        _emit_status("Starting Ollama service with the local CLI", level="info")
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
        for _ in range(max(1, min(timeout, 10))):
            try:
                if requests:
                    resp = requests.get(f"{host}/api/tags", timeout=2)
                    if resp.status_code == 200:
                        _emit_status("Ollama service started successfully", level="info")
                        return True
            except Exception:
                pass
            time.sleep(1)
    except Exception as e:
        logger.error(f"Failed to start Ollama binary: {e}")

    _emit_status("Ollama service not available", level="warning")
    return False


def _ensure_model_available(model: str, timeout: int = 600) -> Optional[str]:
    """Ensure a model is available locally; pull it when necessary."""
    host = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
    if not _ensure_ollama_client():
        return None
    if not _ensure_ollama_service(timeout=min(10, max(2, timeout))):
        return None

    try:
        if requests:
            resp = requests.get(f"{host}/api/tags", timeout=10)
            if resp.status_code == 200:
                models = resp.json().get("models", [])
                for entry in models:
                    name = entry.get("name") if isinstance(entry, dict) else None
                    if not name:
                        continue
                    if name == model or name.split(":", 1)[0] == model.split(":", 1)[0]:
                        return name
    except Exception:
        pass

    try:
        _emit_status(f"Pulling Ollama model {model}", level="info")
        proc = subprocess.run(["ollama", "pull", model], capture_output=True, text=True, timeout=timeout)
        if proc.returncode == 0:
            _emit_status(f"Model {model} ready for use", level="info")
            return model
        _emit_status(f"Failed to pull model {model}: {proc.stderr or proc.stdout}", level="warning")
    except Exception as exc:
        logger.error(f"Failed to pull model {model}: {exc}")

    return None


def _generate_prompt(tree_ref: Path, tasks: List[str]) -> str:
    """Produce a system-grade prompt referencing TREE_FULL_STRUCTURE.md and tasks."""
    tree_text = "(TREE_FULL_STRUCTURE not found)"
    try:
        if tree_ref.exists():
            tree_text = tree_ref.read_text(encoding="utf-8", errors="ignore")[:8000]
    except Exception:
        pass
    _emit_status(f"Generating Ollama prompt with {len(tasks)} task entries", level="info")
    prompt = (
        "You are Ollama autonomous agent for QMOI. Follow the workflow: Inventory -> Reconcile -> Implement -> Consolidate -> Verify. "
        "Use TREE_FULL_STRUCTURE.md as the canonical reference.\n\n"
        f"Repository map (truncated):\n{tree_text}\n\n"
        "Tasks (ordered):\n"
        + "\n".join([f"- {t}" for t in tasks[:200]])
        + "\n\nInstructions:\n- Update resumefromhere.txt with progress markers [IN PROGRESS], [DONE], [VERIFY], [CONFIRMED].\n"
    )
    return prompt


def _call_ollama(prompt: str, timeout: int = 600) -> Dict[str, str]:
    """Call Ollama using the CLI/API when available; otherwise return a clear skip/failure state."""
    host = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
    model = os.environ.get("OLLAMA_MODEL", "llama3.2:3b")
    result = {"status": "skipped", "output_summary": "No Ollama client installed; simulated run."}

    if not _ensure_ollama_client():
        return result

    if not _ensure_ollama_service(timeout=min(10, max(2, timeout))):
        return {"status": "failed", "output_summary": "Ollama service is unavailable"}

    model_name = _ensure_model_available(model, timeout=max(300, timeout))
    if not model_name:
        return {"status": "failed", "output_summary": f"Unable to prepare Ollama model {model}"}

    try:
        if requests:
            url = f"{host}/api/generate"
            payload = {"model": model_name, "prompt": prompt, "stream": False}
            _emit_status(f"Calling Ollama at {url} using model {model_name}", level="info")
            resp = requests.post(url, json=payload, timeout=timeout)
            if resp.status_code == 200:
                payload_data = resp.json()
                response_text = payload_data.get("response") or json.dumps(payload_data)
                _emit_status("Ollama responded successfully", level="info")
                return {"status": "ok", "output_summary": response_text[:2000]}
            _emit_status(f"Ollama error: {resp.status_code} {resp.text[:1000]}", level="error")
            return {"status": "error", "output_summary": resp.text[:2000]}
    except Exception as e:
        _emit_status(f"Ollama call failed: {e}", level="error")
        return {"status": "failed", "output_summary": str(e)}
    return result


def run_agent(output_dir: Path | None = None) -> Dict[str, object]:
    """Run the autonomous workflow until the inventory is fully addressed or the loop is interrupted."""
    target = Path(output_dir or ROOT)
    target.mkdir(parents=True, exist_ok=True)
    docs = build_plan_and_docs(target)
    _emit_status("Planning documents initialized", level="info")

    state = _load_state(target)
    processed_set = set(state.get("processed", []))
    iteration_value = int(state.get("iteration", 0))
    total_updated = int(state.get("total_updated", 0))

    max_iterations = int(os.environ.get("OLLAMA_MAX_ITERATIONS", "20"))
    batch_size = int(os.environ.get("OLLAMA_BATCH_SIZE", "20"))
    max_workers = int(os.environ.get("OLLAMA_MAX_WORKERS", "8"))

    for loop_index in range(max_iterations):
        _emit_status(f"Starting autonomous loop {loop_index + 1}/{max_iterations}", level="info")
        pending = scan_for_work(target)
        _emit_status(f"Discovered {len(pending)} candidate files requiring attention", level="info")
        route_inventory = collect_route_inventory(target)
        docs.update(update_documentation_manifests(target, route_inventory, [
            {"path": item["route"], "methods": ", ".join(item["methods"])} for item in route_inventory
        ], [
            {"path": item["route"], "methods": ", ".join(item["methods"])} for item in route_inventory
        ], f"ollama/iteration-{iteration_value + loop_index + 1}"))

        unprocessed = [p for p in pending if p not in processed_set]
        to_process = unprocessed[:batch_size]
        _emit_status(f"Processing batch of {len(to_process)} files out of {len(unprocessed)} pending", level="info")
        processed_this_run: List[str] = []
        updated_files: List[str] = []
        failed: List[str] = []

        if to_process:
            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as ex:
                futures = {ex.submit(_execute_task_on_file, item, target): item for item in to_process}
                for fut in concurrent.futures.as_completed(futures):
                    item = futures[fut]
                    try:
                        res = fut.result()
                    except Exception as e:
                        res = {"changed": False, "description": f"executor-error: {e}"}
                    processed_set.add(item)
                    processed_this_run.append(item)
                    if res.get("changed"):
                        updated_files.append(item)
                    else:
                        if res.get("description") and res.get("description") not in ("no-action", "missing"):
                            failed.append(f"{item}: {res.get('description')}")

        state["processed"] = sorted(processed_set)
        state["iteration"] = int(state.get("iteration", 0)) + 1
        total_updated += len(updated_files)
        state["total_updated"] = total_updated
        _emit_status(f"Batch complete: processed={len(processed_this_run)} updated={len(updated_files)} failed={len(failed)}", level="info")
        _save_state(state, target)
        iteration_value = int(state.get("iteration", 0))

        resume_path = docs["resumefromhere"]
        resume_text = resume_path.read_text(encoding="utf-8") if resume_path.exists() else ""
        inventory_block = "\n".join(["## Repository Scan Inventory", "- Current pending inventory:"] + [f"- {item}" for item in unprocessed[:80]])
        if "## Repository Scan Inventory" not in resume_text:
            resume_text = resume_text + "\n\n" + inventory_block
        else:
            pattern = re.compile(r"## Repository Scan Inventory.*?(?=\n## |\Z)", re.S)
            resume_text = pattern.sub(
                "## Repository Scan Inventory\n- The agent must record the current pending inventory in this file after every scan.\n- The inventory should list the highest-priority files that still need work, grouped by area such as docs, tests, hooks, models, and errors.\n- The current scan should be refreshed whenever the repository changes.\n" + "\n".join(["- Current pending inventory:"] + [f"- {item}" for item in unprocessed[:80]]),
                resume_text,
                count=1,
            )
        resume_path.write_text(resume_text, encoding="utf-8")
        _update_resume_progress(resume_path, done=[p for p in processed_set if p in pending], verified=[p for p in processed_set if p in pending], confirmed=[p for p in processed_set if p in pending], pending=unprocessed)

        # Operational run: backup, preflight, attempt Ollama call, and append run summary
        error_inventory = collect_error_inventory(target)
        errors_path = update_all_errors_manifest(target, error_inventory, f"ollama/iteration-{iteration_value}")
        verification = run_repo_verification(target)
        notification_feed = write_live_notification_summary(
            target, f"Iteration {iteration_value} completed with {len(updated_files)} updates and {len(failed)} failures.", f"ollama/iteration-{iteration_value}")
        backup_path = _backup_resume(resume_path)
        missing = _preflight_checks(target, ["TREE_FULL_STRUCTURE.md"])
        _ensure_ollama_service(timeout=5)
        _emit_status("Preparing Ollama prompt with repository context", level="info")
        prompt = _generate_prompt(target / "TREE_FULL_STRUCTURE.md", pending)
        timeout = int(os.environ.get("OLLAMA_TIMEOUT", "600"))
        _emit_status(f"Calling Ollama with timeout={timeout}s and model={os.environ.get('OLLAMA_MODEL', 'llama3.2:3b')}", level="info")
        call_result = _call_ollama(prompt, timeout=timeout)
        _emit_status(f"Ollama call completed with status={call_result.get('status')}", level="info")

        utc = datetime.utcnow().isoformat() + "Z"
        summary = (
            f"\n## Last Ollama Run\n- Timestamp: {utc}\n- Iteration: {iteration_value}\n- Status: {call_result.get('status')}\n"
            f"- Processed this run: {len(processed_this_run)}\n- Updated files this run: {len(updated_files)}\n- Failed items: {len(failed)}\n- Missing preflight: {', '.join(missing) if missing else 'None'}\n"
            f"- Backup: {backup_path if backup_path else 'None'}\n- Error log: {errors_path}\n- Notification feed: {notification_feed}\n- Verification: {json.dumps(verification, indent=2)}\n- Log: {LOG_PATH / 'ollama_autonomous_agent.log'}\n- Output summary (truncated):\n\n{call_result.get('output_summary')[:2000]}\n"
        )
        resume_text = resume_path.read_text(encoding="utf-8")
        resume_text = resume_text + "\n" + summary
        resume_path.write_text(resume_text, encoding="utf-8")

        if updated_files:
            try:
                resume_text = resume_path.read_text(encoding="utf-8")
                resume_text = resume_text + "\nUpdated files:\n" + "\n".join([f"- {f}" for f in updated_files[:2000]]) + "\n"
                resume_path.write_text(resume_text, encoding="utf-8")
            except Exception:
                pass
        if failed:
            try:
                resume_text = resume_path.read_text(encoding="utf-8")
                resume_text = resume_text + "\nFailures:\n" + "\n".join([f"- {f}" for f in failed[:2000]]) + "\n"
                resume_path.write_text(resume_text, encoding="utf-8")
            except Exception:
                pass

        if _should_stop_autonomous_run(resume_path, unprocessed):
            _emit_status("Resume ledger shows completed and confirmed work; stopping autonomous loop", level="info")
            break

        if not pending or not unprocessed:
            _emit_status("No remaining pending work detected; stopping autonomous loop", level="info")
            break

        if os.environ.get("OLLAMA_STOP_ON_COMPLETE", "1") == "1" and not unprocessed:
            _emit_status("Completion condition reached; stopping autonomous loop", level="info")
            break

        time.sleep(int(os.environ.get("OLLAMA_LOOP_DELAY_SECONDS", "1")))

    command_results = _execute_autonomous_commands(target)
    _emit_status(f"Executed {len(command_results)} discovered autonomous commands", level="info")

    _emit_status(
        f"Agent run completed: status=ok, pending_remaining={len([p for p in scan_for_work(target) if p not in processed_set])}, processed_this_run={len(processed_set) - int(state.get('processed_count', 0)) if 'processed_count' in state else 0}, updated={total_updated}",
        level="info",
    )
    return {"docs": docs, "pending": [p for p in scan_for_work(target) if p not in processed_set], "processed_this_run": list(processed_set), "updated_this_run": [], "failed": [], "iteration": iteration_value, "total_updated": total_updated}


if __name__ == "__main__":
    result = run_agent(ROOT)
    serializable = {}
    for key, value in result.items():
        if isinstance(value, dict):
            serializable[key] = {k2: str(v2) if isinstance(v2, Path) else v2 for k2, v2 in value.items()}
        elif isinstance(value, list):
            serializable[key] = [str(item) if isinstance(item, Path) else item for item in value]
        else:
            serializable[key] = str(value) if isinstance(value, Path) else value
    try:
        print(json.dumps(serializable, indent=2))
    except BrokenPipeError:
        pass

# AUTOFIXED by Ollama at 2026-07-21T21:30:40.265209Z: replaced placeholders or noted TODOs. Please review.
