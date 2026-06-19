"use client";

import { CmsImage } from "@/components/ui/cms-image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCardCompact({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <article className="group flex flex-col h-full rounded-2xl border border-border bg-white overflow-hidden transition-all duration-300 hover:border-google-blue/30 hover:shadow-xl hover:shadow-google-blue/10">
      <div className="p-3 pb-0">
        <div className="flex flex-wrap gap-1 mb-2 min-h-[28px]">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] font-medium uppercase tracking-wider text-muted line-clamp-1">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/produits/${product.slug}`}>
          <h3 className="text-sm font-semibold text-google-blue hover:underline line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
      </div>

      <Link
        href={`/produits/${product.slug}`}
        className="relative mx-3 mt-3 aspect-square overflow-hidden rounded-xl bg-surface"
      >
        <CmsImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md text-google-blue opacity-0 group-hover:opacity-100 group-hover:bg-google-blue group-hover:text-white transition-all"
          aria-label="Ajouter au devis"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </Link>

      <div className="mt-auto border-t border-border px-3 py-2.5">
        <button
          onClick={() => toggleItem(product)}
          className={cn(
            "flex w-full items-center justify-center gap-2 text-xs text-muted hover:text-google-blue transition-colors py-1",
            inWishlist && "text-red-500 hover:text-red-600"
          )}
        >
          <Heart className={cn("h-3.5 w-3.5", inWishlist && "fill-current")} />
          {inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>
      </div>
    </article>
  );
}
