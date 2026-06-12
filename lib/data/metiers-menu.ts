export interface MetierMenuItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

export const metiersSidebarMenu: MetierMenuItem[] = [
  { label: "Protection civile", href: "/metiers/protection-civile" },
  { label: "Pétroliers", href: "/metiers/petroliers" },
  {
    label: "Industrie",
    children: [
      { label: "Salopettes", href: "/categories/salopettes" },
      { label: "Combinaisons", href: "/categories/combinaisons" },
      { label: "Blouses", href: "/categories/blouses" },
      { label: "Gilets", href: "/categories/gilets" },
      { label: "Pantalons de travail", href: "/categories/pantalons" },
      { label: "Tablier de travail", href: "/categories/blouses" },
      { label: "Vestes de travail", href: "/categories/parkas" },
      { label: "Parka haute visibilité", href: "/categories/parkas-haute-visibilite" },
      { label: "Maille", href: "/categories/polo" },
      { label: "Outdoor", href: "/categories/parkas" },
    ],
  },
  {
    label: "Bâtiment",
    children: [
      { label: "Peintre – Plaquiste", href: "/metiers/batiment" },
    ],
  },
  {
    label: "Cuisine",
    children: [
      { label: "Agroalimentaire", href: "/metiers/cuisine" },
      { label: "Cuisinier / Boucher / Charcutier", href: "/metiers/cuisine" },
      { label: "Serveur", href: "/categories/hotellerie" },
    ],
  },
  {
    label: "Médicales / Bien-être",
    children: [
      { label: "Ambulancier", href: "/categories/medicales" },
      { label: "Médical – Paramédical", href: "/categories/medicales" },
      { label: "Beauté – Bien être", href: "/metiers/medicales" },
    ],
  },
  {
    label: "BTP et chantiers",
    children: [
      { label: "Carreleur", href: "/metiers/btp-chantiers" },
      { label: "Couvreur – zingueur", href: "/metiers/btp-chantiers" },
      { label: "Maçon", href: "/metiers/btp-chantiers" },
      { label: "Ouvrier", href: "/metiers/btp-chantiers" },
    ],
  },
  {
    label: "Chaussures",
    children: [
      { label: "Bottes", href: "/categories/chaussures" },
      { label: "Claquettes", href: "/categories/chaussures" },
      { label: "Chaussures de ville", href: "/categories/chaussures" },
      { label: "Chaussures de sécurité", href: "/categories/chaussures" },
    ],
  },
  {
    label: "Uniforme scolaire",
    children: [
      { label: "Jardin d'enfants", href: "/categories/uniforme-scolaire" },
      { label: "Tablier scolaire", href: "/categories/uniforme-scolaire" },
    ],
  },
];

export const vetementsMegaMenu = [
  {
    label: "Industrie",
    groups: [
      {
        items: [
          { label: "Combinaisons", href: "/categories/combinaisons" },
          { label: "Salopettes de travail", href: "/categories/salopettes" },
          { label: "Pantalons de travail", href: "/categories/pantalons" },
          { label: "Blouses de travail", href: "/categories/blouses" },
          { label: "Gilets de travail", href: "/categories/gilets" },
          { label: "Parkas de travail", href: "/categories/parkas" },
        ],
      },
      {
        items: [
          { label: "Polo", href: "/categories/polo" },
          { label: "Doudounes", href: "/categories/doudounes" },
          { label: "Pulls de travail et sweats", href: "/categories/polo" },
        ],
      },
      {
        title: "Blouse et tablier",
        items: [
          { label: "Blouses femme", href: "/categories/blouses" },
          { label: "Blouses homme", href: "/categories/blouses" },
        ],
      },
    ],
  },
  {
    label: "Haute visibilité",
    groups: [
      {
        title: "Haute visibilité",
        items: [
          { label: "Pantalons haute visibilité", href: "/categories/pantalons-haute-visibilite" },
          { label: "Parkas haute visibilité", href: "/categories/parkas-haute-visibilite" },
          { label: "T-shirt haute visibilité", href: "/categories/vestes-haute-visibilite" },
          { label: "Vestes et blousons haute visibilité", href: "/categories/vestes-haute-visibilite" },
        ],
      },
    ],
  },
  {
    label: "Médicales",
    href: "/categories/medicales",
    groups: [],
  },
  {
    label: "Hôtellerie",
    href: "/categories/hotellerie",
    groups: [],
  },
];
