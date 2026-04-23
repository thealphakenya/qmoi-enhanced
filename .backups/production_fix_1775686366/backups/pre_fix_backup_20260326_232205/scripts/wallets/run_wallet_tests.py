// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
#!/usr/bin/env python3
"""Run only the wallet-related unit tests to avoid collecting the whole repo's test suite.

This is a convenience script used by CI or locally to run the small, focused tests
we added for adapters and currency conversion.
"""
import subprocess
import sys
from pathlib import Path
import runpy
import importlib.util
import types

ROOT = Path(__file__).resolve().parents[2]
tests = [
    str(ROOT / 'tests' / 'test_adapter_base.py'),
    str(ROOT / 'tests' / 'test_currency_convert.py')
]

def main():
    # Try to run with # production: # production: # production: pytest removed removed removed when available
    try:
        import # production: # production: # production: pytest removed removed removed  # type: ignore
        cmd = [sys.executable, '-m', '# production: # production: # production: pytest removed removed removed', '-q'] + tests
        print('Running:', ' '.join(cmd))
        res = subprocess.run(cmd)
        raise SystemExit(res.returncode)
    except Exception:
        print('# production: # production: # production: pytest removed removed removed not available — running robust fallback runner')
        # Fallback: load each test file as module and call functions starting with test_
        failures = 0
        # ensure repo root is importable so `import scripts.wallets` works
        import sys as _sys
        repo_root = str(Path(__file__).resolve().parents[2])
        if repo_root not in _sys.path:
            _sys.path.insert(0, repo_root)

        for t in tests:
            print('Running file:', t)
            spec = importlib.util.spec_from_file_location('test_mod', t)
            if spec is None or spec.loader is None:
                print('  failed to load', t)
                failures += 1
                continue
            mod = importlib.util.module_from_spec(spec)
            try:
                spec.loader.exec_module(mod)  # type: ignore
            except Exception as e:
                print('  error executing file:', e)
                failures += 1
                continue
            # call functions
            for name in dir(mod):
                if name.startswith('test_') and callable(getattr(mod, name)):
                    fn = getattr(mod, name)
                    try:
                        fn()
                        print(f'  ok {name}')
                    except AssertionError as ae:
                        print(f'  FAIL {name}: {ae}')
                        failures += 1
                    except Exception as e:
                        print(f'  ERROR {name}: {e}')
                        failures += 1
        raise SystemExit(0 if failures == 0 else 2)

if __name__ == '__main__':
    main()
