"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  List,
} from "lucide-react";
import { contactInfo } from "@/lib/data/navigation";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { WishlistButton } from "@/components/layout/wishlist-button";
import { VetementsMegaMenu } from "@/components/layout/mega-menu";
import { MetiersSidebar } from "@/components/layout/metiers-sidebar";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [metiersOpen, setMetiersOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      <div className="gradient-blue text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <p className="hidden sm:block">{BRAND.welcome}</p>
          <div className="flex items-center gap-4 ml-auto flex-wrap justify-end">
            <a href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" />
              {contactInfo.phones[0]}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="hidden sm:flex items-center gap-1 hover:underline">
              <Mail className="h-3 w-3" />
              {contactInfo.email}
            </a>
            {!isAuthenticated && (
              <>
                <Link href="/connexion" className="hover:underline hidden sm:inline">Connexion</Link>
                <Link href="/inscription" className="hover:underline hidden sm:inline">Inscription</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="glass border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-google-blue-light lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Logo />

          <form action="/recherche" className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative flex w-full">
              <input
                name="q"
                type="search"
                placeholder="Rechercher un produit..."
                className="w-full rounded-l-full border border-r-0 border-border bg-white py-2.5 pl-5 pr-4 text-sm outline-none transition-all focus:border-google-blue"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-full bg-google-blue px-5 text-white hover:bg-google-blue-dark transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <WishlistButton />
            <UserMenu />
            <Link
              href="/panier"
              className="relative flex items-center gap-2 rounded-full px-3 py-2 hover:bg-google-blue-light transition-colors"
              aria-label="Citation devis"
            >
              <ShoppingBag className="h-5 w-5 text-google-blue" />
              <span className="hidden sm:inline text-sm font-medium text-google-blue">Citation</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 right-0 sm:right-1 flex h-4 w-4 items-center justify-center rounded-full bg-google-blue text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="hidden lg:block border-t border-border/50">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4">
            <button
              onClick={() => setMetiersOpen(!metiersOpen)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all",
                metiersOpen ? "bg-google-blue-dark" : "gradient-blue hover:shadow-md"
              )}
            >
              <List className="h-4 w-4" />
              MÉTIERS
            </button>

            <Link
              href="/"
              className="px-4 py-3 text-sm font-medium text-foreground hover:text-google-blue transition-colors"
            >
              ACCUEIL
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                href="/boutique"
                className={cn(
                  "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors",
                  megaOpen ? "text-google-blue" : "text-foreground hover:text-google-blue"
                )}
              >
                VÊTEMENT DE TRAVAIL
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", megaOpen && "rotate-180")} />
              </Link>
              {megaOpen && <VetementsMegaMenu onClose={() => setMegaOpen(false)} />}
            </div>

            <Link
              href="/contact"
              className="px-4 py-3 text-sm font-medium text-foreground hover:text-google-blue transition-colors"
            >
              CONTACT
            </Link>
          </div>
        </nav>
      </div>

      {metiersOpen && (
        <div className="hidden lg:block border-b border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <MetiersSidebar />
          </div>
        </div>
      )}

      <div
        className={cn(
          "fixed inset-0 top-[140px] z-40 bg-white lg:hidden transition-transform duration-300 overflow-y-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <form action="/recherche" className="p-4 border-b border-border">
          <div className="relative flex">
            <input
              name="q"
              type="search"
              placeholder="Rechercher un produit..."
              className="w-full rounded-l-xl border border-r-0 border-border py-2.5 pl-4 text-sm outline-none"
            />
            <button type="submit" className="rounded-r-xl bg-google-blue px-4 text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
        <nav className="p-4 space-y-1">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light">Accueil</Link>
          <Link href="/boutique" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light">Vêtement de travail</Link>
          <Link href="/metiers" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light">Métiers</Link>
          <Link href="/personnalisation" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light">Personnalisation</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light">Contact</Link>
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-google-blue hover:bg-google-blue-light">Administration</Link>
        </nav>
        <div className="p-4">
          <MetiersSidebar />
        </div>
      </div>
    </header>
  );
}
