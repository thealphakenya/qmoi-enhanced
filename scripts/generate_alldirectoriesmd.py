#!/usr/bin/env python3
"""
Generate ALLDIRECTORIESMD.md - a comprehensive index of all directory-specific .md files.
Creates/updates SRC.md, COMPONENTS.md, WORKFLOWS.md, HOOKS.md, TESTS.md, SCRIPTS.md, SERVICES.md, LIB.md, etc.
Tracks production status and ensures all directory documentation is complete and current.
"""

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
VALIDATION_DIR = ROOT / ".qmoi_validation"
ALLDIRECTORIESMD = ROOT / "ALLDIRECTORIESMD.md"

# Define directory mappings and their corresponding .md files
DIRECTORY_MAPPINGS = {
    "src": {
        "paths": ["src", "app/src"],
        "md_files": ["SRC.md"],
        "description": "Source code, core business logic, and application architecture",
        "status_file": ".qmoi_validation/src_status.json"
    },
    "components": {
        "paths": ["src/components", "components", "app/components"],
        "md_files": ["COMPONENTS.md"],
        "description": "Reusable UI components, component library, and component documentation",
        "status_file": ".qmoi_validation/components_status.json"
    },
    "workflows": {
        "paths": ["workflows", "src/workflows", ".github/workflows"],
        "md_files": ["WORKFLOWS.md"],
        "description": "Workflow definitions, automation, CI/CD pipelines, and orchestration",
        "status_file": ".qmoi_validation/workflows_status.json"
    },
    "hooks": {
        "paths": ["src/hooks", "hooks", "app/hooks"],
        "md_files": ["HOOKS.md", "WEBHOOKS.md", "ALLHOOKSWEBHOOKS.md"],
        "description": "React hooks, webhooks, event handlers, and lifecycle management",
        "status_file": ".qmoi_validation/hooks_status.json"
    },
    "tests": {
        "paths": ["tests", "test", "__tests__", "src/tests", "app/tests"],
        "md_files": ["TESTS.md", "ALLTESTSAUTOTESTS.md"],
        "description": "Test suites, test utilities, integration tests, and testing documentation",
        "status_file": ".qmoi_validation/tests_status.json"
    },
    "scripts": {
        "paths": ["scripts", "bin"],
        "md_files": ["SCRIPTS.md"],
        "description": "Utility scripts, CLI tools, build scripts, and automation utilities",
        "status_file": ".qmoi_validation/scripts_status.json"
    },
    "services": {
        "paths": ["src/services", "services", "app/services"],
        "md_files": ["SERVICES.md"],
        "description": "Backend services, microservices, API services, and business logic services",
        "status_file": ".qmoi_validation/services_status.json"
    },
    "lib": {
        "paths": ["src/lib", "lib", "app/lib"],
        "md_files": ["LIB.md"],
        "description": "Utility libraries, helper functions, and reusable library code",
        "status_file": ".qmoi_validation/lib_status.json"
    },
    "config": {
        "paths": ["config", "src/config", ".config"],
        "md_files": ["CONFIG.md"],
        "description": "Configuration files, environment setup, and deployment configuration",
        "status_file": ".qmoi_validation/config_status.json"
    },
    "database": {
        "paths": ["database", "db", "src/db"],
        "md_files": ["DATABASE.md", "DATABASE_SCHEMA.md"],
        "description": "Database schemas, migrations, queries, and database documentation",
        "status_file": ".qmoi_validation/database_status.json"
    },
    "api": {
        "paths": ["api", "src/api", "app/api"],
        "md_files": ["API.md", "APIs_1.md", "APIs_v1.md", "ENDPOINTS.md", "ROUTES.md"],
        "description": "API definitions, endpoints, routes, and API documentation",
        "status_file": ".qmoi_validation/api_status.json"
    },
    "ui": {
        "paths": ["ui", "src/ui", "app/ui"],
        "md_files": ["UI.md", "QMOIAIUI.md", "QMOISPACEUI.md", "QCITYUI.md", "QVILLAGEUI.md", "QALPHAUI.md"],
        "description": "UI components, styling, theming, and user interface documentation",
        "status_file": ".qmoi_validation/ui_status.json"
    },
    "docs": {
        "paths": ["docs", "documentation"],
        "md_files": ["DOCS.md"],
        "description": "Project documentation, guides, and reference materials",
        "status_file": ".qmoi_validation/docs_status.json"
    },
    "mobile": {
        "paths": ["mobile", "app/mobile"],
        "md_files": ["MOBILE.md"],
        "description": "Mobile application code, React Native, and mobile-specific documentation",
        "status_file": ".qmoi_validation/mobile_status.json"
    }
}


def find_md_files_in_directory(dir_path: Path) -> List[Path]:
    """Find all .md files in a directory."""
    if not dir_path.exists():
        return []
    return list(dir_path.glob("**/*.md"))


def count_directory_files(dir_path: Path) -> Tuple[int, int]:
    """Count total and .md files in a directory."""
    if not dir_path.exists():
        return 0, 0
    
    try:
        all_files = list(dir_path.rglob("*"))
        md_files = list(dir_path.rglob("*.md"))
        return len(all_files), len(md_files)
    except Exception:
        return 0, 0


def get_directory_status(dir_name: str, mapping: Dict) -> Dict:
    """Get status for a directory and its .md files."""
    status = {
        "directory": dir_name,
        "md_files": mapping["md_files"],
        "file_counts": {},
        "existing_md_files": [],
        "missing_md_files": [],
        "production_ready": False,
        "last_updated": datetime.utcnow().isoformat() + "Z"
    }
    
    for path_str in mapping["paths"]:
        dir_path = ROOT / path_str
        if dir_path.exists():
            total_files, md_count = count_directory_files(dir_path)
            status["file_counts"][path_str] = {"total": total_files, "md_files": md_count}
    
    for md_file in mapping["md_files"]:
        md_path = ROOT / md_file
        if md_path.exists():
            status["existing_md_files"].append(md_file)
        else:
            status["missing_md_files"].append(md_file)
    
    status["production_ready"] = len(status["missing_md_files"]) == 0
    
    return status


def generate_directory_sections() -> str:
    """Generate markdown sections for each directory."""
    sections = []
    
    for dir_name, mapping in DIRECTORY_MAPPINGS.items():
        status = get_directory_status(dir_name, mapping)
        
        section = f"\n## {dir_name.upper()}\n\n"
        section += f"**Description:** {mapping['description']}\n\n"
        section += "**Paths:**\n"
        for path in mapping["paths"]:
            dir_path = ROOT / path
            exists_str = "✓" if dir_path.exists() else "✗"
            section += f"- {exists_str} `{path}`\n"
        
        section += "\n**Documentation Files:**\n"
        for md_file in mapping["md_files"]:
            md_path = ROOT / md_file
            if md_path.exists():
                size_kb = round(md_path.stat().st_size / 1024, 2)
                section += f"- ✓ [{md_file}]({md_file}) ({size_kb} KB)\n"
            else:
                section += f"- ✗ {md_file} (missing - generate with bulk workflow)\n"
        
        section += "\n**Status:**\n"
        section += f"- Production Ready: {'Yes ✓' if status['production_ready'] else 'No ✗'}\n"
        section += f"- Existing .md files: {len(status['existing_md_files'])}/{len(mapping['md_files'])}\n"
        if status["file_counts"]:
            section += "- File Counts:\n"
            for path, counts in status["file_counts"].items():
                section += f"  - `{path}`: {counts['total']} files ({counts['md_files']} .md)\n"
        
        sections.append(section)
    
    return "".join(sections)


def generate_alldirectoriesmd() -> None:
    """Generate the ALLDIRECTORIESMD.md file."""
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    content = f"""# ALLDIRECTORIESMD - Directory Documentation Index

**Generated:** {timestamp}

This file indexes all directory-specific documentation and tracks the production readiness of each directory's .md files.

## Overview

Each directory in the repository has associated `.md` files that document its purpose, structure, and production status. This index ensures:
- All directories have comprehensive documentation
- Documentation is kept current as work progresses
- Production readiness is tracked per directory
- Missing documentation is easily identified

## Directory Documentation Status

"""
    
    content += generate_directory_sections()
    
    content += "\n\n## Bulk Workflow Tasks\n\n"
    content += """When working in bulk:\n
1. **Generate Missing .md Files**: Run directory-specific generators to create missing documentation
2. **Update Existing .md Files**: Ensure each directory .md is current with the latest code changes
3. **Validate Production Status**: Confirm each directory is production-ready before marking as complete
4. **Track Status**: Update this index after changes to reflect current directory status
5. **Consolidate Changes**: Merge all directory updates into the main ALLMDFILESREFS.md

## Directory-Specific Generators

These scripts generate and update directory .md files:

- `scripts/generate_src_md.py` - Generate SRC.md
- `scripts/generate_components_md.py` - Generate COMPONENTS.md
- `scripts/generate_workflows_md.py` - Generate WORKFLOWS.md
- `scripts/generate_hooks_md.py` - Generate HOOKS.md and WEBHOOKS.md
- `scripts/generate_tests_md.py` - Generate TESTS.md
- `scripts/generate_scripts_md.py` - Generate SCRIPTS.md
- `scripts/generate_services_md.py` - Generate SERVICES.md
- `scripts/generate_lib_md.py` - Generate LIB.md
- `scripts/generate_api_md.py` - Consolidate API.md, APIs_1.md, ENDPOINTS.md, ROUTES.md
- `scripts/generate_ui_md.py` - Generate UI.md and app-specific UI files

## Related Files

- [ALLMDFILESREFS.md](ALLMDFILESREFS.md) - Master index of all .md files with production status
- [API.md](API.md) - Consolidated API documentation
- [ENDPOINTS.md](ENDPOINTS.md) - All API endpoints
- [ROUTES.md](ROUTES.md) - All application routes
- [HOOKS.md](HOOKS.md) - Hooks documentation
- [WEBHOOKS.md](WEBHOOKS.md) - Webhooks documentation

"""
    
    ALLDIRECTORIESMD.write_text(content, encoding="utf-8")
    print(f"✓ Generated {ALLDIRECTORIESMD}")
    
    # Also save JSON status report
    status_report = {
        "generated": timestamp,
        "total_directories": len(DIRECTORY_MAPPINGS),
        "directories": {}
    }
    
    for dir_name, mapping in DIRECTORY_MAPPINGS.items():
        status_report["directories"][dir_name] = get_directory_status(dir_name, mapping)
    
    VALIDATION_DIR.mkdir(exist_ok=True, parents=True)
    status_file = VALIDATION_DIR / "alldirectories_status.json"
    status_file.write_text(json.dumps(status_report, indent=2), encoding="utf-8")
    print(f"✓ Saved status report to {status_file}")


if __name__ == "__main__":
    generate_alldirectoriesmd()
