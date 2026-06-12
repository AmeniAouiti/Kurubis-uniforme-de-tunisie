import { Suspense } from "react";
import { BoutiqueClient } from "@/components/boutique/boutique-client";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: `Shop — ${BRAND.name}`,
};

export default function BoutiquePage() {
  return (
    <Suspense>
      <BoutiqueClient />
    </Suspense>
  );
}
