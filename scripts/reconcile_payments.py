"""Script to run periodic reconciliation of Stripe transactions.

This script should be run regularly (e.g., via cron) to ensure our local
transaction records match Stripe's source of truth.

Usage:
    python3 reconcile_payments.py [--dry-run]
"""
import os
import sys
import logging
from datetime import datetime
from typing import Dict, Any

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('reconciliation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Add the project root to Python path
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)

from payments.reconciliation import reconcile_stripe_transactions

def main(dry_run: bool = False) -> Dict[str, Any]:
    """Run the reconciliation process.
    
    Args:
        dry_run: If True, just report what would be updated
        
    Returns:
        dict with reconciliation results
    """
    start_time = datetime.utcnow()
    logger.info("Starting payment reconciliation%s", " (DRY RUN)" if dry_run else "")
    
    try:
        # Run reconciliation
        results = reconcile_stripe_transactions()
        
        # Log results
        duration = (datetime.utcnow() - start_time).total_seconds()
        
        if 'error' in results:
            logger.error("Reconciliation failed: %s", results['error'])
            return results
            
        logger.info(
            "Reconciliation complete in %.2fs - Checked: %d, Updated: %d, Failed: %d",
            duration, results['checked'], results['updated'], results['failed']
        )
        
        if results['errors']:
            for error in results['errors']:
                logger.warning("Error during reconciliation: %s", error)
                
        return {
            'status': 'ok',
            'duration': duration,
            **results
        }
        
    except Exception as e:
        logger.exception("Reconciliation failed with error")
        return {
            'status': 'error',
            'error': str(e)
        }

if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    main(dry_run)