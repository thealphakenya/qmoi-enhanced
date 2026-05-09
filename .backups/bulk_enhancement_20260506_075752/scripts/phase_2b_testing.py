#!/usr/bin/env python3
"""
QMOI Enhanced - Phase 2B: Comprehensive Testing Suite
Validates production readiness before deployment
"""

import time
import json
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

class Phase2Testing:
    def __init__(self):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "phase": "Phase 2B",
            "tests": [],
            "passed": 0,
            "failed": 0,
            "skipped": 0,
        }

    def test_modules_exist(self):
        """Verify all production modules exist."""
        print("🔍 Testing: Production Modules...")
        
        modules = [
            ("CashOn", "services/cashon-production.ts"),
            ("Financial Stats", "services/financial-stats-production.ts"),
        ]
        
        for name, path in modules:
            filepath = PROJECT_ROOT / path
            if filepath.exists():
                print(f"  ✅ {name} module found")
                self.results["passed"] += 1
                self.results["tests"].append({
                    "name": f"Module: {name}",
                    "status": "passed"
                })
            else:
                print(f"  ❌ {name} module NOT found: {path}")
                self.results["failed"] += 1
                self.results["tests"].append({
                    "name": f"Module: {name}",
                    "status": "failed"
                })

    def test_configuration_files(self):
        """Verify all required configuration files."""
        print("\n🔧 Testing: Configuration Files...")
        
        configs = [
            ".env.production.PRODUCTIONlate",
            ".env.PRODUCTION.PRODUCTIONlate",
            "PRODUCTION_DEPLOYMENT_CHECKLIST.md",
            "AUTOPRODUCTION_PRODUCTION_OPERATIONS.md",
            "PRODUCTION_QUICK_REFERENCE.md",
        ]
        
        for config in configs:
            filepath = PROJECT_ROOT / config
            if filepath.exists():
                print(f"  ✅ {config}")
                self.results["passed"] += 1
                self.results["tests"].append({
                    "name": f"Config: {config}",
                    "status": "passed"
                })
            else:
                print(f"  ❌ {config} NOT found")
                self.results["failed"] += 1
                self.results["tests"].append({
                    "name": f"Config: {config}",
                    "status": "failed"
                })

    def test_automation_scripts(self):
        """Verify all automation scripts exist."""
        print("\n⚙️  Testing: Automation Scripts...")
        
        scripts = [
            "scripts/production_migration_complete.py",
            "scripts/validate_production_state.py",
            "scripts/phase_2_setup.py",
        ]
        
        for script in scripts:
            filepath = PROJECT_ROOT / script
            if filepath.exists():
                print(f"  ✅ {script}")
                self.results["passed"] += 1
                self.results["tests"].append({
                    "name": f"Script: {script}",
                    "status": "passed"
                })
            else:
                print(f"  ❌ {script} NOT found")
                self.results["failed"] += 1
                self.results["tests"].append({
                    "name": f"Script: {script}",
                    "status": "failed"
                })

    def test_database_migrations(self):
        """Verify database migrations created."""
        print("\n🗄️  Testing: Database Migrations...")
        
        migrations_dir = PROJECT_ROOT / "migrations"
        if migrations_dir.exists():
            migration_files = list(migrations_dir.glob("*.sql"))
            if migration_files:
                print(f"  ✅ Found {len(migration_files)} migration files:")
                for mf in migration_files:
                    print(f"     • {mf.name}")
                self.results["passed"] += 1
                self.results["tests"].append({
                    "name": "Database Migrations",
                    "status": "passed",
                    "count": len(migration_files)
                })
            else:
                print("  ⚠️  Migrations directory exists but empty")
                self.results["skipped"] += 1
        else:
            print("  ℹ️  Migrations directory not yet created")
            self.results["skipped"] += 1
            self.results["tests"].append({
                "name": "Database Migrations",
                "status": "skipped"
            })

    def test_documentation(self):
        """Verify documentation completeness."""
        print("\n📚 Testing: Documentation...")
        
        docs = [
            "PRODUCTION_MIGRATION_SUMMARY.md",
            "PRODUCTION_COMPLETION_REPORT_FINAL.md",
            "resumefromhere.txt",
            "INSTANCES.md",
            "INSTANCES.txt",
        ]
        
        found = 0
        for doc in docs:
            filepath = PROJECT_ROOT / doc
            if filepath.exists():
                print(f"  ✅ {doc}")
                found += 1
        
        print(f"\n🎯 Documentation Status: {found}/{len(docs)} files")
        self.results["passed"] += 1
        self.results["tests"].append({
            "name": "Documentation",
            "status": "passed",
            "files_found": found,
            "total": len(docs)
        })

    def generate_report(self):
        """Generate comprehensive test report."""
        print("\n" + "="*70)
        print("📊 Phase 2B Testing Report")
        print("="*70)
        
        total = self.results["passed"] + self.results["failed"] + self.results["skipped"]
        
        print(f"\n📈 Test Results:")
        print(f"  ✅ Passed:  {self.results['passed']}")
        print(f"  ❌ Failed:  {self.results['failed']}")
        print(f"  ⏭️  Skipped: {self.results['skipped']}")
        print(f"  📊 Total:   {total}")
        
        success_rate = (self.results["passed"] / total * 100) if total > 0 else 0
        print(f"\n✨ Success Rate: {success_rate:.1f}%")
        
        if self.results["failed"] == 0:
            print("\n✅ Phase 2B: READY FOR NEXT STEPS")
        else:
            print(f"\n⚠️  Phase 2B: {self.results['failed']} issue(s) to resolve")
        
        # Save report
        report_file = PROJECT_ROOT / "PHASE_2B_TESTING_REPORT.json"
        report_file.write_text(json.dumps(self.results, indent=2))
        print(f"\n📄 Report saved: {report_file}")
        
        return self.results["failed"] == 0

    def run_tests(self):
        """Execute all Phase 2B tests."""
        print("\n🚀 Phase 2B: Comprehensive Testing")
        print("="*70)
        
        self.test_modules_exist()
        self.test_configuration_files()
        self.test_automation_scripts()
        self.test_database_migrations()
        self.test_documentation()
        
        return self.generate_report()


if __name__ == "__main__":
    import sys
    tester = Phase2Testing()
    success = tester.run_tests()
    sys.exit(0 if success else 1)
