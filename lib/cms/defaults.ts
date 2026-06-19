import type { Product } from "@/types";
import type { CatalogItem } from "@/lib/data/catalogs";

export const CMS_CACHE_KEY = "kurubis-cms-v2";

export interface CmsData {
  products: Product[];
  catalogs: CatalogItem[];
}

export function getDefaultCmsData(): CmsData {
  return {
    products: [],
    catalogs: [],
  };
}
