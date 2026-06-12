"use client";

import dynamic from "next/dynamic";
import { contactInfo } from "@/lib/data/navigation";
import { Navigation } from "lucide-react";

const ContactMap = dynamic(
  () =>
    import("@/components/contact/contact-map").then((mod) => mod.ContactMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full animate-pulse rounded-2xl bg-google-blue-50 border border-border" />
    ),
  }
);

export function ContactMapSection() {
  const { lat, lng } = contactInfo.coordinates;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <section className="mt-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Notre localisation</h2>
          <p className="mt-1 text-sm text-muted">{contactInfo.address}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-google-blue px-5 py-2.5 text-sm font-medium text-white hover:bg-google-blue-dark transition-colors"
        >
          <Navigation className="h-4 w-4" />
          Itinéraire
        </a>
      </div>
      <ContactMap
        lat={lat}
        lng={lng}
        label={contactInfo.mapLabel}
        address={contactInfo.address}
      />
    </section>
  );
}
