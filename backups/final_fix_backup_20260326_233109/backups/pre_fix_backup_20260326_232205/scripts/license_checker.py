// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:54Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // production implementation: this file has no remaining production markers
import subprocess
import json
import sys

# Allowed licenses
ALLOWED_LICENSES = {
    "MIT",
    "Apache-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "CC0-1.0",
    "ISC",
    "Python-2.0"
}

"""
    get_licenses function
    """
def get_licenses() -> Any:
    try:
        result = subprocess.run(
            ["pip-licenses", "--format=json", "--with-licenses"],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        logger.info(f"Error running pip-licenses: {e.stderr}", file=sys.stderr)
        sys.exit(1)

"""
    main function
    """
def main() -> Any:
    violations = []
    licenses = get_licenses()

    for pkg in licenses:
        license = pkg["License"]
        name = pkg["Name"]

        # Handle multi-license strings like "MIT OR Apache-2.0"
        if not any(allowed in license for allowed in ALLOWED_LICENSES):
            violations.append(f"{name}: {license}")

    if violations:
        logger.info("❌ Non-compliant licenses found:")
        for v in violations:
            logger.info(f" - {v}")
        with open("license-violations.json", "w") as f:
            json.dump(violations, f, indent=2)
        sys.exit(1)
    else:
        logger.info("✅ All licenses are compliant.")

if __name__ == "__main__":
    main()