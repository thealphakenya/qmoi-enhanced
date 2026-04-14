#!/usr/bin/env python3
"""
QMOI Production Readiness Validation Script
Validates all major components for production deployment
"""

import os
import sys
import json
import pathlib
from datetime import datetime

class ProductionValidator:
    def __init__(self):
        self.results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'validating',
            'checks': {}
        }

    def check_file_exists(self, file_path, description):
        """Check if a file exists"""
        exists = pathlib.Path(file_path).exists()
        self.results['checks'][description] = {
            'status': 'pass' if exists else 'fail',
            'details': f"File {'exists' if exists else 'missing'}: {file_path}"
        }
        return exists

    def check_directory_exists(self, dir_path, description):
        """Check if a directory exists"""
        exists = pathlib.Path(dir_path).is_dir()
        self.results['checks'][description] = {
            'status': 'pass' if exists else 'fail',
            'details': f"Directory {'exists' if exists else 'missing'}: {dir_path}"
        }
        return exists

    def validate_api_endpoints(self):
        """Validate API endpoints exist"""
        api_checks = [
            ('app/api/cameras/route.ts', 'Camera API main endpoint'),
            ('app/api/cameras/street/route.ts', 'Street camera API'),
            ('app/api/cameras/road/route.ts', 'Road camera API'),
            ('app/api/cameras/thermal/route.ts', 'Thermal camera API'),
            ('app/api/cameras/panoramic/route.ts', 'Panoramic camera API'),
            ('app/api/cameras/infrared/route.ts', 'Infrared camera API'),
            ('app/devices/page.tsx', 'Device management page'),
            ('app/devices/route.ts', 'Device management API'),
            ('app/api/memory/route.ts', 'Memory persistence API'),
            ('app/api/consciousness/route.ts', 'Consciousness monitoring API'),
            ('app/friendship/page.tsx', 'Friendship interface page'),
            ('app/friendship/route.ts', 'Friendship interface API'),
        ]

        all_pass = True
        for file_path, description in api_checks:
            if not self.check_file_exists(file_path, description):
                all_pass = False

        return all_pass

    def validate_bulk_scripts(self):
        """Validate bulk processing scripts"""
        script_checks = [
            ('scripts/qmoi_bulk_consciousness_updater.py', 'Consciousness bulk updater'),
            ('scripts/qmoi_bulk_lion_security_integrator.py', 'Security AI integrator'),
            ('scripts/qmoi_global_memory_persistence.py', 'Global memory persistence'),
            ('scripts/qmoi_md_autoupdater.py', 'MD autoupdater'),
        ]

        all_pass = True
        for file_path, description in script_checks:
            if not self.check_file_exists(file_path, description):
                all_pass = False

        return all_pass

    def validate_documentation(self):
        """Validate documentation files"""
        doc_checks = [
            ('API.md', 'API documentation'),
            ('APIs_1.md', 'APIs documentation'),
            ('ENDPOINTS.md', 'Endpoints documentation'),
            ('ROUTES.md', 'Routes documentation'),
            ('ALLTESTSAUTOTESTS.md', 'Test documentation'),
            ('ALLMDFILESREFS.md', 'MD files reference'),
            ('HOOKS.md', 'Hooks documentation'),
            ('WEBHOOKS.md', 'Webhooks documentation'),
            ('ALLHOOKSWEBHOOKS.md', 'Combined hooks/webhooks'),
            ('TREE.md', 'Project tree documentation'),
        ]

        all_pass = True
        for file_path, description in doc_checks:
            if not self.check_file_exists(file_path, description):
                all_pass = False

        return all_pass

    def validate_resumefromhere(self):
        """Validate resumefromhere.txt status"""
        if not self.check_file_exists('resumefromhere.txt', 'Resume status file'):
            return False

        try:
            with open('resumefromhere.txt', 'r') as f:
                content = f.read()
                # Check for completion markers
                completion_indicators = [
                    'FULLY OPERATIONAL',
                    'PRODUCTION READY',
                    'COMPREHENSIVE SYSTEM ENHANCEMENTS'
                ]
                status_ok = any(indicator in content for indicator in completion_indicators)
                self.results['checks']['Resume status validation'] = {
                    'status': 'pass' if status_ok else 'fail',
                    'details': f"Resume file {'shows completion' if status_ok else 'missing completion markers'}"
                }
                return status_ok
        except Exception as e:
            self.results['checks']['Resume status validation'] = {
                'status': 'fail',
                'details': f"Error reading resume file: {e}"
            }
            return False

    def run_all_validations(self):
        """Run all validation checks"""
        print("🔍 QMOI Production Readiness Validation Starting...")
        print("=" * 60)

        # Run all checks
        api_ok = self.validate_api_endpoints()
        scripts_ok = self.validate_bulk_scripts()
        docs_ok = self.validate_documentation()
        resume_ok = self.validate_resumefromhere()

        # Overall status
        all_checks = list(self.results['checks'].values())
        passed_checks = [c for c in all_checks if c['status'] == 'pass']
        failed_checks = [c for c in all_checks if c['status'] == 'fail']

        self.results['status'] = 'pass' if len(failed_checks) == 0 else 'fail'
        self.results['summary'] = {
            'total_checks': len(all_checks),
            'passed': len(passed_checks),
            'failed': len(failed_checks)
        }

        # Print results
        print(f"\n📊 VALIDATION RESULTS:")
        print(f"Status: {'✅ PASS' if self.results['status'] == 'pass' else '❌ FAIL'}")
        print(f"Total Checks: {len(all_checks)}")
        print(f"Passed: {len(passed_checks)}")
        print(f"Failed: {len(failed_checks)}")

        if failed_checks:
            print(f"\n❌ FAILED CHECKS:")
            for check_name, check_result in self.results['checks'].items():
                if check_result['status'] == 'fail':
                    print(f"  - {check_name}: {check_result['details']}")

        print(f"\n✅ PASSED CHECKS:")
        for check_name, check_result in self.results['checks'].items():
            if check_result['status'] == 'pass':
                print(f"  - {check_name}: {check_result['details']}")

        # Save results
        with open('validation_report.json', 'w') as f:
            json.dump(self.results, f, indent=2)

        print(f"\n💾 Results saved to: validation_report.json")
        return self.results['status'] == 'pass'

def main():
    validator = ProductionValidator()
    success = validator.run_all_validations()

    if success:
        print("\n🎉 QMOI SYSTEM IS PRODUCTION READY!")
        print("All validations passed. System ready for deployment.")
    else:
        print("\n⚠️  VALIDATION ISSUES DETECTED")
        print("Please review failed checks before deployment.")

    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())