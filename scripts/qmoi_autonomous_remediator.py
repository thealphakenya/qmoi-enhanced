#!/usr/bin/env python3
"""Deterministic repository remediation for trusted QMOI automation.

The remediator only applies package-manager fixes through the package manager,
validates edited files, and leaves an evidence report for anything it cannot
repair safely. It does not claim that arbitrary software defects can be fixed
without review.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any


IGNORED_PARTS = {".git", "node_modules", "__pycache__", ".venv", ".pytest_cache"}
PACKAGE_LOCK_NAMES = {"package-lock.json", "npm-shrinkwrap.json"}
PYTHON_FLOORS = {
    "requests>=2.31.0": "requests>=2.32.4",
    "PyYAML>=6.0.0": "PyYAML>=6.0.2",
}


@dataclass
class RemediationReport:
    applied: bool
    allow_major: bool
    package_managers: list[dict[str, Any]] = field(default_factory=list)
    validation: dict[str, Any] = field(default_factory=dict)
    unresolved: list[str] = field(default_factory=list)

    def write(self, destination: Path) -> None:
        destination.write_text(json.dumps(asdict(self), indent=2, sort_keys=True) + "\n", encoding="utf-8")


class QMOIAutonomousRemediator:
    """Apply bounded, reproducible dependency and file-integrity repairs."""

    def __init__(self, root: Path, apply: bool = False, allow_major: bool = False):
        self.root = root.resolve()
        self.apply = apply
        self.allow_major = allow_major
        self.report = RemediationReport(apply, allow_major)

    def _tracked_files(self) -> list[Path]:
        result = subprocess.run(
            ["git", "ls-files", "-z"], cwd=self.root, capture_output=True, check=True
        )
        paths = []
        for raw in result.stdout.split(b"\0"):
            if not raw:
                continue
            path = Path(raw.decode("utf-8"))
            if not any(part in IGNORED_PARTS for part in path.parts):
                paths.append(self.root / path)
        return paths

    def _package_directories(self, files: list[Path]) -> list[Path]:
        directories = {path.parent for path in files if path.name in PACKAGE_LOCK_NAMES}
        return sorted(directories)

    def remediate_packages(self, files: list[Path]) -> None:
        self.remediate_python_manifests(files)
        for directory in self._package_directories(files):
            command = ["npm", "audit", "fix", "--package-lock-only", "--ignore-scripts"]
            if self.allow_major:
                command.insert(3, "--force")
            if not self.apply:
                self.report.package_managers.append({"directory": str(directory.relative_to(self.root)), "command": command, "status": "dry_run"})
                continue
            result = subprocess.run(command, cwd=directory, capture_output=True, text=True, check=False)
            self.report.package_managers.append(
                {
                    "directory": str(directory.relative_to(self.root)),
                    "command": command,
                    "status": "completed" if result.returncode == 0 else "failed",
                    "returncode": result.returncode,
                    "output_tail": (result.stdout + result.stderr)[-2000:],
                }
            )

    def remediate_python_manifests(self, files: list[Path]) -> None:
        for path in files:
            if not path.name.startswith("requirements") or path.suffix != ".txt":
                continue
            original = path.read_text(encoding="utf-8")
            updated = original
            for old, new in PYTHON_FLOORS.items():
                updated = updated.replace(old, new)
            if updated != original:
                if self.apply:
                    path.write_text(updated, encoding="utf-8")
                    status = "updated"
                else:
                    status = "would_update"
                self.report.package_managers.append(
                    {
                        "directory": str(path.parent.relative_to(self.root)),
                        "file": str(path.relative_to(self.root)),
                        "status": status,
                        "changes": sorted(PYTHON_FLOORS),
                    }
                )

    def validate_files(self, files: list[Path]) -> None:
        counts = {"json_checked": 0, "python_checked": 0, "yaml_checked": 0, "text_checked": 0}
        errors: list[str] = []
        for path in files:
            suffix = path.suffix.lower()
            try:
                content = path.read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError) as exc:
                errors.append(f"{path.relative_to(self.root)}: {exc}")
                continue
            if suffix == ".json":
                counts["json_checked"] += 1
                try:
                    json.loads(content)
                except json.JSONDecodeError as exc:
                    errors.append(f"{path.relative_to(self.root)}: {exc}")
            elif suffix == ".py":
                counts["python_checked"] += 1
                try:
                    compile(content, str(path), "exec")
                except SyntaxError as exc:
                    errors.append(f"{path.relative_to(self.root)}: {exc}")
            elif suffix in {".yml", ".yaml"}:
                counts["yaml_checked"] += 1
                try:
                    import yaml

                    yaml.safe_load(content)
                except Exception as exc:  # parser implementations vary
                    errors.append(f"{path.relative_to(self.root)}: {exc}")
            elif suffix in {".js", ".mjs", ".cjs"}:
                counts["text_checked"] += 1
                result = subprocess.run(
                    ["node", "--check", str(path)],
                    cwd=self.root,
                    capture_output=True,
                    text=True,
                    check=False,
                )
                if result.returncode:
                    errors.append(f"{path.relative_to(self.root)}: {result.stderr.strip()}")
            elif suffix in {".ts", ".tsx", ".jsx", ".md", ".txt"}:
                counts["text_checked"] += 1
        self.report.validation = {**counts, "errors": errors}
        self.report.unresolved.extend(errors)

    def run(self) -> RemediationReport:
        files = self._tracked_files()
        self.remediate_packages(files)
        self.validate_files(files)
        return self.report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--apply", action="store_true", help="Apply package-manager repairs")
    parser.add_argument("--allow-major", action="store_true", help="Allow package-manager major upgrades")
    parser.add_argument("--report", type=Path, default=Path("ollamatracks/autonomous_remediation.json"))
    args = parser.parse_args()
    if args.allow_major and not args.apply:
        parser.error("--allow-major requires --apply")
    report = QMOIAutonomousRemediator(args.root, args.apply, args.allow_major).run()
    destination = args.root / args.report
    destination.parent.mkdir(parents=True, exist_ok=True)
    report.write(destination)
    print(json.dumps(asdict(report), indent=2, sort_keys=True))
    return 1 if report.unresolved else 0


if __name__ == "__main__":
    sys.exit(main())