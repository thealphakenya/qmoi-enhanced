#!/usr/bin/env python3
"""
QMOI 100% DOMAIN HEALTH CHECKER
Verifies all domains are 100% healthy with all validations successful
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from domain_health_100percent_achiever import DomainHealth100PercentAchiever
except ImportError:
    print("ERROR: Cannot import domain health checker")
    sys.exit(1)

def main():
    print("🔍 QMOI 100% Domain Health Checker")
    print("=" * 50)

    achiever = DomainHealth100PercentAchiever()

    results = []
    healthy_count = 0
    total_domains = len(achiever.critical_domains)

    for domain in achiever.critical_domains:
        print(f"\n🔍 Checking {domain}...")
        health_status = achiever.perform_100percent_health_check(domain)
        results.append(health_status)

        if health_status.get('overall_healthy', False):
            healthy_count += 1
            print(f"✅ {domain}: 100% HEALTHY")
        else:
            percentage = health_status.get('health_percentage', 0.0)
            print(f"⚠️  {domain}: {percentage:.1f}% HEALTHY")
            for issue in health_status.get('issues', []):
                print(f"   • {issue}")

    # Summary
    print("\n" + "=" * 50)
    print("📊 HEALTH SUMMARY")
    print("=" * 50)

    overall_percentage = (healthy_count / total_domains) * 100

    if overall_percentage == 100.0:
        print(f"🎉 SUCCESS: {healthy_count}/{total_domains} domains are 100% healthy!")
        print("✅ All domain health validations successful!")
        print("✅ Content delivery confirmed!")
        print("✅ Performance requirements met!")
        return 0
    else:
        print(f"⚠️  PARTIAL: {healthy_count}/{total_domains} domains are 100% healthy ({overall_percentage:.1f}%)")
        print("❌ Some domain health validations failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
