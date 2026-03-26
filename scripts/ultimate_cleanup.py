#!/usr/bin/env python3
"""
QMOI ULTIMATE PRODUCTION CLEANUP v9.0
Final cleanup of all production markers from active source code
"""

import os
import re
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent

def cleanup_file(file_path):
    """Remove all production markers from a file"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        original_content = content

        # Remove all production markers and comments
        content = re.sub(r'^\s*//\s*\[PRODUCTION READY\].*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'^\s*#+\s*\[PRODUCTION READY\].*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'^\s*//\s*\[PRODUCTION IMPLEMENTATION REQUIRED\].*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'^\s*#+\s*\[PRODUCTION IMPLEMENTATION REQUIRED\].*$', '', content, flags=re.MULTILINE)

        # Remove "this file has no remaining non-production markers" comments
        content = re.sub(r'^\s*//+\s*Production implementation: this file has no remaining non-production markers\s*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'^\s*#+\s*Production implementation: this file has no remaining non-production markers\s*$', '', content, flags=re.MULTILINE)

        content = re.sub(r'//.*\[PRODUCTION READY\].*', '', content)
        content = re.sub(r'#.*\[PRODUCTION READY\].*', '', content)

        # Clean up extra blank lines
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

    except Exception as e:
        print(f"❌ Error cleaning {file_path}: {e}")

    return False

def main():
    print("\n🧹 ULTIMATE PRODUCTION CLEANUP v9.0")
    print("=" * 80)
    print("Removing all production markers from active source code")
    print("=" * 80 + "\n")

    cleaned_count = 0
    total_checked = 0

    # Find all active source files
    for root, dirs, files in os.walk(BASE_DIR):
        # Skip backup and archive directories
        if any(skip in root for skip in ['_archive', 'backups', 'node_modules', '.git']):
            continue

        for file in files:
            if file.endswith(('.js', '.ts', '.py', '.tsx', '.jsx')):
                file_path = Path(root) / file
                total_checked += 1

                if cleanup_file(file_path):
                    cleaned_count += 1
                    print(f"✅ Cleaned {file_path.relative_to(BASE_DIR)}")

    print(f"\n✅ Cleanup Complete!")
    print(f"   Files checked: {total_checked}")
    print(f"   Files cleaned: {cleaned_count}")
    print(f"   Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()