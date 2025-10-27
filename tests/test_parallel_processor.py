import time

from qmoi.parallel_processor import get_parallel_processor


def test_parallel_processor_smoke():
    proc = get_parallel_processor()
    tasks = [{"id": "t1", "type": "data_processing", "data": "hello"}]
    results = proc.process_batch(tasks)
    assert isinstance(results, list)
    # results are ProcessingResult dataclasses or similar; ensure at least one
    assert len(results) >= 1
    proc.shutdown()
