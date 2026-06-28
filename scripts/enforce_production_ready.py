#!/usr/bin/env python3
"""
Production-ready validation enforcement.
Checks that all documented .md files exist, are current, and have proper production status markers.
Generates enforcement report and production readiness score.
"""

import json
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"

# Reference files that define documentation completeness
REFERENCE_FILES = {
    "ALLDIRECTORIESMD.md": "Directory documentation index",
    "ALLMDFILESREFS.md": "Master markdown file reference",
    "API.md": "Consolidated API documentation",
    "ENDPOINTS.md": "API endpoints reference",
    "ROUTES.md": "Application routes reference",
    "HOOKS.md": "Hooks documentation",
    "WEBHOOKS.md": "Webhooks documentation",
    "TREE.md": "Directory tree structure",
}

# Directory-specific documentation requirements
DIRECTORY_DOCS = {
    "src": ["SRC.md"],
    "components": ["COMPONENTS.md"],
    "workflows": ["WORKFLOWS.md"],
    "hooks": ["HOOKS.md"],
    "tests": ["TESTS.md"],
    "scripts": ["SCRIPTS.md"],
    "services": ["SERVICES.md"],
    "lib": ["LIB.md"],
    "config": ["CONFIG.md"],
    "database": ["DATABASE.md"],
    "api": ["API.md"],
    "ui": ["UI.md"],
    "docs": ["DOCS.md"],
    "mobile": ["MOBILE.md"],
}


def check_file_exists_and_current(file_path: Path, max_age_hours: int = 24) -> Tuple[bool, int]:
    """Check if file exists and is current (within max_age_hours)."""
    if not file_path.exists():
        return False, -1
    
    try:
        age_hours = (datetime.now().timestamp() - file_path.stat().st_mtime) / 3600
        is_current = age_hours <= max_age_hours
        return is_current, int(age_hours)
    except Exception:
        return False, -1


def is_production_marked(file_path: Path) -> bool:
    """Check if file has production-ready markers."""
    if not file_path.exists():
        return False
    
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        # Check for nonproduction markers
        if "REVIEW_REQUIRED" in content or "PENDING:" in content or "PLACEHOLDER:" in content:
            return False
        # If it has substantial content, assume production-ready
        return len(content.strip()) > 100
    except Exception:
        return False


def validate_all_documented_files() -> Dict:
    """Validate all documented files exist and are current."""
    report = {
        "generated": datetime.utcnow().isoformat() + "Z",
        "validation_scope": "Production-ready enforcement",
        "reference_files": {},
        "directory_docs": {},
        "summary": {
            "total_files_checked": 0,
            "files_missing": 0,
            "files_stale": 0,
            "files_production_marked": 0,
            "files_not_marked": 0,
            "production_readiness_score": 0.0
        }
    }
    
    # Check reference files
    for filename, description in REFERENCE_FILES.items():
        file_path = ROOT / filename
        exists, age = check_file_exists_and_current(file_path)
        is_prod = is_production_marked(file_path)
        
        report["reference_files"][filename] = {
            "description": description,
            "exists": exists,
            "age_hours": age,
            "production_marked": is_prod,
            "status": "✓ Current" if exists else "✗ Missing"
        }
        
        report["summary"]["total_files_checked"] += 1
        if not exists:
            report["summary"]["files_missing"] += 1
        if exists and age > 24:
            report["summary"]["files_stale"] += 1
        if is_prod:
            report["summary"]["files_production_marked"] += 1
        else:
            report["summary"]["files_not_marked"] += 1
    
    # Check directory-specific documentation
    for dir_type, doc_files in DIRECTORY_DOCS.items():
        report["directory_docs"][dir_type] = {}
        for doc_file in doc_files:
            file_path = ROOT / doc_file
            exists, age = check_file_exists_and_current(file_path)
            is_prod = is_production_marked(file_path)
            
            report["directory_docs"][dir_type][doc_file] = {
                "exists": exists,
                "age_hours": age,
                "production_marked": is_prod,
                "status": "✓" if exists else "✗"
            }
            
            report["summary"]["total_files_checked"] += 1
            if not exists:
                report["summary"]["files_missing"] += 1
            if exists and age > 24:
                report["summary"]["files_stale"] += 1
            if is_prod:
                report["summary"]["files_production_marked"] += 1
            else:
                report["summary"]["files_not_marked"] += 1
    
    # Calculate production readiness score
    if report["summary"]["total_files_checked"] > 0:
        marked_and_current = report["summary"]["files_production_marked"] - report["summary"]["files_stale"]
        score = max(0, (marked_and_current / report["summary"]["total_files_checked"]) * 100)
        report["summary"]["production_readiness_score"] = round(score, 1)
    
    return report


def print_production_readiness_report(report: Dict) -> None:
    """Print human-readable production readiness report."""
    summary = report["summary"]
    score = summary["production_readiness_score"]
    
    print("\n=== PRODUCTION READINESS ENFORCEMENT REPORT ===\n")
    print(f"Generated: {report['generated']}")
    print(f"Production Readiness Score: {score}%\n")
    
    print("File Status Summary:")
    print(f"  Total Files Checked: {summary['total_files_checked']}")
    print(f"  Files Missing: {summary['files_missing']}")
    print(f"  Files Stale: {summary['files_stale']}")
    print(f"  Files Production-Marked: {summary['files_production_marked']}")
    print(f"  Files Not Marked: {summary['files_not_marked']}\n")
    
    # Show missing reference files
    missing = [f for f, data in report["reference_files"].items() if not data["exists"]]
    if missing:
        print(f"⚠ Missing Reference Files ({len(missing)}):")
        for f in missing:
            print(f"  - {f}")
        print()
    
    # Show directory documentation status
    print("Directory Documentation Status:")
    for dir_type, docs in report["directory_docs"].items():
        status = "✓" if all(d["exists"] for d in docs.values()) else "✗"
        print(f"  {status} {dir_type}: ", end="")
        print(", ".join([f"{f}" for f, d in docs.items()]))
    
    print(f"\n=== End of report ({score}% ready) ===\n")


def main() -> None:
    """Run production readiness validation."""
    VALIDATION_DIR.mkdir(exist_ok=True, parents=True)
    
    report = validate_all_documented_files()
    
    # Save report
    report_file = VALIDATION_DIR / "production_readiness_report.json"
    report_file.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"✓ Saved report to {report_file}")
    
    # Print report
    print_production_readiness_report(report)


if __name__ == "__main__":
    main()
