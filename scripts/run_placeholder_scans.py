// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3

"""
Wrapper to run implementation scanners safely with timeouts and capture reports.

Runs:
 - scripts/scan_replace_placeholders.py (repo-wide scan)
 - scripts/placeholder_scanner.py (conservative scanner)

This wrapper uses subprocess with a timeout and stores outputs in
`.qmoi_validation/` and `docs/` as available.
"""
import json
import subprocess
import sys
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.qmoi_validation'
OUT.mkdir(parents=True, exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument('--timeout', type=int, default=300, help='timeout per scanner in seconds')
parser.add_argument('--verbose', action='store_true')
args = parser.parse_args()

def run(cmd, timeout):
    try:
        if args.verbose:
            print('Running:', ' '.join(cmd))
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
        return proc.returncode, proc.stdout, proc.stderr
    except subprocess.TimeoutExpired as e:
        return 124, '', f'Timeout after {timeout}s'
    except Exception as e:
        return 1, '', str(e)

def main():
    py = sys.executable
    # 1) run scan_replace_placeholders.py
    scan1 = [py, str(ROOT / 'scripts' / 'scan_replace_placeholders.py')]
    rc, out, err = run(scan1, args.timeout)
    (OUT / 'scan_replace_placeholders.stdout.txt').write_text(out)
    (OUT / 'scan_replace_placeholders.stderr.txt').write_text(err)
    print('scan_replace_placeholders.py rc=', rc)

    # 2) run placeholder_scanner.py with suggestions output
    scan2 = [py, str(ROOT / 'scripts' / 'placeholder_scanner.py'), '--report', str(OUT / 'placeholder_report.json')]
    rc2, out2, err2 = run(scan2, args.timeout)
    (OUT / 'placeholder_scanner.stdout.txt').write_text(out2)
    (OUT / 'placeholder_scanner.stderr.txt').write_text(err2)
    print('placeholder_scanner.py rc=', rc2)

    # Summarize
    summary = {
        'scan_replace_placeholders': {'rc': rc, 'stdout': str(OUT / 'scan_replace_placeholders.stdout.txt')},
        'placeholder_scanner': {'rc': rc2, 'stdout': str(OUT / 'placeholder_scanner.stdout.txt')}
    }
    (OUT / 'placeholder_scans_summary.json').write_text(json.dumps(summary, indent=2))
    print('Wrote summary to', OUT / 'placeholder_scans_summary.json')

if __name__ == '__main__':
    main()
