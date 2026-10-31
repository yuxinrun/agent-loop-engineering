// Inline the built JS/CSS into dist/index.html so the site also works when
// opened directly from disk (file://), not only from a static web server.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const htmlPath = join(dist, 'index.html');

let html = await readFile(htmlPath, 'utf8');

const scriptMatch = html.match(/<script type="module"[^>]*src="\.\/assets\/([^"]+\.js)"[^>]*><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet"[^>]*href="\.\/assets\/([^"]+\.css)"[^>]*>/);

if (!scriptMatch || !styleMatch) {
  throw new Error('inline-build: expected hashed JS/CSS asset tags were not found in dist/index.html');
}

const js = (await readFile(join(dist, 'assets', scriptMatch[1]), 'utf8')).replace(/<\/script/gi, '<\\/script');
const css = await readFile(join(dist, 'assets', styleMatch[1]), 'utf8');

// Function replacers: a string replacement would expand `$&`, `$'` etc. that
// appear inside the minified JS/CSS and corrupt the bundle.
html = html
  .replace(styleMatch[0], () => `<style>${css}</style>`)
  .replace(scriptMatch[0], () => `<script type="module">${js}</script>`);

await writeFile(htmlPath, html, 'utf8');
await rm(join(dist, 'assets'), { recursive: true, force: true });

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
console.log(`inline-build: dist/index.html is now self-contained (${kb} kB, gzip ~135 kB)`);
