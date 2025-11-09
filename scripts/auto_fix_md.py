#!/usr/bin/env python3
"""
Auto-fix Markdown hygiene issues found by the validator.

This script reads JSON reports in `.qmoi_validation/validation_reports/` and
for files missing frontmatter or H1 titles it will add conservative,
non-destructive placeholders:
 - YAML frontmatter with a title field (if missing)
 - H1 title line (if missing)

It writes backups into `.qmoi_validation/backups/` and operates in batches by
default (safe). Use --apply to persist changes; without it the script runs a
dry-run and prints planned edits.
"""
import argparse
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / '.qmoi_validation' / 'validation_reports'
BACKUPS = ROOT / '.qmoi_validation' / 'backups'
BACKUPS.mkdir(parents=True, exist_ok=True)


def load_reports():
    if not REPORTS.exists():
        return []
    return list(REPORTS.glob('*.json'))


def read_report(path: Path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception:
        return None


def has_frontmatter(text: str) -> bool:
    return text.lstrip().startswith('---')


def has_h1(text: str) -> bool:
    for line in text.splitlines():
        if line.strip().startswith('# '):
            return True
        # skip frontmatter block
        if line.strip() == '---':
            # ignore until next ---
            parts = text.split('---', 2)
            if len(parts) >= 3:
                rest = parts[2]
                for l in rest.splitlines():
                    if l.strip().startswith('# '):
                        return True
                return False
    return False


def apply_fixes_for_report(report, apply=False):
    checks = report.get('checks', {})
    fname = report.get('file')
    if not fname:
        return None
    fpath = ROOT / fname
    if not fpath.exists():
        return {'file': fname, 'skipped': 'missing'}
    try:
        text = fpath.read_text(encoding='utf-8')
    except Exception:
        return {'file': fname, 'skipped': 'encoding'}

    needs_frontmatter = not checks.get('frontmatter_present', {}).get('ok', False)
    needs_title = not checks.get('title_present', {}).get('ok', False)
    planned = []
    new_text = text

    # choose title from report if available
    title = None
    tp = checks.get('title_present')
    if tp and isinstance(tp.get('detail'), str):
        title = tp.get('detail')
    if not title:
        # fallback to filename
        title = Path(fname).stem.replace('_', ' ').strip()

    if needs_frontmatter and not has_frontmatter(text):
        fm = f"---\ntitle: \"{title}\"\nqmoi_validation_frontmatter: true\n---\n\n"
        new_text = fm + new_text
        planned.append('add_frontmatter')

    if needs_title and not has_h1(new_text):
        # place H1 after frontmatter if present
        if has_frontmatter(new_text):
            parts = new_text.split('---', 2)
            if len(parts) >= 3:
                # parts[0] empty, parts[1] fm body, parts[2] rest
                rest = parts[2].lstrip('\n')
                new_text = '---' + parts[1] + '---\n\n' + f'# {title}\n\n' + rest
            else:
                new_text = f'# {title}\n\n' + new_text
        else:
            new_text = f'# {title}\n\n' + new_text
        planned.append('add_h1')

    if not planned:
        return {'file': fname, 'changed': False}

    if apply:
        # backup
        bak = BACKUPS / (fname.replace('/', '_') + '.bak')
        bak.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(fpath, bak)
        fpath.write_text(new_text, encoding='utf-8')
        return {'file': fname, 'changed': True, 'actions': planned, 'backup': str(bak)}

    return {'file': fname, 'changed': False, 'planned': planned}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--apply', action='store_true', help='Persist fixes')
    ap.add_argument('--limit', type=int, default=50, help='Max files to process')
    args = ap.parse_args()

    reports = load_reports()
    results = []
    count = 0
    for rp in reports:
        if count >= args.limit:
            break
        report = read_report(rp)
        if not report:
            continue
        # Only process files that the validator flagged for frontmatter/title
        if (not report.get('checks', {}).get('frontmatter_present', {}).get('ok', True)) or (
            not report.get('checks', {}).get('title_present', {}).get('ok', True)):
            res = apply_fixes_for_report(report, apply=args.apply)
            results.append(res)
            count += 1

    for r in results:
        print(r)


if __name__ == '__main__':
    main()
