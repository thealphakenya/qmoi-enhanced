<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:57Z
<!-- QMOI_OWNER_END -->

# Parallel Enhancements

This doc outlines the parallel execution improvements and how to use them.

Goals

- Allow QMOI to execute many tasks in parallel while respecting resource limits and external rate limits.
- Provide graceful degradation, backpressure signals and autoscaling hints.

Current implementation

- `scripts/parallel_executor.py` provides a prioritized executor with a token-bucket per-handler rate limiter.
- The `scripts/lion_orchestrator.py` supports configurable `concurrency` and will process tasks in parallel when `concurrency > 1`.

Planned production upgrades

1. Work-stealing executor for better CPU utilization.
2. Persistent sharded task queue (SQLite-backed) for durable task storage across restarts.
3. Memory-aware scheduling: consult `scripts/qmoi_memory.py` to estimate per-task footprint and schedule accordingly.
4. Prometheus-compatible metrics endpoint and profiling hooks.
5. Autoscaler guidance and sample k8s HPA configuration.

Usage

- For simple runs, use `python3 scripts/lion_orchestrator.py --concurrency 4` to process up to 4 tasks concurrently.
- For custom programs, import `ParallelExecutor` from `scripts/parallel_executor.py` and register per-handler rates via `register_rate(handler, rate, burst)`.
