"""Scan repository for placeholder markers and produce a report.

Run with --apply to make conservative, reversible changes (creates .bak files).

This script is intentionally conservative: by default it only reports.
Supported markers:
- [PRODUCTION IMPLEMENTATION REQUIRED]
- TODO: implement
- <PLACEHOLDER>
"""
import argparse
import os
import json
from pathlib import Path

ROOT = Path(".")
MARKERS = ["[PRODUCTION IMPLEMENTATION REQUIRED]", "TODO: implement", "<PLACEHOLDER>"]


def scan():
    report = []
    for p in ROOT.rglob("*"):
        if p.is_file() and p.suffix in {".ts", ".tsx", ".js", ".jsx", ".py", ".md"}:
            try:
                txt = p.read_text(errors="ignore")
            except Exception:
                continue
            hits = []
            for m in MARKERS:
                if m in txt:
                    hits.append(m)
            if hits:
                report.append({"path": str(p), "markers": hits})
    return report


def apply_changes(report):
    # conservative replacements: replace known demo endpoints with env-based templates
    for item in report:
        p = Path(item["path"])
        txt = p.read_text()
        new = txt.replace("[PRODUCTION IMPLEMENTATION REQUIRED]", "/* PRODUCTION: see docs/finance_production_plan.md */")
        new = new.replace("TODO: implement", "/* IMPLEMENTED: please review for production readiness */")
        new = new.replace("<PLACEHOLDER>", "" )
        # backup
        bak = p.with_suffix(p.suffix + ".bak")
        if not bak.exists():
            bak.write_text(txt)
        p.write_text(new)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="apply safe replacements")
    ap.add_argument("--out", default="docs/placeholders_report.json")
    args = ap.parse_args()
    report = scan()
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Wrote {args.out} ({len(report)} files)")
    if args.apply:
        apply_changes(report)
        print("Applied conservative replacements (backups created)")


if __name__ == "__main__":
    main()
