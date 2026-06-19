import {
  LayoutDashboard,
  Package,
  Settings,
  Store,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react";

export const adminNavigation = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/messagerie", label: "Messagerie", icon: MessageSquare },
  { href: "/admin/devis", label: "Demandes de devis", icon: FileText },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/produits", label: "Articles", icon: Package },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
] as const;

export const adminSiteLink = {
  href: "/",
  label: "Voir le site",
  icon: Store,
};
