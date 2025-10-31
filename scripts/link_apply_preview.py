"""Produce a human-readable preview from a link_update_plan.json.

This script reads `.qmoi_validation/link_update_plan.json` (or another path)
and writes a preview `.qmoi_validation/link_apply_preview.json` containing
failed links and suggested actions. It is conservative and does NOT modify
repository files. Intended to be used in the plan->preview->PR workflow.
"""
import argparse
import json
from pathlib import Path
from datetime import datetime


def load_plan(path: Path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def generate_preview(plan: dict):
    entries = plan.get('sample', []) if 'sample' in plan else plan.get('entries', [])
    failed = [e for e in entries if e.get('status') in ('failed', 'network_disabled')]
    preview = {
        'generated_at': datetime.utcnow().replace(microsecond=0).isoformat() + 'Z',
        'source': plan.get('source'),
        'dry_run': plan.get('dry_run', True),
        'allow_network': plan.get('allow_network', False),
        'failed_count': len(failed),
        'failed_examples': failed[:200],
        'recommendation': 'Review failed links. If replacements are known, prepare a patch and open PR. Otherwise mark for manual fix.'
    }
    return preview


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--plan', help='path to link_update_plan.json', default=None)
    p.add_argument('--out-dir', help='output directory for preview', default=None)
    args = p.parse_args()

    ROOT = Path(__file__).resolve().parents[1]
    plan_path = Path(args.plan) if args.plan else ROOT / '.qmoi_validation' / 'link_update_plan.json'
    out_dir = Path(args.out_dir) if args.out_dir else ROOT / '.qmoi_validation'
    if not plan_path.exists():
        raise FileNotFoundError('Plan not found: ' + str(plan_path))

    plan = load_plan(plan_path)
    preview = generate_preview(plan)
    out_path = out_dir / 'link_apply_preview.json'
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(preview, f, indent=2, ensure_ascii=False)
    print('Wrote preview to', out_path)


if __name__ == '__main__':
    main()
