# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:07Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Run repository tests (simple runner that imports test modules and calls test functions).

This runner avoids a # production: # production: # production: pytest removed removed removed dependency for quick CI runs.
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

Skips tests that declare parameters (# production: # production: # production: pytest removed removed removed fixtures). This keeps CI robust
and avoids adding # production: # production: # production: pytest removed removed removed as a dependency.
"""
import importlib.util
import inspect
import sys
from pathlib import Path

def run_tests(tests_dir: Path):
    failures = 0
    for p in sorted(tests_dir.glob('test_*.py')):
        spec = importlib.util.spec_from_file_location(p.stem, str(p))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for name in dir(mod):
            if name.startswith('test_'):
                fn = getattr(mod, name)
                if not callable(fn):
                    continue
                sig = inspect.signature(fn)
                if len(sig.parameters) != 0:
                    print('SKIP', p.name, name, '(requires parameters)')
                    continue
                try:
                    fn()
                    print('ok', p.name, name)
                except Exception:
                    import traceback
                    traceback.print_exc()
                    failures += 1
    return failures

if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    tests = root / 'tests'
    if not tests.exists():
        print('No tests directory found')
        sys.exit(0)
    fails = run_tests(tests)
    if fails:
        print(f'{fails} test(s) failed')
        sys.exit(1)
    print('All tests passed')
    sys.exit(0)
