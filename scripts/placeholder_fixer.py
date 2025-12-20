# NOTE: 3 placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.
#!/usr/bin/env python3
"""
Conservative placeholder fixer:
- Scans repository for the token '[PRODUCTION IMPLEMENTATION REQUIRED]' and related markers.
- For documentation/text files (.md, .txt, .json, .yml, .yaml) it replaces the marker with a safe token 'TODO_PROD [PRODUCTION: review and implement]'.
- For small config-like keys such as 'do_[PRODUCTION IMPLEMENTATION REQUIRED]' -> replaces with 'do_sample'.
- For code files (.py, .js, .ts, .sh, .tsx, .jsx) it does NOT modify code; instead it inserts a top-of-file comment noting placeholders were found and creates a per-file backup.
- Always creates a backup file named <file>.placeholderfix.bak before making any change.
- Writes a report to `.qmoi_validation/placeholder_fix_report.txt` listing findings and actions.

Run this from the repo root. It's conservative and reversible.
"""
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / '.qmoi_validation'
REPORT_DIR.mkdir(exist_ok=True)
REPORT = REPORT_DIR / 'placeholder_fix_report.txt'

TEXT_EXTS = {'.md', '.txt', '.json', '.yml', '.yaml', '.cfg', '.ini', '.rst'}
CODE_EXTS = {'.py', '.js', '.ts', '.sh', '.jsx', '.tsx'}

PH_PAT = re.compile(r"\[PRODUCTION IMPLEMENTATION REQUIRED\]")
DO_PH = re.compile(r"do_\[PRODUCTION IMPLEMENTATION REQUIRED\]")

def backup(path: Path):
    bak = path.with_suffix(path.suffix + '.placeholderfix.bak')
    if not bak.exists():
        bak.write_bytes(path.read_bytes())
    return bak

def replace_in_text(content: str) -> (str, int):
    """Replace placeholders in text-like files. Return new content and number replacements."""
    count = 0
    # replace do_... first
    new, n1 = DO_PH.subn('do_sample', content)
    new, n2 = PH_PAT.subn('TODO_PROD [PRODUCTION: review and implement]', new)
    count = n1 + n2
    return new, count

def annotate_code_file(path: Path, matches: int):
    # Add a top-of-file comment warning (language-aware)
    ext = path.suffix.lower()
    if ext == '.py':
        comment = f"# NOTE: {matches} placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.\n"
    else:
        comment = f"// NOTE: {matches} placeholder(s) found in this file. See .qmoi_validation/placeholder_fix_report.txt for details.\n"
    text = path.read_text(encoding='utf-8')
    if text.startswith(comment):
        return False
    backup(path)
    path.write_text(comment + text, encoding='utf-8')
    return True

def process_file(path: Path, report_lines: list):
    try:
        content = path.read_text(encoding='utf-8')
    except Exception:
        return

    ph_matches = len(PH_PAT.findall(content)) + len(DO_PH.findall(content))
    if ph_matches == 0:
        return

    report_lines.append(f"FOUND: {path} - {ph_matches} placeholder(s)")

    if path.suffix.lower() in TEXT_EXTS:
        backup(path)
        new_content, replaced = replace_in_text(content)
        path.write_text(new_content, encoding='utf-8')
        report_lines.append(f"REPLACED {replaced} occurrences in {path}")
    elif path.suffix.lower() in CODE_EXTS:
        changed = annotate_code_file(path, ph_matches)
        report_lines.append(f"ANNOTATED {path} (top-of-file comment added: {changed})")
    else:
        # For other files (e.g., markdown variants), try safe replacement
        backup(path)
        new_content, replaced = replace_in_text(content)
        path.write_text(new_content, encoding='utf-8')
        report_lines.append(f"REPLACED {replaced} occurrences in {path} (other ext)")

def main():
    report_lines = []
    files = []
    for root, dirs, filenames in os.walk(ROOT):
        # skip .git and .venv and node_modules
        if '.git' in root.split(os.sep) or '.venv' in root.split(os.sep) or 'node_modules' in root.split(os.sep):
            continue
        for fn in filenames:
            p = Path(root) / fn
            # skip our own report and backups
            if p.match('*.placeholderfix.bak') or p.match('*.placeholderfix.py'):
                continue
            files.append(p)

    for p in files:
        process_file(p, report_lines)

    if report_lines:
        REPORT.write_text('\n'.join(report_lines) + '\n', encoding='utf-8')
        print(f"Wrote report to {REPORT}")
    else:
        print("No placeholders found.")

if __name__ == '__main__':
    main()
