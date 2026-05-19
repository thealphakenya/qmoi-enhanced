#!/usr/bin/env python3
"""Parallel processing helper for QMOI."""
import concurrent.futures
import logging
from typing import Any, Callable, Iterable, List, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class ParallelProcessor:
    def __init__(self, max_workers: Optional[int] = None) -> None:
        if max_workers is None:
            try:
                max_workers = min(32, (concurrent.futures.thread._MAX_WORKERS or 5))
            except Exception:
                max_workers = 5
        self.max_workers = max_workers

    def run_tasks(self, func: Callable[[Any], Any], tasks: Iterable[Any]) -> List[Any]:
        task_list = list(tasks)
        logger.info("Executing %s tasks in parallel", len(task_list))
        results: List[Any] = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(func, task) for task in task_list]
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())
        return results
