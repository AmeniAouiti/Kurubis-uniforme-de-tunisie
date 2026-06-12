import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-all focus:border-google-blue focus:ring-2 focus:ring-google-blue-light",
        className
      )}
      {...props}
    />
  );
}
