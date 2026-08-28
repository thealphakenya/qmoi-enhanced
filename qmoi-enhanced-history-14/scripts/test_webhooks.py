"""Script to test Stripe webhooks locally.

This script simulates webhook events for various payment scenarios to help
test the webhook handling logic without making real payments.
"""
import os
import sys
import json
import requests
from datetime import datetime

# Add project root to Python path
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)

from payments import stripe_adapter
from payments.provider_stub import create_charge

def simulate_webhook_event(event_type: str, test_data: dict) -> dict:
    """Simulate a Stripe webhook event and send to local server.
    
    Args:
        event_type: The type of event to simulate
        test_data: The event payload data
        
    Returns:
        dict with webhook response
    """
    # Build webhook payload
    event = {
        'id': f'evt_test_{datetime.utcnow().timestamp()}',
        'type': event_type,
        'data': {
            'object': test_data
        }
    }
    
    # Send to webhook endpoint
    response = requests.post(
        'http://localhost:8000/payments/webhook',
        json=event,
        headers={'Content-Type': 'application/json'}
    )
    
    return {
        'status_code': response.status_code,
        'response': response.json() if response.headers.get('content-type') == 'application/json' else response.text
    }

def test_payment_flow():
    """Test the full payment flow with webhook events."""
    print("\nTesting payment flow with webhooks...")
    
    # 1. Create test charge
    charge = create_charge('test_user', 2000)  # $20.00
    print(f"\nCreated test charge: {json.dumps(charge, indent=2)}")
    
    # 2. Simulate payment_intent.succeeded
    success_result = simulate_webhook_event(
        'payment_intent.succeeded',
        {
            'id': charge['provider_ref'],
            'amount': 2000,
            'currency': 'usd',
            'metadata': {
                'username': 'test_user',
                'deal_id': 'test_deal_123'
            }
        }
    )
    print(f"\nPayment success webhook result: {json.dumps(success_result, indent=2)}")
    
    # 3. Simulate payment_intent.payment_failed
    failure_result = simulate_webhook_event(
        'payment_intent.payment_failed',
        {
            'id': f"pi_failed_{datetime.utcnow().timestamp()}",
            'amount': 5000,
            'currency': 'usd',
            'metadata': {
                'username': 'test_user',
                'deal_id': 'test_deal_456'
            },
            'last_payment_error': {
                'message': 'Card was declined'
            }
        }
    )
    print(f"\nPayment failure webhook result: {json.dumps(failure_result, indent=2)}")
    
    # 4. Simulate charge.refunded
    refund_result = simulate_webhook_event(
        'charge.refunded',
        {
            'id': charge['provider_ref'],
            'amount': 2000,
            'currency': 'usd',
            'refunded': True,
            'metadata': {
                'username': 'test_user'
            }
        }
    )
    print(f"\nRefund webhook result: {json.dumps(refund_result, indent=2)}")

if __name__ == '__main__':
    test_payment_flow()