"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/data/marketing";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative min-h-[520px] md:min-h-[600px] overflow-hidden">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-hero-glow pointer-events-none" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-google-blue-100/20 blur-3xl animate-hero-glow pointer-events-none" style={{ animationDelay: "2s" }} />

      {heroSlides.map((slideItem, i) => (
        <div
          key={slideItem.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === current ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={slideItem.image}
            alt=""
            fill
            className="object-cover scale-110 blur-md"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-google-blue-900/92 via-google-blue-800/78 to-google-blue-700/50" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div
            className={cn(
              "relative z-10 transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <p className="mb-3 text-xs font-semibold text-white/75 uppercase tracking-[0.2em]">
              Kurubis uniforme
            </p>
            <div key={current} className="animate-fade-in-up">
              <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                Découvrez notre sélection de
                <span className="block mt-2 text-google-blue-100">{slide.title}</span>
              </h1>
              <p className="mb-8 text-base text-white/85 md:text-lg max-w-xl leading-relaxed">
                {slide.subtitle}
              </p>
            </div>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-google-blue shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-white/20"
            >
              {slide.cta}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div
            className={cn(
              "relative z-10 mx-auto w-full max-w-xl lg:max-w-none transition-all duration-700 delay-150",
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
          >
            <div className="relative h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden border border-white/25 bg-white/10 shadow-2xl shadow-black/25 transition-transform duration-500 hover:scale-[1.01]">
              {heroSlides.map((slideItem, i) => (
                <div
                  key={slideItem.id}
                  className={cn(
                    "absolute inset-0 transition-all duration-1000 ease-in-out",
                    i === current ? "opacity-100 scale-100" : "opacity-0 scale-[0.98] pointer-events-none"
                  )}
                >
                  <Image
                    src={slideItem.image}
                    alt={slideItem.imageAlt}
                    fill
                    className="object-contain object-center p-1 drop-shadow-2xl"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 90vw, 640px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110 md:h-12 md:w-12"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % heroSlides.length)}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110 md:h-12 md:w-12"
        aria-label="Slide suivant"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
