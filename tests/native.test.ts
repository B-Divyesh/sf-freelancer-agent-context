import { describe, expect, it } from 'vitest';
import { isConfirmedNativeLaunch } from '../src/native';

describe('native delivery provenance', () => {
  it('refuses an unconfirmed native launch receipt before a record can be written', () => {
    expect(isConfirmedNativeLaunch({profileDir:'/profiles/northstar', contextPath:'/profiles/northstar/session.json', confirmed:false})).toBe(false);
    expect(isConfirmedNativeLaunch({profileDir:'', contextPath:'/profiles/northstar/session.json', confirmed:true})).toBe(false);
    expect(isConfirmedNativeLaunch({profileDir:'/profiles/northstar', contextPath:'/profiles/northstar/session.json', confirmed:true})).toBe(true);
  });
});
