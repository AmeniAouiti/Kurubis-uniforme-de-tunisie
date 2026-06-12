import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/product/product-grid";
import { searchProducts } from "@/lib/data/products";

export const metadata = {
  title: "Recherche — Kurubis",
};

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const results = query ? searchProducts(query) : [];

  return (
    <>
      <PageHeader
        title={query ? `Résultats pour "${query}"` : "Recherche"}
        description={query ? `${results.length} produit(s) trouvé(s)` : "Recherchez dans notre catalogue"}
        breadcrumb="Accueil / Recherche"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        {!query ? (
          <p className="text-center text-muted py-12">
            Utilisez la barre de recherche pour trouver des produits.
          </p>
        ) : (
          <ProductGrid products={results} />
        )}
      </div>
    </>
  );
}
