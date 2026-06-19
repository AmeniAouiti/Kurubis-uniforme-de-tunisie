import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) return false;
  cloudinary.config({ secure: true });
  return true;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; resourceType?: "image" | "raw" }
) {
  if (!configureCloudinary()) {
    throw new Error("CLOUDINARY_URL manquant dans .env.local");
  }

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `kurubis/${options.folder}`,
        resource_type: options.resourceType || "image",
      },
      (err, result) => {
        if (err || !result) reject(err || new Error("Upload Cloudinary échoué"));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
