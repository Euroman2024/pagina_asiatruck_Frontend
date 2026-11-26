import { api } from "@/lib/api";
import { SimpleEntityGrid } from "@/components/SimpleEntityGrid";
import type { Marca } from "@/types/catalogo";

export const revalidate = 60;

export default async function MarcasPage() {
  const marcas = await api.get<Marca[]>("/marcas");

  return (
    <SimpleEntityGrid
      title="Marcas"
      subtitle="Elige una marca para ver sus repuestos."
      items={marcas}
      emptyMessage="Todavía no hay marcas cargadas."
      hrefFor={(id) => `/marcas/${id}`}
    />
  );
}
