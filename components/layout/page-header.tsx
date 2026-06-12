"use client";

export function PageHeader({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
}) {
  return (
    <div className="gradient-blue">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {breadcrumb && (
          <p className="mb-2 text-sm text-white/70">{breadcrumb}</p>
        )}
        <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-white/80">{description}</p>
        )}
      </div>
    </div>
  );
}
