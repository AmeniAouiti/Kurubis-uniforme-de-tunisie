import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/marketing";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service introuvable" };
  return { title: `${service.title} — Kurubis` };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        title={service.title}
        description={service.description}
        breadcrumb={`Accueil / Services / ${service.title}`}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-muted leading-relaxed mb-8">{service.content}</p>
        <Link href="/contact">
          <Button size="lg">Demander un devis</Button>
        </Link>
      </div>
    </>
  );
}
