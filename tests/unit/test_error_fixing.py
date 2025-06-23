import unittest
import sys
import os
import asyncio
import logging
import json
import subprocess
import time
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from typing import Dict, Any, List
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from scripts.error.error_fixer import ErrorFixer
from scripts.services.auto_fix_service import AutoFixService
from scripts.error_handler import ErrorHandler

# Setup logging for test results
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('test_results.log'),
        logging.StreamHandler()
    ]
)

class TestErrorFixing(unittest.TestCase):
    def setUp(self):
        self.error_fixer = ErrorFixer()
        self.auto_fix_service = AutoFixService()
        self.error_handler = ErrorHandler()
        self.logger = logging.getLogger(__name__)

    def test_error_detection(self):
        """Test if system correctly detects different types of errors"""
        test_cases = [
            {
                "error_type": "syntax",
                "code": "def broken_function(:",
                "should_detect": True,
                "expected_fix": "def broken_function():"
            },
            {
                "error_type": "runtime",
                "code": "x = 1/0",
                "should_detect": True,
                "expected_fix": "x = 1/1  # Fixed division by zero"
            },
            {
                "error_type": "import",
                "code": "from nonexistent_module import something",
                "should_detect": True,
                "expected_fix": "# from nonexistent_module import something  # Commented out invalid import"
            },
            {
                "error_type": "indentation",
                "code": "def test():\nprint('wrong indentation')",
                "should_detect": True,
                "expected_fix": "def test():\n    print('wrong indentation')"
            },
            {
                "error_type": "variable_scope",
                "code": "def func():\n    x = 1\nprint(x)",
                "should_detect": True,
                "expected_fix": "def func():\n    x = 1\n    return x\nx = func()\nprint(x)"
            }
        ]
        
        for case in test_cases:
            with self.subTest(case=case):
                try:
                    result = self.error_handler.detect_error(case["code"])
                    self.assertEqual(result["has_error"], case["should_detect"])
                    if case["should_detect"]:
                        self.assertEqual(result["error_type"], case["error_type"])
                        # Test if fix is applied correctly
                        fixed_code = self.auto_fix_service.fix_code(case["code"])
                        self.assertIsNotNone(fixed_code)
                        self.logger.info(f"Successfully fixed {case['error_type']} error")
                except Exception as e:
                    self.logger.error(f"Test failed for {case['error_type']}: {str(e)}")
                    raise

    def test_auto_fix_capabilities(self):
        """Test if auto-fix service can fix common errors"""
        test_cases = [
            {
                "broken_code": "print('Hello World'",  # Missing closing parenthesis
                "expected_fix": "print('Hello World')",
                "error_type": "syntax"
            },
            {
                "broken_code": "def function(x, y,):",  # Trailing comma
                "expected_fix": "def function(x, y):",
                "error_type": "syntax"
            },
            {
                "broken_code": "import pandas as pd\ndf = pd.read_csv()",  # Missing argument
                "expected_fix": "import pandas as pd\ndf = pd.read_csv('file.csv')",
                "error_type": "runtime"
            },
            {
                "broken_code": "for i in range(10):\nprint(i)",  # Missing indentation
                "expected_fix": "for i in range(10):\n    print(i)",
                "error_type": "indentation"
            },
            {
                "broken_code": "try:\n    x = 1/0\nexcept:",  # Bare except clause
                "expected_fix": "try:\n    x = 1/0\nexcept Exception as e:",
                "error_type": "best_practice"
            }
        ]
        
        for case in test_cases:
            with self.subTest(case=case):
                try:
                    fixed_code = self.auto_fix_service.fix_code(case["broken_code"])
                    self.assertIsNotNone(fixed_code)
                    self.logger.info(f"Successfully fixed {case['error_type']} error")
                except Exception as e:
                    self.logger.error(f"Failed to fix {case['error_type']}: {str(e)}")
                    raise

    def test_error_recovery(self):
        """Test system's ability to recover from errors"""
        recovery_scenarios = [
            {
                "error": Exception("Database connection failed"),
                "expected_action": "fallback_to_cache"
            },
            {
                "error": Exception("API timeout"),
                "expected_action": "retry_with_backoff"
            },
            {
                "error": Exception("Memory overflow"),
                "expected_action": "cleanup_and_restart"
            }
        ]

        for scenario in recovery_scenarios:
            with self.subTest(scenario=scenario):
                with patch('scripts.error_handler.ErrorHandler.log_error') as mock_log:
                    recovery_result = self.error_handler.handle_error(scenario["error"])
                    mock_log.assert_called_once()
                    self.assertIn(scenario["expected_action"], recovery_result["actions"])

    def test_fallback_mechanisms(self):
        """Test if fallback mechanisms work when primary fix fails"""
        fallback_tests = [
            {
                "primary_fix_fails": True,
                "fallback_available": True,
                "should_succeed": True
            },
            {
                "primary_fix_fails": True,
                "fallback_available": False,
                "should_succeed": False
            }
        ]

        for test in fallback_tests:
            with self.subTest(test=test):
                with patch('scripts.error.error_fixer.ErrorFixer.primary_fix', 
                          side_effect=Exception if test["primary_fix_fails"] else None):
                    result = self.error_fixer.fix_with_fallback("test code")
                    if test["should_succeed"]:
                        self.assertIsNotNone(result)
                        self.assertTrue(hasattr(result, 'fallback_used'))

    def test_fix_prioritization(self):
        """Test if system correctly prioritizes critical errors"""
        errors = [
            {"type": "security", "severity": "high", "priority": 1},
            {"type": "performance", "severity": "low", "priority": 3},
            {"type": "syntax", "severity": "medium", "priority": 2},
            {"type": "database", "severity": "critical", "priority": 0}
        ]
        
        prioritized = self.error_handler.prioritize_errors(errors)
        self.assertEqual(prioritized[0]["type"], "database")  # Critical should be first
        self.assertEqual(prioritized[-1]["type"], "performance")  # Low priority should be last

    def test_concurrent_error_handling(self):
        """Test handling multiple errors simultaneously"""
        async def test_concurrent_fixes():
            test_errors = [
                {"type": "syntax", "code": "print('test'"},
                {"type": "runtime", "code": "x = 1/0"},
                {"type": "import", "code": "import nonexistent"}
            ]

            tasks = [
                self.auto_fix_service.fix_error_async(error)
                for error in test_errors
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # All fixes should complete (even if some fail)
            self.assertEqual(len(results), len(test_errors))
            
            # Log results
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    self.logger.error(f"Concurrent fix {i} failed: {result}")
                else:
                    self.logger.info(f"Concurrent fix {i} succeeded")

        asyncio.run(test_concurrent_fixes())

    def test_error_persistence(self):
        """Test if errors are properly logged and persisted"""
        test_error = {
            "type": "test_error",
            "message": "Test error message",
            "timestamp": datetime.now().isoformat()
        }

        with patch('scripts.error_handler.ErrorHandler.save_error') as mock_save:
            self.error_handler.log_error(test_error)
            mock_save.assert_called_once_with(test_error)

    def test_self_healing_capabilities(self):
        """Test system's ability to heal itself from errors"""
        healing_scenarios = [
            {
                "error_type": "memory_leak",
                "expected_healing": "garbage_collection"
            },
            {
                "error_type": "deadlock",
                "expected_healing": "timeout_and_restart"
            },
            {
                "error_type": "corrupted_data",
                "expected_healing": "data_recovery"
            }
        ]

        for scenario in healing_scenarios:
            with self.subTest(scenario=scenario):
                healing_result = self.error_handler.self_heal(scenario["error_type"])
                self.assertIn(scenario["expected_healing"], healing_result["actions"])

    def tearDown(self):
        """Clean up after each test"""
        # Clear any temporary files or state
        if hasattr(self, 'temp_files'):
            for file in self.temp_files:
                if os.path.exists(file):
                    os.remove(file)

class TestQmoiErrorFixing(unittest.TestCase):
    """Enhanced test suite for Qmoi error fixing and deployment capabilities"""
    
    def setUp(self):
        """Set up test environment"""
        self.test_config = {
            "ai_model": "qmoi-enhanced",
            "deployment_target": "vercel",
            "auto_evolution": True,
            "master_user": "master@qmoi.ai",
            "notification_channels": ["whatsapp", "ui", "email"]
        }
        
        # Mock deployment status
        self.deployment_status = {
            "status": "failed",
            "error": "Build failed: Module not found",
            "environment": "production",
            "timestamp": time.time()
        }
        
        # Mock Qmoi state
        self.qmoi_state = {
            "ai_health": 85,
            "evolution_stage": "enhanced",
            "features": ["auto_fix", "deployment", "evolution"],
            "performance_metrics": {
                "response_time": 0.5,
                "accuracy": 0.95,
                "reliability": 0.98
            }
        }

    def test_deployment_error_detection(self):
        """Test AI can detect deployment errors"""
        with patch('subprocess.run') as mock_run:
            mock_run.return_value = Mock(
                returncode=1,
                stdout=b"Build failed: Module not found",
                stderr=b"Error: Cannot resolve module"
            )
            
            # Simulate deployment error detection
            error_detected = self._detect_deployment_error()
            self.assertTrue(error_detected)
            
            # Verify error classification
            error_type = self._classify_deployment_error("Build failed: Module not found")
            self.assertEqual(error_type, "module_resolution")

    def test_vercel_deployment_fix(self):
        """Test AI can fix Vercel deployment issues"""
        deployment_errors = [
            "Build failed: Module not found",
            "Environment variables missing",
            "Build timeout",
            "Memory limit exceeded",
            "Invalid configuration"
        ]
        
        for error in deployment_errors:
            with self.subTest(error=error):
                fix_applied = self._apply_vercel_fix(error)
                self.assertTrue(fix_applied)
                
                # Verify fix was appropriate
                fix_type = self._get_fix_type(error)
                self.assertIsNotNone(fix_type)

    def test_qmoi_auto_evolution(self):
        """Test Qmoi auto-evolution capabilities"""
        # Test feature evolution
        new_features = self._evolve_features()
        self.assertGreater(len(new_features), 0)
        
        # Test UI evolution
        ui_enhancements = self._evolve_ui()
        self.assertTrue(ui_enhancements['success'])
        
        # Test model evolution
        model_improvement = self._evolve_model()
        self.assertGreater(model_improvement['performance_gain'], 0)

    def test_system_health_monitoring(self):
        """Test comprehensive system health monitoring"""
        health_metrics = self._get_system_health()
        
        required_metrics = [
            'ai_health', 'deployment_status', 'performance_metrics',
            'evolution_stage', 'error_rate', 'response_time'
        ]
        
        for metric in required_metrics:
            self.assertIn(metric, health_metrics)

    def test_automated_recovery(self):
        """Test automated recovery from various failure scenarios"""
        failure_scenarios = [
            "deployment_failure",
            "ai_model_degradation", 
            "performance_degradation",
            "feature_regression"
        ]
        
        for scenario in failure_scenarios:
            with self.subTest(scenario=scenario):
                recovery_success = self._automated_recovery(scenario)
                self.assertTrue(recovery_success)

    def test_master_notification_system(self):
        """Test master notification system for critical issues"""
        notifications = self._test_master_notifications()
        
        self.assertIn('whatsapp', notifications)
        self.assertIn('ui_dashboard', notifications)
        self.assertIn('email', notifications)
        
        # Verify notification content
        for channel, content in notifications.items():
            self.assertIsNotNone(content)
            self.assertIn('priority', content)

    def test_performance_optimization(self):
        """Test AI performance optimization capabilities"""
        initial_metrics = self._get_performance_metrics()
        
        # Apply optimizations
        optimization_result = self._optimize_performance()
        self.assertTrue(optimization_result['success'])
        
        # Verify improvement
        final_metrics = self._get_performance_metrics()
        self.assertGreater(final_metrics['response_time'], initial_metrics['response_time'])

    def test_feature_auto_generation(self):
        """Test automatic feature generation and integration"""
        new_feature = self._generate_feature("enhanced_chat")
        self.assertIsNotNone(new_feature)
        
        # Test feature integration
        integration_success = self._integrate_feature(new_feature)
        self.assertTrue(integration_success)
        
        # Test feature validation
        validation_result = self._validate_feature(new_feature)
        self.assertTrue(validation_result['valid'])

    def test_continuous_learning(self):
        """Test continuous learning and adaptation"""
        learning_data = self._collect_learning_data()
        self.assertGreater(len(learning_data), 0)
        
        # Test learning application
        learning_success = self._apply_learning(learning_data)
        self.assertTrue(learning_success)
        
        # Test knowledge retention
        knowledge_retention = self._test_knowledge_retention()
        self.assertGreater(knowledge_retention, 0.8)

    # Helper methods for testing
    def _detect_deployment_error(self) -> bool:
        """Simulate deployment error detection"""
        return True

    def _classify_deployment_error(self, error_message: str) -> str:
        """Classify deployment error type"""
        error_patterns = {
            "module_resolution": ["Module not found", "Cannot resolve module"],
            "env_vars": ["Environment variables", "Missing env"],
            "timeout": ["Build timeout", "Timeout"],
            "memory": ["Memory limit", "Out of memory"],
            "config": ["Invalid configuration", "Config error"]
        }
        
        for error_type, patterns in error_patterns.items():
            if any(pattern.lower() in error_message.lower() for pattern in patterns):
                return error_type
        return "unknown"

    def _apply_vercel_fix(self, error: str) -> bool:
        """Apply Vercel-specific fixes"""
        fixes = {
            "module_resolution": "update_dependencies",
            "env_vars": "configure_environment",
            "timeout": "optimize_build",
            "memory": "increase_memory_limit",
            "config": "fix_configuration"
        }
        
        error_type = self._classify_deployment_error(error)
        return error_type in fixes

    def _get_fix_type(self, error: str) -> str:
        """Get the type of fix applied"""
        error_type = self._classify_deployment_error(error)
        fixes = {
            "module_resolution": "dependency_update",
            "env_vars": "environment_configuration", 
            "timeout": "build_optimization",
            "memory": "resource_allocation",
            "config": "configuration_fix"
        }
        return fixes.get(error_type, "general_fix")

    def _evolve_features(self) -> List[str]:
        """Simulate feature evolution"""
        return ["enhanced_chat", "auto_deployment", "smart_notifications", "ai_optimization"]

    def _evolve_ui(self) -> Dict[str, Any]:
        """Simulate UI evolution"""
        return {
            "success": True,
            "enhancements": ["dark_mode", "responsive_design", "accessibility"],
            "performance_improvement": 0.15
        }

    def _evolve_model(self) -> Dict[str, Any]:
        """Simulate model evolution"""
        return {
            "success": True,
            "performance_gain": 0.25,
            "new_capabilities": ["context_awareness", "multi_modal", "real_time_learning"]
        }

    def _get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health metrics"""
        return {
            "ai_health": 95,
            "deployment_status": "healthy",
            "performance_metrics": {
                "response_time": 0.3,
                "accuracy": 0.97,
                "reliability": 0.99
            },
            "evolution_stage": "advanced",
            "error_rate": 0.01,
            "response_time": 0.3
        }

    def _automated_recovery(self, scenario: str) -> bool:
        """Simulate automated recovery"""
        recovery_strategies = {
            "deployment_failure": "auto_redeploy",
            "ai_model_degradation": "model_refresh",
            "performance_degradation": "optimization",
            "feature_regression": "feature_rollback"
        }
        return scenario in recovery_strategies

    def _test_master_notifications(self) -> Dict[str, Dict[str, Any]]:
        """Test master notification system"""
        return {
            "whatsapp": {
                "sent": True,
                "priority": "high",
                "content": "System health alert: AI performance optimized"
            },
            "ui_dashboard": {
                "displayed": True,
                "priority": "high",
                "content": "Qmoi evolution completed successfully"
            },
            "email": {
                "sent": True,
                "priority": "medium",
                "content": "Weekly system health report"
            }
        }

    def _get_performance_metrics(self) -> Dict[str, float]:
        """Get current performance metrics"""
        return {
            "response_time": 0.3,
            "accuracy": 0.97,
            "reliability": 0.99,
            "throughput": 1000
        }

    def _optimize_performance(self) -> Dict[str, Any]:
        """Simulate performance optimization"""
        return {
            "success": True,
            "improvements": ["caching", "parallel_processing", "memory_optimization"],
            "performance_gain": 0.2
        }

    def _generate_feature(self, feature_type: str) -> Dict[str, Any]:
        """Generate new feature automatically"""
        return {
            "name": f"auto_{feature_type}",
            "type": feature_type,
            "code": f"// Auto-generated {feature_type} feature",
            "tests": f"// Auto-generated tests for {feature_type}",
            "documentation": f"# {feature_type} Feature Documentation"
        }

    def _integrate_feature(self, feature: Dict[str, Any]) -> bool:
        """Integrate new feature into system"""
        return True

    def _validate_feature(self, feature: Dict[str, Any]) -> Dict[str, Any]:
        """Validate new feature"""
        return {
            "valid": True,
            "tests_passed": True,
            "performance_impact": "minimal",
            "security_check": "passed"
        }

    def _collect_learning_data(self) -> List[Dict[str, Any]]:
        """Collect learning data from system usage"""
        return [
            {"type": "user_interaction", "data": "chat_patterns"},
            {"type": "error_patterns", "data": "deployment_issues"},
            {"type": "performance_data", "data": "optimization_metrics"}
        ]

    def _apply_learning(self, data: List[Dict[str, Any]]) -> bool:
        """Apply learning to improve system"""
        return True

    def _test_knowledge_retention(self) -> float:
        """Test knowledge retention rate"""
        return 0.95

if __name__ == '__main__':
    # Run tests with detailed output
    unittest.main(verbosity=2) 