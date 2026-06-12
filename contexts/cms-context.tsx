"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product } from "@/types";
import type { CatalogItem } from "@/lib/data/catalogs";
import {
  CMS_STORAGE_KEY,
  getDefaultCmsData,
  type CmsData,
} from "@/lib/cms/defaults";
import { enrichProduct } from "@/lib/product-filters";

interface CmsContextType {
  products: Product[];
  catalogs: CatalogItem[];
  hydrated: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCatalog: (catalog: CatalogItem) => void;
  updateCatalog: (id: string, catalog: Partial<CatalogItem>) => void;
  deleteCatalog: (id: string) => void;
  resetToDefaults: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

function loadCms(): CmsData {
  if (typeof window === "undefined") return getDefaultCmsData();
  try {
    const stored = localStorage.getItem(CMS_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CmsData;
  } catch {
    /* ignore */
  }
  return getDefaultCmsData();
}

function enrichProducts(list: Product[]): Product[] {
  return list.map((p) => enrichProduct({ ...p, filterSlugs: undefined }));
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(getDefaultCmsData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadCms());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const persist = useCallback((updater: (prev: CmsData) => CmsData) => {
    setData((prev) => {
      const next = updater(prev);
      return { ...next, products: enrichProducts(next.products) };
    });
  }, []);

  const addProduct = useCallback(
    (product: Product) => {
      persist((prev) => ({
        ...prev,
        products: [...prev.products, enrichProduct(product)],
      }));
    },
    [persist]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      persist((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? enrichProduct({ ...p, ...updates }) : p
        ),
      }));
    },
    [persist]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }));
    },
    [persist]
  );

  const addCatalog = useCallback(
    (catalog: CatalogItem) => {
      persist((prev) => ({
        ...prev,
        catalogs: [...prev.catalogs, catalog],
      }));
    },
    [persist]
  );

  const updateCatalog = useCallback(
    (id: string, updates: Partial<CatalogItem>) => {
      persist((prev) => ({
        ...prev,
        catalogs: prev.catalogs.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    [persist]
  );

  const deleteCatalog = useCallback(
    (id: string) => {
      persist((prev) => ({
        ...prev,
        catalogs: prev.catalogs.filter((c) => c.id !== id),
      }));
    },
    [persist]
  );

  const resetToDefaults = useCallback(() => {
    setData(getDefaultCmsData());
  }, []);

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
        addProduct,
        updateProduct,
        deleteProduct,
        addCatalog,
        updateCatalog,
        deleteCatalog,
        resetToDefaults,
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
