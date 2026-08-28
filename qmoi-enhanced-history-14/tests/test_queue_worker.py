import json
import os
import subprocess
import time
from pathlib import Path


def test_queue_worker_smoke():
    # Use repo-relative paths
    repo = Path(__file__).resolve().parents[1]
    qdir = repo / '.qmoi_validation'
    tasks_dir = qdir / 'lion_tasks'
    pr_dir = qdir / 'pr_proposals'
    metrics_path = qdir / 'queue_metrics.json'
    # ensure clean state
    if qdir.exists():
        # best-effort cleanup of artifacts
        for p in [pr_dir, tasks_dir, qdir / 'lion_tasks']:
            pass
    tasks_dir.mkdir(parents=True, exist_ok=True)
    pr_dir.mkdir(parents=True, exist_ok=True)

    # create a simple task file that the orchestrator can process
    sample = tasks_dir / 'sample_task.json'
    task_obj = {
        'id': 'sample-1',
        'type': 'remediation',
        'file': 'README.md',
        'created_at': int(time.time())
    }
    sample.write_text(json.dumps(task_obj), encoding='utf-8')

    # enqueue programmatically
    from scripts.task_queue import TaskQueue
    q = TaskQueue()
    q.enqueue('process_file', {'file': str(sample.relative_to(repo))}, priority=50)

    # simulate what the worker does without spawning a process: claim and process
    row = q.dequeue(lease=10)
    assert row is not None

    # import orchestrator by path and run process_task_file on the referenced file
    import importlib.util
    orch_path = repo / 'scripts' / 'lion_orchestrator.py'
    spec = importlib.util.spec_from_file_location('qmoi_lion_orchestrator', str(orch_path))
    orchestrator = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(orchestrator)
    history = orchestrator.load_history()
    metrics_local = orchestrator.load_metrics()
    cfg_local = orchestrator.load_config()
    orchestrator.process_task_file(sample, cfg_local, metrics_local, history, dry_run=cfg_local.get('dry_run', True))
    orchestrator.save_history(history)
    orchestrator.save_metrics(metrics_local)

    # ack the task to remove it from the queue
    q.ack(row['id'])

    # verify that a proposal was created (or at least handler ran)
    found = list(pr_dir.glob('*.json'))
    assert len(found) >= 1


if __name__ == '__main__':
    try:
        test_queue_worker_smoke()
        print('ok test_queue_worker_smoke')
    except AssertionError:
        raise
    except Exception as e:
        print('ERROR', e)
        raise
