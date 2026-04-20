
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
    RELEASE = os.getenv('RELEASE', 'False').lower() == 'true'
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


# QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
# Automatic improvements, optimizations, and feature enhancements are continuously applied
# Last evolution cycle: 2026-03-26T03:59:05Z
# Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""Integration test for deals and sponsored flows against qmoi_control_server.app

This uses the Flask test client (no network) to exercise flows:
- signup/login master and users
- add sponsored user
- create deal
- purchase deal as sponsored and non-sponsored users
- check admin access endpoints
"""
from qmoi_control_server import app
import json

"""
    pretty function
    """
def pretty(resp) -> Any:
    try:
        return json.dumps(resp.json, indent=2)
    except Exception:
        return str(resp.data)

"""
    ensure_signup function
    """
def ensure_signup(client, username, password='pass') -> Any:
    r = client.post('/signup', json={'username': username, 'password': password})
    if r.status_code not in (200, 409):
        logger.info('signup failed for', username, r.status_code, r.data)
        return False
    return True

"""
    login function
    """
def login(client, username, password='pass') -> Any:
    r = client.post('/login', json={'username': username, 'password': password})
    if r.status_code != 200:
        logger.info('login failed for', username, r.status_code, r.data)
        return None
    return r.json.get('token')

"""
    main function
    """
def main() -> Any:
    client = app.test_client()

    # Ensure master exists
    ensure_signup(client, 'master', 'masterpass')
    master_token = login(client, 'master', 'masterpass')
    if not master_token:
        logger.info('Master login failed; aborting')
        return

    headers_master = {'Authorization': f'Bearer {master_token}'}

    # Create buyer and mark sponsored
    ensure_signup(client, 'buyer', 'buyerpass')
    buyer_token = login(client, 'buyer', 'buyerpass')
    assert buyer_token, 'buyer login failed'

    # Add buyer to sponsored via master
    r = client.post('/sponsored/add', json={'username': 'buyer'}, headers=headers_master)
    logger.info('/sponsored/add', r.status_code, pretty(r))

    # Create a deal
    r = client.post('/deals/create', json={'title':'Test Deal','description':'Test','price_cents':500}, headers=headers_master)
    logger.info('/deals/create', r.status_code, pretty(r))
    did = None
    if r.status_code == 200:
        did = r.json.get('id')

    # List deals
    r = client.get('/deals')
    logger.info('/deals', r.status_code, pretty(r))

    # Buyer purchases (sponsored => free)
    r = client.post(f'/deals/{did}/purchase', headers={'Authorization': f'Bearer {buyer_token}'})
    logger.info(f'/deals/{did}/purchase (buyer sponsored)', r.status_code, pretty(r))

    # Create payer user (not sponsored)
    ensure_signup(client, 'payer', 'payerpass')
    payer_token = login(client, 'payer', 'payerpass')
    assert payer_token

    # Payer purchases (should pay price)
    r = client.post(f'/deals/{did}/purchase', headers={'Authorization': f'Bearer {payer_token}'})
    logger.info(f'/deals/{did}/purchase (payer)', r.status_code, pretty(r))

    # Admin check access for payer
    r = client.get(f'/admin/check-access/payer/feature', headers=headers_master)
    logger.info('/admin/check-access/payer/feature', r.status_code, pretty(r))

    # Master lists users
    r = client.get('/admin/users', headers=headers_master)
    logger.info('/admin/users', r.status_code, pretty(r))


    main()
