"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ContactMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

export function ContactMap({ lat, lng, label, address }: ContactMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
    }).setView([lat, lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:system-ui,sans-serif;line-height:1.5">
          <strong style="color:#1a73e8">${label}</strong><br/>
          <span style="color:#5f6368;font-size:13px">${address}</span>
        </div>`
      )
      .openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label, address]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-2xl border border-border overflow-hidden shadow-sm z-0"
      aria-label="Carte de localisation"
    />
  );
}
