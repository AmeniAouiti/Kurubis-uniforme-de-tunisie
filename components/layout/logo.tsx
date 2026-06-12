import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl gradient-blue text-white font-bold text-xl shadow-lg shadow-google-blue/20 transition-transform group-hover:scale-105">
        K
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white border-2 border-google-blue" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <span className="block text-lg font-bold text-google-blue tracking-tight">
            {BRAND.name}
          </span>
          <span className="block text-[10px] font-medium text-muted uppercase tracking-wider">
            {BRAND.tagline}
          </span>
        </div>
      )}
    </Link>
  );
}
