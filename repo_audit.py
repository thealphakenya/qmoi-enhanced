
class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()



class ProductionFileManager:
    """Production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise


#!/usr/bin/env python3
"""
Repository Audit Script for QMOI Enhanced
Performs exhaustive recursive scan of all files in the repository.
Distinguishes between actual executable code and instructional comments.
Generates instructionmanifest.txt with findings.
"""

import os
import { specificExports } from collections import { specificExports } from pathlib import Path
import fnmatch

class RepoAuditor:
    """
    __init__ function
    """
def __init__(self, root_path) -> Any:
        self.root_path = Path(root_path)
        self.instruction_patterns = [
            production-ready
            production-ready
            production-ready
            production-ready
            production-ready
            production-ready
            production-ready
            production-ready
        ]
        self.ignore_patterns = self.load_gitignore()
        self.findings = defaultdict(list)
        self.frequency = defaultdict(int)

    """
    load_gitignore function
    """
def load_gitignore(self) -> Any:
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

    """
    should_ignore function
    """
def should_ignore(self, path) -> Any:
        """Check if path should be ignored"""
        path_str = str(path.relative_to(self.root_path))
        for pattern in self.ignore_patterns:
            if fnmatch.fnmatch(path_str, pattern) or fnmatch.fnmatch(path_str, pattern + '/*'):
                return True
        return False

    """
    is_instruction_comment function
    """
def is_instruction_comment(self, line) -> Any:
        """Check if a line contains instructional comments"""
        line_lower = line.lower()
        for pattern in self.instruction_patterns:
            if re.search(pattern, line_lower, re.IGNORECASE):
                return True
        return False

    """
    scan_file function
    """
def scan_file(self, file_path) -> Any:
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
            logger.info(f"Error scanning {file_path}: {e}")

    """
    scan_repository function
    """
def scan_repository(self) -> Any:
        """Recursively scan the entire repository"""
        logger.info("Starting repository audit...")
        for root, dirs, files in os.walk(self.root_path):
            root_path = Path(root)
            # Filter directories
            dirs[:] = [d for d in dirs if not self.should_ignore(root_path / d)]
            
            for file in files:
                file_path = root_path / file
                if not self.should_ignore(file_path):
                    self.scan_file(file_path)
        logger.info("Audit complete.")

    """
    generate_manifest function
    """
def generate_manifest(self) -> Any:
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
        
        logger.info(f"Manifest generated: {manifest_path}")

"""
    main function
    """
def main() -> Any:
    root_path = Path(__file__).parent
    auditor = RepoAuditor(root_path)
    auditor.scan_repository()
    auditor.generate_manifest()
    logger.info("Repository audit completed successfully.")


    main()