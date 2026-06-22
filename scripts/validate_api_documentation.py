#!/usr/bin/env python3
"""API documentation validator.

Looks for OpenAPI/Swagger spec files (JSON/YAML) and performs lightweight
validation: ensures the document parses and contains `paths` and an `openapi`
or `swagger` version key. Writes a JSON report to
.qmoi_validation/api_docs_report.json.

Usage: python scripts/validate_api_documentation.py [--out PATH]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
VALIDATION_DIR.mkdir(exist_ok=True)


def find_spec_files(root: Path) -> List[Path]:
    specs = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.yaml', '.yml', '.json'}:
            name = p.name.lower()
            if any(k in name for k in ('openapi', 'openapi3', 'swagger', 'api')):
                specs.append(p)
    return specs


def load_spec(path: Path) -> Dict:
    try:
        if path.suffix.lower() in {'.yaml', '.yml'}:
            import yaml
            return yaml.safe_load(path.read_text(encoding='utf-8'))
        else:
            return json.loads(path.read_text(encoding='utf-8'))
    except Exception as exc:
        return {"__parse_error": str(exc)}


def validate_spec(obj: Dict) -> Dict:
    if not isinstance(obj, dict):
        return {"ok": False, "errors": ['not-a-mapping']}
    errors = []
    if not (('openapi' in obj) or ('swagger' in obj)):
        errors.append('missing:openapi_or_swagger_version')
    if 'paths' not in obj:
        errors.append('missing:paths')
    return {"ok": len(errors) == 0, "errors": errors}


def main(argv=None):
    parser = argparse.ArgumentParser(prog='validate_api_documentation.py')
    parser.add_argument('--out', '-o', default=str(VALIDATION_DIR / 'api_docs_report.json'))
    args = parser.parse_args(argv)

    specs = find_spec_files(ROOT)
    results = []
    for s in specs:
        doc = load_spec(s)
        if '__parse_error' in doc:
            results.append({"path": str(s.relative_to(ROOT)), "ok": False, "errors": [doc['__parse_error']]})
            continue
        summary = validate_spec(doc)
        results.append({"path": str(s.relative_to(ROOT)), **summary})

    report = {"count": len(results), "specs": results, "timestamp": __import__('datetime').datetime.utcnow().isoformat() + 'Z'}
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f"API docs validation complete: checked={report['count']} -> {out_path}")


if __name__ == '__main__':
    main()
