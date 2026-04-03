#!/usr/bin/env python3
"""
COMPREHENSIVE DOMAIN HEALTH & UI VALIDATION SYSTEM
Validates all QMOI domains with 100% health checks, DNS resolution, HTTP status,
SSL certificates, and actual UI feature testing.
"""

import json
import sys
import os
import socket
import ssl
import time
import subprocess
from pathlib import Path
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import URLError
import asyncio
import concurrent.futures

class DomainHealthValidator:
    def __init__(self):
        self.domains = self.load_domains_from_readme()
        self.results = {}
        self.timestamp = datetime.now().isoformat()
        self.ui_test_results = {}
        
    def load_domains_from_readme(self):
        """Extract all domains from README.md"""
        domains = {}
        try:
            with open('README.md', 'r') as f:
                content = f.read()
                
            # Extract domains from various URL patterns
            import re
            
            # Pattern 1: [domain_name](https://domain.com)
            pattern1 = r'\[([^\]]+)\]\(https?://([^\)]+)\)'
            matches1 = re.findall(pattern1, content)
            
            # Pattern 2: Direct URLs in markdown
            pattern2 = r'https?://([a-zA-Z0-9\-\.]+\.[a-zA-Z0-9\-\.]+)'
            matches2 = re.findall(pattern2, content)
            
            for name, url in matches1:
                domains[url] = {'name': name, 'type': 'primary'}
                
            for url in matches2:
                if url not in domains:
                    domains[url] = {'name': url, 'type': 'service'}
            
            return domains
        except Exception as e:
            print(f"❌ Error loading domains: {e}")
            # Fallback to hardcoded critical domains
            return self.get_critical_domains()
    
    @staticmethod
    def get_critical_domains():
        """Critical domains that must always be healthy"""
        return {
            'qmoi.ai': {'name': 'QMOI AI', 'type': 'primary'},
            'stableq.ai': {'name': 'Latest Q', 'type': 'primary'},
            'qvillage.com': {'name': 'QVillage', 'type': 'primary'},
            'api.qmoi.com': {'name': 'API Gateway', 'type': 'service'},
            'auth.qmoi.com': {'name': 'Auth Service', 'type': 'service'},
            'cdn.qmoi.com': {'name': 'CDN', 'type': 'service'},
            'qcity.io': {'name': 'QCity', 'type': 'service'},
            'qvillage.org': {'name': 'QVillage Org', 'type': 'service'},
            'qglobal.ai': {'name': 'Q Global', 'type': 'service'},
            'status.qmoi.ai': {'name': 'Status Page', 'type': 'app'},
        }
    
    def check_dns_resolution(self, domain):
        """Check if domain resolves via DNS"""
        try:
            ip = socket.gethostbyname(domain)
            return {
                'success': True,
                'ip': ip,
                'message': f'DNS resolved to {ip}'
            }
        except socket.gaierror as e:
            return {
                'success': False,
                'ip': None,
                'message': f'DNS resolution failed: {e}'
            }
    
    def check_ssl_certificate(self, domain):
        """Validate SSL certificate"""
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    return {
                        'success': True,
                        'valid': True,
                        'subject': cert.get('subject', 'N/A'),
                        'message': 'SSL certificate valid'
                    }
        except Exception as e:
            return {
                'success': False,
                'valid': False,
                'message': f'SSL check failed: {e}'
            }
    
    def check_http_status(self, domain, timeout=10):
        """Check HTTP status and response headers"""
        try:
            url = f'https://{domain}/'
            headers = {
                'User-Agent': 'QMOI-Health-Check/1.0 (+http://qmoi.ai/healthcheck)'
            }
            req = Request(url, headers=headers)
            
            with urlopen(req, timeout=timeout) as response:
                return {
                    'success': True,
                    'status_code': response.status,
                    'content_type': response.headers.get('Content-Type', 'N/A'),
                    'content_length': response.headers.get('Content-Length', 'unknown'),
                    'server': response.headers.get('Server', 'unknown'),
                    'has_content': len(response.read()) > 0,
                    'message': f'HTTP {response.status} OK'
                }
        except URLError as e:
            return {
                'success': False,
                'status_code': 0,
                'message': f'HTTP check failed: {e}'
            }
    
    def check_domain_active_status(self, domain):
        """Verify domain is not parked"""
        try:
            url = f'https://{domain}/'
            req = Request(url)
            with urlopen(req, timeout=5) as response:
                content = response.read().decode('utf-8', errors='ignore')
                
                # Check for common parked domain indicators
                parked_keywords = [
                    'parked',
                    'domain for sale',
                    'coming soon',
                    'under construction',
                    'no content',
                    'empty domain',
                ]
                
                is_parked = any(keyword.lower() in content.lower() for keyword in parked_keywords)
                
                # Check for actual content
                has_real_content = len(content) > 500 and '<html' in content.lower()
                
                return {
                    'is_active': has_real_content and not is_parked,
                    'is_parked': is_parked,
                    'content_size': len(content),
                    'has_html': '<html' in content.lower(),
                    'message': 'Domain is active with real content' if has_real_content else 'Domain may be parked or empty'
                }
        except Exception as e:
            return {
                'is_active': False,
                'is_parked': False,
                'message': f'Could not verify active status: {e}'
            }
    
    def check_ui_features(self, domain):
        """Test actual UI features for the domain"""
        features = {
            'has_responsive_design': False,
            'has_navigation': False,
            'has_forms': False,
            'has_api_endpoints': False,
            'has_authentication': False,
            'has_dashboard': False,
            'has_real_time_updates': False,
        }
        
        try:
            url = f'https://{domain}/'
            req = Request(url)
            with urlopen(req, timeout=10) as response:
                content = response.read().decode('utf-8', errors='ignore').lower()
                
                # Check for UI features
                features['has_responsive_design'] = 'viewport' in content or 'media' in content
                features['has_navigation'] = 'nav' in content or 'menu' in content
                features['has_forms'] = '<form' in content or 'input' in content
                features['has_api_endpoints'] = 'api' in content or '/api/' in content
                features['has_authentication'] = 'login' in content or 'auth' in content or 'signin' in content
                features['has_dashboard'] = 'dashboard' in content or 'panel' in content
                features['has_real_time_updates'] = 'websocket' in content or 'realtime' in content or 'socket.io' in content
                
                active_features = sum(1 for v in features.values() if v)
                
                return {
                    'features': features,
                    'active_features_count': active_features,
                    'total_features': len(features),
                    'feature_coverage': (active_features / len(features)) * 100
                }
        except Exception as e:
            return {
                'features': features,
                'active_features_count': 0,
                'error': str(e)
            }
    
    def perform_comprehensive_health_check(self, domain):
        """Perform complete health check on domain"""
        domain_info = self.domains.get(domain, {'name': domain, 'type': 'unknown'})
        
        print(f"  ⏳ Checking {domain}...", end='', flush=True)
        
        results = {
            'domain': domain,
            'name': domain_info['name'],
            'type': domain_info.get('type', 'unknown'),
            'timestamp': datetime.now().isoformat(),
            'checks': {
                'dns': self.check_dns_resolution(domain),
                'ssl': self.check_ssl_certificate(domain),
                'http': self.check_http_status(domain),
                'active_status': self.check_domain_active_status(domain),
                'ui_features': self.check_ui_features(domain),
            }
        }
        
        # Calculate health score
        health_score = self.calculate_health_score(results)
        results['health_score'] = health_score['score']
        results['health_percentage'] = health_score['percentage']
        results['overall_healthy'] = health_score['percentage'] >= 95
        results['issues'] = health_score['issues']
        
        print(f"\r  {'✅' if results['overall_healthy'] else '⚠️ '} {domain}: {results['health_percentage']:.1f}%")
        
        return results
    
    def calculate_health_score(self, results):
        """Calculate overall health score"""
        checks = results['checks']
        issues = []
        score = 100
        
        # DNS check (20%)
        if not checks['dns'].get('success', False):
            score -= 20
            issues.append('DNS resolution failed')
        
        # SSL check (20%)
        if not checks['ssl'].get('success', False):
            score -= 20
            issues.append('SSL certificate invalid')
        
        # HTTP check (20%)
        if not checks['http'].get('success', False):
            score -= 20
            issues.append('HTTP endpoint not responding')
        
        # Active status check (20%)
        if not checks['active_status'].get('is_active', False):
            score -= 20
            issues.append('Domain may be parked or lacks content')
        
        # UI features check (20%)
        ui_coverage = checks['ui_features'].get('feature_coverage', 0)
        if ui_coverage < 50:
            score -= 20
            issues.append(f'Low UI feature coverage ({ui_coverage:.0f}%)')
        elif ui_coverage < 75:
            score -= 10
            issues.append(f'Medium UI feature coverage ({ui_coverage:.0f}%)')
        
        return {
            'score': max(0, score),
            'percentage': max(0, score),
            'issues': issues
        }
    
    def validate_all_domains(self):
        """Validate all domains with parallel processing"""
        print("\n🌐 COMPREHENSIVE DOMAIN HEALTH & UI VALIDATION")
        print("=" * 60)
        print(f"📍 Scanning {len(self.domains)} domains...")
        print("=" * 60 + "\n")
        
        healthy_count = 0
        active_count = 0
        total_domains = len(self.domains)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = {
                executor.submit(self.perform_comprehensive_health_check, domain): domain
                for domain in self.domains.keys()
            }
            
            for future in concurrent.futures.as_completed(futures):
                try:
                    result = future.result()
                    self.results[result['domain']] = result
                    
                    if result['overall_healthy']:
                        healthy_count += 1
                    if result['checks']['active_status'].get('is_active', False):
                        active_count += 1
                except Exception as e:
                    print(f"  ❌ Error checking domain: {e}")
        
        # Generate reports
        overall_health = (healthy_count / total_domains) * 100
        active_percentage = (active_count / total_domains) * 100
        
        print("\n" + "=" * 60)
        print("📊 HEALTH SUMMARY")
        print("=" * 60)
        print(f"✅ Healthy Domains: {healthy_count}/{total_domains} ({overall_health:.1f}%)")
        print(f"🟢 Active Domains: {active_count}/{total_domains} ({active_percentage:.1f}%)")
        
        # Show issues
        if healthy_count < total_domains:
            print("\n⚠️  ISSUES DETECTED:")
            for domain, result in self.results.items():
                if not result['overall_healthy']:
                    print(f"\n  🔴 {domain} ({result['health_percentage']:.1f}%)")
                    for issue in result.get('issues', []):
                        print(f"     • {issue}")
        
        print("\n" + "=" * 60)
        
        return {
            'timestamp': self.timestamp,
            'total_domains': total_domains,
            'healthy_domains': healthy_count,
            'active_domains': active_count,
            'overall_health_percentage': overall_health,
            'active_percentage': active_percentage,
            'all_healthy': overall_health == 100,
            'all_active': active_percentage == 100,
            'detailed_results': self.results
        }
    
    def save_results(self, filepath='docs/domain_health_report.json'):
        """Save health check results"""
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"✅ Report saved to {filepath}")
    
    def generate_markdown_summary(self):
        """Generate markdown summary for README"""
        healthy_domains = sum(1 for r in self.results.values() if r.get('overall_healthy', False))
        active_domains = sum(1 for r in self.results.values() 
                           if r.get('checks', {}).get('active_status', {}).get('is_active', False))
        total_domains = len(self.results)
        
        markdown = f"""## 🌐 Domain Health & UI Status (Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')})

**Overall Health: {(healthy_domains/total_domains)*100:.1f}%** | **Active: {(active_domains/total_domains)*100:.1f}%**

| Domain | Health | DNS | SSL | HTTP | Active | UI Features |
|--------|--------|-----|-----|------|--------|-------------|
"""
        
        for domain in sorted(self.results.keys()):
            result = self.results[domain]
            checks = result.get('checks', {})
            
            dns_status = "✅" if checks.get('dns', {}).get('success') else "❌"
            ssl_status = "✅" if checks.get('ssl', {}).get('success') else "❌"
            http_status = "✅" if checks.get('http', {}).get('success') else "❌"
            active_status = "🟢" if checks.get('active_status', {}).get('is_active') else "🔴"
            ui_features = result.get('health_percentage', 0)
            health_pct = result.get('health_percentage', 0)
            
            markdown += f"| {domain} | {health_pct:.0f}% | {dns_status} | {ssl_status} | {http_status} | {active_status} | {ui_features:.0f}% |\n"
        
        return markdown


def main():
    validator = DomainHealthValidator()
    summary = validator.validate_all_domains()
    validator.save_results()
    
    # Print markdown summary
    markdown_summary = validator.generate_markdown_summary()
    print("\n" + markdown_summary)
    
    # Save markdown summary
    Path('docs/domain_health_markdown.md').parent.mkdir(parents=True, exist_ok=True)
    with open('docs/domain_health_markdown.md', 'w') as f:
        f.write(markdown_summary)
    
    # Exit with status
    return 0 if summary['all_healthy'] and summary['all_active'] else 1


if __name__ == '__main__':
    sys.exit(main())
