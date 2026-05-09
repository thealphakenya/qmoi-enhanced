#!/usr/bin/env python3
"""
scripts/content_ui_validator.py

QMOI Comprehensive Content & UI Validation System
Thoroughly validates all content and UI features across all domains
"""

import json
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import urllib.request
import urllib.error
import urllib.parse
import re
import shutil

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('content_ui_validator.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class ContentUIFeatureValidator:
    """
    Comprehensive validator for content and UI features across all QMOI domains
    """

    def __init__(self) -> None:
        self.base_dir = Path('/workspaces/qmoi-enhanced')
        self.reports_dir = self.base_dir / 'reports'
        self.scripts_dir = self.base_dir / 'scripts'
        self.config_dir = self.base_dir / 'config'

        # Ensure directories exist
        self.reports_dir.mkdir(parents=True, exist_ok=True)

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
                    'ssl_certificate', 'responsive_design', 'navigation', 'footer'
                ],
                'content_types': ['html', 'css', 'js', 'images', 'json'],
                'ui_components': ['city_map', 'service_cards', 'status_indicators', 'navigation_menu', 'footer'],
                'ui_endpoints': ['/', '/map', '/services']
            }
        }

        self.validation_results = {}

    def validate_all_domains(self) -> Dict[str, Any]:
        """Validate all configured domains comprehensively"""
        logger.info("🔍 Starting comprehensive content & UI validation...")

        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'domains_validated': [],
            'overall_status': 'unknown',
            'summary': {
                'total_domains': len(self.domains_config),
                'domains_passed': 0,
                'domains_failed': 0,
                'domains_warning': 0
            },
            'details': {}
        }

        for domain, config in self.domains_config.items():
            logger.info(f"🔍 Validating domain: {domain}")
            domain_result = self._validate_domain(domain, config)
            results['domains_validated'].append(domain)
            results['details'][domain] = domain_result

            # Update summary
            if domain_result['status'] == 'passed':
                results['summary']['domains_passed'] += 1
            elif domain_result['status'] == 'failed':
                results['summary']['domains_failed'] += 1
            else:
                results['summary']['domains_warning'] += 1

        # Determine overall status
        if results['summary']['domains_failed'] > 0:
            results['overall_status'] = 'failed'
        elif results['summary']['domains_warning'] > 0:
            results['overall_status'] = 'warning'
        else:
            results['overall_status'] = 'passed'

        self.validation_results = results
        return results

    def _validate_domain(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a single domain's content and UI features"""
        result = {
            'domain': domain,
            'type': config['type'],
            'status': 'unknown',
            'validations': {},
            'issues': [],
            'recommendations': []
        }

        # 1. Validate content types
        result['validations']['content_types'] = self._validate_content_types(domain, config)

        # 2. Validate UI components
        result['validations']['ui_components'] = self._validate_ui_components(domain, config)

        # 3. Validate endpoints
        result['validations']['endpoints'] = self._validate_endpoints(domain, config)

        # 4. Validate features
        result['validations']['features'] = self._validate_features(domain, config)

        # 5. Validate SSL/security
        result['validations']['security'] = self._validate_security(domain, config)

        # Determine domain status
        all_passed = all(v.get('status') == 'passed' for v in result['validations'].values())
        any_failed = any(v.get('status') == 'failed' for v in result['validations'].values())

        if all_passed:
            result['status'] = 'passed'
        elif any_failed:
            result['status'] = 'failed'
        else:
            result['status'] = 'warning'

        # Generate recommendations
        result['recommendations'] = self._generate_domain_recommendations(result)

        return result

    def _validate_content_types(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate content types for a domain"""
        result = {
            'status': 'unknown',
            'expected_types': config['content_types'],
            'found_types': [],
            'missing_types': [],
            'issues': []
        }

        # Check for content files in the project
        domain_content_dir = self.base_dir / 'public' / domain.replace('.', '_')
        if domain_content_dir.exists():
            found_extensions = set()
            for file_path in domain_content_dir.rglob('*'):
                if file_path.is_file():
                    found_extensions.add(file_path.suffix.lower())

            result['found_types'] = list(found_extensions)

            # Check for expected types
            for expected_type in config['content_types']:
                if expected_type == 'html':
                    if not any(ext in ['.html', '.htm'] for ext in found_extensions):
                        result['missing_types'].append(expected_type)
                elif expected_type == 'css':
                    if '.css' not in found_extensions:
                        result['missing_types'].append(expected_type)
                elif expected_type == 'js':
                    if not any(ext in ['.js', '.jsx', '.ts', '.tsx'] for ext in found_extensions):
                        result['missing_types'].append(expected_type)
                elif expected_type == 'images':
                    if not any(ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'] for ext in found_extensions):
                        result['missing_types'].append(expected_type)
                elif expected_type == 'fonts':
                    if not any(ext in ['.woff', '.woff2', '.ttf', '.otf'] for ext in found_extensions):
                        result['missing_types'].append(expected_type)
                elif expected_type == 'json':
                    if '.json' not in found_extensions:
                        result['missing_types'].append(expected_type)

        result['status'] = 'passed' if not result['missing_types'] else 'warning'
        return result

    def _validate_ui_components(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate UI components for a domain"""
        result = {
            'status': 'unknown',
            'expected_components': config['ui_components'],
            'found_components': [],
            'missing_components': [],
            'issues': []
        }

        # Check for UI component files
        components_dir = self.base_dir / 'components' / domain.replace('.', '_')
        src_components_dir = self.base_dir / 'src' / 'components' / domain.replace('.', '_')

        component_files = []
        if components_dir.exists():
            component_files.extend(list(components_dir.rglob('*.tsx')))
            component_files.extend(list(components_dir.rglob('*.ts')))
            component_files.extend(list(components_dir.rglob('*.jsx')))
            component_files.extend(list(components_dir.rglob('*.js')))

        if src_components_dir.exists():
            component_files.extend(list(src_components_dir.rglob('*.tsx')))
            component_files.extend(list(src_components_dir.rglob('*.ts')))
            component_files.extend(list(src_components_dir.rglob('*.jsx')))
            component_files.extend(list(src_components_dir.rglob('*.js')))

        # Extract component names from files
        found_components = set()
        for file_path in component_files:
            component_name = file_path.stem.lower()
            found_components.add(component_name)

        result['found_components'] = list(found_components)

        # Check for expected components
        for expected in config['ui_components']:
            expected_lower = expected.lower().replace('_', '')
            found = any(expected_lower in comp.lower().replace('_', '') for comp in found_components)
            if not found:
                result['missing_components'].append(expected)

        result['status'] = 'passed' if not result['missing_components'] else 'warning'
        return result

    def _validate_endpoints(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate endpoints for a domain"""
        result = {
            'status': 'unknown',
            'expected_endpoints': config['ui_endpoints'],
            'found_endpoints': [],
            'missing_endpoints': [],
            'issues': []
        }

        # Check for page files
        pages_dir = self.base_dir / 'pages' / domain.replace('.', '_')
        app_dir = self.base_dir / 'app' / domain.replace('.', '_')

        endpoint_files = []
        if pages_dir.exists():
            endpoint_files.extend(list(pages_dir.rglob('*.tsx')))
            endpoint_files.extend(list(pages_dir.rglob('*.ts')))
            endpoint_files.extend(list(pages_dir.rglob('*.jsx')))
            endpoint_files.extend(list(pages_dir.rglob('*.js')))

        if app_dir.exists():
            endpoint_files.extend(list(app_dir.rglob('page.tsx')))
            endpoint_files.extend(list(app_dir.rglob('page.ts')))
            endpoint_files.extend(list(app_dir.rglob('page.jsx')))
            endpoint_files.extend(list(app_dir.rglob('page.js')))

        # Extract endpoint paths
        found_endpoints = set()
        for file_path in endpoint_files:
            if 'pages' in str(file_path):
                # Pages router
                relative_path = file_path.relative_to(pages_dir)
                endpoint = '/' + str(relative_path).replace('\\', '/').replace('index.tsx', '').replace('index.ts', '').replace('index.jsx', '').replace('index.js', '')
                endpoint = endpoint.rstrip('/')
                if not endpoint:
                    endpoint = '/'
                found_endpoints.add(endpoint)
            else:
                # App router
                relative_path = file_path.relative_to(app_dir)
                endpoint = '/' + str(relative_path.parent).replace('\\', '/')
                endpoint = endpoint.rstrip('/')
                if not endpoint:
                    endpoint = '/'
                found_endpoints.add(endpoint)

        result['found_endpoints'] = list(found_endpoints)

        # Check for expected endpoints
        for expected in config['ui_endpoints']:
            if expected not in found_endpoints:
                result['missing_endpoints'].append(expected)

        result['status'] = 'passed' if not result['missing_endpoints'] else 'warning'
        return result

    def _validate_features(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate features for a domain"""
        result = {
            'status': 'unknown',
            'expected_features': config['expected_features'],
            'validated_features': [],
            'issues': []
        }

        # This is a simplified validation - in practice, this would check actual functionality
        # For now, we'll check if feature-related files exist
        for feature in config['expected_features']:
            feature_found = False

            # Check for feature-related files
            feature_patterns = [
                f"*{feature}*",
                f"*{feature.replace('_', '')}*",
                f"*{feature.replace('_', '-')}*"
            ]

            for pattern in feature_patterns:
                matches = list(self.base_dir.rglob(pattern))
                if matches:
                    feature_found = True
                    break

            if feature_found:
                result['validated_features'].append(feature)
            else:
                result['issues'].append(f"Feature '{feature}' not found in codebase")

        result['status'] = 'passed' if len(result['validated_features']) == len(config['expected_features']) else 'warning'
        return result

    def _validate_security(self, domain: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate security features for a domain"""
        result = {
            'status': 'unknown',
            'checks': [],
            'issues': []
        }

        # Check for SSL certificate requirement
        if 'ssl_certificate' in config['expected_features']:
            # In a real implementation, this would check actual SSL certificates
            # For now, we'll assume SSL is configured if HTTPS-related files exist
            ssl_files = list(self.base_dir.rglob('*ssl*')) + list(self.base_dir.rglob('*https*'))
            if ssl_files:
                result['checks'].append('SSL configuration files found')
            else:
                result['issues'].append('SSL certificate configuration not found')

        # Check for security-related files
        security_files = list(self.base_dir.rglob('*auth*')) + list(self.base_dir.rglob('*security*'))
        if security_files:
            result['checks'].append('Security-related files found')
        else:
            result['issues'].append('Security implementation files not found')

        result['status'] = 'passed' if not result['issues'] else 'warning'
        return result

    def _generate_domain_recommendations(self, domain_result: Dict[str, Any]) -> List[str]:
        """Generate recommendations for a domain"""
        recommendations = []

        for validation_name, validation_result in domain_result['validations'].items():
            if validation_result.get('status') == 'failed':
                recommendations.append(f"Fix critical {validation_name} issues")
            elif validation_result.get('status') == 'warning':
                if 'missing' in validation_result:
                    missing_items = validation_result['missing']
                    if missing_items:
                        recommendations.append(f"Add missing {validation_name}: {', '.join(missing_items)}")

        return recommendations

    def generate_report(self) -> Path:
        """Generate comprehensive validation report"""
        report_path = self.reports_dir / f"content_ui_validation_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.validation_results, f, indent=2)

        logger.info(f"📊 Generated content & UI validation report: {report_path}")
        return report_path


def main():
    """Main function"""
    print("🎨 QMOI Content & UI Validator")
    print("=" * 50)

    validator = ContentUIFeatureValidator()

    # Run comprehensive validation
    results = validator.validate_all_domains()

    print(f"\n📊 Validation Results:")
    print(f"Overall Status: {results['overall_status'].upper()}")
    print(f"Domains Validated: {results['summary']['total_domains']}")
    print(f"Domains Passed: {results['summary']['domains_passed']}")
    print(f"Domains Warning: {results['summary']['domains_warning']}")
    print(f"Domains Failed: {results['summary']['domains_failed']}")

    print(f"\n📋 Domain Details:")
    for domain, result in results['details'].items():
        status = result['status'].upper()
        print(f"  {domain}: {status}")

    # Generate report
    report_path = validator.generate_report()
    print(f"\n📄 Full report: {report_path}")

    # Return appropriate exit code
    if results['overall_status'] == 'passed':
        print("✅ All content & UI validations passed!")
        return 0
    elif results['overall_status'] == 'warning':
        print("⚠️ Some validations have warnings. Check the report for details.")
        return 1
    else:
        print("❌ Some validations failed. Check the report for details.")
        return 1


if __name__ == '__main__':
    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:


        result = None



    except Exception as e:


        logger.error(f"Error: {e}")


        result = None        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    import sys
    import logging

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    try:
        app = QApplication(sys.argv) if 'QApplication' in globals() else None
        if app:
            main_window = MainWindow()
            main_window.show()
            sys.exit(app.exec_())
        else:
            main()
    except KeyboardInterrupt:
        logger.info('Application shutdown requested by user')
        sys.exit(0)
    except Exception as exc:
        logger.error(f'Application failed to start: {exc}')
        sys.exit(1)

    sys.exit(main())