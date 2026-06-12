import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = "blue",
  badge,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href: string;
  accent?: "blue" | "green" | "amber" | "purple";
  badge?: number;
}) {
  const accents = {
    blue: "from-google-blue to-google-blue-600",
    green: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-orange-500",
    purple: "from-violet-500 to-purple-600",
  };

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-google-blue/30 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
            accents[accent]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-3 right-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
