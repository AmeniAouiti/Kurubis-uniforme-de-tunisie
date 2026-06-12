"use client";

import { LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "default" | "name-asc" | "name-desc" | "newest";

interface ShopToolbarProps {
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  perPage: number;
  onPerPageChange: (n: number) => void;
  total: number;
  from: number;
  to: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function ShopToolbar({
  view,
  onViewChange,
  sort,
  onSortChange,
  perPage,
  onPerPageChange,
  total,
  from,
  to,
  page,
  totalPages,
  onPageChange,
}: ShopToolbarProps) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border bg-white p-0.5">
            <button
              onClick={() => onViewChange("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                view === "grid" ? "bg-google-blue text-white" : "text-muted hover:text-google-blue"
              )}
              aria-label="Vue grille"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                view === "list" ? "bg-google-blue text-white" : "text-muted hover:text-google-blue"
              )}
              aria-label="Vue liste"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-google-blue"
          >
            <option value="default">Tri par défaut</option>
            <option value="name-asc">Nom A → Z</option>
            <option value="name-desc">Nom Z → A</option>
            <option value="newest">Nouveautés</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-google-blue"
          >
            <option value={8}>Afficher 8</option>
            <option value={16}>Afficher 16</option>
            <option value={24}>Afficher 24</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted">
          <span>
            Affichage de {from}–{to} sur {total} résultat{total > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white disabled:opacity-40 hover:border-google-blue transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white disabled:opacity-40 hover:border-google-blue transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
