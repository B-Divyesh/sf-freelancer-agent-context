import { chromium, request as requestApi } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'https://freelancer-agent-context.sociobot.in';
const out = '.factory/qa-evidence/review-2';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const result = { generatedAt: new Date().toISOString(), base, firstRead: {}, demo: {}, routes: [], links: [], history: {}, offline: {} };

for (const [name, viewport] of Object.entries({ mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } })) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  page.on('request', request => requests.push(request.url()));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  const snapshot = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const h1 = document.querySelector('h1');
    const action = document.querySelector('.hero-actions');
    const facts = document.querySelector('.facts');
    const rect = element => element ? ({ top: element.getBoundingClientRect().top, bottom: element.getBoundingClientRect().bottom, height: element.getBoundingClientRect().height }) : null;
    return {
      title: document.title,
      h1: h1?.textContent?.trim(),
      lede: document.querySelector('.lede')?.textContent?.trim(),
      primary: document.querySelector('.hero-actions a')?.textContent?.replace(/\s+/g, ' ').trim(),
      adjacent: document.querySelector('.hero-actions span')?.textContent?.trim(),
      facts: [...document.querySelectorAll('.facts li')].map(node => node.textContent?.replace(/\s+/g, ' ').trim()),
      visibleText: document.body.innerText,
      scrollY,
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      heroRect: rect(hero), h1Rect: rect(h1), actionRect: rect(action), factsRect: rect(facts),
    };
  });
  await page.screenshot({ path: `${out}/cold-${name}.png`, fullPage: false });
  result.firstRead[name] = { status: response?.status(), ...snapshot, requests, consoleErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  const consoleErrors = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), type: request.resourceType() }));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto(base);
  await page.evaluate(() => localStorage.setItem('ccf:sentinel', 'real-data'));
  await page.getByRole('link', { name: /Try it with sample data/ }).evaluate(link => link.click());
  await page.waitForLoadState('networkidle');
  const initial = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    banner: document.querySelector('.demo-banner')?.textContent?.replace(/\s+/g, ' ').trim(),
    body: document.body.innerText,
    local: { ...localStorage }, session: { ...sessionStorage },
  }));
  await page.screenshot({ path: `${out}/demo-initial-mobile.png`, fullPage: false });
  await page.getByLabel('Text to check (optional)').fill('Use the Juniper Legal draft with NS_LIVE_KEY.');
  await page.getByRole('button', { name: /Check boundary/ }).click();
  const blocked = await page.locator('#check-result').innerText();
  await page.getByLabel('Text to check (optional)').fill('A clean sample draft.');
  await page.getByRole('button', { name: /Check boundary/ }).click();
  await page.getByText('Sample check complete for Northstar Coffee').waitFor();
  const changedStorage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const afterReset = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage }, body: document.body.innerText }));
  await page.getByRole('link', { name: 'Start for real' }).click();
  const afterReal = await page.evaluate(() => ({ url: location.href, local: { ...localStorage }, session: { ...sessionStorage }, h1: document.querySelector('h1')?.textContent?.trim() }));
  result.demo = { initial, blocked, changedStorage, afterReset, afterReal, requests, consoleErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const paths = ['/', '/demo', '/app', '/privacy', '/terms', '/art-provenance', '/not-a-real-page'];
  for (const path of paths) {
    const consoleErrors = [];
    const pageErrors = [];
    page.removeAllListeners('console'); page.removeAllListeners('pageerror');
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', error => pageErrors.push(error.message));
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const data = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
      favicon: document.querySelector('link[rel="icon"]')?.href,
      appleTouch: document.querySelector('link[rel="apple-touch-icon"]')?.href,
      lang: document.documentElement.lang,
      h1s: [...document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
      headings: [...document.querySelectorAll('h1,h2,h3')].map(node => ({ level: Number(node.tagName.slice(1)), text: node.textContent?.trim() })),
      main: Boolean(document.querySelector('main')),
      header: document.querySelector('header')?.innerText,
      footer: document.querySelector('footer')?.innerText,
      links: [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent?.replace(/\s+/g, ' ').trim(), href: a.href, rel: a.rel })),
    }));
    result.routes.push({ path, status: response?.status(), ...data, consoleErrors, pageErrors, axe: axe.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? '')).map(v => ({ id: v.id, impact: v.impact, description: v.description })) });
  }
  await page.goto(base);
  await page.waitForTimeout(3500);
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ text: a.textContent?.replace(/\s+/g, ' ').trim(), href: a.href })));
  const api = await requestApi.newContext();
  for (const link of [...new Map(links.map(item => [item.href, item])).values()]) {
    if (/^(mailto:|javascript:)/.test(link.href)) { result.links.push({ ...link, skipped: 'non-http' }); continue; }
    try {
      const response = await api.get(link.href, { maxRedirects: 5, timeout: 30000 });
      result.links.push({ ...link, status: response.status(), finalUrl: response.url() });
    } catch (error) { result.links.push({ ...link, error: String(error) }); }
  }
  await api.dispose();
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(() => scrollTo(0, 1200));
  await page.waitForFunction(() => scrollY > 1000);
  const before = await page.evaluate(() => scrollY);
  await page.getByRole('link', { name: /Try it with sample data/ }).evaluate(link => link.click());
  const demoFocused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim(), y: scrollY }));
  await page.goBack();
  await page.waitForFunction(expected => Math.abs(scrollY - expected) < 10, before);
  result.history = { before, after: await page.evaluate(() => scrollY), focused: await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() })), demoFocused };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto(`${base}/demo`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  let error = null;
  try { await page.reload({ waitUntil: 'domcontentloaded' }); } catch (cause) { error = String(cause); }
  result.offline = { error, h1: await page.locator('h1').textContent(), chip: await page.locator('.state-chip').textContent(), requests };
  await context.close();
}

await browser.close();
await writeFile(`${out}/live-audit.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ firstRead: result.firstRead, demo: { initial: result.demo.initial, blocked: result.demo.blocked, changedStorage: result.demo.changedStorage, afterReset: result.demo.afterReset, afterReal: result.demo.afterReal, consoleErrors: result.demo.consoleErrors }, routes: result.routes, links: result.links, history: result.history, offline: result.offline }, null, 2));
