"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { useCms } from "@/contexts/cms-context";

export function CategoryProducts({ slug }: { slug: string }) {
  const { products, hydrated } = useCms();
  const categoryProducts = products.filter((p) => p.categories.includes(slug));

  if (!hydrated) {
    return <p className="text-sm text-muted py-8">Chargement...</p>;
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted">
        {categoryProducts.length} produit{categoryProducts.length > 1 ? "s" : ""}
      </p>
      {categoryProducts.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center text-sm text-muted">
          Aucun produit dans cette catégorie pour le moment.
        </div>
      ) : (
        <ProductGrid products={categoryProducts} />
      )}
    </>
  );
}
