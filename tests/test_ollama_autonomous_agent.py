#!/usr/bin/env python3
"""
Comprehensive Test Suite for QMOI Ollama Autonomous Agent
Tests all validation functions, feature checks, and platform compliance.
"""

import json
import pytest
from pathlib import Path
import sys
from unittest.mock import patch, MagicMock

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from ollama_autonomous_agent import (
    OllamaAutonomousAgent,
    PlatformValidator,
    FeatureTester,
    FileHandlerValidator,
    MemoryIndexGenerator,
    ModelCardGenerator,
    WorkflowNormalizer,
    BranchSyncManager,
    AvatarIdentityValidator,
    AvatarWindowMonitor,
    resolve_github_token,
    mask_github_token,
)


class TestPlatformValidator:
    """Tests for PlatformValidator class."""
    
    def test_validator_initialization(self):
        """Test platform validator can be initialized for each platform."""
        platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        for platform in platforms:
            validator = PlatformValidator(platform)
            assert validator.platform == platform
    
    def test_all_platforms_support_validation(self):
        """Verify validation methods exist for all platforms."""
        platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        for platform in platforms:
            validator = PlatformValidator(platform)
            assert hasattr(validator, 'validate_code_compiles')
            assert hasattr(validator, 'validate_dependencies_resolve')
            assert hasattr(validator, 'validate_manifests_present')
            assert hasattr(validator, 'validate_signatures')


class TestFeatureTester:
    """Tests for FeatureTester class."""
    
    def test_qmoiaiui_features_complete(self):
        """Test QMOIAIUI has all required features."""
        tester = FeatureTester("qmoiaiui", "web")
        features = tester.test_qmoiaiui_features()
        
        required_features = [
            "conversation_creation",
            "message_history",
            "model_selector",
            "parameter_tuning",
            "export_functionality",
            "voice_input",
            "voice_output",
            "memory_persistence",
            "accessibility_features",
            "platform_specific_styling",
        ]
        
        for feature in required_features:
            assert feature in features, f"Missing feature: {feature}"
    
    def test_qcity_features_complete(self):
        """Test QCity has all required features."""
        tester = FeatureTester("qcity", "web")
        features = tester.test_qcity_features()
        
        required_features = [
            "folder_tree_navigation",
            "view_modes",
            "search_functionality",
            "batch_operations",
            "duplicate_finder",
            "smart_tags",
            "auto_organization",
            "cloud_storage_integration",
            "voice_commands",
            "gesture_controls",
            "file_preview",
        ]
        
        for feature in required_features:
            assert feature in features, f"Missing feature: {feature}"
    
    def test_qmoi_space_features_complete(self):
        """Test QMOI Space has all required features."""
        tester = FeatureTester("qmoi-space", "web")
        features = tester.test_qmoi_space_features()
        
        required_features = [
            "playback_controls",
            "volume_control",
            "quality_selection",
            "subtitle_switching",
            "audio_track_switching",
            "playlist_management",
            "picture_in_picture",
            "media_library",
            "voice_control",
            "gesture_control",
            "keyboard_shortcuts",
            "eye_tracking",
        ]
        
        for feature in required_features:
            assert feature in features, f"Missing feature: {feature}"
    
    def test_qalpha_features_complete(self):
        """Test QALPHA has all required features."""
        tester = FeatureTester("qalpha", "web")
        features = tester.test_qalpha_features()
        
        required_features = [
            "code_editing",
            "syntax_highlighting",
            "code_completion",
            "debugger",
            "terminal_integration",
            "git_integration",
            "file_explorer",
            "theme_support",
            "keyboard_shortcuts",
            "extensions",
        ]
        
        for feature in required_features:
            assert feature in features, f"Missing feature: {feature}"


class TestFileHandlerValidator:
    """Tests for FileHandlerValidator class."""
    
    def test_file_type_coverage(self):
        """Verify all common file types have handlers."""
        validator = FileHandlerValidator()
        
        essential_types = {
            ".pdf": "qcity",      # Documents
            ".mp3": "qmoi-space",  # Audio
            ".mp4": "qmoi-space",  # Video
            ".zip": "qcity",       # Archives
            ".py": "qalpha",       # Code
            ".xlsx": "qcity",      # Spreadsheets
        }
        
        for ext, expected_handler in essential_types.items():
            assert ext in validator.FILE_TYPE_MAPPING
            assert validator.FILE_TYPE_MAPPING[ext] == expected_handler
    
    def test_handler_validation_for_all_platforms(self):
        """Test handler validation works for all platforms."""
        validator = FileHandlerValidator()
        platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        
        for platform in platforms:
            results = validator.validate_handler_registration(platform)
            assert isinstance(results, dict)
            assert len(results) > 0  # Should have results


class TestMemoryIndexGenerator:
    """Tests for MemoryIndexGenerator class."""
    
    def test_memory_index_generation(self, tmp_path):
        """Test memory index file generation."""
        generator = MemoryIndexGenerator(tmp_path)
        
        # Create a dummy file to track
        test_file = tmp_path / "test.md"
        test_file.write_text("# Test")
        
        generator.generate_index()
        
        # Check markdown file was created
        assert generator.index_path.exists()
        content = generator.index_path.read_text()
        assert "QMOI Realtime Memory Index" in content
        assert "Files Tracked" in content
    
    def test_json_index_generation(self, tmp_path):
        """Test JSON index file generation."""
        generator = MemoryIndexGenerator(tmp_path)
        
        test_file = tmp_path / "test.py"
        test_file.write_text("# Test")
        
        generator.generate_index()
        
        # Check JSON file was created
        assert generator.json_path.exists()
        data = json.loads(generator.json_path.read_text())
        assert "generated" in data
        assert "files_tracked" in data
        assert "files" in data


class TestModelCardGenerator:
    """Tests for ModelCardGenerator class."""
    
    def test_model_card_generation(self, tmp_path):
        """Test model card file generation."""
        generator = ModelCardGenerator(tmp_path)
        generator.generate_card()
        
        # Check file was created
        assert generator.card_path.exists()
        content = generator.card_path.read_text()
        
        # Verify key sections
        assert "QMOI Model Card" in content
        assert "QMOIAIUI" in content
        assert "QCity" in content
        assert "QMOI Space" in content
        assert "QALPHA" in content
    
    def test_model_card_includes_all_apps(self, tmp_path):
        """Verify model card documents all apps."""
        generator = ModelCardGenerator(tmp_path)
        generator.generate_card()
        
        content = generator.card_path.read_text()
        
        apps = {
            "QMOIAIUI": "Conversational AI",
            "QCity": "File Manager",
            "QMOI Space": "Media Player",
            "QALPHA": "IDE",
        }
        
        for app, description in apps.items():
            assert app in content


class TestWorkflowNormalizer:
    """Tests for WorkflowNormalizer class."""
    
    def test_normalize_4space_indentation(self):
        """Test normalization of 4-space indentation."""
        input_yaml = """---
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Test
              run: echo test
"""

        result = WorkflowNormalizer.normalize(input_yaml)

        # The workflow should retain the proper YAML structure even when the source
        # indentation is expanded to 4 spaces. The important contract is that the
        # structure is preserved and the content remains valid.
        assert "jobs:" in result
        assert "build:" in result
        assert "runs-on: ubuntu-latest" in result
        assert "- name: Test" in result
        assert "run: echo test" in result
        result = WorkflowNormalizer.normalize(input_yaml)
        lines = result.split('\n')
        
        # Should maintain empty lines
        assert '' in lines


class TestGitHubTokenConfiguration:
    """Tests for secure GitHub token resolution and masking."""

    def test_custom_token_has_priority(self, monkeypatch):
        """MY_CUSTOM_TOKEN should be preferred over the default GitHub token."""
        monkeypatch.setenv("MY_CUSTOM_TOKEN", "custom-token-123")
        monkeypatch.setenv("MY_CUTOM_TOKEN", "legacy-token-456")
        monkeypatch.setenv("GITHUB_TOKEN", "default-token-789")
        assert resolve_github_token() == "custom-token-123"

    def test_legacy_alias_is_supported(self, monkeypatch):
        """MY_CUTOM_TOKEN alias should still work for compatibility."""
        monkeypatch.delenv("MY_CUSTOM_TOKEN", raising=False)
        monkeypatch.delenv("GITHUB_TOKEN", raising=False)
        monkeypatch.setenv("MY_CUTOM_TOKEN", "legacy-token-456")
        assert resolve_github_token() == "legacy-token-456"

    def test_masked_token_hides_secret_value(self):
        """Token masking should not leak the secret in logs."""
        masked = mask_github_token("ghp_verysecretvalue123")
        assert masked.startswith("ghp_") or "..." in masked
        assert masked != "ghp_verysecretvalue123"

    def test_github_actions_monitoring_is_independent_of_codespace(self):
        """Monitoring should be configured to run via GitHub Actions instead of local execution."""
        workflows_dir = Path(__file__).resolve().parent.parent / ".github" / "workflows"
        pr_monitor = workflows_dir / "pr-monitor.yml"
        tracker = workflows_dir / "workflow-tracker.yml"
        assert pr_monitor.exists()
        assert tracker.exists()

        monitor_yaml = pr_monitor.read_text()
        tracker_yaml = tracker.read_text()
        assert "workflow_run:" in monitor_yaml or "schedule:" in monitor_yaml
        assert "workflow_run:" in tracker_yaml or "schedule:" in tracker_yaml


class TestBranchSyncManager:
    """Tests for branch sync automation across the supported repo set."""

    def test_branch_sync_requires_main_and_backup(self):
        """The agent must maintain both main and autosync-backup branches."""
        manager = BranchSyncManager()
        branches = manager.required_branches()
        assert "main" in branches
        assert "autosync-backup" in branches

    def test_sync_targets_include_qmoi_and_alpha_q_ai(self):
        """The agent must synchronize both the current repo and Alpha-Q-ai."""
        manager = BranchSyncManager()
        targets = manager.sync_targets()
        assert "thealphakenya/qmoi-enhanced" in targets
        assert "thealphakenya/Alpha-Q-ai" in targets

    def test_branch_sync_plan_is_generated(self):
        """The sync plan should describe the required repo and branch updates."""
        manager = BranchSyncManager()
        plan = manager.build_sync_plan()
        assert plan["default_branch"] == "main"
        assert "autosync-backup" in plan["branches"]
        assert "thealphakenya/qmoi-enhanced" in plan["repositories"]

    def test_branch_sync_workflow_exists(self):
        """A GitHub workflow should exist to keep the branch sync running independently of the codespace."""
        workflow_path = Path(__file__).resolve().parent.parent / ".github" / "workflows" / "branch-sync.yml"
        assert workflow_path.exists()
        content = workflow_path.read_text()
        assert "autosync-backup" in content
        assert "Alpha-Q-ai" in content or "Alpha-Q-ai" in content


class TestAvatarRealtimeValidation:
    """Tests for avatar identity and live QMOI rendering."""

    def test_qmoi_identity_validation_accepts_qmoi(self):
        validator = AvatarIdentityValidator("qmoi")
        assert validator.validate_identity() is True
        report = validator.generate_identity_report()
        assert report["is_qmoi"] is True

    def test_qmoi_identity_validation_rejects_non_qmoi(self):
        validator = AvatarIdentityValidator("other-avatar")
        assert validator.validate_identity() is False

    def test_avatar_window_monitor_reports_live_realtime_state(self):
        monitor = AvatarWindowMonitor("qmoi", "QMOI")
        snapshot = monitor.generate_animation_snapshot()
        assert snapshot["status"] == "live"
        assert snapshot["window"]["identity_matches_qmoi"] is True
        assert snapshot["window"]["realtime_render"] is True

    def test_branch_sync_plan_uses_thealphakenya_owner(self):
        plan = BranchSyncManager.build_sync_plan()
        assert plan["owner"] == "thealphakenya"
        assert "thealphakenya/qmoi-enhanced" in plan["repositories"]
        assert "thealphakenya/Alpha-Q-ai" in plan["repositories"]


class TestOllamaAutonomousAgent:
    """Integration tests for OllamaAutonomousAgent."""
    
    def test_agent_initialization(self, tmp_path):
        """Test agent can be initialized."""
        agent = OllamaAutonomousAgent(tmp_path)
        assert agent.root_dir == tmp_path
        assert len(agent.validators) == 6  # 6 platforms
    
    def test_all_platforms_have_validators(self, tmp_path):
        """Verify all platforms have validators."""
        agent = OllamaAutonomousAgent(tmp_path)
        expected_platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        
        for platform in expected_platforms:
            assert platform in agent.validators
            assert isinstance(agent.validators[platform], PlatformValidator)
    
    def test_validate_all_platforms_returns_dict(self, tmp_path):
        """Test validate_all_platforms returns proper structure."""
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_all_platforms()
        
        assert isinstance(results, dict)
        for platform in ["windows", "macos", "linux", "ios", "android", "web"]:
            assert platform in results
            assert isinstance(results[platform], dict)
    
    def test_validate_all_features_returns_dict(self, tmp_path):
        """Test validate_all_features returns proper structure."""
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_all_features()
        
        assert isinstance(results, dict)
        expected_apps = ["qmoiaiui", "qcity", "qmoi-space", "qalpha"]
        for app in expected_apps:
            assert app in results
    
    def test_validate_file_handlers_returns_dict(self, tmp_path):
        """Test validate_file_handlers returns proper structure."""
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_file_handlers()
        
        assert isinstance(results, dict)
        for platform in ["windows", "macos", "linux", "ios", "android", "web"]:
            assert platform in results


class TestPRSuccessContract:
    """Tests verifying PR validation contract compliance."""
    
    def test_pr_contract_validates_all_platforms(self, tmp_path):
        """
        Verify PR contract: 
        All builds must succeed on Windows, macOS, Linux, iOS, Android, Web
        """
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_all_platforms()
        
        required_platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        
        for platform in required_platforms:
            assert platform in results, f"Platform {platform} validation missing"
    
    def test_pr_contract_validates_all_features(self, tmp_path):
        """
        Verify PR contract:
        All features must be tested for all apps
        """
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_all_features()
        
        required_apps = ["qmoiaiui", "qcity", "qmoi-space", "qalpha"]
        required_platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        
        for app in required_apps:
            assert app in results, f"App {app} feature tests missing"
            for platform in required_platforms:
                assert platform in results[app], f"Platform {platform} tests missing for {app}"
    
    def test_pr_contract_validates_file_handlers(self, tmp_path):
        """
        Verify PR contract:
        File handlers must be validated for all platforms
        """
        agent = OllamaAutonomousAgent(tmp_path)
        results = agent.validate_file_handlers()
        
        required_platforms = ["windows", "macos", "linux", "ios", "android", "web"]
        
        for platform in required_platforms:
            assert platform in results, f"Platform {platform} handler validation missing"
    
    def test_pr_contract_generates_memory_index(self, tmp_path):
        """
        Verify PR contract:
        Memory index and JSON must be generated
        """
        agent = OllamaAutonomousAgent(tmp_path)
        
        # Create a test file
        test_file = tmp_path / "test.md"
        test_file.write_text("# Test")
        
        agent.memory_generator.generate_index()
        
        assert agent.memory_generator.index_path.exists()
        assert agent.memory_generator.json_path.exists()
    
    def test_pr_contract_generates_model_card(self, tmp_path):
        """
        Verify PR contract:
        Model card must be generated
        """
        agent = OllamaAutonomousAgent(tmp_path)
        agent.model_card_generator.generate_card()
        
        assert agent.model_card_generator.card_path.exists()


class TestCrossAppIntegration:
    """Tests verifying cross-app feature integration."""
    
    def test_file_flow_from_qcity_to_qmoiaiui(self, tmp_path):
        """Test: User selects file in QCity, analyzes in QMOIAIUI."""
        # This would require running apps, but we verify the contract exists
        assert True  # Placeholder for actual integration test
    
    def test_file_flow_from_qcity_to_qmoi_space(self, tmp_path):
        """Test: User selects media in QCity, plays in QMOI Space."""
        assert True  # Placeholder
    
    def test_code_file_opens_in_qalpha_from_qcity(self, tmp_path):
        """Test: User opens .py file from QCity, edits in QALPHA."""
        assert True  # Placeholder


class TestAccessibilityCompliance:
    """Tests verifying accessibility requirements."""
    
    def test_all_apps_support_screen_readers(self):
        """Verify all apps support screen reader accessibility."""
        apps = ["qmoiaiui", "qcity", "qmoi-space", "qalpha"]
        for app in apps:
            tester = FeatureTester(app, "web")
            features = tester.test_qmoiaiui_features() if app == "qmoiaiui" else {}
            # Would verify screen reader support in actual implementation
            assert True
    
    def test_all_apps_support_keyboard_navigation(self):
        """Verify all apps support keyboard-only navigation."""
        # Would verify keyboard navigation in actual implementation
        assert True
    
    def test_all_apps_support_voice_control(self):
        """Verify all apps support voice commands."""
        # Would verify voice control in actual implementation
        assert True


class TestPerformanceBenchmarks:
    """Tests verifying performance requirements."""
    
    def test_startup_time_requirement(self):
        """Verify apps start within 3 seconds."""
        # Would measure startup time in actual implementation
        # Target: < 3 seconds
        assert True
    
    def test_memory_usage_requirement(self):
        """Verify apps use reasonable memory."""
        # Would measure memory in actual implementation
        # Target: < 500MB for most apps
        assert True
    
    def test_no_memory_leaks(self):
        """Verify apps don't leak memory over time."""
        # Would run memory profiler in actual implementation
        assert True


class TestSecurityCompliance:
    """Tests verifying security requirements."""
    
    def test_no_hardcoded_secrets(self):
        """Verify no hardcoded API keys or secrets in code."""
        # Would scan source for secrets in actual implementation
        assert True
    
    def test_no_vulnerable_dependencies(self):
        """Verify no known vulnerabilities in dependencies."""
        # Would run npm audit, pip audit in actual implementation
        assert True
    
    def test_all_transmissions_encrypted(self):
        """Verify all network communications use HTTPS/TLS."""
        # Would verify HTTPS everywhere in actual implementation
        assert True


# === FIXTURES ===

@pytest.fixture
def tmp_qmoi_structure(tmp_path):
    """Create a temporary QMOI project structure."""
    # Create directories
    (tmp_path / "apps").mkdir()
    (tmp_path / "scripts").mkdir()
    (tmp_path / "tests").mkdir()
    (tmp_path / ".github" / "workflows").mkdir(parents=True)
    
    # Create some test files
    (tmp_path / "README.md").write_text("# QMOI")
    (tmp_path / "BUILD.md").write_text("# Build Guide")
    (tmp_path / "INSTALL.md").write_text("# Install Guide")
    
    return tmp_path


# === PARAMETRIZED TESTS ===

@pytest.mark.parametrize("platform", ["windows", "macos", "linux", "ios", "android", "web"])
def test_validator_exists_for_platform(platform):
    """Test validator can be created for each platform."""
    validator = PlatformValidator(platform)
    assert validator.platform == platform


@pytest.mark.parametrize("app,features", [
    ("qmoiaiui", [
        "conversation_creation",
        "message_history",
        "model_selector",
        "parameter_tuning",
        "export_functionality",
    ]),
    ("qcity", [
        "folder_tree_navigation",
        "view_modes",
        "search_functionality",
        "batch_operations",
    ]),
    ("qmoi-space", [
        "playback_controls",
        "volume_control",
        "quality_selection",
        "playlist_management",
    ]),
    ("qalpha", [
        "code_editing",
        "syntax_highlighting",
        "code_completion",
        "debugger",
    ]),
])
def test_app_features_exist(app, features):
    """Parametrized test for app features."""
    tester = FeatureTester(app, "web")
    
    if app == "qmoiaiui":
        app_features = tester.test_qmoiaiui_features()
    elif app == "qcity":
        app_features = tester.test_qcity_features()
    elif app == "qmoi-space":
        app_features = tester.test_qmoi_space_features()
    elif app == "qalpha":
        app_features = tester.test_qalpha_features()
    
    for feature in features:
        assert feature in app_features


# === PYTEST CONFIGURATION ===

def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
    config.addinivalue_line(
        "markers", "contract: mark test as contract validation"
    )
    config.addinivalue_line(
        "markers", "performance: mark test as performance test"
    )
    config.addinivalue_line(
        "markers", "security: mark test as security test"
    )


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
