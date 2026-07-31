#!/usr/bin/env python3
"""Run QMOI validation subsystems (artifact, links, placeholders)

Usage:
  python3 scripts/run_validations.py [--out docs/download_validation_report.json] [--root .] [--apply]

This script is intentionally conservative: it performs checks and writes reports in `docs/`.
If `--apply` is provided it will run link fixer with `--apply` and will call the placeholder scanner with `--apply`.
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def find_build_report(root: Path) -> Path:
    candidates = [root / 'qcity-artifacts' / 'qmoi_build_report.json',
                  root / 'qmoi-enhanced' / 'qcity-artifacts' / 'qmoi_build_report.json']
    for c in candidates:
        if c.exists():
            return c
    raise FileNotFoundError('qmoi_build_report.json not found in expected locations')

def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def validate_artifacts(report_path: Path, root: Path):
    j = json.loads(report_path.read_text(encoding='utf8'))
    platforms = j.get('platforms', {})
    results = {'generated': None, 'platforms': {}}
    for name, entry in platforms.items():
        artifact = entry.get('artifact')
        expected_sha = entry.get('sha256')
        rec = {'artifact': artifact, 'expected_sha256': expected_sha}
        if not artifact:
            rec['status'] = 'missing-declaration'
            results['platforms'][name] = rec
            continue
        art_path = (root / artifact).resolve()
        if not art_path.exists():
            rec['status'] = 'missing'
            results['platforms'][name] = rec
            continue
        actual_sha = sha256_of(art_path)
        size = art_path.stat().st_size
        rec['found_sha256'] = actual_sha
        rec['size_bytes'] = size
        rec['status'] = 'ok' if (expected_sha and expected_sha == actual_sha) else 'mismatch' if expected_sha else 'ok-no-expected'
        results['platforms'][name] = rec
    results['generated'] = __import__('datetime').datetime.utcnow().isoformat() + 'Z'
    return results

def run_link_validator(root: Path, out: Path, apply: bool = False):
    cmd = ['python3', str(root / 'scripts' / 'validate_and_fix_md.py'), '--out', str(out), '--root', str(root)]
    if apply:
        cmd.append('--apply')
    subprocess.run(cmd, check=False)

def run_placeholder_scanner(root: Path, out: Path, apply: bool = False):
    cmd = ['python3', str(root / 'scripts' / 'scan_replace_placeholders.py')]
    if apply:
        cmd.append('--apply')
    subprocess.run(cmd, check=False)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--out', default=str(ROOT / 'docs' / 'download_validation_report.json'))
    p.add_argument('--root', default=str(ROOT))
    p.add_argument('--apply', action='store_true')
    args = p.parse_args()

    root = Path(args.root)
    try:
        report_path = find_build_report(root)
    except FileNotFoundError as e:
        print(str(e))
        return

    print('Validating artifacts using', report_path)
    results = validate_artifacts(report_path, root)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(results, indent=2), encoding='utf8')
    print('Wrote', out_path)

    # Link validation (dry-run unless --apply)
    link_out = root / 'docs' / 'link_report.json'
    print('Running link validator (apply=%s)...' % args.apply)
    run_link_validator(root, link_out, apply=args.apply)

    # Placeholder scan
    print('Running placeholder scanner (apply=%s)...' % args.apply)
    run_placeholder_scanner(root, root / 'docs' / 'placeholders_report.json', apply=args.apply)

    print('\nValidation orchestration complete. Reports:')
    print(' -', out_path)
    print(' -', link_out)
    print(' -', root / 'docs' / 'placeholders_report.json')

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Orchestrator for QMOI validation systems

Runs a configurable pipeline consisting of:
 - placeholder scan (dry-run or scoped apply)
 - link and markdown validation (calls validate_and_fix_md.py)
 - artifact/download validation against qcity-artifacts/qmoi_build_report.json
 - memory and LION checks (lightweight, scaffolded)

Outputs JSON reports under docs/ and a combined `docs/qmoi_validation_report.json`.
"""

import subprocess
import json
import argparse
from pathlib import Path
import hashlib
import sys
import os
from datetime import datetime
import shutil

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / 'docs'
ARTIFACTS = ROOT / 'qmoi-enhanced' / 'qcity-artifacts'
BUILD_REPORT = ARTIFACTS / 'qmoi_build_report.json'
PLACEHOLDER_SCRIPT = ROOT / 'scripts' / 'scan_replace_placeholders.py'
MD_VALIDATOR = ROOT / 'scripts' / 'validate_and_fix_md.py'

DOCS.mkdir(parents=True, exist_ok=True)


def sha256_of(path: Path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()


def stat_size(path: Path):
    try:
        return path.stat().st_size
    except Exception:
        return None


def validate_artifacts():
    results = {}
    if not BUILD_REPORT.exists():
        print('No build report found at', BUILD_REPORT)
        return results
    data = json.loads(BUILD_REPORT.read_text())
    platforms = data.get('platforms', {})
    for name, entry in platforms.items():
        artifact_rel = entry.get('artifact')
        if not artifact_rel:
            results[name] = {'status': 'missing-declaration'}
            continue
        artifact_path = ROOT / artifact_rel
        exists = artifact_path.exists()
        rec = {'declared': entry, 'exists': exists}
        if exists:
            rec['computed_sha256'] = sha256_of(artifact_path)
            rec['computed_size'] = stat_size(artifact_path)
            declared_sha = entry.get('sha256')
            declared_size = entry.get('size_bytes')
            if declared_sha and rec['computed_sha256'] != declared_sha:
                rec['status'] = 'mismatch'
            else:
                rec['status'] = 'ok'
        else:
            rec['status'] = 'missing'
        results[name] = rec
    # write report
    out = DOCS / 'apps_validation_report.json'
    out.write_text(json.dumps(results, indent=2))
    return results


def run_md_validator(apply=False):
    out = DOCS / 'link_report.json'
    cmd = [sys.executable, str(MD_VALIDATOR), '--out', str(out), '--root', str(ROOT)]
    if apply:
        cmd.append('--apply')
    print('Running markdown validator:', ' '.join(cmd))
    try:
        subprocess.run(cmd, check=True)
        print('Markdown validation complete')
    except subprocess.CalledProcessError as e:
        print('Markdown validator failed:', e)


def run_placeholder_scan(apply=False):
    if not PLACEHOLDER_SCRIPT.exists():
        print('Placeholder script not found:', PLACEHOLDER_SCRIPT)
        return
    cmd = [sys.executable, str(PLACEHOLDER_SCRIPT)]
    if apply:
        cmd.append('--apply')
    print('Running placeholder scanner (apply=%s)' % apply)
    try:
        subprocess.run(cmd, check=True)
        print('Placeholder scan complete')
    except subprocess.CalledProcessError as e:
        print('Placeholder scan failed:', e)


def run_lion_checks():
    # Lightweight checks: presence of tools, existence of build report
    res = {'timestamp': datetime.utcnow().isoformat(), 'tools': {}}
    for tool in ['docker', 'jq', 'curl', 'tar', 'unzip']:
        res['tools'][tool] = bool(shutil.which(tool))
    res['build_report_present'] = BUILD_REPORT.exists()
    out = DOCS / 'lion_checks.json'
    out.write_text(json.dumps(res, indent=2))
    return res


def combined_report(artifact_results):
    rep = {
        'generated_at': datetime.utcnow().isoformat(),
        'artifacts': artifact_results
    }
    out = DOCS / 'qmoi_validation_report.json'
    out.write_text(json.dumps(rep, indent=2))
    print('Wrote combined validation report to', out)
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply-placeholders', action='store_true')
    parser.add_argument('--apply-md-fixes', action='store_true')
    parser.add_argument('--run-artifacts', action='store_true')
    parser.add_argument('--run-all', action='store_true')
    args = parser.parse_args()

    if args.run_all:
        args.run_artifacts = True

    if args.apply_placeholders:
        print('Applying placeholder replacements (repo-wide)')
        run_placeholder_scan(apply=True)
    else:
        run_placeholder_scan(apply=False)

    run_md_validator(apply=args.apply_md_fixes)

    artifact_results = {}
    if args.run_artifacts or args.run_all:
        artifact_results = validate_artifacts()
    combined_report(artifact_results)
    run_lion_checks()


if __name__ == '__main__':
    main()

# AUTOFIXED by Ollama at 2026-07-21T21:54:03.775632Z: replaced placeholders or noted TODOs. Please review.

# AUTOFIXED by Ollama at 2026-07-26T18:54:41.314850Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:34.347906Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:06.451799Z
