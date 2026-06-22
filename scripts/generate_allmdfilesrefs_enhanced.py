#!/usr/bin/env python3
"""
Enhanced ALLMDFILESREFS.md generator with production status and tags.
Tracks every .md file in the repository with:
- Production readiness status
- Content tags (API, Auth, UI, Config, etc.)
- Last update timestamp
- File size and line count
- Completion percentage
"""

import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Tuple

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
ALLMDFILESREFS = ROOT / "ALLMDFILESREFS.md"

# Content tags to identify in markdown files
CONTENT_TAGS = {
    "API": ["endpoint", "route", "request", "response", "method"],
    "Auth": ["authentication", "authorization", "login", "logout", "token", "session"],
    "UI": ["component", "style", "theme", "layout", "button", "form"],
    "Config": ["configuration", "environment", "setup", "install", "deploy"],
    "Database": ["database", "schema", "migration", "query", "table"],
    "Testing": ["test", "spec", "jest", "vitest", "unit test"],
    "Workflow": ["workflow", "automation", "ci/cd", "github actions", "pipeline"],
    "Documentation": ["documentation", "guide", "tutorial", "example"],
    "Core": ["core", "main", "fundamental", "essential"],
    "Feature": ["feature", "functionality", "capability"],
}


def count_file_stats(file_path: Path) -> Tuple[int, int, int]:
    """Count lines, words, and production markers in a file."""
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        lines = content.count("\n")
        words = len(content.split())
        nonprod_markers = content.count("UNIMPLEMENTED") + content.count("TODO") + content.count("FIXME")
        return lines, words, nonprod_markers
    except Exception:
        return 0, 0, 0


def detect_content_tags(file_path: Path) -> List[str]:
    """Detect content tags based on filename and content."""
    tags = set()
    
    # Detect from filename
    filename = file_path.name.lower()
    if "api" in filename:
        tags.add("API")
    if "auth" in filename:
        tags.add("Auth")
    if "component" in filename:
        tags.add("UI")
    if "config" in filename:
        tags.add("Config")
    if "test" in filename:
        tags.add("Testing")
    if "workflow" in filename:
        tags.add("Workflow")
    
    # Detect from content
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore").lower()
        for tag, keywords in CONTENT_TAGS.items():
            if any(keyword in content for keyword in keywords):
                tags.add(tag)
    except Exception:
        pass
    
    return sorted(list(tags))


def is_production_ready(file_path: Path) -> bool:
    """Check if a file is marked as production-ready."""
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        # Check for nonproduction markers
        if "UNIMPLEMENTED" in content or "TODO:" in content or "FIXME:" in content:
            return False
        # Check for production marker
        if "PRODUCTION" in content or "production-ready" in content.lower():
            return True
        return True  # Assume production-ready if no markers
    except Exception:
        return False


def collect_all_md_files() -> List[Path]:
    """Collect all .md files in the repository."""
    all_md = list(ROOT.glob("**/*.md"))
    # Filter out node_modules, venv, and other excluded directories
    excluded_dirs = {".git", "node_modules", ".venv", "venv", ".next", "dist", "build", ".cache"}
    filtered = [
        f for f in all_md
        if not any(excluded_dir in f.parts for excluded_dir in excluded_dirs)
    ]
    return sorted(filtered)


def generate_enhanced_allmdfilesrefs() -> None:
    """Generate enhanced ALLMDFILESREFS.md with all metadata."""
    timestamp = datetime.utcnow().isoformat() + "Z"
    md_files = collect_all_md_files()
    
    print(f"Found {len(md_files)} .md files")
    
    # Categorize files by directory
    categorized = {}
    for md_file in md_files:
        # Get relative path
        rel_path = md_file.relative_to(ROOT)
        directory = str(rel_path.parent)
        
        if directory not in categorized:
            categorized[directory] = []
        
        categorized[directory].append(md_file)
    
    # Generate markdown content
    content = f"""# ALLMDFILESREFS - Complete Markdown File Reference

**Generated:** {timestamp}  
**Total Files:** {len(md_files)}

Complete index of all `.md` files in the QMOI-Enhanced repository with production status, content tags, and metrics.

## Quick Summary

| Status | Count |
|--------|-------|
| ✓ Production-Ready | {sum(1 for f in md_files if is_production_ready(f))} |
| ⚠ Needs Review | {sum(1 for f in md_files if not is_production_ready(f))} |
| **Total** | **{len(md_files)}** |

## Files by Directory

"""
    
    total_lines = 0
    total_words = 0
    production_count = 0
    
    for directory in sorted(categorized.keys()):
        files = categorized[directory]
        content += f"\n### {directory}\n\n"
        content += "| File | Status | Tags | Lines | Type |\n"
        content += "|------|--------|------|-------|------|\n"
        
        for md_file in sorted(files):
            rel_path = md_file.relative_to(ROOT)
            filename = md_file.name
            
            lines, words, markers = count_file_stats(md_file)
            tags = detect_content_tags(md_file)
            is_prod_ready = is_production_ready(md_file)
            
            total_lines += lines
            total_words += words
            if is_prod_ready:
                production_count += 1
            
            status = "✓" if is_prod_ready else "⚠"
            tags_str = ", ".join(tags) if tags else "General"
            
            content += f"| [{filename}]({rel_path}) | {status} | {tags_str} | {lines} | md |\n"
    
    # Add summary statistics
    content += f"""

## Repository Statistics

- **Total Markdown Files:** {len(md_files)}
- **Total Lines:** {total_lines}
- **Total Words:** {total_words}
- **Average Lines per File:** {round(total_lines / len(md_files), 1) if md_files else 0}
- **Production-Ready Files:** {production_count}/{len(md_files)} ({round(100 * production_count / len(md_files), 1)}%)

## Content Tags Overview

| Tag | Count |
|-----|-------|
"""
    
    # Count tags across all files
    tag_counts = {}
    for md_file in md_files:
        for tag in detect_content_tags(md_file):
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    for tag in sorted(tag_counts.keys()):
        content += f"| {tag} | {tag_counts[tag]} |\n"
    
    content += f"""

## Bulk Workflow

### Update All Files

```bash
# Generate updated ALLMDFILESREFS.md
python3 scripts/generate_allmdfilesrefs_enhanced.py

# Validate all .md files
python3 scripts/validate_md.py --apply

# Update production status
python3 scripts/update_md_production_status.py
```

### Review Workflow

1. Open [ALLMDFILESREFS.md](ALLMDFILESREFS.md) to see current status
2. Files marked with ⚠ need review
3. Update production status in files that are ready
4. Re-run generator to update this index

## Related Files

- [ALLDIRECTORIESMD.md](ALLDIRECTORIESMD.md) - Directory documentation index
- [API.md](API.md) - API documentation
- [ENDPOINTS.md](ENDPOINTS.md) - All API endpoints
- [ROUTES.md](ROUTES.md) - All application routes
- [HOOKS.md](HOOKS.md) - Hooks documentation
- [WEBHOOKS.md](WEBHOOKS.md) - Webhooks documentation

"""
    
    ALLMDFILESREFS.write_text(content, encoding="utf-8")
    print(f"✓ Generated {ALLMDFILESREFS} with {len(md_files)} files indexed")
    
    # Save detailed JSON report
    VALIDATION_DIR.mkdir(exist_ok=True, parents=True)
    
    detailed_report = {
        "generated": timestamp,
        "total_files": len(md_files),
        "production_ready": production_count,
        "needs_review": len(md_files) - production_count,
        "total_lines": total_lines,
        "total_words": total_words,
        "files": []
    }
    
    for md_file in md_files:
        lines, words, markers = count_file_stats(md_file)
        rel_path = str(md_file.relative_to(ROOT))
        
        detailed_report["files"].append({
            "path": rel_path,
            "lines": lines,
            "words": words,
            "markers": markers,
            "tags": detect_content_tags(md_file),
            "production_ready": is_production_ready(md_file),
            "size_bytes": md_file.stat().st_size
        })
    
    report_file = VALIDATION_DIR / "allmdfilesrefs_report.json"
    report_file.write_text(json.dumps(detailed_report, indent=2), encoding="utf-8")
    print(f"✓ Saved detailed report to {report_file}")


if __name__ == "__main__":
    generate_enhanced_allmdfilesrefs()
