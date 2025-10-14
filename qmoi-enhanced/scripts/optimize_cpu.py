"""
CPU scheduling optimization for Q-city application.
"""

import os
import psutil


def optimize_cpu():
    """Optimize CPU usage by adjusting process priority and affinity."""
    p = psutil.Process(os.getpid())
    try:
        # Set process priority to high
        if os.name == "nt":
            p.nice(psutil.HIGH_PRIORITY_CLASS)
        else:
            p.nice(-10)
    except Exception as e:
        print(f"Could not set process priority: {e}")

    try:
        # Set CPU affinity to use all available CPUs
        cpu_count = psutil.cpu_count()
        p.cpu_affinity(list(range(cpu_count)))
    except Exception as e:
        print(f"Could not set CPU affinity: {e}")

    print("CPU scheduling optimized.")


if __name__ == "__main__":
    optimize_cpu()
