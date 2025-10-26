# QMOI Lightweight Application Strategy

Goal: Keep QMOI applications and artifacts as small and efficient as possible while retaining full functionality and graceful fallbacks when cloud features or external providers are unavailable.

Principles
- Local-first: prefer local models, local artifact store (`.qvs`) and low-dependency runtimes.
- Optional cloud: cloud integrations are optional; default to simulated/local implementations if cloud is unavailable.
- Lazy loading: load heavy modules only when needed.
- Minimal runtime: prefer pure-Python or small WASM bindings for inference, avoid large native dependencies in client apps.
- Quantized models: use quantized, small footprint checkpoints for offline inference.
- Offload large assets: move large datasets, checkpoints, and media into `QVS` or optional cloud buckets; keep repo lightweight.
- Strip assets: provide utilities to locate and optionally compress or move large files out of the application tree.

Techniques and Implementation

1) QVS (QMOI Virtual Store)
- Store large files under `.qvs/` outside the code path and index them; QVS is already implemented in `lib/qvs.py`.
- Use `put()` to store large model checkpoints and mark them as optional for clients.

2) Lazy module loading
- For features that require heavy libraries (Torch, TensorFlow), wrap imports in factory functions and load only when the feature is invoked.

3) Simulation/fallback
- Device integrations include lightweight simulated implementations so apps can run without hardware or cloud keys.
- Environment flags to force local-only behavior: `QMOI_DISABLE_CLOUD=1`, `QMOI_DISABLE_HW=1`.

4) Model size reduction
- Prefer quantized model formats and compact runtimes (ONNX, TFLite, or WASM-based inference).
- Provide small distilled models for typical client tasks and optional larger models for server deployments.

5) Asset stripping tool
- Scripts are provided to scan for large files (by size) and either compress them or move them to `.qvs/`.

6) Packaging
- Keep client npm packages minimal: avoid bundling heavy ML libs in browser/edge SDKs.
- Use feature flags to only include heavy modules in server-side builds.

Operational Guidance
- During CI, run `scripts/strip_large_files.py --threshold 10MB --report large_files.json` to find large assets.
- Review `large_files.json` and offload eligible files using `lib/qvs.put()` or move to artifacts storage.
- Monitor repository size and prune old model checkpoints.

Security & Privacy
- Sensitive credentials should never be stored in `.qvs/` or repo; use secrets management.
- Access to optional cloud stores must be controlled by the deployment environment and defaults must be local-first.

Notes
- The lightweight strategy emphasizes safe defaults: the system works (in simulated mode) even when external cloud models or APIs are unavailable.
- LION orchestrator should manage fallbacks, automatic offloading, and resource-aware scheduling when heavy operations are requested.