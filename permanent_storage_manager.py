#!/usr/bin/env python3
"""Permanent storage manager for QMOI."""
import json
import logging
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


class PermanentStorageManager:
    def __init__(self, storage_path: Path):
        self.storage_path = storage_path
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)

    def save(self, data: str) -> None:
        try:
            self.storage_path.write_text(data, encoding='utf-8')
            logger.info('Saved data to %s', self.storage_path)
        except OSError as exc:
            logger.error('Failed to save data to %s: %s', self.storage_path, exc)
            raise

    def load(self) -> str:
        try:
            return self.storage_path.read_text(encoding='utf-8')
        except FileNotFoundError:
            logger.warning('Storage file not found: %s', self.storage_path)
            return ''
        except OSError as exc:
            logger.error('Failed to load data from %s: %s', self.storage_path, exc)
            raise

    def save_json(self, data: Any) -> None:
        try:
            with self.storage_path.open('w', encoding='utf-8') as handle:
                json.dump(data, handle, indent=2)
            logger.info('Saved JSON data to %s', self.storage_path)
        except OSError as exc:
            logger.error('Failed to save JSON data to %s: %s', self.storage_path, exc)
            raise

    def load_json(self, default: Optional[Any] = None) -> Any:
        try:
            with self.storage_path.open('r', encoding='utf-8') as handle:
                return json.load(handle)
        except FileNotFoundError:
            logger.warning('JSON storage file not found: %s', self.storage_path)
            return default
        except json.JSONDecodeError as exc:
            logger.error('Invalid JSON in storage file %s: %s', self.storage_path, exc)
            raise

    def delete(self) -> None:
        try:
            if self.storage_path.exists():
                self.storage_path.unlink()
                logger.info('Deleted storage file %s', self.storage_path)
        except OSError as exc:
            logger.error('Failed to delete storage file %s: %s', self.storage_path, exc)
            raise
