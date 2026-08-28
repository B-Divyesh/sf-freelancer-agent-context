import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has one clear first action and no serious accessibility issues', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Keep client work apart/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', {name:/Try it with sample data/})).toBeVisible();
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations.filter(item => ['serious','critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('@claim:demo-isolation sample changes never enter real storage', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('ccf:sentinel', 'real-data'));
  await page.goto('/demo');
  await page.getByLabel('Text to check (optional)').fill('A sample draft');
  await page.getByRole('button', {name:/Check session/}).click();
  await expect(page.getByText('Session ready for Northstar Coffee')).toBeVisible();
  const storage = await page.evaluate(() => ({sentinel: localStorage.getItem('ccf:sentinel'), demoInLocal: localStorage.getItem('demo:workspace-state'), demoInSession: sessionStorage.getItem('demo:workspace-state')}));
  expect(storage.sentinel).toBe('real-data'); expect(storage.demoInLocal).toBeNull(); expect(storage.demoInSession).toContain('northstar');
});

test('@claim:boundary-check blocks another client and a wrong account', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Active account').fill('dev@juniper.example');
  await page.getByLabel('Text to check (optional)').fill('Use the Juniper Legal draft here.');
  await page.getByRole('button', {name:/Check session/}).click();
  await expect(page.getByText('Fix 3 boundary checks')).toBeVisible();
  await expect(page.getByText(/does not match a selected source/)).toBeVisible();
  await expect(page.getByText(/Text names another client/)).toBeVisible();
});

test('@claim:provenance-export exports the checked source record', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', {name:/Check session/}).click();
  await expect(page.getByText('Session ready for Northstar Coffee')).toBeVisible();
  await page.reload();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name:/Export latest record/}).click();
  const download = await downloadPromise; const path = await download.path();
  expect(download.suggestedFilename()).toBe('ns-delivery-record.json');
  const content = await import('node:fs/promises').then(fs => fs.readFile(path!, 'utf8')); const record = JSON.parse(content);
  expect(record.client).toBe('Northstar Coffee'); expect(record.sources).toHaveLength(1); expect(record.checks).toHaveLength(3);
});

test('@claim:device-local demo flow sends no workspace data off-origin', async ({ page }) => {
  const external: string[] = []; page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  await page.goto('/demo');
  await page.getByRole('button', {name:/Check session/}).click();
  await expect(page.getByText('Session ready for Northstar Coffee')).toBeVisible();
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

test('@claim:plan-limit free stops at two workspaces and Pro allows more', async ({page}) => {
  const create = async (name: string) => {
    await page.getByRole('button', {name:'Create a workspace'}).click();
    await page.getByLabel('Client name').fill(name);
    await page.getByLabel('Client brief').last().fill(`Brief for ${name}`);
    await page.getByLabel('Writing rule').last().fill('Use short sentences.');
    await page.getByLabel('First source label').fill(`${name.toLowerCase()}/repo`);
    await page.getByLabel('Connector account').last().fill(`${name.toLowerCase()}@example.test`);
    await page.getByLabel('First redaction term').fill(`${name.toUpperCase()}_KEY`);
    await page.getByRole('button', {name:'Save workspace'}).click();
  };
  await page.goto('/app'); await create('Acorn'); await create('Birch');
  await create('Cedar'); await expect(page.getByText(/free plan includes two workspaces/i)).toBeVisible();
  expect(await page.getByRole('tab').count()).toBe(2);
  await page.evaluate(() => localStorage.setItem('sb_license_verdict:freelancer-agent-context', JSON.stringify({valid:true,checkedAt:Date.now()})));
  await create('Cedar'); expect(await page.getByRole('tab').count()).toBe(3);
});

test('mobile demo remains usable at 390 pixels', async ({ page }) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/demo');
  await expect(page.getByRole('button', {name:/Check session/})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
