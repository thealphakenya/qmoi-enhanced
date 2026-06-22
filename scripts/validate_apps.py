#!/usr/bin/env python3
"""Application manifest validator.

Scans the repository for common app manifest files (package.json, manifest.json,
app.json) and validates that they contain minimal required fields. Produces a
JSON report under .qmoi_validation/apps_report.json with details per manifest.

Usage: python scripts/validate_apps.py [--out PATH]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
VALIDATION_DIR.mkdir(exist_ok=True)


def find_manifests(root: Path) -> List[Path]:
    candidates = []
    for p in root.rglob('*'):
        if p.is_file() and p.name.lower() in {'package.json', 'manifest.json', 'app.json'}:
            if '.git' in p.parts:
                continue
            candidates.append(p)
    return candidates


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        return {"__parse_error": str(exc)}


def validate_package_json(data: Dict) -> Dict:
    issues = []
    if not isinstance(data, dict):
        return {"ok": False, "issues": ['not-a-json-object']}
    for key in ('name', 'version'):
        if key not in data:
            issues.append(f'missing:{key}')
    if 'scripts' not in data:
        issues.append('missing:scripts')
    return {"ok": len(issues) == 0, "issues": issues}


def validate_generic_manifest(data: Dict) -> Dict:
    issues = []
    if not isinstance(data, dict):
        return {"ok": False, "issues": ['not-a-json-object']}
    for key in ('name', 'version'):
        if key not in data:
            issues.append(f'missing:{key}')
    return {"ok": len(issues) == 0, "issues": issues}


def main(argv=None):
    parser = argparse.ArgumentParser(prog='validate_apps.py')
    parser.add_argument('--out', '-o', default=str(VALIDATION_DIR / 'apps_report.json'))
    args = parser.parse_args(argv)

    manifests = find_manifests(ROOT)
    results = []
    for m in manifests:
        data = load_json(m)
        if m.name.lower() == 'package.json':
            summary = validate_package_json(data)
        else:
            summary = validate_generic_manifest(data)
        results.append({"path": str(m.relative_to(ROOT)), "summary": summary})

    report = {"count": len(results), "manifests": results, "timestamp": __import__('datetime').datetime.utcnow().isoformat() + 'Z'}
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f"App manifest validation complete: checked={report['count']} -> {out_path}")


if __name__ == '__main__':
    main()
