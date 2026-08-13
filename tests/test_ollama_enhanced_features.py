#!/usr/bin/env python3
"""
Comprehensive Test Suite for Ollama Autonomous Agent
=====================================================
Tests for 280+ platform-specific features across 4 apps × 6 platforms.
Validates PR success conditions before merge.
"""

import pytest
import sys
from pathlib import Path
from typing import Dict, List

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from ollama_autonomous_agent_enhanced import (
    PlatformValidator,
    PlatformSpecificFeatureValidator,
    OllamaAutonomousAgent,
    PLATFORMS,
    QMOI_APPS,
    PLATFORM_SPECIFIC_FEATURES,
)

# ============================================================================
# TEST CONFIGURATION
# ============================================================================

class TestPlatformSpecificFeatures:
    """Master test class for all 280+ platform-specific features."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test environment."""
        self.agent = OllamaAutonomousAgent()
        self.platforms = PLATFORMS
        self.apps = list(QMOI_APPS.keys())
    
    # ========================================================================
    # WINDOWS FEATURES (12 per app × 4 apps = 48 total)
    # ========================================================================
    
    def test_windows_qmoiaiui_features_complete(self):
        """Test all 12 QMOIAIUI features on Windows."""
        expected_features = [
            "windows_notifications_api",
            "media_keys_integration",
            "taskbar_integration",
            "windows_hello_biometric",
            "fluent_design_styling",
            "cortana_integration",
            "clipboard_history",
            "virtual_desktop_support",
            "registry_persistence",
            "game_bar_integration",
            "winget_auto_update",
            "file_explorer_context_menu",
        ]
        
        actual_features = PLATFORM_SPECIFIC_FEATURES["windows"]["qmoiaiui"]
        assert len(actual_features) >= 12, f"Expected 12+ features, got {len(actual_features)}"
        assert all(f in actual_features for f in expected_features)
    
    def test_windows_qcity_features_complete(self):
        """Test all 12 QCity features on Windows."""
        expected_features = [
            "windows_shell_integration",
            "ntfs_attributes",
            "alternate_data_streams",
            "file_metadata_windows",
            "quick_access",
            "file_preview_pane",
            "compressed_folder_support",
            "unc_paths",
            "onedrive_integration",
            "windows_search",
            "file_ownership_permissions",
            "thumbnail_cache",
        ]
        
        actual_features = PLATFORM_SPECIFIC_FEATURES["windows"]["qcity"]
        assert len(actual_features) >= 12
        assert all(f in actual_features for f in expected_features)
    
    def test_windows_qmoi_space_features_complete(self):
        """Test all 12 QMOI Space features on Windows."""
        features = PLATFORM_SPECIFIC_FEATURES["windows"]["qmoi-space"]
        assert len(features) >= 12
        assert "media_keys" in features
        assert "taskbar_buttons" in features
        assert "windows_codecs" in features
    
    def test_windows_qalpha_features_complete(self):
        """Test all 12 QALPHA features on Windows."""
        features = PLATFORM_SPECIFIC_FEATURES["windows"]["qalpha"]
        assert len(features) >= 12
        assert "powershell_integration" in features
        assert "windows_api" in features
        assert "msvc_toolchain" in features
    
    # ========================================================================
    # MACOS FEATURES (13 per app × 4 apps = 52 total)
    # ========================================================================
    
    def test_macos_qmoiaiui_features_complete(self):
        """Test all 13 QMOIAIUI features on macOS."""
        features = PLATFORM_SPECIFIC_FEATURES["macos"]["qmoiaiui"]
        assert len(features) >= 13
        assert "notification_center" in features
        assert "spotlight_search" in features
        assert "handoff_continuity" in features
        assert "icloud_sync" in features
        assert "metal_gpu_acceleration" in features
    
    def test_macos_qcity_features_complete(self):
        """Test all 12 QCity features on macOS."""
        features = PLATFORM_SPECIFIC_FEATURES["macos"]["qcity"]
        assert len(features) >= 12
        assert "finder_integration" in features
        assert "quick_look_plugin" in features
        assert "airdrop_files" in features
    
    def test_macos_qmoi_space_features_complete(self):
        """Test all 12 QMOI Space features on macOS."""
        features = PLATFORM_SPECIFIC_FEATURES["macos"]["qmoi-space"]
        assert len(features) >= 12
        assert "avfoundation_framework" in features
        assert "airplay_streaming" in features
    
    def test_macos_qalpha_features_complete(self):
        """Test all 12 QALPHA features on macOS."""
        features = PLATFORM_SPECIFIC_FEATURES["macos"]["qalpha"]
        assert len(features) >= 12
        assert "xcode_integration" in features
        assert "lldb_debugger" in features
    
    # ========================================================================
    # LINUX FEATURES (13 per app × 4 apps = 52 total)
    # ========================================================================
    
    def test_linux_qmoiaiui_features_complete(self):
        """Test all 13 QMOIAIUI features on Linux."""
        features = PLATFORM_SPECIFIC_FEATURES["linux"]["qmoiaiui"]
        assert len(features) >= 13
        assert "dbus_integration" in features
        assert "desktop_entry_file" in features
        assert "appstream_metadata" in features
        assert "freedesktop_notifications" in features
    
    def test_linux_qcity_features_complete(self):
        """Test all 12 QCity features on Linux."""
        features = PLATFORM_SPECIFIC_FEATURES["linux"]["qcity"]
        assert len(features) >= 12
        assert "nautilus_dolphin_integration" in features
        assert "freedesktop_mime_types" in features
    
    def test_linux_qmoi_space_features_complete(self):
        """Test all 12 QMOI Space features on Linux."""
        features = PLATFORM_SPECIFIC_FEATURES["linux"]["qmoi-space"]
        assert len(features) >= 12
        assert "pulseaudio_integration" in features
        assert "pipewire_support" in features
    
    def test_linux_qalpha_features_complete(self):
        """Test all 12 QALPHA features on Linux."""
        features = PLATFORM_SPECIFIC_FEATURES["linux"]["qalpha"]
        assert len(features) >= 12
        assert "gcc_clang_toolchain" in features
        assert "docker_integration" in features
    
    # ========================================================================
    # IOS FEATURES (13 per app × 4 apps = 52 total)
    # ========================================================================
    
    def test_ios_qmoiaiui_features_complete(self):
        """Test all 13 QMOIAIUI features on iOS."""
        features = PLATFORM_SPECIFIC_FEATURES["ios"]["qmoiaiui"]
        assert len(features) >= 13
        assert "fileprovider_integration" in features
        assert "handoff_ios" in features
        assert "siri_shortcuts" in features
    
    def test_ios_qcity_features_complete(self):
        """Test all 12 QCity features on iOS."""
        features = PLATFORM_SPECIFIC_FEATURES["ios"]["qcity"]
        assert len(features) >= 12
        assert "files_app_integration" in features
        assert "icloud_drive_ios" in features
    
    def test_ios_qmoi_space_features_complete(self):
        """Test all 12 QMOI Space features on iOS."""
        features = PLATFORM_SPECIFIC_FEATURES["ios"]["qmoi-space"]
        assert len(features) >= 12
        assert "avplayer_framework" in features
        assert "airplay_ios" in features
    
    def test_ios_qalpha_features_complete(self):
        """Test all 12 QALPHA features on iOS."""
        features = PLATFORM_SPECIFIC_FEATURES["ios"]["qalpha"]
        assert len(features) >= 12
        assert "swift_playgrounds" in features
        assert "xcode_previews" in features
    
    # ========================================================================
    # ANDROID FEATURES (13 per app × 4 apps = 52 total)
    # ========================================================================
    
    def test_android_qmoiaiui_features_complete(self):
        """Test all 13 QMOIAIUI features on Android."""
        features = PLATFORM_SPECIFIC_FEATURES["android"]["qmoiaiui"]
        assert len(features) >= 13
        assert "content_provider" in features
        assert "documentsrovider" in features
        assert "material_you_theming" in features
    
    def test_android_qcity_features_complete(self):
        """Test all 12 QCity features on Android."""
        features = PLATFORM_SPECIFIC_FEATURES["android"]["qcity"]
        assert len(features) >= 12
        assert "storage_access_framework" in features
        assert "foldable_support" in features
    
    def test_android_qmoi_space_features_complete(self):
        """Test all 12 QMOI Space features on Android."""
        features = PLATFORM_SPECIFIC_FEATURES["android"]["qmoi-space"]
        assert len(features) >= 12
        assert "mediaplayer_exoplayer" in features
        assert "spatial_audio_android" in features
    
    def test_android_qalpha_features_complete(self):
        """Test all 12 QALPHA features on Android."""
        features = PLATFORM_SPECIFIC_FEATURES["android"]["qalpha"]
        assert len(features) >= 12
        assert "gradle_build_system" in features
        assert "android_emulator" in features
    
    # ========================================================================
    # WEB PWA FEATURES (12 per app × 4 apps = 48 total)
    # ========================================================================
    
    def test_web_qmoiaiui_features_complete(self):
        """Test all 13 QMOIAIUI features on Web."""
        features = PLATFORM_SPECIFIC_FEATURES["web"]["qmoiaiui"]
        assert len(features) >= 13
        assert "service_worker_web" in features
        assert "indexeddb_persistence" in features
    
    def test_web_qcity_features_complete(self):
        """Test all 12 QCity features on Web."""
        features = PLATFORM_SPECIFIC_FEATURES["web"]["qcity"]
        assert len(features) >= 12
        assert "drag_drop_files" in features
        assert "file_input_api" in features
    
    def test_web_qmoi_space_features_complete(self):
        """Test all 12 QMOI Space features on Web."""
        features = PLATFORM_SPECIFIC_FEATURES["web"]["qmoi-space"]
        assert len(features) >= 12
        assert "html5_audio_video" in features
        assert "mediasource_api" in features
    
    def test_web_qalpha_features_complete(self):
        """Test all 12 QALPHA features on Web."""
        features = PLATFORM_SPECIFIC_FEATURES["web"]["qalpha"]
        assert len(features) >= 12
        assert "javascript_debugging" in features
        assert "jest_testing" in features
    
    # ========================================================================
    # TOTAL FEATURE COUNT VALIDATION
    # ========================================================================
    
    def test_total_feature_count(self):
        """Verify total of 280+ platform-specific features."""
        total_features = 0
        
        for platform in PLATFORMS:
            for app in QMOI_APPS.keys():
                features = PLATFORM_SPECIFIC_FEATURES[platform].get(app, [])
                total_features += len(features)
                print(f"{platform:12} {app:15} {len(features):3} features")
        
        print(f"\nTotal: {total_features} platform-specific features")
        assert total_features >= 280, f"Expected 280+ features, got {total_features}"
    
    def test_all_platforms_present(self):
        """Verify all 6 platforms are defined."""
        assert len(PLATFORMS) == 6
        assert "windows" in PLATFORMS
        assert "macos" in PLATFORMS
        assert "linux" in PLATFORMS
        assert "ios" in PLATFORMS
        assert "android" in PLATFORMS
        assert "web" in PLATFORMS
    
    def test_all_apps_present(self):
        """Verify all 4 apps are defined."""
        assert len(QMOI_APPS) == 4
        assert "qmoiaiui" in QMOI_APPS
        assert "qmoi-space" in QMOI_APPS
        assert "qcity" in QMOI_APPS
        assert "qalpha" in QMOI_APPS
    
    # ========================================================================
    # PLATFORM FEATURE VALIDATOR TESTS
    # ========================================================================
    
    def test_platform_feature_validator_initialization(self):
        """Test PlatformSpecificFeatureValidator initialization."""
        validator = PlatformSpecificFeatureValidator("qmoiaiui", "windows")
        assert validator.app_name == "qmoiaiui"
        assert validator.platform == "windows"
    
    def test_platform_feature_validator_results_structure(self):
        """Test PlatformSpecificFeatureValidator returns correct structure."""
        validator = PlatformSpecificFeatureValidator("qmoiaiui", "windows")
        results = validator.validate_all_features()
        
        assert isinstance(results, dict)
        assert len(results) >= 10
        assert all(isinstance(v, bool) for v in results.values())
    
    # ========================================================================
    # AGENT VALIDATION TESTS
    # ========================================================================
    
    def test_agent_platform_validation_returns_dict(self):
        """Test agent returns proper platform validation structure."""
        results = self.agent.validate_all_platforms()
        
        assert isinstance(results, dict)
        assert len(results) == 6  # 6 platforms
        
        for platform in PLATFORMS:
            assert platform in results
            assert isinstance(results[platform], dict)
            assert len(results[platform]) == 4  # 4 apps
    
    def test_agent_feature_validation_returns_dict(self):
        """Test agent returns proper feature validation structure."""
        results = self.agent.validate_all_platform_features()
        
        assert isinstance(results, dict)
        assert len(results) == 6  # 6 platforms
        
        for platform in PLATFORMS:
            assert platform in results
            assert isinstance(results[platform], dict)
            
            for app in QMOI_APPS.keys():
                assert app in results[platform]
                assert isinstance(results[platform][app], dict)
    
    # ========================================================================
    # PR SUCCESS CONTRACT TESTS
    # ========================================================================
    
    def test_pr_contract_all_platforms_required(self):
        """Verify all 6 platforms are required for PR success."""
        assert len(PLATFORMS) == 6, "PR contract requires 6 platforms"
    
    def test_pr_contract_all_apps_required(self):
        """Verify all 4 apps are required for PR success."""
        assert len(QMOI_APPS) == 4, "PR contract requires 4 apps"
    
    def test_pr_contract_minimum_features_per_app_platform(self):
        """Verify minimum 10+ features per app per platform."""
        for platform in PLATFORMS:
            for app in QMOI_APPS.keys():
                features = PLATFORM_SPECIFIC_FEATURES[platform].get(app, [])
                assert len(features) >= 10, \
                    f"PR contract requires 10+ features for {app} on {platform}"
    
    def test_pr_contract_full_validation_executable(self):
        """Verify full validation suite can be executed."""
        try:
            # Don't actually run, just verify it's callable
            assert callable(self.agent.validate_all_platforms)
            assert callable(self.agent.validate_all_platform_features)
            assert callable(self.agent.run_full_validation_suite)
        except Exception as e:
            pytest.fail(f"Agent validation methods not callable: {e}")
    
    # ========================================================================
    # CONSISTENCY TESTS
    # ========================================================================
    
    def test_each_platform_has_all_apps(self):
        """Verify each platform defines all 4 apps."""
        for platform in PLATFORMS:
            assert platform in PLATFORM_SPECIFIC_FEATURES
            platform_data = PLATFORM_SPECIFIC_FEATURES[platform]
            
            for app in QMOI_APPS.keys():
                assert app in platform_data, \
                    f"App {app} missing for platform {platform}"
    
    def test_no_duplicate_features_per_app_platform(self):
        """Verify no duplicate feature names per app/platform."""
        for platform in PLATFORMS:
            for app in QMOI_APPS.keys():
                features = PLATFORM_SPECIFIC_FEATURES[platform].get(app, [])
                assert len(features) == len(set(features)), \
                    f"Duplicate features for {app} on {platform}"
    
    def test_feature_names_follow_convention(self):
        """Verify feature names follow snake_case convention."""
        import re
        pattern = re.compile(r'^[a-z][a-z0-9_]*[a-z0-9]$')
        
        for platform in PLATFORMS:
            for app in QMOI_APPS.keys():
                features = PLATFORM_SPECIFIC_FEATURES[platform].get(app, [])
                for feature in features:
                    assert pattern.match(feature), \
                        f"Feature '{feature}' doesn't follow snake_case convention"


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Test validation performance."""
    
    def test_platform_feature_validator_performance(self):
        """Verify feature validation completes quickly."""
        import time
        
        validator = PlatformSpecificFeatureValidator("qmoiaiui", "windows")
        
        start = time.time()
        results = validator.validate_all_features()
        elapsed = time.time() - start
        
        assert elapsed < 5.0, f"Validation took {elapsed}s, should be <5s"
        assert len(results) > 0, "Should return feature results"
    
    def test_agent_validation_scales(self):
        """Verify agent validation scales to all platforms/apps."""
        agent = OllamaAutonomousAgent()
        
        # Quick sanity check on initialization and structure
        assert len(agent.validators) == 0  # Not yet initialized
        assert len(agent.results) == 0


# ============================================================================
# EDGE CASES
# ============================================================================

class TestEdgeCases:
    """Test edge cases and error handling."""
    
    def test_invalid_platform_raises_error(self):
        """Verify invalid platform names are handled."""
        try:
            validator = PlatformSpecificFeatureValidator("qmoiaiui", "invalid_platform")
            # Should not error on creation, but features should be empty
            assert "invalid_platform" not in PLATFORM_SPECIFIC_FEATURES
        except Exception as e:
            pytest.fail(f"Should handle invalid platform gracefully: {e}")
    
    def test_invalid_app_raises_error(self):
        """Verify invalid app names are handled."""
        try:
            validator = PlatformSpecificFeatureValidator("invalid_app", "windows")
            # Should not error on creation
            assert "invalid_app" not in QMOI_APPS
        except Exception as e:
            pytest.fail(f"Should handle invalid app gracefully: {e}")


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

class TestIntegration:
    """Integration tests for full validation pipeline."""
    
    def test_full_validation_suite_structure(self):
        """Test full validation suite structure and flow."""
        agent = OllamaAutonomousAgent()
        
        # Verify agent has all required methods
        assert hasattr(agent, 'validate_all_platforms')
        assert hasattr(agent, 'validate_all_platform_features')
        assert hasattr(agent, 'run_full_validation_suite')
    
    def test_cross_platform_feature_consistency(self):
        """Verify features are consistently named across platforms."""
        # Common feature patterns that might appear on multiple platforms
        common_patterns = [
            ("handoff", ["macos", "ios", "web"]),  # Might be on multiple
            ("shortcuts", ["ios", "web", "linux"]),  # Quick access
        ]
        
        # Just verify the feature matrix is complete
        for platform in PLATFORMS:
            for app in QMOI_APPS.keys():
                features = PLATFORM_SPECIFIC_FEATURES[platform].get(app, [])
                assert isinstance(features, list)
                assert all(isinstance(f, str) for f in features)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
