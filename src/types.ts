// ============================================
// BDai.studio — Type Definitions
// AI Fashion Try-On Platform for Bangladesh
// ============================================

// ---------- Brand Configuration ----------
export interface BrandColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
}

export interface BrandConfig {
  brandId: string;
  brandName: string;
  brandNameBn: string;
  logo: string;
  favicon?: string;
  tagline: string;
  taglineBn: string;
  colors: BrandColors;
  language: 'bn' | 'en';
  contactWhatsApp: string;
  contactEmail?: string;
  websiteUrl?: string;
  buyLinkType: 'website' | 'whatsapp' | 'facebook' | 'messenger';
  buyLinkUrl?: string;
  categories: ProductCategory[];
  products: Product[];
  socialShare: SocialShareConfig;
  watermark: WatermarkConfig;
  plan: PlanTier;
  maxTryOns: number;
  poweredByBadge: boolean;
  customDomain?: string;
  analytics?: AnalyticsConfig;
  license?: LicenseConfig;
}

export type PlanTier = 'starter' | 'growth' | 'pro' | 'enterprise';

export interface LicenseConfig {
  key: string;
  expiresAt: string;
  features: string[];
}

export interface AnalyticsConfig {
  enabled: boolean;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

// ---------- Products ----------
export interface ProductCategory {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  gender?: 'men' | 'women' | 'unisex';
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  fabric?: string;
  fabricBn?: string;
  color?: string;
  colorBn?: string;
  colorHex?: string;
  sizes?: string[];
  imageUrl: string;
  imageAlt?: string;
  buyLink: string;
  buyUrl?: string;
  description?: string;
  descriptionBn?: string;
  isActive: boolean;
  isFeatured?: boolean;
  isEidCollection?: boolean;
  isNewArrival?: boolean;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  discount?: number;
  sortOrder: number;
  gender?: 'men' | 'women' | 'unisex';
  tags?: string[];
}

// ---------- App State ----------
export type AppScreen =
  | 'start'
  | 'camera'
  | 'wardrobe'
  | 'processing'
  | 'result'
  | 'share';

export interface AppState {
  screen: AppScreen;
  userPhoto: string | null;
  selectedProduct: Product | null;
  resultImage: string | null;
  isProcessing: boolean;
  error: string | null;
  language: 'bn' | 'en';
  selectedCategory: string;
  selectedGender: 'men' | 'women' | 'all';
  searchQuery: string;
  tryOnCount: number;
  shareMode: boolean;
}

// ---------- AI Proxy ----------
export interface ProxyRequest {
  brandId: string;
  userImage: string;
  productImage: string;
  prompt: string;
  productCategory?: string;
  productName?: string;
  productColor?: string;
  productFabric?: string;
}

export interface ProxyResponse {
  success: boolean;
  resultImage?: string;
  error?: string;
  usage?: {
    brandId: string;
    tryOnsUsed: number;
    tryOnsLimit: number;
    remaining: number;
  };
}

export interface UsageResponse {
  used: number;
  limit: number;
  remaining: number;
  plan: PlanTier;
}

// ---------- Social Sharing ----------
export interface SocialShareConfig {
  facebook: boolean;
  whatsapp: boolean;
  instagram: boolean;
  download: boolean;
  messenger?: boolean;
  twitter?: boolean;
}

export interface ShareData {
  image: string;
  productName: string;
  brandName: string;
  watermarked?: string;
}

// ---------- Watermark ----------
export interface WatermarkConfig {
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  text?: string;
}

// ---------- Events ----------
export interface TrackEvent {
  brandId: string;
  event: string;
  productId?: string;
  category?: string;
  metadata?: Record<string, unknown>;
  timestamp?: number;
}
