#!/usr/bin/env python3
"""Central QMOI orchestration service.

This service scans the active repo and archived history for orchestration-related
files and produces a ranked inventory plus a recommended action backlog. It is
intentionally conservative: it only reads files and writes local JSON state, and
it does not perform external deployments or network actions by default.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TARGETS = [ROOT, ROOT / "qmoi-enhanced-history-14"]
SKIP_DIRS = {".git", ".venv", "venv", "node_modules", "__pycache__", ".pytest_cache", ".mypy_cache", ".idea", ".vscode"}


def _name_to_domain(name: str) -> str:
    lower = name.lower()
    if "network" in lower or "vpn" in lower or "mask" in lower:
        return "network-security"
    if "workflow" in lower or "monitor" in lower or "activity" in lower or "tracker" in lower:
        return "workflow-monitoring"
    if "agent" in lower or "ollama" in lower:
        return "autonomous-agent"
    if "security" in lower or "dependabot" in lower or "audit" in lower:
        return "security"
    if "release" in lower or "build" in lower or "deploy" in lower:
        return "release-build"
    if "style" in lower or "theme" in lower or "ui" in lower:
        return "styling-ui"
    if "sync" in lower or "merge" in lower or "branch" in lower:
        return "sync-merge"
    return "core-orchestration"


def _capabilities_from_name(name: str) -> List[str]:
    lower = name.lower()
    caps: List[str] = []
    if "orchestrator" in lower:
        caps.append("orchestration")
    if "agent" in lower:
        caps.append("autonomy")
    if "monitor" in lower:
        caps.append("monitoring")
    if "workflow" in lower:
        caps.append("workflow-routing")
    if "security" in lower:
        caps.append("security-gates")
    if "stream" in lower:
        caps.append("live-stream")
    if "sync" in lower:
        caps.append("repo-sync")
    if "network" in lower or "vpn" in lower:
        caps.append("network-routing")
    if not caps:
        caps.append("generic")
    return caps


def discover_orchestrators(targets: List[Path]) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    seen = set()

    for target in targets:
        if not target.exists():
            continue
        for path in sorted(target.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(target)
            if any(part in SKIP_DIRS for part in rel.parts[:2]):
                continue
            lower = path.name.lower()
            if lower.endswith((".py", ".js", ".yml", ".yaml", ".md")):
                keywords = ["orchestrator", "autonomous", "agent", "monitor", "workflow", "security", "network", "style", "sync", "stream", "release"]
                if not any(keyword in lower for keyword in keywords):
                    continue
                key = str(path)
                if key in seen:
                    continue
                seen.add(key)

                name = path.name
                item = {
                    "name": name,
                    "path": str(path.relative_to(ROOT)),
                    "domain": _name_to_domain(name),
                    "capabilities": _capabilities_from_name(name),
                    "status": "discovered",
                    "readiness": "needs-validation",
                }
                items.append(item)

    items.sort(key=lambda x: (x["domain"], x["name"]))
    return items


def build_backlog(orchestrators: List[Dict[str, Any]]) -> List[str]:
    backlog = [
        "Register every discovered orchestrator in one central manifest with health and owner metadata.",
        "Create a continuous capability matrix linking orchestrators to runtime requirements and fallback runners.",
        "Add a validation gate for each orchestrator before merge or production deployment.",
        "Unify workflow, monitor, and live stream activity into a single health model.",
        "Integrate security checks into all orchestration execution paths.",
        "Ensure network, VPN, and mask states are validated before sensitive automation tasks run.",
        "Align QVS trust decisions with orchestration risk scoring.",
        "Refresh STYLES.md and UNIVERSALS.md automatically with each orchestrator state change.",
        "Keep repo sync and merge operations inside the same orchestration state machine.",
        "Add a runtime resume checkpoint every time a critical orchestrator completes or fails.",
        "Guarantee that Ollama autonomous agent tasks are always represented in the registry.",
        "Add drift detection so stale docs, workflows, and scripts are detected automatically.",
        "Create a ranked backlog per orchestrator, not just a single global list.",
        "Standardize event payloads for live activity streams and monitor dashboards.",
        "Add a fallback route when the primary GitHub-hosted path is unavailable.",
        "Treat security, privacy, and release safety as hard orchestration constraints.",
        "Synchronize historical archive orchestrators with active orchestrators without losing context.",
        "Add an evidence log for every action and every validation result.",
        "Ensure the service writes machine-readable artifacts used by monitoring and automation.",
        "Keep user-specific styling personalization active without exposing unsafe identity data.",
        "Continue the self-healing loop until the repo is back to a stable, validated state.",
    ]
    return backlog


def main() -> None:
    parser = argparse.ArgumentParser(description="QMOI central orchestrator service")
    parser.add_argument("--write", action="store_true", help="Write registry and backlog to .qmoi/")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output")
    args = parser.parse_args()

    orchestrators = discover_orchestrators(DEFAULT_TARGETS)
    payload = {
        "generated_by": "scripts/qmoi_orchestrator_service.py",
        "root": str(ROOT),
        "orchestrators": orchestrators,
        "backlog": build_backlog(orchestrators),
        "summary": {
            "total_orchestrators": len(orchestrators),
            "domains": sorted({item["domain"] for item in orchestrators}),
        },
    }

    if args.write:
        out_dir = ROOT / ".qmoi"
        out_dir.mkdir(exist_ok=True)
        registry = out_dir / "orchestration_registry.json"
        registry.write_text(json.dumps(payload, indent=2 if args.pretty else None), encoding="utf-8")
        print(f"Wrote orchestration registry to {registry}")

    json_dump = json.dumps(payload, indent=2 if args.pretty else None)
    print(json_dump)


if __name__ == "__main__":
    main()
