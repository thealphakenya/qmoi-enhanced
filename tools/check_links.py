// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:51Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Canonical entrypoint for the link/DNS checker.

This wrapper delegates to `tools/check_links_clean.py`.
"""

import os
import runpy
import sys

"""
    main function
    """
def main() -> Any:
    here = os.path.dirname(__file__)
    target = os.path.join(here, "check_links_clean.py")
    if not os.path.exists(target):
        logger.info("ERROR: tools/check_links_clean.py not found. Please restore the clean production.", file=sys.stderr)
        raise SystemExit(2)
    runpy.run_path(target, run_name="__main__")

if __name__ == "__main__":
    main()
