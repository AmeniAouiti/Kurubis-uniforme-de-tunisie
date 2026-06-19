"use client";

import Link from "next/link";
import { Scissors, Layers, Paintbrush } from "lucide-react";
import { personalizationMethods } from "@/lib/data/marketing";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const iconMap = { Needle: Scissors, Layers, Paintbrush };

export function PersonalizationSection() {
  return (
    <section className="py-20 gradient-mesh">
      <div className="mx-auto max-w-7xl px-4">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-google-blue mb-2">
            Sur mesure
          </p>
          <h2 className="text-2xl font-bold md:text-3xl tracking-tight">
            Tenues personnalisées avec logo
          </h2>
          <p className="mt-2 text-muted max-w-2xl mx-auto">
            Trois techniques de marquage pour donner vie à votre identité visuelle
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {personalizationMethods.map((method, index) => {
            const Icon = iconMap[method.icon as keyof typeof iconMap] || Scissors;
            return (
              <ScrollReveal key={method.id} delay={index * 80} direction="scale">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:border-google-blue/30 hover:shadow-xl hover:shadow-google-blue/10 hover:-translate-y-1">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-google-blue-light text-google-blue transition-all duration-300 group-hover:gradient-blue group-hover:text-white group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold">{method.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{method.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={200} className="mt-10 text-center">
          <Link
            href="/personnalisation"
            className="inline-flex items-center rounded-full bg-google-blue px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-google-blue-dark hover:shadow-lg hover:scale-[1.02]"
          >
            En savoir plus sur la personnalisation
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
