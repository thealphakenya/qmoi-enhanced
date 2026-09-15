#!/usr/bin/env python3
"""Reproducible, evidence-based QMOI model comparison contract."""

from __future__ import annotations

import argparse
import json
import platform
import sys
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class Evaluation:
    name: str
    passed: bool
    score: float
    details: str


def evaluate_runtime() -> Evaluation:
    started = time.perf_counter()
    payload = {"platform": platform.platform(), "python": sys.version.split()[0]}
    elapsed = time.perf_counter() - started
    return Evaluation("runtime_integrity", bool(payload["platform"] and payload["python"]), max(0.0, 1.0 - elapsed), "runtime metadata collected")


def evaluate_seed(seed_path: Path) -> Evaluation:
    exists = seed_path.is_file()
    size = seed_path.stat().st_size if exists else 0
    return Evaluation("portable_seed", exists and size < 5 * 1024 * 1024, 1.0 if exists and size < 5 * 1024 * 1024 else 0.0, f"seed_bytes={size}")


def evaluate_docs(root: Path) -> Evaluation:
    required = ["MODEL_CARD.md", "QMOI_MODEL_CARD.md", "QVS.md", "QMOIMODEL.md", "QMOIMODELTESTS.md"]
    missing = [name for name in required if not (root / name).is_file()]
    return Evaluation("model_documentation", not missing, 1.0 if not missing else 0.0, f"missing={missing}")


def run_evaluation(root: Path) -> dict[str, Any]:
    evaluations = [evaluate_runtime(), evaluate_seed(root / "scripts" / "qmoi_seed.py"), evaluate_docs(root)]
    passed = all(item.passed for item in evaluations)
    return {
        "status": "passed" if passed else "review_required",
        "claim": "QMOI is evaluated on reproducible repository/runtime contracts; no universal superiority claim is made without comparable benchmark evidence.",
        "evaluations": [asdict(item) for item in evaluations],
        "score": sum(item.score for item in evaluations) / len(evaluations),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--output", type=Path, default=None)
    args = parser.parse_args()
    result = run_evaluation(args.root.resolve())
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0 if result["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
