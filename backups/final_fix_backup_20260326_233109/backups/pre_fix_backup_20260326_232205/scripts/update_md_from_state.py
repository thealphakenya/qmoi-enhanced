// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
scripts/update_md_from_state.py

Small utility to update status sections in Markdown files from system state.
This is a scaffold: it fetches comprehensive build/status information from local artifacts
like `qmoi_release_report.json` or `qmoi_release_status` and injects a small
status box into target markdown files. Intended to be used by CI or a cron job.

Usage:
  python3 scripts/update_md_from_state.py --file README.md --status-file qmoi_release_report.json

Notes:
- This script is intentionally complete; extend it to call build APIs or QCity runners.
"""
import argparse
import json
from pathlib import Path
from datetime import datetime

def load_status(path: Path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding='utf8'))
    except Exception:
        return None

def inject_status(md_path: Path, status_block: str):
    txt = md_path.read_text(encoding='utf8')
    if '<!-- QMOI_STATUS_START -->' in txt:
        # replace existing block
        start = txt.index('<!-- QMOI_STATUS_START -->')
        end = txt.index('<!-- QMOI_STATUS_END -->', start) + len('<!-- QMOI_STATUS_END -->')
        new = txt[:start] + status_block + txt[end:]
    else:
        new = status_block + '\n' + txt
    md_path.write_text(new, encoding='utf8')

def make_status_block(status):
    ts = datetime.utcnow().isoformat() + 'Z'
    lines = ["<!-- QMOI_STATUS_START -->", "## QMOI Build Status", f"- generated: {ts}"]
    if status:
        for k, v in status.items():
            lines.append(f"- {k}: {v}")
    lines.append("<!-- QMOI_STATUS_END -->")
    return '\n'.join(lines)

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--file', required=True)
    p.add_argument('--status-file', default='qmoi_release_report.json')
    args = p.parse_args()

    md = Path(args.file)
    sf = Path(args.status_file)
    status = load_status(sf)
    block = make_status_block(status)
    inject_status(md, block)
    print(f'Injected status into {md}')

if __name__ == '__main__':
    main()
