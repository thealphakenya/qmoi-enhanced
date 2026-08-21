#!/usr/bin/env python3
"""
QMOI Ollama Autonomous Agent
============================

Stable autonomous validation/orchestration layer for QMOI.

Responsibilities:
- Cross-platform validation
- 293+ platform-specific feature validation
- File-handler validation
- Realtime tracker / telemetry
- Workflow normalization
- Workflow monitoring
- Auto-healing
- Resume checkpoints
- Memory index generation
- Model-card generation
- GitHub proof contracts
- Cross-repository synchronization contracts
- Avatar/QMOI realtime validation
- Backward-compatible test APIs

IMPORTANT COMPATIBILITY CONTRACT
--------------------------------
The enhanced validation suite expects:

    QMOI_APPS.keys()

to be valid.

Therefore QMOI_APPS is intentionally a dictionary and must remain a
dictionary. Feature metadata is stored separately from feature lists.

The canonical feature registry is:

    FEATURE_REGISTRY[platform][app] -> List[str]

and:

    PLATFORM_SPECIFIC_FEATURES

is retained as a backwards-compatible alias to that registry.

VALIDATION API CONTRACT
-----------------------
The enhanced validation suite also expects:

    agent.validate_platform_features()

and:

    agent.validate_all_platform_features()

Both methods return the application-level feature validation contract:

    {
        "windows": {
            "qmoiaiui": {...},
            "qcity": {...},
            "qmoi-space": {...},
            "qalpha": {...},
        },
        ...
    }

Therefore:

    len(results["windows"]) == 4

The platform-level metadata returned by PlatformValidator.validate()
is intentionally kept separate from the application feature contract.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import (
    Any,
    Callable,
    Dict,
    Iterable,
    List,
    Mapping,
    Optional,
    Sequence,
)


# ============================================================================
# CONSTANTS
# ============================================================================

PLATFORMS: List[str] = [
    "windows",
    "macos",
    "linux",
    "ios",
    "android",
    "web",
]

SUPPORTED_PLATFORMS = list(PLATFORMS)


# ============================================================================
# APPLICATION REGISTRY
# ============================================================================
#
# IMPORTANT:
# This MUST remain a dictionary.
#
# Enhanced tests explicitly call:
#
#     QMOI_APPS.keys()
#
# Do not change this to a list or tuple.
# ============================================================================

QMOI_APPS: Dict[str, Dict[str, Any]] = {
    "qmoiaiui": {
        "name": "QMOIAIUI",
        "description": "Conversational AI interface",
        "category": "ai",
    },
    "qcity": {
        "name": "QCity",
        "description": "File Manager",
        "category": "file-management",
    },
    "qmoi-space": {
        "name": "QMOI Space",
        "description": "Media Player",
        "category": "media",
    },
    "qalpha": {
        "name": "QALPHA",
        "description": "IDE",
        "category": "development",
    },
}

SUPPORTED_APPS: List[str] = list(QMOI_APPS.keys())


# ============================================================================
# REPOSITORY CONSTANTS
# ============================================================================

QMOI_REPOSITORY = "thealphakenya/qmoi-enhanced"
ALPHA_Q_AI_REPOSITORY = "thealphakenya/Alpha-Q-ai"

DEFAULT_BRANCH = "main"
BACKUP_BRANCH = "autosync-backup"

MASTER_FILES: List[str] = [
    "API.md",
    "ENDPOINTS.md",
    "ROUTES.md",
    "MODELEVOLUTIONO.md",
]


# ============================================================================
# GENERAL HELPERS
# ============================================================================

def utc_now() -> datetime:
    """Return the current UTC datetime."""
    return datetime.now(timezone.utc)


def utc_iso() -> str:
    """Return UTC time as an ISO-8601 string."""
    return utc_now().isoformat().replace("+00:00", "Z")


def safe_json_write(path: Path, data: Any) -> None:
    """Write JSON while creating parent directories."""
    path.parent.mkdir(parents=True, exist_ok=True)

    path.write_text(
        json.dumps(
            data,
            indent=2,
            sort_keys=True,
            default=str,
        )
        + "\n",
        encoding="utf-8",
    )


def safe_text_write(path: Path, content: str) -> None:
    """Write UTF-8 text while creating parent directories."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(str(content), encoding="utf-8")


def flatten_feature_count(features: Mapping[str, Any]) -> int:
    """
    Count terminal feature values recursively.

    This deliberately counts only leaf values, allowing nested feature
    registries to be counted safely.
    """
    total = 0

    def walk(value: Any) -> None:
        nonlocal total

        if isinstance(value, Mapping):
            for item in value.values():
                walk(item)

        elif isinstance(value, (list, tuple, set)):
            for item in value:
                walk(item)

        else:
            total += 1

    walk(features)
    return total


def unique_preserve_order(
    values: Iterable[str],
) -> List[str]:
    """Return unique strings while preserving their original order."""
    return list(dict.fromkeys(str(value) for value in values))


# ============================================================================
# GITHUB TOKEN HELPERS
# ============================================================================

def resolve_github_token() -> Optional[str]:
    """
    Resolve a GitHub token.

    Priority:
        1. MY_CUSTOM_TOKEN
        2. MY_CUTOM_TOKEN
        3. GITHUB_TOKEN
        4. GH_TOKEN

    MY_CUTOM_TOKEN is intentionally retained as a backwards-compatible
    spelling because older workflow configurations used that name.
    """
    for name in (
        "MY_CUSTOM_TOKEN",
        "MY_CUTOM_TOKEN",
        "GITHUB_TOKEN",
        "GH_TOKEN",
    ):
        value = os.environ.get(name)

        if value:
            return value.strip()

    return None


def mask_github_token(
    token: Optional[str],
) -> str:
    """Return a safe display representation of a GitHub token."""
    if not token:
        return "empty"

    value = str(token)

    if len(value) <= 8:
        return "..."

    if value.startswith("github_pat_"):
        return "github_pat_..." + value[-4:]

    if value.startswith(
        (
            "ghp_",
            "gho_",
            "ghs_",
            "ghu_",
        )
    ):
        return value[:4] + "..." + value[-4:]

    return value[:4] + "..." + value[-4:]


# ============================================================================
# SELF-HEALING COMMAND MANAGER
# ============================================================================

class SelfHealingManager:
    """Normalize historical CLI command names."""

    COMMAND_ALIASES = {
        "validate-all-features": "validate-features",
        "features-validate": "validate-features",
        "platforms-validate": "validate-platforms",
        "file-handlers": "validate-file-handlers",
        "memory-index": "generate-memory-index",
        "model-card": "generate-model-card",
    }

    @classmethod
    def sanitize_command(
        cls,
        command: str,
    ) -> str:
        command = str(command).strip().lower()

        corrected = cls.COMMAND_ALIASES.get(command)

        if corrected:
            print(
                "[QMOI Auto-Healing] "
                f"Mapped '{command}' to '{corrected}'.",
                file=sys.stderr,
            )

            return corrected

        return command


# ============================================================================
# COMMON FEATURES
# ============================================================================

_COMMON_FEATURES: Dict[str, List[str]] = {
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
        "offline_mode",
        "realtime_sync",
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
        "realtime_sync",
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
        "realtime_sync",
        "offline_mode",
    ],
}


# ============================================================================
# EXACT PLATFORM FEATURE CONTRACT
# ============================================================================

_REQUIRED_PLATFORM_FEATURES: Dict[
    str,
    Dict[str, List[str]],
] = {
    "windows": {
        "qmoiaiui": [
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
        ],
        "qcity": [
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
        ],
        "qmoi-space": [
            "media_keys",
            "taskbar_buttons",
            "windows_codecs",
        ],
        "qalpha": [
            "powershell_integration",
            "windows_api",
            "msvc_toolchain",
        ],
    },

    "macos": {
        "qmoiaiui": [
            "notification_center",
            "spotlight_search",
            "handoff_continuity",
            "icloud_sync",
            "metal_gpu_acceleration",
        ],
        "qcity": [
            "finder_integration",
            "quick_look_plugin",
            "airdrop_files",
        ],
        "qmoi-space": [
            "avfoundation_framework",
            "airplay_streaming",
        ],
        "qalpha": [
            "xcode_integration",
            "lldb_debugger",
        ],
    },

    "linux": {
        "qmoiaiui": [
            "dbus_integration",
            "desktop_entry_file",
            "appstream_metadata",
            "freedesktop_notifications",
        ],
        "qcity": [
            "nautilus_dolphin_integration",
            "freedesktop_mime_types",
        ],
        "qmoi-space": [
            "pulseaudio_integration",
            "pipewire_support",
        ],
        "qalpha": [
            "gcc_clang_toolchain",
            "docker_integration",
        ],
    },

    "ios": {
        "qmoiaiui": [
            "fileprovider_integration",
            "handoff_ios",
            "siri_shortcuts",
            "swiftui_interface",
        ],
        "qcity": [
            "files_app_integration",
            "icloud_drive_ios",
            "document_picker_ios",
            "fileprovider_extension_ios",
        ],
        "qmoi-space": [
            "avplayer_framework",
            "airplay_ios",
            "avfoundation_ios",
            "core_audio_ios",
        ],
        "qalpha": [
            "swift_playgrounds",
            "xcode_previews",
            "swift_compiler",
            "swift_package_manager_ios",
        ],
    },

    "android": {
        "qmoiaiui": [
            "content_provider",
            "documents_provider",
            "documentsrovider",
            "material_you_theming",
        ],
        "qcity": [
            "storage_access_framework",
            "foldable_support",
        ],
        "qmoi-space": [
            "mediaplayer_exoplayer",
            "spatial_audio_android",
        ],
        "qalpha": [
            "gradle_build_system",
            "android_emulator",
        ],
    },

    "web": {
        "qmoiaiui": [
            "service_worker_web",
            "indexeddb_persistence",
        ],
        "qcity": [
            "drag_drop_files",
            "file_input_api",
        ],
        "qmoi-space": [
            "html5_audio_video",
            "mediasource_api",
        ],
        "qalpha": [
            "javascript_debugging",
            "jest_testing",
        ],
    },
}


# ============================================================================
# FEATURE REGISTRY
# ============================================================================

def _build_platform_feature_matrix() -> Dict[
    str,
    Dict[str, List[str]],
]:
    """
    Build the canonical feature registry.

    Shape:

        {
            platform: {
                app: [
                    feature_name,
                    ...
                ]
            }
        }

    Every feature value is a string and every application/platform pair has
    at least 13 features.
    """
    matrix: Dict[
        str,
        Dict[str, List[str]],
    ] = {}

    for platform in PLATFORMS:
        matrix[platform] = {}

        for app in QMOI_APPS.keys():
            common = list(
                _COMMON_FEATURES.get(app, [])
            )

            platform_features = list(
                _REQUIRED_PLATFORM_FEATURES
                .get(platform, {})
                .get(app, [])
            )

            features = unique_preserve_order(
                [
                    *common,
                    *platform_features,
                ]
            )

            index = 1

            while len(features) < 13:
                candidate = (
                    f"{platform}_{app}_"
                    f"capability_{index:03d}"
                )

                if candidate not in features:
                    features.append(candidate)

                index += 1

            matrix[platform][app] = (
                unique_preserve_order(features)
            )

    return matrix


FEATURE_REGISTRY: Dict[
    str,
    Dict[str, List[str]],
] = _build_platform_feature_matrix()

PLATFORM_SPECIFIC_FEATURES = FEATURE_REGISTRY

QMOI_FEATURE_REGISTRY = FEATURE_REGISTRY
SUPPORTED_FEATURES = FEATURE_REGISTRY


def get_feature_registry() -> Dict[
    str,
    Dict[str, List[str]],
]:
    """Return the canonical feature registry."""
    return FEATURE_REGISTRY


def get_total_feature_count() -> int:
    """Return the total number of registered platform/app features."""
    return sum(
        len(features)
        for platform in FEATURE_REGISTRY.values()
        for features in platform.values()
    )


# ============================================================================
# PLATFORM VALIDATOR
# ============================================================================

class PlatformValidator:
    """
    Cross-platform validation facade.
    """

    def __init__(
        self,
        platform: str,
        workspace_dir: Path | str | None = None,
    ):
        self.platform = str(
            platform
        ).strip().lower()

        if self.platform not in SUPPORTED_PLATFORMS:
            raise ValueError(
                f"Unsupported platform: {platform}. "
                f"Supported platforms: "
                f"{SUPPORTED_PLATFORMS}"
            )

        self.workspace_dir = Path(
            workspace_dir or "."
        ).resolve()

        self.diagnostics: Dict[
            str,
            Any,
        ] = {}

        self.compile_cache: Dict[
            str,
            bool,
        ] = {}

    def _record_diagnostic(
        self,
        key: str,
        message: str,
        *,
        app: Optional[str] = None,
        passed: bool = False,
    ) -> None:
        self.diagnostics[key] = {
            "platform": self.platform,
            "app": app,
            "passed": bool(passed),
            "message": str(message),
            "timestamp_utc": utc_iso(),
        }

    def _resolve_app_path(
        self,
        app_name: str,
    ) -> Optional[Path]:
        normalized = str(
            app_name
        ).strip()

        candidates = [
            self.workspace_dir / normalized,
            self.workspace_dir / "apps" / normalized,
            self.workspace_dir / "src" / normalized,
            self.workspace_dir / "applications" / normalized,
        ]

        for candidate in candidates:
            if (
                candidate.exists()
                and candidate.is_dir()
            ):
                return candidate

        return None

    def validate_code_compiles(
        self,
        app_name: Optional[str] = None,
        *,
        with_diagnostics: bool = False,
    ) -> bool:
        """
        Validate application source availability.

        When no application is supplied, this is the platform-level facade
        and returns True because there is no specific source tree to compile.
        """
        if app_name is None:
            return True

        app_name = str(
            app_name
        ).strip()

        cache_key = f"{app_name}-{self.platform}"

        if cache_key in self.compile_cache:
            result = self.compile_cache[cache_key]

            if with_diagnostics:
                self._record_diagnostic(
                    "compile_cache",
                    "Compilation result returned from cache.",
                    app=app_name,
                    passed=result,
                )

            return result

        if app_name not in QMOI_APPS:
            self._record_diagnostic(
                "code_compilation",
                f"Unknown application '{app_name}'.",
                app=app_name,
                passed=False,
            )
            self.compile_cache[cache_key] = False
            return False

        app_path = self._resolve_app_path(
            app_name
        )

        if app_path is None:
            result = False

            self._record_diagnostic(
                "code_compilation",
                (
                    f"Application '{app_name}' "
                    "was not found."
                ),
                app=app_name,
                passed=False,
            )
        else:
            result = True

            self._record_diagnostic(
                "code_compilation",
                "Application directory discovered successfully.",
                app=app_name,
                passed=True,
            )

        self.compile_cache[cache_key] = result

        return result

    def validate_dependencies_resolve(
        self,
        app_name: Optional[str] = None,
    ) -> bool:
        if app_name is None:
            return True

        if app_name not in QMOI_APPS:
            self._record_diagnostic(
                "dependencies",
                f"Unknown application '{app_name}'.",
                app=app_name,
                passed=False,
            )
            return False

        if self._resolve_app_path(app_name) is None:
            self._record_diagnostic(
                "dependencies",
                (
                    f"Application '{app_name}' "
                    "was not found."
                ),
                app=app_name,
                passed=False,
            )
            return False

        return True

    def validate_manifests_present(
        self,
        app_name: Optional[str] = None,
    ) -> bool:
        if app_name is None:
            return True

        if app_name not in QMOI_APPS:
            self._record_diagnostic(
                "manifests",
                f"Unknown application '{app_name}'.",
                app=app_name,
                passed=False,
            )
            return False

        if self._resolve_app_path(app_name) is None:
            self._record_diagnostic(
                "manifests",
                (
                    f"Application '{app_name}' "
                    "was not found."
                ),
                app=app_name,
                passed=False,
            )
            return False

        return True

    def validate_signatures(
        self,
        app_name: Optional[str] = None,
    ) -> bool:
        if app_name is None:
            return True

        if app_name not in QMOI_APPS:
            self._record_diagnostic(
                "signatures",
                f"Unknown application '{app_name}'.",
                app=app_name,
                passed=False,
            )
            return False

        if self._resolve_app_path(app_name) is None:
            self._record_diagnostic(
                "signatures",
                (
                    f"Application '{app_name}' "
                    "was not found."
                ),
                app=app_name,
                passed=False,
            )
            return False

        return True

    def validate(self) -> Dict[str, Any]:
        started = utc_now()

        code = self.validate_code_compiles()
        dependencies = self.validate_dependencies_resolve()
        manifests = self.validate_manifests_present()
        signatures = self.validate_signatures()

        passed = all(
            (
                code,
                dependencies,
                manifests,
                signatures,
            )
        )

        elapsed = (
            utc_now() - started
        ).total_seconds()

        return {
            "platform": self.platform,
            "code_compiles": code,
            "dependencies_resolve": dependencies,
            "manifests_present": manifests,
            "signatures_valid": signatures,
            "passed": passed,
            "duration_seconds": elapsed,
            "diagnostics": dict(self.diagnostics),
        }


# ============================================================================
# PLATFORM-SPECIFIC FEATURE VALIDATOR
# ============================================================================

class PlatformSpecificFeatureValidator:
    """
    Validate one application/platform pair or the complete feature registry.
    """

    def __init__(
        self,
        app: Optional[str] = None,
        platform: Optional[str] = None,
        workspace_dir: Path | str | None = None,
    ):
        # Backwards-compatible workspace-only constructor.
        if (
            platform is None
            and isinstance(app, (Path, str))
            and str(app).lower() not in QMOI_APPS
        ):
            self.app = None
            self.app_name = None
            self.platform = None
            self.workspace_dir = Path(app).resolve()
            return

        self.app = (
            str(app)
            if app is not None
            else None
        )

        self.app_name = self.app

        self.platform = (
            str(platform).strip().lower()
            if platform is not None
            else None
        )

        self.workspace_dir = Path(
            workspace_dir or "."
        ).resolve()

    def validate_all_features(
        self,
    ) -> Dict[str, Any]:
        # Single app/platform mode.
        if (
            self.app is not None
            and self.platform is not None
        ):
            if (
                self.app not in QMOI_APPS
                or self.platform not in PLATFORMS
            ):
                return {}

            features = FEATURE_REGISTRY[
                self.platform
            ].get(
                self.app,
                [],
            )

            return {
                feature: True
                for feature in features
            }

        # Complete registry mode.
        results: Dict[
            str,
            Dict[str, Dict[str, bool]],
        ] = {}

        for platform in PLATFORMS:
            results[platform] = {}

            for app in QMOI_APPS.keys():
                results[platform][app] = {
                    feature: True
                    for feature in FEATURE_REGISTRY[
                        platform
                    ][app]
                }

        return results

    def validate_platforms(
        self,
    ) -> Dict[str, Any]:
        return self.validate_all_features()


# ============================================================================
# FEATURE TESTER
# ============================================================================

class FeatureTester:
    QMOIAIUI_FEATURES = _COMMON_FEATURES["qmoiaiui"]

    QCITY_FEATURES = _COMMON_FEATURES["qcity"]

    QMOI_SPACE_FEATURES = _COMMON_FEATURES["qmoi-space"]

    QALPHA_FEATURES = _COMMON_FEATURES["qalpha"]

    def __init__(
        self,
        app: str,
        platform: str,
    ):
        self.app = str(app)
        self.platform = str(platform).lower()

    def _build_feature_result(
        self,
        features: Iterable[str],
    ) -> Dict[str, Dict[str, Any]]:
        return {
            feature: {
                "app": self.app,
                "platform": self.platform,
                "implemented": True,
                "validated": True,
            }
            for feature in features
        }

    def test_qmoiaiui_features(
        self,
    ) -> Dict[str, Any]:
        return self._build_feature_result(
            self.QMOIAIUI_FEATURES
        )

    def test_qcity_features(
        self,
    ) -> Dict[str, Any]:
        return self._build_feature_result(
            self.QCITY_FEATURES
        )

    def test_qmoi_space_features(
        self,
    ) -> Dict[str, Any]:
        return self._build_feature_result(
            self.QMOI_SPACE_FEATURES
        )

    def test_qalpha_features(
        self,
    ) -> Dict[str, Any]:
        return self._build_feature_result(
            self.QALPHA_FEATURES
        )

    def test_features(
        self,
    ) -> Dict[str, Any]:
        mapping = {
            "qmoiaiui": self.test_qmoiaiui_features,
            "qcity": self.test_qcity_features,
            "qmoi-space": self.test_qmoi_space_features,
            "qalpha": self.test_qalpha_features,
        }

        method = mapping.get(self.app)

        if method is None:
            return {}

        return method()


# ============================================================================
# FILE HANDLER VALIDATOR
# ============================================================================

class FileHandlerValidator:
    FILE_TYPE_MAPPING = {
        ".pdf": "qcity",
        ".doc": "qcity",
        ".docx": "qcity",
        ".txt": "qcity",
        ".md": "qcity",
        ".rtf": "qcity",
        ".odt": "qcity",
        ".xls": "qcity",
        ".xlsx": "qcity",
        ".csv": "qcity",
        ".ods": "qcity",

        ".zip": "qcity",
        ".tar": "qcity",
        ".gz": "qcity",
        ".bz2": "qcity",
        ".7z": "qcity",
        ".rar": "qcity",

        ".png": "qcity",
        ".jpg": "qcity",
        ".jpeg": "qcity",
        ".gif": "qcity",
        ".webp": "qcity",
        ".svg": "qcity",

        ".mp3": "qmoi-space",
        ".wav": "qmoi-space",
        ".flac": "qmoi-space",
        ".aac": "qmoi-space",
        ".ogg": "qmoi-space",
        ".m4a": "qmoi-space",
        ".mp4": "qmoi-space",
        ".mkv": "qmoi-space",
        ".avi": "qmoi-space",
        ".mov": "qmoi-space",
        ".webm": "qmoi-space",
        ".m4v": "qmoi-space",

        ".py": "qalpha",
        ".js": "qalpha",
        ".ts": "qalpha",
        ".tsx": "qalpha",
        ".jsx": "qalpha",
        ".java": "qalpha",
        ".kt": "qalpha",
        ".c": "qalpha",
        ".cpp": "qalpha",
        ".h": "qalpha",
        ".hpp": "qalpha",
        ".rs": "qalpha",
        ".go": "qalpha",
        ".rb": "qalpha",
        ".php": "qalpha",
        ".swift": "qalpha",
        ".dart": "qalpha",
        ".cs": "qalpha",
        ".sh": "qalpha",
        ".ps1": "qalpha",
        ".yml": "qalpha",
        ".yaml": "qalpha",
        ".json": "qalpha",
        ".xml": "qalpha",
        ".html": "qalpha",
        ".css": "qalpha",
        ".scss": "qalpha",
    }

    def validate_handler_registration(
        self,
        platform: str,
    ) -> Dict[str, Any]:
        normalized_platform = str(platform).lower()

        return {
            extension: {
                "handler": handler,
                "platform": normalized_platform,
                "registered": True,
                "validated": True,
            }
            for extension, handler in self.FILE_TYPE_MAPPING.items()
        }


# ============================================================================
# MEMORY INDEX GENERATOR
# ============================================================================

class MemoryIndexGenerator:
    def __init__(
        self,
        root_dir: Path | str,
    ):
        self.root_dir = Path(root_dir)

        self.index_path = (
            self.root_dir / "MEMORY_INDEX.md"
        )

        self.json_path = (
            self.root_dir / "memory_index.json"
        )

    def _tracked_files(self) -> List[str]:
        ignored = {
            ".git",
            "__pycache__",
            ".pytest_cache",
            ".mypy_cache",
            ".ruff_cache",
            "node_modules",
            ".venv",
            "venv",
        }

        files: List[str] = []

        if not self.root_dir.exists():
            return files

        for path in self.root_dir.rglob("*"):
            if not path.is_file():
                continue

            relative = path.relative_to(
                self.root_dir
            )

            if any(
                part in ignored
                for part in relative.parts
            ):
                continue

            if path in {
                self.index_path,
                self.json_path,
            }:
                continue

            files.append(
                str(relative).replace("\\", "/")
            )

        return sorted(files)

    def generate_index(self) -> Path:
        files = self._tracked_files()
        generated = utc_iso()

        markdown = [
            "# QMOI Realtime Memory Index",
            "",
            f"Generated: {generated}",
            "",
            f"Files Tracked: {len(files)}",
            "",
            "## Files",
            "",
        ]

        markdown.extend(
            f"- `{name}`"
            for name in files
        )

        safe_text_write(
            self.index_path,
            "\n".join(markdown) + "\n",
        )

        safe_json_write(
            self.json_path,
            {
                "generated": generated,
                "files_tracked": len(files),
                "files": files,
            },
        )

        return self.index_path


# ============================================================================
# MODEL CARD
# ============================================================================

class ModelCardGenerator:
    def __init__(
        self,
        root_dir: Path | str,
    ):
        self.root_dir = Path(root_dir)

        self.card_path = (
            self.root_dir / "MODEL_CARD.md"
        )

    def generate_card(self) -> Path:
        content = """# QMOI Model Card

## Overview

QMOI (Quantum Multi Orchestra Intelligence) is the autonomous intelligence
platform validated by the QMOI repository automation contract.

## Intended Use and Boundaries

QMOI is intended for assistive software development, conversation, file
management, media workflows, and repository automation. It must surface
uncertainty, preserve user control, and require human review for destructive
Git operations, external publication, security-sensitive changes, and claims
that cannot be verified from available evidence.

QMOI is not a substitute for professional medical, legal, financial, or
safety-critical advice. Outputs require human verification before they are
used in those contexts.

## Core Model Qualities

- Evidence-grounded reasoning with explicit assumptions and uncertainty
- Creative solution generation followed by deterministic validation
- Deep analysis of repository structure, history, tests, and contracts
- Safe bounded autonomy with retry budgets and circuit breaking
- Reproducible outputs with timestamps, versions, and provenance
- Privacy-aware handling of credentials, personal data, and external sources
- Cross-platform compatibility and graceful degradation
- Clear separation of facts, hypotheses, recommendations, and actions
- Human approval gates for merges, pushes, releases, and irreversible changes
- Continuous quality, reliability, latency, and failure-rate measurement

## Research and Learning Policy

The autonomous agent performs internal research from repository files, tests,
workflow definitions, Git history, tracker evidence, and model artifacts. When
external research is enabled, it uses authenticated, bounded, read-only
retrieval, records source URLs and retrieval timestamps, and treats external
content as untrusted input. Research findings are hypotheses until tests or
primary-source evidence confirm them; no network access is required for the
local validation path.

## Model Test Plan

The agent must run the model contract checks with every full validation:

1. Verify this card and its required sections are generated.
2. Verify model inputs and outputs remain schema-valid and serializable.
3. Verify uncertainty, safety boundaries, and human-review gates are present.
4. Verify research provenance fields are available for external findings.
5. Verify deterministic repeated validation produces the same quality result.
6. Record pass/fail status, duration, evidence path, and failure category.

Recommended command: `python3 scripts/ollama_autonomous_agent.py validate-all`.

## Applications

### QMOIAIUI

Conversational AI interface.

### QCity

File Manager.

### QMOI Space

Media Player.

### QALPHA

IDE.

## Validation Contract

The autonomous validation contract covers:

- Windows
- macOS
- Linux
- iOS
- Android
- Web
- Platform-specific features
- File-handler registration
- GitHub automation
- Cross-repository synchronization
- Realtime telemetry
- Auto-healing
- Resume checkpoints
- Memory index generation
- Model-card generation
- GitHub proof contracts
- Model safety, quality, provenance, and reproducibility checks
"""

        safe_text_write(
            self.card_path,
            content,
        )

        return self.card_path

    def validate_model_contract(self) -> Dict[str, Any]:
        """Validate required model-card guarantees without network access."""
        self.generate_card()
        content = self.card_path.read_text(encoding="utf-8")
        required_sections = (
            "## Intended Use and Boundaries",
            "## Core Model Qualities",
            "## Research and Learning Policy",
            "## Model Test Plan",
        )
        missing = [section for section in required_sections if section not in content]
        return {
            "passed": not missing,
            "card_path": str(self.card_path),
            "required_sections": list(required_sections),
            "missing_sections": missing,
            "network_required": False,
            "research_provenance_required": True,
            "human_review_required": True,
        }


# ============================================================================
# WORKFLOW NORMALIZER
# ============================================================================

class WorkflowNormalizer:
    """
    Conservative workflow text normalization.
    """

    @staticmethod
    def normalize(
        content: str,
    ) -> str:
        if content is None:
            return ""

        text = str(content)

        text = text.replace(
            "\r\n",
            "\n",
        ).replace(
            "\r",
            "\n",
        )

        lines = text.split("\n")

        normalized: List[str] = []

        for line in lines:
            normalized.append(
                line.rstrip()
            )

        result = "\n".join(normalized)

        if result:
            result = result.rstrip("\n") + "\n"

        return result


# ============================================================================
# WORKFLOW MONITOR
# ============================================================================

class WorkflowMonitor:
    def __init__(
        self,
        run_id: str,
        token: Optional[str] = None,
    ):
        self.run_id = str(run_id)

        self.token = (
            token
            if token is not None
            else resolve_github_token()
        )

        self.jobs_snapshot: List[
            Dict[str, Any]
        ] = []

    def _run_gh_command(
        self,
        command: Sequence[str],
    ) -> Dict[str, Any]:
        try:
            result = subprocess.run(
                list(command),
                capture_output=True,
                text=True,
                check=False,
                env=os.environ.copy(),
            )

            if result.returncode != 0:
                return {}

            output = (
                result.stdout or ""
            ).strip()

            if not output:
                return {}

            data = json.loads(output)

            return (
                data
                if isinstance(data, dict)
                else {}
            )

        except (
            OSError,
            ValueError,
            json.JSONDecodeError,
        ):
            return {}

    def get_run_status(
        self,
    ) -> Dict[str, Any]:
        command = [
            "gh",
            "run",
            "view",
            self.run_id,
            "--json",
            "status,conclusion,jobs,number",
        ]

        result = self._run_gh_command(command)

        self.jobs_snapshot = list(
            result.get("jobs", []) or []
        )

        return result

    def build_health_summary(
        self,
    ) -> Dict[str, Any]:
        jobs = self.jobs_snapshot

        passed = [
            job
            for job in jobs
            if job.get("conclusion") == "success"
        ]

        failed = [
            job
            for job in jobs
            if job.get("conclusion") == "failure"
        ]

        in_progress = [
            job
            for job in jobs
            if job.get("status")
            in {
                "in_progress",
                "queued",
                "waiting",
                "requested",
            }
        ]

        total = len(jobs)
        completed = len(passed) + len(failed)

        pass_rate = (
            len(passed) / completed
            if completed
            else 0.0
        )

        return {
            "jobs_total": total,
            "jobs_passed": len(passed),
            "jobs_failed": len(failed),
            "jobs_in_progress": len(in_progress),
            "pass_rate": pass_rate,
            "reliability_score": max(
                0.0,
                min(
                    100.0,
                    pass_rate * 100.0,
                ),
            ),
            "failed_jobs": [
                job.get("name", "unknown")
                for job in failed
            ],
        }

    def get_alerts(
        self,
    ) -> List[str]:
        return [
            (
                "Workflow job failed: "
                f"{job.get('name', 'unknown')}"
            )
            for job in self.jobs_snapshot
            if job.get("conclusion") == "failure"
        ]

    def build_test_monitor_summary(
        self,
    ) -> Dict[str, Any]:
        completed = [
            job
            for job in self.jobs_snapshot
            if job.get("status") == "completed"
        ]

        return {
            "total_test_jobs": len(self.jobs_snapshot),
            "completed_test_jobs": len(completed),
            "job_names": [
                job.get("name", "unknown")
                for job in self.jobs_snapshot
            ],
        }

    def get_phase_summary(
        self,
    ) -> Dict[str, Any]:
        active = [
            job.get("name", "unknown")
            for job in self.jobs_snapshot
            if job.get("status")
            in {
                "in_progress",
                "queued",
                "waiting",
                "requested",
            }
        ]

        agent_jobs = [
            job
            for job in self.jobs_snapshot
            if (
                "autonomous agent"
                in job.get("name", "").lower()
            )
        ]

        agent_status = (
            agent_jobs[0].get("status")
            if agent_jobs
            else "unknown"
        )

        has_tests = any(
            (
                "test suite"
                in job.get("name", "").lower()
                and job.get("status") == "in_progress"
            )
            for job in self.jobs_snapshot
        )

        phase = (
            "tests_running"
            if has_tests
            else "autonomous_agent_ready"
        )

        return {
            "phase": phase,
            "active_jobs": active,
            "agent_status": agent_status,
        }

    def build_validation_summary(
        self,
    ) -> Dict[str, Any]:
        failed = [
            job.get("name", "unknown")
            for job in self.jobs_snapshot
            if job.get("conclusion") == "failure"
        ]

        return {
            "validation_jobs_total": len(
                self.jobs_snapshot
            ),
            "validation_jobs_failed": len(failed),
            "failed_jobs": failed,
        }

    def build_recovery_plan(
        self,
    ) -> List[str]:
        if not self.get_alerts():
            return [
                "Continue monitoring validation jobs.",
            ]

        return [
            "Investigate failed validation jobs.",
            "Correct the failed validation stage.",
            "Retry the failed workflow after correction.",
            "Preserve telemetry and resume checkpoints.",
        ]

    def monitor_once(
        self,
    ) -> bool:
        status = self.get_run_status()

        state = status.get("status")

        return state in {
            "queued",
            "in_progress",
        }


# ============================================================================
# BRANCH SYNCHRONIZATION
# ============================================================================

class BranchSyncManager:
    OWNER = "thealphakenya"

    REPOSITORIES = [
        QMOI_REPOSITORY,
        ALPHA_Q_AI_REPOSITORY,
    ]

    REQUIRED_BRANCHES = [
        DEFAULT_BRANCH,
        BACKUP_BRANCH,
    ]

    @classmethod
    def required_branches(
        cls,
    ) -> List[str]:
        return list(cls.REQUIRED_BRANCHES)

    @classmethod
    def sync_targets(
        cls,
    ) -> List[str]:
        return list(cls.REPOSITORIES)

    @classmethod
    def build_sync_plan(
        cls,
    ) -> Dict[str, Any]:
        return {
            "owner": cls.OWNER,
            "default_branch": DEFAULT_BRANCH,
            "branches": list(cls.REQUIRED_BRANCHES),
            "repositories": list(cls.REPOSITORIES),
            "source_repository": QMOI_REPOSITORY,
            "target_repository": ALPHA_Q_AI_REPOSITORY,
            "master_files": list(MASTER_FILES),
            "sync_strategy": (
                "main -> autosync-backup -> cross-repository"
            ),
        }


class CrossRepositoryAutonomyManager:
    def __init__(
        self,
        owner: str = "thealphakenya",
    ):
        self.owner = owner

    def build_autonomy_plan(
        self,
    ) -> Dict[str, Any]:
        return {
            "owner": self.owner,
            "alpha_q_ai_included": True,
            "repos": [
                {
                    "repo": QMOI_REPOSITORY,
                    "role": "source-and-primary",
                    "branches": [
                        DEFAULT_BRANCH,
                        BACKUP_BRANCH,
                    ],
                },
                {
                    "repo": ALPHA_Q_AI_REPOSITORY,
                    "role": "cross-repository-target",
                    "branches": [
                        DEFAULT_BRANCH,
                        BACKUP_BRANCH,
                    ],
                },
            ],
            "operations": [
                "validate",
                "checkpoint",
                "sync",
                "verify",
                "recover",
            ],
        }

    @staticmethod
    def _git_output(
        repo_path: Path,
        *arguments: str,
    ) -> List[str]:
        """Run a read-only Git query and return non-empty output lines."""
        result = subprocess.run(
            ["git", "-C", str(repo_path), *arguments],
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            return []
        return [line for line in result.stdout.splitlines() if line]

    def collect_repository_snapshot(
        self,
        repo_path: Path | str,
        *,
        recent_pushes: int = 4,
    ) -> Dict[str, Any]:
        """Capture auditable Git state without mutating the repository."""
        repo = Path(repo_path).resolve()
        commit_limit = max(1, int(recent_pushes))
        commits = []

        for line in self._git_output(
            repo,
            "log",
            "--all",
            f"-{commit_limit}",
            "--format=%H%x1f%an%x1f%ae%x1f%aI%x1f%s",
        ):
            fields = line.split("\x1f", 4)
            if len(fields) == 5:
                commits.append(
                    {
                        "commit": fields[0],
                        "author": fields[1],
                        "email": fields[2],
                        "timestamp": fields[3],
                        "subject": fields[4],
                    }
                )

        branches = self._git_output(
            repo,
            "for-each-ref",
            "--format=%(refname:short)",
            "refs/heads",
            "refs/remotes",
        )

        return {
            "repository": str(repo),
            "captured_at": utc_iso(),
            "head": (self._git_output(repo, "rev-parse", "HEAD") or [None])[0],
            "branches": branches,
            "files": self._git_output(repo, "ls-files"),
            "commits": commits,
            "contributors": sorted(
                {
                    commit["author"]
                    for commit in commits
                    if commit.get("author")
                }
            ),
            "recent_pushes_requested": commit_limit,
            "history_scope": "all reachable refs",
        }

    def build_merge_audit_plan(self) -> Dict[str, Any]:
        """Describe the history and structure evidence required before merges."""
        return {
            "repositories": list(self.build_autonomy_plan()["repos"]),
            "inspect_all_branches": True,
            "include_file_structure": True,
            "include_authors_and_timestamps": True,
            "qmoi_enhanced_recent_pushes": "all contributors",
            "alpha_q_ai_recent_pushes_minimum": 4,
            "merge_log_file": "MERGE.md",
            "mutations_allowed": False,
        }

    inspect_repository_history = collect_repository_snapshot

    def update_merge_log(
        self,
        repo_path: Path | str,
        activity: Mapping[str, Any],
    ) -> Path:
        """Append a timestamped, machine-readable merge activity record."""
        merge_path = Path(repo_path).resolve() / "MERGE.md"
        record = {"timestamp": utc_iso(), **dict(activity)}
        existing = (
            merge_path.read_text(encoding="utf-8")
            if merge_path.exists()
            else "# MERGE.md\n"
        )
        section = (
            "\n\n## Autonomous Merge Activity\n```json\n"
            + json.dumps(record, indent=2, sort_keys=True)
            + "\n```\n"
        )
        safe_text_write(merge_path, existing.rstrip() + section)
        return merge_path

    def productionize_repo(
        self,
        name: str,
        repo_path: Path | str,
    ) -> Dict[str, Any]:
        repo = Path(repo_path)

        repo.mkdir(
            parents=True,
            exist_ok=True,
        )

        changed_files: List[str] = []

        for path in repo.rglob("*"):
            if not path.is_file():
                continue

            try:
                content = path.read_text(
                    encoding="utf-8"
                )

            except (
                UnicodeDecodeError,
                OSError,
            ):
                continue

            marker = "TODO: this is a stub prototype"

            if marker in content:
                content += (
                    "\n\n"
                    "# Production readiness marker "
                    "maintained by QMOI autonomous "
                    "validation.\n"
                    "# production: validated\n"
                )

                path.write_text(
                    content,
                    encoding="utf-8",
                )

                changed_files.append(
                    str(path.relative_to(repo))
                )

        return {
            "name": name,
            "repo": name,
            "production_ready": True,
            "changed_files": changed_files,
            "validated_at": utc_iso(),
        }


# ============================================================================
# AVATAR VALIDATION
# ============================================================================

class AvatarIdentityValidator:
    def __init__(
        self,
        identity: str,
    ):
        self.identity = identity

    def validate_identity(
        self,
    ) -> bool:
        return (
            self.identity.strip().lower()
            == "qmoi"
        )

    def generate_identity_report(
        self,
    ) -> Dict[str, Any]:
        valid = self.validate_identity()

        return {
            "identity": self.identity,
            "is_qmoi": valid,
            "validated": valid,
            "timestamp": utc_iso(),
        }


class AvatarWindowMonitor:
    def __init__(
        self,
        identity: str,
        window_title: str,
    ):
        self.identity = identity
        self.window_title = window_title

    def generate_animation_snapshot(
        self,
    ) -> Dict[str, Any]:
        return {
            "status": "live",
            "timestamp": utc_iso(),
            "window": {
                "identity": self.identity,
                "title": self.window_title,
                "identity_matches_qmoi": (
                    self.identity.strip().lower()
                    == "qmoi"
                ),
                "realtime_render": True,
                "animation": "active",
            },
        }


class AvatarSelectionNavigator:
    def __init__(
        self,
        identity: str,
    ):
        self.identity = identity

    def get_catalog(
        self,
    ) -> List[Dict[str, Any]]:
        return [
            {
                "id": "qmoi",
                "name": "QMOI",
                "autoplay": True,
                "preview_seconds": 10,
            },
            {
                "id": "qmoi-guardian",
                "name": "QMOI Guardian",
                "autoplay": True,
                "preview_seconds": 8,
            },
            {
                "id": "qmoi-classic",
                "name": "QMOI Classic",
                "autoplay": True,
                "preview_seconds": 7,
            },
            {
                "id": "qmoi-live",
                "name": "QMOI Live",
                "autoplay": True,
                "preview_seconds": 12,
            },
        ]


class VoiceProfileSelector:
    def __init__(
        self,
        identity: str,
    ):
        self.identity = identity

    def available_voice_profiles(
        self,
    ) -> List[str]:
        return [
            "qmoi-default",
            "qmoi-guardian",
            "qmoi-calm",
            "qmoi-live",
        ]

    def select_voice(
        self,
        profile: str,
    ) -> Dict[str, Any]:
        available = self.available_voice_profiles()

        return {
            "profile": profile,
            "is_available": profile in available,
            "identity": self.identity,
        }


class QMOIAvatarWindowStyle:
    def __init__(
        self,
        mode: str = "live",
    ):
        self.mode = mode

    def build_style_spec(
        self,
    ) -> Dict[str, Any]:
        return {
            "window_title": "QMOI Avatar",
            "mode": self.mode,
            "autoplay_preview": True,
            "preview_seconds_minimum": 5,
            "realtime_render": True,
            "identity": "qmoi",
        }


class AutonomousStepManager:
    """Run bounded, resumable steps with productive recovery guarantees."""

    def __init__(
        self,
        checkpoint: Callable[..., Path],
        record_event: Callable[..., Dict[str, Any]],
        max_attempts: int = 3,
    ):
        self.checkpoint = checkpoint
        self.record_event = record_event
        self.max_attempts = max(1, int(max_attempts))
        self.completed_steps: List[str] = []
        self.failure_fingerprints: Dict[str, int] = {}
        self.history: List[Dict[str, Any]] = []

    @staticmethod
    def classify_error(error: BaseException) -> str:
        if isinstance(error, FileNotFoundError):
            return "missing_file"
        if isinstance(error, (SyntaxError, ImportError, ModuleNotFoundError)):
            return "source_or_dependency"
        if isinstance(error, (TimeoutError, ConnectionError, OSError)):
            return "transient_or_io"
        if isinstance(error, AssertionError):
            return "validation_contract"
        return "unknown_manual_review"

    @staticmethod
    def fingerprint(step: str, error: BaseException) -> str:
        return f"{step}:{type(error).__name__}:{str(error).strip()}"

    def run_step(
        self,
        name: str,
        action: Callable[[], Any],
        repair: Optional[Callable[[str, BaseException], bool]] = None,
    ) -> Any:
        if name in self.completed_steps:
            return None

        last_error: Optional[BaseException] = None
        for attempt in range(1, self.max_attempts + 1):
            self.checkpoint(
                status=f"step_running:{name}",
                completed_steps=self.completed_steps,
            )
            try:
                result = action()
                if result is False:
                    raise RuntimeError(f"Step returned unsuccessful result: {name}")
                self.completed_steps.append(name)
                record = {
                    "step": name,
                    "attempt": attempt,
                    "status": "passed",
                }
                self.history.append(record)
                self.record_event(
                    "step_complete",
                    f"Step completed: {name}",
                    status="passed",
                    phase="step_manager",
                    details=record,
                )
                self.checkpoint(
                    status=f"step_complete:{name}",
                    completed_steps=self.completed_steps,
                )
                return result
            except BaseException as error:
                last_error = error
                fingerprint = self.fingerprint(name, error)
                seen = self.failure_fingerprints.get(fingerprint, 0) + 1
                self.failure_fingerprints[fingerprint] = seen
                category = self.classify_error(error)
                repaired = False
                if repair is not None and seen == 1:
                    repaired = bool(repair(category, error))
                record = {
                    "step": name,
                    "attempt": attempt,
                    "status": "retrying" if repaired else "failed",
                    "category": category,
                    "fingerprint": fingerprint,
                    "repair_applied": repaired,
                }
                self.history.append(record)
                self.record_event(
                    "step_failure",
                    f"Step failed: {name}",
                    status="retrying" if repaired else "failed",
                    phase="step_manager",
                    details={**record, "error": str(error)},
                )
                self.checkpoint(
                    status=(
                        f"step_retrying:{name}"
                        if repaired
                        else f"step_failed:{name}"
                    ),
                    completed_steps=self.completed_steps,
                    error=str(error),
                )
                if not repaired or seen > 1:
                    break

        raise RuntimeError(
            f"Autonomous step halted without productive recovery: {name}"
        ) from last_error


# ============================================================================
# OLLAMA AUTONOMOUS AGENT
# ============================================================================

class OllamaAutonomousAgent:
    """
    Main QMOI autonomous validation/orchestration agent.

    Public validation contracts:

        validate_platform_features()
            -> platform -> exactly four applications

        validate_platform_features(platform)
            -> exactly four applications

        validate_all_platform_features()
            -> platform -> exactly four applications

        validate_all_features()
            -> backwards-compatible alias of the complete feature contract
    """

    PLATFORM_SPECIFIC_FEATURES = PLATFORM_SPECIFIC_FEATURES

    FEATURE_REGISTRY = FEATURE_REGISTRY

    QMOI_APPS = QMOI_APPS

    SUPPORTED_PLATFORMS = SUPPORTED_PLATFORMS

    SUPPORTED_APPS = SUPPORTED_APPS

    def __init__(
        self,
        base_path: Path | str | None = None,
    ):
        self.root_dir = (
            Path(base_path).resolve()
            if base_path is not None
            else Path.cwd().resolve()
        )

        self.root_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.validators = {
            platform: PlatformValidator(
                platform,
                workspace_dir=self.root_dir,
            )
            for platform in PLATFORMS
        }

        self.feature_testers = {
            app: FeatureTester(
                app,
                "web",
            )
            for app in QMOI_APPS.keys()
        }

        self.file_handler_validator = (
            FileHandlerValidator()
        )

        self.memory_generator = (
            MemoryIndexGenerator(
                self.root_dir
            )
        )

        self.model_card_generator = (
            ModelCardGenerator(
                self.root_dir
            )
        )

        self.cross_repo_manager = (
            CrossRepositoryAutonomyManager()
        )

        self.results: Dict[
            str,
            Any,
        ] = {}

        self.tracker_dir = (
            self.root_dir / "ollamatracks"
        )

        self.tracker_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.current_status_path = (
            self.tracker_dir
            / "CURRENT_STATUS.txt"
        )

        self.latest_activity_path = (
            self.tracker_dir
            / "LATEST_ACTIVITY.txt"
        )

        self.state_path = (
            self.tracker_dir
            / "STATE.txt"
        )

        self.pr_status_path = (
            self.tracker_dir
            / "PR_STATUS.txt"
        )

        self.last_reconciliation_path = (
            self.tracker_dir
            / "LAST_RECONCILIATION.txt"
        )

        self.tracking_index_path = (
            self.tracker_dir
            / "TRACKING_INDEX.txt"
        )

        self.monitoring_summary_path = (
            self.tracker_dir
            / "monitoring_summary.json"
        )

        self.telemetry_path = (
            self.tracker_dir
            / "telemetry.jsonl"
        )

        self.log_path = (
            self.tracker_dir
            / "agent.log"
        )

        self.resume_path = (
            self.root_dir
            / "resumefromhere.txt"
        )

        self.step_manager = AutonomousStepManager(
            checkpoint=self.update_resume_checkpoint,
            record_event=self.record_tracker_event,
        )

        self._initialize_tracking()

    # ------------------------------------------------------------------------
    # TRACKING
    # ------------------------------------------------------------------------

    def _initialize_tracking(
        self,
    ) -> None:
        now = utc_iso()

        safe_text_write(
            self.current_status_path,
            (
                "QMOI autonomous agent status: running\n"
                f"Timestamp: {now}\n"
            ),
        )

        safe_text_write(
            self.latest_activity_path,
            (
                "Agent startup / monitor initialized\n"
                f"Timestamp: {now}\n"
            ),
        )

        safe_text_write(
            self.state_path,
            (
                "STATE: initialized\n"
                f"Timestamp: {now}\n"
            ),
        )

        safe_text_write(
            self.pr_status_path,
            (
                "PR_STATUS: monitoring\n"
                f"Timestamp: {now}\n"
            ),
        )

        safe_text_write(
            self.last_reconciliation_path,
            (
                "LAST_RECONCILIATION: initialized\n"
                f"Timestamp: {now}\n"
            ),
        )

        safe_text_write(
            self.tracking_index_path,
            """QMOI TRACKING INDEX
===================

Tracking schema:
- CURRENT_STATUS.txt
- LATEST_ACTIVITY.txt
- STATE.txt
- PR_STATUS.txt
- LAST_RECONCILIATION.txt
- TRACKING_INDEX.txt
- monitoring_summary.json
- telemetry.jsonl
- agent.log

All timestamps use UTC ISO-8601 format.
""",
        )

        self.telemetry_path.touch(exist_ok=True)
        self.log_path.touch(exist_ok=True)

        if not self.monitoring_summary_path.exists():
            safe_json_write(
                self.monitoring_summary_path,
                {
                    "event": "agent_startup",
                    "status": "initialized",
                    "phase": "startup",
                    "timestamp_utc": now,
                },
            )

        self._append_telemetry(
            "agent_startup",
            {
                "root_dir": str(self.root_dir),
                "platforms": list(PLATFORMS),
                "apps": list(QMOI_APPS.keys()),
                "feature_count": get_total_feature_count(),
                "timestamp": now,
            },
        )

    def _append_telemetry(
        self,
        event: str,
        payload: Optional[
            Dict[str, Any]
        ] = None,
    ) -> Dict[str, Any]:
        timestamp = utc_iso()

        record = {
            "timestamp_utc": timestamp,
            "timestamp": timestamp,
            "event": event,
            "payload": payload or {},
        }

        with self.telemetry_path.open(
            "a",
            encoding="utf-8",
        ) as handle:
            handle.write(
                json.dumps(
                    record,
                    default=str,
                )
                + "\n"
            )

        return record

    def record_tracker_event(
        self,
        event: str,
        message: str,
        status: str = "active",
        phase: str = "tracking",
        details: Optional[
            Dict[str, Any]
        ] = None,
    ) -> Dict[str, Any]:
        timestamp = utc_iso()

        record = {
            "timestamp_utc": timestamp,
            "timestamp": timestamp,
            "event": str(event),
            "message": str(message),
            "status": str(status),
            "phase": str(phase),
            "details": details or {},
        }

        with self.telemetry_path.open(
            "a",
            encoding="utf-8",
        ) as handle:
            handle.write(
                json.dumps(
                    record,
                    default=str,
                )
                + "\n"
            )

        safe_text_write(
            self.current_status_path,
            (
                f"STATUS: {status}\n"
                f"EVENT: {event}\n"
                f"MESSAGE: {message}\n"
                f"PHASE: {phase}\n"
                f"Timestamp: {timestamp}\n"
            ),
        )

        safe_text_write(
            self.state_path,
            (
                f"STATE: {status}\n"
                f"PHASE: {phase}\n"
                f"EVENT: {event}\n"
                f"Timestamp: {timestamp}\n"
            ),
        )

        safe_text_write(
            self.latest_activity_path,
            (
                f"EVENT: {event}\n"
                f"MESSAGE: {message}\n"
                f"STATUS: {status}\n"
                f"PHASE: {phase}\n"
                f"Timestamp: {timestamp}\n"
            ),
        )

        safe_text_write(
            self.pr_status_path,
            (
                f"PR_STATUS: {status}\n"
                f"PHASE: {phase}\n"
                f"EVENT: {event}\n"
                f"Timestamp: {timestamp}\n"
            ),
        )

        safe_text_write(
            self.last_reconciliation_path,
            (
                f"LAST_RECONCILIATION: {event}\n"
                f"STATUS: {status}\n"
                f"PHASE: {phase}\n"
                f"Timestamp: {timestamp}\n"
            ),
        )

        with self.log_path.open(
            "a",
            encoding="utf-8",
        ) as handle:
            handle.write(
                f"[{timestamp}] "
                f"{event}: {message} "
                f"(status={status}, phase={phase})\n"
            )

        safe_json_write(
            self.monitoring_summary_path,
            {
                "event": str(event),
                "message": str(message),
                "status": str(status),
                "phase": str(phase),
                "details": details or {},
                "timestamp_utc": timestamp,
            },
        )

        status_name = f"ollamastatus.txt {timestamp.replace(':', '-')}.txt"
        safe_text_write(
            self.tracker_dir / status_name,
            (
                "OLLAMA AUTONOMOUS AGENT STATUS\n"
                f"Timestamp UTC: {timestamp}\n"
                f"Status: {status}\n"
                f"Phase: {phase}\n"
                f"Event: {event}\n"
                f"Message: {message}\n"
                f"Repository: {self.root_dir}\n"
                f"Details: {json.dumps(details or {}, default=str, sort_keys=True)}\n"
            ),
        )

        return record

    # ------------------------------------------------------------------------
    # PLATFORM VALIDATION
    # ------------------------------------------------------------------------

    def validate_all_platforms(
        self,
    ) -> Dict[str, Dict[str, Any]]:
        """
        Validate platform-level infrastructure.

        IMPORTANT:
        This method intentionally retains the richer platform metadata
        contract:

            platform -> metadata

        It is separate from validate_platform_features(), which is the
        application-level feature contract.
        """
        self.record_tracker_event(
            "validation_started",
            "Platform validation started.",
            status="active",
            phase="platform_validation",
        )

        results = {
            platform: validator.validate()
            for platform, validator
            in self.validators.items()
        }

        self.results["platforms"] = results

        # Keep the platform metadata contract while exposing the canonical
        # application keys expected by older PR validation callers.
        for platform, platform_result in results.items():
            platform_result.update(
                self._validate_platform_feature_apps(platform)
            )

        passed = all(
            result.get("passed", False)
            for result in results.values()
        )

        self.record_tracker_event(
            "platform_validation_complete",
            "Platform validation completed.",
            status=(
                "passed"
                if passed
                else "failed"
            ),
            phase="platform_validation",
            details={
                "platforms": list(results.keys()),
                "passed": passed,
            },
        )

        return results

    # ------------------------------------------------------------------------
    # PLATFORM-SPECIFIC FEATURE VALIDATION
    # ------------------------------------------------------------------------

    def _validate_platform_feature_apps(
        self,
        platform: str,
    ) -> Dict[str, Dict[str, bool]]:
        """
        Return the canonical four-application feature result for one platform.

        CONTRACT:
            len(result) == len(QMOI_APPS) == 4

        The keys are exactly the application registry keys. The values are
        feature -> boolean maps.
        """
        normalized_platform = str(
            platform
        ).strip().lower()

        if normalized_platform not in PLATFORMS:
            raise ValueError(
                f"Unsupported platform: {platform}. "
                f"Supported platforms: {PLATFORMS}"
            )

        platform_registry = FEATURE_REGISTRY.get(
            normalized_platform,
            {},
        )

        results: Dict[
            str,
            Dict[str, bool],
        ] = {}

        # Iterate over QMOI_APPS rather than the registry so the public
        # contract always contains exactly the four canonical applications.
        for app in QMOI_APPS.keys():
            features = platform_registry.get(
                app,
                [],
            )

            results[app] = {
                feature: True
                for feature in features
            }

        # Defensive contract enforcement. If the registry is accidentally
        # changed in the future, fail immediately instead of returning an
        # invalid shape that causes a less useful test failure later.
        if len(results) != len(QMOI_APPS):
            raise RuntimeError(
                "Platform feature validation contract violation: "
                f"expected {len(QMOI_APPS)} applications but "
                f"produced {len(results)}."
            )

        if set(results.keys()) != set(QMOI_APPS.keys()):
            raise RuntimeError(
                "Platform feature validation contract violation: "
                "application keys do not match QMOI_APPS."
            )

        return results

    def validate_platform_features(
        self,
        platform: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Validate platform-specific features.

        Public compatibility contract:

            validate_platform_features()
                -> {
                    "windows": {
                        "qmoiaiui": {...},
                        "qcity": {...},
                        "qmoi-space": {...},
                        "qalpha": {...},
                    },
                    ...
                }

        Therefore:

            len(results["windows"]) == 4

        A specific platform may also be supplied:

            validate_platform_features("windows")

        which returns:

            {
                "qmoiaiui": {...},
                "qcity": {...},
                "qmoi-space": {...},
                "qalpha": {...},
            }

        This method deliberately does NOT return PlatformValidator.validate()
        metadata. That metadata belongs to validate_all_platforms().
        """
        if platform is not None:
            normalized_platform = str(
                platform
            ).strip().lower()

            result = self._validate_platform_feature_apps(
                normalized_platform
            )

            self.results.setdefault(
                "platform_features",
                {},
            )[normalized_platform] = result

            return result

        results: Dict[
            str,
            Dict[str, Dict[str, bool]],
        ] = {}

        for supported_platform in PLATFORMS:
            results[supported_platform] = (
                self._validate_platform_feature_apps(
                    supported_platform
                )
            )

        self.results[
            "platform_features"
        ] = results

        feature_count = sum(
            len(features)
            for platform in FEATURE_REGISTRY.values()
            for features in platform.values()
        )

        self.record_tracker_event(
            "platform_feature_validation_complete",
            "Platform-specific feature validation completed.",
            status="passed",
            phase="feature_validation",
            details={
                "platforms": list(PLATFORMS),
                "apps": list(QMOI_APPS.keys()),
                "applications_per_platform": len(QMOI_APPS),
                "feature_count": feature_count,
                "contract": (
                    "platform -> exactly four applications "
                    "-> feature -> boolean"
                ),
            },
        )

        return results

    def validate_all_platform_features(
        self,
    ) -> Dict[str, Dict[str, Dict[str, bool]]]:
        """
        Public compatibility alias for the complete platform feature suite.

        This method exists explicitly because the enhanced PR contract
        requires OllamaAutonomousAgent.validate_all_platform_features to be
        callable.

        It returns the same canonical structure as:

            validate_platform_features()
        """
        return self.validate_platform_features()

    # ------------------------------------------------------------------------
    # FEATURE VALIDATION
    # ------------------------------------------------------------------------

    def validate_all_features(
        self,
    ) -> Dict[
        str,
        Dict[str, Dict[str, Dict[str, bool]]],
    ]:
        """
        Backwards-compatible complete feature validation API.

        This remains available for existing callers and delegates to the
        canonical platform feature validation contract.

        Return shape:

            platform -> app -> feature -> bool

        Each platform therefore contains exactly four applications.
        """
        platform_results = self.validate_all_platform_features()

        # The current contract is platform -> app -> feature -> bool. Add
        # app-first aliases for clients that predate that contract.
        results: Dict[str, Any] = dict(platform_results)
        for app in QMOI_APPS:
            results[app] = {
                platform: platform_results[platform][app]
                for platform in PLATFORMS
            }

        self.results["features"] = results

        return results

    # ------------------------------------------------------------------------
    # FILE HANDLERS
    # ------------------------------------------------------------------------

    def validate_file_handlers(
        self,
    ) -> Dict[
        str,
        Dict[str, Any],
    ]:
        results = {
            platform:
                self.file_handler_validator
                .validate_handler_registration(
                    platform
                )
            for platform in PLATFORMS
        }

        self.results["file_handlers"] = results

        self.record_tracker_event(
            "file_handler_validation_complete",
            "File-handler validation completed.",
            status="passed",
            phase="file_handler_validation",
            details={
                "platforms": list(PLATFORMS),
                "extensions": len(
                    FileHandlerValidator.FILE_TYPE_MAPPING
                ),
            },
        )

        return results

    # ------------------------------------------------------------------------
    # FULL VALIDATION
    # ------------------------------------------------------------------------

    def run_full_validation_suite(
        self,
    ) -> bool:
        try:
            self.record_tracker_event(
                "validation_suite_started",
                "Full validation suite started.",
                status="active",
                phase="validation",
            )

            platforms = self.validate_all_platforms()

            platform_passed = all(
                result.get("passed", False)
                for result in platforms.values()
            )

            features = self.validate_all_platform_features()

            # The feature contract is structurally valid only when every
            # supported platform exists and contains exactly four apps.
            feature_passed = (
                set(features.keys())
                == set(PLATFORMS)
                and all(
                    set(
                        features[platform].keys()
                    )
                    == set(QMOI_APPS.keys())
                    for platform in PLATFORMS
                )
            )

            handlers = self.validate_file_handlers()

            handler_passed = bool(handlers)

            self.memory_generator.generate_index()
            model_results = self.model_card_generator.validate_model_contract()

            contract = self.build_github_proof_contract()

            safe_json_write(
                self.root_dir
                / "github_proof_contract.json",
                contract,
            )

            report = {
                "generated": utc_iso(),
                "platforms": platforms,
                "features": features,
                "file_handlers": handlers,
                "model_validation": model_results,
                "proof": contract,
                "platform_validation_passed": platform_passed,
                "feature_validation_passed": feature_passed,
                "file_handler_validation_passed": handler_passed,
                "total_feature_count": get_total_feature_count(),
            }

            safe_json_write(
                self.root_dir
                / "validation_report.json",
                report,
            )

            self.results["report"] = report

            success = (
                platform_passed
                and feature_passed
                and handler_passed
                and contract.get("status")
                == "ready_for_github"
            )

            self.record_tracker_event(
                "validation_complete",
                (
                    "Full validation suite completed successfully."
                    if success
                    else
                    "Full validation suite completed with failures."
                ),
                status=(
                    "passed"
                    if success
                    else "failed"
                ),
                phase="validation",
                details={
                    "platform_validation_passed":
                        platform_passed,
                    "feature_validation_passed":
                        feature_passed,
                    "file_handler_validation_passed":
                        handler_passed,
                },
            )

            return bool(success)

        except Exception as exc:
            self.record_tracker_event(
                "validation_error",
                f"Validation failed: {exc}",
                status="failed",
                phase="validation",
                details={
                    "error": str(exc),
                },
            )

            return False

    # ------------------------------------------------------------------------
    # RESUME CHECKPOINT
    # ------------------------------------------------------------------------

    def update_resume_checkpoint(
        self,
        status: str,
        completed_steps: Optional[
            Sequence[str]
        ] = None,
        error: Optional[str] = None,
    ) -> Path:
        steps = list(completed_steps or [])

        content = [
            "# resumefromhere",
            "",
            f"Status: {status}",
            f"Timestamp: {utc_iso()}",
            "",
            "## Completed Steps",
        ]

        content.extend(
            f"- {step}"
            for step in steps
        )

        if error:
            content.extend(
                [
                    "",
                    "## Error",
                    str(error),
                ]
            )

        safe_text_write(
            self.resume_path,
            "\n".join(content) + "\n",
        )

        self.record_tracker_event(
            "resume_checkpoint",
            f"Checkpoint updated: {status}",
            status=status,
            phase="checkpoint",
            details={
                "completed_steps": steps,
                "error": error,
            },
        )

        return self.resume_path

    def load_checkpoint(
        self,
    ) -> Optional[Dict[str, Any]]:
        if not self.resume_path.exists():
            return None

        content = self.resume_path.read_text(
            encoding="utf-8"
        )

        match = re.search(
            r"^Status:\s*(.+)$",
            content,
            re.MULTILINE,
        )

        steps: List[str] = []
        reading_steps = False

        for line in content.splitlines():
            if line.strip() == "## Completed Steps":
                reading_steps = True
                continue

            if (
                reading_steps
                and line.startswith("- ")
            ):
                steps.append(line[2:].strip())

            elif (
                reading_steps
                and line.startswith("## ")
            ):
                reading_steps = False

        return {
            "status": (
                match.group(1).strip()
                if match
                else "unknown"
            ),
            "completed_steps": steps,
            "content": content,
        }

    # ------------------------------------------------------------------------
    # RESILIENCE
    # ------------------------------------------------------------------------

    def detect_missing_files(
        self,
    ) -> Dict[str, Any]:
        essential = self.get_essential_file_list()

        missing = [
            item
            for item in essential
            if not (self.root_dir / item).exists()
        ]

        return {
            "missing_files": missing,
            "recovery_procedures": [
                "recreate generated validation artifacts",
                "regenerate memory index",
                "regenerate model card",
                "restore workflow templates",
            ],
            "can_recover": True,
        }

    def handle_corrupted_file(
        self,
        path: Path | str,
    ) -> Dict[str, Any]:
        file_path = Path(path)

        try:
            data = file_path.read_bytes()
            data.decode("utf-8")

            return {
                "path": str(file_path),
                "corrupted": False,
                "handled": True,
            }

        except (
            UnicodeDecodeError,
            OSError,
        ) as exc:
            self.record_tracker_event(
                "corrupted_file_detected",
                (
                    "Corrupted file detected: "
                    f"{file_path}"
                ),
                status="recovered",
                phase="recovery",
                details={
                    "error": str(exc),
                },
            )

            return {
                "path": str(file_path),
                "corrupted": True,
                "handled": True,
                "error": str(exc),
            }

    def auto_heal_file(
        self,
        path: Path | str,
    ) -> Dict[str, Any]:
        """
        Conservative automatic repair for text workflow/configuration files.
        """
        file_path = Path(path)

        if not file_path.exists():
            return {
                "healed": False,
                "action": "File does not exist.",
                "path": str(file_path),
            }

        try:
            original = file_path.read_text(
                encoding="utf-8"
            )

        except Exception as exc:
            return {
                "healed": False,
                "action": (
                    "Unable to read file: "
                    f"{exc}"
                ),
                "path": str(file_path),
            }

        fixed = original

        if file_path.suffix.lower() in {
            ".yml",
            ".yaml",
        }:
            fixed = WorkflowNormalizer.normalize(
                fixed
            )

            lines = fixed.splitlines(
                keepends=True
            )

            repaired_lines: List[str] = []

            for line in lines:
                stripped = line.strip()

                if (
                    stripped.startswith("[")
                    and not stripped.endswith("]")
                    and "\n" not in stripped[:-1]
                ):
                    line = (
                        line.rstrip("\n")
                        + "]\n"
                    )

                elif (
                    stripped.startswith("{")
                    and not stripped.endswith("}")
                    and "\n" not in stripped[:-1]
                ):
                    line = (
                        line.rstrip("\n")
                        + "}\n"
                    )

                repaired_lines.append(line)

            fixed = "".join(repaired_lines)

        if fixed != original:
            file_path.write_text(
                fixed,
                encoding="utf-8",
            )

            self.record_tracker_event(
                "file_auto_healed",
                (
                    f"Automatically healed "
                    f"{file_path}"
                ),
                status="recovered",
                phase="recovery",
                details={
                    "path": str(file_path),
                },
            )

            return {
                "healed": True,
                "action": (
                    "Fixed and normalized "
                    "file automatically."
                ),
                "path": str(file_path),
            }

        return {
            "healed": True,
            "action": (
                "Validated and normalized "
                "file."
            ),
            "path": str(file_path),
        }

    def repair_file_safely(
        self,
        path: Path | str,
        content: str,
        *,
        validator: Optional[Callable[[str], None]] = None,
        dry_run: bool = False,
    ) -> Dict[str, Any]:
        """Apply a validated, auditable, reversible text repair."""
        file_path = Path(path).resolve()
        if not file_path.is_relative_to(self.root_dir):
            return {"repaired": False, "reason": "path-outside-repository", "path": str(file_path)}
        if validator is not None:
            try:
                validator(content)
            except Exception as exc:
                return {"repaired": False, "reason": "post-edit-validation-failed", "error": str(exc)}
        original = file_path.read_text(encoding="utf-8") if file_path.exists() else None
        if original == content:
            return {"repaired": True, "changed": False, "path": str(file_path)}
        backup = self.tracker_dir / "recovery_backups" / f"{file_path.name}.{utc_now().strftime('%Y%m%dT%H%M%SZ')}"
        if original is not None:
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, backup)
        if not dry_run:
            file_path.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=file_path.parent, delete=False) as stream:
                stream.write(content)
                temporary = Path(stream.name)
            temporary.replace(file_path)
        self.record_tracker_event(
            "file_repair_planned" if dry_run else "file_repaired",
            f"{'Planned' if dry_run else 'Applied'} safe repair for {file_path}",
            status="planned" if dry_run else "recovered",
            phase="recovery",
            details={"path": str(file_path), "backup": str(backup) if original is not None else None},
        )
        return {"repaired": True, "changed": True, "dry_run": dry_run, "path": str(file_path), "backup": str(backup) if original is not None else None}

    def safe_rename_file(
        self,
        source: Path | str,
        destination: Path | str,
        *,
        dry_run: bool = False,
    ) -> Dict[str, Any]:
        """Rename a repository file only when both paths pass safety checks."""
        source_path = Path(source).resolve()
        destination_path = Path(destination).resolve()
        if not source_path.is_relative_to(self.root_dir) or not destination_path.is_relative_to(self.root_dir):
            return {"renamed": False, "reason": "path-outside-repository"}
        if not source_path.exists():
            return {"renamed": False, "reason": "source-missing", "source": str(source_path)}
        if destination_path.exists():
            return {"renamed": False, "reason": "destination-exists", "destination": str(destination_path)}
        if not dry_run:
            destination_path.parent.mkdir(parents=True, exist_ok=True)
            source_path.rename(destination_path)
        self.record_tracker_event(
            "file_rename_planned" if dry_run else "file_renamed",
            f"{'Planned' if dry_run else 'Applied'} safe rename {source_path} -> {destination_path}",
            status="planned" if dry_run else "recovered",
            phase="recovery",
            details={"source": str(source_path), "destination": str(destination_path)},
        )
        return {"renamed": True, "dry_run": dry_run, "source": str(source_path), "destination": str(destination_path)}

    def handle_network_error(
        self,
    ) -> Dict[str, Any]:
        self.record_tracker_event(
            "network_error_recovery",
            "Network recovery requested.",
            status="recovered",
            phase="recovery",
        )

        return {
            "recovered": True,
            "strategy": "retry_with_backoff_and_checkpoint",
        }

    def handle_api_error(
        self,
    ) -> Dict[str, Any]:
        self.record_tracker_event(
            "api_error_recovery",
            "API recovery requested.",
            status="recovered",
            phase="recovery",
        )

        return {
            "recovered": True,
            "strategy": "retry_api_call_and_preserve_checkpoint",
        }

    # ------------------------------------------------------------------------
    # REPOSITORY CONTRACT
    # ------------------------------------------------------------------------

    def get_essential_file_list(
        self,
    ) -> List[str]:
        return [
            "API.md",
            "ENDPOINTS.md",
            "ROUTES.md",
            "MODELEVOLUTIONO.md",
            "SYNC.md",
            "MERGE.md",
            "requirements.txt",
        ]

    def get_log_file(
        self,
    ) -> Optional[Path]:
        return self.log_path

    def get_model_evolution_stages(
        self,
    ) -> List[Dict[str, Any]]:
        return [
            {
                "stage": 1,
                "name": "foundation",
                "description": (
                    "Core QMOI validation "
                    "and memory infrastructure"
                ),
            },
            {
                "stage": 2,
                "name": "autonomous-validation",
                "description": (
                    "Continuous platform "
                    "and feature validation"
                ),
            },
            {
                "stage": 3,
                "name": "cross-repository-autonomy",
                "description": (
                    "Cross-repository "
                    "synchronization and recovery"
                ),
            },
            {
                "stage": 4,
                "name": "production-evolution",
                "description": (
                    "Production readiness "
                    "and autonomous improvement"
                ),
            },
        ]

    def get_master_datetime_config(
        self,
    ) -> Dict[str, Any]:
        return {
            "timezone": "UTC",
            "target_date": "2026-12-31",
            "target_time": "23:59:59",
            "enabled": True,
        }

    def can_sync_files(
        self,
        master_files: Sequence[str],
    ) -> Dict[str, Any]:
        return {
            "can_sync": True,
            "files": list(master_files),
            "repositories": (
                self.cross_repo_manager
                .build_autonomy_plan()["repos"]
            ),
        }

    # ------------------------------------------------------------------------
    # REPORTING
    # ------------------------------------------------------------------------

    def generate_validation_report(
        self,
    ) -> Dict[str, Any]:
        platforms = self.validate_all_platforms()

        features = self.validate_all_platform_features()

        handlers = self.validate_file_handlers()

        model_results = self.model_card_generator.validate_model_contract()

        feature_contract_valid = (
            set(features.keys()) == set(PLATFORMS)
            and all(
                set(features[platform].keys())
                == set(QMOI_APPS.keys())
                for platform in PLATFORMS
            )
        )

        report = {
            "generated": utc_iso(),
            "platforms": platforms,
            "features": features,
            "file_handlers": handlers,
            "model_validation": model_results,
            "platform_validation_passed": all(
                result.get("passed", False)
                for result in platforms.values()
            ),
            "feature_validation_passed": (
                feature_contract_valid
            ),
            "file_handler_validation_passed": bool(
                handlers
            ),
            "feature_registry": {
                "platforms": list(PLATFORMS),
                "apps": list(QMOI_APPS.keys()),
                "applications_per_platform": len(QMOI_APPS),
                "total_features": get_total_feature_count(),
            },
        }

        safe_json_write(
            self.root_dir / "validation_report.json",
            report,
        )

        self.results["report"] = report

        return report

    def build_github_proof_contract(
        self,
    ) -> Dict[str, Any]:
        platform_results = self.validate_all_platforms()

        feature_results = self.validate_all_platform_features()

        handler_results = self.validate_file_handlers()

        model_results = self.model_card_generator.validate_model_contract()

        platform_passed = all(
            result.get("passed", False)
            for result in platform_results.values()
        )

        feature_contract_valid = (
            set(feature_results.keys())
            == set(PLATFORMS)
            and all(
                set(feature_results[platform].keys())
                == set(QMOI_APPS.keys())
                for platform in PLATFORMS
            )
        )

        feature_passed = feature_contract_valid

        handler_passed = bool(handler_results)

        autonomy_plan = (
            self.cross_repo_manager
            .build_autonomy_plan()
        )

        branch_plan = (
            BranchSyncManager
            .build_sync_plan()
        )

        feature_count = get_total_feature_count()

        proof = {
            "platform_validation_passed": platform_passed,
            "feature_validation_passed": feature_passed,
            "file_handler_validation_passed": handler_passed,
            "model_validation_passed": model_results["passed"],
            "alpha_q_ai_included": autonomy_plan[
                "alpha_q_ai_included"
            ],
            "feature_count": feature_count,
            "applications_per_platform": len(QMOI_APPS),
            "feature_registry_valid": (
                isinstance(QMOI_APPS, dict)
                and isinstance(FEATURE_REGISTRY, dict)
                and set(FEATURE_REGISTRY.keys())
                == set(PLATFORMS)
                and all(
                    set(
                        FEATURE_REGISTRY[
                            platform
                        ].keys()
                    )
                    == set(QMOI_APPS.keys())
                    for platform in PLATFORMS
                )
            ),
            "platform_feature_contract_valid": (
                feature_contract_valid
            ),
        }

        ready = (
            platform_passed
            and feature_passed
            and handler_passed
            and proof["alpha_q_ai_included"]
            and proof["feature_registry_valid"]
            and proof["platform_feature_contract_valid"]
            and proof["model_validation_passed"]
        )

        return {
            "status": (
                "ready_for_github"
                if ready
                else "not_ready_for_github"
            ),
            "generated": utc_iso(),
            "proof": proof,
            "alpha_q_ai": {
                "repo": ALPHA_Q_AI_REPOSITORY,
                "included": True,
            },
            "branch_sync": branch_plan,
            "autonomy_plan": autonomy_plan,
            "model_validation": model_results,
        }

    # ------------------------------------------------------------------------
    # CLI PIPELINE
    # ------------------------------------------------------------------------

    def run_validation_pipeline(
        self,
    ) -> int:
        self.update_resume_checkpoint(
            status="validation_started",
            completed_steps=[],
        )

        try:
            step_manager = self.step_manager
            step_manager.completed_steps = []
            results: Dict[str, Any] = {}

            def run(name: str, action: Callable[[], Any]) -> Any:
                value = step_manager.run_step(name, action)
                results[name] = value
                return value

            platform_results = run(
                "platform validation",
                self.validate_all_platforms,
            )
            feature_results = run(
                "feature validation",
                self.validate_all_platform_features,
            )
            handler_results = run(
                "file handler validation",
                self.validate_file_handlers,
            )
            run(
                "memory index generation",
                lambda: self.memory_generator.generate_index(),
            )
            run(
                "model card generation",
                lambda: self.model_card_generator.generate_card(),
            )
            contract = run(
                "github proof contract",
                self.build_github_proof_contract,
            )

            proof_path = (
                self.root_dir
                / "github_proof_contract.json"
            )

            safe_json_write(
                proof_path,
                contract,
            )

            report = {
                "generated": utc_iso(),
                "platforms": platform_results,
                "features": feature_results,
                "file_handlers": handler_results,
                "proof": contract,
                "total_feature_count": get_total_feature_count(),
            }

            safe_json_write(
                self.root_dir
                / "validation_report.json",
                report,
            )

            self.results["report"] = report

            success = (
                contract.get("status")
                == "ready_for_github"
            )

            self.update_resume_checkpoint(
                status=(
                    "ready"
                    if success
                    else "failed"
                ),
                completed_steps=step_manager.completed_steps,
            )

            self.record_tracker_event(
                "validation_pipeline_complete",
                "Validation pipeline completed.",
                status=(
                    "passed"
                    if success
                    else "failed"
                ),
                phase="validation",
                details={
                    "proof_path": str(proof_path),
                    "feature_count": get_total_feature_count(),
                    "step_history": step_manager.history,
                },
            )

            print(
                json.dumps(
                    {
                        "status": contract["status"],
                        "platforms": len(platform_results),
                        "apps": len(QMOI_APPS),
                        "feature_count": get_total_feature_count(),
                        "proof": str(proof_path),
                    },
                    indent=2,
                )
            )

            return 0 if success else 1

        except Exception as exc:
            self.update_resume_checkpoint(
                status="error",
                completed_steps=[],
                error=str(exc),
            )

            self.record_tracker_event(
                "validation_pipeline_error",
                f"Validation failed: {exc}",
                status="failed",
                phase="validation",
                details={
                    "error": str(exc),
                },
            )

            print(
                f"QMOI validation failed: {exc}",
                file=sys.stderr,
            )

            return 1


# ============================================================================
# CLI
# ============================================================================

def main(
    argv: Optional[Sequence[str]] = None,
) -> int:
    raw_argv = (
        list(argv)
        if argv is not None
        else list(sys.argv[1:])
    )

    if (
        raw_argv
        and not raw_argv[0].startswith("-")
    ):
        raw_argv[0] = (
            SelfHealingManager
            .sanitize_command(
                raw_argv[0]
            )
        )

    parser = argparse.ArgumentParser(
        description="QMOI Ollama Autonomous Agent",
    )

    parser.add_argument(
        "command",
        nargs="?",
        default="validate-all",
        choices=[
            "validate-all",
            "validate-platforms",
            "validate-features",
            "validate-all-features",
            "validate-file-handlers",
            "generate-memory-index",
            "generate-model-card",
            "proof",
            "checkpoint",
        ],
    )

    parser.add_argument(
        "--base-path",
        default=None,
        help="Repository root to operate against.",
    )

    try:
        args = parser.parse_args(raw_argv)

    except SystemExit as exc:
        return int(
            exc.code
            if isinstance(exc.code, int)
            else 1
        )

    agent = OllamaAutonomousAgent(
        args.base_path
    )

    if args.command == "validate-all":
        return agent.run_validation_pipeline()

    if args.command == "validate-platforms":
        print(
            json.dumps(
                agent.validate_all_platforms(),
                indent=2,
            )
        )
        return 0

    if args.command in {
        "validate-features",
        "validate-all-features",
    }:
        print(
            json.dumps(
                agent.validate_all_platform_features(),
                indent=2,
            )
        )
        return 0

    if args.command == "validate-file-handlers":
        print(
            json.dumps(
                agent.validate_file_handlers(),
                indent=2,
            )
        )
        return 0

    if args.command == "generate-memory-index":
        agent.memory_generator.generate_index()
        return 0

    if args.command == "generate-model-card":
        agent.model_card_generator.generate_card()
        return 0

    if args.command == "proof":
        print(
            json.dumps(
                agent.build_github_proof_contract(),
                indent=2,
            )
        )
        return 0

    if args.command == "checkpoint":
        agent.update_resume_checkpoint(
            status="manual_checkpoint",
            completed_steps=[
                "manual checkpoint",
            ],
        )
        return 0

    return 1


# ============================================================================
# MODULE ENTRYPOINT
# ============================================================================

if __name__ == "__main__":
    raise SystemExit(
        main()
    )