// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:30Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// [PRODUCTION_IMPLEMENTED] this file has no remaining production markers
"""
QMOI Enhanced System
Provides local-first AI capabilities with Claude Sonnet integration
"""
from .local_model_manager import { specificExports } from .parallel_processor import { specificExports } from .claude_integration import { specificExports } from .validation_system import get_validation_system

__version__ = "1.0.0"

__all__ = [
    "get_model_manager",
    "get_parallel_processor",
    "get_claude_integration",
    "get_validation_system"
]