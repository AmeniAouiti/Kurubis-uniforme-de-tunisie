"use client";

import { FileText, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button size="lg" onClick={() => addItem(product)}>
        <FileText className="h-4 w-4" />
        Ajouter à la demande de devis
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => toggleItem(product)}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500 text-red-500")} />
        {inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
      </Button>
    </div>
  );
}
