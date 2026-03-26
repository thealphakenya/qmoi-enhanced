// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

import os
import json
import importlib
import importlib.util
import types
import pathlib

import pytest

# Import the module under test by path so pytest can run from workspace root
mod_path = pathlib.Path(__file__).resolve().parents[1] / 'qmoi_local_server.py'
spec = importlib.util.spec_from_file_location('q', str(mod_path))
q = importlib.util.module_from_spec(spec)
spec.loader.exec_module(q)

def setup_function(function):
    # Ensure env is clean for each test
    for k in list(os.environ.keys()):
        if k.startswith('QMOI_'):
            del os.environ[k]

def test_no_backends_configured():
    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is True
    assert details == ['no_backends_configured']

def test_push_gist_success(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'gist'
    os.environ['QMOI_GIST_ID'] = 'fake_gist'
    os.environ['QMOI_GH_TOKEN'] = 'fake_token'

    class DummyResp:
        status_code = 200

    class DummyRequests:
        def patch(self, url, headers, json=None, timeout=None):
            assert 'gists' in url
            return DummyResp()

    monkeypatch.setattr(q, 'requests', DummyRequests())

    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is True
    assert 'gist:ok' in details

def test_push_hf_success(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'hf'
    os.environ['QMOI_HF_TOKEN'] = 'fake_hf_token'
    os.environ['QMOI_HF_REPO'] = 'user/repo'

    class DummyResp:
        status_code = 201

    class DummyRequests:
        def post(self, url, headers, json=None, timeout=None):
            assert '/commit' in url
            return DummyResp()

    monkeypatch.setattr(q, 'requests', DummyRequests())

    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is True
    assert 'hf:ok' in details

def test_push_scp_success(monkeypatch, tmp_path):
    os.environ['QMOI_SYNC_BACKENDS'] = 'scp:user@host:/tmp/qmoi_memory.json'

    def fake_check_call(args):
        # emulate successful scp
        return 0

    monkeypatch.setattr('subprocess.check_call', lambda args: fake_check_call(args))

    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is True
    assert any(d.startswith('scp:user@host:/tmp/qmoi_memory.json:ok') for d in details)

def test_pull_gist_success(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'gist'
    os.environ['QMOI_GIST_ID'] = 'fake_gist'
    os.environ['QMOI_GH_TOKEN'] = 'fake_token'

    dummy_content = {'conversations': [{'timestamp': '1', 'persona': 'user', 'message': 'hello'}]}

    class DummyResp:
        status_code = 200

        def json(self):
            return {'files': {'qmoi_memory.json': {'content': json.dumps(dummy_content)}}}

    class DummyRequests:
        def get(self, url, headers=None, timeout=None):
            assert 'gists' in url
            return DummyResp()

    monkeypatch.setattr(q, 'requests', DummyRequests())

    mem = q.pull_memory_from_backends()
    assert mem == dummy_content

def test_pull_hf_success(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'hf'
    os.environ['QMOI_HF_TOKEN'] = 'real'
    os.environ['QMOI_HF_REPO'] = 'user/repo'

    class DummyResp:
        status_code = 200

        def json(self):
            return {'conversations': [{'timestamp': '1', 'persona': 'user', 'message': 'hola'}]}

        @property
        def text(self):
            return json.dumps(self.json())

    class DummyRequests:
        def get(self, url, timeout=None):
            assert 'huggingface' in url
            return DummyResp()

    monkeypatch.setattr(q, 'requests', DummyRequests())

    mem = q.pull_memory_from_backends()
    assert mem == {'conversations': [{'timestamp': '1', 'persona': 'user', 'message': 'hola'}]}

def test_push_gist_missing_config_or_requests(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'gist'
    os.environ['QMOI_GIST_ID'] = 'real'
    os.environ['QMOI_GH_TOKEN'] = 'real'
    # execute 'requests' module not available
    monkeypatch.setattr(q, 'requests', None)

    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is False
    assert any(d.startswith('gist:skipped:missing_config_or_requests') for d in details)

def test_push_gist_http_error(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'gist'
    os.environ['QMOI_GIST_ID'] = 'fake_gist'
    os.environ['QMOI_GH_TOKEN'] = 'fake_token'

    class DummyResp:
        status_code = 500

    class DummyRequests:
        def patch(self, url, headers, json=None, timeout=None):
            return DummyResp()

    monkeypatch.setattr(q, 'requests', DummyRequests())

    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is False
    assert any(d.startswith('gist:error:500') for d in details)

def test_push_scp_failure(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'scp:user@host:/tmp/qmoi_memory.json'

    def fake_check_call(args):
        raise OSError('scp failed')

    monkeypatch.setattr('subprocess.check_call', lambda args: fake_check_call(args))

    ok, details = q.push_memory_to_backends({'conversations': []})
    assert ok is False
    assert any(d.startswith('scp:user@host:/tmp/qmoi_memory.json:error') for d in details)

def test_pull_gist_missing_config(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'gist'
    # No GIST_ID or GH_TOKEN configured
    monkeypatch.setattr(q, 'requests', None)

    mem = q.pull_memory_from_backends()
    assert mem is None

def test_pull_hf_invalid_json(monkeypatch):
    os.environ['QMOI_SYNC_BACKENDS'] = 'hf'
    os.environ['QMOI_HF_TOKEN'] = 'real'
    os.environ['QMOI_HF_REPO'] = 'user/repo'

    class DummyResp:
        status_code = 200

        def json(self):
            raise ValueError('not json')

        @property
        def text(self):
            return 'not-a-json'

    class DummyRequests:
        def get(self, url, timeout=None):
            return DummyResp()

    monkeypatch.setattr(q, 'requests', DummyRequests())

    mem = q.pull_memory_from_backends()
    assert mem is None
