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
        requirements_text = self.requirements_path.read_text(encoding="utf-8") if self.requirements_path.exists() else ""
        updated_text = self.bump_known_vulnerable_packages(requirements_text)
        report_path = self.root / "requirements.txt.security_autofix_report.json"

        status = "healthy"
        if updated_text != requirements_text:
            self.requirements_path.write_text(updated_text, encoding="utf-8")
            status = "updated"

        summary = {
            "status": status,
            "summary": "Dependency security floor validated and updated when vulnerable versions were detected.",
            "report_path": str(report_path),
            "requirements_path": str(self.requirements_path),
            "requirements_file": "requirements.txt",
            "updated": updated_text != requirements_text,
        }

        report_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
        return summary


if __name__ == "__main__":
    result = QMOISecurityAutofix().run_security_fix_cycle()
    print(json.dumps(result, indent=2, sort_keys=True))
