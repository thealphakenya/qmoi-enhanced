#!/usr/bin/env python3
"""
Comprehensive Test Suite for Ollama Autonomous Agent
====================================================

Validation coverage:
- 6 supported platforms
- 4 QMOI applications
- 293+ platform/application feature entries
- Platform validators
- Feature validators
- Agent validation contracts
- Registry consistency
- Duplicate detection
- Feature-name validation
- Performance sanity checks
- Invalid input handling
- Full validation-suite availability

IMPORTANT
---------
This file must contain Python source only.

Repository-tree documentation must never be pasted into this file as raw
source. For example, tree characters such as "├──", "└──", or "│" must not
appear as executable Python code.
"""

from __future__ import annotations

import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Tuple

import pytest


# ============================================================================
# TEST ENVIRONMENT / IMPORT PATH
# ============================================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"

if not SCRIPTS_DIR.is_dir():
    pytest.fail(
        f"Required scripts directory does not exist: {SCRIPTS_DIR}",
        pytrace=False,
    )

scripts_path = str(SCRIPTS_DIR)

if scripts_path not in sys.path:
    sys.path.insert(0, scripts_path)


try:
    from ollama_autonomous_agent import (
        OllamaAutonomousAgent,
        PlatformSpecificFeatureValidator,
        PlatformValidator,
        PLATFORMS,
        QMOI_APPS,
        PLATFORM_SPECIFIC_FEATURES,
    )
except ImportError as exc:
    pytest.fail(
        "Unable to import ollama_autonomous_agent from "
        f"{SCRIPTS_DIR}. Original error: "
        f"{type(exc).__name__}: {exc}",
        pytrace=False,
    )


# ============================================================================
# PR / FEATURE CONTRACT
# ============================================================================

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
    "qmoi-space",
    "qcity",
    "qalpha",
)

EXPECTED_PLATFORM_COUNT = 6
EXPECTED_APP_COUNT = 4

# The repository/workflow is advertised as supporting 293+ platform-specific
# feature entries. Keep this as one explicit merge-gate contract.
MINIMUM_TOTAL_FEATURES = 293

# Every platform/application pair must contain at least 10 features.
MINIMUM_FEATURES_PER_APP_PLATFORM = 10

# Current registry baseline. Each pair should have at least 12 entries.
# Additional features are allowed.
MINIMUM_FEATURES_PER_PLATFORM: Dict[str, int] = {
    "windows": 12,
    "macos": 12,
    "linux": 12,
    "ios": 12,
    "android": 12,
    "web": 12,
}

FEATURE_NAME_PATTERN = re.compile(
    r"^[a-z][a-z0-9_]*[a-z0-9]$"
)


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _assert_mapping(
    value: Any,
    description: str,
) -> Mapping[Any, Any]:
    """Assert that a value is a mapping and return it."""
    assert isinstance(value, Mapping), (
        f"{description} must be a mapping; "
        f"got {type(value).__name__}."
    )

    return value


def _as_feature_list(value: Any) -> List[str]:
    """
    Normalize one registry entry into a list of feature names.

    The registry contract accepts common collection types but explicitly
    rejects a single string because a string would otherwise be interpreted
    as a collection of individual characters.
    """
    assert value is not None, (
        "Feature registry entry must not be None."
    )

    if isinstance(value, str):
        pytest.fail(
            "Feature registry entry is a string instead of a collection "
            "of feature names."
        )

    if not isinstance(
        value,
        (list, tuple, set, frozenset),
    ):
        pytest.fail(
            "Feature registry entry must be a list, tuple, set, or "
            f"frozenset; got {type(value).__name__}."
        )

    features = list(value)

    assert all(
        isinstance(feature, str)
        for feature in features
    ), "Every feature name must be a string."

    return features


def _platform_registry() -> Mapping[str, Any]:
    """Return the platform feature registry after validating its shape."""
    return _assert_mapping(
        PLATFORM_SPECIFIC_FEATURES,
        "PLATFORM_SPECIFIC_FEATURES",
    )


def _get_features(
    platform: str,
    app: str,
) -> List[str]:
    """Return the feature list for one platform/application pair."""
    registry = _platform_registry()

    assert platform in registry, (
        f"Platform '{platform}' is missing from "
        "PLATFORM_SPECIFIC_FEATURES."
    )

    platform_data = _assert_mapping(
        registry[platform],
        f"Feature registry for platform '{platform}'",
    )

    assert app in platform_data, (
        f"Application '{app}' is missing for platform "
        f"'{platform}'."
    )

    return _as_feature_list(platform_data[app])


def _all_registry_pairs() -> Iterable[
    Tuple[str, str, List[str]]
]:
    """Yield every required platform/application registry entry."""
    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            yield (
                platform,
                app,
                _get_features(platform, app),
            )


def _flatten_feature_registry() -> Dict[
    Tuple[str, str],
    List[str],
]:
    """Return a normalized copy of the required feature matrix."""
    return {
        (platform, app): list(features)
        for platform, app, features in _all_registry_pairs()
    }


def _instantiate_agent() -> OllamaAutonomousAgent:
    """Create an agent with a useful CI failure message."""
    try:
        return OllamaAutonomousAgent()
    except Exception as exc:
        pytest.fail(
            "OllamaAutonomousAgent could not be initialized: "
            f"{type(exc).__name__}: {exc}"
        )


def _assert_boolean_mapping(
    value: Any,
    description: str,
) -> None:
    """Validate a mapping whose values must be booleans."""
    result = _assert_mapping(
        value,
        description,
    )

    assert all(
        isinstance(item, bool)
        for item in result.values()
    ), (
        f"{description} must contain only boolean values."
    )


# ============================================================================
# PLATFORM / APPLICATION CONTRACT TESTS
# ============================================================================

class TestPlatformSpecificFeatures:
    """Master validation suite for the platform feature matrix."""

    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        """Create a fresh agent for each test."""
        self.agent = _instantiate_agent()

    # ------------------------------------------------------------------------
    # PLATFORM CONTRACT
    # ------------------------------------------------------------------------

    def test_platform_contract(self) -> None:
        """Verify exactly the six required platforms are exposed."""
        assert isinstance(
            PLATFORMS,
            (list, tuple, set, frozenset),
        ), (
            "PLATFORMS must be a collection."
        )

        actual_platforms = set(PLATFORMS)
        expected_platforms = set(EXPECTED_PLATFORMS)

        assert len(actual_platforms) == EXPECTED_PLATFORM_COUNT, (
            f"Expected {EXPECTED_PLATFORM_COUNT} platforms, "
            f"got {len(actual_platforms)}."
        )

        assert actual_platforms == expected_platforms, (
            "Platform contract mismatch. "
            f"Expected {sorted(expected_platforms)}, "
            f"got {sorted(actual_platforms)}."
        )

    def test_application_contract(self) -> None:
        """Verify exactly the four required QMOI applications are exposed."""
        apps = _assert_mapping(
            QMOI_APPS,
            "QMOI_APPS",
        )

        actual_apps = set(apps.keys())
        expected_apps = set(EXPECTED_APPS)

        assert len(actual_apps) == EXPECTED_APP_COUNT, (
            f"Expected {EXPECTED_APP_COUNT} applications, "
            f"got {len(actual_apps)}."
        )

        assert actual_apps == expected_apps, (
            "Application contract mismatch. "
            f"Expected {sorted(expected_apps)}, "
            f"got {sorted(actual_apps)}."
        )

    def test_feature_registry_has_all_platforms(self) -> None:
        """Verify every required platform exists in the feature registry."""
        registry = _platform_registry()

        for platform in EXPECTED_PLATFORMS:
            assert platform in registry, (
                f"Required platform '{platform}' is missing "
                "from PLATFORM_SPECIFIC_FEATURES."
            )

    def test_each_platform_has_all_apps(self) -> None:
        """Verify every platform contains all four applications."""
        registry = _platform_registry()

        for platform in EXPECTED_PLATFORMS:
            platform_data = _assert_mapping(
                registry[platform],
                f"Registry for platform '{platform}'",
            )

            for app in EXPECTED_APPS:
                assert app in platform_data, (
                    f"Application '{app}' is missing for "
                    f"platform '{platform}'."
                )

    # ------------------------------------------------------------------------
    # FEATURE COUNT CONTRACT
    # ------------------------------------------------------------------------

    def test_minimum_features_per_app_platform(self) -> None:
        """Verify every platform/application pair has at least 10 features."""
        for platform, app, features in _all_registry_pairs():
            assert len(features) >= (
                MINIMUM_FEATURES_PER_APP_PLATFORM
            ), (
                f"PR contract requires at least "
                f"{MINIMUM_FEATURES_PER_APP_PLATFORM} features "
                f"for {app} on {platform}; "
                f"got {len(features)}."
            )

    def test_current_platform_feature_minimums(self) -> None:
        """
        Verify every platform/application pair meets the current 12-feature
        registry baseline.
        """
        for platform, app, features in _all_registry_pairs():
            minimum = MINIMUM_FEATURES_PER_PLATFORM[platform]

            assert len(features) >= minimum, (
                f"Expected at least {minimum} features for "
                f"{app} on {platform}; got {len(features)}."
            )

    def test_total_feature_count(self) -> None:
        """
        Verify the complete matrix contains at least 293 feature entries.

        This counts each feature occurrence in each platform/application
        combination. A feature shared by multiple combinations is therefore
        intentionally counted once per combination.
        """
        total_features = 0

        for platform, app, features in _all_registry_pairs():
            count = len(features)
            total_features += count

            print(
                f"{platform:10} "
                f"{app:12} "
                f"{count:3} features"
            )

        print(
            "\nTotal platform-specific feature entries: "
            f"{total_features}"
        )

        assert total_features >= MINIMUM_TOTAL_FEATURES, (
            f"Expected at least {MINIMUM_TOTAL_FEATURES} "
            f"platform-specific feature entries, "
            f"got {total_features}."
        )

    # ------------------------------------------------------------------------
    # FEATURE COLLECTION VALIDATION
    # ------------------------------------------------------------------------

    def test_feature_collections_are_valid(self) -> None:
        """Verify all registry cells contain collections of strings."""
        for platform, app, features in _all_registry_pairs():
            assert isinstance(features, list)

            assert all(
                isinstance(feature, str)
                for feature in features
            ), (
                f"Non-string feature found in "
                f"{platform}/{app}."
            )

    def test_no_duplicate_features_per_app_platform(self) -> None:
        """Verify there are no duplicate features in any registry cell."""
        for platform, app, features in _all_registry_pairs():
            duplicates = sorted(
                {
                    feature
                    for feature in features
                    if features.count(feature) > 1
                }
            )

            assert not duplicates, (
                f"Duplicate features detected for "
                f"{app} on {platform}: {duplicates}"
            )

    def test_feature_names_are_non_empty(self) -> None:
        """Verify feature names are non-empty, trimmed strings."""
        for platform, app, features in _all_registry_pairs():
            for feature in features:
                assert isinstance(feature, str)

                assert feature, (
                    f"Empty feature name found for "
                    f"{app} on {platform}."
                )

                assert feature.strip() == feature, (
                    f"Feature '{feature}' contains leading or "
                    f"trailing whitespace for {app}/{platform}."
                )

    def test_feature_names_follow_snake_case(self) -> None:
        """Verify every feature identifier follows snake_case conventions."""
        for platform, app, features in _all_registry_pairs():
            for feature in features:
                assert FEATURE_NAME_PATTERN.fullmatch(
                    feature
                ), (
                    f"Feature '{feature}' for {app} on {platform} "
                    "does not follow the required snake_case "
                    "identifier convention."
                )

    # ------------------------------------------------------------------------
    # REPRESENTATIVE PLATFORM FEATURES
    # ------------------------------------------------------------------------

    @pytest.mark.parametrize(
        ("platform", "app", "expected_feature"),
        [
            (
                "windows",
                "qmoiaiui",
                "windows_notifications_api",
            ),
            (
                "windows",
                "qcity",
                "windows_shell_integration",
            ),
            (
                "windows",
                "qmoi-space",
                "media_keys",
            ),
            (
                "windows",
                "qalpha",
                "powershell_integration",
            ),
            (
                "macos",
                "qmoiaiui",
                "notification_center",
            ),
            (
                "macos",
                "qcity",
                "finder_integration",
            ),
            (
                "macos",
                "qmoi-space",
                "avfoundation_framework",
            ),
            (
                "macos",
                "qalpha",
                "xcode_integration",
            ),
            (
                "linux",
                "qmoiaiui",
                "dbus_integration",
            ),
            (
                "linux",
                "qcity",
                "freedesktop_mime_types",
            ),
            (
                "linux",
                "qmoi-space",
                "pipewire_support",
            ),
            (
                "linux",
                "qalpha",
                "docker_integration",
            ),
            (
                "ios",
                "qmoiaiui",
                "fileprovider_integration",
            ),
            (
                "ios",
                "qcity",
                "files_app_integration",
            ),
            (
                "ios",
                "qmoi-space",
                "avplayer_framework",
            ),
            (
                "ios",
                "qalpha",
                "swift_playgrounds",
            ),
            (
                "android",
                "qmoiaiui",
                "content_provider",
            ),
            (
                "android",
                "qcity",
                "storage_access_framework",
            ),
            (
                "android",
                "qmoi-space",
                "mediaplayer_exoplayer",
            ),
            (
                "android",
                "qalpha",
                "gradle_build_system",
            ),
            (
                "web",
                "qmoiaiui",
                "service_worker_web",
            ),
            (
                "web",
                "qcity",
                "drag_drop_files",
            ),
            (
                "web",
                "qmoi-space",
                "html5_audio_video",
            ),
            (
                "web",
                "qalpha",
                "javascript_debugging",
            ),
        ],
    )
    def test_representative_platform_features(
        self,
        platform: str,
        app: str,
        expected_feature: str,
    ) -> None:
        """Verify representative capabilities remain in the registry."""
        features = _get_features(
            platform,
            app,
        )

        assert expected_feature in features, (
            f"Expected feature '{expected_feature}' for "
            f"{app} on {platform}."
        )

    # ------------------------------------------------------------------------
    # FEATURE VALIDATOR CONTRACT
    # ------------------------------------------------------------------------

    def test_platform_feature_validator_initialization(self) -> None:
        """Verify the feature validator initializes for a valid pair."""
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        assert hasattr(validator, "app_name"), (
            "Feature validator must expose app_name."
        )

        assert hasattr(validator, "platform"), (
            "Feature validator must expose platform."
        )

        assert validator.app_name == "qmoiaiui"
        assert validator.platform == "windows"

    def test_platform_feature_validator_results_structure(self) -> None:
        """
        Verify validate_all_features() returns a non-empty mapping of boolean
        validation results.
        """
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        results = validator.validate_all_features()

        _assert_boolean_mapping(
            results,
            "validate_all_features() result",
        )

        assert len(results) > 0, (
            "validate_all_features() returned no results."
        )

    # ------------------------------------------------------------------------
    # AGENT PUBLIC VALIDATION API
    # ------------------------------------------------------------------------

    def test_agent_has_required_validation_methods(self) -> None:
        """Verify the agent exposes all required validation methods."""
        required_methods = (
            "validate_all_platforms",
            "validate_all_platform_features",
            "run_full_validation_suite",
        )

        for method_name in required_methods:
            assert hasattr(
                self.agent,
                method_name,
            ), (
                f"OllamaAutonomousAgent is missing "
                f"'{method_name}'."
            )

            assert callable(
                getattr(self.agent, method_name)
            ), (
                f"'{method_name}' must be callable."
            )

    def test_agent_platform_validation_returns_mapping(self) -> None:
        """Verify platform validation has a 6-platform/4-app hierarchy."""
        results = self.agent.validate_all_platforms()

        results = _assert_mapping(
            results,
            "validate_all_platforms() result",
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in results, (
                f"Platform '{platform}' missing from "
                "validate_all_platforms() result."
            )

            platform_results = _assert_mapping(
                results[platform],
                f"Platform result for '{platform}'",
            )

            for app in EXPECTED_APPS:
                assert app in platform_results, (
                    f"Application '{app}' missing from "
                    f"platform validation result for '{platform}'."
                )

    def test_agent_feature_validation_returns_mapping(self) -> None:
        """
        Verify feature validation returns the required platform/application
        hierarchy.
        """
        results = self.agent.validate_all_platform_features()

        results = _assert_mapping(
            results,
            "validate_all_platform_features() result",
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in results, (
                f"Platform '{platform}' missing from "
                "feature-validation result."
            )

            platform_results = _assert_mapping(
                results[platform],
                f"Feature result for platform '{platform}'",
            )

            for app in EXPECTED_APPS:
                assert app in platform_results, (
                    f"Application '{app}' missing from "
                    f"feature-validation result for '{platform}'."
                )

                app_results = _assert_mapping(
                    platform_results[app],
                    f"Feature result for {app}/{platform}",
                )

                assert len(app_results) > 0, (
                    f"Feature validation returned no results "
                    f"for {app}/{platform}."
                )

    # ------------------------------------------------------------------------
    # PR SUCCESS CONTRACTS
    # ------------------------------------------------------------------------

    def test_pr_contract_all_platforms_required(self) -> None:
        """Verify all six platforms are required by the PR contract."""
        assert len(EXPECTED_PLATFORMS) == EXPECTED_PLATFORM_COUNT

        for platform in EXPECTED_PLATFORMS:
            assert platform in PLATFORMS

    def test_pr_contract_all_apps_required(self) -> None:
        """Verify all four applications are required by the PR contract."""
        assert len(EXPECTED_APPS) == EXPECTED_APP_COUNT

        for app in EXPECTED_APPS:
            assert app in QMOI_APPS

    def test_pr_contract_feature_matrix_complete(self) -> None:
        """
        Verify all 24 platform/application combinations are present.
        """
        expected_pairs = (
            EXPECTED_PLATFORM_COUNT
            * EXPECTED_APP_COUNT
        )

        matrix = _flatten_feature_registry()

        assert len(matrix) == expected_pairs, (
            f"Expected {expected_pairs} platform/application "
            f"combinations, got {len(matrix)}."
        )

        for platform, app in matrix:
            assert platform in EXPECTED_PLATFORMS
            assert app in EXPECTED_APPS

    # ------------------------------------------------------------------------
    # REGISTRY CONSISTENCY
    # ------------------------------------------------------------------------

    def test_registry_keys_match_contract(self) -> None:
        """Verify required top-level registry keys exist."""
        registry = _platform_registry()

        for platform in EXPECTED_PLATFORMS:
            assert platform in registry

    def test_registry_feature_identifiers_are_valid(self) -> None:
        """Verify all feature identifiers satisfy the naming contract."""
        for platform, app, features in _all_registry_pairs():
            for feature in features:
                assert isinstance(feature, str)

                assert FEATURE_NAME_PATTERN.fullmatch(
                    feature
                ), (
                    f"Invalid feature identifier '{feature}' "
                    f"in {platform}/{app}."
                )

    def test_feature_registry_is_not_empty(self) -> None:
        """Verify the complete feature registry contains actual data."""
        registry = _platform_registry()

        assert registry, (
            "PLATFORM_SPECIFIC_FEATURES must not be empty."
        )

        total = sum(
            len(features)
            for _, _, features in _all_registry_pairs()
        )

        assert total > 0, (
            "Feature registry contains no feature entries."
        )


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Performance and initialization sanity checks."""

    def test_platform_feature_validator_performance(self) -> None:
        """
        Verify a single feature-validation operation completes within the
        CI sanity threshold.
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
            "expected less than 5 seconds."
        )

        assert isinstance(results, Mapping)
        assert len(results) > 0

    def test_agent_initialization_performance(self) -> None:
        """Verify agent initialization completes within a reasonable time."""
        start = time.perf_counter()

        agent = OllamaAutonomousAgent()

        elapsed = time.perf_counter() - start

        assert elapsed < 10.0, (
            f"Agent initialization took {elapsed:.3f}s; "
            "expected less than 10 seconds."
        )

        assert agent is not None

    def test_agent_validator_structure(self) -> None:
        """
        Verify the agent has validators for all six platforms without
        requiring a specific private implementation beyond the public
        validators attribute.
        """
        agent = OllamaAutonomousAgent()

        assert hasattr(agent, "validators"), (
            "Agent must expose validators."
        )

        validators = agent.validators

        assert validators is not None

        if isinstance(validators, Mapping):
            assert len(validators) == EXPECTED_PLATFORM_COUNT, (
                f"Expected {EXPECTED_PLATFORM_COUNT} validators, "
                f"got {len(validators)}."
            )

            for platform in EXPECTED_PLATFORMS:
                assert platform in validators, (
                    f"Validator for '{platform}' is missing."
                )

        else:
            assert hasattr(
                validators,
                "__len__",
            ), (
                "Agent validators must be a sized collection."
            )

            assert len(validators) == EXPECTED_PLATFORM_COUNT, (
                f"Expected {EXPECTED_PLATFORM_COUNT} validators, "
                f"got {len(validators)}."
            )

    def test_agent_results_structure(self) -> None:
        """
        Verify the agent exposes a results mapping.

        The test intentionally does not require the mapping to be empty,
        because implementations may initialize result buckets eagerly.
        """
        agent = OllamaAutonomousAgent()

        assert hasattr(agent, "results"), (
            "Agent must expose results."
        )

        assert isinstance(
            agent.results,
            Mapping,
        ), (
            "Agent results must be a mapping."
        )


# ============================================================================
# EDGE CASE TESTS
# ============================================================================

class TestEdgeCases:
    """Invalid-input and defensive-behavior tests."""

    def test_invalid_platform_does_not_corrupt_registry(self) -> None:
        """
        Verify an invalid platform either raises a controlled exception or
        leaves the feature registry unchanged.
        """
        registry_before = {
            platform: (
                dict(value)
                if isinstance(value, Mapping)
                else value
            )
            for platform, value
            in _platform_registry().items()
        }

        try:
            validator = PlatformSpecificFeatureValidator(
                "qmoiaiui",
                "invalid_platform",
            )
        except (ValueError, KeyError):
            return
        except Exception as exc:
            pytest.fail(
                "Unexpected exception for invalid platform: "
                f"{type(exc).__name__}: {exc}"
            )

        assert validator is not None

        registry_after = _platform_registry()

        assert set(registry_after.keys()) == set(
            registry_before.keys()
        )

        assert (
            "invalid_platform"
            not in registry_after
        )

    def test_invalid_app_does_not_corrupt_registry(self) -> None:
        """
        Verify an invalid application either raises a controlled exception or
        does not add itself to the registry.
        """
        registry_before = _flatten_feature_registry()

        try:
            validator = PlatformSpecificFeatureValidator(
                "invalid_app",
                "windows",
            )
        except (ValueError, KeyError):
            return
        except Exception as exc:
            pytest.fail(
                "Unexpected exception for invalid application: "
                f"{type(exc).__name__}: {exc}"
            )

        assert validator is not None

        registry_after = _flatten_feature_registry()

        assert registry_after == registry_before

        for platform in EXPECTED_PLATFORMS:
            platform_data = _assert_mapping(
                PLATFORM_SPECIFIC_FEATURES[platform],
                f"Registry for '{platform}'",
            )

            assert "invalid_app" not in platform_data


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

class TestIntegration:
    """Integration tests for the complete validation pipeline."""

    def test_full_validation_suite_method_exists(self) -> None:
        """Verify the full validation entry point exists and is callable."""
        agent = OllamaAutonomousAgent()

        assert hasattr(
            agent,
            "run_full_validation_suite",
        )

        assert callable(
            agent.run_full_validation_suite
        )

    def test_cross_platform_feature_matrix_is_complete(self) -> None:
        """Verify all 24 matrix cells contain usable feature collections."""
        for platform in EXPECTED_PLATFORMS:
            for app in EXPECTED_APPS:
                features = _get_features(
                    platform,
                    app,
                )

                assert isinstance(features, list)

                assert len(features) >= (
                    MINIMUM_FEATURES_PER_APP_PLATFORM
                ), (
                    f"{platform}/{app} contains only "
                    f"{len(features)} features."
                )

                assert all(
                    isinstance(feature, str)
                    for feature in features
                )

    def test_feature_matrix_has_unique_entries(self) -> None:
        """Verify every matrix cell has unique feature names."""
        for platform, app, features in _all_registry_pairs():
            duplicates = sorted(
                {
                    feature
                    for feature in features
                    if features.count(feature) > 1
                }
            )

            assert not duplicates, (
                f"Duplicate features for "
                f"{app}/{platform}: {duplicates}"
            )

    def test_feature_registry_is_deterministic(self) -> None:
        """
        Verify reading the feature registry repeatedly does not mutate it.
        """
        first = _flatten_feature_registry()
        second = _flatten_feature_registry()

        assert first == second

    def test_feature_count_is_deterministic(self) -> None:
        """Verify repeated feature counting produces the same total."""
        first_total = sum(
            len(features)
            for _, _, features in _all_registry_pairs()
        )

        second_total = sum(
            len(features)
            for _, _, features in _all_registry_pairs()
        )

        assert first_total == second_total

        assert first_total >= MINIMUM_TOTAL_FEATURES


# ============================================================================
# PUBLIC API TESTS
# ============================================================================

class TestPublicValidatorAPI:
    """Verify required public classes remain importable."""

    def test_platform_validator_is_importable(self) -> None:
        """Verify PlatformValidator is available."""
        assert PlatformValidator is not None

    def test_platform_specific_validator_is_importable(self) -> None:
        """Verify PlatformSpecificFeatureValidator is available."""
        assert PlatformSpecificFeatureValidator is not None

    def test_agent_class_is_importable(self) -> None:
        """Verify OllamaAutonomousAgent is available."""
        assert OllamaAutonomousAgent is not None

    def test_validator_classes_are_classes(self) -> None:
        """Verify imported validator symbols are usable classes."""
        assert isinstance(
            PlatformValidator,
            type,
        )

        assert isinstance(
            PlatformSpecificFeatureValidator,
            type,
        )

        assert isinstance(
            OllamaAutonomousAgent,
            type,
        )


# ============================================================================
# SOURCE-SAFETY TESTS
# ============================================================================

class TestSourceSafety:
    """
    Tests that help prevent accidental insertion of repository-tree output
    into Python source files.

    This is particularly important because the previous CI failure came from
    raw Unicode tree characters being inserted into this test module.
    """

    def test_this_source_does_not_contain_raw_tree_lines(self) -> None:
        """
        Ensure repository-tree glyphs cannot appear as standalone executable
        lines in this test file.

        The characters may legitimately occur inside comments/docstrings, so
        this test checks lines rather than banning the Unicode characters
        globally.
        """
        source_path = Path(__file__).resolve()
        source = source_path.read_text(
            encoding="utf-8",
        )

        tree_markers = (
            "\N{BOX DRAWINGS LIGHT VERTICAL AND RIGHT}" "── ",
            "\N{BOX DRAWINGS LIGHT UP AND RIGHT}" "── ",
            "\N{BOX DRAWINGS LIGHT VERTICAL}" "   ",
        )

        for line_number, line in enumerate(
            source.splitlines(),
            start=1,
        ):
            stripped = line.strip()

            if not stripped:
                continue

            # Ignore comments and strings/documentation. The actual Python
            # parser already validates the complete source during collection.
            if stripped.startswith("#"):
                continue

            assert not any(
                marker in line
                for marker in tree_markers
            ), (
                f"Repository-tree text detected on source "
                f"line {line_number}: {line!r}"
            )

    def test_python_source_can_be_compiled(self) -> None:
        """Explicitly compile this test module as an additional syntax check."""
        source_path = Path(__file__).resolve()

        source = source_path.read_text(
            encoding="utf-8",
        )

        try:
            compile(
                source,
                str(source_path),
                "exec",
            )
        except SyntaxError as exc:
            pytest.fail(
                "This test file contains invalid Python syntax: "
                f"{exc}"
            )


# ============================================================================
# DIRECT EXECUTION
# ============================================================================

if __name__ == "__main__":
    raise SystemExit(
        pytest.main(
            [
                str(Path(__file__).resolve()),
                "-v",
                "--tb=short",
            ]
        )
    )