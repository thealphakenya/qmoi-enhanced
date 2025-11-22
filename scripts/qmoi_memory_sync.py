#!/usr/bin/env python3
"""QMOI Memory Sync (local)

Simple, conservative tool to gather QMOI memory artifacts across the repo,
merge them into a single JSON/NDJSON file under `.qmoi_state/merged_memory.json`,
and write a compact sample for local chat use.

This is intentionally local-first and does NOT push anything to remote.
Use it in CI or locally before invoking the chat helper so the assistant
sees up-to-date memory.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / '.qmoi_state'
OUT_DIR.mkdir(parents=True, exist_ok=True)
LOCAL_CHAT = ROOT / '.qmoi_local_chat'
LOCAL_CHAT.mkdir(parents=True, exist_ok=True)


def find_memory_files():
    patterns = ['**/qmoi_memory*.json', '**/qmoi_memory*.jsonl', '**/qmoi_memory*', '.qmoi_state/**/*.json']
    found = []
    for pat in patterns:
        for p in ROOT.glob(pat):
            if p.is_file():
                found.append(p)
    return sorted(set(found), key=lambda p: str(p))


def load_json_safe(p: Path):
    try:
        txt = p.read_text(encoding='utf8', errors='replace')
        # try JSON array or NDJSON detection
        txt_strip = txt.lstrip()
        if txt_strip.startswith('['):
            return json.loads(txt)
        # try ndjson: multiple JSONs per line
        items = []
        for line in txt.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                items.append(json.loads(line))
            except Exception:
                # last-resort: wrap whole file as a single object
                pass
        if items:
            return items
        # fallback single object
        return [json.loads(txt)]
    except Exception:
        return []


def merge_memories(files):
    merged = []
    ids_seen = set()
    for p in files:
        items = load_json_safe(p)
        for it in items:
            # optional dedupe by 'id' or 'uid' field
            key = None
            if isinstance(it, dict):
                key = it.get('id') or it.get('uid') or it.get('key')
            if key and key in ids_seen:
                continue
            if key:
                ids_seen.add(key)
            merged.append(it)
    return merged


def write_merged(merged):
    out = OUT_DIR / 'merged_memory.json'
    try:
        with out.open('w', encoding='utf8') as f:
            json.dump(merged, f, ensure_ascii=False)
        # also write a compact sample for local chat
        sample = merged[:200]
        sample_out = LOCAL_CHAT / f'merged_memory_sample_{datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")}.json'
        with sample_out.open('w', encoding='utf8') as f:
            json.dump(sample, f, ensure_ascii=False)
        return out, sample_out
    except Exception as e:
        print('write failed', e, file=sys.stderr)
        return None, None


def main():
    files = find_memory_files()
    print(f'Found {len(files)} memory files')
    for p in files:
        print('-', p)
    merged = merge_memories(files)
    print('Merged items:', len(merged))
    out, sample = write_merged(merged)
    if out:
        print('Wrote merged memory to', out)
    if sample:
        print('Wrote sample to', sample)


if __name__ == '__main__':
    main()
