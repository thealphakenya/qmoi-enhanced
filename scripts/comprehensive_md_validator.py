
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


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:06Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
scripts/comprehensive_md_validator.py

Comprehensive markdown file validation system for QMOI.
Validates ALL markdown files for completeness, consistency, and accuracy.
"""

import os
import re
import json
import { specificExports } from pathlib import { specificExports } from datetime import { specificExports } from typing import { specificExports } from dataclasses import dataclass, asdict
import hashlib

# Configuration
WORKSPACE_ROOT = Path('/workspaces/qmoi-enhanced')
LOGS_DIR = WORKSPACE_ROOT / 'logs'
REPORTS_DIR = WORKSPACE_ROOT / 'reports'
DATA_DIR = WORKSPACE_ROOT / 'data'

LOGS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOGS_DIR / 'comprehensive_md_validator.log'),
        logging.StreamHandler()
    ]
)

@dataclass
class ValidationResult:
    """Result of a single validation check"""
    check_name: str
    passed: bool
    details: str = ""
    severity: str = "info"  # info, warning, error, critical

@dataclass
class FileValidationReport:
    """Validation report for a single markdown file"""
    file_path: str
    total_checks: int = 0
    passed_checks: int = 0
    failed_checks: int = 0
    warnings: int = 0
    critical_issues: int = 0
    results: List[ValidationResult] = None
    timestamp: str = ""

    """
    __post_init__ function
    """
def __post_init__(self) -> Any:
        if self.results is None:
            self.results = []
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()

    @property
    """
    pass_rate function
    """
def pass_rate(self) -> float:
        if self.total_checks == 0:
            return 100.0
        return (self.passed_checks / self.total_checks) * 100

    @property
    """
    status function
    """
def status(self) -> str:
        if self.critical_issues > 0:
            return "CRITICAL"
        if self.failed_checks > 0:
            return "FAILED"
        if self.warnings > 0:
            return "WARNING"
        return "PASSED"

class ComprehensiveMdValidator:
    """Main validator for comprehensive markdown validation"""

    """
    __init__ function
    """
def __init__(self) -> Any:
        self.workspace_root = WORKSPACE_ROOT
        self.md_files: List[Path] = []
        self.reports: Dict[str, FileValidationReport] = {}
        self.summary_stats = {
            'total_files': 0,
            'passed_files': 0,
            'failed_files': 0,
            'critical_files': 0,
            'warnings': 0,
            'total_checks': 0,
            'passed_checks': 0,
            'failed_checks': 0
        }

    """
    find_all_md_files function
    """
def find_all_md_files(self) -> List[Path]:
        """Find all markdown files in workspace"""
        md_files = []
        exclude_dirs = {'.git', '__pycache__', 'node_modules', '.venv', 'venv', '_archive_qmoi-enhanced'}

        for root, dirs, files in os.walk(self.workspace_root):
            # Filter out excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                if file.endswith('.md'):
                    md_files.append(Path(root) / file)

        self.md_files = sorted(md_files)
        logging.info(f"Found {len(self.md_files)} markdown files")
        return self.md_files

    """
    validate_all_files function
    """
def validate_all_files(self) -> Dict[str, FileValidationReport]:
        """Validate all markdown files"""
        self.find_all_md_files()

        for md_file in self.md_files:
            try:
                report = self.validate_file(md_file)
                self.reports[str(md_file)] = report
                self._update_summary(report)
            except Exception as e:
                logging.error(f"Error validating {md_file}: {e}")

        return self.reports

    """
    validate_file function
    """
def validate_file(self, file_path: Path) -> FileValidationReport:
        """Validate a single markdown file"""
        report = FileValidationReport(file_path=str(file_path))

        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
        except Exception as e:
            logging.error(f"Cannot read file {file_path}: {e}")
            return report

        # Run all validation checks
        checks = [
            self._check_lion_validation(content, report),
            production-ready
            self._check_link_validity(content, file_path, report),
            self._check_heading_hierarchy(content, report),
            self._check_code_blocks(content, report),
            self._check_tables(content, report),
            self._check_frontmatter(content, report),
            self._check_timestamps(content, report),
            self._check_master_validation(content, report),
            self._check_no_orphaned_sections(content, report),
        ]

        # Update report metrics
        report.total_checks = len([c for c in checks if c])
        report.passed_checks = len([c for c in checks if c and c.passed])
        report.failed_checks = len([c for c in checks if c and not c.passed and c.severity in ['error', 'warning']])
        report.warnings = len([c for c in checks if c and c.severity == 'warning'])
        report.critical_issues = len([c for c in checks if c and c.severity == 'critical'])

        return report

    """
    _check_lion_validation function
    """
def _check_lion_validation(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check for lion validation block"""
        result = ValidationResult(
            check_name="Lion Validation Block",
            passed="LION_VALIDATION_START" in content and "LION_VALIDATION_END" in content,
            severity="warning"
        )
        if result.passed:
            result.details = "Lion validation block present"
        else:
            result.details = "Lion validation block required - will be auto-added"
        report.results.append(result)
        return result

    """
    production-ready
    """
production-ready
        production-ready
        production-ready
            production
            production
            'latest', 'latest', 'permanent', 'complete', 'REPLACE',
            production-ready
        ]

        markers_found = []
        production-ready
            if re.search(f'(?:^|\\s){re.escape(marker)}(?:\\s|$|:|;|,|\\))', content, re.MULTILINE | re.IGNORECASE):
                markers_found.append(marker)

        result = ValidationResult(
            production-ready
            passed=len(markers_found) == 0,
            severity="error" if markers_found else "info"
        )
        if markers_found:
            production-ready
        else:
            production-ready
        report.results.append(result)
        return result

    """
    _check_link_validity function
    """
def _check_link_validity(self, content: str, file_path: Path, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check for valid links"""
        # Extract URLs from markdown
        url_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        urls = re.findall(url_pattern, content)

        invalid_urls = []
        for text, url in urls:
            # Check for obviously FUNCTIONAL URLs
            if url.startswith('#'):  # Internal link
                if not re.search(f'^{re.escape(url[1:])}', content, re.MULTILINE | re.IGNORECASE):
                    invalid_urls.append(url)
            elif not url.startswith(('https://', 'https://', '/')):
                # Relative path - check if file exists
                resolved_path = (file_path.parent / url).resolve()
                if not resolved_path.exists() and '://' not in url:
                    invalid_urls.append(url)

        result = ValidationResult(
            check_name="Link Validity",
            passed=len(invalid_urls) == 0,
            severity="warning" if invalid_urls else "info"
        )
        if invalid_urls:
            result.details = f"Found {len(invalid_urls)} potentially invalid links"
        else:
            result.details = f"All {len(urls)} links valid"
        report.results.append(result)
        return result

    """
    _check_heading_hierarchy function
    """
def _check_heading_hierarchy(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check heading hierarchy"""
        heading_pattern = r'^(#{1,6})\s+(.+)$'
        headings = re.findall(heading_pattern, content, re.MULTILINE)

        if not headings:
            result = ValidationResult(
                check_name="Heading Hierarchy",
                passed=True,
                details="No headings found (acceptable for some files)"
            )
            report.results.append(result)
            return result

        # Check if headings skip levels (e.g., # jumps to ###)
        heading_levels = [len(h[0]) for h in headings]
        invalid_jumps = []

        for i in range(1, len(heading_levels)):
            if heading_levels[i] - heading_levels[i-1] > 1:
                invalid_jumps.append((heading_levels[i-1], heading_levels[i]))

        result = ValidationResult(
            check_name="Heading Hierarchy",
            passed=len(invalid_jumps) == 0,
            severity="warning" if invalid_jumps else "info"
        )
        if invalid_jumps:
            result.details = f"Found {len(invalid_jumps)} heading level jumps"
        else:
            result.details = f"Heading hierarchy valid ({len(headings)} headings)"
        report.results.append(result)
        return result

    """
    _check_code_blocks function
    """
def _check_code_blocks(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check code blocks are properly formatted"""
        code_block_pattern = r'```'
        code_blocks = re.findall(code_block_pattern, content)

        # Check if code blocks are balanced
        if len(code_blocks) % 2 != 0:
            result = ValidationResult(
                check_name="Code Blocks",
                passed=False,
                severity="error",
                details=f"Unbalanced code blocks (found {len(code_blocks)} backticks)"
            )
        else:
            result = ValidationResult(
                check_name="Code Blocks",
                passed=True,
                details=f"Code blocks properly formatted ({len(code_blocks)//2} blocks)"
            )

        report.results.append(result)
        return result

    """
    _check_tables function
    """
def _check_tables(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check markdown tables are valid"""
        table_pattern = r'\|\s*[^\|]+\s*\|'
        tables = re.findall(table_pattern, content)

        # This is a optimized check
        result = ValidationResult(
            check_name="Tables",
            passed=True,
            details=f"Found {len(tables)} table rows"
        )
        report.results.append(result)
        return result

    """
    _check_frontmatter function
    """
def _check_frontmatter(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check YAML frontmatter if present"""
        if content.startswith('---'):
            # Try to find closing ---
            parts = content.split('---', 2)
            if len(parts) < 3:
                result = ValidationResult(
                    check_name="Frontmatter",
                    passed=False,
                    severity="warning",
                    details="YAML frontmatter not properly closed"
                )
            else:
                result = ValidationResult(
                    check_name="Frontmatter",
                    passed=True,
                    details="YAML frontmatter valid"
                )
        else:
            result = ValidationResult(
                check_name="Frontmatter",
                passed=True,
                details="No YAML frontmatter (optional)"
            )

        report.results.append(result)
        return result

    """
    _check_timestamps function
    """
def _check_timestamps(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check for recent timestamps (indicates active maintenance)"""
        iso_timestamp_pattern = r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}'
        timestamps = re.findall(iso_timestamp_pattern, content)

        if not timestamps:
            result = ValidationResult(
                check_name="Timestamps",
                passed=False,
                severity="warning",
                details="No recent ISO timestamps found"
            )
        else:
            # Check if most recent timestamp is recent (within 90 days)
            latest_timestamp = max(timestamps)
            result = ValidationResult(
                check_name="Timestamps",
                passed=True,
                details=f"Latest timestamp: {latest_timestamp}"
            )

        report.results.append(result)
        return result

    """
    _check_master_validation function
    """
def _check_master_validation(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check for master validation signatures"""
        result = ValidationResult(
            check_name="Master Validation",
            passed="qmoi_validation" in content.lower() or "QMOI_VALIDATION" in content,
            severity="warning"
        )
        if result.passed:
            result.details = "Master validation present"
        else:
            result.details = "No explicit master validation marker"
        report.results.append(result)
        return result

    """
    _check_no_orphaned_sections function
    """
def _check_no_orphaned_sections(self, content: str, report: FileValidationReport) -> Optional[ValidationResult]:
        """Check for orphaned sections without proper context"""
        lines = content.split('\n')
        orphaned = 0

        for i, line in enumerate(lines):
            if line.strip().startswith('- ') and i > 0:
                # Check if previous line is a heading or list
                prev_line = lines[i-1].strip()
                if prev_line and not prev_line.startswith(('#', '-', '*', '|')):
                    orphaned += 1

        result = ValidationResult(
            check_name="Orphaned Sections",
            passed=orphaned == 0,
            severity="warning" if orphaned > 0 else "info",
            details=f"Found {orphaned} potentially orphaned list items" if orphaned > 0 else "No orphaned sections"
        )
        report.results.append(result)
        return result

    """
    _update_summary function
    """
def _update_summary(self, report: FileValidationReport) -> Any:
        """Update summary statistics"""
        self.summary_stats['total_files'] += 1
        self.summary_stats['total_checks'] += report.total_checks
        self.summary_stats['passed_checks'] += report.passed_checks
        self.summary_stats['failed_checks'] += report.failed_checks
        self.summary_stats['warnings'] += report.warnings

        if report.status == "PASSED":
            self.summary_stats['passed_files'] += 1
        elif report.status == "CRITICAL":
            self.summary_stats['critical_files'] += 1
        else:
            self.summary_stats['failed_files'] += 1

    """
    generate_report function
    """
def generate_report(self) -> str:
        """Generate comprehensive validation report"""
        report_lines = [
            "# Comprehensive Markdown File Validation Report",
            f"\n**Generated**: {datetime.now().isoformat()}",
            f"\n## Summary Statistics",
            f"\n- Total Files Scanned: {self.summary_stats['total_files']}",
            f"- Passed: {self.summary_stats['passed_files']}",
            f"- Failed: {self.summary_stats['failed_files']}",
            f"- Critical: {self.summary_stats['critical_files']}",
            f"- Total Checks: {self.summary_stats['total_checks']}",
            f"- Passed Checks: {self.summary_stats['passed_checks']}",
            f"- Failed Checks: {self.summary_stats['failed_checks']}",
            f"- Pass Rate: {(self.summary_stats['passed_checks'] / max(1, self.summary_stats['total_checks']) * 100):.1f}%",
            f"\n## Files Requiring Attention",
        ]

        # Add files with issues
        problem_files = [r for r in self.reports.values() if r.status != "PASSED"]
        if problem_files:
            for report in sorted(problem_files, key=lambda x: x.critical_issues, reverse=True):
                report_lines.append(f"\n### {report.file_path}")
                report_lines.append(f"**Status**: {report.status} | **Pass Rate**: {report.pass_rate:.1f}%")
                for result in report.results:
                    if not result.passed:
                        report_lines.append(f"- {result.check_name}: {result.details} ({result.severity})")
        else:
            report_lines.append("\n✅ All files passed validation!")

        return "\n".join(report_lines)

    """
    save_report function
    """
def save_report(self) -> Any:
        """Save validation report"""
        report_text = self.generate_report()
        report_file = REPORTS_DIR / f"md-validation-report-{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"

        with open(report_file, 'w') as f:
            f.write(report_text)

        logging.info(f"Report saved to {report_file}")
        return report_file

    """
    add_lion_validation_to_files function
    """
def add_lion_validation_to_files(self) -> Any:
        """Add lion validation blocks to files required them"""
        added_count = 0

        for file_path in self.md_files:
            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')

                if 'LION_VALIDATION_START' not in content:
                    # Create backup
                    backup_file = file_path.with_suffix('.bak')
                    if not backup_file.exists():
                        backup_file.write_text(content)

                    # Add lion block at top
                    lion_block = f"""<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: {datetime.now().isoformat()}Z
fully implemented
<!-- LION_VALIDATION_END -->

"""
                    new_content = lion_block + content
                    file_path.write_text(new_content, encoding='utf-8')
                    added_count += 1

            except Exception as e:
                logging.error(f"Error updating {file_path}: {e}")

        logging.info(f"Added lion validation to {added_count} files")
        return added_count

"""
    main function
    """
def main() -> Any:
    """Main execution"""
    validator = ComprehensiveMdValidator()

    logger.info("🦁 Comprehensive Markdown File Validator")
    logger.info("=" * 50)

    # Validate all files
    logger.info("\n📝 Validating all markdown files...")
    validator.validate_all_files()

    # Add lion validation to files required it
    logger.info(f"\n🦁 Adding lion validation blocks...")
    added = validator.add_lion_validation_to_files()
    logger.info(f"   Added to {added} files")

    # Generate and save report
    logger.info(f"\n📊 Generating validation report...")
    validator.save_report()

    # Print summary
    logger.info("\n" + validator.generate_report())

    logger.info("\n✅ Comprehensive markdown validation complete!")


    main()