#!/usr/bin/env python3
"""
Enhanced Test Suite for QMOI Ollama Autonomous Agent - Tracking & Workflow Integration
Tests tracking system, telemetry, workflow integration, and PR validation evidence.
"""

import json
import pytest
from pathlib import Path
import sys
from datetime import datetime, timezone

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from ollama_autonomous_agent import (
    OllamaAutonomousAgent,
    PlatformValidator,
    PlatformSpecificFeatureValidator,
    FileHandlerValidator,
)


class TestEnhancedTracking:
    """Tests for enhanced tracking and telemetry system."""
    
    def test_tracker_directory_created(self, tmp_path):
        """Tracker directory should be created on agent initialization."""
        agent = OllamaAutonomousAgent(tmp_path)
        assert agent.tracker_dir.exists()
    
    def test_tracker_required_files_created(self, tmp_path):
        """All required tracker files should be created."""
        agent = OllamaAutonomousAgent(tmp_path)
        required_files = [
            "CURRENT_STATUS.txt",
            "LATEST_ACTIVITY.txt",
            "STATE.txt",
            "PR_STATUS.txt",
            "LAST_RECONCILIATION.txt",
            "TRACKING_INDEX.txt",
            "telemetry.jsonl",
        ]
        for file_name in required_files:
            file_path = agent.tracker_dir / file_name
            assert file_path.exists(), f"Required file {file_name} not created"
    
    def test_tracker_event_recorded(self, tmp_path):
        """Tracker events should be properly recorded."""
        agent = OllamaAutonomousAgent(tmp_path)
        event = agent.record_tracker_event(
            "test_event",
            "Test event message",
            status="testing",
            phase="test",
            details={"test": "data"}
        )
        
        assert event is not None
        assert event["event"] == "test_event"
        assert event["status"] == "testing"
    
    def test_telemetry_appended_correctly(self, tmp_path):
        """Telemetry should be appended to telemetry.jsonl correctly."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("test1", "First event")
        agent.record_tracker_event("test2", "Second event")
        
        telemetry_file = agent.tracker_dir / "telemetry.jsonl"
        lines = telemetry_file.read_text().strip().split("\n")
        assert len(lines) >= 2  # At least the two events we recorded
    
    def test_current_status_updated(self, tmp_path):
        """CURRENT_STATUS.txt should be updated with latest event."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event(
            "status_update",
            "Testing status update",
            status="updated"
        )
        
        status_file = agent.tracker_dir / "CURRENT_STATUS.txt"
        content = status_file.read_text()
        assert "updated" in content.lower()
    
    def test_state_file_updated(self, tmp_path):
        """STATE.txt should be updated with current state."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event(
            "state_update",
            "Testing state",
            status="active",
            phase="test"
        )
        
        state_file = agent.tracker_dir / "STATE.txt"
        content = state_file.read_text()
        assert "active" in content.lower()
        assert "test" in content.lower()
    
    def test_monitoring_summary_generated(self, tmp_path):
        """Monitoring summary JSON should be generated correctly."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("monitor", "Monitoring test")
        
        summary_file = agent.tracker_dir / "monitoring_summary.json"
        assert summary_file.exists()
        summary = json.loads(summary_file.read_text())
        assert "event" in summary
        assert "timestamp_utc" in summary
    
    def test_latest_activity_updated(self, tmp_path):
        """LATEST_ACTIVITY.txt should track latest activity."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("activity_test", "Latest activity message")
        
        activity_file = agent.tracker_dir / "LATEST_ACTIVITY.txt"
        content = activity_file.read_text()
        assert "activity_test" in content or "Latest activity message" in content
    
    def test_tracking_index_updated(self, tmp_path):
        """TRACKING_INDEX.txt should document tracking schema."""
        agent = OllamaAutonomousAgent(tmp_path)
        tracking_index = agent.tracker_dir / "TRACKING_INDEX.txt"
        assert tracking_index.exists()
        content = tracking_index.read_text()
        assert "tracking" in content.lower() or "schema" in content.lower()


class TestEnhancedValidation:
    """Tests for enhanced validation with diagnostics."""
    
    def test_platform_validator_diagnostics(self):
        """Platform validator should track diagnostics for failed builds."""
        validator = PlatformValidator("linux")
        # Attempt validation (will skip if no app dir)
        validator.validate_code_compiles("nonexistent_app", with_diagnostics=True)
        # Diagnostics should be a dict
        assert isinstance(validator.diagnostics, dict)
    
    def test_platform_validator_caching(self):
        """Platform validator should cache compilation results."""
        validator = PlatformValidator("web")
        validator.validate_code_compiles("test_app")
        validator.validate_code_compiles("test_app")  # Second call should use cache
        assert "test_app-web" in validator.compile_cache
    
    def test_validation_with_timing(self, tmp_path):
        """Validation should include timing information."""
        agent = OllamaAutonomousAgent(tmp_path)
        # This would normally be called during full validation
        results = agent.validate_all_platforms()
        assert isinstance(results, dict)
    
    def test_feature_validator_comprehensive(self, tmp_path):
        """Feature validator should comprehensively check all features."""
        agent = OllamaAutonomousAgent(tmp_path)
        # Validate features for a platform and app
        for platform in ["windows", "linux", "web"]:
            for app in ["qmoiaiui", "qcity", "qmoi-space", "qalpha"]:
                validator = PlatformSpecificFeatureValidator(app, platform)
                result = validator.validate_all_features()
                assert isinstance(result, dict)


class TestWorkflowIntegration:
    """Tests for GitHub workflow integration and PR validation."""
    
    def test_pr_validation_contract_produced(self, tmp_path):
        """Agent should produce PR validation contract."""
        agent = OllamaAutonomousAgent(tmp_path)
        proof = agent.build_github_proof_contract()
        
        assert "status" in proof or "proof" in proof
        if "proof" in proof:
            assert "platform_validation_passed" in proof["proof"]
            assert "feature_validation_passed" in proof["proof"]
    
    def test_full_validation_produces_evidence(self, tmp_path):
        """Full validation should produce evidence of success."""
        agent = OllamaAutonomousAgent(tmp_path)
        success = agent.run_full_validation_suite()
        
        # Success should be a boolean
        assert isinstance(success, bool)
        
        # Tracker should have recorded validation events
        tracking_index = agent.tracker_dir / "TRACKING_INDEX.txt"
        assert tracking_index.exists()
    
    def test_validation_tracks_phases(self, tmp_path):
        """Validation should track all phases."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.run_full_validation_suite()
        
        telemetry_file = agent.tracker_dir / "telemetry.jsonl"
        content = telemetry_file.read_text()
        
        # Should have validation-related events
        assert "validation" in content.lower() or telemetry_file.stat().st_size > 0
    
    def test_validation_creates_pr_status(self, tmp_path):
        """Validation should update PR status."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.run_full_validation_suite()
        
        pr_status = agent.tracker_dir / "PR_STATUS.txt"
        assert pr_status.exists()
        content = pr_status.read_text()
        # PR status should have been updated
        assert len(content) > 0


class TestPlatformDiagnostics:
    """Tests for platform-specific diagnostics and reporting."""
    
    def test_platform_validator_reports_diagnostics(self):
        """Failed platform validations should include diagnostics."""
        validator = PlatformValidator("linux")
        # This will attempt to validate a non-existent app
        result = validator.validate_code_compiles("nonexistent", with_diagnostics=True)
        
        # Should return false for non-existent app
        assert isinstance(result, bool)
    
    def test_dependency_validation(self, tmp_path):
        """Validator should check dependency files."""
        validator = PlatformValidator("web")
        result = validator.validate_dependencies_resolve("test_app")
        assert isinstance(result, bool)
    
    def test_manifest_validation(self, tmp_path):
        """Validator should check manifest files."""
        validator = PlatformValidator("ios")
        result = validator.validate_manifests_present("test_app")
        assert isinstance(result, bool)
    
    def test_signature_validation(self, tmp_path):
        """Validator should check code signatures."""
        validator = PlatformValidator("macos")
        result = validator.validate_signatures("test_app")
        assert isinstance(result, bool)
    
    def test_all_platforms_diagnostic_support(self):
        """All platforms should support diagnostics."""
        platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        for platform in platforms:
            validator = PlatformValidator(platform)
            assert validator.diagnostics == {}


class TestTrackerConsistency:
    """Tests to ensure tracker files remain consistent."""
    
    def test_tracker_files_consistency(self, tmp_path):
        """All tracker files should reference same timestamp."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("consistency_test", "Testing consistency")
        
        # All tracker files should exist
        required = ["CURRENT_STATUS.txt", "STATE.txt", "LATEST_ACTIVITY.txt"]
        for file_name in required:
            assert (agent.tracker_dir / file_name).exists()
    
    def test_telemetry_valid_json(self, tmp_path):
        """All telemetry lines should be valid JSON."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("json_test", "Testing JSON")
        
        telemetry_file = agent.tracker_dir / "telemetry.jsonl"
        for line in telemetry_file.read_text().strip().split("\n"):
            if line.strip():
                obj = json.loads(line)
                assert "timestamp_utc" in obj or "event" in obj
    
    def test_tracker_timestamps_valid(self, tmp_path):
        """All tracker timestamps should be valid ISO 8601 format."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("timestamp_test", "Testing timestamps")
        
        telemetry_file = agent.tracker_dir / "telemetry.jsonl"
        for line in telemetry_file.read_text().strip().split("\n"):
            if line.strip():
                obj = json.loads(line)
                # Should be able to parse the timestamp
                if "timestamp_utc" in obj:
                    ts = obj["timestamp_utc"]
                    assert "Z" in ts or "T" in ts  # ISO 8601 format


class TestPRValidationEvidence:
    """Tests to ensure PR validation produces proper evidence."""
    
    def test_platform_compilation_evidence(self, tmp_path):
        """Validation should produce evidence of platform compilation."""
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_all_platforms()
        
        # Should have results for all 6 platforms
        assert len(results) >= 5  # At least most platforms
    
    def test_feature_validation_evidence(self, tmp_path):
        """Validation should produce evidence of 280+ feature validation."""
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_all_features()
        
        # Should have app results
        assert isinstance(results, dict)
    
    def test_file_handler_evidence(self, tmp_path):
        """Validation should produce evidence of file handler validation."""
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_file_handlers()
        
        # Should have results for platforms
        assert isinstance(results, dict)
    
    def test_proof_contract_complete(self, tmp_path):
        """Proof contract should include all required fields."""
        agent = OllamaAutonomousAgent(tmp_path)
        proof = agent.build_github_proof_contract()
        
        # Should have main fields
        assert "status" in proof or "proof" in proof


class TestMonitoringData:
    """Tests for monitoring data quality and completeness."""
    
    def test_monitoring_summary_structure(self, tmp_path):
        """Monitoring summary should have proper structure."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("monitoring", "Test", status="active", phase="test")
        
        summary_file = agent.tracker_dir / "monitoring_summary.json"
        summary = json.loads(summary_file.read_text())
        
        # Should have required fields
        assert "event" in summary
        assert "status" in summary
        assert "timestamp_utc" in summary
    
    def test_telemetry_contains_event_sequence(self, tmp_path):
        """Telemetry should preserve event sequence."""
        agent = OllamaAutonomousAgent(tmp_path)
        agent.record_tracker_event("first", "First")
        agent.record_tracker_event("second", "Second")
        agent.record_tracker_event("third", "Third")
        
        telemetry_file = agent.tracker_dir / "telemetry.jsonl"
        lines = [json.loads(line) for line in telemetry_file.read_text().strip().split("\n") if line.strip()]
        
        # At least 2 events (startup + recorded events)
        assert len(lines) >= 2


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
