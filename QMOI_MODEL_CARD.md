# QMOI Model Card

Model: Qmoi
Version: v0.0.1

## Overview

Qmoi is a multimodal instruction-tuned generative model focusing on reasoning, retrieval, and safety.

## Intended Use

- Conversational assistant, code help, research aid, content generation.

## Limitations

- May generate incorrect or biased content. Requires retrieval for factual grounding.

## Architecture

- Transformer-decoder with optional Mixture-of-Experts (MoE) and LoRA adapters.
- Supports KV cache, streaming, and quantized runtimes.

## Datasets & Training

- Curated multi-domain corpora. Fine-tuning and RLHF stages documented in `docs/`.

## Evaluation

```
{
  "mmlu": 52.3,
  "gsm8k": 21.4,
  "human_eval": 12.0
}
```
## Safety

- Safety classifiers, PII redaction, red-team tests, and governance controls.

## Deployment & Always-On

- Suggested deployment: containerized service with supervisor (systemd/docker-compose/k8s) and auto-scaling policies.
- Offline mode: local vector DB, cached model artifacts.

## Autodev Integration

- Autodev outputs metadata JSON into `qvillage/registry/qmoi/<version>/metadata.json` after each build.
- `tools/update_model_card.py` reads metadata and updates this file (Version, Evaluation sections, Changelog).

## How to update this card

1. Update `qvillage/registry/qmoi/<version>/metadata.json` after a release build.
2. Run `python tools/update_model_card.py --metadata path/to/metadata.json --out QMOI_MODEL_CARD.md`.

## Contact

Maintainers: TODO

---

_This model card is intended to be machine-updateable via the autodev pipeline._

## Changelog

Initial auto-release for v0.0.1
- Baseline metrics added
