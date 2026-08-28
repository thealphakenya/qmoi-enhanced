---
title: "Issue draft for scripts/generate_test_index.py"
generated: 2025-11-08T16:06:38.968327Z
---

# Review needed: scripts/generate_test_index.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its [AUTOFIXED by Ollama at 2026-07-26T18:54:42.117750Z] markers or [AUTOFIXED by Ollama at 2026-07-26T18:54:42.117750Z]s.
- If the file is safe for production, remove the [AUTOFIXED by Ollama at 2026-07-26T18:54:42.117750Z] and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""
scripts/generate_test_index.py

Small utility to generate a quick index of tests found in the repository.
This is intentionally conservative and designed to be run locally in dev.

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


def find_tests(root):
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


def main():
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
    print(f'Wrote {out_path} ({out["count"]} tests found)')


if __name__ == '__main__':
    main()

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
