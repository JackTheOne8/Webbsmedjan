import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://[::1]:5173';
const origin = new URL(base).origin;
const browser = await chromium.launch({ channel: process.platform === 'win32' ? 'msedge' : undefined, headless: true });
const routes = ['/', '/tjanster', '/bestall', '/referenser', '/om-oss', '/kontakt', '/integritet', '/cookies', '/villkor'];
const failures = [];

try {
  for (const [device, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport });
    await page.goto(origin, { waitUntil: 'networkidle' });

    // Dismiss the modal before exercising background navigation.
    await page.getByRole('button', { name: 'Endast nödvändiga' }).click();
    if (device === 'mobile') await page.getByRole('button', { name: /Meny/ }).click();
    await page.getByRole('navigation', { name: 'Huvudmeny' }).getByRole('link', { name: 'Tjänster' }).click();
    if (new URL(page.url()).pathname !== '/tjanster') failures.push(`${device}: main navigation did not open /tjanster`);

    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Beställ webbsida' }).first().click();
    if (new URL(page.url()).pathname !== '/bestall') failures.push(`${device}: hero CTA did not open /bestall`);

    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Se konceptet Rum & Ro' }).click();
    if (!page.url().endsWith('/referenser#rum-och-ro')) failures.push(`${device}: concept link did not reach its section`);

    await page.locator('#rum-och-ro .concept-faux-button').click();
    if (new URL(page.url()).pathname !== '/bestall') failures.push(`${device}: concept CTA did not open /bestall`);

    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.locator('.footer-links').getByRole('link', { name: 'Kontakt' }).click();
    if (new URL(page.url()).pathname !== '/kontakt') failures.push(`${device}: footer link did not open /kontakt`);
    await page.close();
  }

  const page = await browser.newPage();
  const hrefs = new Set();
  for (const route of routes) {
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
    if (response?.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
    for (const href of await page.locator('a[href]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      if (href?.startsWith('/')) hrefs.add(href.split('#')[0] || '/');
    }
  }
  for (const href of hrefs) {
    const response = await page.request.get(`${origin}${href}`);
    if (response.status() !== 200) failures.push(`${href}: linked destination returned HTTP ${response.status()}`);
  }
  await page.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Navigation and ${routes.length} routes passed on desktop and mobile.`);
}
