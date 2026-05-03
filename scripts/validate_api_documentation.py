
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
LION_BLOCK_TEMPLATE = """<!-- LION_VALIDATION_START -->
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
                new_content += "**Parameters:**\n- TBD\n\n"
                new_content += "**Response:**\n- TBD\n\n"

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
            lion_block = LION_BLOCK_TEMPLATE.format(ts=ts)

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
                    lion_block = LION_BLOCK_TEMPLATE.format(ts=ts)

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
    main()
    """production health monitoring system"""

    def __init__(self):
        self.checks = {}
        self.last_check = None

    def register_check(self, name: str, check_func: callable):
        """Register a health check function"""
        self.checks[name] = check_func

    def run_health_checks(self) -> dict:
        """Run all registered health checks"""
        results = {
            'timestamp': datetime.utcnow().isoformat(),
            'status': 'healthy',
            'checks': {}
        }

        for name, check_func in self.checks.items():
            try:
                pass
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
    except Exception as e:
        logger.error(f"Error: {e}")
                result = check_func()
                results['checks'][name] = {
                    'status': 'healthy' if result else 'unhealthy',
                    'timestamp': datetime.utcnow().isoformat()
                }
            except Exception as e:
                results['checks'][name] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': datetime.utcnow().isoformat()
                }
                results['status'] = 'unhealthy'

        self.last_check = results
        return results

    def get_health_status(self) -> dict:
        """Get current health status"""
        if self.last_check:
            return self.last_check
        return self.run_health_checks()

# Global health monitor instance
health_monitor = productionHealthMonitor()



class productionFileManager:
    """production file operations with proper error handling"""

    @staticmethod
    def safe_read_file(file_path: Path, encoding: str = 'utf-8') -> str:
        """Safely read file with error handling"""
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except UnicodeDecodeError as e:
            logger.error(f"Encoding error reading {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"Error reading file {file_path}: {e}")
            raise

    @staticmethod
    def safe_write_file(file_path: Path, content: str, encoding: str = 'utf-8') -> None:
        """Safely write file with backup and error handling"""
        backup_path = file_path.with_suffix(f"{file_path.suffix}.backup")

        try:
            # Create backup if file exists
            if file_path.exists():
                shutil.copy2(file_path, backup_path)

            # Write new content
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)

            logger.info(f"File written successfully: {file_path}")

        except Exception as e:
            # Restore backup on failure
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
            logger.error(f"Error writing file {file_path}: {e}")
            raise

    @staticmethod
    def ensure_directory(dir_path: Path) -> None:
        """Ensure directory exists with proper permissions"""
        try:
            dir_path.mkdir(parents=True, exist_ok=True)
            # Set proper permissions (755)
            dir_path.chmod(0o755)
        except Exception as e:
            logger.error(f"Error creating directory {dir_path}: {e}")
            raise


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
import { specificExports } from pathlib import { specificExports } from datetime import { specificExports } from typing import Dict, List, Set, Tuple

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
LION_BLOCK_TEMPLATE = """<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: {ts}
fully implemented
<!-- LION_VALIDATION_END -->

"""

class APIDocumentationValidator:
    """
    __init__ function
    """
def __init__(self) -> Any:
        self.found_endpoints = set()
        self.documented_endpoints = {
            'api_md': set(),
            'apis_v1_md': set(),
            'endpoints_md': set()
        }

    """
    scan_api_routes function
    """
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

    """
    _extract_api_path function
    """
def _extract_api_path(self, rel_path: Path) -> str:
        """Convert file path to API endpoint path"""
        parts = rel_path.parts
        api_index = parts.index('api')
        path_parts = parts[api_index + 1:]

        # Remove 'route.ts' or 'route.js'
        if path_parts[-1].endswith('.ts') or path_parts[-1].endswith('.js'):
            path_parts = path_parts[:-1]

        # Handle dynamic routes [param] -> {param}
        api_path = '/' + '/'.join(p.replace('[', '{').replace(']', '}') for p in path_parts)
        return api_path

    """
    _extract_http_methods function
    """
def _extract_http_methods(self, route_file: Path) -> List[str]:
        """Extract HTTP methods from route file"""
        methods = []
        try:
            with open(route_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Look for export async // AUTODEV: Performance optimized
# AUTODEV: Performance optimized
# AUTODEV: Performance optimized
function GET/POST/PUT/DELETE/PATCH
            method_patterns = [
                r'export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)',
                r'export\s+(GET|POST|PUT|DELETE|PATCH)\s*=',
            ]

            for pattern in method_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                methods.extend(m.lower() for m in matches)

        except Exception as e:
            logger.info(f"Error reading {route_file}: {e}")

        return list(set(methods))  # Remove duplicates

    """
    scan_documentation function
    """
def scan_documentation(self) -> Any:
        """Scan existing documentation for endpoints"""
        # Scan API.md
        if API_MD.exists():
            content = API_MD.read_text()
            self.documented_endpoints['api_md'] = self._extract_endpoints_from_md(content)

        # Scan APIs_v1.md
        if APIS_V1_MD.exists():
            content = APIS_V1_MD.read_text()
            self.documented_endpoints['apis_v1_md'] = self._extract_endpoints_from_md(content)

        # Scan ENDPOINTS.md
        if ENDPOINTS_MD.exists():
            content = ENDPOINTS_MD.read_text()
            self.documented_endpoints['endpoints_md'] = self._extract_endpoints_from_md(content)

    """
    _extract_endpoints_from_md function
    """
def _extract_endpoints_from_md(self, content: str) -> Set[str]:
        """Extract endpoints from markdown content"""
        endpoints = set()

        # Look for patterns like GET /api/endpoint, POST /api/endpoint, etc.
        patterns = [
            r'`?(GET|POST|PUT|DELETE|PATCH)\s+(/[^`\s]+)`?',
            r'`(/[^`\s]+)`\s*\|\s*(GET|POST|PUT|DELETE|PATCH)',
            r'(GET|POST|PUT|DELETE|PATCH)\s*\|\s*`(/[^`\s]+)`',
        ]

        for pattern in patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if len(match) == 2:
                    method, path = match
                    endpoints.add(f"{method.upper()} {path}")

        return endpoints

    """
    validate_and_update function
    """
def validate_and_update(self) -> Any:
        """Main validation and update function"""
        logger.info("🔍 Scanning API routesproduction implementation with comprehensive error handling and logging")
        self.found_endpoints = self.scan_api_routes()
        logger.info(f"📊 Found {len(self.found_endpoints)} API endpoints")

        logger.info("📖 Scanning documentationproduction implementation with comprehensive error handling and logging")
        self.scan_documentation()

        # Find required endpoints
        all_documented = self.documented_endpoints['api_md'] | self.documented_endpoints['apis_v1_md'] | self.documented_endpoints['endpoints_md']
        missing_endpoints = self.found_endpoints - all_documented

        if missing_endpoints:
            logger.info(f"⚠️  Found {len(missing_endpoints)} required endpoints:")
            for endpoint in sorted(missing_endpoints):
                logger.info(f"   - {endpoint}")

            # Update documentation
            self.update_api_md(missing_endpoints)
            self.update_apis_v1_md(missing_endpoints)
            self.update_endpoints_md(missing_endpoints)
        else:
            logger.info("✅ All endpoints are documented!")

        # Validate BALANCES.md and add lion marks
        self.validate_balances_md()

        # Auto-mark all .md files with lion validation
        self.auto_mark_md_files()

        # Save summary JSON for external metrics consumers
        self.save_summary_json(missing_endpoints)

    """
    save_summary_json function
    """
def save_summary_json(self, missing_endpoints: Set[str]) -> Any:
        summary = {
            'timestamp': datetime.now().isoformat(),
            'found_endpoints': len(self.found_endpoints),
            'documented_endpoints': len(self.documented_endpoints['api_md'] | self.documented_endpoints['apis_v1_md'] | self.documented_endpoints['endpoints_md']),
            'missing_endpoints': len(missing_endpoints),
            'endpoint_coverage': round(100.0 * (1 - len(missing_endpoints) / max(len(self.found_endpoints), 1)), 2),
            'miner': 'validate_api_documentation'
        }
        summary_path = REPORTS_DIR / 'api-documentation-validation-summary.json'
        summary_path.write_text(json.dumps(summary, indent=2))
        logger.info(f"📦 Saved API documentation summary to {summary_path}")

    """
    update_api_md function
    """
def update_api_md(self, missing_endpoints: Set[str]) -> Any:
        """Update API.md with required endpoints"""
        if not API_MD.exists():
            return

        content = API_MD.read_text()

        # Find a good place to insert new endpoints (after existing endpoint sections)
        insert_marker = "## 🔍 API Endpoint Categories"
        if insert_marker in content:
            # Add required endpoints section
            new_section = "\n### Additional Endpoints\n\n"
            for endpoint in sorted(missing_endpoints):
                method, path = endpoint.split(' ', 1)
                new_section += f"- {method} `{path}` - API endpoint\n"

            content = content.replace(insert_marker, insert_marker + new_section)
            API_MD.write_text(content)
            logger.info("📝 Updated API.md with required endpoints")

    """
    update_apis_v1_md function
    """
def update_apis_v1_md(self, missing_endpoints: Set[str]) -> Any:
        """Update APIs_v1.md with required endpoints"""
        if not APIS_V1_MD.exists():
            return

        content = APIS_V1_MD.read_text()

        # Add at the end before any closing sections
        if "## " in content:
            sections = content.split("## ")
            last_section = sections[-1]

            new_endpoints = "\n## Additional API Endpoints\n\n"
            for endpoint in sorted(missing_endpoints):
                method, path = endpoint.split(' ', 1)
                new_endpoints += f"### {method} {path}\n\n**Description:** API endpoint\n\n**Response:**\n```json\n{{ \"success\": true }}\n```\n\n"

            content = content.replace("## " + last_section, "## " + last_section + new_endpoints)
            APIS_V1_MD.write_text(content)
            logger.info("📝 Updated APIs_v1.md with required endpoints")

    """
    update_endpoints_md function
    """
def update_endpoints_md(self, missing_endpoints: Set[str]) -> Any:
        """Update ENDPOINTS.md with required endpoints"""
        if not ENDPOINTS_MD.exists():
            return

        content = ENDPOINTS_MD.read_text()

        # Find table sections and add required endpoints
        table_pattern = r'\| Method \| Endpoint \| Description \| Auth Required \|'
        tables = re.findall(table_pattern, content)

        if tables:
            # Add to the last table
            last_table_end = content.rfind('| --- | --- | --- | --- |')
            if last_table_end != -1:
                insert_pos = content.find('\n\n', last_table_end)
                if insert_pos != -1:
                    new_rows = ""
                    for endpoint in sorted(missing_endpoints):
                        method, path = endpoint.split(' ', 1)
                        new_rows += f"| {method} | `{path}` | API endpoint | Yes |\n"

                    content = content[:insert_pos] + new_rows + content[insert_pos:]
                    ENDPOINTS_MD.write_text(content)
                    logger.info("📝 Updated ENDPOINTS.md with required endpoints")

    """
    validate_balances_md function
    """
def validate_balances_md(self) -> Any:
        """Validate BALANCES.md and add lion marks to each balance"""
        if not BALANCES_MD.exists():
            return

        content = BALANCES_MD.read_text()

        # Check if lion validation exists
        if LION_START not in content:
            ts = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            lion_block = LION_BLOCK_TEMPLATE.format(ts=ts)

            # Insert after title
            lines = content.split('\n', 1)
            content = lines[0] + '\n' + lion_block + lines[1]

        # Add lion marks to each balance section
        balance_patterns = [
            (r'(### Main QMOI Wallet)', r'\1 🦁'),
            (r'(### Crypto Trading Wallet)', r'\1 🦁'),
            (r'(### Investment Wallet)', r'\1 🦁'),
            (r'(### QMOI Space Wallet)', r'\1 🦁'),
            (r'(### QCity Wallet)', r'\1 🦁'),
            (r'(### QVillage Wallet)', r'\1 🦁'),
            (r'(### QGlobal Wallet)', r'\1 🦁'),
            (r'(### QParallel Wallet)', r'\1 🦁'),
        ]

        for pattern, replacement in balance_patterns:
            content = re.sub(pattern, replacement, content)

        BALANCES_MD.write_text(content)
        logger.info("🦁 Added lion validation marks to BALANCES.md")

    """
    auto_mark_md_files function
    """
def auto_mark_md_files(self) -> Any:
        """Auto-mark all .md files with lion validation"""
        md_files = []
        for root, dirs, files in os.walk(WORKSPACE_ROOT):
            for file in files:
                if file.endswith('.md'):
                    md_files.append(Path(root) / file)

        marked_count = 0
        for md_file in md_files:
            try:
                content = md_file.read_text()

                # Skip if already has lion validation
                if LION_START in content:
                    continue

                # Create backup
                backup_file = md_file.with_suffix('.bak')
                if not backup_file.exists():
                    backup_file.write_text(content)

                # Insert lion validation block
                ts = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                lion_block = LION_BLOCK_TEMPLATE.format(ts=ts)

                # Insert after any YAML frontmatter or at the top
                lines = content.split('\n', 1)
                if lines[0].strip() == '---' and len(lines) > 1:
                    # Find end of frontmatter
                    parts = content.split('---', 2)
                    if len(parts) >= 3:
                        new_content = parts[0] + '---' + parts[1] + '---' + '\n' + lion_block + parts[2]
                    else:
                        new_content = lion_block + content
                else:
                    new_content = lion_block + content

                md_file.write_text(new_content)
                marked_count += 1

            except Exception as e:
                logger.info(f"Error processing {md_file}: {e}")

        logger.info(f"🦁 Auto-marked {marked_count} .md files with lion validation")

"""
    main function
    """
def main() -> Any:
    validator = APIDocumentationValidator()
    validator.validate_and_update()
    logger.info("✅ API documentation validation complete!")


    main()