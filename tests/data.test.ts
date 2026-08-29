import { describe, expect, it } from 'vitest';
import { emptyState, sampleState } from '../src/data';
import { access, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

describe('workspace fixtures', () => {
  it('keeps demo data separate from an empty real workspace', () => {
    const demo = sampleState(); const real = emptyState();
    demo.workspaces[0].name = 'Changed sample';
    expect(real.workspaces).toHaveLength(0);
    expect(sampleState().workspaces[0].name).toBe('Northstar Coffee');
  });
});

describe('public records', () => {
  it('@claim:site-build-output creates the complete static site', async () => {
    const build = spawnSync('npm', ['run', 'build:site'], {encoding:'utf8'});
    expect(build.status, `${build.stdout}\n${build.stderr}`).toBe(0);
    for (const path of [
      'dist/site/index.html',
      'dist/site/404.html',
      'dist/site/staticwebapp.config.json',
      'dist/site/sw.js',
      'dist/site/robots.txt',
      'dist/site/sitemap.xml',
      'dist/site/install.sh',
      'dist/site/install.ps1'
    ]) await expect(access(path), path).resolves.toBeUndefined();
    const scripts = (await import('node:fs/promises')).readdir('dist/site/assets').then(files => files.filter(file => file.endsWith('.js')));
    const scriptSizes = await Promise.all((await scripts).map(file => stat(`dist/site/assets/${file}`).then(info => info.size)));
    expect(scriptSizes.reduce((sum, size) => sum + size, 0)).toBeLessThanOrEqual(200_000);
  });

  it('@claim:art-provenance records the shipped original artwork', async () => {
    const record = await readFile('assets/src/boundary-ledger.png.json', 'utf8');
    expect(record).toMatch(/factory-image|prompt/i);
    await expect(access('assets/src/boundary-ledger.png')).resolves.toBeUndefined();
    await expect(access('public/art/boundary-ledger.webp')).resolves.toBeUndefined();
    await expect(access('public/art/boundary-ledger-600.webp')).resolves.toBeUndefined();
  });

  it('@claim:refund-route provides a direct product-specific refund request', async () => {
    const source = await readFile('src/main.ts', 'utf8');
    expect(source).toContain('mailto:support@sociobot.in?subject=Client%20Context%20Firewall%20refund');
  });
});
