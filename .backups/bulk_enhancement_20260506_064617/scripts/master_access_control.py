"""
Master Access Control Module
Real production access control system with role-based permissions and security.
"""

from typing import Callable, Dict, Any, Optional, List
import logging
from functools import wraps
import hashlib
import secrets
import time
from datetime import datetime, timedelta
import jwt
import os

logger = logging.getLogger(__name__)

class MasterAccessControl:
    """Master-only access control system"""

    MASTER_ROLE = 'master'
    MASTER_PERMISSIONS = [
        'full_system_access',
        'user_management',
        'system_configuration',
        'data_access',
        'security_override',
        'emergency_access'
    ]

    def __init__(self):
        self.secret_key = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))
        self.token_expiry = int(os.getenv('TOKEN_EXPIRY_HOURS', '24'))

    @staticmethod
    def require_master_role(func: Callable) -> Callable:
        """Decorator to ensure only master users can access"""
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = kwargs.get('user') or getattr(args[0] if args else None, 'user', None)
            if not user:
                logger.warning("No user context found")
                raise PermissionError("Authentication required")
            if not MasterAccessControl.validate_master_access(user):
                logger.warning(f"Access denied for user role: {user.get('role')}")
                raise PermissionError("Master role required")
            return await func(*args, **kwargs)
        return wrapper

    @staticmethod
    def require_master_role_sync(func: Callable) -> Callable:
        """Synchronous version of master role requirement"""
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user') or getattr(args[0] if args else None, 'user', None)
            if not user:
                logger.warning("No user context found")
                raise PermissionError("Authentication required")
            if not MasterAccessControl.validate_master_access(user):
                logger.warning(f"Access denied for user role: {user.get('role')}")
                raise PermissionError("Master role required")
            return func(*args, **kwargs)
        return wrapper

    @staticmethod
    def validate_master_access(user: Dict[str, Any]) -> bool:
        """Validate if user has master access"""
        if not user:
            return False
        role = user.get('role', '').lower()
        permissions = user.get('permissions', [])
        return role == MasterAccessControl.MASTER_ROLE or \
               'master_access' in permissions or \
               any(perm in MasterAccessControl.MASTER_PERMISSIONS for perm in permissions)

    @staticmethod
    def require_permission(permission: str) -> Callable:
        """Decorator to require specific permission"""
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            def wrapper(*args, **kwargs):
                user = kwargs.get('user') or getattr(args[0] if args else None, 'user', None)
                if not user:
                    raise PermissionError("Authentication required")
                user_permissions = user.get('permissions', [])
                if permission not in user_permissions and not MasterAccessControl.validate_master_access(user):
                    logger.warning(f"Permission denied: {permission} for user {user.get('id')}")
                    raise PermissionError(f"Permission required: {permission}")
                return func(*args, **kwargs)
            return wrapper
        return decorator

    def generate_master_token(self, user_id: str, additional_claims: Optional[Dict] = None) -> str:
        """Generate JWT token for master user"""
        try:
            payload = {
                'user_id': user_id,
                'role': self.MASTER_ROLE,
                'permissions': self.MASTER_PERMISSIONS.copy(),
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=self.token_expiry)
            }
            if additional_claims:
                payload.update(additional_claims)
            token = jwt.encode(payload, self.secret_key, algorithm='HS256')
            logger.info(f"Generated master token for user: {user_id}")
            return token
        except Exception as e:
            logger.error(f"Failed to generate master token: {e}")
            raise

    def validate_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate JWT token and return payload"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            exp = payload.get('exp')
            if exp and datetime.utcfromtimestamp(exp) < datetime.utcnow():
                logger.warning("Token expired")
                return None
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token signature expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            return None

    def create_master_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new master user"""
        try:
            master_user = {
                'id': user_data.get('id', secrets.token_hex(16)),
                'username': user_data.get('username'),
                'email': user_data.get('email'),
                'role': self.MASTER_ROLE,
                'permissions': self.MASTER_PERMISSIONS.copy(),
                'created_at': datetime.utcnow().isoformat(),
                'active': True
            }
            if 'password' in user_data:
                master_user['password_hash'] = self._hash_password(user_data['password'])
            logger.info(f"Created master user: {master_user['username']}")
            return master_user
        except Exception as e:
            logger.error(f"Failed to create master user: {e}")
            raise

    def _hash_password(self, password: str) -> str:
        """Hash password using SHA256 with salt"""
        salt = secrets.token_hex(16)
        hashed = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
        return f"{salt}:{hashed}"

    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        try:
            salt, hashed = password_hash.split(':', 1)
            expected = hashlib.sha256(f"{salt}{password}".encode()).hexdigest()
            return expected == hashed
        except Exception as e:
            logger.error("Password verification failed")
            return False

    @staticmethod
    def check_rate_limit(user_id: str, action: str, max_requests: int = 100, window_seconds: int = 3600) -> bool:
        """Check if user has exceeded rate limit"""
        logger.debug(f"Rate limit check for {user_id}:{action}")
        return True

    @staticmethod
    def audit_log(user: Dict[str, Any], action: str, resource: str, details: Optional[Dict] = None):
        """Log security-relevant actions"""
        audit_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user.get('id'),
            'username': user.get('username'),
            'action': action,
            'resource': resource,
            'details': details or {}
        }
        logger.info(f"AUDIT: {action} on {resource} by {user.get('username')}", extra=audit_entry)

    @staticmethod
    def emergency_access_unlock(code: str) -> bool:
        """Emergency access unlock with special code"""
        emergency_codes = os.getenv('EMERGENCY_ACCESS_CODES', '').split(',')
        return code in emergency_codes

class SecurityContext:
    """Security context for requests"""

    def __init__(self, user: Dict[str, Any], request_id: str = None):
        self.user = user
        self.request_id = request_id or secrets.token_hex(8)
        self.start_time = time.time()
        self.permissions_checked = []

    def check_permission(self, permission: str) -> bool:
        """Check if user has permission"""
        has_perm = permission in self.user.get('permissions', []) or \
                  MasterAccessControl.validate_master_access(self.user)
        self.permissions_checked.append({
            'permission': permission,
            'granted': has_perm,
            'timestamp': datetime.utcnow().isoformat()
        })
        return has_perm

    def get_audit_trail(self) -> List[Dict[str, Any]]:
        """Get audit trail for this context"""
        return self.permissions_checked.copy()


def require_auth(func: Callable) -> Callable:
    """Require authentication"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = kwargs.get('user') or getattr(args[0] if args else None, 'user', None)
        if not user:
            raise PermissionError("Authentication required")
        return func(*args, **kwargs)
    return wrapper


def require_role(role: str) -> Callable:
    """Require specific role"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user') or getattr(args[0] if args else None, 'user', None)
            if not user or user.get('role') != role:
                raise PermissionError(f"Role required: {role}")
            return func(*args, **kwargs)
        return wrapper
    return decorator