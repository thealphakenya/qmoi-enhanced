import os
import psutil
import gc
import torch
import numpy as np
from typing import Dict, List, Optional
import logging
from datetime import datetime

class PerformanceOptimizer:
    def __init__(self):
        self.logger = self._setup_logger()
        self.optimization_history: List[Dict] = []
        self.target_memory_usage = 256 * 1024 * 1024  # 256MB
        self.target_cpu_usage = 0.15  # 15%
        self.target_storage_usage = 512 * 1024 * 1024  # 512MB

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger('PerformanceOptimizer')
        logger.setLevel(logging.INFO)
        handler = logging.FileHandler('performance_optimization.log')
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def optimize_memory(self) -> Dict:
        """Optimize memory usage using various techniques."""
        try:
            # Clear Python's garbage collector
            gc.collect()
            
            # Clear system cache if possible
            if os.name == 'posix':
                os.system('sync; echo 3 > /proc/sys/vm/drop_caches')
            
            # Optimize PyTorch memory if available
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            # Get current memory usage
            process = psutil.Process()
            memory_info = process.memory_info()
            current_usage = memory_info.rss
            
            # Log optimization results
            result = {
                'timestamp': datetime.now().isoformat(),
                'type': 'memory',
                'before': current_usage,
                'after': process.memory_info().rss,
                'improvement': (current_usage - process.memory_info().rss) / current_usage * 100
            }
            
            self.optimization_history.append(result)
            self.logger.info(f"Memory optimization completed: {result}")
            
            return result
        except Exception as e:
            self.logger.error(f"Memory optimization failed: {str(e)}")
            return {'error': str(e)}

    def optimize_cpu(self) -> Dict:
        """Optimize CPU usage and scheduling."""
        try:
            # Get current CPU usage
            current_usage = psutil.cpu_percent(interval=1)
            
            # Optimize CPU scheduling if possible
            if os.name == 'posix':
                os.system('echo 1 > /proc/sys/vm/compact_memory')
            
            # Optimize PyTorch CPU usage if available
            if torch.cuda.is_available():
                torch.set_num_threads(4)
            
            # Get new CPU usage
            new_usage = psutil.cpu_percent(interval=1)
            
            # Log optimization results
            result = {
                'timestamp': datetime.now().isoformat(),
                'type': 'cpu',
                'before': current_usage,
                'after': new_usage,
                'improvement': (current_usage - new_usage) / current_usage * 100
            }
            
            self.optimization_history.append(result)
            self.logger.info(f"CPU optimization completed: {result}")
            
            return result
        except Exception as e:
            self.logger.error(f"CPU optimization failed: {str(e)}")
            return {'error': str(e)}

    def optimize_storage(self) -> Dict:
        """Optimize storage usage and cleanup temporary files."""
        try:
            # Get current storage usage
            current_usage = psutil.disk_usage('/').used
            
            # Clean up temporary files
            temp_dirs = ['/tmp', './tmp', './temp']
            for temp_dir in temp_dirs:
                if os.path.exists(temp_dir):
                    for file in os.listdir(temp_dir):
                        try:
                            file_path = os.path.join(temp_dir, file)
                            if os.path.isfile(file_path):
                                os.remove(file_path)
                        except Exception as e:
                            self.logger.warning(f"Failed to remove {file_path}: {str(e)}")
            
            # Get new storage usage
            new_usage = psutil.disk_usage('/').used
            
            # Log optimization results
            result = {
                'timestamp': datetime.now().isoformat(),
                'type': 'storage',
                'before': current_usage,
                'after': new_usage,
                'improvement': (current_usage - new_usage) / current_usage * 100
            }
            
            self.optimization_history.append(result)
            self.logger.info(f"Storage optimization completed: {result}")
            
            return result
        except Exception as e:
            self.logger.error(f"Storage optimization failed: {str(e)}")
            return {'error': str(e)}

    def optimize_ai_model(self) -> Dict:
        """Optimize AI model performance and resource usage."""
        try:
            if not torch.cuda.is_available():
                return {'error': 'CUDA not available'}
            
            # Enable memory efficient attention
            torch.backends.cudnn.benchmark = True
            
            # Optimize model parameters
            torch.set_num_threads(4)
            
            # Enable mixed precision
            torch.set_float32_matmul_precision('medium')
            
            # Log optimization results
            result = {
                'timestamp': datetime.now().isoformat(),
                'type': 'ai_model',
                'status': 'optimized',
                'improvement': 'AI model optimization completed'
            }
            
            self.optimization_history.append(result)
            self.logger.info(f"AI model optimization completed: {result}")
            
            return result
        except Exception as e:
            self.logger.error(f"AI model optimization failed: {str(e)}")
            return {'error': str(e)}

    def run_full_optimization(self) -> Dict:
        """Run all optimization routines."""
        results = {
            'memory': self.optimize_memory(),
            'cpu': self.optimize_cpu(),
            'storage': self.optimize_storage(),
            'ai_model': self.optimize_ai_model()
        }
        
        # Calculate overall improvement
        improvements = [r.get('improvement', 0) for r in results.values() if isinstance(r, dict) and 'improvement' in r]
        overall_improvement = sum(improvements) / len(improvements) if improvements else 0
        
        final_result = {
            'timestamp': datetime.now().isoformat(),
            'type': 'full_optimization',
            'results': results,
            'overall_improvement': overall_improvement
        }
        
        self.logger.info(f"Full optimization completed: {final_result}")
        return final_result

    def get_optimization_history(self) -> List[Dict]:
        """Get the history of all optimizations performed."""
        return self.optimization_history

    def get_current_metrics(self) -> Dict:
        """Get current system metrics."""
        process = psutil.Process()
        return {
            'timestamp': datetime.now().isoformat(),
            'memory_usage': process.memory_info().rss,
            'cpu_usage': psutil.cpu_percent(interval=1),
            'storage_usage': psutil.disk_usage('/').used,
            'gpu_available': torch.cuda.is_available() if 'torch' in globals() else False
        }

def main():
    optimizer = PerformanceOptimizer()
    
    # Run full optimization
    results = optimizer.run_full_optimization()
    print("Optimization Results:", results)
    
    # Get current metrics
    metrics = optimizer.get_current_metrics()
    print("Current Metrics:", metrics)
    
    # Get optimization history
    history = optimizer.get_optimization_history()
    print("Optimization History:", history)

if __name__ == '__main__':
    main() 