#!/usr/bin/env python3
"""
QMOI Domain Activation Script - Phase 5
Marks domains as ACTIVE and removes parked status
"""

import json
import sys
import argparse
import time
from datetime import datetime
import subprocess
import os

def load_deployment_status():
    """Load current deployment status"""
    try:
        with open('docs/domain_deployment_status.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Error: docs/domain_deployment_status.json not found")
        return None

def save_deployment_status(status):
    """Save updated deployment status"""
    with open('docs/domain_deployment_status.json', 'w') as f:
        json.dump(status, f, indent=2)

def mark_domains_active(status, target_domains=None):
    """Mark domains as active and remove parked status"""
    print("🚀 Starting Phase 5: Domain Activation")

    activated_count = 0
    total_processed = 0

    # Get domains that completed UI features deployment
    eligible_domains = []
    for domain, data in status['deployment_status_by_domain'].items():
        if data.get('ui_features_status') == '✅ Coverage sufficient' or data.get('ui_feature_coverage', '0%') >= '80%':
            eligible_domains.append(domain)

    if target_domains:
        # Filter to specified domains
        eligible_domains = [d for d in eligible_domains if d in target_domains]

    print(f"📋 Found {len(eligible_domains)} domains eligible for activation")

    for domain in eligible_domains:
        total_processed += 1
        print(f"\n🔄 Processing {domain}...")

        try:
            # Update domain status
            if 'phase_5_activation' not in status['deployment_status_by_domain'][domain]:
                status['deployment_status_by_domain'][domain]['phase_5_activation'] = {}

            status['deployment_status_by_domain'][domain]['phase_5_activation'].update({
                'status': 'completed',
                'timestamp': datetime.now().isoformat(),
                'action': 'marked_active',
                'previous_status': status['deployment_status_by_domain'][domain].get('active_status', 'unknown'),
                'parked_removed': True
            })

            # Update overall domain status
            status['deployment_status_by_domain'][domain]['active_status'] = '✅ ACTIVE'
            status['deployment_status_by_domain'][domain]['parked'] = False
            status['deployment_status_by_domain'][domain]['health_score'] = min(100, status['deployment_status_by_domain'][domain].get('health_score', 0) + 15)

            activated_count += 1
            print(f"✅ {domain} marked as ACTIVE")

        except Exception as e:
            print(f"❌ Failed to activate {domain}: {str(e)}")
            status['deployment_status_by_domain'][domain]['phase_5_activation'] = {
                'status': 'failed',
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }

    # Update global status
    status['deployment_phases_status']['phase_5_activation'] = {
        'status': 'completed' if activated_count == len(eligible_domains) else 'partial',
        'completed_at': datetime.now().isoformat(),
        'domains_processed': total_processed,
        'domains_activated': activated_count,
        'success_rate': f"{activated_count}/{total_processed}" if total_processed > 0 else "0/0"
    }

    # Recalculate global health
    total_domains = len(status['deployment_status_by_domain'])
    active_domains = sum(1 for d in status['deployment_status_by_domain'].values() if d.get('active_status') == '✅ ACTIVE')
    status['global_status']['overall_health_percentage'] = round((active_domains / total_domains) * 100, 1)

    save_deployment_status(status)

    print("\n🎉 Phase 5 Complete!")
    print(f"✅ Domains activated: {activated_count}/{total_processed}")
    print(f"📊 Overall health: {status['global_status']['overall_health_percentage']}%")

    return activated_count == total_processed

def main():
    parser = argparse.ArgumentParser(description='Mark QMOI domains as ACTIVE')
    parser.add_argument('--mark-active', action='store_true', help='Mark domains as active')
    parser.add_argument('--remove-parked-status', action='store_true', help='Remove parked status')
    parser.add_argument('--all-domains', action='store_true', help='Process all eligible domains')
    parser.add_argument('--domains', nargs='+', help='Specific domains to activate')

    args = parser.parse_args()

    if not (args.mark_active and args.remove_parked_status):
        print("❌ Error: Must specify both --mark-active and --remove-parked-status")
        sys.exit(1)

    status = load_deployment_status()
    if not status:
        sys.exit(1)

    target_domains = args.domains if args.domains else None

    success = mark_domains_active(status, target_domains)

    if success:
        print("\n🎯 Phase 5: SUCCESS - All eligible domains marked as ACTIVE")
        sys.exit(0)
    else:
        print("\n⚠️ Phase 5: PARTIAL SUCCESS - Some domains failed activation")
        sys.exit(1)

if __name__ == '__main__':
    main()
