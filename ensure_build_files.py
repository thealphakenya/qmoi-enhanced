#!/usr/bin/env python3
"""Ensure build files stub."""
import logging
from pathlib import Path
import shutil

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class BuildFileManager:
    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except Exception as e:
            logger.error(f'Error reading file {file_path}: {e}')
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        try:
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)
        except Exception as e:
            logger.error(f'Error writing file {file_path}: {e}')
            raise
