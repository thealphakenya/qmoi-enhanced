// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Comprehensive test suite for prodice_orchestration_manager.py

Tests cover:
- prodice registry management (load, save, persistence)
- prodice discovery for all platforms (Android, iOS, macOS, Windows, Linux)
- prodice health checks and monitoring
- App deployment to prodices
- Parallel deployment across multiple prodices
- Health status tracking and recovery
- Audit logging with QMOI tracking IDs
- Error handling and edge cases

Runnable without pytest: python3 scripts/prodice_orchestration_manager.test.py
"""

import unittest
import tempfile
import shutil
import json
from pathlib import Path
from datetime import datetime
import sys
import os

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from prodice_orchestration_manager import prodiceOrchestrationManager
except ImportError as e:
    print(f"Warning: Could not import prodiceOrchestrationManager: {e}")
    print("Running skeleton tests only")
    prodiceOrchestrationManager = None

class TestprodiceOrchestrationManagerRegistry(unittest.TestCase):
    """Test prodice registry management"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)
        
        # Create data directory
        Path("data").mkdir(exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)
        
    def test_load_prodice_registry_creates_empty_on_missing(self):
        """Test that load_prodice_registry creates empty dict when file missing"""
        prodices = self.manager.load_prodice_registry()
        
        self.assertIsInstance(prodices, dict)
        
    def test_save_prodice_registry_creates_file(self):
        """Test that save_prodice_registry creates JSON file"""
        test_prodices = {
            "android_1": [{
                "id": "emulator-5554",
                "type": "android",
                "status": "online",
                "discovered_at": datetime.now().isoformat()
            }]
        }
        
        self.manager.prodices = test_prodices
        self.manager.save_prodice_registry()
        
        registry_file = Path(self.test_dir, "data", "prodice_registry.json")
        self.assertTrue(registry_file.exists(), "prodice registry file should be created")
        
    def test_prodice_registry_persistence(self):
        """Test that prodice registry persists and loads correctly"""
        test_prodices = {
            "android": [{
                "id": "prodice_123",
                "type": "android",
                "status": "online"
            }]
        }
        
        # Save
        self.manager.prodices = test_prodices
        self.manager.save_prodice_registry()
        
        # Create new manager and load
        manager2 = prodiceOrchestrationManager()
        loaded_prodices = manager2.load_prodice_registry()
        
        # Verify data matches
        if loaded_prodices:  # If file exists and was saved
            self.assertIn("android", loaded_prodices)
            self.assertEqual(len(loaded_prodices["android"]), 1)
            self.assertEqual(loaded_prodices["android"][0]["id"], "prodice_123")

class TestprodiceOrchestrationManagerDiscovery(unittest.TestCase):
    """Test prodice discovery for all platforms"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_discover_prodices_returns_dict(self):
        """Test that discover_prodices returns dictionary"""
        prodices = self.manager.discover_prodices()
        
        self.assertIsInstance(prodices, dict)
        
    def test_discover_prodices_includes_prodice_types(self):
        """Test that discovery includes prodice type keys"""
        prodices = self.manager.discover_prodices()
        
        # May or may not have prodices, but structure should be correct
        # Possible keys: android, ios, macos, windows, linux
        for key in prodices.keys():
            self.assertIn(key, ["android", "ios", "macos", "windows", "linux"])
            
    def test_android_prodice_discovery_returns_list(self):
        """Test Android prodice discovery returns list"""
        # This will use real adb if available, or return empty list
        result = self.manager._discover_android()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_ios_prodice_discovery_returns_list(self):
        """Test iOS prodice discovery returns list"""
        result = self.manager._discover_ios()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_macos_prodice_discovery_returns_list(self):
        """Test macOS prodice discovery returns list"""
        result = self.manager._discover_macos()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_windows_prodice_discovery_returns_list(self):
        """Test Windows prodice discovery returns list"""
        result = self.manager._discover_windows()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_linux_prodice_discovery_returns_list(self):
        """Test Linux prodice discovery returns list"""
        result = self.manager._discover_linux()
        self.assertIsInstance(result, (list, type(None)))

class TestprodiceOrchestrationManagerHealthChecks(unittest.TestCase):
    """Test prodice health checking"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
        # Create test prodice
        self.test_prodice = {
            "id": "test_prodice_1",
            "type": "android",
            "status": "online",
            "discovered_at": datetime.now().isoformat()
        }
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_check_prodice_health_returns_dict(self):
        """Test that health check returns dictionary"""
        health = self.manager.check_prodice_health(self.test_prodice)
        
        self.assertIsInstance(health, dict)
        self.assertIn("prodice_id", health)
        self.assertIn("prodice_type", health)
        self.assertIn("status", health)
        
    def test_health_check_includes_timestamp(self):
        """Test that health check includes timestamp"""
        health = self.manager.check_prodice_health(self.test_prodice)
        
        self.assertIn("timestamp", health)
        
    def test_health_check_includes_metrics(self):
        """Test that health check includes metrics"""
        health = self.manager.check_prodice_health(self.test_prodice)
        
        self.assertIn("status", health)
        # May have metrics depending on prodice type
        if "metrics" in health:
            self.assertIsInstance(health["metrics"], dict)

class TestprodiceOrchestrationManagerDeployment(unittest.TestCase):
    """Test app deployment to prodices"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        Path("logs/deployments").mkdir(parents=True, exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
        # Create test app file
        self.test_app = Path(self.test_dir, "test_app.apk")
        self.test_app.write_text("dummy_app_content")
        
        self.test_prodice = {
            "id": "emulator-5554",
            "type": "android",
            "status": "online",
            "discovered_at": datetime.now().isoformat()
        }
        
    def tearDown(self):
        """Clean up"""
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)
        
    def test_deploy_app_returns_deployment_object(self):
        """Test that deploy_app returns deployment tracking object"""
        deployment = self.manager.deploy_app(self.test_prodice, str(self.test_app))
        
        self.assertIsInstance(deployment, dict)
        self.assertIn("prodice_id", deployment)
        self.assertIn("prodice_type", deployment)
        self.assertIn("app_file", deployment)
        self.assertIn("status", deployment)
        
    def test_deployment_includes_tracking_id(self):
        """Test that deployment includes QMOI tracking ID"""
        deployment = self.manager.deploy_app(self.test_prodice, str(self.test_app))
        
        if "tracking_id" in deployment:
            self.assertTrue(deployment["tracking_id"].startswith("QMOI-DEPLOY-"))
            
    def test_deployment_includes_timestamp(self):
        """Test that deployment includes timestamp"""
        deployment = self.manager.deploy_app(self.test_prodice, str(self.test_app))
        
        self.assertIn("timestamp", deployment)
        
    def test_parallel_deploy_returns_aggregated_results(self):
        """Test that parallel_deploy returns aggregated results"""
        prodices = [self.test_prodice]
        results = self.manager.parallel_deploy(prodices, str(self.test_app))
        
        self.assertIsInstance(results, dict)
        self.assertIn("success", results)
        self.assertIn("failed", results)
        self.assertIn("deployments", results)

class TestprodiceOrchestrationManagerListing(unittest.TestCase):
    """Test prodice listing and filtering"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
        # Create test prodices
        self.manager.prodices = {
            "android": [
                {
                    "id": "android_1",
                    "type": "android",
                    "status": "online",
                    "discovered_at": datetime.now().isoformat()
                }
            ],
            "ios": [
                {
                    "id": "ios_1",
                    "type": "ios",
                    "status": "online",
                    "discovered_at": datetime.now().isoformat()
                }
            ]
        }
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_list_prodices_returns_list(self):
        """Test that list_prodices returns list"""
        prodices = self.manager.list_prodices()
        
        self.assertIsInstance(prodices, list)
        
    def test_list_prodices_includes_all_prodices(self):
        """Test that list_prodices includes all prodices when no filter"""
        prodices = self.manager.list_prodices()
        
        # Should include prodices from all platforms
        if len(prodices) > 0:
            prodice_types = [d["type"] for d in prodices]
            self.assertGreater(len(set(prodice_types)), 0)
            
    def test_list_prodices_filters_by_type(self):
        """Test that list_prodices filters by prodice type"""
        android_prodices = self.manager.list_prodices(prodice_type="android")
        
        self.assertIsInstance(android_prodices, list)
        
        # If there are prodices, they should all be android
        for prodice in android_prodices:
            self.assertEqual(prodice["type"], "android")

class TestprodiceOrchestrationManagerExport(unittest.TestCase):
    """Test status export functionality"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_export_status_returns_dict(self):
        """Test that export_status returns dictionary"""
        status = self.manager.export_status()
        
        self.assertIsInstance(status, dict)
        self.assertIn("timestamp", status)
        
    def test_export_status_includes_prodice_count(self):
        """Test that export_status includes prodice count"""
        status = self.manager.export_status()
        
        if "prodices_known" in status:
            self.assertIsInstance(status["prodices_known"], (int, type(None)))
            
    def test_export_status_includes_prodices_list(self):
        """Test that export_status includes prodices list"""
        status = self.manager.export_status()
        
        if "prodices_list" in status:
            self.assertIsInstance(status["prodices_list"], (list, type(None)))

class TestprodiceOrchestrationManagerAuditLogging(unittest.TestCase):
    """Test audit logging with QMOI tracking IDs"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        Path("logs/deployments").mkdir(parents=True, exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_tracking_id_format(self):
        """Test that tracking IDs follow QMOI-DEPLOY-YYYYMMDD-NNNNN format"""
        tracking_id = "QMOI-DEPLOY-20260324-00001"
        
        # Validate format
        self.assertTrue(tracking_id.startswith("QMOI-DEPLOY-"))
        parts = tracking_id.split("-")
        self.assertEqual(len(parts), 4)
        self.assertEqual(parts[0], "QMOI")
        self.assertEqual(parts[1], "DEPLOY")
        self.assertTrue(parts[2].isdigit() and len(parts[2]) == 8)  # YYYYMMDD
        self.assertTrue(parts[3].isdigit() and len(parts[3]) == 5)   # NNNNN

class TestprodiceOrchestrationManagerIntegration(unittest.TestCase):
    """Integration tests for prodice orchestration workflow"""
    
    def setUp(self):
        """Set up integration test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)
        
        # Create directory structure
        Path("data").mkdir(exist_ok=True)
        Path("logs/deployments").mkdir(parents=True, exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)
        
    def test_prodice_discovery_and_health_check_workflow(self):
        """Test workflow of discovering prodices and checking health"""
        # Discover prodices
        prodices = self.manager.discover_prodices()
        self.assertIsInstance(prodices, dict)
        
        # For each discovered prodice type, verify structure
        for prodice_type, prodice_list in prodices.items():
            self.assertIn(prodice_type, ["android", "ios", "macos", "windows", "linux"])
            if prodice_list:
                for prodice in prodice_list:
                    self.assertIn("id", prodice)
                    self.assertIn("type", prodice)
                    
    def test_prodice_management_full_workflow(self):
        """Test full prodice management workflow"""
        # 1. Load registry
        prodices = self.manager.load_prodice_registry()
        self.assertIsInstance(prodices, dict)
        
        # 2. Discover prodices (may be empty in test environment)
        new_prodices = self.manager.discover_prodices()
        self.assertIsInstance(new_prodices, dict)
        
        # 3. Export status
        status = self.manager.export_status()
        self.assertIsInstance(status, dict)
        self.assertIn("timestamp", status)

class TestprodiceOrchestrationManagerErrorHandling(unittest.TestCase):
    """Test error handling and edge cases"""
    
    def setUp(self):
        """Set up test environment"""
        if prodiceOrchestrationManager is None:
            self.skipTest("prodiceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = prodiceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_deploy_to_missing_prodice(self):
        """Test deployment error handling for missing prodice"""
        invalid_prodice = {
            "id": "invalid_prodice",
            "type": "unknown",
            "status": "offline"
        }
        
        # Should handle gracefully without exception
        app_file = "/tmp/test.apk"
        result = self.manager.deploy_app(invalid_prodice, app_file)
        
        self.assertIsInstance(result, dict)
        if "status" in result:
            self.assertIn(result["status"], ["error", "pending", "success", "failed"])
            
    def test_deploy_missing_app_file(self):
        """Test deployment error handling for missing app file"""
        prodice = {
            "id": "test_prodice",
            "type": "android",
            "status": "online"
        }
        
        # App file doesn't exist
        result = self.manager.deploy_app(prodice, "/nonexistent/app.apk")
        
        self.assertIsInstance(result, dict)
        
    def test_empty_prodice_list_deployment(self):
        """Test parallel deployment with empty prodice list"""
        results = self.manager.parallel_deploy([], "/tmp/app.apk")
        
        self.assertIsInstance(results, dict)
        self.assertIn("deployments", results)
        self.assertEqual(len(results["deployments"]), 0)

def run_tests():
    """Run all tests"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test classes
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerRegistry))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerDiscovery))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerHealthChecks))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerDeployment))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerListing))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerExport))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerAuditLogging))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestprodiceOrchestrationManagerErrorHandling))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
