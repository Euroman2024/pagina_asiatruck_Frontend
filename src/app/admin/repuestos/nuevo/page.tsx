import { api } from "@/lib/api";
import { RepuestoForm } from "@/components/admin/RepuestoForm";
import type { Categoria, Marca, Modelo } from "@/types/catalogo";

export const dynamic = "force-dynamic";

export default async function NuevoRepuestoPage() {
  const [categorias, marcas, modelos] = await Promise.all([
    api.get<Categoria[]>("/categorias"),
    api.get<Marca[]>("/marcas"),
    api.get<Modelo[]>("/modelos"),
  ]);
  return <RepuestoForm categorias={categorias} marcas={marcas} modelos={modelos} />;
}
