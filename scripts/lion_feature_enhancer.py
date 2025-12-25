
"""Minimal Lion feature enhancer shim for tests.

Exports:
- `scan_for_lion(root)` -> dict
- `make_recommendations(found)` -> dict
- `main(args)` -> int (writes minimal artifacts)

This module is intentionally tiny and deterministic for unit tests.
"""
from __future__ import annotations
from pathlib import Path
from typing import Dict

import json
"""Minimal Lion feature enhancer shim for tests.

Exports:
- `scan_for_lion(root)` -> dict
- `make_recommendations(found)` -> dict
- `main(args)` -> int (writes minimal artifacts)

This module is intentionally tiny and deterministic for unit tests.
"""


def scan_for_lion(root: Path) -> Dict[str, dict]:
    root = Path(root)
    found: Dict[str, dict] = {}
    for p in root.rglob("*.md"):
        try:
            txt = p.read_text(encoding="utf-8")
            if "lion" in txt.lower() or "lion" in p.name.lower():
                found[str(p)] = {"snippet": txt[:200]}
        except Exception:
            continue
    return found


def make_recommendations(found: Dict[str, dict]) -> Dict[str, dict]:
    recs: Dict[str, dict] = {}
    for k, v in found.items():
        snippet = v.get("snippet", "")
        recommendations = [
            "Add validation and input sanitization",
            "Add runbook and safety checks",
        ]
        if "production" in snippet.lower():
            recommendations.append("Add backup and disaster recovery plans")
        confidence = "low"
        if "production" in snippet.lower() or "monitor" in snippet.lower():
            confidence = "high"
        recs[k] = {"recommendations": recommendations, "confidence": confidence}
    return recs


def main(args=None) -> int:
    root = Path(getattr(args, "root", "."))
    out = root / ".qmoi_validation"
    out.mkdir(parents=True, exist_ok=True)
    summary = {"checked": True, "items": []}
    (out / "lion_feature_enhancer.json").write_text(json.dumps(summary))
    stub = out / "lion_runbook_stub.md"
    stub.write_text("# Runbook stub\n\nThis runbook outlines steps and safety checks.", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
    for p in root.rglob("*.md"):
