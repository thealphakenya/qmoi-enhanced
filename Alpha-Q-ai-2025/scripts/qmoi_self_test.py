#!/usr/bin/env python3
"""
QMOI Self-Test Runner
Simulates manual errors, runs auto-fix, and verifies recovery with detailed reporting.
"""

import os
import sys
import json
import time
import subprocess
import tempfile
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_self_test.log'),
        logging.StreamHandler()
    ]
)

class QMOISelfTest:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.logs_dir = self.root_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "status": "running",
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "error_simulation": {},
            "recovery_verification": {},
            "performance_metrics": {},
            "details": []
        }
        
        self.backup_files = {}
    
    def create_test_backup(self) -> bool:
        """Create backup of critical files before testing"""
        try:
            critical_files = [
                "package.json",
                "next.config.mjs",
                "tsconfig.json",
                "tailwind.config.ts"
            ]
            
            for file_name in critical_files:
                file_path = self.root_dir / file_name
                if file_path.exists():
                    backup_path = self.root_dir / f"{file_name}.backup"
                    shutil.copy2(file_path, backup_path)
                    self.backup_files[file_name] = str(backup_path)
            
            logging.info("Test backup created successfully")
            return True
        except Exception as e:
            logging.error(f"Error creating backup: {e}")
            return False
    
    def restore_test_backup(self) -> bool:
        """Restore backup files after testing"""
        try:
            for file_name, backup_path in self.backup_files.items():
                if Path(backup_path).exists():
                    shutil.copy2(backup_path, self.root_dir / file_name)
                    Path(backup_path).unlink()  # Remove backup file
            
            logging.info("Test backup restored successfully")
            return True
        except Exception as e:
            logging.error(f"Error restoring backup: {e}")
            return False
    
    def simulate_manual_errors(self) -> Dict[str, Any]:
        """Simulate various types of manual errors"""
        errors_created = {}
        
        try:
            # 1. Create broken TypeScript file
            broken_ts_content = """
import React from 'react';

const BrokenComponent: React.FC = () => {
  const undefinedVar = undefined;
  console.error('This is a simulated error');
  throw new Error('Simulated error for testing');
  
  return (
    <div>
      {undefinedVar.property} // This will cause an error
    </div>
  );
};

export default BrokenComponent;
"""
            broken_ts_path = self.root_dir / "components" / "BrokenComponent.tsx"
            broken_ts_path.parent.mkdir(exist_ok=True)
            with open(broken_ts_path, 'w') as f:
                f.write(broken_ts_content)
            errors_created["broken_ts"] = str(broken_ts_path)
            
            # 2. Create broken Python file
            broken_py_content = """
#!/usr/bin/env python3

def broken_function():
    undefined_variable = None
    print(undefined_variable.attribute)  # This will cause an error
    raise Exception("Simulated Python error")

if __name__ == "__main__":
    broken_function()
"""
            broken_py_path = self.root_dir / "scripts" / "broken_script.py"
            broken_py_path.parent.mkdir(exist_ok=True)
            with open(broken_py_path, 'w') as f:
                f.write(broken_py_content)
            errors_created["broken_py"] = str(broken_py_path)
            
            # 3. Create broken markdown with false claims
            broken_md_content = """
# Test Documentation

## Features
- [Non-existent Feature] - This feature doesn't exist
- [Broken API Endpoint] - This API endpoint is not implemented
- [Missing Component] - This component is not created

## Implementation
This document contains false claims that should be detected and fixed.
"""
            broken_md_path = self.root_dir / "TEST_BROKEN.md"
            with open(broken_md_path, 'w') as f:
                f.write(broken_md_content)
            errors_created["broken_md"] = str(broken_md_path)
            
            # 4. Create broken package.json
            original_package = self.root_dir / "package.json"
            if original_package.exists():
                with open(original_package, 'r') as f:
                    package_data = json.load(f)
                
                # Introduce syntax error
                package_data["broken_field"] = "unclosed_string
                package_data["dependencies"]["non_existent_package"] = "999.999.999"
                
                with open(original_package, 'w') as f:
                    json.dump(package_data, f, indent=2)
                errors_created["broken_package"] = str(original_package)
            
            logging.info(f"Created {len(errors_created)} simulated errors")
            return errors_created
            
        except Exception as e:
            logging.error(f"Error simulating manual errors: {e}")
            return errors_created
    
    def run_auto_fix(self) -> Dict[str, Any]:
        """Run the auto-fix system"""
        try:
            start_time = time.time()
            
            # Run the enhanced auto-fix script
            result = subprocess.run(
                [sys.executable, "scripts/qmoi_auto_fix_enhanced.py"],
                capture_output=True,
                text=True,
                cwd=self.root_dir,
                timeout=300  # 5 minute timeout
            )
            
            end_time = time.time()
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode,
                "duration": end_time - start_time
            }
            
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": "Auto-fix process timed out",
                "duration": 300
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "duration": 0
            }
    
    def verify_recovery(self, errors_created: Dict[str, Any]) -> Dict[str, Any]:
        """Verify that errors were properly fixed"""
        verification_results = {}
        
        try:
            # 1. Check if broken TypeScript file was fixed
            if "broken_ts" in errors_created:
                ts_path = Path(errors_created["broken_ts"])
                if ts_path.exists():
                    with open(ts_path, 'r') as f:
                        content = f.read()
                    
                    # Check if error patterns were fixed
                    has_console_error = "console.error" in content
                    has_throw_error = "throw new Error" in content
                    has_undefined_access = "undefinedVar.property" in content
                    
                    verification_results["broken_ts"] = {
                        "file_exists": True,
                        "console_error_fixed": not has_console_error,
                        "throw_error_fixed": not has_throw_error,
                        "undefined_access_fixed": not has_undefined_access,
                        "fully_fixed": not (has_console_error or has_throw_error or has_undefined_access)
                    }
                else:
                    verification_results["broken_ts"] = {
                        "file_exists": False,
                        "fully_fixed": True  # File was removed
                    }
            
            # 2. Check if broken Python file was fixed
            if "broken_py" in errors_created:
                py_path = Path(errors_created["broken_py"])
                if py_path.exists():
                    with open(py_path, 'r') as f:
                        content = f.read()
                    
                    has_undefined_access = "undefined_variable.attribute" in content
                    has_raise_exception = "raise Exception" in content
                    
                    verification_results["broken_py"] = {
                        "file_exists": True,
                        "undefined_access_fixed": not has_undefined_access,
                        "raise_exception_fixed": not has_raise_exception,
                        "fully_fixed": not (has_undefined_access or has_raise_exception)
                    }
                else:
                    verification_results["broken_py"] = {
                        "file_exists": False,
                        "fully_fixed": True
                    }
            
            # 3. Check if broken markdown was fixed
            if "broken_md" in errors_created:
                md_path = Path(errors_created["broken_md"])
                if md_path.exists():
                    with open(md_path, 'r') as f:
                        content = f.read()
                    
                    has_false_claims = any(claim in content for claim in [
                        "Non-existent Feature",
                        "Broken API Endpoint",
                        "Missing Component"
                    ])
                    
                    verification_results["broken_md"] = {
                        "file_exists": True,
                        "false_claims_fixed": not has_false_claims,
                        "fully_fixed": not has_false_claims
                    }
                else:
                    verification_results["broken_md"] = {
                        "file_exists": False,
                        "fully_fixed": True
                    }
            
            # 4. Check if package.json was fixed
            if "broken_package" in errors_created:
                package_path = Path(errors_created["broken_package"])
                if package_path.exists():
                    try:
                        with open(package_path, 'r') as f:
                            json.load(f)  # This will fail if JSON is invalid
                        verification_results["broken_package"] = {
                            "file_exists": True,
                            "json_valid": True,
                            "fully_fixed": True
                        }
                    except json.JSONDecodeError:
                        verification_results["broken_package"] = {
                            "file_exists": True,
                            "json_valid": False,
                            "fully_fixed": False
                        }
                else:
                    verification_results["broken_package"] = {
                        "file_exists": False,
                        "fully_fixed": True
                    }
            
            # 5. Run type check to verify overall system health
            try:
                type_check_result = subprocess.run(
                    ["npm", "run", "type-check"],
                    capture_output=True,
                    text=True,
                    cwd=self.root_dir,
                    timeout=60
                )
                
                verification_results["type_check"] = {
                    "success": type_check_result.returncode == 0,
                    "output": type_check_result.stdout,
                    "errors": type_check_result.stderr
                }
            except Exception as e:
                verification_results["type_check"] = {
                    "success": False,
                    "error": str(e)
                }
            
            logging.info("Recovery verification completed")
            return verification_results
            
        except Exception as e:
            logging.error(f"Error during recovery verification: {e}")
            return {"error": str(e)}
    
    def run_performance_tests(self) -> Dict[str, Any]:
        """Run performance tests to measure system health"""
        performance_metrics = {}
        
        try:
            # 1. Measure build time
            start_time = time.time()
            build_result = subprocess.run(
                ["npm", "run", "build"],
                capture_output=True,
                text=True,
                cwd=self.root_dir,
                timeout=300
            )
            build_time = time.time() - start_time
            
            performance_metrics["build_time"] = build_time
            performance_metrics["build_success"] = build_result.returncode == 0
            
            # 2. Count files and lines of code
            file_count = 0
            line_count = 0
            
            for ext in ['.ts', '.tsx', '.js', '.jsx', '.py']:
                for file_path in self.root_dir.rglob(f'*{ext}'):
                    if 'node_modules' not in str(file_path) and '.git' not in str(file_path):
                        file_count += 1
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                line_count += len(f.readlines())
                        except:
                            pass
            
            performance_metrics["file_count"] = file_count
            performance_metrics["line_count"] = line_count
            
            # 3. Check for common performance issues
            large_files = []
            for file_path in self.root_dir.rglob('*.ts*'):
                if 'node_modules' not in str(file_path) and '.git' not in str(file_path):
                    try:
                        size = file_path.stat().st_size
                        if size > 100000:  # 100KB
                            large_files.append({
                                "file": str(file_path),
                                "size": size
                            })
                    except:
                        pass
            
            performance_metrics["large_files"] = large_files
            performance_metrics["performance_issues"] = len(large_files)
            
            logging.info("Performance tests completed")
            return performance_metrics
            
        except Exception as e:
            logging.error(f"Error during performance tests: {e}")
            return {"error": str(e)}
    
    def generate_test_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "status": "completed",
            "summary": {
                "tests_run": self.test_results["tests_run"],
                "tests_passed": self.test_results["tests_passed"],
                "tests_failed": self.test_results["tests_failed"],
                "success_rate": (self.test_results["tests_passed"] / max(self.test_results["tests_run"], 1)) * 100
            },
            "error_simulation": self.test_results["error_simulation"],
            "recovery_verification": self.test_results["recovery_verification"],
            "performance_metrics": self.test_results["performance_metrics"],
            "details": self.test_results["details"]
        }
        
        return report
    
    def save_test_report(self, report: Dict[str, Any]):
        """Save test report to file"""
        try:
            report_file = self.logs_dir / f"qmoi_self_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            # Also save latest report
            latest_report = self.logs_dir / "qmoi_self_test_latest.json"
            with open(latest_report, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            
            logging.info(f"Test report saved to {report_file}")
        except Exception as e:
            logging.error(f"Error saving test report: {e}")
    
    def run_comprehensive_test(self):
        """Run comprehensive self-test process"""
        logging.info("Starting QMOI Self-Test Runner")
        
        try:
            # 1. Create backup
            if not self.create_test_backup():
                raise Exception("Failed to create test backup")
            
            # 2. Simulate manual errors
            logging.info("Simulating manual errors")
            errors_created = self.simulate_manual_errors()
            self.test_results["error_simulation"] = errors_created
            self.test_results["tests_run"] += 1
            
            # 3. Run auto-fix
            logging.info("Running auto-fix system")
            auto_fix_result = self.run_auto_fix()
            self.test_results["details"].append({
                "step": "auto_fix",
                "result": auto_fix_result
            })
            
            if auto_fix_result["success"]:
                self.test_results["tests_passed"] += 1
            else:
                self.test_results["tests_failed"] += 1
            
            # 4. Verify recovery
            logging.info("Verifying recovery")
            recovery_results = self.verify_recovery(errors_created)
            self.test_results["recovery_verification"] = recovery_results
            
            # Count recovery tests
            recovery_tests = 0
            recovery_passed = 0
            
            for test_name, result in recovery_results.items():
                if test_name != "type_check":
                    recovery_tests += 1
                    if result.get("fully_fixed", False):
                        recovery_passed += 1
            
            self.test_results["tests_run"] += recovery_tests
            self.test_results["tests_passed"] += recovery_passed
            self.test_results["tests_failed"] += (recovery_tests - recovery_passed)
            
            # 5. Run performance tests
            logging.info("Running performance tests")
            performance_metrics = self.run_performance_tests()
            self.test_results["performance_metrics"] = performance_metrics
            self.test_results["tests_run"] += 1
            
            if not performance_metrics.get("error"):
                self.test_results["tests_passed"] += 1
            else:
                self.test_results["tests_failed"] += 1
            
            # 6. Restore backup
            logging.info("Restoring backup")
            if not self.restore_test_backup():
                logging.warning("Failed to restore backup")
            
            # 7. Generate and save report
            final_report = self.generate_test_report()
            self.save_test_report(final_report)
            
            logging.info("QMOI Self-Test completed successfully")
            return final_report
            
        except Exception as e:
            logging.error(f"Error in comprehensive test: {e}")
            self.test_results["status"] = "error"
            self.test_results["error"] = str(e)
            
            # Try to restore backup even on error
            try:
                self.restore_test_backup()
            except:
                pass
            
            return self.test_results

def main():
    """Main entry point"""
    self_test = QMOISelfTest()
    report = self_test.run_comprehensive_test()
    
    print(json.dumps(report, indent=2))
    
    if report["status"] == "completed" and report["summary"]["success_rate"] >= 80:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main() 