// Headless smoke test for index.html.
// Usage: node .dev/smoke.js [scenario.js ...] [--shot name] [--secs N]
// - Serves ../index.html, maps the three.js CDN to the local node_modules copy.
// Real time vs game time: step() is deterministic game time, not wall clock.
// - Clicks "Play on desktop", runs the game, then runs each scenario file.
//   A scenario file is `module.exports = async ({page, HM, step, log, assert}) => {...}`
//   where HM(expr) evaluates `expr` in the page with `HM` (window.HM) in scope,
//   and step(seconds) waits that long of real game time.
// - Fails (exit 1) on any uncaught page error, console.error, or failed assert.
// Prints "SMOKE PASS" or "SMOKE FAIL".
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const scenarios = [];
let shot = null, secs = 6;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--shot') shot = args[++i];
  else if (args[i] === '--secs') secs = +args[++i];
  else scenarios.push(path.resolve(args[i]));
}
const ROOT = path.resolve(__dirname, '..');
const THREE_DIR = path.join(__dirname, 'node_modules', 'three');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + (e.stack || e.message)));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push('console.error: ' + m.text()); });
  await page.route('**/*', async route => {
    const url = route.request().url();
    const m = url.match(/cdn\.jsdelivr\.net\/npm\/three@0\.160\.0\/(.*)$/);
    if (m) {
      const f = path.join(THREE_DIR, m[1]);
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(f) });
    }
    if (url.startsWith('http://hm.local/')) {
      const rel = decodeURIComponent(new URL(url).pathname.slice(1)) || 'index.html';
      const f = path.join(ROOT, rel);
      if (fs.existsSync(f) && fs.statSync(f).isFile()) {
        const ct = f.endsWith('.html') ? 'text/html' : f.endsWith('.js') ? 'application/javascript' : 'application/octet-stream';
        return route.fulfill({ status: 200, contentType: ct, body: fs.readFileSync(f) });
      }
      return route.fulfill({ status: 404, body: '' });
    }
    return route.abort();
  });
  let failed = false;
  const log = (...a) => console.log('  ', ...a);
  const assert = (cond, msg) => { if (!cond) { failed = true; console.log('  ASSERT FAIL:', msg); } else console.log('  ok:', msg); };
  const HM = (expr) => page.evaluate(`(()=>{const HM=window.HM;return (${expr});})()`);
  // step(s): advance s seconds of game time deterministically (30 fps, no rendering), then render once.
  const step = (s) => page.evaluate((n) => {
    const HM = window.HM; HM.renderer.setAnimationLoop(null); HM.fixedDt = 1 / 30; HM.noRender = true;
    for (let i = 0; i < n; i++) HM.frame();
    HM.noRender = false; HM.fixedDt = 0; HM.frame(); HM.renderer.setAnimationLoop(HM.frame);
  }, Math.round(s * 30));
  try {
    await page.goto('http://hm.local/index.html');
    await page.waitForFunction(() => window.HM && document.querySelector('#status') && /ready/i.test(document.querySelector('#status').textContent), null, { timeout: 60000 });
    log('boot:', await page.textContent('#status'));
    await page.click('#b-desk');
    await page.waitForFunction(() => window.HM.state.mode === 'play', null, { timeout: 60000 });
    await step(secs);
    log('mode:', await HM('HM.state.mode'));
    for (const s of scenarios) {
      console.log('scenario', path.basename(s));
      await require(s)({ page, HM, step, log, assert });
    }
    if (shot) await page.screenshot({ path: path.join(OUT, shot + '.png') });
  } catch (e) {
    failed = true; console.log('  EXCEPTION:', e.message);
  }
  for (const e of errors) console.log('  ' + e.split('\n').slice(0, 4).join('\n    '));
  await browser.close();
  const ok = !failed && errors.length === 0;
  console.log(ok ? 'SMOKE PASS' : 'SMOKE FAIL');
  process.exit(ok ? 0 : 1);
})();
