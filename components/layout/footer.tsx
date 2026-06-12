import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerLinks, contactInfo } from "@/lib/data/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      {/* Quote CTA */}
      <div className="gradient-blue">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Demande de devis</h2>
          <p className="mb-6 text-white/80">Recevez la liste de prix personnalisée</p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-google-blue transition-all hover:shadow-lg hover:scale-105"
          >
            Demander un devis gratuit
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-blue text-white font-bold">
                K
              </div>
              <span className="text-xl font-bold text-google-blue">Kurubis</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Fabrication et personnalisation de tenues de travail professionnelles en Tunisie.
              Qualité, sécurité et confort pour chaque métier.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-google-blue">
              Guides d&apos;achat
            </h3>
            <ul className="space-y-2">
              {footerLinks.guides.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-google-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-google-blue">
              Nos services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-google-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-google-blue">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-google-blue" />
                {contactInfo.address}
              </li>
              {contactInfo.phones.slice(0, 2).map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-muted hover:text-google-blue">
                    <Phone className="h-4 w-4 text-google-blue" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 text-sm text-muted hover:text-google-blue">
                  <Mail className="h-4 w-4 text-google-blue" />
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Kurubis — Tenues de travail en Tunisie</p>
          <div className="flex gap-4">
            {footerLinks.account.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-google-blue transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
