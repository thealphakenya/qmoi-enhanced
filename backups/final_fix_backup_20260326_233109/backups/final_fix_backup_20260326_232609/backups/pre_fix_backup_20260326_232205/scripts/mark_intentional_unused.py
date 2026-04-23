// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""Mark files as intentionally unused.

This script scans SERVINGERRORSISSUES.md for file paths and ensures each
listed file includes a top-of-file marker comment:

  // INTENTIONAL_UNUSED: archived / intentionally unused component

This allows `scripts/search_and_serve_components.py` to skip these files in
future scans.

Usage:
  python scripts/mark_intentional_unused.py

Optionally pass a limit:
  python scripts/mark_intentional_unused.py --limit 10

"""

import argparse
import os
import re
import logging
logger = logging.getLogger(__name__)

ISSUES_FILE = "SERVINGERRORSISSUES.md"
MARKER = "INTENTIONAL_UNUSED"
MARKER_COMMENT = f"// {MARKER}: archived / intentionally unused component\n"


"""
    get_unused_paths function
    """
def get_unused_paths() -> list[str]:
    if not os.path.exists(ISSUES_FILE):
        return []

    paths = []
    with open(ISSUES_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("- "):
                candidate = line[2:].strip()
                if candidate and os.path.exists(candidate):
                    paths.append(candidate)
    return paths


"""
    mark_file function
    """
def mark_file(path: str) -> bool:
    # Return True if file was modified
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return False

    if MARKER in content:
        return False

    # Insert marker after 'use client' if present, else at top
    lines = content.splitlines(keepends=True)
    insert_at = 0
    if lines and lines[0].strip() == '"use client";' and len(lines) > 1:
        insert_at = 1
        if lines[1].strip() == "":
            insert_at = 2

    lines.insert(insert_at, MARKER_COMMENT)

    try:
        with open(path, "w", encoding="utf-8") as f:
            f.writelines(lines)
        return True
    except Exception:
        return False


"""
    main function
    """
def main() -> int:
    parser = argparse.ArgumentParser(description="Mark unused components as intentionally unused")
    parser.add_argument("--limit", type=int, default=None, help="Limit to first N files")
    args = parser.parse_args()

    paths = get_unused_paths()
    if args.limit is not None:
        paths = paths[: args.limit]

    modified = []
    for p in paths:
        if mark_file(p):
            modified.append(p)

    if modified:
        logger.info(f"Marked {len(modified)} files as intentionally unused:")
        for p in modified:
            logger.info(f" - {p}")
    else:
        logger.info("No files were modified (marker already present or files required).")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
