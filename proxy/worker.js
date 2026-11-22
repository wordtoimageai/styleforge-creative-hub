// ============================================
// BDai.studio — Cloudflare Worker AI Proxy
// Routes: /api/try-on, /api/usage/:brandId, /api/track, /api/public-track, /api/verify
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

const TRY_ON_PROMPTS = Object.freeze({
  default: 'Dress the person in the first image in the garment from the second image. Preserve the person’s face, skin tone, body proportions, and pose. Show realistic fabric texture and natural garment fit.',
  panjabi: 'Dress the person in the first image in the Panjabi from the second image. Show its traditional collar, buttons, natural drape, and realistic fabric texture. Preserve the person’s face, skin tone, proportions, and pose.',
  'panjabi-pajama-set': 'Dress the person in the first image in the Panjabi-pajama set from the second image. Show the matching pieces and natural fabric drape. Preserve the person’s face, skin tone, proportions, and pose.',
  saree: 'Dress the person in the first image in the Saree from the second image, using a traditional Bengali drape with visible pleats and pallu. Preserve the person’s face, skin tone, proportions, and pose.',
  'shalwar-kameez': 'Dress the person in the first image in the Shalwar Kameez from the second image. Show natural fit, neckline, sleeves, and drape. Preserve the person’s face, skin tone, proportions, and pose.',
  fatua: 'Dress the person in the first image in the Fatua from the second image. Show its natural hip-length fit and fabric details. Preserve the person’s face, skin tone, proportions, and pose.',
  kurta: 'Dress the person in the first image in the Kurta from the second image. Show natural shoulder fit and drape. Preserve the person’s face, skin tone, proportions, and pose.',
  shirt: 'Dress the person in the first image in the shirt from the second image. Show natural collar, buttons, and sleeve details. Preserve the person’s face, skin tone, proportions, and pose.',
  coaty: 'Layer the Coaty from the second image over the person’s outfit. Show a natural shoulder fit and button details. Preserve the person’s face, skin tone, proportions, and pose.',
  lehenga: 'Dress the person in the first image in the Lehenga set from the second image. Show the skirt, blouse, and dupatta as pictured. Preserve the person’s face, skin tone, proportions, and pose.',
  'eid-collection': 'Dress the person in the first image in the festive outfit from the second image. Show its fabric and embellishment details naturally. Preserve the person’s face, skin tone, proportions, and pose.',
});

const PUBLIC_TRACK_EVENTS = new Set([
  'conversion_click',
  'try_on',
  'style_generation',
  'model_generation',
]);

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
        return await handleUsage(path.split('/').pop(), env, request);
      }
      if (path === '/api/public-track' && request.method === 'POST') {
        return await handlePublicTrack(request, env);
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
  const { brandId, userImage, productImage, productCategory } = body;

  if (!brandId || !userImage || !productImage) {
    return json({ error: 'Missing: brandId, userImage, productImage' }, 400);
  }

  const authError = await requireBrandAuth(request, env, brandId);
  if (authError) return authError;

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

  // Only server-owned category prompts are sent to the model.
  const category = typeof productCategory === 'string' ? productCategory : '';
  const geminiPrompt = Object.prototype.hasOwnProperty.call(TRY_ON_PROMPTS, category)
    ? TRY_ON_PROMPTS[category]
    : TRY_ON_PROMPTS.default;

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

async function handleUsage(brandId, env, request) {
  const authError = await requireBrandAuth(request, env, brandId);
  if (authError) return authError;

  const usageKey = `usage:${brandId}:${getCurrentMonth()}`;
  const currentUsage = parseInt((await env.BRAND_USAGE.get(usageKey)) || '0');
  const configKey = `config:${brandId}`;
  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
  const plan = brandConfig.plan || 'starter';
  const limit = PLAN_LIMITS[plan] || 300;
  return json({ used: currentUsage, limit, remaining: Math.max(0, limit - currentUsage), plan });
}

async function handlePublicTrack(request, env) {
  let body;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 2048) return json({ error: 'Request too large' }, 413);
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { brandId, event, productId } = body || {};
  if (typeof brandId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(brandId)) {
    return json({ error: 'Invalid brand' }, 400);
  }
  if (typeof event !== 'string' || !PUBLIC_TRACK_EVENTS.has(event)) {
    return json({ error: 'Unsupported tracking event' }, 400);
  }
  if (productId !== undefined && (typeof productId !== 'string' || productId.length > 128)) {
    return json({ error: 'Invalid product' }, 400);
  }

  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(`config:${brandId}`)) || '{}');
  const brandKey = brandConfig.api_key || brandConfig.apiKey;
  if (!brandKey) return json({ error: 'Brand not found' }, 404);

  // Relay through the authenticated handler using the server-held brand key.
  const relayedRequest = new Request(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${brandKey}`,
    },
    body: JSON.stringify({ brandId, event, ...(productId ? { productId } : {}) }),
  });
  return await handleTrack(relayedRequest, env);
}

async function handleTrack(request, env) {
  try {
    const body = await request.json();
    const authError = await requireBrandAuth(request, env, body.brandId);
    if (authError) return authError;
    await trackEvent(env, body.brandId, body.event, body);
    return json({ ok: true });
  } catch {
    return json({ ok: false }, 400);
  }
}

async function handleVerify(request, env) {
  try {
    const { brandId, licenseKey } = await request.json();
    const authError = await requireBrandAuth(request, env, brandId);
    if (authError) return authError;
    const configKey = `config:${brandId}`;
    const config = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
    const valid = config.license?.key === licenseKey && new Date(config.license?.expiresAt) > new Date();
    return json({ valid, plan: config.plan, expiresAt: config.license?.expiresAt });
  } catch {
    return json({ valid: false }, 400);
  }
}

// Validates that the request carries the correct brand API key (from the
// `brands` table) via `Authorization: Bearer <api_key>` or `X-Brand-Key` header.
// Returns a Response on failure, or null on success.
async function requireBrandAuth(request, env, brandId) {
  if (!brandId) return json({ error: 'Unauthorized' }, 401);
  const authHeader = request.headers.get('Authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const provided = bearer || request.headers.get('X-Brand-Key') || '';
  if (!provided) return json({ error: 'Unauthorized' }, 401);

  const configKey = `config:${brandId}`;
  const brandConfig = JSON.parse((await env.BRAND_CONFIG.get(configKey)) || '{}');
  const expected = brandConfig.api_key || brandConfig.apiKey;
  if (!expected || provided !== expected) {
    return json({ error: 'Unauthorized' }, 401);
  }
  return null;
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
