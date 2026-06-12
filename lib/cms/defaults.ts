import { products as defaultProducts } from "@/lib/data/products";
import { downloadableCatalogs as defaultCatalogs } from "@/lib/data/catalogs";
import type { Product } from "@/types";
import type { CatalogItem } from "@/lib/data/catalogs";

export const CMS_STORAGE_KEY = "kurubis-cms";

export interface CmsData {
  products: Product[];
  catalogs: CatalogItem[];
}

export function getDefaultCmsData(): CmsData {
  return {
    products: defaultProducts,
    catalogs: defaultCatalogs,
  };
}
