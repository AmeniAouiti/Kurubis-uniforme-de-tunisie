import { PageHeader } from "@/components/layout/page-header";
import { PersonalizationSection } from "@/components/home/personalization-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Personnalisation — Kurubis",
};

export default function PersonnalisationPage() {
  return (
    <>
      <PageHeader
        title="Personnalisation avec logo"
        description="Broderie, transfert et sérigraphie pour vos tenues professionnelles"
        breadcrumb="Accueil / Personnalisation"
      />
      <PersonalizationSection />
      <div className="mx-auto max-w-3xl px-4 pb-16 text-center">
        <p className="text-muted mb-6">
          Envoyez-nous votre logo pour recevoir un devis personnalisé. Notre équipe vous conseillera
          sur la technique de marquage la plus adaptée à vos textiles.
        </p>
        <Link href="/contact">
          <Button size="lg">Demander un devis personnalisation</Button>
        </Link>
      </div>
    </>
  );
}
