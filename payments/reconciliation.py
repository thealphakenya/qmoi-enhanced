"""Stripe transaction reconciliation module.

This module provides functions to reconcile our local transaction records
with Stripe's source of truth, ensuring we don't miss any events and
that transaction states are accurately reflected.
"""
import os
import logging
import sqlite3
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

try:
    import stripe
except ImportError:
    stripe = None

logger = logging.getLogger(__name__)

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
MAX_LOOKUP_DAYS = 30  # Max days to look back for reconciliation

def get_db_connection() -> Optional[sqlite3.Connection]:
    """Get a connection to the SQLite database."""
    try:
        db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'qmoi.db')
        return sqlite3.connect(db_path)
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return None

def get_unsettled_transactions() -> List[Dict[str, Any]]:
    """Get all local transactions that aren't marked as settled."""
    conn = get_db_connection()
    if not conn:
        return []
        
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT id, username, amount_cents, provider_ref, created 
            FROM transactions 
            WHERE provider = 'stripe' 
            AND status != 'settled'
            AND created > ?
        """, ((datetime.utcnow() - timedelta(days=MAX_LOOKUP_DAYS)).isoformat(),))
        
        rows = cur.fetchall()
        return [
            {
                'id': row[0],
                'username': row[1], 
                'amount_cents': row[2],
                'provider_ref': row[3],
                'created': row[4]
            }
            for row in rows
        ]
    except Exception as e:
        logger.error(f"Database error fetching unsettled transactions: {e}")
        return []
    finally:
        conn.close()

def update_transaction_status(tx_id: str, status: str, settled_at: Optional[str] = None) -> bool:
    """Update a transaction's status and settlement timestamp."""
    conn = get_db_connection()
    if not conn:
        return False
        
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE transactions SET status = ?, settled_at = ? WHERE id = ?",
            (status, settled_at or datetime.utcnow().isoformat(), tx_id)
        )
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"Failed to update transaction {tx_id}: {e}")
        return False
    finally:
        conn.close()

def reconcile_stripe_transactions() -> Dict[str, Any]:
    """Reconcile local transaction records with Stripe.
    
    This function:
    1. Fetches all unsettled transactions from our DB
    2. Queries Stripe for their current status
    3. Updates our records to match Stripe's source of truth
    
    Returns:
        dict with summary of reconciliation results
    """
    if not (stripe and STRIPE_API_KEY):
        return {'error': 'Stripe not configured'}
        
    stripe.api_key = STRIPE_API_KEY
    results = {
        'checked': 0,
        'updated': 0,
        'failed': 0,
        'errors': []
    }
    
    # Get unsettled transactions
    transactions = get_unsettled_transactions()
    if not transactions:
        return {**results, 'message': 'No transactions to reconcile'}
        
    # Check each transaction against Stripe
    for tx in transactions:
        results['checked'] += 1
        
        try:
            # Get PaymentIntent from Stripe
            intent = stripe.PaymentIntent.retrieve(tx['provider_ref'])
            
            # Determine status
            if intent.status == 'succeeded':
                status = 'settled'
                settled_at = datetime.fromtimestamp(intent.created).isoformat()
            elif intent.status in ('canceled', 'failed'):
                status = 'failed'
                settled_at = datetime.utcnow().isoformat()
            else:
                # Still pending
                continue
                
            # Update our record
            if update_transaction_status(tx['id'], status, settled_at):
                results['updated'] += 1
            else:
                results['failed'] += 1
                
        except stripe.error.StripeError as e:
            results['failed'] += 1
            results['errors'].append(f"Failed to reconcile {tx['id']}: {str(e)}")
            logger.error(f"Stripe error reconciling transaction {tx['id']}: {e}")
            
        except Exception as e:
            results['failed'] += 1
            results['errors'].append(f"Error processing {tx['id']}: {str(e)}")
            logger.error(f"Error reconciling transaction {tx['id']}: {e}")
            
    return results