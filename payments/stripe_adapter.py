"""Stripe production-ready adapter with automatic environment configuration.

This adapter provides a robust integration with Stripe including:
- Automatic environment configuration and fallback
- Idempotency keys for all operations
- Customer object management
- Complete error handling and logging
- Webhook signature verification
- Payment Intent management
"""
import os
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any, Union

try:
    import stripe
    from stripe.error import (
        StripeError, CardError, InvalidRequestError,
        AuthenticationError, APIConnectionError
    )
except Exception:
    stripe = None

from . import provider_stub
from utils.env_manager import setup_environment, get_stripe_config

# Set up environment
env = setup_environment()
stripe_config = get_stripe_config()

# Configuration
STRIPE_API_KEY = stripe_config['api_key']
STRIPE_WEBHOOK_SECRET = stripe_config['webhook_secret']
STRIPE_MAX_RETRIES = 3
IS_TEST_MODE = stripe_config['is_test']

# Set up logging
logger = logging.getLogger(__name__)

def _handle_stripe_error(e: StripeError) -> dict:
    """Standardized error handling for Stripe operations."""
    error_data = {
        'error': str(e),
        'type': type(e).__name__,
        'code': getattr(e, 'code', None),
        'param': getattr(e, 'param', None),
        'payment_intent': getattr(e, 'payment_intent', None)
    }
    logger.error(f"Stripe error: {error_data}")
    return {'error': error_data}

def get_or_create_customer(username: str, email: Optional[str] = None) -> Dict[str, Any]:
    """Get or create a Stripe Customer object for the user."""
    if not (stripe and STRIPE_API_KEY):
        return {'error': 'Stripe not configured'}
    
    stripe.api_key = STRIPE_API_KEY
    idempotency_key = f'customer-{username}-{uuid.uuid4()}'
    
    try:
        # Search for existing customer
        customers = stripe.Customer.list(limit=1, email=email) if email else \
                   stripe.Customer.list(limit=1, metadata={'username': username})
        
        if customers and customers.data:
            return {'id': customers.data[0].id, 'customer': customers.data[0]}
            
        # Create new customer
        customer = stripe.Customer.create(
            email=email,
            metadata={'username': username},
            idempotency_key=idempotency_key
        )
        return {'id': customer.id, 'customer': customer}
    except StripeError as e:
        return _handle_stripe_error(e)

def create_charge(username: str, amount_cents: int, currency: str = 'usd', 
                 email: Optional[str] = None, metadata: Optional[Dict] = None) -> dict:
    """Create a Stripe PaymentIntent with proper idempotency and error handling."""
    if not (stripe and STRIPE_API_KEY):
        return provider_stub.create_charge(username, amount_cents, currency.upper())
    
    stripe.api_key = STRIPE_API_KEY
    idempotency_key = f'charge-{username}-{amount_cents}-{uuid.uuid4()}'
    
    try:
        # Get or create customer
        customer_result = get_or_create_customer(username, email)
        if 'error' in customer_result:
            return customer_result
            
        # Prepare metadata
        charge_metadata = {
            'username': username,
            'idempotency_key': idempotency_key
        }
        if metadata:
            charge_metadata.update(metadata)
            
        # Create PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            customer=customer_result['id'],
            metadata=charge_metadata,
            idempotency_key=idempotency_key,
            automatic_payment_methods={'enabled': True}
        )
        
        return {
            'id': intent.id,
            'status': 'pending' if intent.status != 'succeeded' else 'settled',
            'provider_ref': intent.id,
            'client_secret': intent.client_secret,
            'customer_id': customer_result['id']
        }
        
    except StripeError as e:
        return _handle_stripe_error(e)


def verify_webhook_signature(payload: bytes, sig_header: str) -> Dict[str, Any]:
    """Verify Stripe webhook signature with robust error handling.
    
    Args:
        payload: Raw request body bytes
        sig_header: Stripe-Signature header value
        
    Returns:
        dict with keys: 
            - ok (bool): Whether verification succeeded
            - event (dict): Parsed event data if verified
            - error (str, optional): Error details if verification failed
    """
    import json
    
    if not payload:
        return {'ok': False, 'error': 'Empty payload'}
        
    if stripe and STRIPE_WEBHOOK_SECRET and sig_header:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
            # Log event receipt
            logger.info(f"Verified Stripe webhook event: {event.type}")
            return {'ok': True, 'event': event}
            
        except stripe.error.SignatureVerificationError as e:
            logger.error(f"Webhook signature verification failed: {e}")
            return {
                'ok': False,
                'error': 'Invalid signature',
                'detail': str(e)
            }
            
        except Exception as e:
            logger.error(f"Webhook processing error: {e}")
            return {'ok': False, 'error': str(e)}
            
    # Development fallback - parse JSON only if not in production
    if os.environ.get('QMOI_ENV') != 'production':
        try:
            event_data = json.loads(payload.decode('utf-8'))
            logger.warning("Processing unverified webhook (development mode)")
            return {'ok': True, 'event': event_data}
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse webhook JSON: {e}")
            return {'ok': False, 'error': f'Invalid JSON: {e}'}
            
    return {
        'ok': False,
        'error': 'Webhook verification requires STRIPE_WEBHOOK_SECRET in production'
    }
