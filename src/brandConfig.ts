// ============================================
// BDai.studio — Brand Configuration Loader
// Loads brand-specific config at build time
// Applies theme via CSS custom properties
// ============================================

import type { BrandConfig, BrandColors } from './types';

const DEFAULT_COLORS: BrandColors = {
  primary: '#0f766e',
  secondary: '#134e4a',
  background: '#fafaf9',
  surface: '#ffffff',
  text: '#1c1917',
  textSecondary: '#78716c',
  accent: '#b45309',
  error: '#dc2626',
  success: '#16a34a',
};

let cachedConfig: BrandConfig | null = null;

export async function loadBrandConfig(): Promise<BrandConfig> {
  if (cachedConfig) return cachedConfig;

  const brandId = import.meta.env.VITE_BRAND_ID || 'demo';

  try {
    // Dynamic import based on brand ID
    const configModule = await import(`./brands/${brandId}/config.json`);
    const config: BrandConfig = configModule.default || configModule;

    // Merge with defaults
    config.colors = { ...DEFAULT_COLORS, ...config.colors };
    config.plan = config.plan || 'starter';
    config.poweredByBadge = config.poweredByBadge !== false;
    config.watermark = config.watermark || { enabled: true, position: 'bottom-right', opacity: 0.25 };
    config.socialShare = config.socialShare || { facebook: true, whatsapp: true, instagram: true, download: true };

    // Premium plan: disable watermark & powered-by badge
    if (config.plan === 'enterprise' || config.plan === 'pro') {
      config.poweredByBadge = false;
      if (config.plan === 'enterprise') {
        config.watermark.enabled = false;
      }
    }

    cachedConfig = config;
    return config;
  } catch (error) {
    console.error(`Failed to load config for brand "${brandId}":`, error);
    throw new Error(`Brand configuration not found: ${brandId}`);
  }
}

export function applyBrandTheme(config: BrandConfig): void {
  const root = document.documentElement;
  const c = config.colors;

  // Core colors
  root.style.setProperty('--color-primary', c.primary);
  root.style.setProperty('--color-secondary', c.secondary);
  root.style.setProperty('--color-bg', c.background);
  root.style.setProperty('--color-surface', c.surface);
  root.style.setProperty('--color-text', c.text);
  root.style.setProperty('--color-text-secondary', c.textSecondary);
  root.style.setProperty('--color-accent', c.accent);
  root.style.setProperty('--color-error', c.error);
  root.style.setProperty('--color-success', c.success);

  // Derived colors
  root.style.setProperty('--color-primary-light', `${c.primary}18`);
  root.style.setProperty('--color-primary-hover', `${c.primary}dd`);
  root.style.setProperty('--color-overlay', 'rgba(0,0,0,0.55)');
  root.style.setProperty('--color-border', `${c.text}12`);
  root.style.setProperty('--color-divider', `${c.text}08`);

  // Shadows using primary
  root.style.setProperty('--shadow-sm', `0 1px 3px ${c.primary}10`);
  root.style.setProperty('--shadow-md', `0 4px 16px ${c.primary}12`);
  root.style.setProperty('--shadow-lg', `0 12px 40px ${c.primary}15`);
  root.style.setProperty('--shadow-primary', `0 4px 20px ${c.primary}30`);

  // Update meta theme color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', c.primary);

  // Update page title
  document.title = `${config.brandName} — AI Virtual Try-On | BDai.studio`;
}

export function getBrandImageUrl(config: BrandConfig, path: string): string {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://images.bdai.studio';
  return path.startsWith('http') ? path : `${baseUrl}/${config.brandId}/${path}`;
}
