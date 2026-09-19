"""Enhanced Stripe webhook handler for production environments.

This module processes Stripe webhook events with idempotency, error handling,
and comprehensive logging.
"""
import uuid
import logging
import sqlite3
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

logger = logging.getLogger(__name__)

class WebhookProcessor:
    def __init__(self, db_conn: sqlite3.Connection):
        self.conn = db_conn
        self.cur = db_conn.cursor()
        self._ensure_tables()
        
    def _ensure_tables(self):
        """Create required tables if they don't exist."""
        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS webhook_events (
                id TEXT PRIMARY KEY,
                type TEXT,
                processed_at TEXT
            )
        ''')
        self.cur.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                username TEXT,
                deal_id TEXT,
                amount_cents INTEGER,
                status TEXT,
                provider TEXT,
                provider_ref TEXT,
                created TEXT,
                settled_at TEXT,
                error TEXT
            )
        ''')
        self.conn.commit()
        
    def is_duplicate_event(self, event_id: str) -> bool:
        """Check if we've already processed this webhook event."""
        self.cur.execute('SELECT id FROM webhook_events WHERE id = ?', (event_id,))
        return bool(self.cur.fetchone())
        
    def record_event(self, event_id: str, event_type: str):
        """Record webhook event as processed."""
        self.cur.execute(
            'INSERT INTO webhook_events (id, type, processed_at) VALUES (?, ?, ?)',
            (event_id, event_type, datetime.utcnow().isoformat())
        )
        
    def handle_payment_success(self, provider_ref: str, username: str,
                             amount: int, deal_id: Optional[str] = None) -> bool:
        """Handle successful payment completion."""
        now = datetime.utcnow().isoformat()
        
        # Check for existing transaction
        self.cur.execute('SELECT id FROM transactions WHERE provider_ref = ?',
                        (provider_ref,))
        row = self.cur.fetchone()
        
        try:
            if row:
                # Update existing transaction
                self.cur.execute('''
                    UPDATE transactions 
                    SET status = ?, settled_at = ?, error = NULL 
                    WHERE provider_ref = ?
                ''', ('settled', now, provider_ref))
                
                logger.info(f"Updated transaction {row[0]} to settled")
                
            else:
                # Create new transaction
                txid = str(uuid.uuid4())
                self.cur.execute('''
                    INSERT INTO transactions 
                    (id, username, deal_id, amount_cents, status, provider,
                     provider_ref, created, settled_at)
                    VALUES (?,?,?,?,?,?,?,?,?)
                ''', (txid, username, deal_id, amount, 'settled', 'stripe',
                      provider_ref, now, now))
                      
                logger.info(f"Created new settled transaction {txid}")
                
            return True
            
        except Exception as e:
            logger.error(f"Error handling payment success: {e}")
            raise
            
    def handle_payment_failure(self, provider_ref: str, error: str) -> bool:
        """Handle payment failure event."""
        try:
            now = datetime.utcnow().isoformat()
            self.cur.execute('''
                UPDATE transactions 
                SET status = ?, settled_at = ?, error = ?
                WHERE provider_ref = ?
            ''', ('failed', now, error, provider_ref))
            
            logger.warning(f"Payment failed for {provider_ref}: {error}")
            return True
            
        except Exception as e:
            logger.error(f"Error handling payment failure: {e}")
            raise
            
    def handle_refund(self, provider_ref: str) -> bool:
        """Handle refund event."""
        try:
            now = datetime.utcnow().isoformat()
            self.cur.execute('''
                UPDATE transactions 
                SET status = ?, settled_at = ?
                WHERE provider_ref = ?
            ''', ('refunded', now, provider_ref))
            
            logger.info(f"Marked transaction {provider_ref} as refunded")
            return True
            
        except Exception as e:
            logger.error(f"Error handling refund: {e}")
            raise