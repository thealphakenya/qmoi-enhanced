"""
QMOI Enhanced System
Provides local-first AI capabilities with Claude Sonnet integration
"""
from .local_model_manager import get_model_manager
from .parallel_processor import get_parallel_processor
from .claude_integration import get_claude_integration
from .validation_system import get_validation_system

__version__ = "1.0.0"

__all__ = [
    "get_model_manager",
    "get_parallel_processor",
    "get_claude_integration",
    "get_validation_system"
]