import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import axe from 'axe-core';

const base = process.env.BASE_URL || 'http://127.0.0.1:4180';
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true });
await mkdir('qa/security', { recursive: true });
try {
  for (const [device, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    const csp = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => document.addEventListener('securitypolicyviolation', event => { (window.__cspViolations ||= []).push(event.violatedDirective); }));
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    const headers = response.headers();
    assert.equal(headers['x-content-type-options'], 'nosniff');
    assert.equal(headers['x-frame-options'], 'DENY');
    assert.equal(headers['referrer-policy'], 'strict-origin-when-cross-origin');
    assert.match(headers['strict-transport-security'], /max-age=31536000/);
    assert.match(headers['content-security-policy'], /frame-ancestors 'none'/);
    assert.doesNotMatch(headers['content-security-policy'].split(';').find(value => value.includes('script-src')), /unsafe-inline|unsafe-eval/);
    assert.match(headers['cache-control'], /no-store/);
    const nonce = headers['content-security-policy'].match(/'nonce-([^']+)'/)[1];
    const scripts = await page.locator('script').evaluateAll(elements => elements.filter(element => element.type !== 'application/ld+json' && element.type !== 'application/json').map(element => element.nonce));
    assert.ok(scripts.length && scripts.every(value => value === nonce), 'all executable scripts have the response nonce');
    const next = await page.request.get(base);
    assert.notEqual(next.headers()['content-security-policy'].match(/'nonce-([^']+)'/)[1], nonce, 'nonces are unique per response');
    await page.getByRole('dialog').waitFor();
    for (let index = 0; index < 10; index++) {
      await page.keyboard.press(index % 2 ? 'Shift+Tab' : 'Tab');
      assert.ok(await page.evaluate(() => document.querySelector('.cookie-panel').contains(document.activeElement)), 'cookie focus stays within dialog');
    }
    await page.evaluate(axe.source);
    const consentAxe = await page.evaluate(() => window.axe.run(document, { runOnly: { type:'tag', values:['wcag2a','wcag2aa','wcag21aa'] } }));
    assert.deepEqual(consentAxe.violations.map(value => value.id), []);
    await page.screenshot({ path:`qa/security/${device}-cookies.png` });
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state:'hidden' });
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('webbsmedjan-cookie-choice-v1')).statistics), false);
    await page.getByRole('button', { name:'Cookieinställningar' }).click();
    await page.getByRole('button', { name:'Spara inställningar' }).click();
    assert.equal(await page.getByRole('button', { name:'Cookieinställningar' }).evaluate(element => element === document.activeElement), true, 'cookie dialog restores trigger focus');

    for (const [route, kind, button] of [['/bestall','order','Skicka beställningsförfrågan'], ['/kontakt','contact','Skicka förfrågan']]) {
      await page.goto(`${base}${route}`, { waitUntil:'networkidle' });
      await page.getByPlaceholder('För- och efternamn').fill('Säkerhetstest');
      await page.getByPlaceholder('namn@foretag.se').fill('test@example.com');
      await page.getByPlaceholder('Företagets namn').fill('TEST – inget utskick');
      await page.getByPlaceholder('Vad ska er webbplats göra?').fill('Lokalt test av felhantering. Ingen beställning eller mejlleverans.');
      await page.getByRole('checkbox', { name:/Jag godkänner/ }).check();
      let release;
      const gate = new Promise(resolve => { release = resolve; });
      let calls = 0;
      await page.route(`**/api/${kind}`, async intercepted => {
        calls++;
        if (calls === 1) {
          await gate;
          await intercepted.fulfill({ status:503, contentType:'text/html', body:'<h1>Internal private error detail</h1>' });
        } else await intercepted.fulfill({ json:{ success:true, message:'Din förfrågan har skickats. Lokalt test.' } });
      });
      await page.getByRole('button', { name:button, exact:true }).click();
      await page.getByRole('button', { name:'Skickar…' }).waitFor();
      assert.equal(await page.getByPlaceholder('För- och efternamn').isDisabled(), true, 'fields lock while sending');
      release();
      await page.getByText(/Mejlet kunde inte skickas/).waitFor();
      assert.equal(await page.getByPlaceholder('För- och efternamn').isEnabled(), true, 'failed send restores editing');
      assert.equal(await page.getByText(/Internal private error detail/).count(), 0, 'HTML error details stay hidden');
      assert.equal(await page.getByPlaceholder('För- och efternamn').inputValue(), 'Säkerhetstest');
      await page.getByRole('button', { name:button, exact:true }).click();
      await page.getByText(/Din förfrågan har skickats/).waitFor();
      assert.equal(await page.getByRole('button', { name:'Skickat', exact:true }).isDisabled(), true, 'successful send prevents a duplicate click');
      assert.equal(calls, 2);
      await page.unroute(`**/api/${kind}`);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path:`qa/security/${device}-${kind}-success.png`, fullPage:true });
    }
    csp.push(...await page.evaluate(() => window.__cspViolations || []));
    assert.deepEqual(csp, [], `${device}: CSP violations`);
    assert.deepEqual(errors, [], `${device}: browser errors`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.close();
  }
  for (const state of ['blocked', 'invalid']) {
    const page = await browser.newPage();
    await page.addInitScript(mode => {
      if (mode === 'blocked') {
        Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new DOMException('Blocked','SecurityError'); };
      } else localStorage.setItem('webbsmedjan-cookie-choice-v1', JSON.stringify({ necessary:true, statistics:'false', marketing:'true' }));
    }, state);
    await page.goto(base, { waitUntil:'networkidle' });
    await page.getByRole('dialog').waitFor();
    await page.getByRole('button', { name:'Endast nödvändiga' }).click();
    await page.getByRole('dialog').waitFor({ state:'hidden' });
    await page.getByRole('link', { name:'Beställ webbsida', exact:true }).first().click();
    assert.ok(page.url().endsWith('/bestall'), `${state}: site remains navigable`);
    await page.close();
  }
  console.log('Security headers, unique CSP nonces, cookie keyboard/storage, loading, failure/retry, duplicate clicks and desktop/mobile checks passed. No real emails sent.');
} finally { await browser.close(); }
