"use client";

import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import type { Product } from "@/types";

export function ShopLayout({
  products,
  allProducts,
  activeFilter,
  title = "Shop",
  breadcrumb,
}: {
  products: Product[];
  allProducts: Product[];
  activeFilter?: string;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="bg-surface min-h-[60vh]">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Breadcrumbs items={breadcrumb || [{ label: title }]} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
        <div className="flex flex-col gap-8 lg:flex-row">
          <Suspense fallback={<div className="lg:w-72 h-96 rounded-2xl bg-white animate-pulse" />}>
            <ShopSidebar products={allProducts} activeFilter={activeFilter} />
          </Suspense>
          <div className="flex-1 min-w-0">
            <ShopCatalog products={products} activeFilter={activeFilter} />
          </div>
        </div>
      </div>
    </div>
  );
}
