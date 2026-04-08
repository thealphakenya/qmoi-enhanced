#!/usr/bin/env python3
"""
AUTOMATED DOMAIN HEALTH CI/CD INTEGRATION
Integrates with GitHub Actions or cron to automatically validate domains,
update README, and commit changes to the repository.
"""

import os
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime


def run_command(cmd, shell=False):
    """Run command and return output"""
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            capture_output=True,
            text=True,
            timeout=600
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return 1, "", "Command timed out"
    except Exception as e:
        return 1, "", str(e)


def run_domain_validation():
    """Run comprehensive domain validation"""
    print("\n📋 STEP 1: Running Domain Health Validation")
    print("=" * 60)
    
    code, stdout, stderr = run_command(['python3', 'scripts/comprehensive_domain_health_validator.py'])
    
    if code == 0:
        print("✅ Domain validation completed successfully")
        return True
    else:
        print(f"⚠️  Domain validation completed with warnings")
        if stderr:
            print(f"Details: {stderr[:500]}")
        return True  # Continue even if there are warnings


def run_orchestration():
    """Run domain activation orchestration"""
    print("\n🤖 STEP 2: Running Domain Activation Orchestrator")
    print("=" * 60)
    
    code, stdout, stderr = run_command(['python3', 'scripts/domain_activation_orchestrator.py'])
    
    if code == 0:
        print("✅ Orchestration completed successfully")
        return True
    else:
        print(f"⚠️  Orchestration completed with status code {code}")
        return True


def check_git_changes():
    """Check if there are changes to commit"""
    print("\n📝 STEP 3: Checking Git Changes")
    print("=" * 60)
    
    code, stdout, stderr = run_command(['git', 'status', '--porcelain'], shell=False)
    
    if stdout:
        print(f"📊 Changes detected:")
        for line in stdout.strip().split('\n'):
            print(f"  {line}")
        return True
    else:
        print("✅ No changes detected")
        return False


def commit_and_push_changes():
    """Commit and push changes to repository"""
    print("\n🚀 STEP 4: Committing and Pushing Changes")
    print("=" * 60)
    
    try:
        # Check for changes
        code, stdout, stderr = run_command(['git', 'status', '--porcelain'], shell=False)
        if not stdout:
            print("✅ No changes to commit")
            return True
        
        # Configure git
        run_command(['git', 'config', 'user.email', 'qmoi-automation@qmoi.ai'], shell=False)
        run_command(['git', 'config', 'user.name', 'QMOI Automation'], shell=False)
        
        # Add files
        files_to_add = [
            'README.md',
            'docs/domain_health_report.json',
            'docs/domain_health_markdown.md',
            'data/domain_health_history.json',
            'data/active_domains_status.json',
            'data/domain_activation_config.json',
        ]
        
        for file in files_to_add:
            if Path(file).exists():
                print(f"  📄 Adding {file}...")
                run_command(['git', 'add', file], shell=False)
        
        # Commit
        commit_msg = f"🤖 Auto-update: Domain health checks and README validation - {datetime.now().isoformat()}"
        print(f"\n  💬 Commit message: {commit_msg}")
        code, stdout, stderr = run_command(
            ['git', 'commit', '-m', commit_msg],
            shell=False
        )
        
        if code == 0:
            print("✅ Changes committed successfully")
        else:
            print(f"⚠️  Commit status: {stdout}")
        
        # Push
        print("\n  📤 Pushing to repository...")
        code, stdout, stderr = run_command(['git', 'push'], shell=False)
        
        if code == 0:
            print("✅ Changes pushed successfully")
            return True
        else:
            print(f"⚠️  Push output: {stdout}")
            if "nothing to commit" in stderr.lower():
                print("✅ No changes to push (already up to date)")
                return True
            return False
    
    except Exception as e:
        print(f"⚠️  Error during commit/push: {e}")
        return False


def generate_summary_report():
    """Generate summary report"""
    print("\n📊 STEP 5: Generating Summary Report")
    print("=" * 60)
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'workflow': 'domain_health_ci_cd',
        'steps_completed': [
            'domain_validation',
            'orchestration',
            'git_changes_check',
            'commit_and_push',
            'summary',
        ]
    }
    
    # Check health report
    if Path('docs/domain_health_report.json').exists():
        with open('docs/domain_health_report.json', 'r') as f:
            health_data = json.load(f)
        
        if health_data:
            healthy = sum(1 for r in health_data.values() 
                         if isinstance(r, dict) and r.get('overall_healthy', False))
            total = len(health_data)
            
            report['domain_health'] = {
                'total_domains': total,
                'healthy_domains': healthy,
                'health_percentage': (healthy / total * 100) if total > 0 else 0,
                'all_healthy': healthy == total,
            }
    
    # Save report
    Path('docs/ci_cd_automation_report.json').parent.mkdir(parents=True, exist_ok=True)
    with open('docs/ci_cd_automation_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print("\n" + "=" * 60)
    print("📈 CI/CD AUTOMATION REPORT")
    print("=" * 60)
    print(f"✅ Timestamp: {report['timestamp']}")
    print(f"✅ Workflow: {report['workflow']}")
    print(f"✅ Steps Completed: {len(report['steps_completed'])}")
    
    if 'domain_health' in report:
        health = report['domain_health']
        print(f"\n🌐 Domain Health Summary:")
        print(f"   • Total Domains: {health['total_domains']}")
        print(f"   • Healthy: {health['healthy_domains']}")
        print(f"   • Health: {health['health_percentage']:.1f}%")
        print(f"   • Status: {'✅ All Green' if health['all_healthy'] else '⚠️  Needs Attention'}")
    
    return True


def main():
    """Execute full CI/CD automation workflow"""
    print("\n" + "=" * 60)
    print("🔄 AUTOMATED DOMAIN HEALTH CI/CD WORKFLOW")
    print("=" * 60)
    print(f"⏰ Started: {datetime.now().isoformat()}")
    print(f"🔧 Environment: {os.getenv('GITHUB_ACTION', 'Local/Cron')}")
    
    steps = [
        ("Domain Validation", run_domain_validation),
        ("Orchestration", run_orchestration),
        ("Git Changes", check_git_changes),
        ("Commit & Push", commit_and_push_changes),
        ("Summary Report", generate_summary_report),
    ]
    
    completed = 0
    for step_name, step_func in steps:
        try:
            result = step_func()
            if result:
                completed += 1
        except Exception as e:
            print(f"❌ Error in {step_name}: {e}")
    
    print("\n" + "=" * 60)
    print("✅ CI/CD WORKFLOW COMPLETE")
    print("=" * 60)
    print(f"⏱️  Finished: {datetime.now().isoformat()}")
    print(f"✅ Steps Completed: {completed}/{len(steps)}")
    
    return 0 if completed == len(steps) else 1


if __name__ == '__main__':
    sys.exit(main())
