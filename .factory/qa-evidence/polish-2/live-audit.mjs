import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = 'https://freelancer-agent-context.sociobot.in';
const out = '.factory/qa-evidence/polish-2';
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), base, routes: [], demo: {}, mobile: {}, offline: {}, textResize: {} };

for (const path of ['/', '/demo', '/app', '/privacy', '/terms', '/art-provenance', '/missing-page']) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  const axe = await new AxeBuilder({ page }).analyze();
  report.routes.push(await page.evaluate(({ path, status, consoleErrors, pageErrors, violations }) => ({
    path,
    status,
    title: document.title,
    lang: document.documentElement.lang,
    h1: [...document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
    main: Boolean(document.querySelector('main')),
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    description: document.querySelector('meta[name="description"]')?.content,
    consoleErrors,
    pageErrors,
    seriousOrCriticalAxe: violations,
    externalLinksWithoutLabel: [...document.querySelectorAll('a[target="_blank"]')]
      .filter(link => !/external site/i.test(link.textContent ?? ''))
      .map(link => link.getAttribute('href')),
  }), {
    path,
    status: response?.status(),
    consoleErrors,
    pageErrors,
    violations: axe.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? '')).map(item => item.id),
  }));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/live-landing-mobile.png`, fullPage: false });
  report.mobile = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    action: document.querySelector('.hero-actions a')?.textContent?.replace(/\s+/g, ' ').trim(),
    facts: [...document.querySelectorAll('.facts li')].map(node => node.textContent?.replace(/\s+/g, ' ').trim()),
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  await page.evaluate(() => localStorage.setItem('ccf:real-sentinel', 'preserved'));
  await page.getByRole('link', { name: /Try it with sample data/i }).click();
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${out}/live-demo-mobile.png`, fullPage: false });
  const entered = await page.evaluate(() => ({
    url: location.href,
    banner: document.querySelector('.demo-banner')?.textContent?.replace(/\s+/g, ' ').trim(),
    realSentinel: localStorage.getItem('ccf:real-sentinel'),
    demoKeys: Object.keys(sessionStorage),
  }));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const reset = await page.evaluate(() => ({ realSentinel: localStorage.getItem('ccf:real-sentinel'), demoKeys: Object.keys(sessionStorage) }));
  await page.getByRole('link', { name: 'Start for real' }).click();
  const startedReal = await page.evaluate(() => ({ url: location.href, realSentinel: localStorage.getItem('ccf:real-sentinel'), demoKeys: Object.keys(sessionStorage) }));
  report.demo = { entered, reset, startedReal, consoleErrors, crossOriginRequests: requests.filter(item => new URL(item.url).origin !== new URL(base).origin) };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.screenshot({ path: `${out}/live-demo-text-200.png`, fullPage: false });
  report.textResize = await page.evaluate(() => ({
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    h1Visible: Boolean(document.querySelector('h1')?.getBoundingClientRect().height),
    resetVisible: Boolean([...document.querySelectorAll('button')].find(button => /Reset demo/.test(button.textContent ?? ''))?.getBoundingClientRect().height),
    startVisible: Boolean([...document.querySelectorAll('a')].find(link => /Start for real/.test(link.textContent ?? ''))?.getBoundingClientRect().height),
  }));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/demo`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  report.offline = {
    h1: await page.locator('h1').textContent(),
    status: await page.locator('.state-chip').textContent(),
  };
  await context.close();
}

await browser.close();
await writeFile(`${out}/live-audit.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
