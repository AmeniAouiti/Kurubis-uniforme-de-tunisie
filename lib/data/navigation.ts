import type { NavItem } from "@/types";

export const mainNavigation: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Vêtements de travail",
    children: [
      {
        label: "Industrie",
        children: [
          { label: "Combinaisons", href: "/categories/combinaisons" },
          { label: "Salopettes de travail", href: "/categories/salopettes" },
          { label: "Pantalons de travail", href: "/categories/pantalons" },
          { label: "Blouses de travail", href: "/categories/blouses" },
          { label: "Gilets de travail", href: "/categories/gilets" },
          { label: "Parkas de travail", href: "/categories/parkas" },
          { label: "Polo", href: "/categories/polo" },
          { label: "Doudounes", href: "/categories/doudounes" },
        ],
      },
      {
        label: "Haute visibilité",
        children: [
          { label: "Pantalons haute visibilité", href: "/categories/pantalons-haute-visibilite" },
          { label: "Parkas haute visibilité", href: "/categories/parkas-haute-visibilite" },
          { label: "T-shirt haute visibilité", href: "/categories/t-shirt-haute-visibilite" },
          { label: "Vestes haute visibilité", href: "/categories/vestes-haute-visibilite" },
        ],
      },
      { label: "Médicales", href: "/categories/medicales" },
      { label: "Hôtellerie", href: "/categories/hotellerie" },
    ],
  },
  {
    label: "Métiers",
    href: "/metiers",
    children: [
      { label: "Protection civile", href: "/metiers/protection-civile" },
      { label: "Pétroliers", href: "/metiers/petroliers" },
      { label: "Industrie", href: "/metiers/industrie" },
      { label: "Bâtiment", href: "/metiers/batiment" },
      { label: "Cuisine", href: "/metiers/cuisine" },
      { label: "Médicales / Bien-être", href: "/metiers/medicales" },
      { label: "BTP et chantiers", href: "/metiers/btp-chantiers" },
      { label: "Chaussures", href: "/categories/chaussures" },
      { label: "Uniforme scolaire", href: "/categories/uniforme-scolaire" },
    ],
  },
  { label: "Personnalisation", href: "/personnalisation" },
  { label: "Catalogue 2026", href: "/catalogue-2026" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  guides: [
    { label: "Choisir correctement sa taille", href: "/guides/choisir-taille" },
    { label: "Les tissus de travail", href: "/guides/tissus-travail" },
  ],
  services: [
    { label: "Personnalisation avec logo", href: "/services/personnalisation-logo" },
    { label: "Suivi commande", href: "/suivi-commande" },
  ],
  account: [
    { label: "Mon compte", href: "/compte" },
    { label: "Suivi commande", href: "/suivi-commande" },
    { label: "Service client", href: "/contact" },
  ],
};

export const contactInfo = {
  phones: ["+216 24 553 769"],
  email: "kurubis.uniforme@gmail.com",
  address: "RUE SFAX KORBA NABEUL 8070",
  coordinates: { lat: 36.7826, lng: 10.8576 },
  mapLabel: "Kurubis uniforme",
};
