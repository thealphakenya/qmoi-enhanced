#!/usr/bin/env python3
"""
Generate project manifests and summary markdowns for MASTER, SISTER and USERS projects.

This script scans top-level directories for project indicators (package.json, pyproject.toml,
README.md, Dockerfile, etc.), extracts simple metadata, and writes:
 - .qmoi/project_manifests.json
 - MASTERPROJECTS.md
 - SISTERPROJECTS.md
 - USERSPROJECTS.md
 - USERSREADME.md is touched/updated by this script if missing.

Designed to be idempotent and safe. It will not overwrite existing `.qmoi/project_manifests.json`
unless --force is passed.

Run once: python3 scripts/generate_project_manifests.py
Run periodically: python3 scripts/generate_project_manifests.py --watch

"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QM = ROOT / ".qmoi"
QM.mkdir(exist_ok=True)

KEYWORDS_REVENUE = re.compile(r"\b(revenue|wallet|cashon|mpesa|binance|payment|earning|trade|trading|deposit|withdraw)\b", re.I)
KEYWORDS_QMOI = re.compile(r"\b(qmoi|alpha-q|alpha q|qmoiauto|auto-project|autoproject)\b", re.I)
KEYWORDS_LION = re.compile(r"LION_VALIDATION_START|QMOI_LION_VALIDATION_START|LION", re.I)

def read_text(fp: Path) -> str:
    try:
        return fp.read_text(encoding="utf-8")
    except Exception:
        return ""

def summarize_readme(readme_text: str) -> str:
    # return first non-empty paragraph (max 300 chars)
    for part in [p.strip() for p in readme_text.split("\n\n") if p.strip()]:
        txt = ' '.join(part.split())
        return txt[:300]
    return ""

def detect_project(dirpath: Path) -> dict:
    name = dirpath.name
    meta = {
        "name": name,
        "path": str(dirpath.relative_to(ROOT)),
        "type": [],
        "description": "",
        "tags": [],
        "owner": "user",
    }

    # check package.json
    pkg = dirpath / "package.json"
    if pkg.exists():
        try:
            pj = json.loads(pkg.read_text(encoding="utf-8"))
            meta["name"] = pj.get("name") or meta["name"]
            if pj.get("description"):
                meta["description"] = pj.get("description")
            meta["type"].append("node")
        except Exception:
            pass

    pyproj = dirpath / "pyproject.toml"
    if pyproj.exists() or (dirpath / "setup.py").exists():
        meta["type"].append("python")

    if any((dirpath / f).exists() for f in ["Dockerfile", "Dockerfile.ai", "Dockerfile.worker"]):
        meta["type"].append("docker")

    readme = dirpath / "README.md"
    if readme.exists():
        txt = read_text(readme)
        meta["description"] = meta["description"] or summarize_readme(txt)
        if KEYWORDS_REVENUE.search(txt):
            meta["tags"].append("revenue")
        if KEYWORDS_QMOI.search(txt):
            meta["tags"].append("qmoi")
            if KEYWORDS_LION.search(txt):
                if "lion" not in meta["tags"]:
                    meta["tags"].append("lion")
        if "master" in txt.lower() or "master-only" in txt.lower():
            meta["owner"] = "master"
        if "sister" in txt.lower():
            meta["owner"] = "sister"

    # search for revenue keywords in files
    for p in dirpath.rglob("*.*"):
        if p.name.startswith('.'):
            continue
        try:
            content = p.read_text(encoding="utf-8")
        except Exception:
            continue
        if KEYWORDS_REVENUE.search(content):
            if "revenue" not in meta["tags"]:
                meta["tags"].append("revenue")
        if KEYWORDS_QMOI.search(content):
            if "qmoi" not in meta["tags"]:
                meta["tags"].append("qmoi")
            if KEYWORDS_LION.search(content):
                if "lion" not in meta["tags"]:
                    meta["tags"].append("lion")

    # heuristics for owner detection
    if name.lower().startswith("master") or name.lower().endswith("-master"):
        meta["owner"] = "master"
    if name.lower().startswith("sister") or name.lower().endswith("-sister"):
        meta["owner"] = "sister"

    return meta

def scan_projects() -> dict:
    projects = []
    skip = {".git", ".qmoi", "node_modules", "venv", "env", "__pycache__", "docs"}
    for entry in sorted(ROOT.iterdir()):
        if entry.name in skip:
            continue
        if entry.is_dir():
            projects.append(detect_project(entry))
    manifest = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "root": str(ROOT),
        "projects": projects,
    }
    return manifest

def write_json_manifest(manifest: dict, out: Path):
    out.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

def build_md_lists(manifest: dict):
    projects = manifest.get("projects", [])
    master = [p for p in projects if p.get("owner") == "master" or "revenue" in p.get("tags", [])]
    sister = [p for p in projects if p.get("owner") == "sister"]
    users = [p for p in projects if p not in master and p not in sister]

    def render_list(items):
        out = []
        for p in items:
            tags = ", ".join(p.get("tags", [])) or "-"
            desc = p.get("description") or "(no description)"
            out.append(f"- **{p.get('name')}** — `{p.get('path')}`\n  - Tags: {tags}\n  - Notes: {desc}")
        return "\n".join(out)

    md_master = "# MASTERPROJECTS\n\n" + (render_list(master) or "No master projects detected yet.")
    md_sister = "# SISTERPROJECTS\n\n" + (render_list(sister) or "No sister projects detected yet.")
    md_users = "# USERSPROJECTS\n\n" + (render_list(users) or "No user projects detected yet.")

    return md_master, md_sister, md_users

def ensure_usersreadme():
    p = ROOT / "USERSREADME.md"
    if p.exists():
        return
    content = """
# USERS README

This file is auto-generated by `scripts/generate_project_manifests.py` and lists how user projects are structured.

Each user's projects are saved under their project directories. This file provides an overview and explains how the system auto-updates project manifests.

Run `python3 scripts/generate_project_manifests.py` to refresh manifests.
"""
    p.write_text(content.strip() + "\n", encoding="utf-8")

def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=".qmoi/project_manifests.json")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--watch", action="store_true", help="watch mode - regenerate every 30s")
    args = ap.parse_args(argv)

    outp = Path(args.out)
    if outp.exists() and not args.force and not args.watch:
        print(f"{outp} exists; use --force to overwrite or --watch to run continuously")
        sys.exit(0)

    ensure_usersreadme()

    def run_once():
        manifest = scan_projects()
        QM.mkdir(exist_ok=True)
        write_json_manifest(manifest, QM / "project_manifests.json")
        md_master, md_sister, md_users = build_md_lists(manifest)
        (ROOT / "MASTERPROJECTS.md").write_text(md_master + "\n", encoding="utf-8")
        (ROOT / "SISTERPROJECTS.md").write_text(md_sister + "\n", encoding="utf-8")
        (ROOT / "USERSPROJECTS.md").write_text(md_users + "\n", encoding="utf-8")
        # Update USERSREADME.md with a small note and timestamp
        ur = ROOT / "USERSREADME.md"
        ts = datetime.utcnow().isoformat() + "Z"
        ur.write_text(f"# USERS README\n\nAuto-generated at {ts}\n\nSee MASTERPROJECTS.md, SISTERPROJECTS.md, USERSPROJECTS.md for details.\n", encoding="utf-8")
        # Update MASTERREADME.md to reference generated project lists
        mroot = ROOT / "MASTERREADME.md"
        if mroot.exists():
            txt = mroot.read_text(encoding="utf-8")
            marker = "<!-- PROJECT_MANIFEST_LINKS -->"
            extra = f"\n\n## Project Manifests (auto-generated)\n\n- [MASTER PROJECTS](./MASTERPROJECTS.md)\n- [SISTER PROJECTS](./SISTERPROJECTS.md)\n- [USER PROJECTS](./USERSPROJECTS.md)\n\n"
            if marker not in txt:
                txt = txt + "\n" + marker + "\n" + extra
                mroot.write_text(txt, encoding="utf-8")
        print(f"Wrote manifests to {QM}/project_manifests.json and markdown summaries")

    if args.watch:
        import time
        print("Entering watch mode, regenerating every 30s (Ctrl-C to stop)")
        try:
            while True:
                run_once()
                time.sleep(30)
        except KeyboardInterrupt:
            print("Stopped")
    else:
        run_once()

if __name__ == '__main__':
    main()
