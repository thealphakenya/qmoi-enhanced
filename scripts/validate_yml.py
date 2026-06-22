#!/usr/bin/env python3
"""YAML syntax and manifest validator.

Parses all YAML files under the repository (excluding common vendor dirs) and
reports parsing errors and basic structural observations. Writes
.qmoi_validation/yml_report.json with per-file results.

Usage: python scripts/validate_yml.py [--out PATH]
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
VALIDATION_DIR.mkdir(exist_ok=True)


def find_yaml_files(root: Path) -> List[Path]:
    out = []
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.yml', '.yaml'}:
            if any(part in ('.git', 'node_modules', '.venv', 'venv') for part in p.parts):
                continue
            out.append(p)
    return out


def try_parse_yaml(path: Path) -> Dict:
    try:
        import yaml
    except Exception as exc:
        return {"ok": False, "error": f"PyYAML not installed: {exc}"}
    try:
        data = yaml.safe_load(path.read_text(encoding='utf-8'))
        return {"ok": True, "type": type(data).__name__}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


def main(argv=None):
    parser = argparse.ArgumentParser(prog='validate_yml.py')
    parser.add_argument('--out', '-o', default=str(VALIDATION_DIR / 'yml_report.json'))
    args = parser.parse_args(argv)

    files = find_yaml_files(ROOT)
    results = []
    for f in files:
        res = try_parse_yaml(f)
        results.append({"path": str(f.relative_to(ROOT)), **res})

    report = {"count": len(results), "files": results, "timestamp": __import__('datetime').datetime.utcnow().isoformat() + 'Z'}
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f"YAML validation complete: checked={report['count']} -> {out_path}")


if __name__ == '__main__':
    main()
