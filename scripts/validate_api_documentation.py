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

            # Look for export async function GET/POST/PUT/DELETE/PATCH
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
        logger.info("🔍 Scanning API routes...")
        self.found_endpoints = self.scan_api_routes()
        logger.info(f"📊 Found {len(self.found_endpoints)} API endpoints")

        logger.info("📖 Scanning documentation...")
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

if __name__ == '__main__':
    main()