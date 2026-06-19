"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { ProductTabs } from "@/components/product/product-tabs";
import { SimilarProducts } from "@/components/product/similar-products";
import { Badge } from "@/components/ui/badge";
import { ProductFilterTags } from "@/components/product/product-filter-tags";
import { useCms } from "@/contexts/cms-context";
import {
  getProductBreadcrumbs,
  getProductImages,
} from "@/lib/products-utils";
import { BRAND } from "@/lib/brand";
import { Star, Mail, Phone } from "lucide-react";
import { contactInfo } from "@/lib/data/navigation";

export function ProductDetailContent({ slug }: { slug: string }) {
  const { products, hydrated, getProductBySlug } = useCms();
  const product = getProductBySlug(slug);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-sm text-muted">
        Chargement du produit...
      </div>
    );
  }

  if (!product) notFound();

  const similar = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categories.some((c) => product.categories.includes(c)) ||
          p.metiers.some((m) => product.metiers.includes(m)))
    )
    .slice(0, 8);

  const images = getProductImages(product);

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Breadcrumbs items={getProductBreadcrumbs(product)} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery
            images={images}
            alt={product.name}
            watermark={BRAND.shortName.toUpperCase()}
          />

          <div>
            <div className="mb-3 space-y-2">
              <ProductFilterTags product={product} max={5} />
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-2xl font-bold md:text-3xl text-foreground pb-4 border-b border-border">
              {product.name}
            </h1>

            {product.reviewCount > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted">
                  {product.rating}/5 ({product.reviewCount} avis)
                </span>
              </div>
            )}

            <p className="mt-3 text-sm text-muted">SKU: {product.sku}</p>
            <p className="mt-2 text-lg font-semibold text-google-blue">Sur devis</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.isNew && <Badge variant="new">Nouveau</Badge>}
              {product.isBestSeller && <Badge variant="sale">Top vente</Badge>}
            </div>

            <ProductActions product={product} />

            <div className="mt-8 rounded-2xl border border-border bg-google-blue-50 p-5 space-y-2">
              <p className="text-sm font-medium text-google-blue-dark">Besoin d&apos;un devis ?</p>
              <a
                href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-muted hover:text-google-blue"
              >
                <Phone className="h-4 w-4 text-google-blue" />
                {contactInfo.phones[0]}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2 text-sm text-muted hover:text-google-blue"
              >
                <Mail className="h-4 w-4 text-google-blue" />
                {contactInfo.email}
              </a>
              <Link href="/contact" className="text-sm text-google-blue hover:underline block mt-1">
                Formulaire de contact →
              </Link>
            </div>
          </div>
        </div>

        <ProductTabs product={product} />
        <SimilarProducts products={similar} />
      </div>
    </div>
  );
}
