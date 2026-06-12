"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";

export function WishlistButton() {
  const { items } = useWishlist();
  const count = items.length;

  return (
    <Link
      href="/compte/listes-achat"
      className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light transition-colors"
      aria-label="Mes favoris"
      title="Mes favoris"
    >
      <Heart
        className={cn(
          "h-5 w-5 text-google-blue transition-colors",
          count > 0 && "fill-red-500 text-red-500"
        )}
      />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
