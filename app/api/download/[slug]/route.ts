import { downloadableCatalogs } from "@/lib/data/catalogs";
import { BRAND } from "@/lib/brand";
import { products } from "@/lib/data/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const catalog = downloadableCatalogs.find((c) => c.downloadSlug === slug);

  if (!catalog) {
    return new Response("Catalogue introuvable", { status: 404 });
  }

  const productList = products
    .slice(0, 30)
    .map((p) => `- ${p.name} (SKU: ${p.sku})`)
    .join("\n");

  const content = `${BRAND.name}
${catalog.title}
${catalog.subtitle}

${catalog.description}

---
Produits sélectionnés :
${productList}

---
Contact : kurubis.uniforme@gmail.com | +216 24 553 769
${BRAND.tagline}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${catalog.fileName}"`,
    },
  });
}
