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

ROOT = Path('.').resolve()
TOOLS = ROOT / 'tools'
PATCH_DIR = TOOLS / 'patches'
PATCH_DIR.mkdir(parents=True, exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument('--files-file', default='placeholdrefs_P0.txt')
parser.add_argument('--limit', type=int, default=200)
parser.add_argument('--apply', action='store_true')
parser.add_argument('--dry-run', action='store_true')
parser.add_argument('--batch-num', type=int, default=1)
args = parser.parse_args()

p = Path(args.files_file)
if not p.exists():
    print('Files file not found:', p)
    exit(1)

targets = [Path(line.strip()) for line in p.read_text(encoding='utf-8').splitlines() if line.strip()]
targets = [t for t in targets if t.exists()]

count = 0
edits = {}
for fp in targets:
    if count >= args.limit:
        break
    try:
        txt = fp.read_text(encoding='utf-8')
    except Exception:
        continue
    ext = fp.suffix.lower()
    # Python heuristic: replace 'pass' within placeholder-annotated contexts
    if ext == '.py':
        lines = txt.splitlines(keepends=True)
        modified = False
        for i in range(len(lines)):
            window = ''.join(lines[max(0, i - 8):min(len(lines), i + 8)])
            if re.search(r"\bpass\b", window) and re.search(r"placeholder|TODO|FIXME|TBD|REPLACE_ME|dev only|not for production|mock", window, re.I):
                # find the pass line index from window
                for j in range(max(0, i - 8), min(len(lines), i + 8)):
                    if re.search(r"^\s*pass\s*(#.*)?$", lines[j]):
                        indent = re.match(r"^(\s*)", lines[j]).group(1)
                        reason = 'Auto-draft: production implementation required'
                        lines[j] = indent + f"raise NotImplementedError('{reason}')\n"
                        modified = True
                        break
        if modified:
            new = ''.join(lines)
            edits[str(fp)] = (txt, new)
            count += 1
    elif ext in ['.ts', '.tsx', '.js', '.jsx']:
        lines = txt.splitlines(keepends=True)
        modified = False
        for i in range(len(lines)):
            window = ''.join(lines[max(0, i - 8):min(len(lines), i + 8)])
            # look for placeholder comments or returns
            if re.search(r"placeholder|TODO|FIXME|TBD|REPLACE_ME|dev only|not for production|mock", window, re.I):
                for j in range(max(0, i - 8), min(len(lines), i + 8)):
                    if re.search(r"^\s*return\s*;?\s*(//.*)?$", lines[j]) or re.search(r"^\s*//.*placeholder|TODO|FIXME", lines[j], re.I) or re.search(r"/\*.*placeholder.*\*/", lines[j], re.I):
                        indent = re.match(r"^(\s*)", lines[j]).group(1)
                        # detect route response usage (res.status/res.json)
                        route_resp = False
                        for k in range(max(0, i - 8), min(len(lines), i + 8)):
                            if re.search(r"\b(res|response|reply)\.(status|json|end|send)\b", lines[k]):
                                route_resp = True
                                break
                        if route_resp:
                            lines[j] = indent + "return res.status(501).json({ error: 'Not implemented: production implementation required' });\n"
                        else:
                            lines[j] = indent + "throw new Error('NotImplemented: production implementation required');\n"
                        modified = True
                        break
        if modified:
            new = ''.join(lines)
            edits[str(fp)] = (txt, new)
            count += 1
    else:
        # fallback: replace plain 'placeholder' occurrences conservatively
        new_text = txt
        # replace 'placeholder' inside single or double quoted strings
        new_text = re.sub(r"(['\"])placeholder\1", r"\1Not implemented: TBD\1", new_text, flags=re.I)
        # template literals (JS/TS)
        new_text = re.sub(r"`placeholder`", "`Not implemented: TBD`", new_text, flags=re.I)
        # comment occurrences (single-line comments) e.g., // placeholder or # placeholder
        new_text = re.sub(r"(?m)^(\s*(//|#).*?)\bplaceholder\b(.*)$", r"\1TBD (see PLACEHOLDER_REMEDIATION_PLAN.md)\3", new_text, flags=re.I)
        # last resort: replace any standalone placeholder word in the file (docs or content)
        new_text = re.sub(r"(?i)\bplaceholder\b", "TBD (see PLACEHOLDER_REMEDIATION_PLAN.md)", new_text)
        if new_text != txt:
            edits[str(fp)] = (txt, new_text)
            count += 1

# write a single patch for the batch
if edits:
    out_patch = PATCH_DIR / f'pass_fixes_batch_{args.batch_num}.patch'
    parts = []
    for rel, (orig, new) in edits.items():
        orig_lines = orig.splitlines(keepends=True)
        new_lines = new.splitlines(keepends=True)
        parts.extend(difflib.unified_diff(orig_lines, new_lines, fromfile=rel, tofile=rel + ' (proposed)', lineterm=''))
    out_patch.write_text('\n'.join(parts), encoding='utf-8')
    print('Wrote patch to', out_patch, 'with', len(edits), 'edits')
    if args.dry_run:
        for f in edits:
            print('Would edit:', f)
        print('Dry-run mode: patch not applied')
    if args.apply:
        branch = f'auto/placeholders/auto-apply-final-batch-{args.batch_num}'
        # create branch, apply and commit
        import subprocess
        subprocess.run(['git', 'checkout', '-b', branch], check=True)
        try:
            subprocess.run(['git', 'apply', '--index', str(out_patch)], check=True)
            subprocess.run(['git', 'add', '-A'], check=True)
            subprocess.run(['git', 'commit', '-m', f'chore(placeholders): auto-apply safe replacements batch {args.batch_num}'], check=True)
            subprocess.run(['git', 'push', '--set-upstream', 'origin', branch], check=True)
            print('Applied patch and pushed branch', branch)
        except subprocess.CalledProcessError as e:
            print('Failed to apply or commit patch:', e)
            subprocess.run(['git', 'checkout', 'auto/placeholders/auto-apply-final'], check=False)
else:
    print('No safe edits detected in this batch')
