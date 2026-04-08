#!/usr/bin/env python3
"""QMOI Offline Verification Script - Phase 4.1 Implementation

Validates offline resilience capabilities and cached resources.
"""

import json
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

def check_cache_integrity():
    """Verify link cache integrity"""
    cache_path = Path('.qmoi_validation/link_cache.json')
    if not cache_path.exists():
        return False, 'Cache file missing'
    
    try:
        with open(cache_path, 'r') as f:
            data = json.load(f)
        
        if not isinstance(data, dict) or len(data) == 0:
            return False, 'Cache data invalid'
        
        # Check for required fields
        for domain, info in data.items():
            required_fields = ['checked_at', 'healthy', 'type']
            for field in required_fields:
                if field not in info:
                    return False, f'Missing field {field} for {domain}'
        
        return True, f'Cache valid with {len(data)} domains'
    except Exception as e:
        return False, f'Cache read error: {e}'

def check_offline_docs():
    """Verify offline documentation availability"""
    docs_path = Path('docs_site/index.html')
    if not docs_path.exists():
        return False, 'Offline docs missing'
    
    # Check if docs are readable
    try:
        with open(docs_path, 'r') as f:
            content = f.read()
        
        if 'QMOI Enhanced - Offline Documentation' not in content:
            return False, 'Offline docs content invalid'
        
        return True, 'Offline docs accessible'
    except Exception as e:
        return False, f'Docs read error: {e}'

def check_cache_freshness():
    """Check if cache is reasonably fresh"""
    cache_path = Path('.qmoi_validation/link_cache.json')
    if not cache_path.exists():
        return False, 'Cache file missing'
    
    try:
        with open(cache_path, 'r') as f:
            data = json.load(f)
        
        # Check most recent timestamp
        latest_check = None
        for domain, info in data.items():
            checked_at = info.get('checked_at')
            if checked_at:
                try:
                    ts = datetime.fromisoformat(checked_at.replace('Z', '+00:00'))
                    if latest_check is None or ts > latest_check:
                        latest_check = ts
                except:
                    continue
        
        if latest_check is None:
            return False, 'No valid timestamps found'
        
        # Check if cache is older than 7 days
        cutoff = datetime.now(timezone.utc) - timedelta(days=7)
        if latest_check < cutoff:
            return False, f'Cache stale (last checked: {latest_check})'
        
        return True, f'Cache fresh (last checked: {latest_check})'
    except Exception as e:
        return False, f'Freshness check error: {e}'

def main():
    print('🔍 QMOI Offline Verification - Phase 4.1')
    print('=' * 50)
    
    checks = [
        ('Cache Integrity', check_cache_integrity),
        ('Offline Docs', check_offline_docs),
        ('Cache Freshness', check_cache_freshness),
    ]
    
    all_passed = True
    for name, check_func in checks:
        print(f'\n📋 Checking {name}...')
        passed, message = check_func()
        status = '✅ PASS' if passed else '❌ FAIL'
        print(f'   {status}: {message}')
        if not passed:
            all_passed = False
    
    print('\n' + '=' * 50)
    if all_passed:
        print('🎉 All offline verification checks PASSED')
        print('✅ Phase 4.1 Offline Resilience: OPERATIONAL')
        return 0
    else:
        print('⚠️  Some offline verification checks FAILED')
        print('🔧 Phase 4.1 Offline Resilience: NEEDS ATTENTION')
        return 1

if __name__ == '__main__':
    exit(main())
