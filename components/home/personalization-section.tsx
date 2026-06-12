import Link from "next/link";
import { Scissors, Layers, Paintbrush } from "lucide-react";
import { personalizationMethods } from "@/lib/data/marketing";

const iconMap = { Needle: Scissors, Layers, Paintbrush };

export function PersonalizationSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold md:text-3xl">
            Tenues personnalisées avec logo
          </h2>
          <p className="mt-2 text-muted max-w-2xl mx-auto">
            Trois techniques de marquage pour donner vie à votre identité visuelle
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {personalizationMethods.map((method) => {
            const Icon = iconMap[method.icon as keyof typeof iconMap] || Scissors;
            return (
              <div
                key={method.id}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-8 transition-all hover:border-google-blue/30 hover:shadow-xl hover:shadow-google-blue/10"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-google-blue-light text-google-blue transition-all group-hover:gradient-blue group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">{method.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/personnalisation"
            className="inline-flex items-center rounded-full bg-google-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-google-blue-dark hover:shadow-lg"
          >
            En savoir plus sur la personnalisation
          </Link>
        </div>
      </div>
    </section>
  );
}
