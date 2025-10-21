#!/usr/bin/env python3
"""Update top-level README.md apps table from docs/apps-inventory.json

This script is idempotent and replaces a marker block in README.md with a generated table.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / 'docs' / 'apps-inventory.json'
README = ROOT / 'README.md'

START = '<!-- QMOI_APPS_TABLE_START -->'
END = '<!-- QMOI_APPS_TABLE_END -->'


def load_apps():
    if not IN.exists():
        return []
    data = json.loads(IN.read_text(encoding='utf-8'))
    return data.get('apps', [])


def render_table(apps):
    lines = []
    lines.append(START)
    lines.append('| App | Platform | File | Size (KB) | Download |')
    lines.append('|---|---:|---|---:|---|')
    for a in apps:
        file_path = a.get('file')
        size_kb = a.get('size_bytes', 0) // 1024
    # primary download host (external)
    host_url = f"https://downloads.qmoi.app/{file_path}"
    # preferred fallback: downloads directory in this repo (raw GitHub)
    raw_url = f"https://raw.githubusercontent.com/thealphakenya/qmoi-enhanced/{'autosync-backup-20250926-232440'}/downloads/{Path(file_path).name}"
    # If there's a downloads/ copy, link to that as the reliable fallback
    download_link = host_url
        # Use markdown link with fallback note
    lines.append(f"| {a.get('name')} | {a.get('platform')} | [{file_path}]({file_path}) | {size_kb} | [Download]({download_link}) / [GitHub Raw]({raw_url}) |")
    lines.append(END)
    return '\n'.join(lines)


def update_readme():
    apps = load_apps()
    table = render_table(apps)
    if not README.exists():
        print('README.md not found')
        return
    txt = README.read_text(encoding='utf-8')
    if START in txt and END in txt:
        s = txt.split(START)[0]
        tail = txt.split(END)[1]
        new = s + table + tail
    else:
        new = txt + '\n\n' + table
    README.write_text(new, encoding='utf-8')
    print('Updated README.md')


if __name__ == '__main__':
    update_readme()
