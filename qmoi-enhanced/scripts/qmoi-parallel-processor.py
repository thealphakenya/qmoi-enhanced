#!/usr/bin/env python3
"""
QMOI Parallel Processor - Advanced Multi-Tasking and Parallel Processing
Handles multiple complex tasks simultaneously with intelligent resource management
"""

import asyncio
import concurrent.futures
import multiprocessing
import threading
import time
import psutil
import queue
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Callable, Optional
from dataclasses import dataclass, asdict
import subprocess
import os
import sys

@dataclass
class Task:
    """Task definition for parallel processing"""
    id: str
    name: str
    function: Callable
    args: tuple = ()
    kwargs: dict = None
    priority: int = 1
    timeout: int = 300
    retries: int = 3
    dependencies: List[str] = None
    resources: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.kwargs is None:
            self.kwargs = {}
        if self.dependencies is None:
            self.dependencies = []
        if self.resources is None:
            self.resources = {}

@dataclass
class TaskResult:
    """Result of a task execution"""
    task_id: str
    success: bool
    result: Any = None
    error: str = None
    execution_time: float = 0.0
    memory_usage: float = 0.0
    cpu_usage: float = 0.0
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()

class QMOIParallelProcessor:
    """Advanced parallel processor for QMOI operations"""
    
    def __init__(self, max_workers: int = None, max_memory_percent: float = 80.0):
        self.max_workers = max_workers or min(32, (os.cpu_count() or 1) + 4)
        self.max_memory_percent = max_memory_percent
        self.task_queue = queue.PriorityQueue()
        self.running_tasks = {}
        self.completed_tasks = {}
        self.failed_tasks = {}
        self.task_dependencies = {}
        self.resource_monitor = ResourceMonitor()
        self.performance_tracker = PerformanceTracker()
        
        # Threading and multiprocessing pools
        self.thread_pool = concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers)
        self.process_pool = concurrent.futures.ProcessPoolExecutor(max_workers=self.max_workers//2)
        
        # Async event loop for async tasks
        self.loop = None
        self.async_tasks = {}
        
        self.setup_logging()
        self.start_monitoring()
    
    def setup_logging(self):
        """Setup comprehensive logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('qmoi-parallel.log', encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def start_monitoring(self):
        """Start resource monitoring"""
        self.monitor_thread = threading.Thread(target=self._monitor_resources, daemon=True)
        self.monitor_thread.start()
    
    def _monitor_resources(self):
        """Monitor system resources continuously"""
        while True:
            try:
                cpu_percent = psutil.cpu_percent(interval=1)
                memory_percent = psutil.virtual_memory().percent
                
                self.resource_monitor.update(cpu_percent, memory_percent)
                
                # Adjust worker count based on resource usage
                if memory_percent > self.max_memory_percent:
                    self._scale_down_workers()
                elif memory_percent < self.max_memory_percent * 0.7:
                    self._scale_up_workers()
                
                time.sleep(5)  # Monitor every 5 seconds
                
            except Exception as e:
                self.logger.error(f"Resource monitoring error: {e}")
                time.sleep(10)
    
    def _scale_down_workers(self):
        """Scale down workers when resources are high"""
        if self.max_workers > 2:
            self.max_workers = max(2, self.max_workers - 1)
            self.logger.info(f"Scaled down to {self.max_workers} workers")
    
    def _scale_up_workers(self):
        """Scale up workers when resources are available"""
        max_possible = min(32, (os.cpu_count() or 1) + 4)
        if self.max_workers < max_possible:
            self.max_workers = min(max_possible, self.max_workers + 1)
            self.logger.info(f"Scaled up to {self.max_workers} workers")
    
    def add_task(self, task: Task):
        """Add a task to the processing queue"""
        self.task_queue.put((task.priority, task))
        self.task_dependencies[task.id] = task.dependencies
        self.logger.info(f"Added task: {task.name} (ID: {task.id})")
    
    def add_tasks(self, tasks: List[Task]):
        """Add multiple tasks to the processing queue"""
        for task in tasks:
            self.add_task(task)
    
    def execute_parallel(self, tasks: List[Task], max_concurrent: int = None) -> Dict[str, TaskResult]:
        """Execute multiple tasks in parallel"""
        if max_concurrent is None:
            max_concurrent = self.max_workers
        
        self.logger.info(f"Executing {len(tasks)} tasks with max {max_concurrent} concurrent")
        
        # Sort tasks by dependencies
        sorted_tasks = self._sort_by_dependencies(tasks)
        
        # Execute tasks in batches
        results = {}
        for batch in self._create_batches(sorted_tasks, max_concurrent):
            batch_results = self._execute_batch(batch)
            results.update(batch_results)
        
        return results
    
    def _sort_by_dependencies(self, tasks: List[Task]) -> List[Task]:
        """Sort tasks by their dependencies"""
        sorted_tasks = []
        remaining_tasks = tasks.copy()
        
        while remaining_tasks:
            # Find tasks with no unmet dependencies
            ready_tasks = []
            for task in remaining_tasks:
                if all(dep in [t.id for t in sorted_tasks] for dep in task.dependencies):
                    ready_tasks.append(task)
            
            if not ready_tasks:
                # Circular dependency or missing dependency
                self.logger.warning("Circular dependency detected, adding remaining tasks")
                ready_tasks = remaining_tasks
            
            # Sort by priority (higher priority first)
            ready_tasks.sort(key=lambda t: t.priority, reverse=True)
            sorted_tasks.extend(ready_tasks)
            
            # Remove processed tasks
            for task in ready_tasks:
                remaining_tasks.remove(task)
        
        return sorted_tasks
    
    def _create_batches(self, tasks: List[Task], batch_size: int) -> List[List[Task]]:
        """Create batches of tasks for parallel execution"""
        batches = []
        for i in range(0, len(tasks), batch_size):
            batch = tasks[i:i + batch_size]
            batches.append(batch)
        return batches
    
    def _execute_batch(self, batch: List[Task]) -> Dict[str, TaskResult]:
        """Execute a batch of tasks in parallel"""
        futures = {}
        results = {}
        
        # Submit tasks to appropriate executor
        for task in batch:
            if self._is_async_task(task):
                future = self._submit_async_task(task)
            elif self._is_cpu_intensive(task):
                future = self.process_pool.submit(self._execute_task, task)
            else:
                future = self.thread_pool.submit(self._execute_task, task)
            
            futures[task.id] = future
        
        # Collect results
        for task_id, future in futures.items():
            try:
                result = future.result(timeout=300)  # 5 minute timeout
                results[task_id] = result
            except Exception as e:
                self.logger.error(f"Task {task_id} failed: {e}")
                results[task_id] = TaskResult(
                    task_id=task_id,
                    success=False,
                    error=str(e)
                )
        
        return results
    
    def _is_async_task(self, task: Task) -> bool:
        """Check if task is async"""
        return asyncio.iscoroutinefunction(task.function)
    
    def _is_cpu_intensive(self, task: Task) -> bool:
        """Check if task is CPU intensive"""
        return task.resources.get('cpu_intensive', False)
    
    def _submit_async_task(self, task: Task):
        """Submit async task to event loop"""
        if self.loop is None:
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
        
        return asyncio.run_coroutine_threadsafe(
            self._execute_async_task(task), self.loop
        )
    
    async def _execute_async_task(self, task: Task) -> TaskResult:
        """Execute async task"""
        start_time = time.time()
        start_memory = psutil.Process().memory_info().rss / 1024 / 1024  # MB
        
        try:
            result = await task.function(*task.args, **task.kwargs)
            execution_time = time.time() - start_time
            end_memory = psutil.Process().memory_info().rss / 1024 / 1024  # MB
            
            return TaskResult(
                task_id=task.id,
                success=True,
                result=result,
                execution_time=execution_time,
                memory_usage=end_memory - start_memory
            )
        except Exception as e:
            return TaskResult(
                task_id=task.id,
                success=False,
                error=str(e),
                execution_time=time.time() - start_time
            )
    
    def _execute_task(self, task: Task) -> TaskResult:
        """Execute a single task"""
        start_time = time.time()
        start_memory = psutil.Process().memory_info().rss / 1024 / 1024  # MB
        start_cpu = psutil.cpu_percent()
        
        try:
            self.logger.info(f"Executing task: {task.name}")
            result = task.function(*task.args, **task.kwargs)
            
            execution_time = time.time() - start_time
            end_memory = psutil.Process().memory_info().rss / 1024 / 1024  # MB
            end_cpu = psutil.cpu_percent()
            
            task_result = TaskResult(
                task_id=task.id,
                success=True,
                result=result,
                execution_time=execution_time,
                memory_usage=end_memory - start_memory,
                cpu_usage=end_cpu - start_cpu
            )
            
            self.completed_tasks[task.id] = task_result
            self.performance_tracker.record_success(task_result)
            
            return task_result
            
        except Exception as e:
            execution_time = time.time() - start_time
            task_result = TaskResult(
                task_id=task.id,
                success=False,
                error=str(e),
                execution_time=execution_time
            )
            
            self.failed_tasks[task.id] = task_result
            self.performance_tracker.record_failure(task_result)
            
            self.logger.error(f"Task {task.name} failed: {e}")
            return task_result
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        return {
            "total_tasks": len(self.completed_tasks) + len(self.failed_tasks),
            "completed_tasks": len(self.completed_tasks),
            "failed_tasks": len(self.failed_tasks),
            "success_rate": len(self.completed_tasks) / max(1, len(self.completed_tasks) + len(self.failed_tasks)),
            "average_execution_time": self.performance_tracker.get_average_execution_time(),
            "total_memory_usage": self.performance_tracker.get_total_memory_usage(),
            "resource_utilization": self.resource_monitor.get_stats(),
            "current_workers": self.max_workers
        }
    
    def shutdown(self):
        """Shutdown the parallel processor"""
        self.logger.info("Shutting down parallel processor")
        self.thread_pool.shutdown(wait=True)
        self.process_pool.shutdown(wait=True)
        if self.loop:
            self.loop.close()

class ResourceMonitor:
    """Monitor system resources"""
    
    def __init__(self):
        self.cpu_history = []
        self.memory_history = []
        self.max_history = 100
    
    def update(self, cpu_percent: float, memory_percent: float):
        """Update resource metrics"""
        self.cpu_history.append(cpu_percent)
        self.memory_history.append(memory_percent)
        
        # Keep only recent history
        if len(self.cpu_history) > self.max_history:
            self.cpu_history = self.cpu_history[-self.max_history:]
        if len(self.memory_history) > self.max_history:
            self.memory_history = self.memory_history[-self.max_history:]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get resource statistics"""
        if not self.cpu_history or not self.memory_history:
            return {}
        
        return {
            "current_cpu": self.cpu_history[-1],
            "current_memory": self.memory_history[-1],
            "avg_cpu": sum(self.cpu_history) / len(self.cpu_history),
            "avg_memory": sum(self.memory_history) / len(self.memory_history),
            "max_cpu": max(self.cpu_history),
            "max_memory": max(self.memory_history)
        }

class PerformanceTracker:
    """Track task performance metrics"""
    
    def __init__(self):
        self.successful_tasks = []
        self.failed_tasks = []
    
    def record_success(self, result: TaskResult):
        """Record successful task"""
        self.successful_tasks.append(result)
    
    def record_failure(self, result: TaskResult):
        """Record failed task"""
        self.failed_tasks.append(result)
    
    def get_average_execution_time(self) -> float:
        """Get average execution time for successful tasks"""
        if not self.successful_tasks:
            return 0.0
        return sum(task.execution_time for task in self.successful_tasks) / len(self.successful_tasks)
    
    def get_total_memory_usage(self) -> float:
        """Get total memory usage"""
        return sum(task.memory_usage for task in self.successful_tasks + self.failed_tasks)

# Example usage and predefined tasks
def example_tasks():
    """Example tasks for [PRODUCTION IMPLEMENTATION REQUIRED]nstration"""
    
    def cpu_intensive_task(n: int) -> int:
        """CPU intensive task"""
        result = 0
        for i in range(n):
            result += i ** 2
        return result
    
    def io_intensive_task(url: str) -> str:
        """IO intensive task"""
        import requests
        response = requests.get(url, timeout=10)
        return response.text[:100]
    
    def ai_processing_task(text: str) -> str:
        """AI processing task"""
        # Simulate AI processing
        time.sleep(2)
        return f"AI processed: {text}"
    
    def data_analysis_task(data: List[int]) -> Dict[str, float]:
        """Data analysis task"""
        return {
            "mean": sum(data) / len(data),
            "max": max(data),
            "min": min(data),
            "count": len(data)
        }
    
    # Create example tasks
    tasks = [
        Task(
            id="cpu_task_1",
            name="CPU Intensive Task 1",
            function=cpu_intensive_task,
            args=(1000000,),
            priority=3,
            resources={"cpu_intensive": True}
        ),
        Task(
            id="io_task_1",
            name="IO Intensive Task 1",
            function=io_intensive_task,
            args=("https://api.github.com",),
            priority=2
        ),
        Task(
            id="ai_task_1",
            name="AI Processing Task 1",
            function=ai_processing_task,
            args=("[PRODUCTION IMPLEMENTATION REQUIRED] text for AI processing",),
            priority=4
        ),
        Task(
            id="analysis_task_1",
            name="Data Analysis Task 1",
            function=data_analysis_task,
            args=([1, 2, 3, 4, 5, 6, 7, 8, 9, 10],),
            priority=2
        )
    ]
    
    return tasks

def main():
    """Main function for testing"""
    processor = QMOIParallelProcessor()
    
    try:
        # Get example tasks
        tasks = example_tasks()
        
        # Execute tasks in parallel
        results = processor.execute_parallel(tasks)
        
        # Print results
        print("\n=== Task Results ===")
        for task_id, result in results.items():
            status = "SUCCESS" if result.success else "FAILED"
            print(f"{task_id}: {status} ({result.execution_time:.2f}s)")
            if not result.success:
                print(f"  Error: {result.error}")
        
        # Print performance stats
        print("\n=== Performance Stats ===")
        stats = processor.get_performance_stats()
        for key, value in stats.items():
            print(f"{key}: {value}")
    
    finally:
        processor.shutdown()

if __name__ == "__main__":
    main()

