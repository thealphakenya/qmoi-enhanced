#!/usr/bin/env python3
"""Simple validator for Codespaces/.devcontainer configuration.

Checks (conservative):
- If .devcontainer/devcontainer.json exists, ensure referenced Dockerfile or image exists/looks valid.
- Flag heavy postCreateCommand values (apt-get, npm install, pip install) for manual review.
- Verify referenced files exist (Dockerfile, scripts) and warn about absolute paths or privileged runArgs.
- Write `.qmoi_validation/devcontainer_report.json` and a short text summary.

This script is conservative and only reports issues; it does not modify files.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DEV_DIR = ROOT / ".devcontainer"
REPORT_DIR = ROOT / ".qmoi_validation"
REPORT_DIR.mkdir(exist_ok=True)
JSON_REPORT = REPORT_DIR / "devcontainer_report.json"
TXT_REPORT = REPORT_DIR / "devcontainer_report.txt"


def scan_devcontainer():
    report = {'found': False, 'issues': [], 'raw': None}
    if not DEV_DIR.exists():
        report['issues'].append('no .devcontainer directory found')
        return report

    config = DEV_DIR / 'devcontainer.json'
    if not config.exists():
        report['issues'].append('no devcontainer.json found in .devcontainer')
        return report

    report['found'] = True
    try:
        data = json.loads(config.read_text(encoding='utf-8'))
        report['raw'] = data
    except Exception as e:
        report['issues'].append(f'failed to parse devcontainer.json: {e}')
        return report

    # Check dockerFile or image
    if 'dockerFile' in data:
        df = DEV_DIR / data['dockerFile'] if not Path(data['dockerFile']).is_absolute() else Path(data['dockerFile'])
        if not df.exists():
            report['issues'].append(f'dockerFile referenced but not found: {data.get("dockerFile")}')
    if 'image' in data:
        # can't validate image offline, but flag non-official or local images
        img = data['image']
        if img.startswith('ghcr.io') or img.startswith('docker.io'):
            pass
        else:
            report['issues'].append(f'img referenced (cannot validate offline): {img}')

    # Check postCreateCommand for heavy operations
    pcc = data.get('postCreateCommand')
    if pcc:
        heavy = ['apt-get', 'npm install', 'pip install', 'docker pull']
        for h in heavy:
            if h in pcc:
                report['issues'].append(f'heavy postCreateCommand found: contains "{h}". Consider moving to optional setup script or documenting run steps.')

    # Check runArgs for privileged flags
    run_args = data.get('runArgs') or []
    dangerous = ['--privileged', '--network=host']
    for ra in run_args:
        for d in dangerous:
            if d in ra:
                report['issues'].append(f'runArgs contains potentially dangerous flag: {ra}')

    # Check mounts/volumes for absolute host paths
    mounts = data.get('mounts') or []
    for m in mounts:
        if isinstance(m, str) and re.match(r'^[A-Za-z]:\\', m):
            report['issues'].append(f'host absolute Windows mount found: {m}')

    return report


def main():
    rep = scan_devcontainer()
    JSON_REPORT.write_text(json.dumps(rep, indent=2), encoding='utf-8')
    lines = []
    lines.append(f"devcontainer found: {rep.get('found')}")
    lines.append('issues:')
    for i in rep.get('issues', []):
        lines.append(' - ' + str(i))
    TXT_REPORT.write_text('\n'.join(lines), encoding='utf-8')
    print('Devcontainer scan complete. issues=', len(rep.get('issues', [])))


if __name__ == '__main__':
    main()
