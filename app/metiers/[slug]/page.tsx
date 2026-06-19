import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { MetierProducts } from "@/components/metiers/metier-products";
import { getMetierConfig, metiersConfig } from "@/lib/data/metiers-config";

export async function generateStaticParams() {
  return metiersConfig.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metier = getMetierConfig(slug);
  if (!metier) return { title: "Métier introuvable" };
  return { title: `Tenues ${metier.name} — Kurubis` };
}

export default async function MetierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const metier = getMetierConfig(slug);
  if (!metier) notFound();

  return (
    <>
      <PageHeader
        title={`Tenues pour ${metier.name}`}
        description={`Équipements professionnels adaptés au secteur ${metier.name.toLowerCase()}`}
        breadcrumb={`Accueil / Métiers / ${metier.name}`}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Suspense fallback={<p className="text-sm text-muted py-8">Chargement...</p>}>
          <MetierProducts metierSlug={slug} />
        </Suspense>
      </div>
    </>
  );
}
