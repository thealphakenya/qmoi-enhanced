"""
Production File Manager Module
Real production file operations with integrity checking, backup, and error handling.
"""

import os
import json
import hashlib
import shutil
from pathlib import Path
from typing import Any, Dict, Optional, List
import logging
import gzip
import zipfile
from datetime import datetime

logger = logging.getLogger(__name__)

class ProductionFileManager:
    """Production file operations with integrity checking"""

    def __init__(self, base_dir: str = None):
        self.base_dir = Path(base_dir) if base_dir else Path.cwd()
        self.backup_dir = self.base_dir / '.file_backups'
        self.backup_dir.mkdir(exist_ok=True)

    @staticmethod
    def safe_read_json(file_path: Path) -> Dict[str, Any]:
        """Safely read JSON file with error handling"""
        try:
            if not file_path.exists():
                logger.warning(f"File not found: {file_path}")
                return {}

            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in {file_path}: {e}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error in {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_json(file_path: Path, data: Dict[str, Any], indent: int = 2) -> None:
        """Safely write JSON file with backup"""
        try:
            file_path = Path(file_path)
            if file_path.exists():
                backup_path = file_path.with_suffix('.bak')
                file_path.rename(backup_path)
                logger.debug(f"Created backup: {backup_path}")

            temp_file = file_path.with_suffix('.tmp')
            file_path.parent.mkdir(parents=True, exist_ok=True)

            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=indent, ensure_ascii=False)

            temp_file.rename(file_path)
            logger.debug(f"Successfully wrote JSON to {file_path}")

        except Exception as e:
            logger.error(f"Error writing {file_path}: {e}")
            backup_path = file_path.with_suffix('.bak')
            if backup_path.exists():
                backup_path.rename(file_path)
                logger.info(f"Restored backup after write failure")
            raise

    @staticmethod
    def safe_read_text(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read text file"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_text(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write text file with backup"""
        try:
            file_path = Path(file_path)
            if file_path.exists():
                backup_path = file_path.with_suffix('.bak')
                file_path.rename(backup_path)

            temp_file = file_path.with_suffix('.tmp')
            file_path.parent.mkdir(parents=True, exist_ok=True)

            with open(temp_file, 'w', encoding=encoding) as f:
                f.write(content)

            temp_file.rename(file_path)

        except Exception as e:
            logger.error(f"Error writing text file {file_path}: {e}")
            backup_path = file_path.with_suffix('.bak')
            if backup_path.exists():
                backup_path.rename(file_path)
            raise

    @staticmethod
    def calculate_file_hash(file_path: Path) -> str:
        """Calculate SHA256 hash of file"""
        try:
            with open(file_path, 'rb') as f:
                return hashlib.sha256(f.read()).hexdigest()
        except Exception as e:
            logger.error(f"Error calculating hash for {file_path}: {e}")
            return ""

    def create_backup(self, file_path: Path) -> Optional[Path]:
        """Create timestamped backup of file"""
        try:
            if not file_path.exists():
                return None

            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_name = f"{file_path.name}.{timestamp}.bak"
            backup_path = self.backup_dir / backup_name
            shutil.copy2(file_path, backup_path)
            logger.debug(f"Created backup: {backup_path}")
            return backup_path

        except Exception as e:
            logger.error(f"Failed to create backup for {file_path}: {e}")
            return None

    def restore_from_backup(self, file_path: Path, backup_path: Path) -> bool:
        """Restore file from backup"""
        try:
            if not backup_path.exists():
                logger.error(f"Backup not found: {backup_path}")
                return False

            shutil.copy2(backup_path, file_path)
            logger.info(f"Restored {file_path} from backup")
            return True

        except Exception as e:
            logger.error(f"Failed to restore from backup: {e}")
            return False

    def compress_file(self, file_path: Path, compression: str = 'gzip') -> Optional[Path]:
        """Compress a file"""
        try:
            compressed_path = file_path.with_suffix(f'{file_path.suffix}.gz')
            with open(file_path, 'rb') as f_in:
                with gzip.open(compressed_path, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            logger.debug(f"Compressed {file_path} to {compressed_path}")
            return compressed_path

        except Exception as e:
            logger.error(f"Failed to compress {file_path}: {e}")
            return None

    def decompress_file(self, compressed_path: Path) -> Optional[Path]:
        """Decompress a file"""
        try:
            output_path = compressed_path.with_suffix('') if compressed_path.suffix == '.gz' else compressed_path.with_suffix('.decompressed')
            with gzip.open(compressed_path, 'rb') as f_in:
                with open(output_path, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
            logger.debug(f"Decompressed {compressed_path} to {output_path}")
            return output_path

        except Exception as e:
            logger.error(f"Failed to decompress {compressed_path}: {e}")
            return None

    def create_archive(self, files: List[Path], archive_path: Path) -> bool:
        """Create ZIP archive from files"""
        try:
            with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_path in files:
                    if file_path.exists():
                        zipf.write(file_path, file_path.name)
            logger.debug(f"Created archive: {archive_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to create archive: {e}")
            return False

    def extract_archive(self, archive_path: Path, extract_dir: Path) -> bool:
        """Extract ZIP archive"""
        try:
            extract_dir.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(archive_path, 'r') as zipf:
                zipf.extractall(extract_dir)
            logger.debug(f"Extracted archive to: {extract_dir}")
            return True
        except Exception as e:
            logger.error(f"Failed to extract archive: {e}")
            return False

    def find_files_by_pattern(self, pattern: str, directory: Path = None) -> List[Path]:
        """Find files matching a pattern"""
        try:
            search_dir = directory or self.base_dir
            return list(search_dir.rglob(pattern))
        except Exception as e:
            logger.error(f"Failed to find files with pattern {pattern}: {e}")
            return []

    def get_file_info(self, file_path: Path) -> Dict[str, Any]:
        """Get comprehensive file information"""
        try:
            stat = file_path.stat()
            return {
                'path': str(file_path),
                'name': file_path.name,
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'hash': self.calculate_file_hash(file_path),
                'exists': file_path.exists()
            }
        except Exception as e:
            logger.error(f"Failed to get file info for {file_path}: {e}")
            return {'path': str(file_path), 'exists': False}

    def validate_file_integrity(self, file_path: Path, expected_hash: str) -> bool:
        """Validate file integrity against expected hash"""
        try:
            actual_hash = self.calculate_file_hash(file_path)
            is_valid = actual_hash == expected_hash
            if not is_valid:
                logger.warning(f"File integrity check failed for {file_path}")
            return is_valid
        except Exception as e:
            logger.error(f"Failed to validate file integrity: {e}")
            return False

    def clean_temp_files(self, pattern: str = "*.tmp", older_than_hours: int = 24) -> int:
        """Clean up temporary files"""
        cleaned = 0
        cutoff_time = datetime.now().timestamp() - (older_than_hours * 3600)
        for temp_file in self.base_dir.rglob(pattern):
            try:
                if temp_file.stat().st_mtime < cutoff_time:
                    temp_file.unlink()
                    cleaned += 1
            except Exception as e:
                logger.warning(f"Failed to remove temp file {temp_file}: {e}")
        logger.info(f"Cleaned {cleaned} temporary files")
        return cleaned