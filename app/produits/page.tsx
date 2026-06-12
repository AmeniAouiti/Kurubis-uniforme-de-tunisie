import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/product/product-grid";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import Link from "next/link";

export const metadata = {
  title: "Catalogue produits — Kurubis",
};

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; categorie?: string }>;
}) {
  const params = await searchParams;
  let filtered = [...products];

  if (params.filter === "bestseller") {
    filtered = filtered.filter((p) => p.isBestSeller);
  } else if (params.filter === "new") {
    filtered = filtered.filter((p) => p.isNew);
  }

  if (params.categorie) {
    filtered = filtered.filter((p) => p.categories.includes(params.categorie!));
  }

  return (
    <>
      <PageHeader
        title="Catalogue produits"
        description="Toutes nos tenues de travail professionnelles"
        breadcrumb="Accueil / Produits"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64 shrink-0">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-google-blue">
              Catégories
            </h3>
            <nav className="space-y-1">
              <Link
                href="/produits"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-google-blue-light transition-colors"
              >
                Tous les produits
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/produits?categorie=${cat.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-google-blue-light hover:text-google-blue transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex-1">
            <p className="mb-6 text-sm text-muted">
              {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
            </p>
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
    </>
  );
}
