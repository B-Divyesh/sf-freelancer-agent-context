import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has one clear first action and no serious accessibility issues', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Keep client work apart/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', {name:/Try it with sample data/})).toBeVisible();
  const results = await new AxeBuilder({page: page as never}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('landing defers the release metadata request until after the first screen settles', async ({ page }) => {
  let releaseRequests = 0;
  await page.route('https://api.github.com/repos/B-Divyesh/sf-freelancer-agent-context/releases?per_page=1', async route => {
    releaseRequests += 1;
    await route.fulfill({json: [{assets: []}]});
  });
  await page.goto('/');
  await expect(page.getByRole('heading', {name:'Keep client work from crossing over'})).toBeVisible();
  await page.waitForTimeout(500);
  expect(releaseRequests).toBe(0);
  await expect.poll(() => releaseRequests, {timeout: 4_000}).toBe(1);
});

test('all routes are console-clean with one heading and no serious accessibility issues', async ({page}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  for (const path of ['/', '/demo', '/privacy', '/terms', '/not-a-page']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({page: page as never}).analyze();
    expect(results.violations.filter(item => ['serious','critical'].includes(item.impact ?? '')), path).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('cold-load keyboard order starts with the skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name:'Skip to main content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('workspace dialog is keyboard operable and reduced motion is respected', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/app');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.getByRole('button', {name:'Create a workspace'}).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', {name:'Create a client workspace'})).toBeVisible();
  expect(await page.locator('.button').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('@claim:demo-isolation sample changes never enter real storage', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('ccf:sentinel', 'real-data'));
  await page.goto('/demo');
  await page.getByLabel('Text to check (optional)').fill('A sample draft');
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByText('Session ready for Northstar Coffee')).toBeVisible();
  const storage = await page.evaluate(() => ({sentinel: localStorage.getItem('ccf:sentinel'), demoInLocal: localStorage.getItem('demo:workspace-state'), demoInSession: sessionStorage.getItem('demo:workspace-state')}));
  expect(storage.sentinel).toBe('real-data'); expect(storage.demoInLocal).toBeNull(); expect(storage.demoInSession).toContain('northstar');
});

test('@claim:boundary-check blocks another client name and a redaction term', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Text to check (optional)').fill('Use the Juniper Legal draft here.');
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByText('Fix 2 boundary checks')).toBeVisible();
  await expect(page.getByText(/Text names another client/)).toBeVisible();
  await expect(page.getByText(/Text contains redaction term/)).toBeVisible();
});

test('@claim:provenance-export exports the checked source record', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByText('Session ready for Northstar Coffee')).toBeVisible();
  await page.reload();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:/Export latest record/}).click();
  const download = await downloadPromise; const path = await download.path();
  expect(download.suggestedFilename()).toBe('ns-delivery-record.json');
  const content = await import('node:fs/promises').then(fs => fs.readFile(path!, 'utf8')); const record = JSON.parse(content);
  expect(record.client).toBe('Northstar Coffee'); expect(record.sources).toHaveLength(1); expect(record.checks).toHaveLength(3);
});

test('@claim:device-local browser workspace flow sends no workspace data off-origin', async ({ page }) => {
  const external: string[] = []; page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  await page.goto('/app');
  await page.getByRole('button', {name:'Create a workspace'}).click();
  await page.getByLabel('Client name').fill('Acorn');
  await page.getByLabel('Client brief').fill('Build the Acorn portal.');
  await page.getByLabel('Writing rule').fill('Use short sentences.');
  await page.getByLabel('First source label').fill('acorn/repo');
  await page.getByLabel('Local folder').fill('/projects/acorn');
  await page.getByLabel('First redaction term').fill('ACORN_KEY');
  await page.getByRole('button', {name:'Save workspace'}).click();
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByText('Session ready for Acorn')).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:offline-reload demo works offline after the first visit', async ({page, context}) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', {name:'Check this client session'})).toBeVisible();
  await expect(page.getByText('Offline · device local')).toBeVisible();
});

test('@claim:plan-limit free stops at two workspaces and Pro allows more than two', async ({page}) => {
  const create = async (name: string) => {
    await page.getByRole('button', {name:'Create a workspace'}).click();
    await page.getByLabel('Client name').fill(name);
    await page.getByLabel('Client brief').last().fill(`Brief for ${name}`);
    await page.getByLabel('Writing rule').last().fill('Use short sentences.');
    await page.getByLabel('First source label').fill(`${name.toLowerCase()}/repo`);
    await page.getByLabel('Local folder').last().fill(`/projects/${name.toLowerCase()}`);
    await page.getByLabel('Account reminder').last().fill(`${name.toLowerCase()}@example.test`);
    await page.getByLabel('First redaction term').fill(`${name.toUpperCase()}_KEY`);
    await page.getByRole('button', {name:'Save workspace'}).click();
  };
  await page.goto('/app'); await create('Acorn'); await create('Birch');
  await create('Cedar'); await expect(page.getByText(/free plan includes two workspaces/i)).toBeVisible();
  expect(await page.getByRole('tab').count()).toBe(2);
  await page.evaluate(() => localStorage.setItem('sb_license_verdict:freelancer-agent-context', JSON.stringify({valid:true,checkedAt:Date.now()})));
  await create('Cedar'); expect(await page.getByRole('tab').count()).toBe(3);
});

test('@claim:free-core free workspaces can check and export a delivery record', async ({page}) => {
  await page.goto('/demo');
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByText('Session ready for Northstar Coffee')).toBeVisible();
  await page.reload();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:/Export latest record/}).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('ns-delivery-record.json');
});

test('@claim:paid-checkout Buy Pro starts the hosted Sociobot checkout', async ({request}) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/freelancer-agent-context/checkout', {maxRedirects: 0});
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});

test('@claim:offline-update replaces a stale cached shell', async ({page}) => {
  await page.goto('/test/sw-driver.html');
  await page.evaluate(async () => {
    const current = await navigator.serviceWorker.getRegistrations();
    await Promise.all(current.map(registration => registration.unregister()));
    await Promise.all((await caches.keys()).map(key => caches.delete(key)));
    const legacy = await navigator.serviceWorker.register('/test/legacy-sw.js', {scope:'/'});
    await new Promise<void>(resolve => {
      if (legacy.active) return resolve();
      const worker = legacy.installing ?? legacy.waiting;
      worker?.addEventListener('statechange', () => { if (worker.state === 'activated') resolve(); });
    });
    await navigator.serviceWorker.register('/sw.js', {scope:'/'});
  });
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).sort())).toEqual(['ccf-shell-v0.1.2']);
  await page.goto('/');
  await expect(page.getByRole('heading', {name:'Keep client work from crossing over'})).toBeVisible();
  await expect(page.getByText('stale shell')).toHaveCount(0);
});

test('mobile demo remains usable at 390 pixels', async ({ page }) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/demo');
  await expect(page.getByRole('button', {name:/Check boundary/})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
