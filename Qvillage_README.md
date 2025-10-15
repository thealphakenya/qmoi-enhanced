# Qvillage — Model Hub & Platform (Draft)

Qvillage is the model registry and deployment platform for Qmoi. This README summarizes core features and integration points.

## Features

- Model Hub: upload/download models, versioning, metadata and metrics.
- Spaces: deploy demo apps and notebooks in sandboxed environments.
- Evaluator: run benchmark suites and produce evaluation artifacts.
- Auto-quantization: produce INT8/INT4 inference builds.
- Retrieval hosting: host vector DBs alongside model artifacts.

## Integration

- Registry path: `qvillage/registry/<model-name>/<version>/`
- Each registry entry should include `metadata.json`, model artifact files, and evaluation reports.

## Local development

- Use `docker-compose` for local run of Qvillage components (registry, simple UI, evaluation runner).

## Governance

- Governance board coordinates promotion and production deployment.

## Next steps

- Add deployment examples, API endpoints, and a small `qvillage/cli.py` to interact with the registry.
