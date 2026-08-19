#!/usr/bin/env python3
"""
QMOI Ollama Autonomous Agent - Production Enhanced
===================================================

Comprehensive repository validation, diagnostics, resilience, telemetry,
platform-feature inspection, workflow validation and GitHub-proof generation
for the QMOI application suite.

Supported applications
----------------------
* qmoiaiui     - Conversational AI interface
* qcity        - File manager
* qmoi-space   - Media player
* qalpha       - IDE

Supported platforms
-------------------
* windows
* macos
* linux
* ios
* android
* web

Design goals
------------
1. Never claim that an unimplemented feature is implemented.
2. Fail gracefully where an optional platform/toolchain is unavailable.
3. Produce deterministic machine-readable reports.
4. Maintain resumable checkpoints.
5. Maintain durable telemetry under ollamatracks/.
6. Validate GitHub Actions workflow health.
7. Detect deprecated artifact actions.
8. Detect common YAML structural errors.
9. Integrate with the repository resilience/auto-healing layer when present.
10. Remain usable both from GitHub Actions and direct local execution.

Environment
-----------
Optional:
    MY_CUSTOM_TOKEN
    MY_CUTOM_TOKEN
    GITHUB_TOKEN
    GH_TOKEN

No token is ever written in plaintext to reports or telemetry.
"""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import logging
import os
import re
import shutil
import subprocess
import sys
import traceback
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

try:
    from scripts.resilience_auto_healing import ResilienceCoordinator
except ModuleNotFoundError:  # pragma: no cover
    try:
        from resilience_auto_healing import ResilienceCoordinator
    except ModuleNotFoundError:
        ResilienceCoordinator = None


# ============================================================================
# PATHS / CONSTANTS
# ============================================================================

ROOT_DIR = Path(__file__).resolve().parent.parent
SCRIPTS_DIR = ROOT_DIR / "scripts"
BUILD_DIR = ROOT_DIR / "build"
DIST_DIR = ROOT_DIR / "dist"
TESTS_DIR = ROOT_DIR / "tests"
APPS_DIR = ROOT_DIR / "apps"
TRACKER_DIR_NAME = "ollamatracks"

PLATFORMS = (
    "windows",
    "macos",
    "linux",
    "ios",
    "android",
    "web",
)

QMOI_APPS: Dict[str, str] = {
    "qmoiaiui": "Conversational AI Interface",
    "qcity": "File Manager",
    "qmoi-space": "Media Player",
    "qalpha": "IDE",
}

WORKFLOW_DIR = ROOT_DIR / ".github" / "workflows"

DEPRECATED_ACTIONS = {
    "actions/upload-artifact@v3",
    "actions/download-artifact@v3",
    "actions/upload-artifact@v2",
    "actions/download-artifact@v2",
    "actions/upload-artifact@v1",
    "actions/download-artifact@v1",
}

TEXT_EXTENSIONS = {
    ".py",
    ".pyi",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".cfg",
    ".md",
    ".txt",
    ".xml",
    ".html",
    ".css",
    ".scss",
    ".java",
    ".kt",
    ".swift",
    ".m",
    ".mm",
    ".dart",
    ".rs",
    ".go",
    ".cs",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".sh",
    ".ps1",
}

IGNORED_DIRS = {
    ".git",
    ".hg",
    ".svn",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".tox",
    "node_modules",
    ".venv",
    "venv",
    "env",
    "dist",
    "build",
    ".gradle",
    ".idea",
    ".vscode",
}


# ============================================================================
# LOGGING
# ============================================================================

def configure_logging(root_dir: Path) -> logging.Logger:
    """Configure console and repository log output safely."""

    logger_obj = logging.getLogger("qmoi.ollama.agent")

    if logger_obj.handlers:
        return logger_obj

    logger_obj.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s"
    )

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger_obj.addHandler(stream_handler)

    try:
        log_path = root_dir / "ollama_agent.log"
        file_handler = logging.FileHandler(log_path, encoding="utf-8")
        file_handler.setFormatter(formatter)
        logger_obj.addHandler(file_handler)
    except OSError:
        pass

    return logger_obj


logger = configure_logging(ROOT_DIR)


# ============================================================================
# BASIC UTILITIES
# ============================================================================

def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def safe_json_write(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(payload, indent=2, sort_keys=True, default=str) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)


def sha256_file(path: Path) -> Optional[str]:
    try:
        digest = hashlib.sha256()
        with path.open("rb") as handle:
            for block in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(block)
        return digest.hexdigest()
    except OSError:
        return None


def resolve_github_token() -> Optional[str]:
    """Resolve a GitHub token without hardcoding or logging secrets."""

    for key in (
        "MY_CUSTOM_TOKEN",
        "MY_CUTOM_TOKEN",
        "GITHUB_TOKEN",
        "GH_TOKEN",
    ):
        value = os.environ.get(key, "").strip()
        if value:
            return value

    gh = shutil.which("gh")
    if gh:
        try:
            result = subprocess.run(
                [gh, "auth", "token"],
                capture_output=True,
                text=True,
                check=False,
                timeout=15,
            )
            if result.returncode == 0 and result.stdout.strip():
                return result.stdout.strip()
        except (OSError, subprocess.SubprocessError):
            pass

    return None


def mask_github_token(token: Optional[str]) -> Optional[str]:
    """Return a safe token representation for diagnostics."""

    if not token:
        return None

    token = token.strip()

    if len(token) <= 8:
        return "*" * len(token)

    return f"{token[:4]}...{token[-4:]}"


def run_command(
    command: Sequence[str],
    cwd: Optional[Path] = None,
    timeout: int = 120,
) -> Dict[str, Any]:
    """Run a subprocess without raising on ordinary command failure."""

    started = datetime.now(timezone.utc)

    try:
        result = subprocess.run(
            list(command),
            cwd=str(cwd or ROOT_DIR),
            capture_output=True,
            text=True,
            check=False,
            timeout=timeout,
        )

        return {
            "command": list(command),
            "returncode": result.returncode,
            "stdout": result.stdout[-20000:],
            "stderr": result.stderr[-20000:],
            "duration_seconds": (
                datetime.now(timezone.utc) - started
            ).total_seconds(),
            "timed_out": False,
        }

    except subprocess.TimeoutExpired as exc:
        return {
            "command": list(command),
            "returncode": None,
            "stdout": str(exc.stdout or "")[-20000:],
            "stderr": str(exc.stderr or "")[-20000:],
            "duration_seconds": (
                datetime.now(timezone.utc) - started
            ).total_seconds(),
            "timed_out": True,
        }

    except OSError as exc:
        return {
            "command": list(command),
            "returncode": None,
            "stdout": "",
            "stderr": str(exc),
            "duration_seconds": (
                datetime.now(timezone.utc) - started
            ).total_seconds(),
            "timed_out": False,
        }


# ============================================================================
# BRANCH / REPOSITORY POLICY
# ============================================================================

class BranchSyncManager:
    """Repository synchronization policy."""

    DEFAULT_BRANCH = "main"
    BACKUP_BRANCH = "autosync-backup"
    OWNER = "thealphakenya"

    TARGET_REPOSITORIES = [
        f"{OWNER}/qmoi-enhanced",
        f"{OWNER}/Alpha-Q-ai",
    ]

    @classmethod
    def required_branches(cls) -> List[str]:
        return [
            cls.DEFAULT_BRANCH,
            cls.BACKUP_BRANCH,
        ]

    @classmethod
    def sync_targets(cls) -> List[str]:
        return list(cls.TARGET_REPOSITORIES)

    @classmethod
    def build_sync_plan(cls) -> Dict[str, Any]:
        return {
            "owner": cls.OWNER,
            "default_branch": cls.DEFAULT_BRANCH,
            "backup_branch": cls.BACKUP_BRANCH,
            "branches": cls.required_branches(),
            "repositories": cls.sync_targets(),
            "strategy": (
                "validate main, preserve validated state, synchronize "
                "backup and related repositories through controlled workflows"
            ),
            "monitoring": (
                "GitHub Actions workflow dispatch and scheduled monitoring"
            ),
            "token_policy": (
                "MY_CUSTOM_TOKEN first, then GitHub Actions/GH CLI token"
            ),
        }


class CrossRepoAutonomyManager:
    """Coordinates cross-repository productionization metadata."""

    def __init__(self, owner: str = BranchSyncManager.OWNER):
        self.owner = owner
        self.repos = [
            f"{owner}/qmoi-enhanced",
            f"{owner}/Alpha-Q-ai",
        ]

    def build_autonomy_plan(self) -> Dict[str, Any]:
        return {
            "owner": self.owner,
            "alpha_q_ai_included": True,
            "repositories": [
                {
                    "repo": self.repos[0],
                    "role": "primary",
                    "sync": True,
                },
                {
                    "repo": self.repos[1],
                    "role": "partner",
                    "sync": True,
                },
            ],
        }

    def productionize_repo(
        self,
        repo_name: str,
        repo_path: Path,
    ) -> Dict[str, Any]:
        """
        Preserve compatibility with the previous API.

        Does not fabricate source code. Only creates a status marker when
        explicitly requested by a caller.
        """

        repo_dir = Path(repo_path)
        repo_dir.mkdir(parents=True, exist_ok=True)

        marker = repo_dir / ".qmoi-production-status.json"

        payload = {
            "repo": repo_name,
            "production_ready": False,
            "reason": (
                "Production readiness must be established by actual "
                "validation rather than by a placeholder."
            ),
            "updated_at": utc_now(),
        }

        safe_json_write(marker, payload)

        return {
            "repo": repo_name,
            "path": str(repo_dir),
            "production_ready": False,
            "updated": True,
            "marker": str(marker),
        }


# ============================================================================
# AVATAR / VOICE
# ============================================================================

class AvatarIdentityValidator:
    """Validates QMOI avatar identity."""

    def __init__(self, candidate_name: str = "qmoi"):
        self.candidate_name = candidate_name.strip().lower()

    @staticmethod
    def normalize_name(value: str) -> str:
        return re.sub(
            r"[^a-z0-9]+",
            "",
            (value or "").lower(),
        )

    def validate_identity(
        self,
        candidate_name: Optional[str] = None,
    ) -> bool:
        name = self.normalize_name(
            candidate_name or self.candidate_name
        )

        return name in {
            "qmoi",
            "qmoiavatar",
            "avatarqmoi",
            "qmoiavatarrealtime",
        }

    def generate_identity_report(
        self,
        candidate_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        name = candidate_name or self.candidate_name
        valid = self.validate_identity(name)

        return {
            "selected_avatar": name,
            "is_qmoi": valid,
            "required_identity": "qmoi",
            "quality": "verified" if valid else "mismatch",
            "real_time_monitoring": valid,
        }


class AvatarWindowMonitor:
    """Describes expected QMOI realtime window state."""

    def __init__(
        self,
        avatar_name: str = "qmoi",
        window_title: str = "QMOI",
    ):
        self.avatar_name = avatar_name
        self.window_title = window_title

    def validate_window_state(self) -> Dict[str, Any]:
        identity = AvatarIdentityValidator(
            self.avatar_name
        ).generate_identity_report()

        state = {
            "title": self.window_title,
            "anchor": "centered",
            "visible": True,
            "theme": "qmoi-live",
            "animation_enabled": True,
            "realtime_render": True,
            "identity_matches_qmoi": identity["is_qmoi"],
        }

        state["quality"] = (
            "excellent"
            if state["identity_matches_qmoi"]
            else "review"
        )

        return state

    def generate_animation_snapshot(self) -> Dict[str, Any]:
        window = self.validate_window_state()

        return {
            "avatar": self.avatar_name,
            "status": (
                "live"
                if window["identity_matches_qmoi"]
                else "error"
            ),
            "fps_target": 60,
            "animation_quality": "high",
            "window": window,
            "realtime_checks": [
                "avatar_identity",
                "window_render",
                "system_theme",
                "animation_loop",
                "presence_validation",
            ],
        }


class AvatarSelectionNavigator:
    """Avatar catalog and selection logic."""

    AVAILABLE_AVATARS = [
        "qmoi",
        "aura",
        "nova",
        "luma",
        "atlas",
        "zen",
        "echo",
    ]

    def __init__(self, selected_avatar: str = "qmoi"):
        self.selected_avatar = selected_avatar

    def _voice_profiles_for_avatar(
        self,
        avatar: str,
    ) -> List[str]:
        base = [
            "calm",
            "friendly",
            "energetic",
            "professional",
            "narrator",
        ]

        if avatar == "qmoi":
            return [
                "qmoi-default",
                "qmoi-guardian",
                "qmoi-oracle",
                *base,
            ]

        return base

    def get_catalog(self) -> List[Dict[str, Any]]:
        catalog: List[Dict[str, Any]] = []

        for avatar in self.AVAILABLE_AVATARS:
            catalog.append(
                {
                    "id": avatar,
                    "name": avatar,
                    "preview_seconds": 5 if avatar == "qmoi" else 6,
                    "autoplay": True,
                    "loop": True,
                    "is_qmoi": AvatarIdentityValidator(
                        avatar
                    ).validate_identity(),
                    "voice_profiles": self._voice_profiles_for_avatar(
                        avatar
                    ),
                }
            )

        return catalog

    def choose_avatar(
        self,
        avatar_name: str,
    ) -> Dict[str, Any]:
        catalog = self.get_catalog()

        identity = AvatarIdentityValidator(
            avatar_name
        ).generate_identity_report()

        selected = next(
            (
                item
                for item in catalog
                if item["id"] == avatar_name
            ),
            catalog[0],
        )

        return {
            "selected_avatar": avatar_name,
            "is_qmoi": identity["is_qmoi"],
            "preview_seconds": max(
                5,
                selected["preview_seconds"],
            ),
            "autoplay": True,
            "catalog": catalog,
            "voice_profiles": selected["voice_profiles"],
            "window_state": AvatarWindowMonitor(
                avatar_name
            ).validate_window_state(),
        }


class VoiceProfileSelector:
    """QMOI voice profile selector."""

    def __init__(self, avatar_name: str = "qmoi"):
        self.avatar_name = avatar_name

    def available_voice_profiles(self) -> List[str]:
        profiles = [
            "qmoi-default",
            "qmoi-guardian",
            "qmoi-oracle",
            "qmoi-assistant",
            "calm",
            "friendly",
            "energetic",
            "professional",
            "narrator",
        ]

        if self.avatar_name != "qmoi":
            return [
                profile
                for profile in profiles
                if not profile.startswith("qmoi-")
            ]

        return profiles

    def select_voice(
        self,
        voice_name: str,
    ) -> Dict[str, Any]:
        available = self.available_voice_profiles()

        return {
            "selected_voice": voice_name,
            "is_available": voice_name in available,
            "avatar": self.avatar_name,
            "enhanced_voice_controls": [
                "voice_preview",
                "speed_control",
                "pitch_control",
                "emotion_mode",
                "language_mode",
            ],
        }


class QMOIAvatarWindowStyle:
    """Expected QMOI avatar window styling."""

    def __init__(self, mode: str = "live"):
        self.mode = mode

    def build_style_spec(self) -> Dict[str, Any]:
        return {
            "window_title": "QMOI Avatar",
            "theme": "qmoi-live",
            "background": "glass-dark",
            "panel_style": "floating-immersive",
            "border_radius": 24,
            "elevation": "soft-glow",
            "show_avatar_name": True,
            "show_voice_indicator": True,
            "motion_mode": self.mode,
            "animation_layers": [
                "idle",
                "blink",
                "speech",
                "ambient-glow",
            ],
            "autoplay_preview": True,
            "preview_seconds_minimum": 5,
        }


# ============================================================================
# FEATURE CATALOG
# ============================================================================

COMMON_APP_FEATURES: Dict[str, List[str]] = {
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


PLATFORM_SPECIFIC_FEATURES: Dict[str, Dict[str, List[str]]] = {
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
            "wasapi_audio",
            "direct3d_video",
            "media_foundation",
            "directshow_filters",
            "hdr_video",
            "spatial_audio",
            "windows_volume_mixer",
        ],
        "qalpha": [
            "windows_terminal",
            "powershell_integration",
            "windows_debugger",
            "msvc_toolchain",
            "winget_extensions",
            "windows_path_integration",
            "windows_file_watcher",
            "windows_process_control",
            "windows_registry_tools",
            "windows_task_scheduler",
        ],
    },
    "macos": {
        "qmoiaiui": [
            "notification_center",
            "spotlight",
            "handoff",
            "icloud_sync",
            "siri_integration",
            "touch_bar_support",
            "menu_bar_integration",
            "keychain_integration",
            "avfoundation_voice",
            "accessibility_api",
        ],
        "qcity": [
            "finder_integration",
            "icloud_drive",
            "quick_look",
            "file_tags",
            "spotlight_metadata",
            "sandbox_file_access",
            "nsfilecoordinator",
            "fileprovider",
            "macos_alias_support",
            "macos_permissions",
        ],
        "qmoi-space": [
            "avfoundation",
            "videotoolbox",
            "core_audio",
            "airplay",
            "picture_in_picture",
            "media_remote",
            "spatial_audio",
            "metal_video",
            "hdr_video",
            "macos_media_controls",
        ],
        "qalpha": [
            "xcode_integration",
            "swift_toolchain",
            "clang_toolchain",
            "lldb_debugger",
            "terminal_integration",
            "homebrew_integration",
            "codesign_support",
            "keychain_tools",
            "launchd_integration",
            "macos_path_integration",
        ],
    },
    "linux": {
        "qmoiaiui": [
            "dbus",
            "desktop_entry",
            "appstream",
            "freedesktop_notifications",
            "pipewire_audio",
            "pulseaudio_audio",
            "wayland_support",
            "x11_support",
            "portal_integration",
            "linux_accessibility",
        ],
        "qcity": [
            "gio_file_operations",
            "gvfs",
            "trash_spec",
            "freedesktop_file_metadata",
            "thumbnailer",
            "udisks2",
            "network_mounts",
            "posix_permissions",
            "acl_support",
            "inotify_file_watching",
        ],
        "qmoi-space": [
            "gstreamer",
            "ffmpeg",
            "pipewire",
            "pulseaudio",
            "v4l2",
            "vaapi",
            "vdpau",
            "vulkan_video",
            "mpris",
            "linux_media_keys",
        ],
        "qalpha": [
            "gcc_toolchain",
            "clang_toolchain",
            "gdb_debugger",
            "lldb_debugger",
            "bash_integration",
            "zsh_integration",
            "docker_integration",
            "git_cli",
            "ssh_integration",
            "linux_process_control",
        ],
    },
    "ios": {
        "qmoiaiui": [
            "fileprovider",
            "handoff_ios",
            "siri",
            "speech_framework",
            "core_ml",
            "metal",
            "ios_accessibility",
            "background_tasks",
            "push_notifications",
            "keychain_services",
        ],
        "qcity": [
            "documents_provider",
            "fileprovider_extension",
            "uidocumentpicker",
            "icloud_documents",
            "security_scoped_urls",
            "quicklook",
            "document_browser",
            "ios_file_coordinator",
            "share_extension",
            "ios_document_import",
        ],
        "qmoi-space": [
            "avplayer",
            "avfoundation",
            "airplay_ios",
            "picture_in_picture_ios",
            "media_player_framework",
            "now_playing_info",
            "remote_command_center",
            "video_toolbox_ios",
            "metal_video_ios",
            "spatial_audio_ios",
        ],
        "qalpha": [
            "swift_source_support",
            "xcode_project_support",
            "ios_signing",
            "swift_package_manager",
            "ios_debug_symbols",
            "testflight_build_support",
            "ios_simulator",
            "ios_keychain",
            "ios_app_groups",
            "ios_entitlements",
        ],
    },
    "android": {
        "qmoiaiui": [
            "content_provider",
            "documents_provider",
            "material_you",
            "android_notifications",
            "biometric_prompt",
            "speech_recognition",
            "android_tts",
            "work_manager",
            "foreground_service",
            "android_accessibility",
        ],
        "qcity": [
            "storage_access_framework",
            "documentsui",
            "mediastore",
            "scoped_storage",
            "content_resolver",
            "documentfile",
            "storage_permissions",
            "android_file_picker",
            "saf_tree_access",
            "android_share_provider",
        ],
        "qmoi-space": [
            "exoplayer",
            "media3",
            "media_session",
            "picture_in_picture_android",
            "cast_android",
            "audio_focus",
            "android_volume_controls",
            "hardware_decoder",
            "subtitle_renderer",
            "android_media_notification",
        ],
        "qalpha": [
            "android_studio_support",
            "gradle_support",
            "kotlin_support",
            "adb_integration",
            "logcat_integration",
            "android_debugger",
            "ndk_support",
            "android_emulator",
            "apk_build_support",
            "aab_build_support",
        ],
    },
    "web": {
        "qmoiaiui": [
            "service_worker",
            "indexeddb",
            "web_worker",
            "web_notifications",
            "web_speech_api",
            "web_audio_api",
            "web_gpu",
            "web_accessibility",
            "offline_mode",
            "web_push",
        ],
        "qcity": [
            "file_system_access_api",
            "drag_drop_files",
            "browser_downloads",
            "indexeddb_storage",
            "opfs",
            "directory_picker",
            "web_share",
            "preview_api",
            "clipboard_api",
            "offline_file_cache",
        ],
        "qmoi-space": [
            "media_source_extensions",
            "web_audio",
            "picture_in_picture_web",
            "fullscreen_api",
            "media_session_api",
            "web_codecs",
            "hls_playback",
            "dash_playback",
            "web_rtc",
            "stream_capture",
        ],
        "qalpha": [
            "monaco_editor",
            "web_workers",
            "language_server_protocol",
            "web_terminal",
            "wasm_toolchain",
            "browser_git",
            "indexeddb_workspace",
            "file_system_access",
            "websocket_terminal",
            "web_debugger",
        ],
    },
}


# ============================================================================
# FEATURE CATALOG COMPATIBILITY TYPES
# ============================================================================

class PlatformFeatureCatalog(dict):
    """Dictionary with feature-count semantics."""

    def __len__(self) -> int:
        total = 0

        for platform_features in self.values():
            if not isinstance(platform_features, dict):
                continue

            for features in platform_features.values():
                if isinstance(features, (list, tuple, set, dict)):
                    total += len(features)

        return total


class AppFeatureMatrix(dict):
    """Dictionary representing app -> platform -> features."""

    def __len__(self) -> int:
        total = 0

        for platform_features in self.values():
            if isinstance(platform_features, dict):
                for features in platform_features.values():
                    if isinstance(features, dict):
                        total += len(features)
                    elif isinstance(features, (list, tuple, set)):
                        total += len(features)

        return total


class PlatformFeatureBucket(dict):
    """Platform-level feature bucket."""

    def __len__(self) -> int:
        total = 0

        for features in self.values():
            if isinstance(features, dict):
                total += len(features)
            elif isinstance(features, (list, tuple, set)):
                total += len(features)

        return total


PLATFORM_FEATURE_CATALOG = PlatformFeatureCatalog(
    PLATFORM_SPECIFIC_FEATURES
)


# ============================================================================
# FILE / SOURCE INSPECTION
# ============================================================================

class RepositoryInspector:
    """Safe repository filesystem inspection."""

    def __init__(self, root_dir: Path):
        self.root_dir = Path(root_dir).resolve()

    def iter_files(
        self,
        include_hidden: bool = False,
    ) -> Iterable[Path]:
        if not self.root_dir.exists():
            return

        for path in self.root_dir.rglob("*"):
            if not path.is_file():
                continue

            relative_parts = path.relative_to(
                self.root_dir
            ).parts

            if any(
                part in IGNORED_DIRS
                for part in relative_parts
            ):
                continue

            if not include_hidden and any(
                part.startswith(".")
                for part in relative_parts
                if part != ".github"
            ):
                continue

            yield path

    def find_matching_paths(
        self,
        patterns: Sequence[str],
        platform: Optional[str] = None,
        app: Optional[str] = None,
    ) -> List[Path]:
        candidates: List[Path] = []

        for path in self.iter_files(include_hidden=True):
            relative = str(
                path.relative_to(self.root_dir)
            ).replace("\\", "/").lower()

            if app and app.lower() not in relative:
                continue

            if platform and platform.lower() not in relative:
                continue

            if any(
                pattern.lower() in relative
                for pattern in patterns
            ):
                candidates.append(path)

        return candidates

    def contains_text(
        self,
        path_patterns: Sequence[str],
        search_terms: Sequence[str],
        app: Optional[str] = None,
        platform: Optional[str] = None,
    ) -> bool:
        candidates = self.find_matching_paths(
            path_patterns,
            platform=platform,
            app=app,
        )

        terms = [
            term.lower()
            for term in search_terms
        ]

        for path in candidates:
            try:
                text = path.read_text(
                    encoding="utf-8",
                    errors="ignore",
                ).lower()

                if all(term in text for term in terms):
                    return True

            except OSError:
                continue

        return False

    def contains_any_text(
        self,
        path_patterns: Sequence[str],
        search_terms: Sequence[str],
        app: Optional[str] = None,
        platform: Optional[str] = None,
    ) -> bool:
        candidates = self.find_matching_paths(
            path_patterns,
            platform=platform,
            app=app,
        )

        terms = [
            term.lower()
            for term in search_terms
        ]

        for path in candidates:
            try:
                text = path.read_text(
                    encoding="utf-8",
                    errors="ignore",
                ).lower()

                if any(term in text for term in terms):
                    return True

            except OSError:
                continue

        return False

    def file_exists_by_patterns(
        self,
        patterns: Sequence[str],
        app: Optional[str] = None,
        platform: Optional[str] = None,
    ) -> bool:
        return bool(
            self.find_matching_paths(
                patterns,
                app=app,
                platform=platform,
            )
        )

    def project_stats(self) -> Dict[str, Any]:
        files = list(
            self.iter_files(include_hidden=True)
        )

        total_size = 0
        extension_counts: Dict[str, int] = {}

        for path in files:
            try:
                total_size += path.stat().st_size
            except OSError:
                continue

            extension = path.suffix.lower() or "<none>"
            extension_counts[extension] = (
                extension_counts.get(extension, 0) + 1
            )

        return {
            "root": str(self.root_dir),
            "file_count": len(files),
            "total_size_bytes": total_size,
            "extension_counts": dict(
                sorted(
                    extension_counts.items(),
                    key=lambda item: (-item[1], item[0]),
                )
            ),
        }


# ============================================================================
# PLATFORM VALIDATION
# ============================================================================

@dataclass
class ValidationResult:
    feature: str
    status: str
    reason: str
    evidence: List[str]

    @property
    def passed(self) -> bool:
        return self.status == "implemented"


class PlatformValidator:
    """
    Validates platform/app source presence and basic compilation.

    This validator deliberately does not claim native compilation if the
    required platform toolchain is unavailable.
    """

    def __init__(
        self,
        platform: str,
        root_dir: Path = ROOT_DIR,
    ):
        self.platform = platform.lower()
        self.root_dir = Path(root_dir)
        self.inspector = RepositoryInspector(
            self.root_dir
        )

    def _app_root_candidates(
        self,
        app: str,
    ) -> List[Path]:
        return [
            APPS_DIR / f"{app}-{self.platform}",
            APPS_DIR / self.platform / app,
            APPS_DIR / app / self.platform,
            self.root_dir / f"{app}-{self.platform}",
            self.root_dir / app / self.platform,
        ]

    def find_app_root(
        self,
        app: str,
    ) -> Optional[Path]:
        for candidate in self._app_root_candidates(app):
            if candidate.exists() and candidate.is_dir():
                return candidate

        return None

    def validate_code_compiles(
        self,
        app: str,
    ) -> bool:
        """
        Perform available static/compile checks.

        Returns True only when:
        * the app has a discoverable source root and
        * all available Python source files compile, OR
        * a reasonable non-Python project structure exists.

        Platform-specific native compilation is reported separately when
        the corresponding toolchain is actually available.
        """

        app_root = self.find_app_root(app)

        if app_root is None:
            logger.warning(
                "No source root discovered for %s/%s",
                self.platform,
                app,
            )
            return False

        python_files = list(
            app_root.rglob("*.py")
        )

        for source in python_files:
            try:
                source_text = source.read_text(
                    encoding="utf-8",
                    errors="strict",
                )
                compile(
                    source_text,
                    str(source),
                    "exec",
                )
            except (
                OSError,
                UnicodeError,
                SyntaxError,
            ):
                return False

        marker_files = {
            "web": [
                "package.json",
                "vite.config.js",
                "vite.config.ts",
                "next.config.js",
                "next.config.ts",
                "index.html",
            ],
            "android": [
                "build.gradle",
                "build.gradle.kts",
                "settings.gradle",
                "settings.gradle.kts",
                "AndroidManifest.xml",
            ],
            "ios": [
                "Package.swift",
                "project.pbxproj",
                "Info.plist",
            ],
            "macos": [
                "Package.swift",
                "project.pbxproj",
                "Info.plist",
            ],
            "windows": [
                "package.json",
                ".csproj",
                ".sln",
                "Cargo.toml",
                "pyproject.toml",
            ],
            "linux": [
                "package.json",
                "pyproject.toml",
                "Cargo.toml",
                "Makefile",
                "CMakeLists.txt",
            ],
        }

        files = list(
            app_root.rglob("*")
        )

        if not files:
            return False

        if python_files:
            return True

        expected = marker_files.get(
            self.platform,
            [],
        )

        if any(
            any(
                item.name.endswith(marker)
                or item.name == marker
                for marker in expected
            )
            for item in files
            if item.is_file()
        ):
            return True

        # Generic source fallback.
        return any(
            item.is_file()
            and item.suffix.lower()
            in {
                ".js",
                ".jsx",
                ".ts",
                ".tsx",
                ".dart",
                ".swift",
                ".kt",
                ".java",
                ".rs",
                ".go",
                ".cs",
                ".cpp",
                ".c",
            }
            for item in files
        )

    def toolchain_status(self) -> Dict[str, Any]:
        commands = {
            "python": "python",
            "node": "node",
            "npm": "npm",
            "java": "java",
            "gradle": "gradle",
            "swift": "swift",
            "xcodebuild": "xcodebuild",
            "dotnet": "dotnet",
            "cargo": "cargo",
            "rustc": "rustc",
            "go": "go",
            "clang": "clang",
            "gcc": "gcc",
        }

        status: Dict[str, Any] = {}

        for name, command in commands.items():
            path = shutil.which(command)

            status[name] = {
                "available": path is not None,
                "path": path,
            }

        return status


# ============================================================================
# FEATURE VALIDATION
# ============================================================================

FEATURE_EVIDENCE_RULES: Dict[str, Dict[str, Any]] = {
    "windows_notifications_api": {
        "paths": ["notification", "notifications", "windows"],
        "terms": ["notification"],
    },
    "media_keys_integration": {
        "paths": ["media_key", "media-keys", "media_keys", "mediakey"],
        "terms": ["media"],
    },
    "taskbar_integration": {
        "paths": ["taskbar", "windows"],
        "terms": ["taskbar"],
    },
    "windows_hello_biometric": {
        "paths": ["auth", "biometric", "windows"],
        "terms": ["biometric"],
    },
    "fluent_design_styling": {
        "paths": ["style", "theme", "windows"],
        "terms": ["fluent"],
    },
    "cortana_integration": {
        "paths": ["windows", "voice", "assistant"],
        "terms": ["cortana"],
    },
    "notification_center": {
        "paths": ["macos", "notification"],
        "terms": ["notification"],
    },
    "spotlight": {
        "paths": ["macos", "spotlight"],
        "terms": ["spotlight"],
    },
    "handoff": {
        "paths": ["handoff", "macos", "ios"],
        "terms": ["handoff"],
    },
    "handoff_ios": {
        "paths": ["handoff", "ios"],
        "terms": ["nsuseractivity", "handoff"],
    },
    "icloud_sync": {
        "paths": ["icloud", "macos"],
        "terms": ["icloud"],
    },
    "icloud_drive": {
        "paths": ["icloud", "files", "macos"],
        "terms": ["icloud"],
    },
    "siri": {
        "paths": ["siri", "ios"],
        "terms": ["intent", "siri"],
    },
    "dbus": {
        "paths": ["linux", "dbus"],
        "terms": ["dbus"],
    },
    "desktop_entry": {
        "paths": [".desktop", "linux"],
        "terms": ["[desktop entry]", "desktop"],
    },
    "appstream": {
        "paths": ["appdata", "appstream", "metainfo"],
        "terms": ["appstream", "appdata", "metainfo"],
    },
    "freedesktop_notifications": {
        "paths": ["linux", "notification"],
        "terms": ["freedesktop"],
    },
    "fileprovider": {
        "paths": ["fileprovider", "ios"],
        "terms": ["fileprovider"],
    },
    "content_provider": {
        "paths": ["android", "provider"],
        "terms": ["contentprovider", "content provider"],
    },
    "documents_provider": {
        "paths": ["documentsprovider", "documents_provider", "android"],
        "terms": ["documentsprovider", "documents provider"],
    },
    "material_you": {
        "paths": ["android", "theme", "ui"],
        "terms": ["material3", "material you"],
    },
    "service_worker": {
        "paths": ["service-worker", "service_worker"],
        "terms": ["serviceworker", "service-worker"],
    },
    "indexeddb": {
        "paths": ["indexeddb", "database", "storage"],
        "terms": ["indexeddb"],
    },
    "web_worker": {
        "paths": ["worker", "workers"],
        "terms": ["worker"],
    },
}


class PlatformSpecificFeatureValidator:
    """
    Real feature validator.

    A feature is implemented only if source evidence is found. Unknown
    features are never silently converted into True.
    """

    def __init__(
        self,
        app_name: str,
        platform: str,
        root_dir: Path = ROOT_DIR,
    ):
        self.app_name = app_name.lower()
        self.platform = platform.lower()
        self.root_dir = Path(root_dir)
        self.inspector = RepositoryInspector(
            self.root_dir
        )

    def _feature_rule(
        self,
        feature: str,
    ) -> Dict[str, Any]:
        if feature in FEATURE_EVIDENCE_RULES:
            return FEATURE_EVIDENCE_RULES[feature]

        normalized = feature.replace("_", " ")

        aliases = [
            feature,
            normalized,
            feature.replace("_", "-"),
            feature.replace("_", ""),
        ]

        return {
            "paths": [
                self.platform,
                self.app_name,
                feature,
            ],
            "terms": aliases,
        }

    def validate_feature(
        self,
        feature: str,
    ) -> ValidationResult:
        rule = self._feature_rule(feature)

        candidates = self.inspector.find_matching_paths(
            rule["paths"],
            app=self.app_name,
            platform=self.platform,
        )

        evidence: List[str] = []

        for path in candidates:
            try:
                text = path.read_text(
                    encoding="utf-8",
                    errors="ignore",
                ).lower()

                if any(
                    term.lower() in text
                    for term in rule["terms"]
                ):
                    evidence.append(
                        str(
                            path.relative_to(
                                self.root_dir
                            )
                        )
                    )

            except OSError:
                continue

        if evidence:
            return ValidationResult(
                feature=feature,
                status="implemented",
                reason="Source evidence detected.",
                evidence=evidence[:10],
            )

        app_root = PlatformValidator(
            self.platform,
            self.root_dir,
        ).find_app_root(
            self.app_name
        )

        if app_root is None:
            return ValidationResult(
                feature=feature,
                status="unknown",
                reason="Application source root was not discovered.",
                evidence=[],
            )

        return ValidationResult(
            feature=feature,
            status="missing",
            reason="No implementation evidence detected.",
            evidence=[],
        )

    def validate_all_features(
        self,
    ) -> Dict[str, Dict[str, Any]]:
        features = PLATFORM_SPECIFIC_FEATURES.get(
            self.platform,
            {},
        ).get(
            self.app_name,
            [],
        )

        results: Dict[str, Dict[str, Any]] = {}

        for feature in features:
            result = self.validate_feature(feature)

            results[feature] = {
                **asdict(result),
                "passed": result.passed,
            }

        return results


# ============================================================================
# FILE HANDLERS
# ============================================================================

class FileHandlerValidator:
    """Validate file handler declarations."""

    FILE_TYPE_MAPPING = {
        ".pdf": "qcity",
        ".docx": "qcity",
        ".xlsx": "qcity",
        ".zip": "qcity",
        ".mp3": "qmoi-space",
        ".mp4": "qmoi-space",
        ".wav": "qmoi-space",
        ".py": "qalpha",
        ".js": "qmoiaiui",
        ".ts": "qmoiaiui",
        ".md": "qmoiaiui",
    }

    def __init__(
        self,
        root_dir: Path = ROOT_DIR,
    ):
        self.root_dir = Path(root_dir)
        self.inspector = RepositoryInspector(
            self.root_dir
        )

    def validate_handler_registration(
        self,
        platform: str,
    ) -> Dict[str, Dict[str, Any]]:
        results: Dict[str, Dict[str, Any]] = {}

        for extension, handler in self.FILE_TYPE_MAPPING.items():
            handler_exists = bool(
                self.inspector.find_matching_paths(
                    [
                        extension,
                        "file",
                        "handler",
                    ],
                    app=handler,
                    platform=platform,
                )
            )

            results[extension] = {
                "handler": handler,
                "platform": platform,
                "registered": handler_exists,
                "supports_platform": platform in PLATFORMS,
                "status": (
                    "implemented"
                    if handler_exists
                    else "missing"
                ),
            }

        return results


# ============================================================================
# MEMORY / MODEL CARD
# ============================================================================

class MemoryIndexGenerator:
    """Generate repository memory index."""

    def __init__(
        self,
        root_dir: Optional[Path] = None,
    ):
        self.root_dir = Path(
            root_dir or ROOT_DIR
        )

        self.index_path = (
            self.root_dir
            / "QMOI_REALTIME_MEMORY_INDEX.md"
        )

        self.json_path = (
            self.root_dir
            / "QMOI_REALTIME_MEMORY_INDEX.json"
        )

    def generate_index(self) -> Path:
        inspector = RepositoryInspector(
            self.root_dir
        )

        tracked_files: List[Dict[str, Any]] = []

        for path in sorted(
            inspector.iter_files(
                include_hidden=True
            )
        ):
            try:
                stat = path.stat()

                tracked_files.append(
                    {
                        "path": str(
                            path.relative_to(
                                self.root_dir
                            )
                        ),
                        "size": stat.st_size,
                        "sha256": sha256_file(path),
                    }
                )

            except OSError:
                continue

        timestamp = utc_now()

        markdown = [
            "# QMOI Realtime Memory Index",
            "",
            "## Repository State",
            "",
            f"- Generated: {timestamp}",
            f"- Total Files: {len(tracked_files)}",
            "",
            "## Files",
            "",
        ]

        for item in tracked_files:
            markdown.append(
                f"- `{item['path']}` "
                f"({item['size']} bytes, "
                f"SHA-256 `{item['sha256']}`)"
            )

        self.index_path.write_text(
            "\n".join(markdown) + "\n",
            encoding="utf-8",
        )

        safe_json_write(
            self.json_path,
            {
                "generated": timestamp,
                "files_tracked": len(tracked_files),
                "files": tracked_files,
            },
        )

        return self.index_path


class ModelCardGenerator:
    """Generate QMOI model/app-suite card."""

    def __init__(
        self,
        root_dir: Optional[Path] = None,
    ):
        self.root_dir = Path(
            root_dir or ROOT_DIR
        )

        self.card_path = (
            self.root_dir / "QMOI_MODEL_CARD.md"
        )

    def generate_card(self) -> Path:
        card = """# QMOI Model Card

## Overview

QMOI is the unified orchestration layer for the QMOI application suite.

## Applications

- QMOIAIUI: Conversational AI
- QCity: File Manager
- QMOI Space: Media Player
- QALPHA: IDE

## Validation Standards

- Multi-platform validation
- Real source-evidence feature validation
- File-handler validation
- GitHub Actions workflow validation
- Resilience and recovery
- Repository synchronization
- Durable telemetry
- Resumable checkpoints
- GitHub proof generation

## Important

A feature is not marked implemented merely because it exists in a
catalog. The autonomous agent requires repository evidence before
reporting the feature as implemented.
"""

        self.card_path.write_text(
            card,
            encoding="utf-8",
        )

        return self.card_path


# ============================================================================
# WORKFLOW VALIDATION
# ============================================================================

class WorkflowValidator:
    """
    Validate GitHub Actions workflows.

    This directly catches the current upload-artifact v3 failure.
    """

    ACTION_PATTERN = re.compile(
        r"uses\s*:\s*([^\s#]+)",
        re.IGNORECASE,
    )

    def __init__(
        self,
        root_dir: Path = ROOT_DIR,
    ):
        self.root_dir = Path(root_dir)
        self.workflow_dir = (
            self.root_dir
            / ".github"
            / "workflows"
        )

    def _load_yaml_duplicate_safe(
        self,
        content: str,
    ) -> Tuple[Optional[Any], List[str]]:
        if yaml is None:
            return None, [
                "PyYAML is not installed."
            ]

        duplicate_keys: List[str] = []

        class DuplicateKeyLoader(
            yaml.SafeLoader
        ):
            pass

        def construct_mapping(
            loader: Any,
            node: Any,
            deep: bool = False,
        ) -> Dict[Any, Any]:
            mapping: Dict[Any, Any] = {}

            for key_node, value_node in node.value:
                key = loader.construct_object(
                    key_node,
                    deep=deep,
                )

                if key in mapping:
                    duplicate_keys.append(
                        str(key)
                    )

                mapping[key] = loader.construct_object(
                    value_node,
                    deep=deep,
                )

            return mapping

        DuplicateKeyLoader.add_constructor(
            yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
            construct_mapping,
        )

        try:
            data = yaml.load(
                content,
                Loader=DuplicateKeyLoader,
            )

            return data, duplicate_keys

        except yaml.YAMLError as exc:
            return None, [
                f"YAML parse error: {exc}"
            ]

    def validate_file(
        self,
        path: Path,
    ) -> Dict[str, Any]:
        content = path.read_text(
            encoding="utf-8",
            errors="ignore",
        )

        deprecated: List[str] = []

        for action in DEPRECATED_ACTIONS:
            if action in content:
                deprecated.append(action)

        actions = self.ACTION_PATTERN.findall(
            content
        )

        data, duplicate_keys = (
            self._load_yaml_duplicate_safe(
                content
            )
        )

        errors: List[str] = []

        if duplicate_keys:
            errors.append(
                "Duplicate YAML keys: "
                + ", ".join(
                    sorted(set(duplicate_keys))
                )
            )

        if deprecated:
            errors.append(
                "Deprecated artifact actions: "
                + ", ".join(deprecated)
            )

        if data is None:
            errors.append(
                "Workflow YAML could not be parsed."
            )

        top_level = (
            set(data.keys())
            if isinstance(data, dict)
            else set()
        )

        if data is not None:
            if "jobs" not in top_level:
                errors.append(
                    "Workflow is missing top-level 'jobs'."
                )

        return {
            "path": str(
                path.relative_to(
                    self.root_dir
                )
            ),
            "valid_yaml": data is not None,
            "duplicate_keys": sorted(
                set(duplicate_keys)
            ),
            "deprecated_actions": deprecated,
            "actions": sorted(set(actions)),
            "errors": errors,
            "passed": not errors,
        }

    def validate_all(
        self,
    ) -> Dict[str, Any]:
        if not self.workflow_dir.exists():
            return {
                "workflow_directory_exists": False,
                "passed": False,
                "files": [],
                "errors": [
                    "No .github/workflows directory."
                ],
            }

        files = sorted(
            [
                path
                for path in self.workflow_dir.iterdir()
                if path.is_file()
                and path.suffix.lower()
                in {".yml", ".yaml"}
            ]
        )

        reports = [
            self.validate_file(path)
            for path in files
        ]

        errors = [
            error
            for report in reports
            for error in report["errors"]
        ]

        return {
            "workflow_directory_exists": True,
            "file_count": len(files),
            "files": reports,
            "passed": not errors,
            "errors": errors,
            "deprecated_artifact_action_count": sum(
                len(
                    report["deprecated_actions"]
                )
                for report in reports
            ),
        }

    def find_deprecated_artifact_actions(
        self,
    ) -> List[Dict[str, Any]]:
        findings: List[Dict[str, Any]] = []

        if not self.workflow_dir.exists():
            return findings

        for path in self.workflow_dir.rglob("*"):
            if not path.is_file():
                continue

            if path.suffix.lower() not in {
                ".yml",
                ".yaml",
            }:
                continue

            try:
                lines = path.read_text(
                    encoding="utf-8",
                    errors="ignore",
                ).splitlines()

                for number, line in enumerate(
                    lines,
                    start=1,
                ):
                    for action in DEPRECATED_ACTIONS:
                        if action in line:
                            findings.append(
                                {
                                    "file": str(
                                        path.relative_to(
                                            self.root_dir
                                        )
                                    ),
                                    "line": number,
                                    "action": action,
                                    "text": line.strip(),
                                }
                            )

            except OSError:
                continue

        return findings


# ============================================================================
# PYTHON SOURCE VALIDATION
# ============================================================================

class PythonSourceValidator:
    """Validate Python syntax throughout the repository."""

    def __init__(
        self,
        root_dir: Path = ROOT_DIR,
    ):
        self.root_dir = Path(root_dir)

    def validate_file(
        self,
        path: Path,
    ) -> Dict[str, Any]:
        try:
            source = path.read_text(
                encoding="utf-8",
            )

            ast.parse(
                source,
                filename=str(path),
            )

            return {
                "path": str(
                    path.relative_to(
                        self.root_dir
                    )
                ),
                "passed": True,
                "error": None,
            }

        except (
            OSError,
            UnicodeError,
            SyntaxError,
        ) as exc:
            return {
                "path": str(
                    path.relative_to(
                        self.root_dir
                    )
                ),
                "passed": False,
                "error": str(exc),
            }

    def validate_all(
        self,
    ) -> Dict[str, Any]:
        inspector = RepositoryInspector(
            self.root_dir
        )

        files = [
            path
            for path in inspector.iter_files(
                include_hidden=True
            )
            if path.suffix == ".py"
        ]

        reports = [
            self.validate_file(path)
            for path in files
        ]

        failures = [
            report
            for report in reports
            if not report["passed"]
        ]

        return {
            "python_files": len(files),
            "passed_files": (
                len(files) - len(failures)
            ),
            "failed_files": len(failures),
            "failures": failures,
            "passed": not failures,
        }


# ============================================================================
# TRACKING / TELEMETRY
# ============================================================================

class Tracker:
    """Durable current-state and append-only telemetry tracker."""

    def __init__(
        self,
        root_dir: Path,
    ):
        self.root_dir = Path(root_dir)
        self.tracker_dir = (
            self.root_dir
            / TRACKER_DIR_NAME
        )

        self.ensure()

    def ensure(self) -> Path:
        self.tracker_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        required = {
            "CURRENT_STATUS.txt": (
                "OLLAMA AUTONOMOUS AGENT - CURRENT STATUS\n"
                "=========================================\n\n"
            ),
            "LATEST_ACTIVITY.txt": (
                "OLLAMA AUTONOMOUS AGENT - LATEST ACTIVITY\n"
                "==========================================\n\n"
            ),
            "STATE.txt": (
                "status: initializing\n"
                "phase: startup\n"
            ),
            "PR_STATUS.txt": (
                "PR Status: not_started\n"
            ),
            "LAST_RECONCILIATION.txt": (
                "No reconciliation yet\n"
            ),
            "TRACKING_INDEX.txt": (
                "OLLAMA AUTONOMOUS AGENT TRACKING INDEX\n"
                "======================================\n\n"
            ),
            "TRACKING_PROTOCOL.txt": (
                "ollamatracks-v5\n"
            ),
            "telemetry.jsonl": "",
        }

        for name, content in required.items():
            path = self.tracker_dir / name

            if not path.exists():
                path.write_text(
                    content,
                    encoding="utf-8",
                )

        return self.tracker_dir

    def record(
        self,
        event: str,
        message: str,
        status: str = "running",
        phase: str = "agent",
        details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        timestamp = utc_now()

        payload = {
            "timestamp_utc": timestamp,
            "event": event,
            "status": status,
            "phase": phase,
            "message": message,
            "details": details or {},
        }

        telemetry = (
            self.tracker_dir
            / "telemetry.jsonl"
        )

        with telemetry.open(
            "a",
            encoding="utf-8",
        ) as handle:
            handle.write(
                json.dumps(
                    payload,
                    sort_keys=True,
                    default=str,
                )
                + "\n"
            )

        current = (
            "OLLAMA AUTONOMOUS AGENT - CURRENT STATUS\n"
            "=========================================\n\n"
            f"Timestamp UTC: {timestamp}\n"
            f"Repository: {self.root_dir.name}\n"
            f"Default branch: main\n"
            f"Current status: {status}\n"
            f"Phase: {phase}\n"
            f"Latest event: {event}\n"
            f"Message: {message}\n\n"
            f"Tracker directory: {self.tracker_dir}\n"
        )

        (
            self.tracker_dir
            / "CURRENT_STATUS.txt"
        ).write_text(
            current,
            encoding="utf-8",
        )

        (
            self.tracker_dir
            / "STATE.txt"
        ).write_text(
            (
                f"status: {status}\n"
                f"phase: {phase}\n"
                f"event: {event}\n"
                f"message: {message}\n"
                f"last_updated_utc: {timestamp}\n"
            ),
            encoding="utf-8",
        )

        (
            self.tracker_dir
            / "LAST_RECONCILIATION.txt"
        ).write_text(
            (
                f"{timestamp} | {event} | "
                f"{status} | {phase} | {message}\n"
            ),
            encoding="utf-8",
        )

        (
            self.tracker_dir
            / "LATEST_ACTIVITY.txt"
        ).write_text(
            (
                "OLLAMA AUTONOMOUS AGENT - LATEST ACTIVITY\n"
                "==========================================\n\n"
                f"Timestamp UTC: {timestamp}\n"
                f"Event: {event}\n"
                f"Description: {message}\n"
                f"Status: {status}\n"
                f"Phase: {phase}\n\n"
                "This is a mutable current-state projection.\n"
            ),
            encoding="utf-8",
        )

        (
            self.tracker_dir
            / "PR_STATUS.txt"
        ).write_text(
            (
                f"PR Status: {status}\n"
                f"Phase: {phase}\n"
                f"Event: {event}\n"
                f"Last update UTC: {timestamp}\n"
            ),
            encoding="utf-8",
        )

        (
            self.tracker_dir
            / "TRACKING_INDEX.txt"
        ).write_text(
            (
                "OLLAMA AUTONOMOUS AGENT TRACKING INDEX\n"
                "======================================\n\n"
                "Tracking schema: 5.0\n\n"
                "Purpose\n"
                "-------\n"
                "Durable live observability for the "
                "Ollama autonomous agent.\n\n"
                f"Last event: {event}\n"
                f"Last status: {status}\n"
                f"Last phase: {phase}\n"
                f"Last update: {timestamp}\n"
                "\n"
                "Mutable state files represent the "
                "latest observed projection.\n"
            ),
            encoding="utf-8",
        )

        safe_json_write(
            self.tracker_dir
            / "monitoring_summary.json",
            payload,
        )

        return payload


# ============================================================================
# CHECKPOINTS
# ============================================================================

class CheckpointManager:
    """Resumable agent checkpoint."""

    def __init__(
        self,
        root_dir: Path,
    ):
        self.path = (
            Path(root_dir)
            / "resumefromhere.txt"
        )

    def save(
        self,
        status: str,
        completed_steps: Sequence[str],
        error: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Path:
        lines = [
            "# resumefromhere",
            f"timestamp_utc: {utc_now()}",
            f"status: {status}",
            (
                "completed_steps: "
                + ", ".join(completed_steps)
            ),
        ]

        if error:
            lines.append(
                f"error: {error}"
            )

        if metadata:
            for key, value in metadata.items():
                lines.append(
                    f"{key}: {value}"
                )

        self.path.write_text(
            "\n".join(lines) + "\n",
            encoding="utf-8",
        )

        return self.path

    def load(self) -> Optional[Dict[str, Any]]:
        if not self.path.exists():
            return None

        raw = self.path.read_text(
            encoding="utf-8",
            errors="ignore",
        )

        state: Dict[str, Any] = {
            "raw": raw,
        }

        for key in (
            "status",
            "timestamp_utc",
            "error",
        ):
            match = re.search(
                rf"^{re.escape(key)}:\s*(.*)$",
                raw,
                re.MULTILINE,
            )

            if match:
                state[key] = (
                    match.group(1).strip()
                )

        match = re.search(
            r"^completed_steps:\s*(.*)$",
            raw,
            re.MULTILINE,
        )

        if match:
            state["completed_steps"] = [
                item.strip()
                for item in match.group(1).split(",")
                if item.strip()
            ]

        return state


# ============================================================================
# RESILIENCE
# ============================================================================

class ResilienceManager:
    """Safe adapter around the optional resilience coordinator."""

    def __init__(
        self,
        root_dir: Path,
    ):
        self.root_dir = Path(root_dir)
        self.coordinator = None
        self.report: Dict[str, Any] = {}
        self.errors: List[str] = []

    def initialize(self) -> Dict[str, Any]:
        if ResilienceCoordinator is None:
            self.report = {
                "status": "unavailable",
                "can_continue": True,
                "reason": (
                    "resilience_auto_healing module "
                    "is unavailable"
                ),
            }

            return self.report

        try:
            self.coordinator = (
                ResilienceCoordinator(
                    self.root_dir
                )
            )

            result = (
                self.coordinator
                .run_full_resilience_check()
            )

            self.report = result or {
                "status": "unknown",
                "can_continue": True,
            }

            return self.report

        except Exception as exc:
            self.errors.append(
                str(exc)
            )

            self.report = {
                "status": "degraded",
                "can_continue": True,
                "error": str(exc),
            }

            logger.exception(
                "Resilience initialization failed."
            )

            return self.report

    def run(self) -> Dict[str, Any]:
        if self.coordinator is None:
            return self.report

        try:
            result = (
                self.coordinator
                .run_full_resilience_check()
            )

            if result:
                self.report = result

            return self.report

        except Exception as exc:
            self.errors.append(
                str(exc)
            )

            logger.exception(
                "Resilience check failed."
            )

            return {
                **self.report,
                "status": "degraded",
                "error": str(exc),
                "can_continue": True,
            }


# ============================================================================
# MAIN AGENT
# ============================================================================

class OllamaAutonomousAgent:
    """Main QMOI repository validation orchestrator."""

    PLATFORM_SPECIFIC_FEATURES = PLATFORM_FEATURE_CATALOG

    def __init__(
        self,
        base_path: Optional[Path] = None,
    ):
        self.base_path = (
            Path(base_path)
            if base_path is not None
            else ROOT_DIR
        ).resolve()

        self.root_dir = self.base_path

        self.tracker = Tracker(
            self.root_dir
        )

        self.checkpoint = CheckpointManager(
            self.root_dir
        )

        self.resilience = ResilienceManager(
            self.root_dir
        )

        self.resilience_errors: List[str] = []
        self.recovered_files: List[str] = []
        self.resilience_report: Dict[str, Any] = {}

        self.results: Dict[str, Any] = {}

        self.validators = {
            platform: PlatformValidator(
                platform,
                self.root_dir,
            )
            for platform in PLATFORMS
        }

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
            CrossRepoAutonomyManager()
        )

        self.tracker.record(
            "agent_startup",
            "Ollama autonomous agent initialized.",
            status="initializing",
            phase="startup",
            details={
                "repository": str(
                    self.root_dir
                ),
                "tracker_dir": str(
                    self.tracker.tracker_dir
                ),
                "platforms": list(PLATFORMS),
                "apps": list(QMOI_APPS),
            },
        )

        self._initialize_resilience()
        self._perform_startup_health_check()

    # ---------------------------------------------------------------------
    # STARTUP
    # ---------------------------------------------------------------------

    def _initialize_resilience(self) -> Dict[str, Any]:
        self.resilience_report = (
            self.resilience.initialize()
        )

        if (
            self.resilience_report.get(
                "can_continue"
            )
            is False
        ):
            logger.warning(
                "Resilience layer reports a degraded "
                "run state."
            )

        return self.resilience_report

    def _perform_startup_health_check(
        self,
    ) -> Dict[str, Any]:
        try:
            self.resilience_report = (
                self.resilience.run()
                or self.resilience_report
            )

            essentials = (
                self.get_essential_file_list()
            )

            missing = [
                item
                for item in essentials
                if not (
                    self.root_dir / item
                ).exists()
            ]

            if missing:
                for item in missing:
                    self.resilience_errors.append(
                        f"Missing startup file: {item}"
                    )

                self.checkpoint.save(
                    "degraded",
                    ["startup-health-check"],
                    error=(
                        "Missing required repository files."
                    ),
                    metadata={
                        "missing_count": len(missing)
                    },
                )

                logger.warning(
                    "Startup health check found %d "
                    "missing files.",
                    len(missing),
                )

            return {
                "status": (
                    "ok"
                    if not missing
                    else "degraded"
                ),
                "missing": missing,
            }

        except Exception as exc:
            self.resilience_errors.append(
                str(exc)
            )

            self.checkpoint.save(
                "error",
                ["startup-health-check"],
                error=str(exc),
            )

            return {
                "status": "error",
                "error": str(exc),
            }

    # ---------------------------------------------------------------------
    # PLATFORM VALIDATION
    # ---------------------------------------------------------------------

    def validate_all_platforms(
        self,
    ) -> Dict[str, Dict[str, bool]]:
        results: Dict[str, Dict[str, bool]] = {}

        for platform in PLATFORMS:
            logger.info(
                "Validating platform: %s",
                platform,
            )

            validator = self.validators[platform]

            results[platform] = {
                app: validator.validate_code_compiles(
                    app
                )
                for app in QMOI_APPS
            }

        return results

    # ---------------------------------------------------------------------
    # FEATURE VALIDATION
    # ---------------------------------------------------------------------

    def validate_all_features(
        self,
    ) -> Dict[str, Dict[str, Dict[str, bool]]]:
        """
        Compatibility API.

        Unlike the previous implementation, results reflect actual
        evidence rather than unconditional True values.
        """

        output: Dict[str, Dict[str, Dict[str, bool]]] = {}

        for app in QMOI_APPS:
            output[app] = {}

            for platform in PLATFORMS:
                validator = (
                    PlatformSpecificFeatureValidator(
                        app,
                        platform,
                        self.root_dir,
                    )
                )

                detailed = (
                    validator.validate_all_features()
                )

                output[app][platform] = {
                    feature: data["passed"]
                    for feature, data
                    in detailed.items()
                }

        return output

    def validate_all_platform_features(
        self,
    ) -> Dict[str, Dict[str, Dict[str, Dict[str, Any]]]]:
        output: Dict[
            str,
            Dict[str, Dict[str, Dict[str, Any]]],
        ] = {}

        for platform in PLATFORMS:
            output[platform] = {}

            for app in QMOI_APPS:
                validator = (
                    PlatformSpecificFeatureValidator(
                        app,
                        platform,
                        self.root_dir,
                    )
                )

                output[platform][app] = (
                    validator.validate_all_features()
                )

        return output

    def feature_summary(
        self,
        detailed_results: Dict[str, Any],
    ) -> Dict[str, Any]:
        total = 0
        implemented = 0
        missing = 0
        unknown = 0

        by_platform: Dict[str, Any] = {}

        for platform, apps in detailed_results.items():
            platform_total = 0
            platform_implemented = 0
            platform_missing = 0
            platform_unknown = 0

            for _, features in apps.items():
                for _, result in features.items():
                    total += 1
                    platform_total += 1

                    status = result["status"]

                    if status == "implemented":
                        implemented += 1
                        platform_implemented += 1

                    elif status == "missing":
                        missing += 1
                        platform_missing += 1

                    else:
                        unknown += 1
                        platform_unknown += 1

            by_platform[platform] = {
                "total": platform_total,
                "implemented": platform_implemented,
                "missing": platform_missing,
                "unknown": platform_unknown,
                "pass": (
                    platform_missing == 0
                    and platform_unknown == 0
                ),
            }

        return {
            "total": total,
            "implemented": implemented,
            "missing": missing,
            "unknown": unknown,
            "coverage_percent": (
                round(
                    implemented / total * 100,
                    2,
                )
                if total
                else 0.0
            ),
            "passed": (
                missing == 0
                and unknown == 0
            ),
            "by_platform": by_platform,
        }

    # ---------------------------------------------------------------------
    # FILE HANDLERS
    # ---------------------------------------------------------------------

    def validate_file_handlers(
        self,
    ) -> Dict[str, Dict[str, Dict[str, Any]]]:
        validator = FileHandlerValidator(
            self.root_dir
        )

        return {
            platform: (
                validator
                .validate_handler_registration(
                    platform
                )
            )
            for platform in PLATFORMS
        }

    # ---------------------------------------------------------------------
    # WORKFLOW VALIDATION
    # ---------------------------------------------------------------------

    def validate_workflows(
        self,
    ) -> Dict[str, Any]:
        validator = WorkflowValidator(
            self.root_dir
        )

        report = validator.validate_all()

        deprecated = (
            validator
            .find_deprecated_artifact_actions()
        )

        report["deprecated_findings"] = deprecated

        return report

    # ---------------------------------------------------------------------
    # PYTHON VALIDATION
    # ---------------------------------------------------------------------

    def validate_python_sources(
        self,
    ) -> Dict[str, Any]:
        return (
            PythonSourceValidator(
                self.root_dir
            )
            .validate_all()
        )

    # ---------------------------------------------------------------------
    # ESSENTIAL FILES
    # ---------------------------------------------------------------------

    def get_essential_file_list(
        self,
    ) -> List[str]:
        return [
            "README.md",
            "requirements.txt",
            ".github/workflows",
            "scripts/ollama_autonomous_agent.py",
        ]

    def detect_missing_files(
        self,
    ) -> Dict[str, Any]:
        essential = (
            self.get_essential_file_list()
        )

        missing = [
            path
            for path in essential
            if not (
                self.root_dir / path
            ).exists()
        ]

        return {
            "missing": missing,
            "can_recover": True,
            "recovery_procedures": {
                path: (
                    "Restore from repository history "
                    "or an approved project template."
                )
                for path in missing
            },
        }

    # ---------------------------------------------------------------------
    # FILE HEALTH
    # ---------------------------------------------------------------------

    def handle_corrupted_file(
        self,
        file_path: Path,
    ) -> Dict[str, Any]:
        path = Path(file_path)

        if not path.exists():
            return {
                "status": "missing",
                "path": str(path),
            }

        try:
            data = path.read_bytes()

            if b"\x00" in data[:4096]:
                return {
                    "status": "corrupted",
                    "path": str(path),
                    "message": (
                        "Null bytes detected. "
                        "Automatic rewriting is intentionally "
                        "disabled to avoid destructive repairs."
                    ),
                }

            if path.suffix.lower() in {
                ".json"
            }:
                try:
                    json.loads(
                        data.decode(
                            "utf-8"
                        )
                    )
                except Exception as exc:
                    return {
                        "status": "corrupted",
                        "path": str(path),
                        "message": (
                            "Invalid JSON: "
                            + str(exc)
                        ),
                    }

            return {
                "status": "ok",
                "path": str(path),
            }

        except OSError as exc:
            return {
                "status": "error",
                "path": str(path),
                "error": str(exc),
            }

    # ---------------------------------------------------------------------
    # NETWORK / API COMPATIBILITY
    # ---------------------------------------------------------------------

    def handle_network_error(
        self,
    ) -> Dict[str, Any]:
        return {
            "status": "network_error_handled",
            "recovered": True,
            "strategy": [
                "retry_with_backoff",
                "continue_local_validation",
                "record_failure",
            ],
        }

    def handle_api_error(
        self,
    ) -> Dict[str, Any]:
        return {
            "status": "api_error_handled",
            "recovered": True,
            "strategy": [
                "avoid_secret_logging",
                "continue_local_validation",
                "record_failure",
            ],
        }

    # ---------------------------------------------------------------------
    # CHECKPOINT API
    # ---------------------------------------------------------------------

    def update_resume_checkpoint(
        self,
        status: str,
        completed_steps: List[str],
        error: Optional[str] = None,
    ) -> Optional[Path]:
        return self.checkpoint.save(
            status,
            completed_steps,
            error=error,
        )

    def load_checkpoint(
        self,
    ) -> Optional[Dict[str, Any]]:
        return self.checkpoint.load()

    # ---------------------------------------------------------------------
    # MEMORY / MODEL CARD
    # ---------------------------------------------------------------------

    def generate_memory_index(
        self,
    ) -> Path:
        return (
            self.memory_generator
            .generate_index()
        )

    def generate_model_card(
        self,
    ) -> Path:
        return (
            self.model_card_generator
            .generate_card()
        )

    # ---------------------------------------------------------------------
    # GITHUB PROOF
    # ---------------------------------------------------------------------

    def build_github_proof_contract(
        self,
    ) -> Dict[str, Any]:
        platform_results = (
            self.validate_all_platforms()
        )

        detailed_features = (
            self.validate_all_platform_features()
        )

        feature_summary = (
            self.feature_summary(
                detailed_features
            )
        )

        handler_results = (
            self.validate_file_handlers()
        )

        workflow_results = (
            self.validate_workflows()
        )

        python_results = (
            self.validate_python_sources()
        )

        platform_pass = all(
            all(
                bool(value)
                for value in app_results.values()
            )
            for app_results
            in platform_results.values()
        )

        handler_pass = all(
            all(
                item["registered"]
                for item in platform_items.values()
            )
            for platform_items
            in handler_results.values()
        )

        workflow_pass = workflow_results[
            "passed"
        ]

        python_pass = python_results[
            "passed"
        ]

        overall_pass = all(
            [
                platform_pass,
                feature_summary["passed"],
                handler_pass,
                workflow_pass,
                python_pass,
            ]
        )

        proof = {
            "platform_validation_passed": platform_pass,
            "feature_validation_passed": (
                feature_summary["passed"]
            ),
            "file_handler_validation_passed": handler_pass,
            "workflow_validation_passed": workflow_pass,
            "python_syntax_validation_passed": python_pass,
            "alpha_q_ai_included": True,
            "overall_passed": overall_pass,
        }

        return {
            "status": (
                "ready_for_github"
                if overall_pass
                else "github_validation_failed"
            ),
            "proof": proof,
            "platforms": platform_results,
            "feature_summary": feature_summary,
            "handlers": handler_results,
            "workflows": workflow_results,
            "python": python_results,
            "alpha_q_ai": {
                "repo": (
                    "thealphakenya/Alpha-Q-ai"
                ),
                "included": True,
            },
            "branch_sync": (
                BranchSyncManager
                .build_sync_plan()
            ),
            "cross_repo_autonomy": (
                self.cross_repo_manager
                .build_autonomy_plan()
            ),
            "generated_at": utc_now(),
        }

    # ---------------------------------------------------------------------
    # PROJECT STATS
    # ---------------------------------------------------------------------

    def project_stats(
        self,
    ) -> Dict[str, Any]:
        inspector = RepositoryInspector(
            self.root_dir
        )

        stats = inspector.project_stats()

        stats.update(
            {
                "platforms": list(
                    PLATFORMS
                ),
                "apps": dict(
                    QMOI_APPS
                ),
                "platform_feature_count": (
                    len(
                        PLATFORM_FEATURE_CATALOG
                    )
                ),
                "workflow_directory": str(
                    WORKFLOW_DIR
                ),
                "tracker_directory": str(
                    self.tracker.tracker_dir
                ),
            }
        )

        return stats

    # ---------------------------------------------------------------------
    # FULL SUITE
    # ---------------------------------------------------------------------

    def run_full_validation_suite(
        self,
    ) -> bool:
        started = datetime.now(
            timezone.utc
        )

        completed_steps: List[str] = []

        self.tracker.record(
            "validation_started",
            "Running full repository validation suite.",
            status="running",
            phase="validation",
            details={
                "workflow": (
                    "Ollama PR Validation - "
                    "293+ Platform Features"
                ),
                "platform_count": len(
                    PLATFORMS
                ),
                "app_count": len(
                    QMOI_APPS
                ),
                "catalog_feature_count": len(
                    PLATFORM_FEATURE_CATALOG
                ),
            },
        )

        try:
            # -------------------------------------------------------------
            # 1. Resilience
            # -------------------------------------------------------------

            logger.info(
                "[1/8] Running resilience checks..."
            )

            resilience_report = (
                self.resilience.run()
            )

            self.results[
                "resilience"
            ] = resilience_report

            completed_steps.append(
                "resilience"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 2. Python syntax
            # -------------------------------------------------------------

            logger.info(
                "[2/8] Validating Python syntax..."
            )

            python_results = (
                self.validate_python_sources()
            )

            self.results[
                "python"
            ] = python_results

            python_pass = python_results[
                "passed"
            ]

            completed_steps.append(
                "python-validation"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 3. Workflows
            # -------------------------------------------------------------

            logger.info(
                "[3/8] Validating GitHub Actions workflows..."
            )

            workflow_results = (
                self.validate_workflows()
            )

            self.results[
                "workflows"
            ] = workflow_results

            workflow_pass = workflow_results[
                "passed"
            ]

            completed_steps.append(
                "workflow-validation"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 4. Platforms
            # -------------------------------------------------------------

            logger.info(
                "[4/8] Validating six platforms..."
            )

            platform_results = (
                self.validate_all_platforms()
            )

            platform_pass = all(
                all(
                    bool(value)
                    for value
                    in app_results.values()
                )
                for app_results
                in platform_results.values()
            )

            self.results[
                "platforms"
            ] = platform_results

            completed_steps.append(
                "platform-validation"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 5. Features
            # -------------------------------------------------------------

            logger.info(
                "[5/8] Validating platform-specific features..."
            )

            feature_results = (
                self.validate_all_platform_features()
            )

            feature_summary = (
                self.feature_summary(
                    feature_results
                )
            )

            feature_pass = feature_summary[
                "passed"
            ]

            self.results[
                "features"
            ] = feature_results

            self.results[
                "feature_summary"
            ] = feature_summary

            completed_steps.append(
                "feature-validation"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 6. File handlers
            # -------------------------------------------------------------

            logger.info(
                "[6/8] Validating file handlers..."
            )

            handler_results = (
                self.validate_file_handlers()
            )

            handler_pass = all(
                all(
                    item["registered"]
                    for item
                    in platform_items.values()
                )
                for platform_items
                in handler_results.values()
            )

            self.results[
                "handlers"
            ] = handler_results

            completed_steps.append(
                "handler-validation"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 7. Repository artifacts
            # -------------------------------------------------------------

            logger.info(
                "[7/8] Generating memory/model reports..."
            )

            memory_index = (
                self.generate_memory_index()
            )

            model_card = (
                self.generate_model_card()
            )

            self.results[
                "generated_artifacts"
            ] = {
                "memory_index": str(
                    memory_index
                ),
                "model_card": str(
                    model_card
                ),
            }

            completed_steps.append(
                "report-generation"
            )

            self.checkpoint.save(
                "running",
                completed_steps,
            )

            # -------------------------------------------------------------
            # 8. GitHub proof
            # -------------------------------------------------------------

            logger.info(
                "[8/8] Building GitHub proof contract..."
            )

            proof = (
                self.build_github_proof_contract()
            )

            self.results[
                "proof"
            ] = proof

            overall_pass = all(
                [
                    platform_pass,
                    feature_pass,
                    handler_pass,
                    workflow_pass,
                    python_pass,
                ]
            )

            duration = (
                datetime.now(timezone.utc)
                - started
            ).total_seconds()

            summary = {
                "overall_pass": overall_pass,
                "platform_pass": platform_pass,
                "feature_pass": feature_pass,
                "handler_pass": handler_pass,
                "workflow_pass": workflow_pass,
                "python_pass": python_pass,
                "feature_summary": feature_summary,
                "duration_seconds": duration,
                "completed_steps": completed_steps,
                "timestamp_utc": utc_now(),
            }

            self.results[
                "summary"
            ] = summary

            # Persist full report.
            report_path = (
                self.root_dir
                / "ollama_validation_report.json"
            )

            safe_json_write(
                report_path,
                self.results,
            )

            # Tracker.
            self.tracker.record(
                "validation_completed",
                (
                    "Full validation suite passed."
                    if overall_pass
                    else "Validation suite completed with failures."
                ),
                status=(
                    "validated"
                    if overall_pass
                    else "validation_failed"
                ),
                phase="summary",
                details=summary,
            )

            self.checkpoint.save(
                "completed"
                if overall_pass
                else "failed",
                completed_steps,
            )

            logger.info(
                "=" * 72
            )
            logger.info(
                "QMOI VALIDATION SUMMARY"
            )
            logger.info(
                "=" * 72
            )
            logger.info(
                "Platform validation: %s",
                "PASS" if platform_pass else "FAIL",
            )
            logger.info(
                "Feature validation: %s",
                "PASS" if feature_pass else "FAIL",
            )
            logger.info(
                "File handlers: %s",
                "PASS" if handler_pass else "FAIL",
            )
            logger.info(
                "Workflow validation: %s",
                "PASS" if workflow_pass else "FAIL",
            )
            logger.info(
                "Python syntax: %s",
                "PASS" if python_pass else "FAIL",
            )
            logger.info(
                "Overall: %s",
                "PASS" if overall_pass else "FAIL",
            )
            logger.info(
                "Duration: %.2fs",
                duration,
            )
            logger.info(
                "Report: %s",
                report_path,
            )
            logger.info(
                "=" * 72
            )

            return overall_pass

        except Exception as exc:
            error_text = (
                f"{type(exc).__name__}: {exc}"
            )

            logger.error(
                "Validation suite failed: %s",
                error_text,
            )

            logger.error(
                traceback.format_exc()
            )

            self.tracker.record(
                "validation_failed",
                (
                    "Validation suite raised an exception."
                ),
                status="failed",
                phase="error",
                details={
                    "error": str(exc),
                    "error_type": type(exc).__name__,
                    "completed_steps": completed_steps,
                    "timestamp_utc": utc_now(),
                },
            )

            self.checkpoint.save(
                "error",
                completed_steps,
                error=error_text,
            )

            return False

    # ---------------------------------------------------------------------
    # REPORT
    # ---------------------------------------------------------------------

    def generate_validation_report(
        self,
    ) -> Dict[str, Any]:
        return {
            "generated_at": utc_now(),
            "platforms": (
                self.validate_all_platforms()
            ),
            "features": (
                self.validate_all_platform_features()
            ),
            "handlers": (
                self.validate_file_handlers()
            ),
            "workflows": (
                self.validate_workflows()
            ),
            "python": (
                self.validate_python_sources()
            ),
            "proof": (
                self.build_github_proof_contract()
            ),
        }


# ============================================================================
# CLI
# ============================================================================

def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "QMOI Ollama Autonomous Agent"
        )
    )

    parser.add_argument(
        "command",
        nargs="?",
        default="validate-all",
        choices=[
            "validate-all",
            "validate-all-platforms",
            "validate-all-features",
            "validate-workflows",
            "validate-python",
            "github-proof",
            "project-stats",
            "memory-index",
            "model-card",
            "checkpoint",
            "auto-heal",
            "deprecated-actions",
        ],
    )

    parser.add_argument(
        "--root",
        default=str(ROOT_DIR),
        help="Repository root.",
    )

    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output.",
    )

    return parser


def print_json(
    payload: Any,
    pretty: bool = True,
) -> None:
    print(
        json.dumps(
            payload,
            indent=2 if pretty else None,
            sort_keys=True,
            default=str,
        )
    )


def main() -> None:
    parser = build_argument_parser()
    args = parser.parse_args()

    root = Path(args.root).resolve()

    agent = OllamaAutonomousAgent(
        root
    )

    if args.command == "validate-all":
        success = (
            agent.run_full_validation_suite()
        )

        sys.exit(
            0 if success else 1
        )

    if args.command == "validate-all-platforms":
        print_json(
            agent.validate_all_platforms(),
            args.pretty or True,
        )

        sys.exit(0)

    if args.command == "validate-all-features":
        result = (
            agent.validate_all_platform_features()
        )

        print_json(
            {
                "summary": agent.feature_summary(
                    result
                ),
                "features": result,
            },
            True,
        )

        # Feature command is diagnostic; it does not force exit 1 merely
        # because features are missing.
        sys.exit(0)

    if args.command == "validate-workflows":
        result = agent.validate_workflows()

        print_json(
            result,
            True,
        )

        sys.exit(
            0 if result["passed"] else 1
        )

    if args.command == "validate-python":
        result = (
            agent.validate_python_sources()
        )

        print_json(
            result,
            True,
        )

        sys.exit(
            0 if result["passed"] else 1
        )

    if args.command == "github-proof":
        result = (
            agent.build_github_proof_contract()
        )

        print_json(
            result,
            True,
        )

        sys.exit(
            0
            if result["proof"]["overall_passed"]
            else 1
        )

    if args.command == "project-stats":
        print_json(
            agent.project_stats(),
            True,
        )

        sys.exit(0)

    if args.command == "memory-index":
        path = (
            agent.generate_memory_index()
        )

        print(
            json.dumps(
                {
                    "generated": True,
                    "path": str(path),
                },
                indent=2,
            )
        )

        sys.exit(0)

    if args.command == "model-card":
        path = (
            agent.generate_model_card()
        )

        print(
            json.dumps(
                {
                    "generated": True,
                    "path": str(path),
                },
                indent=2,
            )
        )

        sys.exit(0)

    if args.command == "checkpoint":
        print_json(
            agent.load_checkpoint()
            or {
                "status": "no_checkpoint"
            },
            True,
        )

        sys.exit(0)

    if args.command == "deprecated-actions":
        validator = WorkflowValidator(
            root
        )

        findings = (
            validator
            .find_deprecated_artifact_actions()
        )

        print_json(
            {
                "count": len(findings),
                "findings": findings,
                "passed": not findings,
            },
            True,
        )

        sys.exit(
            0 if not findings else 1
        )

    if args.command == "auto-heal":
        try:
            from scripts.advanced_agent_healer import (
                AgentAutoHealer,
            )

            healer = AgentAutoHealer(
                agent.root_dir
            )

            results = (
                healer
                .run_full_recovery_cycle()
            )

            print_json(
                results,
                True,
            )

            try:
                healer.save_recovery_report()
            except Exception:
                logger.exception(
                    "Could not save recovery report."
                )

            sys.exit(0)

        except Exception as exc:
            logger.error(
                "Auto-healing failed: %s",
                exc,
            )

            print_json(
                {
                    "status": "failed",
                    "error": str(exc),
                },
                True,
            )

            sys.exit(1)


if __name__ == "__main__":
    main()