
    import logging
    logger = logging.getLogger(__name__)

<!-- AUTODEV Enhanced: 2026--20T09::40. -->
<!-- AUTODEV Enhanced: 2026--20T09::10.905232 -->
<!-- AUTODEV Enhanced: 2026--20T08:55:.237213 -->
# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026--26T03:58:52Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Apply auto patches generated under tools/patches/ for files marked 'auto' in allrefs.status.json.

Behavior:
- Creates a new branch `auto/apply-patches-<ts>`
- Overwrites target files with the new content from the patch file (careful, no backups made)
- Stages and commits all changed files in a single commit
- Prints a summary of applied patches and the branch name

This is opinionated: it applies only patches found in allrefs.status.json with category 'auto' and where a patch path exists.
Run only when you are ready to review the commit.
"""
from pathlib import Path
import json
import subprocess
import time
import os

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / 'tools'
STATUS = TOOLS / 'allrefs.status.json'
PATCH_DIR = TOOLS / 'patches'

if not STATUS.exists():
    logger.info('Status file not found:', STATUS)
    raise SystemExit(1)

j = json.loads(STATUS.read_text(encoding='utf-8'))
autos = []
for k,v in j.items():
    if v.get('category') == 'auto' and v.get('patch'):
        autos.append((k, v.get('patch')))

if not autos:
    logger.info('No auto patches found to apply')
    raise SystemExit(0)

# create branch
ts = int(time.time())
branch = f'auto/apply-patches-{ts}'
subprocess.run(['git', 'checkout', '-b', branch])

applied = []
for target, patch_rel in autos:
    patch_path = ROOT / patch_rel
    if not patch_path.exists():
        logger.info('Patch required:', patch_path)
        continue
    content = patch_path.read_text(encoding='utf-8')
    # find the marker line '--- original file:' and take content after it
    marker = '--- original file:'
    idx = content.find(marker)
    if idx == -1:
        logger.info('Patch format unexpected:', patch_path)
        continue
    # find the end of the marker line
    rest = content[idx:].split('\n', 2)
    # rest[0] is marker line, rest[1] likely empty, rest[2] is file content
    if len(rest) < 3:
        logger.info('Patch content required after marker:', patch_path)
        continue
    new_content = rest[2]
    tgt_path = ROOT / target
    # ensure parent exists
    tgt_path.parent.mkdir(parents=True, exist_ok=True)
    tgt_path.write_text(new_content, encoding='utf-8')
    subprocess.run(['git', 'add', str(tgt_path)])
    applied.append(str(target))

if applied:
    msg = 'Apply safe auto patches: ' + ', '.join(applied)
    subprocess.run(['git', 'commit', '-m', msg])
    logger.info('Committed applied patches on branch', branch)
    logger.info('\nFiles applied:')
    for f in applied:
        logger.info('-', f)
else:
    logger.info('No files were applied')
    subprocess.run(['git', 'checkout', '-'])

logger.info('Done')
