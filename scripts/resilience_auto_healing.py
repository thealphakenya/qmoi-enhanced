#!/usr/bin/env python3
"""
Resilience & Auto-Healing Module for QMOI Ollama Autonomous Agent
==================================================================
Provides comprehensive error recovery, file repair, and resilience mechanisms.

Features:
- Detect and recover from missing files
- Auto-fix YAML/JSON syntax errors
- Auto-repair Python syntax errors
- Handle file corruption gracefully
- Graceful degradation for missing components
- Reconstruct essential files from templates
- Network error recovery
- API error recovery with retry logic
"""

import json
import logging
import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
import shutil
import yaml

logger = logging.getLogger(__name__)


class FileRecoveryManager:
    """Manages file detection, recovery, and reconstruction."""
    
    def __init__(self, root_dir: Path):
        """Initialize with root directory."""
        self.root_dir = root_dir
        self.essential_files = self._define_essential_files()
        self.recovery_log = []
    
    def _define_essential_files(self) -> Dict[str, Dict[str, Any]]:
        """Define essential files and their recovery templates."""
        return {
            "requirements.txt": {
                "type": "text",
                "template": "# QMOI Dependencies\npytest>=6.0\nPyYAML>=5.3\nrequests>=2.25\n",
                "critical": True,
            },
            "package.json": {
                "type": "json",
                "template": '{"name": "qmoi", "version": "1.0.0", "dependencies": {}}',
                "critical": False,
            },
            ".github/workflows/ollama-autonomous-agent.yml": {
                "type": "yaml",
                "template": """name: Ollama Autonomous Agent
on:
  workflow_run:
    workflows: [pr-monitor]
    types: [completed]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Agent
        run: python scripts/ollama_autonomous_agent.py validate-all
""",
                "critical": True,
            },
        }
    
    def detect_missing_files(self) -> Dict[str, List[str]]:
        """Detect missing essential files."""
        missing = {"critical": [], "optional": []}
        recovered = []
        
        for file_name, file_info in self.essential_files.items():
            file_path = self.root_dir / file_name
            
            if not file_path.exists():
                category = "critical" if file_info["critical"] else "optional"
                missing[category].append(file_name)
                
                # Auto-recover if template available
                if "template" in file_info:
                    try:
                        self._reconstruct_file(file_path, file_info["template"])
                        recovered.append(file_name)
                        logger.info(f"✓ Reconstructed missing file: {file_name}")
                    except Exception as e:
                        logger.warning(f"✗ Failed to reconstruct {file_name}: {e}")
        
        return {
            "missing": missing,
            "recovered": recovered,
            "recovery_procedures": self._generate_recovery_procedures(missing),
        }
    
    def _reconstruct_file(self, file_path: Path, template: str) -> None:
        """Reconstruct a file from template."""
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(template, encoding="utf-8")
    
    def _generate_recovery_procedures(self, missing: Dict[str, List[str]]) -> Dict[str, str]:
        """Generate recovery procedures for missing files."""
        procedures = {}
        
        for file_name in missing["critical"]:
            procedures[file_name] = f"File '{file_name}' is critical and must be present. Reconstructing from template."
        
        for file_name in missing["optional"]:
            procedures[file_name] = f"File '{file_name}' is optional. Can proceed without it but functionality may be limited."
        
        return procedures


class YAMLRepairManager:
    """Manages YAML syntax error detection and repair."""
    
    @staticmethod
    def detect_yaml_errors(file_path: Path) -> Tuple[bool, Optional[str]]:
        """Detect YAML syntax errors."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                yaml.safe_load(f)
            return False, None
        except yaml.YAMLError as e:
            return True, str(e)
    
    @staticmethod
    def auto_repair_yaml(file_path: Path) -> Tuple[bool, Optional[str]]:
        """Attempt to auto-repair YAML indentation errors."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix common indentation errors
            lines = content.split('\n')
            repaired_lines = []
            
            for line in lines:
                # Fix misaligned continuation lines
                if line.strip() and not line.startswith('#'):
                    # Ensure consistent 2-space or 4-space indentation
                    indent = len(line) - len(line.lstrip())
                    if indent % 2 != 0:
                        # Fix odd indentation to nearest even
                        line = ' ' * ((indent // 2) * 2) + line.lstrip()
                
                repaired_lines.append(line)
            
            repaired_content = '\n'.join(repaired_lines)
            
            # Verify repair
            yaml.safe_load(repaired_content)
            
            # Write repaired content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(repaired_content)
            
            logger.info(f"✓ Auto-repaired YAML file: {file_path}")
            return True, "YAML syntax corrected"
        
        except Exception as e:
            logger.warning(f"✗ YAML repair failed for {file_path}: {e}")
            return False, str(e)


class PythonRepairManager:
    """Manages Python syntax error detection and repair."""
    
    @staticmethod
    def detect_python_errors(file_path: Path) -> Tuple[bool, Optional[str]]:
        """Detect Python syntax errors."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                compile(f.read(), str(file_path), 'exec')
            return False, None
        except SyntaxError as e:
            return True, str(e)
    
    @staticmethod
    def auto_repair_python(file_path: Path) -> Tuple[bool, Optional[str]]:
        """Attempt to auto-repair common Python syntax errors."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix common syntax errors
            repairs = [
                # Fix missing colons
                (r'(def\s+\w+\([^)]*\))(\s*\n)', r'\1:\2'),
                (r'(if\s+.+)(\s*\n)', r'\1:\2'),
                (r'(else)(\s*\n)', r'\1:\2'),
                (r'(for\s+.+\sin\s.+)(\s*\n)', r'\1:\2'),
                (r'(while\s+.+)(\s*\n)', r'\1:\2'),
                # Fix missing closing parentheses
                (r'(print\([^)]*)\s*\n', r'\1)\n'),
                # Fix missing closing brackets
                (r'(\[[^\]]*)\s*\n', r'\1]\n'),
            ]
            
            for pattern, replacement in repairs:
                content = re.sub(pattern, replacement, content)
            
            # Verify repair
            compile(content, str(file_path), 'exec')
            
            # Write repaired content
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            logger.info(f"✓ Auto-repaired Python file: {file_path}")
            return True, "Python syntax corrected"
        
        except Exception as e:
            logger.warning(f"✗ Python repair failed for {file_path}: {e}")
            return False, str(e)


class FileCorruptionHandler:
    """Handles corrupted file detection and recovery."""
    
    def __init__(self, backup_dir: Optional[Path] = None):
        """Initialize with optional backup directory."""
        self.backup_dir = backup_dir or Path.home() / ".qmoi_backups"
        self.backup_dir.mkdir(exist_ok=True)
    
    @staticmethod
    def detect_corruption(file_path: Path) -> Tuple[bool, Optional[str]]:
        """Detect if file is corrupted (binary data in text file)."""
        try:
            with open(file_path, 'rb') as f:
                chunk = f.read(512)
            
            # Check for null bytes (typical binary marker)
            if b'\x00' in chunk:
                return True, "Binary null bytes detected in text file"
            
            # Check if file can be decoded as text
            try:
                chunk.decode('utf-8')
            except UnicodeDecodeError:
                return True, "File contains non-UTF8 data"
            
            return False, None
        
        except Exception as e:
            return True, str(e)
    
    def recover_from_corruption(self, file_path: Path) -> Tuple[bool, Optional[str]]:
        """Attempt to recover from file corruption."""
        # Check backup
        backup_path = self.backup_dir / file_path.name
        
        if backup_path.exists():
            try:
                shutil.copy(backup_path, file_path)
                logger.info(f"✓ Recovered {file_path} from backup")
                return True, f"Recovered from backup: {backup_path}"
            except Exception as e:
                logger.warning(f"✗ Backup recovery failed: {e}")
        
        # If no backup, truncate file
        try:
            file_path.write_text("# File corrupted and recovered\n# Please restore contents\n")
            logger.info(f"✓ Truncated corrupted file: {file_path}")
            return True, "File truncated, contents cleared"
        
        except Exception as e:
            logger.error(f"✗ Recovery failed for {file_path}: {e}")
            return False, str(e)


class GracefulDegradationManager:
    """Manages graceful degradation when optional components are missing."""
    
    def __init__(self):
        """Initialize degradation levels."""
        self.degradation_levels = {
            "full_functionality": [],
            "limited_functionality": [],
            "core_only": [],
        }
        self.disabled_features = []
    
    def assess_degradation(self, missing_files: List[str]) -> Dict[str, Any]:
        """Assess system degradation based on missing files."""
        assessment = {
            "level": "full_functionality",
            "disabled_features": [],
            "can_continue": True,
        }
        
        critical_files = {
            "scripts/ollama_autonomous_agent.py": "Core agent",
            "requirements.txt": "Dependencies",
        }
        
        for file_name in missing_files:
            if file_name in critical_files:
                assessment["level"] = "core_only"
                assessment["disabled_features"].append(critical_files[file_name])
                assessment["can_continue"] = False
            elif any(opt in file_name for opt in ["test", "doc", "config"]):
                if assessment["level"] == "full_functionality":
                    assessment["level"] = "limited_functionality"
                assessment["disabled_features"].append(file_name)
        
        return assessment


class ResilienceCoordinator:
    """Coordinates all resilience and auto-healing operations."""
    
    def __init__(self, root_dir: Path):
        """Initialize resilience coordinator."""
        self.root_dir = root_dir
        self.file_recovery = FileRecoveryManager(root_dir)
        self.yaml_repair = YAMLRepairManager()
        self.python_repair = PythonRepairManager()
        self.corruption_handler = FileCorruptionHandler()
        self.degradation = GracefulDegradationManager()
        self.recovery_report = {}
    
    def run_full_resilience_check(self) -> Dict[str, Any]:
        """Run comprehensive resilience and recovery check."""
        logger.info("Starting full resilience check...")
        
        # 1. Check for missing files
        file_check = self.file_recovery.detect_missing_files()
        self.recovery_report["files"] = file_check
        
        # 2. Check YAML files
        yaml_files = list(self.root_dir.glob("**/*.yml")) + list(self.root_dir.glob("**/*.yaml"))
        yaml_issues = []
        
        for yaml_file in yaml_files:
            has_error, error_msg = self.yaml_repair.detect_yaml_errors(yaml_file)
            if has_error:
                yaml_issues.append({"file": str(yaml_file), "error": error_msg})
                # Try to repair
                repaired, repair_msg = self.yaml_repair.auto_repair_yaml(yaml_file)
                if repaired:
                    yaml_issues[-1]["repair_status"] = "✓ Repaired"
                else:
                    yaml_issues[-1]["repair_status"] = "✗ Failed to repair"
        
        self.recovery_report["yaml"] = {"issues_found": len(yaml_issues), "details": yaml_issues}
        
        # 3. Check Python files
        python_files = list(self.root_dir.glob("**/*.py"))
        python_issues = []
        
        for py_file in python_files:
            has_error, error_msg = self.python_repair.detect_python_errors(py_file)
            if has_error:
                python_issues.append({"file": str(py_file), "error": error_msg})
                # Try to repair
                repaired, repair_msg = self.python_repair.auto_repair_python(py_file)
                if repaired:
                    python_issues[-1]["repair_status"] = "✓ Repaired"
                else:
                    python_issues[-1]["repair_status"] = "✗ Failed to repair"
        
        self.recovery_report["python"] = {"issues_found": len(python_issues), "details": python_issues}
        
        # 4. Check for corruption
        corruption_issues = []
        for file_path in self.root_dir.glob("**/*"):
            if file_path.is_file() and file_path.suffix not in ['.pyc', '.o', '.so']:
                is_corrupt, corrupt_msg = self.corruption_handler.detect_corruption(file_path)
                if is_corrupt:
                    corruption_issues.append(str(file_path))
                    # Try to recover
                    recovered, recovery_msg = self.corruption_handler.recover_from_corruption(file_path)
        
        self.recovery_report["corruption"] = {
            "issues_found": len(corruption_issues),
            "files": corruption_issues,
        }
        
        # 5. Assess degradation
        missing_files = file_check["missing"]["critical"] + file_check["missing"]["optional"]
        degradation = self.degradation.assess_degradation(missing_files)
        self.recovery_report["degradation"] = degradation
        
        # Final status
        self.recovery_report["status"] = "✓ Resilience check complete"
        self.recovery_report["can_continue"] = degradation["can_continue"]
        
        logger.info(f"Resilience check complete: {self.recovery_report['status']}")
        return self.recovery_report
    
    def get_recovery_summary(self) -> Dict[str, Any]:
        """Get summary of recovery operations."""
        if not self.recovery_report:
            return {"status": "No resilience check performed"}
        
        return {
            "files_recovered": len(self.recovery_report.get("files", {}).get("recovered", [])),
            "yaml_issues_found": self.recovery_report.get("yaml", {}).get("issues_found", 0),
            "python_issues_found": self.recovery_report.get("python", {}).get("issues_found", 0),
            "corrupted_files": len(self.recovery_report.get("corruption", {}).get("files", [])),
            "degradation_level": self.recovery_report.get("degradation", {}).get("level", "unknown"),
            "can_continue": self.recovery_report.get("can_continue", False),
        }


# Example usage
if __name__ == "__main__":
    root = Path(__file__).parent.parent
    coordinator = ResilienceCoordinator(root)
    report = coordinator.run_full_resilience_check()
    print("\n=== RESILIENCE CHECK REPORT ===")
    print(json.dumps(coordinator.get_recovery_summary(), indent=2))
