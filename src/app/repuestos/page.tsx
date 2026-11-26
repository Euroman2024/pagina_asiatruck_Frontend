import { api } from "@/lib/api";
import { RepuestosExplorer } from "@/components/RepuestosExplorer";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

export default async function RepuestosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; marca?: string; modelo?: string }>;
}) {
  const inicial = await searchParams;
  const [repuestos, categorias, marcas, modelos] = await Promise.all([
    api.get<Repuesto[]>("/repuestos"),
    api.get<Categoria[]>("/categorias"),
    api.get<Marca[]>("/marcas"),
    api.get<Modelo[]>("/modelos"),
  ]);

  return (
    <main className="mx-auto w-full max-w-[96rem] px-6 py-12 lg:px-10">
      <span className="mb-2 block h-1 w-10 rounded-full bg-accent" />
      <h1 className="text-3xl font-bold text-primary-dark">Repuestos</h1>
      <p className="mt-1 text-zinc-600">Todo nuestro catálogo. Usa los filtros para encontrar lo que buscas.</p>

      <div className="mt-8">
        <RepuestosExplorer
          // Se vuelve a montar cuando cambia la URL (p. ej. al buscar desde el header)
          key={JSON.stringify(inicial)}
          repuestos={repuestos}
          categorias={categorias}
          marcas={marcas}
          modelos={modelos}
          inicial={inicial}
        />
      </div>
    </main>
  );
}
