"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { List, ChevronRight, ChevronDown } from "lucide-react";
import { metiersConfig } from "@/lib/data/metiers-config";
import { cn } from "@/lib/utils";

function metierHref(slug: string, filter?: { type: "category" | "sub"; slug: string }) {
  if (!filter) return `/metiers/${slug}`;
  const param = filter.type === "category" ? "categorie" : "sous-metier";
  return `/metiers/${slug}?${param}=${filter.slug}`;
}

export function MetiersDropdown({
  onNavigate,
  variant = "button",
}: {
  onNavigate?: () => void;
  variant?: "button" | "nav";
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setHovered(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hoveredMetier = metiersConfig.find((m) => m.slug === hovered);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (open) setHovered(null);
        }}
        className={cn(
          variant === "nav"
            ? cn(
                "nav-link flex items-center gap-1 px-3 py-2 text-[13px] font-semibold tracking-wide uppercase transition-colors",
                open ? "text-google-blue" : "text-foreground/80 hover:text-google-blue"
              )
            : cn(
                "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all",
                open ? "bg-google-blue-dark shadow-md" : "gradient-blue hover:shadow-md"
              )
        )}
        aria-expanded={open}
        aria-haspopup="true"
        data-active={variant === "nav" ? open : undefined}
      >
        {variant === "button" && <List className="h-4 w-4" />}
        Métiers
        {variant === "nav" ? (
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")} />
        ) : null}
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 flex animate-fade-in-up",
            variant === "nav" ? "left-0 top-full" : "left-0 top-full w-full"
          )}
        >
          <div className="w-72 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-white py-2 shadow-xl shadow-google-blue/10">
            {metiersConfig.map((metier) => {
              const hasFilters = !!metier.filters?.length;
              return (
                <div
                  key={metier.slug}
                  onMouseEnter={() => hasFilters && setHovered(metier.slug)}
                  onMouseLeave={() => hasFilters && setHovered(null)}
                >
                  {hasFilters ? (
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors",
                        hovered === metier.slug
                          ? "bg-google-blue-light text-google-blue"
                          : "text-foreground hover:bg-google-blue-light hover:text-google-blue"
                      )}
                    >
                      <span className="font-medium">{metier.name}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                    </button>
                  ) : (
                    <Link
                      href={`/metiers/${metier.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-google-blue-light hover:text-google-blue transition-colors"
                    >
                      <span className="font-medium">{metier.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {hoveredMetier?.filters && hoveredMetier.filters.length > 0 && (
            <div
              className="w-64 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-white py-2 shadow-xl shadow-google-blue/10 ml-1 hidden sm:block"
              onMouseEnter={() => setHovered(hoveredMetier.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted border-b border-border mb-1">
                {hoveredMetier.name}
              </p>
              <Link
                href={`/metiers/${hoveredMetier.slug}`}
                onClick={() => {
                  setOpen(false);
                  setHovered(null);
                  onNavigate?.();
                }}
                className="block px-4 py-2 text-sm font-medium text-google-blue hover:bg-google-blue-light"
              >
                Voir tout
              </Link>
              {hoveredMetier.filters.map((filter) => (
                <Link
                  key={`${filter.type}-${filter.slug}-${filter.label}`}
                  href={metierHref(hoveredMetier.slug, filter)}
                  onClick={() => {
                    setOpen(false);
                    setHovered(null);
                    onNavigate?.();
                  }}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-google-blue-light hover:text-google-blue transition-colors"
                >
                  {filter.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
