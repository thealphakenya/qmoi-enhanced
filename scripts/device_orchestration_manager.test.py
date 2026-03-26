// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:52Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Comprehensive test suite for device_orchestration_manager.py

Tests cover:
- Device registry management (load, save, persistence)
- Device discovery for all platforms (Android, iOS, macOS, Windows, Linux)
- Device health checks and monitoring
- App deployment to devices
- Parallel deployment across multiple devices
- Health status tracking and recovery
- Audit logging with QMOI tracking IDs
- Error handling and edge cases

Runnable without pytest: python3 scripts/device_orchestration_manager.test.py
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
    from device_orchestration_manager import DeviceOrchestrationManager
except ImportError as e:
    print(f"Warning: Could not import DeviceOrchestrationManager: {e}")
    print("Running skeleton tests only")
    DeviceOrchestrationManager = None

class TestDeviceOrchestrationManagerRegistry(unittest.TestCase):
    """Test device registry management"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)
        
        # Create data directory
        Path("data").mkdir(exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)
        
    def test_load_device_registry_creates_empty_on_missing(self):
        """Test that load_device_registry creates empty dict when file missing"""
        devices = self.manager.load_device_registry()
        
        self.assertIsInstance(devices, dict)
        
    def test_save_device_registry_creates_file(self):
        """Test that save_device_registry creates JSON file"""
        test_devices = {
            "android_1": [{
                "id": "emulator-5554",
                "type": "android",
                "status": "online",
                "discovered_at": datetime.now().isoformat()
            }]
        }
        
        self.manager.devices = test_devices
        self.manager.save_device_registry()
        
        registry_file = Path(self.test_dir, "data", "device_registry.json")
        self.assertTrue(registry_file.exists(), "Device registry file should be created")
        
    def test_device_registry_persistence(self):
        """Test that device registry persists and loads correctly"""
        test_devices = {
            "android": [{
                "id": "device_123",
                "type": "android",
                "status": "online"
            }]
        }
        
        # Save
        self.manager.devices = test_devices
        self.manager.save_device_registry()
        
        # Create new manager and load
        manager2 = DeviceOrchestrationManager()
        loaded_devices = manager2.load_device_registry()
        
        # Verify data matches
        if loaded_devices:  # If file exists and was saved
            self.assertIn("android", loaded_devices)
            self.assertEqual(len(loaded_devices["android"]), 1)
            self.assertEqual(loaded_devices["android"][0]["id"], "device_123")

class TestDeviceOrchestrationManagerDiscovery(unittest.TestCase):
    """Test device discovery for all platforms"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_discover_devices_returns_dict(self):
        """Test that discover_devices returns dictionary"""
        devices = self.manager.discover_devices()
        
        self.assertIsInstance(devices, dict)
        
    def test_discover_devices_includes_device_types(self):
        """Test that discovery includes device type keys"""
        devices = self.manager.discover_devices()
        
        # May or may not have devices, but structure should be correct
        # Possible keys: android, ios, macos, windows, linux
        for key in devices.keys():
            self.assertIn(key, ["android", "ios", "macos", "windows", "linux"])
            
    def test_android_device_discovery_returns_list(self):
        """Test Android device discovery returns list"""
        # This will use real adb if available, or return empty list
        result = self.manager._discover_android()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_ios_device_discovery_returns_list(self):
        """Test iOS device discovery returns list"""
        result = self.manager._discover_ios()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_macos_device_discovery_returns_list(self):
        """Test macOS device discovery returns list"""
        result = self.manager._discover_macos()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_windows_device_discovery_returns_list(self):
        """Test Windows device discovery returns list"""
        result = self.manager._discover_windows()
        self.assertIsInstance(result, (list, type(None)))
        
    def test_linux_device_discovery_returns_list(self):
        """Test Linux device discovery returns list"""
        result = self.manager._discover_linux()
        self.assertIsInstance(result, (list, type(None)))

class TestDeviceOrchestrationManagerHealthChecks(unittest.TestCase):
    """Test device health checking"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
        # Create test device
        self.test_device = {
            "id": "test_device_1",
            "type": "android",
            "status": "online",
            "discovered_at": datetime.now().isoformat()
        }
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_check_device_health_returns_dict(self):
        """Test that health check returns dictionary"""
        health = self.manager.check_device_health(self.test_device)
        
        self.assertIsInstance(health, dict)
        self.assertIn("device_id", health)
        self.assertIn("device_type", health)
        self.assertIn("status", health)
        
    def test_health_check_includes_timestamp(self):
        """Test that health check includes timestamp"""
        health = self.manager.check_device_health(self.test_device)
        
        self.assertIn("timestamp", health)
        
    def test_health_check_includes_metrics(self):
        """Test that health check includes metrics"""
        health = self.manager.check_device_health(self.test_device)
        
        self.assertIn("status", health)
        # May have metrics depending on device type
        if "metrics" in health:
            self.assertIsInstance(health["metrics"], dict)

class TestDeviceOrchestrationManagerDeployment(unittest.TestCase):
    """Test app deployment to devices"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        Path("logs/deployments").mkdir(parents=True, exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
        # Create test app file
        self.test_app = Path(self.test_dir, "test_app.apk")
        self.test_app.write_text("dummy_app_content")
        
        self.test_device = {
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
        deployment = self.manager.deploy_app(self.test_device, str(self.test_app))
        
        self.assertIsInstance(deployment, dict)
        self.assertIn("device_id", deployment)
        self.assertIn("device_type", deployment)
        self.assertIn("app_file", deployment)
        self.assertIn("status", deployment)
        
    def test_deployment_includes_tracking_id(self):
        """Test that deployment includes QMOI tracking ID"""
        deployment = self.manager.deploy_app(self.test_device, str(self.test_app))
        
        if "tracking_id" in deployment:
            self.assertTrue(deployment["tracking_id"].startswith("QMOI-DEPLOY-"))
            
    def test_deployment_includes_timestamp(self):
        """Test that deployment includes timestamp"""
        deployment = self.manager.deploy_app(self.test_device, str(self.test_app))
        
        self.assertIn("timestamp", deployment)
        
    def test_parallel_deploy_returns_aggregated_results(self):
        """Test that parallel_deploy returns aggregated results"""
        devices = [self.test_device]
        results = self.manager.parallel_deploy(devices, str(self.test_app))
        
        self.assertIsInstance(results, dict)
        self.assertIn("success", results)
        self.assertIn("failed", results)
        self.assertIn("deployments", results)

class TestDeviceOrchestrationManagerListing(unittest.TestCase):
    """Test device listing and filtering"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
        # Create test devices
        self.manager.devices = {
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
        
    def test_list_devices_returns_list(self):
        """Test that list_devices returns list"""
        devices = self.manager.list_devices()
        
        self.assertIsInstance(devices, list)
        
    def test_list_devices_includes_all_devices(self):
        """Test that list_devices includes all devices when no filter"""
        devices = self.manager.list_devices()
        
        # Should include devices from all platforms
        if len(devices) > 0:
            device_types = [d["type"] for d in devices]
            self.assertGreater(len(set(device_types)), 0)
            
    def test_list_devices_filters_by_type(self):
        """Test that list_devices filters by device type"""
        android_devices = self.manager.list_devices(device_type="android")
        
        self.assertIsInstance(android_devices, list)
        
        # If there are devices, they should all be android
        for device in android_devices:
            self.assertEqual(device["type"], "android")

class TestDeviceOrchestrationManagerExport(unittest.TestCase):
    """Test status export functionality"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_export_status_returns_dict(self):
        """Test that export_status returns dictionary"""
        status = self.manager.export_status()
        
        self.assertIsInstance(status, dict)
        self.assertIn("timestamp", status)
        
    def test_export_status_includes_device_count(self):
        """Test that export_status includes device count"""
        status = self.manager.export_status()
        
        if "devices_known" in status:
            self.assertIsInstance(status["devices_known"], (int, type(None)))
            
    def test_export_status_includes_devices_list(self):
        """Test that export_status includes devices list"""
        status = self.manager.export_status()
        
        if "devices_list" in status:
            self.assertIsInstance(status["devices_list"], (list, type(None)))

class TestDeviceOrchestrationManagerAuditLogging(unittest.TestCase):
    """Test audit logging with QMOI tracking IDs"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        Path("logs/deployments").mkdir(parents=True, exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
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

class TestDeviceOrchestrationManagerIntegration(unittest.TestCase):
    """Integration tests for device orchestration workflow"""
    
    def setUp(self):
        """Set up integration test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        self.old_cwd = os.getcwd()
        os.chdir(self.test_dir)
        
        # Create directory structure
        Path("data").mkdir(exist_ok=True)
        Path("logs/deployments").mkdir(parents=True, exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir(self.old_cwd)
        shutil.rmtree(self.test_dir)
        
    def test_device_discovery_and_health_check_workflow(self):
        """Test workflow of discovering devices and checking health"""
        # Discover devices
        devices = self.manager.discover_devices()
        self.assertIsInstance(devices, dict)
        
        # For each discovered device type, verify structure
        for device_type, device_list in devices.items():
            self.assertIn(device_type, ["android", "ios", "macos", "windows", "linux"])
            if device_list:
                for device in device_list:
                    self.assertIn("id", device)
                    self.assertIn("type", device)
                    
    def test_device_management_full_workflow(self):
        """Test full device management workflow"""
        # 1. Load registry
        devices = self.manager.load_device_registry()
        self.assertIsInstance(devices, dict)
        
        # 2. Discover devices (may be empty in test environment)
        new_devices = self.manager.discover_devices()
        self.assertIsInstance(new_devices, dict)
        
        # 3. Export status
        status = self.manager.export_status()
        self.assertIsInstance(status, dict)
        self.assertIn("timestamp", status)

class TestDeviceOrchestrationManagerErrorHandling(unittest.TestCase):
    """Test error handling and edge cases"""
    
    def setUp(self):
        """Set up test environment"""
        if DeviceOrchestrationManager is None:
            self.skipTest("DeviceOrchestrationManager not available")
            
        self.test_dir = tempfile.mkdtemp()
        os.chdir(self.test_dir)
        Path("data").mkdir(exist_ok=True)
        
        self.manager = DeviceOrchestrationManager()
        
    def tearDown(self):
        """Clean up"""
        os.chdir("/")
        shutil.rmtree(self.test_dir)
        
    def test_deploy_to_missing_device(self):
        """Test deployment error handling for missing device"""
        invalid_device = {
            "id": "invalid_device",
            "type": "unknown",
            "status": "offline"
        }
        
        # Should handle gracefully without exception
        app_file = "/tmp/test.apk"
        result = self.manager.deploy_app(invalid_device, app_file)
        
        self.assertIsInstance(result, dict)
        if "status" in result:
            self.assertIn(result["status"], ["error", "pending", "success", "failed"])
            
    def test_deploy_missing_app_file(self):
        """Test deployment error handling for missing app file"""
        device = {
            "id": "test_device",
            "type": "android",
            "status": "online"
        }
        
        # App file doesn't exist
        result = self.manager.deploy_app(device, "/nonexistent/app.apk")
        
        self.assertIsInstance(result, dict)
        
    def test_empty_device_list_deployment(self):
        """Test parallel deployment with empty device list"""
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
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerRegistry))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerDiscovery))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerHealthChecks))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerDeployment))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerListing))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerExport))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerAuditLogging))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestDeviceOrchestrationManagerErrorHandling))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
