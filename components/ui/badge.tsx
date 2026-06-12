import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "new" | "sale";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-google-blue-light text-google-blue-dark",
        variant === "new" && "bg-google-blue text-white",
        variant === "sale" && "bg-orange-100 text-orange-700",
        className
      )}
    >
      {children}
    </span>
  );
}
