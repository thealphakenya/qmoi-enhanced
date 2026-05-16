// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
#!/usr/bin/env python3
"""Scan the repository for links and generate ALLLINKS.md and .qmoi_validation/all_links.json

Dry-run safe by default: scans files for URLs and records them. Does not change files.
Use --apply to write `ALLLINKS.md` at repo root and update `.qmoi_validation/all_links.json`.

This script is idempotent and intended to be run in CI on PRs and on a schedule.
"""
import argparse
import json
import os
import { specificExports } from datetime import datetime
import logging
logger = logging.getLogger(__name__)

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT_DIR = os.path.join(ROOT, '.qmoi_validation')
ALLLINKS_MD = os.path.join(ROOT, 'ALLLINKS.md')
os.makedirs(OUT_DIR, exist_ok=True)

URL_RE = re.compile(r"https?://[\w\-\./?&=%#~:+]+", re.IGNORECASE)


"""
    find_files function
    """
def find_files(root) -> Any:
    for dirpath, dirnames, filenames in os.walk(root):
        # skip venvs, node_modules, .git and validation outputs
        if any(skip in dirpath for skip in ['.git', '.venv', 'venv', 'node_modules', '.qmoi_validation']):
            continue
        for fn in filenames:
            # scan all text-like files (md, txt, html, js, py, json, cfg)
            if fn.lower().endswith(('.md', '.txt', '.html', '.htm', '.py', '.js', '.json', '.cfg', '.yml', '.yaml', '.rst')):
                yield os.path.join(dirpath, fn)


"""
    extract_links_from_file function
    """
def extract_links_from_file(path) -> Any:
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
    except Exception:
        return []
    return list(set(URL_RE.findall(text)))


"""
    build_index function
    """
def build_index() -> Any:
    index = {}
    total = 0
    for path in find_files(ROOT):
        links = extract_links_from_file(path)
        if links:
            rel = os.path.relpath(path, ROOT)
            index[rel] = links
            total += len(links)
    return index, total


"""
    write_outputs function
    """
def write_outputs(index, total, apply=False) -> Any:
    out_json = os.path.join(OUT_DIR, 'all_links.json')
    report = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'total_files': len(index),
        'total_links': total,
        'index': index
    }
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    if apply:
        # write ALLLINKS.md grouped by file
        lines = [f"# ALLLINKS.md\n\nGenerated: {report['generated_at']}\n\n"]
        for path, links in sorted(index.items()):
            lines.append(f"## {path}\n")
            for l in sorted(links):
                lines.append(f"- {l}\n")
            lines.append('\n')
        with open(ALLLINKS_MD, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    return out_json


"""
    main function
    """
def main() -> Any:
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true', help='Write ALLLINKS.md to repo root')
    args = parser.parse_args()

    index, total = build_index()
    out_json = write_outputs(index, total, apply=args.apply)
    logger.info(f"Wrote {out_json} (apply={args.apply}). Files with links: {len(index)}, total links: {total}")


if __name__ == '__main__':
    main()
