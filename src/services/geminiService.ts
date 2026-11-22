// ============================================
// BDai.studio — Gemini AI Service
// Calls Cloudflare Worker proxy for try-on generation
// Category-specific prompts for Bangladesh fashion
// ============================================

import type { ProxyRequest, ProxyResponse, UsageResponse } from '../types';

const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://api.bdai.studio';

export type TrackingEvent = 'conversion_click' | 'try_on' | 'style_generation' | 'model_generation';

export async function generateTryOn(params: {
  brandId: string;
  userImage: string;
  productImage: string;
  productCategory?: string;
  productName?: string;
  productFabric?: string;
  productColor?: string;
}): Promise<ProxyResponse> {
  const body: ProxyRequest = {
    brandId: params.brandId,
    userImage: params.userImage,
    productImage: params.productImage,
    productCategory: params.productCategory,
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

export async function trackEvent(brandId: string, event: TrackingEvent, metadata?: { productId?: string }): Promise<void> {
  try {
    await fetch(`${PROXY_URL}/api/public-track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brandId, event, ...(metadata?.productId ? { productId: metadata.productId } : {}) }),
    });
  } catch {
    // Silently fail for tracking
  }
}
