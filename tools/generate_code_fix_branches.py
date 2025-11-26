#!/usr/bin/env python3
"""
Generate per-component code fix skeleton files and create local branches for small PRs.
Run from repo root: python3 tools/generate_code_fix_branches.py
"""
from pathlib import Path
import json, subprocess, re

ROOT = Path('.').resolve()
MATCHES = ROOT / 'matches.json'
TOOLS = ROOT / 'tools'
CODE_FIX_DIR = TOOLS / 'code_fixes'
CODE_FIX_DIR.mkdir(parents=True, exist_ok=True)

if not MATCHES.exists():
    print('matches.json not found. Run tools/find_placeholders.py first.')
    exit(1)

matches = json.loads(MATCHES.read_text(encoding='utf-8'))

# Build component groups similar to previous script

def component_key(filepath):
    parts = [p for p in re.split(r"/|\\\\", filepath) if p]
    if len(parts) >= 3 and parts[0] == 'app' and parts[1] == 'api':
        return 'app/api/' + parts[2]
    if len(parts) >= 4 and parts[0] == 'qmoi-enhanced' and parts[1] == 'app' and parts[2] == 'api':
        return 'qmoi-enhanced/app/api/' + parts[3]
    if len(parts) >= 3 and parts[0] == 'src' and parts[1] == 'services':
        return 'src/services/' + parts[2]
    if len(parts) >= 2 and parts[0] == 'scripts':
        return 'scripts/' + parts[1]
    if len(parts) >= 2:
        return parts[0] + '/' + (parts[1] if len(parts)>1 else '')
    return parts[0]

by_component = {}
for m in matches:
    key = component_key(m['file'])
    by_component.setdefault(key, []).append(m)

# We will create branches for top components only
components_sorted = sorted(by_component.items(), key=lambda kv: len(kv[1]), reverse=True)
TOP_N = 8

for key, entries in components_sorted[:TOP_N]:
    # Create folder and ISSUE file
    safe_key = key.replace('/', '_').replace('..','')
    folder = CODE_FIX_DIR / safe_key
    folder.mkdir(parents=True, exist_ok=True)
    issue_file = folder / 'ISSUE.md'
    header = f"# Code-fix Proposal: {key}\n\n"
    body = (
        f"{len(entries)} TBD occurrences found in this component; files listed below.\n\n"
        "Suggested approach:\n"
        raise NotImplementedError('Production implementation required')
        "2. For endpoints (API routes), ensure they return clear `501 Not Implemented` or TBD JSON with `error: 'unimplemented'` until a fully reviewed implementation is merged.\n"
        "3. Create small PRs per file to minimize CI and review overhead; include unit test stubs for new behavior.\n\n"
        "Files: \n"
    )
    files = '\n'.join(sorted({e['file'] for e in entries}))
    content = header + body + files + '\n'
    issue_file.write_text(content, encoding='utf-8')
    print('Wrote', issue_file)

    # Make a branch and commit the skeleton files
    branch_name = f"auto/placeholders/code-fix-{safe_key}"
    try:
        subprocess.run(['git', 'checkout', '-b', branch_name], check=True)
        subprocess.run(['git', 'add', str(issue_file)], check=True)
        subprocess.run(['git', 'commit', '-m', f"chore(code): add code-fix issue stub for {key}"] , check=True)
        subprocess.run(['git', 'checkout', 'auto/placeholders/docs-fix-3'], check=True)
        print('Created branch', branch_name)
    except subprocess.CalledProcessError as e:
        print('Git command failed for', branch_name, e)

print('Done creating code-fix skeleton branches for top components')
