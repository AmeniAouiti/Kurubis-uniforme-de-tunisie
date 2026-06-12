"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/data/marketing";
import { cn } from "@/lib/utils";

const slideImages = [
  "https://images.unsplash.com/photo-1582751363-7bf2498166a1?w=1600&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618887170-653b0c0a4e3d?w=1600&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&h=700&fit=crop&q=80",
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[420px] md:min-h-[520px] flex items-center">
        {slideImages.map((img, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === current ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-google-blue-900/90 via-google-blue-800/75 to-google-blue-600/40" />
          </div>
        ))}

        <div className="relative mx-auto max-w-7xl px-4 py-16 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="mb-3 text-sm font-medium text-white/80 uppercase tracking-widest">
              Kurubis uniforme
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              Découvrez notre sélection de
              <span className="block mt-1 text-google-blue-100">{slide.title}</span>
            </h1>
            <p className="mb-8 text-base text-white/85 md:text-lg max-w-xl">
              {slide.subtitle}
            </p>
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
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
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
