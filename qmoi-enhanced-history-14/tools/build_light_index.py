#!/usr/bin/env python3
"""
Build a compact index of the largest files in the repository to help opt-in exclusions
and drive a lightweight on-demand server.

Writes:
- tools/light_index.json — list of top large files with size and suggestion
- tools/light_index.md — human readable summary
"""
import json
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / 'tools' / 'light_index.json'
OUT_MD = ROOT / 'tools' / 'light_index.md'

# default skip dirs (same as find_placeholders)
SKIP_DIRS = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', '.qmoi_validation', 'dist', 'build'}

def human_size(n):
    for unit in ['B','KB','MB','GB']:
        if n < 1024:
            return f"{n:.1f}{unit}"
        n /= 1024
    return f"{n:.1f}TB"

def main(limit=200):
    files = []
    for root, dirs, filenames in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fn in filenames:
            fp = Path(root) / fn
            try:
                size = fp.stat().st_size
            except Exception:
                continue
            rel = fp.relative_to(ROOT).as_posix()
            files.append((rel, size))

    files.sort(key=lambda x: x[1], reverse=True)
    top = files[:limit]
    out = []
    for rel, size in top:
        out.append({'path': rel, 'size_bytes': size, 'size_human': human_size(size), 'suggest_exclude': True if size > 5*1024*1024 else False})

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({'generated_by': 'tools/build_light_index.py', 'top_files': out}, indent=2), encoding='utf-8')

    md = ['# Light index — top large files', '', 'Files listed below are the largest files found. Consider excluding them from browser-based editing or using sparse-checkout.']
    for e in out[:200]:
        md.append(f"- {e['path']} — {e['size_human']} — {'exclude' if e['suggest_exclude'] else 'ok'}")

    OUT_MD.write_text('\n'.join(md), encoding='utf-8')
    print(f'Wrote {OUT_JSON} and {OUT_MD} (top {len(out)} files)')

if __name__ == '__main__':
    main()

# AUTOFIXED by Ollama at 2026-07-26T18:54:41.386957Z

# AUTOFIXED by Ollama at 2026-07-26T18:57:34.426527Z

# AUTOFIXED by Ollama at 2026-07-26T19:31:06.646582Z

# AUTOFIXED by Ollama at 2026-07-26T19:39:17.646265Z
