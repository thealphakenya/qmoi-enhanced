#!/usr/bin/env python3
"""
Lightweight autodev manager (conservative, dry-run by default).
- snapshot: create a timestamped snapshot of file contents (selected dirs)
- list: list available snapshots
- suggest-restore: show diff/contents for a file from latest snapshot
- restore: restore file from snapshot (only when PRODUCTION_CONFIRMED=true)

Important: This is intentionally conservative. By default it only performs dry-run actions and writes audit logs.
"""

import argparse
import hashlib
import json
import os
import shutil
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SNAP_DIR = ROOT / ".qmoi_snapshots"
AUDIT_LOG = ROOT / ".qmoi_validation" / "autodev-audit.log"

DEFAULT_DIRS = ["components", "src", "app", "api", "scripts"]


def now_ts():
    return int(time.time())


def write_audit(entry: dict):
    try:
        os.makedirs(AUDIT_LOG.parent, exist_ok=True)
        with open(AUDIT_LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception as e:
        print("Unable to write audit log:", e)


def file_hash(path: Path):
    h = hashlib.sha256()
    try:
        with open(path, "rb") as f:
            while True:
                chunk = f.read(8192)
                if not chunk:
                    break
                h.update(chunk)
        return h.hexdigest()
    except Exception:
        return None


def snapshot(dirs, dry_run=True):
    ts = now_ts()
    snap_path = SNAP_DIR / str(ts)
    manifest = {"timestamp": ts, "dirs": dirs, "files": []}
    for d in dirs:
        base = ROOT / d
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if p.is_file():
                rel = p.relative_to(ROOT).as_posix()
                h = file_hash(p)
                manifest["files"].append({"path": rel, "hash": h})
                if not dry_run:
                    dest = snap_path / rel
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(p, dest)
    # save manifest
    if not dry_run:
        (snap_path).mkdir(parents=True, exist_ok=True)
        with open(snap_path / "manifest.json", "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
    # audit
    write_audit({
        "action": "snapshot",
        "timestamp": ts,
        "dirs": dirs,
        "dry_run": dry_run,
        "file_count": len(manifest["files"]),
    })
    print(f"snapshot: timestamp={ts} files={len(manifest['files'])} dry_run={dry_run}")
    return manifest


def list_snapshots():
    if not SNAP_DIR.exists():
        print("no snapshots")
        return []
    snaps = []
    for p in sorted(SNAP_DIR.iterdir(), key=lambda x: x.name, reverse=True):
        if p.is_dir():
            manifest = p / "manifest.json"
            if manifest.exists():
                try:
                    with open(manifest, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    snaps.append({"id": p.name, "manifest": data})
                except Exception:
                    continue
    for s in snaps:
        print(s["id"], "-", len(s["manifest"].get("files", [])), "files")
    return snaps


def suggest_restore(path):
    # find latest snapshot containing path
    if not SNAP_DIR.exists():
        print("no snapshots")
        return None
    for p in sorted(SNAP_DIR.iterdir(), key=lambda x: x.name, reverse=True):
        manifest = p / "manifest.json"
        if not manifest.exists():
            continue
        try:
            with open(manifest, "r", encoding="utf-8") as f:
                data = json.load(f)
            for fmeta in data.get("files", []):
                if fmeta["path"] == path:
                    # show content
                    candidate = p / path
                    if candidate.exists():
                        with open(candidate, "r", encoding="utf-8", errors="ignore") as fh:
                            content = fh.read()
                        print("--- suggested restore from snapshot", p.name)
                        print(content[:2000])
                        write_audit({
                            "action": "suggest_restore",
                            "timestamp": now_ts(),
                            "path": path,
                            "snapshot": p.name,
                        })
                        return {"snapshot": p.name, "path": path, "content": content}
        except Exception:
            continue
    print("no candidate found in snapshots")
    return None


def restore(snapshot_id, path, dry_run=True):
    snap_path = SNAP_DIR / str(snapshot_id)
    candidate = snap_path / path
    target = ROOT / path
    if not candidate.exists():
        print("snapshot or file not found")
        return False
    if dry_run:
        print("dry-run: would restore", path, "from", snapshot_id)
        write_audit({
            "action": "restore",
            "timestamp": now_ts(),
            "path": path,
            "snapshot": snapshot_id,
            "dry_run": True,
        })
        return True
    # real restore
    os.makedirs(target.parent, exist_ok=True)
    shutil.copy2(candidate, target)
    write_audit({
        "action": "restore",
        "timestamp": now_ts(),
        "path": path,
        "snapshot": snapshot_id,
        "dry_run": False,
    })
    print("restored", path)
    return True


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd")
    p_snap = sub.add_parser("snapshot")
    p_snap.add_argument("--dirs", nargs="*", default=DEFAULT_DIRS)
    p_snap.add_argument("--apply", action="store_true", help="perform real snapshot (requires PRODUCTION_CONFIRMED)")

    p_list = sub.add_parser("list")

    p_sug = sub.add_parser("suggest-restore")
    p_sug.add_argument("--path", required=True)

    p_res = sub.add_parser("restore")
    p_res.add_argument("--snapshot", required=True)
    p_res.add_argument("--path", required=True)
    p_res.add_argument("--confirm", action="store_true", help="perform real restore; requires PRODUCTION_CONFIRMED")

    args = parser.parse_args()
    if args.cmd == "snapshot":
        dry = not bool(args.apply)
        if not dry and os.environ.get("PRODUCTION_CONFIRMED") != "true":
            print("To perform a real snapshot set PRODUCTION_CONFIRMED=true")
            dry = True
        snapshot(args.dirs, dry_run=dry)
    elif args.cmd == "list":
        list_snapshots()
    elif args.cmd == "suggest-restore":
        suggest_restore(args.path)
    elif args.cmd == "restore":
        dry = not bool(args.confirm)
        if not dry and os.environ.get("PRODUCTION_CONFIRMED") != "true":
            print("To perform a real restore set PRODUCTION_CONFIRMED=true and --confirm flag")
            dry = True
        restore(args.snapshot, args.path, dry_run=dry)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
