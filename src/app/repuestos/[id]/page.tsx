import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { RepuestoGallery } from "@/components/RepuestoGallery";
import { BotonComprar } from "@/components/BotonComprar";
import type { Repuesto } from "@/types/catalogo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const repuestos = await api.get<Repuesto[]>("/repuestos");
  return repuestos.map((repuesto) => ({ id: repuesto.id }));
}

async function getRepuesto(id: string): Promise<Repuesto | null> {
  return api.get<Repuesto | null>(`/repuestos/${id}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const repuesto = await getRepuesto(id);

  if (!repuesto) {
    return { title: "Repuesto no encontrado | Asiatruk" };
  }

  return {
    title: `${repuesto.nombre} | Asiatruk`,
    description:
      repuesto.descripcion ?? `Repuesto ${repuesto.nombre}, SKU ${repuesto.sku}.`,
  };
}

export default async function RepuestoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repuesto = await getRepuesto(id);

  if (!repuesto) {
    notFound();
  }

  const compatibilidad = repuesto.compatibilidad ?? [];
  // Marcas asignadas sin un modelo concreto: se muestran solo con el nombre de la marca
  const marcasSinModelo = (repuesto.marcas ?? []).filter(
    (m) => !compatibilidad.some((c) => c.modelo.marcaId === m.id),
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <RepuestoGallery images={repuesto.imagenes} nombre={repuesto.nombre} />

        <div>
          {repuesto.categoria ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{repuesto.categoria.nombre}</p>
          ) : null}
          <h1 className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {repuesto.nombre}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">SKU: {repuesto.sku}</p>

          <p className="mt-6 text-3xl font-bold text-primary">
            ${Number(repuesto.precio).toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {repuesto.stock > 0 ? `${repuesto.stock} disponibles` : "Sin stock"}
          </p>

          <div className="mt-6">
            <BotonComprar sinStock={repuesto.stock === 0} className="w-full sm:w-56" />
          </div>

          {repuesto.descripcion ? (
            <p className="mt-6 text-zinc-700 dark:text-zinc-300">{repuesto.descripcion}</p>
          ) : null}

          {compatibilidad.length > 0 || marcasSinModelo.length > 0 ? (
            <div className="mt-10">
              <h2 className="text-lg font-medium text-zinc-950 dark:text-zinc-50">
                Compatible con
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {marcasSinModelo.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-full border border-black/[.08] px-3 py-1 text-sm text-zinc-700 dark:border-white/[.145] dark:text-zinc-300"
                  >
                    {m.nombre}
                  </li>
                ))}
                {compatibilidad.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-full border border-black/[.08] px-3 py-1 text-sm text-zinc-700 dark:border-white/[.145] dark:text-zinc-300"
                  >
                    {c.modelo.marca?.nombre ? `${c.modelo.marca.nombre} ` : ""}
                    {c.modelo.nombre}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
