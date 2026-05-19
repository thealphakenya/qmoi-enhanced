#!/usr/bin/env python3
"""Production server utility tools."""
import logging
import shutil
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


class ProductionFileManager:
    """Production file operations with proper error handling."""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        try:
            with file_path.open('r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error('File not found: %s', file_path)
            raise
        except UnicodeDecodeError as e:
            logger.error('Encoding error reading %s: %s', file_path, e)
            raise
        except Exception as e:
            logger.error('Error reading file %s: %s', file_path, e)
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        backup_path = file_path.with_suffix(f'{file_path.suffix}.backup')
        try:
            if file_path.exists():
                shutil.copy2(file_path, backup_path)
            file_path.parent.mkdir(parents=True, exist_ok=True)
            with file_path.open('w', encoding=encoding) as f:
                f.write(content)
            logger.info('File written successfully: %s', file_path)
        except Exception as e:
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error('Error writing file %s: %s', file_path, e)
            raise

    @staticmethod
    def safe_delete_file(file_path: Path) -> None:
        try:
            if file_path.exists():
                file_path.unlink()
                logger.info('File deleted: %s', file_path)
        except Exception as e:
            logger.error('Error deleting file %s: %s', file_path, e)
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            dir_path.chmod(0o755)
            logger.info('Directory ensured: %s', dir_path)
        except Exception as e:
            logger.error('Error creating directory %s: %s', dir_path, e)
            raise

    @staticmethod
    def list_directory(dir_path: Path, glob_pattern: str = '**/*') -> List[Path]:
        if not dir_path.exists():
            raise FileNotFoundError(f'Directory not found: {dir_path}')
        return sorted([p for p in dir_path.glob(glob_pattern) if p.exists()])
