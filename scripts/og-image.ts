// Generates public/og.png, the 1200x630 social preview image (feature F9), from content/profile.json.
// No photo (feature F9: ask before using one). Run it again whenever the profile changes:
//   npm run og:image            (PW_CHANNEL=chrome to use an installed Google Chrome)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { en } from '../src/i18n/en';
import { formatMonth } from '../src/lib/format/dates';

const root = resolve(import.meta.dirname, '..');
const profile = JSON.parse(
  readFileSync(resolve(root, 'content/profile.json'), 'utf8'),
) as {
  name: string;
  headline: string;
  school: string;
  yearLabel: string;
  modelVersion: string;
  seeking: { role: string; duration: string; start: string };
};

// Inlined as data URLs: a page set with setContent cannot load file:// fonts.
const font = (file: string) =>
  `data:font/woff2;base64,${readFileSync(resolve(root, 'public/fonts', file)).toString('base64')}`;

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const brand = `HAMZA-${profile.modelVersion.toUpperCase()}`;
const facts = `${profile.headline} · ${profile.school} · ${profile.yearLabel}`;
const seeking = `${profile.seeking.role} · from ${formatMonth(profile.seeking.start)} · ${profile.seeking.duration}`;

// Colours mirror src/styles/tokens.css.
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Space Grotesk'; font-weight: 700; src: url('${font('space-grotesk-latin-700-normal.woff2')}'); }
  @font-face { font-family: 'JetBrains Mono'; font-weight: 400; src: url('${font('jetbrains-mono-latin-400-normal.woff2')}'); }
  @font-face { font-family: 'JetBrains Mono'; font-weight: 700; src: url('${font('jetbrains-mono-latin-700-normal.woff2')}'); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body { display: flex; flex-direction: column; justify-content: space-between; padding: 56px 64px;
    background: #f1f0ea; color: #0e0e0e; font-family: 'JetBrains Mono', monospace;
    border: 12px solid #0e0e0e; }
  .top { display: flex; justify-content: space-between; align-items: center; font-size: 26px; font-weight: 700; }
  .status { padding: 8px 16px; background: #0e0e0e; color: #c6ff3d; font-size: 22px; }
  h1 { font-family: 'Space Grotesk', sans-serif; font-size: 112px; line-height: 0.95; letter-spacing: -0.045em; }
  .facts { margin-top: 24px; font-size: 26px; color: #444444; }
  .seeking { align-self: flex-start; padding: 18px 24px; background: #c6ff3d; border: 4px solid #0e0e0e;
    box-shadow: 10px 10px 0 #0e0e0e; font-size: 24px; font-weight: 700; white-space: nowrap; }
</style></head><body>
  <div class="top"><span>${escape(brand)}</span><span class="status">${escape(en.hero.statusPrefix + en.hero.available)}</span></div>
  <div><h1>${escape(profile.name)}</h1><p class="facts">${escape(facts)}</p></div>
  <p class="seeking">${escape(seeking)}</p>
</body></html>`;

const channel = process.env['PW_CHANNEL'];
const browser = await chromium.launch(channel ? { channel } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
const out = resolve(root, 'public/og.png');
await page.screenshot({ path: out, type: 'png' });
await browser.close();
console.log(`Wrote ${out}`);
