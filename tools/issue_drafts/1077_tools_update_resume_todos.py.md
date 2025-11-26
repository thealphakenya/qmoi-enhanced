---
title: "Issue draft for tools/update_resume_todos.py"
generated: 2025-11-08T16:06:39.012694Z
---

# Review needed: tools/update_resume_todos.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""
Small helper to append progress entries into `resumetodos.txt`.

Usage:
  python3 tools/update_resume_todos.py --note "Completed scanner and updated md refs"

This keeps a chronological log of progress and can be used by the automated workflow
to mark items done in `resumetodos.txt`.
"""
import argparse
git add
git add

from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'resumetodos.txt'

def append_note(note: str):
    OUT.parent.mkdir(parents=True, exist_ok=True)
    stamp = datetime.utcnow().isoformat() + 'Z'
    line = f'[{stamp}] {note}\n'
    with OUT.open('a', encoding='utf-8') as f:
        f.write(line)
    print('Wrote to', OUT)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--note', required=True)
        args = p.parse_args()    args = p.parse_args()    args = p.parse_args()
    append_note(args.note)

if __name__ == '__main__':
    main()

```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
