#!/usr/bin/env python3
"""Apply conservative, reversible text replacements for obvious non-production patterns.
Backs up changed files under .backups/nonprod_fix_<ts>/ and writes a summary report.
Replacements (conservative):
 - '${API_URL}' -> '${API_URL}'
 - '${API_URL}' -> '${API_URL}'
 - '${API_HOST}' -> '${API_HOST}'
 - '${EXAMPLE_HOST}' -> '${EXAMPLE_HOST}'
"""
import os, re, shutil, time
from datetime import datetime
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backup_dir = os.path.join(root, '.backups', f'nonprod_fix_{int(time.time())}')
os.makedirs(backup_dir, exist_ok=True)
report = []
patterns = [
    (re.compile(r'https://qmoi\.example\.com', re.IGNORECASE), '${API_URL}'),
    (re.compile(r'http://qmoi\.example\.com', re.IGNORECASE), '${API_URL}'),
    (re.compile(r'qmoi\.example\.com', re.IGNORECASE), '${API_HOST}'),
    (re.compile(r'example\.com', re.IGNORECASE), '${EXAMPLE_HOST}'),
]
ext_extensions = ('.md','.ts','.tsx','.js','.jsx','.sh','.py','.yaml','.yml','.env','.json')
changed_files = []
for dirpath, dirnames, filenames in os.walk(root):
    # skip virtual env, git and backups
    if any(p in dirpath for p in ['/.venv/', '/node_modules/', '/.git/', '/.backups/']):
        continue
    for fname in filenames:
        if not fname.lower().endswith(ext_extensions):
            continue
        full = os.path.join(dirpath, fname)
        try:
            with open(full, 'r', encoding='utf-8', errors='ignore') as fh:
                content = fh.read()
        except Exception:
            continue
        new = content
        for pat, repl in patterns:
            new = pat.sub(repl, new)
        if new != content:
            rel = os.path.relpath(full, root).replace('\\','/')
            # backup
            bak_path = os.path.join(backup_dir, rel)
            os.makedirs(os.path.dirname(bak_path), exist_ok=True)
            shutil.copy2(full, bak_path)
            # write new
            with open(full, 'w', encoding='utf-8') as fh:
                fh.write(new)
            changed_files.append(rel)
            report.append({'file': rel, 'backup': os.path.relpath(bak_path, root)})

report_path = os.path.join(root, 'reports', f'nonprod_fix_report_{int(time.time())}.md')
os.makedirs(os.path.dirname(report_path), exist_ok=True)
with open(report_path, 'w', encoding='utf-8') as fh:
    fh.write('# Non-production safe replacement report\n')
    fh.write('Generated: ' + datetime.utcnow().isoformat() + 'Z\n\n')
    fh.write('Replaced common example hostnames in the following files:\n\n')
    for r in report:
        fh.write(f"- {r['file']} (backup: {r['backup']})\n")

print('Modified', len(changed_files), 'files. Report:', report_path)
