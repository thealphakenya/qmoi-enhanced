#!/usr/bin/env python3
"""
Test script for QMOI Domain Auto-Validation System
Tests the enhanced Lion Agent domain monitoring functionality
"""

import asyncio
import json
import time
from datetime import datetime
import urllib.request
import urllib.error
import socket

class DomainValidator:
    def __init__(self):
        self.domains = [
            'qmoi.ai', 'stableq.ai', 'qvillage.com',
            'api.qmoi.com', 'auth.qmoi.com', 'cdn.qmoi.com', 'qcity.io', 'qvillage.org', 'qglobal.ai',
            'qvs.qmoi.ai', 'websphereelite.qmoi.com', 'hostmasternexus.qmoi.com',
            'qparallel.prod', 'web.qmoi.prod', 'test.qmoi.prod', 'production.qmoi.prod',
            'qmoi-space.qmoi.ai', 'q-stable.qmoi.ai', 'qshare.qmoi.ai', 'yap.qmoi.ai',
            'qstore.qmoi.ai', 'qvillage.qmoi.ai', 'qcity.qmoi.ai',
            'qglobal.qmoi.ai', 'qparallel.qmoi.ai', 'web.qmoi.ai', 'api.qmoi.ai', 'auth.qmoi.ai', 'cdn.qmoi.ai'
        ]

    def validate_domain(self, domain):
        """Validate a single domain"""
        validation = {
            'domain': domain,
            'dnsResolution': False,
            'sslCertificate': False,
            'accessibility': False,
            'responseTime': 0,
            'lastValidated': datetime.now().isoformat(),
            'health': 0
        }

        start_time = time.time()

        try:
            # DNS resolution check
            try:
                socket.gethostbyname(domain)
                validation['dnsResolution'] = True
            except socket.gaierror:
                validation['dnsResolution'] = False

            # SSL and accessibility check
            try:
                https_url = f"https://huggingface.co/spaces/qvillage/qvillage" if domain == 'huggingface.co' else f"https://{domain}"
                req = urllib.request.Request(https_url, method='HEAD')
                req.add_header('User-Agent', 'QMOI-Lion-Agent/1.0')
                with urllib.request.urlopen(req, timeout=10) as response:
                    validation['sslCertificate'] = response.getcode() == 200
                    validation['accessibility'] = response.getcode() == 200
            except urllib.error.URLError as e:
                validation['sslCertificate'] = False
                validation['accessibility'] = False
                print(f"SSL check failed for {domain}: {e}")

        except Exception as e:
            print(f"Error validating {domain}: {e}")

        validation['responseTime'] = (time.time() - start_time) * 1000

        # Calculate health
        health = 0
        if validation['dnsResolution']: health += 40
        if validation['sslCertificate']: health += 30
        if validation['accessibility']: health += 30
        validation['health'] = health

        return validation

    def validate_all_domains(self):
        """Validate all QMOI domains"""
        print("🦁 Testing QMOI Domain Auto-Validation System...")
        print(f"Validating {len(self.domains)} domains...")

        results = []

        for domain in self.domains:
            result = self.validate_domain(domain)
            results.append(result)
            print(f"✅ {domain}: {result['health']}% health")

        # Summary
        healthy_domains = [r for r in results if r['health'] >= 80]
        print(f"\n✅ Validation Complete!")
        print(f"Total domains: {len(self.domains)}")
        print(f"Validated: {len(results)}")
        print(f"Healthy (≥80%): {len(healthy_domains)}")

        # Save results
        with open('DOMAIN_VALIDATION_TEST_RESULTS.json', 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'totalDomains': len(self.domains),
                'validatedDomains': len(results),
                'healthyDomains': len(healthy_domains),
                'healthPercentage': (len(healthy_domains) / len(self.domains)) * 100,
                'results': results
            }, f, indent=2)

        print("📊 Results saved to DOMAIN_VALIDATION_TEST_RESULTS.json")

        return results

def main():
    validator = DomainValidator()
    validator.validate_all_domains()

if __name__ == "__main__":
    main()