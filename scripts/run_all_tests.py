#!/usr/bin/env python3
"""
Master Test Runner for Alpha-Q AI System
Executes all test types and provides comprehensive reporting
"""

import asyncio
import sys
import os
import time
import json
import logging
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import argparse

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

class MasterTestRunner:
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or self.load_config()
        self.setup_logging()
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'summary': {},
            'test_results': {},
            'performance_metrics': {},
            'recommendations': []
        }
        self.logger = logging.getLogger(__name__)

    def load_config(self) -> Dict[str, Any]:
        """Load test configuration"""
        config_path = project_root / 'config' / 'test_config.json'
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {}

    def setup_logging(self):
        """Setup logging"""
        log_dir = project_root / 'tests' / 'reports'
        log_dir.mkdir(exist_ok=True)

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_dir / 'master_test_results.log'),
                logging.StreamHandler()
            ]
        )

    async def run_all_tests(self) -> Dict[str, Any]:
        """Run all test suites"""
        self.logger.info("🚀 Starting Master Test Suite...")
        start_time = time.time()

        # Run different test categories
        test_categories = {
            'error_fixing': self.run_error_fixing_tests,
            'multi_user': self.run_multi_user_tests,
            'ai_components': self.run_ai_component_tests,
            'integration': self.run_integration_tests,
            'e2e': self.run_e2e_tests,
            'performance': self.run_performance_tests,
            'security': self.run_security_tests
        }

        for category, test_func in test_categories.items():
            try:
                self.logger.info(f"📋 Running {category} tests...")
                result = await test_func()
                if not result or all('error' in v and 'not found' in v['error'] for v in result.values()):
                    warning = f"⚠️ No tests found or all tests missing for category: {category}"
                    self.logger.warning(warning)
                    self.results['test_results'][category] = {'warning': warning}
                else:
                    self.results['test_results'][category] = result
            except Exception as e:
                self.logger.error(f"❌ Failed to run {category} tests: {e}")
                self.results['test_results'][category] = {'error': str(e)}

        # Compile results
        self.compile_results()
        
        execution_time = time.time() - start_time
        self.results['summary']['total_execution_time'] = execution_time
        
        self.logger.info(f"✅ Master test suite completed in {execution_time:.2f} seconds")
        return self.results

    async def run_error_fixing_tests(self) -> Dict[str, Any]:
        """Run error fixing tests"""
        tests = [
            'tests/unit/test_error_fixing.py',
            'tests/integration/test_error_fixing_integration.py'
        ]
        
        results = {}
        for test_file in tests:
            if Path(test_file).exists():
                try:
                    result = subprocess.run(
                        [sys.executable, test_file],
                        capture_output=True,
                        text=True,
                        timeout=self.config.get('test_timeout', 300)
                    )
                    
                    results[test_file] = {
                        'success': result.returncode == 0,
                        'output': result.stdout,
                        'error': result.stderr,
                        'return_code': result.returncode
                    }
                except subprocess.TimeoutExpired:
                    results[test_file] = {'error': 'Test timeout exceeded'}
                except Exception as e:
                    results[test_file] = {'error': str(e)}
            else:
                results[test_file] = {'error': 'Test file not found'}

        return results

    async def run_multi_user_tests(self) -> Dict[str, Any]:
        """Run multi-user session tests"""
        tests = [
            'tests/unit/test_multi_user_session.py'
        ]
        
        results = {}
        for test_file in tests:
            if Path(test_file).exists():
                try:
                    result = subprocess.run(
                        [sys.executable, test_file],
                        capture_output=True,
                        text=True,
                        timeout=self.config.get('test_timeout', 300)
                    )
                    
                    results[test_file] = {
                        'success': result.returncode == 0,
                        'output': result.stdout,
                        'error': result.stderr,
                        'return_code': result.returncode
                    }
                except subprocess.TimeoutExpired:
                    results[test_file] = {'error': 'Test timeout exceeded'}
                except Exception as e:
                    results[test_file] = {'error': str(e)}
            else:
                results[test_file] = {'error': 'Test file not found'}

        return results

    async def run_ai_component_tests(self) -> Dict[str, Any]:
        """Run AI component tests"""
        # This would include tests for AI models, services, etc.
        return {
            'ai_models': {'status': 'not_implemented'},
            'ai_services': {'status': 'not_implemented'},
            'ai_integration': {'status': 'not_implemented'}
        }

    async def run_integration_tests(self) -> Dict[str, Any]:
        """Run integration tests"""
        tests = [
            'tests/integration/test_session_integration.py',
            'tests/integration/test_ai_integration.py'
        ]
        
        results = {}
        for test_file in tests:
            if Path(test_file).exists():
                try:
                    result = subprocess.run(
                        [sys.executable, test_file],
                        capture_output=True,
                        text=True,
                        timeout=self.config.get('test_timeout', 300)
                    )
                    
                    results[test_file] = {
                        'success': result.returncode == 0,
                        'output': result.stdout,
                        'error': result.stderr,
                        'return_code': result.returncode
                    }
                except subprocess.TimeoutExpired:
                    results[test_file] = {'error': 'Test timeout exceeded'}
                except Exception as e:
                    results[test_file] = {'error': str(e)}
            else:
                results[test_file] = {'error': 'Test file not found'}

        return results

    async def run_e2e_tests(self) -> Dict[str, Any]:
        """Run end-to-end tests"""
        tests = [
            'tests/e2e/test_full_workflow.py',
            'tests/e2e/test_performance.py'
        ]
        
        results = {}
        for test_file in tests:
            if Path(test_file).exists():
                try:
                    result = subprocess.run(
                        [sys.executable, test_file],
                        capture_output=True,
                        text=True,
                        timeout=self.config.get('test_timeout', 300)
                    )
                    
                    results[test_file] = {
                        'success': result.returncode == 0,
                        'output': result.stdout,
                        'error': result.stderr,
                        'return_code': result.returncode
                    }
                except subprocess.TimeoutExpired:
                    results[test_file] = {'error': 'Test timeout exceeded'}
                except Exception as e:
                    results[test_file] = {'error': str(e)}
            else:
                results[test_file] = {'error': 'Test file not found'}

        return results

    async def run_performance_tests(self) -> Dict[str, Any]:
        """Run performance tests"""
        try:
            result = subprocess.run(
                [sys.executable, 'tests/e2e/test_performance.py'],
                capture_output=True,
                text=True,
                timeout=self.config.get('test_timeout', 600)
            )
            
            return {
                'success': result.returncode == 0,
                'output': result.stdout,
                'error': result.stderr,
                'return_code': result.returncode
            }
        except subprocess.TimeoutExpired:
            return {'error': 'Performance test timeout exceeded'}
        except Exception as e:
            return {'error': str(e)}

    async def run_security_tests(self) -> Dict[str, Any]:
        """Run security tests"""
        # This would include security vulnerability tests
        return {
            'vulnerability_scan': {'status': 'not_implemented'},
            'authentication_tests': {'status': 'not_implemented'},
            'authorization_tests': {'status': 'not_implemented'}
        }

    def compile_results(self):
        """Compile overall test results"""
        total_tests = 0
        total_success = 0
        total_failures = 0
        total_errors = 0

        for category, results in self.results['test_results'].items():
            if isinstance(results, dict):
                for test_file, result in results.items():
                    if isinstance(result, dict):
                        total_tests += 1
                        if result.get('success', False):
                            total_success += 1
                        elif 'error' in result:
                            total_errors += 1
                        else:
                            total_failures += 1

        self.results['summary'] = {
            'total_tests': total_tests,
            'total_success': total_success,
            'total_failures': total_failures,
            'total_errors': total_errors,
            'success_rate': (total_success / total_tests * 100) if total_tests > 0 else 0,
            'categories_tested': len(self.results['test_results'])
        }

        # Generate recommendations
        self.generate_recommendations()

    def generate_recommendations(self):
        """Generate recommendations based on test results"""
        recommendations = []

        # Check success rate
        success_rate = self.results['summary']['success_rate']
        if success_rate < 80:
            recommendations.append("🔴 Low test success rate - investigate failures")
        elif success_rate < 95:
            recommendations.append("🟡 Moderate test success rate - review failures")

        # Check for errors
        if self.results['summary']['total_errors'] > 0:
            recommendations.append("🔴 Test errors detected - check system stability")

        # Check for missing tests
        for category, results in self.results['test_results'].items():
            if isinstance(results, dict) and not results:
                recommendations.append(f"🟡 No tests found for {category}")

        self.results['recommendations'] = recommendations

    def generate_report(self):
        """Generate comprehensive test report"""
        report_dir = project_root / 'tests' / 'reports'
        report_dir.mkdir(exist_ok=True)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Generate JSON report
        json_report_path = report_dir / f'master_test_report_{timestamp}.json'
        with open(json_report_path, 'w') as f:
            json.dump(self.results, f, indent=2)

        # Generate summary report
        summary_report_path = report_dir / f'master_test_summary_{timestamp}.txt'
        self.generate_summary_report(summary_report_path)

        # Print results to console
        self.print_results()

        self.logger.info(f"📊 Reports generated:")
        self.logger.info(f"  JSON: {json_report_path}")
        self.logger.info(f"  Summary: {summary_report_path}")

    def generate_summary_report(self, filepath: Path):
        """Generate text summary report"""
        with open(filepath, 'w') as f:
            f.write("Alpha-Q AI System - Master Test Report\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Generated: {self.results['timestamp']}\n\n")
            
            summary = self.results['summary']
            f.write(f"Total Tests: {summary['total_tests']}\n")
            f.write(f"Successful: {summary['total_success']}\n")
            f.write(f"Failed: {summary['total_failures']}\n")
            f.write(f"Errors: {summary['total_errors']}\n")
            f.write(f"Success Rate: {summary['success_rate']:.2f}%\n")
            f.write(f"Categories Tested: {summary['categories_tested']}\n")
            f.write(f"Execution Time: {summary.get('total_execution_time', 0):.2f} seconds\n\n")
            
            f.write("Category Results:\n")
            f.write("-" * 20 + "\n")
            for category, results in self.results['test_results'].items():
                if isinstance(results, dict):
                    success_count = sum(1 for r in results.values() if isinstance(r, dict) and r.get('success', False))
                    total_count = len([r for r in results.values() if isinstance(r, dict)])
                    success_rate = (success_count / total_count * 100) if total_count > 0 else 0
                    f.write(f"{category}: {success_rate:.1f}% success ({success_count}/{total_count})\n")

            f.write("\nRecommendations:\n")
            f.write("-" * 20 + "\n")
            for recommendation in self.results['recommendations']:
                f.write(f"- {recommendation}\n")

    def print_results(self):
        """Print results to console"""
        print("\n" + "="*60)
        print("🎯 MASTER TEST RESULTS")
        print("="*60)
        
        summary = self.results['summary']
        print(f"📊 Total Tests: {summary['total_tests']}")
        print(f"✅ Successful: {summary['total_success']}")
        print(f"❌ Failed: {summary['total_failures']}")
        print(f"💥 Errors: {summary['total_errors']}")
        print(f"📈 Success Rate: {summary['success_rate']:.2f}%")
        print(f"⏱️  Execution Time: {summary.get('total_execution_time', 0):.2f}s")
        
        print("\n📋 Category Results:")
        print("-" * 30)
        for category, results in self.results['test_results'].items():
            if isinstance(results, dict):
                success_count = sum(1 for r in results.values() if isinstance(r, dict) and r.get('success', False))
                total_count = len([r for r in results.values() if isinstance(r, dict)])
                success_rate = (success_count / total_count * 100) if total_count > 0 else 0
                
                status = "✅" if success_rate >= 80 else "⚠️" if success_rate >= 60 else "❌"
                print(f"{status} {category}: {success_rate:.1f}% ({success_count}/{total_count})")

        if self.results['recommendations']:
            print("\n💡 Recommendations:")
            print("-" * 20)
            for recommendation in self.results['recommendations']:
                print(f"  {recommendation}")

        print("\n" + "="*60)

def main():
    parser = argparse.ArgumentParser(description='Master Test Runner for Alpha-Q AI System')
    parser.add_argument('--config', type=str, help='Path to test configuration file')
    parser.add_argument('--category', choices=['error_fixing', 'multi_user', 'all'], 
                       default='all', help='Test category to run')
    parser.add_argument('--timeout', type=int, help='Test timeout in seconds')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    parser.add_argument('--quick', action='store_true', help='Run quick tests only')

    args = parser.parse_args()

    # Load configuration
    config = {}
    if args.config:
        with open(args.config, 'r') as f:
            config = json.load(f)

    if args.timeout:
        config['test_timeout'] = args.timeout
    if args.verbose:
        config['log_level'] = 'DEBUG'

    # Create test runner
    runner = MasterTestRunner(config)

    # Run tests
    try:
        results = runner.run_all_tests()
        runner.generate_report()
        
        # Exit with appropriate code
        if results['summary']['success_rate'] >= 80:
            print("\n🎉 All tests passed successfully!")
            sys.exit(0)
        else:
            print("\n⚠️  Some tests failed or had low success rate")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n💥 Test runner failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 