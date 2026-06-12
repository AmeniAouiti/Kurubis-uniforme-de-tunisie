"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCms } from "@/contexts/cms-context";
import { slugify, generateId } from "@/lib/cms/utils";
import { Save, Trash2 } from "lucide-react";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { addProduct, updateProduct, deleteProduct } = useCms();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [categories, setCategories] = useState(product?.categories.join(", ") ?? "");
  const [metiers, setMetiers] = useState(product?.metiers.join(", ") ?? "");
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);

  function handleNameChange(value: string) {
    setName(value);
    if (!isEdit || !slug) setSlug(slugify(value));
  }

  function parseList(value: string) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Product = {
      id: product?.id ?? generateId(),
      name,
      slug: slug || slugify(name),
      description,
      sku,
      image: image || "https://images.unsplash.com/photo-1581092439?w=600&h=700&fit=crop&q=80",
      categories: parseList(categories),
      metiers: parseList(metiers),
      tags: parseList(tags),
      price: price ? Number(price) : undefined,
      isNew,
      isBestSeller,
      rating: product?.rating ?? 4,
      reviewCount: product?.reviewCount ?? 0,
      features: product?.features,
      characteristics: product?.characteristics,
    };

    if (isEdit) updateProduct(product.id, payload);
    else addProduct(payload);

    router.push("/admin/produits");
  }

  function handleDelete() {
    if (!product || !confirm("Supprimer cet article ?")) return;
    deleteProduct(product.id);
    router.push("/admin/produits");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nom du produit</label>
          <Input value={name} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Slug (URL)</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Référence SKU</label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Prix (TND)</label>
          <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Image (URL)</label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Catégories (séparées par virgule)</label>
          <Input value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="combinaisons, polo" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Métiers (slugs)</label>
          <Input value={metiers} onChange={(e) => setMetiers(e.target.value)} placeholder="industrie, batiment" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="BTP, INDUSTRIE" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="rounded" />
          Nouveauté
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="rounded" />
          Meilleure vente
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit">
          <Save className="h-4 w-4" />
          {isEdit ? "Enregistrer" : "Créer l'article"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 ml-auto">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        )}
      </div>
    </form>
  );
}
