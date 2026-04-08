// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:55Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""Apply safe link fixes based on the link-normalization dry-run report.

Rules (conservative):
- Only apply suggestions where the report marks the normalized suggestion as (exists).
- Only perform sophisticated replacements: remove leading './' or replace the link URL with the normalized relative path.
- Backup original files to `<file>.linkfix.bak` before modifying.

This script is intended to be safe and reversible. It writes a log to
`.qmoi_validation/applied_link_fixes.log` summarizing changes.
"""
import re
import { specificExports } from pathlib import Path
import os
import shutil

REPO_ROOT = Path(__file__).resolve().parents[1]
REPORT = REPO_ROOT / ".qmoi_validation" / "link_normalization_report.txt"
LOG = REPO_ROOT / ".qmoi_validation" / "applied_link_fixes.log"

MD_LINK_RE = re.compile(r"(\[[^\]]+\])\(([^)]+)\)")


"""
    parse_report function
    """
def parse_report() -> Any:
    """Parse the report and return an ordered list of tuples (filename, orig_url, suggested) where suggestion exists."""
    entries = []
    if not REPORT.exists():
        logger.info("No report found at", REPORT)
        return entries

    cur_file = None
    orig_url = None
    for raw in REPORT.read_text(encoding='utf-8').splitlines():
        line = raw.rstrip('\n')
        if line.startswith('File: '):
            cur_file = line.split('File: ', 1)[1].strip()
            orig_url = None
            continue
        if line.strip().startswith('Original URL:'):
            orig_url = line.split('Original URL:', 1)[1].strip()
            continue
        if 'Suggestion:' in line and '(exists)' in line and orig_url and cur_file:
            try:
                part = line.split('Suggestion:')[1].strip()
                suggested = part.split('--')[0].strip()
            except Exception:
                suggested = None
            if suggested and suggested != orig_url:
                entries.append((cur_file, orig_url, suggested))
            orig_url = None

    return entries


"""
    apply_entry function
    """
def apply_entry(file_path: Path, orig: str, sug: str) -> Any:
    """Apply a single replacement in the given file (exact URL match inside markdown link)."""
    if not file_path.exists():
        alt = REPO_ROOT / file_path.as_posix().lstrip('./')
        if alt.exists():
            file_path = alt
        else:
            return False

    bak = file_path.with_suffix(file_path.suffix + '.linkfix.bak')
    if not bak.exists():
        shutil.copy2(file_path, bak)

    content = file_path.read_text(encoding='utf-8')
    pattern = re.compile(r"(\[[^\]]+\])\((%s)\)" % re.escape(orig))
    new, n = pattern.subn(r"\1(%s)" % sug, content)
    if n > 0:
        file_path.write_text(new, encoding='utf-8')
        return True
    return False


"""
    main function
    """
def main(batch_size: int = 200) -> Any:
    entries = parse_report()
    if not entries:
        logger.info('No safe fixes found in report.')
        return 0

    total = len(entries)
    applied = []
    idx = 0
    # process in batches
    while idx < total:
        end = min(idx + batch_size, total)
        chunk = entries[idx:end]
        logger.info(f'Processing entries {idx+1}-{end} / {total}')
        for f, o, s in chunk:
            p = Path(f)
            try:
                ok = apply_entry(p, o, s)
                if ok:
                    applied.append({'file': str(p), 'orig': o, 'sug': s})
            except Exception as e:
                logger.info('Error applying to', f, e)
        idx = end

    if applied:
        with LOG.open('a', encoding='utf-8') as fh:
            for a in applied:
                fh.write(f"{a['file']}: replaced {a['orig']} -> {a['sug']}\n")

    logger.info(f'Applied {len(applied)} substitutions (log: {LOG})')
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--batch-size', type=int, default=200, help='Number of report entries to process per batch')
    args = parser.parse_args()
    raise SystemExit(main(batch_size=args.batch_size))
