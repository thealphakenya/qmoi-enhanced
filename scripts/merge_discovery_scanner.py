#!/usr/bin/env python3
"""
Merge Discovery Scanner
Identifies duplicate files, components, and entry points for consolidation.
Populates MERGE.md and resumefromhere.txt with detailed findings.
"""

import json
import re
import hashlib
from pathlib import Path
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Set, Tuple

ROOT = Path(__file__).resolve().parents[1]
MERGE_REPORT_DIR = ROOT / ".qmoi_validation" / "merge_reports"
MERGE_REPORT_DIR.mkdir(exist_ok=True, parents=True)


def get_file_hash(file_path: Path) -> str:
    """Get MD5 hash of file content."""
    try:
        with open(file_path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except Exception:
        return ""


def scan_duplicate_app_entry_points() -> Dict[str, List[Dict]]:
    """Find duplicate entry points for each app."""
    apps = ["qmoi-ai", "qmoi-space", "qcity", "qvillage", "qalpha"]
    duplicates = {}

    for app in apps:
        entries = []

        # Check app/ directory
        app_page = ROOT / "app" / app / "page.tsx"
        if app_page.exists():
            entries.append({
                "path": str(app_page.relative_to(ROOT)),
                "type": "Next.js Page",
                "priority": "PRIMARY",
                "hash": get_file_hash(app_page)
            })

        # Check styles subdirectory
        app_styles = ROOT / "app" / app / "styles" / "page.tsx"
        if app_styles.exists():
            entries.append({
                "path": str(app_styles.relative_to(ROOT)),
                "type": "Styles Page",
                "priority": "SECONDARY",
                "hash": get_file_hash(app_styles)
            })

        # Check src/app/ directory
        src_app_page = ROOT / "src" / "app" / app / "page.tsx"
        if src_app_page.exists():
            entries.append({
                "path": str(src_app_page.relative_to(ROOT)),
                "type": "Src App Page",
                "priority": "SECONDARY",
                "hash": get_file_hash(src_app_page)
            })

        # Check PWA directory
        pwa_dir = ROOT / "pwa_apps" / app
        if pwa_dir.exists():
            for pwa_file in pwa_dir.rglob("*"):
                if pwa_file.is_file():
                    entries.append({
                        "path": str(pwa_file.relative_to(ROOT)),
                        "type": "PWA",
                        "priority": "SECONDARY",
                        "hash": get_file_hash(pwa_file)
                    })

        # Check public/ directory
        for public_file in (ROOT / "public").glob(f"*{app}*"):
            if public_file.is_file():
                entries.append({
                    "path": str(public_file.relative_to(ROOT)),
                    "type": "Static HTML",
                    "priority": "FALLBACK",
                    "hash": get_file_hash(public_file)
                })

        if entries:
            duplicates[app] = entries

    return duplicates


def scan_duplicate_components() -> Dict[str, List[Tuple[str, str]]]:
    """Find duplicate component definitions."""
    component_pattern = re.compile(
        r"(?:export\s+default\s+)?(?:const|function)\s+(\w+Component|\w+)\s*(?::|=|{)",
        re.IGNORECASE
    )

    components_by_name = defaultdict(list)
    file_hashes = defaultdict(list)

    search_dirs = [ROOT / "app", ROOT / "src" / "app", ROOT / "lib", ROOT / "components"]

    for search_dir in search_dirs:
        if not search_dir.exists():
            continue

        for tsx_file in search_dir.rglob("*.tsx"):
            if "node_modules" in tsx_file.parts:
                continue

            try:
                content = tsx_file.read_text(encoding="utf-8", errors="ignore")
                file_hash = get_file_hash(tsx_file)

                # Track similar files
                if len(content) > 100:  # Only substantial files
                    file_hashes[file_hash].append(str(tsx_file.relative_to(ROOT)))

                # Find component names
                matches = component_pattern.findall(content)
                for match in matches:
                    component_name = match.strip()
                    if component_name and len(component_name) > 3:
                        components_by_name[component_name].append(str(tsx_file.relative_to(ROOT)))

            except Exception:
                continue

    # Filter to only actual duplicates
    duplicates = {
        name: paths for name, paths in components_by_name.items()
        if len(paths) > 1
    }

    return duplicates


def scan_duplicate_api_routes() -> Dict[str, List[Dict]]:
    """Find duplicate API endpoint implementations."""
    routes = defaultdict(list)
    api_pattern = re.compile(
        r"(?:export\s+(?:async\s+)?(?:const|function|let))\s+((?:GET|POST|PUT|DELETE|PATCH|get|post|put|delete|patch).*?)\s*(?:=|{)",
        re.MULTILINE
    )

    for route_file in (ROOT / "app" / "api").rglob("route.ts"):
        try:
            content = route_file.read_text(encoding="utf-8", errors="ignore")
            endpoint = str(route_file.parent.relative_to(ROOT / "app" / "api"))
            endpoint = f"/api/{endpoint}" if endpoint != "." else "/api"

            # Extract HTTP methods
            if "export const GET" in content or "export async function GET" in content:
                key = f"GET {endpoint}"
                routes[key].append(str(route_file.relative_to(ROOT)))

            if "export const POST" in content or "export async function POST" in content:
                key = f"POST {endpoint}"
                routes[key].append(str(route_file.relative_to(ROOT)))

            if "export const PUT" in content or "export async function PUT" in content:
                key = f"PUT {endpoint}"
                routes[key].append(str(route_file.relative_to(ROOT)))

            if "export const DELETE" in content or "export async function DELETE" in content:
                key = f"DELETE {endpoint}"
                routes[key].append(str(route_file.relative_to(ROOT)))

        except Exception:
            continue

    # Check src/app/api as well
    for route_file in (ROOT / "src" / "app" / "api").rglob("route.ts"):
        try:
            content = route_file.read_text(encoding="utf-8", errors="ignore")
            endpoint = str(route_file.parent.relative_to(ROOT / "src" / "app" / "api"))
            endpoint = f"/api/{endpoint}" if endpoint != "." else "/api"

            if "export const GET" in content:
                key = f"GET {endpoint}"
                routes[key].append(str(route_file.relative_to(ROOT)))

            if "export const POST" in content:
                key = f"POST {endpoint}"
                routes[key].append(str(route_file.relative_to(ROOT)))

            # Similar for PUT, DELETE, PATCH...

        except Exception:
            continue

    # Filter to only duplicates
    duplicates = {k: v for k, v in routes.items() if len(v) > 1}
    return duplicates


def scan_qcamera_references() -> Dict[str, List[str]]:
    """Find all QCamera references and implementations."""
    qcamera_patterns = [
        r"qcamera\b",
        r"QCamera",
        r"Camera(?:Hub|Manager|Service|Component)",
        r"app/api/cameras",
        r"qcamera\.md"
    ]

    references = defaultdict(list)

    for pattern in qcamera_patterns:
        for file_path in ROOT.rglob("*"):
            if file_path.is_dir() or "node_modules" in file_path.parts or ".git" in file_path.parts:
                continue

            try:
                if file_path.suffix in {".ts", ".tsx", ".js", ".jsx", ".md", ".json"}:
                    content = file_path.read_text(encoding="utf-8", errors="ignore")
                    if re.search(pattern, content, re.IGNORECASE):
                        references[pattern].append(str(file_path.relative_to(ROOT)))
            except Exception:
                continue

    return references


def generate_merge_report():
    """Generate comprehensive merge report."""
    timestamp = datetime.utcnow().isoformat() + "Z"

    report = {
        "timestamp": timestamp,
        "duplicate_app_entry_points": scan_duplicate_app_entry_points(),
        "duplicate_components": scan_duplicate_components(),
        "duplicate_api_routes": scan_duplicate_api_routes(),
        "qcamera_references": scan_qcamera_references(),
    }

    # Calculate statistics
    stats = {
        "app_duplicates": len(report["duplicate_app_entry_points"]),
        "component_duplicates": len(report["duplicate_components"]),
        "api_route_duplicates": len(report["duplicate_api_routes"]),
        "qcamera_references": sum(len(v) for v in report["qcamera_references"].values()),
    }

    report["statistics"] = stats

    # Save report
    report_file = MERGE_REPORT_DIR / f"merge_discovery_{timestamp.replace(':', '-')}.json"
    report_file.write_text(json.dumps(report, indent=2), encoding="utf-8")

    return report


def update_resume_tracker(report: Dict):
    """Update resumefromhere.txt with discovery results."""
    resume_file = ROOT / "resumefromhere.txt"

    # Build update content
    stats_update = f"""MERGE STATS:
- Duplicate app entry points identified: {report['statistics']['app_duplicates']}/5
- Duplicate components found: {report['statistics']['component_duplicates']}
- Duplicate API routes found: {report['statistics']['api_route_duplicates']}
- QCamera references found: {report['statistics']['qcamera_references']}
- Files consolidated: 0
- Files deleted: 0
- Space saved: 0 MB"""

    try:
        content = resume_file.read_text(encoding="utf-8")

        # Replace merge stats section
        old_stats_pattern = r"MERGE STATS:.*?- Space saved: 0 MB"
        content = re.sub(
            old_stats_pattern,
            stats_update,
            content,
            flags=re.DOTALL,
            count=1
        )

        resume_file.write_text(content, encoding="utf-8")
        print(f"✓ Updated resumefromhere.txt with merge discovery stats")

    except Exception as e:
        print(f"✗ Failed to update resumefromhere.txt: {e}")


def print_summary(report: Dict):
    """Print discovery summary."""
    print("\n" + "=" * 80)
    print("MERGE DISCOVERY REPORT")
    print("=" * 80)

    print(f"\n📊 STATISTICS:")
    for key, value in report["statistics"].items():
        print(f"   {key}: {value}")

    print(f"\n📁 DUPLICATE APP ENTRY POINTS:")
    for app, entries in report["duplicate_app_entry_points"].items():
        print(f"   {app}: {len(entries)} entry points")
        for entry in entries:
            print(f"      - {entry['path']} ({entry['type']})")

    print(f"\n🔧 DUPLICATE COMPONENTS (Top 10):")
    for i, (name, paths) in enumerate(list(report["duplicate_components"].items())[:10]):
        print(f"   {name}: {len(paths)} instances")
        for path in paths[:3]:
            print(f"      - {path}")
        if len(paths) > 3:
            print(f"      ... and {len(paths) - 3} more")

    print(f"\n🌐 DUPLICATE API ROUTES (Top 10):")
    for i, (route, files) in enumerate(list(report["duplicate_api_routes"].items())[:10]):
        print(f"   {route}: {len(files)} implementations")
        for file in files:
            print(f"      - {file}")

    print(f"\n📷 QCAMERA REFERENCES:")
    for pattern, files in report["qcamera_references"].items():
        print(f"   {pattern}: {len(files)} references")

    print("\n" + "=" * 80)
    print(f"✓ Report saved to {MERGE_REPORT_DIR}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    print("Starting merge discovery scan...")
    report = generate_merge_report()
    update_resume_tracker(report)
    print_summary(report)
