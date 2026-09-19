---
title: "Issue draft for scripts/run_validation.py"
generated: 2025-11-08T16:06:38.987068Z
---

# Review needed: scripts/run_validation.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.142664Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.142664Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.142664Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Run a suite of validation tools and collect a combined report.

By default this runs in dry-run mode: any suggested changes are written as proposals
into `.qmoi_validation/`. To apply changes pass `--apply` and set
`PRODUCTION_CONFIRMED=true` in the environment.
"""
import subprocess
import json
import os
from pathlib import Path
import time

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / '.qmoi_validation'
VALIDATION_DIR.mkdir(parents=True, exist_ok=True)

TOOLS = [
    {
        'name': 'ui-validator',
        'cmd': [str(ROOT / 'scripts' / 'validate_ui_components.py')]
    },
    {
        'name': 'doc-verifier',
        'cmd': ['node', str(ROOT / 'scripts' / 'qmoi-enhanced-doc-verifier.js')]
    }
]

def run_tool(tool, apply: bool = False):
    cmd = list(tool['cmd'])
    if apply:
        if cmd[0].endswith('.py'):
            cmd = [cmd[0], '--apply']
        else:
            cmd = cmd + ['--apply']

    print('Running', tool['name'], '->', ' '.join(cmd))
    try:
        res = subprocess.run(cmd, cwd=str(ROOT), capture_output=True, text=True, check=False)
        out = res.stdout + '\n' + res.stderr
        fn = VALIDATION_DIR / f'{tool["name"]}_output_{int(time.time())}.log'
        fn.write_text(out, encoding='utf-8')
        return {'name': tool['name'], 'rc': res.returncode, 'log': str(fn)}
    except Exception as e:
        return {'name': tool['name'], 'rc': 3, 'error': str(e)}

def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true', help='Apply suggested changes (requires PRODUCTION_CONFIRMED=true)')
    args = ap.parse_args()

    results = []
    for t in TOOLS:
        r = run_tool(t, apply=args.apply)
        results.append(r)

    summary = {
        'ranAt': __import__('datetime').datetime.utcnow().isoformat() + 'Z',
        'results': results
    }
    summary_file = VALIDATION_DIR / f'validation_summary_{int(time.time())}.json'
    summary_file.write_text(json.dumps(summary, indent=2
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
