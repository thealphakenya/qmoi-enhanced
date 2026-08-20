#!/usr/bin/env python3
"""Validate GitHub workflow contracts and emit hosted-test evidence."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict

import yaml


SCHEMA = "qsteps-v1"


def job_is_observer(job: Dict[str, Any]) -> bool:
    """API-only jobs may omit checkout and manager execution by design."""
    text = json.dumps(job, sort_keys=True).lower()
    return "actions/github-script" in text and "actions/checkout" not in text


def validate(workflow_dir: Path) -> Dict[str, Any]:
    workflows = []
    errors = []
    for path in sorted(workflow_dir.glob("*.y*ml")):
        try:
            document = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        except (OSError, yaml.YAMLError) as exc:
            errors.append({"file": str(path), "error": str(exc)})
            continue
        if document.get("env", {}).get("QSTEPS_MANAGER") != SCHEMA:
            errors.append({"file": str(path), "error": "missing qsteps-v1"})
        jobs = document.get("jobs") or {}
        if not jobs:
            errors.append({"file": str(path), "error": "no jobs"})
        for name, job in jobs.items():
            if not isinstance(job, dict):
                errors.append({"file": str(path), "job": name, "error": "job is not a mapping"})
                continue
            steps = job.get("steps") or []
            text = json.dumps(steps, sort_keys=True)
            checkout = "actions/checkout@" in text
            manager = "qsteps_manager.py" in text
            observer = job_is_observer(job)
            if checkout and not manager:
                errors.append({"file": str(path), "job": name, "error": "checkout job missing qsteps manager"})
            workflows.append({
                "file": str(path), "job": name,
                "classification": "observer" if observer else "repository-execution",
                "checkout": checkout, "manager": manager,
                "always_evidence": "if: always()" in text,
            })
    return {
        "schema": SCHEMA,
        "workflow_count": len({item["file"] for item in workflows}),
        "job_count": len(workflows),
        "repository_jobs": sum(item["classification"] == "repository-execution" for item in workflows),
        "observer_jobs": sum(item["classification"] == "observer" for item in workflows),
        "errors": errors,
        "ready_for_github": not errors,
        "workflows": workflows,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workflow-dir", type=Path, default=Path(".github/workflows"))
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()
    report = validate(args.workflow_dir)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if report["ready_for_github"] else 1


if __name__ == "__main__":
    raise SystemExit(main())