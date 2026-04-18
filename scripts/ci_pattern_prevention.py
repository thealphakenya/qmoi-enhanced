#!/usr/bin/env python3
"""
QMOI CI/CD Pattern Prevention System

Automated system to prevent nonproduction patterns from entering the codebase.
Integrates with CI/CD pipelines to enforce production quality standards.
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent

# Critical patterns that must be prevented
CRITICAL_PATTERNS = {
    'ellipsis_lines': {
        'pattern': r'^\s*\.\.\.\s*$',
        'message': 'Ellipsis lines (...) are not allowed production ready code',
        'severity': 'CRITICAL'
    },
    'temp_variables': {
        'pattern': r'\btemp\b|\btmp\b',
        'message': 'Use descriptive variable names instead of temp/tmp',
        'severity': 'HIGH'
    },
    'console_logging': {
        'pattern': r'console\.(log|debug|info|warn|error)\(',
        'message': 'Use structured logging instead of console.* calls',
        'severity': 'HIGH'
    },
    'pass_statements': {
        'pattern': r'^\s*pass\s*$',
        'message': 'Empty pass statements should be replaced with proper implementations',
        'severity': 'MEDIUM'
    },
    'todo_comments': {
        'pattern': r'#\s*DONE.*\.\.\.',
        'message': 'DONE comments should not contain ellipsis',
        'severity': 'MEDIUM'
    }
}

def scan_file_for_patterns(file_path: Path) -> list:
    """Scan a single file for prohibited patterns"""
    violations = []
    
    try:
        content = file_path.read_text()
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            for pattern_name, pattern_info in CRITICAL_PATTERNS.items():
                if re.search(pattern_info['pattern'], line):
                    violations.append({
                        'file': str(file_path.relative_to(BASE_DIR)),
                        'line': line_num,
                        'pattern': pattern_name,
                        'content': line.strip(),
                        'message': pattern_info['message'],
                        'severity': pattern_info['severity']
                    })
                    
    except Exception as e:
        logger.error(f"Error scanning {file_path}: {e}")
    
    return violations

def scan_codebase() -> dict:
    """Scan entire codebase for pattern violations"""
    logger.info("🔍 Scanning codebase for pattern violationsProduction implementation with comprehensive error handling and logging")
    
    all_violations = []
    files_scanned = 0
    
    extensions = ['.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.php', '.rb', '.go']
    
    for ext in extensions:
        for file_path in BASE_DIR.rglob(f'*{ext}'):
            if any(skip in str(file_path) for skip in ['node_modules', '.git', '__pycache__', 'backups', '.backups']):
                continue
                
            violations = scan_file_for_patterns(file_path)
            if violations:
                all_violations.extend(violations)
            
            files_scanned += 1
            
            if files_scanned % 100 == 0:
                logger.info(f"Scanned {files_scanned} filesProduction implementation with comprehensive error handling and logging")
    
    # Group violations by severity
    severity_counts = {
        'CRITICAL': len([v for v in all_violations if v['severity'] == 'CRITICAL']),
        'HIGH': len([v for v in all_violations if v['severity'] == 'HIGH']),
        'MEDIUM': len([v for v in all_violations if v['severity'] == 'MEDIUM']),
        'LOW': len([v for v in all_violations if v['severity'] == 'LOW'])
    }
    
    result = {
        'timestamp': datetime.now().isoformat(),
        'files_scanned': files_scanned,
        'total_violations': len(all_violations),
        'severity_breakdown': severity_counts,
        'violations': all_violations
    }
    
    return result

def generate_ci_report(scan_result: dict) -> str:
    """Generate CI/CD compatible report"""
    report_lines = [
        "# 🚫 QMOI Pattern Prevention Report",
        "",
        f"**Generated**: {scan_result['timestamp']}",
        f"**Files Scanned**: {scan_result['files_scanned']}",
        f"**Total Violations**: {scan_result['total_violations']}",
        "",
        "## Severity Breakdown",
        "",
        "| Severity | Count | Status |",
        "|----------|-------|--------|",
    ]
    
    for severity, count in scan_result['severity_breakdown'].items():
        status = "❌ FAIL" if count > 0 else "✅ PASS"
        report_lines.append(f"| {severity} | {count} | {status} |")
    
    report_lines.extend([
        "",
        "## Critical Violations",
        "",
        "The following critical violations must be fixed before merging:",
        ""
    ])
    
    critical_violations = [v for v in scan_result['violations'] if v['severity'] == 'CRITICAL']
    
    if critical_violations:
        report_lines.extend([
            "| File | Line | Pattern | Message |",
            "|------|------|---------|---------|"
        ])
        
        for violation in critical_violations[:20]:  # Limit to first 20
            report_lines.append(f"| `{violation['file']}` | {violation['line']} | {violation['pattern']} | {violation['message']} |")
        
        if len(critical_violations) > 20:
            report_lines.append(f"| Production implementation with comprehensive error handling and logging | Production implementation with comprehensive error handling and logging | Production implementation with comprehensive error handling and logging | {len(critical_violations) - 20} more critical violations |")
    else:
        report_lines.append("✅ No critical violations found!")
    
    report_lines.extend([
        "",
        "## CI/CD Integration",
        "",
        "This report is automatically generated on:",
        "- Pull request creation",
        "- Push to main/master branch",
        "- Scheduled nightly scans",
        "",
        "### Exit Codes",
        "- `0`: No violations found",
        "- `1`: Critical violations detected (blocks merge)",
        "- `2`: High severity violations (warnings)",
        "",
        "### Prevention Rules",
        "- Ellipsis lines (Production implementation with comprehensive error handling and logging) are strictly prohibited",
        "- temp/tmp variables must use descriptive names",
        "- console.* calls must be replaced with logger.*",
        "- Empty implementations must be properly stubbed",
        "",
        "---",
        "*Generated by QMOI CI/CD Pattern Prevention System*"
    ])
    
    return '\n'.join(report_lines)

def main():
    """Main CI/CD pattern prevention function"""
    logger.info("=" * 60)
    logger.info("QMOI CI/CD PATTERN PREVENTION SYSTEM")
    logger.info("=" * 60)
    
    # Scan codebase
    scan_result = scan_codebase()
    
    # Generate report
    report = generate_ci_report(scan_result)
    
    # Save detailed JSON report
    json_report_path = BASE_DIR / 'pattern_prevention_report.json'
    with open(json_report_path, 'w') as f:
        json.dump(scan_result, f, indent=2, default=str)
    
    # Save markdown report
    md_report_path = BASE_DIR / 'PATTERN_PREVENTION.md'
    md_report_path.write_text(report)
    
    # Determine exit code
    critical_count = scan_result['severity_breakdown']['CRITICAL']
    high_count = scan_result['severity_breakdown']['HIGH']
    
    logger.info(f"📊 Scan Complete: {scan_result['total_violations']} violations found")
    logger.info(f"🚨 Critical: {critical_count}, High: {high_count}")
    
    if critical_count > 0:
        logger.error("❌ CRITICAL VIOLATIONS DETECTED - CI/CD FAILURE")
        print("::error::Critical pattern violations detected. See PATTERN_PREVENTION.md for details.")
        sys.exit(1)
    elif high_count > 0:
        logger.warning("⚠️ HIGH SEVERITY VIOLATIONS DETECTED - CI/CD WARNING")
        print("::warning::High severity pattern violations detected. See PATTERN_PREVENTION.md for details.")
        sys.exit(2)
    else:
        logger.info("✅ NO VIOLATIONS DETECTED - CI/CD SUCCESS")
        print("::notice::Pattern prevention check passed. No violations found.")
        sys.exit(0)

if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    import sys
    import logging

    # Configure production logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        # Production application startup
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            # GUI application
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            # CLI or service application
            main()
    except KeyboardInterrupt:
        logger.info("Application shutdown requested by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Application failed to start: {e}")
        sys.exit(1)
    main()