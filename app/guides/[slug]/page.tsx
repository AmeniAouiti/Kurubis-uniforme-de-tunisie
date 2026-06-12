import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { guides } from "@/lib/data/marketing";

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide introuvable" };
  return { title: `${guide.title} — Kurubis` };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <>
      <PageHeader
        title={guide.title}
        breadcrumb={`Accueil / Guides / ${guide.title}`}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <article className="prose prose-sm max-w-none">
          {guide.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 text-muted leading-relaxed whitespace-pre-line">
              {paragraph.replace(/\*\*(.*?)\*\*/g, "$1")}
            </p>
          ))}
        </article>
      </div>
    </>
  );
}
