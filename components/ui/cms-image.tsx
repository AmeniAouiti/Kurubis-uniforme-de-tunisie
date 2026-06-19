import Image from "next/image";
import { cn } from "@/lib/utils";

function isExternal(src: string) {
  return /^https?:\/\//i.test(src);
}

export function CmsImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) return null;

  if (isExternal(src)) {
    if (fill) {
      return (
        // img natif pour Cloudinary / URLs externes (évite erreur next/image hostname)
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full", className)}
          sizes={sizes}
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
    />
  );
}
