import Link from "next/link";
import { X } from "lucide-react";
import { filterLabels } from "@/lib/product-filters";

export function ActiveFilterBar({
  activeFilter,
  resultCount,
}: {
  activeFilter?: string;
  resultCount: number;
}) {
  if (!activeFilter) return null;

  const label = filterLabels.get(activeFilter) || activeFilter;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-google-blue/20 bg-google-blue-50 px-4 py-3">
      <span className="text-sm text-muted">Filtre actif :</span>
      <span className="rounded-full bg-google-blue px-3 py-1 text-xs font-semibold text-white">
        {label}
      </span>
      <span className="text-sm text-muted">
        {resultCount} article{resultCount > 1 ? "s" : ""}
      </span>
      <Link
        href="/boutique"
        className="ml-auto flex items-center gap-1 text-sm font-medium text-google-blue hover:underline"
      >
        <X className="h-4 w-4" />
        Effacer le filtre
      </Link>
    </div>
  );
}
