import os
import logging
import json
from datetime import datetime
from typing import Dict, List, Optional
import sqlite3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from pathlib import Path

class DatabaseMigrator:
    def __init__(self, db_type: str = 'sqlite', config_path: Optional[str] = None):
        self.db_type = db_type.lower()
        self.logger = self._setup_logger()
        self.migrations_dir = Path('migrations')
        self.migrations_dir.mkdir(exist_ok=True)
        self.config = self._load_config(config_path)
        self.connection = None
        self.cursor = None

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger('DatabaseMigrator')
        logger.setLevel(logging.INFO)
        
        # Create handlers
        file_handler = logging.FileHandler('db_migrations.log')
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
        """Load database configuration from file or use defaults."""
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading config: {str(e)}")
                return self._get_default_config()
        return self._get_default_config()

    def _get_default_config(self) -> Dict:
        """Get default database configuration."""
        if self.db_type == 'sqlite':
            return {
                'database': 'app.db',
                'migrations_table': 'schema_migrations'
            }
        elif self.db_type == 'postgresql':
            return {
                'host': 'localhost',
                'port': 5432,
                'database': 'app_db',
                'user': 'postgres',
                'password': 'postgres',
                'migrations_table': 'schema_migrations'
            }
        else:
            raise ValueError(f"Unsupported database type: {self.db_type}")

    def connect(self) -> None:
        """Establish database connection."""
        try:
            if self.db_type == 'sqlite':
                self.connection = sqlite3.connect(self.config['database'])
            elif self.db_type == 'postgresql':
                self.connection = psycopg2.connect(
                    host=self.config['host'],
                    port=self.config['port'],
                    database=self.config['database'],
                    user=self.config['user'],
                    password=self.config['password']
                )
                self.connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            
            self.cursor = self.connection.cursor()
            self._ensure_migrations_table()
            self.logger.info("Database connection established")
        except Exception as e:
            self.logger.error(f"Error connecting to database: {str(e)}")
            raise

    def _ensure_migrations_table(self) -> None:
        """Create migrations table if it doesn't exist."""
        try:
            if self.db_type == 'sqlite':
                self.cursor.execute(f"""
                    CREATE TABLE IF NOT EXISTS {self.config['migrations_table']} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        version TEXT NOT NULL,
                        name TEXT NOT NULL,
                        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
            elif self.db_type == 'postgresql':
                self.cursor.execute(f"""
                    CREATE TABLE IF NOT EXISTS {self.config['migrations_table']} (
                        id SERIAL PRIMARY KEY,
                        version TEXT NOT NULL,
                        name TEXT NOT NULL,
                        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
            self.connection.commit()
        except Exception as e:
            self.logger.error(f"Error creating migrations table: {str(e)}")
            raise

    def create_migration(self, name: str) -> str:
        """Create a new migration file."""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        version = f"V{timestamp}"
        filename = f"{version}_{name}.sql"
        
        # Create migration file
        migration_path = self.migrations_dir / filename
        with open(migration_path, 'w') as f:
            f.write("-- Migration: " + name + "\n")
            f.write("-- Version: " + version + "\n\n")
            f.write("-- Up Migration\n")
            f.write("-- TODO: Add your up migration SQL here\n\n")
            f.write("-- Down Migration\n")
            f.write("-- TODO: Add your down migration SQL here\n")
        
        self.logger.info(f"Created migration file: {filename}")
        return version

    def get_applied_migrations(self) -> List[Dict]:
        """Get list of applied migrations."""
        try:
            self.cursor.execute(f"""
                SELECT version, name, applied_at 
                FROM {self.config['migrations_table']} 
                ORDER BY version
            """)
            return [
                {
                    'version': row[0],
                    'name': row[1],
                    'applied_at': row[2]
                }
                for row in self.cursor.fetchall()
            ]
        except Exception as e:
            self.logger.error(f"Error getting applied migrations: {str(e)}")
            return []

    def get_pending_migrations(self) -> List[Dict]:
        """Get list of pending migrations."""
        try:
            applied = {m['version'] for m in self.get_applied_migrations()}
            pending = []
            
            for file in sorted(self.migrations_dir.glob('V*.sql')):
                version = file.stem.split('_')[0]
                if version not in applied:
                    with open(file, 'r') as f:
                        content = f.read()
                        up_migration = content.split('-- Down Migration')[0].split('-- Up Migration')[1].strip()
                        down_migration = content.split('-- Down Migration')[1].strip()
                        
                        pending.append({
                            'version': version,
                            'name': file.stem.split('_', 1)[1],
                            'up_migration': up_migration,
                            'down_migration': down_migration
                        })
            
            return pending
        except Exception as e:
            self.logger.error(f"Error getting pending migrations: {str(e)}")
            return []

    def apply_migration(self, migration: Dict) -> None:
        """Apply a single migration."""
        try:
            self.logger.info(f"Applying migration: {migration['version']} - {migration['name']}")
            
            # Execute up migration
            self.cursor.execute(migration['up_migration'])
            
            # Record migration
            self.cursor.execute(f"""
                INSERT INTO {self.config['migrations_table']} (version, name)
                VALUES (%s, %s)
            """, (migration['version'], migration['name']))
            
            self.connection.commit()
            self.logger.info(f"Successfully applied migration: {migration['version']}")
        except Exception as e:
            self.connection.rollback()
            self.logger.error(f"Error applying migration {migration['version']}: {str(e)}")
            raise

    def rollback_migration(self, migration: Dict) -> None:
        """Rollback a single migration."""
        try:
            self.logger.info(f"Rolling back migration: {migration['version']} - {migration['name']}")
            
            # Execute down migration
            self.cursor.execute(migration['down_migration'])
            
            # Remove migration record
            self.cursor.execute(f"""
                DELETE FROM {self.config['migrations_table']}
                WHERE version = %s
            """, (migration['version'],))
            
            self.connection.commit()
            self.logger.info(f"Successfully rolled back migration: {migration['version']}")
        except Exception as e:
            self.connection.rollback()
            self.logger.error(f"Error rolling back migration {migration['version']}: {str(e)}")
            raise

    def migrate(self) -> None:
        """Apply all pending migrations."""
        try:
            pending = self.get_pending_migrations()
            if not pending:
                self.logger.info("No pending migrations")
                return
            
            self.logger.info(f"Found {len(pending)} pending migrations")
            for migration in pending:
                self.apply_migration(migration)
            
            self.logger.info("All migrations applied successfully")
        except Exception as e:
            self.logger.error(f"Error during migration: {str(e)}")
            raise

    def rollback(self, steps: int = 1) -> None:
        """Rollback the last N migrations."""
        try:
            applied = self.get_applied_migrations()
            if not applied:
                self.logger.info("No migrations to rollback")
                return
            
            to_rollback = applied[-steps:]
            self.logger.info(f"Rolling back {len(to_rollback)} migrations")
            
            for migration in reversed(to_rollback):
                # Find migration file
                migration_file = next(
                    (f for f in self.migrations_dir.glob(f"{migration['version']}_*.sql")),
                    None
                )
                
                if migration_file:
                    with open(migration_file, 'r') as f:
                        content = f.read()
                        down_migration = content.split('-- Down Migration')[1].strip()
                        self.rollback_migration({
                            'version': migration['version'],
                            'name': migration['name'],
                            'down_migration': down_migration
                        })
            
            self.logger.info("Rollback completed successfully")
        except Exception as e:
            self.logger.error(f"Error during rollback: {str(e)}")
            raise

    def close(self) -> None:
        """Close database connection."""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        self.logger.info("Database connection closed")

def main():
    # Example usage
    migrator = DatabaseMigrator(db_type='sqlite')
    
    try:
        migrator.connect()
        
        # Create a new migration
        version = migrator.create_migration('add_users_table')
        print(f"Created migration: {version}")
        
        # Apply pending migrations
        migrator.migrate()
        
        # Get migration status
        applied = migrator.get_applied_migrations()
        pending = migrator.get_pending_migrations()
        
        print("\nApplied Migrations:")
        for m in applied:
            print(f"- {m['version']}: {m['name']}")
        
        print("\nPending Migrations:")
        for m in pending:
            print(f"- {m['version']}: {m['name']}")
        
        # Rollback last migration
        migrator.rollback()
        
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        migrator.close()

if __name__ == '__main__':
    main() 