export interface CatalogItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  downloadSlug: string;
  href: string;
  fileName: string;
  fileUrl?: string;
}

export const downloadableCatalogs: CatalogItem[] = [
  {
    id: "anti-feu",
    title: "Tenue de travail anti-feu",
    subtitle: "Retardateur de flamme",
    description:
      "Catalogue complet des tenues ignifuges et multirisques pour pétroliers, protection civile et industrie.",
    image: "https://images.unsplash.com/photo-1582751363-7bf2498166a1?w=800&h=600&fit=crop&q=80",
    downloadSlug: "catalogue-anti-feu",
    href: "/categories/anti-feu",
    fileName: "kurubis-catalogue-anti-feu.pdf",
  },
  {
    id: "2026",
    title: "Catalogue tenue de travail 2026",
    subtitle: "Collection professionnelle",
    description:
      "Toute notre gamme 2026 : combinaisons, salopettes, EPI, haute visibilité et personnalisation logo.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop&q=80",
    downloadSlug: "catalogue-2026",
    href: "/catalogue-2026",
    fileName: "kurubis-catalogue-2026.pdf",
  },
  {
    id: "medicales",
    title: "Catalogue tenues médicales",
    subtitle: "Médical & bien-être",
    description: "Blouses, bavettes, surblouses et uniformes pour le secteur médical et paramédical.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80",
    downloadSlug: "catalogue-medicales",
    href: "/categories/medicales",
    fileName: "kurubis-catalogue-medicales.pdf",
  },
];
