import { metiersConfig } from "@/lib/data/metiers-config";

export interface MetierMenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

function metierHref(slug: string, filter?: { type: "category" | "sub"; slug: string }) {
  if (!filter) return `/metiers/${slug}`;
  const param = filter.type === "category" ? "categorie" : "sous-metier";
  return `/metiers/${slug}?${param}=${filter.slug}`;
}

/** @deprecated Utiliser metiersConfig — conservé pour compatibilité mobile */
export const metiersSidebarMenu: MetierMenuItem[] = metiersConfig.map((m) => {
  if (!m.filters?.length) {
    return { label: m.name, href: `/metiers/${m.slug}` };
  }
  return {
    label: m.name,
    children: m.filters.map((f) => ({
      label: f.label,
      href: metierHref(m.slug, f),
    })),
  };
});

import { vetementsHierarchy } from "@/lib/data/vetements-config";

/** @deprecated Utiliser vetementsHierarchy */
export const vetementsMegaMenu = vetementsHierarchy.map((section) => ({
  label: section.label,
  href: section.slug ? `/categories/${section.slug}` : undefined,
  groups: section.groups.map((g) => ({
    title: g.title,
    items: g.items.map((i) => ({
      label: i.label,
      href: `/categories/${i.slug}`,
    })),
  })),
}));
