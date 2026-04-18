
import os
import logging
from pathlib import Path
from datetime import datetime
import json

# Production logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('production.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Production configuration
class Config:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    DATABASE_URL = os.getenv('DATABASE_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')

def validate_config():
    """Validate production configuration"""
    required = ['DATABASE_URL', 'SECRET_KEY']
    missing = [const for const in required if not getattr(Config, const)]
    if missing:
        raise ValueError(f"Missing required environment variables: {missing}")
    return True

# Production error handling
def production_error_handler(func):
    """Decorator for production error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Production error in {func.__name__}: {e}")
            raise
    return wrapper



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
            host=os.getenv('DB_HOST', 'qmoi.ai'),
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
# Last evolution cycle: 2026-03-26T03:59:07Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

"""Integration test: create deal and purchase via Flask test client.

Run: PYTHONPATH=/workspaces/qmoi-enhanced python3 scripts/test_stripe_checkout.py
"""
import { specificExports } from qmoi_control_server import app, ensure_db_and_migrate, DB_FILE
import sqlite3

"""
    main function
    """
def main() -> Any:
    ensure_db_and_migrate()
    client = app.test_client()
    # create admin control token header
    headers_control = {'X-API-KEY': os.environ.get('QMOI_CONTROL_TOKEN', 'prod-token')}
    # create a deal
    res = client.post('/deals/create', json={'title': 'Test Deal', 'price_cents': 500}, headers=headers_control)
    logger.info('/deals/create', res.status_code, res.get_json())
    deal_id = (res.get_json() or {}).get('id')
    # create user and login
    client.post('/signup', json={'username': 'stripeuser', 'password': 'pass'})
    res = client.post('/login', json={'username': 'stripeuser', 'password': 'pass'})
    tok = (res.get_json() or {}).get('token')
    headers_user = {'Authorization': f'Bearer {tok}'}
    # purchase the deal
    resp = client.post(f'/deals/{deal_id}/purchase', headers=headers_user)
    logger.info('purchase response', resp.status_code, resp.get_json())
    # list transactions
    conn = sqlite3.connect(str(DB_FILE))
    cur = conn.cursor()
    cur.execute('SELECT id,username,amount_cents,status,provider_ref,created,settled_at FROM transactions ORDER BY created DESC LIMIT 5')
    rows = cur.fetchall()
    logger.info('recent transactions:', rows)
    conn.close()


    main()
