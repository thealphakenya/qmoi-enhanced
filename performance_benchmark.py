import logging
#!/usr/bin/env python3
"""
Performance Benchmark Suite - QMOI Enhanced
Comprehensive performance testing for enhanced production systems
"""

import sys
import os
import time
import threading
import statistics
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List, Any

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

class PerformanceBenchmark:
    def __init__(self):
        self.results = {}
        self.start_time = None
        self.end_time = None

    def start_benchmark(self, name: str):
        """Start timing a benchmark"""
        self.start_time = time.time()
        logging.info(f"🏁 Starting benchmark: {name}")

    def end_benchmark(self, name: str) -> float:
        """End timing a benchmark and return duration"""
        self.end_time = time.time()
        duration = self.end_time - self.start_time
        self.results[name] = duration
        logging.info(f"✅ {name} completed in {duration:.2f}s")
        return duration

    def benchmark_ai_anomaly_service(self, iterations: int = 100) -> Dict[str, Any]:
        """Benchmark AI anomaly detection service"""
        logging.info(f"🧪 Benchmarking AI Anomaly Service ({iterations} iterations)...")

        import ai_anomaly_service

        # Prepare test data
        normal_data = [0.1, 0.2, 0.15, 0.25, 0.18, 0.22, 0.19, 0.21, 0.17, 0.23]
        anomaly_data = [1.8, 2.1, 1.9, 2.3, 1.7, 2.0, 1.85, 2.2, 1.75, 2.15]

        response_times = []

        self.start_benchmark("AI Anomaly Service")

        for i in range(iterations):
            start_time = time.time()

            # Alternate between normal and anomaly data
            test_data = normal_data if i % 2 == 0 else anomaly_data
            result = ai_anomaly_service.anomaly_service.detect_anomaly(test_data)

            end_time = time.time()
            response_times.append(end_time - start_time)

        duration = self.end_benchmark("AI Anomaly Service")

        return {
            'total_time': duration,
            'iterations': iterations,
            'avg_response_time': statistics.mean(response_times),
            'min_response_time': min(response_times),
            'max_response_time': max(response_times),
            'throughput': iterations / duration,
            'p95_response_time': statistics.quantiles(response_times, n=20)[18]  # 95th percentile
        }

    def benchmark_advanced_analytics_service(self, iterations: int = 50) -> Dict[str, Any]:
        """Benchmark advanced analytics service"""
        logging.info(f"🧪 Benchmarking Advanced Analytics Service ({iterations} iterations)...")

        import advanced_analytics_service

        analytics = advanced_analytics_service.AdvancedAnalyticsService()
        analytics.start_service()

        response_times = []

        self.start_benchmark("Advanced Analytics Service")

        for i in range(iterations):
            start_time = time.time()

            # Test trend analysis
            result = analytics.get_trend_analysis(f"test_series_{i}")
            # Simulate some processing time
            time.sleep(0.01)

            end_time = time.time()
            response_times.append(end_time - start_time)

        duration = self.end_benchmark("Advanced Analytics Service")

        return {
            'total_time': duration,
            'iterations': iterations,
            'avg_response_time': statistics.mean(response_times),
            'min_response_time': min(response_times),
            'max_response_time': max(response_times),
            'throughput': iterations / duration,
            'p95_response_time': statistics.quantiles(response_times, n=20)[18]
        }

    def benchmark_ai_orchestrator(self, iterations: int = 30) -> Dict[str, Any]:
        """Benchmark AI orchestrator service"""
        logging.info(f"🧪 Benchmarking AI Orchestrator ({iterations} iterations)...")

        import ai_orchestrator

        orchestrator = ai_orchestrator.TaskOrchestrator()
        response_times = []

        self.start_benchmark("AI Orchestrator")

        for i in range(iterations):
            start_time = time.time()

            # Submit and process a task
            task_id = orchestrator.submit_task("anomaly_detection", {
                "data": [0.1 + i*0.01, 0.2, 0.15, 0.25, 0.18, 0.22, 0.19, 0.21, 0.17, 0.23]
            })

            result = orchestrator.process_next_task()

            end_time = time.time()
            response_times.append(end_time - start_time)

        duration = self.end_benchmark("AI Orchestrator")

        return {
            'total_time': duration,
            'iterations': iterations,
            'avg_response_time': statistics.mean(response_times),
            'min_response_time': min(response_times),
            'max_response_time': max(response_times),
            'throughput': iterations / duration,
            'p95_response_time': statistics.quantiles(response_times, n=20)[18]
        }

    def benchmark_performance_optimizer(self, iterations: int = 20) -> Dict[str, Any]:
        """Benchmark performance optimizer"""
        logging.info(f"🧪 Benchmarking Performance Optimizer ({iterations} iterations)...")

        import advanced_performance_optimizer

        optimizer = advanced_performance_optimizer.AdvancedPerformanceOptimizer()
        response_times = []

        self.start_benchmark("Performance Optimizer")

        for i in range(iterations):
            start_time = time.time()

            # Test metrics collection
            metrics = optimizer.metrics_collector.collect_system_metrics()
            # Simulate analysis time
            time.sleep(0.05)

            end_time = time.time()
            response_times.append(end_time - start_time)

        duration = self.end_benchmark("Performance Optimizer")

        return {
            'total_time': duration,
            'iterations': iterations,
            'avg_response_time': statistics.mean(response_times),
            'min_response_time': min(response_times),
            'max_response_time': max(response_times),
            'throughput': iterations / duration,
            'p95_response_time': statistics.quantiles(response_times, n=20)[18]
        }

    def benchmark_concurrent_load(self, concurrent_users: int = 10, duration: int = 30) -> Dict[str, Any]:
        """Benchmark concurrent load on all services"""
        logging.info(f"🧪 Benchmarking Concurrent Load ({concurrent_users} users, {duration}s)...")

        import ai_anomaly_service
        import advanced_analytics_service
        import ai_orchestrator
        import advanced_performance_optimizer

        results = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'response_times': []
        }

        def worker_thread(thread_id: int):
            """Worker thread for concurrent testing"""
            end_time = time.time() + duration

            while time.time() < end_time:
                try:
                    start_time = time.time()

                    # Randomly test different services
                    service_choice = thread_id % 4

                    if service_choice == 0:
                        # AI Anomaly
                        data = [0.1, 0.2, 0.15, 0.25, 0.18, 0.22, 0.19, 0.21, 0.17, 0.23]
                        ai_anomaly_service.anomaly_service.detect_anomaly(data)
                    elif service_choice == 1:
                        # Advanced Analytics
                        analytics = advanced_analytics_service.AdvancedAnalyticsService()
                        analytics.get_trend_analysis("concurrent_test")
                    elif service_choice == 2:
                        # AI Orchestrator
                        orchestrator = ai_orchestrator.TaskOrchestrator()
                        task_id = orchestrator.submit_task("anomaly_detection", {"data": [0.1, 0.2, 0.15]})
                        orchestrator.process_next_task()
                    elif service_choice == 3:
                        # Performance Optimizer
                        optimizer = advanced_performance_optimizer.AdvancedPerformanceOptimizer()
                        optimizer.metrics_collector.collect_system_metrics()

                    end_time_req = time.time()
                    results['response_times'].append(end_time_req - start_time)
                    results['successful_requests'] += 1

                except Exception as e:
                    results['failed_requests'] += 1

                results['total_requests'] += 1

        self.start_benchmark("Concurrent Load Test")

        # Start concurrent threads
        threads = []
        for i in range(concurrent_users):
            thread = threading.Thread(target=worker_thread, args=(i,))
            threads.append(thread)
            thread.start()

        # Wait for all threads to complete
        for thread in threads:
            thread.join()

        duration_actual = self.end_benchmark("Concurrent Load Test")

        response_times = results['response_times']
        return {
            'total_time': duration_actual,
            'concurrent_users': concurrent_users,
            'total_requests': results['total_requests'],
            'successful_requests': results['successful_requests'],
            'failed_requests': results['failed_requests'],
            'success_rate': results['successful_requests'] / max(results['total_requests'], 1) * 100,
            'avg_response_time': statistics.mean(response_times) if response_times else 0,
            'throughput': results['total_requests'] / duration_actual,
            'p95_response_time': statistics.quantiles(response_times, n=20)[18] if response_times else 0
        }

    def run_full_benchmark_suite(self) -> Dict[str, Any]:
        """Run complete benchmark suite"""
        logging.info("🚀 Starting Full Performance Benchmark Suite")
        logging.info(f"📅 Benchmark Time: {datetime.now().isoformat()}")
        logging.info("=" * 60)

        benchmark_results = {}

        # Individual service benchmarks
        logging.info("\n📊 INDIVIDUAL SERVICE BENCHMARKS:")
        benchmark_results['ai_anomaly'] = self.benchmark_ai_anomaly_service()
        benchmark_results['advanced_analytics'] = self.benchmark_advanced_analytics_service()
        benchmark_results['ai_orchestrator'] = self.benchmark_ai_orchestrator()
        benchmark_results['performance_optimizer'] = self.benchmark_performance_optimizer()

        # Concurrent load test
        logging.info("\n📊 CONCURRENT LOAD BENCHMARK:")
        benchmark_results['concurrent_load'] = self.benchmark_concurrent_load()

        # Generate summary
        summary = self.generate_summary(benchmark_results)

        return {
            'timestamp': datetime.now().isoformat(),
            'results': benchmark_results,
            'summary': summary
        }

    def generate_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate performance summary"""
        summary = {
            'overall_performance': 'EXCELLENT',
            'recommendations': [],
            'key_metrics': {}
        }

        # Check response times
        avg_response_times = []
        throughputs = []

        for service_name, service_results in results.items():
            if service_name != 'concurrent_load':
                avg_response_times.append(service_results['avg_response_time'])
                throughputs.append(service_results['throughput'])

        if avg_response_times:
            overall_avg_response = statistics.mean(avg_response_times)
            summary['key_metrics']['avg_response_time'] = overall_avg_response

            if overall_avg_response < 0.1:
                summary['overall_performance'] = 'EXCELLENT'
            elif overall_avg_response < 0.5:
                summary['overall_performance'] = 'GOOD'
            elif overall_avg_response < 1.0:
                summary['overall_performance'] = 'FAIR'
            else:
                summary['overall_performance'] = 'NEEDS_IMPROVEMENT'

        if throughputs:
            summary['key_metrics']['avg_throughput'] = statistics.mean(throughputs)

        # Check concurrent load
        if 'concurrent_load' in results:
            concurrent = results['concurrent_load']
            summary['key_metrics']['concurrent_success_rate'] = concurrent['success_rate']
            summary['key_metrics']['concurrent_throughput'] = concurrent['throughput']

            if concurrent['success_rate'] < 95:
                summary['recommendations'].append("Consider optimizing for higher concurrent load")
            if concurrent['avg_response_time'] > 1.0:
                summary['recommendations'].append("Response times under load may need optimization")

        return summary

    def save_results(self, results: Dict[str, Any], filename: str = None):
        """Save benchmark results to file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"performance_benchmark_{timestamp}.json"

        with open(filename, 'w') as f:
            json.dump(results, f, indent=2, default=str)

        logging.info(f"💾 Results saved to: {filename}")
        return filename

def main():
    """Main benchmark execution"""
    benchmark = PerformanceBenchmark()
    results = benchmark.run_full_benchmark_suite()

    logging.info("\n" + "=" * 60)
    logging.info("📊 PERFORMANCE BENCHMARK RESULTS SUMMARY:")
    logging.info("=" * 60)

    summary = results['summary']
    logging.info(f"🎯 Overall Performance: {summary['overall_performance']}")
    logging.info(f"⏱️  Average Response Time: {summary['key_metrics'].get('avg_response_time', 'N/A'):.4f}s")
    logging.info(f"⚡ Average Throughput: {summary['key_metrics'].get('avg_throughput', 'N/A'):.2f} req/s")

    if 'concurrent_load' in results['results']:
        concurrent = results['results']['concurrent_load']
        logging.info(f"👥 Concurrent Success Rate: {concurrent['success_rate']:.1f}%")
        logging.info(f"🚀 Concurrent Throughput: {concurrent['throughput']:.2f} req/s")

    if summary['recommendations']:
        logging.info("\n💡 Recommendations:")
        for rec in summary['recommendations']:
            logging.info(f"  • {rec}")

    # Save results
    filename = benchmark.save_results(results)

    logging.info(f"\n✅ Benchmark complete! Detailed results saved to {filename}")

    return 0

if __name__ == "__main__":
    sys.exit(main())