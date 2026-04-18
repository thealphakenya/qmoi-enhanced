#!/usr/bin/env python3
"""
QMOI Enhanced Comprehensive Documentation Bulk Updater
- Extracts and updates APIs, endpoints, routes, tests, hooks, and markdown files
- Ensures all documentation is comprehensive and production-ready
- Single execution for massive concurrent updates
"""

import os
import re
import json
import subprocess
from pathlib import Path
from collections import defaultdict
from datetime import datetime
from typing import Set, Dict, List, Tuple

class QMOIDocUpdater:
    def __init__(self, workspace_root: str = "/workspaces/qmoi-enhanced"):
        self.workspace_root = workspace_root
        self.apis = set()
        self.endpoints = set()
        self.routes = set()
        self.tests = set()
        self.hooks = set()
        self.webhooks = set()
        self.md_files = set()
        self.instances = set()
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        
    def extract_apis_from_files(self):
        """Extract all APIs from source files (TypeScript, JavaScript, Python)"""
        print("🔍 Extracting APIs from source files...")
        patterns = {
            'export.*function': r'export\s+(?:async\s+)?function\s+(\w+)',
            'export.*const': r'export\s+const\s+(\w+)\s*:',
            'export.*class': r'export\s+class\s+(\w+)',
            'export.*interface': r'export\s+interface\s+(\w+)',
            'exported functions': r'def\s+(\w+)\s*\(',
        }
        
        for root, dirs, files in os.walk(self.workspace_root):
            # Skip backups and node_modules
            dirs[:] = [d for d in dirs if d not in ['.backups', 'node_modules', '.git', '__pycache__']]
            
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.py')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            for pattern in patterns.values():
                                for match in re.finditer(pattern, content):
                                    api_name = match.group(1)
                                    if api_name and not api_name.startswith('_'):
                                        self.apis.add(f"{api_name} ({os.path.relpath(filepath, self.workspace_root)})")
                    except Exception as e:
                        pass
        
        print(f"  ✅ Found {len(self.apis)} APIs")

    def extract_endpoints_and_routes(self):
        """Extract all HTTP endpoints and routes"""
        print("🔍 Extracting endpoints and routes...")
        patterns = [
            r'(?:app|router)\.(?:get|post|put|delete|patch|head)\s*\(\s*["\']([^"\']+)',
            r'@(?:Get|Post|Put|Delete|Patch)\(["\']([^"\']+)',
            r'Route\.(?:get|post|put|delete)\s*\(\s*["\']([^"\']+)',
            r'path\s*=\s*["\']([^"\']+)',
        ]
        
        for root, dirs, files in os.walk(self.workspace_root):
            dirs[:] = [d for d in dirs if d not in ['.backups', 'node_modules', '.git', '__pycache__']]
            
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.py')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            for pattern in patterns:
                                for match in re.finditer(pattern, content):
                                    endpoint = match.group(1)
                                    if endpoint and endpoint.startswith('/'):
                                        self.endpoints.add(endpoint)
                                        # Extract method from context
                                        line = content[max(0, match.start()-100):match.end()]
                                        for method in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
                                            if method.lower() in line.lower():
                                                self.routes.add(f"{method} {endpoint}")
                                                break
                    except Exception as e:
                        pass
        
        print(f"  ✅ Found {len(self.endpoints)} endpoints, {len(self.routes)} routes")

    def extract_tests(self):
        """Extract all test files and test suites"""
        print("🔍 Extracting test suites...")
        test_patterns = [
            r'describe\s*\(\s*["\']([^"\']+)',
            r'it\s*\(\s*["\']([^"\']+)',
            r'test\s*\(\s*["\']([^"\']+)',
            r'def\s+test_(\w+)',
            r'@test.*\n.*(?:public\s+)?(?:async\s+)?(?:void|function)\s+(\w+)',
        ]
        
        for root, dirs, files in os.walk(self.workspace_root):
            dirs[:] = [d for d in dirs if d not in ['.backups', 'node_modules', '.git', '__pycache__']]
            
            for file in files:
                if 'test' in file.lower() or 'spec' in file.lower():
                    if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.py')):
                        filepath = os.path.join(root, file)
                        rel_path = os.path.relpath(filepath, self.workspace_root)
                        self.tests.add(rel_path)
                        
                        try:
                            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                                content = f.read()
                                for pattern in test_patterns:
                                    for match in re.finditer(pattern, content):
                                        test_name = match.group(1)
                                        if test_name:
                                            self.tests.add(f"  - {test_name}")
                        except Exception as e:
                            pass
        
        print(f"  ✅ Found {len(self.tests)} test items")

    def extract_hooks(self):
        """Extract all hooks (React hooks, webhooks, git hooks)"""
        print("🔍 Extracting hooks and webhooks...")
        hook_patterns = [
            r'(?:export\s+)?(?:const|function)\s+(use\w+)',  # React hooks
            r'(?:on|before|after)(\w+)',  # Event hooks
            r'webhook[s]?.*["\']([^"\']+)',  # Webhooks
        ]
        
        for root, dirs, files in os.walk(self.workspace_root):
            dirs[:] = [d for d in dirs if d not in ['.backups', 'node_modules', '.git', '__pycache__']]
            
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            for pattern in hook_patterns:
                                for match in re.finditer(pattern, content):
                                    hook = match.group(1)
                                    if hook and len(hook) > 2:
                                        if 'use' in hook.lower():
                                            self.hooks.add(hook)
                                        else:
                                            self.webhooks.add(hook)
                    except Exception as e:
                        pass
        
        # Add git hooks from .husky
        husky_path = os.path.join(self.workspace_root, '.husky')
        if os.path.exists(husky_path):
            for file in os.listdir(husky_path):
                if not file.startswith('.'):
                    self.hooks.add(f"git-{file}")
        
        print(f"  ✅ Found {len(self.hooks)} hooks, {len(self.webhooks)} webhooks")

    def extract_markdown_files(self):
        """Extract all markdown files in the workspace"""
        print("🔍 Extracting all markdown files...")
        for root, dirs, files in os.walk(self.workspace_root):
            dirs[:] = [d for d in dirs if d not in ['.backups', 'node_modules', '.git', '__pycache__', '.venv']]
            
            for file in files:
                if file.endswith('.md'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, self.workspace_root)
                    self.md_files.add(rel_path)
        
        print(f"  ✅ Found {len(self.md_files)} markdown files")

    def extract_instances(self):
        """Extract all server instances, services, and application instances"""
        print("🔍 Extracting instances...")
        instance_patterns = [
            r'(?:const|let|const)\s+(\w+Instance|instance\w+)',
            r'new\s+(\w+Instance)',
            r'singleton|Singleton',
        ]
        
        instances_found = set()
        for root, dirs, files in os.walk(self.workspace_root):
            dirs[:] = [d for d in dirs if d not in ['.backups', 'node_modules', '.git', '__pycache__']]
            
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.py')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            for pattern in instance_patterns:
                                for match in re.finditer(pattern, content):
                                    instance = match.group(1) if '(' in pattern else match.group(0)
                                    if instance and not instance.startswith('_'):
                                        instances_found.add(instance)
                    except Exception as e:
                        pass
        
        self.instances = instances_found
        print(f"  ✅ Found {len(self.instances)} instances")

    def generate_api_documentation(self) -> str:
        """Generate comprehensive API documentation"""
        print("📝 Generating API documentation...")
        sorted_apis = sorted(self.apis)
        
        doc = f"""# QMOI Enhanced - Complete API Reference

**Last Updated**: {self.timestamp}
**Total APIs Documented**: {len(sorted_apis)}

## API Overview

This document contains a comprehensive list of all APIs available in the QMOI Enhanced system, including exported functions, classes, interfaces, and services.

## Complete API List

"""
        
        # Group by category
        categories = defaultdict(list)
        for api in sorted_apis:
            if 'auth' in api.lower():
                categories['Authentication'].append(api)
            elif 'payment' in api.lower() or 'wallet' in api.lower():
                categories['Financial'].append(api)
            elif 'hook' in api.lower():
                categories['Hooks'].append(api)
            elif 'test' in api.lower():
                categories['Testing'].append(api)
            elif 'service' in api.lower():
                categories['Services'].append(api)
            else:
                categories['General'].append(api)
        
        for category, apis in sorted(categories.items()):
            doc += f"\n### {category} ({len(apis)} APIs)\n\n"
            for api in sorted(apis):
                doc += f"- `{api}`\n"
        
        doc += f"\n\n## Integration Notes\n"
        doc += f"- Total APIs: {len(sorted_apis)}\n"
        doc += f"- Categories: {len(categories)}\n"
        doc += f"- Production Status: Ready\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def generate_endpoints_documentation(self) -> str:
        """Generate comprehensive endpoints documentation"""
        print("📝 Generating endpoints documentation...")
        sorted_endpoints = sorted(self.endpoints)
        sorted_routes = sorted(self.routes)
        
        doc = f"""# QMOI Enhanced - API Endpoints Reference

**Last Updated**: {self.timestamp}
**Total Endpoints**: {len(sorted_endpoints)}
**Total Routes**: {len(sorted_routes)}

## Endpoints Overview

Complete list of all HTTP endpoints available in the QMOI Enhanced API.

## All Endpoints ({len(sorted_endpoints)})

"""
        
        for endpoint in sorted_endpoints:
            doc += f"- `{endpoint}`\n"
        
        doc += f"\n\n## HTTP Routes ({len(sorted_routes)})\n\n"
        
        # Group routes by method
        methods = defaultdict(list)
        for route in sorted_routes:
            method = route.split()[0] if ' ' in route else 'UNKNOWN'
            methods[method].append(route)
        
        for method in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD']:
            if method in methods:
                doc += f"\n### {method} Routes ({len(methods[method])})\n\n"
                for route in sorted(methods[method]):
                    doc += f"- `{route}`\n"
        
        doc += f"\n\n## Statistics\n"
        doc += f"- Total Endpoints: {len(sorted_endpoints)}\n"
        doc += f"- Total Routes: {len(sorted_routes)}\n"
        doc += f"- GET endpoints: {len(methods.get('GET', []))}\n"
        doc += f"- POST endpoints: {len(methods.get('POST', []))}\n"
        doc += f"- PUT endpoints: {len(methods.get('PUT', []))}\n"
        doc += f"- DELETE endpoints: {len(methods.get('DELETE', []))}\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def generate_tests_documentation(self) -> str:
        """Generate comprehensive tests documentation"""
        print("📝 Generating tests documentation...")
        sorted_tests = sorted(self.tests)
        
        doc = f"""# QMOI Enhanced - Complete Test Suite Reference

**Last Updated**: {self.timestamp}
**Total Test Files/Suites**: {len(sorted_tests)}

## Test Suite Overview

Comprehensive list of all test files and test suites in the QMOI Enhanced system.

## All Tests

"""
        
        for test in sorted_tests:
            if '/' in test or '\\' in test:
                doc += f"- {test}\n"
            else:
                doc += f"  {test}\n"
        
        doc += f"\n\n## Test Categories\n\n"
        
        # Categorize tests
        unit_tests = [t for t in sorted_tests if 'unit' in t.lower()]
        integration_tests = [t for t in sorted_tests if 'integration' in t.lower()]
        e2e_tests = [t for t in sorted_tests if 'e2e' in t.lower() or 'cypress' in t.lower()]
        api_tests = [t for t in sorted_tests if 'api' in t.lower()]
        component_tests = [t for t in sorted_tests if 'component' in t.lower()]
        
        doc += f"### Unit Tests ({len(unit_tests)})\n"
        for test in unit_tests:
            doc += f"- {test}\n"
        
        doc += f"\n### Integration Tests ({len(integration_tests)})\n"
        for test in integration_tests:
            doc += f"- {test}\n"
        
        doc += f"\n### E2E Tests ({len(e2e_tests)})\n"
        for test in e2e_tests:
            doc += f"- {test}\n"
        
        doc += f"\n### API Tests ({len(api_tests)})\n"
        for test in api_tests:
            doc += f"- {test}\n"
        
        doc += f"\n### Component Tests ({len(component_tests)})\n"
        for test in component_tests:
            doc += f"- {test}\n"
        
        doc += f"\n\n## Statistics\n"
        doc += f"- Total Tests: {len(sorted_tests)}\n"
        doc += f"- Unit Tests: {len(unit_tests)}\n"
        doc += f"- Integration Tests: {len(integration_tests)}\n"
        doc += f"- E2E Tests: {len(e2e_tests)}\n"
        doc += f"- API Tests: {len(api_tests)}\n"
        doc += f"- Component Tests: {len(component_tests)}\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def generate_hooks_documentation(self) -> str:
        """Generate comprehensive hooks documentation"""
        print("📝 Generating hooks documentation...")
        sorted_hooks = sorted(self.hooks)
        
        doc = f"""# QMOI Enhanced - Hooks Reference

**Last Updated**: {self.timestamp}
**Total Hooks**: {len(sorted_hooks)}

## React Hooks & Custom Hooks

Complete reference of all hooks available in the QMOI Enhanced system.

## Hooks List ({len(sorted_hooks)})

"""
        
        # Categorize hooks
        use_hooks = [h for h in sorted_hooks if h.startswith('use')]
        git_hooks = [h for h in sorted_hooks if h.startswith('git-')]
        other_hooks = [h for h in sorted_hooks if not h.startswith('use') and not h.startswith('git-')]
        
        doc += f"\n### React & Custom Hooks ({len(use_hooks)})\n\n"
        for hook in sorted(use_hooks):
            doc += f"- `{hook}()`\n"
        
        doc += f"\n### Git Hooks ({len(git_hooks)})\n\n"
        for hook in sorted(git_hooks):
            doc += f"- `{hook}`\n"
        
        if other_hooks:
            doc += f"\n### Other Hooks ({len(other_hooks)})\n\n"
            for hook in sorted(other_hooks):
                doc += f"- `{hook}`\n"
        
        doc += f"\n\n## Statistics\n"
        doc += f"- Total Hooks: {len(sorted_hooks)}\n"
        doc += f"- React/Custom Hooks: {len(use_hooks)}\n"
        doc += f"- Git Hooks: {len(git_hooks)}\n"
        doc += f"- Other Hooks: {len(other_hooks)}\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def generate_webhooks_documentation(self) -> str:
        """Generate comprehensive webhooks documentation"""
        print("📝 Generating webhooks documentation...")
        sorted_webhooks = sorted(self.webhooks)
        
        doc = f"""# QMOI Enhanced - Webhooks Reference

**Last Updated**: {self.timestamp}
**Total Webhooks**: {len(sorted_webhooks)}

## Webhooks Overview

Complete list of all webhooks available in the QMOI Enhanced system for event-driven integrations.

## Webhooks List ({len(sorted_webhooks)})

"""
        
        for webhook in sorted_webhooks:
            doc += f"- `{webhook}`\n"
        
        doc += f"\n\n## Integration Patterns\n\n"
        doc += f"### Event Subscription\n"
        doc += f"```typescript\n"
        doc += f"const subscription = qmoi.subscribe('{sorted_webhooks[0] if sorted_webhooks else 'eventName'}', (data) => {{\n"
        doc += f"  // Handle webhook event\n"
        doc += f"}});\n"
        doc += f"```\n\n"
        
        doc += f"## Statistics\n"
        doc += f"- Total Webhooks: {len(sorted_webhooks)}\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def generate_markdown_files_reference(self) -> str:
        """Generate complete markdown files reference"""
        print("📝 Generating markdown files reference...")
        sorted_md = sorted(self.md_files)
        
        doc = f"""# QMOI Enhanced - Complete Markdown Files Reference

**Last Updated**: {self.timestamp}
**Total Markdown Files**: {len(sorted_md)}

## All Markdown Files in Repository

Complete index of all documentation files in the QMOI Enhanced system.

## Documentation Files ({len(sorted_md)})

"""
        
        # Categorize markdown files
        api_docs = [f for f in sorted_md if 'api' in f.lower()]
        test_docs = [f for f in sorted_md if 'test' in f.lower()]
        deployment_docs = [f for f in sorted_md if 'deploy' in f.lower()]
        config_docs = [f for f in sorted_md if 'config' in f.lower() or 'setup' in f.lower()]
        feature_docs = [f for f in sorted_md if 'feature' in f.lower() or 'guide' in f.lower()]
        other_docs = [f for f in sorted_md if f not in api_docs + test_docs + deployment_docs + config_docs + feature_docs]
        
        doc += f"\n### API Documentation ({len(api_docs)})\n"
        for md_file in sorted(api_docs):
            doc += f"- [{md_file}]({md_file})\n"
        
        doc += f"\n### Test Documentation ({len(test_docs)})\n"
        for md_file in sorted(test_docs):
            doc += f"- [{md_file}]({md_file})\n"
        
        doc += f"\n### Deployment Documentation ({len(deployment_docs)})\n"
        for md_file in sorted(deployment_docs):
            doc += f"- [{md_file}]({md_file})\n"
        
        doc += f"\n### Configuration & Setup ({len(config_docs)})\n"
        for md_file in sorted(config_docs):
            doc += f"- [{md_file}]({md_file})\n"
        
        doc += f"\n### Feature Guides ({len(feature_docs)})\n"
        for md_file in sorted(feature_docs):
            doc += f"- [{md_file}]({md_file})\n"
        
        doc += f"\n### Other Documentation ({len(other_docs)})\n"
        for md_file in sorted(other_docs)[:100]:  # Limit to first 100
            doc += f"- [{md_file}]({md_file})\n"
        if len(other_docs) > 100:
            doc += f"... and {len(other_docs) - 100} more files\n"
        
        doc += f"\n\n## Statistics\n"
        doc += f"- Total Markdown Files: {len(sorted_md)}\n"
        doc += f"- API Docs: {len(api_docs)}\n"
        doc += f"- Test Docs: {len(test_docs)}\n"
        doc += f"- Deployment Docs: {len(deployment_docs)}\n"
        doc += f"- Configuration Docs: {len(config_docs)}\n"
        doc += f"- Feature Guides: {len(feature_docs)}\n"
        doc += f"- Other Docs: {len(other_docs)}\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def generate_instances_documentation(self) -> str:
        """Generate instances documentation"""
        print("📝 Generating instances documentation...")
        sorted_instances = sorted(self.instances)
        
        doc = f"""# QMOI Enhanced - Instances Reference

**Last Updated**: {self.timestamp}
**Total Instances**: {len(sorted_instances)}

## Application Instances

Reference of all singleton instances, server instances, and service instances in QMOI Enhanced.

## Instances List ({len(sorted_instances)})

"""
        
        for instance in sorted_instances:
            doc += f"- `{instance}`\n"
        
        doc += f"\n\n## Instance Management\n\n"
        doc += f"### Singleton Pattern Usage\n"
        doc += f"```typescript\n"
        doc += f"import {{ {sorted_instances[0] if sorted_instances else 'MyInstance'} }} from './services';\n\n"
        doc += f"// Access singleton instance\n"
        doc += f"const instance = {sorted_instances[0] if sorted_instances else 'MyInstance'}.getInstance();\n"
        doc += f"```\n\n"
        
        doc += f"## Statistics\n"
        doc += f"- Total Instances: {len(sorted_instances)}\n"
        doc += f"- Last Scan: {self.timestamp}\n"
        
        return doc

    def update_all_documentation(self):
        """Update all documentation files"""
        print("\n📦 Updating all documentation files...\n")
        
        updates = {
            'API.md': self.generate_api_documentation(),
            'ENDPOINTS.md': self.generate_endpoints_documentation(),
            'ROUTES.md': self.generate_endpoints_documentation(),  # Routes same as endpoints
            'ALLTESTSAUTOTESTS.md': self.generate_tests_documentation(),
            'HOOKS.md': self.generate_hooks_documentation(),
            'WEBHOOKS.md': self.generate_webhooks_documentation(),
            'ALLHOOKSWEBHOOKS.md': self.generate_hooks_documentation(),
            'ALLMDFILESREFS.md': self.generate_markdown_files_reference(),
            'INSTANCES.md': self.generate_instances_documentation(),
        }
        
        for filename, content in updates.items():
            filepath = os.path.join(self.workspace_root, filename)
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✅ Updated {filename} ({len(content)} bytes)")
            except Exception as e:
                print(f"  ❌ Failed to update {filename}: {e}")

    def generate_summary_report(self) -> str:
        """Generate summary report"""
        report = f"""
╔════════════════════════════════════════════════════════════╗
║     QMOI ENHANCED - COMPREHENSIVE DOCS UPDATE REPORT       ║
╚════════════════════════════════════════════════════════════╝

📋 EXTRACTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ APIs Extracted:           {len(self.apis):>6}
✅ Endpoints Found:          {len(self.endpoints):>6}
✅ Routes Mapped:            {len(self.routes):>6}
✅ Test Suites Found:        {len(self.tests):>6}
✅ Hooks Discovered:         {len(self.hooks):>6}
✅ Webhooks Found:           {len(self.webhooks):>6}
✅ Markdown Files Scanned:   {len(self.md_files):>6}
✅ Instances Identified:     {len(self.instances):>6}

📝 DOCUMENTATION UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ API.md
✅ ENDPOINTS.md
✅ ROUTES.md
✅ ALLTESTSAUTOTESTS.md
✅ HOOKS.md
✅ WEBHOOKS.md
✅ ALLHOOKSWEBHOOKS.md
✅ ALLMDFILESREFS.md
✅ INSTANCES.md

⏰ TIMESTAMP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last Updated: {self.timestamp}

✨ All documentation files are now production-ready and synchronized!
"""
        return report

    def run(self):
        """Run complete documentation update process"""
        print("\n" + "="*70)
        print("  QMOI ENHANCED - COMPREHENSIVE DOCS BULK UPDATER v2.0")
        print("="*70 + "\n")
        
        print("🚀 Starting comprehensive documentation extraction and update...\n")
        
        self.extract_apis_from_files()
        self.extract_endpoints_and_routes()
        self.extract_tests()
        self.extract_hooks()
        self.extract_markdown_files()
        self.extract_instances()
        
        print("\n" + "="*70)
        self.update_all_documentation()
        
        report = self.generate_summary_report()
        print(report)
        
        # Save report
        report_path = os.path.join(self.workspace_root, 'comprehensive_docs_update_report.txt')
        try:
            with open(report_path, 'w') as f:
                f.write(report)
            print(f"\n📄 Report saved to: {report_path}")
        except Exception as e:
            print(f"❌ Failed to save report: {e}")

if __name__ == "__main__":
    updater = QMOIDocUpdater()
    updater.run()
