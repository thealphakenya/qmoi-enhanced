#!/usr/bin/env python3
"""
Check markdown links across the repo. For local links, verify the target file exists.
For external links (http/https) mark them as external (optionally checkable).

Writes: tools/link_report.json and link_report.md
"""
import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / 'tools' / 'link_report.json'
OUT_MD = ROOT / 'link_report.md'

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")

def scan_md():
    findings = []
    for p in ROOT.rglob('*.md'):
        try:
            text = p.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue
        for m in LINK_RE.finditer(text):
            text_label = m.group(1)
            url = m.group(2).strip()
            entry = {'file': p.relative_to(ROOT).as_posix(), 'label': text_label, 'url': url}
            if url.startswith('http://') or url.startswith('https://'):
                entry['status'] = 'external'
            else:
                # remove optional anchors and fragments
                target = url.split('#')[0]
                target_path = (p.parent / target).resolve() if not target.startswith('/') else (ROOT / target.lstrip('/')).resolve()
                entry['target_exists'] = target_path.exists()
            findings.append(entry)
    return findings

def write_report(findings):
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(findings, indent=2), encoding='utf-8')
    lines = ['# Link Report', '', f'Found {len(findings)} links', '']
    for f in findings:
        if f.get('status') == 'external':
            lines.append(f"- {f['file']}: [{f['label']}]({f['url']}) — external (not checked)")
        else:
            tone = 'OK' if f.get('target_exists') else 'MISSING'
            lines.append(f"- {f['file']}: [{f['label']}]({f['url']}) — {tone}")
    OUT_MD.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Wrote {OUT_JSON} and {OUT_MD}')

def main():
    findings = scan_md()
    write_report(findings)

if __name__ == '__main__':
    main()
