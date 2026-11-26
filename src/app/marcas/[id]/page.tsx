import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "@/lib/api";
import { esDeMarca } from "@/lib/catalogo";
import { RepuestosExplorer } from "@/components/RepuestosExplorer";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

export const revalidate = 60;

async function getMarca(id: string) {
  const marcas = await api.get<Marca[]>("/marcas");
  return marcas.find((m) => m.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const marca = await getMarca((await params).id);
  return { title: marca ? `Repuestos ${marca.nombre} | Asiatruk` : "Marca no encontrada | Asiatruk" };
}

export default async function MarcaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [marca, repuestos, categorias, modelos] = await Promise.all([
    getMarca(id),
    api.get<Repuesto[]>("/repuestos"),
    api.get<Categoria[]>("/categorias"),
    api.get<Modelo[]>("/modelos"),
  ]);

  if (!marca) {
    notFound();
  }

  const deLaMarca = repuestos.filter((r) => esDeMarca(r, id));
  // El filtro de modelo solo ofrece los modelos de esta marca
  const modelosDeLaMarca = modelos.filter((m) => m.marcaId === id);

  return (
    <main className="mx-auto w-full max-w-[96rem] px-6 py-6 lg:px-10">
      <Link href="/marcas" className="text-sm font-semibold text-accent hover:text-accent-hover">
        ← Todas las marcas
      </Link>
      <div className="mt-2 flex items-center gap-3 border-b border-black/[.08] pb-4">
        <span className="h-8 w-1.5 rounded-full bg-accent" aria-hidden />
        <h1 className="text-3xl font-bold text-primary-dark">Repuestos {marca.nombre}</h1>
      </div>

      <div className="mt-6">
        <RepuestosExplorer repuestos={deLaMarca} categorias={categorias} modelos={modelosDeLaMarca} />
      </div>
    </main>
  );
}
