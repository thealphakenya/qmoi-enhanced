#!/usr/bin/env python3
"""
Comprehensive Test Suite for Ollama Autonomous Agent
====================================================

Validation coverage:
- 6 supported platforms
- 4 QMOI applications
- 280+ platform/application feature entries
- Platform validators
- Feature validators
- Agent validation contracts
- Registry consistency
- Duplicate detection
- Feature-name validation
- Performance sanity checks
- Invalid input handling
- Full validation-suite availability

Important:
This file must contain Python source only.

Do NOT paste repository-tree output such as:

    scripts/
    tests/
    ├── scripts/
    └── tests/

into this file unless it is inside a Python comment or string.
"""

from __future__ import annotations

import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping

import pytest


# ============================================================================
# TEST ENVIRONMENT / IMPORT PATH
# ============================================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"

if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

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
        f"{SCRIPTS_DIR}. Original error: {exc}",
        pytrace=False,
    )


# ============================================================================
# CONTRACT CONSTANTS
# ============================================================================

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

MINIMUM_TOTAL_FEATURES = 280
MINIMUM_FEATURES_PER_APP_PLATFORM = 10

# The feature registry is expected to contain at least this many entries
# for each app/platform pair. Some implementations may contain more.
MINIMUM_FEATURES_PER_PLATFORM = {
    "windows": 12,
    "macos": 12,
    "linux": 12,
    "ios": 12,
    "android": 12,
    "web": 12,
}

FEATURE_NAME_PATTERN = re.compile(r"^[a-z][a-z0-9_]*[a-z0-9]$")


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def _as_feature_list(value: Any) -> List[str]:
    """
    Normalize a feature-registry value to a list of feature names.

    The current contract expects lists/tuples/sets of strings. This helper
    keeps the tests readable and produces a useful assertion when the registry
    shape is invalid.
    """
    assert value is not None, "Feature registry entry must not be None"

    if isinstance(value, str):
        pytest.fail(
            "Feature registry entry is a string instead of a collection "
            "of feature names."
        )

    if not isinstance(value, (list, tuple, set, frozenset)):
        pytest.fail(
            "Feature registry entry must be a list, tuple, set, or "
            f"frozenset; got {type(value).__name__}."
        )

    features = list(value)

    assert all(
        isinstance(feature, str) for feature in features
    ), "Every feature name must be a string."

    return features


def _platform_registry() -> Mapping[str, Any]:
    """Return the platform feature registry after basic validation."""
    assert isinstance(
        PLATFORM_SPECIFIC_FEATURES, Mapping
    ), "PLATFORM_SPECIFIC_FEATURES must be a mapping."

    return PLATFORM_SPECIFIC_FEATURES


def _get_features(platform: str, app: str) -> List[str]:
    """Return the feature list for one platform/application pair."""
    registry = _platform_registry()

    assert platform in registry, (
        f"Platform '{platform}' is missing from PLATFORM_SPECIFIC_FEATURES."
    )

    platform_data = registry[platform]

    assert isinstance(platform_data, Mapping), (
        f"Feature registry for platform '{platform}' must be a mapping; "
        f"got {type(platform_data).__name__}."
    )

    assert app in platform_data, (
        f"Application '{app}' is missing for platform '{platform}'."
    )

    return _as_feature_list(platform_data[app])


def _all_registry_pairs() -> Iterable[tuple[str, str, List[str]]]:
    """Yield every expected platform/application feature collection."""
    for platform in EXPECTED_PLATFORMS:
        for app in EXPECTED_APPS:
            yield platform, app, _get_features(platform, app)


def _flatten_feature_registry() -> Dict[tuple[str, str], List[str]]:
    """Return a normalized copy of the complete feature registry."""
    return {
        (platform, app): features
        for platform, app, features in _all_registry_pairs()
    }


def _instantiate_agent() -> OllamaAutonomousAgent:
    """Create the autonomous agent with a useful failure message."""
    try:
        return OllamaAutonomousAgent()
    except Exception as exc:
        pytest.fail(
            f"OllamaAutonomousAgent could not be initialized: "
            f"{type(exc).__name__}: {exc}"
        )


# ============================================================================
# REGISTRY / PLATFORM TESTS
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

    def test_all_platforms_present(self) -> None:
        """Verify the six required platforms are defined."""
        assert isinstance(PLATFORMS, (list, tuple, set, frozenset))
        assert len(PLATFORMS) == 6

        for platform in EXPECTED_PLATFORMS:
            assert platform in PLATFORMS, (
                f"Required platform '{platform}' is missing."
            )

    def test_all_apps_present(self) -> None:
        """Verify the four required QMOI applications are defined."""
        assert isinstance(QMOI_APPS, Mapping)
        assert len(QMOI_APPS) == 4

        for app in EXPECTED_APPS:
            assert app in QMOI_APPS, (
                f"Required application '{app}' is missing."
            )

    def test_feature_registry_has_all_platforms(self) -> None:
        """Verify every required platform has a feature registry."""
        registry = _platform_registry()

        for platform in EXPECTED_PLATFORMS:
            assert platform in registry, (
                f"Platform '{platform}' is missing from feature registry."
            )

    def test_each_platform_has_all_apps(self) -> None:
        """Verify every platform contains all four applications."""
        registry = _platform_registry()

        for platform in EXPECTED_PLATFORMS:
            platform_data = registry[platform]

            assert isinstance(platform_data, Mapping), (
                f"Registry for '{platform}' must be a mapping."
            )

            for app in EXPECTED_APPS:
                assert app in platform_data, (
                    f"App '{app}' missing for platform '{platform}'."
                )

    # ------------------------------------------------------------------------
    # MINIMUM FEATURE CONTRACT
    # ------------------------------------------------------------------------

    def test_minimum_features_per_app_platform(self) -> None:
        """
        Verify every platform/application pair meets the PR contract.

        The contract requires at least 10 features per pair. The registry may
        contain more than 10.
        """
        for platform, app, features in _all_registry_pairs():
            assert len(features) >= MINIMUM_FEATURES_PER_APP_PLATFORM, (
                f"PR contract requires at least "
                f"{MINIMUM_FEATURES_PER_APP_PLATFORM} features for "
                f"{app} on {platform}; got {len(features)}."
            )

    def test_platform_feature_minimums(self) -> None:
        """
        Verify the current six-platform registry has at least 12 features
        per app/platform pair.
        """
        for platform, app, features in _all_registry_pairs():
            minimum = MINIMUM_FEATURES_PER_PLATFORM.get(platform, 12)

            assert len(features) >= minimum, (
                f"Expected at least {minimum} features for "
                f"{app} on {platform}; got {len(features)}."
            )

    def test_total_feature_count(self) -> None:
        """Verify the complete registry contains at least 280 entries."""
        total_features = 0

        for platform, app, features in _all_registry_pairs():
            count = len(features)
            total_features += count

            print(
                f"{platform:10} {app:12} "
                f"{count:3} features"
            )

        print(
            f"\nTotal platform-specific feature entries: "
            f"{total_features}"
        )

        assert total_features >= MINIMUM_TOTAL_FEATURES, (
            f"Expected at least {MINIMUM_TOTAL_FEATURES} platform-specific "
            f"features, got {total_features}."
        )

    # ------------------------------------------------------------------------
    # DUPLICATE / NAMING CONTRACT
    # ------------------------------------------------------------------------

    def test_no_duplicate_features_per_app_platform(self) -> None:
        """Verify no app/platform contains duplicate feature names."""
        for platform, app, features in _all_registry_pairs():
            assert len(features) == len(set(features)), (
                f"Duplicate feature names detected for "
                f"{app} on {platform}."
            )

    def test_feature_names_are_non_empty(self) -> None:
        """Verify all feature names are non-empty strings."""
        for platform, app, features in _all_registry_pairs():
            for feature in features:
                assert isinstance(feature, str)
                assert feature.strip() == feature
                assert feature != "", (
                    f"Empty feature name found for {app} on {platform}."
                )

    def test_feature_names_follow_snake_case(self) -> None:
        """Verify feature identifiers follow the expected snake_case form."""
        for platform, app, features in _all_registry_pairs():
            for feature in features:
                assert FEATURE_NAME_PATTERN.fullmatch(feature), (
                    f"Feature '{feature}' for {app} on {platform} "
                    "does not follow the required snake_case convention."
                )

    # ------------------------------------------------------------------------
    # PLATFORM-SPECIFIC SMOKE TESTS
    #
    # These checks intentionally verify representative capabilities rather
    # than requiring a fragile historical feature list. The registry can grow
    # without forcing this test file to be rewritten for every new feature.
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
        """Verify representative features remain present."""
        features = _get_features(platform, app)

        assert expected_feature in features, (
            f"Expected representative feature '{expected_feature}' "
            f"for {app} on {platform}."
        )

    # ------------------------------------------------------------------------
    # FEATURE VALIDATOR
    # ------------------------------------------------------------------------

    def test_platform_feature_validator_initialization(self) -> None:
        """Verify PlatformSpecificFeatureValidator initializes correctly."""
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        assert hasattr(validator, "app_name")
        assert hasattr(validator, "platform")

        assert validator.app_name == "qmoiaiui"
        assert validator.platform == "windows"

    def test_platform_feature_validator_results_structure(self) -> None:
        """Verify feature validator returns a boolean-result mapping."""
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        results = validator.validate_all_features()

        assert isinstance(results, Mapping), (
            "validate_all_features() must return a mapping."
        )

        assert len(results) > 0, (
            "validate_all_features() returned no feature results."
        )

        assert all(
            isinstance(value, bool)
            for value in results.values()
        ), (
            "Every feature-validation result must be boolean."
        )

    # ------------------------------------------------------------------------
    # AGENT VALIDATION
    # ------------------------------------------------------------------------

    def test_agent_has_required_validation_methods(self) -> None:
        """Verify the agent exposes the required validation API."""
        required_methods = (
            "validate_all_platforms",
            "validate_all_platform_features",
            "run_full_validation_suite",
        )

        for method_name in required_methods:
            assert hasattr(self.agent, method_name), (
                f"Agent is missing required method '{method_name}'."
            )

            method = getattr(self.agent, method_name)

            assert callable(method), (
                f"Agent attribute '{method_name}' must be callable."
            )

    def test_agent_platform_validation_returns_mapping(self) -> None:
        """Verify platform validation has the expected hierarchy."""
        results = self.agent.validate_all_platforms()

        assert isinstance(results, Mapping), (
            "validate_all_platforms() must return a mapping."
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in results, (
                f"Platform '{platform}' missing from validation results."
            )

            platform_results = results[platform]

            assert isinstance(platform_results, Mapping), (
                f"Validation result for '{platform}' must be a mapping."
            )

            for app in EXPECTED_APPS:
                assert app in platform_results, (
                    f"App '{app}' missing from validation results "
                    f"for platform '{platform}'."
                )

    def test_agent_feature_validation_returns_mapping(self) -> None:
        """Verify feature validation has platform/app/result hierarchy."""
        results = self.agent.validate_all_platform_features()

        assert isinstance(results, Mapping), (
            "validate_all_platform_features() must return a mapping."
        )

        for platform in EXPECTED_PLATFORMS:
            assert platform in results

            platform_results = results[platform]

            assert isinstance(platform_results, Mapping), (
                f"Feature results for '{platform}' must be a mapping."
            )

            for app in EXPECTED_APPS:
                assert app in platform_results, (
                    f"App '{app}' missing from feature validation "
                    f"results for '{platform}'."
                )

                app_results = platform_results[app]

                assert isinstance(app_results, Mapping), (
                    f"Feature results for {app}/{platform} must "
                    "be a mapping."
                )

    # ------------------------------------------------------------------------
    # PR SUCCESS CONTRACTS
    # ------------------------------------------------------------------------

    def test_pr_contract_all_platforms_required(self) -> None:
        """Verify all six platforms are part of the PR contract."""
        assert len(EXPECTED_PLATFORMS) == 6

        for platform in EXPECTED_PLATFORMS:
            assert platform in PLATFORMS

    def test_pr_contract_all_apps_required(self) -> None:
        """Verify all four QMOI applications are part of the PR contract."""
        assert len(EXPECTED_APPS) == 4

        for app in EXPECTED_APPS:
            assert app in QMOI_APPS

    def test_pr_contract_feature_matrix_complete(self) -> None:
        """
        Verify the complete 6 x 4 feature matrix.

        This is the important merge-gate contract: every required app must
        have a feature collection for every required platform.
        """
        expected_pairs = len(EXPECTED_PLATFORMS) * len(EXPECTED_APPS)

        matrix = _flatten_feature_registry()

        assert len(matrix) == expected_pairs, (
            f"Expected {expected_pairs} platform/app combinations, "
            f"got {len(matrix)}."
        )

        for platform, app in matrix:
            assert platform in EXPECTED_PLATFORMS
            assert app in EXPECTED_APPS

    # ------------------------------------------------------------------------
    # CONSISTENCY
    # ------------------------------------------------------------------------

    def test_registry_keys_match_contract(self) -> None:
        """Verify the registry does not omit required top-level platforms."""
        registry = _platform_registry()

        for platform in EXPECTED_PLATFORMS:
            assert platform in registry

    def test_registry_contains_only_valid_feature_names(self) -> None:
        """Verify every registry feature is a valid string identifier."""
        for platform, app, features in _all_registry_pairs():
            for feature in features:
                assert isinstance(feature, str)
                assert FEATURE_NAME_PATTERN.fullmatch(feature), (
                    f"Invalid feature identifier '{feature}' in "
                    f"{platform}/{app}."
                )


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Performance and initialization sanity checks."""

    def test_platform_feature_validator_performance(self) -> None:
        """
        Verify one feature-validation operation completes within the CI
        sanity threshold.
        """
        validator = PlatformSpecificFeatureValidator(
            "qmoiaiui",
            "windows",
        )

        start = time.perf_counter()

        results = validator.validate_all_features()

        elapsed = time.perf_counter() - start

        assert elapsed < 5.0, (
            f"Feature validation took {elapsed:.3f}s; expected <5s."
        )

        assert isinstance(results, Mapping)
        assert len(results) > 0

    def test_agent_initialization_is_reasonable(self) -> None:
        """Verify agent initialization succeeds without expensive work."""
        start = time.perf_counter()

        agent = OllamaAutonomousAgent()

        elapsed = time.perf_counter() - start

        assert elapsed < 10.0, (
            f"Agent initialization took {elapsed:.3f}s; expected <10s."
        )

        assert agent is not None

    def test_agent_validator_structure(self) -> None:
        """
        Verify validators are initialized for the six required platforms.

        This test accepts either a mapping keyed by platform or a compatible
        collection implementation.
        """
        agent = OllamaAutonomousAgent()

        assert hasattr(agent, "validators"), (
            "Agent must expose validators."
        )

        validators = agent.validators

        if isinstance(validators, Mapping):
            assert len(validators) == 6

            for platform in EXPECTED_PLATFORMS:
                assert platform in validators
        else:
            assert len(validators) == 6

        assert hasattr(agent, "results"), (
            "Agent must expose results."
        )

        results = agent.results

        # A newly initialized agent should normally have no validation
        # results. If the implementation initializes a mapping with empty
        # platform buckets, that is also acceptable.
        assert isinstance(results, Mapping)


# ============================================================================
# EDGE CASE TESTS
# ============================================================================

class TestEdgeCases:
    """Invalid input and defensive-behavior tests."""

    def test_invalid_platform_does_not_corrupt_registry(self) -> None:
        """
        Verify an invalid platform does not create a new feature-registry
        entry.
        """
        registry_before = set(PLATFORM_SPECIFIC_FEATURES.keys())

        try:
            validator = PlatformSpecificFeatureValidator(
                "qmoiaiui",
                "invalid_platform",
            )
        except (ValueError, KeyError):
            # Rejecting invalid input is valid defensive behavior.
            return
        except Exception as exc:
            pytest.fail(
                "Unexpected exception for invalid platform: "
                f"{type(exc).__name__}: {exc}"
            )

        assert validator is not None

        registry_after = set(PLATFORM_SPECIFIC_FEATURES.keys())

        assert registry_after == registry_before
        assert "invalid_platform" not in PLATFORM_SPECIFIC_FEATURES

    def test_invalid_app_does_not_corrupt_registry(self) -> None:
        """
        Verify an invalid application does not create a new app entry.
        """
        try:
            validator = PlatformSpecificFeatureValidator(
                "invalid_app",
                "windows",
            )
        except (ValueError, KeyError):
            # Rejecting invalid input is valid defensive behavior.
            return
        except Exception as exc:
            pytest.fail(
                "Unexpected exception for invalid app: "
                f"{type(exc).__name__}: {exc}"
            )

        assert validator is not None

        for platform in EXPECTED_PLATFORMS:
            platform_data = PLATFORM_SPECIFIC_FEATURES.get(platform, {})

            if isinstance(platform_data, Mapping):
                assert "invalid_app" not in platform_data


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

class TestIntegration:
    """Integration tests for the complete validation pipeline."""

    def test_full_validation_suite_method_exists(self) -> None:
        """Verify the full validation entry point exists."""
        agent = OllamaAutonomousAgent()

        assert hasattr(
            agent,
            "run_full_validation_suite",
        )

        assert callable(
            agent.run_full_validation_suite
        )

    def test_cross_platform_feature_matrix_is_complete(self) -> None:
        """
        Verify every matrix cell contains a usable collection of strings.
        """
        for platform in EXPECTED_PLATFORMS:
            for app in EXPECTED_APPS:
                features = _get_features(platform, app)

                assert isinstance(features, list)
                assert len(features) >= (
                    MINIMUM_FEATURES_PER_APP_PLATFORM
                )

                assert all(
                    isinstance(feature, str)
                    for feature in features
                )

    def test_feature_matrix_has_unique_entries(self) -> None:
        """Verify each app/platform feature collection is unique."""
        for platform, app, features in _all_registry_pairs():
            duplicates = sorted(
                {
                    feature
                    for feature in features
                    if features.count(feature) > 1
                }
            )

            assert not duplicates, (
                f"Duplicate features for {app}/{platform}: "
                f"{duplicates}"
            )

    def test_feature_registry_is_deterministic(self) -> None:
        """
        Verify repeated reads of the registry produce the same feature
        collections.

        This catches accidental mutation during test execution.
        """
        first = _flatten_feature_registry()
        second = _flatten_feature_registry()

        assert first == second


# ============================================================================
# OPTIONAL PUBLIC-API TESTS
# ============================================================================

class TestPublicValidatorAPI:
    """Validate that the expected validator classes are usable."""

    def test_platform_validator_is_importable(self) -> None:
        """Verify PlatformValidator remains part of the public test API."""
        assert PlatformValidator is not None

    def test_platform_specific_validator_is_importable(self) -> None:
        """Verify PlatformSpecificFeatureValidator is available."""
        assert PlatformSpecificFeatureValidator is not None

    def test_agent_class_is_importable(self) -> None:
        """Verify OllamaAutonomousAgent is available."""
        assert OllamaAutonomousAgent is not None


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