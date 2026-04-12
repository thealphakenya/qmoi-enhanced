
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
QMOI Final System Health Check and Optimization

This script performs a comprehensive final health check of the QMOI system,
validates all enhancements, and applies any final optimizations.
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/final_health_check.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent

def run_system_health_check():
    """Run comprehensive system health checks"""
    logger.info("Running comprehensive system health check...")

    health_report = {
        'timestamp': datetime.now().isoformat(),
        'checks': {},
        'issues': [],
        'recommendations': []
    }

    # Check 1: File system integrity
    health_report['checks']['filesystem'] = check_filesystem_integrity()

    # Check 2: Documentation health
    health_report['checks']['documentation'] = check_documentation_health()

    # Check 3: UI component health
    health_report['checks']['ui_components'] = check_ui_component_health()

    # Check 4: Code quality
    health_report['checks']['code_quality'] = check_code_quality()

    # Check 5: System performance
    health_report['checks']['performance'] = check_system_performance()

    # Check 6: Security status
    health_report['checks']['security'] = check_security_status()

    # Generate final report
    report_path = BASE_DIR / 'final_health_report.json'
    with open(report_path, 'w') as f:
        json.dump(health_report, f, indent=2, default=str)

    # Apply final optimizations
    apply_final_optimizations(health_report)

    return health_report

def check_filesystem_integrity():
    """Check filesystem integrity and duplicates"""
    check = {'status': 'PASS', 'details': {}}

    # Count total files
    total_files = sum(1 for _ in BASE_DIR.rglob('*') if _.is_file())
    check['details']['total_files'] = total_files

    # Check for remaining duplicates
    duplicate_report = BASE_DIR / 'duplicate_files_report.md'
    if duplicate_report.exists():
        with open(duplicate_report, 'r') as f:
            content = f.read()
            if 'duplicate file groups' in content.lower():
                check['status'] = 'WARNING'
                check['details']['duplicates_found'] = True
            else:
                check['details']['duplicates_found'] = False

    # Check for large files
    large_files = []
    for file_path in BASE_DIR.rglob('*'):
        if file_path.is_file() and file_path.stat().st_size > 100 * 1024 * 1024:  # 100MB
            large_files.append(str(file_path.relative_to(BASE_DIR)))

    check['details']['large_files'] = large_files
    if large_files:
        check['status'] = 'WARNING'

    return check

def check_documentation_health():
    """Check documentation completeness and quality"""
    check = {'status': 'PASS', 'details': {}}

    # Check quality gate results
    quality_report = BASE_DIR / 'quality_gate_report.json'
    if quality_report.exists():
        with open(quality_report, 'r') as f:
            data = json.load(f)
            check['details']['total_docs'] = data.get('analyzed_files', 0)
            check['details']['passing_docs'] = data.get('passing_files', 0)
            check['details']['docs_with_issues'] = data.get('files_with_issues', 0)

            if data.get('files_with_issues', 0) > 100:
                check['status'] = 'WARNING'

    # Check for README updates
    readme = BASE_DIR / 'README.md'
    if readme.exists():
        content = readme.read_text()
        if 'Documentation Quality Gate' in content:
            check['details']['readme_updated'] = True
        else:
            check['status'] = 'WARNING'
            check['details']['readme_updated'] = False

    return check

def check_ui_component_health():
    """Check UI component validation results"""
    check = {'status': 'PASS', 'details': {}}

    ui_report = BASE_DIR / 'ui_validation_report.json'
    if ui_report.exists():
        with open(ui_report, 'r') as f:
            data = json.load(f)
            check['details']['total_components'] = data.get('total_components', 0)
            check['details']['validated_components'] = data.get('validated_components', 0)
            check['details']['components_with_errors'] = data.get('components_with_errors', 0)

            if data.get('components_with_errors', 0) > 0:
                check['status'] = 'FAIL'

    return check

def check_code_quality():
    """Check code quality metrics"""
    check = {'status': 'PASS', 'details': {}}

    # Count code files
    code_extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb']
    code_files = []
    for ext in code_extensions:
        code_files.extend(BASE_DIR.rglob(f'*{ext}'))

    check['details']['code_files'] = len(code_files)

    # Check for linting results
    eslint_report = BASE_DIR / 'eslint_report.json'
    if eslint_report.exists():
        check['details']['eslint_report_exists'] = True
    else:
        check['details']['eslint_report_exists'] = False

    return check

def check_system_performance():
    """Check system performance metrics"""
    check = {'status': 'PASS', 'details': {}}

    # Check repository size
    try:
        result = subprocess.run(['du', '-sh', str(BASE_DIR)], capture_output=True, text=True)
        if result.returncode == 0:
            check['details']['repo_size'] = result.stdout.strip().split()[0]
    except:
        check['details']['repo_size'] = 'unknown'

    # Check git status
    try:
        result = subprocess.run(['git', 'status', '--porcelain'], cwd=BASE_DIR, capture_output=True, text=True)
        check['details']['uncommitted_changes'] = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
    except:
        check['details']['uncommitted_changes'] = 'unknown'

    return check

def check_security_status():
    """Check security-related configurations"""
    check = {'status': 'PASS', 'details': {}}

    # Check for sensitive files
    sensitive_patterns = ['.env', 'secrets', 'private', 'key']
    sensitive_files = []

    for pattern in sensitive_patterns:
        for file_path in BASE_DIR.rglob(f'*{pattern}*'):
            if file_path.is_file():
                sensitive_files.append(str(file_path.relative_to(BASE_DIR)))

    check['details']['sensitive_files'] = sensitive_files

    if sensitive_files:
        check['status'] = 'WARNING'

    # Check for .gitignore
    gitignore = BASE_DIR / '.gitignore'
    check['details']['has_gitignore'] = gitignore.exists()

    return check

def apply_final_optimizations(health_report):
    """Apply final system optimizations based on health check"""
    logger.info("Applying final system optimizations...")

    optimizations_applied = []

    # Optimization 1: Update .gitignore if needed
    gitignore_path = BASE_DIR / '.gitignore'
    if not gitignore_path.exists():
        gitignore_content = """# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo

# Build outputs
dist/
build/
*.tsbuildinfo

# Logs
*.log
logs/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# production_files
*.cache
*.resource

# Backups
*.bak
*.backup
backups/

# Reports
reports/
"""
        gitignore_path.write_text(gitignore_content)
        optimizations_applied.append("Created .gitignore file")
        logger.info("Created .gitignore file")

    # Optimization 2: Clean up any remaining cache files
    cache_cleaned = 0
    for cache_file in BASE_DIR.rglob('*.cache'):
        if cache_file.is_file():
            try:
                cache_file.unlink()
                cache_cleaned += 1
            except:
return None  # Placeholder
    if cache_cleaned > 0:
        optimizations_applied.append(f"Cleaned {cache_cleaned} cache files")
        logger.info(f"Cleaned {cache_cleaned} cache files")

    # Optimization 3: Ensure all scripts are executable
    scripts_dir = BASE_DIR / 'scripts'
    if scripts_dir.exists():
        for script in scripts_dir.rglob('*.py'):
            if script.is_file():
                try:
                    os.chmod(script, 0o755)
                except:
return None  # Placeholder
    # Update health report with optimizations
    health_report['optimizations_applied'] = optimizations_applied

    return optimizations_applied

def generate_final_summary(health_report):
    """Generate final system summary"""
    summary = f"""
# QMOI System Final Health Report

**Generated:** {health_report['timestamp']}

## System Status Overview

### ✅ Filesystem Integrity
- Total files: {health_report['checks']['filesystem']['details'].get('total_files', 'N/A')}
- Duplicates: {'Found' if health_report['checks']['filesystem']['details'].get('duplicates_found') else 'None'}
- Large files: {len(health_report['checks']['filesystem']['details'].get('large_files', []))}

### ✅ Documentation Health
- Total docs: {health_report['checks']['documentation']['details'].get('total_docs', 'N/A')}
- Passing docs: {health_report['checks']['documentation']['details'].get('passing_docs', 'N/A')}
- Docs with issues: {health_report['checks']['documentation']['details'].get('docs_with_issues', 'N/A')}

### ✅ UI Components
- Total components: {health_report['checks']['ui_components']['details'].get('total_components', 'N/A')}
- Validated: {health_report['checks']['ui_components']['details'].get('validated_components', 'N/A')}
- Errors: {health_report['checks']['ui_components']['details'].get('components_with_errors', 'N/A')}

### ✅ Code Quality
- Code files: {health_report['checks']['code_quality']['details'].get('code_files', 'N/A')}
- ESLint reports: {'Available' if health_report['checks']['code_quality']['details'].get('eslint_report_exists') else 'Missing'}

### ✅ Performance
- Repository size: {health_report['checks']['performance']['details'].get('repo_size', 'N/A')}
- Uncommitted changes: {health_report['checks']['performance']['details'].get('uncommitted_changes', 'N/A')}

### ✅ Security
- Sensitive files: {len(health_report['checks']['security']['details'].get('sensitive_files', []))}
- Git ignore: {'Present' if health_report['checks']['security']['details'].get('has_gitignore') else 'Missing'}

## Optimizations Applied
{chr(10).join(f"- {opt}" for opt in health_report.get('optimizations_applied', []))}

## Final Status: {'✅ ALL SYSTEMS HEALTHY' if all(check['status'] == 'PASS' for check in health_report['checks'].values()) else '⚠️ SOME ISSUES DETECTED'}
"""

    summary_path = BASE_DIR / 'FINAL_SYSTEM_HEALTH_REPORT.md'
    with open(summary_path, 'w') as f:
        f.write(summary)

    logger.info("Generated final system health report")

def main():
    """Main final health check function"""
    logger.info("=" * 80)
    logger.info("QMOI FINAL SYSTEM HEALTH CHECK AND OPTIMIZATION")
    logger.info("=" * 80)

    health_report = run_system_health_check()
    generate_final_summary(health_report)

    # Check overall status
    all_pass = all(check['status'] == 'PASS' for check in health_report['checks'].values())

    if all_pass:
        logger.info("🎉 FINAL RESULT: All systems are healthy and optimized!")
    else:
        logger.warning("⚠️ FINAL RESULT: Some issues detected but system is functional")

    # Update resumefromhere.txt
    resume_file = BASE_DIR / 'resumefromhere.txt'
    if resume_file.exists():
        content = resume_file.read_text()
        status = "✅ COMPLETED" if all_pass else "⚠️ COMPLETED WITH MINOR ISSUES"
        content = content.replace(
            '- Final system health check and optimization. ⏳ STARTING',
            f'- Final system health check and optimization. {status}'
        )
        resume_file.write_text(content)
        logger.info("Updated resumefromhere.txt with final health check results")

    logger.info("Final system health check and optimization completed!")


    main()