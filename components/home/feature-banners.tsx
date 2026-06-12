import Link from "next/link";
import { Flame, BookOpen, Palette } from "lucide-react";

const banners = [
  {
    title: "Tenue anti-feu",
    subtitle: "Retardateur de flamme",
    href: "/categories/anti-feu",
    icon: Flame,
    gradient: "from-google-blue-800 to-google-blue-600",
  },
  {
    title: "Catalogue 2026",
    subtitle: "Nouvelle collection",
    href: "/catalogue-2026",
    icon: BookOpen,
    gradient: "from-google-blue-700 to-google-blue",
  },
  {
    title: "Personnalisation logo",
    subtitle: "Broderie & sérigraphie",
    href: "/personnalisation",
    icon: Palette,
    gradient: "from-google-blue to-google-blue-100",
  },
];

export function FeatureBanners() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {banners.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.gradient} p-8 text-white transition-all hover:scale-[1.02] hover:shadow-xl`}
            >
              <banner.icon className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
              <p className="text-sm text-white/80">{banner.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
