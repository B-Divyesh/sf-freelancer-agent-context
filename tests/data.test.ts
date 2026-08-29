import { describe, expect, it } from 'vitest';
import { emptyState, sampleState } from '../src/data';
import { access, readFile } from 'node:fs/promises';

describe('workspace fixtures', () => {
  it('keeps demo data separate from an empty real workspace', () => {
    const demo = sampleState(); const real = emptyState();
    demo.workspaces[0].name = 'Changed sample';
    expect(real.workspaces).toHaveLength(0);
    expect(sampleState().workspaces[0].name).toBe('Northstar Coffee');
  });
});

describe('public records', () => {
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
