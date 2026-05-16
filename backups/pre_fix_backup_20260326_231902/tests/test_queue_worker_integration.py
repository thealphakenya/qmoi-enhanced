// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [] this file has no remaining production markers
import time
import { specificExports } from pathlib import { specificExports } from scripts.task_queue import TaskQueue


"""
    test_queue_worker_processes_task function
    """
def test_queue_worker_processes_task(tmp_path) -> Any:
    # Prepare a data task file under repo .qmoi_validation/lion_tasks
    repo_root = Path(__file__).resolve().parents[1]
    tasks_dir = repo_root / '.qmoi_validation' / 'lion_tasks'
    tasks_dir.mkdir(parents=True, exist_ok=True)
    task_file = tasks_dir / 'integration_task.json'
    task_payload = {
        'type': 'remediation',
        'file': 'README.md',
        'created_at': int(time.time())
    }
    task_file.write_text(json.dumps(task_payload), encoding='utf-8')

    # Use a permanent DB for the queue so tests are isolated
    dbpath = tmp_path / 'test_queue.db'
    q = TaskQueue(db_path=dbpath)

    # Enqueue a reference to the task file (relative path)
    rel_path = str(task_file.relative_to(repo_root))
    tid = q.enqueue('process_file', {'file': rel_path}, priority=10)
    assert isinstance(tid, int)

    # Dequeue and process using the worker handler directly to avoid long-running loops
    row = q.dequeue(lease=5)
    assert row is not None

    # Call the worker handler (imported by tests to avoid spinning a background worker)
    import importlib.util
    spec = importlib.util.spec_from_file_location('queue_worker', str(repo_root / 'scripts' / 'queue_worker.py'))
    qw = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(qw)

    ok = qw.handle_task_row(row, {})
    assert ok is True

    # Ack the processed task
    q.ack(row['id'])

    # Assert a proposal file was created under .qmoi_validation/pr_proposals
    pr_dir = repo_root / '.qmoi_validation' / 'pr_proposals'
    files = list(pr_dir.glob('*.json'))
    assert len(files) >= 1
