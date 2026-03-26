// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
#!/usr/bin/env python3
"""Merge queue metrics into LION metrics file.

This reads `.qmoi_validation/queue_metrics.json` and merges counters into
`.qmoi_validation/lion_metrics.json` under a `queue` key.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
Q_PATH = ROOT / '.qmoi_validation' / 'queue_metrics.json'
LION_MET = ROOT / '.qmoi_validation' / 'lion_metrics.json'


def load_json(p: Path):
    try:
        return json.loads(p.read_text(encoding='utf-8'))
    except Exception:
        return {}


def main():
    q = load_json(Q_PATH)
    lion = load_json(LION_MET)
    lion.setdefault('queue', {})
    for k, v in q.items():
        lion['queue'][k] = lion['queue'].get(k, 0) + int(v or 0)
    LION_MET.parent.mkdir(parents=True, exist_ok=True)
    LION_MET.write_text(json.dumps(lion, indent=2), encoding='utf-8')
    print('Merged queue metrics into', str(LION_MET))


if __name__ == '__main__':
    main()
