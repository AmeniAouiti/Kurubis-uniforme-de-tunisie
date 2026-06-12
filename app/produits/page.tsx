import { redirect } from "next/navigation";

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) query.set(k, v);
  });
  const qs = query.toString();
  redirect(qs ? `/boutique?${qs}` : "/boutique");
}
