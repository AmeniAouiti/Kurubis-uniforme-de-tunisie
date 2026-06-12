import { cn } from "@/lib/utils";

const variants = {
  nouveau: "bg-blue-100 text-blue-700",
  lu: "bg-gray-100 text-gray-600",
  repondu: "bg-green-100 text-green-700",
  en_cours: "bg-amber-100 text-amber-700",
  accepte: "bg-green-100 text-green-700",
  refuse: "bg-red-100 text-red-700",
  actif: "bg-green-100 text-green-700",
  inactif: "bg-gray-100 text-gray-500",
} as const;

const labels: Record<keyof typeof variants, string> = {
  nouveau: "Nouveau",
  lu: "Lu",
  repondu: "Répondu",
  en_cours: "En cours",
  accepte: "Accepté",
  refuse: "Refusé",
  actif: "Actif",
  inactif: "Inactif",
};

export function StatusBadge({
  status,
  className,
}: {
  status: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
