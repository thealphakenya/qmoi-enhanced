#!/usr/bin/env python3
"""Performance benchmarking for production systems"""

import subprocess
import json
import time
from datetime import datetime

class PerformanceBenchmark:
    def __init__(self):
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'benchmarks': {}
        }
    
    def benchmark_api_latency(self, endpoint, num_requests=100):
        """Benchmark API endpoint latency"""
        print(f"Benchmarking {endpoint} ({num_requests} requests)...")
        
        # Use Apache Bench
        cmd = f"ab -n {num_requests} -c 10 {endpoint}"
        
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            output = result.stdout
            
            # Parse results
            lines = output.split('\n')
            metrics = {}
            
            for line in lines:
                if 'Requests per second' in line:
                    metrics['rps'] = float(line.split(':')[1].strip().split()[0])
                elif 'Time per request' in line:
                    metrics['avg_latency_ms'] = float(line.split(':')[1].strip().split()[0])
            
            self.results['benchmarks'][endpoint] = metrics
            print(f"✅ {endpoint}: {metrics}")
            return metrics
        except Exception as e:
            print(f"❌ Benchmarking failed: {e}")
            return None
    
    def benchmark_database(self):
        """Benchmark database performance"""
        print("Benchmarking database...")
        
        queries = [
            "SELECT COUNT(*) FROM users;",
            "SELECT * FROM events WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY);",
            "SELECT user_id, COUNT(*) as event_count FROM events GROUP BY user_id;"
        ]
        
        results = {}
        
        for query in queries:
            cmd = f"mysql -u root -p$DB_PASSWORD -e 'SELECT COUNT(*) as query_count; {query}' --benchmark"
            
            try:
                start = time.time()
                subprocess.run(cmd, shell=True, check=True, capture_output=True)
                duration = time.time() - start
                results[query[:50]] = f"{duration:.3f}s"
            except Exception as e:
                print(f"Query failed: {e}")
        
        self.results['benchmarks']['database'] = results
        print(f"✅ Database benchmarks: {results}")
        return results
    
    def benchmark_cache(self):
        """Benchmark cache performance"""
        print("Benchmarking cache...")
        
        # Redis benchmark
        cmd = "redis-benchmark -n 10000"
        
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            output = result.stdout
            
            # Parse results
            metrics = {}
            lines = output.split('\n')
            
            for line in lines:
                if 'SET' in line or 'GET' in line:
                    parts = line.split()
                    if len(parts) > 1:
                        metric_name = parts[0].strip('"')
                        metric_value = parts[-2:]
                        metrics[metric_name] = ' '.join(metric_value)
            
            self.results['benchmarks']['cache'] = metrics
            print(f"✅ Cache benchmarks complete")
            return metrics
        except Exception as e:
            print(f"❌ Cache benchmarking failed: {e}")
            return None
    
    def generate_report(self):
        """Generate benchmark report"""
        print("\n" + "="*50)
        print("PERFORMANCE BENCHMARK REPORT")
        print("="*50 + "\n")
        
        for benchmark_type, metrics in self.results['benchmarks'].items():
            print(f"{benchmark_type}:")
            for metric, value in metrics.items():
                print(f"  {metric}: {value}")
        
        print("\n" + "="*50 + "\n")
        
        # Save report
        with open('benchmark_report.json', 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print("✅ Report saved to benchmark_report.json")

if __name__ == '__main__':
    benchmark = PerformanceBenchmark()
    benchmark.benchmark_api_latency('https://api.qmoi.prod/api/health', num_requests=100)
    benchmark.benchmark_database()
    benchmark.benchmark_cache()
    benchmark.generate_report()
