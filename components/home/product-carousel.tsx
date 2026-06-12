"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardCompact } from "@/components/product/product-card-compact";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));

  function scrollToPage(p: number) {
    const next = Math.max(0, Math.min(p, totalPages - 1));
    setPage(next);
    scrollRef.current?.scrollTo({
      left: next * scrollRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  if (products.length === 0) {
    return <p className="text-center text-muted py-8">Aucun produit dans cette sélection.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => scrollToPage(page - 1)}
          disabled={page === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-google-blue disabled:opacity-30 transition-colors"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollToPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-google-blue disabled:opacity-30 transition-colors"
          aria-label="Suivant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        onScroll={() => {
          if (!scrollRef.current) return;
          const p = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
          setPage(p);
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] shrink-0 snap-start"
          >
            <ProductCardCompact product={product} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === page ? "w-8 bg-google-blue" : "w-2 bg-border hover:bg-google-blue/40"
            )}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
