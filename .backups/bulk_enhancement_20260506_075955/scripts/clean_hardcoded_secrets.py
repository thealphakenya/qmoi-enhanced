#!/usr/bin/env python3
"""
QMOI Enhanced - Hardcoded Secrets Cleaner
Replaces hardcoded secrets with environment variable references.
"""

import re
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

# Files to process (exclude backups and node_modules)
SOURCE_DIRS = [
    "app",
    "src", 
    "services",
    "lib",
    "scripts",
    "__tests__",
]

# Patterns and their replacements
PATTERNS = [
    # API Keys
    (r"apiKey\s*[:=]\s*['\"]sk_[^'\"]+['\"]", "apiKey: process.env.CASHON_API_KEY"),
    (r"api_key\s*[:=]\s*['\"]sk_[^'\"]+['\"]", "api_key: process.env.API_KEY"),
    (r"API_KEY\s*[:=]\s*['\"]sk_[^'\"]+['\"]", "API_KEY: process.env.API_KEY"),
    
    # Secrets
    (r"secret\s*[:=]\s*['\"][^'\"]{16,}['\"]", "secret: process.env.API_SECRET"),
    (r"SECRET\s*[:=]\s*['\"][^'\"]{16,}['\"]", "SECRET: process.env.API_SECRET"),
    (r"webhookSecret\s*[:=]\s*['\"][^'\"]{16,}['\"]", "webhookSecret: process.env.CASHON_WEBHOOK_SECRET"),
    
    # Passwords
    (r"password\s*[:=]\s*['\"][^'\"]{6,}['\"]", "password: process.env.DB_PASSWORD"),
    (r"PASSWORD\s*[:=]\s*['\"][^'\"]{6,}['\"]", "PASSWORD: process.env.DB_PASSWORD"),
    
    # JWT Secrets
    (r"jwtSecret\s*[:=]\s*['\"][^'\"]{16,}['\"]", "jwtSecret: process.env.JWT_SECRET"),
    (r"JWT_SECRET\s*[:=]\s*['\"][^'\"]{16,}['\"]", "JWT_SECRET: process.env.JWT_SECRET"),
]

EXCLUDED = {".backups", ".git", "node_modules", "dist", ".github", ".next"}

def clean_secrets():
    count = 0
    for source_dir in SOURCE_DIRS:
        dir_path = PROJECT_ROOT / source_dir
        if not dir_path.exists():
            continue
            
        for filepath in dir_path.rglob("*"):
            if filepath.is_file() and filepath.suffix in {".ts", ".js", ".tsx", ".jsx"}:
                try:
                    content = filepath.read_text(encoding='utf-8', errors='ignore')
                    modified = content
                    
                    for pattern, replacement in PATTERNS:
                        if re.search(pattern, content):
                            modified = re.sub(pattern, replacement, modified)
                            count += 1
                    
                    if modified != content:
                        filepath.write_text(modified, encoding='utf-8')
                        print(f"  ✓ {filepath.relative_to(PROJECT_ROOT)}")
                except Exception as e:
                    print(f"  Error processing {filepath}: {e}")
    
    print(f"\n✅ Cleaned {count} hardcoded secrets")

if __name__ == "__main__":
    print("🔐 Cleaning hardcoded secrets...")
    clean_secrets()
