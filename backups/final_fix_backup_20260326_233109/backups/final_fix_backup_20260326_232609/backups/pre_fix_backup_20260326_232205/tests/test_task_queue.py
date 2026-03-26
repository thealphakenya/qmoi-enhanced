// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
import os
import tempfile
import time
import json
from pathlib import Path

from scripts.task_queue import TaskQueue


def test_enqueue_dequeue_ack_requeue():
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        dbpath = Path(td) / 'test_queue.db'
        q = TaskQueue(db_path=dbpath)
        # enqueue a task
        tid = q.enqueue('process_file', {'file': 'some/path.json'}, priority=10)
        assert isinstance(tid, int)

        # dequeue should return the task
        row = q.dequeue(lease=1)
        assert row is not None
        assert row['task_type'] == 'process_file'
        assert row['payload']['file'] == 'some/path.json'

        # ack the task removes it
        q.ack(row['id'])
        # next dequeue returns None
        r2 = q.dequeue(lease=1)
        assert r2 is None

        # enqueue and test requeue
        tid2 = q.enqueue('file', {'file': 'a.json'}, priority=20)
        row2 = q.dequeue(lease=1)
        assert row2 is not None
        q.requeue(row2['id'], delay=1)
        # immediately should not be available
        r3 = q.dequeue(lease=1)
        assert r3 is None
        # after delay it should be available
        time.sleep(1.1)
        r4 = q.dequeue(lease=1)
        assert r4 is not None
        # cleanup
        q.ack(r4['id'])
