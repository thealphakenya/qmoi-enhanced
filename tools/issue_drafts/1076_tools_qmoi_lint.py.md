---
title: "Issue draft for tools/qmoi_lint.py"
generated: 2025-11-08T16:06:39.011316Z
---

# Review needed: tools/qmoi_lint.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
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
    candi
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
