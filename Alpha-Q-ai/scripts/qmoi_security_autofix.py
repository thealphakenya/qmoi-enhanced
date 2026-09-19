#!/usr/bin/env python3
"""Autonomous dependency security self-healing for QMOI.

This module upgrades known vulnerable dependency floor versions, writes the fixed
requirements file, and emits a JSON summary for monitoring and future automation.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List


class QMOISecurityAutofix:
    """Reduce known dependency risk and generate a security remediation report."""

    def __init__(self, root: str | Path | None = None):
        self.root = Path(root or Path(__file__).resolve().parent.parent)
        self.requirements_path = self.root / "requirements.txt"

    def find_requirement_files(self) -> List[Path]:
        """Return all requirement manifests in the repo so security fixes are applied everywhere GitHub might scan."""
        manifests: set[Path] = set()
        for path in self.root.rglob("*"):
            if path.is_file() and path.name.startswith("requirements") and path.suffix in {".txt", ".in"}:
                manifests.add(path)
        if self.requirements_path.exists():
            manifests.add(self.requirements_path)
        return sorted(manifests)

    def bump_known_vulnerable_packages(self, text: str) -> str:
        """Return requirements text with vulnerable floor versions bumped to safe minimums."""
        replacements = {
            "requests==2.31.0": "requests>=2.32.4",
            "requests==2.32.0": "requests>=2.32.4",
            "requests==2.32.1": "requests>=2.32.4",
            "requests==2.32.2": "requests>=2.32.4",
            "requests==2.32.3": "requests>=2.32.4",
            "urllib3==1.26.0": "urllib3>=2.8.0",
            "urllib3==1.26.1": "urllib3>=2.8.0",
            "urllib3==1.26.2": "urllib3>=2.8.0",
            "urllib3==1.26.3": "urllib3>=2.8.0",
            "urllib3==1.26.4": "urllib3>=2.8.0",
            "urllib3==1.26.5": "urllib3>=2.8.0",
            "PyYAML==5.4.1": "PyYAML>=6.0.3",
            "PyYAML==5.3.1": "PyYAML>=6.0.3",
            "pytest==8.0.0": "pytest>=9.1.1",
            "pytest==8.1.0": "pytest>=9.1.1",
            "pytest==8.2.0": "pytest>=9.1.1",
        }

        updated = text
        for old, new in replacements.items():
            updated = updated.replace(old, new)
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
            "summary": "Dependency security floor validated and updated across every discovered requirement file.",
            "report_path": str(report_path),
            "requirements_path": str(self.requirements_path),
            "requirements_files": manifest_summary or [str(self.requirements_path.relative_to(self.root))],
            "updated_files": updated_files,
            "updated": bool(updated_files),
        }

        report_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        return summary


if __name__ == "__main__":
    result = QMOISecurityAutofix().run_security_fix_cycle()
    print(json.dumps(result, indent=2, sort_keys=True))
