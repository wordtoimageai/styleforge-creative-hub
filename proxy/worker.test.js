import { describe, expect, it } from 'bun:test';
import worker from './worker.js';

const month = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

function createEnv() {
  const usageValues = new Map();
  const brandValues = new Map([
    ['config:brand_demo', JSON.stringify({ api_key: 'server-only-brand-key', plan: 'growth' })],
  ]);

  return {
    usageValues,
    BRAND_USAGE: {
      get: async (key) => usageValues.get(key) ?? null,
      put: async (key, value) => usageValues.set(key, value),
    },
    BRAND_CONFIG: {
      get: async (key) => brandValues.get(key) ?? null,
    },
  };
}

function publicTrackRequest(body) {
  return new Request('https://worker.test/api/public-track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('public tracking relay', () => {
  it('records approved storefront and Studio events without a browser key', async () => {
    const env = createEnv();
    const events = ['conversion_click', 'try_on', 'style_generation', 'model_generation'];

    for (const event of events) {
      const response = await worker.fetch(publicTrackRequest({ brandId: 'brand_demo', event }), env);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
    }

    for (const event of events) {
      expect(env.usageValues.get(`events:brand_demo:${month()}:${event}`)).toBe('1');
    }
  });

  it('rejects unsupported events without changing tracking totals', async () => {
    const env = createEnv();
    const response = await worker.fetch(
      publicTrackRequest({ brandId: 'brand_demo', event: 'arbitrary_event' }),
      env,
    );

    expect(response.status).toBe(400);
    expect(env.usageValues.size).toBe(0);
  });

  it('keeps the original tracking route protected by the brand key', async () => {
    const env = createEnv();
    const response = await worker.fetch(new Request('https://worker.test/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandId: 'brand_demo', event: 'conversion_click' }),
    }), env);

    expect(response.status).toBe(401);
    expect(env.usageValues.size).toBe(0);
  });
});