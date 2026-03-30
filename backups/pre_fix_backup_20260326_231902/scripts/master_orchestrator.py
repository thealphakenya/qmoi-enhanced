// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
[production READY] Master Execution Orchestrator
Coordinates all production readiness tasks in optimal sequence
"""

import subprocess
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

WORKSPACE_ROOT = Path('/workspaces/qmoi-enhanced')
RESULTS_DIR = WORKSPACE_ROOT / 'results'

class MasterExecutionOrchestrator:
    def __init__(self):
        self.start_time = datetime.now()
        self.tasks = []
        self.results = {}
        self.failed_tasks = []
        RESULTS_DIR.mkdir(exist_ok=True)

    def add_task(self, name: str, command: List[str], description: str, 
                 critical: bool = False, timeout: int = 300):
        """Add a task to the orchestration queue"""
        self.tasks.append({
            'name': name,
            'command': command,
            'description': description,
            'critical': critical,
            'timeout': timeout,
            'status': 'pending'
        })

    def execute_task(self, task: Dict) -> Tuple[bool, str]:
        """Execute single task with monitoring"""
        print(f"\n{'='*70}")
        print(f"▶️  Task: {task['name']}")
        print(f"{'='*70}")
        print(f"Description: {task['description']}")
        print()
        
        try:
            result = subprocess.run(
                task['command'],
                cwd=str(WORKSPACE_ROOT),
                capture_output=True,
                text=True,
                timeout=task['timeout']
            )
            
            output = result.stdout[:300] if result.stdout else ""
            
            if result.returncode == 0:
                print(f"✅ PASSED - {task['name']}")
                if output:
                    print(output[:200])
                return True, output
            else:
                error = result.stderr[:300] if result.stderr else "Unknown error"
                print(f"❌ FAILED - {task['name']}")
                if error:
                    print(f"Error: {error[:200]}")
                return False, error
                
        except subprocess.TimeoutExpired:
            print(f"⏱️  TIMEOUT - {task['name']}")
            return False, "Command timed out"
        except Exception as e:
            print(f"❌ ERROR - {str(e)}")
            return False, str(e)

    def setup_tasks(self):
        """Define all production readiness tasks"""
        
        self.add_task(
            name="Link Discovery & Validation",
            command=['python3', 'scripts/validate_links.py'],
            description="Scan all files for URLs and validate",
            critical=True,
            timeout=300
        )
        
        self.add_task(
            name="Marker Detection",
            command=['python3', 'scripts/scan_production_endpoints.py', '--aggressive'],
            description="Find all production markers",
            critical=True,
            timeout=300
        )
        
        self.add_task(
            name="TypeScript Verification",
            command=['npm', 'run', 'type-check'],
            description="Verify TypeScript compilation",
            critical=True,
            timeout=120
        )

    def run_orchestra(self):
        """Execute all tasks in orchestrated sequence"""
        print("\n╔════════════════════════════════════════════════════════════════════╗")
        print("║  QMOI ENHANCED - MASTER EXECUTION ORCHESTRATOR                     ║")
        print(f"║  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}                              ║")
        print(f"║  Total Tasks: {len(self.tasks)}                                                    ║")
        print("╚════════════════════════════════════════════════════════════════════╝")
        
        for i, task in enumerate(self.tasks, 1):
            print(f"\n[{i}/{len(self.tasks)}] Running task...")
            success, output = self.execute_task(task)
            
            task['status'] = 'passed' if success else 'failed'
            self.results[task['name']] = {'status': task['status']}
            
            if not success and task['critical']:
                self.failed_tasks.append(task['name'])
        
        self.print_summary()

    def print_summary(self):
        """Print execution summary"""
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        passed_count = len([t for t in self.tasks if t['status'] == 'passed'])
        total_count = len(self.tasks)
        
        print("\n" + "="*70)
        print("EXECUTION SUMMARY")
        print("="*70)
        print(f"Duration: {duration:.2f}s | Completed: {passed_count}/{total_count} tasks")
        
        for task in self.tasks:
            emoji = '✅' if task['status'] == 'passed' else '❌'
            print(f"  {emoji} {task['name']}")
        
        overall = 'SUCCESS'  if len(self.failed_tasks) == 0 else 'PARTIAL'
        print(f"\nStatus: {overall}")
        print("="*70 + "\n")
        
        return len(self.failed_tasks) == 0

    def run(self):
        """Main execution"""
        try:
            self.setup_tasks()
            success = self.run_orchestra()
            return 0 if success else 1
        except Exception as e:
            print(f"\n❌ Error: {e}\n")
            return 1


if __name__ == '__main__':
    orchestrator = MasterExecutionOrchestrator()
    sys.exit(orchestrator.run())
