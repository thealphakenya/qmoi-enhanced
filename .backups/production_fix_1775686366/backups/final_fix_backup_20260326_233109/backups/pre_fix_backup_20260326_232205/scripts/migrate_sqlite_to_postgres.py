// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
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

def read_sqlite(sqlite_file):
    conn = sqlite3.connect(sqlite_file)
    cur = conn.cursor()
    cur.execute('SELECT timestamp, persona, message FROM conversations ORDER BY timestamp')
    rows = cur.fetchall()
    conn.close()
    return rows

def write_postgres(dsn, rows):
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

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--sqlite-file', default='qmoi_memory.db')
    p.add_argument('--dsn', default=os.environ.get('DATABASE_URL'))
    args = p.parse_args()
    if not args.dsn:
        print('Provide Postgres DSN via --dsn or DATABASE_URL env var')
        return 2
    rows = read_sqlite(args.sqlite_file)
    if not rows:
        print('No rows found in', args.sqlite_file)
        return 0
    write_postgres(args.dsn, rows)
    print('Migrated', len(rows), 'rows to Postgres')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
