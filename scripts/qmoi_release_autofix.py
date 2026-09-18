#!/usr/bin/env python3
"""Release and deployment guardrails for QMOI.

This module gives the project a safe, minimal, and reproducible release gate
for GitHub-hosted deployment and verification.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List


class QMOIReleaseAutofix:
    """Guard the release workflow and auto-heal repo metadata when it drifts."""

    REQUIRED_FILES = [
        "README.md",
        "BUILD.md",
        "INSTALL.md",
        "DOWNLOAD.md",
    ]

    def __init__(self, root: str | Path | None = None):
        self.root = Path(root or Path(__file__).resolve().parent.parent)
        self.package_json = self.root / "package.json"
        self.requirements_txt = self.root / "requirements.txt"

    def read_version(self) -> str:
        if not self.package_json.exists():
            return "0.0.0"
        try:
            data = json.loads(self.package_json.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return "0.0.0"
        return str(data.get("version", "0.0.0"))

    def build_release_report(self) -> Dict[str, Any]:
        required_status = {}
        for rel_path in self.REQUIRED_FILES:
            exists = (self.root / rel_path).exists()
            required_status[rel_path] = "ok" if exists else "missing"

        version = self.read_version()
        status = "healthy" if all(v == "ok" for v in required_status.values()) else "needs-review"

        return {
            "version": version,
            "required_files": {
                "status": "ok" if all(v == "ok" for v in required_status.values()) else "missing",
                "files": required_status,
            },
            "status": status,
            "root": str(self.root),
        }

    def ensure_vercel_configuration(self, create_if_missing: bool = True) -> Dict[str, Any]:
        vercel_path = self.root / "vercel.json"
        if vercel_path.exists():
            return {"created": False, "path": str(vercel_path)}
        if not create_if_missing:
            return {"created": False, "path": str(vercel_path), "skipped": True}

        config = {
            "version": 2,
            "builds": [{"src": "**/*.py", "use": "@vercel/python"}],
            "routes": [{"src": "/(.*)", "dest": "/$1"}],
        }
        vercel_path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
        return {"created": True, "path": str(vercel_path)}

    def scan_for_vulnerabilities(self) -> List[str]:
        issues: List[str] = []
        for rel_path in self.REQUIRED_FILES + ["requirements.txt", "package.json"]:
            file_path = self.root / rel_path
            if not file_path.exists():
                continue
            text = file_path.read_text(encoding="utf-8", errors="ignore")
            token_match = re.search(r"YOUR_[A-Z0-9_]*TOKEN", text)
            if token_match:
                issues.append(f"{rel_path}: placeholder token detected: {token_match.group(0)}")
            if "placeholder" in text.lower() and "token" in text.lower():
                issues.append(f"{rel_path}: placeholder secret detected: {token_match.group(0) if token_match else 'token'}")
        return issues

    def auto_fix_repo(self) -> Dict[str, Any]:
        package: Dict[str, Any] = {}
        if self.package_json.exists():
            try:
                package = json.loads(self.package_json.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                package = {}

        scripts = package.setdefault("scripts", {})
        scripts.setdefault("release:check", "python -m pytest -q")
        scripts.setdefault("deploy:vercel", "vercel --prod")
        scripts.setdefault("build", "python -m compileall .")
        package["scripts"] = scripts
        self.package_json.write_text(json.dumps(package, indent=2) + "\n", encoding="utf-8")

        fixes = ["updated package.json scripts"]
        vercel = self.ensure_vercel_configuration(create_if_missing=True)
        if vercel.get("created"):
            fixes.append("created vercel.json")
        return {"status": "ok", "fixes": fixes}


if __name__ == "__main__":
    result = QMOIReleaseAutofix().build_release_report()
    print(json.dumps(result, indent=2, sort_keys=True))
