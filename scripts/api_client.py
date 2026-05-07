"""
production API Client Module
Real production API client with retry logic, rate limiting, and error handling.
"""

import os
import time
import json
import requests
from typing import Dict, Any, Optional, List
import logging
from urllib.parse import urljoin
import threading

logger = logging.getLogger(__name__)

class ProductionAPIClient:
    """production API client with comprehensive error handling and retry logic"""

    def __init__(self, base_url: str, api_key: Optional[str] = None, timeout: int = 30):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key or os.getenv('API_KEY')
        self.timeout = timeout
        self.session = requests.Session()

        # Rate limiting
        self.rate_limit_lock = threading.Lock()
        self.last_request_time = 0
        self.min_request_interval = 0.1  # 100ms between requests

        # Configure session
        self.session.headers.update({
            'User-Agent': 'QMOI-production-Client/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })

        if self.api_key:
            self.session.headers.update({
                'Authorization': f'Bearer {self.api_key}'
            })

        # Retry configuration
        self.max_retries = 3
        self.backoff_factor = 2

    def _rate_limit_wait(self):
        """Enforce rate limiting"""
        with self.rate_limit_lock:
            current_time = time.time()
            time_since_last = current_time - self.last_request_time
            if time_since_last < self.min_request_interval:
                sleep_time = self.min_request_interval - time_since_last
                time.sleep(sleep_time)
            self.last_request_time = time.time()

    def _make_request(self, method: str, endpoint: str,
                     params: Optional[Dict] = None,
                     json: Optional[Dict] = None,
                     data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request with retry logic"""
        url = urljoin(self.base_url + '/', endpoint.lstrip('/'))

        for attempt in range(self.max_retries + 1):
            try:
                self._rate_limit_wait()

                response = self.session.request(
                    method=method.upper(),
                    url=url,
                    params=params,
                    json=json,
                    data=data,
                    timeout=self.timeout
                )

                # Handle different response codes
                if response.status_code == 200:
                    try:
                        return response.json()
                    except json.JSONDecodeError:
                        return {'status': 'success', 'data': response.text}
                elif response.status_code == 201:
                    return {'status': 'created', 'data': response.json() if response.text else {}}
                elif response.status_code == 204:
                    return {'status': 'success', 'data': {}}
                elif response.status_code in [400, 422]:
                    error_data = response.json() if response.text else {}
                    raise ValueError(f"Client error: {error_data}")
                elif response.status_code == 401:
                    raise PermissionError("Authentication failed")
                elif response.status_code == 403:
                    raise PermissionError("Access forbidden")
                elif response.status_code == 404:
                    raise FileNotFoundError(f"Resource not found: {url}")
                elif response.status_code >= 500:
                    if attempt < self.max_retries:
                        continue  # Retry on server errors
                    raise ConnectionError(f"Server error: {response.status_code}")
                else:
                    raise RuntimeError(f"Unexpected status code: {response.status_code}")

            except requests.exceptions.Timeout:
                if attempt < self.max_retries:
                    logger.warning(f"Request timeout, retrying ({attempt + 1}/{self.max_retries + 1})")
                    continue
                raise TimeoutError(f"Request timed out after {self.max_retries + 1} attempts")

            except requests.exceptions.ConnectionError as e:
                if attempt < self.max_retries:
                    logger.warning(f"Connection error, retrying ({attempt + 1}/{self.max_retries + 1}): {e}")
                    continue
                raise ConnectionError(f"Connection failed after {self.max_retries + 1} attempts: {e}")

            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON response: {e}")

        raise RuntimeError(f"Request failed after {self.max_retries + 1} attempts")

    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """GET request"""
        return self._make_request('GET', endpoint, params=params)

    def post(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """POST request"""
        return self._make_request('POST', endpoint, json=data)

    def put(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """PUT request"""
        return self._make_request('PUT', endpoint, json=data)

    def delete(self, endpoint: str) -> Dict[str, Any]:
        """DELETE request"""
        return self._make_request('DELETE', endpoint)

    def patch(self, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """PATCH request"""
        return self._make_request('PATCH', endpoint, json=data)

    def upload_file(self, endpoint: str, file_path: str, field_name: str = 'file') -> Dict[str, Any]:
        """Upload file"""
        try:
            with open(file_path, 'rb') as f:
                files = {field_name: f}
                url = urljoin(self.base_url + '/', endpoint.lstrip('/'))

                self._rate_limit_wait()
                response = self.session.post(url, files=files, timeout=self.timeout)

                if response.status_code in [200, 201]:
                    return response.json()
                else:
                    raise RuntimeError(f"Upload failed: {response.status_code}")

        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {file_path}")
        except Exception as e:
            logger.error(f"File upload failed: {e}")
            raise

    def download_file(self, endpoint: str, local_path: str) -> str:
        """Download file"""
        try:
            url = urljoin(self.base_url + '/', endpoint.lstrip('/'))

            self._rate_limit_wait()
            response = self.session.get(url, timeout=self.timeout, stream=True)

            if response.status_code == 200:
                with open(local_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return local_path
            else:
                raise RuntimeError(f"Download failed: {response.status_code}")

        except Exception as e:
            logger.error(f"File download failed: {e}")
            raise

    def health_check(self) -> bool:
        """Check API connectivity"""
        try:
            response = self.get('/health')
            return response.get('status') == 'healthy'
        except Exception as e:
            logger.error(f"API health check failed: {e}")
            return False

    def get_endpoints(self) -> List[str]:
        """Get available API endpoints"""
        try:
            response = self.get('/endpoints')
            return response.get('endpoints', [])
        except Exception as e:
            logger.error(f"Failed to get endpoints: {e}")
            return []