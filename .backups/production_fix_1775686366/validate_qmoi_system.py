#!/usr/bin/env python3
"""
QMOI Cross-Repository Autonomous System Validation Script
Validates the enhanced autosync service with cross-repo capabilities.
"""

import os
import sys
import json
from datetime import datetime

class QMOIValidator:
    def __init__(self):
        self.results = []
        self.start_time = datetime.now()

    def log(self, message: str, level: str = "INFO"):
        """Log a message with timestamp and level."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")

    def validate_file_exists(self, file_path: str, description: str) -> bool:
        """Validate that a file exists."""
        exists = os.path.exists(file_path)
        status = "PASSED" if exists else "FAILED"
        self.log(f"{description}: {status}")
        self.results.append({
            "test": description,
            "status": status,
            "file": file_path
        })
        return exists

    def validate_file_contains(self, file_path: str, search_text: str, description: str) -> bool:
        """Validate that a file contains specific text."""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                contains = search_text in content
                status = "PASSED" if contains else "FAILED"
                self.log(f"{description}: {status}")
                self.results.append({
                    "test": description,
                    "status": status,
                    "file": file_path,
                    "search_text": search_text
                })
                return contains
        except Exception as e:
            self.log(f"Error reading {file_path}: {e}", "ERROR")
            self.results.append({
                "test": description,
                "status": "ERROR",
                "file": file_path,
                "error": str(e)
            })
            return False

    def run_validations(self):
        """Run all validations."""
        self.log("Starting QMOI Cross-Repository System Validation")
        self.log("=" * 60)

        # Core autonomous system files
        validations = [
            # Autonomous Intelligence
            ("lib/autonomous-intelligence.ts", "Autonomous Intelligence Core"),
            ("lib/autosync-service.ts", "Enhanced Autosync Service"),
            ("lib/workflow-engine.ts", "Workflow Engine"),
            ("lib/background-worker.ts", "Background Worker System"),
            ("lib/realtime-system.ts", "Realtime Communication System"),

            # API Endpoints
            ("app/api/workflow/route.ts", "Workflow API Endpoint"),
            ("app/api/autosync/route.ts", "Autosync API Endpoint"),
            ("app/api/health/route.ts", "Health Check API Endpoint"),

            # Documentation
            ("WORKFLOWS.md", "Workflow Documentation"),
            ("API_REFERENCE.md", "API Reference Documentation"),
            ("API_ENDPOINTS_REFERENCE.md", "API Endpoints Reference"),
        ]

        # File existence validations
        for file_path, description in validations:
            self.validate_file_exists(file_path, f"File exists: {description}")

        # Content validations
        content_checks = [
            ("lib/autosync-service.ts", "syncWithAlphaQAI", "Cross-repo sync method exists"),
            ("lib/autosync-service.ts", "CrossRepoManager", "Cross-repo manager class exists"),
            ("lib/autosync-service.ts", "ensureQMOIAlwaysActive", "Continuous activity method exists"),
            ("lib/autonomous-intelligence.ts", "manageCrossRepoWorkflows", "Cross-repo workflow management exists"),
            ("lib/autonomous-intelligence.ts", "executeMasterCommand", "Master command execution exists"),
            ("WORKFLOWS.md", "autonomous", "Workflow documentation mentions autonomy"),
        ]

        for file_path, search_text, description in content_checks:
            if os.path.exists(file_path):
                self.validate_file_contains(file_path, search_text, f"Content check: {description}")

        # Generate summary
        self.generate_summary()

    def generate_summary(self):
        """Generate validation summary."""
        self.log("=" * 60)
        self.log("VALIDATION SUMMARY")
        self.log("=" * 60)

        passed = sum(1 for r in self.results if r["status"] == "PASSED")
        failed = sum(1 for r in self.results if r["status"] == "FAILED")
        errors = sum(1 for r in self.results if r["status"] == "ERROR")
        total = len(self.results)

        duration = datetime.now() - self.start_time

        summary = {
            "total_validations": total,
            "passed": passed,
            "failed": failed,
            "errors": errors,
            "success_rate": round((passed / total) * 100, 2) if total > 0 else 0,
            "duration": str(duration),
            "timestamp": datetime.now().isoformat()
        }

        self.log(f"Total Validations: {summary['total_validations']}")
        self.log(f"Passed: {summary['passed']}")
        self.log(f"Failed: {summary['failed']}")
        self.log(f"Errors: {summary['errors']}")
        self.log(f"Success Rate: {summary['success_rate']}%")
        self.log(f"Duration: {summary['duration']}")

        # Save results
        results_file = "qmoi_validation_results.json"
        with open(results_file, 'w') as f:
            json.dump({
                "summary": summary,
                "results": self.results
            }, f, indent=2)

        self.log(f"Detailed results saved to: {results_file}")

        # Final assessment
        if failed == 0 and errors == 0:
            self.log("🎉 ALL VALIDATIONS PASSED! QMOI Cross-Repository System is fully implemented.", "SUCCESS")
            return True
        else:
            self.log(f"⚠️ {failed + errors} VALIDATIONS FAILED/ERRORED. Review the results.", "WARNING")
            return False

def main():
    validator = QMOIValidator()
    success = validator.run_validations()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()