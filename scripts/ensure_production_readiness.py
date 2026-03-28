// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:56Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import subprocess
import sys

def run_command(cmd):
    print('Running:', cmd)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print('ERROR (returncode', result.returncode, ')', result.stderr)
        sys.exit(result.returncode)
    return result.stdout

def parse_scan_percentage(scan_output):
    # find line with "non-production marker files" or "No non-production markers"
    if 'No non-production markers found' in scan_output:
        return 0.0
    for line in scan_output.splitlines():
        if 'Scan complete. Total non-production marker files:' in line:
            parts = line.split(':', 1)[1].strip().split('/')
            if len(parts) >= 2:
                try:
                    remaining = float(parts[0].strip())
                    total = float(parts[1].split()[0].strip())
                    return round(remaining / total * 100, 2) if total > 0 else 0.0
                except Exception:
                    continue
    return None

def main():
    max_cycles = 10
    for cycle in range(1, max_cycles + 1):
        print(f'\n=== Production readiness cycle {cycle} ===')
        run_command('python3 scripts/finalize_production_ready.py')
        scan_out = run_command('python3 scripts/scan_nonproduction_endpoints.py')
        percentage = parse_scan_percentage(scan_out)
        if percentage is None:
            print('Could not parse percentage from scan output. Stopping.')
            break
        print(f'Current non-production percent: {percentage}%')
        if percentage == 0.0:
            print('✅ Production readiness achieved: 100% complete.')
            break
    else:
        print('⚠️ Max cycles reached; production readiness may still not be 100%.')

if __name__ == '__main__':
    main()
