#!/usr/bin/env python3
"""Fast, conservative dashboard health checker.

This script performs static checks across the repo to surface likely dashboard apps
(Grafana provisioning JSON, Streamlit apps, Dash/Plotly apps, simple web dashboards).

It is intentionally non-invasive: no network calls, no installs, no edits. It writes
reports to .qmoi_validation/dashboard_report.json and .qmoi_validation/dashboard_report.txt
for triage.

Designed to run quickly over large repos.
"""
from pathlib import Path
import os
import json
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / ".qmoi_validation"
REPORT_DIR.mkdir(exist_ok=True)
JSON_REPORT = REPORT_DIR / "dashboard_report.json"
TXT_REPORT = REPORT_DIR / "dashboard_report.txt"

IDENTIFIERS = {
    'grafana': ['grafana', 'provisioning', 'dashboards', 'grafana.ini'],
    'streamlit': ['streamlit'],
    'dash': ['dash', 'plotly', 'dash_html_components'],
    'panel': ['panel'],
}


def scan_repo(max_files=20000):
    results = []
    scanned = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        # skip large or irrelevant dirs
        if any(part in dirpath for part in ('/.git/', '/node_modules/', '/.venv/', '/.qmoi_validation/')):
            continue
        for fn in filenames:
            scanned += 1
            if scanned > max_files:
                return results, scanned
            p = Path(dirpath) / fn
            low_name = fn.lower()
            # quick heuristics: dashboard file names or folders
            rel = str(p.relative_to(ROOT))
            entry = None

            # Grafana dashboards are often JSON with a dashboards or grafana folder
            if 'grafana' in dirpath.lower() or 'dashboards' in dirpath.lower() or low_name.endswith('.json') and 'dashboard' in dirpath.lower():
                entry = {'path': rel, 'type': 'grafana_or_json', 'notes': []}

            # Streamlit or apps that mention streamlit/dash in sources
            if entry is None and low_name.endswith(('.py', '.pyw', '.ipynb')):
                try:
                    text = p.read_text(encoding='utf-8', errors='ignore')[:200000]
                except Exception:
                    text = ''
                for tname in ('streamlit', 'st.', 'import streamlit'):
                    if tname in text:
                        entry = {'path': rel, 'type': 'streamlit', 'notes': []}
                        break
                if entry is None:
                    for tname in ('import dash', 'from dash', 'plotly'):
                        if tname in text:
                            entry = {'path': rel, 'type': 'dash', 'notes': []}
                            break

            if entry:
                # quick checks
                psize = None
                try:
                    psize = p.stat().st_size
                except Exception:
                    psize = None
                entry['size'] = psize
                # check for README nearby
                readme = p.parent / 'README.md'
                entry['has_readme'] = readme.exists()
                # check package.json if JS app
                pkg = p.parent / 'package.json'
                entry['has_package_json'] = pkg.exists()
                results.append(entry)

    return results, scanned


def write_reports(results, scanned):
    run = {'run': datetime.utcnow().isoformat() + 'Z', 'scanned_files': scanned, 'items': results}
    JSON_REPORT.write_text(json.dumps(run, indent=2), encoding='utf-8')
    lines = [f"Dashboard health check run: {run['run']}", f"scanned_files: {scanned}", f"items_found: {len(results)}", '']
    for it in results:
        lines.append(f"- {it['type']}: {it['path']} size={it.get('size')} readme={it.get('has_readme')} package.json={it.get('has_package_json')}")
    TXT_REPORT.write_text('\n'.join(lines), encoding='utf-8')


def main():
    results, scanned = scan_repo(max_files=20000)
    write_reports(results, scanned)
    print(f"Dashboard health check complete: scanned={scanned} found={len(results)}")


if __name__ == '__main__':
    main()
