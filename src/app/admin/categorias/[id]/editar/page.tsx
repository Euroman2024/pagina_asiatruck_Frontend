import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { CategoriaForm } from "@/components/admin/CategoriaForm";
import type { Categoria } from "@/types/catalogo";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoria = await api.get<Categoria | null>(`/categorias/${id}`);

  if (!categoria) {
    notFound();
  }

  return <CategoriaForm id={id} initial={categoria} />;
}
