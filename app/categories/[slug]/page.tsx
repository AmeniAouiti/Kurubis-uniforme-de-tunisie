import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryProducts } from "@/components/category/category-products";
import { getCategoryBySlug, categories } from "@/lib/data/categories";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Catégorie introuvable" };
  return { title: `${category.name} — Kurubis` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.description}
        breadcrumb={`Accueil / Catégories / ${category.name}`}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <CategoryProducts slug={slug} />
      </div>
    </>
  );
}
