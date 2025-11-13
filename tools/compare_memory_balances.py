#!/usr/bin/env python3
"""Compare markdown-extracted balances with qmoi memory and produce a diff report.
Writes `reports/balance_memory_diff.json` and `reports/balance_memory_diff.md`.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'reports'
REPORTS.mkdir(parents=True, exist_ok=True)
BALANCE_MATCHES = REPORTS / 'balance_matches.json'
MEMORY_FILE = ROOT / 'qmoi_memory.json'


def load_json(p: Path):
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text())
    except Exception:
        return None


def extract_amounts_from_memory(mem):
    # Look for simple $ or currency amounts in stored messages
    amounts = set()
    if not mem:
        return amounts
    for entry in mem.get('conversations', []):
        text = entry.get('message', '')
        for m in re.findall(r"\$[0-9,]+(?:\.[0-9]{1,2})?", text):
            amounts.add(m)
        for m in re.findall(r"[0-9,]+\s*(USD|KES|EUR|GBP)", text, flags=re.I):
            amounts.add(m)
    return amounts


def main():
    matches = load_json(BALANCE_MATCHES)
    mem = load_json(MEMORY_FILE)

    md_amounts = set()
    if matches and isinstance(matches, list):
        for item in matches:
            amt = item.get('amount') or item.get('match')
            if amt:
                md_amounts.add(str(amt))
            else:
                # fallback: attempt to parse snippet
                snippet = item.get('snippet','')
                for m in re.findall(r"\$[0-9,]+(?:\.[0-9]{1,2})?", snippet):
                    md_amounts.add(m)

    mem_amounts = extract_amounts_from_memory(mem)

    not_in_memory = sorted(list(md_amounts - mem_amounts))
    in_memory_not_md = sorted(list(mem_amounts - md_amounts))

    out = {
        'md_amounts_count': len(md_amounts),
        'mem_amounts_count': len(mem_amounts),
        'not_in_memory': not_in_memory,
        'in_memory_not_in_md': in_memory_not_md,
    }

    (REPORTS / 'balance_memory_diff.json').write_text(json.dumps(out, indent=2))

    md_lines = ["# Balance vs Memory Diff Report\n"]
    md_lines.append(f"- Markdown amounts found: {len(md_amounts)}\n")
    md_lines.append(f"- Memory amounts found: {len(mem_amounts)}\n")
    md_lines.append('\n')
    md_lines.append('## Amounts present in markdown but NOT in memory\n')
    if not_in_memory:
        for a in not_in_memory:
            md_lines.append(f"- {a}\n")
    else:
        md_lines.append('- None\n')
    md_lines.append('\n')
    md_lines.append('## Amounts present in memory but NOT in markdown\n')
    if in_memory_not_md:
        for a in in_memory_not_md:
            md_lines.append(f"- {a}\n")
    else:
        md_lines.append('- None\n')

    (REPORTS / 'balance_memory_diff.md').write_text('\n'.join(md_lines))
    print('Wrote reports/balance_memory_diff.json and .md')


if __name__ == '__main__':
    main()
