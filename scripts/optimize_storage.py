"""
Storage optimization for Q-city application.
"""

import os
import shutil
from pathlib import Path

def clean_temp_dirs(temp_dirs=None):
    """Remove files in temporary directories to free up space."""
    if temp_dirs is None:
        temp_dirs = ["/tmp", "./tmp", "./cache", "./__pycache__"]
    for d in temp_dirs:
        path = Path(d)
        if path.exists() and path.is_dir():
            for item in path.iterdir():
                try:
                    if item.is_file() or item.is_symlink():
                        item.unlink()
                    elif item.is_dir():
                        shutil.rmtree(item)
                except Exception as e:
                    print(f"Could not remove {item}: {e}")

def optimize_storage():
    clean_temp_dirs()
    print("Storage optimized and temporary files cleaned.")

if __name__ == '__main__':
    optimize_storage() 