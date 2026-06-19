"use client";

import Image from "next/image";
import Link from "next/link";
import { metiers } from "@/lib/data/categories";
import { metierImages } from "@/lib/data/metier-images";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function MetiersShowcase() {
  return (
    <section className="py-0">
      <div className="relative overflow-hidden gradient-blue py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75 mb-1">
            Secteurs d&apos;activité
          </p>
          <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">
            À chaque métier sa tenue de travail
          </h2>
        </div>
      </div>
      <div className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metiers.map((metier, index) => (
              <ScrollReveal key={metier.slug} delay={index * 50} direction="up">
                <Link
                  href={`/metiers/${metier.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-4 transition-all duration-300 hover:border-google-blue/30 hover:shadow-lg hover:shadow-google-blue/10 hover:-translate-y-1"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-visible">
                    <div className="absolute inset-0 rotate-[-6deg] overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
                      <Image
                        src={metierImages[metier.slug] ?? metierImages.industrie}
                        alt={metier.name}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        sizes="96px"
                      />
                    </div>
                  </div>
                  <span className="flex-1 text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-google-blue transition-colors">
                    {metier.name}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
