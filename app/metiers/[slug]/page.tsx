import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/product/product-grid";
import { getMetierBySlug, metiers } from "@/lib/data/categories";
import { getProductsByMetier } from "@/lib/data/products";

export async function generateStaticParams() {
  return metiers.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metier = getMetierBySlug(slug);
  if (!metier) return { title: "Métier introuvable" };
  return { title: `Tenues ${metier.name} — Kurubis` };
}

export default async function MetierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metier = getMetierBySlug(slug);
  if (!metier) notFound();

  const metierProducts = getProductsByMetier(slug);

  return (
    <>
      <PageHeader
        title={`Tenues pour ${metier.name}`}
        description={`Équipements professionnels adaptés au secteur ${metier.name.toLowerCase()}`}
        breadcrumb={`Accueil / Métiers / ${metier.name}`}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="mb-6 text-sm text-muted">
          {metierProducts.length} produit{metierProducts.length > 1 ? "s" : ""} disponible{metierProducts.length > 1 ? "s" : ""}
        </p>
        <ProductGrid products={metierProducts} />
      </div>
    </>
  );
}
