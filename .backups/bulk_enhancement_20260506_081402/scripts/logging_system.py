"""
Production Logging System Module
Real production logging with file rotation, structured logging, and multiple handlers.
"""

import logging
import logging.handlers
import os
import sys
from pathlib import Path
from typing import Optional, Dict, Any
import json
import threading
from datetime import datetime

class ProductionLogger:
    """Production logging system with file rotation and structured logging"""

    _instances = {}
    _lock = threading.RLock()

    def __init__(self, name: str, log_level: str = 'INFO', log_dir: str = 'logs'):
        self.name = name
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)

        # Create logger
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

        # Remove existing handlers to avoid duplicates
        self.logger.handlers.clear()

        # Create formatters
        self._create_formatters()

        # Add handlers
        self._add_handlers()

        # Store instance
        with self._lock:
            self._instances[name] = self

    def _create_formatters(self):
        """Create logging formatters"""
        # Standard formatter
        self.standard_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        # Detailed formatter with more info
        self.detailed_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
        )

        # JSON formatter for structured logging
        self.json_formatter = JSONFormatter()

    def _add_handlers(self):
        """Add logging handlers"""
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(self.standard_formatter)
        self.logger.addHandler(console_handler)

        # File handler with rotation (main log)
        main_log_file = self.log_dir / f'{self.name}.log'
        file_handler = logging.handlers.RotatingFileHandler(
            main_log_file,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(self.detailed_formatter)
        self.logger.addHandler(file_handler)

        # Error log file (only errors and above)
        error_log_file = self.log_dir / f'{self.name}_error.log'
        error_handler = logging.handlers.RotatingFileHandler(
            error_log_file,
            maxBytes=5*1024*1024,  # 5MB
            backupCount=3
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(self.detailed_formatter)
        self.logger.addHandler(error_handler)

        # JSON structured log
        json_log_file = self.log_dir / f'{self.name}.jsonl'
        json_handler = logging.handlers.RotatingFileHandler(
            json_log_file,
            maxBytes=20*1024*1024,  # 20MB
            backupCount=3
        )
        json_handler.setLevel(logging.INFO)
        json_handler.setFormatter(self.json_formatter)
        self.logger.addHandler(json_handler)

    def get_logger(self) -> logging.Logger:
        """Get the configured logger"""
        return self.logger

    @classmethod
    def get_instance(cls, name: str) -> 'ProductionLogger':
        """Get or create logger instance"""
        with cls._lock:
            if name not in cls._instances:
                cls._instances[name] = cls(name)
            return cls._instances[name]

    def log_performance(self, operation: str, duration: float, metadata: Optional[Dict[str, Any]] = None):
        """Log performance metrics"""
        extra = {'operation': operation, 'duration_ms': duration}
        if metadata:
            extra.update(metadata)

        self.logger.info(f"Performance: {operation} took {duration:.2f}ms", extra=extra)

    def log_error_with_context(self, error: Exception, context: Optional[Dict[str, Any]] = None):
        """Log error with additional context"""
        error_msg = f"{type(error).__name__}: {error}"
        extra = {'error_type': type(error).__name__, 'error_message': str(error)}

        if context:
            extra.update(context)

        self.logger.error(error_msg, extra=extra)

    def log_api_call(self, method: str, endpoint: str, status_code: int, duration: float):
        """Log API call details"""
        level = logging.INFO if status_code < 400 else logging.WARNING if status_code < 500 else logging.ERROR

        extra = {
            'method': method,
            'endpoint': endpoint,
            'status_code': status_code,
            'duration_ms': duration
        }

        self.logger.log(level, f"API {method} {endpoint} - {status_code} ({duration:.2f}ms)", extra=extra)

class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""

    def format(self, record):
        # Create log entry
        log_entry = {
            'timestamp': datetime.fromtimestamp(record.created).isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }

        # Add exception info if present
        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)

        # Add extra fields
        if hasattr(record, '__dict__'):
            for key, value in record.__dict__.items():
                if key not in ['name', 'msg', 'args', 'levelname', 'levelno', 'pathname',
                             'filename', 'module', 'exc_info', 'exc_text', 'stack_info',
                             'lineno', 'funcName', 'created', 'msecs', 'relativeCreated',
                             'thread', 'threadName', 'processName', 'process', 'message']:
                    log_entry[key] = value

        return json.dumps(log_entry, default=str)

# Global logger instances
def get_logger(name: str) -> logging.Logger:
    """Get a production logger instance"""
    return ProductionLogger.get_instance(name).get_logger()

def setup_global_logging(level: str = 'INFO', log_dir: str = 'logs'):
    """Setup global logging configuration"""
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level.upper(), logging.INFO))

    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Add console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    ))
    root_logger.addHandler(console_handler)

    # Create main logger
    main_logger = ProductionLogger('qmoi_production', level, log_dir)

    return main_logger.get_logger()