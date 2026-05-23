#!/usr/bin/env python3
import os, re, json
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ignore_dirs = ['.venv', 'node_modules', '.git', 'tools', '__pycache__', '.backups']
patterns = [
    r"__MOCKS__",
    r"placeholder",
    r"TODO-PROD",
    r"dev-only",
    r"dummy",
    r"fake",
    r"sample",
    r"example",
    r"fixture",
    r"testdata",
    r"nonproduction",
    r"dev",
    r"simulate",
    r"// MOCK",
    r"# MOCK",
    r"TODO: replace",
]
compiled = [re.compile(p, re.IGNORECASE) for p in patterns]
results = []
for dirpath, dirnames, filenames in os.walk(root):
    skip = False
    for d in ignore_dirs:
        if os.path.sep + d + os.path.sep in dirpath + os.path.sep:
            skip = True
            break
    if skip:
        continue
    for f in filenames:
        if not f.lower().endswith(('.md','.py','.ts','.js','.tsx','.jsx','.json','.env','.sh','.yaml','.yml')):
            continue
        full = os.path.join(dirpath, f)
        try:
            with open(full, 'r', encoding='utf-8', errors='ignore') as fh:
                lines = fh.readlines()
        except Exception as e:
            continue
        for i, line in enumerate(lines):
            for pat in compiled:
                if pat.search(line):
                    results.append({
                        'file': os.path.relpath(full, root).replace('\\','/'),
                        'line_no': i+1,
                        'line': line.strip(),
                        'pattern': pat.pattern
                    })

# Group by file
from collections import defaultdict
grouped = defaultdict(list)
for r in results:
    grouped[r['file']].append(r)

out_dir = os.path.join(root, 'reports')
os.makedirs(out_dir, exist_ok=True)
json_path = os.path.join(out_dir, 'nonproduction_candidates.json')
md_path = os.path.join(out_dir, 'nonproduction_candidates.md')
with open(json_path, 'w', encoding='utf-8') as fh:
    json.dump({'count': len(results), 'items': results}, fh, indent=2)

with open(md_path, 'w', encoding='utf-8') as fh:
    fh.write('# Non-production candidates report\n')
    fh.write('Found {} matches across {} files\n\n'.format(len(results), len(grouped)))
    for file, items in sorted(grouped.items()):
        fh.write('## {} ({})\n\n'.format(file, len(items)))
        for it in items[:20]:
            fh.write(f"- Line {it['line_no']}: {it['line']}\n")
        fh.write('\n')

print('Wrote', json_path, 'and', md_path)
