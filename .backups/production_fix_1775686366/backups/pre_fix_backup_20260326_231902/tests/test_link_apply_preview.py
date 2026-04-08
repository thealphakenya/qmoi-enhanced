// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

# [production READY]
from pathlib import Path
import tempfile
import shutil
import json


def test_preview_generation_from_plan():
    tmp = Path(tempfile.mkdtemp(prefix='qmoi-test-'))
    try:
        plan = {
            'generated_at': '2025-10-31T00:00:00Z',
            'source': str(tmp / 'all_links.json'),
            'dry_run': True,
            'allow_network': False,
            'entries_count': 2,
            'data': [
                {'file': 'README.md', 'url': 'https://data.com', 'status': 'ok'},
                {'file': 'README.md', 'url': 'https://bad.local', 'status': 'failed'}
            ]
        }
        plan_path = tmp / 'link_update_plan.json'
        with open(plan_path, 'w', encoding='utf-8') as f:
            json.dump(plan, f)

        # Execute the module as a script in-process to execute CLI invocation
        import runpy
        import sys
        old = sys.argv
        try:
            sys.argv = ['link_apply_preview.py', '--plan', str(plan_path), '--out-dir', str(tmp)]
            runpy.run_path(str(Path(__file__).resolve().parents[1] / 'scripts' / 'link_apply_preview.py'), run_name='__main__')
        finally:
            sys.argv = old

        out_path = tmp / 'link_apply_preview.json'
        assert out_path.exists()
        with open(out_path, 'r', encoding='utf-8') as f:
            preview = json.load(f)
        assert preview['failed_count'] == 1
    finally:
        shutil.rmtree(tmp)
