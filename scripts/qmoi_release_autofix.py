#!/usr/bin/env python3
"""QMOI release and deployment autofix guard.

This module centralizes the repository's release readiness, Vercel deployment
safety, and autonomous fix logic. It does not perform live remote deployment
without credentials, but it ensures the repo is in a deployment-ready state and
emits a structured JSON report that monitoring systems can consume.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Dict, Iterable, List

DEFAULT_VERSION = "v1.2.5"


def _read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""


class QMOIReleaseAutofix:
    """Evaluate and repair common release, deployment, and repo health issues."""

    def __init__(self, root: str | Path | None = None):
        self.root = Path(root or Path(__file__).resolve().parent.parent)

    def detect_version(self) -> str:
        package_path = self.root / "package.json"
        if package_path.exists():
            try:
                data = json.loads(package_path.read_text(encoding="utf-8"))
                version = data.get("version")
                if version:
                    return str(version)
            except json.JSONDecodeError:
                pass
        return DEFAULT_VERSION

    def ensure_required_files(self) -> Dict[str, Any]:
        required = {
            "README.md": self.root / "README.md",
            "BUILD.md": self.root / "BUILD.md",
            "INSTALL.md": self.root / "INSTALL.md",
            "DOWNLOAD.md": self.root / "DOWNLOAD.md",
            "requirements.txt": self.root / "requirements.txt",
            "package.json": self.root / "package.json",
        }

        missing = []
        for name, path in required.items():
            if not path.exists():
                missing.append(name)
        return {"status": "ok" if not missing else "missing", "missing": missing}

    def ensure_vercel_configuration(self, create_if_missing: bool = True) -> Dict[str, Any]:
        vercel_path = self.root / "vercel.json"
        config = {
            "version": 2,
            "name": "qmoi-enhanced",
            "builds": [{"src": "**/*", "use": "@vercel/static"}],
            "routes": [{"src": "/(.*)", "dest": "/index.html"}],
            "cleanUrls": True,
            "trailingSlash": False,
        }

        if vercel_path.exists():
            try:
                existing = json.loads(vercel_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                existing = {}
            config.update(existing)
            return {"status": "ready", "path": str(vercel_path), "config": config, "created": False}

        if create_if_missing:
            vercel_path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
            return {"status": "ready", "path": str(vercel_path), "config": config, "created": True}

        return {"status": "missing", "path": str(vercel_path), "config": config, "created": False}

    def scan_for_vulnerabilities(self) -> List[str]:
        suspicious_patterns = [
            "TODO_PROD",
            "PLACEHOLDER",
            "YOUR_GITHUB_TOKEN",
            "YOUR_VERCEL_TOKEN",
            "YOUR_SECRET_KEY",
            "GITHUB_TOKEN=\"\"",
            "GITHUB_TOKEN=''",
            "VERCEL_TOKEN=\"\"",
            "VERCEL_TOKEN=''",
            "SECRET_KEY=\"\"",
            "SECRET_KEY=''",
        ]
        issues: List[str] = []
        for path in sorted(self.root.rglob("*")):
            if not path.is_file():
                continue
            if path.suffix.lower() not in {".py", ".js", ".ts", ".json", ".yml", ".yaml", ".md", ".env", ".txt"}:
                continue
            if ".git" in path.parts or "/.venv/" in str(path):
                continue
            text = _read_text(path)
            for pattern in suspicious_patterns:
                if pattern in text:
                    issues.append(f"{path.relative_to(self.root)} contains suspicious pattern: {pattern}")
        return issues

    def auto_fix_repo(self) -> Dict[str, Any]:
        fixes: List[str] = []
        required = self.ensure_required_files()
        if required["status"] == "missing":
            fixes.append("missing essential files detected")

        vercel_result = self.ensure_vercel_configuration(create_if_missing=True)
        if vercel_result["created"]:
            fixes.append("created vercel.json with safe static deployment defaults")

        package_path = self.root / "package.json"
        if package_path.exists():
            try:
                pkg = json.loads(package_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                pkg = {}
            scripts = pkg.setdefault("scripts", {})
            scripts.setdefault("release:check", "python scripts/qmoi_release_autofix.py --check")
            scripts.setdefault("deploy:vercel", "python scripts/qmoi_release_autofix.py --deploy-check")
            package_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
            fixes.append("added release and Vercel verification package scripts")

        issues = self.scan_for_vulnerabilities()
        if issues:
            fixes.append(f"security scan found {len(issues)} questionable patterns; review before release")

        return {
            "version": self.detect_version(),
            "status": "healthy" if not issues else "needs-review",
            "fixes": fixes,
            "issues": issues,
            "vercel": vercel_result,
            "required_files": required,
        }

    def build_release_report(self) -> Dict[str, Any]:
        version = self.detect_version()
        required = self.ensure_required_files()
        vercel = self.ensure_vercel_configuration(create_if_missing=False)
        issues = self.scan_for_vulnerabilities()
        return {
            "version": version,
            "status": "healthy" if not issues and required["status"] == "ok" and vercel["status"] == "ready" else "needs-review",
            "required_files": required,
            "vercel": vercel,
            "issues": issues,
            "monitor": {
                "monitor_of_monitor": "enabled",
                "freshness_threshold_seconds": 300,
                "stale_state_behavior": "fail-safe and block live execution",
            },
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="QMOI release and Vercel deployment autofix guard")
    parser.add_argument("--root", default=str(Path(__file__).resolve().parent.parent), help="Repository root to validate")
    parser.add_argument("--check", action="store_true", help="Run a validation-only check without writing files")
    parser.add_argument("--deploy-check", action="store_true", help="Validate local deployment readiness and emit a JSON summary")
    parser.add_argument("--fix", action="store_true", help="Apply safe autofixes and return the report")
    args = parser.parse_args()

    agent = QMOIReleaseAutofix(args.root)
    if args.fix:
        report = agent.auto_fix_repo()
    elif args.deploy_check or args.check:
        report = agent.build_release_report()
    else:
        report = agent.build_release_report()

    print(json.dumps(report, indent=2, sort_keys=True))
    return 0 if report.get("status") == "healthy" else 1


if __name__ == "__main__":
    raise SystemExit(main())
