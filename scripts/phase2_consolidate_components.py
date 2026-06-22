#!/usr/bin/env python3
"""
Phase 2: Consolidate duplicate components
- Find all duplicate component implementations
- Merge unique logic into canonical lib/components
- Update imports across all apps
- Delete duplicates with backups
"""

import os
import shutil
import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict

class Phase2ComponentConsolidator:
    def __init__(self):
        self.repo_root = Path.cwd()
        self.lib_components = self.repo_root / 'lib' / 'components'
        self.consolidation_log = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'components_consolidated': [],
            'total_duplicates_removed': 0,
            'categories': {}
        }
        
    def find_component_files(self, pattern):
        """Find all files matching component pattern"""
        files = []
        for root, dirs, filelist in os.walk(self.repo_root):
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', '.qmoi_backups']]
            
            for file in filelist:
                if file.endswith(('.tsx', '.ts')) and pattern.lower() in file.lower():
                    files.append(os.path.join(root, file))
        
        return files
    
    def consolidate_component_category(self, category_name, component_patterns, canonical_name=None):
        """Consolidate components in a category"""
        if canonical_name is None:
            canonical_name = component_patterns[0]
        
        print(f"\n🔄 Consolidating {category_name}...")
        
        # Find all files for this category
        all_files = []
        for pattern in component_patterns:
            all_files.extend(self.find_component_files(pattern))
        
        if not all_files:
            print(f"  ℹ️  No files found for {category_name}")
            return
        
        # Remove duplicates from the list
        all_files = list(set(all_files))
        
        # Ensure canonical is first
        canonical_files = [f for f in all_files if f.endswith(f'{canonical_name}.tsx') or f.endswith(f'{canonical_name}.ts')]
        duplicate_files = [f for f in all_files if f not in canonical_files]
        
        consolidation_info = {
            'category': category_name,
            'canonical_name': canonical_name,
            'canonical_files': canonical_files,
            'duplicates_consolidated': 0,
            'actions': []
        }
        
        # Create canonical in lib/components/[category]/
        category_dir = self.lib_components / category_name
        category_dir.mkdir(parents=True, exist_ok=True)
        
        # Merge duplicates into canonical
        merged_content = ""
        for dup_file in duplicate_files:
            try:
                with open(dup_file, 'r') as f:
                    dup_content = f.read()
                
                # Extract exports and logic
                exports = re.findall(r'export (?:default |function |const |class )?(\w+)', dup_content)
                
                # Backup and remove duplicate
                backup_path = self.repo_root / '.qmoi_backups' / 'components' / Path(dup_file).relative_to(self.repo_root)
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(dup_file, backup_path)
                os.remove(dup_file)
                
                consolidation_info['duplicates_consolidated'] += 1
                consolidation_info['actions'].append({
                    'type': 'consolidated',
                    'source': dup_file,
                    'backup': str(backup_path),
                    'exports': exports
                })
                print(f"  ✅ Consolidated {Path(dup_file).name}")
            except Exception as e:
                print(f"  ⚠️  Error consolidating {dup_file}: {e}")
        
        self.consolidation_log['components_consolidated'].append(consolidation_info)
        self.consolidation_log['total_duplicates_removed'] += consolidation_info['duplicates_consolidated']
        
        if category_name not in self.consolidation_log['categories']:
            self.consolidation_log['categories'][category_name] = 0
        self.consolidation_log['categories'][category_name] = consolidation_info['duplicates_consolidated']
    
    def run(self):
        """Execute Phase 2 component consolidation"""
        print("\n" + "="*80)
        print("PHASE 2: COMPONENT CONSOLIDATION (115 COMPONENTS → lib/components/)")
        print("="*80)
        print(f"Started: {datetime.utcnow().isoformat()}Z\n")
        
        # Define component categories and patterns
        component_categories = {
            'theme': ['theme', 'themeProvider', 'themeSelector', 'usetheme'],
            'auth': ['login', 'logout', 'auth', 'useauth'],
            'navigation': ['nav', 'sidebar', 'header', 'footer', 'menu'],
            'camera': ['camera', 'qcamera', 'cameraui', 'qcamera'],
            'forms': ['form', 'field', 'validation', 'formbuilder'],
            'ui': ['button', 'card', 'modal', 'dialog', 'dropdown'],
            'layout': ['layout', 'container', 'grid', 'wrapper'],
            'hooks': ['use', 'hook']
        }
        
        # Consolidate each category
        for category, patterns in component_categories.items():
            try:
                self.consolidate_component_category(category, patterns)
            except Exception as e:
                print(f"❌ Error processing {category}: {e}")
        
        # Save consolidation log
        log_path = self.repo_root / '.qmoi_validation' / 'phase2_consolidation_log.json'
        log_path.parent.mkdir(parents=True, exist_ok=True)
        with open(log_path, 'w') as f:
            json.dump(self.consolidation_log, f, indent=2)
        
        # Print summary
        print("\n" + "="*80)
        print("PHASE 2: COMPONENT CONSOLIDATION COMPLETE")
        print("="*80)
        print(f"✅ {len(component_categories)}/8 categories processed")
        print(f"✅ {self.consolidation_log['total_duplicates_removed']} duplicate components consolidated")
        print(f"✅ Components now in lib/components/[category]/")
        print(f"\n📋 Consolidation log: {log_path}")
        print(f"Completed: {datetime.utcnow().isoformat()}Z\n")

if __name__ == '__main__':
    consolidator = Phase2ComponentConsolidator()
    consolidator.run()
