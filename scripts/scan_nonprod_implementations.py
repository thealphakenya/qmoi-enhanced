#!/usr/bin/env python3
"""Scan donerefs and the repo for non-production implementation markers.

Conservative actions:
 - Do NOT modify code files.
 - If a file listed in donerefs.txt contains markers (TODO/FIXME/simulate/production notes), remove it from donerefs.txt (with backup) so it is not considered done.
 - Write detailed reports to .qmoi_validation/

Run: python3 scripts/scan_nonprod_implementations.py
"""
import os
import re
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
QM = ROOT / '.qmoi_validation'
QM.mkdir(exist_ok=True)

PATTERNS = [
    r"\bTODO\b",
    r"\bFIXME\b",
    r"not\s+meant\s+for\s+production",
    r"\bsimulat(e|ed|ion)\b",
    r"validate\s+sender",
    r"webhook\s+security",
    r"telephony\s+provider",
    r"production\s+only",
    r"IMPLEMENT\w+",
    r"DO\s+NOT\s+DEPLOY",
]
RE = re.compile("|".join(f"({p})" for p in PATTERNS), re.IGNORECASE)

def scan_file(path: Path):
    try:
        text = path.read_text(errors='replace')
    except Exception:
        return []
    results = []
    for i, line in enumerate(text.splitlines(), start=1):
        if RE.search(line):
            results.append((i, line.strip()))
    return results

def load_donerefs():
    p = ROOT / 'donerefs.txt'
    if not p.exists():
        return []
    return [line.strip() for line in p.read_text().splitlines() if line.strip()]

def write_report(report_path: Path, lines):
    report_path.write_text("\n".join(lines) + "\n")

def main():
    timestamp = datetime.utcnow().isoformat() + 'Z'
    report_lines = [f"NON-PROD SCAN REPORT: {timestamp}"]

    donerefs = load_donerefs()
    report_lines.append(f"donerefs_count={len(donerefs)}")

    flagged = {}
    for rel in donerefs:
        fp = ROOT / rel
        if not fp.exists():
            continue
        matches = scan_file(fp)
        if matches:
            flagged[rel] = matches

    # Also scan entire repo for broader report (but keep separate file)
    all_instructions = {}
    for p in ROOT.rglob('*'):
        if p.is_file() and '.git' not in p.parts and p.match('*.placeholderfix.bak') is False:
            if p.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov']:
                continue
            rel = os.path.relpath(p, ROOT)
            matches = scan_file(p)
            if matches:
                all_instructions[rel] = matches

    # Report flagged donerefs
    report_lines.append('')
    report_lines.append(f'flagged_donerefs_count={len(flagged)}')
    for f, matches in sorted(flagged.items()):
        report_lines.append(f'-- {f} --')
        for ln, text in matches[:20]:
            report_lines.append(f'  {ln}: {text}')

    # Write full repo instruction report
    all_report = QM / 'all_instructions_report.txt'
    all_lines = [f'ALL INSTRUCTIONS SCAN: {timestamp}', f'total_files_with_matches={len(all_instructions)}', '']
    for f, matches in sorted(all_instructions.items()):
        all_lines.append(f'-- {f} --')
        for ln, text in matches[:10]:
            all_lines.append(f'  {ln}: {text}')

    write_report(all_report, all_lines)
    report_lines.append(f'WROTE: {all_report}')

    # If any flagged in donerefs, remove them from donerefs.txt (conservative)
    removed_list = []
    if flagged:
        donerefs_path = ROOT / 'donerefs.txt'
        bak = QM / f'donerefs.bak.{timestamp}'
        bak.write_text(donerefs_path.read_text())
        new_list = [d for d in donerefs if d not in flagged]
        donerefs_path.write_text('\n'.join(new_list) + ("\n" if new_list else ""))
        removed_list = sorted(flagged.keys())
        rlpath = QM / 'nonprod_removed.txt'
        write_report(rlpath, [f'REMOVED from donerefs at {timestamp}'] + removed_list)
        report_lines.append(f'REMOVED {len(removed_list)} entries from donerefs -> {rlpath}')

    # Always write a concise report
    rpt = QM / 'nonprod_scan_report.txt'
    write_report(rpt, report_lines)
    print(f'SCAN COMPLETE. flagged_in_donerefs={len(flagged)} total_files_with_matches={len(all_instructions)}')
    print(f'Reports: {rpt}, {all_report}')
    if removed_list:
        print(f'Removed {len(removed_list)} files from donerefs; backup at {bak}')

if __name__ == '__main__':
    main()
