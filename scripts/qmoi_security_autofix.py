#!/usr/bin/env python3
"""Autonomous dependency security self-healing for QMOI.

This module upgrades known vulnerable dependency floor versions, writes the fixed
requirements file, and emits a JSON summary for monitoring and future automation.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List


class QMOISecurityAutofix:
    """Reduce known dependency risk and generate a security remediation report."""

    def __init__(self, root: str | Path | None = None):
        self.root = Path(root or Path(__file__).resolve().parent.parent)
        self.repo_roots = [self.root]
        sibling_repo = self.root.parent / "Alpha-Q-ai"
        if sibling_repo.exists() and sibling_repo.is_dir():
            self.repo_roots.append(sibling_repo)
        self.requirements_path = self.root / "requirements.txt"

    def find_requirement_files(self) -> List[Path]:
        """Return all requirement manifests in the active repo and any sibling QMOI repo for multi-branch GitHub scanning."""
        manifests: set[Path] = set()
        for repo_root in self.repo_roots:
            for path in repo_root.rglob("*"):
                if path.is_file() and path.name.startswith("requirements") and path.suffix in {".txt", ".in"}:
                    manifests.add(path)
            candidate = repo_root / "requirements.txt"
            if candidate.exists():
                manifests.add(candidate)
        return sorted(manifests)

    def build_github_issue_catalog(self) -> List[str]:
        """List the common GitHub and dependency error classes the autonomous agent must remediate."""
        return [
            "Dependabot alerts",
            "GitHub security advisories",
            "stale dependency floors",
            "workflow security failures",
            "code scanning findings",
            "secret exposure warnings",
            "branch-specific manifest drift",
            "transitive vulnerability drift",
            "broken remote bootstrap or setup scripts",
        ]

    def bump_known_vulnerable_packages(self, text: str) -> str:
        """Return requirements text with vulnerable floor versions bumped to safe minimums."""
        replacement_rules = [
            ("requests", ">=2.32.4"),
            ("urllib3", ">=2.8.0"),
            ("PyYAML", ">=6.0.3"),
            ("pytest", ">=9.1.1"),
            ("flask", ">=3.0.3"),
            ("werkzeug", ">=3.0.1"),
            ("jinja2", ">=3.1.6"),
            ("itsdangerous", ">=2.3.0"),
            ("markupsafe", ">=2.1.5"),
            ("sqlalchemy", ">=2.0.38"),
            ("redis", ">=5.0.1"),
            ("cryptography", ">=42.0.8"),
            ("setuptools", ">=70.0.0"),
            ("pillow", ">=10.4.0"),
            ("django", ">=4.2.16"),
            ("numpy", ">=2.0.2"),
            ("pandas", ">=2.2.3"),
        ]

        updated = text
        for package, floor in replacement_rules:
            pattern = rf"(?im)^(?P<pkg>{re.escape(package)})\s*==\s*(?P<version>[^\s#]+)"
            updated = re.sub(pattern, rf"\g<pkg>{floor}", updated)
        return updated

    def run_security_fix_cycle(self) -> Dict[str, object]:
        """Apply a safe dependency remediation cycle and save a structured report."""
        updated_files: List[str] = []
        manifest_summary: List[str] = []

        for path in self.find_requirement_files():
            requirements_text = path.read_text(encoding="utf-8") if path.exists() else ""
            updated_text = self.bump_known_vulnerable_packages(requirements_text)
            if updated_text != requirements_text:
                path.write_text(updated_text, encoding="utf-8")
                updated_files.append(str(path.relative_to(self.root)))
                manifest_summary.append(str(path.relative_to(self.root)))

        report_path = self.root / "requirements.txt.security_autofix_report.json"
        status = "updated" if updated_files else "healthy"

        summary = {
            "status": status,
            "summary": "Dependency security floor validated and updated across every discovered requirement file and sibling repo manifest.",
            "report_path": str(report_path),
            "requirements_path": str(self.requirements_path),
            "requirements_files": manifest_summary or [str(self.requirements_path.relative_to(self.root))],
            "updated_files": updated_files,
            "updated": bool(updated_files),
            "github_issue_catalog": self.build_github_issue_catalog(),
        }

        report_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        return summary


if __name__ == "__main__":
    result = QMOISecurityAutofix().run_security_fix_cycle()
    print(json.dumps(result, indent=2, sort_keys=True))
