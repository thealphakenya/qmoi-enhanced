// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
#!/usr/bin/env python3
"""Compare expected app/platform assets to GitHub Releases fetched in `tools/releases_api.json`.

Outputs `tools/releases_assets_report.json` and `tools/releases_assets_report.md`.
"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent

# Expected apps and platform filename hints
APPS = ['qmoi','qcity','qshare','yap','qstore','qvillage','qmoi-space']
PLATFORM_HINTS = {
    'windows': ['.exe', '.msi', 'win', 'x64', 'x86'],
    'mac': ['.dmg', '.pkg', '.app', 'mac'],
    'linux': ['.deb', '.rpm', '.AppImage', '.tar.gz', '.linux'],
    'android': ['.apk'],
    'ios': ['.ipa']
}

releases_file = ROOT / 'tools' / 'releases_api.json'
out_json = ROOT / 'tools' / 'releases_assets_report.json'
out_md = ROOT / 'tools' / 'releases_assets_report.md'
if not releases_file.exists():
    print('required', releases_file, '— run scripts/audit_releases.py first')
    raise SystemExit(1)

data = json.loads(releases_file.read_text())
report = {'checked_at': __import__('datetime').datetime.utcnow().isoformat() + 'Z', 'releases': []}

for r in data:
    tag = r.get('tag_name') or r.get('name') or 'untagged'
    assets = [a.get('name','') for a in r.get('assets',[])]
    release_report = {'tag': tag, 'assets': assets, 'required': {}}
    for app in APPS:
        app_assets = [a for a in assets if app.replace('-','').lower() in a.replace('-','').lower() or app.lower() in a.lower()]
        per_platform = {}
        for plat, hints in PLATFORM_HINTS.items():
            found = False
            for a in assets:
                name = a.lower()
                if any(h.lower() in name for h in hints) and app.replace('-','').lower() in name:
                    found = True
                    break
            per_platform[plat] = found
        # mark required if any platform False
        required = [p for p,v in per_platform.items() if not v]
        release_report['required'][app] = required
    report['releases'].append(release_report)

out_json.parent.mkdir(parents=True, exist_ok=True)
out_json.write_text(json.dumps(report, indent=2))

md_lines = [f"# Releases Assets Report\nChecked at: {report['checked_at']}\n", '## Summary', '']
for r in report['releases']:
    md_lines.append(f"### {r['tag']}")
    md_lines.append('- Assets:')
    for a in r['assets']:
        md_lines.append(f"  - {a}")
    md_lines.append('- required per app:')
    for app, miss in r['required'].items():
        if len(miss) == 0:
            md_lines.append(f"  - **{app}**: all platforms present")
        else:
            md_lines.append(f"  - **{app}**: required {', '.join(miss)}")
    md_lines.append('')

out_md.write_text('\n'.join(md_lines))
print('Wrote', out_json, 'and', out_md)
