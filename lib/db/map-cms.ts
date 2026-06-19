import type { Product } from "@/types";
import type { CatalogItem } from "@/lib/data/catalogs";
import { parsePrice } from "@/lib/products-utils";

export function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string,
    sku: row.sku as string,
    image: row.image as string,
    images: (row.images as string[]) || [],
    categories: (row.categories as string[]) || [],
    metiers: (row.metiers as string[]) || [],
    metierSubcategories: (row.metier_subcategories as string[]) || [],
    tags: (row.tags as string[]) || [],
    price: parsePrice(row.price as string | number | null),
    isNew: row.is_new as boolean,
    isBestSeller: row.is_best_seller as boolean,
    rating: Number(row.rating ?? 4),
    reviewCount: Number(row.review_count ?? 0),
    features: (row.features as string[]) || undefined,
    characteristics: (row.characteristics as string[]) || undefined,
  };
}

export function productToRow(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.image,
    images: product.images || [],
    categories: product.categories,
    metiers: product.metiers,
    metier_subcategories: product.metierSubcategories || [],
    tags: product.tags,
    price: product.price != null ? parsePrice(product.price) ?? null : null,
    is_new: product.isNew ?? false,
    is_best_seller: product.isBestSeller ?? false,
    rating: product.rating ?? 4,
    review_count: product.reviewCount ?? 0,
    features: product.features || [],
    characteristics: product.characteristics || [],
    updated_at: new Date().toISOString(),
  };
}

export function mapCatalogRow(row: Record<string, unknown>): CatalogItem {
  return {
    id: row.id as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    description: row.description as string,
    image: row.image as string,
    downloadSlug: row.download_slug as string,
    href: row.href as string,
    fileName: row.file_name as string,
    fileUrl: (row.file_url as string) || undefined,
  };
}

export function catalogToRow(catalog: CatalogItem & { fileUrl?: string }) {
  return {
    id: catalog.id,
    title: catalog.title,
    subtitle: catalog.subtitle,
    description: catalog.description,
    image: catalog.image,
    download_slug: catalog.downloadSlug,
    file_url: catalog.fileUrl || null,
    href: catalog.href,
    file_name: catalog.fileName,
  };
}
