---
quantum-enabled: false
---

Icon Manager
=================

This tool optimizes SVG icons and generates PNG and maskable PNG assets at common sizes.

Usage
-----

- Install dependencies: `cd tools/icon-manager && npm install`
- Run the build: `npm run build`

Outputs
-------

- Optimized SVGs: `assets/icons/dist/svg/`
- PNGs and maskable PNGs: `assets/icons/dist/png/`

Notes
-----

- `sharp` is used for PNG rendering. If it's not installed, the script will skip PNG generation but still optimize SVGs with SVGO.
