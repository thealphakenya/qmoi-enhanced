import os
import shutil
import logging
import json
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path
import tarfile
import boto3
from botocore.exceptions import ClientError

class BackupManager:
    def __init__(self, config_path: Optional[str] = None):
        self.logger = self._setup_logger()
        self.config = self._load_config(config_path)
        self.backup_dir = Path(self.config['backup_dir'])
        self.backup_dir.mkdir(exist_ok=True)
        self.s3_client = None
        if self.config.get('use_s3'):
            self._initialize_s3()

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger('BackupManager')
        logger.setLevel(logging.INFO)
        
        # Create handlers
        file_handler = logging.FileHandler('backup_restore.log')
        console_handler = logging.StreamHandler()
        
        # Create formatters and add it to handlers
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # Add handlers to the logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger

    def _load_config(self, config_path: Optional[str]) -> Dict:
        """Load backup configuration from file or use defaults."""
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading config: {str(e)}")
                return self._get_default_config()
        return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """Get default backup configuration."""
        return {
            'backup_dir': 'backups',
            'db_type': 'sqlite',
            'db_path': 'app.db',
            'use_s3': False,
            's3_bucket': '',
            's3_prefix': 'backups/',
            'retention_days': 30,
            'compression': True
        }

    def _initialize_s3(self) -> None:
        """Initialize S3 client if S3 backup is enabled."""
        try:
            self.s3_client = boto3.client('s3')
            self.logger.info("S3 client initialized")
        except Exception as e:
            self.logger.error(f"Error initializing S3 client: {str(e)}")
            raise

    def create_backup(self, description: Optional[str] = None) -> str:
        """Create a new backup of the database."""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_name = f"backup_{timestamp}"
            backup_path = self.backup_dir / backup_name
            
            # Create backup directory
            backup_path.mkdir(exist_ok=True)
            
            # Backup database
            if self.config['db_type'] == 'sqlite':
                shutil.copy2(self.config['db_path'], backup_path / 'database.db')
            elif self.config['db_type'] == 'postgresql':
                self._backup_postgresql(backup_path)
            
            # Create metadata file
            metadata = {
                'timestamp': timestamp,
                'description': description,
                'db_type': self.config['db_type'],
                'version': '1.0'
            }
            
            with open(backup_path / 'metadata.json', 'w') as f:
                json.dump(metadata, f, indent=2)
            
            # Compress backup if enabled
            if self.config['compression']:
                self._compress_backup(backup_path)
                backup_path = backup_path.with_suffix('.tar.gz')
            
            # Upload to S3 if enabled
            if self.config['use_s3']:
                self._upload_to_s3(backup_path)
            
            self.logger.info(f"Backup created successfully: {backup_name}")
            return backup_name
        except Exception as e:
            self.logger.error(f"Error creating backup: {str(e)}")
            raise

    def _backup_postgresql(self, backup_path: Path) -> None:
        """Create PostgreSQL database backup."""
        try:
            backup_file = backup_path / 'database.sql'
            cmd = [
                'pg_dump',
                '-h', self.config['db_host'],
                '-p', str(self.config['db_port']),
                '-U', self.config['db_user'],
                '-F', 'c',
                '-f', str(backup_file),
                self.config['db_name']
            ]
            
            # Set PGPASSWORD environment variable
            env = os.environ.copy()
            env['PGPASSWORD'] = self.config['db_password']
            
            subprocess.run(cmd, env=env, check=True)
            self.logger.info("PostgreSQL backup created successfully")
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Error creating PostgreSQL backup: {str(e)}")
            raise

    def _compress_backup(self, backup_path: Path) -> None:
        """Compress backup directory into a tar.gz file."""
        try:
            archive_path = backup_path.with_suffix('.tar.gz')
            with tarfile.open(archive_path, 'w:gz') as tar:
                tar.add(backup_path, arcname=backup_path.name)
            
            # Remove original directory
            shutil.rmtree(backup_path)
            self.logger.info(f"Backup compressed: {archive_path}")
        except Exception as e:
            self.logger.error(f"Error compressing backup: {str(e)}")
            raise

    def _upload_to_s3(self, backup_path: Path) -> None:
        """Upload backup to S3."""
        try:
            if not self.s3_client:
                raise ValueError("S3 client not initialized")
            
            s3_key = f"{self.config['s3_prefix']}{backup_path.name}"
            self.s3_client.upload_file(
                str(backup_path),
                self.config['s3_bucket'],
                s3_key
            )
            self.logger.info(f"Backup uploaded to S3: {s3_key}")
        except ClientError as e:
            self.logger.error(f"Error uploading to S3: {str(e)}")
            raise

    def restore_backup(self, backup_name: str) -> None:
        """Restore database from backup."""
        try:
            backup_path = self.backup_dir / backup_name
            
            # Download from S3 if enabled
            if self.config['use_s3']:
                self._download_from_s3(backup_name)
            
            # Decompress if needed
            if backup_path.suffix == '.tar.gz':
                self._decompress_backup(backup_path)
                backup_path = backup_path.with_suffix('')
            
            # Read metadata
            with open(backup_path / 'metadata.json', 'r') as f:
                metadata = json.load(f)
            
            # Restore database
            if metadata['db_type'] == 'sqlite':
                shutil.copy2(backup_path / 'database.db', self.config['db_path'])
            elif metadata['db_type'] == 'postgresql':
                self._restore_postgresql(backup_path)
            
            self.logger.info(f"Backup restored successfully: {backup_name}")
        except Exception as e:
            self.logger.error(f"Error restoring backup: {str(e)}")
            raise

    def _decompress_backup(self, backup_path: Path) -> None:
        """Decompress backup tar.gz file."""
        try:
            extract_path = backup_path.with_suffix('')
            with tarfile.open(backup_path, 'r:gz') as tar:
                tar.extractall(path=self.backup_dir)
            self.logger.info(f"Backup decompressed: {extract_path}")
        except Exception as e:
            self.logger.error(f"Error decompressing backup: {str(e)}")
            raise

    def _download_from_s3(self, backup_name: str) -> None:
        """Download backup from S3."""
        try:
            if not self.s3_client:
                raise ValueError("S3 client not initialized")
            
            s3_key = f"{self.config['s3_prefix']}{backup_name}"
            local_path = self.backup_dir / backup_name
            
            self.s3_client.download_file(
                self.config['s3_bucket'],
                s3_key,
                str(local_path)
            )
            self.logger.info(f"Backup downloaded from S3: {s3_key}")
        except ClientError as e:
            self.logger.error(f"Error downloading from S3: {str(e)}")
            raise

    def _restore_postgresql(self, backup_path: Path) -> None:
        """Restore PostgreSQL database from backup."""
        try:
            backup_file = backup_path / 'database.sql'
            cmd = [
                'pg_restore',
                '-h', self.config['db_host'],
                '-p', str(self.config['db_port']),
                '-U', self.config['db_user'],
                '-d', self.config['db_name'],
                '-c',  # Clean (drop) database objects before recreating
                str(backup_file)
            ]
            
            # Set PGPASSWORD environment variable
            env = os.environ.copy()
            env['PGPASSWORD'] = self.config['db_password']
            
            subprocess.run(cmd, env=env, check=True)
            self.logger.info("PostgreSQL database restored successfully")
        except subprocess.CalledProcessError as e:
            self.logger.error(f"Error restoring PostgreSQL database: {str(e)}")
            raise

    def list_backups(self) -> List[Dict]:
        """List all available backups."""
        try:
            backups = []
            
            # List local backups
            for backup_path in self.backup_dir.glob('backup_*'):
                if backup_path.is_dir() or backup_path.suffix == '.tar.gz':
                    try:
                        if backup_path.suffix == '.tar.gz':
                            with tarfile.open(backup_path, 'r:gz') as tar:
                                metadata_file = tar.extractfile(f"{backup_path.stem}/metadata.json")
                                if metadata_file:
                                    metadata = json.loads(metadata_file.read())
                        else:
                            with open(backup_path / 'metadata.json', 'r') as f:
                                metadata = json.load(f)
                        
                        backups.append({
                            'name': backup_path.name,
                            'timestamp': metadata['timestamp'],
                            'description': metadata.get('description', ''),
                            'size': backup_path.stat().st_size,
                            'location': 'local'
                        })
                    except Exception as e:
                        self.logger.warning(f"Error reading backup {backup_path.name}: {str(e)}")
            
            # List S3 backups if enabled
            if self.config['use_s3'] and self.s3_client:
                try:
                    response = self.s3_client.list_objects_v2(
                        Bucket=self.config['s3_bucket'],
                        Prefix=self.config['s3_prefix']
                    )
                    
                    for obj in response.get('Contents', []):
                        if obj['Key'].endswith('.tar.gz'):
                            backups.append({
                                'name': os.path.basename(obj['Key']),
                                'timestamp': obj['LastModified'].strftime('%Y%m%d_%H%M%S'),
                                'size': obj['Size'],
                                'location': 's3'
                            })
                except ClientError as e:
                    self.logger.error(f"Error listing S3 backups: {str(e)}")
            
            return sorted(backups, key=lambda x: x['timestamp'], reverse=True)
        except Exception as e:
            self.logger.error(f"Error listing backups: {str(e)}")
            return []

    def cleanup_old_backups(self) -> None:
        """Remove backups older than retention period."""
        try:
            retention_date = datetime.now() - timedelta(days=self.config['retention_days'])
            backups = self.list_backups()
            
            for backup in backups:
                backup_date = datetime.strptime(backup['timestamp'], '%Y%m%d_%H%M%S')
                if backup_date < retention_date:
                    if backup['location'] == 'local':
                        backup_path = self.backup_dir / backup['name']
                        if backup_path.is_dir():
                            shutil.rmtree(backup_path)
                        else:
                            backup_path.unlink()
                    elif backup['location'] == 's3' and self.s3_client:
                        self.s3_client.delete_object(
                            Bucket=self.config['s3_bucket'],
                            Key=f"{self.config['s3_prefix']}{backup['name']}"
                        )
                    
                    self.logger.info(f"Removed old backup: {backup['name']}")
        except Exception as e:
            self.logger.error(f"Error cleaning up old backups: {str(e)}")
            raise

def main():
    # Example usage
    backup_manager = BackupManager()
    
    try:
        # Create a new backup
        backup_name = backup_manager.create_backup("Daily backup")
        print(f"Created backup: {backup_name}")
        
        # List all backups
        backups = backup_manager.list_backups()
        print("\nAvailable Backups:")
        for backup in backups:
            print(f"- {backup['name']} ({backup['timestamp']})")
        
        # Restore a backup
        if backups:
            backup_manager.restore_backup(backups[0]['name'])
            print(f"\nRestored backup: {backups[0]['name']}")
        
        # Cleanup old backups
        backup_manager.cleanup_old_backups()
        print("\nCleaned up old backups")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    main() 