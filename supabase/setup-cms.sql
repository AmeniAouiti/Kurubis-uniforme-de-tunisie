-- Produits & catalogues (CMS)

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sku text NOT NULL,
  image text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  categories text[] NOT NULL DEFAULT '{}',
  metiers text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  price numeric,
  is_new boolean NOT NULL DEFAULT false,
  is_best_seller boolean NOT NULL DEFAULT false,
  rating numeric NOT NULL DEFAULT 4,
  review_count int NOT NULL DEFAULT 0,
  features text[] DEFAULT '{}',
  characteristics text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.catalogs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image text NOT NULL,
  download_slug text UNIQUE NOT NULL,
  file_url text,
  href text NOT NULL DEFAULT '/boutique',
  file_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON public.products(is_new, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_categories ON public.products USING gin(categories);
CREATE INDEX IF NOT EXISTS idx_catalogs_slug ON public.catalogs(download_slug);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metier_subcategories text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_products_metiers ON public.products USING gin(metiers);
CREATE INDEX IF NOT EXISTS idx_products_metier_subcategories ON public.products USING gin(metier_subcategories);
CREATE INDEX IF NOT EXISTS idx_products_is_visible ON public.products(is_visible);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_admin_all" ON public.products;
DROP POLICY IF EXISTS "catalogs_public_read" ON public.catalogs;
DROP POLICY IF EXISTS "catalogs_admin_all" ON public.catalogs;

CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_admin_all" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "catalogs_public_read" ON public.catalogs FOR SELECT USING (true);
CREATE POLICY "catalogs_admin_all" ON public.catalogs FOR ALL USING (public.is_admin());
