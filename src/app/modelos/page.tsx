import Link from "next/link";
import { api } from "@/lib/api";
import type { Marca, Modelo } from "@/types/catalogo";

export const revalidate = 60;

export default async function ModelosPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string }>;
}) {
  const { marca: marcaId } = await searchParams;
  const [modelos, marcas] = await Promise.all([
    api.get<Modelo[]>("/modelos"),
    api.get<Marca[]>("/marcas"),
  ]);

  const filtrados = marcaId ? modelos.filter((m) => m.marcaId === marcaId) : modelos;
  const marcaActiva = marcas.find((m) => m.id === marcaId);

  return (
    <main className="mx-auto w-full max-w-[96rem] px-6 py-12 lg:px-10">
      {marcaActiva ? (
        <Link href="/modelos" className="text-sm font-semibold text-accent hover:text-accent-hover">
          ← Ver todos los modelos
        </Link>
      ) : null}
      <span className={`mb-2 block h-1 w-10 rounded-full bg-accent ${marcaActiva ? "mt-4" : ""}`} />
      <h1 className="text-3xl font-bold text-primary-dark">
        {marcaActiva ? `Modelos ${marcaActiva.nombre}` : "Modelos"}
      </h1>
      <p className="mt-1 text-zinc-600">
        {marcaActiva
          ? `Modelos de camiones ${marcaActiva.nombre}.`
          : "Todos los modelos de camiones con los que trabajamos."}
      </p>

      {filtrados.length === 0 ? (
        <p className="mt-8 text-zinc-600">
          No hay modelos {marcaActiva ? "de esta marca todavía" : "cargados"}.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((modelo) => (
            <li key={modelo.id} className="rounded-xl border border-black/[.08] bg-white px-5 py-4">
              {modelo.marca ? <p className="text-xs text-zinc-500">{modelo.marca.nombre}</p> : null}
              <h2 className="mt-0.5 font-semibold text-primary-dark">{modelo.nombre}</h2>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
