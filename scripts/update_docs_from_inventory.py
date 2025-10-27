#!/usr/bin/env python3
"""Update several markdown docs from tmp/api_inventory.json.

Currently updates `docs/implemented_endpoints.md` with a grouped-by-source listing.
"""
from __future__ import annotations

import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
INVENTORY = ROOT / 'tmp' / 'api_inventory.json'
OUT_MD = ROOT / 'docs' / 'implemented_endpoints.md'
API_MD = ROOT / 'API.md'
ALL_MD_REFS = ROOT / 'ALLMDFILESREFS.md'


def group_by_file(endpoints):
    d = {}
    for e in endpoints:
        f = e.get('file') or 'unknown'
        d.setdefault(f, []).append(e)
    return d


def fmt_method(e):
    methods = e.get('methods') or []
    if methods:
        return ','.join(methods)
    return ''


def main():
    if not INVENTORY.exists():
        print('Inventory missing at', INVENTORY)
        return
    data = json.loads(INVENTORY.read_text(encoding='utf-8'))
    endpoints = data.get('endpoints', [])
    grouped = group_by_file(endpoints)

    header = f"<!-- LION_VALIDATION_START -->\n## 🦁 L — Validated by QMOI Lion\n\n- validated: yes\n- validator: QMOI Lion\n- timestamp: {datetime.utcnow().isoformat()}Z\n- note: Auto-generated from tmp/api_inventory.json\n<!-- LION_VALIDATION_END -->\n\n"

    body_lines = [header, f"Implemented endpoints discovered in repository (auto-generated)", '', f"Date: {datetime.utcnow().date()}", '']

    # iterate files sorted by name
    for src in sorted(grouped.keys()):
        body_lines.append(f"-- {src}")
        for e in sorted(grouped[src], key=lambda x: x.get('path','')):
            m = fmt_method(e)
            line = f"- {m:6} {e.get('path')} — {src}"
            body_lines.append(line)
        body_lines.append('')

    body_lines.append('\nNotes:')
    body_lines.append('- This file is auto-generated; review and commit when satisfied.')
    body = '\n'.join(body_lines) + '\n'

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    backup = OUT_MD.with_suffix(OUT_MD.suffix + '.bak')
    if OUT_MD.exists():
        backup.write_text(OUT_MD.read_text(encoding='utf-8'), encoding='utf-8')
    OUT_MD.write_text(body, encoding='utf-8')
    print('Wrote', OUT_MD)

    # Also update top-level API.md with a concise auto-generated inventory section.
    try:
        api_section_lines = []
        api_section_lines.append('<!-- API_INVENTORY_START -->')
        api_section_lines.append('## Discovered API Endpoints (auto-generated)')
        api_section_lines.append('')
        for src in sorted(grouped.keys()):
            api_section_lines.append(f'### Source: {src}')
            for e in sorted(grouped[src], key=lambda x: x.get('path','')):
                m = fmt_method(e)
                api_section_lines.append(f'- {m:6} {e.get("path")}')
            api_section_lines.append('')
        api_section_lines.append('<!-- API_INVENTORY_END -->')
        api_block = '\n'.join(api_section_lines) + '\n'

        if API_MD.exists():
            content = API_MD.read_text(encoding='utf-8')
            if '<!-- API_INVENTORY_START -->' in content and '<!-- API_INVENTORY_END -->' in content:
                start = content.index('<!-- API_INVENTORY_START -->')
                end = content.index('<!-- API_INVENTORY_END -->', start) + len('<!-- API_INVENTORY_END -->')
                new_content = content[:start] + api_block + content[end:]
            else:
                # append at end
                new_content = content + '\n' + api_block
            backup_api = API_MD.with_suffix(API_MD.suffix + '.bak')
            backup_api.write_text(content, encoding='utf-8')
            API_MD.write_text(new_content, encoding='utf-8')
            print('Updated', API_MD)
        else:
            # create a minimal API.md with the block
            API_MD.write_text('# API (auto-generated)\n\n' + api_block, encoding='utf-8')
            print('Created', API_MD)
    except Exception as ex:
        print('Failed to update API.md:', ex)

    # Add a reference entry to ALLMDFILESREFS.md so the generated doc is discoverable
    try:
        ref_line = '\n- docs/implemented_endpoints.md — auto-generated from tmp/api_inventory.json\n'
        if ALL_MD_REFS.exists():
            txt = ALL_MD_REFS.read_text(encoding='utf-8')
            if 'docs/implemented_endpoints.md' not in txt:
                ALL_MD_REFS.write_text(txt + ref_line, encoding='utf-8')
                print('Updated', ALL_MD_REFS)
        else:
            ALL_MD_REFS.write_text('# All MD Files References\n' + ref_line, encoding='utf-8')
            print('Created', ALL_MD_REFS)
    except Exception as ex:
        print('Failed to update ALLMDFILESREFS.md:', ex)


if __name__ == '__main__':
    main()
