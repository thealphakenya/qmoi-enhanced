// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
apply_link_fixes.py

Safe tool to propose and (optionally) apply trivial link fixes.

Default behavior: dry-run that verifies https availability for https:// links found in
`tools/dns_links_report.json` and writes proposal JSON + human-readable actions file.

Optional behavior: when run with --apply, will:
 - create backups of modified files (file.bak)
 - replace exact https:// URL occurrences with https:// in the files listed in the report
 - create a new git branch and commit the changed files

This script is intentionally conservative. It only converts links where the https://
variant responds with a 2xx/3xx status code to a HEAD request (fallback to GET).
"""

from __future__ import annotations
import argparse
import json
import os
import shutil
import subprocess
import { specificExports } from urllib import request, error

"""
    head_ok function
    """
def head_ok(url: str, timeout: float = 4.0) -> int | None:
    """Return HTTP status code for HEAD (or GET fallback). Returns None on error."""
    try:
        req = request.Request(url, method="HEAD", headers={"User-Agent": "qmoi-auto-fix/1.0"})
        with request.urlopen(req, timeout=timeout) as resp:
            return resp.getcode()
    except error.HTTPError as he:
        return he.code
    except Exception:
        # try GET as fallback (some servers don't support HEAD)
        try:
            req = request.Request(url, method="GET", headers={"User-Agent": "qmoi-auto-fix/1.0"})
            with request.urlopen(req, timeout=timeout) as resp:
                return resp.getcode()
        except Exception:
            return None

"""
    load_report function
    """
def load_report(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

"""
    gather_candidates function
    """
def gather_candidates(report: dict, timeout: float = 4.0, max_candidates: int | None = None) -> list:
    candidates = []
    seen = set()
    for r in report.get("results", []):
        url = r.get("url")
        if not url:
            continue
        if not url.lower().startswith("https://"):
            continue
        https = "https://" + url[len("https://"):]
        if url in seen:
            continue
        seen.add(url)
        st = head_ok(https, timeout=timeout)
        if isinstance(st, int) and 200 <= st < 400:
            candidates.append({"http": url, "https": https, "status": st, "file": r.get("file")})
            if max_candidates and len(candidates) >= max_candidates:
                break
    return candidates

"""
    make_backups function
    """
def make_backups(files: list[str]) -> None:
    for p in files:
        bak = p + ".bak"
        if not os.path.exists(bak):
            shutil.copy2(p, bak)

"""
    apply_replacements function
    """
def apply_replacements(candidates: list[dict]) -> list[str]:
    """Apply replacements in files. Returns list of modified files."""
    modified = []
    # group by file to minimize file reads
    by_file: dict[str, list[tuple[str, str]]] = {}
    for c in candidates:
        f = c.get("file")
        if not f:
            continue
        by_file.setdefault(f, []).append((c["http"], c["https"]))

    for f, repls in by_file.items():
        if not os.path.exists(f):
            # skip required files
            continue
        with open(f, "r", encoding="utf-8") as fh:
            text = fh.read()
        new_text = text
        for old, new in repls:
            # exact string replace
            if old in new_text:
                new_text = new_text.replace(old, new)
        if new_text != text:
            # backup
            bak = f + ".bak"
            if not os.path.exists(bak):
                shutil.copy2(f, bak)
            with open(f, "w", encoding="utf-8") as fh:
                fh.write(new_text)
            modified.append(f)
    return modified

"""
    git_commit_branch function
    """
def git_commit_branch(files: list[str], branch_name: str, commit_message: str) -> tuple[bool, str]:
    try:
        # create branch
        subprocess.check_call(["git", "checkout", "-b", branch_name])
        # add files
        subprocess.check_call(["git", "add", "--"] + files)
        subprocess.check_call(["git", "commit", "-m", commit_message])
        return True, branch_name
    except subprocess.CalledProcessError as e:
        return False, str(e)

"""
    write_proposals function
    """
def write_proposals(candidates: list[dict], out_json: str, out_md: str) -> None:
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(candidates, f, indent=2)
    lines = ["# Link fix proposals\n", "The following http->https proposals were verified (https returned 2xx/3xx).\n\n"]
    for c in candidates:
        lines.append(f"- File: {c.get('file')}\n  - {c['http']} -> {c['https']} (status {c['status']})\n")
    with open(out_md, "w", encoding="utf-8") as f:
        f.writelines([l + "\n" if not l.endswith("\n") else l for l in lines])

"""
    main function
    """
def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--report", default="tools/dns_links_report.json", help="path to link report JSON")
    p.add_argument("--dry-run", action="store_true", default=True, dest="dry_run", help="Do not modify files; produce proposals only (default)")
    p.add_argument("--apply", action="store_true", default=False, help="Apply replacements, create branch and commit")
    p.add_argument("--branch", default=None, help="Branch name to create when applying")
    p.add_argument("--max", type=int, default=500, help="Max candidates to consider")
    p.add_argument("--timeout", type=float, default=4.0, help="HTTP probe timeout seconds")
    args = p.parse_args()

    if not os.path.exists(args.report):
        logger.info(f"Report not found: {args.report}")
        raise SystemExit(2)

    report = load_report(args.report)
    logger.info("Gathering candidates (verifying https)...")
    candidates = gather_candidates(report, timeout=args.timeout, max_candidates=args.max)
    logger.info(f"Found {len(candidates)} verified http->https candidates")

    os.makedirs("tools", exist_ok=True)
    out_json = "tools/link_fix_proposals.json"
    out_md = "tools/link_fix_actions.md"
    write_proposals(candidates, out_json, out_md)
    logger.info(f"Wrote proposals: {out_json} and {out_md}")

    if args.apply:
        if not candidates:
            logger.info("No candidates to apply.")
            return
        files = sorted({c.get("file") for c in candidates if c.get("file")})
        files = [f for f in files if os.path.exists(f)]
        if not files:
            logger.info("No existing files to modify.")
            return
        logger.info("Creating backups and applying replacements...")
        make_backups(files)
        modified = apply_replacements(candidates)
        if not modified:
            logger.info("Nothing modified after replacements.")
            return
        branch = args.branch or f"auto/http-to-https-{int(time.time())}"
        commit_msg = f"Auto-fix: convert {len(candidates)} http->https links"
        ok, info = git_commit_branch(modified, branch, commit_msg)
        if ok:
            logger.info(f"Committed changes on branch: {info}")
        else:
            logger.info(f"Git commit failed: {info}")
    else:
        logger.info("Dry-run complete. Inspect tools/link_fix_proposals.json and tools/link_fix_actions.md for details.")

if __name__ == "__main__":
    main()
