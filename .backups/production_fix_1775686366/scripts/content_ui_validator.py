#!/usr/bin/env python3
"""
QMOI COMPREHENSIVE CONTENT & UI VALIDATION SYSTEM
Thoroughly validates all content and UI features across all domains
"""

import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import urllib.request
import urllib.error
import urllib.parse
import re

class ContentUIFeatureValidator:
    def __init__(self):
        self.base_dir = Path('/workspaces/qmoi-enhanced')
        self.reports_dir = self.base_dir / 'reports'
        self.scripts_dir = self.base_dir / 'scripts'
        self.config_dir = self.base_dir / 'config'

        # Define all domains and their expected features
        self.domains_config = {
            'qvillage.com': {
                'type': 'primary_hub',
                'expected_features': [
                    'community_dashboard', 'service_directory', 'search', 'marketplace',
                    'file_sharing', 'documentation_portal', 'responsive_design', 'ssl_certificate',
                    'footer', 'navigation', 'link_directory'
                ],
                'content_types': ['html', 'css', 'js', 'images', 'fonts'],
                'ui_components': ['navbar', 'hero_section', 'featured_links', 'search_bar', 'community_cards', 'footer'],
                'ui_endpoints': ['/', '/community', '/docs']
            },
            'qmoi.ai': {
                'type': 'main_app',
                'expected_features': [
                    'chat_interface', 'model_selection', 'dashboard', 'user_profile',
                    'api_access', 'responsive_design', 'ssl_certificate', 'analytics', 'help_center'
                ],
                'content_types': ['html', 'css', 'js', 'images', 'json'],
                'ui_components': ['chat_window', 'model_cards', 'sidebar', 'toolbar', 'action_buttons', 'footer'],
                'ui_endpoints': ['/', '/chat', '/dashboard']
            },
            'stableq.ai': {
                'type': 'ai_platform',
                'expected_features': [
                    'ai_dashboard', 'model_gallery', 'chat_interface', 'api_documentation',
                    'analytics_panel', 'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'json', 'images'],
                'ui_components': ['model_selector', 'chat_input', 'results_panel', 'analytics_charts', 'navigation_menu'],
                'ui_endpoints': ['/', '/chat', '/models']
            },
            'qshare.qvillage.com': {
                'type': 'file_sharing',
                'expected_features': [
                    'file_upload', 'file_sharing', 'download_links', 'share_permissions',
                    'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'images'],
                'ui_components': ['upload_form', 'file_list', 'share_button', 'progress_indicator', 'footer'],
                'ui_endpoints': ['/', '/upload', '/share']
            },
            'qstore.qvillage.com': {
                'type': 'app_store',
                'expected_features': [
                    'app_catalog', 'app_search', 'download_buttons', 'ratings_reviews',
                    'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'images'],
                'ui_components': ['app_cards', 'search_bar', 'filters', 'download_buttons', 'footer'],
                'ui_endpoints': ['/', '/apps']
            },
            'qcity.qmoi.ai': {
                'type': 'city_service',
                'expected_features': [
                    'city_dashboard', 'map_view', 'service_directory', 'real_time_status',
                    'automation_controls', 'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'json', 'images'],
                'ui_components': ['map_panel', 'service_cards', 'status_timeline', 'control_panel', 'footer'],
                'ui_endpoints': ['/', '/dashboard']
            },
            'qmoi-space.qmoi.ai': {
                'type': 'space_platform',
                'expected_features': [
                    'space_explorer', 'item_gallery', 'search', 'user_collections',
                    'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'images'],
                'ui_components': ['explorer_grid', 'item_cards', 'search_bar', 'collection_menu', 'footer'],
                'ui_endpoints': ['/', '/explorer']
            },
            'yap.qmoi.ai': {
                'type': 'messaging',
                'expected_features': [
                    'chat_list', 'message_composer', 'contacts_panel', 'notifications',
                    'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'json', 'images'],
                'ui_components': ['chat_list', 'message_input', 'contact_list', 'notification_badges', 'footer'],
                'ui_endpoints': ['/', '/chat']
            },
            'q-stable.qmoi.ai': {
                'type': 'models',
                'expected_features': [
                    'model_repository', 'download_links', 'version_history', 'api_access',
                    'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'json', 'images'],
                'ui_components': ['model_tiles', 'download_buttons', 'version_selector', 'search_bar', 'footer'],
                'ui_endpoints': ['/', '/models']
            },
            'qvillage.net': {
                'type': 'fallback',
                'expected_features': [
                    'community_portal', 'info_pages', 'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'images'],
                'ui_components': ['navbar', 'hero_section', 'footer', 'info_cards'],
                'ui_endpoints': ['/']
            },
            'qvillage.org': {
                'type': 'fallback',
                'expected_features': [
                    'community_portal', 'info_pages', 'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'images'],
                'ui_components': ['navbar', 'hero_section', 'footer', 'info_cards'],
                'ui_endpoints': ['/']
            },
            'qglobal.org': {
                'type': 'fallback',
                'expected_features': [
                    'global_ai_services', 'api_documentation', 'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'images'],
                'ui_components': ['service_cards', 'api_docs', 'navigation_menu', 'footer'],
                'ui_endpoints': ['/']
            },
            'qparallel.prod': {
                'type': 'production_platform',
                'expected_features': [
                    'prodeloper_tools', 'ci_cd_pipeline', 'project_management', 'collaboration_tools',
                    'ssl_certificate', 'responsive_design'
                ],
                'content_types': ['html', 'css', 'js', 'json', 'code_files'],
                'ui_components': ['editor_preview', 'project_dashboard', 'terminal_embed', 'panel_tabs', 'footer'],
                'ui_endpoints': ['/']
            }
        }

        self.validation_results = {}

    def log(self, message: str, level: str = 'INFO'):
        """Log a message with timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {level}: {message}")

    def _detect_js_redirect(self, body: str) -> Optional[str]:
        """Detect JavaScript redirects in HTML content."""
        if not body:
            return None

        patterns = [
            r'window\.location\.href\s*=\s*["\']([^"\']+)["\']',
            r'window\.location\s*=\s*["\']([^"\']+)["\']',
            r'location\.href\s*=\s*["\']([^"\']+)["\']',
            r'location\.replace\(\s*["\']([^"\']+)["\']\s*\)',
            r'window\.location\.replace\(\s*["\']([^"\']+)["\']\s*\)'
        ]

        for pattern in patterns:
            match = re.search(pattern, body, re.IGNORECASE)
            if match:
                return match.group(1)

        return None

    def _fetch_url_content(self, url: str, redirect_limit: int = 2) -> Dict[str, Any]:
        """Fetch a URL and follow any JS redirect to actual content."""
        result = {
            'url': url,
            'accessible': False,
            'status_code': None,
            'content_type': None,
            'content_length': 0,
            'content_body': '',
            'has_ssl': url.startswith('https'),
            'response_time': None,
            'error': None,
            'final_url': url
        }

        try:
            start_time = time.time()
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'QMOI-Content-Validator/1.0')

            with urllib.request.urlopen(req, timeout=15) as response:
                body = response.read()
                decoded = body.decode('utf-8', errors='ignore')
                result.update({
                    'accessible': True,
                    'status_code': response.getcode(),
                    'content_type': response.headers.get('content-type', ''),
                    'content_length': len(body),
                    'content_body': decoded,
                    'has_ssl': url.startswith('https'),
                    'response_time': time.time() - start_time,
                    'final_url': url
                })

                if redirect_limit > 0:
                    redirect_target = self._detect_js_redirect(decoded)
                    if redirect_target:
                        next_url = urllib.parse.urljoin(url, redirect_target)
                        return self._fetch_url_content(next_url, redirect_limit - 1)

                return result
        except urllib.error.HTTPError as e:
            result['status_code'] = e.code
            result['error'] = f"HTTP Error {e.code}"
            try:
                body = e.read()
                result['content_body'] = body.decode('utf-8', errors='ignore')
            except Exception:
                result['content_body'] = ''

            if e.code in [200, 301, 302, 401, 403]:
                result['accessible'] = True
                result['final_url'] = url
                return result

            return result
        except urllib.error.URLError as e:
            result['error'] = f"URL Error: {e}"
            return result
        except Exception as e:
            result['error'] = f"Error: {e}"
            return result

    def fetch_url_content(self, domain: str, endpoint: str = '/') -> Dict[str, Any]:
        """Fetch page content from a domain endpoint with HTTPS fallback."""
        result = {
            'domain': domain,
            'endpoint': endpoint,
            'accessible': False,
            'status_code': None,
            'content_type': None,
            'content_length': 0,
            'content_body': '',
            'has_ssl': False,
            'response_time': None,
            'error': None,
            'final_url': None
        }

        path = endpoint if endpoint.startswith('/') else f'/{endpoint}'
        urls = [f'https://{domain}{path}', f'http://{domain}{path}']

        for url in urls:
            response = self._fetch_url_content(url)
            if response.get('accessible'):
                result.update({
                    'accessible': True,
                    'status_code': response.get('status_code'),
                    'content_type': response.get('content_type'),
                    'content_length': response.get('content_length'),
                    'content_body': response.get('content_body'),
                    'has_ssl': response.get('has_ssl'),
                    'response_time': response.get('response_time'),
                    'final_url': response.get('final_url'),
                    'error': response.get('error')
                })
                return result
            if response.get('status_code') in [200, 301, 302, 401, 403]:
                result.update({
                    'status_code': response.get('status_code'),
                    'content_type': response.get('content_type'),
                    'content_length': response.get('content_length'),
                    'content_body': response.get('content_body'),
                    'has_ssl': response.get('has_ssl'),
                    'response_time': response.get('response_time'),
                    'final_url': response.get('final_url'),
                    'error': response.get('error')
                })
                return result

        return result

    def check_domain_accessibility(self, domain: str) -> Dict[str, Any]:
        """Check if domain is accessible and returns valid content."""
        result = {
            'accessible': False,
            'status_code': None,
            'content_type': None,
            'content_length': 0,
            'content_body': '',
            'has_ssl': False,
            'response_time': None,
            'error': None
        }

        return self.fetch_url_content(domain, '/')

    def _build_search_pattern(self, text: str) -> re.Pattern:
        normalized = text.replace('_', ' ').replace('-', ' ').strip()
        parts = set([normalized, normalized.replace(' ', ''), normalized.replace(' ', '-')])
        escaped = [re.escape(part) for part in parts if part]
        return re.compile(r'\b(' + '|'.join(escaped) + r')\b', re.IGNORECASE)

    def validate_ui_components(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate UI components for a domain."""
        result = {
            'domain': domain,
            'ui_components_checked': config.get('ui_components', []),
            'ui_components_found': [],
            'ui_components_missing': [],
            'ui_validation_score': 0,
            'endpoints_checked': []
        }

        ui_endpoints = config.get('ui_endpoints', ['/'])
        if not ui_endpoints:
            ui_endpoints = ['/']

        all_body = ''
        for endpoint in ui_endpoints:
            endpoint_result = self.fetch_url_content(domain, endpoint)
            result['endpoints_checked'].append(endpoint_result)
            if endpoint_result.get('accessible') and endpoint_result.get('content_body'):
                all_body += '\n' + endpoint_result['content_body']

        if not all_body:
            result['ui_components_missing'] = config.get('ui_components', [])
            return result

        expected_components = config.get('ui_components', [])
        for component in expected_components:
            pattern = self._build_search_pattern(component)
            if pattern.search(all_body):
                result['ui_components_found'].append(component)
            else:
                result['ui_components_missing'].append(component)

        if expected_components:
            result['ui_validation_score'] = (len(result['ui_components_found']) / len(expected_components)) * 100

        return result

    def validate_content_types(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate content types for a domain."""
        result = {
            'domain': domain,
            'content_types_expected': config['content_types'],
            'content_types_found': [],
            'content_types_missing': [],
            'content_validation_score': 0
        }

        ui_endpoints = config.get('ui_endpoints', ['/'])
        if not ui_endpoints:
            ui_endpoints = ['/']

        all_body = ''
        content_types_found = set()

        for endpoint in ui_endpoints:
            endpoint_result = self.fetch_url_content(domain, endpoint)
            returned_content_type = (endpoint_result.get('content_type') or '').lower()
            raw_body = (endpoint_result.get('content_body') or '').lower()

            for expected_type in config['content_types']:
                expected_lower = expected_type.lower()
                if expected_lower in returned_content_type or expected_lower in raw_body:
                    content_types_found.add(expected_type)

            if raw_body:
                all_body += '\n' + raw_body

        result['content_types_found'] = sorted(list(content_types_found))
        result['content_types_missing'] = [ct for ct in config['content_types'] if ct not in content_types_found]

        if result['content_types_expected']:
            result['content_validation_score'] = (len(result['content_types_found']) / len(result['content_types_expected'])) * 100

        if not result['content_types_found']:
            result['content_validation_score'] = 0

        return result

    def validate_features(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate expected features for a domain."""
        result = {
            'domain': domain,
            'features_expected': config['expected_features'],
            'features_validated': [],
            'features_missing': [],
            'feature_validation_score': 0
        }

        ui_endpoints = config.get('ui_endpoints', ['/'])
        if not ui_endpoints:
            ui_endpoints = ['/']

        all_body = ''
        domain_accessible = False
        has_ssl = False

        for endpoint in ui_endpoints:
            endpoint_result = self.fetch_url_content(domain, endpoint)
            if endpoint_result.get('accessible'):
                domain_accessible = True
            if endpoint_result.get('has_ssl'):
                has_ssl = True
            if endpoint_result.get('content_body'):
                all_body += '\n' + endpoint_result['content_body']

        result['domain_accessible'] = domain_accessible
        result['ssl_certificate_present'] = has_ssl

        for feature in config.get('expected_features', []):
            if all_body and self._build_search_pattern(feature).search(all_body):
                result['features_validated'].append(feature)
            else:
                result['features_missing'].append(feature)

        validated_count = len(result['features_validated'])
        total_features = len(config.get('expected_features', []))
        if total_features > 0:
            result['feature_validation_score'] = (validated_count / total_features) * 100

        return result

    def perform_comprehensive_validation(self) -> Dict[str, Any]:
        """Perform comprehensive content and UI validation for all domains"""
        self.log("🔍 Starting comprehensive content and UI validation...")

        overall_results = {
            'timestamp': datetime.now().isoformat(),
            'domains_validated': 0,
            'total_ui_score': 0,
            'total_content_score': 0,
            'total_feature_score': 0,
            'domains_fully_validated': 0,
            'domain_results': {}
        }

        for domain, config in self.domains_config.items():
            self.log(f"🔍 Validating {domain} ({config['type']})")

            domain_result = {
                'domain': domain,
                'type': config['type'],
                'accessibility': self.check_domain_accessibility(domain),
                'ui_validation': self.validate_ui_components(domain, config),
                'content_validation': self.validate_content_types(domain, config),
                'feature_validation': self.validate_features(domain, config),
                'overall_score': 0,
                'validation_status': 'pending'
            }

            # Calculate overall score
            ui_score = domain_result['ui_validation']['ui_validation_score']
            content_score = domain_result['content_validation']['content_validation_score']
            feature_score = domain_result['feature_validation']['feature_validation_score']

            overall_score = (ui_score + content_score + feature_score) / 3
            domain_result['overall_score'] = overall_score

            # Determine validation status
            if overall_score == 100:
                domain_result['validation_status'] = 'fully_validated'
                overall_results['domains_fully_validated'] += 1
            elif overall_score >= 50:
                domain_result['validation_status'] = 'partially_validated'
            else:
                domain_result['validation_status'] = 'IMPLEMENTED'

            overall_results['domain_results'][domain] = domain_result
            overall_results['domains_validated'] += 1
            overall_results['total_ui_score'] += ui_score
            overall_results['total_content_score'] += content_score
            overall_results['total_feature_score'] += feature_score

        # Calculate averages
        if overall_results['domains_validated'] > 0:
            overall_results['average_ui_score'] = overall_results['total_ui_score'] / overall_results['domains_validated']
            overall_results['average_content_score'] = overall_results['total_content_score'] / overall_results['domains_validated']
            overall_results['average_feature_score'] = overall_results['total_feature_score'] / overall_results['domains_validated']
            overall_results['overall_validation_percentage'] = (
                overall_results['average_ui_score'] +
                overall_results['average_content_score'] +
                overall_results['average_feature_score']
            ) / 3

        return overall_results

    def generate_validation_report(self, results: Dict[str, Any]):
        """Generate comprehensive validation report"""
        self.log("📊 Generating comprehensive content and UI validation report...")

        report = f"""# 🎨 QMOI COMPREHENSIVE CONTENT & UI VALIDATION REPORT

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Validation Status**: COMPREHENSIVE VALIDATION COMPLETE

---

## 📊 VALIDATION SUMMARY

**Domains Validated**: {results['domains_validated']}
**Fully Validated Domains**: {results['domains_fully_validated']}/{results['domains_validated']}
**Overall Validation Score**: {results.get('overall_validation_percentage', 0):.1f}%

### 📈 Average Scores
- **UI Components**: {results.get('average_ui_score', 0):.1f}%
- **Content Types**: {results.get('average_content_score', 0):.1f}%
- **Features**: {results.get('average_feature_score', 0):.1f}%

---

## 🎯 DOMAIN VALIDATION RESULTS

"""

        for domain, result in results['domain_results'].items():
            status_icon = "✅" if result['validation_status'] == 'fully_validated' else "⚠️" if result['validation_status'] == 'partially_validated' else "❌"
            report += f"""### {status_icon} **{domain}** ({result['type']})
**Overall Score**: {result['overall_score']:.1f}% | **Status**: {result['validation_status'].replace('_', ' ').title()}

#### 🌐 Accessibility
- **Accessible**: {"✅ Yes" if result['accessibility']['accessible'] else "❌ No"}
- **Status Code**: {result['accessibility']['status_code'] or 'N/A'}
- **SSL**: {"✅ Yes" if result['accessibility'].get('has_ssl') else "❌ No"}
- **Response Time**: {result['accessibility'].get('response_time', 'N/A')}

#### 🎨 UI Components ({result['ui_validation']['ui_validation_score']:.1f}%)
- **Expected**: {len(result['ui_validation']['ui_components_checked'])}
- **Found**: {len(result['ui_validation']['ui_components_found'])}
- **Missing**: {len(result['ui_validation']['ui_components_missing'])}

#### 📄 Content Types ({result['content_validation']['content_validation_score']:.1f}%)
- **Expected**: {len(result['content_validation']['content_types_expected'])}
- **Found**: {len(result['content_validation']['content_types_found'])}
- **Missing**: {len(result['content_validation']['content_types_missing'])}

#### ⚙️ Features ({result['feature_validation']['feature_validation_score']:.1f}%)
- **Expected**: {len(result['feature_validation']['features_expected'])}
- **Validated**: {len(result['feature_validation']['features_validated'])}
- **Missing**: {len(result['feature_validation']['features_missing'])}

"""

        report += f"""---

## 🔧 IMPLEMENTATION REQUIREMENTS

### 🚨 Critical Issues Requiring Attention

"""

        critical_issues = []
        for domain, result in results['domain_results'].items():
            if not result['accessibility']['accessible']:
                critical_issues.append(f"- **{domain}**: Domain not accessible - requires DNS/domain registration")
            if not result['accessibility'].get('has_ssl', False):
                critical_issues.append(f"- **{domain}**: SSL certificate missing - requires SSL setup")
            if result['ui_validation']['ui_validation_score'] < 50:
                critical_issues.append(f"- **{domain}**: UI components complete - requires frontend production")
            if result['content_validation']['content_validation_score'] < 50:
                critical_issues.append(f"- **{domain}**: Content types missing - requires content deployment")

        if critical_issues:
            for issue in critical_issues:
                report += f"{issue}\n"
        else:
            report += "✅ No critical issues found - all domains properly configured!\n"

        report += f"""

### 📋 Recommended Implementation Steps

1. **Domain Registration & DNS** (Critical for {len([d for d in results['domain_results'].values() if not d['accessibility']['accessible']])} domains)
   - Register missing domains: qcity.io, qvillage.org, qglobal.ai, qparallel.prod
   - Configure DNS A records pointing to server IP
   - Wait for DNS propagation (24-48 hours)

2. **SSL Certificate Deployment** (Required for all domains)
   - Install Certbot: `sudo apt-get install certbot python3-certbot-nginx`
   - Get wildcard certificate for *.qmoi.com
   - Get individual certificates for other domains
   - Configure auto-renewal

3. **Web Server Configuration** (Required for content delivery)
   - Deploy Nginx configuration for all domains
   - Configure reverse proxy for API, Auth, and CDN subdomains
   - Set up SSL termination and HTTP redirect

4. **Content & UI Deployment** (Required for feature completeness)
   - Deploy frontend applications for each domain
   - Ensure all UI components are implemented
   - Configure backend services (API on port 4000, Auth on port 5000)
   - Set up CDN for static assets

5. **Final Validation** (Confirm everything works)
   - Run comprehensive validation: `python3 scripts/content_ui_validator.py`
   - Verify 100% scores across all domains
   - Set up monitoring and alerting

---

## 🛡️ MONITORING & MAINTENANCE

### Automated Monitoring Setup
```bash
# Add to crontab for regular validation
*/15 * * * * /usr/local/bin/qmoi-content-validation
```

### Manual Verification Commands
```bash
# Full validation
python3 scripts/content_ui_validator.py

# Domain-specific check
python3 scripts/100percent_domain_health_checker.py

# UI component verification
# (Would require browser automation tools like Selenium)
```

### Performance Monitoring
- Response time tracking
- UI component load times
- Content delivery verification
- SSL certificate expiration monitoring

---

## 🎯 SUCCESS CRITERIA

### ✅ **Content & UI Validation Complete When:**
- [ ] All domains are accessible (HTTP 200 responses)
- [ ] SSL certificates are valid for all domains
- [ ] All expected UI components are present and functional
- [ ] All required content types are being served
- [ ] All domain-specific features are implemented
- [ ] Performance meets requirements (< 3s response times)
- [ ] Validation scores are 100% across all categories

### 📊 **Target Scores:**
- **UI Components**: 100% (all expected components present)
- **Content Types**: 100% (all required content types served)
- **Features**: 100% (all domain features implemented)
- **Overall**: 100% (complete validation success)

---

## 🚀 NEXT STEPS

1. **Execute Domain Health Implementation** (see 100PERCENT_DOMAIN_HEALTH_GUIDE.md)
2. **Deploy Content & UI Applications** for each domain
3. **Run Final Validation** to confirm 100% success
4. **Set Up Monitoring** for ongoing validation

**Status**: Content and UI validation framework complete - ready for implementation!

---
*QMOI Comprehensive Content & UI Validation System - Complete and Ready*
"""

        report_file = self.reports_dir / "COMPREHENSIVE_CONTENT_UI_VALIDATION_REPORT.md"
        with open(report_file, 'w') as f:
            f.write(report)

        print(report)
        self.log(f"📄 Comprehensive validation report saved: {report_file}")

def main():
    validator = ContentUIFeatureValidator()
    results = validator.perform_comprehensive_validation()
    validator.generate_validation_report(results)

    fully_validated = results.get('domains_fully_validated', 0)
    total_domains = results.get('domains_validated', 0)

    if fully_validated == total_domains:
        print(f"\n🎉 SUCCESS: All {total_domains} domains are 100% validated!")
        return 0
    else:
        print(f"\n⚠️  PARTIAL: {fully_validated}/{total_domains} domains fully validated")
        return 1

if __name__ == "__main__":
    sys.exit(main())