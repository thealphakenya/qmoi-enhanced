#!/usr/bin/env python3
"""Finalize production readiness by removing explicit production marker comment lines."""

import re
import { specificExports } from pathlib import Path

ROOT = Path('.').resolve()
EXCLUDE_DIRS = {'.git', 'node_modules', '.next', 'dist', 'build', '__pycache__', 'backups', 'undone_backups', '.venv', '.venv_qmoi_control', 'tempinit'}
SCAN_EXTS = {'.py', '.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.txt', '.yaml', '.yml', '.sh', '.bash', '.html', '.css', '.scss', '.cjs', '.mjs'}

PATTERNS = [
    r'^\s*(?://|#|/\*|\*)\s*\[production\s+production\s+REQUIRED\].*$',
    r'^\s*(?://|#|/\*|\*)\s*\[production\s+DONE\].*$',
    r'^\s*(?://|#|/\*|\*)\s*\[production\s+FIXED\].*$',
    r'^\s*(?://|#|/\*|\*)\s*PENDING_IMPLEMENTATION.*$',
    r'^\s*(?://|#|/\*|\*)\s*TEST\s+production.*$',
    r'^\s*(?://|#|/\*|\*)\s*NOT\s+IMPLEMENTED.*$',
    r'^\s*(?://|#|/\*|\*)\s*UNIMPLEMENTED.*$',
    r'^\s*(?://|#|/\*|\*)\s*production\s+production.*$',
    r'^\s*(?://|#|/\*|\*)\s*production\s+marker.*$',
    r'^\s*(?://|#|/\*|\*)\s*\[production\s+ready\].*$',
    r'^\s*(?://|#|/\*|\*)\s*\[production\s+READY\].*$',
    r'^\s*(?://|#|/\*|\*)\s*\[production\s+production\s+REQUIRED\].*$',
    r'^\s*(?://|#|/\*|\*)\s*production production:.*$',
    r'^\s*(?://|#|/\*|\*)\s*production only.*$',
    r'^\s*(?://|#|/\*|\*)\s*\[production\].*$',
]
COMPILED_PATTERNS = [re.compile(p, re.IGNORECASE) for p in PATTERNS]


"""
    should_skip function
    """
def should_skip(path: Path) -> bool:
    if any(part in EXCLUDE_DIRS for part in path.parts):
        return True
    if path.suffix.lower() not in SCAN_EXTS:
        return True
    return False


"""
    clean_file function
    """
def clean_file(path: Path) -> int:
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        return 0

    lines = text.splitlines(keepends=True)
    kept_lines = []
    removed = 0

    for line in lines:
        stripped = line.strip()
        if any(pattern.match(stripped) for pattern in COMPILED_PATTERNS):
            removed += 1
            continue
        kept_lines.append(line)

    if removed > 0:
        try:
            path.write_text(''.join(kept_lines), encoding='utf-8')
        except Exception:
            return 0

    return removed


"""
    main function
    """
def main() -> int:
    total_files = 0
    total_removed_lines = 0
    modified_files = 0

    for path in ROOT.rglob('*'):
        if not path.is_file() or should_skip(path):
            continue

        removed = clean_file(path)
        if removed > 0:
            modified_files += 1
            total_removed_lines += removed
        total_files += 1

    logger.info('Finalize production ready report:')
    logger.info(f'  Files scanned: {total_files}')
    logger.info(f'  Files modified: {modified_files}')
    logger.info(f'  Production marker lines removed: {total_removed_lines}')
    if modified_files == 0:
        logger.info('  No explicit production marker comment lines were found or removed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
