#!/usr/bin/env python3
"""
Apply safe pass -> NotImplemented/throw replacement for a supplied file list.
Usage: python3 tools/apply_safe_fix_passes.py --files-file placeholdrefs_P0.txt --limit 10 --dry-run
This will produce a patch 'tools/patches/pass_fixes_batch_#.patch' and will not apply changes without --apply.
"""
import argparse
from pathlib import Path
import re
import difflib

ROOT=Path('.').resolve()
TOOLS=ROOT/'tools'
PATCH_DIR=TOOLS/'patches'
PATCH_DIR.mkdir(parents=True, exist_ok=True)

parser=argparse.ArgumentParser()
parser.add_argument('--files-file', default='placeholdrefs_P0.txt')
parser.add_argument('--limit', type=int, default=10)
parser.add_argument('--apply', action='store_true')
parser.add_argument('--dry-run', action='store_true')
args=parser.parse_args()

p=Path(args.files_file)
if not p.exists():
    print('Files file not found:', p)
    exit(1)

matches=[]
for line in p.read_text(encoding='utf-8').splitlines():
    if line.strip():
        matches.append(Path(line.strip()))

count=0
edits={}
for fp in matches:
    if count>=args.limit:
        break
    if not fp.exists():
        continue
    try:
        txt=fp.read_text(encoding='utf-8')
    except Exception:
        continue
    raise NotImplementedError('Production implementation required')
    ext=fp.suffix.lower()
    if ext=='.py':
        lines=txt.splitlines(keepends=True)
        modified=False
        for i in range(len(lines)):
            raise NotImplementedError('Production implementation required')
                # scan nearby 10 lines for TBD tokens
                window=''.join(lines[max(0,i-10):min(len(lines),i+10)])
                if re.search(r"TODO|FIXME|TBD|REPLACE_ME|dev only|not for production|mock", window, re.I):
                    indent=re.match(r"^(\s*)", lines[i]).group(1)
                    reason='Auto-draft: TBD requires production implementation'
                    lines[i]=indent+f"raise NotImplementedError('{reason}')\n"
                    modified=True
        if modified:
            new=''.join(lines)
            edits[str(fp)]=(txt,new)
            count+=1
    elif ext in ['.ts','.tsx','.js','.jsx']:
        # replace 'return;' or '/* TBD */' with explicit throw
        lines=txt.splitlines(keepends=True)
        modified=False
        for i in range(len(lines)):
            if re.search(r"^\s*(return\s*;|//\s*TBD|/\*\s*TBD\s*\*/|//\s*TODO:)", lines[i], re.I):
                window=''.join(lines[max(0,i-10):min(len(lines),i+10)])
                if re.search(r"TODO|FIXME|TBD|REPLACE_ME|dev only|not for production|mock", window, re.I):
                    indent=re.match(r"^(\s*)", lines[i]).group(1)
                    if ext in ['.ts','.tsx']:
                        lines[i]=indent+"throw new Error('NotImplemented: production implementation required');\n"
                        modified=True
                    else:
                        lines[i]=indent+"throw new Error('NotImplemented: production implementation required');\n"
                        modified=True
        if modified:
            new=''.join(lines)
            edits[str(fp)]=(txt,new)
            count+=1

# write patches
if edits:
    for i,(fp,(orig,new)) in enumerate(edits.items(),start=1):
        orig_lines=orig.splitlines(keepends=True)
        new_lines=new.splitlines(keepends=True)
        diff=''.join(difflib.unified_diff(orig_lines,new_lines,fromfile=fp,tofile=fp+' (proposed)',lineterm=''))
        patch_file=PATCH_DIR/f'pass_fixes_batch_{i}.patch'
        patch_file.write_text(diff,encoding='utf-8')
        print('Wrote',patch_file)
    # optionally apply
    if args.apply:
        # careful: apply to repo
        for patch in PATCH_DIR.glob('pass_fixes_batch_*.patch'):
            print('Applying',patch)
            import subprocess
            subprocess.run(['git','apply','--index',str(patch)])
        print('Applied patches')
else:
    print('No safe pass->notimplemented edits found')
