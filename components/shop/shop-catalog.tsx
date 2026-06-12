"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductList } from "@/components/product/product-list";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { ActiveFilterBar } from "@/components/shop/active-filter-bar";
import type { Product } from "@/types";

type SortOption = "default" | "name-asc" | "name-desc" | "newest";

export function ShopCatalog({
  products,
  activeFilter,
}: {
  products: Product[];
  activeFilter?: string;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortOption>("default");
  const [perPage, setPerPage] = useState(16);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return list;
    }
  }, [products, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const from = sorted.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, sorted.length);

  return (
    <div>
      <ActiveFilterBar activeFilter={activeFilter} resultCount={sorted.length} />
      <ShopToolbar
        view={view}
        onViewChange={setView}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPage(1);
        }}
        perPage={perPage}
        onPerPageChange={(n) => {
          setPerPage(n);
          setPage(1);
        }}
        total={sorted.length}
        from={from}
        to={to}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      {view === "grid" ? (
        <ProductGrid products={paginated} />
      ) : (
        <ProductList products={paginated} />
      )}
    </div>
  );
}
