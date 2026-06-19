"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Product } from "@/types";
import type { CatalogItem } from "@/lib/data/catalogs";
import { getDefaultCmsData } from "@/lib/cms/defaults";
import { enrichProduct } from "@/lib/product-filters";
import { cacheGet, cacheSet, cacheGetSession, cacheInvalidate } from "@/lib/cache/memory";

const CMS_CACHE_KEY = "cms-data";

interface CmsData {
  products: Product[];
  catalogs: CatalogItem[];
}

interface CmsContextType {
  products: Product[];
  catalogs: CatalogItem[];
  hydrated: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCatalog: (catalog: CatalogItem & { fileUrl?: string }) => Promise<void>;
  updateCatalog: (id: string, catalog: Partial<CatalogItem> & { fileUrl?: string }) => Promise<void>;
  deleteCatalog: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

function getInitialData(): CmsData {
  const mem = cacheGet<CmsData>(CMS_CACHE_KEY);
  if (mem) return mem;
  const session = cacheGetSession<CmsData>(CMS_CACHE_KEY);
  if (session) return session;
  return getDefaultCmsData();
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(getInitialData);
  const [hydrated, setHydrated] = useState(() => !!cacheGet<CmsData>(CMS_CACHE_KEY));
  const [loading, setLoading] = useState(!cacheGet<CmsData>(CMS_CACHE_KEY));
  const fetched = useRef(false);

  const applyData = useCallback((next: CmsData) => {
    const enriched = {
      ...next,
      products: next.products.map((p) => enrichProduct(p)),
    };
    setData(enriched);
    cacheSet(CMS_CACHE_KEY, enriched);
  }, []);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/catalogs"),
      ]);
      const pJson = pRes.ok ? await pRes.json() : { products: data.products };
      const cJson = cRes.ok ? await cRes.json() : { catalogs: data.catalogs };
      applyData({
        products: pJson.products || [],
        catalogs: cJson.catalogs || [],
      });
    } catch {
      /* garde le cache */
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, [applyData, data.products, data.catalogs]);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const hasCache = !!cacheGet<CmsData>(CMS_CACHE_KEY) || !!cacheGetSession<CmsData>(CMS_CACHE_KEY);
    void refresh(hasCache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = useCallback(
    async (product: Product) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      cacheInvalidate(CMS_CACHE_KEY);
      await refresh(true);
    },
    [refresh]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      cacheInvalidate(CMS_CACHE_KEY);
      await refresh(true);
    },
    [refresh]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      cacheInvalidate(CMS_CACHE_KEY);
      await refresh(true);
    },
    [refresh]
  );

  const addCatalog = useCallback(
    async (catalog: CatalogItem & { fileUrl?: string }) => {
      const res = await fetch("/api/catalogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catalog),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      cacheInvalidate(CMS_CACHE_KEY);
      await refresh(true);
    },
    [refresh]
  );

  const updateCatalog = useCallback(
    async (id: string, updates: Partial<CatalogItem> & { fileUrl?: string }) => {
      const res = await fetch(`/api/catalogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      cacheInvalidate(CMS_CACHE_KEY);
      await refresh(true);
    },
    [refresh]
  );

  const deleteCatalog = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/catalogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      cacheInvalidate(CMS_CACHE_KEY);
      await refresh(true);
    },
    [refresh]
  );

  const getProductBySlug = useCallback(
    (slug: string) => data.products.find((p) => p.slug === slug),
    [data.products]
  );

  const getProductById = useCallback(
    (id: string) => data.products.find((p) => p.id === id),
    [data.products]
  );

  return (
    <CmsContext.Provider
      value={{
        products: data.products,
        catalogs: data.catalogs,
        hydrated,
        loading,
        refresh,
        addProduct,
        updateProduct,
        deleteProduct,
        addCatalog,
        updateCatalog,
        deleteCatalog,
        getProductBySlug,
        getProductById,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
