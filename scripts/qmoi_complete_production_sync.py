#!/usr/bin/env python3
"""
QMOI Complete Production Sync - Master Orchestrator
Runs all update scripts in proper sequence for complete production hardening
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict

ROOT = Path(__file__).resolve().parent.parent

class ProductionSyncOrchestrator:
    """Orchestrates all production synchronization tasks"""
    
    def __init__(self):
        self.start_time = datetime.now()
        self.results = {}
        self.failed_steps = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime('%H:%M:%S')
        prefix = {
            'INFO': '✅',
            'WARN': '⚠️ ',
            'ERROR': '❌',
            'STEP': '🔄'
        }.get(level, '•')
        print(f"[{timestamp}] {prefix} {message}")
    
    def run_script(self, script_name: str, args: List[str] = None) -> bool:
        """Run a Python script and capture output"""
        script_path = ROOT / 'scripts' / f'{script_name}.py'
        
        if not script_path.exists():
            self.log(f"Script not found: {script_name}", 'ERROR')
            self.failed_steps.append(script_name)
            return False
        
        try:
            cmd = ['python3', str(script_path)]
            if args:
                cmd.extend(args)
            
            self.log(f"Running: {script_name}", 'STEP')
            result = subprocess.run(
                cmd,
                cwd=str(ROOT),
                capture_output=True,
                timeout=300,
                text=True
            )
            
            if result.returncode == 0:
                self.log(f"✓ {script_name} completed successfully")
                self.results[script_name] = 'SUCCESS'
                return True
            else:
                self.log(f"Script returned code {result.returncode}", 'WARN')
                if result.stderr:
                    self.log(f"Error: {result.stderr[:200]}", 'WARN')
                self.results[script_name] = f'FAILED (code {result.returncode})'
                self.failed_steps.append(script_name)
                return False
                
        except subprocess.TimeoutExpired:
            self.log(f"Timeout executing {script_name}", 'ERROR')
            self.results[script_name] = 'TIMEOUT'
            self.failed_steps.append(script_name)
            return False
        except Exception as e:
            self.log(f"Exception: {e}", 'ERROR')
            self.results[script_name] = str(e)
            self.failed_steps.append(script_name)
            return False
    
    def verify_file_exists(self, rel_path: str) -> bool:
        """Verify a file exists in repository"""
        file_path = ROOT / rel_path
        exists = file_path.exists()
        status = "✓" if exists else "✗"
        self.log(f"Verify {status} {rel_path}")
        return exists
    
    def run_sync_pipeline(self):
        """Execute complete production synchronization"""
        print(f"\n{'='*80}")
        print("QMOI COMPLETE PRODUCTION SYNC - MASTER ORCHESTRATOR")
        print(f"{'='*80}")
        print(f"Started: {self.start_time.strftime('%Y-%m-%d %H:%M:%S UTC')}\n")
        
        # Phase 1: Markdown Auto-Updates
        print(f"\n{'─'*80}")
        print("PHASE 1: MARKDOWN DOCUMENTATION AUTO-UPDATE")
        print(f"{'─'*80}")
        self.run_script('qmoi_md_autoupdater', ['--skip-lion'])
        
        # Phase 2: Health Artifact Generation
        print(f"\n{'─'*80}")
        print("PHASE 2: HEALTH ARTIFACT GENERATION")
        print(f"{'─'*80}")
        self.run_script('generate_allhealths')
        self.verify_file_exists('ALLHEALTHS.md')
        
        # Phase 3: Production Readiness Audit
        print(f"\n{'─'*80}")
        print("PHASE 3: PRODUCTION READINESS AUDIT")
        print(f"{'─'*80}")
        self.run_script('production_readiness_audit')
        
        # Phase 4: Auto-Update Matches & Undone
        print(f"\n{'─'*80}")
        print("PHASE 4: AUTO-UPDATE TRACKING FILES")
        print(f"{'─'*80}")
        self.run_script('auto_update_matches_undone')
        self.verify_file_exists('MATCHES.md')
        self.verify_file_exists('undone.txt')
        
        # Generate final report
        print(f"\n{'='*80}")
        self.generate_final_report()
    
    def generate_final_report(self):
        """Generate comprehensive final report"""
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        report = [
            f"\n{'='*80}",
            "PRODUCTION SYNC FINAL REPORT",
            f"{'='*80}",
            f"Start Time:    {self.start_time.strftime('%Y-%m-%d %H:%M:%S UTC')}",
            f"End Time:      {end_time.strftime('%Y-%m-%d %H:%M:%S UTC')}",
            f"Duration:      {duration:.1f} seconds ({duration/60:.1f} minutes)",
            f"",
            "EXECUTION RESULTS:",
        ]
        
        # Add results
        for script_name, result in self.results.items():
            status_icon = "✅" if result == 'SUCCESS' else "❌"
            report.append(f"  {status_icon} {script_name:40s} {result}")
        
        # Summary
        total_scripts = len(self.results)
        passed = sum(1 for r in self.results.values() if r == 'SUCCESS')
        
        report.extend([
            f"",
            f"SUMMARY:",
            f"  Total Tasks:   {total_scripts}",
            f"  Passed:        {passed}",
            f"  Failed:        {len(self.failed_steps)}",
            f"  Success Rate:  {100*passed/total_scripts:.1f}%",
            f"",
        ])
        
        if self.failed_steps:
            report.append("FAILED STEPS:")
            for step in self.failed_steps:
                report.append(f"  • {step}")
            report.append("")
        
        # Next steps
        report.extend([
            "NEXT STEPS:",
            "  1. Review generated files:",
            "     - MATCHES.md (prioritized implementation work)",
            "     - undone.txt (remaining nonproduction patterns)",
            "     - ALLHEALTHS.md (health system inventory)",
            "",
            "  2. For bulk production fixes, run:",
            "     python3 scripts/bulk_production_fixer.py --dry-run",
            "     (review report, then run with --execute)",
            "",
            "  3. Commit and push changes:",
            "     git add -A",
            "     git commit -m 'QMOI: Production sync complete'",
            "     git push origin autosync-backup-20250926-232440",
            "",
            f"{'='*80}\n",
        ])
        
        report_text = '\n'.join(report)
        print(report_text)
        
        # Save report to file
        report_file = ROOT / f'sync_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt'
        report_file.write_text(report_text + '\n')
        print(f"📄 Full report saved: {report_file.name}")

def main():
    orchestrator = ProductionSyncOrchestrator()
    
    try:
        orchestrator.run_sync_pipeline()
        
        # Exit with appropriate code
        if orchestrator.failed_steps:
            sys.exit(1)
        else:
            print("\n✅ ALL SYNCHRONIZATION TASKS COMPLETED SUCCESSFULLY\n")
            sys.exit(0)
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Execution interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
