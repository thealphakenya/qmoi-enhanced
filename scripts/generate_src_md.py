#!/usr/bin/env python3
"""
Generate SRC.md - documentation for the src directory.
Lists all source files, their purposes, and production status.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
SRC_MD = ROOT / "SRC.md"

# Common source directory patterns
SRC_DIRS = [
    ROOT / "src",
    ROOT / "app" / "src",
]


def get_python_files(directory: Path) -> List[Path]:
    """Get all Python files in a directory."""
    if not directory.exists():
        return []
    return sorted(directory.glob("**/*.py"))


def get_typescript_files(directory: Path) -> List[Path]:
    """Get all TypeScript files in a directory."""
    if not directory.exists():
        return []
    return sorted(directory.glob("**/*.{ts,tsx}"))


def get_javascript_files(directory: Path) -> List[Path]:
    """Get all JavaScript files in a directory."""
    if not directory.exists():
        return []
    return sorted(directory.glob("**/*.{js,jsx}"))


def categorize_files(directory: Path) -> Dict[str, List[Path]]:
    """Categorize source files by type."""
    categories = {
        "TypeScript": get_typescript_files(directory),
        "JavaScript": get_javascript_files(directory),
        "Python": get_python_files(directory),
    }
    return {k: v for k, v in categories.items() if v}


def count_files_recursively(directory: Path) -> Dict[str, int]:
    """Count files by extension in directory."""
    if not directory.exists():
        return {}
    
    counts = {}
    try:
        for file_path in directory.rglob("*"):
            if file_path.is_file():
                ext = file_path.suffix or "no-extension"
                counts[ext] = counts.get(ext, 0) + 1
    except Exception:
        pass
    
    return dict(sorted(counts.items(), key=lambda x: -x[1]))


def generate_src_md() -> None:
    """Generate SRC.md documentation."""
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    # Find src directory
    src_dir = None
    for candidate in SRC_DIRS:
        if candidate.exists():
            src_dir = candidate
            break
    
    if not src_dir:
        print("✗ No src directory found")
        return
    
    # Gather source file information
    file_categories = categorize_files(src_dir)
    file_counts = count_files_recursively(src_dir)
    
    total_files = sum(file_counts.values())
    
    # Generate markdown content
    content = f"""# SRC - Source Code Documentation

**Last Generated:** {timestamp}

Documentation for the `src/` directory containing core application source code and business logic.

## Overview

The `src/` directory contains the main application source code organized by functionality and layer.

**Total Files:** {total_files}

## File Statistics

"""
    
    content += "| Extension | Count |\n"
    content += "|-----------|-------|\n"
    for ext, count in file_counts.items():
        content += f"| {ext or '(none)'} | {count} |\n"
    
    content += "\n## Source Files by Type\n\n"
    
    # List files by category
    for category, files in sorted(file_categories.items()):
        if not files:
            continue
        
        content += f"### {category} Files ({len(files)})\n\n"
        
        for file_path in files[:50]:  # Limit to prevent huge files
            try:
                rel_path = file_path.relative_to(ROOT)
                size_kb = round(file_path.stat().st_size / 1024, 2)
                content += f"- [`{file_path.name}`]({rel_path}) ({size_kb} KB)\n"
            except Exception:
                continue
        
        if len(files) > 50:
            content += f"\n... and {len(files) - 50} more {category.lower()} files\n\n"
    
    content += f"""

## Directory Structure

```
src/
"""
    
    # Add a simplified tree view
    try:
        for item in sorted(src_dir.iterdir())[:10]:
            if item.is_dir() and not item.name.startswith("."):
                content += f"├── {item.name}/\n"
    except Exception:
        pass
    
    content += """```

## Production Status

- **Source Code Review:** _To be completed during bulk production updates_
- **Test Coverage:** _To be analyzed_
- **Documentation Completeness:** _Ongoing_
- **Production Ready:** No (requires review)

## Related Documentation

- [ALLDIRECTORIESMD.md](ALLDIRECTORIESMD.md) - Directory index
- [ALLMDFILESREFS.md](ALLMDFILESREFS.md) - All markdown file references
- [TREE.md](TREE.md) - Full directory tree

"""
    
    SRC_MD.write_text(content, encoding="utf-8")
    print(f"✓ Generated {SRC_MD}")
    
    # Save JSON report
    VALIDATION_DIR.mkdir(exist_ok=True, parents=True)
    report = {
        "generated": timestamp,
        "directory": str(src_dir.relative_to(ROOT)),
        "total_files": total_files,
        "file_categories": {k: len(v) for k, v in file_categories.items()},
        "file_extensions": file_counts,
        "status": "complete"
    }
    
    report_file = VALIDATION_DIR / "src_documentation.json"
    report_file.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"✓ Saved report to {report_file}")


if __name__ == "__main__":
    generate_src_md()
