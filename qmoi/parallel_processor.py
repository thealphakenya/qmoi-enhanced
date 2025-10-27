#!/usr/bin/env python3
"""qmoi.parallel_processor

Lightweight, well-formed parallel processing helper used by QMOI.

This module provides a minimal, safe implementation of a parallel
processing system with thread/process pools and a simple fallback
strategy. It's intentionally conservative: implementations that
depend on external model managers or Claude integration should
import this module and extend it as needed.
"""

from __future__ import annotations

import json
import multiprocessing as mp
import os
import queue
import threading
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class ProcessingResult:
    success: bool
    data: Dict
    source: str  # 'claude' or 'local'
    metrics: Dict


class QmoiParallelProcessor:
    """Core parallel processing system with graceful fallbacks.

    This is a compact, dependency-free implementation intended to be
    a stable import target for other parts of the repository. It
    provides submit/get_result/process_batch and a shutdown method.
    """

    def __init__(self, max_workers: Optional[int] = None, config: Optional[Dict] = None):
        self.max_workers = max_workers or (mp.cpu_count() or 4)
        self.config = config or {"parallel": {"max_threads": os.cpu_count() or 4, "max_processes": 2, "batch_size": 16}}

        self.task_queue: "queue.Queue[Dict]" = queue.Queue()
        self.result_queue: "queue.Queue" = queue.Queue()
        self.workers: List[threading.Thread] = []
        self.lock = threading.Lock()

        self.local_models: Dict = {}
        self.claude_available = False

        self.thread_pool: Optional[ThreadPoolExecutor] = None
        self.process_pool: Optional[ProcessPoolExecutor] = None

        self._start_workers()
        self._setup_execution_pools()

    def _start_workers(self) -> None:
        for _ in range(max(1, self.max_workers)):
            worker = threading.Thread(target=self._worker_loop, daemon=True)
            worker.start()
            self.workers.append(worker)

    def _worker_loop(self) -> None:
        """Main worker loop that processes tasks from an internal queue."""
        while True:
            task = self.task_queue.get()
            if task is None:
                # Shutdown signal
                break

            try:
                result = self._process_task(task)
                self.result_queue.put((task.get("id"), result))
            except Exception as e:  # pragma: no cover - defensive
                self.result_queue.put((task.get("id"), {"error": str(e)}))
            finally:
                self.task_queue.task_done()

    def _process_task(self, task: Dict) -> Dict:
        task_type = task.get("type")
        if task_type == "model_inference":
            return self._run_model_inference(task)
        elif task_type == "data_processing":
            return self._process_data(task)
        elif task_type == "qvs_validation":
            return self._run_qvs_validation(task)
        else:
            return {"error": f"Unknown task type: {task_type}"}

    def _run_model_inference(self, task: Dict) -> Dict:
        # Minimal stub: real implementations should call into local_model_manager
        model_id = task.get("model_id")
        inputs = task.get("inputs")
        return {"status": "success", "model_id": model_id, "outputs": []}

    def _process_data(self, task: Dict) -> Dict:
        # Minimal stub for data processing tasks
        return {"status": "success", "processed_data": []}

    def _run_qvs_validation(self, task: Dict) -> Dict:
        # Minimal stub for QVS validations
        return {"status": "success", "validation_results": []}

    def _setup_execution_pools(self) -> None:
        self.thread_pool = ThreadPoolExecutor(max_workers=self.config["parallel"]["max_threads"])
        self.process_pool = ProcessPoolExecutor(max_workers=self.config["parallel"]["max_processes"])

    def submit_task(self, task: Dict) -> str:
        task_id = task.get("id") or str(hash(json.dumps(task)))
        task["id"] = task_id
        self.task_queue.put(task)
        return task_id

    def get_result(self, task_id: str, timeout: Optional[float] = None) -> Optional[Dict]:
        try:
            while True:
                result_id, result = self.result_queue.get(timeout=timeout)
                if result_id == task_id:
                    return result
                # Not our result - put it back for others
                self.result_queue.put((result_id, result))
        except queue.Empty:
            return None

    def process_batch(self, tasks: List[Dict]) -> List[ProcessingResult]:
        results: List[ProcessingResult] = []
        batch_size = self.config["parallel"].get("batch_size", 16)
        for i in range(0, len(tasks), batch_size):
            batch = tasks[i : i + batch_size]
            if self.claude_available:
                try:
                    batch_results = self._process_with_claude(batch)
                except Exception:
                    batch_results = self._process_locally(batch)
            else:
                batch_results = self._process_locally(batch)

            results.extend(batch_results)

        return results

    def _process_with_claude(self, batch: List[Dict]) -> List[ProcessingResult]:
        futures = []
        with self.thread_pool as executor:
            for task in batch:
                futures.append(executor.submit(self._claude_task_wrapper, task))
        return [f.result() for f in futures]

    def _process_locally(self, batch: List[Dict]) -> List[ProcessingResult]:
        # Use thread pool for local processing to avoid multiprocessing
        # pickling issues in environments where tasks capture local state.
        futures = []
        with self.thread_pool as executor:
            for task in batch:
                futures.append(executor.submit(self._local_task_wrapper, task))
        return [f.result() for f in futures]

    def _claude_task_wrapper(self, task: Dict) -> ProcessingResult:
        try:
            # Placeholder Claude processing
            result = {"status": "processed"}
            return ProcessingResult(success=True, data=result, source="claude", metrics={"latency": 0.1})
        except Exception as e:  # pragma: no cover - defensive
            print(f"Claude task failed: {e}")
            return self._local_task_wrapper(task)

    def _local_task_wrapper(self, task: Dict) -> ProcessingResult:
        try:
            # Placeholder local processing - real model should be used here
            result = {"status": "processed_locally"}
            return ProcessingResult(success=True, data=result, source="local", metrics={"latency": 0.2})
        except Exception as e:  # pragma: no cover - defensive
            print(f"Local processing failed: {e}")
            return ProcessingResult(success=False, data={"error": str(e)}, source="local", metrics={"error": True})

    def shutdown(self) -> None:
        # Signal workers to stop
        for _ in self.workers:
            self.task_queue.put(None)
        for w in self.workers:
            w.join()

        if self.thread_pool:
            self.thread_pool.shutdown(wait=True)
        if self.process_pool:
            self.process_pool.shutdown(wait=True)


_parallel_processor: Optional[QmoiParallelProcessor] = None


def get_parallel_processor() -> QmoiParallelProcessor:
    global _parallel_processor
    if _parallel_processor is None:
        _parallel_processor = QmoiParallelProcessor()
    return _parallel_processor


if __name__ == "__main__":
    processor = get_parallel_processor()
    tasks = [{"id": str(i), "type": "data_processing", "data": f"task_{i}"} for i in range(10)]
    results = processor.process_batch(tasks)
    for r in results:
        print(r)
    processor.shutdown()
