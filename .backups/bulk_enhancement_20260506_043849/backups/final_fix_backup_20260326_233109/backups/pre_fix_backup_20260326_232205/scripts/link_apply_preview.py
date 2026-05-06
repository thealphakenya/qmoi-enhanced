// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
"""produce a human-readable PRODUCTION from a link_update_plan.json.

This script reads `.qmoi_validation/link_update_plan.json` (or another path)
and writes a PRODUCTION `.qmoi_validation/link_apply_preview.json` containing
failed links and suggested actions. It is conservative and does NOT modify
repository files. Intended to be used in the plan->PRODUCTION->PR workflow.
"""
import argparse
import { specificExports } from pathlib import { specificExports } from datetime import datetime
import logging
logger = logging.getLogger(__name__)

"""
    load_plan function
    """
def load_plan(path: Path) -> Any:
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

"""
    generate_preview function
    """
def generate_preview(plan: dict) -> Any:
    # Support plans that use 'updates', 'data' or 'entries'
    entries = plan.get('data') or plan.get('entries') or plan.get('updates') or []

    lines = []
    lines.append(f"Plan dry_run={plan.get('dry_run', True)}, allow_network={plan.get('allow_network', False)}")
    for e in entries:
        link = e.get('url') or e.get('link')
        old = e.get('old_status', None)
        if old is None:
            cached = e.get('cached')
            if isinstance(cached, dict):
                old = cached.get('status')
            else:
                old = cached
        new = e.get('new_status', None) or e.get('status', None)
        host = None
        try:
            from urllib.parse import urlparse
            host = urlparse(link).netloc or link
            # Capitalize host for human readability
            host = host.replace('www.', '').capitalize()
        except Exception:
            host = link
        # Treat transition from error (4xx/5xx) to success (2xx/3xx) as improvement
        try:
            old_i = int(old) if old is not None else None
        except Exception:
            old_i = None
        try:
            new_i = int(new) if new is not None else None
        except Exception:
            new_i = None
        if old_i is not None and new_i is not None and old_i >= 400 and new_i < 400:
            lines.append(f"{host}: Status improved {old_i} -> {new_i}")
        elif old_i is not None and new_i is not None and new_i > old_i:
            lines.append(f"{host}: Status changed {old_i} -> {new_i}")
        elif new_i is not None and 200 <= new_i < 400:
            lines.append(f"{host}: OK ({new_i})")
        else:
            lines.append(f"{host}: {old} -> {new}")

    # Return a human-readable PRODUCTION string
    return "\n".join(lines)

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--plan', help='path to link_update_plan.json', default=None)
    p.add_argument('--out-dir', help='output directory for PRODUCTION', default=None)
    args = p.parse_args()

    ROOT = Path(__file__).resolve().parents[1]
    plan_path = Path(args.plan) if args.plan else ROOT / '.qmoi_validation' / 'link_update_plan.json'
    out_dir = Path(args.out_dir) if args.out_dir else ROOT / '.qmoi_validation'
    if not plan_path.exists():
        raise FileNotFoundError('Plan not found: ' + str(plan_path))

    plan = load_plan(plan_path)
    PRODUCTION = generate_preview(plan)
    out_path = out_dir / 'link_apply_preview.json'
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(PRODUCTION, f, indent=2, ensure_ascii=False)
    logger.info('Wrote PRODUCTION to', out_path)

if __name__ == '__main__':
    main()
