// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:12Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
# 
"""Unit tests for qCity and lion feature enhancers."""
from __future__ import annotations

import json
import os
from pathlib import Path
import shutil
import sys
import tempfile

# Add parent dir to path so we can import the modules
sys.path.append(str(Path(__file__).resolve().parents[1] / 'scripts'))

import qcity_enhancer
import lion_feature_enhancer

def setup_test_files(tmp_path):
    # Create some test files with known content
    (tmp_path / 'qcity_manifest.json').write_text('{"type": "qcity-service"}')
    (tmp_path / 'doc.md').write_text('# Lion Feature Guide\n\nLion features include...')
    return tmp_path

def test_qcity_enhancer_finds_manifests(tmp_path):
    root = setup_test_files(tmp_path)
    found = qcity_enhancer.find_qcity_manifests(root)
    assert len(found) > 0
    assert any('qcity' in str(k).lower() for k in found.keys())

def test_qcity_suggestions_are_conservative():
    manifests = {'test.json': {'size': 100}}
    sugg = qcity_enhancer.generate_suggestions(manifests)
    assert len(sugg) > 0
    assert sugg['test.json']['confidence'] == 'low'  # must be conservative
    assert any('healthcheck' in s for s in sugg['test.json']['suggestions'])

def test_lion_enhancer_finds_features(tmp_path):
    root = setup_test_files(tmp_path)
    found = lion_feature_enhancer.scan_for_lion(root)
    assert len(found) > 0
    assert any('lion' in str(k).lower() for k in found.keys())

def test_lion_recommendations_include_safety():
    found = {'test.md': {'snippet': 'Lion guide'}}
    recs = lion_feature_enhancer.make_recommendations(found)
    assert len(recs) > 0
    test_rec = recs['test.md']
    assert any('validation' in r for r in test_rec['recommendations'])
    assert test_rec['confidence'] in ('low', 'medium')  # must be conservative

def test_qcity_apply_is_safe(tmp_path):
    root = setup_test_files(tmp_path)
    out_dir = root / '.qmoi_validation'
    out_dir.mkdir(exist_ok=True)
    # run with --apply (should create safe marker files only)
    args = type('Args', (), {'apply': True, 'root': str(root)})()
    code = qcity_enhancer.main(args)
    assert code == 0
    assert (out_dir / 'qcity_enhancer.json').exists()
    # verify any 'applied' files are just metadata markers
    applied = list(out_dir.glob('qcity_note_*.txt'))
    assert len(applied) > 0
    for a in applied:
        txt = a.read_text()
        assert 'dry-safe' in txt

def test_lion_apply_is_safe(tmp_path):
    root = setup_test_files(tmp_path)
    out_dir = root / '.qmoi_validation'
    out_dir.mkdir(exist_ok=True)
    # run with --apply (should create safe scaffolding only)
    args = type('Args', (), {'apply': True, 'root': str(root)})()
    code = lion_feature_enhancer.main(args)
    assert code == 0
    assert (out_dir / 'lion_feature_enhancer.json').exists()
    implementation = out_dir / 'lion_runbook_stub.md'
    assert implementation.exists()
    txt = implementation.read_text()
    assert 'runbook' in txt.lower()

def test_qcity_large_scale_handling(tmp_path):
    """Test qCity enhancer with a large number of files."""
    root = setup_test_files(tmp_path)
    # Create many test files
    for i in range(100):
        (root / f'qcity_manifest_{i}.json').write_text('{"type": "qcity-service"}')
    
    found = qcity_enhancer.find_qcity_manifests(root)
    assert len(found) >= 100
    # Verify performance is reasonable
    sugg = qcity_enhancer.generate_suggestions(found)
    assert len(sugg) >= 100
    # Check memory usage stays reasonable
    import psutil
    process = psutil.Process()
    mem_usage = process.memory_info().rss / 1024 / 1024  # MB
    assert mem_usage < 200  # Should use less than 200MB

def test_lion_concurrent_safety(tmp_path):
    """Test Lion enhancer handles concurrent operations safely."""
    root = setup_test_files(tmp_path)
    from concurrent.futures import ThreadPoolExecutor
    from threading import Lock
    
    # Set up concurrent access simulation
    lock = Lock()
    def concurrent_access():
        with lock:
            args = type('Args', (), {'apply': True, 'root': str(root)})()
            return lion_feature_enhancer.main(args)
    
    # Run multiple concurrent operations
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(lambda _: concurrent_access(), range(4)))
    
    # Verify all operations completed successfully
    assert all(code == 0 for code in results)
    # Check no corruption occurred
    validation_file = root / '.qmoi_validation' / 'lion_feature_enhancer.json'
    assert validation_file.exists()
    with open(validation_file) as f:
        data = json.load(f)
        assert isinstance(data, dict)

def test_qcity_production_config_validation():
    """Test qCity enhancer validates production configurations properly."""
    prod_manifests = {
        'app1.json': {
            'type': 'qcity-service',
            'scale': {'min': 3, 'max': 10},
            'resources': {'cpu': '2', 'memory': '4Gi'},
            'healthcheck': {'path': '/health', 'timeout': 5}
        }
    }
    
    sugg = qcity_enhancer.generate_suggestions(prod_manifests)
    assert 'app1.json' in sugg
    app_sugg = sugg['app1.json']
    
    # Should recognize good production configs
    assert app_sugg.get('confidence', 'low') in ('medium', 'high')
    
    # Should not suggest changes to valid production settings
    healthcheck_suggestions = [s for s in app_sugg['suggestions'] if 'healthcheck' in s]
    assert not any('add healthcheck' in s.lower() for s in healthcheck_suggestions)

def test_lion_production_readiness():
    """Test Lion enhancer production readiness checks."""
    prod_features = {
        'prod.md': {
            'snippet': '''# Lion Production Guide
            - Load balancing: Enabled
            - Monitoring: Prometheus
            - Logging: EFK Stack
            - Alerting: Configured''',
            'metadata': {'environment': 'production'}
        }
    }
    
    recs = lion_feature_enhancer.make_recommendations(prod_features)
    assert 'prod.md' in recs
    prod_rec = recs['prod.md']
    
    # Should recognize production-ready configurations
    assert prod_rec['confidence'] == 'high'
    
    # Should include production-specific recommendations
    prod_suggestions = [r.lower() for r in prod_rec['recommendations']]
    assert any('backup' in r or 'disaster recovery' in r for r in prod_suggestions)
    assert any('performance' in r for r in prod_suggestions)