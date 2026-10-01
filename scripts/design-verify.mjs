import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import axe from 'axe-core';
const base = process.env.BASE_URL || 'http://127.0.0.1:4180';
await mkdir('qa/studio', { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference', hasTouch: name === 'mobile' });
    const errors = [], violations = [], requests = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', request => requests.push(request.url()));
    await page.addInitScript(() => document.addEventListener('securitypolicyviolation', e => console.error('CSPTEST:' + e.violatedDirective)));
    page.on('console', e => { if (e.text().startsWith('CSPTEST:')) violations.push(e.text()); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Endast nödvändiga' }).click();
    assert.equal(await page.locator('.sculpture-showcase, canvas').count(), 0, '3D removed');
    assert.equal(await page.locator('.hero-art button, .hero-art-top').count(), 0, 'video options removed');
    await page.waitForFunction(() => document.querySelector('.hero-video').currentTime > .15);
    assert(await page.locator('.hero-video').evaluate(v => v.muted && !v.loop && !v.controls), 'silent bounded autoplay without controls');
    await page.waitForFunction(() => { const v = document.querySelector('.hero-video'); return v.paused && (v.ended || v.currentTime >= 3); });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `qa/studio/${name}-hero.png` });
    await page.locator('.craft-panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700); // Let the existing scroll entrance settle before visual capture.
    assert(await page.locator('.craft-panel').evaluate(el => getComputedStyle(el).backdropFilter.includes('blur')), 'frosted material');
    await page.screenshot({ path: `qa/studio/${name}-glass.png` });
    await page.locator('.studio-projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `qa/studio/${name}-concepts.png` });
    assert.equal(await page.locator('.concept-card').count(), 2);
    assert.equal(await page.locator('.workshop-row').count(), 3);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
    await page.evaluate(axe.source);
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `qa/studio/${name}-home.png`, fullPage: true });
    await page.locator('.film-brief .button').click();
    await page.waitForURL('**/bestall');
    assert(await page.getByRole('switch', { name: 'Vi är ett UF-företag' }).isVisible());
    assert(!requests.some(url => /three\.module|forge-scene|ConvexGeometry|RoomEnvironment/.test(url)), 'no 3D bundles fetched');
    assert.deepEqual(errors, []); assert.deepEqual(violations, []);
    await page.close(); console.log(`${name}: composition, glass, video, removed 3D, CTA, axe and CSP passed`);
  }
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  await reduced.getByRole('button', { name: 'Endast nödvändiga' }).click();
  await reduced.waitForFunction(() => document.querySelector('.hero-video').currentTime > .15);
  assert(await reduced.locator('.hero-video').evaluate(v => v.muted), 'owner-approved reduced motion autoplay is silent');
  await reduced.close();
  console.log('Owner-approved reduced motion autoplay passed. No real emails sent.');
} finally { await browser.close(); }
