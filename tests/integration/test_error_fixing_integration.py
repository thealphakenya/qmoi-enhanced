import unittest
import sys
import os
import asyncio
from unittest.mock import Mock, patch

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from scripts.error.error_fixer import ErrorFixer
from scripts.services.auto_fix_service import AutoFixService
from scripts.error_handler import ErrorHandler
from scripts.qcity_manager import QCityManager

class TestErrorFixingIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.error_fixer = ErrorFixer()
        cls.auto_fix_service = AutoFixService()
        cls.error_handler = ErrorHandler()
        cls.qcity_manager = QCityManager()

    def setUp(self):
        # Setup test environment before each test
        self.test_files = {
            'test_file1.py': 'print("Hello World")',
            'test_file2.py': 'x = 1/0  # Division by zero error',
            'test_file3.py': 'import nonexistent_module  # Import error'
        }
        
        # Create temporary test files
        for filename, content in self.test_files.items():
            with open(filename, 'w') as f:
                f.write(content)

    def tearDown(self):
        # Clean up test files after each test
        for filename in self.test_files:
            if os.path.exists(filename):
                os.remove(filename)

    async def test_end_to_end_error_fixing(self):
        """Test complete error detection and fixing pipeline"""
        # 1. Error Detection
        errors = await self.error_handler.scan_for_errors(list(self.test_files.keys()))
        self.assertTrue(len(errors) > 0)

        # 2. Error Analysis
        analyzed_errors = await self.auto_fix_service.analyze_errors(errors)
        self.assertEqual(len(analyzed_errors), len(errors))

        # 3. Fix Application
        fix_results = await self.auto_fix_service.apply_fixes(analyzed_errors)
        self.assertTrue(all(result['success'] for result in fix_results))

        # 4. Verification
        verification = await self.error_handler.verify_fixes(fix_results)
        self.assertTrue(verification['all_fixes_verified'])

    def test_error_notification_system(self):
        """Test if error notifications are properly sent and handled"""
        with patch('scripts.error_handler.ErrorHandler.notify_error') as mock_notify:
            self.error_handler.handle_critical_error("Test critical error")
            mock_notify.assert_called_once()

    def test_system_recovery_process(self):
        """Test system's ability to recover from multiple simultaneous errors"""
        test_scenarios = [
            {
                'error_type': 'database_connection',
                'severity': 'high',
                'should_trigger_fallback': True
            },
            {
                'error_type': 'api_timeout',
                'severity': 'medium',
                'should_trigger_fallback': True
            },
            {
                'error_type': 'minor_ui_glitch',
                'severity': 'low',
                'should_trigger_fallback': False
            }
        ]

        for scenario in test_scenarios:
            with self.subTest(scenario=scenario):
                recovery_result = self.error_handler.handle_system_error(scenario)
                self.assertEqual(
                    recovery_result['fallback_triggered'],
                    scenario['should_trigger_fallback']
                )

    def test_error_fix_persistence(self):
        """Test if fixed errors remain fixed after system restart"""
        # 1. Create a test error
        test_error = {
            'type': 'syntax',
            'location': 'test_file.py',
            'description': 'Missing parenthesis'
        }

        # 2. Fix the error
        fix_result = self.auto_fix_service.fix_error(test_error)
        self.assertTrue(fix_result['success'])

        # 3. Simulate system restart
        self.qcity_manager.simulate_restart()

        # 4. Verify fix persists
        error_check = self.error_handler.check_for_error(test_error['location'])
        self.assertFalse(error_check['error_exists'])

    def test_concurrent_error_fixing(self):
        """Test system's ability to handle multiple errors concurrently"""
        async def run_concurrent_tests():
            test_errors = [
                {'type': 'syntax', 'severity': 'high'},
                {'type': 'runtime', 'severity': 'medium'},
                {'type': 'logical', 'severity': 'low'}
            ]

            # Fix errors concurrently
            tasks = [
                self.auto_fix_service.fix_error_async(error)
                for error in test_errors
            ]
            results = await asyncio.gather(*tasks)

            # Verify all fixes were successful
            self.assertTrue(all(result['success'] for result in results))

        asyncio.run(run_concurrent_tests())

if __name__ == '__main__':
    unittest.main() 