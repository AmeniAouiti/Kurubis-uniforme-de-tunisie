import type { HeroSlide, PersonalizationMethod, ClientReference, Guide, Service } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Vêtements de travail Anti-Feu",
    subtitle: "Protection retardatrice de flamme pour les environnements à haut risque",
    cta: "Voir la sélection",
    href: "/categories/anti-feu",
    gradient: "from-google-blue-800 via-google-blue-600 to-google-blue",
    icon: "Flame",
  },
  {
    id: "2",
    title: "Gilet de travail sans manches",
    subtitle: "Pour les professionnels exigeants — liberté de mouvement optimale",
    cta: "Voir la sélection",
    href: "/categories/gilets",
    gradient: "from-google-blue-700 via-google-blue to-google-blue-100",
    icon: "Vest",
  },
  {
    id: "3",
    title: "Catalogue Tenue de travail 2026",
    subtitle: "Découvrez notre nouvelle collection professionnelle",
    cta: "Télécharger le catalogue",
    href: "/catalogue-2026",
    gradient: "from-google-blue-800 via-google-blue-700 to-white",
    icon: "BookOpen",
  },
];

export const personalizationMethods: PersonalizationMethod[] = [
  {
    id: "broderie",
    title: "La Broderie",
    description:
      "Marquage jusqu'à 5 couleurs, rendu très qualitatif. Pas de dégradés. Textiles légers (<150g/m²) non acceptés. Les petites finesses ne pourront pas être reproduites.",
    icon: "Needle",
  },
  {
    id: "transfert",
    title: "Le Transfert",
    description:
      "Marquage avec dégradés et sans limites de couleurs. Impression sur flex imprimable opaque, découpée à la forme et collée à chaud. Lavage 30/40°.",
    icon: "Layers",
  },
  {
    id: "serigraphie",
    title: "La Sérigraphie",
    description:
      "Marquage de 1 à 6 couleurs, grande résistance au lavage. Pas de dégradés. Certaines matières (polaire, tissu irrégulier) n'acceptent pas la sérigraphie.",
    icon: "Paintbrush",
  },
];

export const clientReferences: ClientReference[] = [
  { id: "1", name: "GROUPE POLINA" },
  { id: "2", name: "LE PROFESSIONNEL" },
  { id: "3", name: "COG DISTRIBUTION" },
  { id: "4", name: "RHEINMETALL" },
  { id: "5", name: "MOTORSERVICE" },
  { id: "6", name: "BF Germany" },
  { id: "7", name: "BOSCH" },
  { id: "8", name: "Decelect" },
  { id: "9", name: "MPC PROKIM" },
  { id: "10", name: "STBG / SFBT" },
  { id: "11", name: "SKF" },
  { id: "12", name: "BECKS" },
  { id: "13", name: "ANOUAR MARKET" },
  { id: "14", name: "BATTERIES ASSAD" },
  { id: "15", name: "BEN YEDDER" },
  { id: "16", name: "BOSCH" },
  { id: "17", name: "Barista's Cafe" },
  { id: "18", name: "La Gazelle" },
  { id: "19", name: "Fial Engineering" },
  { id: "20", name: "SACN" },
  { id: "21", name: "Enda Tamweel" },
  { id: "22", name: "AGR INDUSTRIE" },
  { id: "23", name: "GAMCO ENERGY" },
  { id: "24", name: "ATLAS" },
  { id: "25", name: "OCEANA" },
  { id: "26", name: "GROUPE BISMUTH" },
  { id: "27", name: "SITAR" },
  { id: "28", name: "CAT" },
  { id: "29", name: "IVECO" },
  { id: "30", name: "LINDE GAS" },
  { id: "31", name: "STAROIL" },
  { id: "32", name: "PROPLAST" },
];

export const guides: Guide[] = [
  {
    slug: "choisir-taille",
    title: "Choisir correctement sa taille",
    content: `Pour choisir la bonne taille de tenue de travail, mesurez votre tour de poitrine, taille et longueur d'entrejambe. Consultez notre guide des tailles pour chaque gamme de produits.

**Conseils :**
- Prévoyez un peu d'aisance pour le confort au travail
- Les combinaisons nécessitent une mesure précise de l'entrejambe
- En cas de doute, contactez notre équipe pour un conseil personnalisé`,
  },
  {
    slug: "tissus-travail",
    title: "Les tissus de travail",
    content: `Nos tenues utilisent des tissus sélectionnés pour leur résistance et leur confort :

**Coton/Polyester** — Respirant et durable, idéal pour l'industrie générale.
**Tergal** — Résistant aux déchirures, parfait pour l'agriculture et le BTP.
**Softshell** — Imperméable et coupe-vent, pour les environnements extérieurs.
**Multirisque** — Anti-feu, antistatique, conforme aux normes ATEX.`,
  },
];

export const services: Service[] = [
  {
    slug: "personnalisation-logo",
    title: "Personnalisation avec logo",
    description: "Marquez vos tenues avec votre identité visuelle",
    content: `Nous proposons trois techniques de marquage : broderie, transfert et sérigraphie. Chaque méthode a ses avantages selon le type de textile et le rendu souhaité.

Contactez-nous avec votre logo pour recevoir un devis personnalisé. Nous vous conseillerons la technique la plus adaptée à vos besoins.`,
  },
];
