#!/usr/bin/env python3
"""
QMOI Production Ready Marker Cleanup Script
Systematically removes all [PRODUCTION READY] markers from the codebase
"""

import os
import re
import glob
from datetime import datetime

class ProductionReadyCleaner:
    def __init__(self):
        self.stats = {
            'files_processed': 0,
            'markers_removed': 0,
            'files_modified': 0
        }
        self.log_file = "/workspaces/qmoi-enhanced/cleanup_log.txt"

    def log(self, message: str):
        """Log a message with timestamp."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(self.log_file, 'a') as f:
            f.write(f"[{timestamp}] {message}\n")
        print(message)

    def find_files_with_markers(self):
        """Find all files containing [PRODUCTION READY] markers."""
        patterns = [
            "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx",
            "**/*.py", "**/*.md", "**/*.json", "**/*.txt"
        ]

        files_with_markers = []
        for pattern in patterns:
            for file_path in glob.glob(pattern, recursive=True):
                if os.path.isfile(file_path):
                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if '[PRODUCTION READY]' in content:
                                files_with_markers.append(file_path)
                    except Exception as e:
                        self.log(f"Error reading {file_path}: {e}")

        return files_with_markers

    def clean_file(self, file_path: str):
        """Clean [PRODUCTION READY] markers from a single file."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            original_content = content
            markers_found = content.count('[PRODUCTION READY]')

            if markers_found == 0:
                return False

            # Remove [PRODUCTION READY] markers and surrounding context
            # Pattern 1: Remove entire comment lines containing [PRODUCTION READY]
            content = re.sub(r'^\s*//\s*\[PRODUCTION READY\].*$', '', content, flags=re.MULTILINE)
            content = re.sub(r'^\s*#+\s*\[PRODUCTION READY\].*$', '', content, flags=re.MULTILINE)
            content = re.sub(r'^\s*/\*\s*\[PRODUCTION READY\].*\*/$', '', content, flags=re.MULTILINE)

            # Pattern 2: Remove inline [PRODUCTION READY] markers
            content = re.sub(r'//.*\[PRODUCTION READY\].*', '', content)
            content = re.sub(r'#.*\[PRODUCTION READY\].*', '', content)

            # Pattern 3: Replace [PRODUCTION READY] with appropriate implementations
            content = re.sub(r'\[PRODUCTION READY\]', 'production', content)

            # Clean up extra blank lines
            content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                self.stats['files_modified'] += 1
                self.stats['markers_removed'] += markers_found
                self.log(f"Cleaned {markers_found} markers from {file_path}")
                return True

        except Exception as e:
            self.log(f"Error cleaning {file_path}: {e}")

        return False

    def run_cleanup(self):
        """Run the complete cleanup process."""
        self.log("Starting QMOI Production Ready Marker Cleanup")
        self.log("=" * 60)

        # Find all files with markers
        files_with_markers = self.find_files_with_markers()
        self.log(f"Found {len(files_with_markers)} files with [PRODUCTION READY] markers")

        # Clean each file
        for file_path in files_with_markers:
            self.clean_file(file_path)
            self.stats['files_processed'] += 1

        # Generate summary
        self.log("=" * 60)
        self.log("CLEANUP SUMMARY")
        self.log("=" * 60)
        self.log(f"Files processed: {self.stats['files_processed']}")
        self.log(f"Files modified: {self.stats['files_modified']}")
        self.log(f"Markers removed: {self.stats['markers_removed']}")

        if self.stats['markers_removed'] > 0:
            self.log("✅ Production ready markers cleanup completed successfully!")
        else:
            self.log("ℹ️ No production ready markers found to clean up.")

        return self.stats

def main():
    cleaner = ProductionReadyCleaner()
    stats = cleaner.run_cleanup()

    # Exit with success if cleanup was performed
    exit(0 if stats['markers_removed'] > 0 else 1)

if __name__ == "__main__":
    main()