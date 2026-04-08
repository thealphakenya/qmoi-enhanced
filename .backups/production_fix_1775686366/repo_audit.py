#!/usr/bin/env python3
"""
Repository Audit Script for QMOI Enhanced
Performs exhaustive recursive scan of all files in the repository.
Distinguishes between actual executable code and instructional comments.
Generates instructionmanifest.txt with findings.
"""

import os
import re
from collections import defaultdict
from pathlib import Path
import fnmatch

class RepoAuditor:
    def __init__(self, root_path):
        self.root_path = Path(root_path)
        self.instruction_patterns = [
            r'#\s*(DONE|FIXED|NOTE|INSTRUCTION|IMPLEMENT|value|real)',
            r'//\s*(DONE|FIXED|NOTE|INSTRUCTION|IMPLEMENT|value|real)',
            r'/\*\s*(DONE|FIXED|NOTE|INSTRUCTION|IMPLEMENT|value|real)',
            r'<!--\s*(DONE|FIXED|NOTE|INSTRUCTION|IMPLEMENT|value|real)',
            r'#\s*(implement|value|real|implementation)',
            r'//\s*(implement|value|real|implementation)',
            r'/\*\s*(implement|value|real|implementation)',
            r'<!--\s*(implement|value|real|implementation)',
        ]
        self.ignore_patterns = self.load_gitignore()
        self.findings = defaultdict(list)
        self.frequency = defaultdict(int)

    def load_gitignore(self):
        """Load .gitignore patterns"""
        gitignore_path = self.root_path / '.gitignore'
        patterns = []
        if gitignore_path.exists():
            with open(gitignore_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        patterns.append(line)
        # Add common ignore patterns
        patterns.extend([
            '.git/',
            'node_modules/',
            '__pycache__/',
            '*.pyc',
            '.DS_Store',
            'build/',
            'dist/',
            '*.log',
            '.env*',
            'coverage/',
            '.pytest_cache/',
            '.vscode/',
            '.idea/',
        ])
        return patterns

    def should_ignore(self, path):
        """Check if path should be ignored"""
        path_str = str(path.relative_to(self.root_path))
        for pattern in self.ignore_patterns:
            if fnmatch.fnmatch(path_str, pattern) or fnmatch.fnmatch(path_str, pattern + '/*'):
                return True
        return False

    def is_instruction_comment(self, line):
        """Check if a line contains instructional comments"""
        line_lower = line.lower()
        for pattern in self.instruction_patterns:
            if re.search(pattern, line_lower, re.IGNORECASE):
                return True
        return False

    def scan_file(self, file_path):
        """Scan a single file for instructions"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                for line_num, line in enumerate(lines, 1):
                    if self.is_instruction_comment(line.strip()):
                        content = line.strip()
                        self.findings[str(file_path.relative_to(self.root_path))].append({
                            'line': line_num,
                            'content': content
                        })
                        self.frequency[content] += 1
        except Exception as e:
            print(f"Error scanning {file_path}: {e}")

    def scan_repository(self):
        """Recursively scan the entire repository"""
        print("Starting repository audit...")
        for root, dirs, files in os.walk(self.root_path):
            root_path = Path(root)
            # Filter directories
            dirs[:] = [d for d in dirs if not self.should_ignore(root_path / d)]
            
            for file in files:
                file_path = root_path / file
                if not self.should_ignore(file_path):
                    self.scan_file(file_path)
        print("Audit complete.")

    def generate_manifest(self):
        """Generate instructionmanifest.txt"""
        manifest_path = self.root_path / 'instructionmanifest.txt'
        with open(manifest_path, 'w', encoding='utf-8') as f:
            f.write("QMOI Enhanced Repository Instruction Manifest\n")
            f.write("=" * 50 + "\n\n")
            f.write("Generated on: 2026-03-28\n\n")
            
            f.write("SUMMARY:\n")
            f.write(f"Total instruction occurrences: {sum(self.frequency.values())}\n")
            f.write(f"Files with instructions: {len(self.findings)}\n\n")
            
            f.write("FREQUENCY ANALYSIS:\n")
            sorted_freq = sorted(self.frequency.items(), key=lambda x: x[1], reverse=True)
            for instruction, count in sorted_freq[:50]:  # Top 50
                f.write(f"{count:4d} | {instruction}\n")
            f.write("\n")
            
            f.write("DETAILED FINDINGS:\n")
            f.write("-" * 50 + "\n\n")
            
            for file_path, instructions in sorted(self.findings.items()):
                f.write(f"File: {file_path}\n")
                for instr in instructions:
                    f.write(f"  Line {instr['line']:4d}: {instr['content']}\n")
                f.write("\n")
        
        print(f"Manifest generated: {manifest_path}")

def main():
    root_path = Path(__file__).parent
    auditor = RepoAuditor(root_path)
    auditor.scan_repository()
    auditor.generate_manifest()
    print("Repository audit completed successfully.")

if __name__ == "__main__":
    main()