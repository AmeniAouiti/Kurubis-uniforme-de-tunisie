"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:border-google-blue/30 hover:shadow-xl hover:shadow-google-blue/10">
      <Link href={`/produits/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && <Badge variant="new">Nouveau</Badge>}
          {product.isBestSeller && <Badge variant="sale">Top vente</Badge>}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product);
          }}
          className={cn(
            "absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:scale-110",
            inWishlist && "text-red-500"
          )}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-medium uppercase tracking-wider text-muted">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/produits/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-google-blue">
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 line-clamp-2 flex-1 text-xs text-muted">
          {product.shortDescription || product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">SKU: {product.sku}</span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-1.5 rounded-full bg-google-blue px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-google-blue-dark"
          >
            <FileText className="h-3.5 w-3.5" />
            Devis
          </button>
        </div>
      </div>
    </article>
  );
}
