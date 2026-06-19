"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import { contactInfo } from "@/lib/data/navigation";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { WishlistButton } from "@/components/layout/wishlist-button";
import { VetementsMegaMenu } from "@/components/layout/mega-menu";
import { MetiersDropdown } from "@/components/layout/metiers-dropdown";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLink = (href: string, label: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "nav-link px-3 py-2 text-[13px] font-semibold tracking-wide uppercase transition-colors",
          active ? "text-google-blue" : "text-foreground/80 hover:text-google-blue"
        )}
        data-active={active}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/10 bg-[#0d47a1] text-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-[11px]">
          <p className="hidden truncate sm:block text-white/90">{BRAND.welcome}</p>
          <div className="flex items-center gap-4 ml-auto flex-wrap justify-end">
            <a
              href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Phone className="h-3 w-3" />
              {contactInfo.phones[0]}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="hidden md:flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Mail className="h-3 w-3" />
              {contactInfo.email}
            </a>
            {!isAuthenticated && (
              <>
                <Link href="/connexion" className="hidden sm:inline text-white/90 hover:text-white transition-colors">
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="hidden sm:inline rounded-full bg-white/15 px-2.5 py-0.5 hover:bg-white/25 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "glass border-b border-border/60",
          scrolled && "header-scrolled"
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-3 px-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 hover:bg-google-blue-light lg:hidden transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Logo />

          <nav className="hidden lg:flex items-center gap-1 mx-4">
            {navLink("/", "Accueil")}
            <MetiersDropdown variant="nav" />
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                href="/boutique"
                className={cn(
                  "nav-link flex items-center gap-1 px-3 py-2 text-[13px] font-semibold tracking-wide uppercase transition-colors",
                  megaOpen || pathname.startsWith("/boutique") || pathname.startsWith("/categories")
                    ? "text-google-blue"
                    : "text-foreground/80 hover:text-google-blue"
                )}
                data-active={megaOpen || pathname.startsWith("/boutique")}
              >
                Vêtements
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", megaOpen && "rotate-180")} />
              </Link>
              {megaOpen && <VetementsMegaMenu onClose={() => setMegaOpen(false)} />}
            </div>
            {navLink("/personnalisation", "Personnalisation")}
            {navLink("/contact", "Contact")}
          </nav>

          <form action="/recherche" className="hidden md:flex flex-1 max-w-md ml-auto">
            <div className="relative flex w-full group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none transition-colors group-focus-within:text-google-blue" />
              <input
                name="q"
                type="search"
                placeholder="Rechercher un produit..."
                className="w-full rounded-full border border-border/80 bg-surface/80 py-2 pl-11 pr-4 text-sm outline-none transition-all focus:border-google-blue focus:bg-white focus:shadow-sm focus:shadow-google-blue/10"
              />
            </div>
          </form>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <WishlistButton />
            <UserMenu />
            <Link
              href="/panier"
              className="relative flex h-10 items-center gap-2 rounded-xl px-2.5 sm:px-3 hover:bg-google-blue-light transition-all hover:scale-[1.02]"
              aria-label="Citation devis"
            >
              <ShoppingBag className="h-5 w-5 text-google-blue" />
              <span className="hidden sm:inline text-sm font-medium text-google-blue">Devis</span>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-google-blue px-1 text-[10px] font-bold text-white animate-fade-in-up">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in-up"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(100%,320px)] bg-white shadow-2xl lg:hidden transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="border-b border-border p-4">
            <Logo />
          </div>
          <form action="/recherche" className="p-4 border-b border-border">
            <div className="relative flex">
              <input
                name="q"
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-xl border border-border py-2.5 pl-4 text-sm outline-none focus:border-google-blue"
              />
              <button type="submit" className="ml-2 rounded-xl bg-google-blue px-4 text-white">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          <nav className="flex-1 p-3 space-y-0.5">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light transition-colors">Accueil</Link>
            <Link href="/boutique" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light transition-colors">Vêtements de travail</Link>
            <Link href="/personnalisation" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light transition-colors">Personnalisation</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-google-blue-light transition-colors">Contact</Link>
          </nav>
          <div className="border-t border-border p-4">
            <MetiersDropdown variant="button" onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}
