"use client";

import { CmsImage } from "@/components/ui/cms-image";
import Link from "next/link";
import { Heart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/types";
import { ProductFilterTags } from "@/components/product/product-filter-tags";
import { cn } from "@/lib/utils";

export function ProductList({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-muted">Aucun produit trouvé.</div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const inWishlist = isInWishlist(product.id);
        return (
          <article
            key={product.id}
            className="group flex gap-4 rounded-2xl border border-border bg-white p-4 transition-all hover:border-google-blue/30 hover:shadow-md"
          >
            <Link
              href={`/produits/${product.slug}`}
              className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-surface"
            >
              <CmsImage
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>
            <div className="flex flex-1 flex-col min-w-0">
              <div className="mb-2 space-y-1.5">
                <ProductFilterTags product={product} max={4} />
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={`/produits/${product.slug}`}>
                <h3 className="font-semibold text-google-blue hover:underline line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-muted line-clamp-2 flex-1">
                {product.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {product.isNew && <Badge variant="new">Nouveau</Badge>}
                <span className="text-xs text-muted">SKU: {product.sku}</span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center gap-2 shrink-0">
              <button
                onClick={() => toggleItem(product)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface",
                  inWishlist && "text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
              </button>
              <button
                onClick={() => addItem(product)}
                className="flex items-center gap-1.5 rounded-full bg-google-blue px-4 py-2 text-xs font-medium text-white hover:bg-google-blue-dark"
              >
                <FileText className="h-3.5 w-3.5" />
                Devis
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
