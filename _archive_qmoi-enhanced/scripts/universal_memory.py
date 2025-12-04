#!/usr/bin/env python3
"""
QMOI Universal Memory
---------------------
Lightweight cross-app, cross-device memory for user preferences and recent projects.

Data lives in config/universal_memory.json and is safe to sync across devices.

Capabilities:
- Remember feature preferences (e.g., writing assistant enabled)
- Track recent projects/sessions per user and device
- Simple CLI to get/set preferences and record sessions
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict


ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "config"
MEM_FILE = CONFIG / "universal_memory.json"


def load_mem() -> Dict[str, Any]:
    CONFIG.mkdir(parents=True, exist_ok=True)
    if MEM_FILE.exists():
        try:
            with open(MEM_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"users": {}, "updated": None}


def save_mem(data: Dict[str, Any]) -> None:
    data["updated"] = datetime.utcnow().isoformat()
    with open(MEM_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def get_current_user() -> str:
    return os.environ.get("QMOI_USER") or os.environ.get("USERNAME") or os.environ.get("USER") or "default"


def get_current_device() -> str:
    return os.environ.get("COMPUTERNAME") or os.environ.get("HOSTNAME") or "device"


def ensure_user(mem: Dict[str, Any], user: str) -> Dict[str, Any]:
    users = mem.setdefault("users", {})
    profile = users.setdefault(user, {"preferences": {"writing_assistant_enabled": True}, "recent": []})
    return profile


def set_pref(key: str, value: Any) -> Dict[str, Any]:
    mem = load_mem()
    profile = ensure_user(mem, get_current_user())
    profile["preferences"][key] = value
    save_mem(mem)
    return profile["preferences"]


def get_prefs() -> Dict[str, Any]:
    mem = load_mem()
    profile = ensure_user(mem, get_current_user())
    return profile["preferences"]


def record_session(app: str, project: str, extra: Dict[str, Any] | None = None) -> Dict[str, Any]:
    mem = load_mem()
    profile = ensure_user(mem, get_current_user())
    entry = {
        "app": app,
        "project": project,
        "device": get_current_device(),
        "ts": datetime.utcnow().isoformat(),
    }
    if extra:
        entry.update(extra)
    # Keep only recent 20
    profile["recent"] = [entry] + profile.get("recent", [])[:19]
    save_mem(mem)
    return entry


def main():
    p = argparse.ArgumentParser(description="QMOI Universal Memory")
    sub = p.add_subparsers(dest="cmd", required=True)

    p_get = sub.add_parser("get-prefs", help="Get current user preferences")

    p_set = sub.add_parser("set-pref", help="Set a preference key/value")
    p_set.add_argument("key")
    p_set.add_argument("value")

    p_rec = sub.add_parser("record", help="Record a project/session entry")
    p_rec.add_argument("--app", required=True)
    p_rec.add_argument("--project", required=True)
    p_rec.add_argument("--meta", help="JSON string of extra fields", default="{}")

    args = p.parse_args()

    if args.cmd == "get-prefs":
        print(json.dumps(get_prefs(), indent=2))
        return

    if args.cmd == "set-pref":
        # Basic coercion for booleans
        val = args.value
        if val.lower() in ("true", "false"):
            val = val.lower() == "true"
        print(json.dumps(set_pref(args.key, val), indent=2))
        return

    if args.cmd == "record":
        try:
            extra = json.loads(args.meta) if args.meta else {}
        except Exception:
            extra = {}
        print(json.dumps(record_session(args.app, args.project, extra), indent=2))
        return


if __name__ == "__main__":
    main()


