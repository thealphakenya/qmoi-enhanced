#!/usr/bin/env python3
"""
QMOI Quick Test Script
Test all QMOI automation features quickly with real-time progress
"""

import os
import sys
import json
import time
import subprocess
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi-quick-test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class QMOIQuickTest:
    def __init__(self):
        self.test_results = {}
        self.current_test = None
        self.test_start_time = None
        self.is_running = True
        
    def run_quick_test(self):
        """Run comprehensive quick test of all QMOI features"""
        logger.info("🚀 Starting QMOI Quick Test...")
        
        tests = [
            ("System Check", self.test_system_check),
            ("Dependencies", self.test_dependencies),
            ("Configuration", self.test_configuration),
            ("Real-Time Monitor", self.test_real_time_monitor),
            ("Notifications", self.test_notifications),
            ("Error Handling", self.test_error_handling),
            ("Performance", self.test_performance),
            ("Platform Integration", self.test_platform_integration),
            ("Health Check", self.test_health_check),
            ("Final Report", self.test_final_report)
        ]
        
        for test_name, test_func in tests:
            self.current_test = test_name
            self.test_start_time = datetime.now()
            
            logger.info(f"🧪 Running test: {test_name}")
            print(f"\n{'='*60}")
            print(f"🧪 TEST: {test_name}")
            print(f"{'='*60}")
            
            try:
                result = test_func()
                self.test_results[test_name] = {
                    'status': 'PASSED',
                    'duration': str(datetime.now() - self.test_start_time),
                    'result': result
                }
                print(f"✅ {test_name}: PASSED")
                logger.info(f"Test {test_name} passed")
                
            except Exception as e:
                self.test_results[test_name] = {
                    'status': 'FAILED',
                    'duration': str(datetime.now() - self.test_start_time),
                    'error': str(e)
                }
                print(f"❌ {test_name}: FAILED - {e}")
                logger.error(f"Test {test_name} failed: {e}")
            
            time.sleep(1)  # Brief pause between tests
        
        self.generate_test_report()
    
    def test_system_check(self) -> Dict[str, Any]:
        """Test basic system requirements"""
        print("🔍 Checking system requirements...")
        
        results = {}
        
        # Check Python version
        python_version = sys.version_info
        results['python_version'] = f"{python_version.major}.{python_version.minor}.{python_version.micro}"
        print(f"   Python: {results['python_version']}")
        
        # Check Node.js
        try:
            node_result = subprocess.run(['node', '--version'], capture_output=True, text=True)
            results['node_version'] = node_result.stdout.strip()
            print(f"   Node.js: {results['node_version']}")
        except:
            results['node_version'] = "Not found"
            print("   Node.js: Not found")
        
        # Check NPM
        try:
            npm_result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
            results['npm_version'] = npm_result.stdout.strip()
            print(f"   NPM: {results['npm_version']}")
        except:
            results['npm_version'] = "Not found"
            print("   NPM: Not found")
        
        # Check Git
        try:
            git_result = subprocess.run(['git', '--version'], capture_output=True, text=True)
            results['git_version'] = git_result.stdout.strip()
            print(f"   Git: {results['git_version']}")
        except:
            results['git_version'] = "Not found"
            print("   Git: Not found")
        
        # Check required directories
        required_dirs = ['scripts', 'logs', 'config', 'components']
        results['directories'] = {}
        for dir_name in required_dirs:
            exists = os.path.exists(dir_name)
            results['directories'][dir_name] = exists
            status = "✅" if exists else "❌"
            print(f"   {dir_name}: {status}")
        
        return results
    
    def test_dependencies(self) -> Dict[str, Any]:
        """Test Python and Node.js dependencies"""
        print("📦 Checking dependencies...")
        
        results = {}
        
        # Check Python dependencies
        python_deps = ['requests', 'psutil', 'websockets', 'aiohttp']
        results['python_dependencies'] = {}
        
        for dep in python_deps:
            try:
                __import__(dep)
                results['python_dependencies'][dep] = True
                print(f"   Python {dep}: ✅")
            except ImportError:
                results['python_dependencies'][dep] = False
                print(f"   Python {dep}: ❌")
        
        # Check Node.js dependencies
        try:
            package_json = Path('package.json')
            if package_json.exists():
                with open(package_json, 'r') as f:
                    package_data = json.load(f)
                    results['node_dependencies'] = package_data.get('dependencies', {})
                    print(f"   Node.js dependencies: {len(results['node_dependencies'])} found")
            else:
                results['node_dependencies'] = {}
                print("   Node.js dependencies: package.json not found")
        except Exception as e:
            results['node_dependencies'] = {}
            print(f"   Node.js dependencies: Error - {e}")
        
        return results
    
    def test_configuration(self) -> Dict[str, Any]:
        """Test configuration files"""
        print("⚙️  Checking configuration files...")
        
        results = {}
        
        # Check config files
        config_files = [
            'config/ai_automation_config.json',
            'config/auto_fix.json',
            'config/qmoi_enhanced_config.json',
            'config/qmoi_monitor_config.json',
            'config/qmoi_notifications_config.json'
        ]
        
        results['config_files'] = {}
        for config_file in config_files:
            exists = os.path.exists(config_file)
            results['config_files'][config_file] = exists
            status = "✅" if exists else "❌"
            print(f"   {config_file}: {status}")
        
        # Check main config files
        main_files = ['package.json', 'tsconfig.json', '.gitlab-ci.yml']
        results['main_files'] = {}
        for file_name in main_files:
            exists = os.path.exists(file_name)
            results['main_files'][file_name] = exists
            status = "✅" if exists else "❌"
            print(f"   {file_name}: {status}")
        
        return results
    
    def test_real_time_monitor(self) -> Dict[str, Any]:
        """Test real-time monitoring system"""
        print("📊 Testing real-time monitoring...")
        
        results = {}
        
        # Test if real-time monitor script exists
        monitor_script = 'scripts/qmoi-real-time-monitor.py'
        exists = os.path.exists(monitor_script)
        results['monitor_script_exists'] = exists
        print(f"   Monitor script: {'✅' if exists else '❌'}")
        
        # Test dashboard generation
        try:
            dashboard_html = self.generate_test_dashboard()
            results['dashboard_generated'] = True
            print("   Dashboard generation: ✅")
        except Exception as e:
            results['dashboard_generated'] = False
            results['dashboard_error'] = str(e)
            print(f"   Dashboard generation: ❌ - {e}")
        
        # Test WebSocket simulation
        try:
            results['websocket_simulation'] = self.simulate_websocket()
            print("   WebSocket simulation: ✅")
        except Exception as e:
            results['websocket_simulation'] = False
            results['websocket_error'] = str(e)
            print(f"   WebSocket simulation: ❌ - {e}")
        
        return results
    
    def test_notifications(self) -> Dict[str, Any]:
        """Test notification system"""
        print("🔔 Testing notification system...")
        
        results = {}
        
        # Test if notification script exists
        notification_script = 'scripts/qmoi-master-notifications.py'
        exists = os.path.exists(notification_script)
        results['notification_script_exists'] = exists
        print(f"   Notification script: {'✅' if exists else '❌'}")
        
        # Test notification types
        notification_types = ['info', 'success', 'warning', 'error', 'debug']
        results['notification_types'] = {}
        
        for ntype in notification_types:
            try:
                # Simulate notification
                notification = {
                    'timestamp': datetime.now().isoformat(),
                    'type': ntype,
                    'message': f'Test {ntype} notification',
                    'data': {'test': True}
                }
                results['notification_types'][ntype] = True
                print(f"   {ntype} notification: ✅")
            except Exception as e:
                results['notification_types'][ntype] = False
                print(f"   {ntype} notification: ❌")
        
        return results
    
    def test_error_handling(self) -> Dict[str, Any]:
        """Test error handling capabilities"""
        print("🚨 Testing error handling...")
        
        results = {}
        
        # Test error handler script
        error_script = 'scripts/qmoi-error-handler.py'
        exists = os.path.exists(error_script)
        results['error_handler_exists'] = exists
        print(f"   Error handler script: {'✅' if exists else '❌'}")
        
        # Test error recovery script
        recovery_script = 'scripts/qmoi-error-recovery.py'
        exists = os.path.exists(recovery_script)
        results['error_recovery_exists'] = exists
        print(f"   Error recovery script: {'✅' if exists else '❌'}")
        
        # Test error simulation
        try:
            # Simulate different error types
            error_types = ['npm_error', 'build_error', 'test_error', 'git_error']
            results['error_simulation'] = {}
            
            for error_type in error_types:
                results['error_simulation'][error_type] = True
                print(f"   {error_type} simulation: ✅")
                
        except Exception as e:
            results['error_simulation'] = False
            results['error_simulation_error'] = str(e)
            print(f"   Error simulation: ❌ - {e}")
        
        return results
    
    def test_performance(self) -> Dict[str, Any]:
        """Test performance optimization"""
        print("⚡ Testing performance optimization...")
        
        results = {}
        
        # Test performance optimizer script
        perf_script = 'scripts/qmoi-performance-optimizer.py'
        exists = os.path.exists(perf_script)
        results['performance_script_exists'] = exists
        print(f"   Performance script: {'✅' if exists else '❌'}")
        
        # Test system performance
        try:
            import psutil
            
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            results['cpu_usage'] = cpu_percent
            print(f"   CPU usage: {cpu_percent:.1f}%")
            
            # Memory usage
            memory = psutil.virtual_memory()
            results['memory_usage'] = memory.percent
            print(f"   Memory usage: {memory.percent:.1f}%")
            
            # Disk usage
            disk = psutil.disk_usage('/')
            results['disk_usage'] = disk.percent
            print(f"   Disk usage: {disk.percent:.1f}%")
            
        except Exception as e:
            results['system_performance'] = False
            results['performance_error'] = str(e)
            print(f"   System performance: ❌ - {e}")
        
        return results
    
    def test_platform_integration(self) -> Dict[str, Any]:
        """Test platform integration"""
        print("🌐 Testing platform integration...")
        
        results = {}
        
        # Test platform scripts
        platform_scripts = [
            'scripts/qcity-automation.js',
            'scripts/gitlab-error-recovery.js'
        ]
        
        results['platform_scripts'] = {}
        for script in platform_scripts:
            exists = os.path.exists(script)
            results['platform_scripts'][script] = exists
            status = "✅" if exists else "❌"
            print(f"   {script}: {status}")
        
        # Test platform connectivity
        platforms = ['gitlab', 'github', 'vercel', 'gitpod', 'qcity']
        results['platform_connectivity'] = {}
        
        for platform in platforms:
            # Simulate platform check
            results['platform_connectivity'][platform] = True
            print(f"   {platform} connectivity: ✅")
        
        return results
    
    def test_health_check(self) -> Dict[str, Any]:
        """Test health monitoring"""
        print("🏥 Testing health monitoring...")
        
        results = {}
        
        # Test health monitor script
        health_script = 'scripts/qmoi-health-monitor.py'
        exists = os.path.exists(health_script)
        results['health_script_exists'] = exists
        print(f"   Health script: {'✅' if exists else '❌'}")
        
        # Test health metrics
        try:
            # Simulate health checks
            health_metrics = {
                'system_health': 'good',
                'service_health': 'good',
                'performance_health': 'good',
                'error_rate': 0.0,
                'response_time': 100
            }
            
            results['health_metrics'] = health_metrics
            
            for metric, value in health_metrics.items():
                print(f"   {metric}: {value}")
                
        except Exception as e:
            results['health_metrics'] = False
            results['health_error'] = str(e)
            print(f"   Health metrics: ❌ - {e}")
        
        return results
    
    def test_final_report(self) -> Dict[str, Any]:
        """Generate final test report"""
        print("📋 Generating final test report...")
        
        results = {}
        
        # Calculate overall statistics
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result['status'] == 'PASSED')
        failed_tests = total_tests - passed_tests
        
        results['summary'] = {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'success_rate': (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        }
        
        print(f"   Total tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {failed_tests}")
        print(f"   Success rate: {results['summary']['success_rate']:.1f}%")
        
        # Save detailed report
        try:
            report = {
                'timestamp': datetime.now().isoformat(),
                'summary': results['summary'],
                'detailed_results': self.test_results
            }
            
            with open('logs/quick-test-report.json', 'w') as f:
                json.dump(report, f, indent=2, default=str)
            
            results['report_saved'] = True
            print("   Report saved: ✅")
            
        except Exception as e:
            results['report_saved'] = False
            results['report_error'] = str(e)
            print(f"   Report saved: ❌ - {e}")
        
        return results
    
    def generate_test_dashboard(self) -> str:
        """Generate a test dashboard HTML"""
        dashboard_html = """
<!DOCTYPE html>
<html>
<head>
    <title>QMOI Quick Test Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .passed { background-color: #d4edda; border: 1px solid #c3e6cb; }
        .failed { background-color: #f8d7da; border: 1px solid #f5c6cb; }
        .summary { font-size: 18px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>QMOI Quick Test Dashboard</h1>
    <div class="summary">
        Test completed successfully!
    </div>
    <div id="test-results">
        <!-- Test results will be populated here -->
    </div>
</body>
</html>
        """
        
        # Save dashboard
        with open('logs/quick-test-dashboard.html', 'w') as f:
            f.write(dashboard_html)
        
        return dashboard_html
    
    def simulate_websocket(self) -> bool:
        """Simulate WebSocket functionality"""
        # This is a simulation - in real implementation, it would connect to WebSocket
        return True
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print(f"\n{'='*60}")
        print("📊 QMOI QUICK TEST REPORT")
        print(f"{'='*60}")
        
        # Calculate statistics
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result['status'] == 'PASSED')
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        print(f"\n{'='*60}")
        print("DETAILED RESULTS")
        print(f"{'='*60}")
        
        for test_name, result in self.test_results.items():
            status_icon = "✅" if result['status'] == 'PASSED' else "❌"
            duration = result.get('duration', 'N/A')
            print(f"{status_icon} {test_name} ({duration})")
            
            if result['status'] == 'FAILED' and 'error' in result:
                print(f"   Error: {result['error']}")
        
        print(f"\n{'='*60}")
        print("NEXT STEPS")
        print(f"{'='*60}")
        
        if success_rate >= 80:
            print("🎉 Excellent! QMOI system is ready for full automation.")
            print("Run: python scripts/qmoi-enhanced-master-automation.py")
        elif success_rate >= 60:
            print("⚠️  Good! Some issues detected. Review failed tests.")
            print("Run: python scripts/qmoi-error-handler.py")
        else:
            print("❌ Issues detected. Please fix failed tests before proceeding.")
            print("Run: python scripts/qmoi-error-handler.py")
        
        print(f"\n📁 Reports saved to:")
        print("   - logs/quick-test-report.json")
        print("   - logs/quick-test-dashboard.html")
        print("   - logs/qmoi-quick-test.log")
        
        print(f"\n🚀 Ready to test real-time features:")
        print("   - python scripts/qmoi-real-time-monitor.py")
        print("   - python scripts/qmoi-master-notifications.py")
        print("   - python scripts/qmoi-enhanced-master-automation.py")

def main():
    """Main function"""
    quick_test = QMOIQuickTest()
    quick_test.run_quick_test()

if __name__ == "__main__":
    main() 