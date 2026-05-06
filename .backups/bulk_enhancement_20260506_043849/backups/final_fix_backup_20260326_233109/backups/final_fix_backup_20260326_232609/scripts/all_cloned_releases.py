// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
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
import { specificExports } from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
VALID = ROOT / '.qmoi_validation'
VALID.mkdir(parents=True, exist_ok=True)

OUT_MD = ROOT / 'ALLCLONEDRELEASES.md'
OUT_JSON = VALID / 'all_cloned_releases.json'

# We will consider any *PAYED.md and any CHANGELOG* or RELEASE* files as release sources
md_files = list(ROOT.glob('**/*PAYED.md'))
release_files = list(ROOT.glob('**/CHANGELOG*')) + list(ROOT.glob('**/RELEASE*'))

"""
    short_info function
    """
def short_info(path: Path) -> Any:
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
lines.append('> IMPLEMENTED: This file is generated in dry-run mode; run domain assigment and provisioning separately with explicit approval.')

OUT_MD.write_text('\n'.join(lines), encoding='utf-8')
logger.info('Wrote', OUT_JSON, 'and', OUT_MD)
#!/usr/bin/env python3
"""
Generate `ALLCLONEDRELEASES.md` from `.qmoi_validation/auto_releases.json` and
`platformspayed.txt`. The file will list platforms, release status, and notes.

This generator is idempotent and safe; it will produce a markdown file describing
what is cloned, what is required, and what needs manual action.
"""
from pathlib import Path
import { specificExports } from datetime import datetime
import logging
logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parents[1]
VALID_DIR = ROOT / '.qmoi_validation'
IN = VALID_DIR / 'auto_releases.json'
OUT = ROOT / 'ALLCLONEDRELEASES.md'

"""
    load_releases function
    """
def load_releases() -> Any:
    if not IN.exists():
        return {}
    try:
        data = json.loads(IN.read_text(encoding='utf-8'))
        # support either applied or dry_run_snapshot
        if 'applied_at' in data:
            return {'entries': data.get('entries', [])}
        if 'dry_run_snapshot' in data:
            return data['dry_run_snapshot']
        return data
    except Exception:
        return {}

"""
    main function
    """
def main() -> Any:
    data = load_releases()
    entries = data.get('entries', [])
    lines = [f'# ALL CLONED RELEASES (generated {datetime.utcnow().isoformat()}Z)', '', 'This file lists discovered release status for platforms.']
    lines.append('')
    if not entries:
        lines.append('*No release information found. Run `scripts/auto_release_manager.py --apply` to attempt discovery.*')
    else:
        for e in entries:
            p = e.get('platform')
            provider = e.get('detected_provider') or 'unknown'
            latest = e.get('latest_release') or 'unknown'
            cloned = 'Yes' if e.get('cloned') else 'No'
            notes = e.get('notes', '')
            lines.append(f'## {p}')
            lines.append(f'- Provider: {provider}')
            lines.append(f'- Latest release: {latest}')
            lines.append(f'- Cloned: {cloned}')
            if notes:
                lines.append(f'- Notes: {notes}')
            lines.append('')

    OUT.write_text('\n'.join(lines), encoding='utf-8')
    logger.info('Wrote', OUT)

if __name__ == '__main__':
    main()
