"""Initialize environment for the QMOI Control Server.

This module sets up the environment before the server starts.
"""
from utils.env_manager import setup_environment

def init_server_env():
    """Initialize server environment with all required variables."""
    env = setup_environment()
    
    # Additional server-specific setup can be added here
    return env