"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/types";

export function SimilarProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  if (products.length === 0) return null;

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold border-b-2 border-google-blue pb-1 inline-block">
          Produits similaires
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-google-blue transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-google-blue transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {products.map((product) => (
          <article
            key={product.id}
            className="group w-56 shrink-0 snap-start"
          >
            <div className="mb-2 flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[9px] uppercase tracking-wider text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/produits/${product.slug}`}>
              <h3 className="text-sm font-semibold text-google-blue hover:underline line-clamp-2 mb-3 min-h-[2.5rem]">
                {product.name}
              </h3>
            </Link>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white border border-border mb-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="224px"
              />
              <button
                onClick={() => addItem(product)}
                className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border opacity-0 group-hover:opacity-100 group-hover:bg-google-blue group-hover:text-white group-hover:border-google-blue transition-all"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
