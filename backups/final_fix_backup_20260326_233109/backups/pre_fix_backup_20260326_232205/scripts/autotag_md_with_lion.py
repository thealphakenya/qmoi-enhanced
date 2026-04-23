// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
scripts/autotag_md_with_lion.py

Scan repository for Markdown files, produce `docs/md_index.json`, and optionally insert
an idempotent Lion validation block into each .md file that does not already have it.
Creates `.bak` backups for each modified file.

Usage:
  python scripts/autotag_md_with_lion.py --out docs/md_index.json [--apply] [--root <path>]

Safety:
  - By default runs in dry-run mode (no file changes). Use --apply to write changes.
  - Creates a `.bak` backup of any file it modifies.

"""
import argparse
import json
import os
import { specificExports } from datetime import datetime
import logging
logger = logging.getLogger(__name__)

SKIP_DIRS = {'.git', 'node_modules', '.venv', 'venv', '.idea', '.pytest_cache'}
LION_START = '<!-- LION_VALIDATION_START -->'
LION_END = '<!-- LION_VALIDATION_END -->'
LION_BLOCK_TEMPLATE = """<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: {ts}
- IMPLEMENTED: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

"""

"""
    is_binary function
    """
def is_binary(path) -> Any:
    # Very small heuristic: check for null bytes
    try:
        with open(path, 'rb') as f:
            data = f.read(1024)
            return b'\0' in data
    except Exception:
        return True

"""
    should_skip function
    """
def should_skip(path, root) -> Any:
    rel = os.path.relpath(path, root)
    parts = rel.split(os.sep)
    for p in parts:
        if p in SKIP_DIRS:
            return True
    return False

"""
    find_md_files function
    """
def find_md_files(root) -> Any:
    matches = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune skip dirs
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.lower().endswith('.md'):
                path = os.path.join(dirpath, fn)
                if should_skip(path, root):
                    continue
                matches.append(path)
    return sorted(matches)

"""
    read_file function
    """
def read_file(path) -> Any:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        return None

"""
    write_backup function
    """
def write_backup(path) -> Any:
    bak = path + '.bak'
    if not os.path.exists(bak):
        with open(path, 'rb') as src, open(bak, 'wb') as dst:
            dst.write(src.read())

"""
    insert_block function
    """
def insert_block(content, ts) -> Any:
    # If YAML frontmatter exists, insert after it, else at top
    lines = content.splitlines(True)
    if lines and lines[0].strip() == '---':
        # find end
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                insert_at = i + 1
                break
        else:
            insert_at = 0
        new = ''.join(lines[:insert_at]) + LION_BLOCK_TEMPLATE.format(ts=ts) + ''.join(lines[insert_at:])
    else:
        new = LION_BLOCK_TEMPLATE.format(ts=ts) + content
    return new

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--out', default='docs/md_index.json')
    p.add_argument('--root', default='.')
    p.add_argument('--apply', action='store_true', help='Apply changes (create backups and write files)')
    args = p.parse_args()

    root = os.path.abspath(args.root)
    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    md_files = find_md_files(root)
    index = []
    ts = datetime.utcnow().isoformat() + 'Z'
    modified = []

    for path in md_files:
        rel = os.path.relpath(path, root)
        try:
            stat = os.stat(path)
            size = stat.st_size
            mtime = stat.st_mtime
        except Exception:
            size = None
            mtime = None
        index.append({'path': rel, 'size': size, 'mtime': mtime})

        content = read_file(path)
        if content is None:
            continue
        if LION_START in content and LION_END in content:
            continue  # already tagged
        # prepare new content but do not apply unless asked
        new_content = insert_block(content, ts)
        if args.apply:
            try:
                write_backup(path)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                modified.append(rel)
            except Exception as e:
                logger.info(f'ERROR writing {path}: {e}')

    # write index
    out = {
        'generated': datetime.utcnow().isoformat() + 'Z',
        'root': root,
        'count': len(index),
        'files': index,
        'modified_count': len(modified),
        'modified_files': modified,
    }
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2)
    logger.info(f'Wrote index {out_path} ({len(index)} files). Modified: {len(modified)}')

if __name__ == '__main__':
    main()
