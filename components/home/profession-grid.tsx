import Link from "next/link";
import {
  Shield,
  Flame,
  Factory,
  Building2,
  ChefHat,
  HeartPulse,
  HardHat,
  Wrench,
  Plug,
  Car,
  TreePine,
  Leaf,
  Truck,
} from "lucide-react";
import { metiers } from "@/lib/data/categories";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Flame,
  Factory,
  Building2,
  ChefHat,
  HeartPulse,
  HardHat,
  Wrench,
  Plug,
  Car,
  TreePine,
  Leaf,
  Truck,
};

export function ProfessionGrid() {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold md:text-3xl">
            À chaque métier sa tenue de travail
          </h2>
          <p className="mt-2 text-muted">
            Des équipements adaptés à votre secteur d&apos;activité
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {metiers.map((metier) => {
            const Icon = iconMap[metier.icon] || Factory;
            return (
              <Link
                key={metier.slug}
                href={`/metiers/${metier.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:border-google-blue/30 hover:shadow-lg hover:shadow-google-blue/10 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-google-blue-light text-google-blue transition-all group-hover:gradient-blue group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-center text-sm font-medium text-foreground group-hover:text-google-blue">
                  {metier.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
