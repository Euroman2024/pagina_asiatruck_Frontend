import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { RepuestoForm } from "@/components/admin/RepuestoForm";
import type { Categoria, Marca, Modelo, Repuesto } from "@/types/catalogo";

export default async function EditarRepuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [repuesto, categorias, marcas, modelos] = await Promise.all([
    api.get<Repuesto | null>(`/repuestos/${id}`),
    api.get<Categoria[]>("/categorias"),
    api.get<Marca[]>("/marcas"),
    api.get<Modelo[]>("/modelos"),
  ]);

  if (!repuesto) {
    notFound();
  }

  return (
    <RepuestoForm categorias={categorias} marcas={marcas} modelos={modelos} id={id} initial={repuesto} />
  );
}
