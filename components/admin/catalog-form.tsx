"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogItem } from "@/lib/data/catalogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCms } from "@/contexts/cms-context";
import { slugify, generateId } from "@/lib/cms/utils";
import { Save, Trash2 } from "lucide-react";

export function CatalogForm({ catalog }: { catalog?: CatalogItem }) {
  const router = useRouter();
  const { addCatalog, updateCatalog, deleteCatalog } = useCms();
  const isEdit = !!catalog;

  const [title, setTitle] = useState(catalog?.title ?? "");
  const [subtitle, setSubtitle] = useState(catalog?.subtitle ?? "");
  const [description, setDescription] = useState(catalog?.description ?? "");
  const [image, setImage] = useState(catalog?.image ?? "");
  const [downloadSlug, setDownloadSlug] = useState(catalog?.downloadSlug ?? "");
  const [href, setHref] = useState(catalog?.href ?? "");
  const [fileName, setFileName] = useState(catalog?.fileName ?? "");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit || !downloadSlug) {
      const slug = slugify(value);
      setDownloadSlug(`catalogue-${slug}`);
      setFileName(`kurubis-${slug}.pdf`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CatalogItem = {
      id: catalog?.id ?? generateId(),
      title,
      subtitle,
      description,
      image: image || "https://images.unsplash.com/photo-1551028719?w=800&h=600&fit=crop&q=80",
      downloadSlug: downloadSlug || slugify(title),
      href: href || "/boutique",
      fileName: fileName || `kurubis-${slugify(title)}.pdf`,
    };

    if (isEdit) updateCatalog(catalog.id, payload);
    else addCatalog(payload);

    router.push("/admin/catalogues");
  }

  function handleDelete() {
    if (!catalog || !confirm("Supprimer ce catalogue ?")) return;
    deleteCatalog(catalog.id);
    router.push("/admin/catalogues");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Titre</label>
          <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Sous-titre</label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Image (URL)</label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Lien page</label>
          <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/catalogue-2026" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Slug téléchargement</label>
          <Input value={downloadSlug} onChange={(e) => setDownloadSlug(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nom du fichier PDF</label>
          <Input value={fileName} onChange={(e) => setFileName(e.target.value)} required />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit">
          <Save className="h-4 w-4" />
          {isEdit ? "Enregistrer" : "Créer le catalogue"}
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
