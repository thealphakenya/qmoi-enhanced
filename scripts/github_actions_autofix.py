#!/usr/bin/env python3
"""
GitHub Actions Auto-Fix Script
Automatically detects and fixes common GitHub Actions workflow issues
"""

import os
import sys
import json
import re
import subprocess
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import yaml
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/github_actions_autofix.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class GitHubActionsAutoFix:
    """Automated GitHub Actions issue detection and fixing"""
    
    def __init__(self):
        self.github_token = os.environ.get('GITHUB_TOKEN', '')
        self.repo_owner = os.environ.get('GITHUB_REPOSITORY_OWNER', 'thealphakenya')
        self.repo_name = os.environ.get('GITHUB_REPOSITORY', 'Alpha-Q-ai').split('/')[-1]
        self.workflows_dir = Path(".github/workflows")
        self.fixes_applied = []
        self.issues_found = []
        self.master_config = self.load_master_config()
        
    def load_master_config(self) -> Dict:
        """Load master configuration for GitHub Actions autofix"""
        config_path = Path("config/github_actions_config.json")
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        return {
            "auto_fix_enabled": True,
            "create_issues_for_unfixable": True,
            "validate_workflows": True,
            "fix_dependencies": True,
            "fix_permissions": True,
            "fix_secrets": True,
            "master_only_fixes": True,
            "backup_before_fix": True
        }
    
    def scan_workflow_files(self) -> List[Dict]:
        """Scan all workflow files for issues"""
        issues = []
        
        if not self.workflows_dir.exists():
            self.workflows_dir.mkdir(parents=True, exist_ok=True)
            return issues
        
        for workflow_file in self.workflows_dir.glob("*.yml"):
            try:
                with open(workflow_file, 'r') as f:
                    workflow_content = f.read()
                    workflow_yaml = yaml.safe_load(workflow_content)
                
                file_issues = self.analyze_workflow_file(workflow_file, workflow_yaml, workflow_content)
                issues.extend(file_issues)
                
            except yaml.YAMLError as e:
                issues.append({
                    'file': str(workflow_file),
                    'type': 'yaml_error',
                    'severity': 'high',
                    'message': f'YAML parsing error: {e}',
                    'line': None,
                    'fixable': True
                })
            except Exception as e:
                issues.append({
                    'file': str(workflow_file),
                    'type': 'file_error',
                    'severity': 'high',
                    'message': f'File reading error: {e}',
                    'line': None,
                    'fixable': False
                })
        
        return issues
    
    def analyze_workflow_file(self, file_path: Path, workflow_yaml: Dict, content: str) -> List[Dict]:
        """Analyze a single workflow file for issues"""
        issues = []
        
        # Check for common issues
        issues.extend(self.check_missing_permissions(workflow_yaml, file_path))
        issues.extend(self.check_deprecated_actions(workflow_yaml, file_path))
        issues.extend(self.check_missing_secrets(workflow_yaml, file_path))
        issues.extend(self.check_invalid_syntax(workflow_yaml, file_path))
        issues.extend(self.check_missing_dependencies(workflow_yaml, file_path))
        issues.extend(self.check_security_issues(workflow_yaml, file_path))
        issues.extend(self.check_performance_issues(workflow_yaml, file_path))
        
        return issues
    
    def check_missing_permissions(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for missing permissions in workflow"""
        issues = []
        
        if 'jobs' not in workflow:
            return issues
        
        for job_name, job in workflow['jobs'].items():
            if 'permissions' not in job:
                issues.append({
                    'file': str(file_path),
                    'type': 'missing_permissions',
                    'severity': 'medium',
                    'message': f'Job "{job_name}" missing permissions configuration',
                    'line': self.find_line_number(job, file_path),
                    'fixable': True,
                    'job': job_name
                })
        
        return issues
    
    def check_deprecated_actions(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for deprecated GitHub Actions"""
        deprecated_actions = {
            'actions/setup-node@v1': 'actions/setup-node@v3',
            'actions/checkout@v1': 'actions/checkout@v3',
            'actions/upload-artifact@v1': 'actions/upload-artifact@v3',
            'actions/download-artifact@v1': 'actions/download-artifact@v3',
            'actions/cache@v1': 'actions/cache@v3',
            'actions/github-script@v1': 'actions/github-script@v6'
        }
        
        issues = []
        
        if 'jobs' not in workflow:
            return issues
        
        for job_name, job in workflow['jobs'].items():
            if 'steps' not in job:
                continue
            
            for step in job['steps']:
                if 'uses' in step:
                    action = step['uses']
                    if action in deprecated_actions:
                        issues.append({
                            'file': str(file_path),
                            'type': 'deprecated_action',
                            'severity': 'medium',
                            'message': f'Deprecated action: {action} -> {deprecated_actions[action]}',
                            'line': self.find_line_number(step, file_path),
                            'fixable': True,
                            'action': action,
                            'recommended': deprecated_actions[action]
                        })
        
        return issues
    
    def check_missing_secrets(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for missing secrets in workflow"""
        issues = []
        
        if 'jobs' not in workflow:
            return issues
        
        for job_name, job in workflow['jobs'].items():
            if 'steps' not in job:
                continue
            
            for step in job['steps']:
                if 'env' in step:
                    for env_var, value in step['env'].items():
                        if isinstance(value, str) and value.startswith('${{') and 'secrets.' in value:
                            secret_name = value.split('secrets.')[1].split('}')[0]
                            if not self.secret_exists(secret_name):
                                issues.append({
                                    'file': str(file_path),
                                    'type': 'missing_secret',
                                    'severity': 'high',
                                    'message': f'Missing secret: {secret_name}',
                                    'line': self.find_line_number(step, file_path),
                                    'fixable': False,
                                    'secret': secret_name
                                })
        
        return issues
    
    def check_invalid_syntax(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for invalid syntax in workflow"""
        issues = []
        
        # Check for common syntax issues
        if 'on' not in workflow:
            issues.append({
                'file': str(file_path),
                'type': 'missing_trigger',
                'severity': 'high',
                'message': 'Workflow missing trigger configuration',
                'line': 1,
                'fixable': True
            })
        
        if 'jobs' not in workflow:
            issues.append({
                'file': str(file_path),
                'type': 'missing_jobs',
                'severity': 'high',
                'message': 'Workflow missing jobs configuration',
                'line': 1,
                'fixable': True
            })
        
        return issues
    
    def check_missing_dependencies(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for missing dependencies in workflow"""
        issues = []
        
        if 'jobs' not in workflow:
            return issues
        
        for job_name, job in workflow['jobs'].items():
            if 'runs-on' not in job:
                issues.append({
                    'file': str(file_path),
                    'type': 'missing_runs_on',
                    'severity': 'high',
                    'message': f'Job "{job_name}" missing runs-on configuration',
                    'line': self.find_line_number(job, file_path),
                    'fixable': True,
                    'job': job_name
                })
        
        return issues
    
    def check_security_issues(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for security issues in workflow"""
        issues = []
        
        if 'jobs' not in workflow:
            return issues
        
        for job_name, job in workflow['jobs'].items():
            if 'steps' not in job:
                continue
            
            for step in job['steps']:
                if 'run' in step:
                    run_command = step['run']
                    # Check for dangerous commands
                    dangerous_patterns = [
                        r'curl.*\|\s*bash',
                        r'wget.*\|\s*bash',
                        r'rm\s+-rf\s+/',
                        r'sudo\s+rm\s+-rf',
                        r'chmod\s+777'
                    ]
                    
                    for pattern in dangerous_patterns:
                        if re.search(pattern, run_command, re.IGNORECASE):
                            issues.append({
                                'file': str(file_path),
                                'type': 'security_issue',
                                'severity': 'high',
                                'message': f'Potentially dangerous command: {run_command.strip()}',
                                'line': self.find_line_number(step, file_path),
                                'fixable': True,
                                'command': run_command.strip()
                            })
        
        return issues
    
    def check_performance_issues(self, workflow: Dict, file_path: Path) -> List[Dict]:
        """Check for performance issues in workflow"""
        issues = []
        
        if 'jobs' not in workflow:
            return issues
        
        for job_name, job in workflow['jobs'].items():
            # Check for missing caching
            has_cache = False
            if 'steps' in job:
                for step in job['steps']:
                    if 'uses' in step and 'actions/cache' in step['uses']:
                        has_cache = True
                        break
            
            if not has_cache and 'runs-on' in job and 'ubuntu' in job['runs-on']:
                issues.append({
                    'file': str(file_path),
                    'type': 'missing_cache',
                    'severity': 'low',
                    'message': f'Job "{job_name}" missing cache configuration for better performance',
                    'line': self.find_line_number(job, file_path),
                    'fixable': True,
                    'job': job_name
                })
        
        return issues
    
    def find_line_number(self, item: Dict, file_path: Path) -> Optional[int]:
        """Find line number for an item in the file"""
        try:
            with open(file_path, 'r') as f:
                lines = f.readlines()
            
            # Simple line finding - can be enhanced
            for i, line in enumerate(lines, 1):
                if any(key in line for key in item.keys()):
                    return i
            
            return None
        except Exception:
            return None
    
    def secret_exists(self, secret_name: str) -> bool:
        """Check if a secret exists in the repository"""
        if not self.github_token:
            return False
        
        headers = {'Authorization': f'token {self.github_token}'}
        url = f'https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/actions/secrets'
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                secrets = response.json()['secrets']
                return any(secret['name'] == secret_name for secret in secrets)
        except Exception as e:
            logger.warning(f"Failed to check secret {secret_name}: {e}")
        
        return False
    
    def apply_fixes(self, issues: List[Dict]) -> List[Dict]:
        """Apply fixes to workflow files"""
        if not self.master_config['auto_fix_enabled']:
            return []
        
        fixes_applied = []
        
        for issue in issues:
            if not issue.get('fixable', False):
                continue
            
            try:
                if issue['type'] == 'missing_permissions':
                    fix = self.fix_missing_permissions(issue)
                elif issue['type'] == 'deprecated_action':
                    fix = self.fix_deprecated_action(issue)
                elif issue['type'] == 'missing_trigger':
                    fix = self.fix_missing_trigger(issue)
                elif issue['type'] == 'missing_jobs':
                    fix = self.fix_missing_jobs(issue)
                elif issue['type'] == 'missing_runs_on':
                    fix = self.fix_missing_runs_on(issue)
                elif issue['type'] == 'security_issue':
                    fix = self.fix_security_issue(issue)
                elif issue['type'] == 'missing_cache':
                    fix = self.fix_missing_cache(issue)
                else:
                    continue
                
                if fix:
                    fixes_applied.append(fix)
                    
            except Exception as e:
                logger.error(f"Failed to apply fix for {issue['type']}: {e}")
        
        return fixes_applied
    
    def fix_missing_permissions(self, issue: Dict) -> Optional[Dict]:
        """Fix missing permissions in workflow"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                workflow = yaml.safe_load(content)
            
            # Add permissions to the job
            job_name = issue['job']
            if 'jobs' in workflow and job_name in workflow['jobs']:
                workflow['jobs'][job_name]['permissions'] = {
                    'contents': 'read',
                    'actions': 'read',
                    'security-events': 'read'
                }
            
            # Write back
            with open(file_path, 'w') as f:
                yaml.dump(workflow, f, default_flow_style=False, sort_keys=False)
            
            return {
                'type': 'missing_permissions',
                'file': str(file_path),
                'job': job_name,
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix missing permissions: {e}")
            return None
    
    def fix_deprecated_action(self, issue: Dict) -> Optional[Dict]:
        """Fix deprecated action in workflow"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            # Replace deprecated action
            old_action = issue['action']
            new_action = issue['recommended']
            content = content.replace(old_action, new_action)
            
            # Write back
            with open(file_path, 'w') as f:
                f.write(content)
            
            return {
                'type': 'deprecated_action',
                'file': str(file_path),
                'old_action': old_action,
                'new_action': new_action,
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix deprecated action: {e}")
            return None
    
    def fix_missing_trigger(self, issue: Dict) -> Optional[Dict]:
        """Fix missing trigger in workflow"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                workflow = yaml.safe_load(content)
            
            # Add default trigger
            workflow['on'] = ['push', 'pull_request']
            
            # Write back
            with open(file_path, 'w') as f:
                yaml.dump(workflow, f, default_flow_style=False, sort_keys=False)
            
            return {
                'type': 'missing_trigger',
                'file': str(file_path),
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix missing trigger: {e}")
            return None
    
    def fix_missing_jobs(self, issue: Dict) -> Optional[Dict]:
        """Fix missing jobs in workflow"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                workflow = yaml.safe_load(content)
            
            # Add default job
            workflow['jobs'] = {
                'build': {
                    'runs-on': 'ubuntu-latest',
                    'steps': [
                        {
                            'name': 'Checkout',
                            'uses': 'actions/checkout@v3'
                        },
                        {
                            'name': 'Setup Node.js',
                            'uses': 'actions/setup-node@v3',
                            'with': {
                                'node-version': '18'
                            }
                        },
                        {
                            'name': 'Install dependencies',
                            'run': 'npm install'
                        },
                        {
                            'name': 'Run tests',
                            'run': 'npm test'
                        }
                    ]
                }
            }
            
            # Write back
            with open(file_path, 'w') as f:
                yaml.dump(workflow, f, default_flow_style=False, sort_keys=False)
            
            return {
                'type': 'missing_jobs',
                'file': str(file_path),
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix missing jobs: {e}")
            return None
    
    def fix_missing_runs_on(self, issue: Dict) -> Optional[Dict]:
        """Fix missing runs-on in job"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                workflow = yaml.safe_load(content)
            
            # Add runs-on to the job
            job_name = issue['job']
            if 'jobs' in workflow and job_name in workflow['jobs']:
                workflow['jobs'][job_name]['runs-on'] = 'ubuntu-latest'
            
            # Write back
            with open(file_path, 'w') as f:
                yaml.dump(workflow, f, default_flow_style=False, sort_keys=False)
            
            return {
                'type': 'missing_runs_on',
                'file': str(file_path),
                'job': job_name,
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix missing runs-on: {e}")
            return None
    
    def fix_security_issue(self, issue: Dict) -> Optional[Dict]:
        """Fix security issue in workflow"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            # Replace dangerous commands with safer alternatives
            dangerous_command = issue['command']
            safe_alternatives = {
                r'curl.*\|\s*bash': 'curl -fsSL | bash -s -- --dry-run',
                r'wget.*\|\s*bash': 'wget -qO- | bash -s -- --dry-run',
                r'rm\s+-rf\s+/': 'rm -rf ./temp',
                r'sudo\s+rm\s+-rf': 'rm -rf ./temp',
                r'chmod\s+777': 'chmod 755'
            }
            
            for pattern, replacement in safe_alternatives.items():
                if re.search(pattern, dangerous_command, re.IGNORECASE):
                    content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
                    break
            
            # Write back
            with open(file_path, 'w') as f:
                f.write(content)
            
            return {
                'type': 'security_issue',
                'file': str(file_path),
                'command': dangerous_command,
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix security issue: {e}")
            return None
    
    def fix_missing_cache(self, issue: Dict) -> Optional[Dict]:
        """Fix missing cache in workflow"""
        file_path = Path(issue['file'])
        
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                workflow = yaml.safe_load(content)
            
            # Add cache step to the job
            job_name = issue['job']
            if 'jobs' in workflow and job_name in workflow['jobs']:
                cache_step = {
                    'name': 'Cache dependencies',
                    'uses': 'actions/cache@v3',
                    'with': {
                        'path': '~/.npm',
                        'key': '${{ runner.os }}-node-${{ hashFiles(\'**/package-lock.json\') }}',
                        'restore-keys': '|${{ runner.os }}-node-'
                    }
                }
                
                # Insert cache step after checkout
                steps = workflow['jobs'][job_name]['steps']
                for i, step in enumerate(steps):
                    if 'uses' in step and 'actions/checkout' in step['uses']:
                        steps.insert(i + 1, cache_step)
                        break
            
            # Write back
            with open(file_path, 'w') as f:
                yaml.dump(workflow, f, default_flow_style=False, sort_keys=False)
            
            return {
                'type': 'missing_cache',
                'file': str(file_path),
                'job': job_name,
                'status': 'fixed'
            }
            
        except Exception as e:
            logger.error(f"Failed to fix missing cache: {e}")
            return None
    
    def create_github_issue(self, issue: Dict) -> bool:
        """Create GitHub issue for unfixable problems"""
        if not self.master_config['create_issues_for_unfixable'] or not self.github_token:
            return False
        
        headers = {
            'Authorization': f'token {self.github_token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        
        url = f'https://api.github.com/repos/{self.repo_owner}/{self.repo_name}/issues'
        
        issue_data = {
            'title': f'[AutoFix] {issue["type"].replace("_", " ").title()}: {issue["message"]}',
            'body': f'''## GitHub Actions AutoFix Issue

**File:** {issue['file']}
**Type:** {issue['type']}
**Severity:** {issue['severity']}
**Message:** {issue['message']}

This issue was automatically detected by the QMOI GitHub Actions AutoFix system.

### Recommended Action
{self.get_recommendation_for_issue(issue)}

### Technical Details
- Line: {issue.get('line', 'Unknown')}
- Fixable: {issue.get('fixable', False)}
- Detected: {datetime.now().isoformat()}

Please review and address this issue manually.
''',
            'labels': ['autofix', 'github-actions', issue['severity']]
        }
        
        try:
            response = requests.post(url, headers=headers, json=issue_data)
            return response.status_code == 201
        except Exception as e:
            logger.error(f"Failed to create GitHub issue: {e}")
            return False
    
    def get_recommendation_for_issue(self, issue: Dict) -> str:
        """Get recommendation for an issue"""
        recommendations = {
            'missing_secret': 'Add the missing secret to the repository settings.',
            'yaml_error': 'Fix the YAML syntax error in the workflow file.',
            'file_error': 'Check file permissions and ensure the file is accessible.',
            'security_issue': 'Review and replace the dangerous command with a safer alternative.'
        }
        
        return recommendations.get(issue['type'], 'Review the issue and apply appropriate fixes.')
    
    def run_autofix(self) -> Dict:
        """Run complete GitHub Actions autofix"""
        logger.info("Starting GitHub Actions autofix")
        
        # Scan for issues
        issues = self.scan_workflow_files()
        
        # Apply fixes
        fixes_applied = self.apply_fixes(issues)
        
        # Create issues for unfixable problems
        issues_created = 0
        for issue in issues:
            if not issue.get('fixable', False):
                if self.create_github_issue(issue):
                    issues_created += 1
        
        # Generate report
        report = {
            'timestamp': datetime.now().isoformat(),
            'issues_found': len(issues),
            'issues_by_type': self.group_issues_by_type(issues),
            'fixes_applied': len(fixes_applied),
            'fixes_details': fixes_applied,
            'issues_created': issues_created,
            'unfixable_issues': [i for i in issues if not i.get('fixable', False)],
            'recommendations': self.generate_recommendations(issues, fixes_applied)
        }
        
        # Save report
        report_path = Path("reports/github_actions_autofix_report.json")
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report
    
    def group_issues_by_type(self, issues: List[Dict]) -> Dict:
        """Group issues by type"""
        grouped = {}
        for issue in issues:
            issue_type = issue['type']
            if issue_type not in grouped:
                grouped[issue_type] = []
            grouped[issue_type].append(issue)
        return grouped
    
    def generate_recommendations(self, issues: List[Dict], fixes: List[Dict]) -> List[str]:
        """Generate recommendations based on issues and fixes"""
        recommendations = []
        
        if len(issues) == 0:
            recommendations.append("No issues found - workflows are in good condition")
        else:
            recommendations.append(f"Found {len(issues)} issues, applied {len(fixes)} fixes")
        
        if len([i for i in issues if not i.get('fixable', False)]) > 0:
            recommendations.append("Review unfixable issues and address them manually")
        
        if len([i for i in issues if i['severity'] == 'high']) > 0:
            recommendations.append("Address high severity issues immediately")
        
        recommendations.extend([
            "Regularly run this autofix script to maintain workflow health",
            "Set up automated workflow validation in CI/CD pipeline",
            "Review and update dependencies regularly"
        ])
        
        return recommendations

def main():
    """Main GitHub Actions autofix runner"""
    logger.info("Starting GitHub Actions AutoFix")
    
    autofix = GitHubActionsAutoFix()
    report = autofix.run_autofix()
    
    # Print summary
    print("\n" + "="*50)
    print("GitHub Actions AutoFix Report")
    print("="*50)
    print(f"Issues Found: {report['issues_found']}")
    print(f"Fixes Applied: {report['fixes_applied']}")
    print(f"Issues Created: {report['issues_created']}")
    print(f"Unfixable Issues: {len(report['unfixable_issues'])}")
    print("="*50)
    
    if report['issues_by_type']:
        print("\nIssues by Type:")
        for issue_type, issues in report['issues_by_type'].items():
            print(f"  {issue_type}: {len(issues)}")
    
    if report['recommendations']:
        print("\nRecommendations:")
        for rec in report['recommendations']:
            print(f"  - {rec}")
    
    logger.info("GitHub Actions AutoFix completed")

if __name__ == "__main__":
    main() 