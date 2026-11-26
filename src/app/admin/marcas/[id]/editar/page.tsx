import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { SimpleCrudForm } from "@/components/admin/SimpleCrudForm";
import type { Marca } from "@/types/catalogo";

export default async function EditarMarcaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const marca = await api.get<Marca | null>(`/marcas/${id}`);

  if (!marca) {
    notFound();
  }

  return <SimpleCrudForm resource="marcas" label="Marca" id={id} initialNombre={marca.nombre} />;
}
