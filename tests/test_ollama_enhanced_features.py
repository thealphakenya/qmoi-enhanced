#!/usr/bin/env python3
"""
Comprehensive Test Suite for Ollama Autonomous Agent
====================================================

Tests the platform-specific feature matrix and validation contracts used by
the Ollama Autonomous Agent.

Contract:
    - 6 supported platforms
    - 4 supported QMOI applications
    - At least 12 platform-specific features per app/platform
    - At least 288 total feature entries
    - No duplicate feature names within an app/platform
    - Feature names follow snake_case
    - Agent/platform validators expose the expected structures

This file is intentionally self-contained as a pytest module. Do not place
Markdown repository trees, shell commands, or documentation diagrams outside
Python comments/docstrings.
"""

from __future__ import annotations

import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List

import pytest


# ============================================================================
# IMPORT PATH
# ============================================================================

# tests/
#   test_ollama_enhanced_features.py
#
# scripts/
#   ollama_autonomous_agent.py
#
# Therefore the parent of tests/ is the repository root and "scripts" lives
# below it.

REPOSITORY_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = REPOSITORY_ROOT / "scripts"

if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))


from ollama_autonomous_agent import (  # noqa: E402
    OllamaAutonomousAgent,
    PLATFORMS,
    PLATFORM_SPECIFIC_FEATURES,
    PlatformSpecificFeatureValidator,
    QMOI_APPS,
)


# ============================================================================
# TEST CONTRACT
# ============================================================================

EXPECTED_PLATFORM_COUNT = 6
EXPECTED_APP_COUNT = 4

MIN_FEATURES_PER_APP_PLATFORM = 12
MIN_TOTAL_FEATURES = (
    EXPECTED_PLATFORM_COUNT
    * EXPECTED_APP_COUNT
    * MIN_FEATURES_PER_APP_PLATFORM
)

# The historical contract called this "280+". The actual matrix contract is
# 6 platforms × 4 apps × 12 features = 288 minimum entries.
HISTORICAL_MINIMUM_FEATURES = 280

EXPECTED_PLATFORMS = (
    "windows",
    "macos",
    "linux",
    "ios",
    "android",
    "web",
)

EXPECTED_APPS = (
    "qmoiaiui",
    "qcity",
    "qmoi-space",
    "qalpha",
)

FEATURE_NAME_PATTERN = re.compile(r"^[a-z][a-z0-9_]*[a-z0-9]$")


# ============================================================================
# TEST HELPERS
# ============================================================================


def get_platform_features(platform: str, app: str) -> List[str]:
    """
    Return the feature list for one platform/app pair.

    The helper intentionally performs explicit contract checks so failures
    identify the missing platform/app instead of producing an opaque KeyError.
    """
    assert platform in PLATFORM_SPECIFIC_FEATURES, (
        f"Platform '{platform}' is missing from PLATFORM_SPECIFIC_FEATURES"
    )

    platform_data = PLATFORM_SPECIFIC_FEATURES[platform]

    assert isinstance(platform_data, dict), (
        f"PLATFORM_SPECIFIC_FEATURES['{platform}'] must be a dict, "
        f"got {type(platform_data).__name__}"
    )

    assert app in platform_data, (
        f"App '{app}' is missing from PLATFORM_SPECIFIC_FEATURES['{platform}']"
    )

    features = platform_data[app]

    assert isinstance(features, list), (
        f"Features for {app}/{platform} must be a list, "
        f"got {type(features).__name__}"
    )

    return features


def iter_feature_matrix() -> Iterable[tuple[str, str, List[str]]]:
    """Yield every platform/app feature list in the contract."""
    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            yield platform, app, get_platform_features(platform, app)


def assert_minimum_features(
    platform: str,
    app: str,
    minimum: int = MIN_FEATURES_PER_APP_PLATFORM,
) -> List[str]:
    """Assert and return the feature list for a platform/app pair."""
    features = get_platform_features(platform, app)

    assert len(features) >= minimum, (
        f"Expected at least {minimum} features for "
        f"{app} on {platform}; got {len(features)}"
    )

    return features


def get_agent_attribute(
    agent: OllamaAutonomousAgent,
    name: str,
    default: Any = None,
) -> Any:
    """Safely retrieve an optional agent implementation attribute."""
    return getattr(agent, name, default)


# ============================================================================
# MASTER PLATFORM FEATURE TESTS
# ============================================================================


class TestPlatformSpecificFeatures:
    """Master test class for the platform-specific feature matrix."""

    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        """Create a fresh agent for each test."""
        self.agent = OllamaAutonomousAgent()
        self.platforms = PLATFORMS
        self.apps = list(QMOI_APPS.keys())

    # ========================================================================
    # WINDOWS
    # ========================================================================

    def test_windows_qmoiaiui_features_complete(self) -> None:
        """Verify the required QMOIAIUI Windows features."""
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

        features = assert_minimum_features("windows", "qmoiaiui")

        assert all(feature in features for feature in expected_features), (
            "One or more required Windows/QMOIAIUI features are missing"
        )

    def test_windows_qcity_features_complete(self) -> None:
        """Verify the required QCity Windows features."""
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

        features = assert_minimum_features("windows", "qcity")

        assert all(feature in features for feature in expected_features), (
            "One or more required Windows/QCity features are missing"
        )

    def test_windows_qmoi_space_features_complete(self) -> None:
        """Verify the required QMOI Space Windows features."""
        features = assert_minimum_features("windows", "qmoi-space")

        required = (
            "media_keys",
            "taskbar_buttons",
            "windows_codecs",
        )

        assert all(feature in features for feature in required)

    def test_windows_qalpha_features_complete(self) -> None:
        """Verify the required QALPHA Windows features."""
        features = assert_minimum_features("windows", "qalpha")

        required = (
            "powershell_integration",
            "windows_api",
            "msvc_toolchain",
        )

        assert all(feature in features for feature in required)

    # ========================================================================
    # MACOS
    # ========================================================================

    def test_macos_qmoiaiui_features_complete(self) -> None:
        """Verify the required QMOIAIUI macOS features."""
        features = assert_minimum_features("macos", "qmoiaiui")

        required = (
            "notification_center",
            "spotlight_search",
            "handoff_continuity",
            "icloud_sync",
            "metal_gpu_acceleration",
        )

        assert all(feature in features for feature in required)

    def test_macos_qcity_features_complete(self) -> None:
        """Verify the required QCity macOS features."""
        features = assert_minimum_features("macos", "qcity")

        required = (
            "finder_integration",
            "quick_look_plugin",
            "airdrop_files",
        )

        assert all(feature in features for feature in required)

    def test_macos_qmoi_space_features_complete(self) -> None:
        """Verify the required QMOI Space macOS features."""
        features = assert_minimum_features("macos", "qmoi-space")

        required = (
            "avfoundation_framework",
            "airplay_streaming",
        )

        assert all(feature in features for feature in required)

    def test_macos_qalpha_features_complete(self) -> None:
        """Verify the required QALPHA macOS features."""
        features = assert_minimum_features("macos", "qalpha")

        required = (
            "xcode_integration",
            "lldb_debugger",
        )

        assert all(feature in features for feature in required)

    # ========================================================================
    # LINUX
    # ========================================================================

    def test_linux_qmoiaiui_features_complete(self) -> None:
        """Verify the required QMOIAIUI Linux features."""
        features = assert_minimum_features("linux", "qmoiaiui")

        required = (
            "dbus_integration",
            "desktop_entry_file",
            "appstream_metadata",
            "freedesktop_notifications",
        )

        assert all(feature in features for feature in required)

    def test_linux_qcity_features_complete(self) -> None:
        """Verify the required QCity Linux features."""
        features = assert_minimum_features("linux", "qcity")

        required = (
            "nautilus_dolphin_integration",
            "freedesktop_mime_types",
        )

        assert all(feature in features for feature in required)

    def test_linux_qmoi_space_features_complete(self) -> None:
        """Verify the required QMOI Space Linux features."""
        features = assert_minimum_features("linux", "qmoi-space")

        required = (
            "pulseaudio_integration",
            "pipewire_support",
        )

        assert all(feature in features for feature in required)

    def test_linux_qalpha_features_complete(self) -> None:
        """Verify the required QALPHA Linux features."""
        features = assert_minimum_features("linux", "qalpha")

        required = (
            "gcc_clang_toolchain",
            "docker_integration",
        )

        assert all(feature in features for feature in required)

    # ========================================================================
    # IOS
    # ========================================================================

    def test_ios_qmoiaiui_features_complete(self) -> None:
        """Verify the required QMOIAIUI iOS features."""
        features = assert_minimum_features("ios", "qmoiaiui")

        required = (
            "fileprovider_integration",
            "handoff_ios",
            "siri_shortcuts",
        )

        assert all(feature in features for feature in required)

    def test_ios_qcity_features_complete(self) -> None:
        """Verify the required QCity iOS features."""
        features = assert_minimum_features("ios", "qcity")

        required = (
            "files_app_integration",
            "icloud_drive_ios",
        )

        assert all(feature in features for feature in required)

    def test_ios_qmoi_space_features_complete(self) -> None:
        """Verify the required QMOI Space iOS features."""
        features = assert_minimum_features("ios", "qmoi-space")

        required = (
            "avplayer_framework",
            "airplay_ios",
        )

        assert all(feature in features for feature in required)

    def test_ios_qalpha_features_complete(self) -> None:
        """Verify the required QALPHA iOS features."""
        features = assert_minimum_features("ios", "qalpha")

        required = (
            "swift_playgrounds",
            "xcode_previews",
        )

        assert all(feature in features for feature in required)

    # ========================================================================
    # ANDROID
    # ========================================================================

    def test_android_qmoiaiui_features_complete(self) -> None:
        """Verify the required QMOIAIUI Android features."""
        features = assert_minimum_features("android", "qmoiaiui")

        required = (
            "content_provider",
            "documentsrovider",
            "material_you_theming",
        )

        assert all(feature in features for feature in required)

    def test_android_qcity_features_complete(self) -> None:
        """Verify the required QCity Android features."""
        features = assert_minimum_features("android", "qcity")

        required = (
            "storage_access_framework",
            "foldable_support",
        )

        assert all(feature in features for feature in required)

    def test_android_qmoi_space_features_complete(self) -> None:
        """Verify the required QMOI Space Android features."""
        features = assert_minimum_features("android", "qmoi-space")

        required = (
            "mediaplayer_exoplayer",
            "spatial_audio_android",
        )

        assert all(feature in features for feature in required)

    def test_android_qalpha_features_complete(self) -> None:
        """Verify the required QALPHA Android features."""
        features = assert_minimum_features("android", "qalpha")

        required = (
            "gradle_build_system",
            "android_emulator",
        )

        assert all(feature in features for feature in required)

    # ========================================================================
    # WEB
    # ========================================================================

    def test_web_qmoiaiui_features_complete(self) -> None:
        """Verify the required QMOIAIUI Web features."""
        features = assert_minimum_features("web", "qmoiaiui")

        required = (
            "service_worker_web",
            "indexeddb_persistence",
        )

        assert all(feature in features for feature in required)

    def test_web_qcity_features_complete(self) -> None:
        """Verify the required QCity Web features."""
        features = assert_minimum_features("web", "qcity")

        required = (
            "drag_drop_files",
            "file_input_api",
        )

        assert all(feature in features for feature in required)

    def test_web_qmoi_space_features_complete(self) -> None:
        """Verify the required QMOI Space Web features."""
        features = assert_minimum_features("web", "qmoi-space")

        required = (
            "html5_audio_video",
            "mediasource_api",
        )

        assert all(feature in features for feature in required)

    def test_web_qalpha_features_complete(self) -> None:
        """Verify the required QALPHA Web features."""
        features = assert_minimum_features("web", "qalpha")

        required = (
            "javascript_debugging",
            "jest_testing",
        )

        assert all(feature in features for feature in required)

    # ========================================================================
    # TOTAL FEATURE COUNT
    # ========================================================================

    def test_total_feature_count(self) -> None:
        """Verify the complete matrix contains at least 288 features."""
        total_features = 0

        for platform, app, features in iter_feature_matrix():
            total_features += len(features)
            print(
                f"{platform:12} "
                f"{app:15} "
                f"{len(features):3} features"
            )

        print(f"\nTotal: {total_features} platform-specific features")

        assert total_features >= HISTORICAL_MINIMUM_FEATURES, (
            f"Historical contract requires 280+ features; "
            f"got {total_features}"
        )

        assert total_features >= MIN_TOTAL_FEATURES, (
            f"Matrix contract requires at least {MIN_TOTAL_FEATURES} "
            f"features ({EXPECTED_PLATFORM_COUNT} platforms × "
            f"{EXPECTED_APP_COUNT} apps × "
            f"{MIN_FEATURES_PER_APP_PLATFORM} features); "
            f"got {total_features}"
        )

    # ========================================================================
    # PLATFORM / APP CONTRACT
    # ========================================================================

    def test_all_platforms_present(self) -> None:
        """Verify all six required platforms are defined."""
        assert isinstance(PLATFORMS, (list, tuple)), (
            f"PLATFORMS must be a list or tuple, got {type(PLATFORMS).__name__}"
        )

        assert len(PLATFORMS) == EXPECTED_PLATFORM_COUNT, (
            f"Expected {EXPECTED_PLATFORM_COUNT} platforms, got {len(PLATFORMS)}"
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in PLATFORMS, (
                f"Required platform '{platform}' is missing"
            )

    def test_all_apps_present(self) -> None:
        """Verify all four required applications are defined."""
        assert isinstance(QMOI_APPS, dict), (
            f"QMOI_APPS must be a dict, got {type(QMOI_APPS).__name__}"
        )

        assert len(QMOI_APPS) == EXPECTED_APP_COUNT, (
            f"Expected {EXPECTED_APP_COUNT} apps, got {len(QMOI_APPS)}"
        )

        for app in EXPECTED_APPS:
            assert app in QMOI_APPS, (
                f"Required app '{app}' is missing"
            )

    # ========================================================================
    # FEATURE VALIDATOR
    # ========================================================================

    def test_platform_feature_validator_initialization(self) -> None:
        """Verify PlatformSpecificFeatureValidator initializes correctly."""
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        assert getattr(validator, "app_name", None) == "qmoiaiui"
        assert getattr(validator, "platform", None) == "windows"

    def test_platform_feature_validator_results_structure(self) -> None:
        """Verify feature validation returns a boolean result mapping."""
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        results = validator.validate_all_features()

        assert isinstance(results, dict), (
            f"Expected dict from validate_all_features(), "
            f"got {type(results).__name__}"
        )

        assert len(results) >= MIN_FEATURES_PER_APP_PLATFORM, (
            f"Expected at least {MIN_FEATURES_PER_APP_PLATFORM} "
            f"validation results, got {len(results)}"
        )

        assert all(isinstance(value, bool) for value in results.values()), (
            "Every feature validation result must be boolean"
        )

    # ========================================================================
    # AGENT VALIDATION
    # ========================================================================

    def test_agent_platform_validation_returns_dict(self) -> None:
        """Verify agent platform validation has the complete structure."""
        results = self.agent.validate_all_platforms()

        assert isinstance(results, dict), (
            f"Expected dict from validate_all_platforms(), "
            f"got {type(results).__name__}"
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in results, (
                f"Platform '{platform}' missing from validation results"
            )

            assert isinstance(results[platform], dict), (
                f"Validation result for '{platform}' must be a dict"
            )

            for app in EXPECTED_APPS:
                assert app in results[platform], (
                    f"App '{app}' missing from {platform} validation results"
                )

    def test_agent_feature_validation_returns_dict(self) -> None:
        """Verify agent feature validation has the complete matrix."""
        results = self.agent.validate_all_platform_features()

        assert isinstance(results, dict), (
            f"Expected dict from validate_all_platform_features(), "
            f"got {type(results).__name__}"
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in results, (
                f"Platform '{platform}' missing from feature validation results"
            )

            assert isinstance(results[platform], dict)

            for app in EXPECTED_APPS:
                assert app in results[platform], (
                    f"App '{app}' missing from {platform} feature results"
                )

                assert isinstance(results[platform][app], dict), (
                    f"Expected dict for {platform}/{app} feature results"
                )

    # ========================================================================
    # PR SUCCESS CONTRACT
    # ========================================================================

    def test_pr_contract_all_platforms_required(self) -> None:
        """Verify PR success requires all six platforms."""
        assert len(EXPECTED_PLATFORMS) == 6
        assert len(PLATFORMS) == 6

    def test_pr_contract_all_apps_required(self) -> None:
        """Verify PR success requires all four applications."""
        assert len(EXPECTED_APPS) == 4
        assert len(QMOI_APPS) == 4

    def test_pr_contract_minimum_features_per_app_platform(self) -> None:
        """Verify every app/platform pair has at least 12 features."""
        for platform, app, features in iter_feature_matrix():
            assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM, (
                f"PR contract requires at least "
                f"{MIN_FEATURES_PER_APP_PLATFORM} features for "
                f"{app} on {platform}; got {len(features)}"
            )

    def test_pr_contract_full_validation_executable(self) -> None:
        """Verify required agent validation methods are callable."""
        required_methods = (
            "validate_all_platforms",
            "validate_all_platform_features",
            "run_full_validation_suite",
        )

        for method_name in required_methods:
            method = getattr(self.agent, method_name, None)

            assert callable(method), (
                f"Agent method '{method_name}' must be callable"
            )

    # ========================================================================
    # CONSISTENCY
    # ========================================================================

    def test_each_platform_has_all_apps(self) -> None:
        """Verify every platform contains every application."""
        for platform in EXPECTED_PLATFORMS:
            assert platform in PLATFORM_SPECIFIC_FEATURES, (
                f"Platform '{platform}' missing from feature registry"
            )

            platform_data = PLATFORM_SPECIFIC_FEATURES[platform]

            for app in EXPECTED_APPS:
                assert app in platform_data, (
                    f"App '{app}' missing for platform '{platform}'"
                )

    def test_no_duplicate_features_per_app_platform(self) -> None:
        """Verify no duplicate feature names occur in a pair."""
        for platform, app, features in iter_feature_matrix():
            assert len(features) == len(set(features)), (
                f"Duplicate features found for {app} on {platform}"
            )

    def test_feature_names_are_strings(self) -> None:
        """Verify every feature name is a string."""
        for platform, app, features in iter_feature_matrix():
            for feature in features:
                assert isinstance(feature, str), (
                    f"Feature for {app} on {platform} must be a string; "
                    f"got {type(feature).__name__}"
                )

    def test_feature_names_follow_convention(self) -> None:
        """Verify feature names follow the snake_case convention."""
        for platform, app, features in iter_feature_matrix():
            for feature in features:
                assert FEATURE_NAME_PATTERN.fullmatch(feature), (
                    f"Feature '{feature}' for {app} on {platform} "
                    "doesn't follow the required snake_case convention"
                )

    def test_feature_registry_has_no_unexpected_platforms(self) -> None:
        """Verify the registry does not contain undeclared platforms."""
        registry_platforms = set(PLATFORM_SPECIFIC_FEATURES.keys())
        expected_platforms = set(EXPECTED_PLATFORMS)

        assert registry_platforms == expected_platforms, (
            "PLATFORM_SPECIFIC_FEATURES platform keys differ from the "
            f"declared contract. Expected {sorted(expected_platforms)}, "
            f"got {sorted(registry_platforms)}"
        )

    def test_feature_registry_app_keys_are_complete(self) -> None:
        """Verify every platform uses the same four application keys."""
        expected_apps = set(EXPECTED_APPS)

        for platform in EXPECTED_PLATFORMS:
            actual_apps = set(
                PLATFORM_SPECIFIC_FEATURES[platform].keys()
            )

            assert actual_apps == expected_apps, (
                f"Application keys for {platform} differ from contract. "
                f"Expected {sorted(expected_apps)}, "
                f"got {sorted(actual_apps)}"
            )


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================


class TestPerformance:
    """Tests for basic validation performance."""

    def test_platform_feature_validator_performance(self) -> None:
        """Verify one feature-validation pass completes within five seconds."""
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        start = time.perf_counter()
        results = validator.validate_all_features()
        elapsed = time.perf_counter() - start

        assert elapsed < 5.0, (
            f"Feature validation took {elapsed:.3f}s; expected <5s"
        )

        assert isinstance(results, dict)
        assert len(results) > 0

    def test_agent_initialization_is_lightweight(self) -> None:
        """Verify agent construction does not immediately run validation."""
        start = time.perf_counter()
        agent = OllamaAutonomousAgent()
        elapsed = time.perf_counter() - start

        assert elapsed < 5.0, (
            f"Agent initialization took {elapsed:.3f}s; expected <5s"
        )

        assert agent is not None

    def test_agent_validator_structure_when_available(self) -> None:
        """
        Verify optional pre-initialized validator storage when implemented.

        Different agent revisions may use different internal storage types,
        so this test checks the contract without requiring an implementation
        detail that is not part of the public API.
        """
        agent = OllamaAutonomousAgent()

        validators = get_agent_attribute(agent, "validators")

        if validators is None:
            pytest.skip(
                "Agent does not expose a 'validators' attribute; "
                "internal validator storage is implementation-specific."
            )

        assert isinstance(validators, (dict, list, tuple)), (
            "Agent.validators must be a dict/list/tuple when exposed"
        )

        if isinstance(validators, dict):
            assert len(validators) >= EXPECTED_PLATFORM_COUNT, (
                f"Expected validators for at least {EXPECTED_PLATFORM_COUNT} "
                f"platforms; got {len(validators)}"
            )
        else:
            assert len(validators) >= EXPECTED_PLATFORM_COUNT, (
                f"Expected at least {EXPECTED_PLATFORM_COUNT} validators; "
                f"got {len(validators)}"
            )


# ============================================================================
# EDGE CASES
# ============================================================================


class TestEdgeCases:
    """Tests for invalid platform/application inputs."""

    def test_invalid_platform_does_not_corrupt_registry(self) -> None:
        """Verify an invalid platform does not become a registered platform."""
        original_platforms = set(PLATFORM_SPECIFIC_FEATURES.keys())

        try:
            validator = PlatformSpecificFeatureValidator(
                "qmoiaiui",
                "invalid_platform",
            )

            assert validator is not None

        except (ValueError, KeyError, TypeError):
            # Raising a clear validation error is acceptable behavior.
            pass

        finally:
            assert set(PLATFORM_SPECIFIC_FEATURES.keys()) == original_platforms
            assert "invalid_platform" not in PLATFORM_SPECIFIC_FEATURES

    def test_invalid_app_does_not_corrupt_registry(self) -> None:
        """Verify an invalid application does not enter QMOI_APPS."""
        original_apps = set(QMOI_APPS.keys())

        try:
            validator = PlatformSpecificFeatureValidator(
                "invalid_app",
                "windows",
            )

            assert validator is not None

        except (ValueError, KeyError, TypeError):
            # Raising a clear validation error is acceptable behavior.
            pass

        finally:
            assert set(QMOI_APPS.keys()) == original_apps
            assert "invalid_app" not in QMOI_APPS


# ============================================================================
# INTEGRATION TESTS
# ============================================================================


class TestIntegration:
    """Integration tests for the validation pipeline."""

    def test_full_validation_suite_structure(self) -> None:
        """Verify the complete validation pipeline is available."""
        agent = OllamaAutonomousAgent()

        required_methods = (
            "validate_all_platforms",
            "validate_all_platform_features",
            "run_full_validation_suite",
        )

        for method_name in required_methods:
            assert hasattr(agent, method_name), (
                f"Agent is missing required method '{method_name}'"
            )

            assert callable(getattr(agent, method_name)), (
                f"Agent method '{method_name}' is not callable"
            )

    def test_cross_platform_feature_consistency(self) -> None:
        """
        Verify the feature matrix is structurally consistent.

        This deliberately does not require identical features across
        platforms because platform-specific implementations are expected
        to differ.
        """
        for platform, app, features in iter_feature_matrix():
            assert isinstance(features, list)

            assert all(isinstance(feature, str) for feature in features), (
                f"Non-string feature found for {app} on {platform}"
            )

            assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM, (
                f"{app} on {platform} has only {len(features)} features"
            )

    def test_all_feature_entries_are_non_empty(self) -> None:
        """Verify no feature entry is empty or whitespace-only."""
        for platform, app, features in iter_feature_matrix():
            for feature in features:
                assert feature.strip(), (
                    f"Empty feature name found for {app} on {platform}"
                )

    def test_matrix_dimensions(self) -> None:
        """Verify the registry has exactly 6 × 4 platform/app combinations."""
        combinations = list(iter_feature_matrix())

        expected_combinations = (
            EXPECTED_PLATFORM_COUNT * EXPECTED_APP_COUNT
        )

        assert len(combinations) == expected_combinations, (
            f"Expected {expected_combinations} platform/app combinations, "
            f"got {len(combinations)}"
        )


# ============================================================================
# OPTIONAL DIRECT EXECUTION
# ============================================================================


if __name__ == "__main__":
    raise SystemExit(
        pytest.main(
            [
                __file__,
                "-v",
                "--tb=short",
            ]
        )
    )