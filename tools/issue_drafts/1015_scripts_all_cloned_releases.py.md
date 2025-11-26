---
title: "Issue draft for scripts/all_cloned_releases.py"
generated: 2025-11-08T16:06:38.959330Z
---

# Review needed: scripts/all_cloned_releases.py

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
Generate ALLCLONEDRELEASES.md from discovered markdown and platform data.

This is a safe, dry-run generator: it aggregates discovered platform PAYED
files, existing release notes and writes an audit JSON to
`.qmoi_validation/all_cloned_releases.json` and a markdown summary
`ALLCLONEDRELEASES.md` in repository root. It does not perform network calls.
"""
from pathlib import Path
import json
import re
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
VALID = ROOT / '.qmoi_validation'
VALID.mkdir(parents=True, exist_ok=True)

OUT_MD = ROOT / 'ALLCLONEDRELEASES.md'
OUT_JSON = VALID / 'all_cloned_releases.json'

# We will consider any *PAYED.md and any CHANGELOG* or RELEASE* files as release sources
md_files = list(ROOT.glob('**/*PAYED.md'))
release_files = list(ROOT.glob('**/CHANGELOG*')) + list(ROOT.glob('**/RELEASE*'))

def short_info(path: Path):
    text = path.read_text(encoding='utf-8', errors='ignore')
    # find a short header or first bullet
    m = re.search(r"^#\s*(.+)$", text, re.M)
    first = m.group(1).strip() if m else text.splitlines()[0][:120]
    lines = len(text.splitlines())
    return {'path': str(path.relative_to(ROOT)), 'header': first, 'lines': lines}

data = {
    'generated_at': datetime.utcnow().isoformat() + 'Z',
    'payed_files': [short_info(p) for p in md_files],
    'release_files': [short_info(p) for p in release_files]
}

OUT_JSON.write_text(json.dumps(data, indent=2), encoding='utf-8')

lines = [f"# ALL CLONED RELEASES\n", f"Generated: {data['generated_at']}", '', '## PAYED files:']
for p in data['payed_files']:
    lines.append(f"- {p['path']} — {p['header']} ({p['lines']} lines)")

lines.append('')
lines.append('## Release / Changelog files:')
for r in data['release_files']:
    lines.append(f"- {r['path']} — {r['header']} ({r['lines']} lines)")

lines.append('')
lines.append('> NOTE: This file is generated in dry-run mode; run domain assigment and provisioning separately with explicit approval.')

OUT_MD.write_text('\n'.join(li
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
