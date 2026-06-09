#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const { optimize } = require('svgo');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('sharp not installed. PNG generation will be skipped. Run `npm install` in tools/icon-manager to enable it.');
}

const SRC = path.join(process.cwd(), 'assets', 'icons', 'apps');
const OUT_SVG = path.join(process.cwd(), 'assets', 'icons', 'dist', 'svg');
const OUT_PNG = path.join(process.cwd(), 'assets', 'icons', 'dist', 'png');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function ensure(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeSvg(content) {
  const result = optimize(content, { multipass: true });
  return result.data;
}

async function processFile(file) {
  const name = path.basename(file, path.extname(file));
  const srcPath = path.join(SRC, file);
  const svgRaw = await fs.readFile(srcPath, 'utf8');
  const svgOptimized = await optimizeSvg(svgRaw);
  const outSvgPath = path.join(OUT_SVG, `${name}.svg`);
  await fs.writeFile(outSvgPath, svgOptimized, 'utf8');
  console.log('Wrote optimized SVG:', outSvgPath);

  if (!sharp) return;
  for (const size of SIZES) {
    const outPng = path.join(OUT_PNG, `${name}-${size}.png`);
    await sharp(Buffer.from(svgOptimized)).resize(size, size, { fit: 'contain' }).png({ quality: 90 }).toFile(outPng);
    console.log('Wrote PNG:', outPng);
    const outMask = path.join(OUT_PNG, `${name}-maskable-${size}.png`);
    await sharp(Buffer.from(svgOptimized)).resize(size, size, { fit: 'cover' }).png({ quality: 90 }).toFile(outMask);
    console.log('Wrote maskable PNG:', outMask);
  }
}

async function main() {
  await ensure(OUT_SVG);
  await ensure(OUT_PNG);
  const files = await fs.readdir(SRC);
  const svgs = files.filter(f => f.toLowerCase().endsWith('.svg'));
  for (const f of svgs) {
    try {
      await processFile(f);
    } catch (e) {
      console.error('Failed processing', f, e.message);
    }
  }
  console.log('Icon manager finished.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
