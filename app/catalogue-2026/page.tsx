import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/product/product-grid";
import { products } from "@/lib/data/products";
import { BookOpen, Download } from "lucide-react";

export const metadata = {
  title: "Catalogue 2026 — Kurubis",
};

export default function CataloguePage() {
  return (
    <>
      <PageHeader
        title="Catalogue Tenue de travail 2026"
        description="Découvrez notre collection complète de vêtements professionnels"
        breadcrumb="Accueil / Catalogue 2026"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 flex flex-col items-center rounded-2xl border border-border bg-google-blue-50 p-8 text-center md:p-12">
          <BookOpen className="h-12 w-12 text-google-blue mb-4" />
          <h2 className="text-2xl font-bold mb-2">Catalogue complet 2026</h2>
          <p className="text-muted max-w-lg mb-6">
            Parcourez notre sélection de combinaisons, salopettes, EPI, tenues haute visibilité
            et uniformes par métier. Tous nos produits sont personnalisables avec votre logo.
          </p>
          <a
            href="/api/download/catalogue-2026"
            download="kurubis-catalogue-2026.pdf"
            className="inline-flex items-center gap-2 rounded-full border-2 border-google-blue px-6 py-2.5 text-sm font-semibold text-google-blue hover:bg-google-blue-light transition-colors"
          >
            <Download className="h-4 w-4" />
            Télécharger le catalogue PDF
          </a>
        </div>
        <ProductGrid products={products} />
      </div>
    </>
  );
}
