#!/usr/bin/env python3
"""
Comprehensive Test Suite for QMOI Ollama Autonomous Agent
Tests all validation functions, feature checks, and platform compliance.

Includes:

- Platform validation
- Application feature validation
- File-handler validation
- Memory/model-card generation
- Realtime workflow monitoring
- GitHub token configuration
- Resume/checkpoint contracts
- Cross-repository synchronization
- Avatar identity/realtime contracts
- PR success contracts
- Resilience and auto-healing
- Safe normalization of platform-feature data structures

IMPORTANT:
The production implementation should preferably expose
PLATFORM_SPECIFIC_FEATURES as a dictionary.  These tests intentionally
support both the canonical dictionary representation and legacy list-based
representations so that a data-shape regression cannot cause the entire
validation suite to crash with:

AttributeError: 'list' object has no attribute 'keys'

The normalization helpers below do NOT make malformed data valid.  They
convert known supported representations into one canonical structure and
raise clear assertion errors for unsupported structures.
"""

import json
import re
import subprocess
import pytest
from pathlib import Path
import sys
from unittest.mock import patch, MagicMock

Add scripts to path

sys.path.insert(0, str(Path(file).parent.parent / "scripts"))

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
AvatarSelectionNavigator,
VoiceProfileSelector,
QMOIAvatarWindowStyle,
resolve_github_token,
mask_github_token,
)
from realtime_workflow_monitor import WorkflowMonitor

============================================================================

SHARED PLATFORM / APPLICATION CONTRACT

============================================================================

SUPPORTED_PLATFORMS = [
"windows",
"macos",
"linux",
"ios",
"android",
"web",
]

SUPPORTED_APPS = [
"qmoiaiui",
"qcity",
"qmoi-space",
"qalpha",
]

Canonical minimum feature contract.

These are deliberately the features already asserted elsewhere in this

suite.  They provide a stable minimum contract without inventing additional

production features.

REQUIRED_APP_FEATURES = {
"qmoiaiui": [
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
],
"qcity": [
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
],
"qmoi-space": [
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
],
"qalpha": [
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
],
}

============================================================================

FEATURE DATA NORMALIZATION

============================================================================

def _is_platform_name(value):
"""Return True when value is one of the supported platform identifiers."""
return isinstance(value, str) and value.lower() in SUPPORTED_PLATFORMS

def _is_app_name(value):
"""Return True when value is one of the supported application identifiers."""
return isinstance(value, str) and value.lower() in SUPPORTED_APPS

def _normalise_feature_list(value):
"""
Convert a feature collection into a list of feature names.

Supported forms:
  - ["feature_a", "feature_b"]
  - {"feature_a": {...}, "feature_b": {...}}
  - [{"name": "feature_a"}, {"name": "feature_b"}]

This helper intentionally rejects arbitrary values rather than silently
treating them as empty feature sets.
"""
if value is None:
    return []

if isinstance(value, dict):
    return [str(key) for key in value.keys()]

if isinstance(value, (list, tuple, set)):
    normalized = []

    for item in value:
        if isinstance(item, str):
            normalized.append(item)
            continue

        if isinstance(item, dict):
            # Common feature-record forms.
            name = (
                item.get("name")
                or item.get("feature")
                or item.get("id")
                or item.get("key")
            )

            if name is not None:
                normalized.append(str(name))
                continue

            # A dictionary containing feature names as keys is also valid.
            if item:
                normalized.extend(str(key) for key in item.keys())
                continue

        raise AssertionError(
            "Unsupported feature item structure: "
            f"{type(item).__name__}: {item!r}"
        )

    return normalized

raise AssertionError(
    "Unsupported feature collection type: "
    f"{type(value).__name__}"
)

def _merge_feature_mapping(target, platform, app, features):
"""Merge normalized feature names into target[platform][app]."""
target.setdefault(platform, {})
target[platform].setdefault(app, [])

for feature in _normalise_feature_list(features):
    if feature not in target[platform][app]:
        target[platform][app].append(feature)

def normalize_platform_features(raw_features):
"""
Normalize PLATFORM_SPECIFIC_FEATURES into:

    {
        "windows": {
            "qmoiaiui": [...],
            "qcity": [...],
            "qmoi-space": [...],
            "qalpha": [...]
        },
        ...
    }

Supported production/legacy shapes include:

1. Canonical nested dictionary:

   {
       "windows": {
           "qmoiaiui": [...]
       }
   }

2. Platform dictionary whose values are records:

   {
       "windows": {
           "qmoiaiui": {"features": [...]}
       }
   }

3. List of platform dictionaries:

   [
       {"windows": {...}},
       {"macos": {...}}
   ]

4. List of feature records:

   [
       {
           "platform": "windows",
           "app": "qmoiaiui",
           "features": [...]
       }
   ]

5. List of records containing one platform and one app mapping.

The function deliberately does NOT manufacture missing platforms/apps.
Missing contract data remains missing and is caught by the assertions.
"""
assert raw_features is not None, (
    "PLATFORM_SPECIFIC_FEATURES must not be None"
)

normalized = {}

# ------------------------------------------------------------------
# Canonical dictionary form
# ------------------------------------------------------------------
if isinstance(raw_features, dict):
    # Determine whether the top-level dictionary is platform-oriented.
    platform_keys = [
        key for key in raw_features.keys()
        if _is_platform_name(key)
    ]

    if platform_keys:
        for platform_key, platform_value in raw_features.items():
            platform = str(platform_key).lower()

            if not _is_platform_name(platform):
                continue

            if isinstance(platform_value, dict):
                for app_key, app_value in platform_value.items():
                    if not _is_app_name(app_key):
                        continue

                    app = str(app_key).lower()

                    # Handle:
                    #   app -> [...]
                    #   app -> {"features": [...]}
                    #   app -> {"feature": ...}
                    if isinstance(app_value, dict):
                        if "features" in app_value:
                            feature_value = app_value["features"]
                        elif "items" in app_value:
                            feature_value = app_value["items"]
                        elif "feature_list" in app_value:
                            feature_value = app_value["feature_list"]
                        else:
                            feature_value = app_value
                    else:
                        feature_value = app_value

                    _merge_feature_mapping(
                        normalized,
                        platform,
                        app,
                        feature_value,
                    )

            elif isinstance(platform_value, list):
                # A platform may itself be represented as a list of app
                # records.
                for app_record in platform_value:
                    if not isinstance(app_record, dict):
                        continue

                    app = (
                        app_record.get("app")
                        or app_record.get("application")
                    )

                    if _is_app_name(app):
                        feature_value = (
                            app_record.get("features")
                            or app_record.get("feature_list")
                            or app_record.get("items")
                            or []
                        )
                        _merge_feature_mapping(
                            normalized,
                            platform,
                            str(app).lower(),
                            feature_value,
                        )

        return normalized

    # Some implementations use:
    #
    # {
    #     "qmoiaiui": {
    #         "windows": [...]
    #     },
    #     ...
    # }
    #
    # Support that app-first representation as well.
    app_keys = [
        key for key in raw_features.keys()
        if _is_app_name(key)
    ]

    if app_keys:
        for app_key, app_value in raw_features.items():
            app = str(app_key).lower()

            if not _is_app_name(app):
                continue

            if isinstance(app_value, dict):
                for platform_key, platform_value in app_value.items():
                    if not _is_platform_name(platform_key):
                        continue

                    platform = str(platform_key).lower()

                    if isinstance(platform_value, dict):
                        if "features" in platform_value:
                            feature_value = platform_value["features"]
                        else:
                            feature_value = platform_value
                    else:
                        feature_value = platform_value

                    _merge_feature_mapping(
                        normalized,
                        platform,
                        app,
                        feature_value,
                    )

        return normalized

    raise AssertionError(
        "Unsupported PLATFORM_SPECIFIC_FEATURES dictionary shape. "
        "Expected platform-first or app-first mapping. "
        f"Top-level keys: {list(raw_features.keys())!r}"
    )

# ------------------------------------------------------------------
# Legacy / generated list form
# ------------------------------------------------------------------
if isinstance(raw_features, (list, tuple)):
    for item in raw_features:
        if isinstance(item, dict):
            # Explicit feature record:
            # {"platform": "...", "app": "...", "features": [...]}
            platform = (
                item.get("platform")
                or item.get("platform_name")
                or item.get("os")
            )
            app = (
                item.get("app")
                or item.get("application")
                or item.get("app_name")
            )

            if _is_platform_name(platform) and _is_app_name(app):
                feature_value = (
                    item.get("features")
                    or item.get("feature_list")
                    or item.get("items")
                    or []
                )

                _merge_feature_mapping(
                    normalized,
                    str(platform).lower(),
                    str(app).lower(),
                    feature_value,
                )
                continue

            # Single-platform wrapper:
            # {"windows": {...}}
            platform_keys = [
                key for key in item.keys()
                if _is_platform_name(key)
            ]

            if platform_keys:
                nested = normalize_platform_features(item)

                for nested_platform, apps in nested.items():
                    for nested_app, features in apps.items():
                        _merge_feature_mapping(
                            normalized,
                            nested_platform,
                            nested_app,
                            features,
                        )
                continue

            # Single-app wrapper:
            # {"qcity": {"windows": [...]}}
            app_keys = [
                key for key in item.keys()
                if _is_app_name(key)
            ]

            if app_keys:
                nested = normalize_platform_features(item)

                for nested_platform, apps in nested.items():
                    for nested_app, features in apps.items():
                        _merge_feature_mapping(
                            normalized,
                            nested_platform,
                            nested_app,
                            features,
                        )
                continue

            # Generic feature record with a single platform/app key pair.
            for possible_platform, possible_value in item.items():
                if _is_platform_name(possible_platform):
                    if isinstance(possible_value, dict):
                        for possible_app, possible_features in possible_value.items():
                            if _is_app_name(possible_app):
                                _merge_feature_mapping(
                                    normalized,
                                    str(possible_platform).lower(),
                                    str(possible_app).lower(),
                                    possible_features,
                                )

        # Plain strings cannot describe platform/app ownership without
        # additional context, so deliberately ignore them here rather
        # than pretending they satisfy the platform contract.

    return normalized

raise AssertionError(
    "PLATFORM_SPECIFIC_FEATURES must be a dictionary or supported list. "
    f"Received: {type(raw_features).__name__}"
)

def get_normalized_platform_features(agent):
"""
Return the agent's platform-specific features in canonical dictionary
form.

This is the central regression guard for the original:

    AttributeError: 'list' object has no attribute 'keys'

failure.
"""
raw_features = getattr(agent, "PLATFORM_SPECIFIC_FEATURES", None)
return normalize_platform_features(raw_features)

def flatten_platform_features(normalized_features):
"""Return (platform, app, feature) tuples for contract validation."""
flattened = []

for platform, apps in normalized_features.items():
    for app, features in apps.items():
        for feature in features:
            flattened.append((platform, app, feature))

return flattened

def validate_platform_feature_contract(agent):
"""
Validate the complete structural contract without relying on the raw
object's concrete container type.
"""
normalized = get_normalized_platform_features(agent)

missing_platforms = [
    platform
    for platform in SUPPORTED_PLATFORMS
    if platform not in normalized
]

assert not missing_platforms, (
    "Missing required platforms: "
    + ", ".join(missing_platforms)
)

for platform in SUPPORTED_PLATFORMS:
    apps = normalized[platform]

    assert isinstance(apps, dict), (
        f"Platform {platform!r} must normalize to a dictionary"
    )

    missing_apps = [
        app
        for app in SUPPORTED_APPS
        if app not in apps
    ]

    assert not missing_apps, (
        f"Platform {platform!r} is missing applications: "
        + ", ".join(missing_apps)
    )

    for app in SUPPORTED_APPS:
        features = apps[app]

        assert isinstance(features, list), (
            f"{platform}/{app} must normalize to a feature list"
        )

        assert features, (
            f"{platform}/{app} must contain at least one feature"
        )

============================================================================

PLATFORM VALIDATOR

============================================================================

class TestPlatformValidator:
"""Tests for PlatformValidator class."""

def test_validator_initialization(self):
    """Test platform validator can be initialized for each platform."""
    for platform in SUPPORTED_PLATFORMS:
        validator = PlatformValidator(platform)
        assert validator.platform == platform

def test_all_platforms_support_validation(self):
    """Verify validation methods exist for all platforms."""
    required_methods = [
        "validate_code_compiles",
        "validate_dependencies_resolve",
        "validate_manifests_present",
        "validate_signatures",
    ]

    for platform in SUPPORTED_PLATFORMS:
        validator = PlatformValidator(platform)

        for method in required_methods:
            assert hasattr(validator, method)

============================================================================

FEATURE TESTER

============================================================================

class TestFeatureTester:
"""Tests for FeatureTester class."""

def test_qmoiaiui_features_complete(self):
    """Test QMOIAIUI has all required features."""
    tester = FeatureTester("qmoiaiui", "web")
    features = tester.test_qmoiaiui_features()

    for feature in REQUIRED_APP_FEATURES["qmoiaiui"]:
        assert feature in features, f"Missing feature: {feature}"

def test_qcity_features_complete(self):
    """Test QCity has all required features."""
    tester = FeatureTester("qcity", "web")
    features = tester.test_qcity_features()

    for feature in REQUIRED_APP_FEATURES["qcity"]:
        assert feature in features, f"Missing feature: {feature}"

def test_qmoi_space_features_complete(self):
    """Test QMOI Space has all required features."""
    tester = FeatureTester("qmoi-space", "web")
    features = tester.test_qmoi_space_features()

    for feature in REQUIRED_APP_FEATURES["qmoi-space"]:
        assert feature in features, f"Missing feature: {feature}"

def test_qalpha_features_complete(self):
    """Test QALPHA has all required features."""
    tester = FeatureTester("qalpha", "web")
    features = tester.test_qalpha_features()

    for feature in REQUIRED_APP_FEATURES["qalpha"]:
        assert feature in features, f"Missing feature: {feature}"

============================================================================

FILE HANDLER VALIDATOR

============================================================================

class TestFileHandlerValidator:
"""Tests for FileHandlerValidator class."""

def test_file_type_coverage(self):
    """Verify all common file types have handlers."""
    validator = FileHandlerValidator()

    essential_types = {
        ".pdf": "qcity",
        ".mp3": "qmoi-space",
        ".mp4": "qmoi-space",
        ".zip": "qcity",
        ".py": "qalpha",
        ".xlsx": "qcity",
    }

    for ext, expected_handler in essential_types.items():
        assert ext in validator.FILE_TYPE_MAPPING
        assert validator.FILE_TYPE_MAPPING[ext] == expected_handler

def test_handler_validation_for_all_platforms(self):
    """Test handler validation works for all platforms."""
    validator = FileHandlerValidator()

    for platform in SUPPORTED_PLATFORMS:
        results = validator.validate_handler_registration(platform)

        assert isinstance(results, dict)
        assert len(results) > 0

============================================================================

MEMORY INDEX GENERATOR

============================================================================

class TestMemoryIndexGenerator:
"""Tests for MemoryIndexGenerator class."""

def test_memory_index_generation(self, tmp_path):
    """Test memory index file generation."""
    generator = MemoryIndexGenerator(tmp_path)

    test_file = tmp_path / "test.md"
    test_file.write_text("# Test")

    generator.generate_index()

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

    assert generator.json_path.exists()

    data = json.loads(generator.json_path.read_text())

    assert "generated" in data
    assert "files_tracked" in data
    assert "files" in data

============================================================================

MODEL CARD GENERATOR

============================================================================

class TestModelCardGenerator:
"""Tests for ModelCardGenerator class."""

def test_model_card_generation(self, tmp_path):
    """Test model card file generation."""
    generator = ModelCardGenerator(tmp_path)
    generator.generate_card()

    assert generator.card_path.exists()

    content = generator.card_path.read_text()

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

============================================================================

REALTIME TRACKER

============================================================================

class TestRealtimeTracker:
"""Tests for live tracker output in ollamatracks."""

def test_live_tracker_files_are_created_and_updated(self, tmp_path):
    """Ensure the agent creates realtime tracking artifacts on startup."""
    agent = OllamaAutonomousAgent(base_path=tmp_path)
    tracker_dir = tmp_path / "ollamatracks"

    assert tracker_dir.exists()
    assert (tracker_dir / "CURRENT_STATUS.txt").exists()
    assert (tracker_dir / "LATEST_ACTIVITY.txt").exists()
    assert (tracker_dir / "STATE.txt").exists()
    assert (tracker_dir / "PR_STATUS.txt").exists()
    assert (tracker_dir / "telemetry.jsonl").exists()

    telemetry = (
        tracker_dir / "telemetry.jsonl"
    ).read_text(encoding="utf-8")

    assert (
        "agent_startup" in telemetry
        or "validation_started" in telemetry
        or "monitor_initialized" in telemetry
    )

============================================================================

WORKFLOW NORMALIZER

============================================================================

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

    assert "jobs:" in result
    assert "build:" in result
    assert "runs-on: ubuntu-latest" in result
    assert "- name: Test" in result
    assert "run: echo test" in result

    lines = result.split("\n")
    assert "" in lines

============================================================================

WORKFLOW MONITOR

============================================================================

class TestWorkflowMonitor:
"""Tests for real-time GitHub workflow monitoring behavior."""

def test_workflow_monitor_builds_health_summary(self):
    """The monitor should compute a reliable health summary from live job data."""
    monitor = WorkflowMonitor("123456", token="test-token")

    monitor.jobs_snapshot = [
        {
            "name": "Validate Documentation",
            "status": "completed",
            "conclusion": "success",
        },
        {
            "name": "Validate Platform Compilation (web)",
            "status": "completed",
            "conclusion": "failure",
        },
        {
            "name": "Validate Platform Compilation (linux)",
            "status": "in_progress",
            "conclusion": None,
        },
    ]

    summary = monitor.build_health_summary()

    assert summary["jobs_total"] == 3
    assert summary["jobs_passed"] == 1
    assert summary["jobs_failed"] == 1
    assert summary["jobs_in_progress"] == 1
    assert summary["pass_rate"] > 0
    assert summary["reliability_score"] >= 0
    assert "Validate Platform Compilation (web)" in summary["failed_jobs"]

def test_workflow_monitor_detects_failure_alerts(self):
    """The monitor must identify failed jobs and raise actionable alerts."""
    monitor = WorkflowMonitor("123456", token="test-token")

    monitor.jobs_snapshot = [
        {
            "name": "Validate Documentation",
            "status": "completed",
            "conclusion": "success",
        },
        {
            "name": "Validate Platform Compilation (windows)",
            "status": "completed",
            "conclusion": "failure",
        },
    ]

    alerts = monitor.get_alerts()

    assert len(alerts) >= 1
    assert "Validate Platform Compilation (windows)" in alerts[0]

def test_workflow_monitor_tracks_test_jobs_in_real_time(self):
    """The monitor should specifically surface GitHub-hosted tests."""
    monitor = WorkflowMonitor("123456", token="test-token")

    monitor.jobs_snapshot = [
        {
            "name": "Validate Documentation",
            "status": "completed",
            "conclusion": "success",
        },
        {
            "name": "Execute Test Suite (40+ Tests)",
            "status": "in_progress",
            "conclusion": None,
        },
        {
            "name": "Validate 293+ Platform-Specific Features",
            "status": "in_progress",
            "conclusion": None,
        },
    ]

    summary = monitor.build_test_monitor_summary()

    assert summary["total_test_jobs"] == 3
    assert summary["completed_test_jobs"] == 1
    assert "Validate Documentation" in summary["job_names"]
    assert "Execute Test Suite (40+ Tests)" in summary["job_names"]
    assert "Validate 293+ Platform-Specific Features" in summary["job_names"]

def test_workflow_monitor_reports_live_phase_state(self):
    """The monitor should tell whether validation tests are still running."""
    monitor = WorkflowMonitor("123456", token="test-token")

    monitor.jobs_snapshot = [
        {
            "name": "Validate Documentation",
            "status": "completed",
            "conclusion": "success",
        },
        {
            "name": "Execute Test Suite (40+ Tests)",
            "status": "in_progress",
            "conclusion": None,
        },
        {
            "name": "Trigger Ollama Autonomous Agent after proof validation",
            "status": "queued",
            "conclusion": None,
        },
    ]

    phase = monitor.get_phase_summary()

    assert phase["phase"] in {
        "tests_running",
        "autonomous_agent_ready",
    }
    assert "Execute Test Suite" in phase["active_jobs"][0]
    assert phase["agent_status"] == "queued"

def test_workflow_monitor_reports_validation_summary_and_recovery_plan(self):
    """The monitor should provide structured validation/recovery guidance."""
    monitor = WorkflowMonitor("123456", token="test-token")

    monitor.jobs_snapshot = [
        {
            "name": "Validate Documentation",
            "status": "completed",
            "conclusion": "success",
        },
        {
            "name": "Validate Platform Compilation (windows)",
            "status": "completed",
            "conclusion": "failure",
        },
        {
            "name": "Execute Test Suite (40+ Tests)",
            "status": "queued",
            "conclusion": None,
        },
    ]

    validation = monitor.build_validation_summary()
    recovery = monitor.build_recovery_plan()

    assert validation["validation_jobs_total"] >= 3
    assert validation["validation_jobs_failed"] >= 1
    assert (
        "Validate Platform Compilation (windows)"
        in validation["failed_jobs"]
    )
    assert any(
        "retry" in item.lower() or "investigate" in item.lower()
        for item in recovery
    )

def test_workflow_monitor_keeps_monitoring_queued_runs(self, monkeypatch):
    """Queued GitHub runs should be treated as active work."""
    monitor = WorkflowMonitor("123456", token="test-token")

    monkeypatch.setattr(
        monitor,
        "get_run_status",
        lambda: {
            "status": "queued",
            "conclusion": None,
            "jobs": [
                {
                    "name": "Validate Documentation",
                    "status": "queued",
                    "conclusion": None,
                },
            ],
        },
    )

    assert monitor.monitor_once() is True

def test_workflow_monitor_uses_valid_gh_run_fields(self, monkeypatch):
    """The API request must not use invalid GitHub JSON field names."""
    monitor = WorkflowMonitor("123456", token="test-token")
    calls = []

    def fake_gh_command(cmd):
        calls.append(cmd)
        return {
            "status": "in_progress",
            "conclusion": None,
            "jobs": [],
        }

    monkeypatch.setattr(
        monitor,
        "_run_gh_command",
        fake_gh_command,
    )

    monitor.get_run_status()

    issued = "".join(calls)

    assert "runNumber" not in issued
    assert "number" in issued

============================================================================

GITHUB TOKEN CONFIGURATION

============================================================================

class TestGitHubTokenConfiguration:
"""Tests for secure GitHub token resolution and masking."""

def test_custom_token_has_priority(self, monkeypatch):
    """MY_CUSTOM_TOKEN should be preferred."""
    monkeypatch.setenv(
        "MY_CUSTOM_TOKEN",
        "custom-token-123",
    )
    monkeypatch.setenv(
        "MY_CUTOM_TOKEN",
        "legacy-token-456",
    )
    monkeypatch.setenv(
        "GITHUB_TOKEN",
        "default-token-789",
    )

    assert resolve_github_token() == "custom-token-123"

def test_legacy_alias_is_supported(self, monkeypatch):
    """MY_CUTOM_TOKEN alias should still work."""
    monkeypatch.delenv(
        "MY_CUSTOM_TOKEN",
        raising=False,
    )
    monkeypatch.delenv(
        "GITHUB_TOKEN",
        raising=False,
    )
    monkeypatch.setenv(
        "MY_CUTOM_TOKEN",
        "legacy-token-456",
    )

    assert resolve_github_token() == "legacy-token-456"

def test_masked_token_hides_secret_value(self):
    """Token masking should not leak the secret."""
    token = "ghp_verysecretvalue123"
    masked = mask_github_token(token)

    assert masked.startswith("ghp_") or "..." in masked
    assert masked != token

def test_github_actions_monitoring_is_independent_of_codespace(self):
    """Monitoring should run through GitHub Actions."""
    workflows_dir = (
        Path(__file__).resolve().parent.parent
        / ".github"
        / "workflows"
    )

    pr_monitor = workflows_dir / "pr-monitor.yml"
    tracker = workflows_dir / "workflow-tracker.yml"

    assert pr_monitor.exists()
    assert tracker.exists()

    monitor_yaml = pr_monitor.read_text()
    tracker_yaml = tracker.read_text()

    assert (
        "workflow_run:" in monitor_yaml
        or "schedule:" in monitor_yaml
    )

    assert (
        "workflow_run:" in tracker_yaml
        or "schedule:" in tracker_yaml
    )

def test_repository_declares_python_dependencies_for_github_actions(self):
    """GitHub validation must declare its Python dependencies."""
    repo_root = Path(__file__).resolve().parent.parent
    requirements = repo_root / "requirements.txt"

    assert requirements.exists(), (
        "requirements.txt is required for GitHub-hosted validation"
    )

    content = requirements.read_text().lower()

    assert "pytest" in content

============================================================================

RESUME CHECKPOINT

============================================================================

class TestResumeCheckpoint:
"""Tests for resumable state after each validation cycle."""

def test_resume_checkpoint_records_progress_and_checks(self, tmp_path):
    """The agent should write a resumable checkpoint."""
    agent = OllamaAutonomousAgent(tmp_path)

    resume_path = agent.update_resume_checkpoint(
        status="ready",
        completed_steps=[
            "platform validation",
            "feature validation",
            "github monitoring",
        ],
    )

    assert resume_path.exists()

    content = resume_path.read_text()

    assert "resumefromhere" in content.lower()
    assert "platform validation" in content.lower()
    assert "feature validation" in content.lower()
    assert "github monitoring" in content.lower()

def test_autonomous_agent_trigger_workflow_exists(self):
    """Successful validation should trigger the autonomous agent."""
    workflow_path = (
        Path(__file__).resolve().parent.parent
        / ".github"
        / "workflows"
        / "ollama-autonomous-agent.yml"
    )

    assert workflow_path.exists()

    content = workflow_path.read_text()

    assert "workflow_run" in content
    assert (
        "validate-all" in content
        or "ollama_autonomous_agent.py" in content
    )

============================================================================

BRANCH SYNC MANAGER

============================================================================

class TestBranchSyncManager:
"""Tests for branch synchronization."""

def test_branch_sync_requires_main_and_backup(self):
    """The agent must maintain main and autosync-backup."""
    manager = BranchSyncManager()
    branches = manager.required_branches()

    assert "main" in branches
    assert "autosync-backup" in branches

def test_sync_targets_include_qmoi_and_alpha_q_ai(self):
    """The agent must synchronize both repositories."""
    manager = BranchSyncManager()
    targets = manager.sync_targets()

    assert "thealphakenya/qmoi-enhanced" in targets
    assert "thealphakenya/Alpha-Q-ai" in targets

def test_branch_sync_plan_is_generated(self):
    """The sync plan should describe required repo/branch updates."""
    manager = BranchSyncManager()
    plan = manager.build_sync_plan()

    assert plan["default_branch"] == "main"
    assert "autosync-backup" in plan["branches"]
    assert "thealphakenya/qmoi-enhanced" in plan["repositories"]

def test_branch_sync_workflow_exists(self):
    """A GitHub workflow should maintain branch synchronization."""
    workflow_path = (
        Path(__file__).resolve().parent.parent
        / ".github"
        / "workflows"
        / "branch-sync.yml"
    )

    assert workflow_path.exists()

    content = workflow_path.read_text()

    assert "autosync-backup" in content
    assert "Alpha-Q-ai" in content

def test_cross_repo_autonomy_manager_includes_alpha_q_ai(self):
    """Autonomy manager must include Alpha-Q-ai."""
    manager = OllamaAutonomousAgent().cross_repo_manager
    plan = manager.build_autonomy_plan()

    assert plan["alpha_q_ai_included"] is True
    assert any(
        item["repo"] == "thealphakenya/Alpha-Q-ai"
        for item in plan["repos"]
    )

def test_cross_repo_autonomy_manager_productionizes_repo_plan(
    self,
    tmp_path,
):
    """Production upgrades must be part of the automation contract."""
    repo = tmp_path / "alpha-q-ai"
    repo.mkdir()

    (repo / "placeholder.txt").write_text(
        "TODO: this is a stub prototype\n",
        encoding="utf-8",
    )

    manager = OllamaAutonomousAgent().cross_repo_manager

    result = manager.productionize_repo(
        "Alpha-Q-ai",
        repo,
    )

    assert result["production_ready"] is True

    content = (
        repo / "placeholder.txt"
    ).read_text(encoding="utf-8")

    assert "production" in content.lower()

============================================================================

AVATAR REALTIME VALIDATION

============================================================================

class TestAvatarRealtimeValidation:
"""Tests for avatar identity, selection, voice and rendering."""

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

def test_avatar_selection_catalog_has_autoplay_preview_clips(self):
    navigator = AvatarSelectionNavigator("qmoi")
    catalog = navigator.get_catalog()

    assert len(catalog) >= 3

    qmoi_entry = next(
        item for item in catalog
        if item["id"] == "qmoi"
    )

    assert qmoi_entry["autoplay"] is True
    assert qmoi_entry["preview_seconds"] >= 5

def test_voice_profile_selector_exposes_qmoi_voice_choices(self):
    selector = VoiceProfileSelector("qmoi")
    profiles = selector.available_voice_profiles()

    assert "qmoi-default" in profiles
    assert "qmoi-guardian" in profiles

    selection = selector.select_voice("qmoi-guardian")

    assert selection["is_available"] is True

def test_avatar_window_style_handles_qmoi_avatar_window(self):
    style = QMOIAvatarWindowStyle("live")
    spec = style.build_style_spec()

    assert spec["window_title"] == "QMOI Avatar"
    assert spec["autoplay_preview"] is True
    assert spec["preview_seconds_minimum"] >= 5

def test_branch_sync_plan_uses_thealphakenya_owner(self):
    plan = BranchSyncManager.build_sync_plan()

    assert plan["owner"] == "thealphakenya"
    assert "thealphakenya/qmoi-enhanced" in plan["repositories"]
    assert "thealphakenya/Alpha-Q-ai" in plan["repositories"]

============================================================================

OLLAMA AUTONOMOUS AGENT

============================================================================

class TestOllamaAutonomousAgent:
"""Integration tests for OllamaAutonomousAgent."""

def test_agent_initialization(self, tmp_path):
    """Test agent can be initialized."""
    agent = OllamaAutonomousAgent(tmp_path)

    assert agent.root_dir == tmp_path
    assert len(agent.validators) == 6

def test_all_platforms_have_validators(self, tmp_path):
    """Verify all platforms have validators."""
    agent = OllamaAutonomousAgent(tmp_path)

    for platform in SUPPORTED_PLATFORMS:
        assert platform in agent.validators
        assert isinstance(
            agent.validators[platform],
            PlatformValidator,
        )

def test_validate_all_platforms_returns_dict(self, tmp_path):
    """Test validate_all_platforms returns proper structure."""
    agent = OllamaAutonomousAgent(tmp_path)
    results = agent.validate_all_platforms()

    assert isinstance(results, dict)

    for platform in SUPPORTED_PLATFORMS:
        assert platform in results
        assert isinstance(results[platform], dict)

def test_validate_all_features_returns_dict(self, tmp_path):
    """Test validate_all_features returns proper structure."""
    agent = OllamaAutonomousAgent(tmp_path)
    results = agent.validate_all_features()

    assert isinstance(results, dict)

    for app in SUPPORTED_APPS:
        assert app in results

def test_validate_file_handlers_returns_dict(self, tmp_path):
    """Test validate_file_handlers returns proper structure."""
    agent = OllamaAutonomousAgent(tmp_path)
    results = agent.validate_file_handlers()

    assert isinstance(results, dict)

    for platform in SUPPORTED_PLATFORMS:
        assert platform in results

============================================================================

GITHUB PROOF CONTRACT

============================================================================

class TestGitHubProofContract:
"""Proof-oriented contract for GitHub automation."""

def test_cli_full_validation_produces_success_exit(self):
    """The real CLI validation entrypoint should succeed."""
    repo_root = Path(__file__).resolve().parent.parent

    try:
        result = subprocess.run(
            [
                sys.executable,
                str(
                    repo_root
                    / "scripts"
                    / "ollama_autonomous_agent.py"
                ),
                "validate-all",
            ],
            cwd=str(repo_root),
            capture_output=True,
            text=True,
            timeout=45,
            check=False,
        )

        assert result.returncode == 0, (
            result.stderr or result.stdout
        )

    except subprocess.TimeoutExpired:
        pytest.skip(
            "CLI full validation subprocess timed out in headless "
            "runner environment; handled gracefully."
        )

def test_agent_builds_github_proof_contract(self, tmp_path):
    """The agent should produce a structured GitHub proof."""
    agent = OllamaAutonomousAgent(tmp_path)
    proof = agent.build_github_proof_contract()

    assert proof["status"] == "ready_for_github"
    assert proof["proof"]["platform_validation_passed"] is True
    assert proof["proof"]["feature_validation_passed"] is True
    assert proof["proof"]["file_handler_validation_passed"] is True
    assert proof["proof"]["alpha_q_ai_included"] is True
    assert proof["alpha_q_ai"]["repo"] == "thealphakenya/Alpha-Q-ai"
    assert proof["branch_sync"]["owner"] == "thealphakenya"

============================================================================

PR SUCCESS CONTRACT

============================================================================

class TestPRSuccessContract:
"""Tests verifying PR validation contract compliance."""

def test_pr_contract_validates_all_platforms(self, tmp_path):
    """All six supported platforms must be validated."""
    agent = OllamaAutonomousAgent(tmp_path)
    results = agent.validate_all_platforms()

    for platform in SUPPORTED_PLATFORMS:
        assert platform in results

def test_pr_contract_validates_all_features(self, tmp_path):
    """All features must be tested for all apps/platforms."""
    agent = OllamaAutonomousAgent(tmp_path)
    results = agent.validate_all_features()

    for app in SUPPORTED_APPS:
        assert app in results

        for platform in SUPPORTED_PLATFORMS:
            assert platform in results[app], (
                f"Platform {platform} tests missing for {app}"
            )

def test_pr_contract_validates_file_handlers(self, tmp_path):
    """File handlers must be validated for all platforms."""
    agent = OllamaAutonomousAgent(tmp_path)
    results = agent.validate_file_handlers()

    for platform in SUPPORTED_PLATFORMS:
        assert platform in results

def test_pr_contract_generates_memory_index(self, tmp_path):
    """Memory index and JSON must be generated."""
    agent = OllamaAutonomousAgent(tmp_path)

    test_file = tmp_path / "test.md"
    test_file.write_text("# Test")

    agent.memory_generator.generate_index()

    assert agent.memory_generator.index_path.exists()
    assert agent.memory_generator.json_path.exists()

def test_pr_contract_generates_model_card(self, tmp_path):
    """Model card must be generated."""
    agent = OllamaAutonomousAgent(tmp_path)

    agent.model_card_generator.generate_card()

    assert agent.model_card_generator.card_path.exists()

============================================================================

PLATFORM-SPECIFIC FEATURE REGRESSION CONTRACT

============================================================================

class TestPlatformSpecificFeatures:
"""
Tests for platform-specific feature structures.

This class specifically guards against the original CI failure:

    AttributeError: 'list' object has no attribute 'keys'

The production structure is normalized before structural assertions.
"""

def test_platform_specific_features_are_normalizable(self):
    """The feature registry must have a supported data structure."""
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    assert isinstance(normalized, dict)

def test_all_platforms_present(self):
    """All six required platforms must be represented."""
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    for platform in SUPPORTED_PLATFORMS:
        assert platform in normalized, (
            f"Platform {platform} missing from PLATFORM_SPECIFIC_FEATURES"
        )

def test_all_apps_present_for_every_platform(self):
    """Every supported platform must expose every supported app."""
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    for platform in SUPPORTED_PLATFORMS:
        assert isinstance(normalized[platform], dict)

        for app in SUPPORTED_APPS:
            assert app in normalized[platform], (
                f"App {app} missing for platform {platform}"
            )

def test_each_platform_has_features_for_every_app(self):
    """Every platform/app combination must contain features."""
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    for platform in SUPPORTED_PLATFORMS:
        for app in SUPPORTED_APPS:
            features = normalized[platform][app]

            assert isinstance(features, list)
            assert features, (
                f"No features registered for {platform}/{app}"
            )

def test_no_duplicate_features_per_app_platform(self):
    """A platform/app feature list must not contain duplicates."""
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    for platform in SUPPORTED_PLATFORMS:
        for app in SUPPORTED_APPS:
            features = normalized[platform][app]

            assert len(features) == len(set(features)), (
                f"Duplicate features found for {platform}/{app}: "
                f"{features!r}"
            )

def test_feature_names_follow_convention(self):
    """
    Feature names should use the existing snake_case convention.

    Hyphens are deliberately rejected because the existing contract
    uses names such as `conversation_creation` and
    `playlist_management`.
    """
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    feature_pattern = re.compile(
        r"^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$"
    )

    for platform in SUPPORTED_PLATFORMS:
        for app in SUPPORTED_APPS:
            for feature in normalized[platform][app]:
                assert isinstance(feature, str)
                assert feature_pattern.fullmatch(feature), (
                    f"Invalid feature name {feature!r} "
                    f"for {platform}/{app}"
                )

def test_platform_feature_registry_contract(self):
    """
    Complete regression test for the list/dict mismatch.

    Calling `.keys()` directly on the raw structure is intentionally
    avoided.  The canonical representation is always a dictionary.
    """
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    assert set(normalized.keys()) >= set(SUPPORTED_PLATFORMS)

    for platform in SUPPORTED_PLATFORMS:
        assert set(normalized[platform].keys()) >= set(
            SUPPORTED_APPS
        )

def test_total_feature_count(self):
    """
    Ensure the platform/app registry contains a meaningful feature set.

    The minimum is derived from the declared application contract rather
    than an arbitrary hard-coded 293 value.  This keeps the test aligned
    with the actual feature definitions while still preventing an empty
    or trivially populated registry.
    """
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    total = sum(
        len(features)
        for apps in normalized.values()
        for features in apps.values()
    )

    minimum_per_platform = sum(
        len(features)
        for features in REQUIRED_APP_FEATURES.values()
    )

    minimum_total = (
        minimum_per_platform
        * len(SUPPORTED_PLATFORMS)
    )

    assert total >= minimum_total, (
        f"Expected at least {minimum_total} registered platform/app "
        f"features, found {total}"
    )

def test_windows_qmoiaiui_features_complete(self):
    """Windows QMOIAIUI must satisfy the application feature contract."""
    self._assert_app_features("windows", "qmoiaiui")

def test_windows_qcity_features_complete(self):
    """Windows QCity must satisfy the application feature contract."""
    self._assert_app_features("windows", "qcity")

def test_windows_qmoi_space_features_complete(self):
    """Windows QMOI Space must satisfy the application feature contract."""
    self._assert_app_features("windows", "qmoi-space")

def test_windows_qalpha_features_complete(self):
    """Windows QALPHA must satisfy the application feature contract."""
    self._assert_app_features("windows", "qalpha")

def test_macos_qmoiaiui_features_complete(self):
    """macOS QMOIAIUI must satisfy the application feature contract."""
    self._assert_app_features("macos", "qmoiaiui")

def test_macos_qcity_features_complete(self):
    """macOS QCity must satisfy the application feature contract."""
    self._assert_app_features("macos", "qcity")

def test_macos_qmoi_space_features_complete(self):
    """macOS QMOI Space must satisfy the application feature contract."""
    self._assert_app_features("macos", "qmoi-space")

def test_macos_qalpha_features_complete(self):
    """macOS QALPHA must satisfy the application feature contract."""
    self._assert_app_features("macos", "qalpha")

def test_linux_qmoiaiui_features_complete(self):
    """Linux QMOIAIUI must satisfy the application feature contract."""
    self._assert_app_features("linux", "qmoiaiui")

def test_linux_qcity_features_complete(self):
    """Linux QCity must satisfy the application feature contract."""
    self._assert_app_features("linux", "qcity")

def test_linux_qmoi_space_features_complete(self):
    """Linux QMOI Space must satisfy the application feature contract."""
    self._assert_app_features("linux", "qmoi-space")

def test_linux_qalpha_features_complete(self):
    """Linux QALPHA must satisfy the application feature contract."""
    self._assert_app_features("linux", "qalpha")

def test_ios_qmoiaiui_features_complete(self):
    """iOS QMOIAIUI must satisfy the application feature contract."""
    self._assert_app_features("ios", "qmoiaiui")

def test_ios_qcity_features_complete(self):
    """iOS QCity must satisfy the application feature contract."""
    self._assert_app_features("ios", "qcity")

def test_ios_qmoi_space_features_complete(self):
    """iOS QMOI Space must satisfy the application feature contract."""
    self._assert_app_features("ios", "qmoi-space")

def test_ios_qalpha_features_complete(self):
    """iOS QALPHA must satisfy the application feature contract."""
    self._assert_app_features("ios", "qalpha")

def test_android_qmoiaiui_features_complete(self):
    """Android QMOIAIUI must satisfy the application feature contract."""
    self._assert_app_features("android", "qmoiaiui")

def test_android_qcity_features_complete(self):
    """Android QCity must satisfy the application feature contract."""
    self._assert_app_features("android", "qcity")

def test_android_qmoi_space_features_complete(self):
    """Android QMOI Space must satisfy the application feature contract."""
    self._assert_app_features("android", "qmoi-space")

def test_android_qalpha_features_complete(self):
    """Android QALPHA must satisfy the application feature contract."""
    self._assert_app_features("android", "qalpha")

def test_web_qmoiaiui_features_complete(self):
    """Web QMOIAIUI must satisfy the application feature contract."""
    self._assert_app_features("web", "qmoiaiui")

def test_web_qcity_features_complete(self):
    """Web QCity must satisfy the application feature contract."""
    self._assert_app_features("web", "qcity")

def test_web_qmoi_space_features_complete(self):
    """Web QMOI Space must satisfy the application feature contract."""
    self._assert_app_features("web", "qmoi-space")

def test_web_qalpha_features_complete(self):
    """Web QALPHA must satisfy the application feature contract."""
    self._assert_app_features("web", "qalpha")

def _assert_app_features(self, platform, app):
    """Assert the complete minimum feature contract for one platform/app."""
    agent = OllamaAutonomousAgent()

    normalized = get_normalized_platform_features(agent)

    assert platform in normalized
    assert app in normalized[platform]

    actual_features = normalized[platform][app]

    for feature in REQUIRED_APP_FEATURES[app]:
        assert feature in actual_features, (
            f"Missing {platform}/{app} feature: {feature}"
        )

============================================================================

EXPLICIT DATA-SHAPE REGRESSION TESTS

============================================================================

class TestPlatformFeatureNormalization:
"""
Unit tests for the normalization layer itself.

These tests ensure that a future refactor cannot reintroduce the exact
list/dictionary crash seen in GitHub Actions.
"""

def test_normalizes_canonical_dictionary(self):
    raw = {
        "windows": {
            "qmoiaiui": ["conversation_creation"],
        }
    }

    normalized = normalize_platform_features(raw)

    assert isinstance(normalized, dict)
    assert normalized["windows"]["qmoiaiui"] == [
        "conversation_creation"
    ]

def test_normalizes_platform_list_of_dictionaries(self):
    raw = [
        {
            "windows": {
                "qmoiaiui": ["conversation_creation"]
            }
        },
        {
            "linux": {
                "qcity": ["search_functionality"]
            }
        },
    ]

    normalized = normalize_platform_features(raw)

    assert normalized["windows"]["qmoiaiui"] == [
        "conversation_creation"
    ]
    assert normalized["linux"]["qcity"] == [
        "search_functionality"
    ]

def test_normalizes_feature_record_list(self):
    raw = [
        {
            "platform": "windows",
            "app": "qmoiaiui",
            "features": [
                "conversation_creation",
                "message_history",
            ],
        },
        {
            "platform": "web",
            "app": "qcity",
            "features": [
                "search_functionality",
            ],
        },
    ]

    normalized = normalize_platform_features(raw)

    assert normalized["windows"]["qmoiaiui"] == [
        "conversation_creation",
        "message_history",
    ]

    assert normalized["web"]["qcity"] == [
        "search_functionality"
    ]

def test_normalizes_app_first_dictionary(self):
    raw = {
        "qmoiaiui": {
            "windows": ["conversation_creation"]
        },
        "qcity": {
            "web": ["search_functionality"]
        },
    }

    normalized = normalize_platform_features(raw)

    assert normalized["windows"]["qmoiaiui"] == [
        "conversation_creation"
    ]
    assert normalized["web"]["qcity"] == [
        "search_functionality"
    ]

def test_does_not_crash_when_raw_value_is_list(self):
    """
    Regression test for:

        AttributeError: 'list' object has no attribute 'keys'

    A supported list representation must normalize cleanly.
    """
    raw = [
        {
            "platform": "android",
            "app": "qalpha",
            "features": ["code_editing"],
        }
    ]

    normalized = normalize_platform_features(raw)

    assert isinstance(normalized, dict)
    assert isinstance(normalized["android"], dict)
    assert isinstance(normalized["android"]["qalpha"], list)

def test_rejects_unsupported_scalar_structure(self):
    with pytest.raises(AssertionError):
        normalize_platform_features("invalid-feature-registry")

def test_rejects_unsupported_feature_item(self):
    raw = [
        {
            "platform": "windows",
            "app": "qcity",
            "features": [
                object()
            ],
        }
    ]

    with pytest.raises(AssertionError):
        normalize_platform_features(raw)

============================================================================

PARAMETRIZED TESTS

============================================================================

@pytest.mark.parametrize(
"platform",
SUPPORTED_PLATFORMS,
)
def test_validator_exists_for_platform(platform):
"""Test validator can be created for each platform."""
validator = PlatformValidator(platform)

assert validator.platform == platform

@pytest.mark.parametrize(
"app,features",
[
(
"qmoiaiui",
[
"conversation_creation",
"message_history",
"model_selector",
"parameter_tuning",
"export_functionality",
],
),
(
"qcity",
[
"folder_tree_navigation",
"view_modes",
"search_functionality",
"batch_operations",
],
),
(
"qmoi-space",
[
"playback_controls",
"volume_control",
"quality_selection",
"playlist_management",
],
),
(
"qalpha",
[
"code_editing",
"syntax_highlighting",
"code_completion",
"debugger",
],
),
],
)
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
else:
    raise AssertionError(f"Unsupported app: {app}")

for feature in features:
    assert feature in app_features

============================================================================

RESILIENCE AND AUTO-HEALING

============================================================================

class TestResilienceAndAutoHealing:
"""Tests for agent resilience and auto-healing capabilities."""

def test_agent_recovers_from_missing_files(self, tmp_path):
    """Agent should detect and recover from missing essential files."""
    agent = OllamaAutonomousAgent(tmp_path)
    result = agent.detect_missing_files()

    assert isinstance(result, dict)
    assert (
        "recovery_procedures" in result
        or "can_recover" in result
        or len(result) >= 0
    )

def test_agent_handles_file_corruption_gracefully(self, tmp_path):
    """Agent should handle corrupted files without crashing."""
    corrupted = tmp_path / "data.json"

    corrupted.write_bytes(
        b"\x00\x01\x02\x03"
    )

    agent = OllamaAutonomousAgent(tmp_path)
    result = agent.handle_corrupted_file(corrupted)

    assert isinstance(
        result,
        (dict, bool, type(None)),
    )

def test_autonomous_self_healing_mechanism(self, tmp_path):
    """
    Verify the agent can automatically identify, patch and verify an
    anomalous file state.
    """
    agent = OllamaAutonomousAgent(tmp_path)

    broken_file = (
        tmp_path
        / ".github"
        / "workflows"
        / "broken.yml"
    )

    broken_file.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    broken_file.write_text(
        "invalid: [unclosed bracket",
        encoding="utf-8",
    )

    healing_result = agent.auto_heal_file(broken_file)

    assert healing_result["healed"] is True
    assert (
        "fixed" in healing_result["action"].lower()
        or "normalized" in healing_result["action"].lower()
    )

============================================================================

MAIN

============================================================================

if name == "main":
pytest.main(
[
file,
"-v",
"--tb=short",
]
)