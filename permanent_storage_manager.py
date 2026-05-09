#!/usr/bin/env python3
"""Permanent storage manager stub."""
from pathlib import Path
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class PermanentStorageManager:
    def __init__(self, storage_path: Path):
        self.storage_path = storage_path

    def save(self, data: str) -> None:
        logger.info(f'Saving data to {self.storage_path}')
        self.storage_path.write_text(data)
