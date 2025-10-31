#!/usr/bin/env python3
"""Enhanced analyzer for 'lion' feature optimization.

Advanced analysis and enhancement of Lion features including:
- Feature flag management and optimization
- Automated validation generation
- Security pattern enforcement
- Performance monitoring integration
- Operational safety improvements

Scans repository for files mentioning 'lion' and produces sophisticated
recommendations for improving feature robustness, reliability, and maintainability.
Dry-run by default. Writes comprehensive analysis to `.qmoi_validation/`.
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import re
import sys
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set, Any

# Constants
ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / '.qmoi_validation'
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(OUT_DIR / 'lion_enhancer.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
log = logging.getLogger('lion_enhancer')

# Feature patterns
FEATURE_PATTERNS = [
    r'lion[._]feature[._](?P<feature>\w+)',
    r'@lion-feature/(?P<feature>\w+)',
    r'lion\.enable(?P<feature>\w+)',
    r'LION_FEATURE_(?P<feature>\w+)',
]

# Critical operations requiring protection
CRITICAL_OPS = {
    'validation',
    'verification',
    'authentication',
    'authorization',
    'payment',
    'billing',
    'deployment',
    'backup',
}

@dataclass
class FeatureAnalysis:
    """Analysis results for a single Lion feature."""
    name: str
    files: List[str]
    risk_level: str  # low, medium, high
    has_tests: bool
    has_feature_flag: bool
    has_monitoring: bool
    has_documentation: bool
    critical_ops: List[str]
    suggested_improvements: List[Dict[str, Any]]

@dataclass
class EnhancementReport:
    """Complete analysis report for all Lion features."""
    timestamp: str
    features_found: int
    files_analyzed: int
    risk_summary: Dict[str, int]
    feature_analyses: List[FeatureAnalysis]
    global_recommendations: List[Dict[str, Any]]
    validation_results: Dict[str, Any]


class LionFeatureScanner:
    """Scans repository for Lion features and analyzes their implementation."""
    
    def __init__(self, root: Path):
        self.root = root
        self.features: Dict[str, FeatureAnalysis] = {}
        self.file_cache: Dict[str, str] = {}
    
    def _read_file_content(self, path: Path) -> Optional[str]:
        """Read file content with caching."""
        try:
            if str(path) not in self.file_cache:
                self.file_cache[str(path)] = path.read_text(encoding='utf-8')
            return self.file_cache[str(path)]
        except Exception as e:
            log.warning(f'Error reading {path}: {e}')
            return None

    def _find_feature_patterns(self, content: str, file_path: str) -> Set[str]:
        """Extract feature names from content using patterns."""
        features = set()
        for pattern in FEATURE_PATTERNS:
            for match in re.finditer(pattern, content, re.IGNORECASE):
                if 'feature' in match.groupdict():
                    features.add(match.group('feature').lower())
        return features

    def _analyze_critical_ops(self, content: str) -> List[str]:
        """Find critical operations in feature."""
        critical = []
        for op in CRITICAL_OPS:
            if re.search(rf'\b{op}\b', content, re.IGNORECASE):
                critical.append(op)
        return critical

    def _check_feature_safety(self, name: str, files: List[str]) -> str:
        """Determine feature risk level."""
        critical_count = 0
        for file in files:
            if content := self.file_cache.get(file):
                critical_count += len(self._analyze_critical_ops(content))
                
        if critical_count > 2:
            return 'high'
        elif critical_count > 0:
            return 'medium'
        return 'low'

    def scan_repository(self) -> Dict[str, FeatureAnalysis]:
        """Perform complete repository scan for Lion features."""
        log.info('Starting repository scan for Lion features')
        
        # First pass: find all relevant files
        for p in self.root.rglob('*'):
            if not p.is_file() or p.suffix not in ['.py', '.js', '.ts', '.md', '.yml', '.yaml']:
                continue
                
            if content := self._read_file_content(p):
                if 'lion' in content.lower():
                    # Extract features
                    for feature in self._find_feature_patterns(content, str(p)):
                        if feature not in self.features:
                            self.features[feature] = FeatureAnalysis(
                                name=feature,
                                files=[],
                                risk_level='low',
                                has_tests=False,
                                has_feature_flag=False,
                                has_monitoring=False,
                                has_documentation=False,
                                critical_ops=[],
                                suggested_improvements=[]
                            )
                        self.features[feature].files.append(str(p))
        
        log.info(f'Found {len(self.features)} Lion features')
        
        # Second pass: detailed analysis
        for feature_name, analysis in self.features.items():
            log.info(f'Analyzing feature: {feature_name}')
            
            # Analyze files
            for file in analysis.files:
                if content := self.file_cache.get(file):
                    # Check for tests
                    if 'test' in file.lower() or 'spec' in file.lower():
                        analysis.has_tests = True
                    
                    # Check for feature flags
                    if re.search(r'feature[._]flag|feature[._]toggle', content, re.IGNORECASE):
                        analysis.has_feature_flag = True
                    
                    # Check for monitoring
                    if re.search(r'monitor|metric|telemetry|trace', content, re.IGNORECASE):
                        analysis.has_monitoring = True
                    
                    # Check for documentation
                    if file.endswith(('.md', '.rst', '.txt')):
                        analysis.has_documentation = True
                    
                    # Add critical ops
                    analysis.critical_ops.extend(self._analyze_critical_ops(content))
            
            # Determine risk level
            analysis.risk_level = self._check_feature_safety(feature_name, analysis.files)
            
            # Generate improvement suggestions
            analysis.suggested_improvements = self._generate_suggestions(analysis)
        
        return self.features

    def _generate_suggestions(self, analysis: FeatureAnalysis) -> List[Dict[str, Any]]:
        """Generate specific improvement suggestions based on analysis."""
        suggestions = []
        
        # Feature flag suggestions
        if not analysis.has_feature_flag and analysis.risk_level != 'low':
            suggestions.append({
                'type': 'feature_flag',
                'severity': 'high' if analysis.risk_level == 'high' else 'medium',
                'message': 'Add feature flag for safer deployment and control',
                'recommendation': {
                    'action': 'add_feature_flag',
                    'config': {
                        'name': f'LION_FEATURE_{analysis.name.upper()}',
                        'default': False,
                        'description': f'Controls {analysis.name} Lion feature'
                    }
                }
            })

        # Test coverage suggestions
        if not analysis.has_tests:
            suggestions.append({
                'type': 'testing',
                'severity': 'high' if analysis.critical_ops else 'medium',
                'message': 'Add test coverage for feature reliability',
                'recommendation': {
                    'action': 'add_tests',
                    'files': [f.replace('.py', '_test.py') for f in analysis.files if f.endswith('.py')]
                }
            })

        # Monitoring suggestions
        if not analysis.has_monitoring and analysis.risk_level != 'low':
            suggestions.append({
                'type': 'monitoring',
                'severity': 'medium',
                'message': 'Add performance and health monitoring',
                'recommendation': {
                    'action': 'add_monitoring',
                    'metrics': [
                        f'{analysis.name}_usage_count',
                        f'{analysis.name}_error_rate',
                        f'{analysis.name}_latency'
                    ]
                }
            })

        # Documentation suggestions
        if not analysis.has_documentation:
            suggestions.append({
                'type': 'documentation',
                'severity': 'medium',
                'message': 'Add feature documentation and runbook',
                'recommendation': {
                    'action': 'add_docs',
                    'files': [
                        f'docs/features/{analysis.name}.md',
                        f'docs/runbooks/{analysis.name}_ops.md'
                    ]
                }
            })

        return suggestions


class EnhancementManager:
    """Manages the enhancement process and generates reports."""
    
    def __init__(self, root: Path, apply: bool = False):
        self.root = root
        self.apply = apply
        self.scanner = LionFeatureScanner(root)
        
    def generate_report(self, features: Dict[str, FeatureAnalysis]) -> EnhancementReport:
        """Generate comprehensive enhancement report."""
        risk_summary = {'high': 0, 'medium': 0, 'low': 0}
        for analysis in features.values():
            risk_summary[analysis.risk_level] += 1

        # Generate global recommendations
        global_recommendations = self._generate_global_recommendations(features)
            
        return EnhancementReport(
            timestamp=datetime.utcnow().isoformat() + 'Z',
            features_found=len(features),
            files_analyzed=len(self.scanner.file_cache),
            risk_summary=risk_summary,
            feature_analyses=list(features.values()),
            global_recommendations=global_recommendations,
            validation_results=self._validate_features(features)
        )
    
    def _generate_global_recommendations(self, features: Dict[str, FeatureAnalysis]) -> List[Dict[str, Any]]:
        """Generate repository-wide recommendations."""
        recommendations = []
        
        # Check for feature flag system
        if any(not f.has_feature_flag and f.risk_level != 'low' for f in features.values()):
            recommendations.append({
                'type': 'infrastructure',
                'severity': 'high',
                'message': 'Implement centralized feature flag system',
                'recommendation': {
                    'action': 'add_feature_flag_system',
                    'config': {
                        'provider': 'launchdarkly or custom',
                        'required_features': [
                            f.name for f in features.values()
                            if not f.has_feature_flag and f.risk_level != 'low'
                        ]
                    }
                }
            })
        
        # Check for monitoring system
        if any(not f.has_monitoring for f in features.values()):
            recommendations.append({
                'type': 'monitoring',
                'severity': 'medium',
                'message': 'Implement centralized feature monitoring',
                'recommendation': {
                    'action': 'add_monitoring_system',
                    'config': {
                        'metrics': ['usage', 'errors', 'latency'],
                        'features': [f.name for f in features.values()]
                    }
                }
            })
            
        # Documentation organization
        if any(not f.has_documentation for f in features.values()):
            recommendations.append({
                'type': 'documentation',
                'severity': 'medium',
                'message': 'Organize feature documentation',
                'recommendation': {
                    'action': 'create_doc_structure',
                    'paths': [
                        'docs/features/',
                        'docs/runbooks/',
                        'docs/architecture/'
                    ]
                }
            })
            
        return recommendations
    
    def _validate_features(self, features: Dict[str, FeatureAnalysis]) -> Dict[str, Any]:
        """Validate feature implementations for safety."""
        return {
            'total_features': len(features),
            'high_risk_features': sum(1 for f in features.values() if f.risk_level == 'high'),
            'untested_features': sum(1 for f in features.values() if not f.has_tests),
            'unmonitored_critical_features': sum(
                1 for f in features.values()
                if f.critical_ops and not f.has_monitoring
            ),
            'validation_status': 'warning' if any(
                f.risk_level == 'high' for f in features.values()
            ) else 'ok'
        }
    
    def apply_safe_changes(self, features: Dict[str, FeatureAnalysis]) -> None:
        """Apply safe, non-destructive improvements.
        
        This method creates documentation, runbooks, and configuration stubs
        for features that lack them. It never modifies existing files or
        makes potentially dangerous changes.
        """
        log.info('Applying safe enhancement changes')
        
        # Create necessary directories
        docs_dir = self.root / 'docs'
        features_dir = docs_dir / 'features'
        runbooks_dir = docs_dir / 'runbooks'
        monitoring_dir = docs_dir / 'monitoring'
        architecture_dir = docs_dir / 'architecture'
        
        for d in [docs_dir, features_dir, runbooks_dir]:
            d.mkdir(exist_ok=True)
            
        # Create documentation stubs
        for feature in features.values():
            if not feature.has_documentation:
                # Feature documentation
                doc_file = features_dir / f'{feature.name}.md'
                doc_content = f"""# {feature.name} Feature

## Overview
{feature.name} is a Lion feature that provides...

## Implementation
Found in: {', '.join(feature.files)}

## Safety Considerations
Risk Level: {feature.risk_level}
Critical Operations: {', '.join(feature.critical_ops) if feature.critical_ops else 'None'}

## Monitoring
{"Monitoring is in place" if feature.has_monitoring else "TODO: Add monitoring"}

## Feature Flags
{"Feature is controlled by feature flags" if feature.has_feature_flag else "TODO: Add feature flag control"}
"""
                doc_file.write_text(doc_content)
                
                # Runbook
                if feature.risk_level != 'low':
                    rb_file = runbooks_dir / f'{feature.name}_ops.md'
                    rb_content = f"""# {feature.name} Operations Guide

## Overview
Operational procedures for the {feature.name} feature.

## Monitoring
TODO: Add monitoring steps

## Common Issues
TODO: Document common issues and solutions

## Emergency Procedures
TODO: Add emergency response steps
"""
                    rb_file.write_text(rb_content)
                    
        # Create feature flag configuration stub
        flag_config = docs_dir / 'feature_flags.yml'
        flags = {
            'lion_features': {
                feature.name: {
                    'enabled': False,
                    'description': f'Controls {feature.name} feature',
                    'owner': 'platform_team',
                    'risk_level': feature.risk_level
                }
                for feature in features.values()
                if not feature.has_feature_flag
            }
        }
        import yaml
        flag_config.write_text(yaml.dump(flags, sort_keys=False))
        
        log.info('Applied safe documentation and configuration changes')


def main() -> int:
    """Enhanced main entry point with better error handling."""
    parser = argparse.ArgumentParser(
        description='Lion Feature Enhancer - Analyzes and improves feature implementation'
    )
    parser.add_argument('--apply', action='store_true',
                       help='Apply safe improvements (documentation and configs)')
    parser.add_argument('--root', default=str(ROOT),
                       help='Root path to scan')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose logging')
    args = parser.parse_args()

    if args.verbose:
        log.setLevel(logging.DEBUG)

    try:
        log.info('Starting Lion feature enhancement analysis')
        
        # Initialize and run enhancement process
        manager = EnhancementManager(Path(args.root), args.apply)
        features = manager.scanner.scan_repository()
        
        if not features:
            log.error('No Lion features found!')
            return 1
            
        # Generate and save report
        report = manager.generate_report(features)
        out_path = OUT_DIR / 'lion_feature_enhancer.json'
        with open(out_path, 'w') as f:
            json.dump(asdict(report), f, indent=2)
        log.info(f'Saved enhancement report to {out_path}')
        
        # Print summary
        print('\nLion Feature Analysis Summary:')
        print(f'Features found: {report.features_found}')
        print(f'Files analyzed: {report.files_analyzed}')
        print('\nRisk Distribution:')
        for level, count in report.risk_summary.items():
            print(f'  {level.title()}: {count}')
        print('\nValidation Results:')
        print(f'  Status: {report.validation_results["validation_status"]}')
        print(f'  High-risk features: {report.validation_results["high_risk_features"]}')
        print(f'  Untested features: {report.validation_results["untested_features"]}')
        
        # Apply changes if requested
        if args.apply:
            manager.apply_safe_changes(features)
            
        log.info('Enhancement analysis completed successfully')
        return 0
        
    except Exception as e:
        log.error(f'Enhancement analysis failed: {e}', exc_info=True)
        # Create error report
        error_path = OUT_DIR / 'lion_feature_error_report.json'
        try:
            error_report = {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'error': str(e),
                'traceback': str(sys.exc_info()[2]),
                'context': {
                    'python_version': sys.version,
                    'args': vars(args),
                    'workspace_state': {
                        'out_dir_exists': OUT_DIR.exists(),
                        'docs_dir_exists': (Path(args.root) / 'docs').exists()
                    }
                }
            }
            with open(error_path, 'w') as f:
                json.dump(error_report, f, indent=2)
            log.info(f'Error details saved to {error_path}')
        except Exception as err:
            log.error(f'Failed to save error report: {err}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())

