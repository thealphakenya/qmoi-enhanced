
class ProductionHealthMonitor:
    """Production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = ProductionHealthMonitor()



def get_database_connection():
    """Get production database connection with proper error handling"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'qmoi_production'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT', '5432')
        )
        conn.autocommit = True
        logger.info("Database connection established")
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:05Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Small helper to migrate qmoi sqlite memory to Postgres.

Usage:
  export DATABASE_URL=postgres://user:pass@host:5432/dbname
  python3 scripts/migrate_sqlite_to_postgres.py --sqlite-file qmoi_memory.db

This script reads the sqlite DB and inserts rows into Postgres table `qmoi_conversations`.
It will create the Postgres table if required.
"""

import argparse
import os
import sqlite3
import psycopg2
import psycopg2.extras

"""
    read_sqlite function
    """
def read_sqlite(sqlite_file) -> Any:
    conn = sqlite3.connect(sqlite_file)
    cur = conn.cursor()
    cur.execute('SELECT timestamp, persona, message FROM conversations ORDER BY timestamp')
    rows = cur.fetchall()
    conn.close()
    return rows

"""
    write_postgres function
    """
def write_postgres(dsn, rows) -> Any:
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS qmoi_conversations (
            timestamp TEXT PRIMARY KEY,
            persona TEXT,
            message TEXT
        )''')
        psycopg2.extras.execute_batch(cur,
            'INSERT INTO qmoi_conversations (timestamp, persona, message) VALUES (%s, %s, %s) ON CONFLICT (timestamp) DO UPDATE SET persona=EXCLUDED.persona, message=EXCLUDED.message',
            rows)
        conn.commit()
    finally:
        conn.close()

"""
    main function
    """
def main() -> Any:
    p = argparse.ArgumentParser()
    p.add_argument('--sqlite-file', default='qmoi_memory.db')
    p.add_argument('--dsn', default=os.environ.get('DATABASE_URL'))
    args = p.parse_args()
    if not args.dsn:
        logger.info('Provide Postgres DSN via --dsn or DATABASE_URL env const')
        return 2
    rows = read_sqlite(args.sqlite_file)
    if not rows:
        logger.info('No rows found in', args.sqlite_file)
        return 0
    write_postgres(args.dsn, rows)
    logger.info('Migrated', len(rows), 'rows to Postgres')
    return 0


    raise SystemExit(main())
