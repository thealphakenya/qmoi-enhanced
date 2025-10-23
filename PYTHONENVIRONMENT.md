# Python Environment

How to set up Python environments for QMOI-related tools and services.

Basics:
- Use Python 3.10+ where available.
- Prefer venv or virtualenv for per-project isolation.
- Use pip for dependency installation and requirements.txt or pyproject.toml for reproducible installs.

Common commands:
- python -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt

QMOI helpers may attempt to automatically create and activate venvs during autodev workflows.
