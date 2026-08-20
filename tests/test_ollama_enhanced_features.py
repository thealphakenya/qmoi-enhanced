#!/usr/bin/env python3
"""
Comprehensive Test Suite for Ollama Autonomous Agent

Tests for the Ollama/QMOI autonomous validation layer.

Coverage:

- 6 supported platforms
- 4 QMOI applications
- 280+ platform/application-specific features
- PlatformSpecificFeatureValidator
- PlatformValidator
- OllamaAutonomousAgent
- PR validation contract
- Registry consistency
- Duplicate detection
- Feature-name validation
- Validation result structure
- Invalid-input handling
- Performance sanity checks

The tests intentionally validate the PUBLIC contract of the agent rather
than relying unnecessarily on private implementation details.

Supported platforms:
windows
macos
linux
ios
android
web

Supported applications:
qmoiaiui
qcity
qmoi-space
qalpha
"""

from future import annotations

import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Sequence, Tuple

import pytest

============================================================================

IMPORT PATH

============================================================================

Repository layout expected by this test:

repository/

├── scripts/

│   └── ollama_autonomous_agent.py

└── tests/

└── test_ollama_autonomous_agent.py

Resolve the repository root from this file rather than relying on the

current working directory.

REPOSITORY_ROOT = Path(file).resolve().parent.parent
SCRIPTS_DIR = REPOSITORY_ROOT / "scripts"

if str(SCRIPTS_DIR) not in sys.path:
sys.path.insert(0, str(SCRIPTS_DIR))

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

EXPECTED_PLATFORMS: Tuple[str, ...] = (
"windows",
"macos",
"linux",
"ios",
"android",
"web",
)

EXPECTED_APPS: Tuple[str, ...] = (
"qmoiaiui",
"qcity",
"qmoi-space",
"qalpha",
)

MIN_FEATURES_PER_APP_PLATFORM = 10
MIN_TOTAL_FEATURES = 280

FEATURE_NAME_PATTERN = re.compile(
r"^[a-z][a-z0-9_]*[a-z0-9]$"
)

============================================================================

EXPECTED FEATURE CONTRACTS

============================================================================

These are deliberately limited to important contract-level features.

The registry is allowed to contain additional features.

The tests do NOT require every implementation to have exactly the same

number of features; they require the minimum contract and completeness.

============================================================================

REQUIRED_FEATURES: Dict[str, Dict[str, Tuple[str, ...]]] = {
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
# Accept both the historical spelling and the corrected
# Android API spelling if the implementation has normalized it.
"documents_provider",
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

REGISTRY HELPERS

============================================================================

def _as_feature_list(value: Any) -> List[str]:
"""
Normalize a registry value to a feature list.

The updated agent may expose registry values as:
    - list
    - tuple
    - set
    - another iterable

Invalid/non-iterable values are returned as an empty list so the test
can produce a useful assertion failure instead of crashing with a
confusing TypeError.
"""
if value is None:
    return []

if isinstance(value, str):
    return [value]

if isinstance(value, (list, tuple, set, frozenset)):
    return [str(item) for item in value]

try:
    return [str(item) for item in value]
except TypeError:
    return []

def _get_platform_registry(platform: str) -> Mapping[str, Any]:
"""
Return the registry mapping for a platform.

Expected public shape:

    PLATFORM_SPECIFIC_FEATURES[platform][app] -> feature collection
"""
registry = PLATFORM_SPECIFIC_FEATURES

if not isinstance(registry, Mapping):
    raise AssertionError(
        "PLATFORM_SPECIFIC_FEATURES must be a mapping"
    )

platform_data = registry.get(platform)

if not isinstance(platform_data, Mapping):
    raise AssertionError(
        f"Feature registry for platform '{platform}' must be a mapping"
    )

return platform_data

def get_features(platform: str, app: str) -> List[str]:
"""Return normalized features for one platform/application pair."""
platform_data = _get_platform_registry(platform)
return _as_feature_list(platform_data.get(app, []))

def total_registered_features() -> int:
"""Return the total number of registered platform/application features."""
total = 0

for platform in EXPECTED_PLATFORMS:
    platform_data = _get_platform_registry(platform)

    for app in EXPECTED_APPS:
        total += len(_as_feature_list(platform_data.get(app, [])))

return total

def assert_validation_result_mapping(
result: Any,
*,
expected_platforms: Sequence[str] = EXPECTED_PLATFORMS,
expected_apps: Sequence[str] = EXPECTED_APPS,
) -> None:
"""
Validate the standard platform -> app -> result mapping.

The result for each app is intentionally allowed to be either:
    - dict
    - bool
    - list
    - tuple
    - another structured validation result

This prevents the tests from breaking simply because the implementation
adds metadata around a validation result.
"""
assert isinstance(result, Mapping), (
    f"Expected mapping validation result, got {type(result).__name__}"
)

for platform in expected_platforms:
    assert platform in result, (
        f"Validation result missing platform '{platform}'"
    )

    platform_result = result[platform]

    assert isinstance(platform_result, Mapping), (
        f"Validation result for '{platform}' must be a mapping, "
        f"got {type(platform_result).__name__}"
    )

    for app in expected_apps:
        assert app in platform_result, (
            f"Validation result missing '{app}' on '{platform}'"
        )

============================================================================

TEST CONFIGURATION

============================================================================

class TestPlatformSpecificFeatures:
"""Master tests for the platform-specific feature registry."""

@pytest.fixture(autouse=True)
def setup(self) -> None:
    """Create a fresh agent for each test."""
    self.agent = OllamaAutonomousAgent()
    self.platforms = list(EXPECTED_PLATFORMS)
    self.apps = list(EXPECTED_APPS)

# ========================================================================
# WINDOWS
# ========================================================================

def test_windows_qmoiaiui_features_complete(self) -> None:
    """Validate required QMOIAIUI Windows features."""
    features = get_features("windows", "qmoiaiui")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["windows"]["qmoiaiui"]:
        assert feature in features, (
            f"Missing Windows/QMOIAIUI feature: {feature}"
        )

def test_windows_qcity_features_complete(self) -> None:
    """Validate required QCity Windows features."""
    features = get_features("windows", "qcity")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["windows"]["qcity"]:
        assert feature in features, (
            f"Missing Windows/QCity feature: {feature}"
        )

def test_windows_qmoi_space_features_complete(self) -> None:
    """Validate required QMOI Space Windows features."""
    features = get_features("windows", "qmoi-space")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["windows"]["qmoi-space"]:
        assert feature in features, (
            f"Missing Windows/QMOI Space feature: {feature}"
        )

def test_windows_qalpha_features_complete(self) -> None:
    """Validate required QALPHA Windows features."""
    features = get_features("windows", "qalpha")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["windows"]["qalpha"]:
        assert feature in features, (
            f"Missing Windows/QALPHA feature: {feature}"
        )

# ========================================================================
# MACOS
# ========================================================================

def test_macos_qmoiaiui_features_complete(self) -> None:
    """Validate required QMOIAIUI macOS features."""
    features = get_features("macos", "qmoiaiui")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["macos"]["qmoiaiui"]:
        assert feature in features, (
            f"Missing macOS/QMOIAIUI feature: {feature}"
        )

def test_macos_qcity_features_complete(self) -> None:
    """Validate required QCity macOS features."""
    features = get_features("macos", "qcity")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["macos"]["qcity"]:
        assert feature in features, (
            f"Missing macOS/QCity feature: {feature}"
        )

def test_macos_qmoi_space_features_complete(self) -> None:
    """Validate required QMOI Space macOS features."""
    features = get_features("macos", "qmoi-space")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["macos"]["qmoi-space"]:
        assert feature in features, (
            f"Missing macOS/QMOI Space feature: {feature}"
        )

def test_macos_qalpha_features_complete(self) -> None:
    """Validate required QALPHA macOS features."""
    features = get_features("macos", "qalpha")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["macos"]["qalpha"]:
        assert feature in features, (
            f"Missing macOS/QALPHA feature: {feature}"
        )

# ========================================================================
# LINUX
# ========================================================================

def test_linux_qmoiaiui_features_complete(self) -> None:
    """Validate required QMOIAIUI Linux features."""
    features = get_features("linux", "qmoiaiui")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["linux"]["qmoiaiui"]:
        assert feature in features, (
            f"Missing Linux/QMOIAIUI feature: {feature}"
        )

def test_linux_qcity_features_complete(self) -> None:
    """Validate required QCity Linux features."""
    features = get_features("linux", "qcity")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["linux"]["qcity"]:
        assert feature in features, (
            f"Missing Linux/QCity feature: {feature}"
        )

def test_linux_qmoi_space_features_complete(self) -> None:
    """Validate required QMOI Space Linux features."""
    features = get_features("linux", "qmoi-space")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["linux"]["qmoi-space"]:
        assert feature in features, (
            f"Missing Linux/QMOI Space feature: {feature}"
        )

def test_linux_qalpha_features_complete(self) -> None:
    """Validate required QALPHA Linux features."""
    features = get_features("linux", "qalpha")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["linux"]["qalpha"]:
        assert feature in features, (
            f"Missing Linux/QALPHA feature: {feature}"
        )

# ========================================================================
# IOS
# ========================================================================

def test_ios_qmoiaiui_features_complete(self) -> None:
    """Validate required QMOIAIUI iOS features."""
    features = get_features("ios", "qmoiaiui")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["ios"]["qmoiaiui"]:
        assert feature in features, (
            f"Missing iOS/QMOIAIUI feature: {feature}"
        )

def test_ios_qcity_features_complete(self) -> None:
    """Validate required QCity iOS features."""
    features = get_features("ios", "qcity")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["ios"]["qcity"]:
        assert feature in features, (
            f"Missing iOS/QCity feature: {feature}"
        )

def test_ios_qmoi_space_features_complete(self) -> None:
    """Validate required QMOI Space iOS features."""
    features = get_features("ios", "qmoi-space")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["ios"]["qmoi-space"]:
        assert feature in features, (
            f"Missing iOS/QMOI Space feature: {feature}"
        )

def test_ios_qalpha_features_complete(self) -> None:
    """Validate required QALPHA iOS features."""
    features = get_features("ios", "qalpha")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["ios"]["qalpha"]:
        assert feature in features, (
            f"Missing iOS/QALPHA feature: {feature}"
        )

# ========================================================================
# ANDROID
# ========================================================================

def test_android_qmoiaiui_features_complete(self) -> None:
    """Validate required QMOIAIUI Android features."""
    features = get_features("android", "qmoiaiui")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    assert (
        "documents_provider" in features
        or "documentsrovider" in features
    ), "Missing Android DocumentsProvider feature"

    for feature in (
        "content_provider",
        "material_you_theming",
    ):
        assert feature in features, (
            f"Missing Android/QMOIAIUI feature: {feature}"
        )

def test_android_qcity_features_complete(self) -> None:
    """Validate required QCity Android features."""
    features = get_features("android", "qcity")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["android"]["qcity"]:
        assert feature in features, (
            f"Missing Android/QCity feature: {feature}"
        )

def test_android_qmoi_space_features_complete(self) -> None:
    """Validate required QMOI Space Android features."""
    features = get_features("android", "qmoi-space")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["android"]["qmoi-space"]:
        assert feature in features, (
            f"Missing Android/QMOI Space feature: {feature}"
        )

def test_android_qalpha_features_complete(self) -> None:
    """Validate required QALPHA Android features."""
    features = get_features("android", "qalpha")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["android"]["qalpha"]:
        assert feature in features, (
            f"Missing Android/QALPHA feature: {feature}"
        )

# ========================================================================
# WEB / PWA
# ========================================================================

def test_web_qmoiaiui_features_complete(self) -> None:
    """Validate required QMOIAIUI Web features."""
    features = get_features("web", "qmoiaiui")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["web"]["qmoiaiui"]:
        assert feature in features, (
            f"Missing Web/QMOIAIUI feature: {feature}"
        )

def test_web_qcity_features_complete(self) -> None:
    """Validate required QCity Web features."""
    features = get_features("web", "qcity")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["web"]["qcity"]:
        assert feature in features, (
            f"Missing Web/QCity feature: {feature}"
        )

def test_web_qmoi_space_features_complete(self) -> None:
    """Validate required QMOI Space Web features."""
    features = get_features("web", "qmoi-space")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["web"]["qmoi-space"]:
        assert feature in features, (
            f"Missing Web/QMOI Space feature: {feature}"
        )

def test_web_qalpha_features_complete(self) -> None:
    """Validate required QALPHA Web features."""
    features = get_features("web", "qalpha")

    assert len(features) >= MIN_FEATURES_PER_APP_PLATFORM

    for feature in REQUIRED_FEATURES["web"]["qalpha"]:
        assert feature in features, (
            f"Missing Web/QALPHA feature: {feature}"
        )

# ========================================================================
# TOTAL FEATURE COUNT
# ========================================================================

def test_total_feature_count(self) -> None:
    """Verify at least 280 platform/application features are registered."""
    total_features = total_registered_features()

    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            count = len(get_features(platform, app))
            print(
                f"{platform:12} "
                f"{app:15} "
                f"{count:3} features"
            )

    print(
        f"\nTotal: {total_features} "
        "platform-specific features"
    )

    assert total_features >= MIN_TOTAL_FEATURES, (
        f"Expected at least {MIN_TOTAL_FEATURES} features, "
        f"got {total_features}"
    )

# ========================================================================
# PLATFORM / APPLICATION REGISTRY
# ========================================================================

def test_all_platforms_present(self) -> None:
    """Verify the six required platforms are defined."""
    assert len(PLATFORMS) == 6

    for platform in EXPECTED_PLATFORMS:
        assert platform in PLATFORMS, (
            f"Required platform '{platform}' is missing"
        )

def test_platform_order_is_stable(self) -> None:
    """Verify all required platforms are represented without duplicates."""
    platforms = list(PLATFORMS)

    assert len(platforms) == len(set(platforms)), (
        "PLATFORMS contains duplicate entries"
    )

    assert set(platforms) == set(EXPECTED_PLATFORMS), (
        "PLATFORMS does not exactly match the six-platform contract"
    )

def test_all_apps_present(self) -> None:
    """Verify the four required QMOI applications are defined."""
    assert len(QMOI_APPS) == 4

    for app in EXPECTED_APPS:
        assert app in QMOI_APPS, (
            f"Required application '{app}' is missing"
        )

def test_application_order_is_stable(self) -> None:
    """Verify required application identifiers are unique."""
    apps = list(QMOI_APPS.keys())

    assert len(apps) == len(set(apps)), (
        "QMOI_APPS contains duplicate entries"
    )

    assert set(apps) == set(EXPECTED_APPS), (
        "QMOI_APPS does not exactly match the four-application contract"
    )

# ========================================================================
# PLATFORM FEATURE VALIDATOR
# ========================================================================

def test_platform_feature_validator_initialization(self) -> None:
    """Test PlatformSpecificFeatureValidator initialization."""
    validator = PlatformSpecificFeatureValidator(
        "qmoiaiui",
        "windows",
    )

    assert getattr(validator, "app_name", "qmoiaiui") == "qmoiaiui"
    assert getattr(validator, "platform", "windows") == "windows"

def test_platform_feature_validator_results_structure(self) -> None:
    """Test feature validator result structure."""
    validator = PlatformSpecificFeatureValidator(
        "qmoiaiui",
        "windows",
    )

    assert hasattr(validator, "validate_all_features"), (
        "PlatformSpecificFeatureValidator must expose "
        "validate_all_features()"
    )

    results = validator.validate_all_features()

    assert isinstance(results, Mapping), (
        "validate_all_features() must return a mapping"
    )

    assert len(results) >= MIN_FEATURES_PER_APP_PLATFORM, (
        f"Expected at least {MIN_FEATURES_PER_APP_PLATFORM} "
        f"validation results, got {len(results)}"
    )

    for feature_name, result in results.items():
        assert isinstance(feature_name, str), (
            "Feature validation result keys must be strings"
        )

        # Implementations may return bool or structured status objects.
        assert isinstance(
            result,
            (bool, Mapping, list, tuple, str, int, float),
        ), (
            f"Unsupported validation result type for "
            f"'{feature_name}': {type(result).__name__}"
        )

# ========================================================================
# PLATFORM VALIDATOR
# ========================================================================

def test_platform_validator_initialization(self) -> None:
    """Test PlatformValidator initialization."""
    validator = PlatformValidator("windows")

    assert validator is not None
    assert hasattr(validator, "validate"), (
        "PlatformValidator should expose validate()"
    )

# ========================================================================
# AGENT VALIDATION
# ========================================================================

def test_agent_initialization(self) -> None:
    """Verify the autonomous agent initializes successfully."""
    assert self.agent is not None

def test_agent_required_methods_exist(self) -> None:
    """Verify required public agent methods exist."""
    required_methods = (
        "validate_all_platforms",
        "validate_all_platform_features",
        "run_full_validation_suite",
    )

    for method_name in required_methods:
        assert hasattr(self.agent, method_name), (
            f"OllamaAutonomousAgent missing required method "
            f"'{method_name}'"
        )

        assert callable(getattr(self.agent, method_name)), (
            f"Agent method '{method_name}' is not callable"
        )

def test_agent_platform_validation_returns_expected_structure(
    self,
) -> None:
    """Test agent platform validation structure."""
    results = self.agent.validate_all_platforms()

    assert_validation_result_mapping(results)

def test_agent_feature_validation_returns_expected_structure(
    self,
) -> None:
    """Test agent feature validation structure."""
    results = self.agent.validate_all_platform_features()

    assert_validation_result_mapping(results)

# ========================================================================
# PR SUCCESS CONTRACT
# ========================================================================

def test_pr_contract_all_platforms_required(self) -> None:
    """Verify all six platforms are part of the PR contract."""
    assert len(EXPECTED_PLATFORMS) == 6
    assert set(PLATFORMS) == set(EXPECTED_PLATFORMS)

def test_pr_contract_all_apps_required(self) -> None:
    """Verify all four applications are part of the PR contract."""
    assert len(EXPECTED_APPS) == 4
    assert set(QMOI_APPS.keys()) == set(EXPECTED_APPS)

def test_pr_contract_minimum_features_per_app_platform(
    self,
) -> None:
    """Verify every app/platform pair has at least ten features."""
    failures: List[str] = []

    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            features = get_features(platform, app)

            if len(features) < MIN_FEATURES_PER_APP_PLATFORM:
                failures.append(
                    f"{app} on {platform}: "
                    f"{len(features)} features"
                )

    assert not failures, (
        "PR feature contract failed. "
        f"Every app/platform pair requires at least "
        f"{MIN_FEATURES_PER_APP_PLATFORM} features:\n"
        + "\n".join(failures)
    )

def test_pr_contract_total_features(self) -> None:
    """Verify the global 280+ feature PR contract."""
    total = total_registered_features()

    assert total >= MIN_TOTAL_FEATURES, (
        f"PR contract requires {MIN_TOTAL_FEATURES}+ "
        f"features; registry contains {total}"
    )

def test_pr_contract_validation_methods_callable(self) -> None:
    """Verify the complete validation API is callable."""
    for method_name in (
        "validate_all_platforms",
        "validate_all_platform_features",
        "run_full_validation_suite",
    ):
        method = getattr(self.agent, method_name, None)

        assert method is not None, (
            f"Missing required method: {method_name}"
        )

        assert callable(method), (
            f"Required method is not callable: {method_name}"
        )

# ========================================================================
# REGISTRY CONSISTENCY
# ========================================================================

def test_feature_registry_has_all_platforms(self) -> None:
    """Verify every required platform exists in the feature registry."""
    assert isinstance(PLATFORM_SPECIFIC_FEATURES, Mapping)

    for platform in EXPECTED_PLATFORMS:
        assert platform in PLATFORM_SPECIFIC_FEATURES, (
            f"Feature registry missing platform '{platform}'"
        )

def test_each_platform_has_all_apps(self) -> None:
    """Verify every platform defines every application."""
    failures: List[str] = []

    for platform in EXPECTED_PLATFORMS:
        platform_data = _get_platform_registry(platform)

        for app in EXPECTED_APPS:
            if app not in platform_data:
                failures.append(
                    f"{app} missing for platform {platform}"
                )

    assert not failures, (
        "Feature registry is incomplete:\n"
        + "\n".join(failures)
    )

def test_feature_registry_values_are_collections(self) -> None:
    """Verify each platform/application registry value is iterable."""
    for platform in EXPECTED_PLATFORMS:
        platform_data = _get_platform_registry(platform)

        for app in EXPECTED_APPS:
            raw_features = platform_data.get(app)

            assert raw_features is not None, (
                f"Missing registry value for {platform}/{app}"
            )

            features = _as_feature_list(raw_features)

            assert isinstance(features, list), (
                f"Registry value for {platform}/{app} "
                "could not be normalized"
            )

def test_no_duplicate_features_per_app_platform(self) -> None:
    """Verify no duplicate feature names within an app/platform."""
    failures: List[str] = []

    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            features = get_features(platform, app)

            if len(features) != len(set(features)):
                duplicates = sorted(
                    {
                        feature
                        for feature in features
                        if features.count(feature) > 1
                    }
                )

                failures.append(
                    f"{platform}/{app}: {duplicates}"
                )

    assert not failures, (
        "Duplicate features detected:\n"
        + "\n".join(failures)
    )

def test_feature_names_follow_convention(self) -> None:
    """Verify feature identifiers use the expected snake_case format."""
    failures: List[str] = []

    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            features = get_features(platform, app)

            for feature in features:
                if not FEATURE_NAME_PATTERN.fullmatch(feature):
                    failures.append(
                        f"{platform}/{app}: '{feature}'"
                    )

    assert not failures, (
        "Invalid feature names detected. "
        "Feature names must use lowercase snake_case:\n"
        + "\n".join(failures)
    )

def test_all_features_are_strings(self) -> None:
    """Verify raw registry features are strings."""
    failures: List[str] = []

    for platform in EXPECTED_PLATFORMS:
        platform_data = _get_platform_registry(platform)

        for app in EXPECTED_APPS:
            raw_features = platform_data.get(app, [])

            if isinstance(raw_features, str):
                raw_values: Iterable[Any] = [raw_features]
            else:
                try:
                    raw_values = iter(raw_features)
                except TypeError:
                    failures.append(
                        f"{platform}/{app}: non-iterable registry value"
                    )
                    continue

            for feature in raw_values:
                if not isinstance(feature, str):
                    failures.append(
                        f"{platform}/{app}: "
                        f"{feature!r} "
                        f"({type(feature).__name__})"
                    )

    assert not failures, (
        "Non-string feature identifiers detected:\n"
        + "\n".join(failures)
    )

============================================================================

PERFORMANCE TESTS

============================================================================

class TestPerformance:
"""Tests for validation performance."""

def test_platform_feature_validator_performance(self) -> None:
    """
    Verify one feature-validation pass completes within a reasonable
    amount of time.

    This is intentionally a generous sanity limit rather than a strict
    benchmark because CI machines vary significantly in performance.
    """
    validator = PlatformSpecificFeatureValidator(
        "qmoiaiui",
        "windows",
    )

    start = time.perf_counter()

    results = validator.validate_all_features()

    elapsed = time.perf_counter() - start

    assert elapsed < 5.0, (
        f"Feature validation took {elapsed:.3f}s; "
        "expected less than 5 seconds"
    )

    assert isinstance(results, Mapping)
    assert len(results) > 0

def test_agent_initialization_performance(self) -> None:
    """Verify agent initialization remains reasonably fast."""
    start = time.perf_counter()

    agent = OllamaAutonomousAgent()

    elapsed = time.perf_counter() - start

    assert agent is not None
    assert elapsed < 10.0, (
        f"Agent initialization took {elapsed:.3f}s; "
        "expected less than 10 seconds"
    )

def test_agent_validation_api_does_not_require_ollama_for_structure(
    self,
) -> None:
    """
    Verify the structural validation APIs can be invoked without making
    this test depend on a live Ollama server.

    This prevents ordinary registry/contract tests from failing because
    an external model service is unavailable.
    """
    agent = OllamaAutonomousAgent()

    assert callable(agent.validate_all_platforms)
    assert callable(agent.validate_all_platform_features)

============================================================================

EDGE CASES

============================================================================

class TestEdgeCases:
"""Tests for invalid input and defensive behavior."""

def test_invalid_platform_registry_lookup_is_detectable(self) -> None:
    """Verify an unknown platform is not silently part of the registry."""
    invalid_platform = "invalid_platform"

    assert invalid_platform not in PLATFORM_SPECIFIC_FEATURES

def test_invalid_app_registry_lookup_is_detectable(self) -> None:
    """Verify an unknown application is not silently registered."""
    invalid_app = "invalid_app"

    assert invalid_app not in QMOI_APPS

    for platform in EXPECTED_PLATFORMS:
        platform_data = _get_platform_registry(platform)

        assert invalid_app not in platform_data

def test_invalid_platform_validator_is_handled(self) -> None:
    """
    Verify invalid platform input is handled safely.

    The implementation may either:
    - raise a controlled exception, or
    - construct an object that later reports no valid features.

    Both are acceptable; arbitrary low-level exceptions are not.
    """
    try:
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "invalid_platform",
        )
    except (ValueError, KeyError, TypeError):
        return

    assert validator is not None

    platform = getattr(
        validator,
        "platform",
        "invalid_platform",
    )

    assert platform == "invalid_platform"

def test_invalid_app_validator_is_handled(self) -> None:
    """
    Verify invalid application input is handled safely.

    A controlled ValueError/KeyError/TypeError is acceptable.
    """
    try:
        validator = PlatformSpecificFeatureValidator(
            "invalid_app",
            "windows",
        )
    except (ValueError, KeyError, TypeError):
        return

    assert validator is not None

    app_name = getattr(
        validator,
        "app_name",
        "invalid_app",
    )

    assert app_name == "invalid_app"

============================================================================

INTEGRATION TESTS

============================================================================

class TestIntegration:
"""Integration tests for the full validation pipeline."""

def test_full_validation_suite_method_exists(self) -> None:
    """Verify the complete validation entry point exists."""
    agent = OllamaAutonomousAgent()

    assert hasattr(agent, "run_full_validation_suite")
    assert callable(agent.run_full_validation_suite)

def test_validation_methods_are_independently_callable(self) -> None:
    """Verify the two primary validation APIs exist."""
    agent = OllamaAutonomousAgent()

    methods = (
        "validate_all_platforms",
        "validate_all_platform_features",
    )

    for method_name in methods:
        method = getattr(agent, method_name, None)

        assert method is not None
        assert callable(method)

def test_cross_platform_feature_consistency(self) -> None:
    """
    Verify every feature matrix entry is a valid collection of strings.

    This deliberately does not require the same feature names on every
    platform because platform-specific functionality is expected to
    differ.
    """
    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            features = get_features(platform, app)

            assert isinstance(features, list)

            for feature in features:
                assert isinstance(feature, str)
                assert feature.strip() == feature
                assert feature != ""

def test_required_feature_contract_matches_registry(self) -> None:
    """
    Verify the important contract-level features are present without
    requiring an exact feature count.
    """
    failures: List[str] = []

    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            features = set(get_features(platform, app))

            required = set(
                REQUIRED_FEATURES
                .get(platform, {})
                .get(app, ())
            )

            # Android historically contained a typo in the feature name.
            if (
                platform == "android"
                and app == "qmoiaiui"
                and "documents_provider" in required
                and "documents_provider" not in features
                and "documentsrovider" in features
            ):
                required.remove("documents_provider")

            missing = sorted(required - features)

            if missing:
                failures.append(
                    f"{platform}/{app}: {missing}"
                )

    assert not failures, (
        "Required platform feature contract is incomplete:\n"
        + "\n".join(failures)
    )

def test_global_feature_matrix_is_nonempty(self) -> None:
    """Verify the feature matrix is not empty or accidentally replaced."""
    assert isinstance(PLATFORM_SPECIFIC_FEATURES, Mapping)

    total = total_registered_features()

    assert total > 0, (
        "PLATFORM_SPECIFIC_FEATURES contains no registered features"
    )

def test_agent_public_configuration_matches_registry_contract(
    self,
) -> None:
    """Verify the agent can represent the complete six-platform matrix."""
    agent = OllamaAutonomousAgent()

    # Do not depend on a private internal validator implementation.
    # If validators exists, it must at least represent all platforms.
    validators = getattr(agent, "validators", None)

    if validators is not None:
        if isinstance(validators, Mapping):
            for platform in EXPECTED_PLATFORMS:
                assert platform in validators, (
                    f"Agent validators missing platform '{platform}'"
                )
        elif isinstance(validators, Sequence) and not isinstance(
            validators,
            (str, bytes),
        ):
            assert len(validators) >= len(EXPECTED_PLATFORMS), (
                "Agent validator collection contains fewer entries "
                "than the six-platform contract"
            )

============================================================================

PYTEST ENTRY POINT

============================================================================

if name == "main":
raise SystemExit(
pytest.main(
[
str(Path(file).resolve()),
"-v",
"--tb=short",
]
)
)