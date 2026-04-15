#!/usr/bin/env python3
"""
Test suite for QVillage HF Space app.
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core import (
    fetch_daily_papers,
    generate_session_token,
    get_community_stats,
    load_trending_papers,
    search_knowledge_base,
)


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        print(f"✗ {message}")
        raise AssertionError(message)
    print(f"✓ {message}")


async def test_safe_arxiv_call_success() -> None:
    result = fetch_daily_papers(max_results=3)
    assert_true(isinstance(result, str), "fetch_daily_papers should return a string")
    assert_true(len(result) > 0, "fetch_daily_papers should return non-empty results")


async def test_search_knowledge_base() -> None:
    result = search_knowledge_base("transformer")
    assert_true(isinstance(result, str), "search_knowledge_base should return a string")
    assert_true("Transformer" in result or "transformer" in result.lower(), "search_knowledge_base should find transformer content")


async def test_search_empty_query() -> None:
    result = search_knowledge_base("")
    assert_true("Enter at least 2 characters" in result, "search_knowledge_base should validate empty queries")


async def test_load_trending_papers() -> None:
    result = load_trending_papers()
    assert_true(isinstance(result, str), "load_trending_papers should return a string")
    assert_true(len(result) > 0, "load_trending_papers should return trending content")


async def test_get_community_stats() -> None:
    result = get_community_stats()
    assert_true(isinstance(result, str), "get_community_stats should return a string")
    assert_true("Active Researchers" in result, "get_community_stats should include active user stats")


async def run_all_tests() -> int:
    print("Running HF Space QVillage tests...")
    print("=" * 60)

    await test_safe_arxiv_call_success()
    await test_search_knowledge_base()
    await test_search_empty_query()
    await test_load_trending_papers()
    await test_get_community_stats()

    token1 = generate_session_token()
    token2 = generate_session_token()
    assert_true(token1.startswith("hf_"), "generate_session_token should start with hf_")
    assert_true(token1 != token2, "generate_session_token should return unique tokens")

    print("=" * 60)
    print("All tests passed! ✓")
    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(run_all_tests())
    sys.exit(exit_code)
