---
title: "Issue draft for scripts/run_tests.py"
generated: 2025-11-08T16:06:38.986490Z
---

# Review needed: scripts/run_tests.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the PLACEHOLDER (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Run repository tests (simple runner that imports test modules and calls test functions).

This runner avoids a pytest dependency for quick CI runs.
"""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

TEST_MODULES = [
    'tests.test_task_queue',
    'tests.test_queue_worker',
]


def run_module(name):
    spec = importlib.util.spec_from_file_location(name, str(ROOT / (name.replace('.', '/') + '.py')))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    ok = True
    import inspect
    for attr in dir(mod):
        if attr.startswith('test_'):
            fn = getattr(mod, attr)
            if not callable(fn):
                continue
            sig = inspect.signature(fn)
            if len(sig.parameters) != 0:
                print('SKIP', name + '.' + attr, '(requires parameters)')
                continue
            try:
                fn()
                print('ok', name + '.' + attr)
            except AssertionError:
                print('FAILED', name + '.' + attr)
                ok = False
            except Exception as e:
                print('ERROR', name + '.' + attr, e)
                ok = False
    return ok


def main():
    overall = True
    for m in TEST_MODULES:
        print('Running', m)
        ok = run_module(m)
        overall = overall and ok
    if not overall:
        sys.exit(2)


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""Simple test runner: import each test module under tests/ and run zero-arg test_* functions.

Skips tests that declare parameters (pytest fixtures). This keeps CI lightweight
and avoids adding pytest as a dependency.
"""
import importlib.util
import inspect
import sys
from pathlib import Path


def run_tests(tests_dir: Path):
    failures = 0
    for p in sorted(tests_dir.glob('test_*.py')):
        spec = importlib.util.spec_from_file_location(p.stem, str(p))
        mod = importlib.util.module_
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
