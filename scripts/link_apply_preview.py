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
    # Support plans that use 'updates', 'sample' or 'entries'
    entries = plan.get('sample') or plan.get('entries') or plan.get('updates') or []

    lines = []
    lines.append(f"Plan dry_run={plan.get('dry_run', True)}, allow_network={plan.get('allow_network', False)}")
    for e in entries:
        link = e.get('url') or e.get('link')
        old = e.get('old_status') or e.get('cached', {}).get(
            'status') if isinstance(e.get('cached'), dict) else e.get('cached')
        new = e.get('status') or e.get('new_status')
        host = None
        try:
            from urllib.parse import urlparse
            host = urlparse(link).netloc or link
            # Capitalize host for human readability
            host = host.replace('www.', '').capitalize()
        except Exception:
            host = link
        if old and new and isinstance(old, int) and isinstance(new, int) and new > old:
            lines.append(f"{host}: Status improved {old} -> {new}")
        elif new and new == 'ok' or new == 200:
            lines.append(f"{host}: OK ({new})")
        else:
            lines.append(f"{host}: {old} -> {new}")

    # Return a human-readable preview string
    return "\n".join(lines)


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
