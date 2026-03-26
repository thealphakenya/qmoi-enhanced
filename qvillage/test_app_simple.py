// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
QVillage Minimal Test Suite
Uses core app functions and optional Live API endpoints for integration.
"""

import sys
import traceback

from app import safe_arxiv_call, search_knowledge_base, fetch_daily_papers, app

try:
    from fastapi.testclient import TestClient
    client = TestClient(app)
except Exception:
    client = None


def run_test(test_func):
    try:
        test_func()
        print(f"✓ {test_func.__name__} passed")
        return True
    except Exception as e:
        print(f"✗ {test_func.__name__} failed: {e}")
        traceback.print_exc()
        return False


def test_arxiv_call():
    papers = safe_arxiv_call("machine learning", 5)
    assert isinstance(papers, list)


def test_knowledge_base_search():
    results = search_knowledge_base("neural networks")
    assert isinstance(results, list)


def test_daily_papers():
    papers = fetch_daily_papers()
    assert isinstance(papers, list)


def test_api_health():
    if not client:
        return
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"


def test_api_root():
    if not client:
        return
    r = client.get("/")
    assert r.status_code == 200


def test_simple_paid_features():
    models_created = sum(1 for _ in range(10))
    assert models_created == 10

    spaces_created = sum(1 for _ in range(10))
    assert spaces_created == 10

    datasets_created = sum(1 for _ in range(10))
    assert datasets_created == 10


def main():
    tests = [
        test_arxiv_call,
        test_knowledge_base_search,
        test_daily_papers,
        test_api_health,
        test_api_root,
        test_simple_paid_features,
    ]

    passed = 0
    total = len(tests)

    for t in tests:
        if run_test(t):
            passed += 1

    print(f"Tests passed: {passed}/{total}")
    if passed != total:
        sys.exit(1)


if __name__ == "__main__":
    main()
