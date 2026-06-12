import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-google-blue text-white hover:bg-google-blue-dark shadow-sm hover:shadow-md",
        variant === "secondary" &&
          "bg-google-blue-light text-google-blue-dark hover:bg-google-blue-100",
        variant === "outline" &&
          "border-2 border-google-blue text-google-blue hover:bg-google-blue-light",
        variant === "ghost" &&
          "text-google-blue hover:bg-google-blue-light",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-2.5 text-sm",
        size === "lg" && "px-8 py-3.5 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
