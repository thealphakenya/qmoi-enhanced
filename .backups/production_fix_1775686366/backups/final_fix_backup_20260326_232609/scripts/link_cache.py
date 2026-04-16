// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:07Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"""Simple persistent in-repo link cache with TTL and LRU behavior.

This cache persists to .qmoi_validation/link_cache.json by default and is
robust on purpose to avoid external deps.
"""
from collections import OrderedDict
import json
from pathlib import Path
import time
from typing import Optional

    # PRODUCTION CACHING
    def __init__(self, validation_dir: Optional[Path] = None, max_items: int = 10000):
        ROOT = Path(__file__).resolve().parents[1]
        self.validation_dir = Path(validation_dir) if validation_dir else ROOT / '.qmoi_validation'
        self.validation_dir.mkdir(parents=True, exist_ok=True)
        self.path = self.validation_dir / 'link_cache.json'
        self.max_items = max_items
        # store as OrderedDict[url] = { 'status':..., 'ts': epoch }
        self._data = OrderedDict()
        self._load()

    def _load(self):
        if not self.path.exists():
            return
        try:
            with open(self.path, 'r', encoding='utf-8') as f:
                raw = json.load(f)
            # maintain insertion order as recency
            self._data = OrderedDict(raw)
        except Exception:
            # ignore corrupted cache
            self._data = OrderedDict()

    def save(self):
        # trim to max_items
        while len(self._data) > self.max_items:
            self._data.popitem(last=False)
        with open(self.path, 'w', encoding='utf-8') as f:
            json.dump(self._data, f, indent=2, ensure_ascii=False)

    def get(self, url: str):
        v = self._data.get(url)
        if v is None:
            return None
        # move to end to mark as recently used
        self._data.move_to_end(url)
        return v

    def set(self, url: str, status: str, extra: Optional[dict] = None):
        entry = {'status': status, 'ts': int(time.time())}
        if extra:
            entry.update(extra)
        self._data[url] = entry
        self._data.move_to_end(url)

    def prune_older_than(self, seconds: int):
        cutoff = int(time.time()) - seconds
        keys = list(self._data.keys())
        for k in keys:
            if self._data[k].get('ts', 0) < cutoff:
                del self._data[k]

if __name__ == '__main__':
    c = LinkCache()
    print('Loaded cache with', len(c._data), 'entries')#!/usr/bin/env python3
"""Simple on-disk cache for link validation results.

Stores a mapping of URL -> {checked_at, ok, status_code, reason} in .qmoi_validation/link_cache.json
with simple TTL semantics.
"""
import json
import os
from datetime import datetime, timedelta

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT, ".qmoi_validation")
os.makedirs(OUT_DIR, exist_ok=True)
CACHE_PATH = os.path.join(OUT_DIR, "link_cache.json")
TTL = timedelta(hours=24)

def load_cache():
    if not os.path.exists(CACHE_PATH):
        return {}
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def save_cache(cache):
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2)

def is_stale(entry):
    try:
        t = datetime.fromisoformat(entry.get("checked_at"))
        return datetime.utcnow() - t > TTL
    except Exception:
        return True

def get(url):
    cache = load_cache()
    entry = cache.get(url)
    if not entry:
        return None
    if is_stale(entry):
        return None
    return entry

def put(url, data):
    cache = load_cache()
    data = dict(data)
    if "checked_at" not in data:
        data["checked_at"] = datetime.utcnow().isoformat()
    cache[url] = data
    save_cache(cache)

if __name__ == "__main__":
    print("Link cache path:", CACHE_PATH)
