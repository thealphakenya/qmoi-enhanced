#!/usr/bin/env python3
"""Generate a safe git-format patch with suggested redactions for placeholder/secret hits.

Reads `tmp/placeholders_report.json` and writes a unified diff to `tmp/placeholder_patch.diff`.
This script does not modify the repo; it produces a patch file for review.
"""
import json
from pathlib import Path
import difflib
import re

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / 'tmp' / 'placeholders_report.json'
OUT = ROOT / 'tmp' / 'placeholder_patch.diff'
WORKDIR = ROOT / 'tmp' / 'patch_workdir'
WORKDIR.mkdir(parents=True, exist_ok=True)

REPLACEMENTS = [
    # pattern fragment -> replacement
    (re.compile(r"\bdev-token\b", re.I), '<REDACTED_TOKEN>'),
    (re.compile(r"\byour-token\b", re.I), '<REDACTED_TOKEN>'),
    (re.compile(r"<API_KEY>|<SECRET>", re.I), '<REDACTED>'),
    (re.compile(r"sk_test_[A-Za-z0-9_\-]+"), '<STRIPE_TEST_KEY>'),
    (re.compile(r"whsec_[A-Za-z0-9_\-]+"), '<STRIPE_WEBHOOK_SECRET>'),
    # generic API/secret values (very conservative)
    (re.compile(r"(?P<k>(?:API_KEY|API_SECRET|SECRET|TOKEN|KEY|PASSWORD)\s*[=:]\s*)[\"']?(?P<v>[A-Za-z0-9\-_=]+)[\"']?", re.I), lambda m: m.group('k') + '<REDACTED>'),
]


def load_report():
    if not REPORT.exists():
        print('Report not found:', REPORT)
        return {}
    return json.loads(REPORT.read_text())


def safe_replace(text):
    new = text
    for pat, repl in REPLACEMENTS:
        if callable(repl):
            new = pat.sub(repl, new)
        else:
            new = pat.sub(repl, new)
    return new


def make_patch():
    report = load_report()
    files = report.get('files', {})
    diffs = []
    for rel, findings in files.items():
        src = ROOT / rel
        if not src.exists():
            continue
        try:
            orig = src.read_text()
        except Exception:
            continue
        modified = orig
        # Apply replacements conservatively for each distinct match string
        matches = set([f.get('match') for f in findings if f.get('match')])
        for m in matches:
            if not m:
                continue
            # escape for literal replace
            safe_m = m
            # do a conservative replacement only if the match looks like a token (no long text)
            if len(safe_m) > 2 and len(safe_m) < 200:
                # Try a safe replacement via pattern list
                new_m = safe_replace(safe_m)
                if new_m != safe_m:
                    modified = modified.replace(safe_m, new_m)
        if modified != orig:
            # write modified to workdir for review
            outpath = WORKDIR / rel
            outpath.parent.mkdir(parents=True, exist_ok=True)
            outpath.write_text(modified)
            # create unified diff
            diff = difflib.unified_diff(orig.splitlines(keepends=True), modified.splitlines(keepends=True), fromfile=str(src), tofile=str(outpath))
            diffs.extend(list(diff))
    if diffs:
        OUT.write_text(''.join(diffs))
        print('Wrote patch diff to', OUT)
    else:
        print('No safe replacements detected; no patch written.')


if __name__ == '__main__':
    make_patch()
