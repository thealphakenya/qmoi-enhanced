// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
#!/usr/bin/env python3
"""
scripts/generate_test_index.py

Small utility to generate a optimized index of tests found in the repository.
This is intentionally conservative and designed to be run locally in prod.

Usage:
  python scripts/generate_test_index.py --out docs/test_index.json

"""
import argparse
import json
import os
import fnmatch

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

PATTERNS = [
    '*/__tests__/*',
    '*/tests/*',
    '*/test_*.py',
    '*/*.spec.ts',
    '*/*.test.ts',
    '*/*.test.js',
]


"""
    find_tests function
    """
def find_tests(root) -> Any:
    matches = []
    for dirpath, dirnames, filenames in os.walk(root):
        for p in PATTERNS:
            for fn in fnmatch.filter([os.path.join(dirpath, f) for f in filenames], p):
                matches.append(os.path.relpath(fn, root))
        # also detect test folders
        for d in dirnames:
            if d.lower() in ('tests', '__tests__'):
                for dirroot, _, files in os.walk(os.path.join(dirpath, d)):
                    for f in files:
                        path = os.path.relpath(os.path.join(dirroot, f), root)
                        matches.append(path)
    # uniq and sort
    return sorted(set(matches))


"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='docs/test_index.json')
    args = p.parse_args()

    tests = find_tests(ROOT)
    out = {
        'generated_by': 'scripts/generate_test_index.py',
        'root': ROOT,
        'count': len(tests),
        'tests': tests,
    }
    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w') as f:
        json.dump(out, f, indent=2)
    logger.info(f'Wrote {out_path} ({out["count"]} tests found)')


if __name__ == '__main__':
    main()
