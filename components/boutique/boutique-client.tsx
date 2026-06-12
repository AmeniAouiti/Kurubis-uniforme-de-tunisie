"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShopLayout } from "@/components/shop/shop-layout";
import { filterProducts, findFilterNode } from "@/lib/data/shop-filters";
import { getProductPrice } from "@/lib/products-utils";
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
    const prixMin = searchParams.get("prixMin");
    const prixMax = searchParams.get("prixMax");

    if (filter === "bestseller") list = list.filter((p) => p.isBestSeller);
    else if (filter === "new") list = list.filter((p) => p.isNew);

    if (categorie) list = list.filter((p) => p.categories.includes(categorie));
    if (metier) list = list.filter((p) => p.metiers.includes(metier));
    if (filterSlug) list = filterProducts(list, filterSlug);

    if (prixMin !== null || prixMax !== null) {
      const min = Number(prixMin ?? 0);
      const max = Number(prixMax ?? 350);
      list = list.filter((p) => {
        const price = getProductPrice(p);
        return price >= min && price <= max;
      });
    }

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
