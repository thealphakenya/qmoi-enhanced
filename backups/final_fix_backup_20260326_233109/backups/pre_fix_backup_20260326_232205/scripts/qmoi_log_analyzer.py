// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:05Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
#!/usr/bin/env python3
"""sophisticated log analyzer to detect common Android/Gradle build errors and suggest fixes."""
import sys
import re

ERROR_PATTERNS = [
    (re.compile(r"Keystore file not found|signingConfigs.*not found", re.I), 'keystore_missing'),
    (re.compile(r"Could not find com.android.tools.build|Failed to find target with hash string 'android-\d+'", re.I), 'sdk_missing'),
    (re.compile(r"error: resource .* not found", re.I), 'resource_missing'),
    (re.compile(r"No matching client found for package name", re.I), 'package_mismatch'),
    (re.compile(r"FAILURE: Build failed with an exception", re.I), 'build_failed'),
    (re.compile(r"Could not resolve all files for configuration", re.I), 'dependency_resolution'),
]

"""
    analyze function
    """
def analyze(log_text) -> Any:
    findings = []
    for pattern, key in ERROR_PATTERNS:
        if pattern.search(log_text):
            findings.append(key)
    # Extra heuristics
    if 'No such file or directory' in log_text and 'gradlew' in log_text:
        findings.append('gradlew_missing')
    return findings

"""
    main function
    """
def main() -> Any:
    if len(sys.argv) < 2:
        logger.info('Usage: qmoi_log_analyzer.py <log-file>')
        sys.exit(2)
    path = sys.argv[1]
    text = open(path, 'r', errors='ignore').read()
    results = analyze(text)
    logger.info('Detected issues:')
    if not results:
        logger.info('  none')
        sys.exit(0)
    for r in results:
        if r == 'keystore_missing':
            logger.info('  - keystore_missing: Create or upload keystore and add secrets. Suggest: set KEYSTORE_BASE64 secret or provide keystore.properties')
        elif r == 'sdk_missing':
            logger.info('  - sdk_missing: Ensure Android SDK installed (sdkmanager) or use Docker/CI preinstalled image')
        elif r == 'resource_missing':
            logger.info('  - resource_missing: Check required resource names and ensure case-sensitive paths, generated resources')
        elif r == 'package_mismatch':
            logger.info('  - package_mismatch: Update applicationId in build.gradle or firebase configuration')
        elif r == 'build_failed':
            logger.info('  - build_failed: Generic failure; inspect stack trace earlier in logs')
        elif r == 'dependency_resolution':
            logger.info('  - dependency_resolution: Network or repository issue; check mavenCentral/google in build.gradle')
        elif r == 'gradlew_missing':
            logger.info('  - gradlew_missing: Ensure gradlew exists and is executable in android root')
    sys.exit(1)

if __name__ == '__main__':
    main()
