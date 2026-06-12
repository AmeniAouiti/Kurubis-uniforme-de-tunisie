import { clientReferences } from "@/lib/data/marketing";

export function ClientReferences() {
  return (
    <section className="py-16 bg-google-blue-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold md:text-3xl">Nos références clients</h2>
          <p className="mt-2 text-muted">
            Ils nous font confiance pour leurs tenues professionnelles
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {clientReferences.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-center rounded-xl border border-border bg-white px-4 py-6 text-center transition-all hover:border-google-blue/30 hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
