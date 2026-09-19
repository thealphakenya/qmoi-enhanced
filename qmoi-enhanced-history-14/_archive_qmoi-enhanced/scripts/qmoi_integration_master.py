#!/usr/bin/env python3
"""
QMOI Integration Master
Orchestrates all QMOI automation features including auto-fix, feature suggestion, 
doc verification, and deployment monitoring with comprehensive reporting.
"""

import os
import sys
import json
import time
import subprocess
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/qmoi_integration_master.log'),
        logging.StreamHandler()
    ]
)

class QMOIIntegrationMaster:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.logs_dir = self.root_dir / "logs"
        self.logs_dir.mkdir(exist_ok=True)
        
        self.integration_status = {
            "timestamp": datetime.now().isoformat(),
            "status": "initializing",
            "components": {
                "auto_fix": {"status": "pending", "last_run": None, "success": False},
                "feature_suggester": {"status": "pending", "last_run": None, "success": False},
                "doc_verifier": {"status": "pending", "last_run": None, "success": False},
                "self_test": {"status": "pending", "last_run": None, "success": False},
                "deployment_monitor": {"status": "pending", "last_run": None, "success": False}
            },
            "overall_health": "unknown",
            "master_notifications": [],
            "errors": [],
            "warnings": [],
            "details": []
        }
        
        self.scripts = {
            "auto_fix": "scripts/qmoi_auto_fix_enhanced.py",
            "feature_suggester": "scripts/qmoi_feature_suggester.py",
            "doc_verifier": "scripts/qmoi_doc_verifier.py",
            "self_test": "scripts/qmoi_self_test.py",
            "deployment_monitor": "scripts/qmoi_deployment_monitor.py"
        }
    
    def run_component(self, component_name: str, script_path: str) -> Dict[str, Any]:
        """Run a specific QMOI component"""
        try:
            logging.info(f"Starting {component_name}")
            
            start_time = time.time()
            result = subprocess.run(
                [sys.executable, script_path],
                capture_output=True,
                text=True,
                cwd=self.root_dir,
                timeout=600  # 10 minute timeout
            )
            
            end_time = time.time()
            
            success = result.returncode == 0
            
            # Update component status
            self.integration_status["components"][component_name].update({
                "status": "completed" if success else "failed",
                "last_run": datetime.now().isoformat(),
                "success": success,
                "duration": end_time - start_time,
                "return_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr
            })
            
            if success:
                logging.info(f"{component_name} completed successfully")
            else:
                logging.error(f"{component_name} failed with return code {result.returncode}")
                self.integration_status["errors"].append({
                    "component": component_name,
                    "error": f"Return code: {result.returncode}",
                    "stderr": result.stderr
                })
            
            return {
                "success": success,
                "duration": end_time - start_time,
                "return_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr
            }
            
        except subprocess.TimeoutExpired:
            logging.error(f"{component_name} timed out")
            self.integration_status["components"][component_name].update({
                "status": "timeout",
                "last_run": datetime.now().isoformat(),
                "success": False,
                "error": "Process timed out"
            })
            self.integration_status["errors"].append({
                "component": component_name,
                "error": "Process timed out"
            })
            return {"success": False, "error": "Process timed out"}
            
        except Exception as e:
            logging.error(f"Error running {component_name}: {e}")
            self.integration_status["components"][component_name].update({
                "status": "error",
                "last_run": datetime.now().isoformat(),
                "success": False,
                "error": str(e)
            })
            self.integration_status["errors"].append({
                "component": component_name,
                "error": str(e)
            })
            return {"success": False, "error": str(e)}
    
    def run_sequential_integration(self) -> Dict[str, Any]:
        """Run all components sequentially in dependency order"""
        try:
            logging.info("Starting sequential QMOI integration")
            self.integration_status["status"] = "running"
            
            # 1. Run auto-fix first to ensure clean state
            logging.info("Step 1: Running auto-fix")
            auto_fix_result = self.run_component("auto_fix", self.scripts["auto_fix"])
            
            # 2. Run doc verifier to check documentation
            logging.info("Step 2: Running doc verifier")
            doc_verifier_result = self.run_component("doc_verifier", self.scripts["doc_verifier"])
            
            # 3. Run feature suggester to identify gaps
            logging.info("Step 3: Running feature suggester")
            feature_suggester_result = self.run_component("feature_suggester", self.scripts["feature_suggester"])
            
            # 4. Run self-test to verify everything works
            logging.info("Step 4: Running self-test")
            self_test_result = self.run_component("self_test", self.scripts["self_test"])
            
            # 5. Run deployment monitor to check deployment status
            logging.info("Step 5: Running deployment monitor")
            deployment_monitor_result = self.run_component("deployment_monitor", self.scripts["deployment_monitor"])
            
            # Compile results
            results = {
                "auto_fix": auto_fix_result,
                "doc_verifier": doc_verifier_result,
                "feature_suggester": feature_suggester_result,
                "self_test": self_test_result,
                "deployment_monitor": deployment_monitor_result
            }
            
            # Determine overall health
            successful_components = sum(1 for result in results.values() if result.get("success", False))
            total_components = len(results)
            
            if successful_components == total_components:
                self.integration_status["overall_health"] = "excellent"
            elif successful_components >= total_components * 0.8:
                self.integration_status["overall_health"] = "good"
            elif successful_components >= total_components * 0.6:
                self.integration_status["overall_health"] = "fair"
            else:
                self.integration_status["overall_health"] = "poor"
            
            self.integration_status["status"] = "completed"
            
            logging.info(f"Sequential integration completed. Health: {self.integration_status['overall_health']}")
            return results
            
        except Exception as e:
            logging.error(f"Error in sequential integration: {e}")
            self.integration_status["status"] = "failed"
            self.integration_status["errors"].append({
                "component": "integration_master",
                "error": str(e)
            })
            return {"error": str(e)}
    
    def run_parallel_integration(self) -> Dict[str, Any]:
        """Run independent components in parallel for faster execution"""
        try:
            logging.info("Starting parallel QMOI integration")
            self.integration_status["status"] = "running"
            
            # Components that can run in parallel
            parallel_components = {
                "feature_suggester": self.scripts["feature_suggester"],
                "doc_verifier": self.scripts["doc_verifier"],
                "deployment_monitor": self.scripts["deployment_monitor"]
            }
            
            # Run auto-fix first (dependency)
            logging.info("Running auto-fix (dependency)")
            auto_fix_result = self.run_component("auto_fix", self.scripts["auto_fix"])
            
            if not auto_fix_result.get("success", False):
                logging.warning("Auto-fix failed, but continuing with other components")
            
            # Run parallel components
            threads = {}
            results = {"auto_fix": auto_fix_result}
            
            def run_component_thread(component_name, script_path):
                results[component_name] = self.run_component(component_name, script_path)
            
            for component_name, script_path in parallel_components.items():
                thread = threading.Thread(
                    target=run_component_thread,
                    args=(component_name, script_path)
                )
                threads[component_name] = thread
                thread.start()
                logging.info(f"Started {component_name} in parallel")
            
            # Wait for all threads to complete
            for component_name, thread in threads.items():
                thread.join()
                logging.info(f"{component_name} completed")
            
            # Run self-test last (depends on other components)
            logging.info("Running self-test (final verification)")
            self_test_result = self.run_component("self_test", self.scripts["self_test"])
            results["self_test"] = self_test_result
            
            # Determine overall health
            successful_components = sum(1 for result in results.values() if result.get("success", False))
            total_components = len(results)
            
            if successful_components == total_components:
                self.integration_status["overall_health"] = "excellent"
            elif successful_components >= total_components * 0.8:
                self.integration_status["overall_health"] = "good"
            elif successful_components >= total_components * 0.6:
                self.integration_status["overall_health"] = "fair"
            else:
                self.integration_status["overall_health"] = "poor"
            
            self.integration_status["status"] = "completed"
            
            logging.info(f"Parallel integration completed. Health: {self.integration_status['overall_health']}")
            return results
            
        except Exception as e:
            logging.error(f"Error in parallel integration: {e}")
            self.integration_status["status"] = "failed"
            self.integration_status["errors"].append({
                "component": "integration_master",
                "error": str(e)
            })
            return {"error": str(e)}
    
    def check_component_health(self) -> Dict[str, Any]:
        """Check the health of all QMOI components"""
        health_report = {
            "timestamp": datetime.now().isoformat(),
            "overall_health": "unknown",
            "components": {},
            "recommendations": []
        }
        
        try:
            for component_name, status in self.integration_status["components"].items():
                component_health = {
                    "status": status["status"],
                    "last_run": status["last_run"],
                    "success_rate": 1.0 if status["success"] else 0.0,
                    "health": "healthy" if status["success"] else "unhealthy"
                }
                
                # Check if component hasn't run recently
                if status["last_run"]:
                    last_run_time = datetime.fromisoformat(status["last_run"])
                    time_diff = datetime.now() - last_run_time
                    if time_diff.total_seconds() > 3600:  # 1 hour
                        component_health["health"] = "stale"
                        health_report["recommendations"].append(f"Run {component_name} - last run was {time_diff.total_seconds()/3600:.1f} hours ago")
                
                health_report["components"][component_name] = component_health
            
            # Determine overall health
            healthy_components = sum(1 for comp in health_report["components"].values() if comp["health"] == "healthy")
            total_components = len(health_report["components"])
            
            if healthy_components == total_components:
                health_report["overall_health"] = "excellent"
            elif healthy_components >= total_components * 0.8:
                health_report["overall_health"] = "good"
            elif healthy_components >= total_components * 0.6:
                health_report["overall_health"] = "fair"
            else:
                health_report["overall_health"] = "poor"
            
            return health_report
            
        except Exception as e:
            logging.error(f"Error checking component health: {e}")
            return {"error": str(e)}
    
    def generate_master_report(self) -> Dict[str, Any]:
        """Generate comprehensive master report"""
        try:
            # Check component health
            health_report = self.check_component_health()
            
            # Compile master report
            master_report = {
                "timestamp": datetime.now().isoformat(),
                "integration_status": self.integration_status,
                "health_report": health_report,
                "summary": {
                    "total_components": len(self.integration_status["components"]),
                    "successful_components": sum(1 for comp in self.integration_status["components"].values() if comp["success"]),
                    "failed_components": sum(1 for comp in self.integration_status["components"].values() if not comp["success"]),
                    "total_errors": len(self.integration_status["errors"]),
                    "total_warnings": len(self.integration_status["warnings"]),
                    "overall_health": health_report["overall_health"]
                },
                "recommendations": health_report["recommendations"],
                "next_actions": self.generate_next_actions()
            }
            
            return master_report
            
        except Exception as e:
            logging.error(f"Error generating master report: {e}")
            return {"error": str(e)}
    
    def generate_next_actions(self) -> List[str]:
        """Generate recommended next actions based on current status"""
        actions = []
        
        try:
            # Check for failed components
            failed_components = [name for name, status in self.integration_status["components"].items() if not status["success"]]
            if failed_components:
                actions.append(f"Retry failed components: {', '.join(failed_components)}")
            
            # Check for stale components
            stale_components = []
            for name, status in self.integration_status["components"].items():
                if status["last_run"]:
                    last_run_time = datetime.fromisoformat(status["last_run"])
                    time_diff = datetime.now() - last_run_time
                    if time_diff.total_seconds() > 3600:  # 1 hour
                        stale_components.append(name)
            
            if stale_components:
                actions.append(f"Update stale components: {', '.join(stale_components)}")
            
            # Check for errors
            if self.integration_status["errors"]:
                actions.append("Review and fix integration errors")
            
            # Check overall health
            if self.integration_status["overall_health"] in ["poor", "fair"]:
                actions.append("Run full integration cycle to improve health")
            
            # Add standard maintenance actions
            actions.extend([
                "Review master notifications",
                "Check deployment status",
                "Update documentation",
                "Run comprehensive tests"
            ])
            
            return actions
            
        except Exception as e:
            logging.error(f"Error generating next actions: {e}")
            return ["Error generating actions"]
    
    def save_integration_report(self, report: Dict[str, Any]):
        """Save the integration report"""
        try:
            report_file = self.root_dir / "logs" / "qmoi_integration_report.json"
            with open(report_file, 'w') as f:
                json.dump(report, f, indent=2)
            
            # Also save a summary
            summary_file = self.root_dir / "logs" / "qmoi_integration_summary.txt"
            with open(summary_file, 'w') as f:
                f.write(f"QMOI Integration Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("=" * 60 + "\n\n")
                
                summary = report.get("summary", {})
                f.write(f"Overall Health: {summary.get('overall_health', 'unknown')}\n")
                f.write(f"Total Components: {summary.get('total_components', 0)}\n")
                f.write(f"Successful: {summary.get('successful_components', 0)}\n")
                f.write(f"Failed: {summary.get('failed_components', 0)}\n")
                f.write(f"Errors: {summary.get('total_errors', 0)}\n")
                f.write(f"Warnings: {summary.get('total_warnings', 0)}\n\n")
                
                f.write("Component Status:\n")
                for name, status in report.get("integration_status", {}).get("components", {}).items():
                    f.write(f"  {name}: {status.get('status', 'unknown')} ({'✓' if status.get('success') else '✗'})\n")
                
                f.write("\nRecommendations:\n")
                for i, rec in enumerate(report.get("recommendations", []), 1):
                    f.write(f"  {i}. {rec}\n")
                
                f.write("\nNext Actions:\n")
                for i, action in enumerate(report.get("next_actions", []), 1):
                    f.write(f"  {i}. {action}\n")
            
            logging.info(f"Integration report saved to {report_file}")
            
        except Exception as e:
            logging.error(f"Error saving integration report: {e}")
    
    def run_full_integration(self, parallel: bool = False) -> Dict[str, Any]:
        """Run the complete QMOI integration process"""
        try:
            logging.info("Starting QMOI Integration Master")
            
            # Run integration
            if parallel:
                results = self.run_parallel_integration()
            else:
                results = self.run_sequential_integration()
            
            # Generate master report
            master_report = self.generate_master_report()
            
            # Save report
            self.save_integration_report(master_report)
            
            logging.info("QMOI Integration Master completed")
            
            # Print summary
            summary = master_report.get("summary", {})
            print(f"\nQMOI Integration Summary:")
            print(f"Overall Health: {summary.get('overall_health', 'unknown')}")
            print(f"Components: {summary.get('successful_components', 0)}/{summary.get('total_components', 0)} successful")
            print(f"Errors: {summary.get('total_errors', 0)}")
            print(f"Warnings: {summary.get('total_warnings', 0)}")
            
            return master_report
            
        except Exception as e:
            logging.error(f"Error in full integration: {e}")
            print(f"Error: {e}")
            return {"error": str(e)}

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="QMOI Integration Master")
    parser.add_argument("--parallel", action="store_true", help="Run components in parallel")
    parser.add_argument("--sequential", action="store_true", help="Run components sequentially")
    parser.add_argument("--health-check", action="store_true", help="Only run health check")
    
    args = parser.parse_args()
    
    master = QMOIIntegrationMaster()
    
    if args.health_check:
        health_report = master.check_component_health()
        print(json.dumps(health_report, indent=2))
    else:
        parallel = args.parallel or not args.sequential
        master.run_full_integration(parallel=parallel)

if __name__ == "__main__":
    main() 