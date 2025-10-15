"""tools/update_model_card_fixed.py

Conservative updater for QMOI_MODEL_CARD.md from autodev metadata JSON.
Usage:
    python tools/update_model_card_fixed.py --metadata path/to/metadata.json --out QMOI_MODEL_CARD.md

This avoids modifying the original updater and fixes earlier string handling bugs.
"""
import argparse
import json
import re
from pathlib import Path


def load_metadata(path: Path):
    return json.loads(path.read_text())


def replace_section(card: str, header: str, new_content: str) -> str:
    """Replace the section starting at `header` (exact match) up to the next '## ' header or EOF.
    `new_content` should be the content to place after the header (no header line included).
    If the header doesn't exist, append it with the content.
    """
    if header in card:
        parts = card.split(header, 1)
        rest = parts[1]
        m = re.search(r"\n## ", rest)
        if m:
            rest_after = rest[m.start():]
            return parts[0] + header + "\n\n" + new_content + rest_after
        else:
            return parts[0] + header + "\n\n" + new_content
    else:
        # ensure there is a trailing newline
        prefix = card.rstrip() + "\n\n" if card else ""
        return prefix + header + "\n\n" + new_content


def replace_or_upsert_version(card: str, version: str) -> str:
    """Replace a top-level 'Version: x' line or insert at top if missing."""
    lines = card.splitlines()
    for i, ln in enumerate(lines):
        if ln.strip().lower().startswith('version:'):
            lines[i] = f'Version: {version}'
            return "\n".join(lines)
    # not found, insert near top
    insert_at = 0
    # skip optional title line if present
    if lines and lines[0].startswith('#'):
        insert_at = 1
    lines.insert(insert_at, f'Version: {version}')
    return "\n".join(lines)


def update_model_card(metadata: dict, out_path: Path):
    card = out_path.read_text() if out_path.exists() else ""

    # Replace Version line
    version = metadata.get('version', 'v0.0.0')
    card = replace_or_upsert_version(card, version)

    # Insert evaluation metrics (as a fenced code block)
    eval_section = json.dumps(metadata.get('eval', {}), indent=2)
    eval_block = '```\n' + eval_section + '\n```'
    card = replace_section(card, '## Evaluation', eval_block)

    # Replace or append changelog
    changelog = metadata.get('changelog')
    if changelog:
        card = replace_section(card, '## Changelog', changelog.strip() + '\n')

    out_path.write_text(card)
    print(f'Updated {out_path} (version={version})')


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--metadata', required=True, help='Path to metadata JSON')
    p.add_argument('--out', default='QMOI_MODEL_CARD.md', help='Model card path')
    args = p.parse_args()

    meta = load_metadata(Path(args.metadata))
    update_model_card(meta, Path(args.out))
