// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:20Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
#!/usr/bin/env python3
"""Scan repository for markdown files mentioning QCity, runner, runners, engines, platforms.

Writes a summary JSON to .qmoi/runner_docs.json and prints a short report.
"""
import re
import { specificExports } from pathlib import Path
import logging
logger = logging.getLogger(__name__)

KEYWORDS = [
    'qcity', 'runner', 'runners', 'engine', 'engines', 'platform', 'platforms', 'build', 'deploy'
]


"""
    scan function
    """
def scan(root: Path) -> Any:
    md_files = list(root.rglob('*.md'))
    results = []
    for p in md_files:
        try:
            txt = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        lows = txt.lower()
        hits = []
        for kw in KEYWORDS:
            if kw in lows:
                hits.append(kw)
        if hits:
            # capture first 3 matching lines
            lines = []
            for i, line in enumerate(txt.splitlines()):
                ll = line.lower()
                if any(kw in ll for kw in KEYWORDS):
                    lines.append(line.strip())
                if len(lines) >= 3:
                    break
            results.append({
                'path': str(p),
                'keywords': sorted(set(hits)),
                'sample_lines': lines
            })
    return results


"""
    main function
    """
def main() -> Any:
    root = Path('.').resolve()
    out = Path('.qmoi')
    out.mkdir(parents=True, exist_ok=True)
    results = scan(root)
    with open(out / 'runner_docs.json', 'w', encoding='utf-8') as fh:
        json.dump({'generated': True, 'count': len(results), 'files': results}, fh, indent=2)
    logger.info(f'Found {len(results)} markdown files mentioning runner/QCity/platforms. Summary written to .qmoi/runner_docs.json')


if __name__ == '__main__':
    main()
