import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { ModeloForm } from "@/components/admin/ModeloForm";
import type { Marca, Modelo } from "@/types/catalogo";

export default async function EditarModeloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [modelo, marcas] = await Promise.all([
    api.get<Modelo | null>(`/modelos/${id}`),
    api.get<Marca[]>("/marcas"),
  ]);

  if (!modelo) {
    notFound();
  }

  return (
    <ModeloForm marcas={marcas} id={id} initialNombre={modelo.nombre} initialMarcaId={modelo.marcaId} />
  );
}
