/** Images réelles (Unsplash) alignées sur chaque métier */
const u = (id: string) =>
  `https://images.unsplash.com/${id}?w=480&h=360&fit=crop&q=80`;

export const metierImages: Record<string, string> = {
  "protection-civile": u("photo-1542601906990-b4d3fb778b09"),
  petroliers: u("photo-1581092918056-0c4c3acd3789"),
  industrie: u("photo-1581091226825-a6a2a5aee158"),
  batiment: u("photo-1504307651254-35680f356dfd"),
  cuisine: u("photo-1556910103-1c02745aae4d"),
  medicales: u("photo-1559839734-2b71ea197ec2"),
  "btp-chantiers": u("photo-1541888946425-d81bb19240f5"),
  metal: u("photo-1565193566173-7a0ee3dbe261"),
  installateurs: u("photo-1621905252507-b35492cc74b4"),
  automobile: u("photo-1486262715619-67b85e0b08d3"),
  bois: u("photo-1504148455328-c376907d081c"),
  "espace-vert": u("photo-1416879595882-3373a0480b5b"),
  logistique: u("photo-1586528116311-ad8dd3c8310d"),
  chaussures: u("photo-1571019613454-1cb2f99b2d8b"),
  "uniforme-scolaire": u("photo-1503454537195-1dcabb73ffb9"),
};
