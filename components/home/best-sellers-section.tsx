"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "top", label: "Top 20", filter: (p: Product) => p.isBestSeller || p.rating >= 4 },
  { id: "btp", label: "Ouvriers du bâtiment", filter: (p: Product) => p.metiers.includes("btp-chantiers") || p.metiers.includes("batiment") },
  { id: "anti-feu", label: "Combinaison anti-feu", filter: (p: Product) => p.categories.includes("anti-feu") },
  { id: "multirisque", label: "Combinaison multirisque", filter: (p: Product) => p.categories.includes("multirisque") },
  { id: "blouson", label: "Blouson anti-feu", filter: (p: Product) => p.name.toLowerCase().includes("blouson") && p.categories.includes("anti-feu") },
];

export function BestSellersSection({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState("top");

  const filtered = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTab) || tabs[0];
    const list = products.filter(tab.filter);
    return list.length > 0 ? list : products.slice(0, 8);
  }, [products, activeTab]);

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wide border-b-2 border-google-blue pb-2 inline-block">
              Meilleures ventes
            </h2>
            <p className="mt-2 text-sm text-muted">
              Les références les plus commandées par nos clients professionnels
            </p>
          </div>
          <Link
            href="/boutique?filter=bestseller"
            className="text-sm font-medium text-google-blue hover:underline"
          >
            Voir tout →
          </Link>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "border-google-blue bg-google-blue text-white shadow-md shadow-google-blue/20"
                  : "border-border bg-white text-muted hover:border-google-blue/40 hover:text-google-blue"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ProductCarousel products={filtered} />
      </div>
    </section>
  );
}
