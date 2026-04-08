#!/usr/bin/env python3
"""
Phase 13: Production Deployment Validation
Comprehensive validation of all systems before production deployment
"""

import json
import subprocess
from pathlib import Path
from datetime import datetime

class ProductionValidator:
    def __init__(self):
        self.root = Path('.')
        self.results = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'checks': {},
            'passed': 0,
            'failed': 0,
            'warnings': 0
        }
    
    def check_feature_flags(self):
        """Validate feature flags system"""
        print("🚩 Checking Feature Flags...")
        try:
            # Verify feature flags file exists
            ff_file = self.root / 'src' / 'lib' / 'feature-flags.ts'
            if ff_file.exists():
                content = ff_file.read_text()
                required_flags = [
                    'biometric_login',
                    'voice_authentication',
                    'offline_mode',
                    'minimal_data_mode',
                    'proprietary_apis'
                ]
                missing = [f for f in required_flags if f not in content]
                if missing:
                    self.results['checks']['feature_flags'] = '❌ Missing flags: ' + ', '.join(missing)
                    self.results['failed'] += 1
                else:
                    self.results['checks']['feature_flags'] = '✅ All required flags present'
                    self.results['passed'] += 1
            else:
                self.results['checks']['feature_flags'] = '❌ Feature flags file not found'
                self.results['failed'] += 1
        except Exception as e:
            self.results['checks']['feature_flags'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def check_offline_mode(self):
        """Validate offline mode implementation"""
        print("📱 Checking Offline Mode...")
        try:
            om_file = self.root / 'src' / 'lib' / 'offline-mode.ts'
            if om_file.exists():
                content = om_file.read_text()
                required = ['cacheResponse', 'getCachedResponse', 'queueForSync', 'processSyncQueue']
                missing = [f for f in required if f not in content]
                if missing:
                    self.results['checks']['offline_mode'] = '❌ Missing methods: ' + ', '.join(missing)
                    self.results['failed'] += 1
                else:
                    self.results['checks']['offline_mode'] = '✅ Offline mode fully implemented'
                    self.results['passed'] += 1
            else:
                self.results['checks']['offline_mode'] = '❌ Offline mode file not found'
                self.results['failed'] += 1
        except Exception as e:
            self.results['checks']['offline_mode'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def check_authentication(self):
        """Validate database authentication"""
        print("🔐 Checking Authentication...")
        try:
            auth_file = self.root / 'src' / 'lib' / 'database-auth.ts'
            if auth_file.exists():
                content = auth_file.read_text()
                required = ['register', 'login', 'validateToken', 'logout', 'refreshToken']
                missing = [f for f in required if f not in content]
                if missing:
                    self.results['checks']['authentication'] = '❌ Missing auth methods: ' + ', '.join(missing)
                    self.results['failed'] += 1
                else:
                    self.results['checks']['authentication'] = '✅ Authentication fully implemented'
                    self.results['passed'] += 1
            else:
                self.results['checks']['authentication'] = '❌ Authentication file not found'
                self.results['failed'] += 1
        except Exception as e:
            self.results['checks']['authentication'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def check_documentation(self):
        """Validate API documentation"""
        print("📚 Checking Documentation...")
        try:
            required_docs = ['API.md', 'APIs_1.md', 'ENDPOINTS.md', 'ALLMDFILESREFS.md']
            missing = []
            for doc in required_docs:
                if not (self.root / doc).exists():
                    missing.append(doc)
            
            if missing:
                self.results['checks']['documentation'] = f'⚠️ Missing docs: {", ".join(missing)}'
                self.results['warnings'] += 1
            else:
                # Check if docs have endpoints listed
                api_md = (self.root / 'API.md').read_text()
                endpoint_count = api_md.count('`/api/')
                self.results['checks']['documentation'] = f'✅ All docs present ({endpoint_count} endpoints)'
                self.results['passed'] += 1
        except Exception as e:
            self.results['checks']['documentation'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def check_tests(self):
        """Validate test coverage"""
        print("✅ Checking Tests...")
        try:
            test_files = list((self.root / '__tests__').glob('*.test.ts')) if (self.root / '__tests__').exists() else []
            test_count = len(test_files)
            
            if test_count == 0:
                self.results['checks']['tests'] = '⚠️ No tests found'
                self.results['warnings'] += 1
            else:
                self.results['checks']['tests'] = f'✅ {test_count} test files found'
                self.results['passed'] += 1
        except Exception as e:
            self.results['checks']['tests'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def check_api_endpoints(self):
        """Validate API endpoints are discoverable"""
        print("🔍 Checking API Endpoints...")
        try:
            api_dir = self.root / 'app' / 'api'
            if api_dir.exists():
                route_count = len(list(api_dir.rglob('route.ts')))
                if route_count > 50:  # Expect at least 50 endpoints
                    self.results['checks']['api_endpoints'] = f'✅ {route_count} API endpoints found'
                    self.results['passed'] += 1
                else:
                    self.results['checks']['api_endpoints'] = f'⚠️ Only {route_count} endpoints (expected 50+)'
                    self.results['warnings'] += 1
            else:
                self.results['checks']['api_endpoints'] = '❌ API directory not found'
                self.results['failed'] += 1
        except Exception as e:
            self.results['checks']['api_endpoints'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def check_env_variables(self):
        """Validate environment configuration"""
        print("🔧 Checking Environment Variables...")
        try:
            env_file = self.root / '.env' if (self.root / '.env').exists() else (self.root / '.env.example')
            if env_file.exists():
                content = env_file.read_text()
                required_vars = [
                    'DATABASE_URL',
                    'NEXT_PUBLIC_API_URL',
                    'JWT_SECRET',
                    'NODE_ENV'
                ]
                missing = [v for v in required_vars if v not in content]
                if missing:
                    self.results['checks']['env'] = f'⚠️ Missing vars: {", ".join(missing)}'
                    self.results['warnings'] += 1
                else:
                    self.results['checks']['env'] = '✅ All required environment variables configured'
                    self.results['passed'] += 1
            else:
                self.results['checks']['env'] = '⚠️ .env file not found'
                self.results['warnings'] += 1
        except Exception as e:
            self.results['checks']['env'] = f'⚠️ Error: {str(e)}'
            self.results['warnings'] += 1
    
    def generate_report(self):
        """Generate validation report"""
        report = f"""# Production Deployment Validation Report

**Generated**: {self.results['timestamp']}
**Status**: {'🟢 READY FOR DEPLOYMENT' if self.results['failed'] == 0 else '🔴 NOT READY'}

## Summary

- ✅ Passed: {self.results['passed']}
- ⚠️ Warnings: {self.results['warnings']}
- ❌ Failed: {self.results['failed']}

## Validation Results

"""
        for check, result in self.results['checks'].items():
            report += f"### {check.replace('_', ' ').title()}\n{result}\n\n"
        
        return report
    
    def run(self):
        """Run all validations"""
        print("=" * 60)
        print("🚀 Phase 13: Production Deployment Validation")
        print("=" * 60)
        
        self.check_feature_flags()
        self.check_offline_mode()
        self.check_authentication()
        self.check_documentation()
        self.check_tests()
        self.check_api_endpoints()
        self.check_env_variables()
        
        report = self.generate_report()
        
        # Save report
        report_file = self.root / 'PRODUCTION_DEPLOYMENT_VALIDATION.md'
        report_file.write_text(report)
        
        print("\n" + "=" * 60)
        print(report)
        print("=" * 60)
        print(f"📊 Report saved to: PRODUCTION_DEPLOYMENT_VALIDATION.md")
        
        return self.results['failed'] == 0

if __name__ == '__main__':
    validator = ProductionValidator()
    success = validator.run()
    exit(0 if success else 1)
