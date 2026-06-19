"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CatalogItem } from "@/lib/data/catalogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload";
import { useCms } from "@/contexts/cms-context";
import { slugify } from "@/lib/cms/utils";
import { Save, Trash2 } from "lucide-react";

export function CatalogForm({ catalog }: { catalog?: CatalogItem }) {
  const router = useRouter();
  const { addCatalog, updateCatalog, deleteCatalog } = useCms();
  const isEdit = !!catalog;

  const [title, setTitle] = useState(catalog?.title ?? "");
  const [subtitle, setSubtitle] = useState(catalog?.subtitle ?? "");
  const [description, setDescription] = useState(catalog?.description ?? "");
  const [image, setImage] = useState(catalog?.image ?? "");
  const [fileUrl, setFileUrl] = useState(catalog?.fileUrl ?? "");
  const [downloadSlug, setDownloadSlug] = useState(catalog?.downloadSlug ?? "");
  const [href, setHref] = useState(catalog?.href ?? "/boutique");
  const [fileName, setFileName] = useState(catalog?.fileName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit || !downloadSlug) {
      const slug = slugify(value);
      setDownloadSlug(`catalogue-${slug}`);
      setFileName(`kurubis-${slug}.pdf`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image || !fileUrl) {
      setError("Uploadez la couverture et le fichier PDF du catalogue.");
      return;
    }

    setSaving(true);
    setError("");

    const payload: CatalogItem & { fileUrl: string } = {
      id: catalog?.id ?? crypto.randomUUID(),
      title,
      subtitle,
      description,
      image,
      fileUrl,
      downloadSlug: downloadSlug || slugify(title),
      href: href || "/boutique",
      fileName: fileName || `kurubis-${slugify(title)}.pdf`,
    };

    try {
      if (isEdit) await updateCatalog(catalog.id, payload);
      else await addCatalog(payload);
      router.push("/admin/catalogues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!catalog || !confirm("Supprimer ce catalogue ?")) return;
    await deleteCatalog(catalog.id);
    router.push("/admin/catalogues");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-5">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</div>}

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

      <div className="grid gap-6 md:grid-cols-2">
        <ImageUploadField label="Couverture catalogue (image)" value={image} onChange={setImage} />
        <ImageUploadField
          label="Fichier PDF catalogue"
          value={fileUrl}
          onChange={setFileUrl}
          type="catalog"
          accept="application/pdf,image/*"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Lien page</label>
          <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/catalogue-2026" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Slug téléchargement</label>
          <Input value={downloadSlug} onChange={(e) => setDownloadSlug(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Nom du fichier PDF</label>
        <Input value={fileName} onChange={(e) => setFileName(e.target.value)} required />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer le catalogue"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={handleDelete} className="text-red-600 ml-auto">
            <Trash2 className="h-4 w-4" />Supprimer
          </Button>
        )}
      </div>
    </form>
  );
}
