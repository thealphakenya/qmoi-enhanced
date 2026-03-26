// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:06Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

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
        with self._pq_lock:
            heapq.heappush(self._pq, item)

    def _pop(self) -> Optional[PrioritizedItem]:
        with self._pq_lock:
            if not self._pq:
                return None
            return heapq.heappop(self._pq)

    def run(self, shutdown_wait: float = 2.0):
        with ThreadPoolExecutor(max_workers=self.max_workers) as ex:
            futures = []
            try:
                while not self._stop.is_set():
                    item = self._pop()
                    if item is None:
                        time.sleep(0.05)
                        continue
                    # simple rate check (if handler in kwargs)
                    handler = item.kwargs.get('handler')
                    bucket = self._buckets.get(handler)
                    if bucket and not bucket.consume():
                        # requeue and sleep a bit
                        self.submit(item.priority, item.func, item.task_id, item.created, *item.args, **item.kwargs)
                        time.sleep(0.1)
                        continue
                    futures.append(ex.submit(item.func, *item.args, **item.kwargs))
                # wait for futures
                for f in as_completed(futures, timeout=shutdown_wait):
                    try:
                        _ = f.result()
                    except Exception:
                        pass
            except KeyboardInterrupt:
                self._stop.set()

    def stop(self):
        self._stop.set()

def _sample_task(name, duration=0.5):
    print(f"Task {name} started")
    time.sleep(duration)
    print(f"Task {name} done")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--workers', type=int, default=4)
    args = p.parse_args()
    ex = ParallelExecutor(max_workers=args.workers)
    ex.register_rate('default', rate=10.0, burst=20.0)
    for i in range(20):
        ex.submit(10, _sample_task, f't#{i}', None, name=f't#{i}', duration=0.2)
    try:
        ex.run()
    except Exception:
        ex.stop()

if __name__ == '__main__':
    main()
