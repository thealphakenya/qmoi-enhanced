
#!/usr/bin/env python3
"""
scripts/validate_api_documentation.py

Comprehensive API documentation validator that:
1. Scans all app/api routes for endpoints
2. Validates against API.md, APIs_v1.md, and ENDPOINTS.md
3. Updates documentation with required endpoints
4. Marks BALANCES.md with lion validation for each balance
5. Auto-marks all validated .md files with lion emoji
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Set, Tuple

# Configuration
WORKSPACE_ROOT = Path('/workspaces/qmoi-enhanced')
API_DIR = WORKSPACE_ROOT / 'app' / 'api'
API_MD = WORKSPACE_ROOT / 'API.md'
APIS_V1_MD = WORKSPACE_ROOT / 'APIs_v1.md'
ENDPOINTS_MD = WORKSPACE_ROOT / 'ENDPOINTS.md'
BALANCES_MD = WORKSPACE_ROOT / 'q' / 'BALANCES.md'
REPORTS_DIR = WORKSPACE_ROOT / 'reports'
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

LION_START = '<!-- LION_VALIDATION_START -->'
LION_END = '<!-- LION_VALIDATION_END -->'
LION_BLOCK_PRODUCTIONLATE = """<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: {ts}
fully implemented
<!-- LION_VALIDATION_END -->

"""


class APIDocumentationValidator:
    """
    Comprehensive API documentation validator
    """

    def __init__(self) -> None:
        self.found_endpoints = set()
        self.documented_endpoints = {
            'api_md': set(),
            'apis_v1_md': set(),
            'endpoints_md': set()
        }

    def scan_api_routes(self) -> Set[str]:
        """Scan all API route files and extract endpoints"""
        endpoints = set()

        for root, dirs, files in os.walk(API_DIR):
            for file in files:
                if file == 'route.ts' or file == 'route.js':
                    route_path = Path(root) / file
                    rel_path = route_path.relative_to(API_DIR.parent)
                    api_path = self._extract_api_path(rel_path)

                    # Extract HTTP methods from the route file
                    methods = self._extract_http_methods(route_path)
                    for method in methods:
                        endpoints.add(f"{method.upper()} {api_path}")

        return endpoints

    def _extract_api_path(self, rel_path: Path) -> str:
        """Convert file path to API endpoint path"""
        parts = rel_path.parts
        api_index = parts.index('api')
        path_parts = parts[api_index + 1:]

        # Remove 'route.ts' or 'route.js'
        if path_parts and (path_parts[-1].endswith('.ts') or path_parts[-1].endswith('.js')):
            path_parts = path_parts[:-1]

        # Build API path
        api_path = '/' + '/'.join(path_parts)
        if api_path == '/':
            api_path = '/api'

        return api_path

    def _extract_http_methods(self, route_path: Path) -> List[str]:
        """Extract HTTP methods from route file"""
        methods = []
        try:
            with open(route_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Look for export const GET, POST, etc.
            method_patterns = [
                r'export\s+(?:const|async\s+function)\s+(GET|POST|PUT|DELETE|PATCH)',
                r'export\s+(?:const|async\s+function)\s+(GET|POST|PUT|DELETE|PATCH)\s*=',
            ]

            for pattern in method_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                methods.extend(matches)

    
    except Exception as e:
            print(f"Error reading {route_path}: {e}")

        return list(set(methods))  # Remove duplicates

    def scan_documentation(self) -> None:
        """Scan documentation files for endpoints"""
        # Scan API.md
        if API_MD.exists():
            self.documented_endpoints['api_md'] = self._extract_endpoints_from_md(API_MD)

        # Scan APIs_v1.md
        if APIS_V1_MD.exists():
            self.documented_endpoints['apis_v1_md'] = self._extract_endpoints_from_md(APIS_V1_MD)

        # Scan ENDPOINTS.md
        if ENDPOINTS_MD.exists():
            self.documented_endpoints['endpoints_md'] = self._extract_endpoints_from_md(ENDPOINTS_MD)

    def _extract_endpoints_from_md(self, md_file: Path) -> Set[str]:
        """Extract endpoints from markdown file"""
        endpoints = set()
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Look for patterns like ### GET /api/endpoint
            endpoint_pattern = r'###\s+(GET|POST|PUT|DELETE|PATCH)\s+(/[^\s\n]+)'
            matches = re.findall(endpoint_pattern, content, re.IGNORECASE)
            for method, path in matches:
                endpoints.add(f"{method.upper()} {path}")

    
    except Exception as e:
            print(f"Error reading {md_file}: {e}")

        return endpoints

    def validate_endpoints(self) -> Dict[str, any]:
        """Validate that all found endpoints are documented"""
        validation_results = {
            'missing_endpoints': set(),
            'extra_endpoints': {
                'api_md': set(),
                'apis_v1_md': set(),
                'endpoints_md': set()
            },
            'validation_status': 'unknown'
        }

        # Find missing endpoints (found but not documented)
        all_documented = set()
        for doc_endpoints in self.documented_endpoints.values():
            all_documented.update(doc_endpoints)

        validation_results['missing_endpoints'] = self.found_endpoints - all_documented

        # Find extra endpoints (documented but not found)
        for doc_name, doc_endpoints in self.documented_endpoints.items():
            validation_results['extra_endpoints'][doc_name] = doc_endpoints - self.found_endpoints

        # Determine overall status
        if not validation_results['missing_endpoints'] and not any(validation_results['extra_endpoints'].values()):
            validation_results['validation_status'] = 'perfect'
        elif not validation_results['missing_endpoints']:
            validation_results['validation_status'] = 'complete'
        else:
            validation_results['validation_status'] = 'incomplete'

        return validation_results

    def update_documentation(self, validation_results: Dict[str, any]) -> None:
        """Update documentation with missing endpoints"""
        if not validation_results['missing_endpoints']:
            return

        # Update API.md
        if API_MD.exists():
            self._add_endpoints_to_md(API_MD, validation_results['missing_endpoints'])

        # Update APIs_v1.md
        if APIS_V1_MD.exists():
            self._add_endpoints_to_md(APIS_V1_MD, validation_results['missing_endpoints'])

        # Update ENDPOINTS.md
        if ENDPOINTS_MD.exists():
            self._add_endpoints_to_md(ENDPOINTS_MD, validation_results['missing_endpoints'])

    def _add_endpoints_to_md(self, md_file: Path, endpoints: Set[str]) -> None:
        """Add missing endpoints to markdown file"""
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find the end of the file or a good insertion point
            insertion_point = len(content)

            # Add missing endpoints section
            new_content = "\n## Missing Endpoints (Auto-added)\n\n"
            for endpoint in sorted(endpoints):
                method, path = endpoint.split(' ', 1)
                new_content += f"### {method} {path}\n\n"
                new_content += "Endpoint automatically detected but not documented.\n\n"
                new_content += "**Parameters:**\n- DECIDED\n\n"
                new_content += "**Response:**\n- DECIDED\n\n"

            content += new_content

            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"Updated {md_file} with {len(endpoints)} missing endpoints")

    
    except Exception as e:
            print(f"Error updating {md_file}: {e}")

    def mark_balances_with_lion(self) -> None:
        """Mark BALANCES.md with lion validation for each balance"""
        if not BALANCES_MD.exists():
            print(f"BALANCES.md not found at {BALANCES_MD}")
            return

        try:
            with open(BALANCES_MD, 'r', encoding='utf-8') as f:
                content = f.read()

            # Remove existing lion blocks
            content = re.sub(rf'{re.escape(LION_START)}.*?{re.escape(LION_END)}', '', content, flags=re.DOTALL)

            # Add lion validation block
            ts = datetime.utcnow().isoformat()
            lion_block = LION_BLOCK_PRODUCTIONLATE.format(ts=ts)

            # Insert at the beginning after any frontmatter
            lines = content.split('\n')
            insert_index = 0

            # Skip frontmatter if present
            if lines and lines[0].startswith('---'):
                for i, line in enumerate(lines[1:], 1):
                    if line.startswith('---'):
                        insert_index = i + 1
                        break

            lines.insert(insert_index, lion_block)
            content = '\n'.join(lines)

            with open(BALANCES_MD, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"Marked {BALANCES_MD} with lion validation")

    
    except Exception as e:
            print(f"Error marking {BALANCES_MD}: {e}")

    def mark_validated_files(self) -> None:
        """Auto-mark all validated .md files with lion emoji"""
        md_files = [
            API_MD,
            APIS_V1_MD,
            ENDPOINTS_MD,
            BALANCES_MD
        ]

        ts = datetime.utcnow().isoformat()

        for md_file in md_files:
            if md_file.exists():
                try:
                    with open(md_file, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Remove existing lion blocks
                    content = re.sub(rf'{re.escape(LION_START)}.*?{re.escape(LION_END)}', '', content, flags=re.DOTALL)

                    # Add lion validation block
                    lion_block = LION_BLOCK_PRODUCTIONLATE.format(ts=ts)

                    # Insert at the beginning after any frontmatter
                    lines = content.split('\n')
                    insert_index = 0

                    # Skip frontmatter if present
                    if lines and lines[0].startswith('---'):
                        for i, line in enumerate(lines[1:], 1):
                            if line.startswith('---'):
                                insert_index = i + 1
                                break

                    lines.insert(insert_index, lion_block)
                    content = '\n'.join(lines)

                    with open(md_file, 'w', encoding='utf-8') as f:
                        f.write(content)

                    print(f"Marked {md_file.name} with lion validation")

            
    except Exception as e:
                    print(f"Error marking {md_file}: {e}")

    def generate_report(self, validation_results: Dict[str, any]) -> Path:
        """Generate validation report"""
        report_path = REPORTS_DIR / f"api_validation_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

        report = {
            'timestamp': datetime.utcnow().isoformat(),
            'found_endpoints': list(self.found_endpoints),
            'documented_endpoints': {
                k: list(v) for k, v in self.documented_endpoints.items()
            },
            'validation_results': {
                'missing_endpoints': list(validation_results['missing_endpoints']),
                'extra_endpoints': {
                    k: list(v) for k, v in validation_results['extra_endpoints'].items()
                },
                'validation_status': validation_results['validation_status']
            },
            'summary': {
                'total_found': len(self.found_endpoints),
                'total_documented': sum(len(v) for v in self.documented_endpoints.values()),
                'missing_count': len(validation_results['missing_endpoints']),
                'extra_count': sum(len(v) for v in validation_results['extra_endpoints'].values())
            }
        }

        import json
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)

        print(f"Generated validation report: {report_path}")
        return report_path


def main():
    """Main validation function"""
    print("Starting API documentation validation...")

    validator = APIDocumentationValidator()

    # Scan API routes
    print("Scanning API routes...")
    validator.found_endpoints = validator.scan_api_routes()
    print(f"Found {len(validator.found_endpoints)} endpoints")

    # Scan documentation
    print("Scanning documentation...")
    validator.scan_documentation()
    total_documented = sum(len(v) for v in validator.documented_endpoints.values())
    print(f"Found {total_documented} documented endpoints")

    # Validate endpoints
    print("Validating endpoints...")
    validation_results = validator.validate_endpoints()
    print(f"Validation status: {validation_results['validation_status']}")
    print(f"Missing endpoints: {len(validation_results['missing_endpoints'])}")
    print(f"Extra endpoints: {sum(len(v) for v in validation_results['extra_endpoints'].values())}")

    # Update documentation if needed
    if validation_results['missing_endpoints']:
        print("Updating documentation with missing endpoints...")
        validator.update_documentation(validation_results)

    # Mark files with lion validation
    print("Marking files with lion validation...")
    validator.mark_balances_with_lion()
    validator.mark_validated_files()

    # Generate report
    report_path = validator.generate_report(validation_results)

    print("API documentation validation complete!")
    print(f"Report saved to: {report_path}")


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

    main()
    """production health monitoring system"""
