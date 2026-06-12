import { PageHeader } from "@/components/layout/page-header";
import { ProfessionGrid } from "@/components/home/profession-grid";

export const metadata = {
  title: "Métiers — Kurubis",
};

export default function MetiersPage() {
  return (
    <>
      <PageHeader
        title="À chaque métier sa tenue"
        description="Découvrez nos tenues adaptées à votre profession"
        breadcrumb="Accueil / Métiers"
      />
      <ProfessionGrid />
    </>
  );
}
