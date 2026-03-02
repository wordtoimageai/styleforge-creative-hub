// ============================================
// BDai.studio — Cloudflare Worker AI Proxy
// Routes: /api/try-on, /api/usage/:brandId, /api/track, /api/verify
// KV: BRAND_USAGE, BRAND_CONFIG
// Secret: GEMINI_API_KEY
// ============================================

const GEMINI_VISION_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const PLAN_LIMITS = {
  starter: 300,
  growth: 1500,
  pro: 5000,
  enterprise: 20000,
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Brand-ID, Authorization',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/api/try-on' && request.method === 'POST') {
        return await handleTryOn(request, env);
      }
      if (path.startsWith('/api/usage/') && request.method === 'GET') {
        return await handleUsage(path.split('/').pop(), env);
      }
      if (path === '/api/track' && request.method === 'POST') {
        return await handleTrack(request, env);
      }
      if (path === '/api/verify' && request.method === 'POST') {
        return await handleVerify(request, env);
      }
      if (path === '/health') {
        return json({ status: 'ok', platform: 'BDai.studio', version: '2.0', timestamp: Date.now() });
      }
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return json({ error: 'Internal server error' }, 500);
    }
  },
};

async function handleTryOn(request, env) {
  const body = await request.json();
  const { brandId, userImage, productImage, prompt } = body;

  if (!brandId || !userImage || !productImage) {
    return json({ error: 'Missing: brandId, userImage, productImage' }, 400);
  }

  // Check rate limit
  const usageKey = `usage:${brandId}:${getCurrentMonth()}`;
  const currentUsage = parseInt((await env.BRAND_USAGE.get(usageKey)) || '0');

  const configKey = `config:${brandId}`;
  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
  const plan = brandConfig.plan || 'starter';
  const limit = PLAN_LIMITS[plan] || 300;

  if (currentUsage >= limit) {
    return json({
      success: false,
      error: 'rate_limit',
      usage: { brandId, tryOnsUsed: currentUsage, tryOnsLimit: limit },
    }, 429);
  }

  // Build Gemini request
  const geminiPrompt = prompt || 'Show this person wearing this clothing item naturally. Keep face unchanged.';

  const geminiBody = {
    contents: [{
      parts: [
        { inline_data: { mime_type: 'image/jpeg', data: userImage } },
        { inline_data: { mime_type: 'image/png', data: productImage } },
        { text: geminiPrompt },
      ],
    }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: 0.4,
      maxOutputTokens: 4096,
    },
  };

  const geminiResponse = await fetch(`${GEMINI_VISION_URL}?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody),
  });

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    console.error('Gemini error:', geminiResponse.status, errorText);
    return json({ success: false, error: `AI service error: ${geminiResponse.status}` }, 502);
  }

  const geminiData = await geminiResponse.json();

  let resultImage = null;
  for (const candidate of geminiData.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.inline_data?.mime_type?.startsWith('image/')) {
        resultImage = part.inline_data.data;
        break;
      }
    }
    if (resultImage) break;
  }

  if (!resultImage) {
    return json({
      success: false,
      error: 'AI could not generate the try-on image. Try a different photo or product.',
    }, 422);
  }

  // Increment usage
  await env.BRAND_USAGE.put(usageKey, String(currentUsage + 1), { expirationTtl: 60 * 60 * 24 * 35 });
  await trackEvent(env, brandId, 'try_on', { productId: body.productId });

  return json({
    success: true,
    resultImage,
    usage: { brandId, tryOnsUsed: currentUsage + 1, tryOnsLimit: limit, remaining: limit - currentUsage - 1 },
  });
}

async function handleUsage(brandId, env) {
  const usageKey = `usage:${brandId}:${getCurrentMonth()}`;
  const currentUsage = parseInt((await env.BRAND_USAGE.get(usageKey)) || '0');
  const configKey = `config:${brandId}`;
  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
  const plan = brandConfig.plan || 'starter';
  const limit = PLAN_LIMITS[plan] || 300;
  return json({ used: currentUsage, limit, remaining: Math.max(0, limit - currentUsage), plan });
}

async function handleTrack(request, env) {
  try {
    const body = await request.json();
    await trackEvent(env, body.brandId, body.event, body);
    return json({ ok: true });
  } catch {
    return json({ ok: false }, 400);
  }
}

async function handleVerify(request, env) {
  try {
    const { brandId, licenseKey } = await request.json();
    const configKey = `config:${brandId}`;
    const config = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
    const valid = config.license?.key === licenseKey && new Date(config.license?.expiresAt) > new Date();
    return json({ valid, plan: config.plan, expiresAt: config.license?.expiresAt });
  } catch {
    return json({ valid: false }, 400);
  }
}

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function trackEvent(env, brandId, event, data = {}) {
  try {
    const key = `events:${brandId}:${getCurrentMonth()}:${event}`;
    const count = parseInt((await env.BRAND_USAGE.get(key)) || '0');
    await env.BRAND_USAGE.put(key, String(count + 1), { expirationTtl: 60 * 60 * 24 * 35 });
  } catch (e) {
    console.error('Track error:', e);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders });
}
