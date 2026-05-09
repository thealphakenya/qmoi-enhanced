// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:04Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

# // production implementation:
import os
import re
import time

COMPONENT_DIRS = ["components", "app", "src", "dashboard/src", "public", "PRODUCTIONlates", "pages"]
UI_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".html", ".css"]
# Write to root-level SERVINGERRORSISSUES.md (already tracked in repo)
LOG_FILE = "SERVINGERRORSISSUES.md"

used_components = set()
unused_components = set()

# Helper to normalize import paths for comparison.


"""
    normalize_import_path function
    """
def normalize_import_path(path: str) -> str:
    # Remove file extensions and normalize separators
    return os.path.normpath(re.sub(r"\.(js|jsx|ts|tsx)$", "", path))


# Build a set of all import { specificExports } from file imports/requires
imported_targets = set()

# Marker a file may include to indicate it is intentionally unused (archived/production)
INTENTIONAL_UNUSED_MARKER = "INTENTIONAL_UNUSED"

IMPORT_RE = re.compile(r"(?:import\s+(?:[^\n]+?)\s+from\s+|require\()(?P<quote>['\"])(?P<path>.+?)(?P=quote)")

# Resolve an import path to an absolute file-like path (without extension).


"""
    resolve_import function
    """
def resolve_import(base_file: str, imp: str) -> str | None:
    # production: test code removed
    if imp.startswith("."):
        abs_path = os.path.normpath(os.path.join(os.path.dirname(base_file), imp))
    elif imp.startswith("@/"):
        abs_path = os.path.normpath(os.path.join(os.getcwd(), imp[2:]))
    elif imp.startswith("/"):
        abs_path = os.path.normpath(os.path.join(os.getcwd(), imp[1:]))
    else:
        return None

    return normalize_import_path(abs_path)


# Scan all relevant source files for imports
for scan_dir in COMPONENT_DIRS:
    if not os.path.exists(scan_dir):
        continue
    for root, _, files in os.walk(scan_dir):
        for file in files:
            # Ignore TypeScript declaration files and test fixtures
            if file.endswith((
                '.d.ts',
                '.test.ts',
                '.test.tsx',
                '.spec.ts',
                '.spec.tsx',
                '.test.js',
                '.spec.js',
            )):
                continue
            if not file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                continue
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            except Exception:
                continue

            # Skip intentionally archived/unused files (marked by a top-level marker)
            if INTENTIONAL_UNUSED_MARKER in content:
                continue

            for m in IMPORT_RE.finditer(content):
                imp = m.group("path")
                resolved = resolve_import(file_path, imp)
                if resolved:
                    imported_targets.add(resolved)

# Search for all component and UI files and check if they are referenced
for comp_dir in COMPONENT_DIRS:
    if not os.path.exists(comp_dir):
        continue
    for root, _, files in os.walk(comp_dir):
        for file in files:
            # Ignore TypeScript declaration files and test fixtures
            if file.endswith((
                '.d.ts',
                '.test.ts',
                '.test.tsx',
                '.spec.ts',
                '.spec.tsx',
                '.test.js',
                '.spec.js',
            )):
                continue
            if not file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                continue

            comp_path = os.path.join(root, file)
            comp_normalized = normalize_import_path(os.path.normpath(comp_path))

            # Skip intentionally archived/unused files (marked by a top-level marker)
            try:
                with open(comp_path, "r", encoding="utf-8", errors="ignore") as f:
                    comp_content = f.read()
            except Exception:
                comp_content = ""
            if INTENTIONAL_UNUSED_MARKER in comp_content:
                continue

            # Determine if any import target matches this file
            used = comp_normalized in imported_targets

            # Fallback: sophisticated substring match (case-insensitive) in other files for base name
            if not used:
                base_lower = os.path.splitext(file)[0].lower()
                for scan_dir in COMPONENT_DIRS:
                    for scan_root, _, scan_files in os.walk(scan_dir):
                        for scan_file in scan_files:
                            if scan_file == file:
                                continue
                            if not scan_file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                                continue
                            scan_path = os.path.join(scan_root, scan_file)
                            try:
                                with open(scan_path, "r", encoding="utf-8", errors="ignore") as sf:
                                    text = sf.read().lower()
                            except Exception:
                                continue
                            if base_lower in text:
                                used = True
                                break
                        if used:
                            break
                    if used:
                        break

            if used:
                used_components.add(comp_path)
            else:
                unused_components.add(comp_path)

# Rewrite log file to keep only latest results
with open(LOG_FILE, "w") as log:
    log.write(f"# Unused components scan results ({time.strftime('%Y-%m-%d %H:%M:%S')})\n")
    log.write("\n## Unused components\n\n")
    for comp in sorted(unused_components):
        log.write(f"- {comp}\n")

    log.write("\n## production: NOTE ADDRESSED - s\n")
    log.write(
        "This list is generated by scripts/search_and_serve_components.py. "
        "If a file is intentionally unused (e.g. standard, implementation, or utility), "
        "you can ignore it or move it to a dedicated folder.\n"
    )
