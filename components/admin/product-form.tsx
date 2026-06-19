"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import {
  encodeMetierSelectValue,
  getMetierSelectOptions,
  METIER_NONE,
  parseMetierSelectValue,
} from "@/lib/data/metiers-config";
import { getVetementSelectOptions } from "@/lib/data/vetements-config";
import { HierarchicalSelect } from "@/components/admin/hierarchical-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload";
import { useCms } from "@/contexts/cms-context";
import { slugify } from "@/lib/cms/utils";
import { parsePrice, formatProductPrice } from "@/lib/products-utils";
import { Save, Trash2 } from "lucide-react";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { addProduct, updateProduct, deleteProduct } = useCms();
  const isEdit = !!product;

  const initialMetier = product?.metiers[0] ?? METIER_NONE;
  const initialCategory = product?.categories[0] ?? "";
  const initialSubs = product?.metierSubcategories ?? [];

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [category, setCategory] = useState(initialCategory);
  const [metier, setMetier] = useState(initialMetier);
  const [metierSubs, setMetierSubs] = useState<string[]>(initialSubs);
  const [metierSelectValue, setMetierSelectValue] = useState(() =>
    encodeMetierSelectValue(initialMetier, initialSubs, initialCategory)
  );
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [price, setPrice] = useState(
    product?.price != null ? formatProductPrice(product.price) : ""
  );
  const [isNew, setIsNew] = useState(product?.isNew ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const metierOptions = getMetierSelectOptions();
  const vetementOptions = getVetementSelectOptions().map((o) => ({
    value: o.value,
    label: o.label,
    depth: o.depth,
    selectable: !o.value.startsWith("__"),
  }));

  function handleMetierSelectChange(value: string) {
    setMetierSelectValue(value);
    const parsed = parseMetierSelectValue(value);
    setMetier(parsed.metier);

    if (parsed.subcategory) {
      setMetierSubs([parsed.subcategory]);
    } else {
      setMetierSubs([]);
    }

    if (parsed.categoryFromMetier) {
      setCategory(parsed.categoryFromMetier);
    }
  }

  function parseList(value: string) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Veuillez uploader une image produit.");
      return;
    }

    const hasMetier = metier && metier !== METIER_NONE;
    if (!hasMetier && !category) {
      setError("Choisissez au moins un métier ou une catégorie vêtement.");
      return;
    }

    setSaving(true);
    setError("");

    const payload: Product = {
      id: product?.id ?? crypto.randomUUID(),
      name,
      slug: isEdit ? product!.slug : slugify(name),
      description,
      sku,
      image,
      categories: category ? [category] : [],
      metiers: hasMetier ? [metier] : [],
      metierSubcategories: metierSubs,
      tags: parseList(tags),
      price: parsePrice(price),
      isNew,
      isBestSeller,
      rating: product?.rating ?? 4,
      reviewCount: product?.reviewCount ?? 0,
      features: product?.features,
      characteristics: product?.characteristics,
    };

    try {
      if (isEdit) await updateProduct(product.id, payload);
      else await addProduct(payload);
      router.push("/admin/produits");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur enregistrement");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product || !confirm("Supprimer cet article ?")) return;
    await deleteProduct(product.id);
    router.push("/admin/produits");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium">Nom du produit</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Référence SKU</label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Prix (TND)</label>
          <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Métier</label>
          <HierarchicalSelect
            options={metierOptions}
            value={metierSelectValue}
            onChange={handleMetierSelectChange}
            placeholder="— Choisir un métier —"
          />
          <p className="mt-1 text-xs text-muted">
            Développez un métier avec la flèche, puis choisissez un sous-type. L&apos;article apparaît sur la page du métier.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Catégorie vêtement de travail</label>
          <HierarchicalSelect
            options={vetementOptions}
            value={category}
            onChange={setCategory}
            placeholder="— Choisir une catégorie —"
          />
          <p className="mt-1 text-xs text-muted">
            Si métier et catégorie sont choisis, l&apos;article est visible dans les deux sections.
          </p>
        </div>
      </div>

      <ImageUploadField label="Photo produit (Cloudinary)" value={image} onChange={setImage} />

      <div>
        <label className="mb-1.5 block text-sm font-medium">Tags</label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="BTP, HAUTE VISIBILITÉ" />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="rounded" />
          Afficher dans Nouveautés
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="rounded" />
          Meilleure vente
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer l'article"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 ml-auto">
            <Trash2 className="h-4 w-4" />Supprimer
          </Button>
        )}
      </div>
    </form>
  );
}
