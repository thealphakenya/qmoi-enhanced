// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

#!/usr/bin/env python3
"""
Test suite for QVillage HF Space app.
Tests all functionality to ensure production readiness.
"""

import asyncio
import sys
import os

# Add the app directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import only the functions we need, avoiding gradio
from core import (
    safe_arxiv_call,
    fetch_daily_papers,
    search_knowledge_base,
    load_trending_papers,
    get_community_stats,
    generate_session_token,
    KNOWLEDGE_BASE
)

class TestRunner:
    """Simple test runner without pytest dependency."""
    
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.tests = []
    
    def assert_true(self, condition, message):
        if condition:
            self.passed += 1
            print(f"✓ {message}")
        else:
            self.failed += 1
            print(f"✗ {message}")
    
    def assert_in(self, substring, string, message):
        self.assert_true(substring in string, message)
    
    def assert_equal(self, a, b, message):
        self.assert_true(a == b, message)
    
    def assert_not_equal(self, a, b, message):
        self.assert_true(a != b, message)
    
    def run_test(self, test_func):
        """Run a test function."""
        try:
            result = asyncio.run(test_func())
            return result
        except Exception as e:
            print(f"✗ Test failed with exception: {e}")
            self.failed += 1
            return None

async def test_safe_arxiv_call_success():
    """Test successful arXiv API call."""
    # This will test the real API call
    result = await safe_arxiv_call("cat:cs.AI", max_results=5)
    
    assert "papers" in result
    assert isinstance(result["papers"], list)
    if result["papers"]:
        paper = result["papers"][0]
        assert "title" in paper
        assert "arxiv_id" in paper
    print("✓ safe_arxiv_call success test passed")

async def test_fetch_daily_papers():
    """Test fetching daily papers."""
    result = await fetch_daily_papers()
    
    assert isinstance(result, str)
    assert len(result) > 0
    print("✓ fetch_daily_papers test passed")

async def test_search_knowledge_base():
    """Test knowledge base search."""
    result = await search_knowledge_base("transformer")
    
    assert isinstance(result, str)
    assert "Transformer" in result
    print("✓ search_knowledge_base test passed")

async def test_search_empty_query():
    """Test search with empty query."""
    result = await search_knowledge_base("")
    
    assert "Enter at least 2 characters" in result
    print("✓ search_empty_query test passed")

async def test_load_trending_papers():
    """Test loading trending papers."""
    result = await load_trending_papers()
    
    assert isinstance(result, str)
    assert "Trending" in result
    print("✓ load_trending_papers test passed")

async def test_get_community_stats():
    """Test getting community stats."""
    result = await get_community_stats()
    
    assert isinstance(result, str)
    assert "Community Stats" in result
    assert "Active Users" in result
    print("✓ get_community_stats test passed")

def test_generate_session_token():
    """Test session token generation."""
    token1 = generate_session_token()
    token2 = generate_session_token()
    
    assert token1.startswith("hf_")
    assert len(token1) == 19  # hf_ + 16 hex chars
    assert token1 != token2
    print("✓ generate_session_token test passed")

async def run_all_tests():
    """Run all tests."""
    print("Running QVillage App Tests...")
    print("=" * 50)
    
    try:
        await test_safe_arxiv_call_success()
        await test_fetch_daily_papers()
        await test_search_knowledge_base()
        await test_search_empty_query()
        await test_load_trending_papers()
        await test_get_community_stats()
        test_generate_session_token()
        
        print("=" * 50)
        print("All tests passed! ✓")
        return True
        
    except Exception as e:
        print(f"Test suite failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)