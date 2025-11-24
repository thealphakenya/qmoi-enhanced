#!/usr/bin/env python3
"""Prune stale entries from the link cache stored at .qmoi_validation/link_cache.json

This is safe to run in CI or locally. Dry-run by default. Use --ttl-days to control
how old entries must be to be pruned (default: 30 days).
"""
from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone, timedelta
from typing import Dict, Any


CACHE_PATH = os.path.join(os.getcwd(), ".qmoi_validation", "link_cache.json")


def load_cache(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return {}


def save_cache(path: str, data: Dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, sort_keys=True)


def prune_cache(data: Dict[str, Any], ttl_seconds: int) -> Dict[str, Any]:
    cutoff = datetime.now(timezone.utc) - timedelta(seconds=ttl_seconds)
    kept = {}
    removed = 0
    for k, v in data.items():
        # Expect 'checked_at' in ISO format
        checked_at = v.get("checked_at")
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
    print(f"Prune: kept={len(kept)} removed={removed}")
    return kept


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--ttl-days", type=int, default=30, help="TTL in days for keeping cache entries")
    p.add_argument("--dry-run", action="store_true", help="Do not write changes back to disk")
    p.add_argument("--cache-path", default=CACHE_PATH, help="Path to link_cache.json")
    args = p.parse_args()

    ttl_seconds = args.ttl_days * 24 * 3600

    data = load_cache(args.cache_path)
    if not isinstance(data, dict):
        print("Cache file not a dict, aborting")
        return 2

    new = prune_cache(data, ttl_seconds)

    if args.dry_run:
        print("Dry-run: not writing cache. Exiting.")
        return 0

    save_cache(args.cache_path, new)
    print(f"Wrote pruned cache to {args.cache_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
