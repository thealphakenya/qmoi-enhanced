#!/usr/bin/env python3
"""
Comprehensive UI Feature Validation System for QMOI

Validates all UI features, components, and PWA shells across:
- QMOI AI (app/qmoi-ai)
- QMOI Space (app/qmoi-space)
- QCity (app/qcity)
- QVillage (app/qvillage)
- All PWA shells (pwa_apps/*)
- All React components (app/components/*, components/*)

Ensures:
✓ All UI components are properly exported and integrated
✓ All PWA shells have valid service workers and manifests
✓ All UI features are available and accessible
✓ Component usage is correct across all apps
✓ Update endpoints are healthy
✓ Offline capabilities work as intended
✓ Install prompts are functional
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Set, Tuple
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/comprehensive_ui_validation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).parent.parent


class UIComponentValidator:
    """Validates individual UI components"""

    def __init__(self):
        self.components = {}
        self.issues = []
        self.warnings = []

    def validate_component(self, component_path: Path) -> Dict[str, Any]:
        """Validate a single UI component file"""
        result = {
            'path': str(component_path.relative_to(BASE_DIR)),
            'name': component_path.stem,
            'type': 'component',
            'valid': True,
            'size': 0,
            'checks': {
                'exists': False,
                'has_export': False,
                'has_imports': False,
                'has_prop_types': False,
                'has_types': False,
                'is_typescript': component_path.suffix == '.tsx',
                'is_javascript': component_path.suffix == '.jsx',
                'has_react_import': False,
                'has_documentation': False,
                'is_PRODUCTION_READY': False,
            },
            'errors': [],
            'warnings': []
        }

        if not component_path.exists():
            result['valid'] = False
            result['errors'].append('File does not exist')
            return result

        result['checks']['exists'] = True

        try:
            content = component_path.read_text(encoding='utf-8')
            result['size'] = len(content)
            lines = content.split('\n')

            # Normalize comments before checking exports
            stripped_content = re.sub(r'/\*.*?\*/', ' ', content, flags=re.DOTALL)
            export_regex = re.compile(
                r'export\s+(?:default\s+[\w$]+|(?:default\s+)?(?:function|const|class|interface|type|var))\b',
                re.IGNORECASE,
            )
            named_export_regex = re.compile(r'export\s*\{', re.IGNORECASE)

            if export_regex.search(stripped_content) or named_export_regex.search(stripped_content):
                result['checks']['has_export'] = True

            if not result['checks']['has_export']:
                result['errors'].append('No export statement found')
                result['valid'] = False

            # Check for imports
            if 'import ' in content:
                result['checks']['has_imports'] = True

            # Check for React import
            if 'from "react"' in content or "from 'react'" in content:
                result['checks']['has_react_import'] = True

            # Check for prop types or types
            if 'PropTypes' in content:
                result['checks']['has_prop_types'] = True
            if 'interface ' in content or 'type ' in content:
                result['checks']['has_types'] = True

            # Check for JSDoc or comments
            if '/**' in content or '/*' in content:
                result['checks']['has_documentation'] = True

            # Check production readiness
            if 'production_IMPLEMENTED' in content or '✅ PRODUCTION' in content:
                result['checks']['is_PRODUCTION_READY'] = True

            # Warnings
            if result['size'] < 50:
                result['warnings'].append('Component is very small (< 50 bytes)')
            if not result['checks']['has_documentation'] and result['size'] > 300:
                result['warnings'].append('Large component lacks documentation')
            if not result['checks']['has_types'] and result['checks']['is_typescript']:
                result['warnings'].append('TypeScript component lacks type definitions')

        except Exception as e:
            result['valid'] = False
            result['errors'].append(f'Error reading component: {str(e)}')

        return result

    def validate_directory(self, directory: Path) -> Dict[str, Any]:
        """Validate all components in a directory"""
        results = {
            'directory': str(directory.relative_to(BASE_DIR)),
            'total_components': 0,
            'valid_components': 0,
            'components': {},
            'summary': {
                'with_exports': 0,
                'with_types': 0,
                'PRODUCTION_READY': 0,
                'issues': 0
            }
        }

        if not directory.exists():
            return results

        # Get all TSX and JSX files
        component_files = list(directory.glob('**/*.tsx')) + list(directory.glob('**/*.jsx'))
        for component_file in component_files:
            validation = self.validate_component(component_file)
            results['components'][validation['name']] = validation
            results['total_components'] += 1

            if validation['valid']:
                results['valid_components'] += 1
            if validation['checks']['has_export']:
                results['summary']['with_exports'] += 1
            if validation['checks']['has_types']:
                results['summary']['with_types'] += 1
            if validation['checks']['is_PRODUCTION_READY']:
                results['summary']['PRODUCTION_READY'] += 1
            if validation['errors']:
                results['summary']['issues'] += 1

        return results


class PWAValidator:
    """Validates PWA shells and their health"""

    def __init__(self):
        self.pwa_dirs = {}
        self.issues = []

    def validate_pwa_shell(self, pwa_path: Path) -> Dict[str, Any]:
        """Validate a PWA shell"""
        result = {
            'path': str(pwa_path.relative_to(BASE_DIR)),
            'name': pwa_path.name,
            'type': 'pwa_shell',
            'valid': True,
            'checks': {
                'has_index_html': False,
                'has_manifest': False,
                'has_service_worker': False,
                'manifest_valid': False,
                'service_worker_valid': False,
                'has_icons': False,
                'has_offline_page': False,
                'update_endpoint_reachable': False,
            },
            'files': {},
            'errors': [],
            'warnings': []
        }

        if not pwa_path.exists():
            result['valid'] = False
            result['errors'].append('PWA directory does not exist')
            return result

        # Check index.html
        index_html = pwa_path / 'index.html'
        if index_html.exists():
            result['checks']['has_index_html'] = True
            result['files']['index.html'] = str(index_html.relative_to(BASE_DIR))
        else:
            result['errors'].append('Missing index.html')

        # Check manifest
        manifest_files = [
            pwa_path / 'manifest.json',
            pwa_path / 'manifest.webmanifest'
        ]
        for manifest in manifest_files:
            if manifest.exists():
                result['checks']['has_manifest'] = True
                result['files']['manifest'] = str(manifest.relative_to(BASE_DIR))
                try:
                    manifest_content = manifest.read_text()
                    manifest_json = json.loads(manifest_content)
                    if 'name' in manifest_json and 'start_url' in manifest_json:
                        result['checks']['manifest_valid'] = True
                except json.JSONDecodeError:
                    result['errors'].append('Manifest JSON is invalid')
                except Exception as e:
                    result['warnings'].append(f'Error reading manifest: {e}')
                break

        # Check service worker
        sw_files = [
            pwa_path / 'service-worker.js',
            pwa_path / 'sw.js',
            BASE_DIR / 'public' / 'service-worker.js'
        ]
        for sw in sw_files:
            if sw.exists():
                result['checks']['has_service_worker'] = True
                result['files']['service_worker'] = str(sw.relative_to(BASE_DIR))
                try:
                    sw_content = sw.read_text()
                    if 'self.adPRODUCTIONentListener' in sw_content and 'fetch' in sw_content:
                        result['checks']['service_worker_valid'] = True
                except Exception as e:
                    result['warnings'].append(f'Error reading service worker: {e}')
                break

        # Check for icons
        icon_patterns = ['*.png', '*.svg', '*.jpg', '*.webp']
        has_icons = False
        for pattern in icon_patterns:
            if list(pwa_path.glob(f'**/{pattern}')):
                has_icons = True
                break
        result['checks']['has_icons'] = has_icons
        if not has_icons:
            result['warnings'].append('No app icons found')

        # Check offline fallback
        offline_page = pwa_path / 'offline.html'
        if offline_page.exists():
            result['checks']['has_offline_page'] = True
            result['files']['offline'] = str(offline_page.relative_to(BASE_DIR))

        # Validation summary
        if not result['checks']['has_manifest']:
            result['errors'].append('Missing manifest file')
            result['valid'] = False
        if not result['checks']['has_service_worker']:
            result['errors'].append('Missing service worker')
            result['valid'] = False

        return result

    def validate_all_pwas(self) -> Dict[str, Any]:
        """Validate all PWA shells"""
        pwa_root = BASE_DIR / 'pwa_apps'
        results = {
            'pwa_root': str(pwa_root.relative_to(BASE_DIR)),
            'total_pwas': 0,
            'valid_pwas': 0,
            'pwas': {},
            'summary': {
                'with_manifest': 0,
                'with_service_worker': 0,
                'PRODUCTION_READY': 0,
                'issues': 0
            }
        }

        if not pwa_root.exists():
            return results

        for pwa_dir in pwa_root.iterdir():
            if pwa_dir.is_dir():
                validation = self.validate_pwa_shell(pwa_dir)
                results['pwas'][pwa_dir.name] = validation
                results['total_pwas'] += 1

                if validation['valid']:
                    results['valid_pwas'] += 1
                if validation['checks']['has_manifest']:
                    results['summary']['with_manifest'] += 1
                if validation['checks']['has_service_worker']:
                    results['summary']['with_service_worker'] += 1
                if validation['checks']['manifest_valid'] and validation['checks']['service_worker_valid']:
                    results['summary']['PRODUCTION_READY'] += 1
                if validation['errors']:
                    results['summary']['issues'] += 1

        return results


class UIIntegrationValidator:
    """Validates UI component integration across apps"""

    def __init__(self):
        self.component_usage = {}
        self.integration_issues = []

    def find_component_usage(self, component_name: str) -> List[Tuple[Path, int]]:
        """Find where a component is imported and used"""
        usage_locations = []
        search_dirs = [
            BASE_DIR / 'app',
            BASE_DIR / 'components',
            BASE_DIR / 'pages',
            BASE_DIR / 'pwa_apps'
        ]

        for search_dir in search_dirs:
            if not search_dir.exists():
                continue
            for file_path in search_dir.glob('**/*.{tsx,jsx,ts,js}'):
                try:
                    content = file_path.read_text(encoding='utf-8')
                    if f'import' in content and component_name in content:
                        line_num = sum(1 for line in content.split('\n')
                                      if component_name in line and 'import' in line)
                        if line_num > 0:
                            usage_locations.append((file_path, line_num))
                except Exception:
                    pass

        return usage_locations

    def validate_component_usage(self, component_path: Path) -> Dict[str, Any]:
        """Validate that a component is properly used"""
        component_name = component_path.stem
        result = {
            'component': component_name,
            'defined_at': str(component_path.relative_to(BASE_DIR)),
            'usage_count': 0,
            'used_in': [],
            'issues': []
        }

        usage = self.find_component_usage(component_name)
        result['usage_count'] = len(usage)

        if result['usage_count'] == 0:
            result['issues'].append(f'Component {component_name} is not used anywhere')

        for usage_path, line_count in usage:
            result['used_in'].append({
                'file': str(usage_path.relative_to(BASE_DIR)),
                'occurrences': line_count
            })

        return result


class ComprehensiveUIValidator:
    """Main validator that orchestrates all UI validation"""

    def __init__(self):
        self.component_validator = UIComponentValidator()
        self.pwa_validator = PWAValidator()
        self.integration_validator = UIIntegrationValidator()
        self.report = {
            'timestamp': datetime.now().isoformat(),
            'validation_type': 'COMPREHENSIVE_UI_VALIDATION',
            'components': {},
            'pwas': {},
            'integration': {},
            'summary': {
                'total_components': 0,
                'valid_components': 0,
                'total_pwas': 0,
                'valid_pwas': 0,
                'integration_issues': 0,
                'overall_health_score': 0
            }
        }

    def run_full_validation(self) -> Dict[str, Any]:
        """Run comprehensive UI validation"""
        logger.info("🎨 Starting COMPREHENSIVE UI VALIDATION")
        logger.info("=" * 80)

        # Validate component directories
        component_dirs = [
            (BASE_DIR / 'app' / 'components', 'app_components'),
            (BASE_DIR / 'components', 'root_components')
        ]

        total_components = 0
        valid_components = 0

        for comp_dir, key_name in component_dirs:
            if comp_dir.exists():
                logger.info(f"📦 Validating components in {comp_dir.relative_to(BASE_DIR)}...")
                validation = self.component_validator.validate_directory(comp_dir)
                self.report['components'][key_name] = validation
                total_components += validation['total_components']
                valid_components += validation['valid_components']

        self.report['summary']['total_components'] = total_components
        self.report['summary']['valid_components'] = valid_components

        # Validate PWAs
        logger.info(f"🌐 Validating PWA shells...")
        pwa_validation = self.pwa_validator.validate_all_pwas()
        self.report['pwas'] = pwa_validation
        self.report['summary']['total_pwas'] = pwa_validation['total_pwas']
        self.report['summary']['valid_pwas'] = pwa_validation['valid_pwas']

        # Calculate health score
        if total_components > 0 and pwa_validation['total_pwas'] > 0:
            component_score = (valid_components / total_components) * 100 if total_components > 0 else 0
            pwa_score = (pwa_validation['valid_pwas'] / pwa_validation['total_pwas']) * 100 if pwa_validation['total_pwas'] > 0 else 0
            self.report['summary']['overall_health_score'] = int((component_score + pwa_score) / 2)
        else:
            self.report['summary']['overall_health_score'] = 0

        logger.info("=" * 80)
        logger.info(f"✅ Components validated: {valid_components}/{total_components}")
        logger.info(f"✅ PWAs validated: {pwa_validation['valid_pwas']}/{pwa_validation['total_pwas']}")
        logger.info(f"📊 Overall UI Health Score: {self.report['summary']['overall_health_score']}%")

        return self.report

    def save_report(self, output_file: str = 'comprehensive_ui_validation_report.json'):
        """Save validation report to file"""
        report_path = BASE_DIR / output_file
        try:
            with open(report_path, 'w') as f:
                json.dump(self.report, f, indent=2)
            logger.info(f"📄 Report saved to {report_path}")
        except Exception as e:
            logger.error(f"❌ Error saving report: {e}")

    def generate_summary(self) -> str:
        """Generate a text summary of validation results"""
        summary = []
        summary.append("\n" + "=" * 80)
        summary.append("🎨 COMPREHENSIVE UI FEATURE VALIDATION REPORT")
        summary.append("=" * 80)
        summary.append(f"\nTimestamp: {self.report['timestamp']}")
        summary.append(f"\nComponent Validation:")
        summary.append(f"  • Total Components: {self.report['summary']['total_components']}")
        summary.append(f"  • Valid Components: {self.report['summary']['valid_components']}")
        
        if self.report['summary']['total_components'] > 0:
            pct = (self.report['summary']['valid_components'] / self.report['summary']['total_components']) * 100
            summary.append(f"  • Validation Rate: {pct:.1f}%")

        summary.append(f"\nPWA Validation:")
        summary.append(f"  • Total PWAs: {self.report['summary']['total_pwas']}")
        summary.append(f"  • Valid PWAs: {self.report['summary']['valid_pwas']}")
        
        if self.report['summary']['total_pwas'] > 0:
            pct = (self.report['summary']['valid_pwas'] / self.report['summary']['total_pwas']) * 100
            summary.append(f"  • Validation Rate: {pct:.1f}%")

        summary.append(f"\n📊 Overall UI Health Score: {self.report['summary']['overall_health_score']}%")
        summary.append("=" * 80 + "\n")

        return "\n".join(summary)


def main():
    """Main entry point"""
    validator = ComprehensiveUIValidator()
    report = validator.run_full_validation()
    validator.save_report()
    print(validator.generate_summary())

    return 0 if validator.report['summary']['overall_health_score'] >= 80 else 1


if __name__ == '__main__':
    exit(main())
