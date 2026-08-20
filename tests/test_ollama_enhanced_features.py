#!/usr/bin/env python3
"""
Comprehensive Test Suite for Ollama Autonomous Agent

Tests the Ollama/QMOI autonomous-agent validation contract.

Coverage:

- 6 supported platforms
- 4 QMOI applications
- 280+ platform/application feature entries
- Feature registry integrity
- Platform/application completeness
- Feature-name consistency
- PlatformSpecificFeatureValidator behavior
- OllamaAutonomousAgent validation structure
- PR validation contract
- Performance and edge-case behavior

IMPORTANT

This file must contain Python source only.

Do not paste repository tree diagrams, Markdown fences, YAML, log output,
or other non-Python text into this file.
"""

from future import annotations

import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Sequence

import pytest

============================================================================

IMPORT PATH

============================================================================

Repository layout expected by the test suite:

repository/

├── scripts/

│   └── ollama_autonomous_agent.py

└── tests/

└── test_ollama_enhanced_features.py

Only the actual Python import path is used below. The tree above is

documentation only and MUST NOT be inserted into executable code.

REPOSITORY_ROOT = Path(file).resolve().parent.parent
SCRIPTS_DIR = REPOSITORY_ROOT / "scripts"

if str(SCRIPTS_DIR) not in sys.path:
sys.path.insert(0, str(SCRIPTS_DIR))

============================================================================

AGENT IMPORT

============================================================================

from ollama_autonomous_agent import (  # noqa: E402
OllamaAutonomousAgent,
PlatformSpecificFeatureValidator,
PlatformValidator,
PLATFORMS,
QMOI_APPS,
PLATFORM_SPECIFIC_FEATURES,
)

============================================================================

TEST CONTRACT

============================================================================

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
"qmoi-space",
"qcity",
"qalpha",
)

MIN_FEATURES_PER_APP_PLATFORM = 10
MIN_TOTAL_FEATURES = 280

FEATURE_NAME_PATTERN = re.compile(r"^[a-z][a-z0-9_]*[a-z0-9]$")

============================================================================

EXPECTED CORE FEATURES

============================================================================

These are deliberately limited to representative contract features rather

than requiring every feature to be hard-coded here. The source registry is

the authoritative feature inventory.

This makes the tests resilient when new features are added while still

catching accidental removal/renaming of important platform capabilities.

============================================================================

EXPECTED_CORE_FEATURES: Mapping[str, Mapping[str, Sequence[str]]] = {
"windows": {
"qmoiaiui": (
"windows_notifications_api",
"media_keys_integration",
"taskbar_integration",
"windows_hello_biometric",
"fluent_design_styling",
"clipboard_history",
"virtual_desktop_support",
"registry_persistence",
"game_bar_integration",
"winget_auto_update",
"file_explorer_context_menu",
),
"qcity": (
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
),
"qmoi-space": (
"media_keys",
"taskbar_buttons",
"windows_codecs",
),
"qalpha": (
"powershell_integration",
"windows_api",
"msvc_toolchain",
),
},
"macos": {
"qmoiaiui": (
"notification_center",
"spotlight_search",
"handoff_continuity",
"icloud_sync",
"metal_gpu_acceleration",
),
"qcity": (
"finder_integration",
"quick_look_plugin",
"airdrop_files",
),
"qmoi-space": (
"avfoundation_framework",
"airplay_streaming",
),
"qalpha": (
"xcode_integration",
"lldb_debugger",
),
},
"linux": {
"qmoiaiui": (
"dbus_integration",
"desktop_entry_file",
"appstream_metadata",
"freedesktop_notifications",
),
"qcity": (
"nautilus_dolphin_integration",
"freedesktop_mime_types",
),
"qmoi-space": (
"pulseaudio_integration",
"pipewire_support",
),
"qalpha": (
"gcc_clang_toolchain",
"docker_integration",
),
},
"ios": {
"qmoiaiui": (
"fileprovider_integration",
"handoff_ios",
"siri_shortcuts",
),
"qcity": (
"files_app_integration",
"icloud_drive_ios",
),
"qmoi-space": (
"avplayer_framework",
"airplay_ios",
),
"qalpha": (
"swift_playgrounds",
"xcode_previews",
),
},
"android": {
"qmoiaiui": (
"content_provider",
"documentsrovider",
"material_you_theming",
),
"qcity": (
"storage_access_framework",
"foldable_support",
),
"qmoi-space": (
"mediaplayer_exoplayer",
"spatial_audio_android",
),
"qalpha": (
"gradle_build_system",
"android_emulator",
),
},
"web": {
"qmoiaiui": (
"service_worker_web",
"indexeddb_persistence",
),
"qcity": (
"drag_drop_files",
"file_input_api",
),
"qmoi-space": (
"html5_audio_video",
"mediasource_api",
),
"qalpha": (
"javascript_debugging",
"jest_testing",
),
},
}

============================================================================

HELPERS

============================================================================

def _feature_registry() -> Mapping[str, Mapping[str, Sequence[str]]]:
"""Return the feature registry and verify its basic mapping shape."""
assert isinstance(
PLATFORM_SPECIFIC_FEATURES,
Mapping,
), "PLATFORM_SPECIFIC_FEATURES must be a mapping"

return PLATFORM_SPECIFIC_FEATURES

def _features_for(platform: str, app: str) -> Sequence[str]:
"""Safely return the feature list for one platform/application pair."""
registry = _feature_registry()

assert platform in registry, (
    f"Platform '{platform}' is missing from PLATFORM_SPECIFIC_FEATURES"
)

platform_data = registry[platform]

assert isinstance(platform_data, Mapping), (
    f"Feature data for platform '{platform}' must be a mapping"
)

assert app in platform_data, (
    f"Application '{app}' is missing from platform '{platform}'"
)

features = platform_data[app]

assert isinstance(features, (list, tuple)), (
    f"Features for {app} on {platform} must be a list or tuple"
)

return features

def _all_feature_entries() -> Iterable[tuple[str, str, Sequence[str]]]:
"""Yield every platform/application feature collection."""
for platform in EXPECTED_PLATFORMS:
for app in EXPECTED_APPS:
yield platform, app, _features_for(platform, app)

def _total_feature_count() -> int:
"""Return the total number of registered platform-specific features."""
return sum(
len(features)
for _, _, features in _all_feature_entries()
)

============================================================================

BASIC MODULE / REGISTRY TESTS

============================================================================

class TestModuleAndRegistry:
"""Validate imports and the authoritative feature registry."""

def test_required_exports_are_importable(self):
    """Required agent classes/constants must be importable."""
    assert PlatformValidator is not None
    assert PlatformSpecificFeatureValidator is not None
    assert OllamaAutonomousAgent is not None
    assert PLATFORMS is not None
    assert QMOI_APPS is not None
    assert PLATFORM_SPECIFIC_FEATURES is not None

def test_platform_contract(self):
    """Verify exactly the six supported platforms are present."""
    assert isinstance(PLATFORMS, (list, tuple))
    assert set(PLATFORMS) == set(EXPECTED_PLATFORMS)
    assert len(PLATFORMS) == len(EXPECTED_PLATFORMS)

def test_app_contract(self):
    """Verify exactly the four required applications are present."""
    assert isinstance(QMOI_APPS, Mapping)
    assert set(QMOI_APPS.keys()) == set(EXPECTED_APPS)
    assert len(QMOI_APPS) == len(EXPECTED_APPS)

def test_feature_registry_platforms(self):
    """Every supported platform must have feature data."""
    registry = _feature_registry()

    for platform in EXPECTED_PLATFORMS:
        assert platform in registry, (
            f"Missing platform '{platform}' from feature registry"
        )

def test_feature_registry_apps(self):
    """Every supported application must exist on every platform."""
    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            _features_for(platform, app)

def test_total_feature_count(self):
    """Verify the complete registry contains at least 280 features."""
    counts: Dict[str, int] = {}
    total = 0

    for platform, app, features in _all_feature_entries():
        count = len(features)
        counts[f"{platform}:{app}"] = count
        total += count

        print(
            f"{platform:10} {app:12} "
            f"{count:3} features"
        )

    print(f"\nTotal platform-specific features: {total}")

    assert total >= MIN_TOTAL_FEATURES, (
        f"Expected at least {MIN_TOTAL_FEATURES} platform-specific "
        f"features, got {total}"
    )

    assert all(
        count >= MIN_FEATURES_PER_APP_PLATFORM
        for count in counts.values()
    ), (
        "Every platform/application pair must contain at least "
        f"{MIN_FEATURES_PER_APP_PLATFORM} features"
    )

def test_feature_collections_are_strings(self):
    """Every registered feature must be represented by a string."""
    for platform, app, features in _all_feature_entries():
        for feature in features:
            assert isinstance(feature, str), (
                f"Feature for {app} on {platform} is not a string: "
                f"{feature!r}"
            )
            assert feature.strip(), (
                f"Empty feature name for {app} on {platform}"
            )

============================================================================

CORE FEATURE TESTS

============================================================================

class TestCoreFeatures:
"""Verify important platform-specific capabilities remain registered."""

@pytest.mark.parametrize(
    "platform,app",
    [
        (platform, app)
        for platform in EXPECTED_PLATFORMS
        for app in EXPECTED_APPS
    ],
)
def test_minimum_feature_count(self, platform: str, app: str):
    """Every app/platform combination satisfies the minimum contract."""
    features = _features_for(platform, app)

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM, (
        f"{app} on {platform} has {len(features)} features; "
        f"minimum is {MIN_FEATURES_PER_APP_PLATFORM}"
    )

@pytest.mark.parametrize(
    "platform,app,expected",
    [
        (platform, app, feature)
        for platform, apps in EXPECTED_CORE_FEATURES.items()
        for app, features in apps.items()
        for feature in features
    ],
)
def test_core_feature_present(
    self,
    platform: str,
    app: str,
    expected: str,
):
    """Important contract features must not disappear."""
    features = _features_for(platform, app)

    assert expected in features, (
        f"Required feature '{expected}' is missing for "
        f"{app} on {platform}"
    )

============================================================================

FEATURE REGISTRY CONSISTENCY

============================================================================

class TestFeatureRegistryConsistency:
"""Validate uniqueness, naming and matrix consistency."""

def test_no_duplicate_features(self):
    """No platform/application feature list may contain duplicates."""
    for platform, app, features in _all_feature_entries():
        assert len(features) == len(set(features)), (
            f"Duplicate feature names detected for "
            f"{app} on {platform}"
        )

def test_feature_names_follow_snake_case(self):
    """All feature identifiers must use the project naming convention."""
    for platform, app, features in _all_feature_entries():
        for feature in features:
            assert FEATURE_NAME_PATTERN.fullmatch(feature), (
                f"Feature '{feature}' for {app} on {platform} "
                "does not follow the required snake_case convention"
            )

def test_no_missing_platform_application_pairs(self):
    """The feature matrix must be a complete 6 × 4 matrix."""
    registry = _feature_registry()

    assert set(registry.keys()) == set(EXPECTED_PLATFORMS)

    for platform in EXPECTED_PLATFORMS:
        platform_data = registry[platform]

        assert isinstance(platform_data, Mapping)

        assert set(platform_data.keys()) == set(EXPECTED_APPS), (
            f"Platform '{platform}' does not contain exactly the "
            "required applications"
        )

def test_platform_order_matches_contract(self):
    """PLATFORMS should contain each supported platform once."""
    assert len(PLATFORMS) == len(set(PLATFORMS))
    assert set(PLATFORMS) == set(EXPECTED_PLATFORMS)

def test_app_order_has_no_duplicates(self):
    """QMOI application keys must be unique."""
    apps = list(QMOI_APPS.keys())

    assert len(apps) == len(set(apps))
    assert set(apps) == set(EXPECTED_APPS)

============================================================================

PLATFORM-SPECIFIC VALIDATOR TESTS

============================================================================

class TestPlatformSpecificFeatureValidator:
"""Tests for PlatformSpecificFeatureValidator."""

@pytest.mark.parametrize(
    "platform,app",
    [
        (platform, app)
        for platform in EXPECTED_PLATFORMS
        for app in EXPECTED_APPS
    ],
)
def test_initialization(self, platform: str, app: str):
    """Validator initializes for every supported pair."""
    validator = PlatformSpecificFeatureValidator(app, platform)

    assert validator.app_name == app
    assert validator.platform == platform

def test_results_structure(self):
    """Feature validation must return a dictionary of boolean results."""
    validator = PlatformSpecificFeatureValidator(
        "qmoiaiui",
        "windows",
    )

    results = validator.validate_all_features()

    assert isinstance(results, dict)
    assert len(results) > 0

    for feature_name, result in results.items():
        assert isinstance(feature_name, str)
        assert isinstance(result, bool), (
            f"Validation result for '{feature_name}' must be bool, "
            f"got {type(result).__name__}"
        )

@pytest.mark.parametrize(
    "platform,app",
    [
        (platform, app)
        for platform in EXPECTED_PLATFORMS
        for app in EXPECTED_APPS
    ],
)
def test_validator_covers_registered_features(
    self,
    platform: str,
    app: str,
):
    """
    Validator results should cover the features registered for the
    selected platform/application pair.
    """
    expected = set(_features_for(platform, app))

    validator = PlatformSpecificFeatureValidator(app, platform)
    results = validator.validate_all_features()

    assert isinstance(results, dict)

    actual = set(results.keys())

    missing = expected - actual

    assert not missing, (
        f"Validator for {app} on {platform} did not return results "
        f"for registered features: {sorted(missing)}"
    )

    assert all(
        isinstance(value, bool)
        for value in results.values()
    )

============================================================================

AGENT STRUCTURE TESTS

============================================================================

class TestOllamaAutonomousAgent:
"""Tests for the top-level autonomous agent."""

def test_agent_initialization(self):
    """Agent must initialize without requiring external services."""
    agent = OllamaAutonomousAgent()

    assert agent is not None

def test_required_methods_exist(self):
    """Required validation methods must exist and be callable."""
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

        method = getattr(agent, method_name)

        assert callable(method), (
            f"Agent method '{method_name}' is not callable"
        )

def test_agent_platform_validation_returns_dict(self):
    """Platform validation must return a platform-indexed mapping."""
    agent = OllamaAutonomousAgent()

    results = agent.validate_all_platforms()

    assert isinstance(results, dict)

    for platform in EXPECTED_PLATFORMS:
        assert platform in results, (
            f"Platform '{platform}' missing from validation results"
        )

        assert isinstance(results[platform], Mapping), (
            f"Validation result for '{platform}' must be a mapping"
        )

def test_agent_platform_validation_covers_all_apps(self):
    """Each platform result should cover every configured application."""
    agent = OllamaAutonomousAgent()

    results = agent.validate_all_platforms()

    for platform in EXPECTED_PLATFORMS:
        platform_result = results[platform]

        for app in EXPECTED_APPS:
            assert app in platform_result, (
                f"Application '{app}' missing from validation results "
                f"for platform '{platform}'"
            )

def test_agent_feature_validation_returns_dict(self):
    """Feature validation must return a nested mapping."""
    agent = OllamaAutonomousAgent()

    results = agent.validate_all_platform_features()

    assert isinstance(results, dict)

    for platform in EXPECTED_PLATFORMS:
        assert platform in results

        platform_results = results[platform]

        assert isinstance(platform_results, Mapping)

        for app in EXPECTED_APPS:
            assert app in platform_results

            app_results = platform_results[app]

            assert isinstance(app_results, Mapping)

def test_full_validation_method_is_callable(self):
    """Full validation suite must be executable as a callable."""
    agent = OllamaAutonomousAgent()

    assert callable(agent.run_full_validation_suite)

============================================================================

PR SUCCESS CONTRACT

============================================================================

class TestPRSuccessContract:
"""
Explicit PR merge contract.

A PR must not silently lose a platform, application, or the minimum
platform-specific feature coverage.
"""

def test_all_required_platforms(self):
    """PR contract requires all six platforms."""
    assert set(PLATFORMS) == set(EXPECTED_PLATFORMS)

def test_all_required_apps(self):
    """PR contract requires all four applications."""
    assert set(QMOI_APPS.keys()) == set(EXPECTED_APPS)

def test_minimum_features_per_pair(self):
    """Every platform/application pair needs 10+ features."""
    failures: List[str] = []

    for platform, app, features in _all_feature_entries():
        if len(features) < MIN_FEATURES_PER_APP_PLATFORM:
            failures.append(
                f"{app} on {platform}: {len(features)}"
            )

    assert not failures, (
        "The following platform/application pairs violate the "
        f"{MIN_FEATURES_PER_APP_PLATFORM}-feature contract: "
        + ", ".join(failures)
    )

def test_minimum_total_features(self):
    """PR contract requires at least 280 feature entries."""
    total = _total_feature_count()

    assert total >= MIN_TOTAL_FEATURES, (
        f"PR contract requires at least {MIN_TOTAL_FEATURES} "
        f"features; registry contains {total}"
    )

def test_validation_pipeline_is_executable(self):
    """Required validation pipeline methods must be callable."""
    agent = OllamaAutonomousAgent()

    methods = (
        agent.validate_all_platforms,
        agent.validate_all_platform_features,
        agent.run_full_validation_suite,
    )

    assert all(callable(method) for method in methods)

============================================================================

PERFORMANCE TESTS

============================================================================

class TestPerformance:
"""Performance checks for validation primitives."""

def test_platform_feature_validator_performance(self):
    """Single feature validation should complete within five seconds."""
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
    assert results

def test_agent_initialization_is_reasonable(self):
    """Agent construction should not perform an unexpectedly long job."""
    start = time.perf_counter()

    agent = OllamaAutonomousAgent()

    elapsed = time.perf_counter() - start

    assert agent is not None

    assert elapsed < 5.0, (
        f"Agent initialization took {elapsed:.3f}s; expected <5s"
    )

def test_agent_validator_collection_if_present(self):
    """
    If the implementation exposes a validators collection, it should
    contain one validator entry for each supported platform.

    This test intentionally does not require a specific internal type
    (dict/list/etc.), preventing a harmless implementation refactor from
    breaking the contract test.
    """
    agent = OllamaAutonomousAgent()

    if not hasattr(agent, "validators"):
        pytest.skip(
            "Agent does not expose an internal 'validators' collection"
        )

    validators = agent.validators

    assert validators is not None

    try:
        validator_count = len(validators)
    except TypeError:
        pytest.fail(
            "Agent.validators exists but does not provide a length"
        )

    assert validator_count == len(EXPECTED_PLATFORMS), (
        "Expected one validator collection entry per supported platform"
    )

============================================================================

EDGE CASE TESTS

============================================================================

class TestEdgeCases:
"""Tests for invalid platform/application inputs."""

def test_invalid_platform_does_not_modify_registry(self):
    """Invalid platform input must not mutate the global registry."""
    before = {
        platform: dict(platform_data)
        for platform, platform_data in PLATFORM_SPECIFIC_FEATURES.items()
    }

    try:
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "invalid_platform",
        )
    except Exception as exc:
        # Both graceful construction and explicit validation errors are
        # acceptable; the important contract is that the global registry
        # remains intact.
        assert isinstance(exc, Exception)

    assert "invalid_platform" not in PLATFORM_SPECIFIC_FEATURES
    assert PLATFORM_SPECIFIC_FEATURES == before

def test_invalid_app_does_not_modify_registry(self):
    """Invalid application input must not mutate the global registry."""
    before = {
        platform: dict(platform_data)
        for platform, platform_data in PLATFORM_SPECIFIC_FEATURES.items()
    }

    try:
        validator = PlatformSpecificFeatureValidator(
            "invalid_app",
            "windows",
        )
    except Exception as exc:
        assert isinstance(exc, Exception)

    for platform in EXPECTED_PLATFORMS:
        assert "invalid_app" not in PLATFORM_SPECIFIC_FEATURES[platform]

    assert PLATFORM_SPECIFIC_FEATURES == before

============================================================================

INTEGRATION TESTS

============================================================================

class TestIntegration:
"""Integration-level consistency checks."""

def test_full_validation_suite_structure(self):
    """Full validation pipeline must expose the required entry points."""
    agent = OllamaAutonomousAgent()

    assert hasattr(agent, "validate_all_platforms")
    assert hasattr(agent, "validate_all_platform_features")
    assert hasattr(agent, "run_full_validation_suite")

    assert callable(agent.validate_all_platforms)
    assert callable(agent.validate_all_platform_features)
    assert callable(agent.run_full_validation_suite)

def test_cross_platform_feature_matrix_is_complete(self):
    """Every platform/application pair contains a valid feature list."""
    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            features = _features_for(platform, app)

            assert isinstance(features, (list, tuple))
            assert features
            assert all(
                isinstance(feature, str)
                for feature in features
            )

def test_common_cross_platform_features_are_valid_strings(self):
    """
    Validate common feature concepts without requiring them to exist on
    every platform. This prevents false failures when a capability is
    intentionally platform-specific.
    """
    common_patterns = (
        "handoff",
        "shortcuts",
        "integration",
        "support",
        "api",
    )

    for platform, app, features in _all_feature_entries():
        for feature in features:
            if any(pattern in feature for pattern in common_patterns):
                assert isinstance(feature, str)
                assert FEATURE_NAME_PATTERN.fullmatch(feature), (
                    f"Invalid common feature identifier '{feature}' "
                    f"for {app} on {platform}"
                )

def test_registry_total_is_stable_and_nonzero(self):
    """The feature registry must remain populated."""
    total = _total_feature_count()

    assert total > 0
    assert total >= MIN_TOTAL_FEATURES

============================================================================

PYTEST ENTRY POINT

============================================================================

if name == "main":
raise SystemExit(
pytest.main(
[
file,
"-v",
"--tb=short",
]
)
)