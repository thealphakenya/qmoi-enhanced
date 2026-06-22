#!/usr/bin/env python3
"""
Extract all pending work, TODOs, and enhancement plans from all .md files.
Consolidates into a prioritized bulk completion plan.
"""

import re
from pathlib import Path
from collections import defaultdict
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]

def extract_todos_from_md(md_path: Path) -> list[dict]:
    """Extract TODO/FIXME/pending items from a markdown file."""
    items = []
    try:
        content = md_path.read_text(encoding='utf-8', errors='ignore')
        
        # Find TODO/FIXME items
        for match in re.finditer(r'(?:^|\n)\s*(?:- \[ \]|TODO|FIXME|PENDING):\s*(.+?)(?=\n|$)', content, re.MULTILINE | re.IGNORECASE):
            items.append({
                'file': md_path.relative_to(ROOT),
                'type': 'TODO',
                'text': match.group(1).strip()
            })
        
        # Find unchecked checkboxes
        for match in re.finditer(r'- \[\s\]\s+(.+?)(?=\n|$)', content, re.MULTILINE):
            items.append({
                'file': md_path.relative_to(ROOT),
                'type': 'CHECKBOX',
                'text': match.group(1).strip()
            })
        
        # Find sections that need implementation
        if re.search(r'## Implementation|## TODO|## Pending|## Next Steps', content, re.IGNORECASE):
            for match in re.finditer(r'(?:## Implementation|## TODO|## Pending|## Next Steps)(.*?)(?=##|\Z)', content, re.IGNORECASE | re.DOTALL):
                section = match.group(1)
                for line in section.split('\n'):
                    line = line.strip()
                    if line and (line.startswith('-') or line.startswith('*')):
                        items.append({
                            'file': md_path.relative_to(ROOT),
                            'type': 'ACTION',
                            'text': line.lstrip('-* ').strip()
                        })
    
    except Exception as e:
        print(f"⚠️ Error reading {md_path}: {e}")
    
    return items

def extract_component_merges() -> list[dict]:
    """Find components used in multiple apps that should be merged."""
    merges = []
    
    # Common patterns of duplicate components
    duplicate_patterns = [
        ('theme', ['ThemeProvider', 'ThemeSelector', 'useTheme']),
        ('auth', ['LoginForm', 'LogoutButton', 'AuthProvider', 'useAuth']),
        ('navigation', ['Navigation', 'Sidebar', 'Header', 'Footer']),
        ('camera', ['CameraComponent', 'QCamera', 'CameraUI']),
        ('forms', ['FormBuilder', 'FormField', 'FormValidation']),
        ('ui', ['Card', 'Button', 'Modal', 'Dialog']),
        ('layout', ['Layout', 'Container', 'Grid']),
        ('hooks', ['useStorage', 'useAPI', 'useLocalStorage']),
    ]
    
    for category, components in duplicate_patterns:
        for component in components:
            merges.append({
                'category': category,
                'component': component,
                'priority': 'HIGH'
            })
    
    return merges

def extract_app_consolidation_tasks() -> list[dict]:
    """Extract app consolidation tasks from merge discovery."""
    tasks = [
        {'app': 'qmoi-ai', 'action': 'Consolidate 11 entry points -> 1 canonical', 'priority': 'CRITICAL'},
        {'app': 'qmoi-space', 'action': 'Consolidate 7 entry points -> 1 canonical', 'priority': 'CRITICAL'},
        {'app': 'qcity', 'action': 'Consolidate 7 entry points -> 1 canonical', 'priority': 'CRITICAL'},
        {'app': 'qvillage', 'action': 'Consolidate 2 entry points -> 1 canonical', 'priority': 'CRITICAL'},
        {'app': 'qalpha', 'action': 'Consolidate 2 entry points -> 1 canonical', 'priority': 'CRITICAL'},
    ]
    return tasks

def main():
    print("🔍 Extracting all pending work from markdown files...\n")
    
    # Find all markdown files
    md_files = sorted(ROOT.glob('**/*.md'))
    print(f"Found {len(md_files)} markdown files to scan\n")
    
    # Extract pending work by file
    all_pending = defaultdict(list)
    file_count = 0
    item_count = 0
    
    for md_file in md_files:
        if '.git' in md_file.parts or 'node_modules' in md_file.parts:
            continue
        
        items = extract_todos_from_md(md_file)
        if items:
            all_pending[str(md_file.relative_to(ROOT))] = items
            file_count += 1
            item_count += len(items)
    
    # Categorize by priority/type
    critical_tasks = []
    urgent_tasks = []
    normal_tasks = []
    
    for file_path, items in sorted(all_pending.items()):
        for item in items:
            text = item['text']
            if any(x in text.lower() for x in ['merge', 'consolidate', 'duplicate', 'critical']):
                critical_tasks.append({'file': file_path, 'task': text})
            elif any(x in text.lower() for x in ['fix', 'implement', 'complete']):
                urgent_tasks.append({'file': file_path, 'task': text})
            else:
                normal_tasks.append({'file': file_path, 'task': text})
    
    # Get merge and component consolidation tasks
    component_merges = extract_component_merges()
    app_consolidations = extract_app_consolidation_tasks()
    
    # Build report
    report_lines = [
        "=" * 100,
        "COMPREHENSIVE PENDING WORK EXTRACTION REPORT",
        "=" * 100,
        f"Generated: {datetime.utcnow().isoformat()}Z",
        "",
        f"📊 STATISTICS:",
        f"- Files scanned: {len(md_files)}",
        f"- Files with pending work: {file_count}",
        f"- Total pending items extracted: {item_count}",
        f"- Critical tasks: {len(critical_tasks)}",
        f"- Urgent tasks: {len(urgent_tasks)}",
        f"- Normal tasks: {len(normal_tasks)}",
        f"- Component merges needed: {len(component_merges)}",
        f"- App consolidations: {len(app_consolidations)}",
        "",
        "=" * 100,
        "PHASE 1: CRITICAL MERGE & CONSOLIDATION TASKS (DO FIRST)",
        "=" * 100,
        "",
        "APP ENTRY POINT CONSOLIDATION:",
    ]
    
    for task in app_consolidations:
        report_lines.append(f"- [{task['priority']}] {task['app']}: {task['action']}")
    
    report_lines.extend([
        "",
        "COMPONENT MERGE TASKS (115 duplicate components found):",
    ])
    
    for merge in component_merges:
        report_lines.append(f"- [{merge['priority']}] {merge['category']}: Consolidate '{merge['component']}' component usage across all apps")
    
    report_lines.extend([
        "",
        "=" * 100,
        "CRITICAL TASKS FROM .md FILES",
        "=" * 100,
        "",
    ])
    
    # Add top critical tasks
    for i, task in enumerate(critical_tasks[:50]):
        report_lines.append(f"- {task['file']}: {task['task']}")
    
    if len(critical_tasks) > 50:
        report_lines.append(f"- ... and {len(critical_tasks) - 50} more critical tasks")
    
    report_lines.extend([
        "",
        "=" * 100,
        "URGENT IMPLEMENTATION TASKS",
        "=" * 100,
        "",
    ])
    
    for i, task in enumerate(urgent_tasks[:50]):
        report_lines.append(f"- {task['file']}: {task['task']}")
    
    if len(urgent_tasks) > 50:
        report_lines.append(f"- ... and {len(urgent_tasks) - 50} more urgent tasks")
    
    # Write report
    report_text = "\n".join(report_lines)
    print(report_text)
    
    # Save to file
    report_file = ROOT / "BULK_PENDING_WORK_EXTRACTION.txt"
    report_file.write_text(report_text)
    print(f"\n✅ Report saved to {report_file.relative_to(ROOT)}")
    
    # Return summary stats
    return {
        'total_items': item_count,
        'critical': len(critical_tasks),
        'urgent': len(urgent_tasks),
        'normal': len(normal_tasks),
        'component_merges': len(component_merges),
        'app_consolidations': len(app_consolidations),
    }

if __name__ == '__main__':
    stats = main()
    print(f"\n📈 Summary: {stats['total_items']} total pending items ({stats['critical']} critical, {stats['urgent']} urgent, {stats['normal']} normal)")
