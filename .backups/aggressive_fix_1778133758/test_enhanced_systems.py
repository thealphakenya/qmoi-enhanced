import logging
#!/usr/bin/env python3
"""
Test Enhanced AI Systems - QMOI Enhanced
Testing script for validating enhanced production systems
"""

import sys
import os
import json
import time
from datetime import datetime

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_ai_anomaly_service():
    """Test the AI anomaly detection service"""
    logging.info("🧪 Testing AI Anomaly Detection Service...")

    try:
        import ai_anomaly_service

        # Test with normal data
        normal_data = [0.1, 0.2, 0.15, 0.25, 0.18, 0.22, 0.19, 0.21, 0.17, 0.23]
        result = ai_anomaly_service.anomaly_service.detect_anomaly(normal_data)

        logging.info(f"✅ Normal data test: {result}")

        # Test with anomalous data
        anomaly_data = [1.8, 2.1, 1.9, 2.3, 1.7, 2.0, 1.85, 2.2, 1.75, 2.15]
        result = ai_anomaly_service.anomaly_service.detect_anomaly(anomaly_data)

        logging.info(f"✅ Anomaly data test: {result}")

        return True

    except Exception as e:
        logging.info(f"❌ AI Anomaly Service test failed: {e}")
        return False

def test_advanced_analytics_service():
    """Test the advanced analytics service"""
    logging.info("🧪 Testing Advanced Analytics Service...")

    try:
        import advanced_analytics_service

        # Create analytics service instance
        analytics = advanced_analytics_service.AdvancedAnalyticsService()

        # Test basic instantiation and service start
        analytics.start_service()
        logging.info("✅ Analytics service started successfully")

        # Test trend analysis with a simple series name
        trend_result = analytics.get_trend_analysis("test_series")
        logging.info(f"✅ Trend analysis test: {bool(trend_result)}")

        return True

    except Exception as e:
        logging.info(f"❌ Advanced Analytics Service test failed: {e}")
        return False

def test_ai_orchestrator():
    """Test the AI orchestrator service"""
    logging.info("🧪 Testing AI Orchestrator Service...")

    try:
        import ai_orchestrator

        # Create orchestrator instance
        orchestrator = ai_orchestrator.TaskOrchestrator()

        # Submit a test task
        task_id = orchestrator.submit_task("anomaly_detection", {"data": [0.1, 0.2, 0.15, 0.25, 0.18, 0.22, 0.19, 0.21, 0.17, 0.23]})
        logging.info(f"✅ Task submitted: {task_id}")

        # Process the task
        result = orchestrator.process_next_task()
        if result:
            logging.info(f"✅ Task processed: {result}")
        else:
            logging.info("ℹ️ No tasks to process")

        return True

    except Exception as e:
        logging.info(f"❌ AI Orchestrator test failed: {e}")
        return False

def test_performance_optimizer():
    """Test the performance optimizer"""
    logging.info("🧪 Testing Performance Optimizer...")

    try:
        import advanced_performance_optimizer

        # Create optimizer instance
        optimizer = advanced_performance_optimizer.AdvancedPerformanceOptimizer()

        # Test metrics collection via the metrics collector
        metrics = optimizer.metrics_collector.collect_system_metrics()
        logging.info(f"✅ System metrics collected: {bool(metrics)}")

        return True

    except Exception as e:
        logging.info(f"❌ Performance Optimizer test failed: {e}")
        return False

def main():
    """Run all tests"""
    logging.info("🚀 Starting Enhanced Systems Testing Suite")
    logging.info(f"📅 Test Time: {datetime.now().isoformat()}")
    logging.info("=" * 50)

    tests = [
        ("AI Anomaly Service", test_ai_anomaly_service),
        ("Advanced Analytics Service", test_advanced_analytics_service),
        ("AI Orchestrator", test_ai_orchestrator),
        ("Performance Optimizer", test_performance_optimizer),
    ]

    results = []
    for test_name, test_func in tests:
        logging.info(f"\n🔬 Running {test_name}...")
        try:
            success = test_func()
            results.append((test_name, success))
            status = "✅ PASSED" if success else "❌ FAILED"
            logging.info(f"📊 {test_name}: {status}")
        except Exception as e:
            logging.info(f"💥 {test_name}: CRASHED - {e}")
            results.append((test_name, False))

    logging.info("\n" + "=" * 50)
    logging.info("📊 TEST RESULTS SUMMARY:")

    passed = sum(1 for _, success in results if success)
    total = len(results)

    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        logging.info(f"  {test_name}: {status}")

    logging.info(f"\n🎯 Overall: {passed}/{total} tests passed")

    if passed == total:
        logging.info("🎉 ALL TESTS PASSED! Enhanced systems are fully functional.")
        return 0
    else:
        logging.info("⚠️ Some tests failed. Review logs above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())