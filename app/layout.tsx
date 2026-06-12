import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — Tenues de travail professionnelles`,
  description:
    "Kurubis uniforme — Fabrication et personnalisation de vêtements de travail en Tunisie. Combinaisons, salopettes, EPI, haute visibilité et uniformes par métier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
