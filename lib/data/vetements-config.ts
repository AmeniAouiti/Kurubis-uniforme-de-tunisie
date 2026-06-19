/** Hiérarchie vêtements de travail (menu boutique + admin) */

export interface VetementLeaf {
  slug: string;
  label: string;
}

export interface VetementGroup {
  title?: string;
  items: VetementLeaf[];
}

export interface VetementSection {
  id: string;
  label: string;
  /** Lien direct si pas de sous-éléments */
  slug?: string;
  groups: VetementGroup[];
}

export const vetementsHierarchy: VetementSection[] = [
  {
    id: "industrie",
    label: "Industrie",
    groups: [
      {
        items: [
          { slug: "combinaisons", label: "Combinaisons" },
          { slug: "salopettes", label: "Salopettes de travail" },
          { slug: "pantalons", label: "Pantalons de travail" },
          { slug: "blouses", label: "Blouses de travail" },
          { slug: "gilets", label: "Gilets de travail" },
          { slug: "parkas", label: "Parkas de travail" },
        ],
      },
      {
        items: [
          { slug: "polo", label: "Polo" },
          { slug: "doudounes", label: "Doudounes" },
        ],
      },
      {
        title: "Blouse et tablier",
        items: [
          { slug: "blouses", label: "Blouses femme" },
          { slug: "blouses", label: "Blouses homme" },
        ],
      },
    ],
  },
  {
    id: "haute-visibilite",
    label: "Haute visibilité",
    groups: [
      {
        title: "Haute visibilité",
        items: [
          { slug: "pantalons-haute-visibilite", label: "Pantalons haute visibilité" },
          { slug: "parkas-haute-visibilite", label: "Parkas haute visibilité" },
          { slug: "vestes-haute-visibilite", label: "T-shirt haute visibilité" },
          { slug: "vestes-haute-visibilite", label: "Vestes et blousons haute visibilité" },
        ],
      },
    ],
  },
  {
    id: "medicales",
    label: "Médicales",
    slug: "medicales",
    groups: [],
  },
  {
    id: "hotellerie",
    label: "Hôtellerie",
    slug: "hotellerie",
    groups: [],
  },
  {
    id: "chaussures",
    label: "Chaussures",
    slug: "chaussures",
    groups: [],
  },
  {
    id: "uniforme-scolaire",
    label: "Uniforme scolaire",
    slug: "uniforme-scolaire",
    groups: [],
  },
  {
    id: "anti-feu",
    label: "Anti-feu",
    slug: "anti-feu",
    groups: [],
  },
  {
    id: "multirisque",
    label: "Multirisque",
    slug: "multirisque",
    groups: [],
  },
];

export interface VetementSelectOption {
  value: string;
  label: string;
  depth: number;
  sectionId?: string;
}

/** Options plates pour select hiérarchique (depth 0 = section, depth 1 = article) */
export function getVetementSelectOptions(): VetementSelectOption[] {
  const options: VetementSelectOption[] = [
    { value: "", label: "— Aucune catégorie —", depth: 0 },
  ];

  for (const section of vetementsHierarchy) {
    if (section.slug && section.groups.length === 0) {
      options.push({
        value: section.slug,
        label: section.label,
        depth: 0,
        sectionId: section.id,
      });
      continue;
    }

    options.push({
      value: `__section__:${section.id}`,
      label: section.label,
      depth: 0,
      sectionId: section.id,
    });

    for (const group of section.groups) {
      if (group.title) {
        options.push({
          value: `__group__:${section.id}:${group.title}`,
          label: group.title,
          depth: 1,
          sectionId: section.id,
        });
      }
      for (const item of group.items) {
        options.push({
          value: item.slug,
          label: item.label,
          depth: group.title ? 2 : 1,
          sectionId: section.id,
        });
      }
    }
  }

  return options;
}

export function getVetementLabel(slug: string): string | undefined {
  if (!slug) return undefined;
  for (const section of vetementsHierarchy) {
    if (section.slug === slug) return section.label;
    for (const group of section.groups) {
      const item = group.items.find((i) => i.slug === slug);
      if (item) return item.label;
    }
  }
  return undefined;
}
