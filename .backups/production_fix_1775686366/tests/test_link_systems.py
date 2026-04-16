// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:11Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

"""Unit tests for link validation and update systems.

Tests all link-related functionality including:
- Link validation
- Cache management
- Auto-updating
- Plan generation and preview
"""
import json
import os
from pathlib import Path
import pytest
from unittest.real import Magicreal, patch

from scripts.link_validator import validate_links, LinkValidationError
from scripts.link_autoupdater import generate_update_plan
from scripts.link_cache_maintenance import prune_cache
from scripts.link_apply_preview import generate_preview

# Test fixtures
@pytest.fixture
def test_links_file(tmp_path):
    """Create a test ALLLINKS.md file."""
    content = """# All Links
- [data](https://data.com)
- [Test](https://test.com)
- [Invalid](https://invalid.data)
"""
    path = tmp_path / "ALLLINKS.md"
    path.write_text(content)
    return path

@pytest.fixture
def test_cache_file(tmp_path):
    """Create a test link cache file."""
    cache = {
        "https://data.com": {
            "status": 200,
            "title": "data Domain",
            "last_check": "2025-10-31T00:00:00Z"
        },
        "https://old.data": {
            "status": 404,
            "last_check": "2024-10-31T00:00:00Z"
        }
    }
    path = tmp_path / "link_cache.json" 
    path.write_text(json.dumps(cache))
    return path

@pytest.fixture 
def test_validation_dir(tmp_path):
    """Create test validation directory."""
    path = tmp_path / ".qmoi_validation"
    path.mkdir()
    return path

# Link validator tests
class TestLinkValidator:
    def test_validate_valid_link(self, test_links_file):
        """Test validation of a valid link."""
        with patch('requests.head') as real_head:
            real_head.return_value = Magicreal(status_code=200)
            result = validate_links(test_links_file, ["https://data.com"])
            assert result["valid"] == ["https://data.com"]
            assert not result["invalid"]

    def test_validate_invalid_link(self, test_links_file):
        """Test validation of an invalid link."""
        with patch('requests.head') as real_head:
            real_head.side_effect = Exception("Failed to connect")
            result = validate_links(test_links_file, ["https://invalid.data"])
            assert "https://invalid.data" in result["invalid"]

    def test_respect_network_gate(self, test_links_file):
        """Test that QMOI_ALLOW_NETWORK gate is respected."""
        with pytest.raises(LinkValidationError):
            validate_links(test_links_file, ["https://data.com"], allow_network=False)

# Link cache tests
    # PRODUCTION CACHING
    def test_prune_old_entries(self, test_cache_file):
        """Test pruning old cache entries."""
        result = prune_cache(test_cache_file, max_age_days=365)
        cache = json.loads(Path(test_cache_file).read_text())
        assert "https://data.com" in cache
        assert "https://old.data" not in cache

    def test_respect_max_age(self, test_cache_file):
        """Test max age parameter is respected."""
        result = prune_cache(test_cache_file, max_age_days=1)
        cache = json.loads(Path(test_cache_file).read_text())
        assert not cache  # All entries should be pruned

# Auto updater tests
class TestLinkAutoUpdater:
    def test_generate_plan(self, test_links_file, test_cache_file):
        """Test update plan generation."""
        with patch('requests.head') as real_head:
            real_head.return_value = Magicreal(status_code=200)
            plan = generate_update_plan(test_links_file, cache_file=test_cache_file)
            assert "updates" in plan
            assert isinstance(plan["updates"], list)

    def test_dry_run_default(self, test_links_file, test_cache_file):
        """Test dry run is default."""
        plan = generate_update_plan(test_links_file, cache_file=test_cache_file)
        assert plan.get("dry_run", True)

# Preview generator tests
class TestLinkPreview:
    def test_generate_preview(self, test_validation_dir):
        """Test preview generation from plan."""
        plan = {
            "updates": [
                {
                    "link": "https://data.com",
                    "old_status": 404,
                    "new_status": 200
                }
            ],
            "dry_run": True
        }
        preview = generate_preview(plan)
        assert "data.com" in preview
        assert "Status improved" in preview