import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { RepuestosExplorer } from "@/components/RepuestosExplorer";
import { FotoProducto } from "@/components/FotoProducto";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

export const revalidate = 60;

async function getCategoria(id: string) {
  return api.get<Categoria | null>(`/categorias/${id}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const categoria = await getCategoria((await params).id);
  return { title: categoria ? `${categoria.nombre} | Asiatruk` : "Categoría no encontrada | Asiatruk" };
}

export default async function CategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categoria, repuestos, marcas, modelos] = await Promise.all([
    getCategoria(id),
    api.get<Repuesto[]>("/repuestos"),
    api.get<Marca[]>("/marcas"),
    api.get<Modelo[]>("/modelos"),
  ]);

  if (!categoria) {
    notFound();
  }

  const deLaCategoria = repuestos.filter((r) => r.categoriaId === id);
  const fondo = categoria.imagen ?? deLaCategoria.find((r) => r.imagenes[0])?.imagenes[0];

  return (
    <main className="mx-auto w-full max-w-[96rem] px-6 py-10 lg:px-10">
      <Link href="/categorias" className="text-sm font-semibold text-accent hover:text-accent-hover">
        ← Todas las categorías
      </Link>

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover">
        {fondo ? (
          <FotoProducto fondo src={fondo} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        <div className="relative px-8 py-10 sm:px-10 sm:py-14">
          <span className="mb-3 block h-1.5 w-12 rounded-full bg-accent" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{categoria.nombre}</h1>
          <p className="mt-2 max-w-2xl text-white/85">
            {categoria.descripcion ?? `Repuestos de la categoría ${categoria.nombre}.`}
          </p>
          <p className="mt-4 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
            {deLaCategoria.length} {deLaCategoria.length === 1 ? "repuesto" : "repuestos"}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <RepuestosExplorer repuestos={deLaCategoria} marcas={marcas} modelos={modelos} />
      </div>
    </main>
  );
}
