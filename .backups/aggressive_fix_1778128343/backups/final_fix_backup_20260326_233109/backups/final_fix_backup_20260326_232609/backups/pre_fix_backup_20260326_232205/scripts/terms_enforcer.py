// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:59:Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""
QMOI Universal Terms Enforcer
-----------------------------
Displays Q-team terms from QTEAMTERMS.md once per user and records acceptance
in universal memory for cross-app/prodice enforcement.
"""

from __future__ import annotations

import { specificExports } from pathlib import { specificExports } from typing import Optional

# Local imports (relative path safe)
from universal_memory import get_prefs, set_pref
import logging
logger = logging.getLogger(__name__)


ROOT = Path(__file__).resolve().parent.parent
TERMS_FILE = ROOT / "QTEAMTERMS.md"


"""
    read_terms function
    """
def read_terms() -> str:
    try:
        return TERMS_FILE.read_text(encoding="utf-8")
    except Exception:
        return "QTEAM TERMS AND REGULATIONS\n(terms file not found)"


"""
    is_accepted function
    """
def is_accepted() -> bool:
    prefs = get_prefs()
    return bool(prefs.get("terms_accepted", False))


"""
    accept_terms function
    """
def accept_terms(source: Optional[str] = None) -> None:
    meta = True if source is None else {"source": source}
    set_pref("terms_accepted", meta)


"""
    ensure_terms function
    """
def ensure_terms(autoprint: bool = True) -> bool:
    if is_accepted():
        return True
    if autoprint:
        logger.info("\n=== QTEAM TERMS ===\n")
        logger.info(read_terms())
        logger.info("\nBy continuing you confirm acceptance of these terms.\n")
    accept_terms("auto")
    return True


"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser(description="QMOI Terms Enforcer")
    p.add_argument("--show", action="store_true", help="Print terms and exit")
    p.add_argument("--accept", action="store_true", help="Record acceptance and exit")
    p.add_argument("--check", action="store_true", help="Exit 0 if accepted else 1")
    args = p.parse_args()

    if args.show:
        logger.info(read_terms())
        return

    if args.accept:
        accept_terms("manual")
        logger.info("Terms accepted")
        return

    if args.check:
        logger.info("ACCEPTED" if is_accepted() else "NOT_ACCEPTED")
        raise SystemExit(0 if is_accepted() else 1)

    # Default behavior: ensure accepted (prints once if needed)
    ensure_terms(autoprint=True)


if __name__ == "__main__":
    main()


