import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSorobanConfig } from './soroban';

describe('getSorobanConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns preview mode when contract IDs are not configured', () => {
    delete process.env.NEXT_PUBLIC_CONTRACT_REGISTRY;
    delete process.env.NEXT_PUBLIC_CONTRACT_ROUTER;

    const config = getSorobanConfig('testnet');

    expect(config.isConfigured).toBe(false);
    expect(config.mode).toBe('preview');
  });

  it('returns live mode when contract IDs are present and valid', () => {
    process.env.NEXT_PUBLIC_CONTRACT_REGISTRY = 'CCREGISTRY123';
    process.env.NEXT_PUBLIC_CONTRACT_ROUTER = 'CCROUTER123';

    const config = getSorobanConfig('testnet');

    expect(config.isConfigured).toBe(true);
    expect(config.mode).toBe('live');
  });
});
