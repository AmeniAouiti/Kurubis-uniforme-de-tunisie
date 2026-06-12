import { Mail, Phone } from "lucide-react";
import { contactInfo } from "@/lib/data/navigation";

export function ContactBar() {
  const phone = contactInfo.phones[0];
  const tel = phone.replace(/\s/g, "");

  return (
    <div className="border-b border-google-blue-100 bg-google-blue-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-xs sm:text-sm">
        <a
          href={`tel:${tel}`}
          className="flex items-center gap-1.5 font-medium text-google-blue-dark hover:text-google-blue transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          {phone}
        </a>
        <span className="hidden sm:inline text-border">|</span>
        <a
          href={`mailto:${contactInfo.email}`}
          className="flex items-center gap-1.5 font-medium text-google-blue-dark hover:text-google-blue transition-colors"
        >
          <Mail className="h-3.5 w-3.5" />
          {contactInfo.email}
        </a>
      </div>
    </div>
  );
}
