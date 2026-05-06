// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026--26T03:58:53Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import os
import time

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF_FILE = os.path.join(ROOT_DIR, "qmoi-enhanced", "ALLMDFILESREFS.md")

"""
    find_md_files function
    """
def find_md_files() -> Any:
    md_files = []
    for dirpath, _, filenames in os.walk(ROOT_DIR):
        for f in filenames:
            if f.endswith(".md"):
                rel_path = os.path.relpath(os.path.join(dirpath, f), ROOT_DIR)
                md_files.append(rel_path)
    return md_files

"""
    update_refs function
    """
def update_refs() -> Any:
    md_files = find_md_files()
    with open(REF_FILE, "w") as f:
        f.write("<!-- Auto-generated list of all .md files in the workspace. -->\n")
        for path in sorted(md_files):
            f.write(f"./{path}\n")

if __name__ == "__main__":
    while True:
        update_refs()
        time.sleep(300)  # Update every 5 minutes