"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShopLayout } from "@/components/shop/shop-layout";
import { filterProducts, findFilterNode } from "@/lib/data/shop-filters";
import { useCms } from "@/contexts/cms-context";

export function BoutiqueClient() {
  const searchParams = useSearchParams();
  const { products } = useCms();

  const filtered = useMemo(() => {
    let list = [...products];

    const filter = searchParams.get("filter");
    const categorie = searchParams.get("categorie");
    const metier = searchParams.get("metier");
    const filterSlug = searchParams.get("filtre");

    if (filter === "bestseller") list = list.filter((p) => p.isBestSeller);
    else if (filter === "new") list = list.filter((p) => p.isNew);

    if (categorie) list = list.filter((p) => p.categories.includes(categorie));
    if (metier) list = list.filter((p) => p.metiers.includes(metier));
    if (filterSlug) list = filterProducts(list, filterSlug);

    return list;
  }, [products, searchParams]);

  const filterSlug = searchParams.get("filtre") ?? undefined;
  const filterNode = filterSlug ? findFilterNode(filterSlug) : null;
  const breadcrumb = filterNode
    ? [{ label: "Shop", href: "/boutique" }, { label: filterNode.label }]
    : [{ label: "Shop" }];

  return (
    <ShopLayout
      products={filtered}
      allProducts={products}
      activeFilter={filterSlug}
      breadcrumb={breadcrumb}
    />
  );
}
