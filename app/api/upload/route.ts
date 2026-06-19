import { NextResponse } from "next/server";
import { getAuthUser, getProfile } from "@/lib/supabase/db";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  const type = (form.get("type") as string) || "image";

  const profile = await getProfile(user.id);
  const isAdmin = profile?.role === "admin";

  if (type !== "avatar" && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  if (!file) return NextResponse.json({ error: "Fichier requis" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder =
    type === "catalog" ? "catalogs" : type === "avatar" ? "avatars" : "products";
  const resourceType = type === "catalog" ? "raw" : "image";

  try {
    const result = await uploadToCloudinary(buffer, { folder, resourceType });
    return NextResponse.json({ url: result.url, publicId: result.publicId });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
