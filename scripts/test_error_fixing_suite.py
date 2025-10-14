import unittest
import sys
import os
import time
import json
from datetime import datetime
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Import test modules
from tests.unit.test_error_fixing import TestErrorFixing
from tests.integration.test_error_fixing_integration import TestErrorFixingIntegration


class ErrorFixingTestRunner:
    def __init__(self):
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "summary": {},
            "details": [],
        }

    def run_tests(self):
        """Run all error fixing related tests and generate report"""
        # Create test suite
        suite = unittest.TestSuite()

        # Add test cases
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestErrorFixing))
        suite.addTests(
            unittest.TestLoader().loadTestsFromTestCase(TestErrorFixingIntegration)
        )

        # Create test runner
        runner = unittest.TextTestRunner(verbosity=2)

        # Run tests and capture results
        print("Starting Error Fixing Test Suite...")
        start_time = time.time()
        result = runner.run(suite)
        end_time = time.time()

        # Compile results
        self.test_results["summary"] = {
            "total_tests": result.testsRun,
            "failures": len(result.failures),
            "errors": len(result.errors),
            "skipped": len(result.skipped),
            "success_rate": (
                result.testsRun - len(result.failures) - len(result.errors)
            )
            / result.testsRun
            * 100,
            "execution_time": end_time - start_time,
        }

        # Add detailed results
        for failure in result.failures:
            self.test_results["details"].append(
                {"test": str(failure[0]), "type": "failure", "message": failure[1]}
            )

        for error in result.errors:
            self.test_results["details"].append(
                {"test": str(error[0]), "type": "error", "message": error[1]}
            )

        return self.test_results

    def generate_report(self):
        """Generate a detailed test report"""
        report_path = project_root / "tests" / "reports"
        report_path.mkdir(exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = report_path / f"error_fixing_test_report_{timestamp}.json"

        with open(report_file, "w") as f:
            json.dump(self.test_results, f, indent=2)

        print(f"\nTest Report Generated: {report_file}")
        self._print_summary()

    def _print_summary(self):
        """Print a summary of test results to console"""
        summary = self.test_results["summary"]
        print("\n=== Error Fixing Test Suite Summary ===")
        print(f"Total Tests: {summary['total_tests']}")
        print(
            f"Passed: {summary['total_tests'] - summary['failures'] - summary['errors']}"
        )
        print(f"Failed: {summary['failures']}")
        print(f"Errors: {summary['errors']}")
        print(f"Skipped: {summary['skipped']}")
        print(f"Success Rate: {summary['success_rate']:.2f}%")
        print(f"Execution Time: {summary['execution_time']:.2f} seconds")

        if summary["failures"] > 0 or summary["errors"] > 0:
            print("\nDetailed Error Information:")
            for detail in self.test_results["details"]:
                print(f"\nTest: {detail['test']}")
                print(f"Type: {detail['type']}")
                print(f"Message: {detail['message']}")


def main():
    runner = ErrorFixingTestRunner()
    runner.run_tests()
    runner.generate_report()


if __name__ == "__main__":
    main()
