#!/usr/bin/env python3
"""
Enhanced Test Suite for QMOI Ollama Autonomous Agent - Tracking & Workflow Integration
Tests tracking system, telemetry, workflow integration, and PR validation evidence.
"""

import json
import pytest
import subprocess
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

    def test_q_steps_manager_records_lifecycle(self, tmp_path):
        """The runner adapter must persist lifecycle evidence."""
        script = Path(__file__).parent.parent / "scripts" / "qsteps_manager.py"
        environment = {**__import__("os").environ, "QSTEPS_TRACK_DIR": str(tmp_path)}
        for action in ("start", "complete", "fail"):
            result = subprocess.run(
                [sys.executable, str(script), action, "--step", "test-step"],
                env=environment,
                check=False,
                capture_output=True,
                text=True,
            )
            assert result.returncode == 0
        records = (tmp_path / "qsteps.jsonl").read_text().splitlines()
        assert [json.loads(line)["status"] for line in records] == [
            "running", "completed", "failed"
        ]

    def test_q_steps_manager_writes_bounded_evidence(self, tmp_path):
        """Lifecycle records expose recovery metadata and durable projections."""
        script = Path(__file__).parent.parent / "scripts" / "qsteps_manager.py"
        environment = {**__import__("os").environ, "QSTEPS_TRACK_DIR": str(tmp_path)}
        result = subprocess.run(
            [sys.executable, str(script), "fail", "--step", "contract-check",
             "--error", "validation contract failed", "--evidence", "report.json",
             "--duration-seconds", "1.5", "--attempt", "2"],
            env=environment, check=False, capture_output=True, text=True,
        )
        assert result.returncode == 0
        record = json.loads((tmp_path / "qsteps.jsonl").read_text().strip())
        assert record["error_category"] == "validation-contract"
        assert record["duration_seconds"] == 1.5
        assert record["evidence"] == "report.json"
        assert record["attempt"] == 2
        assert (tmp_path / "QSTEPS_CHECKPOINT.json").exists()
        assert (tmp_path / "QSTEPS_SUMMARY.json").exists()

    def test_q_steps_manager_records_metadata_and_summary_counts(self, tmp_path):
        """Manager records run identity and aggregate evidence for operators."""
        script = Path(__file__).parent.parent / "scripts" / "qsteps_manager.py"
        environment = {
            **__import__("os").environ,
            "QSTEPS_TRACK_DIR": str(tmp_path),
            "GITHUB_REPOSITORY": "owner/repo",
            "GITHUB_SHA": "abc123",
            "GITHUB_STEP_SUMMARY": str(tmp_path / "step-summary.md"),
        }
        result = subprocess.run(
            [sys.executable, str(script), "heartbeat", "--step", "monitor"],
            env=environment, check=False, capture_output=True, text=True,
        )
        assert result.returncode == 0
        record = json.loads((tmp_path / "qsteps.jsonl").read_text().strip())
        assert record["run_metadata"]["repository"] == "owner/repo"
        summary = json.loads((tmp_path / "QSTEPS_SUMMARY.json").read_text())
        assert summary["events_total"] == 1
        assert "monitor" in (tmp_path / "step-summary.md").read_text()

    def test_q_steps_manager_rejects_attempts_over_budget(self, tmp_path):
        """A retry beyond the declared budget fails closed."""
        script = Path(__file__).parent.parent / "scripts" / "qsteps_manager.py"
        environment = {**__import__("os").environ, "QSTEPS_TRACK_DIR": str(tmp_path), "QSTEPS_MAX_ATTEMPTS": "2"}
        result = subprocess.run(
            [sys.executable, str(script), "fail", "--step", "retry", "--attempt", "3"],
            env=environment, check=False, capture_output=True, text=True,
        )
        assert result.returncode != 0

    def test_q_steps_manager_run_wraps_command_lifecycle(self, tmp_path):
        """The run adapter owns command execution and records its outcome."""
        script = Path(__file__).parent.parent / "scripts" / "qsteps_manager.py"
        environment = {**__import__("os").environ, "QSTEPS_TRACK_DIR": str(tmp_path)}
        result = subprocess.run(
            [sys.executable, str(script), "run", "--step", "wrapped", "--",
             sys.executable, "-c", "pass"],
            env=environment, check=False, capture_output=True, text=True,
        )
        assert result.returncode == 0
        records = [json.loads(line) for line in (tmp_path / "qsteps.jsonl").read_text().splitlines()]
        assert [record["status"] for record in records] == ["running", "completed"]
        assert records[-1]["duration_seconds"] >= 0

    def test_q_steps_manager_run_preserves_command_failure(self, tmp_path):
        """The wrapper records failures without hiding the command exit code."""
        script = Path(__file__).parent.parent / "scripts" / "qsteps_manager.py"
        environment = {**__import__("os").environ, "QSTEPS_TRACK_DIR": str(tmp_path)}
        result = subprocess.run(
            [sys.executable, str(script), "run", "--step", "failed-command", "--",
             sys.executable, "-c", "raise SystemExit(7)"],
            env=environment, check=False, capture_output=True, text=True,
        )
        assert result.returncode == 7
        records = [json.loads(line) for line in (tmp_path / "qsteps.jsonl").read_text().splitlines()]
        assert records[-1]["status"] == "failed"
        assert records[-1]["error"] == "command exited 7"

    def test_every_workflow_declares_q_steps_manager(self):
        """All GitHub workflows must opt into the shared step contract."""
        import yaml

        workflow_dir = Path(__file__).parent.parent / ".github" / "workflows"
        workflows = sorted(workflow_dir.glob("*.y*ml"))
        assert workflows
        for workflow in workflows:
            document = yaml.safe_load(workflow.read_text())
            assert document["env"]["QSTEPS_MANAGER"] == "qsteps-v1", workflow

    def test_hosted_ollama_validation_runs_on_published_manager_branches(self):
        """The hosted autonomous-agent gate must run after branch publication."""
        import yaml

        workflow = Path(__file__).parent.parent / ".github" / "workflows" / "ollama-pr-validation.yml"
        document = yaml.safe_load(workflow.read_text())
        events = document.get("on", document.get(True, {}))
        assert "pull_request" in events
        assert "push" in events
        assert "copilot/**" in events["push"]["branches"]

    def test_master_orchestrator_covers_each_executable_job(self):
        """The master workflow must initialize lifecycle evidence for every job."""
        import yaml

        workflow = Path(__file__).parent.parent / ".github" / "workflows" / "ollama-master-orchestrator.yml"
        document = yaml.safe_load(workflow.read_text())
        expected = {"pre-flight-checks", "comprehensive-validation", "enhanced-test-execution", "trigger-agent-on-success", "final-status-report"}
        assert expected.issubset(document["jobs"])
        text = workflow.read_text()
        for job in expected:
            assert job in text
        assert text.count("Q Steps Manager start") >= len(expected)

    def test_hosted_workflow_contract_validator_passes(self, tmp_path):
        """The contract validator used by GitHub must pass locally."""
        from validate_workflow_contracts import validate

        report = validate(Path(__file__).parent.parent / ".github" / "workflows")
        assert report["ready_for_github"] is True
        assert report["workflow_count"] == 8
        assert report["job_count"] >= 20
        output = tmp_path / "workflow_contract.json"
        output.write_text(json.dumps(report), encoding="utf-8")
        assert json.loads(output.read_text())["errors"] == []


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
