#!/usr/bin/env python3
"""
Pipeline orchestrator for auto-enhance / auto-evolution tasks.

This script runs a safe pipeline in dry-run by default:
 - placeholder scans (existing scripts)
 - generate PAYED md (conservative)
 - expand todos
 - run auto release discovery (dry-run)
 - generate ALLCLONEDRELEASES.md
 - domain assignment (plan only)
 - run unit tests

Use `--apply` to persist applied artifacts where scripts permit it. Network
operations are gated and require explicit environment variables.
"""
from pathlib import Path
import subprocess
import sys
import argparse

ROOT = Path(__file__).resolve().parents[1]
QM_VALID = ROOT / '.qmoi_validation'
QM_VALID.mkdir(parents=True, exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument('--apply', action='store_true', help='Allow scripts to write applied outputs where supported')
parser.add_argument('--allow-network', action='store_true', help='Temporarily allow network operations for discovery')
args = parser.parse_args()

def run(cmd, cwd=ROOT):
    print('RUN:', ' '.join(cmd))
    return subprocess.run(cmd, cwd=cwd, check=False)

def main():
    # 1) Expand platform todos (idempotent)
    run([sys.executable, 'scripts/expand_platform_todos.py'])

    # 2) Generate PAYED md (conservative)
    gen_cmd = [sys.executable, 'scripts/generate_payed_md.py']
    if args.apply:
        gen_cmd.append('--force')
    run(gen_cmd)

    # 3) Run auto release manager (dry-run snapshot)
    arm_cmd = [sys.executable, 'scripts/auto_release_manager.py']
    if args.allow_network:
        arm_cmd.append('--allow-network')
    if args.apply:
        arm_cmd.append('--apply')
    run(arm_cmd)

    # 4) Create ALLCLONEDRELEASES.md
    run([sys.executable, 'scripts/all_cloned_releases.py'])

    # 5) Domain assignment plan
    da_cmd = [sys.executable, 'scripts/domain_assigner.py']
    if args.apply:
        da_cmd.append('--apply')
    run(da_cmd)

    # 6) Run unit tests using the lightweight runner
    run([sys.executable, 'scripts/run_unit_tests.py'])

    print('\nPipeline complete (dry-run by default). Check .qmoi_validation/ for artifacts.')

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Orchestrator for the qMOI auto-enhancement pipeline.

This script runs the key automation steps in a safe, dry-run-first manner:
 - run placeholder scans
 - generate PAYED md files (billing-gated)
 - expand platform todos
 - validate PAYED platforms
 - run lightweight unit tests

All outputs/logs are written under `.qmoi_validation/pipeline_runs/` with a
timestamped JSON summary plus captured stdout/stderr for each step.

By default this pipeline DOES NOT enable billing. To run with billing enabled
set `QMOI_ENABLE_BILLING=true` in the environment (NOT recommended in CI).
"""
from pathlib import Path
import subprocess
import json
import sys
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
VALIDATION = ROOT / '.qmoi_validation'
RUNS = VALIDATION / 'pipeline_runs'
RUNS.mkdir(parents=True, exist_ok=True)

STEPS = [
    { 'name': 'validate_credentials', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'validate_all_credentials.py')] },
    { 'name': 'placeholder_scans', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'run_placeholder_scans.py')] },
    { 'name': 'generate_payed_md', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'generate_payed_md.py'), '--run-gen-refs'] },
    { 'name': 'expand_platform_todos', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'expand_platform_todos.py')] },
    { 'name': 'validate_payed_platforms', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'validate_payed_platforms.py')] },
    # generate an up-to-date ALLLINKS index (dry-run by default)
    { 'name': 'generate_all_links', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'generate_all_links.py'), '--dry-run'] },
    # run link autoupdater plan generator (writes .qmoi_validation/link_update_plan.json)
    { 'name': 'link_autoupdater', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'link_autoupdater.py'), '--max-links', '2000'] },
    # produce a human preview from the autoupdater plan
    { 'name': 'link_apply_preview', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'link_apply_preview.py')] },
    # qCity platform enhancer (conservative, dry-run)
    { 'name': 'qcity_enhancer', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'qcity_enhancer.py')] },
    # lion feature enhancer (conservative, dry-run)
    { 'name': 'lion_feature_enhancer', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'lion_feature_enhancer.py')] },
    # update markdown references index
    { 'name': 'update_md_refs', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'update_md_refs.py'), '--apply'] },
    # final validation with unit tests
    { 'name': 'unit_tests', 'cmd': [sys.executable, str(ROOT / 'scripts' / 'run_unit_tests.py')] }
]

def run_step(step, retries=3):
    """Run a pipeline step with retry logic and detailed metrics."""
    name = step['name']
    cmd = step['cmd']
    metrics = {
        'attempts': 0,
        'total_duration': 0,
        'max_memory_mb': 0,
        'errors': []
    }
    
    import time
    import psutil
    import traceback
    
    for attempt in range(retries):
        metrics['attempts'] += 1
        start_time = time.time()
        process = psutil.Process()
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        try:
            print(f'Running step: {name} (attempt {attempt + 1}/{retries})')
            p = subprocess.run(cmd, capture_output=True, text=True, check=False)
            
            # Collect performance metrics
            end_time = time.time()
            duration = end_time - start_time
            metrics['total_duration'] += duration
            current_memory = process.memory_info().rss / 1024 / 1024  # MB
            metrics['max_memory_mb'] = max(metrics['max_memory_mb'], current_memory - initial_memory)
            
            result = {
                'name': name,
                'returncode': p.returncode,
                'stdout': p.stdout,
                'stderr': p.stderr,
                'metrics': metrics
            }
            
            # Write step-specific validation report
            validation_report = {
                'step': name,
                'success': p.returncode == 0,
                'performance': {
                    'duration_seconds': duration,
                    'memory_mb': current_memory - initial_memory
                },
                'output_validation': validate_step_output(name, p.stdout)
            }
            write_validation_report(name, validation_report)
            
            # Only retry on specific error conditions
            if p.returncode != 0:
                if "network" in p.stderr.lower() and attempt < retries - 1:
                    print(f"Network error detected, retrying {name}...")
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                if "timeout" in p.stderr.lower() and attempt < retries - 1:
                    print(f"Timeout detected, retrying {name}...")
                    time.sleep(2 ** attempt)
                    continue
            
            return result
            
        except Exception as e:
            metrics['errors'].append({
                'attempt': attempt + 1,
                'error': str(e),
                'traceback': traceback.format_exc()
            })
            if attempt < retries - 1:
                print(f"Error in {name}, retrying: {e}")
                time.sleep(2 ** attempt)
                continue
            return {'name': name, 'error': str(e), 'metrics': metrics}

def validate_step_output(step_name: str, output: str) -> dict:
    """Validate step-specific outputs and return validation results."""
    validations = {
        'validate_credentials': {
            'required_patterns': [
                r'Validation complete',
                r'Valid credentials:',
                r'credential_validation\.json'
            ],
            'warning_patterns': [
                r'error:.*',
                r'invalid:.*',
                r'missing:.*'
            ]
        },
        'qcity_enhancer': {
            'required_patterns': [
                r'analyzing .* manifests',
                r'generating suggestions',
                r'writing .* validation'
            ],
            'warning_patterns': [
                r'warning:.*',
                r'skipping .*'
            ]
        },
        'lion_feature_enhancer': {
            'required_patterns': [
                r'scanning for features',
                r'analyzing .* features',
                r'generating recommendations'
            ],
            'warning_patterns': [
                r'unmonitored feature:.*',
                r'high risk feature:.*'
            ]
        },
        'update_md_refs': {
            'required_patterns': [
                r'scanning workspace',
                r'updating references'
            ]
        }
    }
    
    import re
    results = {'passed': True, 'warnings': [], 'errors': []}
    
    if step_name in validations:
        v = validations[step_name]
        # Check required patterns
        if 'required_patterns' in v:
            for pattern in v['required_patterns']:
                if not re.search(pattern, output, re.IGNORECASE | re.MULTILINE):
                    results['passed'] = False
                    results['errors'].append(f'Missing required output: {pattern}')
        
        # Check warning patterns
        if 'warning_patterns' in v:
            for pattern in v['warning_patterns']:
                if re.search(pattern, output, re.IGNORECASE | re.MULTILINE):
                    results['warnings'].append(f'Warning pattern matched: {pattern}')
    
    return results

def write_validation_report(step_name: str, report: dict):
    """Write step-specific validation report to .qmoi_validation directory."""
    validation_dir = VALIDATION / 'step_validations'
    validation_dir.mkdir(exist_ok=True)
    
    import json
    report_file = validation_dir / f'{step_name}_validation.json'
    report_file.write_text(json.dumps(report, indent=2))

def check_production_readiness():
    """Verify production readiness across all components."""
    readiness = {
        'status': 'ready',
        'checks': [],
        'warnings': [],
        'blockers': []
    }
    
    # Check for required files
    required_files = [
        'docs/operations.md',
        '.qmoi_validation/qcity_enhancer.json',
        '.qmoi_validation/lion_feature_enhancer.json',
        '.qmoi_validation/credential_validation.json'
    ]

    # Check credential validation status
    cred_validation_file = ROOT / '.qmoi_validation/credential_validation.json'
    if cred_validation_file.exists():
        try:
            cred_status = json.loads(cred_validation_file.read_text())
            if cred_status.get('overall_status') != 'valid':
                readiness['status'] = 'blocked'
                readiness['blockers'].append(
                    'Credential validation failed. Check credentials for all systems.'
                )
                for service, result in cred_status.items():
                    if isinstance(result, dict) and not result.get('valid'):
                        readiness['blockers'].append(
                            f"{service} credentials invalid: {result.get('error')}"
                        )
        except Exception as e:
            readiness['status'] = 'warning'
            readiness['warnings'].append(f'Could not read credential validation: {e}')
    
    for f in required_files:
        if not (ROOT / f).exists():
            readiness['status'] = 'blocked'
            readiness['blockers'].append(f'Missing required file: {f}')
    
    # Check for test coverage
    test_dir = ROOT / 'tests'
    if not test_dir.exists() or not list(test_dir.glob('test_*.py')):
        readiness['status'] = 'blocked'
        readiness['blockers'].append('Missing unit tests')
    
    # Check for documentation
    docs_dir = ROOT / 'docs'
    if not (docs_dir / 'operations.md').exists():
        readiness['status'] = 'warning'
        readiness['warnings'].append('Missing operations documentation')
    
    return readiness

def main():
    started = datetime.utcnow().isoformat() + 'Z'
    
    # Check production readiness first
    readiness = check_production_readiness()
    if readiness['status'] == 'blocked':
        print('Production readiness check failed:')
        for blocker in readiness['blockers']:
            print(f'  - {blocker}')
        if '--force' not in sys.argv:
            print('Pipeline aborted. Use --force to run anyway.')
            return 1
    
    results = []
    for s in STEPS:
        r = run_step(s)
        results.append(r)
        if r.get('error') or r.get('returncode', 0) != 0:
            print(f'Step {s["name"]} failed:')
            if 'error' in r:
                print(f'  Error: {r["error"]}')
            if 'stderr' in r:
                print(f'  Details: {r["stderr"]}')
    
    finished = datetime.utcnow().isoformat() + 'Z'

    # Collect and analyze metrics
    metrics_summary = {
        'started_at': started,
        'finished_at': finished,
        'duration': (datetime.fromisoformat(finished.rstrip('Z')) - 
                    datetime.fromisoformat(started.rstrip('Z'))).total_seconds(),
        'steps': results,
        'production_metrics': {
            'success_rate': len([r for r in results if r.get('returncode', 1) == 0]) / len(results),
            'total_errors': sum(len(r.get('metrics', {}).get('errors', [])) for r in results),
            'performance': {
                'total_duration': sum(r.get('metrics', {}).get('total_duration', 0) for r in results),
                'max_memory': max(r.get('metrics', {}).get('max_memory_mb', 0) for r in results)
            },
            'warnings': sum(
                len(v.get('warnings', [])) 
                for r in results 
                if 'metrics' in r
                for v in r.get('metrics', {}).get('validations', [])
            )
        },
        'readiness_status': readiness
    }
    
    # Write detailed run summary
    run_id = datetime.utcnow().strftime('run_%Y%m%dT%H%M%SZ')
    fn = RUNS / f'{run_id}.json'
    fn.write_text(json.dumps(metrics_summary, indent=2), encoding='utf-8')
    
    # Write production metrics summary
    metrics_file = VALIDATION / 'production_metrics.json'
    try:
        if metrics_file.exists():
            historical_metrics = json.loads(metrics_file.read_text())
        else:
            historical_metrics = {'runs': []}
        
        historical_metrics['runs'].append({
            'id': run_id,
            'timestamp': finished,
            'success_rate': metrics_summary['production_metrics']['success_rate'],
            'total_errors': metrics_summary['production_metrics']['total_errors'],
            'duration': metrics_summary['duration'],
            'max_memory': metrics_summary['production_metrics']['performance']['max_memory']
        })
        
        # Keep only last 30 runs
        historical_metrics['runs'] = historical_metrics['runs'][-30:]
        
        metrics_file.write_text(json.dumps(historical_metrics, indent=2))
    except Exception as e:
        print(f'Warning: Failed to update historical metrics: {e}')
    
    print('\nPipeline Run Summary:')
    print(f'  Duration: {metrics_summary["duration"]:.1f}s')
    print(f'  Success Rate: {metrics_summary["production_metrics"]["success_rate"]*100:.1f}%')
    print(f'  Total Errors: {metrics_summary["production_metrics"]["total_errors"]}')
    print(f'  Max Memory Usage: {metrics_summary["production_metrics"]["performance"]["max_memory"]:.1f}MB')
    print(f'  Warnings: {metrics_summary["production_metrics"]["warnings"]}')
    print(f'\nDetailed run summary written to: {fn}')

if __name__ == '__main__':
    main()
