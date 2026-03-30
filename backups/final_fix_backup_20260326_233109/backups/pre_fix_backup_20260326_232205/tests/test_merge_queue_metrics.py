// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import json
from pathlib import Path

def test_merge_queue_metrics(tmp_path=None):
    repo = Path(__file__).resolve().parents[1]
    qpath = repo / '.qmoi_validation' / 'queue_metrics.json'
    lion = repo / '.qmoi_validation' / 'lion_metrics.json'
    qpath.parent.mkdir(parents=True, exist_ok=True)
    qpath.write_text(json.dumps({'dequeues': 2, 'acks': 1}), encoding='utf-8')
    if lion.exists():
        lion.unlink()
    # run merge
    from scripts.merge_queue_metrics import main
    main()
    data = json.loads(lion.read_text(encoding='utf-8'))
    assert data.get('queue', {}).get('dequeues') == 2
    assert data.get('queue', {}).get('acks') == 1

if __name__ == '__main__':
    test_merge_queue_metrics()
    print('ok test_merge_queue_metrics')
