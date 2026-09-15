---
title: "Issue draft for scripts/run_unit_tests.py"
generated: 2025-11-08T16:06:38.986757Z
---

# Review needed: scripts/run_unit_tests.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its placeholder markers or TODOs.
- If the file is safe for production, remove the placeholder and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""
Simple test runner for small local tests without pytest installed.
It imports `tests.test_billing_guard` and runs any callables whose name
starts with 'test_'.
"""
import runpy
import sys
from pathlib import Path


def run_tests_from_path(path: Path) -> int:
    # ensure the repository root is on sys.path so `import scripts.*` works
    ROOT = Path(__file__).resolve().parents[1]
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    # execute the test file as a module and collect callables named test_*
    ns = runpy.run_path(str(path), run_name='__main__')
    failures = 0
    for name, obj in ns.items():
        if name.startswith('test_') and callable(obj):
            try:
                obj()
                print(f'PASS: {name}')
            except Exception as e:
                failures += 1
                print(f'FAIL: {name} -> {e}')
    return failures


if __name__ == '__main__':
    ROOT = Path(__file__).resolve().parents[1]
    tests_dir = ROOT / 'tests'
    if not tests_dir.exists():
        print('No tests/ directory at', tests_dir)
        sys.exit(1)

    total_failures = 0
    # run every python file in tests/ that does not start with underscore
    for p in sorted(tests_dir.glob('test_*.py')):
        print('\nRunning', p.name)
        failures = run_tests_from_path(p)
        total_failures += failures

    if total_failures:
        print(f'{total_failures} test(s) failed')
        sys.exit(2)
    print('All tests passed')

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
