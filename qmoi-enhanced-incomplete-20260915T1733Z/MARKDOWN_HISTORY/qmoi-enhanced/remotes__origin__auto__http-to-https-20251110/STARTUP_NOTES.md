Startup and preflight notes

- The `scripts/qmoi-start.py` script performs a lightweight preflight check for commonly required runtime
  Python packages (requests, aiohttp, schedule, PyYAML, GitPython, watchdog). If any are missing the script
  will attempt to install them into the active Python interpreter using `sys.executable -m pip install`.

- Heavy, system-dependent packages (for example `torch` and some compiled C extensions) are not auto-installed
  by the preflight because they often require platform-specific wheels or system headers. Install those in CI
  or on the target host using platform-appropriate wheels.

- For reproducible local checks, use the provided `requirements-minimal.txt` which now includes the small runtime
  packages required to run the start sequence in a dev container:

  requests
  aiohttp
  boto3
  numpy
  pandas
  GitPython
  watchdog
  schedule
  PyYAML

- CI: the workflow at `.github/workflows/install-requirements.yml` installs `requirements-minimal.txt` and then
  optionally attempts to install heavier requirements with a CPU-friendly PyTorch wheel using the official
  PyTorch wheel index. Adjust that workflow to match your target runner (GPU vs CPU) and pin versions where
  necessary for reproducible installs.

If you'd like, I can:
- open a PR from `autosync-links-20251107` with the changes I pushed, including a short PR description and testing notes; or
- create a separate focused branch to only contain the preflight/start changes and the requirements update; or
- continue by creating a CI job that runs the full start flow on an `ubuntu-latest` runner with CPU PyTorch wheels to validate end-to-end.
