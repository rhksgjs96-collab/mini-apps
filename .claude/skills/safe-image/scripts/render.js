#!/usr/bin/env node
/**
 * Render an SVG file to PNG using the headless Chromium that ships with this
 * environment. Chromium is used rather than a dedicated rasteriser because it
 * is the only renderer here with full support for filters, gradients and
 * CSS — feTurbulence grain and blur are what keep the output from looking
 * like flat clipart, and lighter rasterisers drop them silently.
 *
 * Usage:
 *   node render.js <input.svg> <output.png> [--scale N] [--bg COLOR] [--width N]
 *
 *   --scale N   Device pixel ratio. Default 2. Use 3-4 for print.
 *   --bg COLOR  Flatten onto this background. Default: keep transparency.
 *   --width N   Force output width in CSS px; height follows the aspect ratio.
 *
 * Exits non-zero with a readable message on failure so the caller can react
 * instead of silently shipping a missing file.
 */

const fs = require('fs');
const path = require('path');

function die(msg) {
  console.error(`render.js: ${msg}`);
  process.exit(1);
}

const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const input = positional[0];
const output = positional[1];
if (!input || !output) die('usage: render.js <input.svg> <output.png> [--scale N] [--bg COLOR] [--width N]');
if (!fs.existsSync(input)) die(`input not found: ${input}`);

const scale = Number(flag('scale', 2));
const bg = flag('bg', null);
const forcedWidth = flag('width', null) ? Number(flag('width')) : null;

let chromium;
try {
  // playwright lives in the global node_modules here, not next to the skill.
  ({ chromium } = require('playwright'));
} catch {
  try {
    const root = require('child_process').execSync('npm root -g').toString().trim();
    ({ chromium } = require(path.join(root, 'playwright')));
  } catch {
    die('playwright not resolvable. Try: NODE_PATH=$(npm root -g) node render.js ...');
  }
}

const svg = fs.readFileSync(input, 'utf8');

// Work out the intrinsic size so the viewport matches the artwork exactly.
// Without this the screenshot picks up page margins or clips the artboard.
function intrinsicSize(src) {
  const viewBox = src.match(/viewBox\s*=\s*["']\s*([-\d.]+)[,\s]+([-\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  const attr = (n) => {
    const m = src.match(new RegExp(`<svg[^>]*\\s${n}\\s*=\\s*["']([\\d.]+)`, 'i'));
    return m ? Number(m[1]) : null;
  };
  if (viewBox) return { w: Number(viewBox[3]), h: Number(viewBox[4]) };
  const w = attr('width');
  const h = attr('height');
  if (w && h) return { w, h };
  return null;
}

const size = intrinsicSize(svg);
if (!size) die('could not determine size: give the <svg> a viewBox (preferred) or width+height');

let { w, h } = size;
if (forcedWidth) {
  h = Math.round((h / w) * forcedWidth);
  w = forcedWidth;
}

const html = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:${bg || 'transparent'};}
  svg{display:block;width:${w}px;height:${h}px;}
</style>
${svg}`;

(async () => {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
  try {
    const page = await browser.newPage({
      viewport: { width: Math.ceil(w), height: Math.ceil(h) },
      deviceScaleFactor: scale,
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.setContent(html, { waitUntil: 'load' });
    // Give webfonts and filter chains a frame to settle before capturing.
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(150);

    fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
    await page.screenshot({ path: output, omitBackground: !bg });

    if (errors.length) console.error(`render.js: page errors (output still written):\n  ${errors.join('\n  ')}`);
    console.log(`${output} ${Math.round(w * scale)}x${Math.round(h * scale)}px (${w}x${h} @${scale}x)`);
  } finally {
    await browser.close();
  }
})().catch((e) => die(e && e.message ? e.message : String(e)));
