"use client";

import { useState, useRef } from "react";
import { CmsImage } from "@/components/ui/cms-image";
import { Upload, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function AvatarUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("type", "avatar");

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
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative h-28 w-28 rounded-full border-2 border-dashed border-border overflow-hidden hover:border-google-blue/50 transition-colors",
          uploading && "opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {value ? (
          <CmsImage src={value} alt="Avatar" fill className="object-cover" sizes="112px" />
        ) : uploading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-google-blue" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted">
            <User className="h-10 w-10 mb-1" />
            <Upload className="h-4 w-4" />
          </div>
        )}
      </button>
      <p className="text-xs text-muted text-center">Photo de profil (Cloudinary)</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
