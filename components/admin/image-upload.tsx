"use client";

import { useState, useRef } from "react";
import { CmsImage } from "@/components/ui/cms-image";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImageUploadField({
  label,
  value,
  onChange,
  type = "image",
  accept = "image/*",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: "image" | "catalog";
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Upload échoué");
      return;
    }
    onChange(data.url);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div
        className={cn(
          "rounded-xl border-2 border-dashed border-border p-4 text-center cursor-pointer hover:border-google-blue/40 transition-colors",
          uploading && "opacity-60 pointer-events-none"
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {value && type === "image" ? (
          <div className="relative mx-auto h-40 w-32 overflow-hidden rounded-lg">
            <CmsImage src={value} alt="" fill className="object-cover" sizes="128px" />
          </div>
        ) : value ? (
          <p className="text-xs text-green-700 truncate">Fichier uploadé ✓</p>
        ) : (
          <div className="py-6 text-muted">
            {uploading ? (
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-google-blue" />
            ) : (
              <Upload className="h-8 w-8 mx-auto mb-2 text-google-blue" />
            )}
            <p className="text-sm">Cliquez pour uploader</p>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {value && (
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => inputRef.current?.click()}>
          Changer le fichier
        </Button>
      )}
    </div>
  );
}
