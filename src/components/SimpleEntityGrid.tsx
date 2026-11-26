import Link from "next/link";

interface Entity {
  id: string;
  nombre: string;
}

export function SimpleEntityGrid({
  title,
  subtitle,
  items,
  emptyMessage,
  hrefFor,
}: {
  title: string;
  subtitle?: string;
  items: Entity[];
  emptyMessage: string;
  hrefFor: (id: string) => string;
}) {
  return (
    <main className="mx-auto w-full max-w-[96rem] px-6 lg:px-10 py-12">
      <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
      <h1 className="text-3xl font-bold text-primary-dark">{title}</h1>
      {subtitle ? <p className="mt-1 text-zinc-600">{subtitle}</p> : null}

      {items.length === 0 ? (
        <p className="mt-8 text-zinc-600">{emptyMessage}</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={hrefFor(item.id)}
                className="group flex items-center justify-between rounded-xl border border-black/[.08] bg-white px-5 py-5 font-semibold text-primary-dark transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/15"
              >
                {item.nombre}
                <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
