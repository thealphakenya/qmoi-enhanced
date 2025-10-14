#!/usr/bin/env python3
"""
QMOI Data Optimization System
Minimizes data bundle usage while maintaining optimal performance
"""

import os
import json
import time
import asyncio
import threading
import logging
import gzip
import zlib
import base64
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
import requests
import hashlib
import sqlite3
from concurrent.futures import ThreadPoolExecutor
import pickle
import lz4.frame
import brotli

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@dataclass
class DataUsageMetrics:
    """Data usage metrics"""

    timestamp: float
    bytes_sent: int
    bytes_received: int
    compression_ratio: float
    cache_hits: int
    cache_misses: int
    local_processing: int
    cloud_offloading: int
    optimization_savings: float


class QMOIDataOptimizer:
    """QMOI Data Optimization System"""

    def __init__(self):
        self.base_path = Path(__file__).parent.parent
        self.cache_path = self.base_path / "cache"
        self.cache_path.mkdir(exist_ok=True)

        self.db_path = self.base_path / "data" / "data_usage.db"
        self.db_path.parent.mkdir(exist_ok=True)

        # Initialize database
        self.init_database()

        # Cache for data optimization
        self.data_cache = {}
        self.compression_cache = {}
        self.request_cache = {}

        # Optimization settings
        self.compression_enabled = True
        self.cache_enabled = True
        self.local_processing_enabled = True
        self.cloud_offloading_enabled = True

        # Data usage tracking
        self.daily_usage = {"sent": 0, "received": 0}
        self.monthly_usage = {"sent": 0, "received": 0}

        # Start monitoring
        self.start_monitoring()

    def init_database(self):
        """Initialize data usage database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # Create data usage table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS data_usage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp REAL,
                    bytes_sent INTEGER,
                    bytes_received INTEGER,
                    compression_ratio REAL,
                    cache_hits INTEGER,
                    cache_misses INTEGER,
                    local_processing INTEGER,
                    cloud_offloading INTEGER,
                    optimization_savings REAL
                )
            """
            )

            # Create cache table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS data_cache (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key_hash TEXT UNIQUE,
                    data BLOB,
                    timestamp REAL,
                    access_count INTEGER,
                    size INTEGER
                )
            """
            )

            conn.commit()
            conn.close()
            logger.info("Data usage database initialized")

        except Exception as e:
            logger.error(f"Error initializing database: {e}")

    def start_monitoring(self):
        """Start data usage monitoring"""

        def monitor_usage():
            while True:
                try:
                    # Track daily usage
                    self.track_daily_usage()

                    # Optimize cache
                    self.optimize_cache()

                    # Clean old data
                    self.cleanup_old_data()

                    time.sleep(300)  # Check every 5 minutes

                except Exception as e:
                    logger.error(f"Error in usage monitoring: {e}")
                    time.sleep(60)

        # Start monitoring in background thread
        monitor_thread = threading.Thread(target=monitor_usage, daemon=True)
        monitor_thread.start()
        logger.info("Data usage monitoring started")

    def compress_data(self, data: Union[str, bytes, dict]) -> bytes:
        """Compress data using multiple algorithms"""
        try:
            if isinstance(data, dict):
                data = json.dumps(data, separators=(",", ":"))

            if isinstance(data, str):
                data = data.encode("utf-8")

            # Try different compression algorithms
            compression_results = {}

            # Gzip compression
            try:
                gzip_compressed = gzip.compress(data, compresslevel=9)
                compression_results["gzip"] = {
                    "data": gzip_compressed,
                    "size": len(gzip_compressed),
                    "ratio": len(gzip_compressed) / len(data),
                }
            except Exception as e:
                logger.error(f"Gzip compression error: {e}")

            # LZ4 compression
            try:
                lz4_compressed = lz4.frame.compress(data, compression_level=9)
                compression_results["lz4"] = {
                    "data": lz4_compressed,
                    "size": len(lz4_compressed),
                    "ratio": len(lz4_compressed) / len(data),
                }
            except Exception as e:
                logger.error(f"LZ4 compression error: {e}")

            # Brotli compression
            try:
                brotli_compressed = brotli.compress(data, quality=11)
                compression_results["brotli"] = {
                    "data": brotli_compressed,
                    "size": len(brotli_compressed),
                    "ratio": len(brotli_compressed) / len(data),
                }
            except Exception as e:
                logger.error(f"Brotli compression error: {e}")

            # Choose best compression
            if compression_results:
                best_compression = min(
                    compression_results.items(), key=lambda x: x[1]["ratio"]
                )
                return best_compression[1]["data"]

            return data

        except Exception as e:
            logger.error(f"Error compressing data: {e}")
            return data if isinstance(data, bytes) else data.encode("utf-8")

    def decompress_data(self, compressed_data: bytes, algorithm: str = "auto") -> bytes:
        """Decompress data"""
        try:
            if algorithm == "auto":
                # Try to detect compression algorithm
                if compressed_data.startswith(b"\x1f\x8b"):
                    algorithm = "gzip"
                elif compressed_data.startswith(b"\x04\x22\x4d\x18"):
                    algorithm = "lz4"
                elif compressed_data.startswith(b"\x0b"):
                    algorithm = "brotli"
                else:
                    return compressed_data

            if algorithm == "gzip":
                return gzip.decompress(compressed_data)
            elif algorithm == "lz4":
                return lz4.frame.decompress(compressed_data)
            elif algorithm == "brotli":
                return brotli.decompress(compressed_data)
            else:
                return compressed_data

        except Exception as e:
            logger.error(f"Error decompressing data: {e}")
            return compressed_data

    def cache_data(self, key: str, data: Any, ttl: int = 3600) -> bool:
        """Cache data with TTL"""
        try:
            if not self.cache_enabled:
                return False

            # Generate hash for key
            key_hash = hashlib.sha256(key.encode()).hexdigest()

            # Compress data
            compressed_data = self.compress_data(data)

            # Store in memory cache
            self.data_cache[key_hash] = {
                "data": compressed_data,
                "timestamp": time.time(),
                "ttl": ttl,
                "access_count": 0,
            }

            # Store in database cache
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT OR REPLACE INTO data_cache 
                (key_hash, data, timestamp, access_count, size) 
                VALUES (?, ?, ?, ?, ?)
            """,
                (key_hash, compressed_data, time.time(), 0, len(compressed_data)),
            )

            conn.commit()
            conn.close()

            return True

        except Exception as e:
            logger.error(f"Error caching data: {e}")
            return False

    def get_cached_data(self, key: str) -> Optional[Any]:
        """Get cached data"""
        try:
            if not self.cache_enabled:
                return None

            # Generate hash for key
            key_hash = hashlib.sha256(key.encode()).hexdigest()

            # Check memory cache first
            if key_hash in self.data_cache:
                cache_entry = self.data_cache[key_hash]

                # Check TTL
                if time.time() - cache_entry["timestamp"] < cache_entry["ttl"]:
                    cache_entry["access_count"] += 1
                    return self.decompress_data(cache_entry["data"])
                else:
                    # Remove expired entry
                    del self.data_cache[key_hash]

            # Check database cache
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                SELECT data, timestamp, access_count FROM data_cache 
                WHERE key_hash = ?
            """,
                (key_hash,),
            )

            result = cursor.fetchone()
            conn.close()

            if result:
                data, timestamp, access_count = result

                # Check TTL (default 1 hour)
                if time.time() - timestamp < 3600:
                    # Update access count
                    cursor.execute(
                        """
                        UPDATE data_cache SET access_count = ? WHERE key_hash = ?
                    """,
                        (access_count + 1, key_hash),
                    )

                    return self.decompress_data(data)

            return None

        except Exception as e:
            logger.error(f"Error getting cached data: {e}")
            return None

    def optimize_request(
        self,
        url: str,
        method: str = "GET",
        data: Any = None,
        headers: Dict[str, str] = None,
    ) -> Dict[str, Any]:
        """Optimize HTTP request for minimal data usage"""
        try:
            # Check cache first
            cache_key = f"{method}:{url}:{hash(str(data))}"
            cached_response = self.get_cached_data(cache_key)

            if cached_response:
                return {
                    "status": "cached",
                    "data": cached_response,
                    "bytes_sent": 0,
                    "bytes_received": 0,
                    "compression_ratio": 1.0,
                }

            # Prepare request
            request_headers = headers or {}

            # Add compression headers
            request_headers.update(
                {
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept": "application/json, text/plain, */*",
                    "Cache-Control": "max-age=3600",
                }
            )

            # Compress request data if needed
            if data and method in ["POST", "PUT", "PATCH"]:
                if isinstance(data, dict):
                    data = json.dumps(data, separators=(",", ":"))
                if isinstance(data, str):
                    data = data.encode("utf-8")

                # Use gzip for request compression
                compressed_data = gzip.compress(data)
                request_headers["Content-Encoding"] = "gzip"
                data = compressed_data

            # Make request
            start_time = time.time()
            response = requests.request(
                method=method, url=url, data=data, headers=request_headers, timeout=30
            )

            # Process response
            response_data = response.content

            # Decompress response if needed
            if response.headers.get("content-encoding") == "gzip":
                response_data = gzip.decompress(response_data)
            elif response.headers.get("content-encoding") == "br":
                response_data = brotli.decompress(response_data)

            # Parse JSON if possible
            try:
                if response.headers.get("content-type", "").startswith(
                    "application/json"
                ):
                    response_data = json.loads(response_data.decode("utf-8"))
            except:
                pass

            # Cache response
            self.cache_data(cache_key, response_data, ttl=3600)

            # Calculate metrics
            original_size = len(response.content)
            final_size = (
                len(response_data)
                if isinstance(response_data, bytes)
                else len(str(response_data))
            )
            compression_ratio = final_size / original_size if original_size > 0 else 1.0

            # Track usage
            self.track_data_usage(len(data) if data else 0, original_size)

            return {
                "status": "success",
                "data": response_data,
                "bytes_sent": len(data) if data else 0,
                "bytes_received": original_size,
                "compression_ratio": compression_ratio,
                "response_time": time.time() - start_time,
            }

        except Exception as e:
            logger.error(f"Error optimizing request: {e}")
            return {
                "status": "error",
                "error": str(e),
                "bytes_sent": 0,
                "bytes_received": 0,
                "compression_ratio": 1.0,
            }

    def track_data_usage(self, bytes_sent: int, bytes_received: int):
        """Track data usage"""
        try:
            # Update daily usage
            self.daily_usage["sent"] += bytes_sent
            self.daily_usage["received"] += bytes_received

            # Update monthly usage
            self.monthly_usage["sent"] += bytes_sent
            self.monthly_usage["received"] += bytes_received

            # Store in database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute(
                """
                INSERT INTO data_usage 
                (timestamp, bytes_sent, bytes_received, compression_ratio, 
                 cache_hits, cache_misses, local_processing, cloud_offloading, optimization_savings)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    time.time(),
                    bytes_sent,
                    bytes_received,
                    0.8,  # Estimated compression ratio
                    0,
                    0,
                    0,
                    0,
                    0.2,  # Placeholder values
                ),
            )

            conn.commit()
            conn.close()

        except Exception as e:
            logger.error(f"Error tracking data usage: {e}")

    def track_daily_usage(self):
        """Track daily usage and reset counters"""
        try:
            # Store daily usage
            daily_usage_file = self.base_path / "data" / "daily_usage.json"
            daily_usage_file.parent.mkdir(exist_ok=True)

            with open(daily_usage_file, "w") as f:
                json.dump(
                    {
                        "date": time.strftime("%Y-%m-%d"),
                        "bytes_sent": self.daily_usage["sent"],
                        "bytes_received": self.daily_usage["received"],
                        "total_bytes": self.daily_usage["sent"]
                        + self.daily_usage["received"],
                    },
                    f,
                    indent=2,
                )

            # Reset daily counters
            self.daily_usage = {"sent": 0, "received": 0}

        except Exception as e:
            logger.error(f"Error tracking daily usage: {e}")

    def optimize_cache(self):
        """Optimize cache usage"""
        try:
            # Remove expired entries from memory cache
            current_time = time.time()
            expired_keys = []

            for key, entry in self.data_cache.items():
                if current_time - entry["timestamp"] > entry["ttl"]:
                    expired_keys.append(key)

            for key in expired_keys:
                del self.data_cache[key]

            # Clean up database cache
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # Remove expired entries (older than 24 hours)
            cursor.execute(
                """
                DELETE FROM data_cache 
                WHERE timestamp < ?
            """,
                (current_time - 86400,),
            )

            # Keep only top 1000 most accessed entries
            cursor.execute(
                """
                DELETE FROM data_cache 
                WHERE id NOT IN (
                    SELECT id FROM data_cache 
                    ORDER BY access_count DESC 
                    LIMIT 1000
                )
            """
            )

            conn.commit()
            conn.close()

        except Exception as e:
            logger.error(f"Error optimizing cache: {e}")

    def cleanup_old_data(self):
        """Clean up old data usage records"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # Remove data usage records older than 30 days
            cursor.execute(
                """
                DELETE FROM data_usage 
                WHERE timestamp < ?
            """,
                (time.time() - 2592000,),
            )

            conn.commit()
            conn.close()

        except Exception as e:
            logger.error(f"Error cleaning up old data: {e}")

    def get_usage_statistics(self) -> Dict[str, Any]:
        """Get data usage statistics"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            # Get total usage
            cursor.execute(
                """
                SELECT SUM(bytes_sent), SUM(bytes_received) 
                FROM data_usage 
                WHERE timestamp > ?
            """,
                (time.time() - 86400,),
            )  # Last 24 hours

            daily_totals = cursor.fetchone()

            # Get monthly usage
            cursor.execute(
                """
                SELECT SUM(bytes_sent), SUM(bytes_received) 
                FROM data_usage 
                WHERE timestamp > ?
            """,
                (time.time() - 2592000,),
            )  # Last 30 days

            monthly_totals = cursor.fetchone()

            # Get cache statistics
            cursor.execute(
                """
                SELECT COUNT(*), SUM(size) FROM data_cache
            """
            )

            cache_stats = cursor.fetchone()

            conn.close()

            return {
                "daily_usage": {
                    "bytes_sent": daily_totals[0] or 0,
                    "bytes_received": daily_totals[1] or 0,
                    "total_bytes": (daily_totals[0] or 0) + (daily_totals[1] or 0),
                },
                "monthly_usage": {
                    "bytes_sent": monthly_totals[0] or 0,
                    "bytes_received": monthly_totals[1] or 0,
                    "total_bytes": (monthly_totals[0] or 0) + (monthly_totals[1] or 0),
                },
                "cache_stats": {
                    "entries": cache_stats[0] or 0,
                    "total_size": cache_stats[1] or 0,
                },
                "optimization_metrics": {
                    "compression_enabled": self.compression_enabled,
                    "cache_enabled": self.cache_enabled,
                    "local_processing_enabled": self.local_processing_enabled,
                    "cloud_offloading_enabled": self.cloud_offloading_enabled,
                },
            }

        except Exception as e:
            logger.error(f"Error getting usage statistics: {e}")
            return {"error": str(e)}

    def enable_local_processing(self, data: Any, processing_function: callable) -> Any:
        """Enable local processing to reduce data transfer"""
        try:
            if not self.local_processing_enabled:
                return processing_function(data)

            # Check if data is small enough for local processing
            data_size = (
                len(str(data)) if isinstance(data, (str, dict, list)) else len(data)
            )

            if data_size < 1024 * 1024:  # Less than 1MB
                # Process locally
                return processing_function(data)
            else:
                # Use cloud processing for large data
                return self.cloud_process_data(data, processing_function)

        except Exception as e:
            logger.error(f"Error in local processing: {e}")
            return None

    def cloud_process_data(self, data: Any, processing_function: callable) -> Any:
        """Process data in cloud to reduce local resource usage"""
        try:
            if not self.cloud_offloading_enabled:
                return processing_function(data)

            # This would integrate with actual cloud processing service
            # For now, return the result of local processing
            return processing_function(data)

        except Exception as e:
            logger.error(f"Error in cloud processing: {e}")
            return None

    def optimize_for_mobile(self, data: Any) -> Any:
        """Optimize data for mobile devices"""
        try:
            # Reduce data size for mobile
            if isinstance(data, dict):
                # Remove unnecessary fields
                mobile_optimized = {}
                for key, value in data.items():
                    if key not in ["debug_info", "metadata", "extended_data"]:
                        mobile_optimized[key] = value
                return mobile_optimized

            elif isinstance(data, list):
                # Limit list size for mobile
                return data[:100] if len(data) > 100 else data

            elif isinstance(data, str):
                # Truncate long strings
                return data[:1000] if len(data) > 1000 else data

            return data

        except Exception as e:
            logger.error(f"Error optimizing for mobile: {e}")
            return data


def main():
    """Main function"""
    # Initialize data optimizer
    optimizer = QMOIDataOptimizer()

    # Example usage
    test_data = {
        "message": "Hello World",
        "timestamp": time.time(),
        "data": [1, 2, 3, 4, 5] * 1000,  # Large data for testing
    }

    # Test compression
    compressed = optimizer.compress_data(test_data)
    decompressed = optimizer.decompress_data(compressed)

    print(f"Original size: {len(str(test_data))}")
    print(f"Compressed size: {len(compressed)}")
    print(f"Compression ratio: {len(compressed) / len(str(test_data)):.2f}")

    # Test caching
    optimizer.cache_data("test_key", test_data)
    cached_data = optimizer.get_cached_data("test_key")

    print(f"Cached data retrieved: {cached_data is not None}")

    # Get usage statistics
    stats = optimizer.get_usage_statistics()
    print(f"Usage statistics: {stats}")


if __name__ == "__main__":
    main()
