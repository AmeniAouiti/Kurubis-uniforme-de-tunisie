"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
  watermark,
}: {
  images: string[];
  alt: string;
  watermark?: string;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div>
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl bg-white border border-border cursor-zoom-in",
          zoomed && "fixed inset-4 z-50 aspect-auto h-[calc(100vh-2rem)] cursor-zoom-out"
        )}
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {watermark && !zoomed && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-google-blue/15 rotate-[-12deg] pointer-events-none select-none whitespace-nowrap">
            {watermark}
          </span>
        )}
        <button
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
          aria-label="Zoom"
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(!zoomed);
          }}
        >
          <ZoomIn className="h-4 w-4 text-muted" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                active === i ? "border-google-blue shadow-md" : "border-border hover:border-google-blue/50"
              )}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
