export interface MetierFilter {
  slug: string;
  label: string;
  /** category = filtre par catégorie vêtement ; sub = sous-métier */
  type: "category" | "sub";
}

export interface MetierDefinition {
  slug: string;
  name: string;
  filters?: MetierFilter[];
}

export const metiersConfig: MetierDefinition[] = [
  { slug: "protection-civile", name: "Protection civile" },
  { slug: "petroliers", name: "Pétroliers" },
  {
    slug: "industrie",
    name: "Industrie",
    filters: [
      { slug: "salopettes", label: "Salopettes", type: "category" },
      { slug: "combinaisons", label: "Combinaisons", type: "category" },
      { slug: "blouses", label: "Blouses", type: "category" },
      { slug: "gilets", label: "Gilets", type: "category" },
      { slug: "pantalons", label: "Pantalons de travail", type: "category" },
      { slug: "blouses", label: "Tablier de travail", type: "category" },
      { slug: "parkas", label: "Vestes de travail", type: "category" },
      { slug: "parkas-haute-visibilite", label: "Parka haute visibilité", type: "category" },
      { slug: "polo", label: "Maille", type: "category" },
      { slug: "parkas", label: "Outdoor", type: "category" },
    ],
  },
  {
    slug: "batiment",
    name: "Bâtiment",
    filters: [{ slug: "peintre-plaquiste", label: "Peintre – Plaquiste", type: "sub" }],
  },
  {
    slug: "cuisine",
    name: "Cuisine",
    filters: [
      { slug: "agroalimentaire", label: "Agroalimentaire", type: "sub" },
      { slug: "cuisinier-boucher", label: "Cuisinier / Boucher / Charcutier", type: "sub" },
      { slug: "serveur", label: "Serveur", type: "sub" },
    ],
  },
  {
    slug: "medicales",
    name: "Médicales / Bien-être",
    filters: [
      { slug: "ambulancier", label: "Ambulancier", type: "sub" },
      { slug: "medical-paramedical", label: "Médical – Paramédical", type: "sub" },
      { slug: "beaute-bien-etre", label: "Beauté – Bien être", type: "sub" },
    ],
  },
  {
    slug: "btp-chantiers",
    name: "BTP et chantiers",
    filters: [
      { slug: "carreleur", label: "Carreleur", type: "sub" },
      { slug: "couvreur-zingueur", label: "Couvreur – zingueur", type: "sub" },
      { slug: "macon", label: "Maçon", type: "sub" },
      { slug: "ouvrier", label: "Ouvrier", type: "sub" },
    ],
  },
  {
    slug: "chaussures",
    name: "Chaussures",
    filters: [
      { slug: "bottes", label: "Bottes", type: "sub" },
      { slug: "claquettes", label: "Claquettes", type: "sub" },
      { slug: "chaussures-ville", label: "Chaussures de ville", type: "sub" },
      { slug: "chaussures-securite", label: "Chaussures de sécurité", type: "sub" },
    ],
  },
  {
    slug: "uniforme-scolaire",
    name: "Uniforme scolaire",
    filters: [
      { slug: "jardin-enfants", label: "Jardin d'enfants", type: "sub" },
      { slug: "tablier-scolaire", label: "Tablier scolaire", type: "sub" },
    ],
  },
  { slug: "metal", name: "Industrie du métal" },
  { slug: "installateurs", name: "Installateurs" },
  { slug: "automobile", name: "Automobile" },
  { slug: "bois", name: "Artisan du bois" },
  { slug: "espace-vert", name: "Espace vert" },
  { slug: "logistique", name: "Logistique et transport" },
];

export function getMetierConfig(slug: string) {
  return metiersConfig.find((m) => m.slug === slug);
}

export function getAllMetierSlugs() {
  return metiersConfig.map((m) => m.slug);
}

/** Options admin : sans métier + tous les métiers */
export const METIER_NONE = "";

export const adminMetierOptions = [
  { value: METIER_NONE, label: "Sans métier (vêtement de travail général)" },
  ...metiersConfig.map((m) => ({ value: m.slug, label: m.name })),
];

export function getSubOptionsForMetier(metierSlug: string) {
  const config = getMetierConfig(metierSlug);
  if (!config?.filters) return [];
  return config.filters.filter((f) => f.type === "sub");
}

export function getCategoryFiltersForMetier(metierSlug: string) {
  const config = getMetierConfig(metierSlug);
  if (!config?.filters) return [];
  const seen = new Set<string>();
  return config.filters.filter((f) => {
    if (f.type !== "category" || seen.has(f.slug)) return false;
    seen.add(f.slug);
    return true;
  });
}

export interface MetierSelectOption {
  value: string;
  label: string;
  depth: number;
  /** Métier parent si option enfant */
  metierSlug?: string;
  /** category | sub — type de filtre enfant */
  filterType?: "category" | "sub";
  filterSlug?: string;
  selectable?: boolean;
}

/** Options hiérarchiques admin : métier → sous-filtres */
export function getMetierSelectOptions(): MetierSelectOption[] {
  const options: MetierSelectOption[] = [
    {
      value: METIER_NONE,
      label: "Sans métier (vêtement de travail général)",
      depth: 0,
    },
  ];

  for (const metier of metiersConfig) {
    const hasChildren = (metier.filters?.length ?? 0) > 0;

    options.push({
      value: hasChildren ? `__metier__:${metier.slug}` : metier.slug,
      label: metier.name,
      depth: 0,
      metierSlug: metier.slug,
      selectable: !hasChildren,
    });

    if (metier.filters) {
      options.push({
        value: metier.slug,
        label: `${metier.name} — tous les articles`,
        depth: 1,
        metierSlug: metier.slug,
      });
      for (const filter of metier.filters) {
        options.push({
          value: `${metier.slug}::${filter.type}::${filter.slug}`,
          label: filter.label,
          depth: 1,
          metierSlug: metier.slug,
          filterType: filter.type,
          filterSlug: filter.slug,
        });
      }
    }
  }

  return options;
}

/** Décode la valeur sélectionnée dans le select métier */
export function parseMetierSelectValue(value: string): {
  metier: string;
  categoryFromMetier?: string;
  subcategory?: string;
} {
  if (!value || value === METIER_NONE) {
    return { metier: METIER_NONE };
  }
  if (!value.includes("::")) {
    return { metier: value };
  }
  const [metier, type, slug] = value.split("::");
  if (type === "category") {
    return { metier, categoryFromMetier: slug };
  }
  if (type === "sub") {
    return { metier, subcategory: slug };
  }
  return { metier: value };
}

/** Encode état formulaire → valeur select métier */
export function encodeMetierSelectValue(
  metier: string,
  metierSubs: string[],
  category: string
): string {
  if (!metier || metier === METIER_NONE) return METIER_NONE;

  const config = getMetierConfig(metier);
  if (metierSubs.length === 1) {
    const sub = metierSubs[0];
    if (config?.filters?.some((f) => f.type === "sub" && f.slug === sub)) {
      return `${metier}::sub::${sub}`;
    }
  }

  if (category && config?.filters?.some((f) => f.type === "category" && f.slug === category)) {
    const match = config.filters.find((f) => f.type === "category" && f.slug === category);
    if (match) return `${metier}::category::${category}`;
  }

  return metier;
}
