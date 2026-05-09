#!/usr/bin/env python3
"""
QMOI production Deployment Validator
Validates production readiness and deployment capabilities
"""

import os
import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

class QMOIProductionDeploymentValidator:
    def __init__(self, workspace_path: str):
        self.workspace = Path(workspace_path)
        self.validation_results = {}

    def validate_production_deployment(self) -> Dict[str, Any]:
        """Comprehensive production deployment validation"""
        print("🚀 Starting QMOI production Deployment Validation...")

        start_time = datetime.now()

        # Deployment validation phases
        validations = {
            'build_validation': self._validate_build_system,
            'dependency_validation': self._validate_dependencies,
            'configuration_validation': self._validate_configuration,
            'security_validation': self._validate_security_readiness,
            'performance_validation': self._validate_performance_readiness,
            'monitoring_validation': self._validate_monitoring_setup,
            'documentation_validation': self._validate_documentation_completeness,
            'deployment_readiness': self._validate_deployment_readiness
        }

        results = {}
        for phase, validator_func in validations.items():
            print(f"🔍 Validating {phase.replace('_', ' ').title()}...")
            try:
                result = validator_func()
                results[phase] = result
                status = "✅ PASSED" if result.get('passed', False) else "❌ FAILED"
                print(f"   {status}: {result.get('message', 'Completed')}")
            except Exception as e:
                results[phase] = {
                    'passed': False,
                    'message': f'Validation failed: {str(e)}',
                    'issues': [str(e)]
                }
                print(f"   ❌ FAILED: Exception - {str(e)}")

        # Calculate overall deployment readiness
        passed_validations = sum(1 for r in results.values() if r.get('passed', False))
        total_validations = len(results)
        readiness_score = int((passed_validations / total_validations) * 100)

        # Generate deployment report
        report = {
            'timestamp': datetime.now().isoformat(),
            'validation_type': 'PRODUCTION_DEPLOYMENT_VALIDATION',
            'readiness_score': readiness_score,
            'validations_passed': passed_validations,
            'total_validations': total_validations,
            'execution_time': (datetime.now() - start_time).total_seconds(),
            'deployment_ready': readiness_score == 100,
            'detailed_results': results,
            'recommendations': self._generate_deployment_recommendations(results, readiness_score)
        }

        # Save deployment validation report
        self._save_deployment_report(report)

        return report

    def _validate_build_system(self) -> Dict[str, Any]:
        """Validate build system readiness"""
        issues = []

        # Check for package.json and build scripts
        package_json = self.workspace / 'package.json'
        if not package_json.exists():
            issues.append("Missing package.json")
        else:
            try:
                with open(package_json, 'r') as f:
                    package_data = json.load(f)

                required_scripts = ['build', 'start', 'test']
                scripts = package_data.get('scripts', {})

                for script in required_scripts:
                    if script not in scripts:
                        issues.append(f"Missing build script: {script}")

                # Check for production dependencies
                dependencies = package_data.get('dependencies', {})
                PRODUCTION_dependencies = package_data.get('PRODUCTIONDependencies', {})

                if not dependencies:
                    issues.append("No production dependencies defined")

            except Exception as e:
                issues.append(f"Invalid package.json: {e}")

        # Check for build output directory
        build_dirs = ['build', 'dist', '.next']  # Common build output directories
        build_dir_exists = any((self.workspace / bd).exists() for bd in build_dirs)
        if not build_dir_exists:
            issues.append("No build output directory found (checked: build, dist, .next)")

        return {
            'passed': len(issues) == 0,
            'message': f"Build system validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_dependencies(self) -> Dict[str, Any]:
        """Validate dependency management"""
        issues = []

        # Check package-lock.json or yarn.lock
        lock_files = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
        has_lock_file = any((self.workspace / lf).exists() for lf in lock_files)

        if not has_lock_file:
            issues.append("Missing dependency lock file")

        # Check for Python requirements if applicable
        requirements_txt = self.workspace / 'requirements.txt'
        if requirements_txt.exists():
            try:
                with open(requirements_txt, 'r') as f:
                    requirements = f.read().strip()
                if not requirements:
                    issues.append("Empty requirements.txt")
            except Exception as e:
                issues.append(f"Invalid requirements.txt: {e}")

        # Check for security vulnerabilities (basic check)
        try:
            # Run npm audit if package.json exists
            if (self.workspace / 'package.json').exists():
                result = subprocess.run(['npm', 'audit', '--audit-level=moderate'],
                                      capture_output=True, text=True, cwd=self.workspace, timeout=30)
                if result.returncode != 0:
                    issues.append("Security vulnerabilities detected in dependencies")
        except:
            pass  # Skip if npm not available or times out

        return {
            'passed': len(issues) == 0,
            'message': f"Dependency validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_configuration(self) -> Dict[str, Any]:
        """Validate configuration files"""
        issues = []

        # Check for environment configuration
        env_files = ['.env', '.env.local', '.env.production', '.env.example']
        has_env_config = any((self.workspace / ef).exists() for ef in env_files)

        if not has_env_config:
            issues.append("No environment configuration files found")

        # Check for deployment configuration
        deploy_configs = ['vercel.json', 'netlify.toml', 'Dockerfile', 'docker-compose.yml']
        has_deploy_config = any((self.workspace / dc).exists() for dc in deploy_configs)

        if not has_deploy_config:
            issues.append("No deployment configuration found")

        # Check for TypeScript config if applicable
        tsconfig = self.workspace / 'tsconfig.json'
        if tsconfig.exists():
            try:
                with open(tsconfig, 'r') as f:
                    ts_config = json.load(f)

                # Check for strict mode
                compiler_options = ts_config.get('compilerOptions', {})
                if not compiler_options.get('strict', False):
                    issues.append("TypeScript strict mode not enabled")

            except Exception as e:
                issues.append(f"Invalid tsconfig.json: {e}")

        return {
            'passed': len(issues) == 0,
            'message': f"Configuration validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_security_readiness(self) -> Dict[str, Any]:
        """Validate security readiness"""
        issues = []

        # Check for .gitignore
        gitignore = self.workspace / '.gitignore'
        if not gitignore.exists():
            issues.append("Missing .gitignore file")
        else:
            try:
                with open(gitignore, 'r') as f:
                    gitignore_content = f.read()

                security_entries = ['.env', 'secrets.json', '*.key', '*.pem']
                for entry in security_entries:
                    if entry not in gitignore_content:
                        issues.append(f"Security-sensitive files not ignored: {entry}")

            except Exception as e:
                issues.append(f"Cannot read .gitignore: {e}")

        # Check for security monitoring
        security_script = self.workspace / 'security_monitor.py'
        if not security_script.exists():
            issues.append("Missing security monitoring script")

        return {
            'passed': len(issues) == 0,
            'message': f"Security validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_performance_readiness(self) -> Dict[str, Any]:
        """Validate performance readiness"""
        issues = []

        # Check for performance optimization script
        perf_script = self.workspace / 'optimize_performance.py'
        if not perf_script.exists():
            issues.append("Missing performance optimization script")

        # Check for large files (should be archived)
        large_files = []
        excluded_dirs = ['.git', 'archives', 'performance_optimized', 'node_modules', 'backups']
        for file_path in self.workspace.rglob('*'):
            if file_path.is_file():
                # Skip excluded directories
                if any(excl in str(file_path) for excl in excluded_dirs):
                    continue
                try:
                    size_mb = file_path.stat().st_size / (1024 * 1024)
                    if size_mb > 50:
                        large_files.append(file_path.name)
                except:
                    pass

        if large_files:
            issues.append(f"Large files still present: {len(large_files)} files")

        # Check for performance monitoring
        perf_config = self.workspace / 'performance_config.json'
        if not perf_config.exists():
            issues.append("Missing performance configuration")

        return {
            'passed': len(issues) == 0,
            'message': f"Performance validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_monitoring_setup(self) -> Dict[str, Any]:
        """Validate monitoring setup"""
        issues = []

        # Check for health monitoring
        health_monitor = self.workspace / 'comprehensive_health_monitor.py'
        if not health_monitor.exists():
            issues.append("Missing comprehensive health monitor")

        # Check for monitoring configuration
        monitor_config = self.workspace / 'health_dashboard_config.json'
        if not monitor_config.exists():
            issues.append("Missing monitoring dashboard configuration")

        # Check for integration health check
        integration_check = self.workspace / 'integration_health_check.py'
        if not integration_check.exists():
            issues.append("Missing integration health check")

        return {
            'passed': len(issues) == 0,
            'message': f"Monitoring validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_documentation_completeness(self) -> Dict[str, Any]:
        """Validate documentation completeness"""
        issues = []

        # Check for essential documentation
        essential_docs = [
            'README.md',
            'DEPLOYMENT_HEALTH_CHECKLIST.md',
            'PRODUCTION_READINESS_FINAL.md',
            'ALLHEALTHS.md'
        ]

        for doc in essential_docs:
            if not (self.workspace / doc).exists():
                issues.append(f"Missing essential documentation: {doc}")

        # Check documentation health
        readme = self.workspace / 'README.md'
        if readme.exists():
            try:
                with open(readme, 'r') as f:
                    readme_content = f.read()

                if len(readme_content.strip()) < 100:
                    issues.append("README.md too short or incomplete")

                # Check for deployment instructions
                if 'deploy' not in readme_content.lower():
                    issues.append("README.md missing deployment instructions")

            except Exception as e:
                issues.append(f"Cannot read README.md: {e}")

        return {
            'passed': len(issues) == 0,
            'message': f"Documentation validation: {len(issues)} issues found",
            'issues': issues
        }

    def _validate_deployment_readiness(self) -> Dict[str, Any]:
        """Validate overall deployment readiness"""
        issues = []

        # Check for deployment checklist completion
        checklist = self.workspace / 'DEPLOYMENT_HEALTH_CHECKLIST.md'
        if checklist.exists():
            try:
                with open(checklist, 'r') as f:
                    content = f.read()

                # Check if all checklist items are marked as complete
                unchecked_items = content.count('- [ ]')
                if unchecked_items > 0:
                    issues.append(f"Deployment checklist has {unchecked_items} incomplete items")

            except Exception as e:
                issues.append(f"Cannot read deployment checklist: {e}")

        # Check for production migration completion
        resumefromhere = self.workspace / 'resumefromhere.txt'
        if resumefromhere.exists():
            try:
                with open(resumefromhere, 'r') as f:
                    content = f.read()
                if 'COMPLETE' not in content:
                    issues.append("production migration not confirmed complete")
            except Exception as e:
                issues.append(f"Cannot read migration status: {e}")

        # Check for final health validation
        final_health = self.workspace / 'final_100_percent_health_report.json'
        if not final_health.exists():
            issues.append("Missing final health validation report")
        else:
            try:
                with open(final_health, 'r') as f:
                    health_data = json.load(f)
                if not health_data.get('health_achieved', False):
                    issues.append("Final health validation not passed")
            except Exception as e:
                issues.append(f"Invalid health report: {e}")

        return {
            'passed': len(issues) == 0,
            'message': f"Deployment readiness validation: {len(issues)} issues found",
            'issues': issues
        }

    def _generate_deployment_recommendations(self, results: Dict, readiness_score: int) -> List[str]:
        """Generate deployment recommendations"""
        recommendations = []

        if readiness_score < 100:
            recommendations.append("Address all validation failures before deployment")
            recommendations.append("Review and fix configuration issues")
            recommendations.append("Complete all documentation requirements")

        failed_validations = [k for k, v in results.items() if not v.get('passed', False)]
        for validation in failed_validations:
            recommendations.append(f"Fix issues in {validation.replace('_', ' ')}")

        if readiness_score >= 95:
            recommendations.append("System is near deployment-ready - minor fixes needed")
            recommendations.append("Run final deployment test before production release")

        if readiness_score == 100:
            recommendations.append("🎉 SYSTEM READY FOR production DEPLOYMENT!")
            recommendations.append("All validations passed - proceed with deployment")
            recommendations.append("Monitor health systems post-deployment")

        return recommendations

    def _save_deployment_report(self, report: Dict[str, Any]):
        """Save deployment validation report"""
        report_file = self.workspace / 'production_deployment_validation_report.json'
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

if __name__ == '__main__':
    validator = QMOIProductionDeploymentValidator('/workspaces/qmoi-enhanced')
    report = validator.validate_production_deployment()

    print("\n" + "="*80)
    print("🚀 production DEPLOYMENT VALIDATION COMPLETE")
    print("="*80)
    print(f"📊 Deployment Readiness Score: {report['readiness_score']}%")
    print(f"✅ Validations Passed: {report['validations_passed']}/{report['total_validations']}")
    print(f"⏱️  Execution Time: {report['execution_time']:.2f} seconds")
    print(f"🎯 Deployment Ready: {report['deployment_ready']}")
    print("="*80)

    if report['deployment_ready']:
        print("🏆 CONGRATULATIONS! System is ready for production deployment!")
    else:
        print("📋 Recommendations:")
        for rec in report['recommendations']:
            print(f"  • {rec}")