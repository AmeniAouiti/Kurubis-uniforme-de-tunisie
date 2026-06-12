"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame, Shirt, BookOpen } from "lucide-react";
import { heroSlides } from "@/lib/data/marketing";
import { cn } from "@/lib/utils";

const iconMap = { Flame, Vest: Shirt, BookOpen };

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];
  const Icon = iconMap[slide.icon as keyof typeof iconMap] || Flame;

  return (
    <section className="relative overflow-hidden">
      <div
        className={cn(
          "relative min-h-[480px] md:min-h-[560px] flex items-center bg-gradient-to-br transition-all duration-700",
          slide.gradient
        )}
      >
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <Icon className="h-4 w-4" />
              Collection professionnelle
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mb-8 text-lg text-white/85 md:text-xl">{slide.subtitle}</p>
            <Link
              href={slide.href}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-google-blue shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              {slide.cta}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <button
          onClick={() => setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
          aria-label="Slide suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current ? "w-8 bg-white" : "w-2 bg-white/40"
              )}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
