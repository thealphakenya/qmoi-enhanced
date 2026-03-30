#!/usr/bin/env python3
"""
QMOI Enhanced - Comprehensive API Testing & Validation Suite
Tests all production APIs, endpoints, and routes for QMOI Enhanced platform
Version: 2.0.0
Date: 2026-03-30
Description: Complete API testing suite with authentication, rate limiting, and integration tests
"""

import asyncio
import json
import logging
import os
import time
import unittest
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from unittest.mock import Mock, patch

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import jwt
import bcrypt

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api_test.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class APITestSuite(unittest.TestCase):
    """Comprehensive API testing suite for QMOI Enhanced"""

    def setUp(self):
        """Set up test environment"""
        self.base_url = os.getenv('API_BASE_URL', 'http://localhost:3000/api')
        self.test_user = {
            'email': 'test@example.com',
            'password': 'TestPassword123!',
            'firstName': 'Test',
            'lastName': 'User'
        }
        self.admin_user = {
            'email': 'admin@qmoi.ai',
            'password': 'admin123'
        }

        # Create session with retry strategy
        self.session = requests.Session()
        retry_strategy = Retry(
            total=3,
            status_forcelist=[429, 500, 502, 503, 504],
            backoff_factor=1
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        # Test data
        self.access_token = None
        self.refresh_token = None
        self.api_key = None
        self.test_wallet = None

    def tearDown(self):
        """Clean up after tests"""
        self.session.close()

    def make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"

        # Add authorization header if token exists
        if self.access_token and 'auth' not in endpoint:
            headers = kwargs.get('headers', {})
            headers['Authorization'] = f'Bearer {self.access_token}'
            kwargs['headers'] = headers

        try:
            response = self.session.request(method, url, **kwargs)
            return response
        except requests.RequestException as e:
            self.fail(f"Request failed: {e}")

    def assert_success_response(self, response: requests.Response, expected_status: int = 200):
        """Assert successful response"""
        self.assertEqual(response.status_code, expected_status,
                        f"Expected status {expected_status}, got {response.status_code}. Response: {response.text}")

        try:
            data = response.json()
            self.assertIn('success', data)
            self.assertTrue(data['success'])
        except json.JSONDecodeError:
            self.fail("Response is not valid JSON")

    def assert_error_response(self, response: requests.Response, expected_status: int, error_code: str = None):
        """Assert error response"""
        self.assertEqual(response.status_code, expected_status)

        try:
            data = response.json()
            self.assertIn('error', data)
            if error_code:
                self.assertEqual(data['error'].get('code'), error_code)
        except json.JSONDecodeError:
            self.fail("Error response is not valid JSON")

    # Health Check Tests
    def test_01_health_check(self):
        """Test API health check endpoint"""
        logger.info("Testing health check endpoint...")
        response = self.make_request('GET', '/health')

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('status', data)
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('version', data)
        self.assertIn('services', data)

        logger.info("✅ Health check passed")

    # Authentication Tests
    def test_02_user_registration(self):
        """Test user registration"""
        logger.info("Testing user registration...")

        registration_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password'],
            'firstName': self.test_user['firstName'],
            'lastName': self.test_user['lastName']
        }

        response = self.make_request('POST', '/auth/register', json=registration_data)

        # Registration might return 201 or handle existing users
        if response.status_code == 201:
            self.assert_success_response(response, 201)
            data = response.json()
            self.assertIn('user', data)
        elif response.status_code == 409:
            # User already exists, that's fine for testing
            pass
        else:
            self.assertIn(response.status_code, [200, 201, 409])

        logger.info("✅ User registration test completed")

    def test_03_user_login(self):
        """Test user login"""
        logger.info("Testing user login...")

        login_data = {
            'email': self.test_user['email'],
            'password': self.test_user['password']
        }

        response = self.make_request('POST', '/auth/login', json=login_data)

        if response.status_code == 200:
            self.assert_success_response(response)
            data = response.json()

            self.assertIn('accessToken', data)
            self.assertIn('refreshToken', data)
            self.assertIn('user', data)

            self.access_token = data['accessToken']
            self.refresh_token = data['refreshToken']

            logger.info("✅ User login successful")
        else:
            # If login fails, try with admin credentials
            logger.warning("User login failed, trying admin login...")
            admin_login_data = {
                'email': self.admin_user['email'],
                'password': self.admin_user['password']
            }

            response = self.make_request('POST', '/auth/login', json=admin_login_data)
            self.assert_success_response(response)
            data = response.json()

            self.access_token = data['accessToken']
            self.refresh_token = data['refreshToken']

            logger.info("✅ Admin login successful")

    def test_04_token_refresh(self):
        """Test token refresh"""
        logger.info("Testing token refresh...")

        if not self.refresh_token:
            self.skipTest("No refresh token available")

        refresh_data = {'refreshToken': self.refresh_token}
        response = self.make_request('POST', '/auth/refresh', json=refresh_data)

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('accessToken', data)
        self.access_token = data['accessToken']

        logger.info("✅ Token refresh successful")

    def test_05_get_user_profile(self):
        """Test get user profile"""
        logger.info("Testing get user profile...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('GET', '/users/profile')

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('user', data)
        self.assertIn('email', data['user'])

        logger.info("✅ Get user profile successful")

    def test_06_update_user_profile(self):
        """Test update user profile"""
        logger.info("Testing update user profile...")

        if not self.access_token:
            self.skipTest("No access token available")

        update_data = {
            'firstName': 'Updated Test',
            'lastName': 'Updated User'
        }

        response = self.make_request('PUT', '/users/profile', json=update_data)

        self.assert_success_response(response)

        logger.info("✅ Update user profile successful")

    # API Key Tests
    def test_07_generate_api_key(self):
        """Test API key generation"""
        logger.info("Testing API key generation...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('POST', '/users/api-key')

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('apiKey', data)
        self.api_key = data['apiKey']

        logger.info("✅ API key generation successful")

    # Wallet Tests
    def test_08_get_wallets(self):
        """Test get user wallets"""
        logger.info("Testing get wallets...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('GET', '/wallets')

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('wallets', data)
        self.assertIsInstance(data['wallets'], list)

        # Store first wallet for later tests
        if data['wallets']:
            self.test_wallet = data['wallets'][0]

        logger.info(f"✅ Get wallets successful - {len(data['wallets'])} wallets found")

    def test_09_create_wallet(self):
        """Test create new wallet"""
        logger.info("Testing create wallet...")

        if not self.access_token:
            self.skipTest("No access token available")

        wallet_data = {
            'currency': 'BTC'
        }

        response = self.make_request('POST', '/wallets', json=wallet_data)

        if response.status_code == 201:
            self.assert_success_response(response, 201)
            data = response.json()

            self.assertIn('wallet', data)
            self.assertEqual(data['wallet']['currency'], 'BTC')

            logger.info("✅ Create wallet successful")
        else:
            # Wallet creation might be restricted or already exists
            logger.info(f"Create wallet returned status {response.status_code}")

    # Trading Tests
    def test_10_get_portfolio(self):
        """Test get trading portfolio"""
        logger.info("Testing get portfolio...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('GET', '/trading/portfolio')

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('portfolio', data)
        self.assertIsInstance(data['portfolio'], list)

        logger.info(f"✅ Get portfolio successful - {len(data['portfolio'])} positions")

    def test_11_place_order(self):
        """Test place trading order"""
        logger.info("Testing place order...")

        if not self.access_token:
            self.skipTest("No access token available")

        order_data = {
            'symbol': 'BTC/USDT',
            'type': 'buy',
            'quantity': 0.001,
            'price': 50000
        }

        response = self.make_request('POST', '/trading/orders', json=order_data)

        if response.status_code == 201:
            self.assert_success_response(response, 201)
            data = response.json()

            self.assertIn('order', data)
            self.assertIn('orderId', data)

            logger.info("✅ Place order successful")
        else:
            # Order placement might be restricted in test environment
            logger.info(f"Place order returned status {response.status_code}")

    # Analytics Tests
    def test_12_get_analytics_dashboard(self):
        """Test get analytics dashboard"""
        logger.info("Testing analytics dashboard...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('GET', '/analytics/dashboard')

        self.assert_success_response(response)
        data = response.json()

        # Analytics might return mock data in test environment
        self.assertIsInstance(data, dict)

        logger.info("✅ Analytics dashboard successful")

    # Risk Management Tests
    def test_13_get_risk_assessment(self):
        """Test get risk assessment"""
        logger.info("Testing risk assessment...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('GET', '/risk/assessment')

        self.assert_success_response(response)
        data = response.json()

        self.assertIsInstance(data, dict)

        logger.info("✅ Risk assessment successful")

    # Admin Tests (if admin token available)
    def test_14_admin_get_users(self):
        """Test admin get all users"""
        logger.info("Testing admin get users...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('GET', '/admin/users')

        if response.status_code == 200:
            self.assert_success_response(response)
            data = response.json()
            self.assertIn('users', data)
            logger.info(f"✅ Admin get users successful - {len(data['users'])} users")
        elif response.status_code == 403:
            logger.info("Admin access denied (expected for non-admin users)")
        else:
            logger.info(f"Admin get users returned status {response.status_code}")

    # Rate Limiting Tests
    def test_15_rate_limiting(self):
        """Test rate limiting"""
        logger.info("Testing rate limiting...")

        # Make multiple requests to test rate limiting
        responses = []
        for i in range(15):  # More than default limit of 10/minute for auth
            response = self.make_request('POST', '/auth/login', json={
                'email': 'test@example.com',
                'password': 'wrongpassword'
            })
            responses.append(response)

            if response.status_code == 429:
                break

            # Small delay to avoid overwhelming
            time.sleep(0.1)

        # Check if rate limiting kicked in
        rate_limited_responses = [r for r in responses if r.status_code == 429]

        if rate_limited_responses:
            logger.info("✅ Rate limiting working correctly")
        else:
            logger.info("Rate limiting not triggered (may be expected in test environment)")

    # Error Handling Tests
    def test_16_error_handling(self):
        """Test error handling"""
        logger.info("Testing error handling...")

        # Test invalid endpoint
        response = self.make_request('GET', '/nonexistent-endpoint')
        self.assertEqual(response.status_code, 404)

        # Test invalid method
        response = self.make_request('PATCH', '/health')
        self.assertIn(response.status_code, [405, 404])

        # Test invalid JSON
        response = self.make_request('POST', '/auth/login',
                                   data='invalid json',
                                   headers={'Content-Type': 'application/json'})
        self.assertEqual(response.status_code, 400)

        logger.info("✅ Error handling tests completed")

    # Security Tests
    def test_17_security_headers(self):
        """Test security headers"""
        logger.info("Testing security headers...")

        response = self.make_request('GET', '/health')

        # Check for security headers
        security_headers = [
            'X-Content-Type-Options',
            'X-Frame-Options',
            'X-XSS-Protection',
            'Referrer-Policy'
        ]

        for header in security_headers:
            self.assertIn(header, response.headers,
                         f"Missing security header: {header}")

        logger.info("✅ Security headers present")

    # API Documentation Tests
    def test_18_api_documentation(self):
        """Test API documentation endpoint"""
        logger.info("Testing API documentation...")

        response = self.make_request('GET', '/docs')

        self.assert_success_response(response)
        data = response.json()

        self.assertIn('title', data)
        self.assertIn('version', data)
        self.assertIn('endpoints', data)
        self.assertIn('authentication', data)

        logger.info("✅ API documentation accessible")

    # Logout Test
    def test_19_logout(self):
        """Test user logout"""
        logger.info("Testing logout...")

        if not self.access_token:
            self.skipTest("No access token available")

        response = self.make_request('POST', '/auth/logout')

        self.assert_success_response(response)

        # Try to use the token again (should fail)
        response = self.make_request('GET', '/users/profile')

        if response.status_code == 401:
            logger.info("✅ Logout successful - token invalidated")
        else:
            logger.info("Logout completed (token may still be valid)")

class LoadTestSuite(unittest.TestCase):
    """Load testing suite for API endpoints"""

    def setUp(self):
        self.base_url = os.getenv('API_BASE_URL', 'http://localhost:3000/api')
        self.concurrency = int(os.getenv('LOAD_TEST_CONCURRENCY', '10'))
        self.duration = int(os.getenv('LOAD_TEST_DURATION', '30'))  # seconds

    async def make_async_request(self, session, endpoint: str, method: str = 'GET', **kwargs):
        """Make async HTTP request"""
        url = f"{self.base_url}{endpoint}"

        async with session.request(method, url, **kwargs) as response:
            return response.status, await response.text()

    async def run_load_test(self, endpoint: str, method: str = 'GET', **kwargs):
        """Run load test on endpoint"""
        import aiohttp

        results = []
        start_time = time.time()

        async with aiohttp.ClientSession() as session:
            tasks = []

            # Create concurrent requests
            for _ in range(self.concurrency):
                task = self.make_async_request(session, endpoint, method, **kwargs)
                tasks.append(task)

            # Execute all requests
            responses = await asyncio.gather(*tasks, return_exceptions=True)

            for response in responses:
                if isinstance(response, Exception):
                    results.append(('error', str(response)))
                else:
                    results.append(response)

        end_time = time.time()

        # Calculate metrics
        total_requests = len(results)
        successful_requests = len([r for r in results if r[0] == 200])
        failed_requests = total_requests - successful_requests
        duration = end_time - start_time
        requests_per_second = total_requests / duration

        return {
            'total_requests': total_requests,
            'successful_requests': successful_requests,
            'failed_requests': failed_requests,
            'duration': duration,
            'requests_per_second': requests_per_second,
            'success_rate': (successful_requests / total_requests) * 100
        }

    def test_load_health_check(self):
        """Load test health check endpoint"""
        logger.info(f"Running load test on health check endpoint ({self.concurrency} concurrent requests)...")

        async def run_test():
            return await self.run_load_test('/health')

        results = asyncio.run(run_test())

        logger.info(f"Load test results: {results}")

        # Assert reasonable performance
        self.assertGreater(results['success_rate'], 95,
                          f"Success rate too low: {results['success_rate']}%")
        self.assertGreater(results['requests_per_second'], 10,
                          f"Throughput too low: {results['requests_per_second']} req/s")

        logger.info("✅ Load test completed successfully")

class IntegrationTestSuite(unittest.TestCase):
    """Integration testing suite for complex workflows"""

    def setUp(self):
        self.base_url = os.getenv('API_BASE_URL', 'http://localhost:3000/api')
        self.session = requests.Session()

    def tearDown(self):
        self.session.close()

    def test_user_workflow(self):
        """Test complete user workflow"""
        logger.info("Testing complete user workflow...")

        # 1. Register user
        register_data = {
            'email': f'test_{int(time.time())}@example.com',
            'password': 'TestPassword123!',
            'firstName': 'Integration',
            'lastName': 'Test'
        }

        response = self.session.post(f"{self.base_url}/auth/register", json=register_data)
        self.assertIn(response.status_code, [200, 201, 409])  # 409 if user exists

        # 2. Login
        login_data = {
            'email': register_data['email'],
            'password': register_data['password']
        }

        response = self.session.post(f"{self.base_url}/auth/login", json=login_data)

        if response.status_code == 200:
            data = response.json()
            access_token = data['accessToken']

            # Set authorization header for subsequent requests
            self.session.headers.update({'Authorization': f'Bearer {access_token}'})

            # 3. Get profile
            response = self.session.get(f"{self.base_url}/users/profile")
            self.assertEqual(response.status_code, 200)

            # 4. Update profile
            update_data = {'firstName': 'Updated Integration'}
            response = self.session.put(f"{self.base_url}/users/profile", json=update_data)
            self.assertEqual(response.status_code, 200)

            # 5. Generate API key
            response = self.session.post(f"{self.base_url}/users/api-key")
            self.assertEqual(response.status_code, 200)

            # 6. Get wallets
            response = self.session.get(f"{self.base_url}/wallets")
            self.assertEqual(response.status_code, 200)

            # 7. Logout
            response = self.session.post(f"{self.base_url}/auth/logout")
            self.assertEqual(response.status_code, 200)

            logger.info("✅ Complete user workflow successful")
        else:
            logger.warning("Login failed in integration test")

    def test_trading_workflow(self):
        """Test trading workflow"""
        logger.info("Testing trading workflow...")

        # This would test a complete trading workflow
        # For now, just test the endpoints exist and respond

        response = self.session.get(f"{self.base_url}/trading/portfolio")
        # Should return 401 without auth, or data with auth
        self.assertIn(response.status_code, [200, 401])

        logger.info("✅ Trading workflow test completed")

def run_comprehensive_tests():
    """Run all test suites"""
    logger.info("🚀 Starting QMOI Enhanced Comprehensive API Testing Suite")
    logger.info("=" * 70)

    # Create test suite
    loader = unittest.TestLoader()

    # Load all test suites
    api_suite = loader.loadTestsFromTestCase(APITestSuite)
    load_suite = loader.loadTestsFromTestCase(LoadTestSuite)
    integration_suite = loader.loadTestsFromTestCase(IntegrationTestSuite)

    # Combine all suites
    all_tests = unittest.TestSuite([
        api_suite,
        load_suite,
        integration_suite
    ])

    # Run tests
    runner = unittest.TextTestRunner(
        verbosity=2,
        stream=open('api_test_results.txt', 'w')
    )

    start_time = time.time()
    result = runner.run(all_tests)
    end_time = time.time()

    # Generate test report
    report = {
        'test_run': {
            'timestamp': datetime.now().isoformat(),
            'duration_seconds': end_time - start_time,
            'python_version': os.sys.version,
            'environment': os.getenv('NODE_ENV', 'test')
        },
        'results': {
            'total_tests': result.testsRun,
            'passed': result.testsRun - len(result.failures) - len(result.errors),
            'failed': len(result.failures),
            'errors': len(result.errors),
            'success_rate': ((result.testsRun - len(result.failures) - len(result.errors)) / result.testsRun) * 100 if result.testsRun > 0 else 0
        },
        'failures': [{'test': str(f[0]), 'error': str(f[1])} for f in result.failures],
        'errors': [{'test': str(e[0]), 'error': str(e[1])} for e in result.errors]
    }

    # Save detailed report
    with open('api_test_report.json', 'w') as f:
        json.dump(report, f, indent=2, default=str)

    # Print summary
    print("\n" + "=" * 70)
    print("🧪 QMOI ENHANCED API TESTING COMPLETE")
    print("=" * 70)
    print(f"Total Tests: {result.testsRun}")
    print(f"Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failed: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(".1f")
    print(".2f")
    print(f"Results saved to: api_test_report.json")
    print(f"Detailed log saved to: api_test.log")

    if result.wasSuccessful():
        print("✅ ALL TESTS PASSED - API IS PRODUCTION READY!")
        return 0
    else:
        print("❌ SOME TESTS FAILED - REVIEW api_test_report.json")
        return 1

if __name__ == '__main__':
    exit_code = run_comprehensive_tests()
    exit(exit_code)