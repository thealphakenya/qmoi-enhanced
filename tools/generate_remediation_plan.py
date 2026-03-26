// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Generate a remediation plan from matches_with_comments.json.

This script classifies matches and assigns a suggested action and priority.
It writes `remediation_plan.json` which can be used to create tasks or PRs.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
IN = ROOT / 'matches_with_comments.json'
OUT = ROOT / 'remediation_plan.json'

VENDOR_PATTERNS = [r"\.npm-cache", r"node_modules", r"\.venv", r"venv", r"\.git/"]
CODE_EXTS = {'.py', '.ts', '.js', '.tsx', '.jsx', '.go', '.rs', '.java', '.kt', '.swift'}

def is_vendor(path):
    return any(re.search(p, path) for p in VENDOR_PATTERNS)

def classify(entry):
    path = entry['file']
    ext = Path(path).suffix.lower()
    action = 'manual_implement'
    priority = 3
    if is_vendor(path):
        action = 'exclude_vendor_review'
        priority = 5
    elif ext in CODE_EXTS:
        # code files are high priority
        action = 'review_and_implement'
        priority = 1
    elif ext in {'.md', '.txt', '.json'}:
        action = 'doc_update_or_remove_placeholder'
        priority = 4
    else:
        action = 'review'
        priority = 3

    # bump priority for known sensitive paths
    if re.search(r"payments|stripe|wallet|secure|auth|biometric|device|integration|adapters|services", path, re.I):
        priority = max(1, priority-1)

    return {
        'file': path,
        'line': entry['line'],
        'snippet': entry.get('snippet',''),
        'comment_block': entry.get('comment_block',''),
        'suggested_action': action,
        'priority': priority,
    }

def main():
    if not IN.exists():
        print('Run tools/extract_comments.py first to produce matches_with_comments.json')
        return
    entries = json.loads(IN.read_text(encoding='utf-8'))
    plan = [classify(e) for e in entries]
    # sort by priority and group by file
    plan_sorted = sorted(plan, key=lambda x: (x['priority'], x['file'], x['line']))
    OUT.write_text(json.dumps(plan_sorted, indent=2), encoding='utf-8')
    print(f'Wrote remediation plan with {len(plan_sorted)} items to {OUT}')

if __name__ == '__main__':
    main()
