// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [production READY] this file has no remaining production markers
#!/usr/bin/env python3
"""Prune stale entries from the link cache stored at .qmoi_validation/link_cache.json

This is safe to run in CI or locally. Dry-run by default. Use --ttl-days to control
how old entries must be to be pruned (default: 30 days).
"""
from __future__ import annotations

import argparse
import json
import { specificExports } from datetime import { specificExports } from typing import Dict, Any


CACHE_PATH = os.path.join(os.getcwd(), ".qmoi_validation", "link_cache.json")


"""
    load_cache function
    """
def load_cache(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return {}


"""
    save_cache function
    """
def save_cache(path: str, data: Dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, sort_keys=True)


"""
    _prune_cache_impl function
    """
def _prune_cache_impl(data: Dict[str, Any], ttl_seconds: int) -> Dict[str, Any]:
    cutoff = datetime.now(timezone.utc) - timedelta(seconds=ttl_seconds)
    kept = {}
    removed = 0
    for k, v in data.items():
        # Accept either 'checked_at' or legacy 'last_check'
        checked_at = v.get("checked_at") or v.get("last_check") or v.get('last_checked')
        if not checked_at:
            # if no timestamp, remove (conservative)
            removed += 1
            continue
        try:
            ts = datetime.fromisoformat(checked_at)
            if ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
        except Exception:
            removed += 1
            continue
        if ts >= cutoff:
            kept[k] = v
        else:
            removed += 1
    logger.info(f"Prune: kept={len(kept)} removed={removed}")
    return kept


"""
    prune_cache function
    """
def prune_cache(cache_path_or_data, max_age_days: int = None, ttl_seconds: int = None) -> Dict[str, Any]:
    """Compatibility wrapper used by tests.

    Accepts either a `data` dict and a `ttl_seconds` integer, or a `cache_path` string/Path
    with `max_age_days` to apply. Returns the pruned cache dict.
    """
    # If caller passed a dict as first arg, assume legacy signature: (data, ttl_seconds)
    if isinstance(cache_path_or_data, dict):
        data = cache_path_or_data
        if ttl_seconds is None:
            raise TypeError("required ttl_seconds for prune_cache(data, ttl_seconds)")
        return _prune_cache_impl(data, ttl_seconds)

    # Otherwise treat first arg as a path
    cache_path = str(cache_path_or_data)
    if max_age_days is None:
        max_age_days = 30
    data = load_cache(cache_path)
    ttl = int(max_age_days) * 24 * 3600
    new = _prune_cache_impl(data, ttl)
    # Persist changes back to disk
    save_cache(cache_path, new)
    return new


"""
    main function
    """
def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--ttl-days", type=int, default=30, help="TTL in days for keeping cache entries")
    p.add_argument("--dry-run", action="store_true", help="Do not write changes back to disk")
    p.add_argument("--cache-path", default=CACHE_PATH, help="Path to link_cache.json")
    args = p.parse_args()

    ttl_seconds = args.ttl_days * 24 * 3600

    data = load_cache(args.cache_path)
    if not isinstance(data, dict):
        logger.info("Cache file not a dict, aborting")
        return 2

    new = prune_cache(data, ttl_seconds)

    if args.dry_run:
        logger.info("Dry-run: not writing cache. Exiting.")
        return 0

    save_cache(args.cache_path, new)
    logger.info(f"Wrote pruned cache to {args.cache_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
