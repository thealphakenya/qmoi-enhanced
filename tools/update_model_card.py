"""tools/update_model_card.py

Simple utility to update QMOI_MODEL_CARD.md from autodev metadata JSON.
Usage:
    python tools/update_model_card.py --metadata path/to/metadata.json --out QMOI_MODEL_CARD.md

This is intentionally conservative: it updates Version, Evaluation, and Changelog sections.
"""
import argparse
import json
from datetime import datetime
from pathlib import Path

TEMPLATE_KEYS = ["version", "commit", "eval", "artifacts_path", "changelog"]


def load_metadata(path: Path):
    return json.loads(path.read_text())


def update_model_card(metadata: dict, out_path: Path):
    card = out_path.read_text() if out_path.exists() else ""

    # Replace Version line
    version = metadata.get('version', 'v0.0.0')
    card = replace_or_insert(card, 'Version:', f'Version: {version}')

    # Insert evaluation metrics
    eval_section = json.dumps(metadata.get('eval', {}), indent=2)
    card = replace_or_insert(card, '## Evaluation', f'## Evaluation\n\n```
{eval_section}
```')

    # Append changelog if present
    changelog = metadata.get('changelog')
    if changelog:
        card += '\n\n## Changelog\n\n' + changelog + '\n'

    out_path.write_text(card)
    print(f'Updated {out_path} (version={version})')


def replace_or_insert(card: str, header: str, new_block: str) -> str:
    if header in card:
        parts = card.split(header, 1)
        # replace rest of the section up to next header (## ) or end
        rest = parts[1]
        import re
        m = re.search(r"\n## \w+", rest)
        if m:
            rest_after = rest[m.start():]
            return parts[0] + header + '\n\n' + new_block + '\n' + rest_after
        else:
            return parts[0] + header + '\n\n' + new_block + '\n'
    else:
        return card + '\n' + header + '\n\n' + new_block + '\n'


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--metadata', required=True, help='Path to metadata JSON')
    p.add_argument('--out', default='QMOI_MODEL_CARD.md', help='Model card path')
    args = p.parse_args()

    meta = load_metadata(Path(args.metadata))
    update_model_card(meta, Path(args.out))
