#!/usr/bin/env python3
"""
Create safe, non-destructive stub files for missing artifacts listed in docs/missing_builds_report.json
Creates `.auto_stub` files next to the expected path (does not overwrite real files).
"""
import argparse
import json
import os
from datetime import datetime


def safe_write_stub(path, content):
    # write to path + '.auto_stub' to avoid overwriting
    stub_path = path + '.auto_stub'
    os.makedirs(os.path.dirname(stub_path), exist_ok=True)
    with open(stub_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return stub_path


def make_text_stub(entry):
    return (
        f"Auto-generated stub for {entry['file']}\n"
        "This is a non-destructive placeholder created by scripts/create_stubs.py.\n"
        "Replace with a real build artifact (binary or text) produced by your CI release pipeline.\n"
        f"Generated_at: {datetime.utcnow().isoformat()}Z\n"
    )


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--report', default='docs/missing_builds_report.json')
    p.add_argument('--top', default=5, type=int, help='Top N missing entries to create stubs for')
    args = p.parse_args()

    if not os.path.exists(args.report):
        print(f"Missing report {args.report} — run generate_missing_artifacts_report.py first")
        raise SystemExit(2)

    with open(args.report, 'r', encoding='utf-8') as f:
        rep = json.load(f)

    missing = rep.get('missing', [])
    created = []
    for entry in missing[: args.top]:
        file = entry['file']
        # do not overwrite existing real file
        if os.path.exists(file):
            print(f"Skipping existing file: {file}")
            continue
        content = make_text_stub(entry)
        stub_path = safe_write_stub(file, content)
        created.append({'stub': stub_path, 'target': file, 'reason': entry.get('reason')})

    out = {
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'generated_by': 'create_stubs.py',
        'report_source': args.report,
        'created_count': len(created),
        'created': created,
    }

    os.makedirs('stubs', exist_ok=True)
    out_file = 'stubs/created_stubs.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2)

    print(f"Wrote {out_file} ({len(created)} stubs)")


if __name__ == '__main__':
    main()
