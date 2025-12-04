#!/usr/bin/env python3
"""Update links across markdown and config files using the live ngrok tunnel URL.

Reads `.qmoi/ngrok_tunnel.json` (preferred) or `ngrok_tunnel.txt` to obtain the live public_url.
Only updates files listed in `ALLMDFILESREFS.md` to avoid accidental edits.

Usage:
  python scripts/update_links_with_ngrok.py --apply
  python scripts/update_links_with_ngrok.py --dry-run
"""
import argparse
import json
import re
from pathlib import Path
from typing import List, Optional


def read_ngrok_url() -> Optional[str]:
    j = Path('.qmoi/ngrok_tunnel.json')
    t = Path('ngrok_tunnel.txt')
    if j.exists():
        try:
            d = json.loads(j.read_text())
            return d.get('public_url')
        except Exception:
            pass
    if t.exists():
        try:
            return t.read_text().strip()
        except Exception:
            pass
    return None


def read_all_md_refs() -> List[Path]:
    refs = Path('ALLMDFILESREFS.md')
    if not refs.exists():
        # fallback to qmoi-enhanced/ALLMDFILESREFS.md
        refs = Path('qmoi-enhanced') / 'ALLMDFILESREFS.md'
    if not refs.exists():
        return []
    out = []
    for line in refs.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('<!--'):
            continue
        if line.startswith('./'):
            path = Path(line[2:])
        else:
            path = Path(line)
        # only include markdown and docs and JSON
        if path.suffix in ('.md', '.json') and path.exists():
            out.append(path)
    return out


NGROK_LINK_RE = re.compile(r'https?://[A-Za-z0-9\-]+\.ngrok(?:-free)?\.[A-Za-z.]+(/[\w\-\./?&=%]*)?')


def replace_links_in_text(text: str, new_base: str) -> (str, int):
    # Replace any ngrok URL with new_base preserving path
    def repl(m):
        full = m.group(0)
        # find path part after domain
        parts = full.split('/', 3)
        if len(parts) >= 4:
            path = '/' + parts[3]
        elif len(parts) >= 3:
            path = '/' + (parts[2] if parts[2] else '')
        else:
            path = '/'
        return new_base.rstrip('/') + path

    new_text, count = NGROK_LINK_RE.subn(repl, text)
    return new_text, count


def process_files(files: List[Path], new_base: str, apply: bool = False) -> None:
    total_changes = 0
    for p in files:
        try:
            txt = p.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            print(f"Skipping binary or non-UTF8 file: {p}")
            continue
        except Exception as e:
            print(f"Skipping file {p} due to read error: {e}")
            continue
        new_txt, count = replace_links_in_text(txt, new_base)
        if count > 0:
            print(f"{p}: {count} link(s) to update")
            total_changes += count
            if apply:
                # backup
                backup = p.with_suffix(p.suffix + '.bak')
                p.replace(backup)
                p.write_text(new_txt, encoding='utf-8')
                print(f"  -> updated (backup at {backup})")
            else:
                print("  -> dry-run (not applied)")
    print(f"Done. Total replacements: {total_changes}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='Apply replacements')
    parser.add_argument('--dry-run', action='store_true', help='Dry run (default)')
    args = parser.parse_args()

    url = read_ngrok_url()
    if not url:
        print('No ngrok URL found in .qmoi/ngrok_tunnel.json or ngrok_tunnel.txt')
        return

    files = read_all_md_refs()
    if not files:
        print('No files listed in ALLMDFILESREFS.md or files do not exist')
        return

    process_files(files, url, apply=args.apply)


if __name__ == '__main__':
    main()
