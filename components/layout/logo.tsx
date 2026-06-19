import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/logo-kurubis.png";

export function Logo({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className="group flex shrink-0 items-center transition-opacity hover:opacity-90"
      aria-label={`${BRAND.name} — Accueil`}
    >
      <Image
        src={LOGO_SRC}
        alt={BRAND.name}
        width={compact ? 140 : 200}
        height={compact ? 56 : 80}
        className={cn(
          "object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]",
          compact ? "h-auto max-h-12 w-auto" : "h-auto max-h-16 w-auto sm:max-h-20"
        )}
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Link>
  );
}
