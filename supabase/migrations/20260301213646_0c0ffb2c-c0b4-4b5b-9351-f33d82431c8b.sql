
-- 1. Create enums
CREATE TYPE public.brand_plan AS ENUM ('starter', 'growth', 'pro', 'enterprise');
CREATE TYPE public.brand_status AS ENUM ('trial', 'active', 'suspended');

-- 2. Brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  plan brand_plan NOT NULL DEFAULT 'starter',
  status brand_status NOT NULL DEFAULT 'trial',
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#ec4899',
  font_family TEXT DEFAULT 'Inter',
  contact_name TEXT,
  phone TEXT,
  monthly_limit INTEGER NOT NULL DEFAULT 500,
  terms_accepted_at TIMESTAMPTZ,
  license_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  name_bn TEXT,
  category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BDT',
  image_url TEXT,
  description TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  buy_link TEXT,
  sku TEXT,
  stock_status TEXT DEFAULT 'in_stock',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Usage logs table
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  user_country TEXT,
  user_device TEXT,
  processing_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- 5. Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS policies for brands
CREATE POLICY "Users can view own brands" ON public.brands
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own brands" ON public.brands
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own brands" ON public.brands
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own brands" ON public.brands
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- 7. RLS policies for products (via brand ownership)
CREATE POLICY "Users can view own products" ON public.products
  FOR SELECT TO authenticated
  USING (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE TO authenticated
  USING (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()))
  WITH CHECK (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE TO authenticated
  USING (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()));

-- 8. RLS policies for usage_logs (via brand ownership)
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT TO authenticated
  USING (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own usage logs" ON public.usage_logs
  FOR INSERT TO authenticated
  WITH CHECK (brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid()));

-- 9. Public read policy for products (white-label storefront access via API key)
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT TO anon
  USING (is_active = true);

-- 10. Indexes
CREATE INDEX idx_brands_user_id ON public.brands(user_id);
CREATE INDEX idx_brands_subdomain ON public.brands(subdomain);
CREATE INDEX idx_brands_api_key ON public.brands(api_key);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_usage_logs_brand_id ON public.usage_logs(brand_id);
CREATE INDEX idx_usage_logs_timestamp ON public.usage_logs(timestamp);
CREATE INDEX idx_usage_logs_event_type ON public.usage_logs(event_type);
CREATE INDEX idx_usage_logs_product_id ON public.usage_logs(product_id);

-- 11. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
