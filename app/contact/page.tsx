import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactMapSection } from "@/components/contact/contact-map-section";
import { contactInfo } from "@/lib/data/navigation";
import { BRAND } from "@/lib/brand";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: `Contact — ${BRAND.name}`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contactez-nous"
        description="Demandez un devis ou posez-nous vos questions"
        breadcrumb="Accueil / Contact"
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold mb-6">Nos coordonnées</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-google-blue-light text-google-blue shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-muted mt-1">{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-google-blue-light text-google-blue shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Téléphone</p>
                  <div className="mt-1 space-y-1">
                    {contactInfo.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="block text-sm text-muted hover:text-google-blue"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-google-blue-light text-google-blue shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted hover:text-google-blue mt-1 block"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>

        <ContactMapSection />
      </div>
    </>
  );
}
