---
title: "Issue draft for scripts/parallel_executor.py"
generated: 2025-11-08T16:06:38.973937Z
---

# Review needed: scripts/parallel_executor.py

Status: AUTOMATED_REMOVAL_FROM_DONEREFS

Suggested next steps:

- Inspect the file and its TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) markers or TODOs.
- If the file is safe for production, remove the TBD: See PLACEHOLDER_REMEDIATION_PLAN.md (TBD: replace with production content; see PLACEHOLDER_REMEDIATION_PLAN.md) and add tests / small PR.
- If the file is intentionally non-production (e.g. simulated or cache), consider moving it out of the repo or documenting its purpose.
- After changes, re-run `scripts/verify_and_finalize_done.py` to include the file back in `donerefs.txt`.

Excerpt (first 2KB):

```
#!/usr/bin/env python3
"""Parallel executor for QMOI tasks.

Features:
- Priority queue with worker ThreadPoolExecutor
- Per-handler token-bucket rate limiting (simple)
- Cooperative cancellation and graceful shutdown
- Simple CLI for local testing
"""
import argparse
import heapq
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional, Tuple


@dataclass(order=True)
class PrioritizedItem:
    priority: int
    created: float
    task_id: str = field(compare=False)
    func: Callable = field(compare=False)
    args: Tuple = field(compare=False, default=())
    kwargs: Dict = field(compare=False, default_factory=dict)


class TokenBucket:
    def __init__(self, rate: float, capacity: float):
        self.rate = rate
        self.capacity = capacity
        self._tokens = capacity
        self._last = time.time()
        self._lock = threading.Lock()

    def consume(self, amount=1.0) -> bool:
        with self._lock:
            now = time.time()
            elapsed = now - self._last
            self._last = now
            self._tokens = min(self.capacity, self._tokens + elapsed * self.rate)
            if self._tokens >= amount:
                self._tokens -= amount
                return True
            return False


class ParallelExecutor:
    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self._pq: List[PrioritizedItem] = []
        self._pq_lock = threading.Lock()
        self._stop = threading.Event()
        self._buckets: Dict[str, TokenBucket] = {}

    def register_rate(self, handler: str, rate: float, burst: float):
        self._buckets[handler] = TokenBucket(rate, burst)

    def submit(self, priority: int, func: Callable, task_id: str, created: float = None, *args, **kwargs):
        if created is None:
            created = time.time()
        item = PrioritizedItem(priority, created, task_id, func, args, kwargs)
        with s
```

Notes:

- This draft was generated automatically to help triage files removed from `donerefs.txt`.
- Backups and previous runs may exist under `.qmoi_validation`.
