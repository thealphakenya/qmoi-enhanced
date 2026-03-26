// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""QMOI lint runner: runs Python linters (flake8/autoflake), attempts JS/TS eslint when Node present,
and emits machine-readable and human-readable reports.

This script is conservative: in local runs it prefers to emit patches or reports rather than apply large changes.
In CI (`--ci`) it can attempt safer autofix operations.
"""
from pathlib import Path
import subprocess
import json
import sys
import shlex

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / 'tools'
REPORT_JSON = TOOLS / 'qmoi_lint_report.json'
REPORT_MD = TOOLS / 'qmoi_lint_report.md'
PATCH_DIR = TOOLS / 'patches'

def run_cmd(cmd, cwd=ROOT):
    print('> ' + cmd)
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=str(cwd))
    return res.returncode, (res.stdout or '') + (res.stderr or '')

def run_python_linters(ci=False):
    results = {'flake8': None, 'autoflake': None}
    # flake8
    rc, out = run_cmd('flake8 --version')
    if rc == 0:
        rc, out = run_cmd('flake8 --exit-zero .')
        results['flake8'] = {'rc': rc, 'output': out}
    else:
        results['flake8'] = {'rc': None, 'output': 'flake8 not installed'}

    # autoflake for safe fixes (remove unused imports) - only in CI or when asked
    if ci:
        rc, out = run_cmd('autoflake --version')
        if rc == 0:
            # run autoflake in-place for safe fixes; conservative flags
            rc, out = run_cmd('autoflake --in-place --remove-unused-variables --remove-all-unused-imports -r .')
            results['autoflake'] = {'rc': rc, 'output': out}
        else:
            results['autoflake'] = {'rc': None, 'output': 'autoflake not installed'}
    else:
        results['autoflake'] = {'rc': None, 'output': 'skipped (local run)'}
    return results

def find_eslint_candidate():
    candidates = []
    local = ROOT / 'node_modules' / '.bin' / 'eslint'
    if local.exists():
        candidates.append(str(local))
    candidates.append('npm exec --no-install eslint')
    candidates.append('npx eslint')
    candidates.append('yarn eslint')
    return candidates

def run_js_linters(ci=False):
    results = {'eslint': None}
    candidates = find_eslint_candidate()
    for cand in candidates:
        rc, out = run_cmd(f"{cand} --version")
        if rc == 0:
            # run eslint --ext .js,.ts
            list_cmd = f"{cand} . --ext .js,.ts --format json"
            rc, out = run_cmd(list_cmd)
            results['eslint'] = {'rc': rc, 'output': out, 'candidate': cand}
            if ci and rc == 0:
                # attempt autofix in CI
                fix_cmd = f"{cand} . --ext .js,.ts --fix"
                rc2, out2 = run_cmd(fix_cmd)
                results['eslint_fix'] = {'rc': rc2, 'output': out2}
            break
    if results['eslint'] is None:
        results['eslint'] = {'rc': None, 'output': 'eslint not available locally; CI should run it'}
    return results

def write_reports(obj):
    TOOLS.mkdir(parents=True, exist_ok=True)
    with REPORT_JSON.open('w', encoding='utf-8') as fh:
        json.dump(obj, fh, indent=2)
    with REPORT_MD.open('w', encoding='utf-8') as fh:
        fh.write('# QMOI Lint Report\n\n')
        for k,v in obj.items():
            fh.write(f'## {k}\n\n')
            fh.write('OUTPUT:\n')
            fh.write(v.get('output',''))
            fh.write('\n\n')

def main():
    ci = '--ci' in sys.argv
    report = {'meta': {'ci': ci}}
    report['python'] = run_python_linters(ci=ci)
    report['javascript'] = run_js_linters(ci=ci)
    write_reports(report)
    print('Wrote', REPORT_JSON, REPORT_MD)

if __name__ == '__main__':
    main()
