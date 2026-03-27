#!/usr/bin/env python3
"""
QMOI DOMAIN HEALTH MONITORING DASHBOARD
Real-time monitoring of all domains for 100% health
"""

import json
import time
import os
from datetime import datetime
from domain_health_100percent_achiever import DomainHealth100PercentAchiever

def print_header():
    print("\n" + "=" * 80)
    print("🎯 QMOI 100% DOMAIN HEALTH MONITORING DASHBOARD")
    print("=" * 80)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)

def print_domain_status(domain, status):
    if status['overall_healthy']:
        health_icon = "✅"
        health_text = "100% HEALTHY"
        color = "\033[92m"  # Green
    else:
        percentage = status['health_percentage']
        if percentage >= 80:
            health_icon = "🟡"
            color = "\033[93m"  # Yellow
        else:
            health_icon = "❌"
            color = "\033[91m"  # Red
        health_text = f"{percentage:.1f}% HEALTHY"

    reset_color = "\033[0m"

    print(f"{color}{health_icon} {domain:<15} {health_text:<12} Score: {status['score']}/{status['max_score']}{reset_color}")

    if not status['overall_healthy']:
        for issue in status['issues'][:2]:  # Show first 2 issues
            print(f"      • {issue}")

def main():
    achiever = DomainHealth100PercentAchiever()

    while True:
        os.system('clear')  # Clear screen
        print_header()

        results = []
        healthy_count = 0

        for domain in achiever.critical_domains:
            status = achiever.perform_100percent_health_check(domain)
            results.append(status)
            if status['overall_healthy']:
                healthy_count += 1

            print_domain_status(domain, status)

        # Summary
        total_domains = len(achiever.critical_domains)
        overall_percentage = (healthy_count / total_domains) * 100

        print("\n" + "=" * 80)
        print("📊 OVERALL HEALTH SUMMARY")
        print("=" * 80)

        if overall_percentage == 100.0:
            print(f"🎉 SUCCESS: {healthy_count}/{total_domains} domains are 100% healthy!")
            print("✅ All domain health validations successful!")
            print("✅ Content delivery confirmed!")
            print("✅ Performance requirements met!")
            print("\n🏆 QMOI DOMAINS ACHIEVE 100% HEALTH! 🏆")
        else:
            print(f"⚠️  CURRENT: {healthy_count}/{total_domains} domains are 100% healthy ({overall_percentage:.1f}%)")
            print("❌ Some domain health validations failed")
            print("\n📋 Check 100PERCENT_DOMAIN_HEALTH_GUIDE.md for fixes")

        print("\n⏰ Next check in 30 seconds... (Ctrl+C to exit)")
        time.sleep(30)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Monitoring stopped by user")
