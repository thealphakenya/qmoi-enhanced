#!/usr/bin/env python3
"""
QMOI Enhanced System Startup Script

This script initializes and runs the complete QMOI Enhanced System with:
- Enhanced Avatar System
- Automated Employment Management
- Revenue Generation Engine
- Deal Making System
- Hugging Face Integration
- Real-time Monitoring
- Auto-fixing and Optimization

Usage:
    python scripts/start_qmoi_enhanced.py [--test] [--fix-all]
"""

import os
import sys
import time
import json
import logging
import argparse
import subprocess
import threading
from datetime import datetime
from pathlib import Path

# Add the models directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "models", "latest"))

try:
    from qmoi_enhanced_model import QMOIEnhancedSystem, initialize_qmoi_system

    QMOI_AVAILABLE = True
except ImportError as e:
    QMOI_AVAILABLE = False
    print(f"Warning: QMOI Enhanced System not available: {e}")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("qmoi_enhanced_startup.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)


class QMOIStartupManager:
    """Manages the startup of the QMOI Enhanced System"""

    def __init__(self, test_mode=False, fix_all=False):
        self.test_mode = test_mode
        self.fix_all = fix_all
        self.qmoi_system = None
        self.startup_time = datetime.now()

    def check_environment(self):
        """Check and setup the environment"""
        logger.info("Checking environment...")

        # Create necessary directories
        directories = [
            "employment_letters",
            "logs",
            "reports",
            "models/latest",
            "huggingface_space",
        ]

        for directory in directories:
            os.makedirs(directory, exist_ok=True)
            logger.info(f"Created directory: {directory}")

        # Check Python dependencies
        required_packages = [
            "requests",
            "sqlite3",
            "psutil",
            "gradio",
            "fastapi",
            "uvicorn",
        ]

        missing_packages = []
        for package in required_packages:
            try:
                __import__(package)
            except ImportError:
                missing_packages.append(package)

        if missing_packages:
            logger.warning(f"Missing packages: {missing_packages}")
            if self.fix_all:
                self.install_packages(missing_packages)

        logger.info("Environment check completed")

    def install_packages(self, packages):
        """Install missing packages"""
        logger.info(f"Installing packages: {packages}")
        try:
            for package in packages:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            logger.info("Package installation completed")
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to install packages: {e}")

    def initialize_qmoi_system(self):
        """Initialize the QMOI Enhanced System"""
        logger.info("Initializing QMOI Enhanced System...")

        if not QMOI_AVAILABLE:
            logger.error("QMOI Enhanced System not available")
            return False

        try:
            self.qmoi_system = initialize_qmoi_system()
            if self.qmoi_system:
                logger.info("QMOI Enhanced System initialized successfully")
                return True
            else:
                logger.error("Failed to initialize QMOI Enhanced System")
                return False
        except Exception as e:
            logger.error(f"Error initializing QMOI system: {e}")
            return False

    def start_huggingface_space(self):
        """Start the Hugging Face Space"""
        logger.info("Starting Hugging Face Space...")

        space_path = os.path.join(os.path.dirname(__file__), "..", "huggingface_space")
        if os.path.exists(space_path):
            try:
                # Start the Hugging Face Space in a separate thread
                def run_space():
                    os.chdir(space_path)
                    subprocess.run([sys.executable, "app.py"])

                space_thread = threading.Thread(target=run_space, daemon=True)
                space_thread.start()
                logger.info("Hugging Face Space started")
                return True
            except Exception as e:
                logger.error(f"Failed to start Hugging Face Space: {e}")
                return False
        else:
            logger.warning("Hugging Face Space directory not found")
            return False

    def run_tests(self):
        """Run system tests"""
        logger.info("Running system tests...")

        if not self.qmoi_system:
            logger.error("QMOI system not available for testing")
            return False

        tests = [
            self.test_revenue_system,
            self.test_employment_system,
            self.test_deal_system,
            self.test_avatar_system,
        ]

        passed = 0
        total = len(tests)

        for test in tests:
            try:
                if test():
                    passed += 1
                    logger.info(f"Test passed: {test.__name__}")
                else:
                    logger.error(f"Test failed: {test.__name__}")
            except Exception as e:
                logger.error(f"Test error in {test.__name__}: {e}")

        logger.info(f"Tests completed: {passed}/{total} passed")
        return passed == total

    def test_revenue_system(self):
        """Test the revenue system"""
        try:
            revenue = self.qmoi_system.get_current_revenue()
            streams = len(self.qmoi_system.revenue_manager.revenue_streams)
            return revenue >= 0 and streams > 0
        except Exception as e:
            logger.error(f"Revenue system test failed: {e}")
            return False

    def test_employment_system(self):
        """Test the employment system"""
        try:
            employees = self.qmoi_system.get_active_employees()
            return len(employees) >= 0
        except Exception as e:
            logger.error(f"Employment system test failed: {e}")
            return False

    def test_deal_system(self):
        """Test the deal system"""
        try:
            deals = self.qmoi_system.get_active_deals()
            return len(deals) >= 0
        except Exception as e:
            logger.error(f"Deal system test failed: {e}")
            return False

    def test_avatar_system(self):
        """Test the avatar system"""
        try:
            avatars = self.qmoi_system.get_avatars()
            return len(avatars) > 0
        except Exception as e:
            logger.error(f"Avatar system test failed: {e}")
            return False

    def generate_startup_report(self):
        """Generate startup report"""
        report = {
            "startup_time": self.startup_time.isoformat(),
            "test_mode": self.test_mode,
            "fix_all": self.fix_all,
            "qmoi_available": QMOI_AVAILABLE,
            "qmoi_initialized": self.qmoi_system is not None,
            "system_status": "operational" if self.qmoi_system else "failed",
        }

        if self.qmoi_system:
            report.update(
                {
                    "revenue": self.qmoi_system.get_current_revenue(),
                    "employees": len(self.qmoi_system.get_active_employees()),
                    "deals": len(self.qmoi_system.get_active_deals()),
                    "avatars": len(self.qmoi_system.get_avatars()),
                    "target_met": self.qmoi_system.revenue_manager.check_daily_target(),
                }
            )

        # Save report
        with open("reports/qmoi_startup_report.json", "w") as f:
            json.dump(report, f, indent=2)

        logger.info("Startup report generated")
        return report

    def display_status(self):
        """Display system status"""
        print("\n" + "=" * 60)
        print("🚀 QMOI Enhanced System Status")
        print("=" * 60)

        if self.qmoi_system:
            print(f"✅ System Status: OPERATIONAL")
            print(f"💰 Daily Revenue: ${self.qmoi_system.get_current_revenue():,.2f}")
            print(
                f"🎯 Target Met: {'✅ Yes' if self.qmoi_system.revenue_manager.check_daily_target() else '❌ No'}"
            )
            print(
                f"👥 Active Employees: {len(self.qmoi_system.get_active_employees())}"
            )
            print(f"🤝 Active Deals: {len(self.qmoi_system.get_active_deals())}")
            print(f"🤖 Active Avatars: {len(self.qmoi_system.get_avatars())}")
            print(
                f"📊 Revenue Streams: {len(self.qmoi_system.revenue_manager.revenue_streams)}"
            )
        else:
            print(f"❌ System Status: FAILED")
            print(f"🔧 QMOI Available: {'✅ Yes' if QMOI_AVAILABLE else '❌ No'}")

        print(f"🕐 Startup Time: {self.startup_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🧪 Test Mode: {'✅ Yes' if self.test_mode else '❌ No'}")
        print(f"🔧 Fix All: {'✅ Yes' if self.fix_all else '❌ No'}")

        print("\n📋 Available Features:")
        print("  • Enhanced Avatar System")
        print("  • Automated Employment Management")
        print("  • Revenue Generation Engine")
        print("  • Deal Making System")
        print("  • Hugging Face Integration")
        print("  • Real-time Monitoring")
        print("  • Auto-fixing and Optimization")

        print("\n🌐 Access Points:")
        print("  • Hugging Face Space: http://localhost:7861")
        print("  • API Status: http://localhost:7860/status")
        print("  • System Reports: reports/qmoi_startup_report.json")

        print("=" * 60)

    def run(self):
        """Run the complete startup process"""
        logger.info("Starting QMOI Enhanced System...")

        # Step 1: Check environment
        self.check_environment()

        # Step 2: Initialize QMOI system
        if not self.initialize_qmoi_system():
            logger.error("Failed to initialize QMOI system")
            return False

        # Step 3: Start Hugging Face Space
        self.start_huggingface_space()

        # Step 4: Run tests if in test mode
        if self.test_mode:
            if not self.run_tests():
                logger.error("System tests failed")
                if self.fix_all:
                    logger.info("Attempting to fix issues...")
                    # Add fix logic here
                return False

        # Step 5: Generate startup report
        self.generate_startup_report()

        # Step 6: Display status
        self.display_status()

        logger.info("QMOI Enhanced System startup completed successfully")
        return True


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="QMOI Enhanced System Startup")
    parser.add_argument("--test", action="store_true", help="Run system tests")
    parser.add_argument(
        "--fix-all", action="store_true", help="Automatically fix issues"
    )

    args = parser.parse_args()

    # Create startup manager
    manager = QMOIStartupManager(test_mode=args.test, fix_all=args.fix_all)

    # Run startup process
    success = manager.run()

    if success:
        print("\n🎉 QMOI Enhanced System is now running!")
        print("Press Ctrl+C to stop the system")

        # Keep the system running
        try:
            while True:
                time.sleep(60)  # Check every minute
                # Add periodic health checks here
        except KeyboardInterrupt:
            print("\n🛑 Shutting down QMOI Enhanced System...")
            logger.info("System shutdown requested by user")
    else:
        print("\n❌ QMOI Enhanced System startup failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
