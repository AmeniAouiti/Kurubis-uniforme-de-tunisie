"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { CategoryMultiSelect } from "@/components/admin/category-multi-select";
import { MetierMultiSelect } from "@/components/admin/metier-multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload";
import { useCms } from "@/contexts/cms-context";
import { slugify } from "@/lib/cms/utils";
import { Save, Trash2 } from "lucide-react";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { addProduct, updateProduct, deleteProduct } = useCms();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [categories, setCategories] = useState<string[]>(product?.categories ?? []);
  const [metiers, setMetiers] = useState<string[]>(product?.metiers ?? []);
  const [metierSubs, setMetierSubs] = useState<string[]>(product?.metierSubcategories ?? []);
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [isNew, setIsNew] = useState(product?.isNew ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function parseList(value: string) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setError("Veuillez uploader une image produit.");
      return;
    }

    if (metiers.length === 0 && categories.length === 0) {
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
      categories,
      metiers,
      metierSubcategories: metierSubs,
      tags: parseList(tags),
      isNew,
      isBestSeller,
      isVisible: product?.isVisible !== false,
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

      <div>
        <label className="mb-1.5 block text-sm font-medium">Référence SKU</label>
        <Input value={sku} onChange={(e) => setSku(e.target.value)} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Métiers</label>
          <MetierMultiSelect
            metiers={metiers}
            metierSubcategories={metierSubs}
            categories={categories}
            onMetiersChange={setMetiers}
            onMetierSubsChange={setMetierSubs}
            onCategoriesChange={setCategories}
          />
          <p className="mt-1 text-xs text-muted">
            Plusieurs métiers possibles. L&apos;article apparaît sur chaque page métier choisie.
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Catégories vêtement</label>
          <CategoryMultiSelect value={categories} onChange={setCategories} />
          <p className="mt-1 text-xs text-muted">
            Plusieurs catégories possibles. L&apos;article apparaît dans chaque catégorie choisie.
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
