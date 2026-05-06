#!/usr/bin/env python3
"""
QMOI Enhanced - AI API Server
REST API endpoints for accessing AI services
"""

import os
import logging
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import AI services
import ai_orchestrator
import ai_anomaly_service
import ml_service
import nlp_service
import cv_service
import autonomous_service
import advanced_analytics_service

# Authentication imports
import hashlib
import secrets
from functools import wraps

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('ai_api_server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Authentication configuration
AUTH_CONFIG_FILE = 'auth_config.json'
API_KEYS_FILE = 'api_keys.json'
USERS_FILE = 'users.json'

# Load authentication configuration
def load_auth_config():
    try:
        with open(AUTH_CONFIG_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning("Auth config not found, authentication disabled")
        return {'enabled': False, 'api_key_required': False}
    except Exception as e:
        logger.error(f"Error loading auth config: {e}")
        return {'enabled': False, 'api_key_required': False}

# Load API keys
def load_api_keys():
    try:
        with open(API_KEYS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning("API keys file not found")
        return {}

# Authentication middleware
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_config = load_auth_config()

        if not auth_config.get('enabled', False):
            return f(*args, **kwargs)

        # Check for API key in header
        api_key = request.headers.get('X-API-Key') or request.headers.get('Authorization')

        if api_key and api_key.startswith('Bearer '):
            api_key = api_key[7:]  # Remove 'Bearer ' prefix

        if not api_key:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Please provide an API key in X-API-Key header or Authorization header'
            }), 401

        # Validate API key
        api_keys = load_api_keys()
        key_valid = False
        user_permissions = []

        for key_data in api_keys.values():
            if key_data.get('key') == api_key and key_data.get('active', False):
                key_valid = True
                user_permissions = key_data.get('permissions', [])
                # Update last used timestamp
                key_data['last_used'] = datetime.now().isoformat()
                with open(API_KEYS_FILE, 'w') as f:
                    json.dump(api_keys, f, indent=2)
                break

        if not key_valid:
            return jsonify({
                'error': 'Invalid API key',
                'message': 'The provided API key is invalid or inactive'
            }), 401

        # Store user permissions in request context
        request.user_permissions = user_permissions
        return f(*args, **kwargs)

    return decorated_function

# Permission-based access control
def require_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_config = load_auth_config()

            if not auth_config.get('enabled', False):
                return f(*args, **kwargs)

            if not hasattr(request, 'user_permissions') or permission not in request.user_permissions:
                return jsonify({
                    'error': 'Insufficient permissions',
                    'message': f'Required permission: {permission}',
                    'user_permissions': getattr(request, 'user_permissions', [])
                }), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Rate limiting (simple in-memory implementation)
rate_limit_store = {}

def check_rate_limit(identifier, max_requests, time_window):
    current_time = datetime.now().timestamp()
    key = f"{identifier}:{int(current_time / time_window)}"

    if key not in rate_limit_store:
        rate_limit_store[key] = 0

    rate_limit_store[key] += 1

    # Clean old entries
    cutoff_time = current_time - (time_window * 2)
    rate_limit_store_copy = rate_limit_store.copy()
    for k in rate_limit_store_copy:
        parts = k.split(':')
        if len(parts) >= 2:
            try:
                timestamp = int(parts[-1])  # Last part should be timestamp
                if timestamp * time_window < cutoff_time:
                    del rate_limit_store[k]
            except ValueError:
                # Skip keys that don't have numeric timestamps
                continue

    return rate_limit_store[key] <= max_requests

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_config = load_auth_config()
        rate_config = auth_config.get('rate_limiting', {})

        if not rate_config.get('enabled', False):
            return f(*args, **kwargs)

        # Use API key or IP as identifier
        identifier = request.headers.get('X-API-Key') or request.remote_addr
        max_per_minute = rate_config.get('requests_per_minute', 60)
        max_per_hour = rate_config.get('requests_per_hour', 1000)

        if not check_rate_limit(f"{identifier}:minute", max_per_minute, 60):
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': f'Maximum {max_per_minute} requests per minute exceeded'
            }), 429

        if not check_rate_limit(f"{identifier}:hour", max_per_hour, 3600):
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': f'Maximum {max_per_hour} requests per hour exceeded'
            }), 429

        return f(*args, **kwargs)
    return decorated_function

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for web access

# Get orchestrator instance
orchestrator = ai_orchestrator.ai_orchestrator

@app.route('/health', methods=['GET'])
@rate_limit
def health_check():
    """Health check endpoint"""
    try:
        status = orchestrator.get_system_status()
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'services': status,
            'authentication': load_auth_config().get('enabled', False)
        })
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/anomaly-detection', methods=['POST'])
@require_auth
@require_permission('write')
@rate_limit
def anomaly_detection():
    """Anomaly detection endpoint"""
    try:
        data = request.get_json()
        if not data or 'data' not in data:
            return jsonify({'error': 'Missing data field'}), 400

        # Submit task to orchestrator
        task_id = orchestrator.submit_task('anomaly_detection', data)
        return jsonify({
            'task_id': task_id,
            'status': 'submitted',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Anomaly detection request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/machine-learning', methods=['POST'])
@require_auth
@require_permission('write')
@rate_limit
def machine_learning():
    """Machine learning endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing request data'}), 400

        # Submit task to orchestrator
        task_id = orchestrator.submit_task('machine_learning', data)
        return jsonify({
            'task_id': task_id,
            'status': 'submitted',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Machine learning request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/nlp-analysis', methods=['POST'])
@require_auth
@require_permission('write')
@rate_limit
def nlp_analysis():
    """Natural language processing endpoint"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400

        # Submit task to orchestrator
        task_id = orchestrator.submit_task('nlp_analysis', data)
        return jsonify({
            'task_id': task_id,
            'status': 'submitted',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"NLP analysis request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/computer-vision', methods=['POST'])
@require_auth
@require_permission('write')
@rate_limit
def computer_vision():
    """Computer vision endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing request data'}), 400

        # Submit task to orchestrator
        task_id = orchestrator.submit_task('computer_vision', data)
        return jsonify({
            'task_id': task_id,
            'status': 'submitted',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Computer vision request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predictive-analytics', methods=['POST'])
@require_auth
@require_permission('write')
@rate_limit
def predictive_analytics():
    """Predictive analytics endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing request data'}), 400

        # Submit task to orchestrator
        task_id = orchestrator.submit_task('predictive_analytics', data)
        return jsonify({
            'task_id': task_id,
            'status': 'submitted',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Predictive analytics request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/task/<task_id>', methods=['GET'])
@require_auth
@require_permission('read')
@rate_limit
def get_task_status(task_id):
    """Get task status and results"""
    try:
        # This is a simplified version - in production you'd track tasks properly
        return jsonify({
            'task_id': task_id,
            'status': 'processing',
            'message': 'Task status tracking not fully implemented',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Task status request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/docs', methods=['GET'])
def api_documentation():
    """Interactive API documentation"""
    docs = {
        'title': 'QMOI Enhanced AI API Documentation',
        'version': '1.0.0',
        'description': 'REST API for accessing QMOI Enhanced AI services',
        'base_url': 'http://production-db.qmoi.ai:3000',
        'endpoints': {
            'health': {
                'method': 'GET',
                'url': '/health',
                'description': 'Check system health and service status',
                'response': {
                    'status': 'healthy',
                    'timestamp': '2026-04-20T01:10:34.000000',
                    'services': {
                        'anomaly_detection': 'running',
                        'machine_learning': 'running',
                        'nlp': 'running',
                        'computer_vision': 'running',
                        'autonomous_learning': 'running',
                        'advanced_analytics': 'running',
                        'performance_optimizer': 'running',
                        'orchestrator': 'running'
                    }
                }
            },
            'system_info': {
                'method': 'GET',
                'url': '/system-info',
                'description': 'Get comprehensive system information and metrics',
                'response': {
                    'system_status': 'operational',
                    'active_tasks': 0,
                    'total_tasks_processed': 1234,
                    'performance_metrics': {
                        'cpu_usage': 15.5,
                        'memory_usage': 45.2,
                        'disk_usage': 20.1
                    },
                    'service_health': {
                        'anomaly_detection': {'status': 'healthy', 'uptime': '2h 30m'},
                        'machine_learning': {'status': 'healthy', 'uptime': '2h 30m'},
                        'nlp': {'status': 'healthy', 'uptime': '2h 30m'},
                        'computer_vision': {'status': 'healthy', 'uptime': '2h 30m'},
                        'autonomous_learning': {'status': 'healthy', 'uptime': '2h 30m'},
                        'advanced_analytics': {'status': 'healthy', 'uptime': '2h 30m'},
                        'performance_optimizer': {'status': 'healthy', 'uptime': '2h 30m'},
                        'orchestrator': {'status': 'healthy', 'uptime': '2h 30m'}
                    }
                }
            },
            'recommendations': {
                'method': 'GET',
                'url': '/recommendations',
                'description': 'Get AI-powered system recommendations',
                'response': {
                    'recommendations': [
                        {
                            'type': 'performance',
                            'priority': 'medium',
                            'message': 'Consider increasing memory allocation for ML service',
                            'action': 'restart_service',
                            'service': 'machine_learning'
                        }
                    ],
                    'timestamp': '2026-04-20T01:10:34.000000'
                }
            },
            'anomaly_detection': {
                'method': 'POST',
                'url': '/anomaly-detection',
                'description': 'Submit anomaly detection task',
                'request_body': {
                    'data': [1.0, 2.5, 3.2, 4.1, 5.0],
                    'threshold': 0.95
                },
                'response': {
                    'task_id': 'task_123456789',
                    'status': 'submitted',
                    'timestamp': '2026-04-20T01:10:34.000000'
                },
                'example_curl': 'curl -X POST http://production-db.qmoi.ai:3000/anomaly-detection -H "Content-Type: application/json" -d \'{"data": [1, 2, 3, 4, 5]}\''
            },
            'machine_learning': {
                'method': 'POST',
                'url': '/machine-learning',
                'description': 'Submit machine learning task (regression or clustering)',
                'request_body': {
                    'task_type': 'regression',
                    'data': [[1, 2], [3, 4], [5, 6]],
                    'target': [1.5, 3.5, 5.5]
                },
                'response': {
                    'task_id': 'task_123456790',
                    'status': 'submitted',
                    'timestamp': '2026-04-20T01:10:34.000000'
                },
                'example_curl': 'curl -X POST http://production-db.qmoi.ai:3000/machine-learning -H "Content-Type: application/json" -d \'{"task_type": "regression", "data": [[1, 2], [3, 4]], "target": [1.5, 3.5]}\''
            },
            'nlp_analysis': {
                'method': 'POST',
                'url': '/nlp-analysis',
                'description': 'Submit natural language processing task',
                'request_body': {
                    'text': 'This is a sample text for sentiment analysis.',
                    'task_type': 'sentiment'
                },
                'response': {
                    'task_id': 'task_123456791',
                    'status': 'submitted',
                    'timestamp': '2026-04-20T01:10:34.000000'
                },
                'example_curl': 'curl -X POST http://production-db.qmoi.ai:3000/nlp-analysis -H "Content-Type: application/json" -d \'{"text": "Hello, this is a test message"}\''
            },
            'computer_vision': {
                'method': 'POST',
                'url': '/computer-vision',
                'description': 'Submit computer vision task',
                'request_body': {
                    'image_data': 'base64_encoded_image_data',
                    'task_type': 'edge_detection'
                },
                'response': {
                    'task_id': 'task_123456792',
                    'status': 'submitted',
                    'timestamp': '2026-04-20T01:10:34.000000'
                },
                'example_curl': 'curl -X POST http://production-db.qmoi.ai:3000/computer-vision -H "Content-Type: application/json" -d \'{"image_data": "base64_data", "task_type": "edge_detection"}\''
            },
            'predictive_analytics': {
                'method': 'POST',
                'url': '/predictive-analytics',
                'description': 'Submit predictive analytics task',
                'request_body': {
                    'data': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    'forecast_periods': 3
                },
                'response': {
                    'task_id': 'task_123456793',
                    'status': 'submitted',
                    'timestamp': '2026-04-20T01:10:34.000000'
                },
                'example_curl': 'curl -X POST http://production-db.qmoi.ai:3000/predictive-analytics -H "Content-Type: application/json" -d \'{"data": [1, 2, 3, 4, 5], "forecast_periods": 3}\''
            },
            'task_status': {
                'method': 'GET',
                'url': '/task/<task_id>',
                'description': 'Get task status and results',
                'parameters': {
                    'task_id': 'Task ID returned from task submission'
                },
                'response': {
                    'task_id': 'task_123456789',
                    'status': 'completed',
                    'result': {'anomalies': [], 'confidence': 0.95},
                    'submitted_at': '2026-04-20T01:10:30.000000',
                    'completed_at': '2026-04-20T01:10:34.000000',
                    'processing_time': 4.0
                }
            }
        },
        'authentication': {
            'enabled': load_auth_config().get('enabled', False),
            'description': 'API key authentication system for secure access',
            'methods': {
                'header': 'X-API-Key: your_api_key_here',
                'bearer': 'Authorization: Bearer your_api_key_here'
            },
            'permissions': {
                'read': 'Read access to system info, health checks, and task status',
                'write': 'Write access to submit AI tasks and modify data',
                'admin': 'Administrative access to all system functions'
            },
            'getting_started': [
                '1. Initialize auth system: ./auth_system.sh init',
                '2. Create user: ./auth_system.sh create-user username password',
                '3. Generate API key: ./auth_system.sh generate-key username',
                '4. Use API key in requests'
            ],
            'management_commands': {
                'init': './auth_system.sh init',
                'create_user': './auth_system.sh create-user <user> <pass> [email] [role]',
                'generate_key': './auth_system.sh generate-key <user> [permissions]',
                'list_keys': './auth_system.sh list-keys',
                'revoke_key': './auth_system.sh revoke-key <key_id>',
                'validate_key': './auth_system.sh validate-key <api_key>',
                'status': './auth_system.sh status'
            }
        },
        'rate_limits': {
            'enabled': load_auth_config().get('rate_limiting', {}).get('enabled', False),
            'limits': {
                'requests_per_minute': load_auth_config().get('rate_limiting', {}).get('requests_per_minute', 60),
                'requests_per_hour': load_auth_config().get('rate_limiting', {}).get('requests_per_hour', 1000)
            },
            'description': 'Rate limiting prevents API abuse and ensures fair usage'
        },
        'error_codes': {
            '400': 'Bad Request - Invalid input data',
            '401': 'Unauthorized - Authentication required or invalid API key',
            '403': 'Forbidden - Insufficient permissions',
            '404': 'Not Found - Task or endpoint not found',
            '429': 'Too Many Requests - Rate limit exceeded',
            '500': 'Internal Server Error - Service unavailable'
        },
        'examples': {
            'health_check': 'curl http://production-db.qmoi.ai:3000/health',
            'health_with_auth': 'curl -H "X-API-Key: your_key_here" http://production-db.qmoi.ai:3000/health',
            'system_info': 'curl -H "X-API-Key: your_key_here" http://production-db.qmoi.ai:3000/system-info',
            'submit_task': 'curl -X POST -H "X-API-Key: your_key_here" -H "Content-Type: application/json" -d \'{"data": [1,2,3,4,5]}\' http://production-db.qmoi.ai:3000/anomaly-detection',
            'check_task': 'curl -H "X-API-Key: your_key_here" http://production-db.qmoi.ai:3000/task/task_123456789'
        },
        'contact': {
            'description': 'QMOI Enhanced AI System API',
            'version': '1.0.0',
            'documentation_url': 'http://production-db.qmoi.ai:3000/docs'
        }
    }

    return jsonify(docs)

@app.route('/system-info', methods=['GET'])
@require_auth
@require_permission('read')
@rate_limit
def system_info():
    """Get comprehensive system information"""
    try:
        status = orchestrator.get_system_status()
        performance_report = orchestrator.get_advanced_performance_report()

        return jsonify({
            'system_status': status,
            'performance_report': performance_report,
            'timestamp': datetime.now().isoformat(),
            'user_permissions': getattr(request, 'user_permissions', [])
        })
    except Exception as e:
        logger.error(f"System info request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/recommendations', methods=['GET'])
@require_auth
@require_permission('read')
@rate_limit
def get_recommendations():
    """Get AI-powered recommendations"""
    try:
        # Get recommendations from analytics service
        recommendations = advanced_analytics_service.analytics_service.get_recommendations()
        return jsonify({
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Recommendations request failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting QMOI Enhanced AI API Server...")
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('API_PORT', 3000)),
        RELEASE=os.getenv('RELEASE', 'False').lower() == 'true'
    )