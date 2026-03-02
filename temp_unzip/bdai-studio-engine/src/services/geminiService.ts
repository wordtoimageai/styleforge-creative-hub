// ============================================
// BDai.studio — Gemini AI Service
// Calls Cloudflare Worker proxy for try-on generation
// Category-specific prompts for Bangladesh fashion
// ============================================

import type { ProxyRequest, ProxyResponse, UsageResponse } from '../types';

const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://api.bdai.studio';

// Category-specific prompts for best AI results
const CATEGORY_PROMPTS: Record<string, string> = {
  'panjabi': `Show this person wearing this Panjabi (traditional Bangladeshi men's tunic). 
The Panjabi should drape naturally from shoulders to below the knees with proper collar and button placement. 
Keep the person's face, skin tone, and pose exactly the same. The fabric should show realistic texture and folds.
Maintain the original image background. Make it look like a natural photograph.`,

  'panjabi-pajama-set': `Show this person wearing this complete Panjabi-Pajama set.
The Panjabi should drape naturally from shoulders to below knees, with matching pajama bottom visible.
Keep face, skin tone, and pose identical. Show fabric texture realistically.`,

  'saree': `Show this person wearing this Saree in the traditional Bengali draping style (Nivi drape).
The saree should wrap naturally around the body with the pallu (end piece) over the left shoulder.
Show proper pleats at the front. Keep face, skin tone, hair exactly the same.
The fabric should show realistic draping, texture, and any printed/embroidered patterns clearly.`,

  'shalwar-kameez': `Show this person wearing this Shalwar Kameez set.
The kameez (tunic top) should fit naturally with proper neckline and sleeve details.
The shalwar (bottom) should be visible with proper draping. Show dupatta if included.
Keep face, skin tone, and pose exactly the same. Make it look like a natural photograph.`,

  'fatua': `Show this person wearing this Fatua (short kurta).
The fatua should sit naturally at hip length with proper collar and embroidery details visible.
Keep face, skin tone, and pose exactly the same. Show fabric texture realistically.`,

  'kurta': `Show this person wearing this Kurta.
The kurta should drape naturally with proper fit at shoulders and chest, extending to appropriate length.
Keep face, skin tone, and pose identical. Make it look like a natural photo.`,

  'shirt': `Show this person wearing this shirt.
The shirt should fit naturally with proper collar, buttons, and sleeve details.
Keep face, skin tone, body proportions, and pose exactly the same.`,

  'coaty': `Show this person wearing this Coaty (traditional Bangladeshi waistcoat/jacket).
The coaty should sit naturally over the person's outfit with proper shoulder fit and button details.
Keep face, skin tone, and pose identical.`,

  'lehenga': `Show this person wearing this Lehenga set.
The lehenga skirt should drape naturally from waist to ankles with proper flare.
Show the choli (blouse) and dupatta if included. Keep face and pose identical.`,

  'eid-collection': `Show this person wearing this Eid special outfit.
The garment should drape naturally and elegantly, appropriate for Eid celebration.
Show all embroidery, embellishments, and fabric details clearly.
Keep face, skin tone, and pose exactly the same. Make it look festive and premium.`,

  'default': `Show this person wearing this clothing item naturally.
The garment should fit properly and look realistic. Keep the person's face, skin tone, 
body proportions, and pose exactly the same. Make it look like a natural photograph.
Show the fabric texture and any patterns/embroidery clearly.`,
};

function buildPrompt(category: string, productName?: string, fabric?: string, color?: string): string {
  const base = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['default'];
  const extras: string[] = [];

  if (productName) extras.push(`Product: ${productName}.`);
  if (fabric) extras.push(`Fabric type: ${fabric} — show appropriate texture and sheen.`);
  if (color) extras.push(`Primary color: ${color} — ensure accurate color reproduction.`);

  return extras.length > 0 ? `${base}\n\n${extras.join(' ')}` : base;
}

export async function generateTryOn(params: {
  brandId: string;
  userImage: string;
  productImage: string;
  productCategory?: string;
  productName?: string;
  productFabric?: string;
  productColor?: string;
}): Promise<ProxyResponse> {
  const prompt = buildPrompt(
    params.productCategory || 'default',
    params.productName,
    params.productFabric,
    params.productColor
  );

  const body: ProxyRequest = {
    brandId: params.brandId,
    userImage: params.userImage,
    productImage: params.productImage,
    prompt,
    productCategory: params.productCategory,
    productName: params.productName,
    productColor: params.productColor,
    productFabric: params.productFabric,
  };

  try {
    const response = await fetch(`${PROXY_URL}/api/try-on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Brand-ID': params.brandId,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { success: false, error: 'rate_limit' };
      }
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: (errorData as { error?: string }).error || `Server error: ${response.status}` };
    }

    const data: ProxyResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Try-on API error:', error);
    return {
      success: false,
      error: error instanceof Error && error.message.includes('fetch')
        ? 'network_error'
        : 'unknown_error',
    };
  }
}

export async function checkUsage(brandId: string): Promise<UsageResponse | null> {
  try {
    const response = await fetch(`${PROXY_URL}/api/usage/${brandId}`, {
      headers: { 'X-Brand-ID': brandId },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function trackEvent(brandId: string, event: string, metadata?: Record<string, unknown>): Promise<void> {
  try {
    await fetch(`${PROXY_URL}/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Brand-ID': brandId,
      },
      body: JSON.stringify({ brandId, event, ...metadata, timestamp: Date.now() }),
    });
  } catch {
    // Silently fail for tracking
  }
}
