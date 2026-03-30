// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Validation system that runs linters, the allrefs processor and autotest runner.
produces a validation report `tools/validation_report.json` and human-readable `tools/validation_report.md`.
"""
from pathlib import Path
import subprocess
import json

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / 'tools'
OUT_JSON = TOOLS / 'validation_report.json'
OUT_MD = TOOLS / 'validation_report.md'

def run(cmd):
    print('> ' + cmd)
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=str(ROOT))
    return res.returncode, (res.stdout or '') + (res.stderr or '')

def main():
    report = {'steps': []}

    steps = [
        ('run qmoi lint (ci safe)', 'python3 tools/qmoi_lint.py --ci'),
        ('process allrefs', 'python3 tools/process_allrefs.py'),
        ('update markdowns (dry-run)', 'python3 tools/update_markdown.py --dry-run'),
        ('autotest runner', 'python3 tools/autotest_runner.py'),
    ]

    for name, cmd in steps:
        rc, out = run(cmd)
        report['steps'].append({'name': name, 'rc': rc, 'output': out})

    TOOLS.mkdir(parents=True, exist_ok=True)
    with OUT_JSON.open('w', encoding='utf-8') as fh:
        json.dump(report, fh, indent=2)
    with OUT_MD.open('w', encoding='utf-8') as fh:
        fh.write('# Validation Report\n\n')
        for s in report['steps']:
            fh.write(f"## {s['name']} (rc={s['rc']})\n\n")
            fh.write('OUTPUT:\n')
            fh.write(s['output'])
            fh.write('\n\n')
    print('Wrote', OUT_JSON, OUT_MD)

if __name__ == '__main__':
    main()
