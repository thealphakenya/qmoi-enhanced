#!/usr/bin/env python3
"""
QMOI Auto-Deployment Script
Handles automated deployment, testing, and optimization of the QMOI system
"""

import os
import sys
import json
import time
import subprocess
import logging
from pathlib import Path
from typing import Dict, List, Optional
import argparse
import requests
from datetime import datetime

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/auto_deploy.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIAutoDeploy:
    def __init__(self, environment: str = 'production', force_upgrade: bool = False):
        self.environment = environment
        self.force_upgrade = force_upgrade
        self.root_dir = Path(__file__).parent.parent.parent
        self.logs_dir = self.root_dir / 'logs'
        self.reports_dir = self.root_dir / 'reports'
        
        # Ensure directories exist
        self.logs_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        
        # Load configuration
        self.config = self.load_config()
        
        # Initialize deployment status
        self.deployment_status = {
            'start_time': datetime.now().isoformat(),
            'environment': environment,
            'steps_completed': [],
            'errors': [],
            'warnings': [],
            'performance_metrics': {}
        }

    def load_config(self) -> Dict:
        """Load deployment configuration"""
        config_path = self.root_dir / 'config' / 'deployment_config.json'
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        else:
            # Default configuration
            return {
                'environments': {
                    'development': {
                        'url': 'http://localhost:3000',
                        'auto_restart': True,
                        'health_check_timeout': 30
                    },
                    'staging': {
                        'url': 'https://staging.qmoi.ai',
                        'auto_restart': True,
                        'health_check_timeout': 60
                    },
                    'production': {
                        'url': 'https://qmoi.ai',
                        'auto_restart': False,
                        'health_check_timeout': 120
                    }
                },
                'deployment_steps': [
                    'pre_deployment_checks',
                    'dependency_installation',
                    'build_optimization',
                    'quality_checks',
                    'security_audit',
                    'testing',
                    'deployment',
                    'post_deployment_checks',
                    'monitoring_setup'
                ]
            }

    def run_command(self, command: List[str], cwd: Optional[Path] = None) -> Dict:
        """Run a command and return results"""
        try:
            logger.info(f"Running command: {' '.join(command)}")
            start_time = time.time()
            
            result = subprocess.run(
                command,
                cwd=cwd or self.root_dir,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            
            execution_time = time.time() - start_time
            
            return {
                'success': result.returncode == 0,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'return_code': result.returncode,
                'execution_time': execution_time
            }
        except subprocess.TimeoutExpired:
            logger.error(f"Command timed out: {' '.join(command)}")
            return {
                'success': False,
                'stdout': '',
                'stderr': 'Command timed out',
                'return_code': -1,
                'execution_time': 300
            }
        except Exception as e:
            logger.error(f"Error running command: {e}")
            return {
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'return_code': -1,
                'execution_time': 0
            }

    def pre_deployment_checks(self) -> bool:
        """Run pre-deployment checks"""
        logger.info("Running pre-deployment checks...")
        
        checks = [
            ['node', '--version'],
            ['npm', '--version'],
            ['python', '--version'],
            ['git', 'status'],
            ['git', 'log', '--oneline', '-5']
        ]
        
        all_passed = True
        for check in checks:
            result = self.run_command(check)
            if not result['success']:
                logger.error(f"Pre-deployment check failed: {' '.join(check)}")
                all_passed = False
            else:
                logger.info(f"Check passed: {' '.join(check)} - {result['stdout'].strip()}")
        
        self.deployment_status['steps_completed'].append('pre_deployment_checks')
        return all_passed

    def install_dependencies(self) -> bool:
        """Install and update dependencies"""
        logger.info("Installing dependencies...")
        
        # Install Node.js dependencies
        npm_result = self.run_command(['npm', 'ci'])
        if not npm_result['success']:
            logger.error("Failed to install npm dependencies")
            return False
        
        # Install Python dependencies
        pip_result = self.run_command([
            'pip', 'install', '-r', 'requirements/ai_automation.txt'
        ])
        if not pip_result['success']:
            logger.error("Failed to install Python dependencies")
            return False
        
        # Upgrade dependencies if forced
        if self.force_upgrade:
            logger.info("Force upgrading dependencies...")
            self.run_command(['npm', 'update'])
            self.run_command(['pip', 'install', '--upgrade', '-r', 'requirements/ai_automation.txt'])
        
        self.deployment_status['steps_completed'].append('dependency_installation')
        return True

    def optimize_build(self) -> bool:
        """Optimize build process"""
        logger.info("Optimizing build...")
        
        # Run build optimization
        build_result = self.run_command(['npm', 'run', 'build:optimized'])
        if not build_result['success']:
            logger.error("Build optimization failed")
            return False
        
        # Run bundle analysis
        bundle_result = self.run_command(['npm', 'run', 'analyze'])
        if bundle_result['success']:
            logger.info("Bundle analysis completed")
        
        self.deployment_status['steps_completed'].append('build_optimization')
        return True

    def run_quality_checks(self) -> bool:
        """Run quality checks"""
        logger.info("Running quality checks...")
        
        quality_checks = [
            ['npm', 'run', 'lint'],
            ['npm', 'run', 'type-check'],
            ['npm', 'run', 'test:unit'],
            ['python', '-m', 'pytest', 'tests/unit/', '--cov=src']
        ]
        
        all_passed = True
        for check in quality_checks:
            result = self.run_command(check)
            if not result['success']:
                logger.warning(f"Quality check failed: {' '.join(check)}")
                all_passed = False
            else:
                logger.info(f"Quality check passed: {' '.join(check)}")
        
        self.deployment_status['steps_completed'].append('quality_checks')
        return all_passed

    def run_security_audit(self) -> bool:
        """Run security audit"""
        logger.info("Running security audit...")
        
        security_checks = [
            ['npm', 'audit', '--audit-level', 'moderate'],
            ['pip-audit'],
            ['safety', 'check']
        ]
        
        all_passed = True
        for check in security_checks:
            result = self.run_command(check)
            if not result['success']:
                logger.warning(f"Security check failed: {' '.join(check)}")
                all_passed = False
            else:
                logger.info(f"Security check passed: {' '.join(check)}")
        
        self.deployment_status['steps_completed'].append('security_audit')
        return all_passed

    def run_tests(self) -> bool:
        """Run comprehensive tests"""
        logger.info("Running comprehensive tests...")
        
        test_suites = [
            ['npm', 'run', 'test'],
            ['npm', 'run', 'test:integration'],
            ['npm', 'run', 'test:e2e'],
            ['python', '-m', 'pytest', 'tests/integration/'],
            ['python', '-m', 'pytest', 'tests/e2e/']
        ]
        
        all_passed = True
        for test in test_suites:
            result = self.run_command(test)
            if not result['success']:
                logger.error(f"Test failed: {' '.join(test)}")
                all_passed = False
            else:
                logger.info(f"Test passed: {' '.join(test)}")
        
        self.deployment_status['steps_completed'].append('testing')
        return all_passed

    def deploy(self) -> bool:
        """Deploy the application"""
        logger.info(f"Deploying to {self.environment}...")
        
        # Build for specific environment
        build_command = ['npm', 'run', f'build:{self.environment}']
        build_result = self.run_command(build_command)
        if not build_result['success']:
            logger.error("Build failed")
            return False
        
        # Deploy based on environment
        if self.environment == 'development':
            return self.deploy_development()
        elif self.environment == 'staging':
            return self.deploy_staging()
        elif self.environment == 'production':
            return self.deploy_production()
        else:
            logger.error(f"Unknown environment: {self.environment}")
            return False

    def deploy_development(self) -> bool:
        """Deploy to development environment"""
        logger.info("Deploying to development...")
        
        # Start development server
        dev_result = self.run_command(['npm', 'run', 'dev'])
        if not dev_result['success']:
            logger.error("Failed to start development server")
            return False
        
        self.deployment_status['steps_completed'].append('deployment')
        return True

    def deploy_staging(self) -> bool:
        """Deploy to staging environment"""
        logger.info("Deploying to staging...")
        
        # Deploy to staging platform (e.g., Vercel, Netlify)
        deploy_result = self.run_command(['npm', 'run', 'deploy:staging'])
        if not deploy_result['success']:
            logger.error("Failed to deploy to staging")
            return False
        
        self.deployment_status['steps_completed'].append('deployment')
        return True

    def deploy_production(self) -> bool:
        """Deploy to production environment"""
        logger.info("Deploying to production...")
        
        # Deploy to multiple platforms
        deployments = [
            ['npm', 'run', 'deploy:production'],
            ['python', 'scripts/deployment/huggingface_deploy.py'],
            ['python', 'scripts/deployment/colab_deploy.py']
        ]
        
        all_successful = True
        for deploy in deployments:
            result = self.run_command(deploy)
            if not result['success']:
                logger.error(f"Deployment failed: {' '.join(deploy)}")
                all_successful = False
            else:
                logger.info(f"Deployment successful: {' '.join(deploy)}")
        
        self.deployment_status['steps_completed'].append('deployment')
        return all_successful

    def post_deployment_checks(self) -> bool:
        """Run post-deployment checks"""
        logger.info("Running post-deployment checks...")
        
        # Health check
        health_result = self.health_check()
        if not health_result:
            logger.error("Health check failed")
            return False
        
        # Performance check
        performance_result = self.performance_check()
        if not performance_result:
            logger.warning("Performance check failed")
        
        # Smoke tests
        smoke_result = self.run_command(['npm', 'run', 'test:smoke'])
        if not smoke_result['success']:
            logger.error("Smoke tests failed")
            return False
        
        self.deployment_status['steps_completed'].append('post_deployment_checks')
        return True

    def health_check(self) -> bool:
        """Check application health"""
        try:
            url = self.config['environments'][self.environment]['url']
            timeout = self.config['environments'][self.environment]['health_check_timeout']
            
            response = requests.get(f"{url}/api/health", timeout=timeout)
            if response.status_code == 200:
                logger.info("Health check passed")
                return True
            else:
                logger.error(f"Health check failed: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Health check error: {e}")
            return False

    def performance_check(self) -> bool:
        """Check application performance"""
        try:
            # Run performance tests
            perf_result = self.run_command(['npm', 'run', 'test:performance'])
            if perf_result['success']:
                logger.info("Performance check passed")
                return True
            else:
                logger.warning("Performance check failed")
                return False
        except Exception as e:
            logger.error(f"Performance check error: {e}")
            return False

    def setup_monitoring(self) -> bool:
        """Setup monitoring and alerting"""
        logger.info("Setting up monitoring...")
        
        # Start monitoring services
        monitoring_commands = [
            ['python', 'scripts/monitoring/start_monitoring.py'],
            ['python', 'scripts/monitoring/performance_monitoring.py']
        ]
        
        all_successful = True
        for cmd in monitoring_commands:
            result = self.run_command(cmd)
            if not result['success']:
                logger.warning(f"Monitoring setup failed: {' '.join(cmd)}")
                all_successful = False
            else:
                logger.info(f"Monitoring setup successful: {' '.join(cmd)}")
        
        self.deployment_status['steps_completed'].append('monitoring_setup')
        return all_successful

    def generate_report(self) -> None:
        """Generate deployment report"""
        logger.info("Generating deployment report...")
        
        self.deployment_status['end_time'] = datetime.now().isoformat()
        self.deployment_status['total_duration'] = (
            datetime.fromisoformat(self.deployment_status['end_time']) -
            datetime.fromisoformat(self.deployment_status['start_time'])
        ).total_seconds()
        
        report_path = self.reports_dir / f'deployment_report_{self.environment}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(report_path, 'w') as f:
            json.dump(self.deployment_status, f, indent=2, default=str)
        
        logger.info(f"Deployment report saved to: {report_path}")

    def notify_deployment(self, success: bool) -> None:
        """Notify about deployment status"""
        logger.info("Sending deployment notification...")
        
        try:
            notification_script = self.root_dir / 'scripts' / 'utils' / 'notify_deployment.py'
            if notification_script.exists():
                status = 'success' if success else 'failure'
                self.run_command([
                    'python', str(notification_script),
                    '--environment', self.environment,
                    '--status', status
                ])
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")

    def run_full_deployment(self) -> bool:
        """Run the complete deployment process"""
        logger.info(f"Starting QMOI auto-deployment for {self.environment}")
        
        deployment_steps = self.config['deployment_steps']
        all_successful = True
        
        for step in deployment_steps:
            logger.info(f"Executing step: {step}")
            
            if step == 'pre_deployment_checks':
                success = self.pre_deployment_checks()
            elif step == 'dependency_installation':
                success = self.install_dependencies()
            elif step == 'build_optimization':
                success = self.optimize_build()
            elif step == 'quality_checks':
                success = self.run_quality_checks()
            elif step == 'security_audit':
                success = self.run_security_audit()
            elif step == 'testing':
                success = self.run_tests()
            elif step == 'deployment':
                success = self.deploy()
            elif step == 'post_deployment_checks':
                success = self.post_deployment_checks()
            elif step == 'monitoring_setup':
                success = self.setup_monitoring()
            else:
                logger.warning(f"Unknown deployment step: {step}")
                success = True
            
            if not success:
                logger.error(f"Deployment step failed: {step}")
                all_successful = False
                if step in ['pre_deployment_checks', 'dependency_installation', 'build_optimization']:
                    break  # Critical steps, stop deployment
        
        # Generate report and notify
        self.generate_report()
        self.notify_deployment(all_successful)
        
        if all_successful:
            logger.info("QMOI deployment completed successfully!")
        else:
            logger.error("QMOI deployment failed!")
        
        return all_successful

def main():
    parser = argparse.ArgumentParser(description='QMOI Auto-Deployment Script')
    parser.add_argument('--environment', '-e', 
                       choices=['development', 'staging', 'production'],
                       default='production',
                       help='Deployment environment')
    parser.add_argument('--force-upgrade', '-f',
                       action='store_true',
                       help='Force upgrade all dependencies')
    parser.add_argument('--dry-run', '-d',
                       action='store_true',
                       help='Run in dry-run mode (no actual deployment)')
    
    args = parser.parse_args()
    
    if args.dry_run:
        logger.info("Running in dry-run mode")
        return
    
    deployer = QMOIAutoDeploy(
        environment=args.environment,
        force_upgrade=args.force_upgrade
    )
    
    success = deployer.run_full_deployment()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main() 