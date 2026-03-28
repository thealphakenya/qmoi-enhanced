// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
QMOI Auto Full Recovery Script

This orchestrator script runs all available health and link automation routines to drive QMOI
towards 100% domain and link health in production.

1. Domain registry check
2. Domain health check (multi-region)
3. DNS crisis auto-repair suggestions
4. Link audit + auto-fix
5. Report generation

Author: QMOI Enhancement System
Date: 2026-03-21
"""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path('/workspaces/qmoi-enhanced')

def run_cmd(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr, file=sys.stderr)
        raise RuntimeError(f"Command failed: {cmd}")
    return result

def main():
    print("=== QMOI Auto Full Recovery: START ===")

    # 1. Domain health check advanced
    run_cmd('python3 scripts/domain_health_check_advanced.py')

    # 2. DNS crisis auto-fix & fallback suggestions
    run_cmd('python3 scripts/validate_and_sync_links.py --action auto-fix-dns')

    # 3. Full link scan + auto-fix
    run_cmd('python3 scripts/validate_and_sync_links.py --action all')

    # 4. Documentation audit
    run_cmd('python3 scripts/documentation_audit_and_fix.py --action audit')

    # 5. Re-run domain health and final report
    run_cmd('python3 scripts/domain_health_check_advanced.py')
    run_cmd('python3 scripts/validate_and_sync_links.py --action scan --skip-auto-fix')

    print("=== QMOI Auto Full Recovery: COMPLETE ===")

    # Consolidate report paths
    print("Reports:")
    print(" - domain_health_report.json")
    print(" - dns_crisis_report.json")
    print(" - link_validation_report.json")
    print(" - documentation_audit_report.json")

    return 0

if __name__ == '__main__':
    try:
        exit(main())
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
