import type { HeroSlide, PersonalizationMethod, Guide, Service } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Service propreté",
    subtitle: "Uniformes professionnels pour vos équipes de nettoyage et d'entretien",
    cta: "Voir la sélection",
    href: "/boutique",
    gradient: "from-google-blue-800 via-google-blue-600 to-google-blue",
    icon: "Sparkles",
    image: "/images/landing/hero-proprete.webp",
    imageAlt: "Équipe de service propreté en uniformes professionnels",
  },
  {
    id: "2",
    title: "Génie civil & BTP",
    subtitle: "Tenues haute visibilité et équipements pour les chantiers et le génie civil",
    cta: "Voir la sélection",
    href: "/metiers/btp-chantiers",
    gradient: "from-google-blue-700 via-google-blue to-google-blue-100",
    icon: "HardHat",
    image: "/images/landing/hero-genie-civil.webp",
    imageAlt: "Ingénieur génie civil en tenue de sécurité sur chantier",
  },
  {
    id: "3",
    title: "Plomberie & artisanat",
    subtitle: "Combinaisons de travail résistantes pour les installateurs et artisans",
    cta: "Voir la sélection",
    href: "/metiers/installateurs",
    gradient: "from-google-blue-800 via-google-blue-700 to-white",
    icon: "Wrench",
    image: "/images/landing/hero-plomberie.webp",
    imageAlt: "Plombier en combinaison de travail dans un atelier",
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
