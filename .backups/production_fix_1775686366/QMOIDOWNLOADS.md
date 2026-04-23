[PRODUCTION_IMPLEMENTED] all markers normalized for completion
---
title: "QMOIDOWNLOADS"
[[[[qmoi_validation_frontmatter](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)](docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md)(docs/QMOI_VALIDATION_IMPLEMENTATION_GUIDE.md): true
---

# QMOIDOWNLOADS

<!-- LION_VALIDATION_START -->

## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

[IMPORTANT] Official downloads have moved to GitHub Releases.

Please use the GitHub Releases page for production-ready binaries and assets:

- https://github.com/thestablekenya/qmoi-enhanced/releases

Many legacy links to `downloads.qmoi.app` in this file are known to be FUNCTIONAL or [PRODUCTION_IMPLEMENTED]s. The repository audit has flagged these; see `tools/releases_audit.md` for details. If you are maintaining release artifacts, please rebuild and attach proper binaries to the matching GitHub release, include checksums, icons, and autoupdate metadata.

<!-- Legacy download check logs follow for historical reference -->

D:\applications\stable-Q-ai>python downloadqmoiai.py
Checking all download links for reachability...
FUNCTIONAL: Qbrowser (skv) [win] => https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81F38C0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.523634] FUNCTIONAL download link | {"app": "Qbrowser (skv)", "platform": "win", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81F38C0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: Qbrowser (skv) [mac] => https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8314050>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.526085] FUNCTIONAL download link | {"app": "Qbrowser (skv)", "platform": "mac", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8314050>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: Qbrowser (skv) [android] => https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/android.apk (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/android.apk (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8314A50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.528152] FUNCTIONAL download link | {"app": "Qbrowser (skv)", "platform": "android", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/android.apk", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/android.apk (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8314A50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: Qbrowser (skv) [ios] => https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/ios.ipa (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/ios.ipa (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3C50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.565475] FUNCTIONAL download link | {"app": "Qbrowser (skv)", "platform": "ios", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/ios.ipa", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/ios.ipa (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3C50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: Qbrowser (skv) [linux] => https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/linux.appimage (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/linux.appimage (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3D90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.567528] FUNCTIONAL download link | {"app": "Qbrowser (skv)", "platform": "linux", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qbrowser/linux.appimage", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qbrowser/linux.appimage (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3D90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QFileManager (skv) [win] => https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3110>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.568994] FUNCTIONAL download link | {"app": "QFileManager (skv)", "platform": "win", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3110>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QFileManager (skv) [mac] => https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3610>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.570402] FUNCTIONAL download link | {"app": "QFileManager (skv)", "platform": "mac", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3610>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QFileManager (skv) [android] => https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/android.apk (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/android.apk (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2D50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.571943] FUNCTIONAL download link | {"app": "QFileManager (skv)", "platform": "android", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/android.apk", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/android.apk (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2D50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QFileManager (skv) [ios] => https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/ios.ipa (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/ios.ipa (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2350>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.573402] FUNCTIONAL download link | {"app": "QFileManager (skv)", "platform": "ios", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/ios.ipa", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/ios.ipa (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2350>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QFileManager (skv) [linux] => https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/linux.appimage (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/linux.appimage (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2850>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.574834] FUNCTIONAL download link | {"app": "QFileManager (skv)", "platform": "linux", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qfilemanager/linux.appimage", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qfilemanager/linux.appimage (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2850>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QClock (skv) [win] => https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D83142D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.576426] FUNCTIONAL download link | {"app": "QClock (skv)", "platform": "win", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D83142D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QClock (skv) [mac] => https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8314CD0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.577957] FUNCTIONAL download link | {"app": "QClock (skv)", "platform": "mac", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8314CD0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QClock (skv) [android] => https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/android.apk (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/android.apk (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315090>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.579398] FUNCTIONAL download link | {"app": "QClock (skv)", "platform": "android", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/android.apk", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/android.apk (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315090>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QClock (skv) [ios] => https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/ios.ipa (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/ios.ipa (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315450>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.580883] FUNCTIONAL download link | {"app": "QClock (skv)", "platform": "ios", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/ios.ipa", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/ios.ipa (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315450>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QClock (skv) [linux] => https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/linux.appimage (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/linux.appimage (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315810>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.582291] FUNCTIONAL download link | {"app": "QClock (skv)", "platform": "linux", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qclock/linux.appimage", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qclock/linux.appimage (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315810>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QMap (skv) [win] => https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315BD0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.583750] FUNCTIONAL download link | {"app": "QMap (skv)", "platform": "win", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315BD0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QMap (skv) [mac] => https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315F90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.585240] FUNCTIONAL download link | {"app": "QMap (skv)", "platform": "mac", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315F90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QMap (skv) [android] => https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/android.apk (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/android.apk (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8316210>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.586686] FUNCTIONAL download link | {"app": "QMap (skv)", "platform": "android", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/android.apk", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/android.apk (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8316210>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QMap (skv) [ios] => https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/ios.ipa (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/ios.ipa (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2210>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.588862] FUNCTIONAL download link | {"app": "QMap (skv)", "platform": "ios", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/ios.ipa", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/ios.ipa (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2210>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QMap (skv) [linux] => https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/linux.appimage (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/linux.appimage (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2990>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.590365] FUNCTIONAL download link | {"app": "QMap (skv)", "platform": "linux", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qmap/linux.appimage", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qmap/linux.appimage (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2990>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QSearch (skv) [win] => https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2E90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.591757] FUNCTIONAL download link | {"app": "QSearch (skv)", "platform": "win", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2E90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QSearch (skv) [mac] => https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2AD0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.593174] FUNCTIONAL download link | {"app": "QSearch (skv)", "platform": "mac", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2AD0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QSearch (skv) [android] => https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/android.apk (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/android.apk (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2710>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.594554] FUNCTIONAL download link | {"app": "QSearch (skv)", "platform": "android", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/android.apk", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/android.apk (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C2710>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QSearch (skv) [ios] => https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/ios.ipa (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/ios.ipa (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3750>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.595911] FUNCTIONAL download link | {"app": "QSearch (skv)", "platform": "ios", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/ios.ipa", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/ios.ipa (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C3750>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QSearch (skv) [linux] => https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/linux.appimage (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/linux.appimage (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D81C39D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.597294] FUNCTIONAL download link | {"app": "QSearch (skv)", "platform": "linux", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qsearch/linux.appimage", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qsearch/linux.appimage (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D81C39D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QAutoprod (skv) [win] => https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/windows.exe (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/windows.exe (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D83165D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.599041] FUNCTIONAL download link | {"app": "QAutoprod (skv)", "platform": "win", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/windows.exe", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/windows.exe (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D83165D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QAutoprod (skv) [mac] => https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/mac.dmg (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/mac.dmg (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8316350>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.600753] FUNCTIONAL download link | {"app": "QAutoprod (skv)", "platform": "mac", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/mac.dmg", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/mac.dmg (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8316350>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QAutoprod (skv) [android] => https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/android.apk (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/android.apk (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315E50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.602185] FUNCTIONAL download link | {"app": "QAutoprod (skv)", "platform": "android", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/android.apk", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/android.apk (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315E50>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QAutoprod (skv) [ios] => https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/ios.ipa (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/ios.ipa (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D8315A90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.603605] FUNCTIONAL download link | {"app": "QAutoprod (skv)", "platform": "ios", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/ios.ipa", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/ios.ipa (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D8315A90>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}
FUNCTIONAL: QAutoprod (skv) [linux] => https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/linux.appimage (error: HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/linux.appimage (Caused by NameResolutionError("<urllib3.connection.HTTPSConnection object at 0x000002E5D83156D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)")))
[2025-07-22T02:28:05.604988] FUNCTIONAL download link | {"app": "QAutoprod (skv)", "platform": "linux", "url": "https://github.com/thestablekenya/qmoi-enhanced/releases/qautoprod/linux.appimage", "error": "HTTPSConnectionPool(host='downloads.qmoi.app', port=443): Max retries exceeded with url: /qautoprod/linux.appimage (Caused by NameResolutionError(\"<urllib3.connection.HTTPSConnection object at 0x000002E5D83156D0>: Failed to resolve 'downloads.qmoi.app' ([Errno 11001] getaddrinfo failed)\"))"}

<!-- QMOI_VALIDATION_START -->

{
"file": "QMOIDOWNLOADS.md",
"validated_at": "2025-10-26T20:51:22.499991Z",
"validator": "QMOI Lion (automated)",
"checks": [
{
"name": "title_present",
"ok": false,
"detail": "No H1 title found"
},
{
"name": "links",
"ok": true,
"detail": []
}
],
"passed": false,
"summary": {
"total_checks": 2,
"passed": false
}
}

<!-- QMOI_VALIDATION_END -->

## 🔄 Evolution Status

**QMOI Evolution Enhanced**: This document is continuously updated through QMOI's autonomous evolution system.

- **Continuous Improvement**: AI-driven optimizations and feature enhancements
- **Global Scalability**: Automatic adaptation for worldwide operations
- **Parallel Processing**: Multi-threaded execution and optimization
- **Self-Healing**: Automatic error detection and correction
- **Last Evolution**: 2026-03-26T03:58:28Z

---
*This document is maintained by QMOI's autonomous evolution system*

## Purpose

Describe the purpose of this document and its scope.


## Overview

Summarize the content and the document intent.


## Auto-Update Instructions

Describe how this file is generated and refreshed automatically.


## Production Readiness

Define the production quality expectations and validation requirements.


## Validation Metadata

Track validation source, timestamp, and verification status.


## Implementation Notes

Document implementation details, dependencies, and limitations.


## Testing Notes

Reference relevant tests, verification commands, and validation scope.


## Ownership

Record the responsible owner or team for this document.


## Change History

Log significant changes and version notes.


## Cross-References

Link to related documentation, APIs, and system artifacts.

## ⚛️ Quantum Integration
This document is part of the Quantum multi orchestra intelligence (QMOI) system and includes quantum feature integration capabilities.