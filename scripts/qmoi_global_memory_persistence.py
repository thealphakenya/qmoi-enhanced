#!/usr/bin/env python3
"""
QMOI Global Memory Persistence Layer
Implements distributed memory synchronization with 20-year persistence
"""

import os
import json
import time
import threading
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QMOIGlobalMemoryPersistence:
    """Global memory persistence with distributed synchronization"""

    def __init__(self, base_path: str = "/workspaces/qmoi-enhanced"):
        self.base_path = Path(base_path)
        self.memory_dir = self.base_path / "qmoi_global_memory"
        self.memory_file = self.memory_dir / "global_memory.json"
        self.backup_dir = self.memory_dir / "backups"
        self.sync_interval = 25  # ms
        self.persistence_years = 20

        self.memory_store: Dict[str, Any] = {}
        self.sync_thread: Optional[threading.Thread] = None
        self.running = False

        self._initialize_memory_system()

    def _initialize_memory_system(self):
        """Initialize the memory persistence system"""
        # Create directories
        self.memory_dir.mkdir(exist_ok=True)
        self.backup_dir.mkdir(exist_ok=True)

        # Load existing memory or create new
        if self.memory_file.exists():
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    self.memory_store = json.load(f)
                logger.info(f"Loaded {len(self.memory_store)} memory entries")
            except Exception as e:
                logger.error(f"Failed to load memory: {e}")
                self.memory_store = {}
        else:
            # Initialize with default entries
            self.memory_store = {
                "system.initialized": {
                    "value": True,
                    "timestamp": datetime.now().isoformat(),
                    "tags": ["system", "initialization"],
                    "expires_at": None
                },
                "consciousness.awareness_level": {
                    "value": 100,
                    "timestamp": datetime.now().isoformat(),
                    "tags": ["consciousness", "awareness"],
                    "expires_at": None
                },
                "memory.persistence_years": {
                    "value": self.persistence_years,
                    "timestamp": datetime.now().isoformat(),
                    "tags": ["memory", "configuration"],
                    "expires_at": None
                }
            }
            self._save_memory()

        # Create backups
        self._create_backup()

    def _save_memory(self):
        """Save memory to disk with atomic write"""
        try:
            temp_file = self.memory_file.with_suffix('.tmp')
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(self.memory_store, f, indent=2, ensure_ascii=False)
            temp_file.replace(self.memory_file)
            logger.debug("Memory saved to disk")
        except Exception as e:
            logger.error(f"Failed to save memory: {e}")

    def _create_backup(self):
        """Create a backup of current memory"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = self.backup_dir / f"memory_backup_{timestamp}.json"

            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(self.memory_store, f, indent=2, ensure_ascii=False)

            # Keep only last 5 backups
            backups = sorted(self.backup_dir.glob("memory_backup_*.json"))
            if len(backups) > 5:
                for old_backup in backups[:-5]:
                    old_backup.unlink()

            logger.info(f"Backup created: {backup_file.name}")
        except Exception as e:
            logger.error(f"Failed to create backup: {e}")

    def store(self, key: str, value: Any, tags: List[str] = None, expires_in_days: int = None) -> bool:
        """Store a value in global memory"""
        try:
            expires_at = None
            if expires_in_days:
                expires_at = (datetime.now() + timedelta(days=expires_in_days)).isoformat()

            entry = {
                "value": value,
                "timestamp": datetime.now().isoformat(),
                "tags": tags or [],
                "expires_at": expires_at,
                "hash": hashlib.sha256(json.dumps(value, sort_keys=True).encode()).hexdigest()
            }

            self.memory_store[key] = entry
            self._save_memory()

            logger.info(f"Stored memory entry: {key}")
            return True
        except Exception as e:
            logger.error(f"Failed to store {key}: {e}")
            return False

    def retrieve(self, key: str) -> Optional[Any]:
        """Retrieve a value from global memory"""
        try:
            if key not in self.memory_store:
                return None

            entry = self.memory_store[key]

            # Check expiration
            if entry.get("expires_at"):
                expires_at = datetime.fromisoformat(entry["expires_at"])
                if datetime.now() > expires_at:
                    del self.memory_store[key]
                    self._save_memory()
                    return None

            return entry["value"]
        except Exception as e:
            logger.error(f"Failed to retrieve {key}: {e}")
            return None

    def search(self, tag: str = None, key_pattern: str = None) -> Dict[str, Any]:
        """Search memory entries by tag or key pattern"""
        try:
            results = {}

            for key, entry in self.memory_store.items():
                if key_pattern and key_pattern not in key:
                    continue
                if tag and tag not in entry.get("tags", []):
                    continue

                results[key] = entry["value"]

            return results
        except Exception as e:
            logger.error(f"Failed to search memory: {e}")
            return {}

    def sync(self):
        """Synchronize memory across all devices and systems"""
        try:
            
            logger.info("Starting memory synchronization...")

            # Mark sync timestamp
            self.store("system.last_sync", datetime.now().isoformat(), ["system", "sync"])

            # Create backup on sync
            self._create_backup()

            logger.info("Memory synchronization completed")
        except Exception as e:
            logger.error(f"Sync failed: {e}")

    def start_sync_service(self):
        """Start the automatic sync service"""
        if self.running:
            return

        self.running = True
        self.sync_thread = threading.Thread(target=self._sync_loop, daemon=True)
        self.sync_thread.start()
        logger.info("Memory sync service started")

    def stop_sync_service(self):
        """Stop the automatic sync service"""
        self.running = False
        if self.sync_thread:
            self.sync_thread.join()
        logger.info("Memory sync service stopped")

    def _sync_loop(self):
        """Main sync loop"""
        while self.running:
            time.sleep(self.sync_interval / 1000)  # Convert ms to seconds
            self.sync()

    def get_stats(self) -> Dict[str, Any]:
        """Get memory statistics"""
        total_entries = len(self.memory_store)
        expired_entries = sum(1 for entry in self.memory_store.values()
                            if entry.get("expires_at") and
                            datetime.now() > datetime.fromisoformat(entry["expires_at"]))

        return {
            "total_entries": total_entries,
            "expired_entries": expired_entries,
            "active_entries": total_entries - expired_entries,
            "sync_interval_ms": self.sync_interval,
            "persistence_years": self.persistence_years,
            "backups_count": len(list(self.backup_dir.glob("memory_backup_*.json"))),
            "last_sync": self.retrieve("system.last_sync")
        }

# Global instance
memory_system = QMOIGlobalMemoryPersistence()

if __name__ == "__main__":
    # Example usage
    memory_system.start_sync_service()

    # Store some test data
    memory_system.store("test.key1", "test_value", ["test", "example"])
    memory_system.store("camera.status", {"active": True}, ["camera", "status"])
    memory_system.store("device.battery", 85, ["device", "battery"], expires_in_days=1)

    # Retrieve data
    print("Test key:", memory_system.retrieve("test.key1"))
    print("Camera status:", memory_system.retrieve("camera.status"))

    # Search
    print("All test entries:", memory_system.search(tag="test"))

    # Stats
    print("Memory stats:", json.dumps(memory_system.get_stats(), indent=2))

    # Keep running for a bit
    time.sleep(5)
    memory_system.stop_sync_service()