"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  ChevronDown,
  Heart,
} from "lucide-react";
import { mainNavigation, contactInfo } from "@/lib/data/navigation";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="gradient-blue text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <p className="hidden sm:block">
            Bienvenue chez Kurubis — Fabrication des tenues de travail
          </p>
          <div className="flex items-center gap-4 ml-auto">
            <a href={`tel:${contactInfo.phones[1]}`} className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" />
              {contactInfo.phones[1]}
            </a>
            <Link href="/connexion" className="hover:underline">Connexion</Link>
            <Link href="/inscription" className="hover:underline">Inscription</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="glass border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-blue text-white font-bold text-lg">
              K
            </div>
            <div>
              <span className="text-xl font-bold text-google-blue">Kurubis</span>
              <span className="hidden sm:block text-[10px] text-muted -mt-1">Tenues de travail</span>
            </div>
          </Link>

          <form action="/recherche" className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                name="q"
                type="search"
                placeholder="Rechercher un produit, une catégorie..."
                className="w-full rounded-full border border-border bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-google-blue focus:ring-2 focus:ring-google-blue-light"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link
              href="/compte"
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light transition-colors"
              aria-label="Mon compte"
            >
              <User className="h-5 w-5 text-google-blue" />
            </Link>
            <Link
              href="/compte"
              className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light transition-colors"
              aria-label="Favoris"
            >
              <Heart className="h-5 w-5 text-google-blue" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light transition-colors"
              aria-label="Panier devis"
            >
              <ShoppingCart className="h-5 w-5 text-google-blue" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-google-blue text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block border-t border-border/50">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
            {mainNavigation.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={item.href || "#"}
                  className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-foreground hover:text-google-blue transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                {item.children && activeMenu === item.label && (
                  <div className="absolute left-0 top-full z-50 min-w-[280px] rounded-2xl border border-border bg-white p-4 shadow-xl shadow-google-blue/10">
                    <div className="grid gap-1">
                      {item.children.map((child) => (
                        <div key={child.label}>
                          {child.href ? (
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm hover:bg-google-blue-light hover:text-google-blue transition-colors"
                            >
                              {child.label}
                            </Link>
                          ) : (
                            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-google-blue">
                              {child.label}
                            </p>
                          )}
                          {child.children && (
                            <div className="ml-2 border-l-2 border-google-blue-light pl-2">
                              {child.children.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href || "#"}
                                  className="block rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-google-blue-light hover:text-google-blue transition-colors"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-[120px] z-40 bg-white lg:hidden transition-transform duration-300 overflow-y-auto",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="p-4 space-y-2">
          {mainNavigation.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href || "#"}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light"
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.label}
                  href={child.href || "#"}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-8 py-2 text-sm text-muted hover:bg-google-blue-light"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
