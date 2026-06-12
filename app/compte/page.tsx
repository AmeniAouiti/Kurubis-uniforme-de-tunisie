"use client";

import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { accountNavigation } from "@/lib/data/account-nav";
import { useWishlist } from "@/contexts/wishlist-context";
import { Package, FileText, Heart } from "lucide-react";

export default function CompteDashboardPage() {
  const { items: wishlistItems } = useWishlist();

  const quickStats = [
    { icon: Package, label: "Commandes récentes", value: "3", href: "/compte/commandes" },
    { icon: FileText, label: "Devis en cours", value: "1", href: "/compte/offres" },
    { icon: Heart, label: "Favoris", value: String(wishlistItems.length), href: "/compte/listes-achat" },
  ];

  return (
    <AccountShell title="Mon compte" breadcrumb="Mon compte">
      <p className="text-sm text-muted leading-relaxed mb-8">
        À partir du tableau de bord de votre compte, vous pouvez visualiser vos commandes récentes,
        gérer vos adresses de livraison et de facturation ainsi que changer votre mot de passe
        et les détails de votre compte.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-white p-5 transition-all hover:border-google-blue/30 hover:shadow-lg"
          >
            <stat.icon className="h-6 w-6 text-google-blue mb-3" />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Accès rapide</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {accountNavigation.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm hover:border-google-blue/30 hover:bg-google-blue-50 transition-colors"
          >
            <item.icon className="h-4 w-4 text-google-blue" />
            <div>
              <p className="font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs text-muted">{item.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </AccountShell>
  );
}
