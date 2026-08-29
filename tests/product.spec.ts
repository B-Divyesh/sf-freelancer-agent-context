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
  for (const path of ['/', '/demo', '/app', '/privacy', '/terms']) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({page: page as never}).analyze();
    expect(results.violations.filter(item => ['serious','critical'].includes(item.impact ?? '')), path).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('light and dark themes have no serious accessibility issues', async ({page}) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({colorScheme});
    for (const path of ['/', '/demo']) {
      await page.goto(path);
      const results = await new AxeBuilder({page: page as never}).analyze();
      expect(results.violations.filter(item => ['serious','critical'].includes(item.impact ?? '')), `${colorScheme} ${path}`).toEqual([]);
    }
  }
});

test('unknown routes return HTTP 404 with the designed not-found screen', async ({page}) => {
  const response = await page.goto('/not-a-real-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {name:'This page was not found'})).toBeVisible();
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
  await expect(page.getByText('Sample check complete for Northstar Coffee')).toBeVisible();
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

test('@claim:provenance-export exports an explicitly simulated sample record', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByText('Sample check complete for Northstar Coffee')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:/Export sample record/}).click();
  const download = await downloadPromise; const path = await download.path();
  expect(download.suggestedFilename()).toBe('ns-delivery-record.json');
  const content = await import('node:fs/promises').then(fs => fs.readFile(path!, 'utf8')); const record = JSON.parse(content);
  expect(record.client).toBe('Northstar Coffee'); expect(record.sources).toHaveLength(1); expect(record.status).toBe('sample'); expect(record.launches).toEqual([]); expect(record.statement).toMatch(/No local folder/);
});

test('failed workspace saves stay retryable and never display unsaved data as saved', async ({page}) => {
  await page.goto('/app');
  await page.getByRole('button', {name:'Create a workspace'}).click();
  await page.getByLabel('Client name').fill('Acorn');
  await page.getByLabel('Client brief').fill('Build the Acorn portal.');
  await page.getByLabel('Writing rule').fill('Use short sentences.');
  await page.getByLabel('First source label').fill('acorn/repo');
  await page.getByLabel('Local folder').fill('/projects/acorn');
  await page.getByLabel('First redaction term').fill('ACORN_KEY');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'ccf:workspace-state') throw new DOMException('Storage full', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await page.getByRole('button', {name:'Save workspace'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText(/could not be saved/i);
  await expect(page.getByLabel('Client name')).toHaveValue('Acorn');
  expect(await page.evaluate(() => localStorage.getItem('ccf:workspace-state'))).toBeNull();
  await page.reload();
  await expect(page.getByRole('heading', {name:'Create your first client workspace'})).toBeVisible();
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
  await expect(page.getByRole('heading', {name:'Open this workspace in the desktop app'})).toBeVisible();
  expect(external).toEqual([]);
});

test('browser preview never exports a passing record before native folder and profile validation', async ({page}) => {
  await page.goto('/app');
  await page.getByRole('button', {name:'Create a workspace'}).click();
  await page.getByLabel('Client name').fill('Impossible Path Client');
  await page.getByLabel('Client brief').fill('Build the client portal.');
  await page.getByLabel('Writing rule').fill('Use short sentences.');
  await page.getByLabel('First source label').fill('impossible/repo');
  await page.getByLabel('Local folder').fill('/definitely/not/a/real/folder/qa-regression');
  await page.getByLabel('First redaction term').fill('IMPOSSIBLE_KEY');
  await page.getByRole('button', {name:'Save workspace'}).click();
  await page.getByRole('button', {name:/Check boundary/}).click();
  await expect(page.getByRole('heading', {name:'Open this workspace in the desktop app'})).toBeVisible();
  await expect(page.getByRole('button', {name:/Export latest record|Export sample record/})).toHaveCount(0);
  await expect(page.getByText(/No delivery records yet/)).toBeVisible();
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
  await expect(page.getByText('Sample check complete for Northstar Coffee')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:/Export sample record/}).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('ns-delivery-record.json');
});

test('@claim:paid-checkout Buy Pro starts the hosted Sociobot checkout', async ({request}) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/freelancer-agent-context/checkout', {maxRedirects: 0});
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
  const checkout = await request.get(response.headers().location!);
  expect(checkout.status()).toBe(200);
  const body = await checkout.text();
  expect(body).toContain('$19.00');
  expect(body).toContain('One-time Pro license');
});

test('license return verifies its token only once', async ({page}) => {
  let requests = 0;
  await page.route('https://api.sociobot.in/api/v1/products/freelancer-agent-context/verify?license=return-token', async route => {
    requests += 1;
    await new Promise(resolve => setTimeout(resolve, 100));
    await route.fulfill({json:{valid:false,reason:'invalid'}});
  });
  await page.goto('/?license=return-token');
  await expect.poll(() => requests).toBe(1);
  await page.waitForTimeout(250);
  expect(requests).toBe(1);
  expect(page.url()).not.toContain('license=');
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
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).sort())).toEqual(['ccf-shell-v0.1.5']);
  await page.goto('/');
  await expect(page.getByRole('heading', {name:'Keep client work from crossing over'})).toBeVisible();
  await expect(page.getByText('stale shell')).toHaveCount(0);
});

test('mobile demo remains usable at 390 pixels', async ({ page }) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/demo');
  await expect(page.getByRole('button', {name:/Check boundary/})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const targets = page.locator('.site-header a, footer a, .demo-banner button, .demo-banner a');
  for (let index = 0; index < await targets.count(); index += 1) {
    const box = await targets.nth(index).boundingBox();
    expect(box?.width, await targets.nth(index).textContent() ?? '').toBeGreaterThanOrEqual(44);
    expect(box?.height, await targets.nth(index).textContent() ?? '').toBeGreaterThanOrEqual(44);
  }
});

test('workspace tabs support arrow, Home, and End keys', async ({page}) => {
  await page.goto('/demo');
  const northstar = page.getByRole('tab', {name:/Northstar Coffee/});
  const juniper = page.getByRole('tab', {name:/Juniper Legal/});
  await northstar.focus();
  await page.keyboard.press('ArrowRight');
  await expect(juniper).toBeFocused();
  await expect(juniper).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(northstar).toBeFocused();
  await expect(northstar).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(juniper).toBeFocused();
});

test('@claim:workspace-backup omits sign-ins and requires folder confirmation before import', async ({page}) => {
  await page.goto('/app');
  await page.getByRole('button', {name:'Create a workspace'}).click();
  await page.getByLabel('Client name').fill('Acorn');
  await page.getByLabel('Client brief').fill('Build the Acorn portal.');
  await page.getByLabel('Writing rule').fill('Use short sentences.');
  await page.getByLabel('First source label').fill('acorn/repo');
  await page.getByLabel('Local folder').fill('/projects/acorn');
  await page.getByLabel('Account reminder').fill('acorn@example.test');
  await page.getByLabel('First redaction term').fill('ACORN_KEY');
  await page.getByRole('button', {name:'Save workspace'}).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:'Export workspace'}).click();
  const download = await downloadPromise; const backupPath = await download.path();
  expect(JSON.parse(await import('node:fs/promises').then(fs => fs.readFile(backupPath!, 'utf8'))).workspace.sources[0].account).toBeUndefined();
  await page.evaluate(() => localStorage.removeItem('ccf:workspace-state'));
  await page.reload();
  await page.getByRole('button', {name:'Import workspace'}).click();
  await page.getByLabel('Workspace backup file').setInputFiles(backupPath!);
  await expect(page.getByText(/Acorn: 1 source and 1 rule/)).toBeVisible();
  await expect(page.getByRole('button', {name:'Import workspace'}).last()).toBeDisabled();
  await page.getByLabel(/I will review saved paths/).check();
  await page.getByRole('button', {name:'Import workspace'}).last().click();
  await expect(page.getByRole('heading', {name:'Check this client session'})).toBeVisible();
  await expect(page.getByText(/Sign-in reminder/)).toHaveCount(0);
});

test('Back navigation preserves landing scroll position', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1000));
  const before = await page.evaluate(() => window.scrollY);
  await page.getByRole('link', {name:/Try it with sample data/}).click();
  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(before - 5);
});
