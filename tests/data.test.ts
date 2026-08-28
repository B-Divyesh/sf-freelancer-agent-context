import { describe, expect, it } from 'vitest';
import { emptyState, sampleState } from '../src/data';

describe('workspace fixtures', () => {
  it('keeps demo data separate from an empty real workspace', () => {
    const demo = sampleState(); const real = emptyState();
    demo.workspaces[0].name = 'Changed sample';
    expect(real.workspaces).toHaveLength(0);
    expect(sampleState().workspaces[0].name).toBe('Northstar Coffee');
  });
});
