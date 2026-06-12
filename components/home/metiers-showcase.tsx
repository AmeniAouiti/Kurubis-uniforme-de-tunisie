import Image from "next/image";
import Link from "next/link";
import { metiers } from "@/lib/data/categories";

const metierImages: Record<string, string> = {
  "protection-civile": "https://images.unsplash.com/photo-1582751363-7bf2498166a1?w=400&h=300&fit=crop&q=80",
  petroliers: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&q=80",
  industrie: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&q=80",
  batiment: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop&q=80",
  cuisine: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80",
  medicales: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop&q=80",
  "btp-chantiers": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop&q=80",
  metal: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop&q=80",
  installateurs: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&q=80",
  automobile: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&q=80",
  bois: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop&q=80",
  "espace-vert": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80",
  logistique: "https://images.unsplash.com/photo-1601584115197-04ab0a911b61?w=400&h=300&fit=crop&q=80",
};

export function MetiersShowcase() {
  return (
    <section className="py-0">
      <div className="gradient-blue py-5">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wide">
            À chaque métier sa tenue de travail
          </h2>
        </div>
      </div>
      <div className="bg-surface py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metiers.map((metier) => (
              <Link
                key={metier.slug}
                href={`/metiers/${metier.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:border-google-blue/30 hover:shadow-lg hover:shadow-google-blue/10 hover:-translate-y-0.5"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-visible">
                  <div className="absolute inset-0 rotate-[-6deg] overflow-hidden rounded-xl shadow-md transition-transform group-hover:rotate-0 group-hover:scale-105">
                    <Image
                      src={metierImages[metier.slug] || metierImages.industrie}
                      alt={metier.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
                <span className="flex-1 text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-google-blue transition-colors">
                  {metier.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
